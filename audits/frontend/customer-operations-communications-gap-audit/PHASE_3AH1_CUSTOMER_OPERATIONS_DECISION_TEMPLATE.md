# PHASE 3AH.1 — Customer Operations / Communications Decision

## Decision Status
Closed as audit-only after customer operations / communications evidence review.

No production implementation was performed in this phase.

## Frontend Route / Sidebar Summary
Current frontend status:
- No Customer sidebar group exists.
- No dedicated Customer Center route exists.
- No dedicated Messages route exists.
- No dedicated Calls & IVR route exists.
- No dedicated CRM route exists.
- Customer-related guidance appears partially through AI Command, Operations Overview, Notification Center, Content Studio, and Publishing/Governance handoff flows.

Decision:
- Do not add Customer / IVR / CRM sidebar routes during 3AH.1.
- Do not implement Customer Center directly from this audit.
- Treat Customer Operations as a future major surface group with real backend foundation that needs authority/API contract hardening first.

## Backend Route / API Summary
Evidence confirms a customer-operations backend/runtime foundation exists under:

`runtime/orchestrator-service/lib/customer-operations/`

Confirmed runtime areas:
- conversations.
- messages.
- tickets.
- customers.
- unified inbox.
- escalation.
- SLA policies.
- customer profile contracts.
- message contracts.
- conversation contracts.
- ticket contracts.
- unified inbox contracts.
- integration inbox bridge.
- readiness snapshot.

Important readiness signal:
- conversations: available.
- messages: available.
- tickets: available.
- customers: available.
- unified inbox: available.
- integration inbox bridge: available.
- voice: not ready.
- IVR: not ready.
- CRM provider execution: not ready.

Decision:
- Customer Operations is not only a future idea; it has backend/runtime foundations.
- Before frontend page implementation, define a Customer Backend Authority Contract.
- Confirm which capabilities are read-only safe, draft-only safe, confirmation-gated, and forbidden.

## Data / Provider Readiness Summary
Evidence confirms project data includes email/publishing/notification artifacts and runtime includes customer-operations files.

Current provider readiness appears partial:
- Email/content artifacts exist.
- Notification data exists.
- Integration provider layer exists.
- Customer operations runtime exists.
- Unified inbox bridge exists.
- Meta/Instagram/WhatsApp-like channels appear as channel mappings or candidate channels.
- Voice / IVR provider execution is not ready.
- CRM provider execution is not ready.

Decision:
- Start with read-only Customer Center and preview/draft workflows only.
- Do not add live outbound send, call placement, IVR execution, or CRM mutation until provider readiness and authority contracts are complete.

## AI Customer Support Boundary Summary
AI Command / backend AI orchestration already includes customer operations and sales/CRM specialist boundaries.

Allowed:
- inbox review guidance.
- reply draft preparation.
- support tone guidance.
- SLA thinking.
- escalation path suggestions.
- CRM note drafts.
- follow-up draft suggestions.

Forbidden from AI chat:
- sending customer replies.
- mutating tickets silently.
- updating CRM silently.
- sending outreach.
- scheduling follow-ups as durable actions.
- placing calls.
- triggering IVR flows.

Decision:
- Keep AI customer support review-only and preview-first.
- Any future AI action must route to Customer Center and require destination confirmation before durable mutation or external send.

## Security / GDPR / External Send Risk Summary
Customer Operations is high-risk because it involves:
- PII.
- customer messages.
- external replies.
- CRM records.
- customer profiles.
- support tickets.
- possible call transcripts.
- possible WhatsApp / Instagram / email messages.
- GDPR/privacy requirements.
- audit logging.
- human handoff.

Decision:
- No auto-send by default.
- No customer reply without confirmation.
- No CRM update without confirmation.
- No IVR/call action without provider contract, role permission, and audit log.
- Customer Center must begin as read-only / preview-first.

## Recommended Product Architecture
Recommended future sidebar group after contract/blueprint approval:

CUSTOMER
- Customer Center
- Messages
- Calls & IVR
- CRM

Recommended first surface:
`Customer Center`

Recommended first release mode:
- read-only overview.
- unified inbox preview.
- conversation preview.
- customer profile preview.
- ticket/SLA snapshot.
- AI reply draft.
- escalation preview.
- route to Task Center / Governance only.
- no external send.
- no CRM mutation.
- no calls.
- no IVR triggers.

Messages, Calls & IVR, and CRM can initially be tabs or sections inside Customer Center until backend/API/provider readiness justifies separate routes.

## Recommended Next Phase
`PHASE 3AH.2 — Customer Backend Authority Contract Plan`

Reason:
The audit confirms a real customer-operations runtime foundation exists, but the frontend route/sidebar should not be added until authority boundaries are defined.

3AH.2 must define:
- read-only APIs.
- preview/draft APIs.
- confirmation-gated mutations.
- forbidden actions.
- provider readiness levels.
- privacy/GDPR boundaries.
- audit log requirements.
- role permissions.
- handoff rules between AI Command, Operations, Governance, Task Center, and future Customer Center.
