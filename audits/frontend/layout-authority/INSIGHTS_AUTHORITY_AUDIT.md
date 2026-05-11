# Insights Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Insights is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local analytics and optimization workspace.

Confirmed local surface signals:

- insightsRoot
- insights-wrapper
- insights-workspace
- insights-workspace-grid
- insights-overview-grid
- insights-platform-grid
- insights-ranked-list
- insights-learning-grid
- insights-domain-summary-grid

Confirmed behavior complexity:

- live refresh state
- loading / error refresh handling
- fetchProjectInsights
- route handoff creation
- AI prompt handoff
- navigation to AI Command
- navigation to Campaign Studio
- navigation to Content Studio
- navigation to Ads Manager
- navigation to Publishing
- data-insights-* action attributes

## Current issue

Insights is currently both:

1. A Page Standard route
2. A full custom analytics operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Insights should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `insightsRoute`

## Non-goals

Do not change:

- route id
- data-page
- insights refresh behavior
- fetchProjectInsights behavior
- optimization/recommendation rendering
- AI handoff behavior
- route handoff behavior
- data-insights-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- fetchProjectInsights
- refresh state loading/error handling
- data-insights-open
- data-insights-route
- data-insights-prompt
- AI Command handoff
- route handoffs to campaign/content/ads/publishing
- recommendation rendering
- workspace grids and analytics blocks

## Recommended next patch

Insights Authority Patch:

- add `disableStandardLayout: true` to `insightsRoute`
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
