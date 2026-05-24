# AI Command Tools Browser QA Note

## Summary

Manual browser QA confirmed that the right-side canonical tools are technically connected and respond to clicks.

## Observed behavior

- Tool cards are clickable.
- Tool selection highlights the selected tool.
- Source-required tools show a safe message:
  - "This tool needs a source. Choose from Library or change the source type before continuing."
- Output Workspace remains safe/local.
- No backend execution is triggered automatically.

## UX findings

The current tool cards are visually too verbose.

Each card currently shows:

- Tool title
- Prepare action
- Description
- Output type
- Route
- Status

This creates visual density in the right drawer.

## Recommended follow-up

Create a future small UX polish pass for the right tools drawer:

- Keep tool title.
- Keep one short description line.
- Keep Prepare action.
- Move output/route/status metadata to selected-tool details or Output Workspace.
- Improve source-required state so users understand why preview did not appear.

## Preview behavior decision

The current behavior is safe:

- A tool that requires a source should not create a preview until a source exists.
- The source-required toast/message is correct.
- The UX should explain this more clearly.

## Status

Technical wiring: passed.

Browser behavior: safe.

UX polish: recommended follow-up, not blocking.
