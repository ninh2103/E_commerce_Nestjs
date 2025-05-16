import { VariantType } from 'src/routes/product/product.model'

declare global {
  namespace PrismaJson {
    type Variants = VariantType
  }
}

export {}
