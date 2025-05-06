import { BrandTranslationSchema } from 'src/routes/brand/brand-translation/brand-translation.model'
import { z } from 'zod'

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number(),
  updatedById: z.number(),
})

export type BrandType = z.infer<typeof BrandSchema>

const BrandIncludeTranslationSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export type BrandIncludeTranslationType = z.infer<typeof BrandIncludeTranslationSchema>

export const GetBrandResSchema = z.object({
  data: z.array(BrandIncludeTranslationSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type GetBrandResType = z.infer<typeof GetBrandResSchema>

export const GetBrandParamsSchema = z.object({
  brandId: z.string().optional(),
})

export type GetBrandType = z.infer<typeof GetBrandParamsSchema>

export const getBrandDetailResSchema = BrandIncludeTranslationSchema

export type GetBrandDetailResType = z.infer<typeof getBrandDetailResSchema>

export const CreateBrandSchema = BrandSchema.extend({
  name: z.string(),
  logo: z.string(),
}).strict()

export type CreateBrandType = z.infer<typeof CreateBrandSchema>

export const UpdateBrandSchema = CreateBrandSchema

export type UpdateBrandType = z.infer<typeof UpdateBrandSchema>
