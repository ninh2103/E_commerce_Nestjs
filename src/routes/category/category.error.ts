import { UnprocessableEntityException } from '@nestjs/common'

export const CategoryNotFoundException = new UnprocessableEntityException([
  { message: 'Error.CategoryNotFound', path: 'categoryId' },
])

export const CategoryAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.CategoryAlreadyExists', path: 'categoryId' },
])
