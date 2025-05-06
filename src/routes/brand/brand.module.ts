import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandTranslationModule } from './brand-translation/brand-translation.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [BrandTranslationModule]
})
export class BrandModule {}
