import { describe, expect, it, vi, beforeEach } from 'vitest'
import { addToCart } from './cart'

describe('addToCart', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('adds product to cart via POST to line-item endpoint', async () => {
    const mockResponse = {
      lineItems: [{ id: 'li-1', quantity: 1, label: 'Молоток', price: { unitPrice: 499 } }],
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    const result = await addToCart('prod-1', 1)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/checkout/cart/line-item',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(result).toBeDefined()
  })
})
