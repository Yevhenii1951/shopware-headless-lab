# SWL-205 — Order retrieval

## Intent
Retrieve the newly created demo order and show its identifier and state.

## Blocked By
SWL-204

## Verification Scenario
```text
GIVEN a created demo order
WHEN the customer opens its detail
THEN the Store API result contains the same order reference and state.
```

## Complexity
Implementation: routine. Review: routine.

## Contract

- `POST /order` (Criteria body) returns `{ apiAlias, orders, paymentChangeable }` where `orders` is wrapped in `EntitySearchResult` (`orders.elements`) — verified against the running Shopware; the OpenAPI schema description of an array is inaccurate. `Order` carries `orderNumber`, `price.totalPrice`, and state via `stateMachineState` / `transactions[].stateMachineState`. Orders without a captured payment transaction ship `transactions: null` (not an absent field) — the mapper tolerates it.
- `getCustomerOrders()` posts an empty criteria to the documented endpoint and maps every order to `{ id, orderNumber, totalPrice, state }`; state prefers the first payment transaction, falling back to the order state.
- `403` for a guest context is surfaced as a "Войдите" message on `/orders`, not an error page.
- No order state or payment mutation in this ticket (`/order/payment` stays outside Phase 2 scope).

## Acceptance

- A signed-in customer sees the demo order #10000 with the same order number and state the Store API returns.
- A guest sees a login hint instead of an error.
- The UI never invents state values: every shown state string comes from the Store API response.

## Evidence

- Contract verified against the running container: fresh-login `POST /order` → 200 `{apiAlias: 'order-route-response-struct', orders: {elements: [...]}, paymentChangeable}`; one order shipped `transactions: null` (caught as TypeError on first run, then tolerated in the mapper).
- RED: `orders.test.ts` failed before `orders.ts` existed (import resolution); GREEN after implementation, incl. the `transactions: null` fallback case.
- Gate: Vitest 18 files / 28 tests green, `tsc --noEmit` clean, `eslint` clean, `next build` green (`/orders` = dynamic `ƒ`), `git diff --check` clean.
- Browser (signed-in): `/orders` shows `Заказ 10000 · 159.92 € · Состояние: Ожидает оплаты` plus a second pre-existing order `10001 · 19.99 €` exactly as the API list returns them.
- Browser (guest, token absent): `/orders` shows the login hint, not an error.
- Runtime notes (not regressions of this ticket): during earlier verification the Store API container was found exited (137) and restarted; `next build` was re-run with the dev server stopped per the route-manifest gotcha.
- Self-review (Lite): diff re-read — one helper + one page + nav links, no `any`, state strings pass through from the API; error path distinguishes 403 (guest) from other failures (`console.error` + generic alert). No pagination: demo-scale customer data, noted as a Phase 2 demo limit.
