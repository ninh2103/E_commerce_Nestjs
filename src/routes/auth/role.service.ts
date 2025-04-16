import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '@prisma/client'
import { RoleType } from 'src/routes/auth/auth.model'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class RoleService {
  private clientRoleId: number | null = null

  constructor(private readonly prisma: PrismaService) {}

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId

    const role: RoleType = await (
      this.prisma.$queryRaw`
      SELECT * FROM "Role" WHERE "name" = ${ROLE_NAME.CLIENT} AND "deletedAt" IS NULL LIMIT 1
    ` as unknown as Promise<RoleType[]>
    ).then((res) => {
      if (res.length === 0) throw new NotFoundException('Client role not found')
      return res[0]
    })

    this.clientRoleId = role.id
    return this.clientRoleId
  }
}
