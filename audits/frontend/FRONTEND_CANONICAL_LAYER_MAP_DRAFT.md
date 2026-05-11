# Frontend Canonical Layer Map Draft

Date UTC: Mon May 11 04:42:46 PM UTC 2026
Branch: architecture/frontend-consolidation-v1
Commit: 18b33f3

## Purpose

This document records the current frontend layer reality before any further cleanup, archive, or redesign work.

## Current confirmed facts

### Operations pages

The core Operations pages have been migrated to dedicated renderers:

- Task Center
- Queue Center
- Job Monitor
- Notification Center

Legacy Operations shared scaffold cleanup has been committed.

### Legacy folder

The current runtime scan found no direct runtime load reference from:

- index.html
- app.js
- router.js
- pages/*.js
- pages/*/*.js

to:

- public/control-center/legacy/
- styles.legacy
- page-standard.legacy
- integrations.monolith

Status: archived_candidate, not runtime-loaded based on current scan.

### Page Standard layer

page-standard.js is an active runtime layer.

Observed behavior:

- app.js calls routeDef.render first.
- app.js then calls applyStandardPageLayout when the route is not marked disableStandardLayout.
- page-standard.js creates std-page-shell, std-context-ribbon, std-smart-strip, and stdMainContentSlot.
- This means some pages may be rendered first by their own page file, then wrapped or normalized by page-standard.js.

Risk:

- possible visual shift between initial render and post-standard-layout render.
- possible duplicated header/context if page-local layout already contains equivalent structures.

### CSS layer conflict

The current scan confirms std-page-shell is defined in more than one CSS layer:

- 08-components-foundation.css defines .std-page-shell with grid behavior.
- 14-page-standard.css defines .std-page-shell with flex behavior.
- Since 14-page-standard.css loads after 08-components-foundation.css, it wins.

Status: needs consolidation.

### Governance

governance.js still uses local numbered sections:

- 0. Review Model
- 1. Governance Overview
- 2. Policy / Rule Summary
- 3. Approval / Decision Queue
- 4. Selected Decision Details
- 5. Governance Actions
- 6. Governance AI Assistant

It has loading paths inside renderPage and rerender flow.

Status: needs dedicated UX contract before redesign.

### Settings

settings.js uses local layout:

- settings-shell
- settings-workspace
- Settings Overview
- Control Actions
- Settings AI Assistant
- Settings Summary

It has loading, root.innerHTML, addEventListener bindings, and durable settings behavior.

Status: needs dedicated UX contract before redesign.

## Immediate cleanup order

1. Commit this canonical layer map draft.
2. Create Page Standard Authority Audit.
3. Create Governance UX Contract.
4. Create Settings UX Contract.
5. Only after contracts, implement layout-only patches page by page.
6. Archive legacy folder only after a dedicated archive plan and validation.

## Do not do yet

- Do not delete CSS.
- Do not delete legacy folder.
- Do not change index.html load order.
- Do not modify page-standard.js.
- Do not refactor Governance or Settings runtime.
- Do not modify backend or data/projects.
