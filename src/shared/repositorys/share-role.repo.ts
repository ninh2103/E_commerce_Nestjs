import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from '@prisma/client'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { RoleType } from 'src/shared/models/share-role.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class ShareRoleRepository {
  private clientRoleId: number | null = null
  private adminRoleId: number | null = null

  constructor(private readonly prisma: PrismaService) {}

  private async getRole(roleName: string) {
    const role: RoleType = await (
      this.prisma.$queryRaw`
      SELECT * FROM "Role" WHERE "name" = ${ROLE_NAME.CLIENT} AND "deletedAt" IS NULL LIMIT 1
    ` as unknown as Promise<RoleType[]>
    ).then((res) => {
      if (res.length === 0) throw new NotFoundException('Client role not found')
      return res[0]
    })
    return role
  }

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId

    const role = await this.getRole(ROLE_NAME.CLIENT)

    this.clientRoleId = role.id
    return this.clientRoleId
  }
  async getAdminRoleId() {
    if (this.adminRoleId) return this.adminRoleId

    const role = await this.getRole(ROLE_NAME.ADMIN)

    this.adminRoleId = role.id
  }
}
