# LIB-FINAL-3 — Library Action Contract Summary

## Status
Audit completed.

## Current Visible Actions

Confirmed visible / implemented actions:

- Open asset
- Ask AI to review asset
- Copy asset path
- Mark as source / Remove source mark
- Approve for use
- Mark for review
- Rename asset
- Archive asset
- Soft-delete asset
- Upload asset to Library
- Folder/filter navigation
- Search/filter/sort/pagination

## Confirmed Action Contracts

Preserved action/data contracts:

- `data-copy-asset-path`
- `data-library-source-truth`
- `data-asset-status-action`
- `data-library-asset`
- `data-asset-id`
- `data-library-rename`
- `data-library-archive`
- `data-library-delete`

Important note:
Library uses `data-library-source-truth`, not `data-source-of-truth`.

## Confirmed API Mutations

Frontend API calls confirmed:

- `uploadProjectAsset`
- `updateProjectAssetStatus`
- `renameProjectAsset`
- `setProjectAssetSourceOfTruth`
- `archiveProjectAsset`
- `deleteProjectAsset`

Backend mutation endpoints confirmed:

- `/media-manager/project/:project/assets/:assetId/status`
- `/media-manager/project/:project/assets/:assetId/rename`
- `/media-manager/project/:project/assets/:assetId/source-of-truth`
- `/media-manager/project/:project/assets/:assetId/archive`
- `/media-manager/project/:project/assets/:assetId/delete`

## Safety Confirmation

- Copy path is non-mutating.
- Open asset is non-mutating.
- Ask AI is context/review oriented.
- Mark as source mutates source-of-truth metadata.
- Approve / mark for review mutate readiness/review status.
- Rename mutates asset display/registry metadata.
- Archive mutates active Library visibility/status.
- Soft-delete mutates registry-level delete/archive metadata.
- Upload mutates asset registry and uploaded asset set.

## Move to Folder Finding

No active `Move to folder` action is currently confirmed in the Library Action Panel.

The Library has folder/filter concepts and category/type routing, but no confirmed visible move-to-folder mutation contract was found in the current action panel.

Decision:
Do not add or claim Move to folder as part of LIB-FINAL-2B. Treat it as a future feature requiring a dedicated implementation plan and backend/API contract review.

## Decision

Library action contract audit is complete. Current actions are confirmed. Move to folder remains a separate feature gap.
