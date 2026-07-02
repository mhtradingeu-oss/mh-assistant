# PHASE 3AH.5 — Customer Read-Only API / Projection Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.4 — Customer Center Read-Only API / Projection Contract Audit`
- Previous commit: `f0b6f99 Add Customer Center read-only API projection audit`

## Purpose
Define the exact read-only backend API and frontend projection helpers required before implementing Customer Center v1.

## Source Truth From 3AH.4
Confirmed:
- Customer Operations runtime exists.
- Contracts/stores/readiness foundation exists.
- Customer Center product architecture exists.
- Backend authority contract exists.

Not confirmed as ready:
- dedicated server read routes.
- frontend API helpers.
- stable projection response shapes.
- privacy-aware Customer Center read model.

## MVP Principle
Customer Center v1 must be:
- read-only.
- preview-first.
- privacy-aware.
- empty-state friendly.
- no external send.
- no CRM mutation.
- no call placement.
- no IVR trigger.
- no auto-reply.

## Required Backend Read-Only Endpoints

### 1. Customer Operations Readiness
`GET /api/projects/:project/customer-operations/readiness`

Purpose:
- return runtime readiness.
- show which customer operations capabilities are internally available.
- show provider limitations.

Projection should include:
- runtime_ready.
- inbox_ready.
- conversations_ready.
- messages_ready.
- tickets_ready.
- customers_ready.
- escalation_ready.
- sla_ready.
- integration_inbox_bridge_ready.
- voice_ready.
- ivr_ready.
- crm_ready.
- external_send_ready.
- blockers.
- warnings.

### 2. Unified Inbox
`GET /api/projects/:project/customer-operations/inbox`

Purpose:
- list safe inbox entries for Customer Center.

Projection should include:
- inbox_id.
- channel.
- conversation_id.
- customer_label.
- masked_customer_id.
- priority.
- status.
- assignment.
- last_message_preview.
- last_message_at.
- sla_status.
- unread_count.
- sensitive_data_flag.

Privacy:
- message preview should be truncated.
- customer identity should be masked if access policy is unknown.

### 3. Conversations
`GET /api/projects/:project/customer-operations/conversations`

Purpose:
- list conversations.

Projection should include:
- conversation_id.
- customer_label.
- channel.
- status.
- priority.
- assigned_team.
- assigned_ai_agent.
- last_message_at.
- message_count.
- ticket_count.
- escalation_state.

### 4. Conversation Detail
`GET /api/projects/:project/customer-operations/conversations/:conversationId`

Purpose:
- show selected conversation detail.

Projection should include:
- conversation summary.
- safe message timeline.
- linked customer profile preview.
- linked ticket/SLA summary.
- escalation summary.
- privacy flags.

### 5. Messages By Conversation
`GET /api/projects/:project/customer-operations/conversations/:conversationId/messages`

Purpose:
- list messages for selected conversation.

Projection should include:
- message_id.
- conversation_id.
- channel_id.
- sender_type.
- sender_label.
- body_preview or body_redacted.
- timestamp.
- direction.
- safety_labels.
- sensitive_data_flag.

Privacy:
- avoid exposing full raw message body until role permissions are defined.
- begin with preview/redacted body where possible.

### 6. Customer Profile Preview
`GET /api/projects/:project/customer-operations/customers/:customerId`

Purpose:
- show safe profile preview.

Projection should include:
- customer_id.
- display_label.
- masked_email.
- channel_handles_masked.
- crm_stage_internal_only.
- recent_issue_summary.
- sentiment_summary.
- lifetime_context_summary.
- privacy_flags.

### 7. Tickets / SLA Snapshot
`GET /api/projects/:project/customer-operations/tickets`

Purpose:
- show ticket and SLA overview.

Projection should include:
- ticket_id.
- conversation_id.
- customer_label.
- type.
- status.
- priority.
- assigned_team.
- sla_status.
- escalation_state.
- created_at.
- updated_at.

### 8. Channels / Provider Readiness
`GET /api/projects/:project/customer-operations/channels`

Purpose:
- show channel readiness.

Projection should include:
- channel_id.
- provider.
- type.
- read_ready.
- draft_ready.
- external_send_ready.
- voice_ready.
- ivr_ready.
- crm_sync_ready.
- backend_supported.
- blocked_reason.

## Required Frontend API Helpers
Add later in `public/control-center/api.js` only after implementation approval:

- `fetchCustomerOperationsReadiness(projectName)`
- `fetchCustomerOperationsInbox(projectName)`
- `fetchCustomerConversations(projectName)`
- `fetchCustomerConversationDetail(projectName, conversationId)`
- `fetchCustomerConversationMessages(projectName, conversationId)`
- `fetchCustomerProfilePreview(projectName, customerId)`
- `fetchCustomerTickets(projectName)`
- `fetchCustomerChannels(projectName)`

All helpers must:
- be read-only.
- use existing request conventions.
- handle empty responses.
- throw clear safe errors.
- avoid mutation verbs.
- avoid external provider calls.

## Required Frontend Read Model
Customer Center page should consume one normalized view model:

`customerCenterModel`

Shape:
- readiness.
- inbox.
- conversations.
- selectedConversation.
- messages.
- selectedCustomer.
- tickets.
- channels.
- blockers.
- warnings.
- emptyStates.
- permissions.
- disabledActions.

## Empty-State Contract
API must support empty runtime gracefully:

- no inbox entries.
- no conversations.
- no customers.
- no tickets.
- channels not connected.
- voice not ready.
- IVR not ready.
- CRM not ready.

Frontend should display:
- what will appear here.
- why it is empty.
- safe next step.
- integration/setup route if relevant.

## Privacy / GDPR Projection Rules
The read-only APIs must:
- minimize PII by default.
- mask customer identifiers unless role policy exists.
- truncate message previews.
- avoid full customer message logs in generic logs.
- include sensitive_data_flag.
- include privacy_flags.
- mark AI output as draft-only.
- prevent external send from read endpoints.

## Explicit Non-Goals
Do not implement in this API plan:
- send reply.
- create ticket.
- update ticket.
- assign conversation.
- add CRM note.
- sync CRM.
- place call.
- trigger IVR.
- send WhatsApp/Instagram/SMS.
- auto-reply.
- auto-close.
- external escalation.

## Recommended Implementation Order After Plan Approval
1. Backend read-only projection routes.
2. Frontend API helpers.
3. Customer Center route/sidebar plan.
4. Customer Center read-only page implementation.
5. Browser QA.
6. Mutation safety audit for any future action.

## Recommended Next Phase
`PHASE 3AH.6 — Customer Read-Only API Implementation Plan`

Reason:
This phase defines the required read-only API/projection contract. The next phase should plan the narrow backend implementation, still without frontend Customer Center UI.
