import { z } from 'zod'

export const PresignedUploadFileBodySchema = z
  .object({
    filename: z.string(),
    fileSize: z.number().max(1 * 1024), // 1KB
  })
  .strict()

export type PresignedUploadFileBodyType = z.infer<typeof PresignedUploadFileBodySchema>

export const PresignedUploadFileResponseSchema = z.object({
  data: z.array(
    z.object({
      url: z.string(),
    }),
  ),
})

export type PresignedUploadFileResponseType = z.infer<typeof PresignedUploadFileResponseSchema>

export const PresignedUploadFileResSchema = z.object({
  presignedUrl: z.string(),
  url: z.string(),
})

export type PresignedUploadFileResType = z.infer<typeof PresignedUploadFileResSchema>
