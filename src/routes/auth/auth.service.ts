import { BadRequestException, Injectable } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { AuthRepository } from './auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { RegisterBodyType, RegisterResponseType, SendOtpCodeBodyType } from './auth.model'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly roleService: RoleService,
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
  async sendOtpCode(body: SendOtpCodeBodyType) {}
}
