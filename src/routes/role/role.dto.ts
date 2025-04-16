import { createZodDto } from 'nestjs-zod'
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  RoleQuerySchema,
  RoleParamsSchema,
  UpdateRoleBodySchema,
  GetRoleResSchema,
  GetRoleDetailResSchema,
} from './role.model'

export class CreateRoleBodyDto extends createZodDto(CreateRoleBodySchema) {}

export class CreateRoleResDto extends createZodDto(CreateRoleResSchema) {}

export class RoleQueryDto extends createZodDto(RoleQuerySchema) {}

export class RoleParamsDto extends createZodDto(RoleParamsSchema) {}

export class UpdateRoleBodyDto extends createZodDto(UpdateRoleBodySchema) {}

export class GetRoleResDto extends createZodDto(GetRoleResSchema) {}

export class GetRoleDetailResDto extends createZodDto(GetRoleDetailResSchema) {}
