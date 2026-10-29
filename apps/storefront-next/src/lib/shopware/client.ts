const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL || 'http://localhost:8000/store-api'
}

const getAccessKey = () => {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || ''
}

export const shopwareFetch = async <T>(endpoint: string, body?: unknown, method: string = 'POST'): Promise<T> => {
  const url = `${getBaseUrl()}${endpoint}`
  const accessKey = getAccessKey()

  let contextToken: string | undefined
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    contextToken = cookieStore.get('sw-context-token')?.value
  } catch {
    // ignore if not in next/headers context
  }

  const headers: Record<string, string> = {
    'sw-access-key': accessKey,
  }
  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json'
  }
  if (contextToken) {
    headers['sw-context-token'] = contextToken
  }

  const res = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  })

  try {
    const newToken = res.headers.get('sw-context-token')
    if (newToken && newToken !== contextToken) {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      cookieStore.set('sw-context-token', newToken, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      })
    }
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new Error(`Shopware Store API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
