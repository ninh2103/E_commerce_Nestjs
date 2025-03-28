import { Injectable } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: any) {
    const hashPassword = await this.hashingService.hash(body.password)

    const user = this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        name: body.name,
      },
    })
    return user
  }
}
