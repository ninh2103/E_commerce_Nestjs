import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { RoleService } from 'src/routes/auth/role.service'
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  RegisterResponseType,
  SendOtpCodeBodyType,
} from './auth.model'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { genareteCode } from 'src/shared/helpers'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import { EmailService } from 'src/shared/sharedServices/email.service'
import { TokenService } from 'src/shared/sharedServices/token.service'
import { HashingService } from 'src/shared/sharedServices/hashing.service'
import { AuthRepository } from 'src/routes/auth/auth.repo'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly roleService: RoleService,
    private readonly sharedRepository: SharedRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResponseType> {
    try {
      const verifyCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        type: VerificationCodeType.REGISTER,
        code: body.code,
      })
      if (!verifyCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Invalid verification code',
            path: ['code'],
          },
        ])
      }
      if (verifyCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'Verification code expired',
            path: ['code'],
          },
        ])
      }
      const hashPassword = await this.hashingService.hash(body.password)
      const roleId = await this.roleService.getClientRoleId()
      const user = await this.authRepository.createUser({
        email: body.email,
        password: hashPassword,
        name: body.name,
        phoneNumber: body.phoneNumber,
        roleId,
      })
      return user
    } catch (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Email already exists',
          path: ['email'],
        },
      ])
    }
  }
  async sendOtpCode(body: SendOtpCodeBodyType) {
    const user = await this.sharedRepository.findUnique({ email: body.email })
    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email already exists',
          path: ['email'],
        },
      ])
    }

    const code = genareteCode()
    const verifyCode = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    })
    const { error } = await this.emailService.sendEmail({
      email: body.email,
      code,
    })
    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Failed to send email',
          path: ['email'],
        },
      ])
    }

    return {
      message: 'OTP code sent to email',
      verifyCode,
    }
  }
  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email })
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'User not found',
          path: ['email'],
        },
      ])
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          message: 'Invalid password',
          path: ['password'],
        },
      ])
    }
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
      lastActiveAt: new Date(),
      isActive: true,
    })
    const tokens = await this.GenerateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    })
    return tokens
  }

  async GenerateTokens(payload: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId: payload.userId,
        roleId: payload.roleId,
        roleName: payload.roleName,
        deviceId: payload.deviceId,
      }),
      this.tokenService.signRefreshToken({ userId: payload.userId }),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId: payload.userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId: payload.deviceId,
    })
    return {
      accessToken,
      refreshToken,
    }
  }
  async refreshToken({ refreshToken, ip, userAgent }: RefreshTokenBodyType & { ip: string; userAgent: string }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      if (!userId) {
        throw new UnprocessableEntityException([{ message: 'Invalid refresh token', path: ['refreshToken'] }])
      }
      const refreshTokeninDB = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken,
      })
      if (!refreshTokeninDB) {
        throw new UnauthorizedException([{ message: 'Refresh token not found', path: ['refreshToken'] }])
      }
      const {
        deviceId,
        user: { roleId, name: roleName },
      } = refreshTokeninDB

      const $updatedDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent,
      })

      const $deletedRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })

      const $tokens = this.GenerateTokens({
        userId,
        deviceId,
        roleId,
        roleName,
      })

      const [, , tokens] = await Promise.all([$deletedRefreshToken, $updatedDevice, $tokens])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnprocessableEntityException([{ message: 'Invalid refresh token', path: ['refreshToken'] }])
    }
  }
}
