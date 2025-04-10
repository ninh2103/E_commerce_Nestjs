import envConfig from 'src/shared/config'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hashingPassword = new HashingService()

interface MainResult {
  createdRole: number
  adminUser: { id: number }
}

const main = async (): Promise<MainResult> => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) return { createdRole: 0, adminUser: { id: 0 } }

  const roles = await prisma.role.createMany({
    data: [
      { name: ROLE_NAME.ADMIN, description: 'Admin role' },
      { name: ROLE_NAME.CLIENT, description: 'Client role' },
      { name: ROLE_NAME.SELLER, description: 'Seller role' },
    ],
  })
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: ROLE_NAME.ADMIN },
  })

  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: await hashingPassword.hash(envConfig.ADMIN_PASSWORD),
      roleId: adminRole.id,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
    },
  })
  return {
    createdRole: roles.count,
    adminUser,
  }
}

main().then(({ createdRole, adminUser }) => {
  console.log(`Created ${createdRole} roles`)
  console.log(`Created admin user ${adminUser.id}`)
})
