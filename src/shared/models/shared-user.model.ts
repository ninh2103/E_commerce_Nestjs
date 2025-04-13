import { UserStatus } from 'src/shared/constants/auth.constant'
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
