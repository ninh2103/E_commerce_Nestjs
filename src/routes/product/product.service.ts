import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { GetProductsQueryType } from 'src/routes/product/product.model'
import { ProductRepo } from 'src/routes/product/product.repo'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async list(props: { query: GetProductsQueryType }) {
    const products = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
      name: props.query.name,
      brandIds: props.query.brandId,
      categories: props.query.categories,
      minPrice: props.query.minPrice,
      maxPrice: props.query.maxPrice,
      createdById: props.query.createdById,
      orderBy: props.query.orderBy,
      sortBy: props.query.sortBy,
    })
    return products
  }

  async getDetail(props: { productId: number }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    })
    return product
  }
}
