import {
  CreateCategoryBodySchema,
  UpdateCategoryBodySchema,
  GetCategoryParamsSchema,
  GetCategoryDetailSchema,
  GetAllCategoriesSchema,
  GetCategoryQuerySchema,
} from 'src/routes/category/category.model'

import { createZodDto } from 'nestjs-zod'

export class CreateCategoryBodyDto extends createZodDto(CreateCategoryBodySchema) {}

export class UpdateCategoryBodyDto extends createZodDto(UpdateCategoryBodySchema) {}

export class GetCategoryParamsDto extends createZodDto(GetCategoryParamsSchema) {}

export class GetCategoryDetailResDto extends createZodDto(GetCategoryDetailSchema) {}

export class GetCategoryResDto extends createZodDto(GetAllCategoriesSchema) {}

export class GetCategoryQueryDto extends createZodDto(GetCategoryQuerySchema) {}
