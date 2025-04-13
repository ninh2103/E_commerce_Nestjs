import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { AuthRepository } from './auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { LoginBodyType, RegisterBodyType, RegisterResponseType, SendOtpCodeBodyType } from './auth.model'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { genareteCode } from 'src/shared/helpers'
import { addMilliseconds } from 'date-fns'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'
import ms from 'ms'
import { EmailService } from 'src/shared/services/email.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
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
}
