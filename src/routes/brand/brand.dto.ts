import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandBodySchema,
  getBrandDetailResSchema,
  GetBrandParamsSchema,
  GetBrandResSchema,
  UpdateBrandBodySchema,
} from 'src/routes/brand/brand.model'

export class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}

export class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}

export class GetBrandParamsDto extends createZodDto(GetBrandParamsSchema) {}

export class GetBrandResDto extends createZodDto(GetBrandResSchema) {}

export class GetBrandDetailResDto extends createZodDto(getBrandDetailResSchema) {}
