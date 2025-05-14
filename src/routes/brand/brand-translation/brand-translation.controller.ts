import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common'
import { BrandTranslationService } from './brand-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import {
  CreateBrandTranslationBodyDto,
  UpdateBrandTranslationBodyDto,
} from 'src/routes/brand/brand-translation/brand-translation.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Post()
  async create(@Body() body: CreateBrandTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create({ createdById: userId, data: body })
  }

  @Put(':brandTranslationId')
  async update(
    @Param('brandTranslationId') brandTranslationId: string,
    @Body() body: UpdateBrandTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.update({
      id: parseInt(brandTranslationId),
      updatedById: userId,
      data: body,
    })
  }

  @Delete(':brandTranslationId')
  async delete(@Param('brandTranslationId') brandTranslationId: string) {
    return this.brandTranslationService.delete(parseInt(brandTranslationId))
  }

  @Get(':brandTranslationId')
  @IsPublic()
  async getById(@Param('brandTranslationId') brandTranslationId: string) {
    return this.brandTranslationService.findById(parseInt(brandTranslationId))
  }
}
