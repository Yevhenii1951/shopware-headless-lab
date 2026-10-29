import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getProductById } from './products'

describe('getProductById', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('fetches product by id from Store API and maps minimal fields', async () => {
    const mockResponse = {
      id: 'prod-1',
      name: 'Молоток',
      calculatedPrice: { unitPrice: 499 },
      description: 'Крутой молоток',
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    const result = await getProductById('prod-1')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      id: 'prod-1',
      name: 'Молоток',
      price: 499,
      description: 'Крутой молоток',
    })
  })
})
