# SWL-204 — Demo order

## Intent
Create one documented, local demo order without a real payment provider.

## Blocked By
SWL-203

## Verification Scenario
```text
GIVEN a checkout-ready authenticated cart
WHEN the customer confirms the demo order
THEN Store API returns an order reference and the cart is no longer pending checkout.
```

## Complexity
Implementation: high. Review: high.
