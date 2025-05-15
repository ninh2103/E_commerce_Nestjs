type Variant = {
  value: string
  options: string[]
}

type SKU = {
  value: string
  price: number
  stock: number
  image: string
}

// const variants: Variant[] = [
//   {
//     value: 'red',
//     options: ['100', '200', '300'],
//   },
//   {
//     value: 'blue',
//     options: ['100', '200', '300'],
//   },
// ]

//tạo hàm nhận vào variant trả về mảng skus:SKU[]

//json
// [
//     {
//         "value": "red",
//         "price": 100,
//         "stock": 100,
//         "image": ""
//     },
//     {
//         "value": "blue",
//         "price": 100,
//         "stock": 100,
//         "image": "",
//     },
//     {
//         "value": "blue",
//         "price": 100,
//         "stock": 100,
//         "image": ""
//     }
// ]

type Data = {
  product: {
    publishAt: string | null
    name: string
    basePrice: number
    virtualPrice: number
    brandId: number
    categories: number[]
    images: string[]
    variants: Variant[]
  }
  skus: SKU[]
}

// function generateSKUs(variants: Variant[]): SKU[] {
//   // Đệ quy sinh các tổ hợp
//   const combine = (index: number, current: string[]): string[][] => {
//     if (index === variants.length) return [current]
//     const result: string[][] = []
//     for (const option of variants[index].options) {
//       result.push(...combine(index + 1, [...current, option]))
//     }
//     return result
//   }

//   const combinations = combine(0, [])

//   const skus: SKU[] = combinations.map((combo) => ({
//     value: combo.join('-'),
//     price: 100, // hoặc logic giá tùy ý
//     stock: 100, // hoặc tùy chỉnh
//     image: '', // có thể sinh đường dẫn ảnh dựa vào combo
//   }))

//   return skus
// }

const variants: Variant[] = [
  { value: 'size', options: ['100', '200', '300'] },
  { value: 'color', options: ['blue', 'red'] },
]

//console.log(generateSKUs(variants))
