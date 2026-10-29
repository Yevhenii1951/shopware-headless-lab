import { describe, expect, it, vi, beforeEach } from 'vitest'
import { removeFromCart } from './cart'

describe('removeFromCart', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('removes line item via DELETE to line-item endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ lineItems: [] }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    const result = await removeFromCart('li-123')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/checkout/cart/line-item/li-123',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
        }),
      })
    )
    expect(result).toBeDefined()
  })
})
