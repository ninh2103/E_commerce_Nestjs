import { OrderStatus } from '@prisma/client'
import { PaginationSchema } from 'src/shared/models/request.model'
import { z } from 'zod'

const OrderStatusSchema = z.enum([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PENDING_PICKUP,
  OrderStatus.PENDING_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.RETURNED,
  OrderStatus.CANCELLED,
])

export type OrderStatusType = z.infer<typeof OrderStatusSchema>

const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  status: OrderStatusSchema,
  receiver: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
  shopId: z.number().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export type OrderType = z.infer<typeof OrderSchema>

export const ProductSkuSnapshotSchema = z.object({
  id: z.number(),
  productId: z.number().nullable(),
  productName: z.string(),
  productTranslations: z.array(
    z.object({
      id: z.number(),
      languageId: z.string(),
      name: z.string(),
      description: z.string(),
    }),
  ),
  skuPrice: z.number(),
  image: z.string(),
  skuValue: z.string(),
  quantity: z.number(),
  skuId: z.number().nullable(),
  orderId: z.number().nullable(),
  createdAt: z.date().nullable(),
})

export type ProductSkuSnapshotType = z.infer<typeof ProductSkuSnapshotSchema>

export const GetOrderListResSchema = z.object({
  data: z.array(
    OrderSchema.extend({
      snapshots: z.array(ProductSkuSnapshotSchema),
    }).omit({
      createdById: true,
      updatedById: true,
      deletedAt: true,
      receiver: true,
    }),
  ),
  totalItems: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type GetOrderListResType = z.infer<typeof GetOrderListResSchema>

export const GetOrderListQuerySchema = PaginationSchema.extend({
  status: OrderStatusSchema.optional(),
})

export type GetOrderListQueryType = z.infer<typeof GetOrderListQuerySchema>

export const GetOrderDetailResSchema = OrderSchema.extend({
  items: z.array(ProductSkuSnapshotSchema),
})

export type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>

export const CreateOrderBodySchema = z.array(
  z.object({
    shopId: z.number().nullable(),
    receiver: z.object({
      name: z.string(),
      phone: z.string(),
      address: z.string(),
    }),
    cartItemsIds: z.array(z.number().min(1)),
  }),
)

export type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>

export const CreateOrderResSchema = z.object({
  data: z.array(OrderSchema),
})

export type CreateOrderResType = z.infer<typeof CreateOrderResSchema>

export const CancelOrderResSchema = OrderSchema

export type CancelOrderResType = z.infer<typeof CancelOrderResSchema>

export const GetOrderParamsSchema = z.object({
  orderId: z.coerce.number().int().positive(),
})

export type GetOrderParamsType = z.infer<typeof GetOrderParamsSchema>
