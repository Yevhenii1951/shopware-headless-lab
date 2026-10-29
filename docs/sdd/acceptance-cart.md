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
