import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationResType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model'

@Injectable()
export class CategoryTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<CategoryTranslationType | null> {
    return this.prisma.categoryTranslation.findUnique({
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
    data: CreateCategoryTranslationBodyType
  }): Promise<CategoryTranslationType> {
    return this.prisma.categoryTranslation.create({
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
    data: UpdateCategoryTranslationBodyType
  }): Promise<CategoryTranslationType> {
    return this.prisma.categoryTranslation.update({
      where: { id },
      data: { ...data, updatedById },
    })
  }
  async delete(id: number, isHardDelete?: boolean): Promise<CategoryTranslationType> {
    if (isHardDelete) {
      return this.prisma.categoryTranslation.delete({ where: { id } })
    }
    return this.prisma.categoryTranslation.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}
