import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ManageProductService } from 'src/routes/product/manage-product.service'
import {
  CreateProductBodyDto,
  GetManageProductQueryDto,
  GetProductParamsDto,
  UpdateProductBodyDto,
} from 'src/routes/product/product.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('manage-product/products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  async getProducts(@Query() query: GetManageProductQueryDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.list({ query, userIdRequest: user.userId, roleNameRequest: user.roleName })
  }

  @Get(':productId')
  async getProduct(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.getDetail({
      productId: params.productId,
      userIdRequest: user.userId,
      roleNameRequest: user.roleName,
    })
  }

  @Post()
  async createProduct(@Body() body: CreateProductBodyDto, @ActiveUser('userId') userId: number) {
    return this.manageProductService.create({ createdById: userId, data: body })
  }

  @Put(':productId')
  async updateProduct(
    @Param() params: GetProductParamsDto,
    @Body() body: UpdateProductBodyDto,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.update({
      productId: params.productId,
      updatedById: user.userId,
      data: body,
      roleNameRequest: user.roleName,
    })
  }

  @Delete(':productId')
  async deleteProduct(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.delete(params.productId, user.roleName, user.userId)
  }
}
