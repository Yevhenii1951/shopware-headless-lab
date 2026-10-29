import Link from 'next/link'
import { getCategories } from '@/lib/shopware/categories'
import { getProducts } from '@/lib/shopware/products'

export const instant = false

type HomeSearchParams = Promise<{ categoryId?: string | string[] }>

export default async function Home({ searchParams }: { searchParams: HomeSearchParams }) {
  const { categoryId } = await searchParams
  const selectedCategoryId = typeof categoryId === 'string' ? categoryId : undefined
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts(selectedCategoryId).catch(() => []),
  ])
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId)

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
          <p className="text-sm text-gray-500">Категории не найдены. Проверьте подключение к Shopware Store API.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="rounded border px-3 py-1 hover:underline">
                Все товары
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id} className="rounded border px-3 py-1">
                <Link href={`/?categoryId=${category.id}`} className="hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">
          {selectedCategory ? `Товары: ${selectedCategory.name}` : 'Товары'}
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">Товары не найдены. Проверьте подключение к Shopware Store API.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="rounded border p-4">
                <Link href={`/product/${product.id}`} className="hover:underline">
                  <h3 className="mb-2 font-medium">{product.name || 'Без названия'}</h3>
                </Link>
                <p className="text-sm text-gray-600">{(product.price || 0).toFixed(2)} €</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
