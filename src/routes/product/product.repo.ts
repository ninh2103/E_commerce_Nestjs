import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsResType,
  ProductType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model'
import {
  ALL_LANGUAGE,
  ProductOrderByType,
  ProductSortBy,
  ProductSortByType,
} from 'src/shared/constants/orther.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  async list({
    limit,
    page,
    minPrice,
    maxPrice,
    name,
    categories,
    brandIds,
    isPublic,
    createdById,
    languageId,
    orderBy,
    sortBy,
  }: {
    limit: number
    page: number
    minPrice?: number
    maxPrice?: number
    name?: string
    categories?: number[]
    brandIds?: number[]
    isPublic?: boolean
    createdById?: number
    languageId: string
    orderBy: ProductOrderByType
    sortBy: ProductSortByType
  }): Promise<GetProductsResType> {
    const skip = (page - 1) * limit
    const take = limit
    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdById: createdById ? createdById : undefined,
    }

    if (isPublic === true) {
      where.publishAt = { lte: new Date(), not: null }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishAt: null }, { publishAt: { gt: new Date() } }],
      }
    }
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      }
    }
    if (brandIds && brandIds.length > 0) {
      where.brandId = {
        in: brandIds,
      }
    }
    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: { in: categories },
        },
      }
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        gte: minPrice,
        lte: maxPrice,
      }
    }
    let caculateOrderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: orderBy,
    }
    if (sortBy === ProductSortBy.PRICE) {
      caculateOrderBy = {
        basePrice: orderBy,
      }
    } else if (sortBy === ProductSortBy.SALE) {
      caculateOrderBy = {
        orders: {
          _count: orderBy,
        },
      }
    }

    const [totalItems, data] = await this.prisma.$transaction([
      this.prisma.product.count({
        where,
      }),
      this.prisma.product.findMany({
        where,
        include: {
          translations: {
            where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
          },
          orders: {
            where: {
              deletedAt: null,
              status: 'DELIVERED',
            },
          },
        },
        orderBy: caculateOrderBy,
        skip,
        take,
      }),
    ])

    return {
      data: data.map((product) => ({
        ...product,
        variants: Array.isArray(product.variants) ? product.variants : [product.variants],
      })),
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }
  async findById(productId: number): Promise<ProductType | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
      include: {
        translations: {
          where: { deletedAt: null },
        },
      },
    })
    if (!product) {
      throw ProductNotFoundException
    }
    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }

  async getDetail({
    productId,
    languageId,
    isPublic,
  }: {
    productId: number
    languageId: string
    isPublic?: boolean
  }): Promise<GetProductDetailResType> {
    let where: Prisma.ProductWhereUniqueInput = {
      id: productId,
      deletedAt: null,
    }

    if (isPublic === true) {
      where.publishAt = { lte: new Date(), not: null }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishAt: null }, { publishAt: { gt: new Date() } }],
      }
    }
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null, publishAt: isPublic ? { lte: new Date(), not: null } : undefined },
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
      throw ProductNotFoundException
    }

    return {
      ...product,
      variants: Array.isArray(product.variants) ? product.variants : [product.variants],
    }
  }
  async delete(id: number, isHardDelete?: boolean): Promise<ProductType> {
    if (isHardDelete) {
      const product = await this.prisma.product.delete({
        where: { id },
      })
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

      this.prisma.productTranslation.updateMany({
        where: { productId: id, deletedAt: null },
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
