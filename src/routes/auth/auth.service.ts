import { HttpException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ShareRoleRepository } from 'src/shared/repositorys/share-role.repo'
import {
  Disable2FaBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  RegisterResponseType,
  SendOtpCodeBodyType,
} from './auth.model'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { genareteCode, isNotFoundPrismaError, isUniqueContraintPrismaError } from 'src/shared/helpers'
import { TypeOfVerificationCodeType, UserStatus, VerificationCodeType } from 'src/shared/constants/auth.constant'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import { EmailService } from 'src/shared/sharedServices/email.service'
import { TokenService } from 'src/shared/sharedServices/token.service'
import { HashingService } from 'src/shared/sharedServices/hashing.service'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOtpException,
  InvalidOtpException,
  InvalidTOTPCodeAndCodeException,
  InvalidTOTPCodeException,
  OtpExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPCodeAlreadyEnabledException,
  TOTPCodeNotEnabledException,
  UnAuthorizedAccessException,
} from 'src/routes/auth/error.auth'
import ms from 'ms'
import { addMilliseconds } from 'date-fns'
import { TwoFactorAuthService } from 'src/shared/sharedServices/2fa.service'
import { InvalidPasswordException } from 'src/shared/errors'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly shareRoleRepository: ShareRoleRepository,
    private readonly sharedRepository: SharedRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  async validateVerifyCode({ email, type, code }: { email: string; type: TypeOfVerificationCodeType; code: string }) {
    const verifyCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        type,
        code,
      },
    })
    if (!verifyCode) {
      throw InvalidOtpException
    }
    if (verifyCode.expiresAt < new Date()) {
      throw OtpExpiredException
    }
    return verifyCode
  }

  async register(body: RegisterBodyType): Promise<RegisterResponseType> {
    try {
      await this.validateVerifyCode({ email: body.email, type: VerificationCodeType.REGISTER, code: body.code })
      const hashPassword = await this.hashingService.hash(body.password)
      const roleId = await this.shareRoleRepository.getClientRoleId()

      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          password: hashPassword,
          name: body.name,
          phoneNumber: body.phoneNumber,
          roleId,
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            type: VerificationCodeType.REGISTER,
            code: body.code,
          },
        }),
      ])
      return user
    } catch (error) {
      if (isUniqueContraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }
  async sendOtpCode(body: SendOtpCodeBodyType) {
    const user = await this.sharedRepository.findUnique({ email: body.email })
    if (body.type === VerificationCodeType.REGISTER && user) {
      throw EmailAlreadyExistsException
    }
    if (body.type === VerificationCodeType.FORGOT_PASSWORD && !user) {
      throw EmailNotFoundException
    }

    const code = genareteCode()
    await this.authRepository.createVerifyCode({
      email: body.email,
      type: body.type,
      code,
      expiresAt: addMilliseconds(new Date(), ms('5m')),
    })
    await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    })
    const { error } = await this.emailService.sendEmail({
      email: body.email,
      code,
    })
    if (error) {
      throw FailedToSendOtpException
    }

    return {
      message: 'OTP code sent to email',
    }
  }
  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email })
    if (!user) {
      throw EmailNotFoundException
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw InvalidPasswordException
    }

    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPCodeAndCodeException
      }
      if (body.totpCode) {
        const isTOTPCodeValid = this.twoFactorAuthService.verifyTOTP({
          email: user.email,
          token: body.totpCode,
          secret: user.totpSecret,
        })
        if (!isTOTPCodeValid) {
          throw InvalidTOTPCodeException
        }
      } else if (body.code) {
        await this.validateVerifyCode({ email: user.email, type: VerificationCodeType.LOGIN, code: body.code })
      }
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
        throw RefreshTokenAlreadyUsedException
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
      throw UnAuthorizedAccessException
    }
  }
  async logout(body: LogoutBodyType) {
    const { refreshToken } = body
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)

      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })

      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      })

      return {
        message: 'Logout successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnAuthorizedAccessException
    }
  }
  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, code, newPassword } = body
    const user = await this.sharedRepository.findUnique({ email })
    if (!user) {
      throw EmailNotFoundException
    }
    await this.validateVerifyCode({ email, type: VerificationCodeType.FORGOT_PASSWORD, code })
    const hashPassword = await this.hashingService.hash(newPassword)

    await Promise.all([
      this.sharedRepository.update({ id: user.id }, { password: hashPassword, updatedById: user.id }),
      this.authRepository.deleteVerificationCode({
        email_code_type: {
          email,
          type: VerificationCodeType.FORGOT_PASSWORD,
          code,
        },
      }),
    ])

    return {
      message: 'Password updated successfully',
    }
  }

  async setup2FA(userId: number) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ id: userId })
    if (!user) {
      throw EmailNotFoundException
    }
    if (user.totpSecret) {
      throw TOTPCodeAlreadyEnabledException
    }
    const { secret, uri } = this.twoFactorAuthService.generateTOTP(user.email)
    await this.sharedRepository.update({ id: user.id }, { totpSecret: secret, updatedById: user.id })
    return {
      secret,
      uri,
    }
  }
  async disable2FA(body: Disable2FaBodyType & { userId: number }) {
    const { userId, code, totpCode } = body
    const user = await this.sharedRepository.findUnique({ id: userId })
    if (!user) {
      throw EmailNotFoundException
    }
    if (!user.totpSecret) {
      throw TOTPCodeNotEnabledException
    }
    if (code) {
      const verifyCode = await this.validateVerifyCode({
        email: user.email,
        type: VerificationCodeType.DISABLE_2FA,
        code,
      })
      if (verifyCode.expiresAt < new Date()) {
        throw OtpExpiredException
      }
    } else if (totpCode) {
      const isTOTPCodeValid = this.twoFactorAuthService.verifyTOTP({
        email: user.email,
        token: totpCode,
        secret: user.totpSecret,
      })
      if (!isTOTPCodeValid) {
        throw InvalidTOTPCodeException
      }
    }
    await this.sharedRepository.update({ id: user.id }, { totpSecret: null, updatedById: user.id })
    return {
      message: '2FA disabled successfully',
    }
  }
}
