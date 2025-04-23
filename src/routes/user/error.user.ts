import { UnprocessableEntityException } from '@nestjs/common'

export const UserNotFoundException = new UnprocessableEntityException([
  { message: 'Error.UserNotFound', path: 'userId' },
])

export const UserAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.UserAlreadyExists', path: 'email' },
])

export const UserNotBelongToRoleException = new UnprocessableEntityException([
  { message: 'Error.UserNotBelongToRole', path: 'userId' },
])

export const NotFoundUpdateAdminException = new UnprocessableEntityException([
  { message: 'Error.NotFoundUpdateAdmin', path: 'userId' },
])

export const NotFoundSetAdminRoleToUserException = new UnprocessableEntityException([
  { message: 'Error.NotFoundSetAdminRoleToUser', path: 'userId' },
])

export const RoleNotFoundException = new UnprocessableEntityException([
  { message: 'Error.RoleNotFound', path: 'roleId' },
])

export const NotFoundDeleteAdminException = new UnprocessableEntityException([
  { message: 'Error.NotFoundDeleteAdmin', path: 'userId' },
])

export const CannotDeleteYourselfException = new UnprocessableEntityException([
  { message: 'Error.CannotDeleteYourself', path: 'userId' },
])

export const CannotUpdateYourselfException = new UnprocessableEntityException([
  { message: 'Error.CannotUpdateYourself', path: 'userId' },
])
