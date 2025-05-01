import { createZodDto } from 'nestjs-zod'
import {
  PresignedUploadFileResSchema,
  PresignedUploadFileBodySchema,
  PresignedUploadFileResponseSchema,
} from 'src/routes/media/media.model'

export class PresignedUploadFileDto extends createZodDto(PresignedUploadFileResSchema) {}

export class PresignedUploadFileResponseDto extends createZodDto(PresignedUploadFileResponseSchema) {}

export class PresignedUploadFileBodyDto extends createZodDto(PresignedUploadFileBodySchema) {}
