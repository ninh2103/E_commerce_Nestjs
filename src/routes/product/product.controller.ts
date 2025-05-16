import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import {
  CreateProductBodyDto,
  GetProductParamsDto,
  GetProductQueryDto,
  UpdateProductBodyDto,
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  async getProducts(@Query() query: GetProductQueryDto) {
    return this.productService.list(query)
  }

  @Get(':productId')
  @IsPublic()
  async getProduct(@Param() params: GetProductParamsDto) {
    return this.productService.findById(params.productId)
  }

  @Post()
  async createProduct(@Body() body: CreateProductBodyDto, @ActiveUser('userId') userId: number) {
    return this.productService.create({ createdById: userId, data: body })
  }

  @Put(':productId')
  async updateProduct(
    @Param() params: GetProductParamsDto,
    @Body() body: UpdateProductBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productService.update({ id: params.productId, updatedById: userId, data: body })
  }

  @Delete(':productId')
  async deleteProduct(@Param() params: GetProductParamsDto) {
    return this.productService.delete(params.productId)
  }
}
