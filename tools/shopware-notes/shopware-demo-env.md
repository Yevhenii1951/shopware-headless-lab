# Shopware Demo Environment (FriendsOfShopware) — план подъёма

## Зачем
Для старта нам нужен рабочий Shopware 6 с демо-данными, чтобы сразу посмотреть в админке сущности (Categories, Products) и потом подключиться через Store API из нашего Next.js.

## Подход
Мы поднимем **отдельно** от репозитория `006_shopware-headless-lab`. 
Рекомендуемая директория: `~/tools/shopware-demo/` или `~/projects/shopware-demo/`.

**Правило:** сам `shopware-demo-environment` **не** коммитим в наш монорепозиторий.

## Что такое FriendsOfShopware/shopware-demo-environment
Репозиторий: https://github.com/FriendsOfShopware/shopware-demo-environment

Позволяет поднять Shopware 6 в Docker одной командой. Можно указать расширения при старте (`EXTENSIONS=...`), есть демо-данные для изучения.

## План (только после согласования)

### Шаг 1. Клонирование
```bash
mkdir -p ~/tools
cd ~/tools
git clone https://github.com/FriendsOfShopware/shopware-demo-environment.git shopware-demo
cd shopware-demo
```

### Шаг 2. Подъём
```bash
docker compose up -d
```
Первый запуск может занять время (скачивание образов, установка).

### Шаг 3. Доступ
- **Админка:** http://localhost:8000/admin
- **Storefront (классика):** http://localhost:8000
- **Shopware CLI/окружение:** смотрим README демо-окружения

### Шаг 4. Создаём API Sales Channel под headless
1. Заходим в **Админка → Настройки → Sales Channels → Добавить Sales Channel**
2. Выбираем тип **API** / **Headless** (в демо-окружении будет вариант под headless/API)
3. Сохраняем
4. Копируем **API access key** из вкладки/API доступа

**Важно:** Мы создаём **отдельный** API Sales Channel, не трогаем существующий Storefront Sales Channel.

### Шаг 5. Проверка через curl
```bash
curl -X POST "http://localhost:8000/store-api/category" \
  -H "sw-access-key: YOUR_API_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}'
```
Должны получить JSON с категориями.

## Что мы изучим
- Sales Channel концепция
- Store API аутентификация (`sw-access-key`)
- Разница между классическим Storefront и API Sales Channel
- Как каталог структурирован в демо-данных

## Замечания по подходу
- Не меняем ядро
- Только админка + конфиг Sales Channel
- Ключи храним только в `.env.local` нашего Next.js проекта
- Инструкции только в этом файле, сам Shopware вне монорепозитория
