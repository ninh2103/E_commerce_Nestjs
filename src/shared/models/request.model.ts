import { z } from 'zod'

export const EmptyModelSchema = z.object({})

export type EmptyModelType = z.infer<typeof EmptyModelSchema>
