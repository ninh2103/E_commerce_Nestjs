import { MediaType } from 'src/shared/constants/media.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const ReviewMediaSchema = z.object({
  id: z.number(),
  url: z.string(),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  reviewId: z.number(),
  createdAt: z.date(),
})

export const ReviewSchema = z.object({
  id: z.number(),
  content: z.string(),
  rating: z.number().min(1).max(5).default(5),
  orderId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  productId: z.number(),
  userId: z.number(),
  updateCount: z.number(),
})

export type ReviewSchemaType = z.infer<typeof ReviewSchema>

export const CreateReviewBodySchema = ReviewSchema.pick({
  content: true,
  rating: true,
  productId: true,
  orderId: true,
}).extend({
  medias: z.array(
    ReviewMediaSchema.pick({
      url: true,
      type: true,
    }),
  ),
})

export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>

export const CreateReviewResSchema = ReviewSchema.extend({
  medias: z.array(ReviewMediaSchema),
  user: UserSchema.pick({
    id: true,
    avatar: true,
    name: true,
  }),
})
export const UpdateReviewResSchema = CreateReviewResSchema

export type CreateReviewResSchemaType = z.infer<typeof UpdateReviewResSchema>
export type UpdateReviewResSchemaType = z.infer<typeof CreateReviewResSchema>

export const UpdateReviewBodySchema = CreateReviewBodySchema
export type UpdateReviewBodyType = CreateReviewBodyType

export const GetReviewResSchema = z.object({
  data: z.array(CreateReviewResSchema),
  totalItem: z.number(),
  page: z.coerce.number(),
  limit: z.coerce.number(),
  totalPages: z.number(),
})
export type GetReviewResType = z.infer<typeof GetReviewResSchema>

export const GetReviewParamsSchema = z.object({
  productId: z.coerce.number(),
})
export type GetReviewParamsType = z.infer<typeof GetReviewParamsSchema>

export const GetReviewDetailParamsSchema = z.object({
  reviewId: z.coerce.number(),
})
export type GetReviewDetailParamsType = z.infer<typeof GetReviewDetailParamsSchema>
