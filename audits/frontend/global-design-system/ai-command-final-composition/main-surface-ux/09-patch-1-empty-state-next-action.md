# 09 — Patch 1 Empty-State Next Action

Implemented: Patch 1 from `07-safe-patch-plan.md`.

## Changed Copy

- Center chat empty title changed to `Start with the selected specialist`.
- Center chat empty body changed to `Ask for the next decision, campaign angle, content draft, or review.`
- Right output empty title changed to `Output appears after a response`.
- Right output empty body changed to `Run a message or use a tool to prepare a preview here.`
- Right output workspace empty header helper changed to make output secondary until a response or tool setup exists.

## Touched Anchors

- `public/control-center/pages/ai-command.js`
- `renderPhase3SpecialistConversation(...)`
- `renderAiRoomOutputWorkspace(...)`
- `public/control-center/styles/12-pages.css`
- page-scoped `.aicmd-room-output-empty` selectors

## Safety

- No handlers, IDs, data attributes, API calls, routing, command execution, Tool Drawer behavior, or Library source handoff behavior were changed.
- Output workspace remains mounted.
- Patch is copy and page-scoped visual hierarchy only.
