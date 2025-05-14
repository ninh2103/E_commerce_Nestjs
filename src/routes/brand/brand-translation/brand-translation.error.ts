import { UnprocessableEntityException } from '@nestjs/common'

export const BrandTranslationNotFoundException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationNotFound', path: 'brandTranslationId' },
])

export const BrandTranslationAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationAlreadyExists', path: 'brandTranslationId' },
])

export const BrandTranslationNotBelongToBrandException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationNotBelongToBrand', path: 'brandTranslationId' },
])

export const BrandTranslationNotBelongToLanguageException = new UnprocessableEntityException([
  { message: 'Error.BrandTranslationNotBelongToLanguage', path: 'brandTranslationId' },
])
