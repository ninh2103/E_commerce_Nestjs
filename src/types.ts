import { VariantType } from 'src/routes/product/product.model'

declare global {
  namespace PrismaJson {
    type Variants = VariantType
    type Receiver = {
      name: string
      phone: string
      address: string
    }
    type ProductTranslation = {
      id: number
      name: string
      description: string
      languageId: string
    }[]
  }
}

export {}
