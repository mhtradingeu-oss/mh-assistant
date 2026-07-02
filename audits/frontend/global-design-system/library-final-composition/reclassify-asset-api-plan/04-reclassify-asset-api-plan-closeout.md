# LIB-FEATURE-2 — Reclassify Asset Backend/API Plan Closeout

## Status
Closed as plan-only. Ready for backend implementation phase.

## Finding
The current system does not expose a confirmed backend/API route for persistent asset reclassification.

## Existing Confirmed Asset Routes
Current backend supports:

- Update asset status
- Rename asset
- Mark/remove source-of-truth
- Archive asset
- Soft-delete asset
- Delete asset
- Refresh Library

## Missing Capability
No confirmed route exists for:

- Updating `asset_type`
- Updating `category`
- Reclassifying an asset
- Moving an asset between persistent folders

## Decision
Do not add a frontend `Reclassify asset` button yet.

Proceed next with a backend/API implementation phase:

`LIB-FEATURE-3 — Implement Reclassify Asset Backend Contract`

## Safe Backend Contract
Recommended endpoint:

`PATCH /media-manager/project/:project/assets/:assetId/classification`

## Required Behavior
- Validate project.
- Validate asset.
- Validate canonical asset type.
- Do not move physical files.
- Do not change `file_path`.
- Update registry metadata only.
- Preserve upload/preview/archive/delete behavior.
- Record audit metadata:
  - `previous_asset_type`
  - `reclassified_at`
  - `reclassified_by`
  - `reclassification_note`

## Safety Confirmation
- No runtime code changed in this phase.
- Backend unchanged.
- API unchanged.
- Frontend unchanged.
- Plan only.
