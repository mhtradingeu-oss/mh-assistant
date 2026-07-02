# LIB-FINAL-4G — Library Workspace Scroll Container Fix

## Status
Implemented pending browser QA.

## Problem
Required Asset Evidence CTAs updated state correctly, but the page did not always visibly move because Library is rendered inside the app workspace scroll container, not the document window.

## Evidence
- App main container is `#workspace.workspace.page-container`.
- `.workspace` owns vertical scrolling.
- Library page is rendered inside `section[data-page="library"] > #libraryRoot > .library-smart-shell`.

## Fix
- Added `scrollLibraryTargetIntoView`.
- The helper scrolls `#workspace` directly to the target.
- Falls back to `target.scrollIntoView` only when workspace is unavailable.
- Keeps temporary target highlight behavior.

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutation behavior unchanged.
- Action panel unchanged.
- No Move to folder feature was added.
