import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './services/token.service'
import { AccessTokenGuard } from './guards/access-token.guard'
import { ApiKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { APP_GUARD } from '@nestjs/core'
import { SharedRepository } from './repositorys/shared.repo'

const SharedServices = [PrismaService, HashingService, TokenService, SharedRepository]

@Global()
@Module({
  providers: [
    ...SharedServices,
    ApiKeyGuard,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: SharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
