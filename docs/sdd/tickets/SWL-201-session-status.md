# SWL-201 — Session status

## Intent
Make the current Store API customer session visible and verifiable.

## Verification Scenario
```text
GIVEN a demo customer session
WHEN the storefront reads current customer data
THEN it shows the customer email; a guest sees a login link.
```

## Complexity
Implementation: routine. Review: routine.

## Contract

- `POST /account/login` with `{ email, password }` authenticates the demo customer; `loginCustomer` calls `shopwareCartFetch` with `persistContext=true` and writes `response.contextToken` into the `sw-context-token` cookie.
- `POST /account/logout` is called via `logoutCustomer` to end the session.
- `POST /account/customer` is called via `getCurrentCustomer` to read the current customer; for an authenticated context it returns customer data (used by the header).
- The header renders the customer email when present, otherwise a `Войти` link.
- Logout is available from the cart UI.

## Acceptance

- An authenticated demo customer sees their email in the site header.
- A guest sees a `Войти` link in the header instead of an email.
- The customer can log out and returns to the guest state.

## Evidence

- Commits: `8fb3129` (login), `174035b` (logout), `bfacbec` (read current customer), `27f55fb` (show session in header).
- Files: `apps/storefront-next/src/lib/shopware/customer.ts`, `apps/storefront-next/src/app/login/page.tsx`, `apps/storefront-next/src/app/page.tsx`, `apps/storefront-next/src/app/cart/page.tsx`.
- Tests: `apps/storefront-next/src/lib/shopware/customer.test.ts`, `apps/storefront-next/src/lib/shopware/customer-session.test.ts`, `apps/storefront-next/src/lib/shopware/customer-status.test.ts` (green in Phase 2 gate).
