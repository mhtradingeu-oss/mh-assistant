# T77 — Media Studio Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/media-studio-workspace.js`

This follows T76, which confirmed Media Studio is an active high-risk creative execution surface with provider generation, approvals, tasks, Library handoff, Publishing handoff, backend media job save, and local draft flows.

## Actions to classify

### 1. Start Media Job
Expected classification:
- Local form/session setup or draft start.
- Safe if no backend mutation occurs.

### 2. Generate Prompt From Context
Expected classification:
- Local prompt preparation.
- Safe if no provider/backend call occurs.

### 3. Improve Prompt
Expected classification:
- Provider/AI service call through `improveMediaPrompt`.
- Requires confirmation/access-key handling.
- Result must remain review-only.

### 4. Brand Safety Check
Expected classification:
- Provider/AI service call through `brandCheckMedia`.
- Requires confirmation/access-key handling.
- Result must remain review-only.

### 5. Generate Output
Expected classification:
- Provider-backed generation through one of:
  - `generateMediaImage`
  - `generateMediaVideoBrief`
  - `generateMediaVoiceScript`
  - `generateMediaCampaignPack`
- Requires explicit confirmation and access-key/provider guard.
- Result must be `needs_review`, not approved/published.

### 6. Save Draft / Save Media Job
Expected classification:
- Could be local draft or backend `saveProjectMediaJob`.
- Must distinguish local browser/session draft vs backend persistence.
- Confirmation depends on whether backend mutation is authority-sensitive.

### 7. Mark Review Ready / Approve
Expected classification:
- Local readiness change and/or backend approval decision through `decideProjectApproval`.
- Requires explicit confirmation.
- Must not publish directly.

### 8. Request Approval
Expected classification:
- Backend approval creation through `createProjectApproval`.
- Requires clear operator intent.
- Confirmation recommended if it creates backend approval records.

### 9. Reject Approval
Expected classification:
- Backend approval decision through `decideProjectApproval`.
- Requires explicit confirmation.

### 10. Create Task
Expected classification:
- Backend task creation through `createProjectTask`.
- Requires clear operator intent.
- Confirmation recommended if task is persisted.

### 11. Save to Library
Expected classification:
- Library handoff/save path.
- May create backend handoff through `createProjectHandoff`.
- Must not publish.
- Needs clarity whether it mutates backend or local only.

### 12. Send to Publishing
Expected classification:
- Publishing handoff through shared/backend handoff.
- Must not publish directly.
- Requires confirmation if backend handoff is created.

### 13. Open AI Command Review
Expected classification:
- AI draft/handoff only.
- Safe if no provider execution happens.

## Decision Rule
- If all provider generation, approval decisions, task creation, Library save, and Publishing handoff are explicitly guarded or clearly handoff-only, close with no patch or copy-only patch.
- If any backend/provider action lacks confirmation or clear copy, create a narrow T78 patch.
- Do not redesign Media Studio in this pass.
