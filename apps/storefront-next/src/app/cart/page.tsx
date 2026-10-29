import Link from 'next/link'
import { cookies } from 'next/headers'
import { getCart } from '@/lib/shopware/cart'
import { removeFromCart } from '@/lib/shopware/cart'
import { redirect } from 'next/navigation'

async function removeItemAction(formData: FormData) {
  'use server'
  const lineItemId = formData.get('lineItemId') as string
  if (!lineItemId) return
  await removeFromCart(lineItemId).catch(() => {})
  redirect('/cart')
}

export default async function CartPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sw-context-token')?.value
  const items = await getCart().catch(() => [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Корзина</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← На главную
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Корзина пустая.</p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Кол-во: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">{(item.price * item.quantity).toFixed(2)} €</p>
                  <form action={removeItemAction}>
                    <input type="hidden" name="lineItemId" value={item.id} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Удалить
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 text-right">
            <p className="text-lg font-semibold">Итого: {total.toFixed(2)} €</p>
          </div>
        </div>
      )}
    </main>
  )
}
