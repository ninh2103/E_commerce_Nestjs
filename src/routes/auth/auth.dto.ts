import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResponseSchema, SendOtpCodeBodySchema } from './auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResponseSchema) {}

export class SendOtpCodeBodyDto extends createZodDto(SendOtpCodeBodySchema) {}
