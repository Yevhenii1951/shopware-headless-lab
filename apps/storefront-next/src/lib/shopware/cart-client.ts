import { cookies } from 'next/headers'

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL || 'http://localhost:8000/store-api'
}

const getAccessKey = () => {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || ''
}

export const shopwareCartFetch = async <T>(
  endpoint: string,
  body?: unknown,
  method: string = 'POST',
  persistContext = false
): Promise<T> => {
  const cookieStore = await cookies()
  const contextToken = cookieStore.get('sw-context-token')?.value
  const headers: Record<string, string> = {
    'sw-access-key': getAccessKey(),
  }

  if (method !== 'GET') headers['Content-Type'] = 'application/json'
  if (contextToken) headers['sw-context-token'] = contextToken

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  })

  if (!response.ok) {
    throw new Error(`Shopware Store API error: ${response.status}`)
  }

  const newToken = response.headers.get('sw-context-token')
  if (persistContext && newToken && newToken !== contextToken) {
    cookieStore.set('sw-context-token', newToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    })
  }

  return response.json() as Promise<T>
}
