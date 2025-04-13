import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { AuthRepository } from './auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { RegisterBodyType, RegisterResponseType, SendOtpCodeBodyType } from './auth.model'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { genareteCode } from 'src/shared/helpers'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { addMilliseconds, addMinutes } from 'date-fns'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly roleService: RoleService,
    private readonly sharedRepository: SharedRepository,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResponseType> {
    try {
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
      throw new BadRequestException(error)
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
    const verifyCode = await this.authRepository.createVerifyCode({
      code,
      email: body.email,
      type: body.type,
      expiresAt: addMinutes(new Date(), Number(envConfig.VERIFICATION_CODE_EXPIRES_IN)),
    })
    return {
      message: 'OTP code sent to email',
      code: verifyCode.code,
    }
  }
}
