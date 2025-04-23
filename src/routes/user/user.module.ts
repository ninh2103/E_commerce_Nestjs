import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { HashingService } from 'src/shared/sharedServices/hashing.service'
import { ShareRoleRepository } from 'src/shared/repositorys/share-role.repo'
import { SharedModule } from 'src/shared/shared.module'
import { UserRepository } from 'src/routes/user/user.repo'

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, SharedRepository, HashingService, ShareRoleRepository],
})
export class UserModule {}
