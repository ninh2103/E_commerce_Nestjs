import { z } from 'zod'

export const ProductTranslationSchema = z.object({
  id: z.number(),
  productId: z.number(),
  languageId: z.number(),
  description: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number(),
  updatedById: z.number(),
})

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>

export const GetProductTranslationsParamsSchema = z.object({
  productTranslationId: z.coerce.number().int().positive(),
})

export type GetProductTranslationsParamsType = z.infer<typeof GetProductTranslationsParamsSchema>

export const GetProductTranslationsResSchema = z.object({
  data: z.array(ProductTranslationSchema),
})

export type GetProductTranslationsResType = z.infer<typeof GetProductTranslationsResSchema>

export const CreateProductTranslationBodySchema = ProductTranslationSchema.pick({
  productId: true,
  languageId: true,
  description: true,
  name: true,
})

export type CreateProductTranslationBodyType = z.infer<typeof CreateProductTranslationBodySchema>

export const UpdateProductTranslationBodySchema = CreateProductTranslationBodySchema

export type UpdateProductTranslationBodyType = z.infer<typeof UpdateProductTranslationBodySchema>

export const GetProductTranslationDetailResSchema = ProductTranslationSchema

export type GetProductTranslationDetailResType = z.infer<typeof GetProductTranslationDetailResSchema>
