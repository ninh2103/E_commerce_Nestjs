export const ALL_LANGUAGE = 'all'

export const ProductOrderBy = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type ProductOrderByType = (typeof ProductOrderBy)[keyof typeof ProductOrderBy]

export const ProductSortBy = {
  PRICE: 'price',
  CREATED_AT: 'createdAt',
  SALE: 'sale',
} as const

export type ProductSortByType = (typeof ProductSortBy)[keyof typeof ProductSortBy]
