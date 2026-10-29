# Acceptance Criteria: Корзина

## AC-1. TDD
- [ ] Красный тест под `getCart` или `addToCart`
- [ ] Реализация минимально, тест зелёный

## AC-2. Store API
- [ ] Запросы к Store API cart/line-item используют `sw-access-key`
- [ ] Cookies/контекст корзины учитываем минимально (Shopware может использовать context token)

## AC-3. UI
- [ ] На `/product/[id]` есть кнопка "Добавить в корзину"
- [ ] Есть страница `/cart`
- [ ] Отображаются позиции корзины

## AC-4. Удаление
- [ ] Тест под `removeFromCart`
- [ ] Успешный DELETE-запрос к `/store-api/checkout/cart/line-item/{id}`
- [ ] На странице `/cart` есть кнопка "Удалить"

## AC-5. Изменение количества
- [x] Красный тест под `updateCartItemQuantity`
- [x] PATCH-запрос передаёт ID позиции и новое количество
- [x] На странице `/cart` кнопки «−» и «+» изменяют количество позиции
