import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import { CreateProductBodyType, GetProductsQueryType, UpdateProductBodyType } from 'src/routes/product/product.model'
import { ProductRepo } from 'src/routes/product/product.repo'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async list(query: GetProductsQueryType) {
    const products = await this.productRepo.list(query, I18nContext.current()?.lang as string)
    return products
  }

  async findById(id: number) {
    const product = await this.productRepo.findById(id, I18nContext.current()?.lang as string)
    return product
  }

  async create({ createdById, data }: { createdById: number; data: CreateProductBodyType }) {
    return await this.productRepo.create({ createdById, data })
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateProductBodyType }) {
    try {
      const product = await this.productRepo.update({ id, updatedById, data })
      return product
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }

  async delete(id: number) {
    try {
      await this.productRepo.delete(id)
      return { message: 'Product deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }
}
