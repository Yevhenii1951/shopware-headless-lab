# State

- Purpose: LEARNING; cart flow through the Shopware Store API.
- Done: cart quantity update via `PATCH /checkout/cart/line-item` with `sw-context-token`.
- Done: `−` is disabled at quantity 1; deletion remains an explicit action.
- Done: category URL filter using Store API `equals categories.id`; heading names the selected category.
- Done: checkout preparation lists available shipping/payment methods and changes payment through `PATCH /context`.
- Done: customer login helper and `/login` form authenticate through Store API.
- Checks: Vitest 10/10, TypeScript, ESLint and `next build` pass.
- Verified against Shopware: category filter returned six products including the original related product.
- Verified against Shopware: `GET /context` confirmed the payment method selected by `PATCH /context`.
- Environment: Shopware container `shopware-demo` is running on `localhost:8000`.
- Verified in browser: cart quantity update plus shipping/payment list and payment form submission.
- Verified in browser: demo customer login redirects to `/cart` and persists the session context.
- Next: add login navigation/logout or inspect the official contract before selectable shipping.
