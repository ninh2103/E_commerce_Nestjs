import { createZodDto } from 'nestjs-zod'
import {
  LoginBodySchema,
  LoginResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
  SendOtpCodeBodySchema,
} from './auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResponseSchema) {}

export class SendOtpCodeBodyDto extends createZodDto(SendOtpCodeBodySchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}

export class LoginResDto extends createZodDto(LoginResponseSchema) {}
