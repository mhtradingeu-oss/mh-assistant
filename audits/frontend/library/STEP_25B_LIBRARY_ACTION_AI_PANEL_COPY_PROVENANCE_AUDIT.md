# STEP 25B — Library Action/AI Panel Copy & Provenance Audit

Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## 1) Executive Summary

This audit reviewed Library Action Panel and AI Panel copy before making any UI refinement.

Decision:
- Do not change layout or CSS.
- Do not change handlers or data attributes.
- Do not add new confirmations.
- The next safe step should be a copy-only wording patch for panel buttons and guidance.
- No production code was modified in this step.

---

## 2) Files Reviewed

Reviewed:
- public/control-center/pages/library/action-panel.js
- public/control-center/pages/library/ai-panel.js

The panels are already rendered by the Library route and represent the first usable Action Panel + AI Panel foundation.

---

## 3) Current Action Panel Labels

Current labels identified:
- Open
- Ask AI
- Copy Path
- Source
- Unsource
- Approve
- Review
- Rename
- Archive
- Soft Delete

Current section labels:
- Primary Actions
- Utility
- Decisions
- Danger

---

## 4) Current AI Panel Guidance

Current AI Panel states include:
- Close missing asset gaps
- Select an asset to start
- Confirm source-of-truth
- Review before production
- Asset ready for operating use

The guidance is useful, but some suggested moves still use short action names like Open, Ask AI, Source, Review, and Approve.

---

## 5) Risk Classification

### Safe / Utility

Actions:
- Open
- Copy Path

Recommended wording:
- Open asset
- Copy asset path

Reason:
- These do not mutate durable backend state.

### AI Context

Action:
- Ask AI

Recommended wording:
- Ask AI to review asset

Reason:
- This sends/prepares AI context. It should not imply backend execution or autonomous changes.

### Durable / Registry Decisions

Actions:
- Source / Unsource
- Approve
- Review
- Rename

Recommended wording:
- Mark as source
- Remove source mark
- Approve for use
- Mark for review
- Rename asset

Reason:
- These can affect readiness, source-of-truth status, or registry-level asset metadata.
- No new confirmation is required in this step, but wording should make the action clear.

### Dangerous / Already Confirmed

Actions:
- Archive
- Soft Delete

Recommended wording:
- Archive asset
- Soft-delete asset

Reason:
- Existing confirmations already protect these actions.
- Wording should still clearly state the object.

---

## 6) Recommended STEP 25C Candidate

Apply a copy-only patch to:
- public/control-center/pages/library/action-panel.js
- public/control-center/pages/library/ai-panel.js

Allowed:
- visible button labels
- helper copy
- suggestedMove text
- no handler changes
- no data attribute changes
- no CSS changes
- no backend changes
- no data/projects changes

Recommended button label changes:
- `Open` → `Open asset`
- `Ask AI` → `Ask AI to review asset`
- `Copy Path` → `Copy asset path`
- `Source` → `Mark as source`
- `Unsource` → `Remove source mark`
- `Approve` → `Approve for use`
- `Review` → `Mark for review`
- `Rename` → `Rename asset`
- `Archive` → `Archive asset`
- `Soft Delete` → `Soft-delete asset`

Recommended AI guidance wording:
- `Select an asset, then use Open or Ask AI from the Actions panel.`
  → `Select an asset, then use Open asset or Ask AI to review asset from the Actions panel.`
- `Mark as Source once validated, then approve for operating use.`
  → `Mark as source once validated, then approve for operating use.`
- `Use Review or Approve from the Actions panel after validation.`
  → `Use Mark for review or Approve for use from the Actions panel after validation.`
- `Use Open to verify final quality, then proceed to downstream workflows.`
  → `Use Open asset to verify final quality, then proceed to downstream workflows.`

---

## 7) Validation Result

Validation commands were run before this audit document:
- `git status --short`
- `sed` review of action-panel.js
- `sed` review of ai-panel.js
- grep for panel action labels and attributes
- `node --check public/control-center/pages/library/action-panel.js`
- `node --check public/control-center/pages/library/ai-panel.js`
- `node --check public/control-center/pages/library.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:
- Working tree was clean before audit.
- Syntax checks passed.
- Current panel labels and guidance were identified.
- No production code was modified.

---

## 8) Explicit No-Code-Change Statement

This step made no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- routes
- API behavior
- handlers
- IDs/classes/data attributes