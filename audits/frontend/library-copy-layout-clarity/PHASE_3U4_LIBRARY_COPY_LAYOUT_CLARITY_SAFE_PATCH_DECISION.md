# PHASE 3U.4 — Library Copy/Layout Clarity Safe Patch Decision

## Status
Decision-only.

No implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3U.3 — Library CSS / UX Density Consolidation Plan`
- Previous commit: `cfac38f Plan Library UX density consolidation`

## Purpose
Decide whether Library needs a narrow copy/layout clarity patch before closeout.

PHASE 3U.3 confirmed that Library is functional but dense:
- Asset overview
- Required assets
- Asset intake
- Filters
- Asset grid
- Preview
- Metadata
- Action panel
- AI Guidance
- Danger actions

## Current Decision Question
Should we apply a small, safe Library clarity patch before closeout?

## Option A — No Patch / Close Library As-Is
Choose this if:
- Browser QA is acceptable.
- Page density is acceptable for current milestone.
- We prefer to move to Publishing/Governance next.

Pros:
- Zero risk.
- Faster progress.
- No chance of breaking handlers.

Cons:
- Library remains visually dense.
- Some labels may still be less clear for operators.

## Option B — Copy-Only Clarity Patch
Choose this if:
- We want better operator understanding with near-zero behavior risk.
- We only adjust text, helper copy, headings, and warnings.

Allowed:
- Clarify `Use as Source in AI Command` as review/context handoff.
- Clarify upload creates an asset candidate.
- Clarify source-of-truth is evidence authority, not publishing approval.
- Clarify Danger actions are registry-level and confirmation-gated.

Forbidden:
- JS handler changes.
- API/backend changes.
- Preview logic changes.
- CSS layout changes unless separately approved.

Risk:
Low.

## Option C — Narrow Layout/CSS Grouping Patch
Choose this if:
- Visual density materially hurts usability.
- Existing classes can be used safely.
- Patch can be scoped to `.library-*` selectors only.

Allowed:
- Minor spacing/grouping around action panels.
- Clearer separation of review/status actions and danger actions.
- Improved section hierarchy.

Forbidden:
- Broad CSS rewrite.
- Global token changes.
- Grid redesign.
- Responsive architecture changes.
- Any handler/API/backend change.

Risk:
Medium-low if narrow.

## Recommended Decision
Option B first.

Reason:
Library is already functional after 3U.2. The safest immediate improvement is copy-only clarity, especially around:
- Source-of-truth meaning.
- AI Command handoff boundary.
- Upload/intake meaning.
- Danger action warnings.

Do not start layout/CSS changes until copy-only clarity is reviewed in browser.

## Proposed Next Phase If Approved
`PHASE 3U.5 — Library Copy-Only Clarity Safe Patch`

Scope:
- One small patch.
- No CSS unless absolutely necessary.
- No backend.
- No API.
- No route changes.
- No action handler changes.
- Browser QA required after patch.

## Production Safety Rules
- Frontend remains projection.
- Backend remains authority.
- Library remains asset/source evidence authority.
- AI Command handoff remains review/context-only.
- Publishing/Governance execution remains destination-owned.
- Archive/soft-delete remain confirmation-gated.
- No destructive action is executed silently.

## Final Decision
Pending review.

Choose one:
- Option A — Close Library as-is.
- Option B — Copy-only clarity patch.
- Option C — Narrow layout/CSS grouping patch.

---

## Operator Note — Move To Folder / Category

During review, the operator requested a future `Move to...` capability so media/assets can be moved to the correct folder or category from inside Library.

This is a valid Library improvement, but it is not part of the copy-only clarity patch.

Reason:
A `Move to...` action may affect:
- asset `file_path`
- asset type/category
- preview path resolution
- source-of-truth references
- Media Studio asset usage
- Publishing evidence handoff
- Governance proof references
- AI Command source handoff

Therefore it requires a separate audit and implementation decision before code changes.

Recommended future phase:
`PHASE 3U.X — Library Move-To Asset Organization Audit`

Initial questions for that phase:
- Should Move To physically move files, update registry metadata, or both?
- Which destination folders/categories are allowed?
- Should moving require confirmation?
- Should source-of-truth assets be protected from move unless confirmed?
- Should move create an audit log entry?
- Should preview path be automatically revalidated after move?
- Should asset type update when destination changes?
- Should broken/missing assets be handled differently?

Decision:
Do not include `Move to...` in PHASE 3U.5 copy-only patch.
Track it as a future Library asset organization feature.
