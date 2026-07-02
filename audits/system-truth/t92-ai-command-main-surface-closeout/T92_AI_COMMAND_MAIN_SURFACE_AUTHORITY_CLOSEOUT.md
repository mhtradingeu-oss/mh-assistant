# T92 — AI Command Main Surface Authority Closeout

## Status
Closed — no production patch required.

## Scope
Runtime authority review of:

- `public/control-center/pages/ai-command.js`

## Prior audits
- T88 — Remaining Frontend Risk Rebaseline After Studio + Research
- T89 — AI Command Core Surface Authority Audit
- T90 — AI Command Exact Action Paths Audit
- T91 — AI Command Main Execution Path Audit

## Finding
AI Command is the highest-risk remaining core surface by static score, but exact path inspection confirmed that `ai-command.js` mainly operates as:

- AI chat surface
- prompt preparation surface
- local draft/history surface
- local preview builder
- shared context routing surface
- destination handoff preparation surface

It does not directly create backend tasks, approvals, durable handoffs, workflow runs, publishing actions, or governance decisions.

## Main Ask / Send classification
The main Ask path calls:

- `executeProjectAiChat`

This is intentional for AI Command.

The payload includes a clear safety instruction:

- `Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.`

The response handling:

- appends chat messages locally
- appends response history locally
- saves local output through `saveLocalOutput`
- saves local chat session through `saveAiChatSession`
- does not create backend task records
- does not create backend approval records
- does not create backend handoff records
- does not publish
- does not run workflows

## Prepare / Task / Workflow / Handoff buttons
These are preview-only paths:

- Prepare guidance preview
- Draft task preview
- Draft workflow preview
- Handoff preview

They persist only local draft/output state and do not create durable backend records.

## Response actions
Classified as:

- Continue: focus composer only
- Copy: clipboard only
- Use: insert response into composer
- Save: local output save only
- Convert: local preview conversion
- Send: shared AI draft + shared handoff context only
- Read: browser speech synthesis only

No backend mutation was found.

## Preview actions
Classified as:

- Copy: clipboard only
- Use: insert preview into composer
- Send: shared AI draft + shared handoff context only
- Save: local output save only
- Read: browser speech synthesis only
- Clear: local preview clear only

No backend mutation was found.

## Critical call check
The critical call scan found:

- `executeProjectAiChat`
- `executeProjectAiGuidance` availability/status references
- `saveLocalOutput`
- `saveAiChatSession`
- `setSharedAiDraft`
- `setSharedHandoff`

It did not find direct calls to:

- `createProjectHandoff`
- `createProjectTask`
- `createProjectApproval`
- `decideProjectApproval`

inside `public/control-center/pages/ai-command.js`.

## Decision
`public/control-center/pages/ai-command.js` is safe to close without patch.

AI execution is intentional, operator-triggered, chat-only, and explicitly instructed not to claim or perform external execution.

## Boundary
This closeout does not close:

- `public/control-center/pages/ai-command/tool-dock.js`

Tool Dock is ranked separately in T88 and must receive its own focused runtime-authority audit.

## Validation
Validated with:

- `node --check scripts/audit/remaining-frontend-risk-after-studio-research.mjs`
- `node --check scripts/audit/ai-command-core-authority-audit.mjs`
- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

## Next step
Continue with:

- `public/control-center/pages/ai-command/tool-dock.js`

as the next AI Command sub-surface audit.
