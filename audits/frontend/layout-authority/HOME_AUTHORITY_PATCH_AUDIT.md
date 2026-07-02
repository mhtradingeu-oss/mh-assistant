# Home Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Home route authority only

## Summary

Home is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `homeRoute`.

## Why

Home owns a complete executive command center:

- homeExecRoot
- home-command-center
- executive hero
- KPI dashboard
- blocker dashboard
- launch readiness summary
- campaign summary
- AI team panel
- AI prompt actions
- quick route actions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/home.js
- audits/frontend/layout-authority/HOME_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: home
- data-page="home"
- homeExecRoot
- home-command-center
- dashboard rendering
- AI prompt actions
- next-best-action routing
- quick action routing
- dedicated home render helpers

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
