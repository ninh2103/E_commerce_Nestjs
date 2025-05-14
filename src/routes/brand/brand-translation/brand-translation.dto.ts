import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationParamsSchema,
  GetBrandTranslationResSchema,
  UpdateBrandTranslationBodySchema,
} from 'src/routes/brand/brand-translation/brand-translation.model'
import {
  CreateBrandBodySchema,
  getBrandDetailResSchema,
  GetBrandParamsSchema,
  GetBrandResSchema,
  UpdateBrandBodySchema,
} from 'src/routes/brand/brand.model'

export class CreateBrandTranslationBodyDto extends createZodDto(CreateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationBodyDto extends createZodDto(UpdateBrandTranslationBodySchema) {}

export class GetBrandTranslationParamsDto extends createZodDto(GetBrandTranslationParamsSchema) {}

export class GetBrandTranslationResDto extends createZodDto(GetBrandTranslationResSchema) {}
