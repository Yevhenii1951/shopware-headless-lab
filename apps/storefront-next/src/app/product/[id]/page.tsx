import Link from 'next/link'
import { getProductById } from '@/lib/shopware/products'
import { addToCart } from '@/lib/shopware/cart'
import { redirect } from 'next/navigation'

async function addToCartAction(formData: FormData) {
  'use server'
  const productId = formData.get('productId') as string
  if (!productId) return
  await addToCart(productId, 1).catch(() => {})
  redirect('/cart')
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id).catch(() => null)

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Назад на главную
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Товар не найден</h1>
        <p className="mt-2 text-sm text-gray-500">
          Проверьте подключение к Shopware Store API или корректность ID товара.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Назад на главную
        </Link>
        <Link href="/cart" className="text-sm text-blue-600 hover:underline">
          Корзина
        </Link>
      </div>
      <article className="mt-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-lg text-gray-700">{product.price.toFixed(2)} €</p>
        {product.description && (
          <div className="mt-4 prose max-w-none">
            <p>{product.description}</p>
          </div>
        )}
        <form action={addToCartAction} className="mt-6">
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Добавить в корзину
          </button>
        </form>
      </article>
    </main>
  )
}
