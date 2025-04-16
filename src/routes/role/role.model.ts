import { PermissionSchema } from 'src/routes/permission/permission.model'
import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
})

export type RoleType = z.infer<typeof RoleSchema>

export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
})

export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>

export const GetRoleResSchema = z.object({
  roles: z.array(RoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})
export type GetRoleResType = z.infer<typeof GetRoleResSchema>

export const RoleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
})
export type RoleQueryType = z.infer<typeof RoleQuerySchema>

export const RoleParamsSchema = z.object({
  roleId: z.coerce.number(),
})
export type RoleParamsType = z.infer<typeof RoleParamsSchema>

export const GetRoleDetailResSchema = RoleWithPermissionsSchema

export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>

export const CreateRoleBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
})

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>

export const CreateRoleResSchema = RoleSchema

export const UpdateRoleBodySchema = CreateRoleBodySchema.partial()
  .extend({
    permissionsIds: z.array(z.coerce.number()),
  })
  .strict()
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>
