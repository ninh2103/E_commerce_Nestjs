import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRoleBodyType, GetRoleResType, UpdateRoleBodyType } from 'src/routes/role/role.model'
import {  RoleWithPermissionsType } from 'src/routes/role/role.model'
import { RoleQueryType } from 'src/routes/role/role.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import { RoleType } from 'src/shared/models/share-role.model'

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: RoleQueryType): Promise<GetRoleResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItems, roles] = await Promise.all([
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ])

    return {
      roles,
      page: pagination.page,
      limit: pagination.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.limit),
    }
  }

  async getById(id: number): Promise<RoleWithPermissionsType | null> {
    return this.prismaService.role.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  async create({ data, createdById }: { data: CreateRoleBodyType; createdById: number | null }): Promise<RoleType> {
    return this.prismaService.role.create({
      data: { ...data, createdById },
    })
  }
  async update({
    id,
    data,
    updatedById,
  }: {
    id: number
    data: UpdateRoleBodyType
    updatedById: number
  }): Promise<RoleType> {
    if (data.permissionsIds.length > 0) {
      const permissions = await this.prismaService.permission.findMany({
        where: {
          id: { in: data.permissionsIds },
        },
      })
      const deletedPermissions = permissions.filter(
        (permission) => permission.deletedAt,
      )
      if (deletedPermissions.length > 0) {
        const deletedPermissionsIds = deletedPermissions.map(
          (permission) => permission.id,
        ).join(',')
        throw new BadRequestException(
          `Permissions with ids ${deletedPermissionsIds} is deleted`,
        )
      }
    }

    return this.prismaService.role.update({
      where: { id, deletedAt: null },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        permissions: {
          set: data.permissionsIds.map((id) => ({ id })),
        },
        updatedById,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  async delete(id: number, isHardDelete?: boolean): Promise<RoleType> {
    return isHardDelete
      ? this.prismaService.role.delete({
          where: { id, deletedAt: null },
        })
      : this.prismaService.role.update({
          where: { id, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
