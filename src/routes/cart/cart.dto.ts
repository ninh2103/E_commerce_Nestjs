import { createZodDto } from 'nestjs-zod'
import {
  AddToCartBodySchema,
  CartItemSchema,
  DeleteCartBodySchema,
  GetCartItemParamsSchema,
  GetCartResSchema,
  UpdateCartItemBodySchema,
} from 'src/routes/cart/cart.model'

export class CartItemDto extends createZodDto(CartItemSchema) {}

export class AddToCartDto extends createZodDto(AddToCartBodySchema) {}

export class UpdateCartItemDto extends createZodDto(UpdateCartItemBodySchema) {}

export class DeleteCartDto extends createZodDto(DeleteCartBodySchema) {}

export class GetCartResDto extends createZodDto(GetCartResSchema) {}

export class GetCartItemParamsDto extends createZodDto(GetCartItemParamsSchema) {}
