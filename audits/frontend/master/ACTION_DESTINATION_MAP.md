# MH-OS Action Destination Map

## Purpose

Define canonical action types and execution rules so every important UI action has:
- a clear destination
- a clear authority path
- a clear safety level
- clear user feedback

This document prevents ambiguous actions, hidden execution, and frontend authority drift.

## Canonical Action Types

### Navigate
Meaning:
- Move user to another MH-OS page or scoped workspace.

Authority owner:
- Frontend route projection. Backend authority unaffected.

Allowed frontend behavior:
- Route transition, preserve context, keep state continuity.

Required feedback:
- Show destination context loaded.
- Show what changed in focus.

Confirmation/governance:
- Not required for standard navigation.

Example labels:
- Open in Campaign Studio
- Go to Task Center
- View Governance Queue

### Open AI
Meaning:
- Open AI Command or AI guidance surface with contextual payload.

Authority owner:
- Backend for durable execution and policy; frontend only opens guidance and drafts.

Allowed frontend behavior:
- Pass prompt/context, prefill fields, open AI workspace.

Required feedback:
- Confirm context sent to AI.
- Indicate whether this is draft-only or executable suggestion.

Confirmation/governance:
- Not required for opening AI itself.

Example labels:
- Ask AI to review selected assets
- Open AI with campaign context
- Send setup context to AI

### Start Workflow
Meaning:
- Initialize a workflow session from current context.

Authority owner:
- Backend for durable workflow execution state.

Allowed frontend behavior:
- Start session scaffold, prefill workflow fields, route to Workflows.

Required feedback:
- Confirm workflow session started.
- Show workflow ID/name if available.

Confirmation/governance:
- Required when workflow can trigger external or destructive execution.

Example labels:
- Start workflow for launch readiness
- Start connector recovery workflow
- Start media preparation workflow

### Create Task
Meaning:
- Create a durable operational task assigned for follow-up.

Authority owner:
- Backend task system.

Allowed frontend behavior:
- Collect task payload, submit backend request, display created task reference.

Required feedback:
- Confirm task created.
- Show owner/priority/destination queue.

Confirmation/governance:
- Required if task triggers downstream execution by policy.

Example labels:
- Create task for missing connector
- Create task for legal review
- Create remediation task

### Create Handoff
Meaning:
- Create durable handoff package from one role/page to another.

Authority owner:
- Backend handoff persistence.

Allowed frontend behavior:
- Build handoff payload, submit, route to destination context.

Required feedback:
- Confirm handoff created.
- Show destination and next operator/page.

Confirmation/governance:
- Required when handoff unlocks controlled execution path.

Example labels:
- Create handoff to Publishing
- Handoff to AI Command
- Create governance handoff

### Prepare Draft
Meaning:
- Build non-executing draft output (copy, plan, setup, notes).

Authority owner:
- Frontend projection for temporary draft state; backend if persisted.

Allowed frontend behavior:
- Generate/prefill/edit draft content.

Required feedback:
- Explicitly mark as Draft.
- Indicate not yet executed/published.

Confirmation/governance:
- Not required for local draft creation.

Example labels:
- Prepare campaign draft
- Draft connector recovery plan
- Save content draft

### Prepare Package
Meaning:
- Build structured package for later approval/execution (not live run).

Authority owner:
- Frontend prepares package; backend validates and executes.

Allowed frontend behavior:
- Assemble package inputs, readiness checks, dependency summary.

Required feedback:
- Confirm package prepared.
- Show missing blockers and required approvals.

Confirmation/governance:
- Required before any execution from package.

Example labels:
- Prepare publishing package
- Prepare media package
- Build governance package

### Request Approval
Meaning:
- Submit approval request into governance authority path.

Authority owner:
- Backend governance and approval policy.

Allowed frontend behavior:
- Submit request metadata and context evidence.

Required feedback:
- Confirm approval requested.
- Show approval status and where to track it.

Confirmation/governance:
- Mandatory backend governance path.

Example labels:
- Request governance approval
- Submit for publishing approval
- Request policy approval

### Run Backend Action
Meaning:
- Trigger backend execution endpoint with traceable intent.

Authority owner:
- Backend execution engine and policy controls.

Allowed frontend behavior:
- Trigger, show pending/running/result state, expose trace/log links.

Required feedback:
- What started, current status, next step, failure reason if any.

Confirmation/governance:
- Required for high-impact operations.

Example labels:
- Run backend sync
- Execute connector health check
- Run readiness refresh

### Dangerous Action
Meaning:
- Destructive or irreversible action.

Authority owner:
- Backend with strict validation, confirmation, and governance.

Allowed frontend behavior:
- Show danger UI, explicit confirmation, optional typed confirmation.

Required feedback:
- Confirm exactly what changed/deleted/stopped.
- Provide rollback path if available.

Confirmation/governance:
- Always required.

Example labels:
- Delete selected asset
- Stop running automation
- Archive campaign permanently

### External Link
Meaning:
- Open external destination outside MH-OS scope.

Authority owner:
- N/A for external navigation; frontend responsible for safe disclosure.

Allowed frontend behavior:
- Open new tab/window with explicit external indicator.

Required feedback:
- Indicate external destination domain.

Confirmation/governance:
- Required for sensitive outbound destinations.

Example labels:
- Open provider console
- View external policy reference
- Open marketplace listing

### Download / Export
Meaning:
- Export file/report/package for user retrieval.

Authority owner:
- Backend for generated exports; frontend for local file projection.

Allowed frontend behavior:
- Trigger download, show file type and scope.

Required feedback:
- Confirm export started/completed.
- Include file identity.

Confirmation/governance:
- Required for sensitive data export.

Example labels:
- Export readiness report
- Download asset package
- Export governance audit log

### Copy to Clipboard
Meaning:
- Copy data token/path/text for operational use.

Authority owner:
- Frontend interaction only; no authority mutation.

Allowed frontend behavior:
- Copy selected value with fallback prompt path.

Required feedback:
- Explicit success/failure message.
- Identify what was copied.

Confirmation/governance:
- Not required.

Example labels:
- Copy asset path
- Copy workflow ID
- Copy connector diagnostic

### Refresh / Sync
Meaning:
- Refresh projected state from backend source of truth.

Authority owner:
- Backend source of truth.

Allowed frontend behavior:
- Request latest state, rerender projection.

Required feedback:
- Show refresh in progress and completion status.

Confirmation/governance:
- Not required for read-only sync.

Example labels:
- Refresh task center
- Run backend sync
- Sync connector status

### Retry / Repair
Meaning:
- Retry failed operation or execute guided repair path.

Authority owner:
- Backend for execution, frontend for guided repair UX.

Allowed frontend behavior:
- Retry safe operation, provide repair guidance, create task/handoff when unresolved.

Required feedback:
- Confirm retry attempted.
- Surface new status and reason if still failing.

Confirmation/governance:
- Required when retry can mutate durable or external state.

Example labels:
- Retry connector sync
- Run repair workflow
- Create repair task

## Safety Levels

- Safe: Non-destructive, no durable authority change, reversible UX action.
- Review: Potential impact, requires clear user review before completion.
- Approval Required: Must pass governance or approval checkpoint before execution.
- Dangerous: Destructive or irreversible, explicit confirmation mandatory.
- Backend Controlled: Execution and authority resolved only by backend policy.

Mapping rule:
- Every important action must declare one safety level in design/implementation specs.

## Action Label Rules

Every action label must answer:
- Verb
- Object
- Destination or outcome

Good labels:
- Open in Campaign Studio
- Ask AI to review selected assets
- Create task for missing connector
- Prepare publishing package
- Request governance approval
- Run backend sync

Bad labels:
- Continue
- Run
- Go
- Fix
- Auto
- Submit

Label quality rule:
- If a label cannot tell user what happens next, it is invalid.

## Page-Level Examples

### Home
- Open in Task Center
- Ask AI for next best action
- Start workflow for launch readiness

### Setup
- Prepare setup draft
- Create task for missing setup field
- Request governance approval for setup changes

### Library
- Ask AI to review selected assets
- Create handoff to Content Studio
- Prepare asset package for publishing

### Integrations
- Run backend sync for connector status
- Create task for missing connector
- Start connector repair workflow

### AI Command
- Start workflow from AI plan
- Create task from AI recommendation
- Create handoff to Publishing

### Workflows
- Start workflow session
- Request approval for gated step
- Run backend workflow step

### Task Center
- Open in Queue Center
- Refresh task center
- Create handoff from selected task

### Campaign Studio
- Prepare campaign draft
- Ask AI to improve campaign brief
- Create task for campaign blockers

### Content Studio
- Prepare content package
- Open in Publishing
- Request governance approval

### Media Studio
- Prepare media package
- Create handoff to Publishing
- Request review for high-risk media output

### Publishing
- Prepare publishing package
- Request governance approval
- Run backend publish action

### Governance
- Review approval request
- Approve governed package
- Reject with required next action

### Settings
- Prepare settings update draft
- Request policy approval
- Run backend settings sync

## Forbidden Patterns

- hidden execution
- frontend-only approval
- live publish from unclear button
- destructive action without confirmation
- ambiguous Auto Mode
- action that changes durable state without backend trace
- duplicate actions in multiple panels with different behavior

## Feedback Requirements

After every important action, frontend must clearly show:
- what happened
- where the user is now
- what is next
- whether action was draft, task, workflow, approval request, or backend execution
- failure reason when available

Feedback contract:
- no silent success
- no silent failure
- no ambiguous completion state

## Relation To Frontend Master Authority

This document is a companion to [FRONTEND_MASTER_AUTHORITY.md](audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md).

Authority precedence:
- If action behavior conflicts with master authority doctrine, master authority doctrine wins.
- Backend authority always overrides frontend assumptions.

## Explicit No-Code-Change Statement

This Step 9 task is documentation-only.

No production code was modified.
- No frontend JS changes
- No CSS changes
- No backend changes
- No data/projects changes
- No route behavior changes
