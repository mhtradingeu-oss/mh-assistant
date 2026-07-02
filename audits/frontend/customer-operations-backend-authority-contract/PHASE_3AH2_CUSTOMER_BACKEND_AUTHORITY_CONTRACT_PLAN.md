# PHASE 3AH.2 — Customer Backend Authority Contract Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.1 — Customer Operations / Communications OS Gap Audit`
- Previous commit: `cd6cbde Add customer operations communications gap audit`

## Purpose
Define backend authority boundaries before adding Customer Center, Messages, Calls & IVR, or CRM frontend routes.

## Source Truth From 3AH.1
Customer Operations has a real backend/runtime foundation:
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

But:
- voice provider execution is not ready.
- IVR provider execution is not ready.
- CRM provider execution is not ready.
- no customer frontend route exists yet.
- no customer sidebar group exists yet.

## Doctrine
Backend owns Customer Operations authority.
Frontend projects Customer Operations state and prepares review-ready actions.

## Authority Classification

### Read-only safe
Allowed for future frontend:
- list conversations.
- list inbox entries.
- list messages.
- view conversation details.
- view customer profile summary.
- view ticket summary.
- view SLA/readiness snapshot.
- view channel/provider readiness.
- view escalation state.
- view audit/readiness indicators.

### Preview / draft safe
Allowed for future frontend:
- generate reply draft.
- generate CRM note draft.
- generate escalation summary.
- generate ticket summary.
- generate customer sentiment summary.
- generate translation.
- generate SLA risk explanation.
- prepare task handoff.
- prepare governance review handoff.

### Confirmation-gated mutations
Allowed only after explicit destination confirmation, role permission, and audit logging:
- create ticket.
- update ticket status.
- assign conversation.
- add CRM note.
- create follow-up task.
- mark conversation reviewed.
- create escalation.
- approve reply for sending.
- send customer reply.
- create customer profile update.

### Forbidden until provider readiness
Not allowed until provider authority, contracts, permissions, audit logs, and QA exist:
- place outbound call.
- trigger IVR flow.
- send WhatsApp message.
- send Instagram DM.
- send Messenger DM.
- send SMS.
- mutate external CRM.
- sync external customer profile.
- auto-send reply.
- auto-close ticket.
- auto-escalate externally.

## Required Future API Contract Categories

### Read APIs
Future candidates:
- `GET /api/projects/:project/customer-operations/readiness`
- `GET /api/projects/:project/customer-operations/inbox`
- `GET /api/projects/:project/customer-operations/conversations`
- `GET /api/projects/:project/customer-operations/conversations/:conversationId`
- `GET /api/projects/:project/customer-operations/customers/:customerId`
- `GET /api/projects/:project/customer-operations/tickets`
- `GET /api/projects/:project/customer-operations/channels`

### Draft / Preview APIs
Future candidates:
- `POST /api/projects/:project/customer-operations/reply-draft`
- `POST /api/projects/:project/customer-operations/escalation-draft`
- `POST /api/projects/:project/customer-operations/crm-note-draft`
- `POST /api/projects/:project/customer-operations/task-handoff-draft`

### Confirmation-gated mutation APIs
Future candidates:
- `POST /api/projects/:project/customer-operations/tickets`
- `PATCH /api/projects/:project/customer-operations/tickets/:ticketId`
- `PATCH /api/projects/:project/customer-operations/conversations/:conversationId/assignment`
- `POST /api/projects/:project/customer-operations/escalations`
- `POST /api/projects/:project/customer-operations/replies/send`

### Forbidden / future provider APIs
Not for initial Customer Center:
- call placement APIs.
- IVR trigger APIs.
- WhatsApp send APIs.
- Instagram DM send APIs.
- SMS send APIs.
- CRM external mutation APIs.

## Frontend Rules For Future Customer Center
The future Customer Center must start as:
- read-only.
- preview-first.
- destination-confirmation-only.
- no external send.
- no call placement.
- no IVR trigger.
- no CRM mutation.
- no auto reply.

Allowed first release:
- Customer Operations readiness snapshot.
- unified inbox preview.
- selected conversation preview.
- customer profile preview.
- ticket/SLA snapshot.
- AI reply draft preview.
- escalation preview.
- route to Task Center.
- route to Governance.
- route to AI Command with customer context.

## Security / Privacy / GDPR Rules
Future Customer Operations UI must:
- avoid exposing unnecessary PII.
- redact sensitive customer data in logs.
- never log full customer messages to general debug logs.
- show provider/channel readiness before actions.
- require role-based access for customer data.
- require confirmation before external send.
- record audit log for all customer mutations.
- support human handoff and escalation.
- keep AI suggestions clearly marked as draft/guidance.

## Required Readiness Gates Before Implementation
Before adding sidebar routes:
- backend read API exists or is explicitly planned.
- response contracts documented.
- no external send in MVP.
- no provider execution in MVP.
- Customer Center route design approved.
- AI boundaries documented.
- Browser QA matrix planned.
- mutation safety audit planned.

## Recommended Next Phase
`PHASE 3AH.3 — Customer Center Product Architecture Blueprint`

Reason:
The authority boundaries are defined. Next step is to design the Customer Center product surface as a read-only / preview-first page before implementation.
