# STEP 27A — Library Move Asset Capability Audit

Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## 1) Executive Summary

This audit reviewed whether Library can safely add a `Move asset` action.

Decision:
- Do not add an active Move asset button yet.
- No clear `moveProjectAsset` frontend API was identified.
- No `MOVE_ASSET` Library command exists in the command router.
- Existing backend-backed Library actions cover status update, rename, archive, delete, refresh, and upload.
- A real Move action requires backend authority before frontend UI is added.

---

## 2) Current API Evidence

Current Library-related frontend API functions include:
- `updateProjectAssetStatus`
- `renameProjectAsset`
- `archiveProjectAsset`
- `deleteProjectAsset`
- `refreshProjectLibrary`
- `uploadProjectAsset`

No clear active function was identified for:
- `moveProjectAsset`
- `updateProjectAsset`
- `changeProjectAssetCategory`
- moving file path / registry location

---

## 3) Current Action Panel Evidence

Current Action Panel buttons include:
- `Open asset`
- `Ask AI to review asset`
- `Copy asset path`
- `Mark as source`
- `Remove source mark`
- `Approve for use`
- `Mark for review`
- `Rename asset`
- `Archive asset`
- `Soft-delete asset`

No `Move asset` button exists yet.

---

## 4) Current Command Router Evidence

Current Library commands include:
- `SELECT_ASSET`
- `SET_FILTER`
- `SET_VIEW_MODE`
- `SET_PAGE`
- `UPLOAD_TYPE_CHANGE`
- `OPEN_UPLOAD`
- `REFRESH_LIBRARY`
- `OPEN_PREVIEW`
- `SET_SOURCE_OF_TRUTH`
- `UPDATE_STATUS`
- `RENAME_ASSET`
- `ARCHIVE_ASSET`
- `DELETE_ASSET`
- `SEND_TO_AI`

No `MOVE_ASSET` command exists yet.

---

## 5) Risk Classification

Move asset is Review / Backend Controlled.

Reason:
- It may change registry category or asset type.
- It may change source-of-truth grouping.
- It may affect readiness calculations.
- It may affect downstream AI, workflows, campaign, media, and publishing context.
- If it moves physical files or file paths, it must be backend-governed.

---

## 6) Implementation Decision

Do not add active Move asset UI yet.

Allowed future options:
1. Add backend-supported `moveProjectAsset(...)` first.
2. Add `MOVE_ASSET` to Library command router.
3. Add modal/dropdown to choose target category/folder.
4. Add confirmation or review copy depending on backend behavior.
5. Add QA closeout.

Optional frontend-only safe option:
- Add a disabled `Move asset` placeholder only if explicitly marked as future/unavailable.

Recommended now:
- No code patch.
- Keep Library Action Panel unchanged until backend move authority is defined.

---

## 7) Validation Result

Validation commands were run before this audit:
- `git status --short`
- grep for move/update asset APIs
- Action Panel button review
- Command router review
- `node --check public/control-center/pages/library.js`
- `node --check public/control-center/pages/library/action-panel.js`
- `node --check public/control-center/api.js`
- `node --check runtime/orchestrator-service/server.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:
- Working tree was clean before audit.
- Syntax checks passed.
- No active move capability was confirmed.
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