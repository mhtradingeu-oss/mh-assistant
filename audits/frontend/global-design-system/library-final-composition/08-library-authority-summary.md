# LIB-FINAL-1 — Library Final UX Authority Summary

## Status
Audit completed.

## Runtime Authority
Primary runtime file:

- `public/control-center/pages/library.js`

Supporting runtime modules:

- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`
- `public/control-center/pages/library/catalog-readiness.js`
- `public/control-center/pages/library/command-router.js`
- `public/control-center/pages/library/listener-lifecycle.js`
- `public/control-center/pages/library/projection-adapter.js`
- `public/control-center/pages/library/session-store.js`

Asset catalog authority:

- `public/control-center/asset-library.js`

## Confirmed Runtime Complexity
Library includes:

- asset normalization
- managed media handoffs
- local session store
- protected preview URL handling
- protected object URL cache
- thumbnail queue/concurrency control
- grid selection
- grid pagination
- upload flow
- refresh flow
- status updates
- rename flow
- source-of-truth toggle
- archive flow
- delete flow
- action panel
- AI panel
- command routing
- listener lifecycle management

## Confirmed Sensitive Runtime Contracts
Must preserve:

- `libraryDropZone`
- `libraryFinderWorkspace`
- `libraryAssetGridBody`
- `libraryGridPagination`
- `libraryUploadTypeSelect`
- `libraryUploadInput`
- `libraryUploadBtn`
- `libraryChooseFilesBtn`
- `librarySearchInput`
- `libraryFilterTypeSelect`
- `libraryFilterStatusSelect`
- `libraryFilterSourceSelect`
- `librarySortSelect`
- `data-library-grid-select`
- `data-library-grid-page`
- `data-library-protected-thumb`
- `data-copy-asset-path`
- `data-asset-status-action`
- `data-source-of-truth`
- action panel mount behavior
- AI panel mount behavior
- listener lifecycle behavior

## Confirmed API / Mutation Contracts
Library calls sensitive APIs through:

- `refreshProjectLibrary`
- `uploadProjectAsset`
- `updateProjectAssetStatus`
- `renameProjectAsset`
- `setProjectAssetSourceOfTruth`
- `archiveProjectAsset`
- `deleteProjectAsset`

These must not be changed during visual polish.

## CSS Authority Findings
Library styling is currently spread across:

- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- legacy CSS files under `public/control-center/legacy/`

Important finding:
Legacy files contain many old Library selectors, but they are legacy and should not be edited as active runtime unless proven loaded.

Active Library styling appears mostly in:

- `12-pages.css`
- `14-page-standard.css`

## Main Risk
Library has a high CSS duplication and override risk.

Risk areas:

- `.library-workspace-grid`
- `.library-workspace-main`
- `.library-workspace-side`
- `.library-grid-card`
- `.library-drop-zone`
- `.library-filter-bar`
- `.library-preview-card`
- `#libraryAssetGridBody`
- `#libraryPreviewVisual`

## Recommended Strategy
Do not start with a broad redesign.

Proceed with:

1. Browser review of current Library page.
2. Small visual/layout repair only if there is obvious breakage.
3. Then create `LIB-FINAL-2 — Library UX Plan`.
4. GDS adoption must be narrow and markup-aware.
5. Preserve all upload, preview, protected media, selection, pagination, action panel, AI panel, and mutation behavior.

## Forbidden
- No backend changes.
- No API changes.
- No router changes.
- No upload behavior changes.
- No preview/protected media behavior changes.
- No object URL cache changes.
- No selection behavior changes.
- No pagination behavior changes.
- No mutation behavior changes.
- No delete/archive/status/source-of-truth changes.
- No broad CSS rewrite.
- No legacy cleanup until active CSS load authority is explicitly confirmed.

## Decision
Library authority audit is complete. Proceed next to browser QA of current Library page before any implementation.
