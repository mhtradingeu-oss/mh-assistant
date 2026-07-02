# Integrations Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Integrations is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local integration operating workspace.

Confirmed local surface signals:

- integrationsRoot
- integrations-wrapper
- integration-system-panel
- integration-system-workspace
- integration-system-workspace-main
- integration-system-workspace-side
- integration-system-overview
- integration-system-diagnostics
- integration-system-activity
- integration-system-readiness-map

Confirmed behavior complexity:

- connector selection
- category filter
- status filter
- provider search
- Smart Connect drawer behavior
- connectProjectIntegration
- reconnectProjectIntegration
- testProjectIntegration
- syncProjectIntegration
- disconnectProjectIntegration
- data-integration-* action attributes
- AI prompt navigation to ai-command

## Current issue

Integrations is currently both:

1. A Page Standard route
2. A full custom integration operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Integrations should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `integrationsRoute`

## Non-goals

Do not change:

- route id
- data-page
- connector behavior
- connect/reconnect/test/sync/disconnect behavior
- Smart Connect fields
- drawer behavior
- data-integration-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- connectProjectIntegration
- reconnectProjectIntegration
- testProjectIntegration
- syncProjectIntegration
- disconnectProjectIntegration
- connector selection
- filters and search
- drawer close/escape behavior
- AI prompt navigation
- all data-integration-* attributes

## Recommended next patch

Integrations Authority Patch:

- add `disableStandardLayout: true` to `integrationsRoute`
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
