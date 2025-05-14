import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from 'src/routes/category/category.model'
import { CategoryNotFoundException, CategoryAlreadyExistsException } from 'src/routes/category/category.error'
import { CategoryIncludeTranslationType } from 'src/routes/category/category.model'
import { GetAllCategoriesResType } from 'src/routes/category/category.model'
import { CategoryRepo } from 'src/routes/category/category.repo'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { I18nContext } from 'nestjs-i18n'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async getAllCategories(parentCategoryId: number | null) {
    return this.categoryRepo.getAllCategories(parentCategoryId, I18nContext.current()?.lang as string)
  }
  async getCategoryById(id: number) {
    const category = await this.categoryRepo.getCategoryById(id, I18nContext.current()?.lang as string)
    if (!category) {
      throw CategoryNotFoundException
    }
    return category
  }
  async createCategory({ createdById, data }: { createdById: number; data: CreateCategoryBodyType }) {
    return this.categoryRepo.createCategory({ createdById, data })
  }
  async updateCategory({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateCategoryBodyType }) {
    try {
      return this.categoryRepo.updateCategory({ id, updatedById, data })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException
      }
      throw error
    }
  }
  async deleteCategory({ id }: { id: number }) {
    try {
      await this.categoryRepo.deleteCategory({ id })
      return { message: 'Category deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException
      }
      throw error
    }
  }
}
