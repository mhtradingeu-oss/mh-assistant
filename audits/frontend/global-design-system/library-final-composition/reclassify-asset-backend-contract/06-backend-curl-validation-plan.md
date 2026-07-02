# LIB-FEATURE-3C — Backend Curl Validation Plan

## Status
Pending runtime validation.

## Purpose
Validate the new backend-only reclassify route before adding API client or UI.

## Route
`PATCH /media-manager/project/:project/assets/:assetId/classification`

## Required Checks
- Server responds to invalid asset_type with 400.
- Server responds to missing asset id with 404 or registry mutation error.
- Server accepts a valid canonical asset_type.
- Registry updates `asset_type`.
- Registry preserves `file_path`.
- Registry records `previous_asset_type`.
- Registry records `reclassified_at`.
- Registry records `reclassified_by`.
- No frontend code changed.
