# PHASE 3U.3 — Library CSS / UX Density Consolidation Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3U.2 — Library Browser QA Evidence + Local Restore Note`
- Previous commit: `3ebed56 Add Library browser QA evidence and local restore note`

## Purpose
Plan a safe Library UX/density consolidation after Library was confirmed runnable with restored local media data.

This phase exists because Library is a high-value, high-risk surface:
- It owns source evidence and assets.
- It supports AI Command context.
- It supports Media Studio asset usage.
- It supports Publishing handoff evidence.
- It supports Governance proof.
- It includes archive and soft-delete actions.
- It contains many controls in one workspace.

## Current Truth
PHASE 3U.2 confirmed:
- Library loads locally.
- Project data API works.
- Media/assets were restored locally.
- Asset registry contains 129 records.
- 127 asset paths resolve.
- Product image preview works after local path normalization.
- Missing preview was caused by local restored data path mismatch, not proven frontend code failure.
- No destructive actions were executed in QA.

## Ownership Decision
Library is the Source Evidence / Asset Authority Surface.

Library owns:
- Asset intake.
- Asset registry projection.
- Source-of-truth marking.
- Asset preview.
- Asset status visibility.
- Asset review readiness.
- AI Command context handoff.
- Media Studio / Publishing / Governance evidence support.

Library does not own:
- Publishing execution.
- AI execution.
- Governance approval execution.
- Workflow execution.
- CRM/customer mutation.
- Provider generation.
- Silent destructive actions.

## UX / Density Problems To Review

### 1. Page density
Library currently shows many regions at once:
- Asset overview.
- Required assets.
- Asset intake.
- Filters.
- Asset grid.
- Preview.
- Metadata.
- Action panel.
- AI Guidance.
- Danger actions.

Risk:
The user can understand the system power, but the page may feel visually heavy.

Recommended direction:
- Keep all capabilities.
- Improve hierarchy.
- Do not remove core evidence.
- Do not hide destructive warnings.
- Prefer copy/layout clarity over behavior changes.

### 2. Selected asset action grouping
Selected asset actions include:
- Mark as source.
- Approve for use.
- Mark for review.
- Rename asset.
- Archive asset.
- Soft-delete asset.
- Use as Source in AI Command.

Risk:
Safe and unsafe actions are close in one panel.

Recommended direction:
- Keep Danger section visually separated.
- Keep archive/soft-delete confirmations untouched.
- Add clearer labels if needed.
- Group review/status actions separately from destructive actions.
- Keep AI Command handoff clearly context-only.

### 3. Preview clarity
Preview now works locally after path normalization.

Risk:
Users may not understand why preview can fail:
- Missing file.
- Protected media path issue.
- Document type unsupported.
- Local restore mismatch.

Recommended direction:
- Improve fallback copy only if needed.
- Do not alter media endpoint.
- Do not alter protected media fetch behavior.
- Keep error states transparent.

### 4. Source-of-truth clarity
Library supports source-of-truth marking.

Risk:
Users may confuse source-of-truth with approval or publishing readiness.

Recommended direction:
- Clarify that source-of-truth means evidence authority.
- Clarify it does not publish, approve externally, or execute workflows.
- Keep source marking confirmation behavior unchanged.

### 5. AI Command handoff clarity
Library can send source context to AI Command.

Risk:
User may assume this executes an AI task or mutates a workflow.

Recommended direction:
- Label as context/review handoff.
- Do not auto-send AI prompts.
- Do not execute AI Command.
- Do not create backend tasks silently.

### 6. Asset intake clarity
Upload/intake is visible.

Risk:
Users may not know whether upload immediately makes an asset approved/source-of-truth.

Recommended direction:
- Clarify upload creates an asset candidate.
- Approval/source-of-truth should remain explicit.
- Do not change upload handler in this phase.

## CSS Risk Review Scope
The next implementation, if approved later, may inspect:
- Library-specific selectors in `public/control-center/styles/12-pages.css`.
- Library component classes rendered by `public/control-center/pages/library.js`.
- Repeated `.library-*` blocks.
- Side-panel density.
- Grid card sizing.
- Preview card sizing.
- Action/danger visual hierarchy.

Not approved in 3U.3:
- Broad CSS rewrite.
- Global token rewrite.
- Route changes.
- JS handler changes.
- API changes.
- Backend changes.
- Data/projects commits.

## Safe Future Patch Candidate
If approved after this plan, the safest next patch should be:
`PHASE 3U.4 — Library Copy/Layout Clarity Safe Patch`

Allowed candidate changes:
- Copy-only labels.
- Section headings.
- Helper text.
- Visual grouping through existing classes if low-risk.
- CSS only if narrowly scoped to Library and reviewed.

Forbidden candidate changes:
- Archive behavior.
- Soft-delete behavior.
- Status/source handlers.
- Upload behavior.
- Preview fetch logic.
- API endpoints.
- Backend route behavior.
- Publishing/AI/Governance execution.

## Browser QA Requirements After Any Patch
Any future Library patch must be browser-QA checked for:
- Page load.
- Asset count visibility.
- Preview rendering.
- Selected asset state.
- Source/status actions visible.
- Archive and soft-delete still separated.
- No silent mutation.
- AI Command handoff remains context-only.
- No publishing/approval/generation claims.

## Decision
Proceed with planning only.

Recommended next phase after commit:
`PHASE 3U.4 — Library Copy/Layout Clarity Safe Patch Plan or Implementation Decision`

Do not implement until this 3U.3 plan is reviewed and committed.
