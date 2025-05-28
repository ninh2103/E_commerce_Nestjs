import { Injectable } from '@nestjs/common'
import { GetOrderListQueryType } from 'src/routes/order/order.model'
import { Prisma } from '@prisma/client'
import { GetOrderListResType, OrderStatusType } from 'src/routes/order/order.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class OrderRepo {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: number, query: GetOrderListQueryType): Promise<GetOrderListResType> {
    const { page, limit, status } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    }

    const totalItem$ = this.prisma.order.count({
      where,
    })

    const data$ = await this.prisma.order.findMany({
      where,
      include: {
        snapshots: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const [data, totalItems] = await Promise.all([data$, totalItem$])

    return {
      data: data.map((order) => ({
        ...order,
        snapshots: order.snapshots.map((snapshot) => {
          const translation = JSON.parse(snapshot.productTranslation as unknown as string)
          return {
            ...snapshot,
            productTranslations: [
              {
                id: translation.id,
                name: translation.name,
                languageId: translation.languageId,
                description: translation.description,
              },
            ],
            skuId: snapshot.skuId || null,
            orderId: snapshot.orderId || null,
            createdAt: snapshot.createdAt || null,
          }
        }),
      })),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      page,
      limit,
    }
  }
}
