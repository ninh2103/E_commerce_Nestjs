import { CategoryTranslationSchema } from 'src/routes/category/category-translation/category-translation.model'
import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullable(),
  parentCategoryId: z.number().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CategoryType = z.infer<typeof CategorySchema>

export const CategoryIncludeTranslationSchema = CategorySchema.extend({
  translations: z.array(CategoryTranslationSchema),
})

export type CategoryIncludeTranslationType = z.infer<typeof CategoryIncludeTranslationSchema>

export const GetAllCategoriesSchema = z.object({
  data: z.array(CategoryIncludeTranslationSchema),
  totalItems: z.number(),
})
export type GetAllCategoriesResType = z.infer<typeof GetAllCategoriesSchema>

export const GetCategoryQuerySchema = z.object({
  parentCategoryId: z.coerce.number().optional(),
})
export type GetCategoryQueryType = z.infer<typeof GetCategoryQuerySchema>

export const GetCategoryParamsSchema = z.object({
  categoryId: z.coerce.number(),
})
export type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>

export const GetCategoryDetailSchema = z.object({
  data: CategoryIncludeTranslationSchema,
})
export type GetCategoryDetailType = CategoryIncludeTranslationType

export const CreateCategoryBodySchema = z.object({
  name: z.string(),
  logo: z.string().nullable(),
  parentCategoryId: z.number().nullable(),
})
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>

export const UpdateCategoryBodySchema = z.object({
  name: z.string(),
  logo: z.string().nullable(),
  parentCategoryId: z.number().nullable(),
})
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>
