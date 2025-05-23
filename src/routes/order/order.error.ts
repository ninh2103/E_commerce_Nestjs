import { UnprocessableEntityException } from '@nestjs/common'

export const OrderNotFoundException = new UnprocessableEntityException([
  { message: 'Error.OrderNotFound', path: 'orderId' },
])

export const OrderAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.OrderAlreadyExists', path: 'orderId' },
])

export const OrderNotBelongToUserException = new UnprocessableEntityException([
  { message: 'Error.OrderNotBelongToUser', path: 'orderId' },
])

export const OrderStatusNotValidException = new UnprocessableEntityException([
  { message: 'Error.OrderStatusNotValid', path: 'orderId' },
])
