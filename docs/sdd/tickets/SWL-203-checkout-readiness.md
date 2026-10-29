# SWL-203 — Checkout readiness

## Intent
Expose whether cart, customer, addresses, shipping, and payment context are ready for a demo order.

## Blocked By
SWL-202

## Verification Scenario
```text
GIVEN an authenticated cart with complete checkout context
WHEN checkout readiness is read
THEN the UI reports it ready without guessing missing data.
```

## Complexity
Implementation: high. Review: high.
