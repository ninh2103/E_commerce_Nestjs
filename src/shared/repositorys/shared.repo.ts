import { Injectable } from '@nestjs/common'
import { UserType } from '../models/shared-user.model'
import { PrismaService } from '../sharedServices/prisma.service'

export type WhereUniqueUserType = { id: number } | { email: string }

export type UserIncludeRolePermissionType = Omit<UserType, 'password' | 'totpSecret'> & {
  role: {
    id: number
    name: string
    permissions: Array<{
      id: number
      name: string
      module: string
      path: string
      method: string
      description: string
    }>
  }
}

@Injectable()
export class SharedRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(uniqueObject: WhereUniqueUserType): Promise<UserType | null> {
    return this.prisma.user.findFirst({
      where: uniqueObject,
    })
  }

  findUniqueUniqueRolePermission(where: WhereUniqueUserType): Promise<UserIncludeRolePermissionType | null> {
    return this.prisma.user.findFirst({
      where: where,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        status: true,
        roleId: true,
        createdAt: true,
        createdById: true,
        updatedAt: true,
        updatedById: true,
        deletedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                name: true,
                module: true,
                path: true,
                method: true,
                description: true,
              },
            },
          },
        },
      },
    })
  }
  update(where: { id: number }, data: Partial<UserType>): Promise<UserType> {
    return this.prisma.user.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: data,
    })
  }
}
