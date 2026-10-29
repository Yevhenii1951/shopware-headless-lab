import { shopwareCartFetch } from './cart-client'

type LoginResponse = {
  contextToken: string
}

export const loginCustomer = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return shopwareCartFetch<LoginResponse>(
    '/account/login',
    { email, password },
    'POST',
    true
  )
}
