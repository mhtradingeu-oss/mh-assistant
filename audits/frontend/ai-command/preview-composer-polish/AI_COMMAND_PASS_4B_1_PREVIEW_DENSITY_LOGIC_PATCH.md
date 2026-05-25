# AI Command Pass 4B-1 - Preview Density Logic Patch

## Summary

This patch reduces repeated content in the AI Command Output Workspace preview.

## Root cause

The preview renderer displayed `preview.summary` in the summary area and also included the same summary inside the structured `Main output` block.

This caused long AI responses to appear multiple times in the right Output Workspace.

## What changed

- Added `normalizeUniqueDisplayList(...)`.
- `buildStructuredPreviewBlocks(...)` now deduplicates main output items.
- `preview.summary` is no longer included inside `Main output` when it is already shown as the summary.

## What did not change

- No route logic changes.
- No Task Center changes.
- No Workflows changes.
- No backend changes.
- No durable task creation.
- No CSS changes.

## Expected result

The Output Workspace should show the result once, with less repeated text and lower visual traffic.
