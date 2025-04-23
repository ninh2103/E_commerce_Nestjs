import { RoleSchema } from 'src/shared/models/share-role.model'
import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const GetUserSchema = z
  .object({
    data: z.array(
      UserSchema.omit({ password: true, totpSecret: true }).extend({ role: RoleSchema.pick({ id: true, name: true }) }),
    ),
    totalItems: z.number(),
    totalPages: z.number(),
    page: z.number(),
    limit: z.number(),
  })
  .strict()

export type GetUserResType = z.infer<typeof GetUserSchema>

export const GetUserQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
})

export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>

export const GetUserParamsSchema = z.object({
  userId: z.coerce.number().int(),
})

export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  roleId: true,
  avatar: true,
  status: true,
  phoneNumber: true,
  name: true,
}).strict()

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>

export const UpdateUserBodySchema = CreateUserBodySchema

export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
