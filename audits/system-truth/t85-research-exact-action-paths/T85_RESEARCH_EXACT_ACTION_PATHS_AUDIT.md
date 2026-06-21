# T85 — Research Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/research.js`

This follows T84, which confirmed Research is not a pure read-only page. It has local saved findings/recommendations and can create backend handoffs through `createProjectHandoff`.

## Actions to classify

### 1. Refresh Research
Expected classification:
- Read-only backend fetch through `fetchProjectInsights` and `fetchProjectLearning`.
- Should not mutate backend records.

### 2. Open AI Workspace Review
Expected classification:
- Navigation only to AI Command.
- Safe if no backend execution or handoff persistence.

### 3. Research AI Prompt Buttons
Expected classification:
- Sets shared handoff to AI Command.
- May call `createProjectHandoff`.
- Requires confirmation if backend handoff is created.

### 4. Route to Campaign / Content / SEO / Ads / AI
Expected classification:
- Creates route-specific handoff.
- May call `createProjectHandoff`.
- Requires confirmation if backend handoff is created.
- Must not execute downstream actions directly.

### 5. Opportunity Handoff Buttons
Expected classification:
- Likely shared AI prompt or route handoff.
- Must confirm whether backend handoff is created.
- Must not execute downstream actions directly.

### 6. Manual Research Finding Save
Expected classification:
- Local session save only.
- Safe without confirmation if no backend persistence.

### 7. Save Reusable Insight Block
Expected classification:
- Local session save only.
- Safe without confirmation if no backend persistence.

### 8. Save Recommendation
Expected classification:
- Local session save only.
- Safe without confirmation if no backend persistence.

## Decision Rule
- If `createProjectHandoff` is called from Research without confirmation, create a narrow T86 patch.
- If all backend handoff creation is confirmed or local-only, close with no patch.
- Do not redesign Research in this pass.
