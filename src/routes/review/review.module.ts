import { Module } from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from 'src/routes/review/review.controller'
import { ReviewRepository } from 'src/routes/review/review.repo'

@Module({
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
})
export class ReviewModule {}
