# Acceptance Criteria: Checkout preparation

## AC-1. TDD
- [x] Красный тест для `selectPaymentMethod`.
- [x] Тест проверяет `PATCH /context` и тело с `paymentMethodId`.

## AC-2. UI
- [x] На `/cart` отображаются доступные shipping и payment methods.
- [x] Пользователь может отправить выбранный payment method.

## AC-3. Проверка
- [x] Unit-тесты, TypeScript, ESLint и production build зелёные.
- [x] Реальный Store API принимает PATCH с методом оплаты в cart context.
