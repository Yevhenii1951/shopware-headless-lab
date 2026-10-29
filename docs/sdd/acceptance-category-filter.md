# Acceptance Criteria: Фильтр товаров по категории

## AC-1. TDD
- [x] Красный тест для `getProducts(categoryId)`.
- [x] Тест проверяет Store API criteria с `equals categories.id`.

## AC-2. UI
- [x] Категория формирует URL с `categoryId`.
- [x] Есть ссылка «Все товары».
- [x] Выбранная категория отмечена на странице.

## AC-3. Проверка
- [x] Все unit-тесты, TypeScript, ESLint и production build зелёные.
- [x] Реальный Store API запрос по одной категории возвращает корректный ответ.
