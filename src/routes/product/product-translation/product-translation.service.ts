import { Injectable } from '@nestjs/common'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import {
  CreateProductTranslationBodyType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model'
import { ProductTranslationRepo } from 'src/routes/product/product-translation/product-translation.repo'
import { ProductTranslationNotFoundException } from 'src/routes/product/product-translation/product-translation.error'

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepo: ProductTranslationRepo) {}

  async create({
    createdById,
    data,
  }: {
    createdById: number
    data: CreateProductTranslationBodyType
  }): Promise<ProductTranslationType> {
    return this.productTranslationRepo.create({ createdById, data })
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
    try {
      const productTranslation = await this.productTranslationRepo.update({ id, updatedById, data })

      return productTranslation
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException
      }
      throw error
    }
  }

  async delete(id: number, isHardDelete?: boolean): Promise<{ message: string }> {
    try {
      await this.productTranslationRepo.delete(id, isHardDelete)
      return { message: 'Product translation deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException
      }
      throw error
    }
  }

  async findById(id: number): Promise<ProductTranslationType | null> {
    const data = await this.productTranslationRepo.findById(id)
    if (!data) {
      throw ProductTranslationNotFoundException
    }
    return data
  }
}
