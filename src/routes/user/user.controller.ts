import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetUserParamsDto,
  GetUserQueryDto,
  GetUserResDto,
  UpdateUserBodyDto,
} from 'src/routes/user/use.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ActiveRolePermission } from 'src/shared/decorators/active-role-permission.decorator'
import { GetUserProfileDto } from 'src/routes/profile/profile.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUserResDto)
  async list(@Query() query: GetUserQueryDto) {
    return this.userService.list({
      page: query.page,
      limit: query.limit,
    })
  }
  @Get(':userId')
  @ZodSerializerDto(GetUserProfileDto)
  async findById(@Param() params: GetUserParamsDto) {
    return this.userService.findById(Number(params.userId))
  }

  @Post()
  @ZodSerializerDto(CreateUserResDto)
  async create(
    @Body() body: CreateUserBodyDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.create({
      data: body,
      createdById: userId,
      createByRoleName: roleName,
    })
  }

  @Put(':userId')
  @ZodSerializerDto(CreateUserResDto)
  async update(
    @Param() params: GetUserParamsDto,
    @Body() body: UpdateUserBodyDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.update({
      id: params.userId,
      data: body,
      updatedById: userId,
      updatedByRoleName: roleName,
    })
  }
  @Delete(':userId')
  async delete(@Param() params: GetUserParamsDto, @ActiveRolePermission('name') roleName: string) {
    return this.userService.delete({
      id: params.userId,
      deletedByRoleName: roleName,
    })
  }
}
