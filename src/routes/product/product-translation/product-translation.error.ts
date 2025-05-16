import { UnprocessableEntityException } from '@nestjs/common'

export const ProductTranslationNotFoundException = new UnprocessableEntityException([
  { message: 'Error.ProductTranslationNotFound', path: 'productTranslationId' },
])

export const ProductTranslationAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.ProductTranslationAlreadyExists', path: 'productTranslationId' },
])
