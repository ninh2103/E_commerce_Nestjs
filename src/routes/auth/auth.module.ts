import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthRepository } from 'src/routes/auth/auth.repo'

@Module({
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
