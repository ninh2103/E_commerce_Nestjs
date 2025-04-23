import { createZodDto } from 'nestjs-zod'
import { ChangePasswordBodySchema, UpdateMeBodySchema } from 'src/routes/profile/profile.model'
import { GetUserProfileSchema, UpdateProfileResSchema } from 'src/shared/models/shared-user.model'

export class GetUserProfileDto extends createZodDto(GetUserProfileSchema) {}

export class UpdateUserProfileResDto extends createZodDto(UpdateProfileResSchema) {}

export class ChangePasswordDto extends createZodDto(ChangePasswordBodySchema) {}

export class UpdateMeDto extends createZodDto(UpdateMeBodySchema) {}
