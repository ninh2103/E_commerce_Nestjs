import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { ApiKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { APP_GUARD } from '@nestjs/core'
import { SharedRepository } from './repositorys/shared.repo'
import { HashingService } from 'src/shared/sharedServices/hashing.service'
import { TokenService } from 'src/shared/sharedServices/token.service'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'
import { EmailService } from 'src/shared/sharedServices/email.service'
import { TwoFactorAuthService } from 'src/shared/sharedServices/2fa.service'
import { ShareRoleRepository } from 'src/shared/repositorys/share-role.repo'
import { S3Service } from 'src/shared/sharedServices/s3.service'

const SharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  SharedRepository,
  EmailService,
  TwoFactorAuthService,
  ShareRoleRepository,
  S3Service,
]

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
