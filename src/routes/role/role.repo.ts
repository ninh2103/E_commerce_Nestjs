import { Injectable } from '@nestjs/common'
import { CreateRoleBodyType, GetRoleResType, UpdateRoleBodyType } from 'src/routes/role/role.model'
import { RoleType, RoleWithPermissionsType } from 'src/routes/role/role.model'
import { RoleQueryType } from 'src/routes/role/role.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class RoleRepo {
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
        permissions: true,
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
        permissions: true,
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
