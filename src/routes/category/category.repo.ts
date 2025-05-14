import { Injectable } from '@nestjs/common'
import {
  CategoryIncludeTranslationType,
  CategoryType,
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.model'
import { ALL_LANGUAGE } from 'src/shared/constants/orther.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class CategoryRepo {
  constructor(private prisma: PrismaService) {}
  async getAllCategories(parentCategoryId: number | null, languageId: string): Promise<GetAllCategoriesResType> {
    const categories = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
        parentCategoryId: parentCategoryId,
      },
      include: {
        translations: {
          where: languageId == ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return {
      data: categories,
      totalItems: categories.length,
    }
  }
  async getCategoryById(id: number, languageId: string): Promise<CategoryIncludeTranslationType | null> {
    return await this.prisma.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        translations: {
          where: languageId == ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
      },
    })
  }
  async createCategory({
    createdById,
    data,
  }: {
    createdById: number
    data: CreateCategoryBodyType
  }): Promise<CategoryIncludeTranslationType> {
    return await this.prisma.category.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        translations: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }
  async updateCategory({
    id,
    updatedById,
    data,
  }: {
    id: number
    updatedById: number
    data: UpdateCategoryBodyType
  }): Promise<CategoryIncludeTranslationType> {
    return await this.prisma.category.update({
      where: { id },
      data: { ...data, updatedById },
      include: {
        translations: {
          where: { deletedAt: null },
        },
      },
    })
  }
  async deleteCategory({ id, isHardDelete }: { id: number; isHardDelete?: boolean }): Promise<CategoryType> {
    if (isHardDelete) {
      return this.prisma.category.delete({ where: { id, deletedAt: null } })
    }
    return this.prisma.category.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } })
  }
}
