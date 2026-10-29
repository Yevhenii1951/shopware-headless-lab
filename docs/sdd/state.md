# State

- Purpose: LEARNING; cart flow through the Shopware Store API.
- Done: cart quantity update via `PATCH /checkout/cart/line-item` with `sw-context-token`.
- Done: `−` is disabled at quantity 1; deletion remains an explicit action.
- Done: category URL filter using Store API `equals categories.id`; heading names the selected category.
- Checks: Vitest 8/8, TypeScript, ESLint and `next build` pass.
- Verified against Shopware: category filter returned six products including the original related product.
- Environment: Shopware container `shopware-demo` is running on `localhost:8000`.
- Next: manually exercise category filter and cart add → quantity change → remove in the browser.
