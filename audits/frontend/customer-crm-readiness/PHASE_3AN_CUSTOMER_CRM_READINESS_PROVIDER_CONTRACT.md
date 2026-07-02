# PHASE 3AN — Customer CRM Readiness + Provider Contract

## Status
Plan-only / audit-only.

No implementation in this phase.

## Baseline
Closed before this phase:
- 3AI.6 — Customer Center Protected-Read UX Safe Patch
- 3AI.7 — Browser QA Closeout
- 3AI.8 — Safe UX Patch Closeout
- 3AI.9 — Sub-Routes Readiness Audit
- 3AJ — Read-Only Live Key QA Guard Check
- 3AK — Customer Mutation Safety Audit
- 3AL — Customer Actions Plan
- 3AM — Messages Section Readiness

## Purpose
Define readiness requirements before adding any CRM section, CRM provider integration, CRM write route, lead sync, contact sync, customer profile mutation, or CRM note action.

This phase does not create:
- CRM route
- CRM tab
- CRM write action
- CRM provider sync
- customer profile mutation
- lead/contact write
- backend POST/PATCH/PUT/DELETE route

## Current state
Customer Center currently supports:
- read-only customer operations projections
- read-only customer profile preview helper
- safe AI handoff
- safe Task Center handoff
- safe Governance handoff

CRM-related future actions remain locked.

## Current allowed model
A future CRM surface may start only as:
- read-only CRM snapshot
- masked customer profile preview
- lifecycle/status display
- safe missing-fields checklist
- AI draft/guidance only
- handoff to Task Center / Governance / Sales CRM review

## Current forbidden model
- Add CRM note
- Update CRM contact
- Sync CRM provider
- Create lead
- Update lifecycle stage
- Merge customer records
- Enrich customer profile via external provider
- Push customer data to provider
- Send outreach
- Auto-reply
- Silent customer mutation

## CRM readiness requirements

### 1. Read-only CRM projection contract
Before adding CRM UI, define:
- customer id
- masked display name
- contact channels summary
- lifecycle stage
- last activity date
- order/support signals if available
- consent flags if available
- data source label
- missing fields
- risk/privacy flags
- allowed display fields
- forbidden display fields

### 2. GDPR / privacy boundary
Before displaying or syncing CRM data:
- define data minimization rules
- define consent/legitimate interest assumptions
- define retention policy
- define export/delete implications
- define masking rules
- define AI prompt redaction rules
- define audit boundary for customer data access

### 3. Provider contract
Before any CRM provider sync:
- identify provider
- define auth model
- define scopes
- define read endpoints
- define write endpoints
- define rate limits
- define failure behavior
- define retry/idempotency rules
- define data mapping
- define provider audit log requirements
- define provider disconnect behavior

### 4. CRM write safety contract
Before any CRM write:
- backend route design
- request/response schema
- role permission
- confirmation gate
- audit log event
- human owner
- validation schema
- error behavior
- rollback/correction policy
- no autonomous execution default

### 5. AI CRM boundary
AI may:
- summarize customer context
- suggest missing fields
- draft internal CRM note text
- suggest lifecycle interpretation
- prepare handoff to Sales / CRM
- prepare Governance review for sensitive data

AI must not:
- write CRM notes
- update customer profile
- sync provider
- create lead
- change lifecycle
- send outreach
- mutate customer data

## Recommended implementation order
1. Keep CRM as locked future action in Customer Center.
2. Complete live-key read-only projection QA.
3. Define read-only CRM snapshot contract.
4. Add internal CRM snapshot section only after data contract is verified.
5. Keep all write controls disabled.
6. Add AI CRM draft/handoff only.
7. Plan CRM provider integration separately.
8. Plan CRM write routes only after mutation safety review.

## Forbidden until future approval
- POST/PATCH/PUT/DELETE customer CRM routes
- provider CRM sync
- CRM note write
- contact update
- lead creation
- lifecycle mutation
- customer enrichment write
- external outreach send
- autonomous CRM execution

## Validation required
- No customer/CRM mutation routes.
- No frontend CRM write handlers.
- No route/sidebar changes.
- Existing Customer Center remains read-only.
- Node syntax validation passes.

## Result
3AN defines future CRM readiness and provider contract only.

No code implementation is allowed in this phase.

## Next phase
PHASE 3AO — Calls & IVR Provider Readiness

Plan-only / audit-only.
