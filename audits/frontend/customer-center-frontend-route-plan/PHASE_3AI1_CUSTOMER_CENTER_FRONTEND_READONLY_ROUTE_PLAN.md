# PHASE 3AI.1 — Customer Center Frontend Read-Only Route Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.8 — Customer Read-Only API Closeout / Frontend Readiness Decision`
- Previous commit: `75560e8 Close Customer Center read-only API foundation`

## Purpose
Plan the first Customer Center frontend route as a read-only projection surface.

This phase must not implement the route yet.

## Source Truth
3AH confirmed:
- Customer Operations runtime foundation exists.
- Customer Center product architecture exists.
- Backend authority contract exists.
- Canonical GET-only Customer Operations API routes exist.
- Frontend read-only API helpers exist.
- Customer Center frontend route does not exist yet.
- Customer sidebar group does not exist yet.

## Route Strategy
Add one future route first:

Route id:
`customer-center`

Suggested label:
`Customer Center`

Suggested sidebar group:
`CUSTOMER`

Initial sidebar group:
- Customer Center

Do not add separate sidebar routes yet for:
- Messages.
- Calls & IVR.
- CRM.

These should begin as tabs/sections inside Customer Center until provider/API maturity improves.

## Page File Strategy
Suggested future file:

`public/control-center/pages/customer-center.js`

Suggested route export:

`customerCenterRoute`

The route should follow the existing route registry pattern in:
- `public/control-center/router.js`
- `public/control-center/index.html`
- page modules under `public/control-center/pages/`

## Data Loading Strategy
The page should consume only read-only helpers from `public/control-center/api.js`:

- `fetchCustomerOperationsReadiness(projectName)`
- `fetchCustomerOperationsInbox(projectName)`
- `fetchCustomerConversations(projectName)`
- `fetchCustomerConversationDetail(projectName, conversationId)`
- `fetchCustomerConversationMessages(projectName, conversationId)`
- `fetchCustomerProfilePreview(projectName, customerId)`
- `fetchCustomerTickets(projectName)`
- `fetchCustomerChannels(projectName)`

## First Render Model
The page should construct:

`customerCenterModel`

Sections:
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
- disabledActions.

## UI Structure
Customer Center v1 should use the existing operating surface pattern:

### Header / Operating Snapshot
Metrics:
- Open conversations.
- Waiting replies.
- SLA risk.
- Urgent tickets.
- Channel readiness.
- External send lock.
- Voice / IVR lock.
- CRM mutation lock.

### Main Workspace
Panels:
- Unified Inbox.
- Conversation Preview.
- Customer Profile Preview.
- Ticket / SLA Snapshot.
- Channel Readiness.

### Action Panel
Allowed read-only actions:
- Generate AI reply draft handoff.
- Summarize conversation handoff.
- Translate message handoff.
- Prepare escalation handoff.
- Route to Task Center.
- Route to Governance.
- Route to AI Command.

Disabled future actions:
- Send reply.
- Add CRM note.
- Update ticket.
- Assign conversation.
- Mark reviewed.
- Trigger callback.
- Trigger IVR.
- Sync CRM.
- Auto-reply.

Each disabled action must show a reason.

### AI Panel
AI panel should be prompt/handoff only:
- summarize customer issue.
- draft reply.
- improve tone.
- detect urgency.
- detect sentiment.
- prepare internal note.
- suggest next action.

Must not:
- send reply.
- update CRM.
- close ticket.
- place call.
- trigger IVR.
- claim execution.

## Protected Read Guard Handling
If APIs return:
`Protected read routes are disabled until MH_CONTROL_CENTER_WRITE_KEY is configured on the server.`

The page should show:
- protected-read guard message.
- setup/admin note.
- no crash.
- no blank page.
- no fake data.
- no mutation action.

## Empty-State Requirements
The page must render useful empty states for:
- no inbox entries.
- no conversations.
- no selected conversation.
- no tickets.
- no customers.
- no connected channels.
- voice not ready.
- IVR not ready.
- CRM not ready.

Each empty state should explain:
- what will appear here.
- why it is empty.
- safe next step.

## Safety Rules
Future implementation must not:
- add mutation handlers.
- add POST/PATCH/DELETE customer routes.
- send replies.
- mutate CRM.
- create or update tickets.
- assign conversations.
- place calls.
- trigger IVR.
- send provider messages.
- auto-reply.
- log full customer messages.

## Browser QA Requirements
Future implementation must verify:
- route loads without blank/error.
- sidebar group renders.
- protected-read guard renders safely.
- empty states render.
- read-only data renders if available.
- disabled future actions remain disabled.
- AI handoffs do not execute.
- no customer mutation triggered by navigation.
- no external provider action triggered.

## Recommended Next Phase
`PHASE 3AI.2 — Customer Center Frontend Route Safe Patch Plan`

Reason:
3AI.1 defines the frontend route/page architecture. The next phase should plan the exact files to modify before any implementation:
- router.
- sidebar.
- new page file.
- api import usage.
- CSS scope if needed.
- browser QA matrix.
