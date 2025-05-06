import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateBrandBodyDto, GetBrandParamsDto, UpdateBrandBodyDto } from 'src/routes/brand/brand.dto'
import { BrandService } from 'src/routes/brand/brand.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { PaginationType } from 'src/shared/models/request.model'
import { ZodSerializerDto } from 'nestjs-zod'
import { PaginationDto } from 'src/shared/dto/request.dto'

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  async list(@Query() query: PaginationDto) {
    return this.brandService.list(query)
  }

  @Get(':brandId')
  @IsPublic()
  async getById(@Param() params: GetBrandParamsDto) {
    return this.brandService.getById(params.brandId)
  }

  @Post()
  async create(@Body() body: CreateBrandBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandService.create({ createdById: userId, data: body })
  }

  @Put(':brandId')
  async update(
    @Param() params: GetBrandParamsDto,
    @Body() body: UpdateBrandBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.update({ id: params.brandId, updatedById: userId, data: body })
  }

  @Delete(':brandId')
  async delete(@Param() params: GetBrandParamsDto) {
    return this.brandService.delete(params.brandId)
  }
}
