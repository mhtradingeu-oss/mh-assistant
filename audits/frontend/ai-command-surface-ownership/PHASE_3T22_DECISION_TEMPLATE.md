# PHASE 3T.22 — AI Command Surface Ownership + Media/Team Handoff Decision

## Decision Status
Closed as audit-only.

## Recommended Decision
Option D — Audit-only deeper decomposition plan before implementation.

No production patch is approved in PHASE 3T.22.

## Evidence Summary

AI Command is a powerful central AI operating surface, not a simple chat page.

Confirmed evidence:
- `public/control-center/pages/ai-command.js` is 5653 lines.
- It imports backend projection helpers:
  - `getProjectedActiveRole`
  - `getProjectedTeamMembers`
- It contains local compatibility/team constructs:
  - `MODE_DEFS`
  - `AGENT_CARDS`
  - specialist routing
  - team / solo mode
  - preview / handoff / task / workflow routing logic
- It calls AI command/chat/guidance services:
  - `executeProjectAiCommand`
  - `executeProjectAiChat`
  - `executeProjectAiGuidance`
- It contains explicit safety language around publishing, workflow execution, CRM mutation, customer replies, approvals, and backend actions.
- It repeatedly presents outputs as review-ready drafts, previews, guidance, or handoffs.

## Ownership Classification

### Confirmed AI Command ownership
AI Command owns:
- active AI review
- assistant guidance
- AI team interaction
- solo specialist mode
- full team review mode
- review-ready drafts
- prompt/tool preparation
- non-destructive recommendations
- context-aware routing suggestions
- handoff draft preparation
- conversion of conversation into review-ready output

### Confirmed non-ownership boundaries
AI Command does not own:
- Settings configuration authority
- Integrations provider readiness/configuration authority
- Library source evidence/assets authority
- Media Studio media preparation/generation workflow authority
- Publishing schedule/publish execution authority
- Operations task/job/queue tracking authority
- Governance approvals/authority/proof authority
- CRM/customer reply mutation authority
- workflow execution authority
- backend task creation authority

## Shared Handoff Surfaces

### Media Studio → AI Command
Supported as review/guidance/handoff context only.
AI Command may prepare media direction, creative briefs, scripts, video notes, or handoff drafts.
AI Command must not execute media generation jobs unless a separate approved execution path exists.

### Library → AI Command
Supported as context/source review only.
Library remains the source evidence and asset authority.

### Publishing → AI Command
Supported as publishing readiness review, checklist, handoff package, caption/copy draft, and risk notes.
Publishing remains the schedule/publish execution authority.

### Workflows → AI Command
Supported as workflow draft and planning guidance.
Workflows remains the execution authority.

### Governance → AI Command
Supported as compliance notes, claims review, approval risk, and safety checklist.
Governance remains the approval/proof authority.

### Operations → AI Command
Supported as task plan, routing draft, escalation draft, and handoff package.
Operations remains the task/job/queue tracking authority.

## Risk Classification

### P0 / must not change without explicit approval
- Any code path that calls backend execution.
- Any path that creates tasks.
- Any path that runs workflows.
- Any path that publishes or schedules.
- Any path that approves governance items.
- Any path that mutates CRM/customer records.
- Any path that sends customer replies.
- Any attempt to turn review-only handoffs into execution.

### P1 / needs future audit before UX implementation
- AI Command file size and monolithic structure.
- Local compatibility authority in `MODE_DEFS` / `AGENT_CARDS`.
- Specialist routing and destination inference.
- Tool dock actions.
- Voice/read/attach presentation.
- Handoff lifecycle presentation.
- Provider output labeling.

### P2 / future operating surface improvement
- Decompose AI Command into smaller modules.
- Separate pure render sections from handlers.
- Extract team model compatibility layer.
- Extract handoff/preview builders.
- Extract safety copy constants.
- Add focused Browser QA after any future UX pass.

### No change needed now
- Safety copy is already strong enough to avoid immediate copy-only patch.
- No CSS patch is justified in this audit phase.
- No route/backend/API changes are justified.

## Final Decision

Close PHASE 3T.22 as audit-only.

Next recommended phase:
PHASE 3T.23 — AI Command Decomposition / UX Finalization Plan

That next phase should remain plan-first and should not implement production changes until the exact decomposition or UX scope is approved.
