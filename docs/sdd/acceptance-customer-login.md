# Acceptance Criteria: Customer login

## AC-1. TDD
- [x] Красный тест для `loginCustomer`.
- [x] Тест проверяет `POST /account/login` с email/password.

## AC-2. Context
- [x] Login helper использует cart context adapter.
- [x] Новый context token сохраняется для следующих Store API запросов.

## AC-3. UI
- [x] На `/login` есть email/password форма.
- [x] Успешный вход перенаправляет в `/cart`.

## AC-4. Проверка
- [x] Unit-тесты, TypeScript, ESLint и production build зелёные.
- [x] Реальный login выполнен после предоставления существующих demo credentials.
