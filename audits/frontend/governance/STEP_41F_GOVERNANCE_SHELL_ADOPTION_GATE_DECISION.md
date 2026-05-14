# STEP 41F — Governance Shell Adoption Gate Decision

Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: DOCUMENTATION ONLY

---

## Summary

STEP 41E audited Governance as the first non-Operations candidate for final shell/header adoption.

Decision:
- Governance may proceed to a small additive shell-class adoption patch.
- The patch must be class-additive only.
- No behavior, authority, policy, approval, API, backend, CSS, or data changes are allowed.

---

## Current Status

Completed:
- STEP 41A — Final Page Shell/Header Standard Audit
- STEP 41B — Final Page Shell/Header Standard Plan
- STEP 41C — Global Shell Primitives CSS Plan
- STEP 41D — Add Global Shell Primitives CSS
- STEP 41E — Governance Final Shell/Header Adoption Audit

Next allowed implementation:
- STEP 41G — Governance Additive Shell Classes Patch

---

## Risk Position

Governance risk classification:
- Structural adoption risk: medium
- Backend/API risk: none expected if untouched
- Handler risk: medium if IDs/data attributes are changed
- Policy/approval risk: medium if controls are moved or rewritten
- Visual regression risk: medium
- Cross-page risk: low

Reason:
Governance contains policy controls, approval flows, save/update controls, Open AI/context actions, and backend-projected governance data. It is compatible with the final shell model, but only under strict preservation rules.

---

## Allowed STEP 41G Scope

Allowed:
- Modify only `public/control-center/pages/governance.js`
- Add existing opt-in classes only:
  - `std-main-column`
  - `std-right-rail`
  - `std-detail-card`
  - `std-action-panel`
  - `std-ai-panel`
  - `std-action-row`
  - `std-deferred-actions`
  - `std-quick-actions`
  - `mhos-clean-root`
  - `mhos-clean-shell`
  - `mhos-clean-stack`
  - `mhos-clean-surface`
- Class additions only
- Preserve existing markup order unless absolutely required for class attachment
- Preserve all visible copy
- Preserve all behavior
- Preserve all existing cards and sections
- Preserve all Open AI/context-only behavior

---

## Not Allowed in STEP 41G

Not allowed:
- No CSS edits
- No backend edits
- No data/projects edits
- No API changes
- No handler changes
- No ID changes
- No data attribute changes
- No copy/provenance weakening
- No moving policy controls into a different behavioral context
- No changing save/update logic
- No changing approval request logic
- No changing Open AI behavior
- No removing cards
- No deleting legacy CSS
- No broad Governance redesign
- No all-page rollout

---

## Required Preservation Inventory

STEP 41G must preserve:
- governance policy controls
- approval controls
- save/update controls
- Open AI/context actions
- all existing IDs
- all existing data attributes
- all existing event handlers
- all existing API calls
- all existing backend authority boundaries
- all confirmation/safety behavior
- all current visible labels

---

## Required Validation Before Commit

Before committing STEP 41G, run:
- `git status --short`
- `grep -n "std-main-column\|std-right-rail\|std-detail-card\|std-action-panel\|std-ai-panel\|std-action-row\|std-deferred-actions\|std-quick-actions\|mhos-clean" public/control-center/pages/governance.js`
- `grep -n "id=\|data-\|addEventListener\|onclick\|saveProject\|updateProject\|governance\|approval\|policy\|Open AI" public/control-center/pages/governance.js | sed -n '1,360p'`
- `node --check public/control-center/pages/governance.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `git diff -- public/control-center/pages/governance.js | sed -n '1,360p'`

Commit only if:
- diff is limited to class additions inside Governance render markup
- no handlers changed
- no IDs changed
- no data attributes changed
- no API/backend behavior changed
- syntax checks pass

---

## Browser QA Required After STEP 41G

Browser QA must verify:
1. Governance page loads normally.
2. Header/overview remains readable.
3. Policy controls remain usable.
4. Save/update controls still work.
5. Approval controls still work.
6. Open AI/context actions remain context-only.
7. No horizontal overflow.
8. No console errors.
9. Layout visually improves or remains stable.
10. No Governance behavior changes.

---

## Rollback Path

If visual or behavioral regression appears:
- remove only the added shell/clean classes from `governance.js`
- do not edit CSS unless a global primitive itself is proven defective
- do not alter backend or data to compensate for frontend layout regression

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
