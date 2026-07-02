# Library Step 3H - Filter Sort Page Command Router Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Current direct handler map
- Type filter (`libraryFilterTypeSelect`): dispatches `set-filter` with `filter: "type"`.
- Status filter (`libraryFilterStatusSelect`): dispatches `set-filter` with `filter: "status"`.
- Source filter (`libraryFilterSourceSelect`): dispatches `set-filter` with `filter: "source"`.
- Search (`librarySearchInput`): dispatches `set-filter` with `filter: "search"`, then existing 1000ms timer rerender.
- Sort (`librarySortSelect`): dispatches `set-filter` with `filter: "sort"`.
- Folder selection (`[data-library-folder-select]`): dispatches `set-filter` with `filter: "folder"`.
- Pagination (`[data-library-grid-page]`): dispatches `set-page`.
- View mode (`[data-library-view-mode]`): dispatches `set-view-mode` (currently latent control path).

## 2. Current command-router usage
- Filters/search/sort/folder already use command envelopes via `dispatchLibraryCommand("set-filter", ...)`.
- Page changes already use `dispatchLibraryCommand("set-page", ...)`.
- View mode already uses `dispatchLibraryCommand("set-view-mode", ...)`.
- Router remains non-authoritative; handlers are local parity handlers inside `library.js`.

## 3. Gaps
- No mandatory parity gap found for active filter/search/sort/page paths.
- View mode route exists but UI toggle remains latent in current template path.
- No safe-value change needed for debounce/timer behavior.

## 4. Which command paths are already done
- `set-filter`: done for type/status/source/search/sort/folder.
- `set-page`: done.
- `set-view-mode`: done (latent UI path).
- `upload-type-change`: done from prior Step 3E.
- `open-preview`: done from prior Step 3C.

## 5. Which are safe to shadow later
- Copy-path envelope emission: safe later if clipboard/fallback parity is preserved.
- Additional latent/legacy selection surfaces: safe later with strict parity checks.

## 6. Tiny patch applied in this step
- None for Step 3H.
- Step 3H is documentation and verification focused.

## 7. Confirmation no behavior change
- Filter/search/sort/page visible outcomes unchanged.
- Existing search debounce timing unchanged (1000ms).
- No new timers, no new global listeners, no upload execution changes.
- No mutation actions were touched.
