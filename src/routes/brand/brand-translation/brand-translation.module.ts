import { Module } from '@nestjs/common';
import { BrandTranslationController } from './brand-translation.controller';
import { BrandTranslationService } from './brand-translation.service';

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService]
})
export class BrandTranslationModule {}
