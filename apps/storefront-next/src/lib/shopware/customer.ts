import { cookies } from 'next/headers'
import { shopwareCartFetch } from './cart-client'

type LoginResponse = {
  contextToken: string
}

export const loginCustomer = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await shopwareCartFetch<LoginResponse>(
    '/account/login',
    { email, password },
    'POST',
    true
  )
  const cookieStore = await cookies()
  cookieStore.set('sw-context-token', response.contextToken, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  })
  return response
}

export const logoutCustomer = async (): Promise<unknown> => {
  return shopwareCartFetch<unknown>('/account/logout', {}, 'POST')
}
