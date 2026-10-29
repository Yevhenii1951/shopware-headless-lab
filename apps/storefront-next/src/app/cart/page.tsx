import Link from 'next/link'
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/lib/shopware/cart'
import { redirect } from 'next/navigation'

export const instant = false

async function removeItemAction(formData: FormData) {
  'use server'
  const lineItemId = formData.get('lineItemId') as string
  if (!lineItemId) return
  await removeFromCart(lineItemId).catch(() => {})
  redirect('/cart')
}

async function updateQuantityAction(formData: FormData) {
  'use server'
  const lineItemId = formData.get('lineItemId')
  const quantity = Number(formData.get('quantity'))

  if (
    typeof lineItemId !== 'string' ||
    !lineItemId ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1
  ) {
    return
  }

  await updateCartItemQuantity(lineItemId, quantity)
  redirect('/cart')
}

export default async function CartPage() {
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
                  <div className="flex items-center gap-2" aria-label={`Количество ${item.name}`}>
                    <form action={updateQuantityAction}>
                      <input type="hidden" name="lineItemId" value={item.id} />
                      <input type="hidden" name="quantity" value={item.quantity - 1} />
                      <button
                        type="submit"
                        disabled={item.quantity === 1}
                        className="rounded border px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Уменьшить количество ${item.name}`}
                      >
                        −
                      </button>
                    </form>
                    <span className="min-w-5 text-center text-sm" aria-label={`Количество: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <form action={updateQuantityAction}>
                      <input type="hidden" name="lineItemId" value={item.id} />
                      <input type="hidden" name="quantity" value={item.quantity + 1} />
                      <button
                        type="submit"
                        className="rounded border px-2 py-1 text-sm"
                        aria-label={`Увеличить количество ${item.name}`}
                      >
                        +
                      </button>
                    </form>
                  </div>
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
