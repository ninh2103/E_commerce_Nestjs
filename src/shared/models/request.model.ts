import { z } from 'zod'

export const EmptyModelSchema = z.object({})

export type EmptyModelType = z.infer<typeof EmptyModelSchema>

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
})

export type PaginationType = z.infer<typeof PaginationSchema>
