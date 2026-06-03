# PHASE 3AH.3 — Customer Center Product Architecture Blueprint

## Status
Blueprint-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AH.2 — Customer Backend Authority Contract Plan`
- Previous commit: `a58e67c Plan customer operations backend authority contract`

## Purpose
Define the future Customer Center product surface before adding frontend routes, sidebar items, APIs, or UI implementation.

## Product Vision
Customer Center turns customer communication into an operating surface.

It is not a simple inbox.

It should unify:
- customer conversations.
- inbound messages.
- tickets.
- SLA risk.
- customer profiles.
- AI reply drafts.
- escalation.
- task handoff.
- governance review.
- channel readiness.
- future calls and IVR readiness.

## Sidebar Strategy
Initial recommended sidebar group after implementation approval:

CUSTOMER
- Customer Center

Do not add Messages, Calls & IVR, and CRM as separate sidebar routes in the first release.

Reason:
- The backend has customer operations foundations, but provider execution is partial.
- Voice / IVR is not ready.
- CRM provider execution is not ready.
- A single Customer Center reduces navigation complexity.
- Messages, Calls & IVR, and CRM can start as tabs inside Customer Center.

Future expansion after maturity:

CUSTOMER
- Customer Center
- Messages
- Calls & IVR
- CRM

## First Release Mode
Customer Center v1 must be:
- read-only.
- preview-first.
- no external send.
- no call placement.
- no IVR trigger.
- no CRM mutation.
- no auto-reply.
- confirmation-gated for any future mutation.

## Page Role
Customer Center owns customer communication visibility.

It may:
- show customer readiness.
- show unified inbox.
- show conversations.
- show messages.
- show customer profiles.
- show tickets.
- show SLA risk.
- show escalation state.
- prepare reply drafts.
- prepare task handoffs.
- prepare governance review handoffs.
- route to AI Command, Task Center, Governance, and Operations Overview.

It must not:
- send replies directly.
- call customers.
- trigger IVR.
- mutate external CRM.
- sync external customer records.
- close tickets automatically.
- escalate externally without confirmation.
- claim an action was executed when it was only drafted.

## Recommended Page Layout

### 1. Header / Operating Snapshot
The top section should answer:
- How many conversations are open?
- How many are urgent?
- How many missed SLA?
- How many need reply?
- Which channels are active?
- What is blocked?
- What is the next best action?

Header metrics:
- Open conversations.
- Waiting replies.
- SLA risk.
- Urgent tickets.
- Unassigned conversations.
- Channel readiness.
- AI draft readiness.

### 2. Main Workspace
Main workspace should include:

#### Unified Inbox Panel
- Inbox entries.
- Channel badge.
- Priority.
- Customer name or masked identifier.
- Last message preview.
- SLA timer.
- Assignment.
- Status.

#### Conversation Preview
- Selected conversation.
- Timeline of messages.
- AI/human/customer sender markers.
- Message safety labels.
- Sensitive data warning if needed.
- Last activity.

#### Customer Profile Preview
- Customer name / masked profile.
- Email / channel handles if allowed.
- CRM stage if internal.
- Recent issues.
- Sentiment.
- Lifetime/context summary if available.
- Privacy notice.

#### Ticket / SLA Snapshot
- Ticket status.
- Priority.
- SLA policy.
- Escalation state.
- Assigned team.
- Recommended action.

### 3. Action Panel
Action Panel should provide only safe actions in v1:

Allowed v1 actions:
- Generate reply draft.
- Summarize conversation.
- Translate last message.
- Create task handoff preview.
- Prepare escalation preview.
- Route to Governance review.
- Route to Task Center.
- Route to AI Command with customer context.

Disabled / future actions:
- Send reply.
- Add CRM note.
- Update ticket.
- Assign conversation.
- Mark reviewed.
- Trigger callback.
- Trigger IVR.
- Sync CRM.
- Auto-reply.

Disabled actions must show why they are disabled:
- Requires provider readiness.
- Requires confirmation gate.
- Requires backend API contract.
- Requires role permission.
- Requires audit log.

### 4. AI Panel
AI Panel should behave as a customer support specialist assistant.

Allowed:
- summarize customer issue.
- draft reply.
- improve tone.
- detect urgency.
- detect sentiment.
- detect escalation need.
- prepare GDPR-safe response.
- translate reply.
- prepare internal note.
- suggest next action.

Forbidden:
- send reply.
- update CRM.
- close ticket.
- place call.
- trigger IVR.
- claim execution.

### 5. Tabs / Sections
Recommended v1 tabs inside Customer Center:
- Inbox.
- Conversation.
- Customer.
- Tickets / SLA.
- Drafts / Handoffs.
- Channel Readiness.

Future tabs:
- Calls.
- IVR.
- CRM.
- Knowledge Base.
- Automations.

## Data Model Projection
Customer Center should project these data classes:

- readiness snapshot.
- inbox entry.
- conversation.
- message.
- customer profile.
- ticket.
- escalation.
- SLA policy.
- channel readiness.
- AI draft.
- task handoff.
- governance handoff.

## Empty State Strategy
Customer Center must be useful even before live integrations.

Empty states:
- No inbox entries yet.
- No conversations yet.
- No customer profiles yet.
- No tickets yet.
- No channel provider connected.
- Voice / IVR not ready.
- CRM provider not ready.

Each empty state should include:
- what this area will show.
- what is needed to activate it.
- safe next step.
- route to Integrations or AI Command where useful.

## Integration Readiness Strategy
The page must separate:
- internal runtime readiness.
- provider/channel readiness.
- external send readiness.
- voice/IVR readiness.
- CRM sync readiness.

Suggested readiness labels:
- Runtime ready.
- Read-only ready.
- Draft ready.
- Provider not connected.
- External send locked.
- Voice not ready.
- CRM mutation locked.

## Navigation / Handoff Strategy
Allowed route handoffs:
- AI Command: prepare reply/summarization prompt.
- Task Center: create task preview / handoff only.
- Governance: review risky reply / escalation.
- Operations Overview: monitor customer operations readiness.
- Integrations: connect channels/providers.

## Security / Privacy UX
Customer Center must visibly communicate:
- customer data is sensitive.
- AI outputs are drafts.
- external sends require confirmation.
- CRM updates require confirmation.
- call/IVR actions are disabled until provider readiness.
- sensitive data should be minimized in logs and summaries.

## Browser QA Requirements For Future Implementation
When implemented, QA must verify:
- route loads without blank/error.
- sidebar Customer group renders if added.
- page works with empty data.
- page works with seeded customer data.
- AI draft does not send externally.
- disabled actions remain disabled.
- no CRM mutation occurs.
- no ticket mutation occurs unless explicitly enabled.
- no call/IVR trigger occurs.
- no provider send occurs.
- handoff routes navigate only.
- privacy warning renders.
- readiness labels render accurately.

## Recommended Next Phase
`PHASE 3AH.4 — Customer Center Read-Only API / Projection Contract Audit`

Reason:
The product architecture is now defined. Before frontend implementation, verify or plan the exact read-only API/projection contract needed to populate Customer Center v1.
