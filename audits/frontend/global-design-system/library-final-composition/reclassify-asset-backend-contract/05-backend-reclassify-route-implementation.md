# LIB-FEATURE-3B — Backend Reclassify Route Implementation

## Status
Implemented pending validation.

## Runtime File Changed
- `runtime/orchestrator-service/server.js`

## Added Route
`PATCH /media-manager/project/:project/assets/:assetId/classification`

## Behavior
- Validates `assetId`.
- Validates `asset_type`.
- Canonicalizes `asset_type` using backend catalog.
- Rejects invalid asset types.
- Rejects deleted assets.
- Updates registry metadata only.
- Does not move physical files.
- Does not change `file_path`.
- Records:
  - `previous_asset_type`
  - `reclassified_at`
  - `reclassified_by`
  - `reclassification_note`
  - `updated_at`

## Safety
- Backend route only.
- No frontend button added.
- No API client added.
- Upload/preview/archive/delete/source-of-truth behavior unchanged.
