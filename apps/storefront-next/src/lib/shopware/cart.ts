import { shopwareFetch } from './client'

export type CartItem = {
  id: string
  quantity: number
  name: string
  price: number
}

export const getCart = async (): Promise<CartItem[]> => {
  const data = await shopwareFetch<{ lineItems?: Array<{ id: string; quantity: number; label?: string; price?: { unitPrice?: number } }> }>(
    '/checkout/cart',
    undefined,
    'GET'
  )

  if (!data.lineItems) return []
  return data.lineItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.label || 'Товар',
    price: item.price?.unitPrice ?? 0,
  }))
}
