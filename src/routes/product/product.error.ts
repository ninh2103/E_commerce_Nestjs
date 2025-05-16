import { UnprocessableEntityException } from '@nestjs/common'

export const ProductNotFoundException = new UnprocessableEntityException([
  { message: 'Error.ProductNotFound', path: 'productId' },
])

export const ProductAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.ProductAlreadyExists', path: 'productId' },
])
