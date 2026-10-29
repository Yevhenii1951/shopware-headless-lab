import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/lib/shopware/cart'
import {
  getAvailablePaymentMethods,
  getAvailableShippingMethods,
  getCheckoutContext,
  parseCheckoutAddressSelection,
  selectCheckoutAddresses,
  selectPaymentMethod,
  selectShippingMethod,
} from '@/lib/shopware/checkout'
import { getCustomerAddresses } from '@/lib/shopware/addresses'
import { evaluateCheckoutReadiness, ReadinessCode } from '@/lib/shopware/readiness'
import { redirect } from 'next/navigation'
import { logoutCustomer } from '@/lib/shopware/customer'

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

async function selectPaymentMethodAction(formData: FormData) {
  'use server'
  const paymentMethodId = formData.get('paymentMethodId')
  if (typeof paymentMethodId !== 'string' || !paymentMethodId) return

  await selectPaymentMethod(paymentMethodId)
  redirect('/cart')
}

async function selectShippingMethodAction(formData: FormData) {
  'use server'
  const shippingMethodId = formData.get('shippingMethodId')
  if (typeof shippingMethodId !== 'string' || !shippingMethodId) return

  await selectShippingMethod(shippingMethodId)
  redirect('/cart')
}

async function selectCheckoutAddressesAction(formData: FormData) {
  'use server'
  const addressSelection = parseCheckoutAddressSelection({
    billingAddressId: formData.get('billingAddressId'),
    shippingAddressId: formData.get('shippingAddressId'),
  })
  if (!addressSelection) return

  await selectCheckoutAddresses(
    addressSelection.billingAddressId,
    addressSelection.shippingAddressId
  )
  redirect('/cart')
}

async function logoutAction() {
  'use server'
  try {
    await logoutCustomer()
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'Shopware Store API error: 403') {
      throw error
    }
  }
  const cookieStore = await cookies()
  cookieStore.delete('sw-context-token')
  redirect('/')
}

const MISSING_READINESS_LABELS: Record<ReadinessCode, string> = {
  cart: 'Корзина пуста',
  billingAddress: 'Не выбран адрес счёта',
  shippingAddress: 'Не выбран адрес доставки',
  paymentMethod: 'Не выбран способ оплаты',
  shippingMethod: 'Не выбран способ доставки',
}

export default async function CartPage() {
  const [items, paymentMethods, shippingMethods, checkoutContext, addressResult] = await Promise.all([
    getCart().catch(() => []),
    getAvailablePaymentMethods().catch(() => []),
    getAvailableShippingMethods().catch(() => []),
    getCheckoutContext().catch(() => null),
    getCustomerAddresses()
      .then((addresses) => ({ addresses, error: null }))
      .catch(() => ({
        addresses: [],
        error: 'Адреса недоступны. Войдите, чтобы выбрать адрес.',
      })),
  ])
  const { addresses, error: addressError } = addressResult

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const readiness = evaluateCheckoutReadiness(items, checkoutContext)

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Корзина</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← На главную
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-blue-600 hover:underline">Выйти</button>
        </form>
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
          <section className="space-y-4 border-t pt-4">
            <div className="text-sm">
              {readiness.ready ? (
                <p className="font-semibold text-green-700">Корзина готова к заказу</p>
              ) : (
                <ul className="list-disc pl-5 text-red-600">
                  {readiness.missing.map((code) => <li key={code}>{MISSING_READINESS_LABELS[code]}</li>)}
                </ul>
              )}
            </div>
            {addressError && <p role="alert" className="text-sm text-red-600">{addressError}</p>}
            {addresses.length > 0 && (
              <form action={selectCheckoutAddressesAction} className="space-y-2">
                <p className="font-semibold">Адреса</p>
                <label htmlFor="shipping-address" className="block text-sm">Доставка</label>
                <select
                  id="shipping-address"
                  name="shippingAddressId"
                  defaultValue={checkoutContext?.shippingAddressId}
                  className="rounded border p-2"
                >
                  {addresses.map((address) => <option key={address.id} value={address.id}>{address.label}</option>)}
                </select>
                <label htmlFor="billing-address" className="block text-sm">Счёт</label>
                <select
                  id="billing-address"
                  name="billingAddressId"
                  defaultValue={checkoutContext?.billingAddressId}
                  className="rounded border p-2"
                >
                  {addresses.map((address) => <option key={address.id} value={address.id}>{address.label}</option>)}
                </select>
                <button type="submit" className="block rounded bg-black px-4 py-2 text-white">Выбрать адреса</button>
              </form>
            )}
            <form action={selectShippingMethodAction} className="space-y-2">
              <label htmlFor="shipping-method" className="block font-semibold">Доставка</label>
              <select id="shipping-method" name="shippingMethodId" defaultValue={checkoutContext?.shippingMethodId} className="rounded border p-2">
                {shippingMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
              </select>
              <button type="submit" className="ml-2 rounded bg-black px-4 py-2 text-white">Выбрать доставку</button>
            </form>
            <form action={selectPaymentMethodAction} className="space-y-2">
              <label htmlFor="payment-method" className="block font-semibold">Оплата</label>
              <select id="payment-method" name="paymentMethodId" defaultValue={checkoutContext?.paymentMethodId} className="rounded border p-2">
                {paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
              </select>
              <button type="submit" className="ml-2 rounded bg-black px-4 py-2 text-white">Выбрать оплату</button>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
