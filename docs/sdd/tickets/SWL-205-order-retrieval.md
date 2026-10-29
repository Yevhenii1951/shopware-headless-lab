# SWL-205 — Order retrieval

## Intent
Retrieve the newly created demo order and show its identifier and state.

## Blocked By
SWL-204

## Verification Scenario
```text
GIVEN a created demo order
WHEN the customer opens its detail
THEN the Store API result contains the same order reference and state.
```

## Complexity
Implementation: routine. Review: routine.
