# STEP 29B — Publishing Copy/Provenance Patch

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: COPY-ONLY PATCH DOCUMENTATION

---

## Summary

This document records the STEP 29B Publishing copy/provenance patch.

The production patch clarified Publishing action wording without changing behavior.

Commit:
- ac76398 Clarify Publishing action provenance copy

---

## Scope

File changed:
- `public/control-center/pages/publishing.js`

Updated visible copy:
- `Save Draft` → `Save publishing draft`
- `Open AI: Send Context to AI Workspace` → `Send publishing context to AI`
- `Auto Prepare Publishing` → `Auto-prepare publishing plan`
- `Approve and Continue` → `Approve automation step`
- `Skip Step` → `Skip automation step`
- `Review` → `Review item`
- `Schedule` → `Schedule item`
- `Publish now` → `Publish to configured channels`
- `Pause` → `Pause to draft`
- `Retry` → `Retry scheduled item`
- `Approve` → `Mark item ready for publishing`
- `Mark Failed` → `Mark publishing item as failed`

---

## Intent

Clarify:
- AI context actions are not publishing execution.
- Automation controls are step controls.
- Publish action targets configured channels.
- Manual approve/fail actions change item status.

---

## Preservation Statement

The patch preserved:
- existing publish confirmation
- existing fail confirmation
- IDs
- data attributes
- handlers
- API calls
- backend behavior
- route behavior
- data/projects

No CSS, backend, route, API, or data changes were made.

---

## Validation

Validation performed before commit:
- `node --check public/control-center/pages/publishing.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:
- Passed.
