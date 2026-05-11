# System Defensive Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: System route authority only

## Summary

System pages were already custom surfaces and were not wrapped by Page Standard because most are not in REQUIRED_ROUTES.

This patch makes that decision explicit by adding:

- `disableStandardLayout: true`

to:

- taskCenterRoute
- queueCenterRoute
- jobMonitorRoute
- notificationCenterRoute
- governanceRoute

Settings already had `disableStandardLayout: true`.

## Why

The goal is one route, one layout authority.

System pages own their own surfaces:

- ops-shell
- governance-shell
- settings-page-surface

This patch prevents future ambiguity if Page Standard membership changes later.

## Behavior preserved

No behavior changes were made.

Preserved:

- route ids
- data-page values
- Operations behavior
- Governance behavior
- Settings behavior
- backend/API contracts
- data/projects

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
