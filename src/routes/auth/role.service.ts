import { Injectable, NotFoundException } from '@nestjs/common'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class RoleService {
  private clientRoleId: number | null = null

  constructor(private readonly prisma: PrismaService) {}

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId
    const clientRole = await this.prisma.role.findFirstOrThrow({
      where: {
        name: ROLE_NAME.CLIENT,
      },
    })
    if (!clientRole) throw new NotFoundException('Client role not found')
    this.clientRoleId = clientRole.id
    return clientRole.id
  }
}
