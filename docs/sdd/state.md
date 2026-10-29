# State

- Purpose: LEARNING. Tier: Lite.
- Phase 1 done: catalogue, category filter, cart mutations, checkout context selection, login/logout and session indicator.
- Phase 2: SWL-202 address context committed; only current-context selection, no address/default-address mutations.
- Latest verification: signed-in browser rendered delivery/billing selects and preserved their Shopware context selection after submit.
- Checks: Vitest 20/20, TypeScript, ESLint, production build; two fresh read-only reviews ran, all findings fixed; final recheck self-performed (subagent usage limit).
- Environment: Shopware container `shopware-demo` at `localhost:8000`; dedicated demo customer exists locally.
- Next: SWL-203 checkout readiness. Then SWL-204 demo order, SWL-205 order retrieval.
