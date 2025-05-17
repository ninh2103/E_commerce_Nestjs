import { Injectable } from '@nestjs/common'
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  GetBrandTranslationResType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model'
import { BrandTranslationRepo } from './brand-translation.repo'
import { BrandTranslationNotFoundException } from 'src/routes/brand/brand-translation/brand-translation.error'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepo: BrandTranslationRepo) {}

  async create({
    createdById,
    data,
  }: {
    createdById: number
    data: CreateBrandTranslationBodyType
  }): Promise<BrandTranslationType> {
    return this.brandTranslationRepo.create({ createdById, data })
  }

  async update({
    id,
    updatedById,
    data,
  }: {
    id: number
    updatedById: number
    data: UpdateBrandTranslationBodyType
  }): Promise<BrandTranslationType> {
    try {
      const brandTranslation = await this.brandTranslationRepo.update({ id, updatedById, data })

      return brandTranslation
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandTranslationNotFoundException
      }
      throw error
    }
  }

  async delete(id: number, isHardDelete?: boolean): Promise<{ message: string }> {
    try {
      await this.brandTranslationRepo.delete(id, isHardDelete)
      return { message: 'Brand translation deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandTranslationNotFoundException
      }
      throw error
    }
  }

  async findById(id: number): Promise<GetBrandTranslationResType | null> {
    const data = await this.brandTranslationRepo.findById(id)
    if (!data) {
      throw BrandTranslationNotFoundException
    }
    return data
  }
}
