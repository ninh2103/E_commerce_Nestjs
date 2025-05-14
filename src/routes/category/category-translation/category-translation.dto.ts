import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryTranslationBodySchema,
  GetCategoryTranslationParamsSchema,
  GetCategoryTranslationResSchema,
  UpdateCategoryTranslationBodySchema,
} from 'src/routes/category/category-translation/category-translation.model'

export class CreateCategoryTranslationBodyDto extends createZodDto(CreateCategoryTranslationBodySchema) {}

export class UpdateCategoryTranslationBodyDto extends createZodDto(UpdateCategoryTranslationBodySchema) {}

export class GetCategoryTranslationParamsDto extends createZodDto(GetCategoryTranslationParamsSchema) {}

export class GetCategoryTranslationResDto extends createZodDto(GetCategoryTranslationResSchema) {}
