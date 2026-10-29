# State

- Purpose: LEARNING. Tier: Lite.
- Phase 1 done: catalogue, category filter, cart mutations, checkout context selection, login/logout and session indicator.
- Phase 2: SWL-203 checkout readiness committed (derived from GET /checkout/cart + GET /context; no invented endpoint, no order placed).
- Latest verification: Vitest 25/25, TypeScript, ESLint, production build; browser: authed cart shows ready verdict, guest cart lists missing addresses.
- Checks: Vitest 25/25 gate green; two fresh read-only reviews per high ticket (SWL-202, SWL-203), LOW findings fixed.
- Environment: Shopware container `shopware-demo` at `localhost:8000`; dedicated demo customer exists locally.
- Next: SWL-204 demo order; then SWL-205 order retrieval.
