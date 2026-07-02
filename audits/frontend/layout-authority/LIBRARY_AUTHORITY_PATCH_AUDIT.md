# Library Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Library route authority only

## Summary

Library is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `libraryRoute`.

## Why

Library owns a complete workspace surface:

- libraryRoot
- library-smart-shell
- library workspace grid
- action panel
- AI panel
- upload flow
- preview flow
- asset command lifecycle

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/library.js
- audits/frontend/layout-authority/LIBRARY_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: library
- data-page="library"
- libraryRoot
- library-smart-shell
- upload behavior
- preview behavior
- rename/delete/archive behavior
- source-of-truth/status behavior
- data-library-* attributes
- action panel commands
- AI panel commands
- navigation to ai-command
- API wrappers
- backend contracts

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
