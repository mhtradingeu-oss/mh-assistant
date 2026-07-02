# AI Command Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

AI Command is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local AI operating room.

Confirmed local surface signals:

- `ctrlRoomRoot`
- `aicmd-shell`
- `aicmd-section`
- `ctrl-room-header`
- `ctrl-room-context-bar`
- `ctrl-room-team`
- `ctrl-prompts-grid`
- `ctrl-response-card`

Confirmed behavior complexity:

- AI specialist selection
- prompt drafting
- quick prompt templates
- session draft persistence
- executeProjectAiCommand
- structured response rendering
- route suggestions
- workflow bridge sync
- navigation to workflows, campaign studio, and insights

## Current issue

AI Command is currently both:

1. A Page Standard route
2. A full custom AI operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

AI Command should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `aiCommandRoute`

## Non-goals

Do not change:

- route id
- data-page
- AI command execution
- prompt behavior
- specialist selection
- session persistence
- response rendering
- route suggestions
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- executeProjectAiCommand
- AI draft/session persistence
- quick prompt prefill
- specialist selection
- structured response rendering
- workflow bridge sync
- navigation to workflows
- navigation to campaign-studio
- navigation to insights
- all `data-aicmd-*` attributes

## Recommended next patch

AI Command Authority Patch:

- add `disableStandardLayout: true` to `aiCommandRoute`
- no CSS edits
- no behavior edits
- validate JS and data/projects

## No-change confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
