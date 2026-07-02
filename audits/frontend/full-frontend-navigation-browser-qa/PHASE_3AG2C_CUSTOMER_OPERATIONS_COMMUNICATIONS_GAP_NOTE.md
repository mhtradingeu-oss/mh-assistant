# PHASE 3AG.2C — Customer Operations / Communications Gap Note

## Status
Gap note / planning-only.

No production implementation is approved in this phase.

## Why This Exists
During full frontend navigation QA, we confirmed the current sidebar covers the existing registered Control Center route groups:
- Primary
- Secondary
- System

However, the current sidebar does not expose a dedicated customer-service group for:
- Customer Service
- Customer Operations Center
- Messages Inbox
- Call Center
- IVR
- Calls
- CRM Inbox
- Conversation Preview

## Current State
Customer-related capability exists partially as:
- AI Command customer operations guidance.
- Operations Overview routing/monitoring.
- Notification Center alerts/messages.
- Content Studio email/content preparation.
- Publishing/governance review paths.

But there is no dedicated full customer communication operating surface yet.

## Important Boundary
AI Command is not allowed to silently:
- send customer replies.
- mutate CRM records.
- execute support actions.
- place calls.
- trigger IVR flows.
- send external messages.
- create durable customer-service records without destination confirmation.

AI Command may only prepare:
- guidance.
- reply previews.
- handoff context.
- routing suggestions.

## Required Future Surface Group
A future major surface group should be audited and designed:

`PHASE 3AH — Customer Operations / Communications OS Gap Audit`

Candidate pages:
- Customer Center
- Messages
- Calls & IVR
- CRM
- Support Knowledge Base

## Candidate Sidebar Group
If approved after audit, add a new sidebar group:

CUSTOMER
- Customer Center
- Messages
- Calls & IVR
- CRM

## Required Audit Before Adding Pages
Before adding any customer-service route, audit:
- backend routes.
- CRM provider integrations.
- email/message ingestion.
- call/IVR provider readiness.
- WhatsApp/Meta/Instagram DM readiness.
- conversation storage.
- reply draft workflow.
- approval before reply.
- escalation rules.
- GDPR/privacy requirements.
- audit logging.
- human handoff.
- AI customer support role boundaries.

## Final Decision
Do not add Customer/IVR/Call Center pages directly during 3AG.

Record this as a future major surface group and complete:
- 3AG.2B route/sidebar parity.
- 3AG.2 Browser QA correction if needed.
- 3AG.3 navigation closeout.

Then start:
`PHASE 3AH — Customer Operations / Communications OS Gap Audit`
