import { createZodDto } from 'nestjs-zod'
import { UpdateUserProfileResDto } from 'src/routes/profile/profile.dto'
import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  GetUserQuerySchema,
  GetUserSchema,
  UpdateUserBodySchema,
} from 'src/routes/user/user.model'

export class GetUserResDto extends createZodDto(GetUserSchema) {}

export class GetUserQueryDto extends createZodDto(GetUserQuerySchema) {}

export class GetUserParamsDto extends createZodDto(GetUserParamsSchema) {}

export class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}

export class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}

export class CreateUserResDto extends UpdateUserProfileResDto {}
