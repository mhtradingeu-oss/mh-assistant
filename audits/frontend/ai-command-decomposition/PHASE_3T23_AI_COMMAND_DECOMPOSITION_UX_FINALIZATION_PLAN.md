# PHASE 3T.23 — AI Command Decomposition / UX Finalization Plan

## Status
Plan-only / audit-only.

No production implementation is approved in this phase.

## Baseline
- Previous phase: PHASE 3T.22 — AI Command Surface Ownership + Media/Team Handoff Audit
- Previous commit: d460a38 Add AI Command ownership handoff audit
- AI Command file size confirmed in previous evidence: 5653 lines

## Purpose
Create a safe decomposition and UX finalization plan for AI Command before any implementation.

AI Command is confirmed as the central active AI work surface for:
- AI review
- specialist/team guidance
- drafts
- previews
- handoff preparation
- routing suggestions
- review-ready outputs

AI Command is not execution authority for:
- publishing
- workflow runs
- approvals
- CRM mutation
- customer replies
- backend task creation
- destructive actions

## Why this phase is needed
`public/control-center/pages/ai-command.js` is currently too large and contains multiple responsibilities in one file:
- local compatibility team/mode definitions
- backend projection usage
- specialist rendering
- full team rendering
- prompt/tool dock definitions
- preview builders
- handoff builders
- session/runtime state
- chat handlers
- voice/read/copy/save handlers
- route suggestion logic
- safety copy
- final page render

Before changing UI or extracting code, we need a controlled plan.

## Non-Negotiable Boundaries
- Backend remains authority.
- Frontend remains projection and experience.
- Review-only stays review-only.
- No silent execution.
- No publish/schedule/approve/run/delete/archive/CRM/customer reply mutation from AI Command.
- No CSS changes in this planning phase.
- No route changes.
- No API changes.
- No provider execution changes.
- No data/projects changes.

## Target UX Direction
AI Command should become:

# AI Team Command Center

The final user experience should make clear:
- choose one specialist or the full AI team
- ask for guidance, drafts, plans, reviews, and handoffs
- understand what the output is
- understand where execution happens
- route safely to the owning workspace
- never confuse AI guidance with live execution

## Proposed Future Module Boundaries

### 1. `ai-command/team-model.js`
Purpose:
- MODE_DEFS compatibility definitions
- AGENT_CARDS compatibility definitions
- backend-projected member normalization
- specialist metadata helpers

Rules:
- Must remain projection-compatible.
- Must not become authority source.
- Backend-projected members must override local fallback where available.

### 2. `ai-command/safety-copy.js`
Purpose:
- shared safety labels
- review-only warnings
- confirmation notes
- no-execution language

Rules:
- Must preserve current strong boundaries.
- Must not weaken publish/workflow/CRM/approval safety text.

### 3. `ai-command/output-classifier.js`
Purpose:
- infer output type
- infer destination route
- detect publishing/workflow/media/governance/task/handoff context

Rules:
- Must not execute.
- Must only classify and suggest.

### 4. `ai-command/preview-builders.js`
Purpose:
- build review-ready previews
- build handoff previews
- build task/workflow draft previews
- build full team output preview

Rules:
- Must not call backend mutation APIs.
- Must keep outputs labeled draft/preview/handoff.

### 5. `ai-command/render-sections.js`
Purpose:
- render header
- render specialist rail
- render command composer
- render response panel
- render tool dock
- render safety banners

Rules:
- Render only.
- No backend calls.
- No direct state mutation except via passed data.

### 6. `ai-command/bind-actions.js`
Purpose:
- bind DOM handlers
- route button clicks
- copy/read/save/clear/use preview actions
- send prompt actions

Rules:
- Any backend call must remain explicit and traceable.
- Destructive or execution-adjacent actions must stay gated.

### 7. `ai-command/session-store.js`
Purpose:
- local session state only
- draft message
- selected mode
- selected specialist
- response preview state

Rules:
- transient UX state only.
- No durable authority.

## Candidate Extraction Order

### Step A — Documentation snapshot only
Capture exact current function map and line ranges.

### Step B — Extract pure safety copy constants
Low-risk if imported without text changes.

### Step C — Extract pure team/model fallback definitions
Medium-risk because authority boundaries must remain projection-first.

### Step D — Extract output/route classifier helpers
Medium-risk. Requires snapshot before/after.

### Step E — Extract preview builders
Medium-risk. Requires fixture-like comparison.

### Step F — Extract render sections
Higher-risk. Only after builders are stable.

### Step G — Extract bind actions
Highest-risk. Only after browser QA plan exists.

## First Safe Implementation Candidate
Do not implement now.

The safest future implementation candidate is:
- Extract safety copy constants only
- No wording changes
- No behavior changes
- No CSS changes

## Browser QA Requirements For Any Future Patch
Before commit:
- Open AI Command page.
- Verify specialist selection works.
- Verify full team mode works.
- Verify prompt send works.
- Verify suggested prompt prefill does not auto-execute.
- Verify handoff preview remains review-only.
- Verify route suggestions navigate only.
- Verify no publish/workflow/CRM/approval execution happens.
- Verify safety copy remains visible.

## Decision
No implementation in PHASE 3T.23.

Recommended next implementation after this phase:
PHASE 3T.24 — AI Command Safety Copy Extraction Snapshot
or
PHASE 3T.24 — AI Command UX Browser QA Baseline

Final choice should be made after reviewing this plan.
