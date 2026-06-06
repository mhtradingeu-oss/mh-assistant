# AI-COMMAND-GDS-1C — AI Command Ownership Closeout

## Status
Closed as audit-only. Ready for targeted UX polish.

## Finding

AI Command is not a single-file surface.

Confirmed active ownership:

### Main AI Command Surface
- `public/control-center/pages/ai-command.js`

Owns:
- AI command runtime
- sessions
- intelligence/context loading
- suggestions
- AI specialists
- durable command submission
- result routing
- command bridge event handling

### Tool Dock / Source Drawer
- `public/control-center/pages/ai-command/tool-dock.js`

Owns:
- smart tool dock
- tool drawer
- output/source/destination setup
- selected Library source rendering
- Library source handoff
- source-required warnings
- source context prompt building

## Library → AI Command Handoff

Confirmed:
- Library exposes `Use as AI Source`.
- AI Command tool dock reads the selected Library source.
- Tool drawer renders a selected source card.
- Tool drawer can open Library to choose/change a source.
- Source context is injected into prompt context as selected Library source evidence.

## CSS / Layout Risk

AI Command has active CSS in current styles and old legacy AI Command CSS still exists in legacy files.

Do not perform broad CSS rewrites before browser inspection.

## UX Risks To Patch Later

- Source handoff copy can be clearer.
- Library source card may need better visual hierarchy.
- Tool drawer text may be too long.
- Source-required warnings should be concise.
- Main AI Command page should be inspected visually before changing layout.
- Avoid touching backend/API in first polish pass.

## Decision

Proceed next with a narrow, safe polish pass focused on:

`AI-COMMAND-GDS-2A — Tool Dock Selected Source UX Polish`

Scope:
- `public/control-center/pages/ai-command/tool-dock.js`
- possibly small CSS additions only if needed
- no backend changes
- no API changes
- no command execution behavior changes
