import { shopwareFetch } from './client'
import type { ShopwareCategory, StoreApiCategoryResponse } from './types'

export const getCategories = async (): Promise<ShopwareCategory[]> => {
  const data = await shopwareFetch<StoreApiCategoryResponse>('/category', { limit: 10 })
  return data.elements.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }))
}
