import { BrandTranslationSchema } from 'src/routes/brand/brand-translation/brand-translation.model'
import { z } from 'zod'

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
})

export type BrandType = z.infer<typeof BrandSchema>

const BrandIncludeTranslationSchema = BrandSchema.extend({
  translations: z.array(BrandTranslationSchema),
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
  brandId: z.coerce.number(),
})

export type GetBrandType = z.infer<typeof GetBrandParamsSchema>

export const getBrandDetailResSchema = BrandIncludeTranslationSchema

export type GetBrandDetailResType = z.infer<typeof getBrandDetailResSchema>

export const CreateBrandBodySchema = z
  .object({
    name: z.string(),
    logo: z.string(),
  })
  .strict()

export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>

export const UpdateBrandBodySchema = CreateBrandBodySchema

export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
