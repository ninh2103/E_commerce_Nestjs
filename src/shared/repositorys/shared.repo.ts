import { Injectable } from '@nestjs/common'
import { UserType } from '../models/shared-user.model'
import { PrismaService } from '../sharedServices/prisma.service'

@Injectable()
export class SharedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return this.prisma.user.findUnique({
      where: uniqueObject,
    })
  }
}
