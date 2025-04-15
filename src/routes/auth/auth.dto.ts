import { createZodDto } from 'nestjs-zod'
import {
  Disable2FaBodySchema,
  Disable2FaResSchema,
  ForgotPasswordBodySchema,
  LoginBodySchema,
  LoginResponseSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
  SendOtpCodeBodySchema,
} from './auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResponseSchema) {}

export class SendOtpCodeBodyDto extends createZodDto(SendOtpCodeBodySchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}

export class LoginResDto extends createZodDto(LoginResponseSchema) {}

export class LogoutBodyDto extends createZodDto(LogoutBodySchema) {}

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDto extends createZodDto(RefreshTokenResponseSchema) {}

export class ForgotPasswordBodyDto extends createZodDto(ForgotPasswordBodySchema) {}

export class Disable2FaBodyDto extends createZodDto(Disable2FaBodySchema) {}

export class Disable2FaResDto extends createZodDto(Disable2FaResSchema) {}
