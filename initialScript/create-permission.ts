import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { HTTP_METHOD, ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'
const prisma = new PrismaService()
const SELLER_MODULE = ['auth', 'upload', 'manage-product', 'product-translation', 'profile', 'cart']

const CLIENT_MODULE = ['auth', 'upload', 'profile', 'cart']

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3001)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router
  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

  const availableRoutes: {
    path: string
    method: keyof typeof HTTP_METHOD
    name: string
    description: string
    module: string
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const route = layer.route
        const method = String(route.stack[0].method).toUpperCase() as keyof typeof HTTP_METHOD
        const path = route.path
        const module = path.split('/')[1].toLowerCase()
        return {
          path,
          method,
          name: `${method} + ${path}`,
          description: `Create for ${method} + ${path}`,
          module,
        }
      }
    })
    .filter((item) => item !== undefined)

  const permissionsInDbMap: Record<string, (typeof permissionsInDb)[number]> = permissionsInDb.reduce((acc, item) => {
    acc[`${item.method} + ${item.path}`] = item
    return acc
  }, {})

  const availableRoutesMap: Record<string, (typeof availableRoutes)[number]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method} + ${item.path}`] = item
    return acc
  }, {})

  const permissionsToDelete = permissionsInDb.filter((item) => !availableRoutesMap[`${item.method} + ${item.path}`])

  if (permissionsToDelete.length > 0) {
    await prisma.permission.deleteMany({
      where: {
        id: { in: permissionsToDelete.map((item) => item.id) },
      },
    })
    console.log(`Deleted ${permissionsToDelete.length} permissions`)
  } else {
    console.log('No permissions to delete')
  }

  const permissionsToCreate = availableRoutes.filter((item) => !permissionsInDbMap[`${item.method} + ${item.path}`])

  if (permissionsToCreate.length > 0) {
    await prisma.permission.createMany({
      data: permissionsToCreate,
      skipDuplicates: true,
    })
    console.log(`Created ${permissionsToCreate.length} permissions`)
  } else {
    console.log('No permissions to create')
  }

  const updatedPermissions = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

  const adminPermissionIds = updatedPermissions.map((item) => ({ id: item.id }))
  const sellerPermissionIds = updatedPermissions
    .filter((item) => SELLER_MODULE.includes(item.module))
    .map((item) => ({ id: item.id }))
  const clientPermissionIds = updatedPermissions
    .filter((item) => CLIENT_MODULE.includes(item.module))
    .map((item) => ({ id: item.id }))

  await Promise.all([
    updateRole(ROLE_NAME.ADMIN, adminPermissionIds),
    updateRole(ROLE_NAME.SELLER, sellerPermissionIds),
    updateRole(ROLE_NAME.CLIENT, clientPermissionIds),
  ])

  process.exit(0)
}
const updateRole = async (roleName: string, permissionIds: { id: number }[]) => {
  const role = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null,
    },
  })

  await prisma.role.update({
    where: {
      id: role.id,
    },
    data: {
      permissions: { set: permissionIds },
    },
  })
}

bootstrap()
