# Next.js (storefront) — запуск и проверка

## Путь
`apps/storefront-next/`

## Установка зависимостей (если нужно)
```bash
cd apps/storefront-next
npm install
```

## Переменные окружения
Скопируй `.env.example` в `.env.local` и заполни:
```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SHOPWARE_STORE_API_URL` — базовый URL Store API
- `SHOPWARE_STORE_API_ACCESS_KEY` — ключ API Sales Channel

## Тесты (TDD)
```bash
npm test        # однократный запуск
npm run test:watch
```

## Dev-сервер
```bash
npm run dev
```
Открой http://localhost:3000

## Проверка
Пока Shopware не поднят, на главной будут пустые блоки с подсказками. Это нормально — мы делали с `.catch(() => [])`.
