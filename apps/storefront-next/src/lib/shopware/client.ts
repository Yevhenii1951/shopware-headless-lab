const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL || 'http://localhost:8000/store-api'
}

const getAccessKey = () => {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || ''
}

export const shopwareFetch = async <T>(endpoint: string, body?: unknown, method: string = 'POST'): Promise<T> => {
  const url = `${getBaseUrl()}${endpoint}`
  const accessKey = getAccessKey()

  const headers: Record<string, string> = {
    'sw-access-key': accessKey,
  }
  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  })

  if (!res.ok) {
    throw new Error(`Shopware Store API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
