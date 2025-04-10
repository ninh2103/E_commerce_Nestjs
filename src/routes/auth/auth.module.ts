import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RoleService } from 'src/routes/auth/role.service'

@Module({
  providers: [AuthService, RoleService],
  controllers: [AuthController],
})
export class AuthModule {}
