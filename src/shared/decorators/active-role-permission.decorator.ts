import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { REQUEST_ROLE_KEY } from 'src/shared/constants/auth.constant'
import { RolePermissionType } from 'src/shared/models/share-role.model'

export const ActiveRolePermission = createParamDecorator((field: keyof RolePermissionType | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const rolePermissions: RolePermissionType | undefined = request[REQUEST_ROLE_KEY]
  return field ?  rolePermissions?.[field] : rolePermissions
})
