import { PermissionSchema } from "src/routes/permission/permission.model"
import { z } from "zod"

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

  export const RolePermissionSchema = RoleSchema.extend({
    permissions: z.array(PermissionSchema),
  })

  export type RolePermissionType = z.infer<typeof RolePermissionSchema>
