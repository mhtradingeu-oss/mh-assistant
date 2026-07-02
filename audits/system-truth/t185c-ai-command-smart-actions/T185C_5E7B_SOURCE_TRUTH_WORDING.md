# T185C.5E7B — AI Command Source Truth Wording

## Status
Closed.

## Scope
Clarified AI Command source menu wording without changing backend behavior, storage behavior, source bridge behavior, tool drawer behavior, Campaign Builder behavior, or execution authority.

## Problem
The final composer source menu displayed four source choices:
- Upload file
- Choose from Library
- Choose product
- Project context

The underlying truth was mixed:
- Upload stages filenames/context locally but does not upload or persist file content from AI Command.
- Library source opens the guarded Library source bridge.
- Product/SKU direct selection is planned, not yet connected.
- Project context uses the current loaded workspace context for planning only.

## Change
Updated source menu labels and status messages to make the source model honest:
- Upload became `Stage file for this chat`.
- Library became `Choose trusted Library source`.
- Product became `Product / SKU context` with planned-selector wording.
- Project became `Current project context` with planning-only wording.

## Preserved
No changes were made to:
- final composer IDs or data attributes
- `data-aicmd-open-plus`
- `data-aicmd-final-source-menu`
- `data-aicmd-final-dropzone`
- Library source bridge
- `openLibrarySourcePickerFromAiCommand`
- tool drawer
- Campaign Builder
- backend/API/router/app files
- runtime data
- publish/send/approval/provider/workflow behavior

## Source Truth After Patch
- Upload: temporary chat context, not file persistence.
- Library: trusted saved source via guarded source bridge.
- Product/SKU: planned direct selector; use Library/manual context until connected.
- Project: current loaded workspace context for planning only; no records are mutated.

## Validation
Validation included:
- syntax checks for AI Command, tool dock, shared context, API, app, router, and orchestrator server
- active final composer preservation check
- active tool drawer preservation check
- source menu marker preservation check

## Final Result
AI Command source menu now communicates the true source behavior clearly and safely.
