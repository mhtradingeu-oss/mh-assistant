# 03 — API Client Plan

## Status
Plan only.

## Function
Add:

export async function reclassifyProjectAsset(projectName, assetId, assetType, note = "")

## Endpoint
PATCH `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/classification`

## Body
- asset_type
- note

## Safety
- API client only.
- No UI button.
- No Library handler change.
- No action-panel change.
- Existing mutations unchanged.
