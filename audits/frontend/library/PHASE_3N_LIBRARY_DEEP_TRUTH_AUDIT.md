# PHASE 3N — Library Page Deep Truth Audit

## 1. Executive Summary
The Library page is the canonical source-of-truth and asset operating surface for brand assets, uploaded files, media/campaign assets, previews, and source-of-truth markers. It manages asset lifecycle actions (upload, preview, approve, archive, delete) and handoff to Media Studio, Publishing, and AI. This audit documents current responsibilities, backend contract, action safety, listener lifecycle, and UX/operating surface risks.

## 2. Current Runtime Responsibility
- Display and manage all project library assets (brand, media, campaign, uploads)
- Provide upload, preview, approval, archive, and delete actions
- Mark assets as source-of-truth for downstream use
- Handoff to Media Studio, Publishing, and AI review
- Maintain asset status, readiness, and review state

## 3. Backend/API Contract Map
- Reads: project library asset list, asset metadata, readiness state
- Mutates: asset upload, approval, archive, delete, rename, source-of-truth marking
- Main API: `refreshProjectLibrary(projectName)` (see api.js)
- Backend endpoints: `/media-manager/project/{projectName}/library/refresh`

## 4. Action Inventory Table
| Action                | Safe UX | Backend Authority | Destructive | Protected | Data Attribute / Handler           |
|-----------------------|---------|------------------|-------------|-----------|------------------------------------|
| Upload Asset          | Yes     | Yes              | No          | Yes       | `#libraryUploadBtn`, drop zone     |
| Preview Asset         | Yes     | No               | No          | Yes       | `.library-preview-frame`           |
| Approve Asset         | Yes     | Yes              | No          | Yes       | `data-asset-status-action=approved`|
| Mark for Review       | Yes     | Yes              | No          | Yes       | `data-asset-status-action=needs_review`|
| Mark as Source        | Yes     | Yes              | No          | Yes       | `data-library-source-truth`        |
| Archive Asset         | Yes     | Yes              | No          | Yes       | `data-library-archive`             |
| Rename Asset          | Yes     | Yes              | No          | Yes       | `data-library-rename`              |
| Delete Asset (Soft)   | Yes     | Yes              | Yes         | Yes       | `data-library-delete`              |
| Send to AI            | Yes     | No               | No          | Yes       | `data-library-command=send-to-ai`  |

## 5. Listener Lifecycle Inventory
- Listeners registered via `mountLibraryListeners` (listener-lifecycle.js)
- Global listeners managed by `mountLibraryGlobalListeners`/`unmountLibraryGlobalListeners`
- Listeners are registered once per mount, disposed on unmount
- No evidence of repeated/duplicate registration
- Document/window listeners for drag-drop, keyboard, and action buttons

## 6. Source-of-Truth and Asset Lifecycle Assessment
- Source-of-truth marking via `data-library-source-truth` and backend mutation
- Asset lifecycle: upload → preview → approve/review → archive/delete
- All destructive actions (archive/delete) require explicit user action and confirmation
- Asset readiness and review state surfaced in UI

## 7. Upload / Preview / Approval / Archive / Delete Safety Assessment
- Upload: protected by drop zone and upload button, backend validation
- Preview: protected preview frame, fallback for unavailable assets
- Approval/Review: explicit buttons, backend mutation
- Archive/Delete: soft-delete only, confirmation required, backend mutation
- No evidence of fake execution or fake approval

## 8. UX / Operating Surface Assessment
- Canonical operating surface defined in `14-page-standard.css` (scoped to `[data-page="library"]`)
- Action panels: primary, utility, durable, danger sections
- Clear separation of safe vs. destructive actions
- Handoff to Media Studio, Publishing, AI via explicit buttons/commands
- No evidence of duplicated action surface

## 9. CSS Duplication / Density Risk Assessment
- All Library CSS scoped to `[data-page="library"]` in `14-page-standard.css`
- No evidence of duplicated selectors or visual drift
- Density and layout managed by grid and card classes
- Danger actions visually separated

## 10. Handoff Map: Library → Media Studio / Publishing / AI / Governance
- Media Studio: asset usage includes `used_in: ["Library", "Media Studio"]`
- Publishing: asset readiness and approval status surfaced for publishing handoff
- AI: explicit "Send to AI" action for review
- Governance: approval/archive actions surfaced for governance handoff

## 11. Protected Behavior List
- Asset upload, approval, archive, delete (backend authority)
- Source-of-truth marking
- Asset readiness and review state
- All destructive actions require confirmation

## 12. Do Not Touch Without Approval List
- Backend mutation handlers (upload, approve, archive, delete)
- Source-of-truth logic
- Listener lifecycle registration/disposal
- Asset preview and protected URL logic
- CSS selectors in `14-page-standard.css` for Library

## 13. Recommended Implementation Plan
- Maintain strict separation of UX projection and backend authority
- Preserve all protected actions and confirmation flows
- Ensure all destructive actions remain soft-delete and require confirmation
- Continue to scope all Library CSS to `[data-page="library"]`
- Audit and document any new handoff or integration points before implementation

## 14. Recommended First Safe Patch
- Add explicit audit log for all destructive actions (archive/delete)
- Add visual indicator for source-of-truth assets
- Add test for duplicate listener registration
- No code or CSS changes without audit/approval

## 15. Validation Results
- `git status --short`: clean
- `node --check public/control-center/pages/library.js`: OK
- `node --check public/control-center/app.js`: OK
- `node --check public/control-center/router.js`: OK
- `node --check public/control-center/api.js`: OK
- `node --check public/control-center/shared-context.js`: OK

No production files changed. Audit documentation only.

**Recommended next step:**
- Review this audit with the team for confirmation.
- Approve before any implementation or refactor.
