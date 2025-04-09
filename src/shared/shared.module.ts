import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './services/token.service'

const SharedServices = [PrismaService, HashingService, TokenService]

@Global()
@Module({
  providers: SharedServices,
  exports: SharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
