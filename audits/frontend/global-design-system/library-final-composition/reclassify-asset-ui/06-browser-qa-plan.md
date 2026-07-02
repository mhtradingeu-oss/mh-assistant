# LIB-FEATURE-5C — Reclassify Asset UI Browser QA Plan

## Status
Pending manual browser QA.

## URL
`http://127.0.0.1:3000/control-center/#library`

## Preconditions
- Backend server running on port 3000.
- Control Center write key available in the app runtime.
- Library has at least one selected registry-backed asset.

## Test Steps

### 1. Select Asset
- Open Library.
- Select a registry-backed asset.
- Confirm Action Panel shows selected asset.
- Confirm `Reclassify asset` button appears in Decisions section.

### 2. Cancel Flow
- Click `Reclassify asset`.
- Cancel prompt.
- Confirm no data changes.
- Confirm no error.

### 3. Invalid Type Flow
- Click `Reclassify asset`.
- Enter invalid type such as `bad_type`.
- Confirm user sees validation error.
- Confirm no data changes.

### 4. Valid Type Flow
- Click `Reclassify asset`.
- Enter a valid canonical type, for example `product_photos`.
- Confirm confirmation dialog appears.
- Confirm message says reclassifying.
- Confirm Library reloads.
- Confirm selected asset type changes.
- Confirm physical file path does not change.

### 5. Restore Flow
- Reclassify the same asset back to its original type.
- Confirm final type is restored.
- Confirm no preview/upload/archive/delete/source-of-truth behavior regressed.

## Required Existing Action Smoke Test
- Copy asset path still works.
- Rename button still opens prompt.
- Archive button still asks confirmation.
- Soft-delete button still asks confirmation.
- Mark as source still works when allowed.
- Approve/Mark review still works when allowed.

## Safety
- No physical file movement expected.
- No file_path change expected.
- No CSS changes expected.
