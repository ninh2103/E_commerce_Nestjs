import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  GetBrandTranslationResType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model'

@Injectable()
export class BrandTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<GetBrandTranslationResType | null> {
    return this.prisma.brandTranslation.findUnique({
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
    data: CreateBrandTranslationBodyType
  }): Promise<BrandTranslationType> {
    return this.prisma.brandTranslation.create({
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
    data: UpdateBrandTranslationBodyType
  }): Promise<BrandTranslationType> {
    return this.prisma.brandTranslation.update({
      where: { id },
      data: { ...data, updatedById },
    })
  }
  async delete(id: number, isHardDelete?: boolean): Promise<BrandTranslationType> {
    if (isHardDelete) {
      return this.prisma.brandTranslation.delete({ where: { id } })
    }
    return this.prisma.brandTranslation.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}
