import { shopwareFetch } from './client'
import type { ShopwareProduct, StoreApiProductResponse, ShopwareProductDetail, StoreApiProductDetailResponse } from './types'
import type { ShopwareProduct, StoreApiProductResponse } from './types'

export const getProducts = async (): Promise<ShopwareProduct[]> => {
  const data = await shopwareFetch<StoreApiProductResponse>('/product', { limit: 10 })
  return data.elements.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.calculatedPrice?.unitPrice ?? 0,
  }))
}

export const getProductById = async (id: string): Promise<ShopwareProductDetail> => {
  const data = await shopwareFetch<StoreApiProductDetailResponse>(`/product/${id}`)
  return {
    id: data.id,
    name: data.name,
    price: data.calculatedPrice?.unitPrice ?? 0,
    description: data.description ?? null,
  }
}
