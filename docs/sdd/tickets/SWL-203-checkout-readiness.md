# SWL-203 — Checkout readiness

## Intent
Expose whether cart, customer, addresses, shipping, and payment context are ready for a demo order.

## Blocked By
SWL-202

## Verification Scenario
```text
GIVEN an authenticated cart with complete checkout context
WHEN checkout readiness is read
THEN the UI reports it ready without guessing missing data.
```

## Complexity
Implementation: high. Review: high.

## Contract

Derived from existing Store API responses, not a new endpoint:

- `GET /checkout/cart` — an empty `lineItems` list means the cart blocks checkout.
- `GET /context` — `paymentMethodId`/`shippingMethodId` must be present; `billingAddressId`/`shippingAddressId` are present only for a signed-in customer with addresses.
- `evaluateCheckoutReadiness(items, context)` is pure and returns `{ ready, missing }` with stable codes: `cart`, `billingAddress`, `shippingAddress`, `paymentMethod`, `shippingMethod`.
- `getCheckoutReadiness()` composes both reads through the existing helpers.

## Acceptance

- The cart shows a readiness verdict built only from Store API data.
- Authenticated complete context renders ready; guest or incomplete context renders the missing codes in Russian without guessing.

## Evidence

- RED: missing `readiness` module (`Failed to resolve import "./readiness"`), then TypeScript caught untyped missing codes → union `ReadinessCode` added.
- Unit: pure evaluator (ready/guest/empty-cart/missing-methods) and `getCheckoutReadiness` composing only `GET /checkout/cart` + `GET /context`.
- Browser: signed-in demo customer sees «Корзина готова к заказу»; guest cart with items lists «Не выбран адрес счёта/доставки» without crash; no order was placed.
- Checks: Vitest 25/25, TypeScript, ESLint, production build.
- Fresh review: standards + spec subagents; 0 HIGH/MEDIUM; LOW fixes applied (typed codes, UPPER_SNAKE const, unstub hygiene, aria-live removed).
