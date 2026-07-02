# AI Command Pass 4B-1 - Preview Readability Patch

## Summary

This patch reduces visual traffic in AI Command Output Workspace.

## Problem

The preview showed the same AI response in multiple places:

- Chat reply
- Summary
- Main output
- Details
- Next step
- Route/safety block

This made the right output panel hard to read.

## What changed

- Compact preview summary.
- Deduplicate output items.
- Show key output in short readable bullets.
- Move long full text into a collapsible `Read full result` section.
- Keep route and safety information visible.

## What did not change

- No route logic changes.
- No Task Center changes.
- No Workflows changes.
- No backend changes.
- No durable task creation.
- No mutation behavior.

## Expected result

The Output Workspace becomes easier to scan:

- Summary is short.
- Main output is not duplicated.
- Full text is still available through Read full result.
