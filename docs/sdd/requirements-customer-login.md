# Requirements: Customer login

## Цель
Войти в существующий customer account через Store API и сохранить обновлённый context token для следующих запросов.

## Функциональные требования

### FR-1. Login helper
- FR-1.1. Добавить `loginCustomer(email, password)`.
- FR-1.2. Отправлять `POST /account/login` с email и password.
- FR-1.3. Использовать текущий `sw-context-token` и сохранить новый token из ответа.

### FR-2. Login form
- FR-2.1. Добавить страницу `/login` с полями email и password.
- FR-2.2. Server Action вызывает `loginCustomer` и перенаправляет в `/cart`.

## Ограничения
- Не реализуем регистрацию, logout, восстановление пароля или заказ.
- Тестируем только helper и его запрос к Store API.
- Реальная проверка login требует существующий demo account с предоставленными credentials.
