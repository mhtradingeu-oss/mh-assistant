# STEP 38F — Operations Visual QA Deferred Decision

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: DOCUMENTATION ONLY

---

## Summary

STEP 38E required browser visual QA after adopting the clean global CSS layer in Task Center and Queue Center.

This document records a conscious decision to defer manual browser visual QA temporarily while allowing the next audit-approved Operations adoption step to proceed.

This does not cancel visual QA. It only defers it until after the next small scoped adoption step, provided all preservation constraints remain intact.

---

## Current Status

Adopted:
- Task Center
- Queue Center

Audited:
- Job Monitor

Not adopted:
- Job Monitor
- Notification Center

---

## Reason for Deferral

The first two adoptions were:
- class-additive only
- limited to Operations render blocks
- no CSS changes
- no handler changes
- no ID/data attribute changes
- no API/backend changes
- no copy/provenance changes

Risk remains limited to visual spacing/panel/surface regression.

---

## Guardrails for Continuing

The next implementation step may proceed only if it remains:

- class-additive only
- scoped to `renderJobMonitorLayout(...)`
- no CSS edits
- no handler edits
- no ID/data attribute edits
- no API/backend edits
- no copy/provenance edits
- no changes to Task Center or Queue Center
- no changes to Notification Center

---

## Required Validation Before Continuing

Before committing any Job Monitor adoption patch, validate:

- `node --check public/control-center/pages/operations-centers.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- diff confirms only class additions inside `renderJobMonitorLayout(...)`
- existing Job Monitor IDs/data attributes remain present
- Task Center and Queue Center clean-layer classes remain unchanged

---

## Visual QA Still Required

Manual browser visual QA remains required for:
- Task Center
- Queue Center
- Job Monitor, if adopted next

Visual QA must confirm:
- no horizontal overflow
- readable headers/ribbons
- acceptable main/right rail spacing
- stable tables/lists
- stable action panels
- stable AI panels
- no console errors

---

## Rollback Path

If visual regression is detected later:

Task Center rollback:
- remove `mhos-clean-*` classes only from `renderTaskCenterLayout(...)`.

Queue Center rollback:
- remove `mhos-clean-*` classes only from `renderQueueCenterLayout(...)`.

Job Monitor rollback, if adopted:
- remove `mhos-clean-*` classes only from `renderJobMonitorLayout(...)`.

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
