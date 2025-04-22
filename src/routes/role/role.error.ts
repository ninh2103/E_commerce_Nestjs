import { UnprocessableEntityException } from '@nestjs/common'

export const RoleNotFoundException = new UnprocessableEntityException([
  { message: 'Error.RoleNotFound', path: 'roleId' },
  { message: 'Error.RoleNotFound', path: 'name' },
])

export const RoleAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.RoleAlreadyExists', path: 'name' },
])

export const RoleHasPermissionsException = new UnprocessableEntityException([
  { message: 'Error.RoleHasPermissions', path: 'permissions' },
])

export const RoleHasUsersException = new UnprocessableEntityException([
  { message: 'Error.RoleHasUsers', path: 'users' },
])

export const ProhibitedRoleException = new UnprocessableEntityException([
  { message: 'Error.ProhibitedRole', path: 'name' },
])
