# T132 — Content Workspace Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Exact runtime authority review of:

- `public/control-center/pages/content-studio-workspace.js`

## Why this is required
T127 showed `content-studio-workspace.js` as the second-highest open runtime-risk file.

T128 confirmed it is not helper-only. It is actively imported by the router as the Content Studio route and contains backend authority paths.

## Paths to classify

### 1. AI draft generation
Expected classification:
- Calls AI backend only after explicit confirmation.
- Generated output remains review-only.
- Must not publish, approve, or send externally.

### 2. AI translation/adaptation
Expected classification:
- Calls AI backend only after explicit confirmation.
- Output remains review-only/local draft unless explicitly saved.

### 3. Save content item / draft persistence
Expected classification:
- Calls `saveProjectContentItem`.
- Must be explicit or local-only.
- No silent durable mutation from typing.

### 4. Approve / Mark review-ready
Expected classification:
- Must be confirmation-gated.
- Must distinguish local readiness from backend approval decision.

### 5. Request approval
Expected classification:
- Calls `createProjectApproval`.
- Must be confirmation-gated if present.

### 6. Create task
Expected classification:
- Calls `createProjectTask`.
- Must be confirmation-gated if present.

### 7. Save to Library
Expected classification:
- Creates Library handoff via `createProjectHandoff`.
- Must be confirmation-gated.
- Must not publish.

### 8. Send to AI Command
Expected classification:
- Shared AI draft/handoff only.
- If durable handoff exists, must be confirmation-gated.
- Shared handoff/navigation should be operator-confirmed.

### 9. Send to Media Studio
Expected classification:
- Creates media handoff via shared/durable handoff.
- Must be confirmation-gated before shared/durable handoff and before navigation.

### 10. Send to Publishing
Expected classification:
- Creates publishing handoff via shared/durable handoff.
- Must be confirmation-gated before shared/durable handoff and before navigation.
- Must not publish directly.

### 11. Load handoff / apply incoming context
Expected classification:
- Local/session/shared context only.
- Must not create backend mutation silently.

## Decision Rule
- If AI backend generation/adaptation occurs without confirmation, patch.
- If save/approval/task/handoff creation occurs without confirmation, patch.
- If shared handoff/navigation occurs without confirmation, patch.
- If backend persistence occurs from typing/autosave silently, patch.
- If all authority paths are confirmed or local-only, close without patch.
- Do not redesign Content Workspace.
