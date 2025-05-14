import { UnprocessableEntityException } from '@nestjs/common'

export const CategoryTranslationNotFoundException = new UnprocessableEntityException([
  { message: 'Error.CategoryTranslationNotFound', path: 'categoryTranslationId' },
])

export const CategoryTranslationAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.CategoryTranslationAlreadyExists', path: 'categoryTranslationId' },
])
