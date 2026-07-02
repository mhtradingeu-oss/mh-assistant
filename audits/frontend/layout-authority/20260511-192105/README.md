# Layout Authority Deep Scan

Date UTC: Mon May 11 07:22:59 PM UTC 2026
Branch: architecture/frontend-consolidation-v1
Commit: 6ff2852

## Purpose

Deep scan to find every frontend layout authority source before final cleanup.

## Current problem

The frontend still has multiple layout authority models:

1. Page Standard routes
2. Custom System surfaces
3. Local page shells
4. Local root/workspace/surface wrappers
5. Page-level root.innerHTML renders
6. CSS page scopes spread across global and page-specific files

This scan is intended to identify which pages must remain standard-wrapped, which pages should become custom surfaces, and which pages need layout cleanup.

## Important WIP note

Before this scan, a temporary visual CSS WIP was backed up to:

- ~/mh-assistant-wip/system-surfaces-wip-tracked.patch
- ~/mh-assistant-wip/15-system-surfaces.css
- ~/mh-assistant-wip/SYSTEM_SURFACES_VISUAL_CSS_PATCH_AUDIT.md

Do not commit that WIP until the layout authority decision is finalized.

## Files

- 00-status.txt
- 01-index-css-load-order.txt
- 02-index-sidebar-routes.txt
- 03-page-standard-membership.txt
- 04-route-definitions.txt
- 05-route-render-flow.txt
- 06-full-page-render-inside-route.txt
- 07-local-shell-root-workspace.txt
- 08-loading-empty-error-states.txt
- 09-css-page-scopes.txt
- 10-old-labels-final-scan.txt
- 11-legacy-runtime-load.txt
- 12-api-frontend-relation.txt
- 13-event-listeners-actions.txt
- 14-large-js-files.txt
- 15-validation.txt

## Initial findings

### Confirmed cleaned

- Operations old scaffold labels are removed.
- Governance old numbered labels are removed.
- Settings old shell labels were removed.
- std-page-shell ownership was consolidated.
- std-main-content-slot ownership was consolidated.

### Still unresolved

Multiple pages still render local/custom layout surfaces:

- Home
- Library
- Integrations
- AI Command
- Workflows
- Campaign Studio
- Content Studio
- Media Studio
- Publishing
- Setup
- Ads Manager
- Insights
- Research
- Settings
- Governance
- Operations Centers

This does not mean all are broken, but it means they must be classified by layout authority.

## Required next decision

Each route must be assigned to exactly one of these models:

1. Standard Page Model
   - Page Standard owns header/context/smart strip.
   - Page file renders only main content.

2. Custom Surface Model
   - Route sets disableStandardLayout: true.
   - Page file owns its full surface.
   - CSS must be scoped to data-page.

3. Legacy/Archive Candidate
   - Not runtime loaded.
   - May be archived after validation.

## Do not do yet

- Do not commit current visual CSS WIP.
- Do not delete files.
- Do not rename routes.
- Do not refactor renderers.
- Do not change backend/API/data.
- Do not move pages between models before the authority matrix is created.
