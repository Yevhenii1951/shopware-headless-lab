# SWL-202 — Address context

## Intent
Read the demo customer's checkout addresses and select delivery/billing context.

## Blocked By
SWL-201

## Verification Scenario
```text
GIVEN a signed-in demo customer with an address
WHEN an address is selected for checkout
THEN Store API context returns that delivery and billing address.
```

## Contract

- `POST /account/list-address` reads the signed-in customer's available addresses.
- `PATCH /context` receives `billingAddressId` and `shippingAddressId`; it changes only the current checkout context.
- `GET /context` must return matching `customer.activeBillingAddress` and `customer.activeShippingAddress` IDs.
- This ticket neither creates addresses nor changes the customer's default addresses.

## Acceptance

- The cart renders available customer addresses only for an authenticated context.
- The customer can submit one delivery and one billing address ID.
- After redirect, both selects show the IDs returned by the current Store API context.

## Evidence

- RED: missing address adapter and active address IDs in the checkout context.
- Unit: address listing, null postal-code formatting, Store API ID validation, `PATCH /context`, and follow-up context mapping.
- Local API: signed-in browser submit re-rendered `/cart` with both address selects selected from the Shopware context.
- Checks: Vitest 19/19, TypeScript, ESLint, and production build pass.

## Complexity
Implementation: high. Review: high.
