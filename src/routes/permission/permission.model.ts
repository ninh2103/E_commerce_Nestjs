import { HTTP_METHOD } from 'src/shared/constants/roleName.constant'
import { z } from 'zod'

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  module: z.string().default(''),
  path: z.string(),
  method: z.enum([
    HTTP_METHOD.GET,
    HTTP_METHOD.POST,
    HTTP_METHOD.PUT,
    HTTP_METHOD.DELETE,
    HTTP_METHOD.PATCH,
    HTTP_METHOD.OPTIONS,
    HTTP_METHOD.HEAD,
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
})

export type PermissionType = z.infer<typeof PermissionSchema>

export const GetPermissionResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>

export const permissionQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict()

export type PermissionQueryType = z.infer<typeof permissionQuerySchema>

export const permissionParamsSchema = z.object({
  permissionId: z.coerce.number(),
})

export type PermissionParamsType = z.infer<typeof permissionParamsSchema>

export const getPermissionResDetailSchema = z.object({
  data: PermissionSchema,
})

export type GetPermissionResDetailType = z.infer<typeof getPermissionResDetailSchema>

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  description: true,
  path: true,
  method: true,
  module: true,
})

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>

export const UpdatePermissionBodySchema = CreatePermissionBodySchema

export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
