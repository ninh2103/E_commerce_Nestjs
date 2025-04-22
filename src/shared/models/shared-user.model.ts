import { RoleSchema } from 'src/routes/role/role.model'
import { PermissionSchema } from 'src/routes/permission/permission.model'
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

export const GetUserProfileSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        module: true,
        path: true,
        method: true,
        description: true,
      })
    ),
  }),
})

export type GetUserProfileType = z.infer<typeof GetUserProfileSchema>


export const UpdateProfileSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>
