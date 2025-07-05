import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ReviewService } from 'src/routes/review/review.service'
import { CreateReviewBodyType, UpdateReviewBodyType } from 'src/routes/review/review.model'
import { GetReviewDetailParamDto, GetReviewParamDto } from 'src/routes/review/review.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ApiParam } from '@nestjs/swagger'
import { PaginationDto } from 'src/shared/dto/request.dto'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@ActiveUser('userId') userId: number, @Body() body: CreateReviewBodyType) {
    return this.reviewService.create(userId, body)
  }

  @Put(':reviewId')
  async update(
    @ActiveUser('userId') userId: number,
    @Param() param: GetReviewDetailParamDto,
    @Body() body: UpdateReviewBodyType,
  ) {
    return this.reviewService.update(userId, param.reviewId, body)
  }

  @Get('/product/:productId')
  @IsPublic()
  @ApiParam({ name: 'productId', type: String, description: 'ID của sản phẩm' })
  async list(@Param() param: GetReviewParamDto, @Query() query: PaginationDto) {
    return this.reviewService.list(param.productId, query)
  }
}
