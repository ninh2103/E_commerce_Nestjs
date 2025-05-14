import { Module } from '@nestjs/common'
import { CategoryTranslationService } from './category-translation.service'
import { CategoryTranslationController } from './category-translation.controller'
import { CategoryTranslationRepo } from 'src/routes/category/category-translation/category-translation.repo'

@Module({
  providers: [CategoryTranslationService, CategoryTranslationRepo],
  controllers: [CategoryTranslationController],
})
export class CategoryTranslationModule {}
