import { Injectable } from '@nestjs/common'
import {
  BrandIncludeTranslationType,
  BrandType,
  CreateBrandBodyType,
  GetBrandResType,
  UpdateBrandBodyType,
} from 'src/routes/brand/brand.model'
import { ALL_LANGUAGE } from 'src/shared/constants/orther.constant'
import { PaginationType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class BrandRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationType, languageId: string): Promise<GetBrandResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItems, data] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          translations: {
            where: languageId == ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
    ])
    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.limit),
      page: pagination.page,
      limit: pagination.limit,
    }
  }
  async getById(id: number, languageId: string): Promise<BrandIncludeTranslationType | null> {
    return await this.prismaService.brand.findUnique({
      where: { id, deletedAt: null },
      include: {
        translations: {
          where: languageId == ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
      },
    })
  }
  async create({
    createdById,
    data,
  }: {
    createdById: number | null
    data: CreateBrandBodyType
  }): Promise<BrandIncludeTranslationType> {
    return await this.prismaService.brand.create({
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
  async update({
    id,
    updatedById,
    data,
  }: {
    id: number
    updatedById: number | null
    data: UpdateBrandBodyType
  }): Promise<BrandIncludeTranslationType> {
    return await this.prismaService.brand.update({
      where: { id, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
      include: {
        translations: {
          where: { deletedAt: null },
        },
      },
    })
  }
  delete({ id, isHardDelete }: { id: number; isHardDelete?: boolean }): Promise<BrandType> {
    if (isHardDelete) {
      return this.prismaService.brand.delete({ where: { id, deletedAt: null } })
    }
    return this.prismaService.brand.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } })
  }
}
