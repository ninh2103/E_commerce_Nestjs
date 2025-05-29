import { Injectable } from '@nestjs/common'
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderListQueryType,
} from 'src/routes/order/order.model'
import { Prisma } from '@prisma/client'
import { GetOrderListResType } from 'src/routes/order/order.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import {
  NotFoundCartItemException,
  OrderNotFoundException,
  OrderNotPendingPaymentException,
  OutOfStockException,
  SKUNotBelongToShopException,
} from 'src/routes/order/order.error'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class OrderRepo {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: number, query: GetOrderListQueryType): Promise<any> {
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
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      page,
      limit,
    }
  }

  async create(userId: number, body: CreateOrderBodyType): Promise<CreateOrderResType> {
    //1kiểm tra xem tất cả cart item có tồn tại trong db không
    const allBodyCartItemIds = body.map((item) => item.cartItemsIds).flat()

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds,
        },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    })
    if (cartItems.length !== allBodyCartItemIds.length) {
      throw NotFoundCartItemException
    }
    //2. kiểm tra xem số lượng mua có lớn hơn số lượng trong kho không

    const isOutOfStock = cartItems.some((item) => item.quantity > item.sku.stock)
    if (isOutOfStock) {
      throw OutOfStockException
    }

    //3. kiểm tra xem tất cả sản phẩm mua có sản phầm nào bị xóa hay ẩn không
    const isExitNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishAt === null ||
        item.sku.product.publishAt > new Date(),
    )
    if (isExitNotReadyProduct) {
      throw ProductNotFoundException
    }
    //4. kiểm tra xem các skudId trong cartItem có thuộc shopId gửi lên không

    const cartItemMap = new Map<number, (typeof cartItems)[0]>()
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item)
    })

    const isValidShop = body.every((item) => {
      const bodyCartItemIds = item.cartItemsIds
      return bodyCartItemIds.every((id) => {
        const cartItem = cartItemMap.get(id)!
        return cartItem.sku.createdById === item.shopId
      })
    })
    if (!isValidShop) {
      throw SKUNotBelongToShopException
    }

    //5. tạo order và xóa cart item trong transaction để đảm bảo tính toàn vẹn dữ liệu
    const order = await this.prisma.$transaction(async (tx) => {
      const orders = await Promise.all(
        body.map(async (item) => {
          const createdOrder = await tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdById: item.shopId,
              shopId: item.shopId,
              snapshots: {
                create: item.cartItemsIds.map((id) => {
                  const cartItem = cartItemMap.get(id)!
                  return {
                    skuId: cartItem.skuId,
                    quantity: cartItem.quantity,
                    productName: cartItem.sku.product.name,
                    image: cartItem.sku.image,
                    skuPrice: cartItem.sku.price,
                    skuValue: cartItem.sku.value,
                    productTranslation: cartItem.sku.product.translations.map((translation) => ({
                      id: translation.id,
                      name: translation.name,
                      languageId: translation.languageId,
                      description: translation.description,
                    })),
                  }
                }),
              },
              products: {
                connect: item.cartItemsIds.map((id) => {
                  const cartItem = cartItemMap.get(id)!
                  return { id: cartItem.sku.productId }
                }),
              },
            },
          })

          await tx.cartItem.deleteMany({
            where: {
              id: {
                in: allBodyCartItemIds,
              },
            },
          })

          return createdOrder
        }),
      )

      return {
        data: orders,
      }
    })
    return order
  }

  async detail(userId: number, orderId: number): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      include: {
        snapshots: true,
      },
    })
    if (!order) {
      throw OrderNotFoundException
    }
    return order
  }
  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    try {
      const order = await this.prisma.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
      })

      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw OrderNotPendingPaymentException
      }

      const updatedOrder = await this.prisma.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.CANCELLED,
          updatedById: userId,
        },
      })

      return updatedOrder
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException
      }
      throw error
    }
  }
}
