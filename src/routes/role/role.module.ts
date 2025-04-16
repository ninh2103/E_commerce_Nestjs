import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleRepo } from 'src/routes/role/role.repo'
import { RoleController } from 'src/routes/role/role.controller'

@Module({
  providers: [RoleService, RoleRepo],
  controllers: [RoleController],
})
export class RoleModule {}
