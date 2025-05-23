import { VariantType } from 'src/routes/product/product.model'

declare global {
  namespace PrismaJson {
    type Variants = VariantType
    type Receiver = {
      name: string
      phoneNumber: string
      email: string
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
