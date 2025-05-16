import { createZodDto } from 'nestjs-zod'
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationsParamsSchema,
  GetProductTranslationsResSchema,
  UpdateProductTranslationBodySchema,
} from 'src/routes/product/product-translation/product-translation.model'

export class CreateProductTranslationBodyDto extends createZodDto(CreateProductTranslationBodySchema) {}

export class UpdateProductTranslationBodyDto extends createZodDto(UpdateProductTranslationBodySchema) {}

export class GetProductTranslationParamsDto extends createZodDto(GetProductTranslationsParamsSchema) {}

export class GetProductTranslationResDto extends createZodDto(GetProductTranslationsResSchema) {}
