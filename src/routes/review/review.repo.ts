import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateReviewBodyType,
  CreateReviewResSchemaType,
  GetReviewResType,
  UpdateReviewBodyType,
  UpdateReviewResSchemaType,
} from 'src/routes/review/review.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { isUniqueContraintPrismaError } from 'src/shared/helpers'
import { PaginationType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async list(productId: number, pagination: PaginationType): Promise<GetReviewResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit

    const [totalItem, data] = await Promise.all([
      this.prismaService.review.count({
        where: {
          productId,
        },
      }),
      this.prismaService.review.findMany({
        where: {
          productId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          medias: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])
    return {
      data,
      totalItem,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItem / pagination.limit),
    }
  }
  private async validateOrder({ orderId, userId }: { orderId: number; userId: number }) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
    })
    if (!order) {
      throw new NotFoundException('Order not found or not belong to user')
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Order is not delivered')
    }

    return order
  }

  private async validateUpdateReview({ reviewId, userId }: { reviewId: number; userId: number }) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id: reviewId,
        userId,
      },
    })
    if (!review) {
      throw new NotFoundException('Review not found or not belong to user')
    }
    if (review.updateCount >= 1) {
      throw new BadRequestException('Review already updated')
    }
    return review
  }

  async create(userId: number, body: CreateReviewBodyType): Promise<CreateReviewResSchemaType> {
    const { content, rating, medias, productId, orderId } = body
    await this.validateOrder({ orderId, userId })

    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.review
        .create({
          data: {
            content,
            rating,
            productId,
            orderId,
            userId,
            updateCount: 0,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        })
        .catch((error) => {
          if (isUniqueContraintPrismaError(error)) {
            throw new ConflictException('Review already exists')
          }
          throw error
        })
      const reviewMedia = await tx.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          url: media.url,
          type: media.type,
          reviewId: review.id,
        })),
      })
      return {
        ...review,
        medias: reviewMedia,
      }
    })
  }
  async update({
    userId,
    reviewId,
    body,
  }: {
    userId: number
    reviewId: number
    body: UpdateReviewBodyType
  }): Promise<UpdateReviewResSchemaType> {
    const { content, rating, medias, productId, orderId } = body
    await Promise.all([this.validateUpdateReview({ reviewId, userId }), this.validateOrder({ orderId, userId })])

    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: { id: reviewId },
        data: {
          content,
          rating,
          productId,
          orderId,
          userId,
          updateCount: {
            increment: 1,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          medias: true,
        },
      })
      await tx.reviewMedia.deleteMany({
        where: {
          reviewId,
        },
      })
      const reviewMedia = await tx.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          url: media.url,
          type: media.type,
          reviewId,
        })),
      })
      return {
        ...review,
        medias: reviewMedia,
      }
    })
  }
}
