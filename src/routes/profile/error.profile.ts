import { UnprocessableEntityException } from "@nestjs/common";

export const InvalidPasswordException = new UnprocessableEntityException([
    { message: 'Error.InvalidPassword', path: 'password' },
  ])

export const UserNotFoundException = new UnprocessableEntityException([
    { message: 'Error.UserNotFound', path: 'user' },
  ])

export const EmailAlreadyExistsException = new UnprocessableEntityException([
    { message: 'Error.EmailAlreadyExists', path: 'email' },
  ])

export const PasswordNotMatchException = new UnprocessableEntityException([
    { message: 'Error.PasswordNotMatch', path: 'password' },
  ])

export const NewPasswordNotMatchException = new UnprocessableEntityException([
    { message: 'Error.NewPasswordNotMatch', path: 'newPassword' },
  ])


  export const NotFoundRecordException = new UnprocessableEntityException([
    { message: 'Error.NotFoundRecord', path: 'record' },
  ])

