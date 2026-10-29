import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginCustomer } from '@/lib/shopware/customer'

async function loginAction(formData: FormData) {
  'use server'
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return
  }

  await loginCustomer(email, password)
  redirect('/cart')
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Вход</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← На главную</Link>
      </div>
      <form action={loginAction} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium">Email</span>
          <input name="email" type="email" required className="mt-1 w-full rounded border p-2" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Пароль</span>
          <input name="password" type="password" required className="mt-1 w-full rounded border p-2" />
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">Войти</button>
      </form>
    </main>
  )
}
