import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getProducts } from './products'

describe('getProducts with a category', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('filters products by category ID using Store API criteria', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ elements: [] }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await getProducts('category-123')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/product',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          limit: 10,
          filter: [
            {
              type: 'equals',
              field: 'categories.id',
              value: 'category-123',
            },
          ],
        }),
      })
    )
  })
})
