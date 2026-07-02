# AI Command Pass 4B-1 - Output Workspace Readability Patch

## Summary

This patch makes the AI Command Output Workspace result-focused and easier to read.

## UX decision

The chat panel already shows the raw conversation. The Output Workspace should not repeat the full chat reply.

The Output Workspace should show:

- concise result summary
- main output
- next steps
- route/safety status
- full result only inside Read full result

## What changed

- Added compact preview helpers.
- Rebuilt `buildStructuredPreviewBlocks(...)` to focus on output fields.
- Removed duplicated full chat text from always-visible output blocks.
- Moved long full text into `Read full result`.
- Added scoped CSS for output readability.

## What did not change

- No route logic changes.
- No Task Center changes.
- No Workflows changes.
- No backend changes.
- No durable task creation.
- No mutation behavior.

## Expected result

Output Workspace becomes a clean result panel, while the chat remains the place for conversation history.

## Final adjustment

Browser QA showed that `Chat reply` and `Read full result` still made the Output Workspace feel like a duplicated chat transcript.

Final adjustment:

- Output Workspace no longer shows `Chat reply` as the result title.
- Output Workspace no longer renders `Read full result`.
- Full raw conversation remains in the chat area.
- Output Workspace is kept as a clean result-only panel.

## Final browser QA adjustment

Browser QA confirmed the Output Workspace should not behave like a duplicate chat transcript.

Final changes:

- `Chat reply` is no longer used as the visible output title.
- `Read full result` is removed from the Output Workspace.
- Full raw conversation remains available in the chat panel only.
- Output Workspace is kept as a result-only surface.

## Structured output recovery

Browser QA showed that removing `Read full result` and forcing `draftText` empty reduced traffic, but it also hid too much of the useful result.

Final adjustment:

- The chat remains the raw conversation area.
- The Output Workspace now restores the full practical result as structured lines.
- The output is shown inside scrollable structured sections instead of repeating the chat transcript.
- `Read full result` remains removed.
- No routing, backend, Task Center, or Workflows behavior changed.
