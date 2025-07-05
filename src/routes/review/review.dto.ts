import { createZodDto } from 'nestjs-zod'
import {
  CreateReviewBodySchema,
  CreateReviewResSchema,
  GetReviewDetailParamsSchema,
  GetReviewParamsSchema,
  GetReviewResSchema,
  UpdateReviewBodySchema,
  UpdateReviewResSchema,
} from 'src/routes/review/review.model'

export class CreateReviewBodyDto extends createZodDto(CreateReviewBodySchema) {}
export class UpdateReviewBodyDto extends createZodDto(UpdateReviewBodySchema) {}
export class GetReviewDto extends createZodDto(GetReviewResSchema) {}
export class CreateReviewResDto extends createZodDto(CreateReviewResSchema) {}
export class GetReviewParamDto extends createZodDto(GetReviewParamsSchema) {}
export class GetReviewDetailParamDto extends createZodDto(GetReviewDetailParamsSchema) {}
export class UpdateReviewResDto extends createZodDto(UpdateReviewResSchema) {}
