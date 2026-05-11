# Publishing Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Publishing route authority only

## Summary

Publishing is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `publishingRoute`.

## Why

Publishing owns a complete execution surface:

- publishingRoot
- publishing-execution-center
- publishing-execution-grid
- publishing-main-column
- publishing-side-column
- publishing-card
- queue actions
- schedule builder
- approval actions
- publishing automation state

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/publishing.js
- audits/frontend/layout-authority/PUBLISHING_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: publishing
- data-page="publishing"
- publishingRoot
- publishing queue behavior
- schedule builder behavior
- approval behavior
- publish / retry / pause behavior
- reschedulePublishingItem
- approvePublishingItem
- publishPublishingItem
- local publishing drafts
- AI Command handoff
- publishing automation controls
- data-publishing-* attributes

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
