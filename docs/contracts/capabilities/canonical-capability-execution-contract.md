# Canonical Capability Execution Contract

## Status

Canonical additive contract for MH-OS Phase 1B capability semantics.

## Purpose

This contract separates capability identity, product surface ownership, execution authority, concrete execution route, multi-stage execution flow, handoffs, and downstream consumers.

A frontend route must never be treated as backend execution authority merely because it displays or receives a capability.

## Fields

### `executionAuthority`

Required result field with a nullable execution-domain value.

Currently confirmed vocabulary in this phase:

- `customer_ops`
- `sales_crm`
- `none`

The field is always present in resolved semantics. `null` means the authority has not yet been proven for that capability. It is fail-closed and must not be interpreted as permission to execute.

This vocabulary is intentionally non-exhaustive. Additional authority identifiers require separate runtime proof and an explicit contract decision before they may be added.

### `primaryExecutionRoute`

First proven concrete execution route.

It may be `null` when the capability is intentionally non-executable or no executor route has been proven.

### `executionFlow`

Ordered list of proven execution or orchestration stages.

An empty frozen array means no canonical multi-stage flow has yet been proven.

### Existing fields

The following remain unchanged and compatible:

- `surfaceOwnerRoute`
- `legacyDestinationRoute`
- `handoffRoutes`
- `consumerRoutes`
- `resolution`

## Confirmed authority decisions

### Intentional non-execution

- `strategy.priority_recommendation` → `none`

### Customer Operations

- `customer.reply_draft`
- `customer.ticket_prepare`
- `customer.sla_review`
- `customer.conversation_summary`

Authority: `customer_ops`

### Sales CRM

- `sales.pitch_create`
- `sales.follow_up`
- `sales.objection_handling`
- `sales.lead_brief`

Authority: `sales_crm`

## Invariants

1. Backend/runtime services remain the source of execution truth.
2. Product routes are interaction and projection surfaces.
3. Surface ownership does not imply execution authority.
4. Destination routes do not imply execution authority.
5. Consumer routes do not imply mutation authority.
6. `executionAuthority` is always present in resolved semantics and may be `null`.
7. Unproven authority remains `null`.
8. Unproven execution routes remain `null`.
9. Unproven execution flows remain empty.
10. Existing fields and behavior remain additive and compatible.
11. No route, authority, or flow may be invented to satisfy schema completeness.
