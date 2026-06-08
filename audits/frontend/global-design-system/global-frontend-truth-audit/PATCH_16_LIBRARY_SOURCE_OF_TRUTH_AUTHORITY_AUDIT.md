# Patch 16 — Library Source-of-Truth Authority Follow-up Audit

## Status

Audit-only / no production change.

Library is a source-of-truth and evidence authority surface. It includes asset upload, protected preview hydration, document preview, source-of-truth marking, status actions, reclassification, rename, archive, soft-delete, AI extraction prompts, AI source handoff, required asset readiness, action panel, AI panel, and asset workspace controls.

## Production Decision

No production code was changed.

Reason:

- Library owns source/evidence readiness for the platform.
- Library includes upload and file input behavior.
- Library includes protected image/video/PDF preview hydration.
- Library includes source-of-truth marking.
- Library includes status actions such as approve for use and mark for review.
- Library includes rename, archive, and soft-delete actions.
- Library includes document extraction and AI review prompts.
- Library can send selected assets as AI source context.
- Library includes action and AI panels with durable-looking controls.
- Any future production patch must preserve upload/source/preview/handoff/mutation boundaries.

## Current Active Files

- `public/control-center/pages/library.js`
- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`

## Existing Strengths

Confirmed current Library capabilities:

- Library route and workspace.
- Asset catalog and workspace grid/list.
- Folder counts.
- Required asset readiness.
- Upload area and upload type selection.
- Protected thumbnail loading.
- Protected asset preview loading.
- Image, video, audio, PDF, document, text, and JSON preview fallbacks.
- Source-of-truth folder and source mark controls.
- AI source handoff button.
- AI classification prompt.
- Missing asset review prompt.
- Document extraction prompt.
- Action panel.
- AI panel.
- Asset open controls.
- Asset status actions.
- Rename.
- Archive.
- Soft-delete.
- Reclassify.
- Pagination.
- Search/filter/sort controls.

## Source-of-Truth Contract

Library can mark assets as source-of-truth through:

- `data-library-source-truth`

This is a platform-critical authority signal because downstream AI, content, campaigns, publishing, governance, and evidence workflows can rely on source-truth assets.

Future changes must not weaken or silently alter this source marking behavior.

## AI Source Handoff Contract

Library can send selected assets as AI source context through:

- `data-library-use-ai-source`
- `data-library-command="send-to-ai"`

This is a key platform advantage.

The handoff should remain explicit and review-oriented:

- Library owns source selection.
- AI Command owns AI review and generation.
- Source handoff does not approve, publish, execute, or mutate destination pages by itself.

## Upload Contract

Library includes upload behavior through:

- `libraryUploadInput`
- `libraryUploadTypeSelect`
- `libraryUploadBtn`
- `libraryChooseFilesBtn`
- `libraryDropZone`
- `data-library-upload-type`

Upload behavior is high-risk because it can add source/evidence assets to the project.

Future changes must preserve upload type, selected file handling, feedback, and reload behavior.

## Preview Contract

Library supports preview through:

- `renderPreview`
- `hydrateProtectedAssetPreview`
- `hydrateProtectedImageNode`
- `getProtectedAssetObjectUrl`
- protected media preview nodes
- document preview fallback
- PDF iframe / protected PDF fallback

Protected preview and access-key handling must not be changed blindly.

## Document / AI Extraction Contract

Library includes document extraction paths through:

- `libraryAiExtractSelectedDocBtn`
- `libraryAiExtractBtn`
- document preview fallback action
- AI prompt building for extraction

Extraction is AI review support only. It must not be confused with durable claim approval, governance approval, or publishing readiness.

## Asset Action Contract

Library action panel exposes asset controls such as:

- Open asset
- Ask AI to review asset
- Mark as source / remove source mark
- Approve for use
- Mark for review
- Rename asset
- Archive asset
- Reclassify
- Soft-delete asset

These are high-impact asset management actions and should not be changed without a dedicated contract audit.

## Data Attribute Inventory

Observed Library attributes:

- `data-library-action-panel`
- `data-library-ai-panel`
- `data-library-archive`
- `data-library-asset`
- `data-library-command`
- `data-library-delete`
- `data-library-folder-select`
- `data-library-grid-page`
- `data-library-grid-select`
- `data-library-open`
- `data-library-protected-preview`
- `data-library-protected-thumb`
- `data-library-reclassify`
- `data-library-rename`
- `data-library-required-action`
- `data-library-required-key`
- `data-library-row-select`
- `data-library-section`
- `data-library-select`
- `data-library-source-truth`
- `data-library-upload-type`
- `data-library-use-ai-source`
- `data-library-view-mode`

## Button / Input Inventory

Key IDs and controls:

- `libraryRoot`
- `libraryRefreshScanBtn`
- `libraryAiClassifyBtn`
- `libraryAiMissingBtn`
- `libraryAiExtractBtn`
- `libraryAiExtractSelectedDocBtn`
- `libraryDropZone`
- `libraryDropInfo`
- `libraryChooseFilesBtn`
- `libraryUploadInput`
- `libraryUploadTypeSelect`
- `libraryUploadBtn`
- `libraryUploadSummary`
- `libraryAssetWorkspace`
- `librarySourceBridgeGuideBox`
- `libraryFinderWorkspace`
- `libraryToolbarUploadBtn`
- `libraryFilterTypeSelect`
- `libraryFilterStatusSelect`
- `libraryFilterSourceSelect`
- `librarySortSelect`
- `librarySearchInput`
- `libraryAssetGridBody`
- `libraryGridPagination`
- `libraryPreviewVisual`
- `libraryPreviewMeta`
- `libraryActionPanelMount`
- `libraryAiPanelMount`

These IDs should not be changed without a dedicated implementation patch and browser QA.

## Backend / Durable Authority Boundary

Backend/durable or backend-adjacent paths likely include:

- asset upload
- library scan refresh
- protected asset fetch
- asset source-of-truth update
- asset status update
- asset reclassify
- asset rename
- asset archive
- asset soft-delete
- document extraction / AI prompt preparation
- source handoff persistence or shared context where applicable

## Frontend / Projection Boundary

Frontend/local or projection paths include:

- folder filtering
- grid/list selection
- search/filter/sort state
- pagination
- selected asset preview
- source guide display
- preview fallback display
- AI prompt text preparation
- workspace panel rendering

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. upload flow
2. `libraryUploadInput`
3. `libraryUploadBtn`
4. `libraryUploadTypeSelect`
5. protected preview hydration
6. `getProtectedAssetObjectUrl`
7. document preview / PDF preview behavior
8. `data-library-source-truth`
9. `data-library-use-ai-source`
10. `data-library-command="send-to-ai"`
11. asset status actions
12. rename behavior
13. archive behavior
14. soft-delete behavior
15. reclassify behavior
16. required asset actions
17. AI classify/missing/extract prompts
18. action panel controls
19. AI panel controls
20. source bridge guide behavior
21. access-key error handling
22. reloadProjectData behavior after asset changes

## Recommended Future Patch

### Patch 16B — Library Upload / Source / Handoff Contract Audit

Before any production patch, map exact handler functions and payload behavior:

- upload payload
- refresh scan behavior
- protected preview fetch contract
- source-of-truth toggle payload
- asset status update payload
- rename payload
- archive payload
- soft-delete payload
- reclassify payload
- AI source handoff payload
- document extraction prompt behavior
- required asset action routing
- reload behavior
- local/session selection behavior

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- handler changes
- API changes
- upload behavior changes
- preview behavior changes
- source marking changes
- asset status changes
- delete/archive/rename changes
- AI handoff behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/library.js`
- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`
- route ID: `library`
- `data-page="library"`
- `#libraryRoot`
- all Library data attributes
- all Library button/input IDs
- all upload behavior
- all preview behavior
- all protected media behavior
- all source-of-truth behavior
- all asset action behavior
- all AI source handoff behavior
- all document extraction behavior
- all search/filter/sort behavior
- all backend/API behavior
- all project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/library.js
for f in public/control-center/pages/library/*.js; do
  [ -f "$f" ] && node --check "$f"
done
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Library production patch:

- Open Library.
- Confirm required asset grid renders.
- Confirm upload area renders.
- Choose files and confirm selected files display.
- Upload only in a safe test project.
- Refresh Library scan.
- Select asset from grid/list.
- Confirm preview loads or fallback appears.
- Confirm protected image/video/PDF previews still hydrate.
- Mark/unmark source only in a safe test project.
- Rename only in a safe test project.
- Archive only in a safe test project.
- Soft-delete only in a safe test project.
- Reclassify only in a safe test project.
- Use as AI Source and confirm AI Command context is set.
- Run AI classify/missing/extract prompts and confirm they only route/prepare AI context.
- Confirm no publish/send/approve/governance action is introduced.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.
