import { createZodDto } from 'nestjs-zod'
import {
  CreateProductBodySchema,
  GetManageProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  UpdateProductBodySchema,
} from 'src/routes/product/product.model'

export class CreateProductBodyDto extends createZodDto(CreateProductBodySchema) {}

export class UpdateProductBodyDto extends createZodDto(UpdateProductBodySchema) {}

export class GetProductParamsDto extends createZodDto(GetProductParamsSchema) {}

export class GetProductDetailResDto extends createZodDto(GetProductDetailResSchema) {}

export class GetProductResDto extends createZodDto(GetProductsResSchema) {}

export class GetProductQueryDto extends createZodDto(GetProductsQuerySchema) {}

export class GetManageProductQueryDto extends createZodDto(GetManageProductsQuerySchema) {}
