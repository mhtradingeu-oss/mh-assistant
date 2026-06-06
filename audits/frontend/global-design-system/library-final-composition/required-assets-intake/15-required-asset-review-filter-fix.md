# LIB-FINAL-4F — Required Asset Review Filter Fix

## Status
Implemented pending browser QA.

## Problem
Required Asset Evidence actions changed upload type, but Review did not always show matching assets clearly because `selectedType` was set to the upload type. Some upload types may not exactly match existing `asset_type` values.

## Fix
- Review actions now set:
  - `session.folderKey = mappedFolder.key`
  - `session.selectedType = "all"`
- This shows all files inside the matching asset folder/bucket.
- Classify actions continue to prepare the upload type and route to Asset Intake.
- Scroll/highlight uses a short timeout after workspace rebind for clearer browser behavior.

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutation behavior unchanged.
- Action panel unchanged.
- No Move to folder feature was added.
