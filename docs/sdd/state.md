# State

- Purpose: LEARNING; cart flow through the Shopware Store API.
- Done: cart quantity update via `PATCH /checkout/cart/line-item` with `sw-context-token`.
- Done: `−` is disabled at quantity 1; deletion remains an explicit action.
- Done: category URL filter using Store API `equals categories.id`; heading names the selected category.
- Done: checkout preparation lists available shipping/payment methods and changes payment through `PATCH /context`.
- Checks: Vitest 9/9, TypeScript, ESLint and `next build` pass.
- Verified against Shopware: category filter returned six products including the original related product.
- Verified against Shopware: `GET /context` confirmed the payment method selected by `PATCH /context`.
- Environment: Shopware container `shopware-demo` is running on `localhost:8000`.
- Verified in browser: cart quantity update plus shipping/payment list and payment form submission.
- Next: inspect official contract before implementing a selectable shipping method, or start customer authentication.
