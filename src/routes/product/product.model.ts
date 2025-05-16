import { BrandIncludeTranslationSchema } from 'src/routes/brand/brand.model'
import { CategoryIncludeTranslationSchema } from 'src/routes/category/category.model'
import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model'
import { SKUSchema, UpsertSKUSchema } from 'src/routes/product/sku.model'
import { z } from 'zod'

function generateSKUs(variants: Variant[]): SKU[] {
  // Đệ quy sinh các tổ hợp
  const combine = (index: number, current: string[]): string[][] => {
    if (index === variants.length) return [current]
    const result: string[][] = []
    for (const option of variants[index].options) {
      result.push(...combine(index + 1, [...current, option]))
    }
    return result
  }

  const combinations = combine(0, [])

  const skus: SKU[] = combinations.map((combo) => ({
    value: combo.join('-'),
    price: 100, // hoặc logic giá tùy ý
    stock: 100, // hoặc tùy chỉnh
    image: '', // có thể sinh đường dẫn ảnh dựa vào combo
  }))

  return skus
}

export const variantSchema = z.object({
  value: z.string(),
  options: z.array(z.string()),
})

export type VariantType = z.infer<typeof variantSchema>

export const VariantsSchema = z.array(variantSchema).superRefine((variants, ctx) => {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i]
    const isExist = variants.findIndex((v) => v.value.toLowerCase() === variant.value.toLowerCase()) !== i
    if (isExist) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Variants đã tồn tại',
        path: ['variants', i],
      })
    }
    const isDifferentOptions = variant.options.some((o, i) => {
      const isExist = variant.options.findIndex((v2) => v2.toLowerCase() === o.toLowerCase()) !== i
      return isExist
    })
    if (isDifferentOptions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Variants đã tồn tại',
        path: ['variants'],
      })
    }
  }
})

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  publishAt: z.coerce.date().nullable(),
  variants: VariantsSchema,
  basePrice: z.number().min(0),
  virtualPrice: z.number().min(0),
  brandId: z.number(),
  images: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
})

export type ProductType = z.infer<typeof ProductSchema>

export const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandId: z.array(z.coerce.number().int().positive()).optional(),
  categories: z.array(z.coerce.number().int().positive()).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.coerce.number().int().positive().optional(),
})
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>

export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.coerce.boolean().optional(),
  createdById: z.coerce.number().int().positive(),
})

export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>

export const GetProductsResSchema = z.object({
  data: z.array(
    ProductSchema.extend({
      translations: z.array(ProductTranslationSchema),
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export type GetProductsResType = z.infer<typeof GetProductsResSchema>

export const GetProductParamsSchema = z.object({
  productId: z.coerce.number().int().positive(),
})

export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>

export const GetProductDetailResSchema = ProductSchema.extend({
  translations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryIncludeTranslationSchema),
  brand: BrandIncludeTranslationSchema,
})

export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>

export const CreateProductBodySchema = ProductSchema.pick({
  name: true,
  publishAt: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUSchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const skuValueArray = generateSKUs(variants)

    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'số lượng skus không khớp', path: ['skus'] })
    }
    let wrongSkuIndex = -1
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value
      if (!isValid) {
        wrongSkuIndex = index
      }
      return isValid
    })
    if (!isValidSKUs) {
      return ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'skus không khớp', path: ['skus', wrongSkuIndex] })
    }
  })
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>

export const UpdateProductBodySchema = CreateProductBodySchema

export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
