import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loginCustomer } from './customer'

describe('loginCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('sends customer credentials to the Store API login endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'sw-context-token': 'new-context-token' }),
      json: async () => ({ contextToken: 'new-context-token' }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await loginCustomer('customer@example.com', 'password')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/account/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'customer@example.com', password: 'password' }),
      })
    )
  })
})
