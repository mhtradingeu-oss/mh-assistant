# STEP 40B — Notification Center Visual QA Gate Decision

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: DOCUMENTATION ONLY

---

## Summary

STEP 40A audited Notification Center as the final remaining Operations surface for clean-layer adoption.

Decision:
- Proceed may be allowed only as a small class-additive patch.
- Manual browser visual QA remains pending.
- This decision consciously allows one final Operations adoption step while preserving rollback and requiring post-adoption visual QA.

---

## Current Operations Adoption Status

Adopted:
- Task Center
- Queue Center
- Job Monitor

Audited:
- Notification Center

Not yet adopted:
- Notification Center

---

## Risk Position

Notification Center is more complex than the previous Operations surfaces because it includes:
- alert streams
- inbox items
- provider disconnect alerts
- approval alerts
- publishing alerts
- claim risk alerts
- mark-read behavior
- notification refresh behavior
- AI context handoff

Risk classification:
- Backend/API risk: low if untouched
- Handler risk: low if IDs/data attributes remain unchanged
- Visual regression risk: medium
- Cross-page risk: low

---

## Guardrails for STEP 40C Implementation

The next implementation step may proceed only if it remains:

- class-additive only
- scoped to Notification Center render markup only
- no CSS edits
- no handler edits
- no ID/data attribute edits
- no API/backend edits
- no copy/provenance edits
- no changes to Task Center
- no changes to Queue Center
- no changes to Job Monitor

---

## Required Validation Before Commit

Before committing any Notification Center adoption patch, validate:

- `node --check public/control-center/pages/operations-centers.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- diff confirms only class additions inside Notification Center render markup
- Notification Center IDs/data attributes remain present
- Task Center, Queue Center, and Job Monitor clean-layer classes remain unchanged

---

## Visual QA Still Required

Manual browser visual QA remains required for:
- Task Center
- Queue Center
- Job Monitor
- Notification Center if adopted next

Visual QA must confirm:
- no horizontal overflow
- readable headers/ribbons
- acceptable main/right rail spacing
- stable tables/lists
- stable action panels
- stable AI panels
- stable alert/inbox handling
- no console errors

---

## Rollback Path

If visual regression is detected later:

Task Center rollback:
- remove `mhos-clean-*` classes only from `renderTaskCenterLayout(...)`.

Queue Center rollback:
- remove `mhos-clean-*` classes only from `renderQueueCenterLayout(...)`.

Job Monitor rollback:
- remove `mhos-clean-*` classes only from `renderJobMonitorLayout(...)`.

Notification Center rollback, if adopted:
- remove `mhos-clean-*` classes only from Notification Center render markup.

---

## Explicit No-Code-Change Statement

This decision document makes no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- API behavior
- routes
- handlers
- IDs/classes/data attributes
