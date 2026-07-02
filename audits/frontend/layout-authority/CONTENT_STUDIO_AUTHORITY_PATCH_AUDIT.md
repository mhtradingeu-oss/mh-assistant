# Content Studio Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Content Studio route authority only

## Summary

Content Studio is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to the Content Studio route.

## Why

Content Studio owns a full production workspace:

- content item selection
- version actions
- content approval
- send to AI
- send to Media Studio
- send to Publishing
- content record persistence
- data-content-* action attributes

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: content-studio
- data-page="content-studio"
- content item selection
- version actions
- approval behavior
- content persistence
- AI handoff
- Media Studio handoff
- Publishing handoff
- data-content-* attributes

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
