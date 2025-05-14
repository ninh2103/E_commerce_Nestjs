import { Controller, Get, Param, Post, Query, Body, Put, Delete } from '@nestjs/common'
import { GetCategoryParamsDto, GetCategoryQueryDto } from 'src/routes/category/category.dto'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from 'src/routes/category/category.model'
import { CategoryService } from 'src/routes/category/category.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  async getAllCategories(@Query() query: GetCategoryQueryDto) {
    return this.categoryService.getAllCategories(query.parentCategoryId ?? null)
  }

  @Get(':categoryId')
  @IsPublic()
  async getCategoryById(@Param() params: GetCategoryParamsDto) {
    return this.categoryService.getCategoryById(params.categoryId)
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryBodyType, @ActiveUser('userId') userId: number) {
    return this.categoryService.createCategory({ createdById: userId, data: createCategoryDto })
  }

  @Put(':categoryId')
  async updateCategory(
    @Param() params: GetCategoryParamsDto,
    @Body() updateCategoryDto: UpdateCategoryBodyType,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryService.updateCategory({ id: params.categoryId, updatedById: userId, data: updateCategoryDto })
  }

  @Delete(':categoryId')
  async deleteCategory(@Param() params: GetCategoryParamsDto) {
    return this.categoryService.deleteCategory({ id: params.categoryId })
  }
}
