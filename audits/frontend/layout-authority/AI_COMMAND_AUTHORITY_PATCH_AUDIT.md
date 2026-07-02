# AI Command Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: AI Command route authority only

## Summary

AI Command is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `aiCommandRoute`.

## Why

AI Command owns a complete AI operating room surface:

- ctrlRoomRoot
- aicmd-shell
- aicmd-section
- ctrl-room header/context/team
- prompt composer
- response stream
- route suggestions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/ai-command.js
- audits/frontend/layout-authority/AI_COMMAND_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: ai-command
- data-page="ai-command"
- ctrlRoomRoot
- aicmd-shell
- data-aicmd-* attributes
- executeProjectAiCommand
- prompt drafting
- quick prompts
- specialist selection
- response rendering
- workflow bridge sync
- navigation to workflows
- navigation to campaign-studio
- navigation to insights

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
