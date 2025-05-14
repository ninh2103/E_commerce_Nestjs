import { z } from 'zod'

export const CategoryTranslationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  categoryId: z.number(),
  languageId: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>

export const GetCategoryTranslationParamsSchema = z.object({
  categoryTranslationId: z.coerce.number(),
})
export type GetCategoryTranslationParamsType = z.infer<typeof GetCategoryTranslationParamsSchema>

export const GetCategoryTranslationResSchema = CategoryTranslationSchema
export type GetCategoryTranslationResType = z.infer<typeof GetCategoryTranslationResSchema>

export const CreateCategoryTranslationBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  categoryId: z.number(),
  languageId: z.string(),
})
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>

export const UpdateCategoryTranslationBodySchema = CreateCategoryTranslationBodySchema

export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>

export const GetCategoryTranslationResDetailSchema = CategoryTranslationSchema

export type GetCategoryTranslationResDetailType = z.infer<typeof GetCategoryTranslationResDetailSchema>
