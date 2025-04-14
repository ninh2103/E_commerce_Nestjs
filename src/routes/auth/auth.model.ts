import { VerificationCodeType } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(8),
    code: z.string().length(6),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>

export const VerificationCodeSchema = z.object({
  id: z.number(),
  code: z.string().length(6),
  type: z.enum([VerificationCodeType.REGISTER, VerificationCodeType.FORGOT_PASSWORD]),
  email: z.string().email(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>

export const SendOtpCodeBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export type SendOtpCodeBodyType = z.infer<typeof SendOtpCodeBodySchema>

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResponseType = z.infer<typeof LoginResponseSchema>

export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string(),
})

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>

export const RefreshTokenResponseSchema = LoginResponseSchema

export type RefreshTokenResponseType = LoginResponseType

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActiveAt: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
})

export type DeviceType = z.infer<typeof DeviceSchema>

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
})

export type RoleType = z.infer<typeof RoleSchema>

const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>

export const LogoutBodySchema = RefreshTokenBodySchema

export type LogoutBodyType = RefreshTokenBodyType

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      })
    }
  })

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>
