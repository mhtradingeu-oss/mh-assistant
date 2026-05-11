# Media Studio Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Media Studio route authority only

## Summary

Media Studio is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to the Media Studio route.

## Why

Media Studio owns a full media production workspace:

- media job actions
- media queue selection
- media version actions
- specialist actions
- send to Publishing
- save to Library
- data-media-* action attributes

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: media-studio
- data-page="media-studio"
- media job actions
- queue selection
- version actions
- specialist actions
- save to Library
- send to Publishing
- data-media-* attributes

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
