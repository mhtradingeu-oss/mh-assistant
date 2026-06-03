# PHASE 3AI.2 — Customer Center Frontend Route Safe Patch Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AI.1 — Customer Center Frontend Read-Only Route Plan`
- Previous commit: `5ffac0f Plan Customer Center frontend read-only route`

## Purpose
Plan the exact frontend-safe patch required to add Customer Center as a read-only route.

This phase does not implement the route.

## Patch Goal
Add a single read-only Customer Center frontend route after approval:

- route id: `customer-center`
- label: `Customer Center`
- sidebar group: `CUSTOMER`
- page file: `public/control-center/pages/customer-center.js`
- route export: `customerCenterRoute`

## Files To Modify Later

### 1. Router
File:
`public/control-center/router.js`

Expected later change:
- import `customerCenterRoute`.
- register `customer-center`.
- no route aliases unless intentionally documented.

### 2. Sidebar
File:
`public/control-center/index.html`

Expected later change:
- add a new `CUSTOMER` nav group.
- add one item:
  - `data-route="customer-center"`
  - label: `Customer Center`

Do not add:
- Messages.
- Calls & IVR.
- CRM.

### 3. New Page
File:
`public/control-center/pages/customer-center.js`

Expected later content:
- read-only page renderer.
- route export.
- API helper imports from `public/control-center/api.js`.
- empty-state rendering.
- protected-read guard rendering.
- disabled future actions with reasons.
- AI handoff buttons only if they do not execute.

### 4. API
File:
`public/control-center/api.js`

Expected:
- no new API helpers needed if 3AH.7 helpers are sufficient.
- no POST/PATCH/DELETE helpers.
- no send/CRM/call/IVR helpers.

### 5. CSS
Preferred:
- avoid new CSS unless absolutely required.
- use existing operating-surface/card/panel classes where possible.
- if CSS is needed, scope it narrowly to Customer Center.

Possible file:
`public/control-center/styles/12-pages.css`

Only if necessary.

## Data Model Use
Customer Center must consume the read-only helpers already added:

- `fetchCustomerOperationsReadiness`
- `fetchCustomerOperationsInbox`
- `fetchCustomerConversations`
- `fetchCustomerConversationDetail`
- `fetchCustomerConversationMessages`
- `fetchCustomerProfilePreview`
- `fetchCustomerTickets`
- `fetchCustomerChannels`

## Required UI Areas

### Header
- Open conversations.
- Waiting replies.
- SLA risk.
- Urgent tickets.
- Channel readiness.
- External send locked.
- Voice / IVR locked.
- CRM mutation locked.

### Main View
- Unified Inbox.
- Conversation Preview.
- Customer Profile Preview.
- Ticket / SLA Snapshot.
- Channel Readiness.

### Action Panel
Allowed:
- Route to AI Command with prompt context.
- Route to Task Center handoff preview.
- Route to Governance review.
- Summarize conversation as local/AI prompt.

Disabled:
- Send reply.
- Add CRM note.
- Update ticket.
- Assign conversation.
- Mark reviewed.
- Trigger callback.
- Trigger IVR.
- Sync CRM.
- Auto-reply.

## Protected-Read Guard Behavior
If backend returns protected-read guard:
- show a clear protected-read state.
- explain that server key configuration is required.
- do not crash.
- do not show fake data.
- do not enable mutation actions.

## Empty-State Behavior
If APIs return empty data:
- show useful empty states.
- explain what each panel will show.
- explain safe next step.
- keep disabled actions disabled.

## Safety Invariants
The future patch must not:
- add POST/PATCH/DELETE customer routes.
- add send reply.
- add CRM mutation.
- add ticket mutation.
- add assignment mutation.
- add call placement.
- add IVR trigger.
- add provider send.
- add auto-reply.
- log full customer messages.
- add separate Messages/Calls/CRM routes.

## Validation Required In Future Patch
- `node --check public/control-center/pages/customer-center.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`

## Browser QA Required In Future Patch
- `#customer-center` route loads.
- sidebar CUSTOMER group renders.
- no blank screen.
- protected-read guard renders if server key missing.
- empty states render.
- disabled future actions remain disabled.
- no customer mutation occurs from navigation.
- no external provider action occurs.
- AI handoffs remain prompt/context only.

## Recommended Next Phase
`PHASE 3AI.3 — Customer Center Frontend Route Safe Patch`

Reason:
This phase defines exact files and boundaries. The next phase may implement only the read-only Customer Center route/sidebar/page, with no mutations.
