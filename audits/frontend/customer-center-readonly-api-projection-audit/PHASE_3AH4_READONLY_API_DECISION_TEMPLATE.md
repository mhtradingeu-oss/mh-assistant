# PHASE 3AH.4 — Customer Center Read-Only API / Projection Decision

## Decision Status
Closed as audit-only after read-only API / projection evidence review.

No production implementation was performed in this phase.

## Backend API Exposure Summary
Customer Operations backend/runtime foundation exists, but frontend-safe read-only API exposure is not confirmed as ready for Customer Center implementation.

Confirmed:
- Customer Operations runtime exists under `runtime/orchestrator-service/lib/customer-operations/`.
- Runtime includes conversations, messages, tickets, customers, unified inbox, escalation, SLA policies, readiness snapshot, and integration inbox bridge.
- Contracts and stores exist for customer operations data classes.

Not confirmed as ready:
- dedicated server read routes for Customer Center projection.
- frontend API helpers in `public/control-center/api.js` for Customer Center read-only data.
- stable route contracts for inbox, conversations, conversation detail, messages, customer profile, ticket/SLA snapshot, channels, and escalation.

Decision:
- Do not implement Customer Center frontend yet.
- Do not add Customer sidebar route yet.
- Define a read-only API / projection plan first.

## Runtime Contract Summary
Runtime contracts appear strong enough to support a future Customer Center v1.

Available runtime concepts:
- readiness snapshot.
- unified inbox.
- conversations.
- messages.
- customer profiles.
- tickets.
- escalations.
- SLA policies.
- channel/provider readiness concepts.

Important limitation:
- runtime contracts do not automatically mean frontend-safe API exposure exists.
- runtime stores may be in-memory or internal runtime authority and must be exposed carefully through read-only projection APIs.

Decision:
- Treat runtime as backend source foundation.
- Expose only safe, normalized, privacy-aware projections to the frontend.

## Frontend Projection Summary
Current frontend does not yet have a dedicated Customer Center route or projection surface.

Confirmed:
- No Customer Center route exists.
- No Customer sidebar group exists.
- Customer-related guidance appears through AI Command and existing operations/integration surfaces.
- Integrations includes Email & CRM concepts, but backend support is not configured for some email/CRM connectors.

Decision:
- Customer Center must be introduced only after API/projection contracts are planned.
- Initial frontend should remain read-only / preview-first.

## Read-Only MVP Data Availability
Potentially available from runtime after API exposure:
- customer operations readiness.
- unified inbox entries.
- conversations list.
- messages list.
- customer profiles.
- tickets.
- escalations.
- SLA policies.
- channel readiness.

Not ready for v1 external execution:
- external CRM mutation.
- external email send.
- WhatsApp/Instagram/Messenger send.
- SMS send.
- call placement.
- IVR triggers.
- auto-reply.

## Missing API / Projection Gaps
Required before Customer Center implementation:
- read-only projection endpoint for readiness snapshot.
- read-only projection endpoint for unified inbox list.
- read-only projection endpoint for conversation list.
- read-only projection endpoint for selected conversation detail.
- read-only projection endpoint for messages by conversation.
- read-only projection endpoint for customer profile preview.
- read-only projection endpoint for ticket/SLA snapshot.
- read-only projection endpoint for channel/provider readiness.
- frontend API helpers for these endpoints.
- response contracts with PII minimization rules.
- empty-state contract when no customer data exists.

## Security / Privacy Notes
Customer Center data is high-risk because it may include:
- PII.
- customer messages.
- channel handles.
- customer profiles.
- ticket history.
- support notes.
- future call transcripts.

Required rules:
- no full customer message logging in generic debug logs.
- redact or minimize sensitive fields in frontend projections.
- no external send in read-only MVP.
- no CRM mutation in read-only MVP.
- no call/IVR action in read-only MVP.
- role-based access must be planned before live customer data.
- all future mutations require confirmation and audit logging.

## Recommended Next Phase
`PHASE 3AH.5 — Customer Read-Only API / Projection Plan`

Reason:
The audit confirms runtime foundations are present, but frontend-safe read-only API/projection exposure is not confirmed as ready. The next phase must define exact read-only endpoints, frontend helpers, projection shapes, privacy rules, and empty-state behavior before any Customer Center route/sidebar/frontend implementation.
