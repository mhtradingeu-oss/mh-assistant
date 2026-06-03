# PHASE 3AH.7 — Customer Read-Only API Safe Patch

## Status
Patch drafted; pending review and smoke tests.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.6 — Customer Read-Only API Implementation Plan`
- Previous commit: `29fe923 Plan Customer Center read-only API implementation`

## Scope
Implement narrow Customer Operations read-only backend projections and frontend API helpers.

## Allowed
- Add read-only projection helper.
- Add backend GET routes under `/api/projects/:project/customer-operations`.
- Add frontend read-only API helpers.
- Add audit documentation.

## Forbidden
- No Customer Center frontend route.
- No Customer sidebar group.
- No POST/PATCH/DELETE customer routes.
- No external send.
- No CRM mutation.
- No ticket mutation.
- No conversation assignment.
- No call placement.
- No IVR trigger.
- No provider send.
- No auto-reply.
- No full customer message logging.

## Expected Endpoints
- `GET /api/projects/:project/customer-operations/readiness`
- `GET /api/projects/:project/customer-operations/inbox`
- `GET /api/projects/:project/customer-operations/conversations`
- `GET /api/projects/:project/customer-operations/conversations/:conversationId`
- `GET /api/projects/:project/customer-operations/conversations/:conversationId/messages`
- `GET /api/projects/:project/customer-operations/customers/:customerId`
- `GET /api/projects/:project/customer-operations/tickets`
- `GET /api/projects/:project/customer-operations/channels`

## Expected Frontend Helpers
- `fetchCustomerOperationsReadiness(projectName)`
- `fetchCustomerOperationsInbox(projectName)`
- `fetchCustomerConversations(projectName)`
- `fetchCustomerConversationDetail(projectName, conversationId)`
- `fetchCustomerConversationMessages(projectName, conversationId)`
- `fetchCustomerProfilePreview(projectName, customerId)`
- `fetchCustomerTickets(projectName)`
- `fetchCustomerChannels(projectName)`

## Patch Contents
Added:
- `runtime/orchestrator-service/lib/customer-operations/projections/customer-center-projection.js`
- read-only Customer Operations GET routes in `runtime/orchestrator-service/server.js`
- read-only frontend API helpers in `public/control-center/api.js`

## Safety Confirmation
- No Customer Center frontend route added.
- No Customer sidebar group added.
- No POST/PATCH/DELETE customer routes added.
- No external send added.
- No CRM mutation added.
- No ticket mutation added.
- No call/IVR action added.

## Canonical API Route Fix
Added canonical Control Center read-only routes under:
- `/api/projects/:project/customer-operations/readiness`
- `/api/projects/:project/customer-operations/inbox`
- `/api/projects/:project/customer-operations/conversations`
- `/api/projects/:project/customer-operations/conversations/:conversationId`
- `/api/projects/:project/customer-operations/conversations/:conversationId/messages`
- `/api/projects/:project/customer-operations/customers/:customerId`
- `/api/projects/:project/customer-operations/tickets`
- `/api/projects/:project/customer-operations/channels`

Reason:
Frontend helpers use `/api/projects/:project/customer-operations/...`, while existing legacy routes use `/media-manager/project/:project/customer-operations/...`.
The canonical routes align Control Center API helpers with backend read-only projections.

## Smoke Test Result
Status: Pass with protected-read guard active.

Smoke tested after restarting the server.

Observed:
- `/api/projects/:project/customer-operations/readiness` is reachable.
- `/api/projects/:project/customer-operations/inbox` is reachable.
- `/api/projects/:project/customer-operations/conversations` is reachable.
- `/api/projects/:project/customer-operations/tickets` is reachable.
- `/api/projects/:project/customer-operations/channels` is reachable.

Runtime response:
- Server returned protected-read guard:
  `Protected read routes are disabled until MH_CONTROL_CENTER_WRITE_KEY is configured on the server.`

Decision:
- This confirms routes are registered and reachable.
- Full data payload smoke test requires server environment key configuration.
- No `Cannot GET` response observed after server restart.
- No customer mutation routes were added.
- No external send, CRM mutation, ticket mutation, call, IVR, or provider send was added.
