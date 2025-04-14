import { UnprocessableEntityException, UnauthorizedException } from '@nestjs/common'

export const InvalidOtpException = new UnprocessableEntityException([{ message: 'Error.InvalidOTP', path: 'otp' }])

export const OtpExpiredException = new UnprocessableEntityException([{ message: 'Error.OTPExpired', path: 'otp' }])

export const FailedToSendOtpException = new UnprocessableEntityException([
  { message: 'Error.FailedToSendOTP', path: 'otp' },
])

export const EmailAlreadyExistsException = new UnprocessableEntityException([
  { message: 'Error.EmailAlreadyExists', path: 'email' },
])

export const EmailNotFoundException = new UnprocessableEntityException([
  { message: 'Error.EmailNotFound', path: 'email' },
])

export const InvalidPasswordException = new UnprocessableEntityException([
  { message: 'Error.InvalidPassword', path: 'password' },
])

export const RefreshTokenAlreadyUsedException = new UnauthorizedException('Error.RefreshTokenAlreadyUsed')

export const UnAuthorizedAccessException = new UnauthorizedException('Error.UnAuthorizedAccess')
