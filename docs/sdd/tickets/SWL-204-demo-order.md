# SWL-204 — Demo order

## Intent
Create one documented, local demo order without a real payment provider.

## Blocked By
SWL-203

## Verification Scenario
```text
GIVEN a checkout-ready authenticated cart
WHEN the customer confirms the demo order
THEN Store API returns an order reference and the cart is no longer pending checkout.
```

## Complexity
Implementation: high. Review: high.

## Contract

- `POST /checkout/order` with empty body creates the order from the current context; response is `Order { id, orderNumber, price.totalPrice }` (Shopware local OpenAPI, `/checkout/order`).
- Verified in Shopware core (installed `shopware-demo` container, `CartOrderRoute.php`): after persist the cart is deleted for the same context token — no token rotation needed; `persistContext` stays a harmless no-op.
- `createDemoOrder()` posts without client-side fields; nothing user-supplied needs validation at this boundary.
- Payment is whatever demo method the context already selected (ticket scope: no real payment provider).
- The storefront reads the returned `orderNumber` into the redirect query and renders one confirmation banner (display-only in this learning scope).
- Store API failure → `/cart?orderError=1` banner; other error kinds re-throw.

## Acceptance

- Readiness block ships no order button unless the verdict reports ready.
- A ready authenticated cart allows exactly one submit; repeat submits are guarded by the server-side readiness recheck (empty cart → not ready → redirect without a new order).
- Store API returns an order reference; after redirect the cart is empty (same context token) and the UI shows the confirmation banner with that number.

## Evidence

- RED: missing `order` module (`Failed to resolve import "./order"`).
- Unit: `createDemoOrder` posts exactly `POST /checkout/order` with empty body and maps `{ id, orderNumber, price.totalPrice }`.
- Browser: signed-in demo customer clicked «Оформить demo заказ» → redirect `/cart?orderNumber=10000`, banner «Demo заказ 10000 создан», cart empty; error path renders banner «Не удалось создать заказ» on `/cart?orderError=1`. One demo order was created (#10000), no real payment involved.
- Shopware source check (`CartOrderRoute.php`, installed container): cart deleted for the same context token after order — no token rotation needed.
- Checks: Vitest 26/26, TypeScript, ESLint, production build.
- Fresh review: standards + spec subagents; MEDIUM (unhandled order error → banner path) fixed; LOW items resolved (contract set-verified in source; double-click guarded by server-side readiness recheck; banner documented as display-only).
