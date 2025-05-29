import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AddToCartDto, DeleteCartDto, GetCartItemParamsDto, UpdateCartItemDto } from 'src/routes/cart/cart.dto'
import { CartService } from 'src/routes/cart/cart.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { PaginationDto } from 'src/shared/dto/request.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Query() query: PaginationDto, @ActiveUser('userId') userId: number) {
    return await this.cartService.getCart(userId, query)
  }

  @Post()
  async addToCart(@Body() body: AddToCartDto, @ActiveUser('userId') userId: number) {
    return await this.cartService.addToCart(userId, body)
  }

  @Put(':cartItemId')
  async updateCartItem(
    @Param() params: GetCartItemParamsDto,
    @ActiveUser('userId') userId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(userId, params.cartItemId, body)
  }

  @Post('delete')
  async deleteCartItem(@Body() body: DeleteCartDto, @ActiveUser('userId') userId: number) {
    return await this.cartService.deleteCartItem(userId, body)
  }
}
