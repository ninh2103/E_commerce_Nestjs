import { UnprocessableEntityException } from '@nestjs/common'

export const CartItemNotFoundException = new UnprocessableEntityException([
  { message: 'Error.CartItemNotFound', path: 'cartItemId' },
])

export const CartItemAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.CartItemAlreadyExists', path: 'cartItemId' },
])

export const CartItemNotBelongToUserException = new UnprocessableEntityException([
  { message: 'Error.CartItemNotBelongToUser', path: 'cartItemId' },
])

export const CartItemQuantityNotEnoughException = new UnprocessableEntityException([
  { message: 'Error.CartItemQuantityNotEnough', path: 'cartItemId' },
])

export const NotFoundSKUException = new UnprocessableEntityException([{ message: 'Error.NotFoundSKU', path: 'skuId' }])

export const SKUQuantityNotEnoughException = new UnprocessableEntityException([
  { message: 'Error.SKUQuantityNotEnough', path: 'skuId' },
])
