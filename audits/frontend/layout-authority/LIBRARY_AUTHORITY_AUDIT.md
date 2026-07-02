# Library Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Library is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local workspace surface.

Confirmed local surface signals:

- `libraryRoot`
- `library-smart-shell`
- `library-workspace-grid`
- `library-workspace-main`
- `library-workspace-side`
- `library-action-panel`
- `library-ai-panel`

Confirmed behavior complexity:

- upload flow
- protected previews
- document/image/video/audio preview handling
- asset rename
- asset delete
- archive
- source-of-truth
- status update
- folder selection
- grid/list pagination
- AI prompt navigation
- action panel
- AI panel
- many rerender paths

## Current issue

Library is currently both:

1. A Page Standard route
2. A full custom workspace surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Library should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `libraryRoute`

## Non-goals

Do not change:

- route id
- data-page
- upload behavior
- preview behavior
- action buttons
- data-library-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- uploadProjectAsset
- renameProjectAsset
- deleteProjectAsset
- archiveProjectAsset
- protected preview loading
- `data-library-*` actions
- action panel commands
- AI panel commands
- navigation to `ai-command`
- rerender behavior
- library session state

## Recommended next patch

Library Authority Patch:

- add `disableStandardLayout: true` to `libraryRoute`
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
