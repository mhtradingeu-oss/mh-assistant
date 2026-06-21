# T73 — Dead / Duplicate Frontend Files Audit

## Status
Audit-only. No files deleted.

## Scope
Audit frontend page JS files under:

- `public/control-center/pages`

## Summary
- Total page JS files: 35
- Candidate unused files: 1
- String-only referenced files: 2
- Possible duplicate groups: 0

## Active / Imported / Candidate Classification
| File | Status | Imported By | Route ID | Exports |
|---|---|---:|---|---|
| `public/control-center/pages/ads-manager.js` | active-routed | 1 | meta | adsManagerRoute |
| `public/control-center/pages/ai-command.js` | active-routed | 1 | strategist | aiCommandRoute |
| `public/control-center/pages/campaign-studio.js` | active-routed | 1 | campaign-studio | campaignStudioRoute |
| `public/control-center/pages/content-studio-workspace.js` | active-routed | 1 | content-strategist | contentStudioRoute |
| `public/control-center/pages/customer-center.js` | active-routed | 1 | customer-center | customerCenterRoute |
| `public/control-center/pages/governance.js` | active-routed | 1 | governance | governanceRoute |
| `public/control-center/pages/home.js` | active-routed | 1 | strategist | homeRoute |
| `public/control-center/pages/insights.js` | active-routed | 1 | facebook | insightsRoute |
| `public/control-center/pages/integrations.js` | active-routed | 1 | website-commerce | integrationsRoute |
| `public/control-center/pages/library.js` | active-routed | 1 | library | libraryRoute |
| `public/control-center/pages/media-studio-workspace.js` | active-routed | 1 | visual-director | mediaStudioRoute |
| `public/control-center/pages/operations-centers.js` | active-routed | 1 | task-center | taskCenterRoute, queueCenterRoute, jobMonitorRoute, notificationCenterRoute, operationsCentersRoute |
| `public/control-center/pages/publishing.js` | active-routed | 1 | publishing | publishingRoute |
| `public/control-center/pages/research.js` | active-routed | 1 | research | researchRoute |
| `public/control-center/pages/settings.js` | active-routed | 1 | strategist | settingsRoute |
| `public/control-center/pages/setup.js` | active-routed | 1 | business-basics | setupRoute |
| `public/control-center/pages/workflows.js` | active-routed | 1 | launch-campaign | workflowsRoute |
| `public/control-center/pages/ai-command/tool-dock.js` | imported-module | 1 | rewrite | TOOL_DOCK_BY_SPECIALIST |
| `public/control-center/pages/home/render-sections.js` | imported-module | 1 | - | - |
| `public/control-center/pages/integrations/builders.js` | imported-module | 1 | sales-channels | CONNECTOR_WORKSPACE_CATEGORIES, REQUIRED_LAUNCH_CATEGORY_IDS |
| `public/control-center/pages/integrations/cards.js` | imported-module | 2 | - | - |
| `public/control-center/pages/integrations/diagnostics.js` | imported-module | 1 | - | - |
| `public/control-center/pages/integrations/drawer.js` | imported-module | 2 | - | - |
| `public/control-center/pages/integrations/render.js` | imported-module | 1 | - | - |
| `public/control-center/pages/integrations/utils.js` | imported-module | 5 | - | - |
| `public/control-center/pages/library/action-panel.js` | imported-module | 1 | - | - |
| `public/control-center/pages/library/ai-panel.js` | imported-module | 1 | - | - |
| `public/control-center/pages/library/command-router.js` | imported-module | 1 | - | - |
| `public/control-center/pages/library/listener-lifecycle.js` | imported-module | 1 | - | - |
| `public/control-center/pages/library/projection-adapter.js` | imported-module | 1 | - | - |
| `public/control-center/pages/library/session-store.js` | imported-module | 1 | - | - |
| `public/control-center/pages/publishing/publishing-payloads.js` | imported-module | 1 | - | - |
| `public/control-center/pages/integrations/layout.js` | referenced-by-string-only | 0 | - | - |
| `public/control-center/pages/integrations/state.js` | referenced-by-string-only | 0 | - | - |
| `public/control-center/pages/library/catalog-readiness.js` | candidate-unused | 0 | - | - |

## Candidate Unused Files
- `public/control-center/pages/library/catalog-readiness.js`

## String-only Referenced Files
- `public/control-center/pages/integrations/layout.js`
- `public/control-center/pages/integrations/state.js`

## Possible Duplicate Groups
- none

## Decision Rule
Do not delete from this audit alone.

A file can be removed only after:
1. It is not imported by router/app/other modules.
2. It is not required by dynamic import or runtime lookup.
3. No route id depends on it.
4. A targeted removal patch is reviewed.
5. Syntax checks pass.
6. Browser QA confirms the route still works.
