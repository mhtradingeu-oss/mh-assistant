# T150A — Operations Centers Action Classification

## Status
Source classification completed.

## Baseline
- 8c17da6 Close Customer Center direct page QA

## Actual Route
- http://127.0.0.1:3000/control-center/#operations-centers

## Visible Sidebar Label
- Operations Overview

## Source Owner
- public/control-center/pages/operations-centers.js

## Purpose
Classify all Operations Centers actions before Browser QA or closeout.

## Finding
Operations Centers is not a pure execution surface.

It is mainly:
- overview/read projection
- navigation surface
- handoff surface
- AI guidance surface

It also owns or exposes limited backend-owned mutations in related Operations surfaces:
- Notification read-state update
- Governance approval record decision

## Action Classification

### Read-only Refresh
These actions reload or refresh projected backend state:
- Task Center refresh
- Queue Center refresh
- Job Monitor refresh
- Notification Center refresh
- Governance refresh

Expected authority:
- Read-only reload / projection refresh
- No job execution
- No queue mutation
- No provider action
- No publish/send action

### Navigation / Handoff
These actions navigate between operational surfaces or hand off context:
- `data-ops-route`
- Operations Overview cards routing to Task Center / Queue Center / Job Monitor / Notification Center / Governance
- Open AI Workspace for Review
- Open AI: Review Task Context
- Open AI: Review Queue Context
- Open AI: Review Job Context
- Open AI: Review Notification Context
- `data-ops-ai-prompt` quick prompts

Expected authority:
- Navigation or context handoff only
- No backend mutation
- No provider execution
- No worker execution
- No publish/send action

### Selection / Local UI State
These actions change frontend-selected state only:
- `data-ops-focus`
- `data-ops-select`
- filters/search/selectors

Expected authority:
- Local UI state only
- No durable backend mutation

### Copy / Local Utility
These actions copy local/generated handoff summaries:
- Copy Handoff Summary
- Copy Selected Task Summary

Expected authority:
- Clipboard/local utility only
- No durable backend mutation

### Disabled Future Mutations
These controls appear intentionally disabled and labeled as future mutation-safety work.

Task Center disabled actions:
- Update status
- Reassign owner
- Change priority
- Update due date
- Delete task

Queue Center disabled actions:
- Retry item
- Approve item
- Publish item
- Remove item

Job Monitor disabled actions:
- Retry job
- Cancel job
- Rerun job
- Delete job

Notification Center disabled actions:
- Acknowledge notification
- Resolve notification
- Dismiss notification
- Delete notification

Expected authority:
- Disabled in current UI
- Must remain disabled until backend policy, permission, confirmation, and audit logging are explicitly approved

### Backend-owned Limited Mutation
Notification Center:
- Mark Read

Expected authority:
- Updates notification read-state only
- Requires confirmation
- Must not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute anything

Browser QA requirement:
- Verify button label and confirm copy clearly state read-state only

### Backend-owned Governance Mutation
Governance approval actions:
- Approve
- Reject
- Request Changes
- Escalate

Expected authority:
- Updates durable Governance approval record only
- Requires confirmation
- Must not publish, send, or execute directly

Browser QA requirement:
- Verify confirmation text clearly states approval-record-only and not publish/send/execute

## Risk Decision
Operations Centers should not be described as purely read-only.

Correct classification:
- Overview/read projection
- Navigation/handoff
- AI guidance
- Disabled future mutation placeholders
- Limited backend-owned mutation surface for notification read-state and Governance approval records

## Required Next Step
T150B Browser QA should verify the actual rendered page and related tabs/routes:
- `#operations-centers`
- `#task-center`
- `#queue-center`
- `#job-monitor`
- `#notification-center`

Browser QA must confirm:
1. Operations Overview loads.
2. Route is correct.
3. Refresh actions do not imply execution.
4. Disabled mutation buttons are visibly disabled.
5. AI actions are context/guidance only.
6. Mark Read, if visible, is clearly read-state only.
7. Governance decisions, if visible, are clearly approval-record only.
8. No console SyntaxError or blocking runtime crash.
9. No production behavior change was made in this audit.
