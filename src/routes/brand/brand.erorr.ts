import { UnprocessableEntityException } from '@nestjs/common'

export const BrandNotFoundException = new UnprocessableEntityException([
  { message: 'Error.BrandNotFound', path: 'brandId' },
])

export const BrandAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.BrandAlreadyExists', path: 'brandId' },
])

export const BrandTranslationNotFoundException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationNotFound', path: 'brandTranslationId' },
])

export const BrandTranslationAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationAlreadyExists', path: 'brandTranslationId' },
])
