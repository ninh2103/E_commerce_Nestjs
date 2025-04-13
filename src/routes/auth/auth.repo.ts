import { Injectable } from '@nestjs/common'
import { RegisterBodyType, VerificationCodeType } from 'src/routes/auth/auth.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>) {
    return await this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    })
  }
  async createVerifyCode(
    payload: Pick<VerificationCodeType, 'code' | 'email' | 'type' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
      create: payload,
    })
  }
}
