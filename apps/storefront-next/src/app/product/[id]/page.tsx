import Link from 'next/link'
import { getProductById } from '@/lib/shopware/products'

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
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Назад на главную
      </Link>
      <article className="mt-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-lg text-gray-700">{product.price.toFixed(2)} €</p>
        {product.description && (
          <div className="mt-4 prose max-w-none">
            <p>{product.description}</p>
          </div>
        )}
      </article>
    </main>
  )
}
