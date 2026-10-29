import { shopwareFetch } from './client'
import type { ShopwareProduct, StoreApiProductResponse } from './types'

export const getProducts = async (): Promise<ShopwareProduct[]> => {
  const data = await shopwareFetch<StoreApiProductResponse>('/product', { limit: 10 })
  return data.elements.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.calculatedPrice?.unitPrice ?? 0,
  }))
}
