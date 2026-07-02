# MH-OS / MH Assistant Full System Audit
Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Mode: Read-only repository audit
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## Executive Summary
- Confirmed: The backend runtime is the real authority surface today. The project-scoped media-manager API in runtime/orchestrator-service/server.js is backed by a durable operations backbone in runtime/orchestrator-service/lib/ops/backbone.js that persists team model, governance policy, approvals, tasks, handoffs, workflow runs, AI artifacts, AI memory, notifications, events, and publishing queue state.
- Confirmed: Governance is materially enforced in the backend, not just displayed. Publishing mutations are blocked by assertPublishingMutationAllowed when freeze_publishing is active or approval_before_publish is not satisfied.
- Confirmed: The backend also owns security and operational controls: protected read/write key middleware, project slug validation, project-isolated path resolution, rate limiting on AI and Telegram routes, readiness checks, observability logging, and data-path feature flags.
- Confirmed: Intelligence, learning, and recommendations exist as modular backend services. They are built from persisted performance and execution signals, then exposed to the frontend through dedicated insights and learning payloads.
- Confirmed: The Control Center frontend is route-complete and syntactically healthy, but it is not yet a pure projection layer. It still duplicates route permissions, role catalogs, AI team definitions, specialist catalogs, handoff defaults, and some workflow/publishing orchestration behavior.
- Confirmed: Page-by-page frontend development should not start as if the system were fully settled. The system is close enough to begin controlled page work, but only after acknowledging that authority duplication, oversized page files, and shell-level listener density remain active risks.
- Confirmed: The working tree is not clean. Modified project data files exist under data/projects, so checkpoint cleanliness is not currently confirmed.

## Confirmed Completed Work
### Backend / Runtime
- Confirmed: Health and readiness routes exist and return structured state.
  - Evidence: /health, /healthz, /readyz in runtime/orchestrator-service/server.js.
- Confirmed: Protected write routes and protected read routes are centralized behind the same control key model.
  - Evidence: requireProtectedControlWriteKey and requireProtectedReadKey in runtime/orchestrator-service/server.js.
- Confirmed: Readiness checks include control key presence, data directory existence/writability, registry load, and integration secret requirements.
  - Evidence: buildReadinessState in runtime/orchestrator-service/server.js.
- Confirmed: Project-scoped operations APIs exist for operations, task center, queue center, job monitor, notification center, team model, campaigns, content items, media jobs, workflow runs, AI commands, AI artifacts, AI recommendations, AI memory, tasks, approvals, governance, notifications, handoffs, events, integrations, and publishing mutations.
  - Evidence: /media-manager/project/:project/... route family in runtime/orchestrator-service/server.js.
- Confirmed: Team model, role routes, service domains, escalation chains, status models, and canonical governance defaults live in the backend backbone.
  - Evidence: TEAM_ROLE_DEFS, ROUTE_ROLE_ACCESS, SERVICE_DOMAIN_DEFS, ESCALATION_CHAINS, STATUS_MODELS, DEFAULT_POLICY_RULES in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Governance summaries are computed from durable records, not hand-entered page state.
  - Evidence: buildGovernanceSummary derives approval queue, claim review, brand safety review, publish guardrails, policy violations, escalation queue, and audit timeline in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Approval creation and approval decision flows update linked entities, queues, notifications, tasks, overrides, and events.
  - Evidence: createApproval and decideApproval in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Handoffs are durable, statused, and evented.
  - Evidence: createHandoff and consumeHandoff in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Publishing jobs are synchronized into durable queue and notification state.
  - Evidence: syncPublishingJob in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Operations backbone can build full operational snapshots for the Control Center.
  - Evidence: buildOperationsSnapshot in runtime/orchestrator-service/lib/ops/backbone.js.
- Confirmed: Project path authority is isolated through a unified resolver with canonical/legacy feature flags.
  - Evidence: UnifiedDataPathResolver in runtime/orchestrator-service/lib/data/unified-data-path-resolver.js.

### Governance / Operations Backbone
- Confirmed: The AI team model exists in the backend as a durable team model with members, active role, route permissions, service model, and escalation chain.
- Confirmed: Governance policy defaults are restrictive in the right places.
  - approval_before_publish defaults to true.
  - high_risk_claim_review_required defaults to true.
  - brand_safety_review_required defaults to true.
  - freeze_publishing defaults to false unless explicitly enabled.
- Confirmed: Approval-before-publish is backend-protected, not just visually suggested.
- Confirmed: Claim review, brand safety review, publish guardrails, notifications, escalation tasks, and overrides all have durable backend representations.

### Intelligence / Learning / Recommendations
- Confirmed: Insights ingestion and learning are modularized under runtime/orchestrator-service/lib/insights and runtime/orchestrator-service/lib/execution.
- Confirmed: Learning and recommendation generation use persisted data such as sync history, snapshots, performance records, execution signals, learning stores, and recommendation stores.
- Confirmed: Intelligence writes can be dry-run controlled through environment flags, which reduces forced mutation risk in local runs.
- Confirmed: Smart suggestions are built outside the frontend render loop and exposed as backend-derived results.

### Frontend / Control Center
- Confirmed: The route surface covers Home, Setup, Library, Integrations, AI Command, Workflows, Campaign Studio, Content Studio, Media Studio, Publishing, Ads Manager, Insights, Research, Governance, Settings, and Operations Centers.
- Confirmed: app.js initializes the shell, state, router, access-key flow, route access resolver, command bar, overlays, AI dock, project loading, and page standard layout.
- Confirmed: authority-projection.js exists and explicitly states that it must remain projection-only.
- Confirmed: node --check passes for runtime/orchestrator-service/server.js, public/control-center/app.js, public/control-center/router.js, and public/control-center/pages/*.js.

## Partially Completed Work
### Backend / Runtime
- Confirmed: Publishing and execution runtime are functional, but still hybrid.
  - publish jobs can be scheduled, marked ready, published, or failed durably.
  - execution bridge often returns manual_publish_ready, pending_execution, or ready_for_review rather than fully autonomous external completion.
- Confirmed: Integrations runtime is broad, but provider coverage is not complete.
  - Unsupported providers are explicitly registered for amazon, smtp, mailer, and crm.
- Confirmed: Legacy and generic routes still coexist with the project-scoped API.
  - The current Control Center frontend does not reference old generic execution/product/scheduler endpoints.
  - Assumption: those routes may still be used by scripts or external callers; that is not confirmed from the Control Center code alone.

### Frontend / Control Center
- Confirmed: The frontend is partially aligned to projection-only architecture, but not fully.
  - authority-projection.js reads backend-projected operations state.
  - app.js and router.js still carry duplicated ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS fallback data.
- Confirmed: Pages consume durable backend data, but several pages also inject local authority-like defaults.
  - Campaign, content, media, research, settings, and AI Command pages all define local role/service/team structures.
- Confirmed: The shell has a page standard and AI affordances, but the final operating-surface contract is not universal.
  - Header exists.
  - Main content exists.
  - Action Panel and AI Panel are not consistent, persistent, and standardized on every page.
- Confirmed: System intelligence exists in the frontend, but mostly as heuristic projection and recommendation assembly from already-loaded state.

## Missing Work
- Confirmed: Full projection-only frontend authority is not finished.
- Confirmed: A universal page contract of Header + Main View + Action Panel + AI Panel is not complete.
- Confirmed: A universal AI Team layer is not complete.
- Confirmed: A universal Next Best Action model tied to durable backend projections is not complete.
- Confirmed: Persistent Project Brain / Memory visibility in the UI is not complete, even though backend AI memory endpoints exist.
- Confirmed: Handoff visualization exists in pieces, not as a first-class cross-page operating system surface.
- Confirmed: Live publishing to external platforms is not confirmed as end-to-end autonomous.
- Confirmed: Clean checkpoint state is not established because the working tree is dirty.

## Production Readiness Assessment
### Production-ready or near-production-ready backend surfaces
- Health/readiness routes.
- Protected key middleware for read/write routes.
- Project-isolated path resolution.
- Durable operations backbone storage.
- Governance defaults and governance summaries.
- Approval, task, handoff, event, notification, and queue persistence.
- Project-scoped CRUD-style control-center APIs.

### Partially wired or hybrid backend surfaces
- Publishing execution bridge.
- Email execution bridge.
- Media prompt generation runtime.
- Ads execution package generation.
- Recommendation and learning outputs, because their quality depends on real connected signal volume.
- Integrations coverage, because some providers are explicitly unsupported.

### Risky or legacy backend surfaces
- Old generic routes such as /task, /today, /next, /execute_publish_package, /execute_email_package, /generate_media_from_prompt, /build_ad_execution_package, /products, /schedule_execution_job, /scheduler_queue, /run_scheduler_worker_once, /record_execution_feedback, /get_performance_summary, /generate_optimization_recommendations, and /get_smart_suggestions still exist beside the newer project-scoped API.
- Confirmed: the current Control Center frontend does not reference those old routes.
- Assumption: they may still serve scripts, old clients, or operator workflows outside the current frontend.

## Frontend Stability and Safety Audit
### Confirmed findings
- app.js is a high-risk shell file because it combines route access fallback, protected fetch wrapping, access key UX, startup loading lifecycle, overlay/runtime control, delegated click handlers, mobile shell behavior, command bar behavior, AI dock behavior, and initialization.
- router.js duplicates route-role fallback data that also exists in app.js and the backend team model.
- system-intelligence.js builds recommendations from loaded state and is not itself a backend authority layer, but it does contain local heuristic decision logic.
- automation-engine.js includes an Auto Mode planner and action gating. It blocks destructive or approval-sensitive actions, but it still performs authority-adjacent orchestration in the frontend.
- The frontend has many global listeners and document/window bindings, especially in app.js and library.js.
- Several pages remain very large and regression-prone.
  - media-studio-workspace.js: 3181 lines
  - library.js: 2853 lines
  - content-studio-workspace.js: 2335 lines
  - workflows.js: 1991 lines
  - campaign-studio.js: 1980 lines

### Confirmed risk patterns
- Heavy shell logic outside a narrow page boundary.
- Repeated event binding patterns on route render.
- Local draft stores across multiple pages.
- Page-local role and specialist catalogs.
- Mixed dashboard and operating-system metaphors rather than one final pattern.

## UX / AI Operating System Audit
### What exists
- Smart shell framing with sidebar/topbar/page header.
- Route-complete operational workspace.
- Page standard helper.
- Command bar and AI dock shell affordances.
- Backend AI recommendations and AI memory endpoints.
- Home page AI team and executive overview concepts.
- Governance, task, queue, job, and notification payloads from backend operations snapshots.

### What is missing or inconsistent
- Smart Executive Header is not standardized across all pages.
- Sidebar structure exists, but not every destination behaves like an operating surface.
- Main View exists, but Action Panel and AI Panel are inconsistent or embedded ad hoc inside pages.
- Next Best Action exists as heuristic recommendation logic, but not yet as a consistent backend-projected operator lane.
- AI Team visibility exists on some pages but is still duplicated with page-local models.
- Contextual AI per page exists in fragments rather than as a stable shell contract.
- Project Brain / Memory is present in backend APIs, but not yet surfaced as a durable first-class UI lane.
- Handoffs and approvals are visible in places, but not consistently visualized as the core operating graph.
- Several pages still behave like dense dashboards or editors instead of a unified operating system surface.

## Authority Separation Audit
### OK as projection
- authority-projection.js reading team service model, governance, approvals, workflow runs, handoffs, AI recommendations, AI memory, route permissions, team members, service domains, and active role from operations state.
- Home, Insights, and Operations Centers largely rendering backend-projected payloads.

### Compatibility fallback
- app.js route access fallback to DEFAULT_ROUTE_ROLE_ACCESS when projected route permissions are absent.
- router.js default route-role map for access denied fallback.
- Local draft storage in Setup, Workflows, Publishing, Content Studio, Media Studio, Library, and AI Command.

### Risky duplicate authority
- app.js and router.js define ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS separately from backend backbone route permissions.
- ai-command.js defines MODE_DEFS and mode aliases locally.
- settings.js defines TEAM_ROLE_OPTIONS and TEAM_ROLE_MATRIX locally.
- campaign-studio.js defines CAMPAIGN_ROLE_DEFAULTS and route-role mappings locally.
- content-studio-workspace.js defines CONTENT_ROLE_DEFAULTS and page-local writing agents.
- media-studio-workspace.js defines MEDIA_ROLE_DEFAULTS, ownerRoleForMode behavior, and SPECIALISTS locally.
- research.js defines ACTION_ROUTES and RESEARCH_ROLE_DEFAULTS locally.
- workflows.js carries local workflow catalog and Auto Mode planning behavior in the frontend.

### Must migrate to backend authority
- Canonical route permissions.
- Canonical team role catalog and service-domain ownership.
- Canonical AI team/service definitions where they affect routing or workflow ownership.
- Canonical workflow handoff semantics.
- Canonical approval owner and reviewer defaults.

## Git / Checkpoint Audit
- Confirmed: Working tree is dirty.
  - data/projects/hairoticmen/brand-assets/brand-profile.json
  - data/projects/hairoticmen/project.json
  - data/projects/hairoticmen/sources-registry.json
  - data/projects/registry.json
- Confirmed: Recent commits are heavily focused on Library UX and runtime cleanup rather than a closed frontend consolidation endpoint.
- Confirmed: Existing audit markdown files were directionally useful but stale in some details, including file-size references and current git state.

## Evidence Table
| Area | Status | Repository Evidence | Assessment |
|---|---|---|---|
| Backend authority source | Confirmed | runtime/orchestrator-service/lib/ops/backbone.js | Backend remains the operational source of truth |
| Publish guardrails | Confirmed | runtime/orchestrator-service/server.js and backbone governance policy | Enforced in backend, not only displayed |
| AI team model | Confirmed | TEAM_ROLE_DEFS, service domains, route permissions in backbone | Backend owns canonical team model |
| Frontend projection helper | Confirmed | public/control-center/runtime/authority/authority-projection.js | Doctrine exists in code |
| Frontend duplication | Confirmed | app.js, router.js, ai-command.js, settings.js, campaign-studio.js, content-studio-workspace.js, media-studio-workspace.js, research.js | Projection-only boundary is not complete |
| Intelligence modularity | Confirmed | lib/insights/* and lib/execution/* | Intelligence is backend modular and data-driven |
| Live external publishing autonomy | Not confirmed | execution-job-bridge returns hybrid states | Semi-auto, not proven full autopublish |
| Integrations completeness | Partially confirmed | provider-registry includes unsupported providers | Broad but incomplete |
| Shell stability | Partially confirmed | app.js and library.js listener density | Usable but high regression risk |
| Checkpoint cleanliness | Confirmed not clean | git status --short | Working tree is dirty |

## Recommended Next Phases
1. Freeze the authority boundary first: treat backend team model, route permissions, governance, workflow ownership, approvals, and publishing rules as canonical and remove frontend fallback ownership over time.
2. Keep backend publishing, approval, and security middleware untouched while frontend work proceeds.
3. Start page-by-page frontend development only with the explicit operating-surface contract: Header + Main View + Action Panel + AI Panel.
4. Refactor the highest-risk oversized pages first, but do it page-by-page rather than as another global shell rewrite.
5. Preserve existing route IDs and backend endpoint contracts while pages are rebuilt.
6. Normalize AI Team, Next Best Action, approvals, handoffs, and memory visibility into backend-projected UI patterns before calling the frontend consolidation complete.

## Bottom Line
- Confirmed done: the backend authority platform, governance backbone, project-scoped operations APIs, modular intelligence layer, and a route-complete frontend shell.
- Not confirmed: fully autonomous live publishing, full provider coverage, clean checkpoint state, and fully projection-only frontend authority.
- Remaining before serious page development: authority cleanup, shell safety discipline, and a consistent operating-surface UX contract.
