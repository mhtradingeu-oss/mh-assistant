# Home Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Home is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local executive command center.

Confirmed local surface signals:

- homeExecRoot
- home-command-center
- home-exec-hero
- home-kpi-grid
- home-decision-section
- home-blocker-grid
- home-two-column-grid
- home-status-grid
- home-status-board
- home-ai-panel
- home-ai-prompt-grid
- home-decision-quick-actions

Confirmed behavior complexity:

- executive dashboard aggregation
- system health summary
- blocker routing
- launch readiness snapshot
- campaign summary
- AI team status
- AI prompt preparation
- next-best-action routing
- navigation to AI Command
- navigation to Campaign Studio
- navigation to Library
- navigation to Integrations
- navigation to Setup
- dedicated Home CSS layer through 13-home-executive.css

## Current issue

Home is currently both:

1. A Page Standard route
2. A full custom executive command surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Home should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `homeRoute`

## Non-goals

Do not change:

- route id
- data-page
- executive dashboard data aggregation
- next-best-action logic
- AI prompt behavior
- navigation behavior
- render helper files
- CSS
- API wrappers
- backend
- data/projects

## Behavior that must be preserved

- homeExecRoot
- home-command-center
- executive hero
- KPI cards
- blocker cards
- recent activity
- AI team section
- AI prompt buttons
- quick action routing
- next-best-action routing
- navigation to ai-command
- navigation to campaign-studio
- navigation to library
- navigation to integrations
- navigation to setup

## Recommended next patch

Home Authority Patch:

- add `disableStandardLayout: true` to `homeRoute`
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
