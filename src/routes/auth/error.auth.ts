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


export const RefreshTokenAlreadyUsedException = new UnauthorizedException('Error.RefreshTokenAlreadyUsed')

export const UnAuthorizedAccessException = new UnauthorizedException('Error.UnAuthorizedAccess')

export const TOTPCodeAlreadyEnabledException = new UnprocessableEntityException([
  { message: 'Error.TOTPCodeAlreadyEnabled', path: 'totpCode' },
])

export const InvalidTOTPCodeAndCodeException = new UnprocessableEntityException([
  { message: 'Error.InvalidTOTPCodeAndCode', path: 'totpCode' },
  { message: 'Error.InvalidTOTPCodeAndCode', path: 'code' },
])

export const TOTPCodeNotEnabledException = new UnprocessableEntityException([
  { message: 'Error.TOTPCodeNotEnabled', path: 'totpCode' },
])

export const InvalidTOTPCodeException = new UnprocessableEntityException([
  { message: 'Error.InvalidTOTPCode', path: 'totpCode' },
])
