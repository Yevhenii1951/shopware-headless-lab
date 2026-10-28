const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SHOPWARE_STORE_API_URL || 'http://localhost:8000/store-api'
}

const getAccessKey = () => {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || ''
}

export const shopwareFetch = async <T>(endpoint: string, body?: unknown): Promise<T> => {
  const url = `${getBaseUrl()}${endpoint}`
  const accessKey = getAccessKey()

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'sw-access-key': accessKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : JSON.stringify({}),
  })

  if (!res.ok) {
    throw new Error(`Shopware Store API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
