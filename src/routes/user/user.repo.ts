import { Injectable } from '@nestjs/common'
import { CreateUserBodyType, GetUserQueryType, GetUserResType } from 'src/routes/user/user.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: GetUserQueryType): Promise<GetUserResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItems, data] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ])

    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / take),
    }
  }

  create({ data, createdById }: { data: CreateUserBodyType; createdById: number }) {
    return this.prismaService.user.create({
      data: {
        ...data,
        createdById,
      },
    })
  }
  delete(id: number, isHardDelete?: boolean) {
    return isHardDelete
      ? this.prismaService.user.delete({
          where: {
            id,
          },
        })
      : this.prismaService.user.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
  }
}
