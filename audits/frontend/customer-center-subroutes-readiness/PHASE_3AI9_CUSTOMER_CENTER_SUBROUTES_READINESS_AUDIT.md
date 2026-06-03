# PHASE 3AI.9 — Customer Center Sub-Routes Readiness Audit

## Status
Plan-only / audit-only.

No implementation in this phase.

## Baseline
Customer Center v1 is now closed through:
- 3AI.6 — Protected-read UX Safe Patch
- 3AI.7 — Browser QA Closeout
- 3AI.8 — Protected-read UX Enhancement + Safe UX Closeout

Latest expected baseline:
- Customer Center route exists.
- Customer Center remains read-only.
- Protected-read UX is clear.
- Empty states are intentional.
- Action Panel is handoff-only.
- AI Panel is draft/guidance-only.
- Future customer actions remain disabled.
- No customer mutation routes are enabled.

## Purpose
This phase defines readiness criteria before adding any future Customer Center sub-routes or sections such as:

- Messages
- Calls & IVR
- CRM
- Tickets
- Customer Timeline
- Support AI Assistant
- Provider readiness panels

## Current decision
Do not add separate Messages, Calls, IVR, CRM, or Ticket mutation routes yet.

The correct next step is to define the readiness contract first.

## Allowed in this phase
- Audit current Customer Center route.
- Audit current sidebar/route registry state.
- Audit current read-only API projections.
- Audit current mutation safety boundary.
- Define future route/section readiness requirements.
- Document future integration requirements.

## Forbidden in this phase
- No new customer routes.
- No sidebar additions.
- No router changes.
- No backend changes.
- No API helper changes.
- No POST/PATCH/PUT/DELETE customer operations routes.
- No send reply.
- No WhatsApp / Instagram / SMS send.
- No provider send.
- No CRM mutation.
- No ticket mutation.
- No conversation assignment.
- No call placement.
- No IVR trigger.
- No auto-reply.
- No autonomous customer support execution.

## Future sub-route readiness criteria

### 1. Messages readiness
Before adding a Messages tab or route, the system must have:
- Read-only message projection contract.
- Provider identity masking rules.
- Conversation preview contract.
- Send-disabled UI state.
- Human approval requirement.
- Future send route safety audit.
- Provider audit logging plan.

### 2. CRM readiness
Before adding CRM section or route, the system must have:
- Read-only CRM projection contract.
- Customer identity handling rules.
- GDPR-safe field model.
- CRM note write safety plan.
- Role permission requirements.
- Audit log requirement.
- Confirmation gate requirement.

### 3. Tickets readiness
Before enabling ticket actions, the system must have:
- Read-only ticket/SLA projection contract.
- Ticket ownership model.
- Update confirmation gate.
- Assignment workflow owner.
- Audit trail.
- Rollback/undo policy.

### 4. Calls & IVR readiness
Before adding Calls or IVR, the system must have:
- Provider choice documented, for example Twilio or Telnyx.
- Readiness check endpoint.
- Call placement forbidden by default.
- IVR trigger forbidden by default.
- Consent and GDPR review.
- Recording/transcript storage policy.
- Audit logging.
- Role permission boundary.
- Human confirmation gate.

### 5. AI Customer Support readiness
Before enabling customer support AI execution, the system must have:
- Read-only summary mode.
- Draft-only response mode.
- No autonomous reply default.
- Escalation detection.
- Human approval workflow.
- Audit log for generated drafts.
- Provider-send integration disabled until mutation safety audit.

## Recommended architecture
Customer Center should evolve in layers:

1. Current route:
   - Customer Center overview
   - Protected-read projection
   - Safe handoffs
   - Draft/guidance-only AI

2. Future internal sections:
   - Messages overview
   - Conversation timeline
   - Tickets/SLA
   - Channel readiness
   - CRM snapshot
   - Calls/IVR readiness

3. Future separate routes only if needed:
   - customer-messages
   - customer-crm
   - customer-calls
   - customer-tickets

Separate routes should not be created until the internal-section model becomes too dense.

## Technical recommendation
Next phase should not implement sub-routes yet.

Recommended next phase:
3AJ — Customer Center read-only data/live key QA

Reason:
Before building Messages/CRM/Calls UI, the system must prove that protected-read data works correctly with `MH_CONTROL_CENTER_WRITE_KEY` and real read-only projections.

## Required validation for this phase
- node --check public/control-center/pages/customer-center.js
- node --check public/control-center/router.js
- node --check public/control-center/app.js
- node --check public/control-center/api.js
- node --check runtime/orchestrator-service/server.js
- grep confirms no customer mutation routes.

## Closeout condition
This phase is closed when:
- readiness criteria are documented
- mutation boundary remains clean
- no production code changed
- audit document is committed and pushed
