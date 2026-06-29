# T185E — AI Command Tool Events Classification

## Status
Classification only. No runtime behavior changed.

## Baseline
Previous locked baseline:
- T185D AI Command Event Baseline Lock
- Commit: ae1d528 Lock AI Command event baseline

## Current Truth
AI Command tool events are still owned by the legacy monolith in `public/control-center/pages/ai-command.js`.

## Confirmed Tool Rendering Locations
Tool buttons using `data-aicmdv2-tool` are rendered in multiple UI surfaces:
- specialist tools panel
- quick tools area
- chat-first tools tab

## Confirmed Tool Event Handling
Tool click binding is still handled inside `ai-command.js`.

There are two tool-related event areas:
1. Tool Drawer shortcut/preferred tool opener.
2. Main tool button binding loop that reads `data-aicmdv2-tool`, resolves the tool from `getPhase35ToolSet(session)`, builds metadata, and calls `openAiToolDrawerFromMetadata`.

## Confirmed Canonical Drawer Owner
The Tool Drawer shell and open behavior are imported by `ai-command.js`:
- `renderAiToolDrawerShell`
- `openAiToolDrawerFromMetadata`

## No Duplicate Controller Rule
Do not add a second `tool.controller.js`, `event.router.js`, or duplicate tool event binding layer until a safe extraction target is chosen and validated.

## Migration Rule
Future work must keep the current legacy handler active until the replacement is tested.
No global event router.
No regex injection.
No deleting existing onclick handlers during classification.
No runtime behavior change in this phase.

## Next Safe Candidate
The first safe migration candidate is extracting pure tool metadata preparation, not event binding.
