import Link from 'next/link'
import { getCategories } from '@/lib/shopware/categories'
import { getProducts } from '@/lib/shopware/products'

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ])

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopware Headless Lab</h1>
        <Link href="/cart" className="text-sm text-blue-600 hover:underline">
          Корзина
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Категории</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">Категории не найдёдны. Проверьте подключение к Shopware Store API.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id} className="rounded border px-3 py-1">
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Товары</h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">Товары не найдены. Проверьте подключение к Shopware Store API.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="rounded border p-4">
                <Link href={`/product/${product.id}`} className="hover:underline">
                  <h3 className="mb-2 font-medium">{product.name || 'Без названия'}</h3>
                </Link>
                <p className="text-sm text-gray-600">{product.price.toFixed(2)} €</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
