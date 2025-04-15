import { createZodDto } from 'nestjs-zod'
import {
  CreateLanguageBodySchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguageResSchema,
  UpdateLanguageBodySchema,
} from './language.model'

export class CreateLanguageBodyDto extends createZodDto(CreateLanguageBodySchema) {}

export class GetLanguageResDto extends createZodDto(GetLanguageResSchema) {}

export class UpdateLanguageBodyDto extends createZodDto(UpdateLanguageBodySchema) {}

export class GetLanguageResDetailDto extends createZodDto(GetLanguageDetailResSchema) {}

export class GetLanguageParamsDto extends createZodDto(GetLanguageParamsSchema) {}
