# LIB-FINAL-2 — Library UX Plan

## Status
Planned.

## Purpose
Improve Library as a premium asset/source operating surface using Global Design System v1 without changing upload, preview, protected media, selection, pagination, action, AI, or mutation behavior.

## Product Goal
Library should help the operator answer:

1. What assets exist?
2. What assets are missing or need review?
3. Which asset is selected?
4. Is this asset source-of-truth, approved, uploaded, archived, or review-needed?
5. What can safely be uploaded, classified, reviewed, copied, renamed, archived, deleted, or sent to AI?
6. What can AI explain without mutating asset truth?

## Current Runtime Authority
Primary runtime file:

- `public/control-center/pages/library.js`

Supporting runtime modules:

- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`
- `public/control-center/pages/library/command-router.js`
- `public/control-center/pages/library/listener-lifecycle.js`
- `public/control-center/pages/library/projection-adapter.js`
- `public/control-center/pages/library/session-store.js`

## Allowed Changes
- Improve top shell/header wording.
- Add GDS classes only where safe.
- Improve section hierarchy.
- Improve copy around asset readiness and source-of-truth.
- Improve visual grouping of preview/action/AI panels.
- Improve density without hiding required controls.
- Keep upload, preview, protected media, selection, pagination, action panel, AI panel, and mutation behavior intact.

## Forbidden Changes
- No backend changes.
- No API changes.
- No router changes.
- No upload behavior changes.
- No preview/protected media behavior changes.
- No object URL cache changes.
- No thumbnail queue changes.
- No selection behavior changes.
- No pagination behavior changes.
- No mutation behavior changes.
- No delete/archive/status/source-of-truth behavior changes.
- No action panel behavior changes.
- No AI panel behavior changes.
- No broad CSS rewrite.
- No legacy CSS cleanup in this phase.

## Required Runtime Contracts
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

## First Implementation Target
Narrow shell/header/section polish only.

Do not modify upload, preview, grid selection, pagination, action buttons, or AI command behavior in the first patch.

## Validation
- `node --check public/control-center/pages/library.js`
- `node --check public/control-center/pages/library/action-panel.js`
- `node --check public/control-center/pages/library/ai-panel.js`
- `node --check public/control-center/pages/library/command-router.js`
- `node --check public/control-center/pages/library/listener-lifecycle.js`
- `node --check public/control-center/pages/library/projection-adapter.js`
- `node --check public/control-center/pages/library/session-store.js`
- Browser QA at:
  - `http://127.0.0.1:3000/control-center/#library`

## Decision
Proceed with a narrow Library shell/clarity patch only after this plan is committed.
