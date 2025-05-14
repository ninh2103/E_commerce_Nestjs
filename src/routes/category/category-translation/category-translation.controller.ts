import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { CategoryTranslationService } from 'src/routes/category/category-translation/category-translation.service'
import {
  CreateCategoryTranslationBodyDto,
  GetCategoryTranslationParamsDto,
  UpdateCategoryTranslationBodyDto,
} from 'src/routes/category/category-translation/category-translation.dto'

@Controller('category-translation')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Post()
  async create(@Body() body: CreateCategoryTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.create({ createdById: userId, data: body })
  }

  @Put(':categoryTranslationId')
  async update(
    @Param() params: GetCategoryTranslationParamsDto,
    @Body() body: UpdateCategoryTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.update({
      id: params.categoryTranslationId,
      updatedById: userId,
      data: body,
    })
  }

  @Delete(':categoryTranslationId')
  async delete(@Param() params: GetCategoryTranslationParamsDto) {
    return this.categoryTranslationService.delete(params.categoryTranslationId)
  }

  @Get(':categoryTranslationId')
  @IsPublic()
  async getById(@Param() params: GetCategoryTranslationParamsDto) {
    return this.categoryTranslationService.findById(params.categoryTranslationId)
  }
}
