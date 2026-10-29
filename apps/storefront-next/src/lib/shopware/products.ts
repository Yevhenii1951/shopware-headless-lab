import { shopwareFetch } from './client'
import type {
  ShopwareProduct,
  ShopwareProductDetail,
  StoreApiProduct,
  StoreApiProductDetailResponse,
  StoreApiProductResponse,
} from './types'

const mapProduct = (product: StoreApiProduct): ShopwareProduct => ({
  id: product.id,
  name: product.name || product.translated?.name || product.productNumber || 'Без названия',
  price: product.calculatedPrice?.unitPrice ?? product.price?.unitPrice ?? 0,
})

export const getProducts = async (categoryId?: string): Promise<ShopwareProduct[]> => {
  'use cache'

  const criteria = categoryId
    ? {
        limit: 10,
        filter: [
          {
            type: 'equals',
            field: 'categories.id',
            value: categoryId,
          },
        ],
      }
    : { limit: 10 }
  const data = await shopwareFetch<StoreApiProductResponse>('/product', criteria)
  return data.elements.map(mapProduct)
}

export const getProductById = async (id: string): Promise<ShopwareProductDetail> => {
  'use cache'

  const data = await shopwareFetch<StoreApiProductDetailResponse>('/product', { ids: [id] })
  const product = getProduct(data)
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

const getProduct = (data: StoreApiProductDetailResponse): StoreApiProduct => {
  if ('elements' in data) return data.elements[0] ?? { id: '' }
  if ('product' in data) return data.product
  return data
}
