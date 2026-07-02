# Frontend API Connectivity Audit

## Frontend API client authority
Primary API client:
- public/control-center/api.js

Pattern summary:
- Most project operations target /media-manager/project/:project/*
- Insights/learning and media generation use /api/* endpoints
- Read/write headers include control key handling and diagnostics
- Request timeout + parse timeout guards are implemented

## Backend endpoint alignment check
Cross-check against runtime/orchestrator-service/server.js route markers shows frontend endpoint families are present:
- /media-manager/projects
- /media-manager/project/:project/startup
- /media-manager/project/:project/operations
- /media-manager/project/:project/task-center|queue-center|job-monitor|notification-center
- /media-manager/project/:project/governance*
- /media-manager/project/:project/team
- /media-manager/project/:project/workflows and /ai/workflows
- /media-manager/project/:project/handoffs
- /media-manager/project/:project/publishing/*
- /api/insights/:project
- /api/learning/:project
- /api/media/*

## Pages and backend connectivity
Direct API imports by page modules:
- setup.js
- settings.js
- library.js
- media-studio-workspace.js
- governance.js
- content-studio-workspace.js

Context-injected API usage (from app render context) used by additional pages:
- workflows.js
- publishing.js
- research.js
- insights.js
- operations-centers.js
- campaign-studio.js
- ai-command.js

Lower-direct-connect pages:
- home.js (mainly consumes already-loaded state)
- ads-manager.js (largely local planner/state projection)

## Local fallback/mock behavior
Fallback and compatibility behavior present:
- fetchProjects returns fallback empty list on failure.
- fetchAllCoreProjectData supports optional section fallbacks and deferred optional loading.
- Media Studio and handoff flows support local handoff persistence when backend save is unavailable.

## Loading/error settlement
Evidence of settlement controls:
- Request timeout and parse-time watchdogs in api.js.
- App-level startup and global loading watchdog in app.js.
- Per-page isLoading and error messaging patterns in operations/publishing/workflows/research.

## Write and destructive operation posture
Write operations are user-triggered through UI actions in page handlers (save, connect, run, approve, publish, mark notification, etc.).
Destructive-sensitive operations include:
- deleteProjectAsset
- disconnectProjectIntegration
- publishing fail/publish transitions
- governance/team policy updates

Control key middleware integration exists in frontend headers and backend route set includes write aliases under /public/media-manager/* for compatibility.

## Prefix consistency findings
- Mixed endpoint families are intentional but increase boundary complexity:
  - /media-manager/* for operational/project data
  - /api/* for insights/learning/media-generation services
- Public aliases exist backend-side; frontend mostly calls non-/public paths.

## Risk and boundary notes
- API ownership is mostly centralized in api.js (good).
- Page-level direct calls plus context calls are mixed; this can blur ownership unless a strict API boundary map is maintained.
- Active project name flow is generally consistent (state.context.currentProject), with defensive checks in API functions.
