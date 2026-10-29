import { beforeEach, describe, expect, it, vi } from 'vitest'
import { selectShippingMethod } from './checkout'

describe('selectShippingMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('updates the cart context shipping method via PATCH', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, headers: new Headers(), json: async () => ({}) } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await selectShippingMethod('shipping-method-123')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/context',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ shippingMethodId: 'shipping-method-123' }),
      })
    )
  })
})
