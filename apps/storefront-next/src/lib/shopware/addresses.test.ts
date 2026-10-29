import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCustomerAddresses } from './addresses'
import {
  getCheckoutContext,
  parseCheckoutAddressSelection,
  selectCheckoutAddresses,
} from './checkout'

describe('customer address context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL = 'http://localhost:8000/store-api'
    process.env.SHOPWARE_STORE_API_ACCESS_KEY = 'test-access-key'
  })

  it('reads the signed-in customer addresses from the Store API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        elements: [{
          id: 'address-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          street: 'Musterstraße 1',
          zipcode: '34117',
          city: 'Kassel',
        }],
      }),
    } as Response))

    await expect(getCustomerAddresses()).resolves.toEqual([{
      id: 'address-1',
      label: 'Ada Lovelace, Musterstraße 1, 34117 Kassel',
    }])
  })

  it('omits a missing postal code from the address label', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({
        elements: [{
          id: 'address-1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          street: 'Musterstraße 1',
          zipcode: null,
          city: 'Kassel',
        }],
      }),
    } as Response))

    await expect(getCustomerAddresses()).resolves.toEqual([{
      id: 'address-1',
      label: 'Ada Lovelace, Musterstraße 1, Kassel',
    }])
  })

  it('updates billing and shipping addresses in the current checkout context', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        json: async () => ({
          paymentMethod: { id: 'payment-1' },
          shippingMethod: { id: 'shipping-1' },
          customer: {
            activeBillingAddress: { id: 'billing-address-1' },
            activeShippingAddress: { id: 'shipping-address-1' },
          },
        }),
      } as Response)
    vi.stubGlobal('fetch', fetchMock)

    await selectCheckoutAddresses('billing-address-1', 'shipping-address-1')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/store-api/context',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          billingAddressId: 'billing-address-1',
          shippingAddressId: 'shipping-address-1',
        }),
      })
    )

    await expect(getCheckoutContext()).resolves.toMatchObject({
      billingAddressId: 'billing-address-1',
      shippingAddressId: 'shipping-address-1',
    })
  })

  it('rejects missing or malformed address IDs from a form submission', () => {
    expect(parseCheckoutAddressSelection({
      billingAddressId: 'invalid',
      shippingAddressId: null,
    })).toBeNull()
  })

  it('accepts Store API address IDs from a form submission', () => {
    const addressId = '0197903faf577313ab12d9f48d747cb4'

    expect(parseCheckoutAddressSelection({
      billingAddressId: addressId,
      shippingAddressId: addressId,
    })).toEqual({
      billingAddressId: addressId,
      shippingAddressId: addressId,
    })
  })
})
