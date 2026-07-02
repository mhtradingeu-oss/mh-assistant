# PHASE 3AH.6 — Customer Read-Only API Implementation Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.5 — Customer Read-Only API / Projection Plan`
- Previous commit: `53c036e Plan Customer Center read-only API projection`

## Purpose
Plan the narrow backend implementation for Customer Center read-only projection APIs.

This phase must not implement Customer Center frontend UI yet.

## Implementation Doctrine
Backend exposes safe, normalized, privacy-aware read-only projections.

Frontend consumes projections later.

No mutation endpoints are implemented in this phase.

## Files To Inspect Before Implementation
Before implementation, inspect:
- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js`
- `runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js`
- `runtime/orchestrator-service/lib/customer-operations/contracts/*.js`
- `runtime/orchestrator-service/lib/customer-operations/*/store/*.js`
- `public/control-center/api.js`

## Backend Read-Only Route Plan

### Route Group
Base route:

`/api/projects/:project/customer-operations`

### Endpoints To Add Later

1. `GET /readiness`
   - Calls customer operations readiness snapshot.
   - Returns safe capability/readiness flags.

2. `GET /inbox`
   - Returns sanitized unified inbox entries.
   - No full raw message bodies.
   - Includes channel/status/priority/SLA preview.

3. `GET /conversations`
   - Returns sanitized conversation list.
   - Includes message/ticket counts where safe.

4. `GET /conversations/:conversationId`
   - Returns safe conversation detail projection.
   - Includes selected conversation summary, linked customer/ticket preview if available.

5. `GET /conversations/:conversationId/messages`
   - Returns redacted/truncated messages.
   - No unbounded raw message exposure in v1.

6. `GET /customers/:customerId`
   - Returns masked customer profile preview.
   - No full PII exposure by default.

7. `GET /tickets`
   - Returns ticket/SLA overview.
   - No mutation.

8. `GET /channels`
   - Returns channel/provider readiness.
   - Indicates voice/IVR/CRM/send locks.

## Projection Helpers To Add Later
Create small pure helpers if needed, for example:

`runtime/orchestrator-service/lib/customer-operations/projections/customer-center-projection.js`

Suggested helper functions:
- `projectCustomerReadiness(runtime)`
- `projectInboxEntries(runtime)`
- `projectConversations(runtime)`
- `projectConversationDetail(runtime, conversationId)`
- `projectConversationMessages(runtime, conversationId)`
- `projectCustomerProfile(runtime, customerId)`
- `projectTickets(runtime)`
- `projectChannels(runtime)`

## Privacy Rules For Projection Helpers
Projection helpers must:
- mask customer identifiers.
- truncate message previews.
- avoid raw full message body in v1.
- include `sensitive_data_flag`.
- include `privacy_flags`.
- include disabled action reasons.
- never mutate runtime stores.
- never call providers.
- never send externally.

## Frontend API Helpers To Add Later
Add only after backend routes exist:

- `fetchCustomerOperationsReadiness(projectName)`
- `fetchCustomerOperationsInbox(projectName)`
- `fetchCustomerConversations(projectName)`
- `fetchCustomerConversationDetail(projectName, conversationId)`
- `fetchCustomerConversationMessages(projectName, conversationId)`
- `fetchCustomerProfilePreview(projectName, customerId)`
- `fetchCustomerTickets(projectName)`
- `fetchCustomerChannels(projectName)`

## Testing Plan For Implementation Phase
When implementation is approved:
- `node --check runtime/orchestrator-service/server.js`
- `node --check runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js`
- `node --check runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js`
- `node --check public/control-center/api.js`
- curl/read-only smoke tests for all new GET endpoints.
- confirm no POST/PATCH/DELETE customer routes added.
- confirm no provider sends.
- confirm empty-state response works.

## Safety Invariants
The implementation phase must not:
- add Customer Center frontend route.
- add Customer sidebar group.
- send replies.
- mutate CRM.
- create or update tickets.
- assign conversations.
- place calls.
- trigger IVR.
- send WhatsApp/Instagram/SMS.
- auto-reply.
- log full customer messages.

## Recommended Next Phase
`PHASE 3AH.7 — Customer Read-Only API Safe Patch`

Reason:
This plan defines the narrow backend implementation. The next phase may implement only read-only backend projection routes and frontend API helpers, with no Customer Center UI route/sidebar yet.
