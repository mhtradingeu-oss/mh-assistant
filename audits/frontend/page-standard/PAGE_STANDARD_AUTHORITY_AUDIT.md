# Page Standard Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit (no runtime JS, CSS, backend, or data changes)
Verification step: Frontend Verification Step V2

## 1. Executive Summary

This audit confirms that page-standard.js is an active runtime authority layer for a subset of routes and is applied after page-level render handlers in app.js. The current architecture is functional but carries two known risks that must be resolved in dedicated future passes:

- Layout authority overlap risk: pages can render local structures first, then be normalized by the standard layer.
- CSS ownership conflict risk: std-page-shell is defined in both 08-components-foundation.css and 14-page-standard.css, with the latter winning by load order.

This audit does not change runtime behavior. It documents authority boundaries and defers cleanup to explicit contracts.

## 2. How app.js Applies page-standard.js

Runtime flow in app.js is confirmed as:

1. Resolve route and call routeDef.render(...) when present.
2. If routeDef.disableStandardLayout is not set, call applyStandardPageLayout(...).
3. If no routeDef.render exists, call applyStandardPageLayout(...).

Evidence:

- public/control-center/app.js imports applyStandardPageLayout from ui/page-standard.js.
- renderCurrentPage() calls routeDef.render first, then conditionally applies standard layout.
- applyStandardPageLayout is also called as fallback when no custom render exists.

Authority implication:

- Page-level route renderers can create local DOM first.
- Standard layout layer then wraps/normalizes eligible routes.
- This is an active two-step composition model, not a pure single-owner render model.

## 3. REQUIRED_ROUTES Inventory

From public/control-center/ui/page-standard.js, REQUIRED_ROUTES is:

- home
- setup
- library
- integrations
- ai-command
- workflows
- campaign-studio
- content-studio
- media-studio
- publishing
- ads-manager
- insights
- research
- settings

These are the routes that page-standard.js may normalize through applyStandardPageLayout(...).

## 4. Routes Excluded By Not Being In REQUIRED_ROUTES

Route registry includes the following active routes in public/control-center/router.js:

- home
- ai-command
- workflows
- task-center
- queue-center
- job-monitor
- notification-center
- campaign-studio
- content-studio
- media-studio
- publishing
- ads-manager
- insights
- research
- setup
- library
- integrations
- settings
- governance

Routes present in router.js but excluded from REQUIRED_ROUTES:

- task-center
- queue-center
- job-monitor
- notification-center
- governance

Classification:

- Included in standard layer: 14 routes
- Excluded from standard layer: 5 routes
- Total registered routes audited: 19

## 5. Routes Using disableStandardLayout (If Any)

Result: no explicit disableStandardLayout usage was found in the audited route files.

- Search across public/control-center/pages/**/*.js found no disableStandardLayout property.
- app.js still supports disableStandardLayout as a route-level opt-out mechanism.

Interpretation:

- Exclusion is currently controlled primarily by REQUIRED_ROUTES membership in page-standard.js.
- The disableStandardLayout gate exists but is not currently used by audited route modules.

## 6. Pages At Risk Of Double Layout/Header/Context

Pages at highest overlap risk are REQUIRED_ROUTES that still maintain strong local wrapper/context patterns while also being eligible for post-render standardization.

Risk categories:

- High concern: settings (standard-eligible plus known local shell/workspace structure).
- Medium concern: any REQUIRED_ROUTES page whose local render includes header/context constructs similar to std-context-ribbon or std-shell concepts.
- Lower concern: excluded routes (task-center, queue-center, job-monitor, notification-center, governance), because page-standard.js does not currently target them.

Current evidence-backed risk note:

- The documented architecture explicitly states render-first, standardize-second behavior, which can produce duplicate context/header semantics if local and standard layers overlap.

## 7. Governance Status

Governance remains local and intentionally outside REQUIRED_ROUTES.

Confirmed in public/control-center/pages/governance.js:

- 0. Review Model
- 1. Governance Overview
- 2. Policy / Rule Summary
- 3. Approval / Decision Queue
- 4. Selected Decision Details
- 5. Governance Actions
- 6. Governance AI Assistant

Status:

- Governance is still using its dedicated local section model.
- No governance refactor is performed in this audit.
- Governance requires a separate Governance UX Contract before structural redesign.

## 8. Settings Status

Settings is currently in REQUIRED_ROUTES and also uses local layout constructs.

Confirmed in public/control-center/pages/settings.js:

- settings-shell
- settings-workspace
- Settings Overview
- Control Actions
- Settings AI Assistant
- Settings Summary

Status:

- Settings has page-standard eligibility and local shell/workspace semantics at the same time.
- This is the clearest currently documented overlap candidate and should be governed by a dedicated Settings UX Contract before cleanup.

## 9. CSS Conflict Around std-page-shell

Conflicting ownership is confirmed:

- public/control-center/styles/08-components-foundation.css defines .std-page-shell as grid.
- public/control-center/styles/14-page-standard.css defines .std-page-shell as flex column.

Load order in public/control-center/index.html places 14-page-standard.css after 08-components-foundation.css, so 14-page-standard.css wins in cascade.

Risk:

- Ambiguous ownership of std-page-shell.
- Future edits in 08 may appear ineffective due to downstream override.
- Potential regression risk if load order changes without explicit ownership contract.

## 10. Loading/Initial Render Risk

The runtime flow creates a known initial render risk:

- routeDef.render executes first.
- applyStandardPageLayout executes after render on eligible routes.

Risk outcome:

- Possible visual shift between initial local render and post-standard normalization.
- Potential event/focus interaction complexity if DOM is normalized while users are interacting.

Mitigation already present:

- page-standard.js includes a form-interaction guard to avoid re-normalizing while active form interaction is detected within the route node.

Residual risk:

- Guard reduces risk but does not eliminate all layout-shift scenarios.

## 11. Legacy Folder Status

Legacy status for this audit step:

- Legacy folder is present in tree: public/control-center/legacy.
- Based on the referenced forensic scan findings and canonical map draft, legacy is not directly runtime-loaded in current audited runtime paths.
- Any legacy archive/delete action must be a separate future step with dedicated validation and approval.

## 12. What Must Not Be Changed Yet

This audit confirms the following boundaries remain in effect:

- Do not modify runtime JS behavior (including route behavior).
- Do not modify CSS in this verification step.
- Do not modify backend.
- Do not modify data/projects.
- Do not delete legacy files/folders in this step.
- Do not refactor Governance runtime in this step.
- Do not refactor Settings runtime in this step.
- Do not commit forensic snapshot artifacts.

## 13. Recommended Next Step

Recommended sequence before runtime/CSS cleanup:

1. CSS Ownership Contract
- Assign single canonical owner for std-page-shell and related std-* layout primitives.
- Record cascade and load-order intent explicitly.

2. Governance UX Contract
- Lock governance page-local zone model and migration/defer rules.
- Define if and when governance should remain excluded from REQUIRED_ROUTES.

3. Settings UX Contract
- Define boundary between settings-shell/settings-workspace and page-standard responsibilities.
- Resolve overlap policy before any settings visual/runtime consolidation.

## 14. No-Change Confirmation

This artifact is documentation-only.

Confirmed for this step:

- No runtime JS files modified.
- No CSS files modified.
- No backend files modified.
- No data/projects files modified.
- No route behavior changes performed.
- No legacy files deleted.
- No governance/settings refactor performed.
- No forensic snapshot files committed in this audit file creation step.
