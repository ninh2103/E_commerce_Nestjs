import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  AddToCartBodyType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType,
} from 'src/routes/cart/cart.model'
import { CartRepo } from 'src/routes/cart/cart.repo'
import { PaginationType } from 'src/shared/models/request.model'

@Injectable()
export class CartService {
  constructor(private readonly cartRepo: CartRepo) {}

  async getCart(userId: number, query: PaginationType) {
    return await this.cartRepo.list2({
      userId,
      languageId: I18nContext.current()?.lang as string,
      page: query.page,
      limit: query.limit,
    })
  }

  async addToCart(userId: number, body: AddToCartBodyType) {
    return await this.cartRepo.addToCart({ userId, body })
  }

  async updateCartItem(cartItemId: number, body: UpdateCartItemBodyType) {
    return await this.cartRepo.updateCartItem({ cartItemId, body })
  }

  async deleteCartItem(userId: number, body: DeleteCartBodyType) {
    const { count } = await this.cartRepo.deleteCartItem(userId, body)
    return {
      message: `${count} cart item deleted successfully`,
    }
  }
}
