import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateCartItemQuantity } from './cart'

describe('updateCartItemQuantity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('updates a line item quantity via PATCH', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({ lineItems: [] }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await updateCartItemQuantity('line-item-123', 2)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/checkout/cart/line-item',
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          items: [{ id: 'line-item-123', quantity: 2 }],
        }),
      })
    )
  })
})
