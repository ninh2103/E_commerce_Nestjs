import { Injectable } from '@nestjs/common'
import { CategoryTranslationRepo } from './category-translation.repo'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
  GetCategoryTranslationResType,
} from 'src/routes/category/category-translation/category-translation.model'
import { CategoryTranslationNotFoundException } from 'src/routes/category/category-translation/category-translation.error'

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepo: CategoryTranslationRepo) {}

  async create({
    createdById,
    data,
  }: {
    createdById: number
    data: CreateCategoryTranslationBodyType
  }): Promise<CategoryTranslationType> {
    return this.categoryTranslationRepo.create({ createdById, data })
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
    try {
      const categoryTranslation = await this.categoryTranslationRepo.update({ id, updatedById, data })

      return categoryTranslation
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryTranslationNotFoundException
      }
      throw error
    }
  }

  async delete(id: number, isHardDelete?: boolean): Promise<{ message: string }> {
    try {
      await this.categoryTranslationRepo.delete(id, isHardDelete)
      return { message: 'Category translation deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryTranslationNotFoundException
      }
      throw error
    }
  }

  async findById(id: number): Promise<CategoryTranslationType | null> {
    const data = await this.categoryTranslationRepo.findById(id)
    if (!data) {
      throw CategoryTranslationNotFoundException
    }
    return data
  }
}
