# T129 — Media Workspace Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Exact runtime authority review of:

- `public/control-center/pages/media-studio-workspace.js`

## Why this is required
T127 showed `media-studio-workspace.js` as the highest open runtime-risk file.

T128 confirmed it is not helper-only. It is actively imported by the router as the Media Studio route and contains backend authority paths.

## Paths to classify

### 1. Provider-backed generation
Expected classification:
- Calls provider/generation backend only after explicit confirmation.
- Must not publish, approve, or send externally.
- Result remains review-only.

### 2. Prompt improve / brand safety review
Expected classification:
- AI/provider call only after confirmation.
- Review-only output.
- No publishing or approval decision.

### 3. Save media job / draft persistence
Expected classification:
- Calls `saveProjectMediaJob`.
- Must be explicit or local-only.
- No silent durable mutation from typing.

### 4. Mark Review Ready / Approve
Expected classification:
- Must be confirmation-gated.
- Must distinguish local readiness from backend approval decision.
- If `createProjectApproval` or approval decision exists, classify exact path.

### 5. Request approval
Expected classification:
- Calls `createProjectApproval`.
- Must be confirmation-gated.

### 6. Create task
Expected classification:
- Calls `createProjectTask`.
- Must be confirmation-gated.

### 7. Save to Library
Expected classification:
- Creates Library handoff via `createProjectHandoff`.
- Must be confirmation-gated.
- Must not publish.

### 8. Send to AI Command
Expected classification:
- Shared AI draft/handoff only.
- If durable handoff exists, must be confirmation-gated.

### 9. Prepare Publishing Package / Send Publishing Handoff
Expected classification:
- Creates publishing handoff via shared/durable handoff.
- Must be confirmation-gated before shared/durable handoff and before navigation.
- Must not publish directly.

### 10. Load handoff / apply incoming context
Expected classification:
- Local/session/shared context only.
- Must not create backend mutation silently.

## Decision Rule
- If provider generation occurs without confirmation, patch.
- If approval/task/handoff creation occurs without confirmation, patch.
- If publishing handoff attaches shared context before confirmation, patch.
- If backend persistence occurs from typing/autosave silently, patch.
- If all authority paths are confirmed or local-only, close without patch.
- Do not redesign Media Workspace.
