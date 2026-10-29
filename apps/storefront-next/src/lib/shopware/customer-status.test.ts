import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentCustomer } from './customer'

describe('getCurrentCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('requests the current customer from the Store API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({ email: 'customer@example.com' }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await getCurrentCustomer()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/account/customer',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
