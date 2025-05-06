import { Injectable, NotFoundException } from '@nestjs/common'
import { BrandRepo } from './brand.repo'
import { PaginationType } from 'src/shared/models/request.model'
import { BrandAlreadyExistsException, BrandNotFoundException } from 'src/routes/brand/brand.erorr'
import { CreateBrandBodyType, UpdateBrandBodyType } from 'src/routes/brand/brand.model'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepo) {}

  async list(pagination: PaginationType) {
    const data = await this.brandRepository.list(pagination)
    return data
  }

  async getById(id: number) {
    const data = await this.brandRepository.getById(id)
    if (!data) {
      throw BrandNotFoundException
    }
    return data
  }

  async create({ createdById, data }: { createdById: number; data: CreateBrandBodyType }) {
    return this.brandRepository.create({ createdById, data })
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateBrandBodyType }) {
    try {
      const brand = await this.brandRepository.update({ id, updatedById, data })

      return brand
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandNotFoundException
      }
      throw error
    }
  }

  async delete(id: number) {
    try {
      await this.brandRepository.delete({ id })
      return { message: 'Brand deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandNotFoundException
      }
      throw error
    }
  }
}
