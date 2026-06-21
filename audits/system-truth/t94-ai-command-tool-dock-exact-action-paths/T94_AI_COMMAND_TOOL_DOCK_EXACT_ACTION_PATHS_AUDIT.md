# T94 — AI Command Tool Dock Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing action paths in:

- `public/control-center/pages/ai-command/tool-dock.js`

This follows T93.

## Paths to classify

### 1. Tool button click
Expected classification:
- Opens drawer only.
- Should not execute AI/backend action.

### 2. Drawer open/close
Expected classification:
- UI only.

### 3. Choose Library Source
Expected classification:
- Shared bridge/context + navigation to Library.
- Should not mutate backend.

### 4. Change Source / Remove Source
Expected classification:
- Shared context only.
- Should not mutate backend.

### 5. Source-required validation
Expected classification:
- UI guard only.

### 6. Destination select
Expected classification:
- Prompt framing only.
- Should not create backend handoff.

### 7. Prepare / load prompt into composer
Expected classification:
- Composer-ready instruction only.
- Should not execute AI automatically.
- Should not create backend handoff/task/approval.

### 8. Auto-open after Library return
Expected classification:
- Drawer restoration only.

## Decision Rule
- If Tool Dock only opens drawer, manages shared source context, and loads prompt into composer, close without patch.
- If any path executes AI/provider/backend or creates durable task/handoff/approval, patch or classify separately.
- Do not redesign Tool Dock in this pass.
