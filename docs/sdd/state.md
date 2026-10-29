# State

- Purpose: LEARNING; cart flow through the Shopware Store API.
- Done: cart quantity update via `PATCH /checkout/cart/line-item` with `sw-context-token`.
- Done: `−` is disabled at quantity 1; deletion remains an explicit action.
- Done: separated cart cookie access from catalogue API calls; home remains cacheable.
- Checks: Vitest 7/7, TypeScript, ESLint and `next build` pass.
- Verified against Shopware: add item, PATCH quantity to 2, response returned quantity 2.
- Environment: Shopware container `shopware-demo` is running on `localhost:8000`.
- Next: manually exercise add → quantity change → remove in the browser, then choose the next cart slice.
