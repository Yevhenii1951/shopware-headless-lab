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

export type StoreApiProduct = {
  id: string
  name?: string | null
  translated?: {
    name?: string | null
    description?: string | null
  }
  productNumber?: string | null
  calculatedPrice?: {
    unitPrice?: number
  }
  price?: {
    unitPrice?: number
  }
  description?: string | null
}

export type StoreApiProductResponse = {
  elements: StoreApiProduct[]
}

export type ShopwareProductDetail = {
  id: string
  name: string
  price: number
  description?: string | null
}

export type StoreApiProductDetailResponse =
  | StoreApiProduct
  | StoreApiProductResponse
  | { product: StoreApiProduct }
