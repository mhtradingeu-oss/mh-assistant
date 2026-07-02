# MH-OS / MH Assistant Remaining Problems And Fix Plan
Date: 2026-05-11
Mode: Audit-only planning document
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## P0 Problems
1. Frontend still duplicates authority-sensitive logic.
Evidence:
- app.js and router.js both define ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS.
- settings.js defines TEAM_ROLE_OPTIONS and TEAM_ROLE_MATRIX.
- ai-command.js defines MODE_DEFS.
- campaign-studio.js, content-studio-workspace.js, media-studio-workspace.js, and research.js define local role/service defaults.
Why this is P0:
- This directly conflicts with the doctrine and can cause backend/frontend drift in permissions, ownership, routing, or team semantics.

2. Several core pages are oversized and high-regression.
Evidence:
- media-studio-workspace.js: 3181 lines.
- library.js: 2853 lines.
- content-studio-workspace.js: 2335 lines.
- workflows.js: 1991 lines.
- campaign-studio.js: 1980 lines.
Why this is P0:
- Page-by-page frontend development will be slower and less safe until these pages are treated as controlled decomposition targets rather than casual feature surfaces.

3. Publishing remains hybrid rather than fully autonomous.
Evidence:
- execution-job-bridge returns manual_publish_ready, pending_execution, and ready_for_review states.
- publishing mutations are backend-guarded by approval_before_publish and freeze_publishing checks.
Why this is P0:
- The product must not be described or redesigned as a fully automated live publishing platform when backend code still preserves manual gates and review states.

4. Shell-level listener density is high.
Evidence:
- app.js contains many window/document listeners for route changes, overlay handling, click delegation, resizing, shell state, command bar, AI dock, fatal errors, and diagnostics.
- library.js also binds global document/window listeners.
Why this is P0:
- Page-by-page UI work can easily create overlay, dock, or command-bar conflicts if listener ownership is not disciplined first.

5. Working tree is dirty.
Evidence:
- Modified files under data/projects and data/projects/registry.json from git status --short.
Why this is P0:
- Audit reproducibility and checkpoint trust are reduced until dirty project data is acknowledged and intentionally handled.

## P1 Problems
1. Integrations are broad but incomplete.
Evidence:
- provider-registry explicitly marks amazon, smtp, mailer, and crm unsupported.
Why this is P1:
- Not a blocker for frontend page work, but it affects how complete the operating system can appear.

2. AI team experience is fragmented across pages.
Evidence:
- Home, AI Command, Content Studio, Media Studio, Research, and Settings each frame team or specialists differently.
Why this is P1:
- Users will see inconsistent mental models of the team unless one canonical projection is adopted.

3. The final operating-surface layout is inconsistent.
Evidence:
- Page standard exists, but Action Panel and AI Panel are not universal or persistent across pages.
Why this is P1:
- UX consolidation cannot be called complete while page structure varies so much.

4. Local draft persistence is spread across many pages.
Evidence:
- Setup, AI Command, Workflows, Library, Content Studio, Media Studio, and Publishing all persist local state.
Why this is P1:
- Useful as fallback, but it can blur the durable source of truth and complicate recovery semantics.

## P2 Improvements
1. Standardize recommendation provenance UX.
- Show backend source, generated_at, confidence, and linked owner for each important recommendation.

2. Improve memory visibility.
- Surface backend AI memory as a first-class operating feature rather than a mostly hidden API capability.

3. Improve handoff graph visibility.
- Show source page, destination page, destination role, status, and linked entity consistently.

4. Improve unsupported-provider UX.
- Present unsupported, deferred, connected, and failing providers clearly rather than as one blended connector list.

## Long-Term Improvements
1. Break runtime/orchestrator-service/server.js into domain routers without changing public route contracts.
2. Break runtime/orchestrator-service/lib/ops/backbone.js into smaller domain modules while preserving storage and status model contracts.
3. Replace page-local authority maps with backend-projected typed contracts.
4. Add route-level regression coverage for listener lifecycle, overlay conflict prevention, and authority-boundary preservation.

## Exact Recommended Order
1. Protect the authority boundary first.
What this means:
- Treat backend team model, route permissions, governance policy, approval owners, workflow ownership, and publishing guardrails as canonical.
- Do not let page work redefine them.

2. Protect the shell next.
What this means:
- Do not add new global listeners casually.
- Keep command bar, AI dock, overlays, startup error handling, and route change behavior stable while pages are rebuilt.

3. Develop pages in this order.
- Library
- Media Studio
- Publishing
- Workflows
- Governance
- Settings
- Operations Centers
- AI Command
- Content Studio
- Campaign Studio
- Integrations
- Insights
- Research
- Setup
- Home
- Ads Manager

4. After each page, re-check the same rules.
- No frontend-owned authority.
- No heavy runtime work in render.
- No shell conflicts.
- No publish/governance bypass.

## What Not To Touch
1. Backend publishing guardrails.
- Do not weaken assertPublishingMutationAllowed.

2. Protected key middleware.
- Do not weaken read/write key requirements, timing-safe comparisons, or protected route coverage.

3. Project isolation and path resolution.
- Do not relax project slug validation or isolated path resolution.

4. Durable backbone schemas and status models.
- Do not casually rename or redefine canonical entity states in the backend without a deliberate migration plan.

## What Must Be Protected
1. Doctrine: Backend owns operational authority. Frontend projects operational authority.
2. Approval-before-publish and freeze-publishing enforcement.
3. Durable approvals, tasks, handoffs, notifications, queue items, workflow runs, AI artifacts, AI recommendations, AI memory, and events.
4. Current route IDs and backend endpoint contracts during frontend redesign.
5. The distinction between hybrid/semi-auto execution and real external live execution.

## Implementation Discipline For Future Work
1. Do not start by rewriting the shell again.
2. Do not start by removing backend guardrails to simplify UI work.
3. Do not turn page-local AI catalogs into new sources of truth.
4. Do not treat dirty project data as a stable checkpoint.
5. Do not call the system finished until Action Panel, AI Panel, AI Team, Next Best Action, approvals, and handoffs all operate as backend-projected UI patterns.
