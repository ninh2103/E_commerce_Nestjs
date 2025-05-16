import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductRepo } from 'src/routes/product/product.repo'

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepo],
})
export class ProductModule {}
