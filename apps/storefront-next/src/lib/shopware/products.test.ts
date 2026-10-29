import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getProducts } from './products'

describe('getProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('fetches products from Store API with sw-access-key header and maps minimal fields', async () => {
    const mockResponse = {
      elements: [
        {
          id: 'prod-1',
          name: 'Молоток',
          calculatedPrice: { unitPrice: 499 },
        },
        {
          id: 'prod-2',
          name: 'Отвёртка',
          calculatedPrice: { unitPrice: 149 },
        },
      ],
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response))

    const result = await getProducts()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/product',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(result).toEqual([
      { id: 'prod-1', name: 'Молоток', price: 499 },
      { id: 'prod-2', name: 'Отвёртка', price: 149 },
    ])
  })
})
