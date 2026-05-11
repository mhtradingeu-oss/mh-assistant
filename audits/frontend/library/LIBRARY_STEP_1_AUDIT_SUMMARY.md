# Library Step 1 Audit Summary

## Date
2026-05-11

## Status
Read-only audit plus narrow operating-surface integration completed.

## Current size
- `public/control-center/pages/library.js`: 2917 lines.

## Confirmed existing Library modules
- `action-panel.js`
- `ai-panel.js`
- `catalog-readiness.js`
- `command-router.js`
- `listener-lifecycle.js`
- `projection-adapter.js`
- `session-store.js`

## Confirmed capabilities preserved
- Upload assets.
- Refresh library scan.
- Rename assets.
- Archive assets.
- Soft-delete assets.
- Set or unset source of truth.
- Update asset status.
- Protected media preview and protected media open/download.
- Image, video, document, and fallback preview rendering.
- Required asset readiness and missing asset surfacing.
- Managed media handoff visibility.
- Recent upload summary.
- Filters, search, sorting, folder counts, grid selection, and pagination.

## Duplication and integration findings

### P0 fixed in this pass
- `action-panel.js` and `ai-panel.js` existed but were not imported or rendered in `library.js`.
- Panel modules interpolated asset/status values without local escaping.
- Panel modules only checked `sourceOfTruth`; Library assets commonly use `source_of_truth`.
- `normalizeLibraryAssets` was imported by `library.js` but unused.

### P1 safe follow-up
- `library.js` still owns global `window`/`document` listeners for protected URL cleanup, asset path copy/open, and action dropdown closing. `listener-lifecycle.js` exists and passes syntax checks, but listener migration was intentionally deferred.
- `catalog-readiness.js` remains an unintegrated readiness helper; `library.js` still uses local readiness construction for the active page.
- `bindLibraryWorkspace` repeatedly binds many `onclick`, `onchange`, and `oninput` handlers after render. These are candidates for command-router/lifecycle cleanup after this integration stabilizes.
- Selection, filter, and pagination handlers repeat rerender command blocks that could move behind command-router handlers.
- Protected thumbnail hydration still scans the document after rendering; keep an eye on render-time cost before broadening the Library grid.

### P2 later cleanup
- Asset normalization remains split between `projection-adapter.js` and large local normalization in `library.js`.
- `projection-adapter.js` still exports `normalizeLibraryAssets`; `library.js` no longer imports it, and broader usage can be reviewed later.
- Upload, preview, inspector, readiness, and finder rendering remain concentrated in one large file.
- Right-rail panel styling now reuses existing `card`, `data-stack`, and `library-preview-actions` hooks; dedicated panel CSS can be added later if needed.

### Do not touch in this lane
- Backend publishing guardrails.
- `assertPublishingMutationAllowed`.
- Protected read/write key middleware.
- Project slug validation or project-isolated path resolution.
- Backend status model names or durable schema fields.
- Runtime project data under `data/projects`.
- Current working upload, preview, source-of-truth, status, rename, archive, delete, refresh, and protected media behavior.
- Shell structure or route ownership.

## Changes made in this pass
- Imported `renderLibraryActionPanel` and `renderLibraryAiPanel` into `library.js`.
- Mounted Action Panel and AI Panel below the existing Asset Detail card in the right-side Library workspace.
- Refreshed both panels from `bindLibraryWorkspace` so selected asset context follows the existing selection flow.
- Kept all new panel actions disabled/read-only by passing `disabled: true`.
- Added local HTML escaping inside both panel modules.
- Added `source_of_truth` and `sourceOfTruth` support in the Action Panel.
- Ensured panel buttons disable when no asset is selected.
- Added helper text in both panels stating command routing is not connected yet.

## Intentionally not changed
- No backend files changed.
- No backend API calls changed.
- No runtime project data changed.
- No new enabled destructive actions were added.
- No new global listeners were added.
- No existing Library inspector buttons were removed or replaced.
- No listener lifecycle migration was performed yet.

## Next recommended steps
1. Move current global document/window listeners into `listener-lifecycle.js` with explicit mount/dispose ownership.
2. Consolidate repeated selection/filter/page command handling behind `command-router.js`.
3. Split preview/inspector rendering from `bindLibraryWorkspace` after listener lifecycle is stable.
4. Add a lightweight browser smoke test for selecting an asset and confirming the right rail updates without enabling future-lane actions.
