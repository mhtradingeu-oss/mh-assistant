# T81 — Content Studio Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/content-studio-workspace.js`

This follows T80, which confirmed Content Studio is an active high-risk content execution surface with AI backend execution, backend content persistence, approvals, tasks, Library handoff, Media handoff, Publishing handoff, AI Command handoff, and local draft flows.

## Actions to classify

### 1. Generate Draft
Expected classification:
- AI backend execution through `executeProjectAiCommand`.
- Requires explicit operator confirmation.
- Result must remain draft/review-ready, not published.

### 2. Translate / Adapt
Expected classification:
- AI backend execution through `executeProjectAiCommand`.
- Requires explicit operator confirmation.
- Result must remain editable draft/prompt adaptation.

### 3. Save Draft
Expected classification:
- Local draft first, optionally backend save through `saveProjectContentItem`.
- Backend persistence should have explicit confirmation or clear user intent.

### 4. Send to AI Command
Expected classification:
- Shared AI draft / handoff only.
- Safe if it does not execute provider/backend command directly.

### 5. Send to Media
Expected classification:
- Handoff through `createProjectHandoff`.
- Must not generate media directly.
- Requires confirmation if backend handoff is created.

### 6. Send to Publishing
Expected classification:
- Handoff through `createProjectHandoff`.
- Must not publish directly.
- Requires confirmation if backend handoff is created.

### 7. Version Approve
Expected classification:
- Local readiness change and/or backend content save.
- Requires confirmation if it changes backend readiness.

### 8. Version Reject
Expected classification:
- Local readiness change and/or backend content save.
- Confirmation recommended if backend save occurs.

### 9. Version Regenerate
Expected classification:
- Local prompt-ready version creation unless it calls AI/backend execution.
- If backend save occurs, classify persistence behavior.

### 10. Version Save Draft
Expected classification:
- Local/backend content persistence through `persistContentRecord`.
- Confirmation depends on backend write behavior.

### 11. Version Save Library
Expected classification:
- Library handoff/save path through `saveToLibrary`.
- May create backend handoff through `createProjectHandoff`.
- Requires confirmation if backend handoff is created.

### 12. Agent Use / Save / AI
Expected classification:
- Use = local prompt modification.
- Save = local/backend content save.
- AI = shared AI draft/handoff only unless backend execution occurs.

## Decision Rule
- If AI execution lacks confirmation, patch.
- If backend handoff to Media/Publishing/Library lacks confirmation, patch.
- If backend content save occurs from unclear actions without confirmation/copy, patch.
- If all authority-sensitive paths are guarded, close with no patch.
- Do not redesign Content Studio in this pass.
