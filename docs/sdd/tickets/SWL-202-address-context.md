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

## Complexity
Implementation: high. Review: high.
