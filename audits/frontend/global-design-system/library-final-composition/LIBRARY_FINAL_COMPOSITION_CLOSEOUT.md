# Library Final Composition Closeout

## Status
Closed pending final manual browser QA confirmation.

## Runtime Commit
- `c9d79e3` — `LIB-FINAL-6 — Clean Library page, remove duplicate CSS, verify CTA actions and scroll behavior`

## Runtime Files Changed
- `public/control-center/pages/library.js`
- `public/control-center/styles/14-page-standard.css`

## Completed Work

### Required Asset CTA Behavior
- Required Asset Evidence actions were audited and preserved.
- `Review` now routes the operator toward Asset Workspace behavior.
- `Classify` prepares the matching upload type and targets Asset Intake behavior.
- Upload type selection remains connected to `libraryUploadTypeSelect`.
- Required card labels now use clearer `Files found` language.

### Scroll / Focus Behavior
- Added Library-specific scroll targeting helper.
- Scroll behavior is aware of the app workspace container.
- Target sections receive temporary `is-required-action-target` visual feedback.

### CSS Cleanup
- Removed duplicate local required-card CSS introduced during patch iterations.
- Fixed stale target selector from `.library-intake-card` to `.library-actions-card`.
- Kept broader 12-pages.css versus 14-page-standard.css duplication documented as consolidation debt.

### Preserved Contracts
- `data-library-required-action`
- `data-library-required-key`
- `data-library-upload-type`
- `libraryAssetWorkspace`
- `libraryUploadTypeSelect`
- `libraryFilterTypeSelect`
- `libraryFilterStatusSelect`
- `libraryFilterSourceSelect`
- `libraryDropZone`
- `data-copy-asset-path`
- `data-library-source-truth`
- `data-asset-status-action`
- `data-library-rename`
- `data-library-archive`
- `data-library-delete`
- `data-asset-id`

## Safety Confirmation
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior preserved.
- Preview behavior preserved.
- Protected media behavior preserved.
- Action panel behavior preserved.
- Mutation behavior preserved.
- No Move to folder feature was added.

## Known Follow-up
Move / Reclassify Asset remains a future feature gap and requires a dedicated backend/API/data-model audit before implementation.

Recommended future phase:
- `LIB-FEATURE-1 — Move / Reclassify Asset Capability Audit`

## Required Browser QA
Verify manually:

1. `Product Images → Review`
   - Upload type changes where expected.
   - Asset Workspace becomes the intended target.
   - Target highlight appears.
   - Files are visible if present.

2. `Logos → Classify`
   - Upload type changes to Logo.
   - Asset Intake becomes the intended target.
   - Target highlight appears.

3. Asset actions:
   - Copy path
   - Mark source / remove source
   - Approve for use
   - Mark for review
   - Rename
   - Archive
   - Soft-delete

## Decision
Library final composition runtime patch is committed. Audit evidence and closeout are ready to commit after final review.
