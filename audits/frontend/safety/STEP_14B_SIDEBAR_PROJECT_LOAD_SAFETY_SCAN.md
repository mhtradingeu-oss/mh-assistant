# STEP 14B - Sidebar + Project Load Safety Scan

Date: 2026-05-13
Mode: Audit-only, documentation-only
Branch: architecture/frontend-consolidation-v1

## 1) Executive Summary

This scan reviewed Control Center shell stability for sidebar route wiring, project selection, startup/project-loading lifecycle, and startup API/backend fetch paths.

Result: stable enough to proceed to Step 15, with no blocking defects found in route wiring or startup load orchestration.

Key stability observations:
- Sidebar route buttons in the shell map cleanly to router registry routes.
- Project loading is tokenized and guarded against stale overlay/show-hide races.
- Startup includes watchdogs, manual unlock controls, and fatal recovery paths.
- Access-key handling and diagnostics are explicit for protected read/write paths.
- Required project payload path is centralized on the startup endpoint, with fallback and optional background loading behavior.

## 2) Files Inspected

- public/control-center/index.html
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/api.js
- public/control-center/state.js
- public/control-center/constants.js
- public/control-center/pages/home.js
- public/control-center/pages/setup.js
- public/control-center/pages/library.js
- public/control-center/pages/integrations.js
- public/control-center/pages/publishing.js
- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/ops/backbone.js

## 3) Sidebar Route Inventory

Shell route buttons found in index.html (data-route):
- home
- setup
- library
- integrations
- ai-command
- workflows
- publishing
- insights
- campaign-studio
- content-studio
- media-studio
- ads-manager
- research
- task-center
- queue-center
- job-monitor
- notification-center
- governance
- settings

Router wiring summary:
- router.js routeRegistry defines matching route IDs for all shell data-route values.
- navigateTo(route) updates template, active nav state, page header, route-change event, and hash.
- app.js delegated click routing also normalizes/fills missing route attributes and supports action-based route mapping.

Conclusion:
- Sidebar-to-router wiring is coherent and stable for listed routes.

## 4) Project Loading Flow Summary

Observed load chain:
1. init() bootstraps shell and route listeners.
2. loadProjects() calls fetchProjects() to populate project switcher.
3. pickSafeDefaultProject() selects a non-blocked default project.
4. loadProjectData(project) runs tokenized project load with startup diagnostics.
5. fetchProjectWithTimeout() wraps fetchAllCoreProjectData(project) with hard timeout and response/parse watchdogs.
6. validateRequiredProjectPayload() enforces required sections (overview/readiness/assets).
7. applyProjectPayload() patches state data and context; persists current project.
8. Global UI and current page render; optional payload work is deferred/non-blocking.

Stability controls found:
- Active load token prevents stale show/hide or stale payload application.
- Reuse of active promise for same project avoids duplicate concurrent loads.
- Required fallback path applies if project details are still syncing.
- Access-key startup recovery path is explicit and user-visible.

## 5) Startup / Loading Overlay Flow Summary

Startup and overlay controls observed:
- index.html includes loadingOverlay, startupStepBanner, startupUnlockBar, startupTracePanel, fatalErrorPanel.
- app.js showLoading()/hideLoading() enforce explicit-load + active-token checks.
- Global loading watchdog, response-text watchdog, and parse watchdog are implemented.
- Manual unlock path force-hides overlay and clears loading lock if startup stalls.
- Fatal startup errors route to fatal panel with retry/access-key recovery actions.

Assessment:
- Overlay lifecycle is guarded and instrumented; no obvious route-level deadlock path found in inspected flow.

## 6) Active Project / Selected Project State Summary

State model:
- state.context.currentProject is canonical active project in client state.
- state.data.projects stores available project list.
- state selectors expose selectCurrentProject() and related projections.

Selection safety in app.js:
- normalizeProjectSlug() sanitizes project values.
- getSafeProjectName() and blocked pattern checks prevent unsafe defaults.
- getStoredProjectName()/setStoredProjectName() maintain localStorage project continuity.
- bindProjectSwitcher() updates setCurrentProject() then calls loadProjectData().

Per-page usage sanity:
- home.js, setup.js, library.js, integrations.js, publishing.js all consume current project context/state and do not redefine global project authority.

## 7) API Calls Involved in Project Startup

Primary startup calls in api.js/app.js path:
- fetchProjects() -> GET /media-manager/projects
- fetchAllCoreProjectData(project) -> GET /media-manager/project/:project/startup

Inside fetchAllCoreProjectData:
- Required sections come from startup payload: overview, readiness, assets
- Optional/deferred calls include:
  - fetchProjectOperations(project) -> /media-manager/project/:project/operations
  - fetchProjectInsights(project) -> /api/insights/:project
  - fetchProjectLearning(project) -> /api/learning/:project
- Fallback verification may call fetchProjects() again when required payload timing issues occur.

## 8) Backend Endpoints Involved in Project Startup

Confirmed in runtime/orchestrator-service/server.js:
- GET /media-manager/projects
- GET /public/media-manager/projects
- GET /media-manager/project/:project/startup
- GET /public/media-manager/project/:project/startup
- GET /media-manager/project/:project
- GET /public/media-manager/project/:project
- GET /media-manager/project/:project/operations
- GET /public/media-manager/project/:project/operations

Startup payload composition:
- buildMediaManagerProjectStartupPayload(project) derives from buildMediaManagerProjectPayload(project)
- Startup payload intentionally returns lightweight tree/registry/activity/operations stubs plus required sections.

Backbone note:
- runtime/orchestrator-service/lib/ops/backbone.js provides durable project ops file scaffolding and policy defaults, but no direct startup route wiring.

## 9) Risks Found (If Any)

No blocking stability defects found.

Non-blocking risks to track:
- Pattern-based blocked project filtering may hide legitimately named projects if names contain test/sample-like substrings.
- Fallback to default project on load failures can mask target-project-specific startup issues for operators unless diagnostics are reviewed.
- Startup diagnostics are comprehensive but high-volume; operational teams should preserve trace visibility when debugging intermittent startup failures.

## 10) Safe To Continue To Step 15?

Yes.

Rationale:
- Sidebar route inventory and route registry alignment are stable.
- Project load orchestration includes token/race protection, watchdogs, and fallback handling.
- Startup overlay has explicit recovery paths.
- Required syntax validation checks passed for all requested files.

## 11) Files That Must NOT Be Touched Yet

Do not modify in Step 15 (unless a dedicated startup/shell hardening step is opened):
- public/control-center/index.html
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/api.js
- public/control-center/state.js
- public/control-center/constants.js
- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/ops/backbone.js

Also avoid behavior changes in inspected page modules during wording-only work:
- public/control-center/pages/home.js
- public/control-center/pages/setup.js
- public/control-center/pages/library.js
- public/control-center/pages/integrations.js
- public/control-center/pages/publishing.js

## 12) Validation Commands and Results

Commands run:
- git status --short
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- node --check public/control-center/api.js
- node --check public/control-center/state.js
- node --check public/control-center/constants.js
- node --check public/control-center/pages/home.js
- node --check public/control-center/pages/setup.js
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/publishing.js
- node --check runtime/orchestrator-service/server.js
- node --check runtime/orchestrator-service/lib/ops/backbone.js
- grep -RIn "data-route\|navigateTo\|activeProject\|selectedProject\|currentProject\|loadProject\|fetchProject\|startup\|loading overlay\|project timeout\|access key" public/control-center/index.html public/control-center/app.js public/control-center/router.js public/control-center/api.js public/control-center/state.js public/control-center/constants.js runtime/orchestrator-service/server.js | sed -n '1,260p'

Result summary:
- git status --short: clean output at time of validation run.
- Syntax checks: all requested files passed (exit 0).
- Grep command: completed successfully; results confirm route wiring, project selection/load, startup diagnostics, and access-key handling anchors across requested files.

## 13) Explicit No-Code-Change Statement

This was an audit-only and documentation-only step.

No production code was changed.
No frontend JS behavior was changed.
No CSS was changed.
No backend code was changed.
No data/projects files were changed.
No route behavior was changed.