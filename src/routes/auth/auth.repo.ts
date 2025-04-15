import { Injectable } from '@nestjs/common'
import {
  DeviceType,
  RefreshTokenType,
  RegisterBodyType,
  RoleType,
  VerificationCodeType,
} from 'src/routes/auth/auth.model'
import { TypeOfVerificationCodeType, UserStatus } from 'src/shared/constants/auth.constant'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'
@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>) {
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
        email_code_type: {
          email: payload.email,
          code: payload.code,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    })
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | { email_code_type: { email: string; code: string; type: TypeOfVerificationCodeType } },
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    })
  }
  async createRefreshToken(payload: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return await this.prismaService.refreshToken.create({
      data: payload,
    })
  }
  async createDevice(
    payload: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActiveAt' | 'isActive'>>,
  ) {
    return await this.prismaService.device.create({
      data: payload,
    })
  }
  async findUniqueUserIncludeRole(
    uniqueObject: { id: number } | { email: string },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return await this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    })
  }
  async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return await this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })
  }
  async updateDevice(deviceId: number, payload: Partial<DeviceType>): Promise<DeviceType> {
    return await this.prismaService.device.update({
      where: { id: deviceId },
      data: payload,
    })
  }

  async deleteRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return await this.prismaService.refreshToken.delete({
      where: uniqueObject,
    })
  }
  async updateUser(
    where: { id: number } | { email: string },
    payload: Partial<Omit<UserType, 'id'>>,
  ): Promise<UserType> {
    return await this.prismaService.user.update({
      where,
      data: payload,
    })
  }
  async deleteVerificationCode(
    uniqueObject:
      | { id: number }
      | { email_code_type: { email: string; code: string; type: TypeOfVerificationCodeType } },
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.delete({
      where: uniqueObject,
    })
  }
}
