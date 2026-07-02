# Patch 16B — Library Upload / Source / Handoff Contract Audit

## Status

Audit-only / no production change.

This audit maps the Library upload, preview, source-of-truth, asset status, reclassify, rename, archive, soft-delete, AI prompt, and AI source handoff contracts before any Library production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Library can upload project assets.
- Library can refresh project/library scan data.
- Library can fetch protected previews.
- Library can mark/unmark assets as source-of-truth.
- Library can update asset status.
- Library can reclassify assets.
- Library can rename assets.
- Library can archive assets.
- Library can soft-delete assets.
- Library can prepare AI classification, missing-asset, and document extraction prompts.
- Library can send selected asset context to AI Command.
- Any future production change must preserve source/evidence authority, upload safety, protected preview behavior, asset mutation confirmations, reload behavior, and AI handoff boundaries.

## Current Active Files

- `public/control-center/pages/library.js`
- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/ai-panel.js`

## Upload Contract

Library upload behavior uses:

- `libraryUploadInput`
- `libraryUploadBtn`
- `libraryUploadTypeSelect`
- `libraryChooseFilesBtn`
- `libraryDropZone`
- `libraryToolbarUploadBtn`
- `data-library-upload-type`
- `uploadProjectAsset`

Upload flow:

- operator chooses or drops files
- upload type is selected
- upload button is disabled while uploading
- each selected file is uploaded individually
- success and failed results are tracked in `session.recentUploads`
- after successful upload, `reloadProjectData(activeProjectName)` can run
- upload input is cleared after upload attempt

This is a backend/durable asset creation path and must not be changed blindly.

## Protected Preview Contract

Library preview behavior uses:

- `renderPreview`
- `hydrateProtectedAssetPreview`
- `hydrateProtectedImageNode`
- `getProtectedAssetObjectUrl`
- `data-library-protected-preview`
- `data-library-protected-thumb`

Preview supports:

- image
- video
- audio
- PDF
- document fallback
- text preview
- JSON preview
- protected media fallback
- access-key error handling

Protected preview behavior must preserve access-key and invalid media path handling.

## Open Asset Contract

Library can open assets through:

- `data-library-open`
- `openLibraryAsset`

This is a view/open action, not approval, publishing, or execution.

## Source-of-Truth Contract

Library can toggle source-of-truth status through:

- `data-library-source-truth`
- `setProjectAssetSourceOfTruth(activeProjectName, assetId, nextValue)`

This updates source authority metadata and may affect downstream AI, campaign, content, publishing, governance, and evidence workflows.

It must remain explicit and must not silently approve, publish, or execute anything.

## Asset Status Contract

Library can update asset review status through:

- `data-asset-status-action`
- `data-library-asset`
- `data-asset-id`
- `updateProjectAssetStatus(activeProjectName, assetId, status, note)`

Observed status actions include:

- `approved`
- `needs_review`

Status changes can affect readiness and downstream visibility. Current copy states this does not publish anything.

## Reclassify Contract

Library can reclassify an asset through:

- `data-library-reclassify`
- `data-current-asset-type`
- `data-target-asset-type`
- `reclassifyProjectAsset`

The confirmation states this changes the Library group only and does not move, rename, or edit the physical file.

After successful reclassify, project data can reload.

## Rename Contract

Library can rename assets through:

- `data-library-rename`
- `promptForTextInput`
- `renameProjectAsset`

This changes asset display/name metadata and must remain explicit.

## Archive Contract

Library can archive assets through:

- `data-library-archive`
- `archiveProjectAsset`

The confirmation states the asset is removed from active Library views but remains in the registry and does not delete the physical file.

## Soft-Delete Contract

Library can soft-delete assets through:

- `data-library-delete`
- `deleteProjectAsset`

The confirmation states this applies a registry-level soft delete, removes the asset from active Library flows, and does not silently publish, approve, or run workflows.

## AI Prompt Contract

Library prepares AI prompts through:

- `buildAiPrompt`
- `libraryAiClassifyBtn`
- `libraryAiMissingBtn`
- `libraryAiExtractBtn`
- `libraryAiExtractSelectedDocBtn`
- `quickCommandInput`

Prompt modes include:

- classify assets
- review missing required assets
- extract key facts from documents

These prompts prepare AI review context only. They do not approve, publish, govern, or execute.

## AI Source Handoff Contract

Library can prepare selected asset context for AI Command through:

- `data-library-use-ai-source`
- `data-library-command="send-to-ai"`

This is source-context preparation only.

Library owns source selection; AI Command owns AI review/generation. The handoff must not imply approval, publishing, or execution.

## Required Asset Action Contract

Library required asset controls use:

- `data-library-required-action`
- `data-library-required-key`
- `data-library-upload-type`

Actions can focus upload, filter workspace, or prepare missing asset AI review. These are guidance/routing actions and should not mutate source authority without explicit upload or asset action.

## Action Panel Contract

`action-panel.js` renders selected asset controls including:

- Open asset
- Ask AI to review asset
- Copy asset path
- Mark as source / Remove source mark
- Approve for use
- Mark for review
- Rename asset
- Archive asset
- Reclassify
- Soft-delete asset

These controls are high-impact and rely on stable `data-library-*`, `data-asset-id`, and `data-asset-status-action` attributes.

## AI Panel Contract

`ai-panel.js` renders AI guidance based on:

- missing required asset count
- selected asset presence
- source-of-truth status
- review status

The AI panel is advisory and should not mutate asset state directly.

## Data Attribute Inventory

Observed high-value attributes:

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
- `data-asset-status-action`
- `data-asset-id`

## Backend / Durable Authority Boundary

Backend/durable or backend-adjacent paths include:

- asset upload
- protected asset fetch
- source-of-truth toggle
- asset status update
- asset reclassify
- asset rename
- asset archive
- asset soft-delete
- reload project data after asset changes

## Frontend / Projection Boundary

Frontend/local or projection paths include:

- folder selection
- grid/list selection
- search/filter/sort state
- pagination
- selected asset preview rendering
- preview fallbacks
- AI prompt text preparation
- action panel rendering
- AI panel rendering
- session selected asset state
- session recent uploads display

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `uploadProjectAsset`
2. `libraryUploadInput`
3. `libraryUploadBtn`
4. `libraryUploadTypeSelect`
5. `getProtectedAssetObjectUrl`
6. `hydrateProtectedAssetPreview`
7. `hydrateProtectedImageNode`
8. `setProjectAssetSourceOfTruth`
9. `updateProjectAssetStatus`
10. `reclassifyProjectAsset`
11. `renameProjectAsset`
12. `archiveProjectAsset`
13. `deleteProjectAsset`
14. `data-library-source-truth`
15. `data-asset-status-action`
16. `data-library-reclassify`
17. `data-library-rename`
18. `data-library-archive`
19. `data-library-delete`
20. `data-library-use-ai-source`
21. `data-library-command="send-to-ai"`
22. `buildAiPrompt`
23. `libraryAiClassifyBtn`
24. `libraryAiMissingBtn`
25. `libraryAiExtractBtn`
26. `libraryAiExtractSelectedDocBtn`
27. `reloadProjectData` after asset changes
28. access-key error handling
29. confirmation text for asset mutations
30. action panel controls

## Recommended Future Patch

### Patch 16C — Library Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- source-of-truth mark versus approval
- approved asset status versus Governance approval
- soft-delete versus physical file deletion
- archive versus delete
- AI extraction versus claim approval
- AI source handoff versus AI execution
- upload classification versus final review status

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- upload behavior changes
- protected preview behavior changes
- source marking changes
- asset status changes
- reclassify behavior changes
- rename/archive/delete behavior changes
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
- all protected preview behavior
- all source-of-truth behavior
- all asset status behavior
- all reclassify behavior
- all rename behavior
- all archive behavior
- all soft-delete behavior
- all AI prompt behavior
- all AI source handoff behavior
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
- Confirm upload area renders.
- Choose files and confirm selected files display.
- Upload only in a safe test project.
- Refresh Library scan.
- Select asset from grid/list.
- Confirm preview loads or fallback appears.
- Confirm protected image/video/PDF previews still hydrate.
- Open asset.
- Mark/unmark source only in a safe test project.
- Approve for use only in a safe test project.
- Mark for review only in a safe test project.
- Rename only in a safe test project.
- Archive only in a safe test project.
- Soft-delete only in a safe test project.
- Reclassify only in a safe test project.
- Use as AI Source and confirm AI Command context is set.
- Run AI classify/missing/extract prompts and confirm they only route/prepare AI context.
- Confirm no publish/send/governance action is introduced.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.
