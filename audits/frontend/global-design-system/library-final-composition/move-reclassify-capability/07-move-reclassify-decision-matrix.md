# 07 — Move / Reclassify Decision Matrix

## Purpose
Determine the correct technical meaning of "Move to folder" before adding any UI button.

## Possible Meanings

### Option A — Change `asset_type`
Move means reclassify the asset from one canonical asset type to another.

Example:
- `product_photos` → `packaging_images`
- `logo` → `brand_guideline`

Requires:
- API to update asset type, or safe extension of existing asset update endpoint.
- Registry update.
- Re-render Library workspace.
- Audit note explaining classification change.

Risk:
- Medium. This changes how the asset is grouped and used by AI/workflows.

### Option B — Change `category`
Move means change a UI category or grouping label without changing canonical asset type.

Requires:
- Existing category field or new field.
- UI folder mapping update.

Risk:
- Lower if category is not used by workflows.

### Option C — Change physical `file_path`
Move means moving the actual file on disk/storage.

Requires:
- Backend file operation.
- Path validation.
- Protected media URL update.
- Preview cache invalidation.

Risk:
- High. Do not implement without backend storage audit.

### Option D — UI-only folderKey
Move means changing only the current filter/session folder.

Requires:
- No backend.
- Not a real move.

Risk:
- Misleading. Should not be called "Move".

## Recommended Initial Product Meaning
Start with **Reclassify Asset Type**, not physical move.

Recommended label:
- `Reclassify asset`

Not recommended yet:
- `Move to folder`

## Required Before Implementation
- Confirm whether an API exists to update asset type/category.
- If no API exists, design a dedicated endpoint.
- Add Governance-safe mutation note.
- Add Browser QA for selected asset action panel.
