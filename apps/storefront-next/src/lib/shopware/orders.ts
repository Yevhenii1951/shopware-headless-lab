import { shopwareCartFetch } from './cart-client'

export interface DemoOrderSummary {
  id: string
  orderNumber: string
  totalPrice: number
  state: string
}

interface StoreApiOrderListResponse {
  orders: {
    elements: Array<{
      id: string
      orderNumber: string
      price: { totalPrice: number }
      stateMachineState?: { technicalName: string }
      transactions: Array<{ stateMachineState?: { technicalName: string } }> | null
    }>
  }
}

// The endpoint wraps orders in EntitySearchResult despite the OpenAPI schema describing an array,
// and orders without a captured transaction ship `transactions: null`.
export const getCustomerOrders = async (): Promise<DemoOrderSummary[]> => {
  const data = await shopwareCartFetch<StoreApiOrderListResponse>('/order')

  return data.orders.elements.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    totalPrice: order.price.totalPrice,
    state:
      order.transactions?.[0]?.stateMachineState?.technicalName ??
      order.stateMachineState?.technicalName ??
      '',
  }))
}
