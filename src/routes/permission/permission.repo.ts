import { Injectable } from '@nestjs/common'
import {
  CreatePermissionBodyType,
  GetPermissionResType,
  PermissionQueryType,
  PermissionType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class PermissionRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PermissionQueryType): Promise<GetPermissionResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [total, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ])

    return {
      data,
      totalItems: total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    }
  }

  findById(id: number): Promise<PermissionType | null> {
    return this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({
    data,
    createdById,
  }: {
    data: CreatePermissionBodyType
    createdById: number | null
  }): Promise<PermissionType> {
    return this.prismaService.permission.create({
      data: {
        ...data,
        createdById,
        description: data.description || '',
      },
    })
  }

  update({
    id,
    data,
    updatedById,
  }: {
    id: number
    data: UpdatePermissionBodyType
    updatedById: number
  }): Promise<PermissionType> {
    return this.prismaService.permission.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
        description: data.description || '',
      },
    })
  }

  delete(id: number, isHardDelete?: boolean): Promise<PermissionType> {
    if (isHardDelete) {
      return this.prismaService.permission.delete({
        where: { id },
      })
    }
    return this.prismaService.permission.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
