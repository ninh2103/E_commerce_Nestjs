import { UnprocessableEntityException } from '@nestjs/common'

export const LanguageNotFoundException = new UnprocessableEntityException([
  { message: 'Error.LanguageNotFound', path: 'languageId' },
])

export const LanguageAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.LanguageAlreadyExists', path: 'languageId' },
])
