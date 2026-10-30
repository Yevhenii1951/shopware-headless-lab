import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCustomerOrders } from './orders'

describe('getCustomerOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('maps customer orders from the Store API list endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        orders: {
          elements: [{
            id: 'order-entity-1',
            orderNumber: '10000',
            price: { totalPrice: 19.99 },
            stateMachineState: { technicalName: 'ordered' },
            transactions: [{ stateMachineState: { technicalName: 'open' } }],
          }],
        },
        paymentChangeable: {},
      }),
    } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCustomerOrders()).resolves.toEqual([{
      id: 'order-entity-1',
      orderNumber: '10000',
      totalPrice: 19.99,
      state: 'open',
    }])

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/order',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({}),
      })
    )
  })

  it('falls back to the order state when transactions are null or absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        orders: {
          elements: [{
            id: 'order-entity-2',
            orderNumber: '10001',
            price: { totalPrice: 39.98 },
            stateMachineState: { technicalName: 'ordered' },
            transactions: null,
          }],
        },
        paymentChangeable: {},
      }),
    } as Response))

    await expect(getCustomerOrders()).resolves.toEqual([{
      id: 'order-entity-2',
      orderNumber: '10001',
      totalPrice: 39.98,
      state: 'ordered',
    }])
  })
})
