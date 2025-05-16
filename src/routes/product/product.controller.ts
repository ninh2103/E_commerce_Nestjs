import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetProductParamsDto, GetProductQueryDto } from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  async getProducts(@Query() query: GetProductQueryDto) {
    return this.productService.list({ query })
  }

  @Get(':productId')
  @IsPublic()
  async getProduct(@Param() params: GetProductParamsDto) {
    return this.productService.getDetail({ productId: params.productId })
  }
}
