# PHASE 7B — Legacy Dashboard / AI Bridge Decision Lock

## Status
PASS — DECISION SCAN COMPLETE

## Mode
Scan only.

No production code change.
No backend edit.
No frontend edit.
No route change.
No delete.
No CSS change.
No feature implementation.

## Verified

- Candidate file metadata was captured.
- Import/load/reference scan was captured.
- Candidate source context was captured.
- Active canonical counterparts were captured.
- Stale endpoint filter check was captured.
- Validation completed with no visible error output.
- Phase 7B created only audit evidence files.

## Candidates

### public/control-center/pages/business/dashboard.js
Findings:
- contains stale calls to:
  - /api/governance/state
  - /api/ai-control/dashboard
  - /api/governance/audit
  - /api/governance/process
- auto-runs initBusinessUI if loaded
- no active router/import load path found

Classification:
- inactive legacy/dev dashboard
- risky if loaded directly

### public/control-center/pages/governance/dashboard.js
Findings:
- contains stale calls to:
  - /api/governance/state
  - /api/governance/audit
  - /api/governance/process
- auto-runs initGovernanceDashboard if loaded
- active Governance route is public/control-center/pages/governance.js
- no active router/import load path found

Classification:
- inactive legacy/dev dashboard
- risky if loaded directly

### public/control-center/runtime/ai-backend-connector.js
Findings:
- defines window.__AI_BACKEND_BRIDGE__
- calls missing /ai/execute
- no direct load from index.html found
- active AI Command route uses canonical api.js helpers and project-scoped backend routes

Classification:
- inactive/skeleton runtime bridge
- risky if loaded directly

## Active Canonical Counterparts

Governance:
- public/control-center/pages/governance.js
- fetchProjectGovernance
- createProjectApproval
- decideProjectApproval
- updateProjectGovernancePolicy

AI Command:
- public/control-center/pages/ai-command.js
- executeProjectAiCommand
- executeProjectAiChat
- executeProjectAiGuidance

Backend AI:
- /media-manager/project/:project/ai/command
- /media-manager/project/:project/ai/chat
- /media-manager/project/:project/ai/guidance

## Decision

Do not delete files.
Do not add backend bridge routes.
Do not move files in this phase.
Do not refactor active pages.

Recommended next patch:
PHASE 7B.1 — Neutralize inactive legacy dashboard and AI bridge files.

Purpose:
- remove stale missing endpoint calls from public/control-center inactive files
- prevent accidental auto-run
- preserve file existence
- preserve safe diagnostic behavior
