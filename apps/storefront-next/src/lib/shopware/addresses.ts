import { shopwareCartFetch } from './cart-client'

export interface CustomerAddress {
  id: string
  label: string
}

interface StoreApiCustomerAddress {
  id: string
  firstName: string
  lastName: string
  street: string
  zipcode: string | null
  city: string
}

interface StoreApiAddressResponse {
  elements: StoreApiCustomerAddress[]
}

export const getCustomerAddresses = async (): Promise<CustomerAddress[]> => {
  const data = await shopwareCartFetch<StoreApiAddressResponse>('/account/list-address')

  return data.elements.map((address) => ({
    id: address.id,
    label: [
      `${address.firstName} ${address.lastName}`,
      address.street,
      [address.zipcode, address.city].filter(Boolean).join(' '),
    ].filter(Boolean).join(', '),
  }))
}
