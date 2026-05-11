# Insights Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Insights route authority only

## Summary

Insights is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `insightsRoute`.

## Why

Insights owns a complete analytics and optimization workspace:

- insightsRoot
- insights-wrapper
- insights-workspace
- insights-workspace-grid
- refresh controls
- recommendation surfaces
- route handoffs
- AI handoffs

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/insights.js
- audits/frontend/layout-authority/INSIGHTS_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: insights
- data-page="insights"
- insightsRoot
- insights refresh behavior
- fetchProjectInsights
- recommendation rendering
- data-insights-* attributes
- AI Command handoff
- route handoffs

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
