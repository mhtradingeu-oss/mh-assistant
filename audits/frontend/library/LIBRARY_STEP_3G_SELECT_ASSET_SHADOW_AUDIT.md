# Library Step 3G - Select Asset Shadow Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Existing selection surfaces
- Grid card click (`[data-library-grid-select]`): dispatches `select-asset` envelope and updates `session.selectedAssetId` via handler.
- Grid card keyboard Enter/Space: dispatches `select-asset` envelope and updates `session.selectedAssetId` via handler.
- Row click (`[data-library-row-select]`): dispatches `select-asset` envelope and updates `session.selectedAssetId` via handler.
- Legacy button click (`[data-library-select]`): dispatches `select-asset` envelope and updates `session.selectedAssetId` via handler.
- Filter/folder reconciliation path: if selected asset is no longer present in filtered list, selection is reassigned to first available asset (existing parity behavior).

## 2. Exact wiring added
- Applied a minimal parity patch in `library.js` for row keyboard selection (`[data-library-row-select]` Enter/Space path):
  - Before: direct `session.selectedAssetId = nextId` assignment.
  - After: dispatches `dispatchLibraryCommand("select-asset", { assetId: nextId }, ...)` and sets the same final `session.selectedAssetId` in the command handler.
- `command-router.js` already contained `SELECT_ASSET: "select-asset"`; no new command constant was required.

## 3. Confirmation selection behavior unchanged
- Final selected asset id remains exactly the same for the patched row keyboard path.
- No filter/search/sort/page logic changed.
- No new API call or backend operation added.

## 4. Confirmation preview behavior unchanged
- Preview rendering remains tied to selected asset and existing rerender/bind flow.
- No preview rendering logic was changed.

## 5. Confirmation no mutation wiring
- No mutation command was wired or enabled.
- No mutation handlers were moved to command-router authority.
- Command router remains UI intent boundary with local parity envelope usage.
