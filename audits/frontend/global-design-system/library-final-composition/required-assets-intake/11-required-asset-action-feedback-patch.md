# LIB-FINAL-4D — Required Asset Action Feedback Patch

## Status
Implemented pending browser QA.

## Purpose
Make Required Asset Evidence actions visibly useful without changing upload, preview, mutation, or action panel behavior.

## Confirmed Behavior
Required asset buttons already:
- read `data-library-required-action`
- read `data-library-required-key`
- read `data-library-upload-type`
- set the upload type
- map to a Library folder
- set `session.folderKey`
- set `session.selectedType`
- reset pagination
- rebind Asset Workspace

## Patch
- Keeps the existing behavior.
- Moves scroll/highlight to after `bindLibraryWorkspace`.
- Uses `requestAnimationFrame` so the operator sees the updated Workspace.
- Highlights `#libraryAssetWorkspace` briefly.
- Updates the toast to instruct the operator to select a file and use the action panel.

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutation behavior unchanged.
- Action panel behavior unchanged.
- No Move to folder feature was added.
