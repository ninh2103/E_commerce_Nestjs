import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ProductTranslationService } from 'src/routes/product/product-translation/product-translation.service'
import {
  CreateProductTranslationBodyDto,
  GetProductTranslationParamsDto,
  UpdateProductTranslationBodyDto,
} from 'src/routes/product/product-translation/product-translation.dto'

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Post()
  async create(@Body() body: CreateProductTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create({ createdById: userId, data: body })
  }

  @Put(':productTranslationId')
  async update(
    @Param() params: GetProductTranslationParamsDto,
    @Body() body: UpdateProductTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.update({
      id: params.productTranslationId,
      updatedById: userId,
      data: body,
    })
  }

  @Delete(':productTranslationId')
  async delete(@Param() params: GetProductTranslationParamsDto) {
    return this.productTranslationService.delete(params.productTranslationId)
  }

  @Get(':productTranslationId')
  @IsPublic()
  async getById(@Param() params: GetProductTranslationParamsDto) {
    return this.productTranslationService.findById(params.productTranslationId)
  }
}
