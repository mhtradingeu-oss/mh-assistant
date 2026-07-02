# AI-COMMAND-GDS-2H — Tool ID Source and Hard Fallbacks

## Status
Implemented pending browser validation.

## Problem
The drawer dataset showed `pendingTool: "audience"`, but the fallback lookup was not reading `data-aicmd-tool-dock`, only `data-aicmd-tool-dock-id` / `data-tool-id`.

## Fix
`openToolDrawer` now reads tool id from:
- `data-aicmd-tool-dock`
- `data-aicmd-tool-dock-id`
- `data-tool-id`

It also keeps safe hard fallbacks for output, source, and destination options.

## Safety
- No backend change.
- No API change.
- No command execution behavior change.
- Only fixes frontend drawer select hydration.
