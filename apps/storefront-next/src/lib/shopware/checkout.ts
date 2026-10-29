import { z } from 'zod'
import { shopwareCartFetch } from './cart-client'

export type CheckoutMethod = {
  id: string
  name: string
}

export interface CheckoutContext {
  paymentMethodId: string
  shippingMethodId: string
  billingAddressId?: string
  shippingAddressId?: string
}

export interface CheckoutAddressSelection {
  billingAddressId: string
  shippingAddressId: string
}

const checkoutAddressSelectionSchema = z.object({
  billingAddressId: z.string().regex(/^[0-9a-f]{32}$/i),
  shippingAddressId: z.string().regex(/^[0-9a-f]{32}$/i),
})

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

export const selectCheckoutAddresses = async (
  billingAddressId: string,
  shippingAddressId: string
): Promise<unknown> => {
  return shopwareCartFetch<unknown>(
    '/context',
    { billingAddressId, shippingAddressId },
    'PATCH',
    true
  )
}

export const parseCheckoutAddressSelection = (
  input: unknown
): CheckoutAddressSelection | null => {
  const result = checkoutAddressSelectionSchema.safeParse(input)
  return result.success ? result.data : null
}

export const getCheckoutContext = async (): Promise<CheckoutContext> => {
  const data = await shopwareCartFetch<{
    paymentMethod: { id: string }
    shippingMethod: { id: string }
    customer?: {
      activeBillingAddress?: { id: string }
      activeShippingAddress?: { id: string }
    }
  }>('/context', undefined, 'GET')
  return {
    paymentMethodId: data.paymentMethod.id,
    shippingMethodId: data.shippingMethod.id,
    billingAddressId: data.customer?.activeBillingAddress?.id,
    shippingAddressId: data.customer?.activeShippingAddress?.id,
  }
}
