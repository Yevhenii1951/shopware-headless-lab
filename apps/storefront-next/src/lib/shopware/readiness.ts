import { getCart, CartItem } from './cart'
import { getCheckoutContext, CheckoutContext } from './checkout'

export interface CheckoutReadiness {
  ready: boolean
  missing: ReadinessCode[]
}

export type ReadinessCode = 'cart' | 'billingAddress' | 'shippingAddress' | 'paymentMethod' | 'shippingMethod'

type ReadinessContext = Partial<CheckoutContext>

export const evaluateCheckoutReadiness = (
  items: CartItem[],
  context: ReadinessContext | null
): CheckoutReadiness => {
  const missing: ReadinessCode[] = []
  if (items.length === 0) missing.push('cart')
  if (!context?.billingAddressId) missing.push('billingAddress')
  if (!context?.shippingAddressId) missing.push('shippingAddress')
  if (!context?.paymentMethodId) missing.push('paymentMethod')
  if (!context?.shippingMethodId) missing.push('shippingMethod')

  return { ready: missing.length === 0, missing }
}

export const getCheckoutReadiness = async (): Promise<CheckoutReadiness> => {
  const [items, context] = await Promise.all([
    getCart(),
    getCheckoutContext(),
  ])
  return evaluateCheckoutReadiness(items, context)
}
