import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreatePermissionBodyDto,
  GetPermissionParamsDto,
  GetPermissionResDetailDto,
  PermissionQueryDto,
  UpdatePermissionBodyDto,
} from 'src/routes/permission/permission.dto'
import { PermissionService } from 'src/routes/permission/permission.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResponseDto } from 'src/shared/dto/message-response.dto'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  getPermissions(@Query() query: PermissionQueryDto) {
    return this.permissionService.list(query)
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionResDetailDto)
  getPermissionById(@Param() params: GetPermissionParamsDto) {
    return this.permissionService.getById(params.permissionId)
  }

  @Post()
  @ZodSerializerDto(CreatePermissionBodyDto)
  createPermission(@Body() body: CreatePermissionBodyDto, @ActiveUser('userId') userId: number) {
    return this.permissionService.create({
      data: body,
      createdById: userId,
    })
  }

  @Put(':permissionId')
  @ZodSerializerDto(UpdatePermissionBodyDto)
  updatePermission(
    @Param() params: GetPermissionParamsDto,
    @Body() body: UpdatePermissionBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      id: params.permissionId,
      data: body,
      updatedById: userId,
    })
  }
  @Delete(':permissionId')
  @ZodSerializerDto(MessageResponseDto)
  deletePermission(@Param() params: GetPermissionParamsDto) {
    return this.permissionService.delete(params.permissionId)
  }
}
