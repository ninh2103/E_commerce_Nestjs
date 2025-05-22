import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
  ProductType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model'
import { ALL_LANGUAGE } from 'src/shared/constants/orther.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: GetProductsQueryType, languageId: string): Promise<GetProductsResType> {
    const skip = (query.page - 1) * query.limit
    const take = query.limit

    const [totalItems, data] = await this.prisma.$transaction([
      this.prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prisma.product.findMany({
        where: {
          deletedAt: null,
        },

        include: {
          translations: {
            where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
    ])

    return {
      totalItems,
      data: data.map((product) => ({
        ...product,
        variants: Array.isArray(product.variants) ? product.variants : [product.variants],
      })),
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(totalItems / query.limit),
    }
  }
  async findById(id: number, languageId: string): Promise<GetProductDetailResType> {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        translations: {
          where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            translations: {
              where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
            },
          },
        },
        brand: {
          include: {
            translations: {
              where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
            },
          },
        },
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }
  async delete(id: number, isHardDelete?: boolean): Promise<ProductType> {
    if (isHardDelete) {
      const [product] = await Promise.all([
        this.prisma.product.delete({
          where: { id },
        }),
        this.prisma.sKU.deleteMany({
          where: { productId: id },
        }),
      ])
      return {
        ...product,
        variants: Array.isArray(product.variants) ? product.variants : [product.variants],
      }
    }
    const [product] = await Promise.all([
      this.prisma.product.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
      this.prisma.sKU.updateMany({
        where: { productId: id, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
    ])
    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }

  async create({
    data,
    createdById,
  }: {
    data: CreateProductBodyType
    createdById: number
  }): Promise<GetProductDetailResType> {
    const { skus, categories, variants, ...productData } = data
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        variants: variants as any,
        createdById,
        categories: {
          connect: categories.map((category) => ({ id: category })),
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById,
            })),
          },
        },
      },
      include: {
        translations: {
          where: { deletedAt: null },
        },
        skus: {
          where: { deletedAt: null },
        },
        categories: {
          where: { deletedAt: null },
          include: {
            translations: {
              where: { deletedAt: null },
            },
          },
        },
        brand: {
          include: {
            translations: {
              where: { deletedAt: null },
            },
          },
        },
      },
    })
    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }

  async update({
    id,
    data,
    updatedById,
  }: {
    id: number
    data: UpdateProductBodyType
    updatedById: number
  }): Promise<ProductType> {
    const { skus: dataSkus, categories, variants, ...productData } = data

    const existingSkus = await this.prisma.sKU.findMany({
      where: { productId: id, deletedAt: null },
    })
    const skusToDelete = existingSkus.filter((sku) => dataSkus.every((dataSku) => dataSku.value !== sku.value))

    const skuIdsToDelete = skusToDelete.map((sku) => sku.id)

    const skusWithId = dataSkus.map((sku) => {
      const existingSku = existingSkus.find((s) => s.value === sku.value)
      return {
        ...sku,
        id: existingSku ? existingSku.id : null,
      }
    })

    const skusToUpdate = skusWithId.filter((sku) => sku.id !== null)

    const skusToCreate = skusWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        const { id: skuId, ...data } = sku
        return {
          ...data,
          productId: id,
        }
      })

    const [product] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id, deletedAt: null },
        data: {
          ...productData,
          updatedById,
          categories: {
            connect: categories.map((category) => ({ id: category })),
          },
        },
      }),
      this.prisma.sKU.updateMany({
        where: {
          id: {
            in: skuIdsToDelete,
          },
        },
        data: { deletedAt: new Date() },
      }),

      ...skusToUpdate.map((sku) =>
        this.prisma.sKU.update({
          where: { id: sku.id as number },
          data: {
            value: sku.value,
            price: sku.price,
            stock: sku.stock,
            image: sku.image,
            updatedById,
          },
        }),
      ),
      this.prisma.sKU.createMany({
        data: skusToCreate.map((sku) => ({
          ...sku,
          createdById: updatedById,
        })),
      }),
    ])

    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }
}
