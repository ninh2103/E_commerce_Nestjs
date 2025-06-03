import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateRoleResDto,
  GetRoleDetailResDto,
  GetRoleResDto,
  RoleQueryDto,
  RoleParamsDto,
} from 'src/routes/role/role.dto'
import { CreateRoleBodyType, RoleParamsType, RoleQueryType, UpdateRoleBodyType } from 'src/routes/role/role.model'
import { RoleService } from 'src/routes/role/role.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async list(@Query() query: RoleQueryDto) {
    return this.roleService.list(query)
  }
  @Get(':roleId')
  async getById(@Param() params: RoleParamsDto) {
    return this.roleService.getById(params.roleId)
  }

  @Post()
  async create(@Body() body: CreateRoleBodyType, @ActiveUser('userId') userId: number) {
    return this.roleService.create(body, userId)
  }

  @Put(':roleId')
  async update(@Param() params: RoleParamsDto, @Body() body: UpdateRoleBodyType, @ActiveUser('userId') userId: number) {
    return this.roleService.update({ id: params.roleId, data: body, updatedById: userId })
  }

  @Delete(':roleId')
  async delete(@Param() params: RoleParamsDto) {
    return this.roleService.delete(params.roleId)
  }
}
