import { z } from 'zod'

export const LanguageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
})

export type LanguageType = z.infer<typeof LanguageSchema>

export const GetLanguageResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number(),
})

export type GetLanguageResType = z.infer<typeof GetLanguageResSchema>

export const GetLanguageParamsSchema = z
  .object({
    languageId: z.string().min(1),
  })
  .strict()

export type GetLanguageParamsType = z.infer<typeof GetLanguageParamsSchema>

export const GetLanguageDetailResSchema = LanguageSchema

export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict()

export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>

export const UpdateLanguageBodySchema = LanguageSchema.pick({
  name: true,
}).strict()

export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>
