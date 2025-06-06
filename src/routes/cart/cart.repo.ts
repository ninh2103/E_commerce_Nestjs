import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CartItemAlreadyExistsException,
  InvalidCartItemException,
  InvalidQuantityException,
  NotFoundSKUException,
  SKUQuantityNotEnoughException,
} from 'src/routes/cart/cart.error'
import {
  AddToCartBodyType,
  CartItemType,
  DeleteCartBodyType,
  GetCartItemDetailType,
  GetCartResType,
  UpdateCartItemBodyType,
} from 'src/routes/cart/cart.model'
import { NotFoundCartItemException } from 'src/routes/order/order.error'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import { ALL_LANGUAGE } from 'src/shared/constants/orther.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class CartRepo {
  constructor(private readonly prisma: PrismaService) {}

  private async validateSKU({
    skuId,
    quantity,
    userId,
    isCreate,
  }: {
    skuId: number
    quantity: number
    userId: number
    isCreate: boolean
  }) {
    const [sku, cartItem] = await Promise.all([
      this.prisma.sKU.findUnique({
        where: {
          id: skuId,
          deletedAt: null,
        },
        include: {
          product: true,
        },
      }),
      isCreate
        ? null
        : this.prisma.cartItem.findUnique({
            where: {
              userId_skuId: {
                userId,
                skuId,
              },
            },
          }),
    ])

    if (!sku) {
      throw NotFoundSKUException
    }

    // if (!cartItem) {
    //   throw NotFoundCartItemException
    // }

    if (isCreate && cartItem && cartItem.quantity + quantity > sku.stock) {
      throw InvalidQuantityException
    }

    if (sku.stock < 1 || sku.stock < quantity) {
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

  async list2({
    userId,
    languageId,
    page,
    limit,
  }: {
    userId: number
    languageId: string
    limit: number
    page: number
  }): Promise<GetCartResType> {
    const skip = (page - 1) * limit
    const take = limit
    // Đếm tổng số nhóm sản phẩm
    const totalItems$ = this.prisma.$queryRaw<{ createdById: number }[]>`
      SELECT
        "Product"."createdById"
      FROM "CartItem"
      JOIN "SKU" ON "CartItem"."skuId" = "SKU"."id"
      JOIN "Product" ON "SKU"."productId" = "Product"."id"
      WHERE "CartItem"."userId" = ${userId}
        AND "Product"."deletedAt" IS NULL
        AND "Product"."publishAt" IS NOT NULL
        AND "Product"."publishAt" <= NOW()
      GROUP BY "Product"."createdById"
    `
    const data$ = await this.prisma.$queryRaw<GetCartItemDetailType[]>`
     SELECT
       "Product"."createdById",
       json_agg(
         jsonb_build_object(
           'id', "CartItem"."id",
           'quantity', "CartItem"."quantity",
           'skuId', "CartItem"."skuId",
           'userId', "CartItem"."userId",
           'createdAt', "CartItem"."createdAt",
           'updatedAt', "CartItem"."updatedAt",
           'sku', jsonb_build_object(
             'id', "SKU"."id",
              'value', "SKU"."value",
              'price', "SKU"."price",
              'stock', "SKU"."stock",
              'image', "SKU"."image",
              'productId', "SKU"."productId",
              'product', jsonb_build_object(
                'id', "Product"."id",
                'publishAt', "Product"."publishAt",
                'name', "Product"."name",
                'basePrice', "Product"."basePrice",
                'virtualPrice', "Product"."virtualPrice",
                'brandId', "Product"."brandId",
                'images', "Product"."images",
                'variants', "Product"."variants",
                'productTranslations', COALESCE((
                  SELECT json_agg(
                    jsonb_build_object(
                      'id', pt."id",
                      'productId', pt."productId",
                      'languageId', pt."languageId",
                      'name', pt."name",
                      'description', pt."description"
                    )
                  ) FILTER (WHERE pt."id" IS NOT NULL)
                  FROM "ProductTranslation" pt
                  WHERE pt."productId" = "Product"."id"
                    AND pt."deletedAt" IS NULL
                    ${languageId === ALL_LANGUAGE ? Prisma.sql`` : Prisma.sql`AND pt."languageId" = ${languageId}`}
                ), '[]'::json)
              )
           )
         ) ORDER BY "CartItem"."updatedAt" DESC
       ) AS "cartItems",
       jsonb_build_object(
         'id', "User"."id",
         'name', "User"."name",
         'avatar', "User"."avatar"
       ) AS "shop"
     FROM "CartItem"
     JOIN "SKU" ON "CartItem"."skuId" = "SKU"."id"
     JOIN "Product" ON "SKU"."productId" = "Product"."id"
     LEFT JOIN "ProductTranslation" ON "Product"."id" = "ProductTranslation"."productId"
       AND "ProductTranslation"."deletedAt" IS NULL
       ${languageId === ALL_LANGUAGE ? Prisma.sql`` : Prisma.sql`AND "ProductTranslation"."languageId" = ${languageId}`}
     LEFT JOIN "User" ON "Product"."createdById" = "User"."id"
     WHERE "CartItem"."userId" = ${userId}
        AND "Product"."deletedAt" IS NULL
        AND "Product"."publishAt" IS NOT NULL
        AND "Product"."publishAt" <= NOW()
     GROUP BY "Product"."createdById", "User"."id"
     ORDER BY MAX("CartItem"."updatedAt") DESC
      LIMIT ${take} 
      OFFSET ${skip}
   `
    const [data, totalItems] = await Promise.all([data$, totalItems$])
    return {
      data,
      page,
      limit,
      totalItems: totalItems.length,
      totalPages: Math.ceil(totalItems.length / limit),
    }
  }

  async addToCart({ userId, body }: { userId: number; body: AddToCartBodyType }): Promise<CartItemType> {
    await this.validateSKU({
      skuId: body.skuId,
      quantity: body.quantity,
      userId,
      isCreate: true,
    })
    return await this.prisma.cartItem.upsert({
      where: {
        userId_skuId: {
          userId,
          skuId: body.skuId,
        },
      },
      update: {
        quantity: {
          increment: body.quantity,
        },
      },
      create: {
        userId,
        skuId: body.skuId,
        quantity: body.quantity,
      },
    })
  }

  async updateCartItem({
    body,
    cartItemId,
    userId,
  }: {
    body: UpdateCartItemBodyType
    cartItemId: number
    userId: number
  }): Promise<CartItemType> {
    await this.validateSKU({
      skuId: body.skuId,
      quantity: body.quantity,
      userId,
      isCreate: false,
    })
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
