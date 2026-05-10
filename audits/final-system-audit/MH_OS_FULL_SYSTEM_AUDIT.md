# MH-OS / MH Assistant Full System Audit
Date: 2026-05-10
Branch: architecture/frontend-consolidation-v1
Audit mode: Read-only, evidence-based, no production code changes

## Executive Summary
- [CONFIRMED] Backend runtime is the strongest authority layer today: durable ops backbone, governance policy store, approvals/handoffs/tasks/events, AI command orchestration, and route-level publish guards are implemented in backend runtime.
- [CONFIRMED] Frontend has broad projection coverage through API routes and operations payloads, but still contains duplicated authority-like defaults and local fallbacks (especially role permissions, AI team definitions, and local draft/handoff persistence).
- [CONFIRMED] Publishing execution is currently hybrid/semi-auto: scheduling/status/approval gates are durable; external final delivery is still partly manual bridge state for multiple flows.
- [CONFIRMED] Intelligence and recommendations are modularized and backend-generated, but mixed with heuristic/fallback logic and incomplete provider connectivity for some integrations.
- [CONFIRMED] Frontend shell is operational and route-complete, but final AI Operating Surface vision is not complete (Action Panel and AI Panel are not consistent, page standardization is partial, and some pages are too large).
- [CONFIRMED] Working tree is dirty (project data files), so repo is not fully clean for checkpoint lock.

## Confirmed Completed Work
### Backend / Runtime
- [CONFIRMED] Health and readiness routes exist: /health, /healthz, /readyz.
  - Evidence: runtime/orchestrator-service/server.js:9120, runtime/orchestrator-service/server.js:9128, runtime/orchestrator-service/server.js:9136
- [CONFIRMED] Protected write/read key middleware is centralized and active for media-manager and sensitive reads.
  - Evidence: runtime/orchestrator-service/server.js:163-340
- [CONFIRMED] Durable operations backbone exists with persistent entities and limits (campaigns, content items, media jobs, workflow runs, AI commands/artifacts/recommendations/memory, tasks, approvals, notifications, queue, handoffs, events, team).
  - Evidence: runtime/orchestrator-service/lib/ops/backbone.js:17-121, runtime/orchestrator-service/lib/ops/backbone.js:857-1040
- [CONFIRMED] Governance policy defaults and normalization enforce safe defaults (approval_before_publish true, freeze_publishing false unless set).
  - Evidence: runtime/orchestrator-service/lib/ops/backbone.js:17-27, runtime/orchestrator-service/lib/ops/backbone.js:1159-1240
- [CONFIRMED] Team model, route permissions, service domains, escalation chains exist as backend durable model.
  - Evidence: runtime/orchestrator-service/lib/ops/backbone.js:107-248, runtime/orchestrator-service/lib/ops/backbone.js:386-433
- [CONFIRMED] AI orchestration routes and durable records are wired (/ai/command, /ai/workflows/:id/run, artifacts, recommendations, memory).
  - Evidence: runtime/orchestrator-service/server.js:11218-11231, runtime/orchestrator-service/server.js:11120-11210
- [CONFIRMED] Operations centers payloads exist (task-center, queue-center, job-monitor, notification-center).
  - Evidence: runtime/orchestrator-service/server.js:10752-10759, runtime/orchestrator-service/lib/ops/backbone.js:3395-3674
- [CONFIRMED] Publish mutation governance gate exists and blocks when policy requires.
  - Evidence: runtime/orchestrator-service/server.js:13553-13625

### Frontend / Control Center
- [CONFIRMED] Route registry includes required major pages and operations-center subroutes.
  - Evidence: public/control-center/router.js:1-79
- [CONFIRMED] Router now exposes route change subscription hook.
  - Evidence: public/control-center/router.js:83-99, public/control-center/router.js:258-271
- [CONFIRMED] Parse-level integrity is valid for server/app/router/pages (node --check passed).
- [CONFIRMED] App shell, sidebar, topbar, command bar, loading overlay, and route rendering lifecycle are implemented.
  - Evidence: public/control-center/index.html:1-260, public/control-center/app.js:2050-2160, public/control-center/app.js:3120-4200
- [CONFIRMED] Standard page layout layer exists and applies to core routes.
  - Evidence: public/control-center/ui/page-standard.js:1-118, public/control-center/ui/page-standard.js:501-700

## Partially Completed Work
- [CONFIRMED] Authority projection helper exists and is clearly labeled projection-only.
  - Evidence: public/control-center/runtime/authority/authority-projection.js:1-24
- [CONFIRMED] Frontend still carries duplicated route-role defaults in router/app fallback logic.
  - Evidence: public/control-center/router.js:24-58, public/control-center/app.js:67-96
- [CONFIRMED] Integrations runtime is broad but some provider IDs are explicitly unsupported (amazon, smtp, mailer, crm).
  - Evidence: runtime/orchestrator-service/lib/integrations/provider-registry.js:10-18
- [CONFIRMED] Media generation/provider layer supports OpenAI pathways but explicitly reports provider_not_configured when keys are absent.
  - Evidence: runtime/orchestrator-service/lib/media/provider-layer.js:3, runtime/orchestrator-service/lib/media/provider-layer.js:58-106
- [CONFIRMED] Execution bridge returns manual/ready states instead of fully autonomous push for some channels.
  - Evidence: runtime/orchestrator-service/lib/execution/execution-job-bridge.js:20-65, runtime/orchestrator-service/server.js:9241-9416
- [CONFIRMED] Frontend page standard gives context ribbon + smart strip, but not full persistent 4-panel operating surface (Header + Main + Action Panel + AI Panel) on every route.
  - Evidence: public/control-center/ui/page-standard.js:377-463, public/control-center/ui/page-standard.js:501-700

## Missing Work (Before Full Page-by-Page Frontend Build)
- [CONFIRMED] No single clean separation yet where frontend is projection-only everywhere.
- [CONFIRMED] No unified persistent Action Panel + AI Panel across all routes.
- [CONFIRMED] No complete retirement of frontend-local authority artifacts (local team definitions, local route permissions fallback, local draft/handoff authority-like behavior).
- [CONFIRMED] Some critical modules remain large and high-regression risk:
  - runtime/orchestrator-service/server.js (21,596 lines)
  - public/control-center/app.js (4,175 lines)
  - runtime/orchestrator-service/lib/ops/backbone.js (4,089 lines)
  - public/control-center/pages/media-studio-workspace.js (3,181 lines)
  - public/control-center/pages/library.js (2,658 lines)

## Risks
- [P0][CONFIRMED] Dirty working tree includes live project data files (risk to audit reproducibility).
  - Evidence: git status --short showed modified data/projects/*.json files.
- [P0][CONFIRMED] Frontend authority duplication can drift from backend governance/permissions.
  - Evidence: public/control-center/router.js:24-58 and public/control-center/app.js:67-96 vs backend model in runtime/orchestrator-service/lib/ops/backbone.js:179-187, 403-406
- [P0][CONFIRMED] Global listener density in app shell increases conflict risk.
  - Evidence: public/control-center/app.js includes many document/window listeners including duplicated hashchange handlers around 3154 and 3765.
- [P1][CONFIRMED] Publishing pipeline still mixes manual and automated semantics; execution readiness may be overstated if interpreted as fully autonomous.
  - Evidence: runtime/orchestrator-service/server.js:9241-9416, runtime/orchestrator-service/lib/execution/execution-job-bridge.js:20-65
- [P1][CONFIRMED] Integrations have unsupported providers and partial auth/credential paths.
  - Evidence: runtime/orchestrator-service/lib/integrations/provider-registry.js:10-18
- [P2][ASSUMPTION] Existing audit docs may contain older conclusions; this audit did not re-validate every historical markdown artifact line-by-line against current HEAD.

## Evidence Table
| Area | Status | Evidence |
|---|---|---|
| Backend authority model | Confirmed | runtime/orchestrator-service/lib/ops/backbone.js:107-248, 1214-1360, 2555-2860, 2931-3120 |
| Publish guardrails | Confirmed | runtime/orchestrator-service/server.js:11757-12023, 13553-13625 |
| AI command/runtime endpoints | Confirmed | runtime/orchestrator-service/server.js:11218-11231, 11120-11210 |
| Health/readiness | Confirmed | runtime/orchestrator-service/server.js:9120-9136 |
| Integrations breadth + unsupported set | Confirmed | runtime/orchestrator-service/lib/integrations/provider-registry.js:1-49 |
| Intelligence/recommendations modular | Confirmed | runtime/orchestrator-service/lib/insights/learning-engine.js:1-260, runtime/orchestrator-service/lib/execution/recommendation-runtime.js:1-100 |
| Execution bridge semi-auto states | Confirmed | runtime/orchestrator-service/lib/execution/execution-job-bridge.js:20-65 |
| Frontend route surface complete | Confirmed | public/control-center/router.js:1-79 |
| Frontend authority duplication remains | Confirmed | public/control-center/router.js:24-58, public/control-center/app.js:67-96 |
| Standardized shell exists, not full final OS surface | Confirmed | public/control-center/index.html:95-260, public/control-center/ui/page-standard.js:377-463 |
| Working tree cleanliness | Not clean | git status --short (modified data/projects files) |

## Recommended Next Phases
1. Freeze authority boundary (projection-only frontend policy) and remove duplicated permission/team defaults from frontend fallback paths.
2. Establish universal operating layout contract per page: Header + Main View + Action Panel + AI Panel.
3. Split high-risk large pages (Library, Media Studio, Publishing, Workflows) into feature modules before UX rebuild.
4. Keep publishing/approval guardrails untouched while refactoring UI; preserve backend enforcement as source of truth.
5. Create page-by-page implementation tracks using the companion plan docs in this folder.
