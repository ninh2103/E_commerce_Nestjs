import { UnprocessableEntityException } from '@nestjs/common'

export const PermissionNotFoundException = new UnprocessableEntityException([
  { message: 'Error.PermissionNotFound', path: 'permissionId' },
])

export const PermissionAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.PermissionAlreadyExists', path: 'path' },
  { message: 'Error.PermissionAlreadyExists', path: 'method' },
])
