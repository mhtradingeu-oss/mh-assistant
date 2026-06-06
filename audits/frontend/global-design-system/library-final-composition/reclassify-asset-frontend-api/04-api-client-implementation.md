# LIB-FEATURE-4B — Reclassify Asset API Client Implementation

## Status
Implemented pending validation.

## Runtime File Changed
- `public/control-center/api.js`

## Added Function
`reclassifyProjectAsset(projectName, assetId, assetType, note = "")`

## Endpoint
`PATCH /media-manager/project/:project/assets/:assetId/classification`

## Safety
- API client only.
- No UI button added.
- No Library handler changed.
- No action-panel changed.
- Existing asset mutations unchanged.
- Backend route was already validated in LIB-FEATURE-3C.
