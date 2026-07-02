# LIB-FEATURE-1 — Move / Reclassify Asset Capability Closeout

## Status
Closed as audit-only. Implementation blocked pending backend/API contract.

## Question
Should Library expose a "Move to folder" or "Reclassify asset" action now?

## Finding
The current Library does not expose a confirmed persistent Move/Reclassify mutation contract.

## Current Confirmed Asset Mutations
The frontend currently supports these asset mutations:

- Update asset status
- Rename asset
- Mark/remove source-of-truth
- Archive asset
- Soft-delete asset
- Upload asset

## Not Confirmed
The audit did not confirm an existing safe API or backend route for:

- Changing `asset_type`
- Changing `category`
- Moving an asset between persistent folders
- Moving a physical file path
- Reclassifying registry taxonomy safely

## Important Distinction
`folderKey` in the current Library is a UI/session filter. It is not a persistent move operation.

Adding a "Move to folder" button now would be misleading because it could imply persistent storage or registry movement that the system does not currently support.

## Decision
Do not add a "Move to folder" button in the current Library action panel.

The safe future feature should be:

- `Reclassify asset`

## Recommended Future Implementation Path

### Phase 1 — Backend/API Design
Create a dedicated safe endpoint, for example:

- `PATCH /media-manager/project/:project/assets/:assetId/classification`

Allowed body:

- `asset_type`
- optional `note`

Must validate:

- project exists
- asset exists
- asset_type is canonical and allowed
- physical file movement is not performed
- registry is updated atomically
- audit metadata is recorded

### Phase 2 — Frontend Action Panel
Add a controlled action:

- Button label: `Reclassify asset`
- User chooses a canonical asset type.
- Confirm dialog explains downstream impact.
- Calls API.
- Reloads Library.
- Preserves selected asset if possible.

### Phase 3 — Browser QA
Verify:

- selected asset changes category/type
- folders update correctly
- filters update correctly
- no upload/preview/archive/delete behavior regresses

## Safety Confirmation
- No runtime code changed in this audit.
- Backend unchanged.
- API unchanged.
- Frontend unchanged.
- No misleading Move button added.

## Decision
LIB-FEATURE-1 is closed as audit-only and should proceed next to backend/API planning before implementation.
