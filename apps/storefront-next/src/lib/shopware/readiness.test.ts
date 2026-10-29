import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { evaluateCheckoutReadiness, getCheckoutReadiness } from './readiness'

const completeContext = {
  paymentMethodId: 'payment-1',
  shippingMethodId: 'shipping-1',
  billingAddressId: 'address-1',
  shippingAddressId: 'address-1',
}

describe('evaluateCheckoutReadiness', () => {
  it('reports ready for a complete authenticated checkout context', () => {
    expect(evaluateCheckoutReadiness([{ id: 'item-1', quantity: 1, name: 'Товар', price: 19.99 }], completeContext)).toEqual({
      ready: true,
      missing: [],
    })
  })

  it('reports an empty cart', () => {
    expect(evaluateCheckoutReadiness([], completeContext)).toEqual({
      ready: false,
      missing: ['cart'],
    })
  })

  it('reports missing addresses for a guest context', () => {
    const context = {
      paymentMethodId: 'payment-1',
      shippingMethodId: 'shipping-1',
    }

    expect(evaluateCheckoutReadiness([{ id: 'item-1', quantity: 1, name: 'Товар', price: 19.99 }], context)).toEqual({
      ready: false,
      missing: ['billingAddress', 'shippingAddress'],
    })
  })

  it('reports missing payment and shipping methods', () => {
    const context = {
      billingAddressId: 'address-1',
      shippingAddressId: 'address-1',
    }

    expect(evaluateCheckoutReadiness([{ id: 'item-1', quantity: 1, name: 'Товар', price: 19.99 }], context)).toEqual({
      ready: false,
      missing: ['paymentMethod', 'shippingMethod'],
    })
  })
})

describe('getCheckoutReadiness', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads cart and context from the Store API before evaluating readiness', async () => {
    const fetchMock = vi.fn((url: string | URL) => {
      const path = String(url)
      if (path.endsWith('/checkout/cart')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers(),
          json: async () => ({ lineItems: [{ id: 'item-1', quantity: 1, label: 'Товар', price: { unitPrice: 19.99 } }] }),
        } as Response)
      }

      return Promise.resolve({
        ok: true,
        headers: new Headers(),
        json: async () => ({
          paymentMethod: { id: 'payment-1' },
          shippingMethod: { id: 'shipping-1' },
          customer: {
            activeBillingAddress: { id: 'address-1' },
            activeShippingAddress: { id: 'address-1' },
          },
        }),
      } as Response)
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCheckoutReadiness()).resolves.toEqual({ ready: true, missing: [] })

    const urls = fetchMock.mock.calls.map(([url]) => String(url)).sort()
    expect(urls).toEqual([
      'http://localhost:8000/store-api/checkout/cart',
      'http://localhost:8000/store-api/context',
    ])
  })
})
