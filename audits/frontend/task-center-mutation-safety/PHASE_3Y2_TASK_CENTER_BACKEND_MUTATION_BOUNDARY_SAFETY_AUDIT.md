# PHASE 3Y.2 — Task Center Backend / Mutation Boundary Safety Audit

## Status
Audit-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3Y.1 — Task Center Finalization Truth Audit`
- Previous commit: `0a212d1 Add Task Center finalization truth audit`

## Source Truth
Task Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `taskCenterRoute`
- id: `task-center`

## Purpose
Audit task-related backend and mutation boundaries before any Task Center patch, Browser QA closeout, or enabling disabled task mutation actions.

3Y.1 confirmed Task Center itself is currently mostly:
- read
- review
- copy
- filter
- handoff
- route/prompt AI

But system-wide task mutation capabilities exist and must be mapped.

## Audit Questions
- Which frontend functions can create durable tasks?
- Which backend routes support task creation or task center reads?
- Does Task Center itself call any task mutation API?
- Which pages call `createProjectTask`?
- Which pages call `listProjectTasks`?
- Does AI Command create durable tasks or only task previews?
- Does Workflows create tasks or only review handoffs?
- Are task mutations confirmation-gated?
- Are disabled Task Center mutation buttons truly disabled and without handlers?
- Does any route silently consume handoff into durable task?
- Are task creation flows safe, explicit, and source-linked?

## Required Output
This phase must produce:
- Task mutation boundary evidence.
- Task Center active action evidence.
- Cross-page task creation evidence.
- Backend route evidence.
- Action risk matrix.
- Recommended next phase.

## Safety Rules
- No Task Center code changes.
- No operations-centers code changes.
- No API/backend changes.
- No CSS changes.
- No mutating task action testing.
- Do not enable disabled buttons.
- Do not create tasks.
- Do not claim full task mutation safety until evidence is reviewed.
