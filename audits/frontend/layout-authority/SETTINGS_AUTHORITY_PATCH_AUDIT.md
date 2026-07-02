# Settings Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Settings route authority only

## Summary

The Layout Authority Decision Matrix classifies Settings as a Custom Surface Model route.

Settings already owns a dedicated page surface:

- settings-page-surface
- settings actions
- durable settings form behavior
- settings AI assistant
- settings summary

To prevent double layout authority, Settings is now excluded from Page Standard wrapping by adding:

- `disableStandardLayout: true`

to `settingsRoute`.

## Why

Before this patch, Settings was still inside Page Standard REQUIRED_ROUTES and was rendered by its own page renderer first, then wrapped/standardized by `applyStandardPageLayout`.

That created a possible second layout authority and visual shift during opening/loading.

## Files changed

- public/control-center/pages/settings.js
- audits/frontend/layout-authority/SETTINGS_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: settings
- template data-page="settings"
- settings-page-surface
- data-settings-action
- data-settings-open-ai
- data-settings-ai-prompt
- data-setting-path
- loadDurableSettings
- fetchProjectTeam
- fetchProjectGovernancePolicy
- saveProjectTeam
- AI navigation to ai-command
- durable settings save/sync behavior

## No-change confirmation

No backend changed.
No API changed.
No data/projects changed.
No CSS changed.
No page-standard.js changed.
No index.html changed.
