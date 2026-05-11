# Setup Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Setup route authority only

## Summary

Setup is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `setupRoute`.

## Why

Setup owns a complete setup wizard and source-of-truth workspace:

- setupRoot
- setup-wizard-shell
- setup-wizard-layout
- setup wizard steps
- setup validation panels
- save actions
- AI helper actions
- handoff actions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/setup.js
- audits/frontend/layout-authority/SETUP_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: setup
- data-page="setup"
- setupRoot
- setup-wizard-shell
- saveProjectSetup
- local draft persistence
- template application
- step navigation
- required field validation
- data-setup-* attributes
- AI helper actions
- navigation actions

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
