export type ShopwareCategory = {
  id: string
  name: string
}

export type StoreApiCategoryResponse = {
  elements: ShopwareCategory[]
}

export type ShopwareProduct = {
  id: string
  name: string
  price: number
}

export type StoreApiProductResponse = {
  elements: Array<{
    id: string
    name: string
    calculatedPrice?: {
      unitPrice?: number
    }
  }>
}

export type ShopwareProductDetail = {
  id: string
  name: string
  price: number
  description?: string | null
}

export type StoreApiProductDetailResponse = {
  id: string
  name: string
  calculatedPrice?: {
    unitPrice?: number
  }
  description?: string | null
}
