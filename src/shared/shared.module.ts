import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

const SharedServices = [PrismaService]

@Global()
@Module({
  providers: SharedServices,
  exports: SharedServices,
})
export class SharedModule {}
