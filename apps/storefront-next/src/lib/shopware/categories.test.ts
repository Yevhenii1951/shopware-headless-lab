import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getCategories } from './categories'

describe('getCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('fetches categories from Store API with sw-access-key header', async () => {
    const mockResponse = {
      elements: [
        { id: 'cat-1', name: 'Инструменты' },
        { id: 'cat-2', name: 'Расходники' },
      ],
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response))

    const result = await getCategories()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/category',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'sw-access-key': 'test-access-key',
          'Content-Type': 'application/json',
        }),
      })
    )
    expect(result).toEqual([
      { id: 'cat-1', name: 'Инструменты' },
      { id: 'cat-2', name: 'Расходники' },
    ])
  })
})
