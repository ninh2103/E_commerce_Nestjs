import { createZodDto } from 'nestjs-zod'
import {
  CancelOrderResSchema,
  CreateOrderBodySchema,
  CreateOrderResSchema,
  GetOrderDetailResSchema,
  GetOrderListQuerySchema,
  GetOrderListResSchema,
  GetOrderParamsSchema,
} from 'src/routes/order/order.model'

export class GetOrderListDto extends createZodDto(GetOrderListResSchema) {}

export class GetOrderDetailDto extends createZodDto(GetOrderDetailResSchema) {}

export class CreateOrderBodyDto extends createZodDto(CreateOrderBodySchema) {}

export class CreateOrderResDto extends createZodDto(CreateOrderResSchema) {}

export class CancelOrderResDto extends createZodDto(CancelOrderResSchema) {}

export class GetOrderParamsDto extends createZodDto(GetOrderParamsSchema) {}

export class GetOrderListQueryDto extends createZodDto(GetOrderListQuerySchema) {}
