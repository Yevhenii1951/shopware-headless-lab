import Link from 'next/link'
import { getCustomerOrders } from '@/lib/shopware/orders'

export const instant = false

const stateLabels: Record<string, string> = {
  open: 'Ожидает оплаты',
  ordered: 'Оформлен',
}

export default async function OrdersPage() {
  const result = await getCustomerOrders()
    .then((orders) => ({ kind: 'orders' as const, orders }))
    .catch((error: unknown) => {
      console.error('SWL-205 orders page load failed:', error)
      return {
        kind: 'error' as const,
        status: error instanceof Error && error.message.startsWith('Shopware Store API error: ')
          ? Number(error.message.replace('Shopware Store API error: ', ''))
          : null,
      }
    })

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои заказы</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← На главную
        </Link>
      </div>

      {result.kind === 'orders' && result.orders.length === 0 && (
        <p className="text-sm text-gray-500">Заказов ещё нет.</p>
      )}

      {result.kind === 'orders' && result.orders.length > 0 && (
        <ul className="space-y-2">
          {result.orders.map((order) => (
            <li key={order.id} className="rounded border p-3">
              <p className="font-medium">
                Заказ {order.orderNumber} · {order.totalPrice.toFixed(2)} € · Состояние: {stateLabels[order.state] ?? order.state}
              </p>
            </li>
          ))}
        </ul>
      )}

      {result.kind === 'error' && result.status === 403 && (
        <p className="text-sm text-gray-500">
          Заказы доступны только для аккаунта. <Link href="/login" className="text-blue-600 hover:underline">Войти</Link>
        </p>
      )}

      {result.kind === 'error' && result.status !== 403 && (
        <p role="alert" className="text-sm text-red-600">Заказы сейчас недоступны.</p>
      )}
    </main>
  )
}
