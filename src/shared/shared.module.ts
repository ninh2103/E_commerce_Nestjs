import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'

const SharedServices = [PrismaService, HashingService]

@Global()
@Module({
  providers: SharedServices,
  exports: SharedServices,
})
export class SharedModule {}
