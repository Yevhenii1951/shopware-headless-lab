import { beforeEach, describe, expect, it, vi } from 'vitest'
import { selectPaymentMethod } from './checkout'

describe('selectPaymentMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('updates the cart context payment method via PATCH', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({}),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await selectPaymentMethod('payment-method-123')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/context',
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ paymentMethodId: 'payment-method-123' }),
      })
    )
  })
})
