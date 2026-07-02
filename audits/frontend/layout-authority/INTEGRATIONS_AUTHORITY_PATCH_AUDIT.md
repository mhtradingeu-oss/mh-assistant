# Integrations Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Integrations route authority only

## Summary

Integrations is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `integrationsRoute`.

## Why

Integrations owns a complete connector operating workspace:

- integrationsRoot
- integration-system-workspace
- integration-system-workspace-main
- integration-system-workspace-side
- connector filters
- Smart Connect drawer
- provider diagnostics
- connector actions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/integrations.js
- audits/frontend/layout-authority/INTEGRATIONS_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: integrations
- data-page="integrations"
- integrationsRoot
- integration-system-workspace
- connectProjectIntegration
- reconnectProjectIntegration
- testProjectIntegration
- syncProjectIntegration
- disconnectProjectIntegration
- connector filters/search
- data-integration-* attributes
- AI prompt navigation

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
