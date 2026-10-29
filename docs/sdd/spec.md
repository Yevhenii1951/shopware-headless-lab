# Phase 2 Store API Mastery

## Goal
Complete and document one authenticated demo checkout flow through the Shopware Store API, ending in one demo order without a real payment provider.

## Requirements

- FR-201: A signed-in demo customer can view their current account session and end it.
- FR-202: The customer can view and select the delivery and billing address required for checkout.
- FR-203: The cart shows the current shipping and payment selection from its Shopware context.
- FR-204: The application validates checkout readiness from Store API responses before order placement.
- FR-205: A signed-in customer can create exactly one local demo order using a Shopware demo payment method.
- FR-206: The customer can retrieve the created demo order and its status through Store API.
- NFR-201: Every ticket has one GIVEN/WHEN/THEN scenario, red-green evidence where behaviour computes, and test/typecheck/lint/build evidence.

## Non-goals

- Real payment providers, charges, refunds, or webhooks.
- Shopware Admin API.
- Deployment, emails, discount campaigns, search, or storefront visual polish.
