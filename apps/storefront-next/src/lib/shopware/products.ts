import { shopwareFetch } from './client'
import type { ShopwareProduct, StoreApiProductResponse, ShopwareProductDetail, StoreApiProductDetailResponse } from './types'

export const getProducts = async (): Promise<ShopwareProduct[]> => {
  const data = await shopwareFetch<StoreApiProductResponse>('/product', { limit: 10 })
  return data.elements.map((product: any) => ({
    id: product.id,
    name: product.name || product.translated?.name || product.productNumber || 'Без названия',
    price: product.calculatedPrice?.unitPrice ?? product.price?.unitPrice ?? 0,
  }))
}

export const getProductById = async (id: string): Promise<ShopwareProductDetail> => {
  const data = await shopwareFetch<any>('/product', { ids: [id] })
  const product = data.elements?.[0] || data.product || data
  const name = product.name || product.translated?.name || product.productNumber || ''
  const price = product.calculatedPrice?.unitPrice ?? product.price?.unitPrice ?? 0
  const description = product.description || product.translated?.description || null

  return {
    id: product.id || id,
    name,
    price,
    description,
  }
}
