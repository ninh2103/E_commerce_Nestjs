import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleRepository } from 'src/routes/role/role.repo'
import { RoleController } from 'src/routes/role/role.controller'

@Module({
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
})
export class RoleModule {}
