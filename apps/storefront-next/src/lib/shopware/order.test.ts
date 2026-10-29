import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDemoOrder } from './order'

describe('createDemoOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('creates the order from the current cart context', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        id: 'order-entity-1',
        orderNumber: '1001',
        price: { totalPrice: 19.99 },
      }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await expect(createDemoOrder()).resolves.toEqual({
      id: 'order-entity-1',
      orderNumber: '1001',
      totalPrice: 19.99,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/checkout/order',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({}),
      })
    )
  })
})
