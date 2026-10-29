import { shopwareCartFetch } from './cart-client'

export type CheckoutMethod = {
  id: string
  name: string
}

export type CheckoutContext = {
  paymentMethodId: string
  shippingMethodId: string
}

type StoreApiMethodResponse = {
  elements: Array<{
    id: string
    name?: string
    translated?: { name?: string }
  }>
}

const mapMethods = (data: StoreApiMethodResponse): CheckoutMethod[] => {
  return data.elements.map((method) => ({
    id: method.id,
    name: method.translated?.name || method.name || 'Без названия',
  }))
}

export const getAvailablePaymentMethods = async (): Promise<CheckoutMethod[]> => {
  const data = await shopwareCartFetch<StoreApiMethodResponse>('/payment-method?onlyAvailable=1', {})
  return mapMethods(data)
}

export const getAvailableShippingMethods = async (): Promise<CheckoutMethod[]> => {
  const data = await shopwareCartFetch<StoreApiMethodResponse>('/shipping-method?onlyAvailable=1', {})
  return mapMethods(data)
}

export const selectPaymentMethod = async (paymentMethodId: string): Promise<unknown> => {
  return shopwareCartFetch<unknown>('/context', { paymentMethodId }, 'PATCH', true)
}

export const selectShippingMethod = async (shippingMethodId: string): Promise<unknown> => {
  return shopwareCartFetch<unknown>('/context', { shippingMethodId }, 'PATCH', true)
}

export const getCheckoutContext = async (): Promise<CheckoutContext> => {
  const data = await shopwareCartFetch<{
    paymentMethod: { id: string }
    shippingMethod: { id: string }
  }>('/context', undefined, 'GET')
  return {
    paymentMethodId: data.paymentMethod.id,
    shippingMethodId: data.shippingMethod.id,
  }
}
