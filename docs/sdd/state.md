# State

- Purpose: LEARNING. Tier: Lite.
- Phase 1 done: catalogue, category filter, cart mutations, checkout context selection, login/logout and session indicator.
- Phase 2 done: SWL-204 demo order (order #10000 exists locally) and SWL-205 order retrieval (`/orders`: `orders.elements` mapping, state from first transaction, guest hint on 403). Committed+pushed `f4f8e15`. Spec fulfilled → close-out next.
- Latest verification: Vitest 28/28, TypeScript, ESLint, build (`/orders` dynamic), `git diff --check`; browser: `Заказ 10000 · 159.92 € · Ожидает оплаты` signed-in, login hint as guest. Working tree clean.
- Checks: prior fresh read-only reviews on SWL-202/203 (LOW fixed); SWL-205 routine → self-review in ticket Evidence.
- Environment: Shopware container `shopware-demo` at `localhost:8000` (was found exited 137 on 2026-10-30, restarted); dev server on `:3000`, log `.next/dev/logs/next-development.log` (daemon) or `/tmp/opencode/006-dev.log`.
- Next: SWL-205 commit on explicit request, then Phase 2 close-out / retrospective.
