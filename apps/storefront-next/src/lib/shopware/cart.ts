import { shopwareCartFetch } from './cart-client'

export type CartItem = {
  id: string
  quantity: number
  name: string
  price: number
}

export const getCart = async (): Promise<CartItem[]> => {
  const data = await shopwareCartFetch<{ lineItems?: Array<{ id: string; quantity: number; label?: string; price?: { unitPrice?: number } }> }>(
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

export const addToCart = async (productId: string, quantity: number = 1) => {
  const data = await shopwareCartFetch<{ lineItems?: CartItem[] }>(
    '/checkout/cart/line-item',
    {
      items: [
        {
          id: productId,
          type: 'product',
          quantity,
        },
      ],
    },
    'POST',
    true
  )
  return data
}

export const removeFromCart = async (lineItemId: string) => {
  const data = await shopwareCartFetch<unknown>(
    `/checkout/cart/line-item/${lineItemId}`,
    undefined,
    'DELETE',
    true
  )
  return data
}

export const updateCartItemQuantity = async (
  lineItemId: string,
  quantity: number
): Promise<unknown> => {
  return shopwareCartFetch<unknown>(
    '/checkout/cart/line-item',
    {
      items: [{ id: lineItemId, quantity }],
    },
    'PATCH',
    true
  )
}
