import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationResType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model'
import {
  CreateProductTranslationBodyType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model'

@Injectable()
export class ProductTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<ProductTranslationType | null> {
    return this.prisma.productTranslation.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  async create({
    createdById,
    data,
  }: {
    createdById: number
    data: CreateProductTranslationBodyType
  }): Promise<ProductTranslationType> {
    return this.prisma.productTranslation.create({
      data: {
        ...data,
        createdById,
      },
    })
  }
  async update({
    id,
    updatedById,
    data,
  }: {
    id: number
    updatedById: number
    data: UpdateProductTranslationBodyType
  }): Promise<ProductTranslationType> {
    return this.prisma.productTranslation.update({
      where: { id },
      data: { ...data, updatedById },
    })
  }
  async delete(id: number, isHardDelete?: boolean): Promise<ProductTranslationType> {
    if (isHardDelete) {
      return this.prisma.productTranslation.delete({ where: { id } })
    }
    return this.prisma.productTranslation.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}
