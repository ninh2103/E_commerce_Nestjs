import { Injectable } from '@nestjs/common'
import { NotFoundSKUException, SKUQuantityNotEnoughException } from 'src/routes/cart/cart.error'
import {
  AddToCartBodyType,
  CartItemType,
  DeleteCartBodyType,
  GetCartItemDetailType,
  GetCartResType,
  UpdateCartItemBodyType,
} from 'src/routes/cart/cart.model'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import { ALL_LANGUAGE } from 'src/shared/constants/orther.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class CartRepo {
  constructor(private readonly prisma: PrismaService) {}

  private async validateSKU(skuId: number) {
    const sku = await this.prisma.sKU.findUnique({
      where: {
        id: skuId,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    })
    if (!sku) {
      throw NotFoundSKUException
    }
    if (sku.stock < 1) {
      throw SKUQuantityNotEnoughException
    }
    const { product } = sku

    if (product.deletedAt !== null || product.publishAt === null || product.publishAt > new Date()) {
      throw ProductNotFoundException
    }
    return sku
  }

  async findAll({
    userId,
    languageId,
    page,
    limit,
  }: {
    userId: number
    languageId: string
    page: number
    limit: number
  }): Promise<GetCartResType> {
    const skip = (page - 1) * limit
    const take = limit
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        userId,
        sku: {
          product: {
            deletedAt: null,
            publishAt: {
              lte: new Date(),
              not: null,
            },
          },
        },
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                translations: {
                  where: languageId === ALL_LANGUAGE ? { deletedAt: null } : { deletedAt: null, languageId },
                },
                createdBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const groupMap = new Map<number, GetCartItemDetailType>()
    for (const cartItem of cartItems) {
      const shopId = cartItem.sku.product.createdById
      if (shopId) {
        if (!groupMap.has(shopId)) {
          const cartItemWithArrayVariants = {
            ...cartItem,
            sku: {
              ...cartItem.sku,
              product: {
                ...cartItem.sku.product,
                variants: Array.isArray(cartItem.sku.product.variants)
                  ? cartItem.sku.product.variants
                  : [cartItem.sku.product.variants],
              },
            },
          }
          groupMap.set(shopId, { shop: cartItem.sku.product.createdBy, cartItems: [cartItemWithArrayVariants] })
        } else {
          const cartItemWithArrayVariants = {
            ...cartItem,
            sku: {
              ...cartItem.sku,
              product: {
                ...cartItem.sku.product,
                variants: Array.isArray(cartItem.sku.product.variants)
                  ? cartItem.sku.product.variants
                  : [cartItem.sku.product.variants],
              },
            },
          }
          groupMap.get(shopId)?.cartItems.push(cartItemWithArrayVariants)
        }
      }
    }

    const sortedGroups = Array.from(groupMap.values())
    const totalGroups = sortedGroups.length
    const paginatedGroups = sortedGroups.slice(skip, skip + take)

    return {
      data: paginatedGroups,
      totalItems: totalGroups,
      limit,
      page,
      totalPages: Math.ceil(totalGroups / take),
    }
  }

  async addToCart({ userId, body }: { userId: number; body: AddToCartBodyType }): Promise<CartItemType> {
    await this.validateSKU(body.skuId)
    return await this.prisma.cartItem.create({
      data: {
        userId,
        skuId: body.skuId,
        quantity: body.quantity,
      },
    })
  }

  async updateCartItem({
    body,
    cartItemId,
  }: {
    body: UpdateCartItemBodyType
    cartItemId: number
  }): Promise<CartItemType> {
    await this.validateSKU(body.skuId)
    return await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: body.quantity, skuId: body.skuId },
    })
  }

  async deleteCartItem(userId: number, body: DeleteCartBodyType): Promise<{ count: number }> {
    const { cartItemIds } = body
    return await this.prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds }, userId },
    })
  }
}
