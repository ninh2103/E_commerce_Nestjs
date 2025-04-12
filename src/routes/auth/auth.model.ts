import { UserStatus, VerificationCodeType } from 'src/shared/constants/auth.constant'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phoneNumber: z.string().min(10),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdAt: z.date(),
  createdById: z.number().nullable(),
  updatedAt: z.date(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
})

export type UserType = z.infer<typeof UserSchema>

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(8),
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
