import { shopwareCartFetch } from './cart-client'

export interface DemoOrder {
  id: string
  orderNumber: string
  totalPrice: number
}

interface StoreApiOrderResponse {
  id: string
  orderNumber: string
  price: { totalPrice: number }
}

export const createDemoOrder = async (): Promise<DemoOrder> => {
  const order = await shopwareCartFetch<StoreApiOrderResponse>(
    '/checkout/order',
    {},
    'POST',
    true
  )
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    totalPrice: order.price.totalPrice,
  }
}
