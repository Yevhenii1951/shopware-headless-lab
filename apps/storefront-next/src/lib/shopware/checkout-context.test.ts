import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCheckoutContext } from './checkout'

describe('getCheckoutContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('returns selected shipping and payment method IDs from Store API context', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({ paymentMethod: { id: 'payment-1' }, shippingMethod: { id: 'shipping-1' } }),
    } as Response))

    await expect(getCheckoutContext()).resolves.toEqual({ paymentMethodId: 'payment-1', shippingMethodId: 'shipping-1' })
  })
})
