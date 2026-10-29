import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getCart } from './cart'

describe('getCart', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('fetches cart from Store API with sw-access-key header', async () => {
    const mockResponse = {
      lineItems: [
        { id: 'li-1', quantity: 1, label: 'Молоток', price: { unitPrice: 499 } },
      ],
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    const result = await getCart()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/checkout/cart',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
        }),
      })
    )
    expect(result).toEqual([
      { id: 'li-1', quantity: 1, name: 'Молоток', price: 499 },
    ])
  })
})
