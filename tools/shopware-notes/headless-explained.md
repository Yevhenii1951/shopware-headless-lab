# Headless Shopware 6 — простыми словами

## Классика vs Headless
- Классика (Storefront) — Shopware сам рисует HTML через Twig. Заходишь на сайт, он отрисовывается из коробки.
- Headless — Shopware отдаёт только JSON через Store API. Мы строем свой фронт (Next.js) и сами решаем, как отобразить данные.

## Что мы делаем
Мы не переделываем Shopware Demo Environment. Мы подключаемся к нему как к бэкенду через Store API.

## Два мира
- shopware-demo (Docker) — бэкенд/хранилище. Своя БД, свои демо-товары/категории. Трогать не нужно.
- 006_shopware-headless-lab — наш фронт + спеку + тесты. Только наш код.

## Основные термины
- Sales Channel — "окно" в каталог
- API access key (sw-access-key) — пропуск для запроса
- Store API — API для витрины/headless
- Headless — разделение бэкенда и фронта. Общение только через HTTP + JSON

## Аналогия
Ресторан: кухня (Shopware) + официант (наш Next.js) + меню через заказное окно (Store API).
