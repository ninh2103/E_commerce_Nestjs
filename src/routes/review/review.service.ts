import { Injectable } from '@nestjs/common'
import { CreateReviewBodyType, UpdateReviewBodyType } from 'src/routes/review/review.model'
import { ReviewRepository } from 'src/routes/review/review.repo'
import { PaginationType } from 'src/shared/models/request.model'

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async create(userId: number, body: CreateReviewBodyType) {
    return this.reviewRepository.create(userId, body)
  }

  async update(userId: number, reviewId: number, body: UpdateReviewBodyType) {
    return this.reviewRepository.update({ userId, reviewId, body })
  }

  async list(productId: number, pagination: PaginationType) {
    return this.reviewRepository.list(productId, pagination)
  }
}
