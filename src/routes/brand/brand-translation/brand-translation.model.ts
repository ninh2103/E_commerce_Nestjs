import { z } from 'zod'

export const BrandTranslationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  brandId: z.number(),
  languageId: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>

export const GetBrandTranslationParamsSchema = z.object({
  brandTranslationId: z.string(),
})

export type GetBrandTranslationParamsType = z.infer<typeof GetBrandTranslationParamsSchema>

export const GetBrandTranslationResSchema = BrandTranslationSchema

export type GetBrandTranslationResType = z.infer<typeof GetBrandTranslationResSchema>

export const CreateBrandTranslationSchema = BrandTranslationSchema.pick({
  name: true,
  description: true,
  brandId: true,
  languageId: true,
})

export type CreateBrandTranslationType = z.infer<typeof CreateBrandTranslationSchema>

export const UpdateBrandTranslationSchema = CreateBrandTranslationSchema

export type UpdateBrandTranslationType = z.infer<typeof UpdateBrandTranslationSchema>
