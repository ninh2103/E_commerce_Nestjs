export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PICKUP: 'PENDING_PICKUP',
  PENDING_SHIPPING: 'PENDING_DELIVERED',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
