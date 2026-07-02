# 03 — Proposed Backend Patch Plan

## Status
Plan only. No runtime code changed.

## Endpoint
PATCH /media-manager/project/:project/assets/:assetId/classification

## Implementation Position
Add near existing asset mutation routes after rename or status route and before source-of-truth/archive/delete.

## Required Behavior
- Validate project name from params.
- Validate assetId from params.
- Parse JSON body.
- Validate asset_type.
- Canonicalize via getCanonicalAssetType.
- Confirm canonical type exists in getAssetTypeCatalog.
- Read assets registry through getProjectAssetPaths(project).assetsRegistryPath.
- Find asset by asset_id / assetId / id.
- Reject deleted asset.
- Do not move file_path.
- Do not change file_name/name/display_name unless already existing behavior requires it.
- Update asset_type only plus audit metadata.
- Add previous_asset_type, reclassified_at, reclassified_by, reclassification_note.
- Set updated_at.
- Write registry using writeJsonFile.
- Return { ok: true, asset }.

## Safety
- Backend only first.
- No frontend button yet.
- No API client yet unless backend route passes node check.
- No physical file movement.
