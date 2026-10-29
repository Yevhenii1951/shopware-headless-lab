# State

- Purpose: LEARNING. Tier: Lite.
- Phase 1 done: catalogue, category filter, cart mutations, checkout context selection, login/logout and session indicator.
- Phase 2: SWL-204 demo order committed (POST /checkout/order; readiness rechecked server-side; error banner path); demo order #10000 exists locally.
- Latest verification: Vitest 26/26, TypeScript, ESLint, production build; browser: order #10000 created once, banner shown, cart empty afterwards.
- Checks: Vitest 25/25 gate green; two fresh read-only reviews per high ticket (SWL-202, SWL-203), LOW findings fixed.
- Environment: Shopware container `shopware-demo` at `localhost:8000`; dedicated demo customer exists locally.
- Next: SWL-205 order retrieval, then Phase 2 close-out.
