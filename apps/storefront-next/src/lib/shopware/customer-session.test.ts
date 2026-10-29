import { beforeEach, describe, expect, it, vi } from 'vitest'
import { logoutCustomer } from './customer'

describe('logoutCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('ends the customer session via the Store API logout endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({}),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await logoutCustomer()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/account/logout',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
