# Campaign Studio Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Campaign Studio route authority only

## Summary

Campaign Studio is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to the Campaign Studio route.

## Why

Campaign Studio owns a full campaign operating workspace:

- campaign persistence
- campaign readiness and blockers
- downstream handoff routing
- send to Publishing
- send to Content Studio
- send to Media Studio
- send to Ads Manager
- saveProjectCampaign
- createProjectHandoff

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: campaign-studio
- data-page="campaign-studio"
- campaign persistence
- campaign handoff routing
- readiness/blocker logic
- downstream navigation
- saveProjectCampaign
- createProjectHandoff
- campaign action attributes

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
