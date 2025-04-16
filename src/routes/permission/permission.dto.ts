import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionBodySchema,
  getPermissionResDetailSchema,
  GetPermissionResSchema,
  permissionParamsSchema,
  permissionQuerySchema,
  UpdatePermissionBodySchema,
} from './permission.model'

export class CreatePermissionBodyDto extends createZodDto(CreatePermissionBodySchema) {}

export class GetPermissionResDto extends createZodDto(GetPermissionResSchema) {}

export class UpdatePermissionBodyDto extends createZodDto(UpdatePermissionBodySchema) {}

export class GetPermissionParamsDto extends createZodDto(permissionParamsSchema) {}

export class GetPermissionResDetailDto extends createZodDto(getPermissionResDetailSchema) {}

export class PermissionQueryDto extends createZodDto(permissionQuerySchema) {}
