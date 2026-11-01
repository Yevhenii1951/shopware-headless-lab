# Phase 2 Summary — Store API Mastery

## Goal
Complete and document one authenticated demo checkout flow through the Shopware Store API, ending in one demo order without a real payment provider.

## Status
**COMPLETE** — 2026-10-30. All Phase 2 requirements (FR-201–FR-206) fulfilled.

## Requirements Coverage
| FR | Title | Ticket | Status |
|---|---|---|---|
| FR-201 | Customer session visible / login / logout | SWL-201 | Done (contract/acceptance/evidence filled) |
| FR-202 | View and select delivery/billing address | SWL-202 | Done |
| FR-203 | Cart shows shipping/payment selection from context | SWL-203 | Done |
| FR-204 | Checkout readiness validation before order placement | SWL-203 | Done |
| FR-205 | Create exactly one local demo order via demo payment method | SWL-204 | Done — Order #10000 created (159.92 €) |
| FR-206 | Retrieve created demo order and its status via Store API | SWL-205 | Done — `/orders` shows order with state |

## Commits
- `8fb3129` — login
- `174035b` — logout
- `bfacbec` — read current customer
- `27f55fb` — show session in header
- `8efd5af` — address context selection
- `7628adc` — readiness validation
- `cec4c54` — demo order creation
- `f4f8e15` — order retrieval
- `73c66ea` — state update (Phase 2 complete)
- `3b6c57f` — fill SWL-201 artefact

## Verification
- Tests: Vitest **28/28** (18 files)
- Checks: `tsc --noEmit`, `eslint`, `next build` (green)
- Browser: authenticated customer sees order #10000 with state `Ожидает оплаты`; guest sees login hint on `/orders`
- Infra: verified against running `shopware-demo` container; Store API contract quirks documented in tickets and retrospective

## Key Lessons (durable)
- **Verify against live API.** OpenAPI descriptions were inaccurate — `POST /order` returns `orders.elements` (not array), `Order` can ship `transactions: null`.
- **Infrastructure first.** `ECONNREFUSED` was due to an exited Docker container (`shopware-demo`).
- **Dev/Build overlap.** Next 16 dev daemon + `next build` require care (port/route manifest gotcha); pages using `cookies()` need `export const instant = false`.
- **Honest diagnostics.** Silent catches hide real errors — logging the actual error in dev led to the correct fix faster.

## Related
- Retrospective: `../../../08_RETROSPECTIVES/Shopware-Headless-Lab-006-Phase2.md`
- State: `state.md`
- Spec: `spec.md`
