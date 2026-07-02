# LIB-FEATURE-2 — Reclassify Asset Backend/API Plan

## Status
Planned. No runtime implementation yet.

## Purpose
Design the safe backend/API contract required before adding a Library action-panel button for asset reclassification.

## Product Decision
Do not implement "Move to folder" as a UI-only action.

The correct first feature is:

- Reclassify asset

This means changing the persistent asset_type metadata in the project asset registry.

## Explicit Non-Goals
- Do not physically move files.
- Do not change file_path.
- Do not invalidate protected media URLs.
- Do not alter upload behavior.
- Do not alter preview behavior.
- Do not alter archive/delete/source-of-truth behavior.

## Proposed API
PATCH /media-manager/project/:project/assets/:assetId/classification

## Request Body
{
  "asset_type": "product_photos",
  "note": "Reclassified from Library action panel."
}

## Required Validation
- Project exists.
- Asset exists in project registry.
- asset_type is provided.
- asset_type is canonical and allowed by asset catalog.
- Asset is not deleted.
- Asset is not archived unless explicitly allowed later.
- Physical file path is not changed.
- Registry write is atomic.
- Audit metadata is added.

## Suggested Registry Changes
- asset_type
- category_label if derived from catalog
- updated_at
- reclassified_at
- reclassified_by
- reclassification_note
- previous_asset_type

## Response
{
  "ok": true,
  "asset": {}
}

## Backend Implementation Area To Audit
Likely file:
- runtime/orchestrator-service/server.js

## Frontend Implementation After Backend Exists
Add to:
- public/control-center/api.js
- public/control-center/pages/library/action-panel.js
- public/control-center/pages/library.js

Frontend behavior:
- Add Reclassify asset button.
- User chooses a canonical asset type.
- Confirm dialog explains downstream impact.
- Calls API.
- Reloads Library.
- Preserves selected asset where possible.
- Show success/error message.

## Safety Gates Before Implementation
- Backend route confirmed.
- API client added.
- No physical file movement.
- Node checks pass.
- Browser QA required.
- Commit backend/API separately before frontend UI.
