# AI Tool Drawer Library Return Flow Findings

## Summary

The Library return flow already exists and should be preserved.

The flow supports:

- opening Library from the drawer
- saving drawer return context
- saving Library source bridge context
- selecting a Library item as AI source
- returning to AI Command
- continuing from the drawer context

## Confirmed architecture

The drawer Change Source button stores:

- library source bridge context
- AI drawer return context
- selected source type
- pending tool id
- output type
- specialist/team context

Library supports:

- Use as Source in AI Command
- Back to Drawer
- navigateTo("ai-command")

Shared context supports:

- setSharedAiSource
- getSharedAiSource
- setSharedAiDrawerReturn
- getSharedAiDrawerReturn

## Compact UX constraint

Any compact drawer UX patch must not remove or rename:

- data-aicmd-tool-drawer-open-library
- data-aicmd-tool-drawer-selected-source
- data-aicmd-tool-drawer-source-warning
- data-aicmd-tool-drawer-use
- data-aicmd-tool-drawer-source-select

## Decision

No new source bridge should be created.

No duplicate return flow should be added.

The next patch should only compact the drawer UI while preserving this return flow.
