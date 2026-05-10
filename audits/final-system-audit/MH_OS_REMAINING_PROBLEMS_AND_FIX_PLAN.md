# MH-OS Remaining Problems And Fix Plan
Date: 2026-05-10
Scope: Audit-only plan (no implementation in this document)

## P0 Problems
1. Frontend still duplicates authority-sensitive logic.
- Evidence: route-role defaults in public/control-center/router.js and public/control-center/app.js.
- Risk: backend/frontend permission drift, governance inconsistencies.

2. High-risk oversized frontend modules.
- Evidence: public/control-center/pages/media-studio-workspace.js (3181), public/control-center/pages/library.js (2658), public/control-center/pages/content-studio-workspace.js (2335), public/control-center/pages/workflows.js (1991), public/control-center/pages/publishing.js (1837).
- Risk: regressions during page-by-page redesign, hard-to-test runtime behavior.

3. Publish execution expectations can be misread as fully autonomous.
- Evidence: execution bridge returns manual_publish_ready / ready_for_review states; publish routes are guarded by approvals.
- Risk: product/ops may assume end-to-end autopublish where manual gating still exists.

4. Working tree is not clean (data files modified).
- Evidence: git status --short showed modified data/projects files.
- Risk: audit reproducibility and checkpoint hygiene.

## P1 Problems
1. Listener density and runtime coupling in app shell.
- Evidence: many document/window listeners including multiple hashchange contexts in public/control-center/app.js.
- Risk: interaction conflicts, overlay/dock/command race conditions.

2. Integrations support is broad but incomplete.
- Evidence: unsupported provider IDs in backend registry.
- Risk: setup appears ready while some channels remain non-operational.

3. AI team and role model duplication across frontend pages.
- Evidence: ai-command/settings/workflows/page-level role definitions and local matrices.
- Risk: canonical team model divergence from backend team projection.

4. Mixed local fallback storage with durable backend operations.
- Evidence: local drafts/handoffs in multiple pages (setup/workflows/publishing/content/media/library).
- Risk: inconsistent source of truth in edge/offline failure modes.

## P2 Improvements
1. Standardize all routes to a single operating-surface contract.
- Header + Main View + Action Panel + AI Panel.

2. Add explicit recommendation provenance UX.
- Show data source, timestamp, confidence, and ownership for each recommendation.

3. Add route-level test harnesses for listener lifecycle.
- Verify no duplicate global handlers after route switches.

4. Improve unsupported-provider UX in Integrations.
- Distinguish connected/unsupported/deferred with actionable guidance.

## Long-Term Improvements
1. Break server.js into domain routers/modules without changing route contracts.
2. Build backend-first typed contracts for operations payloads consumed by frontend.
3. Add durable audit replay snapshots per page to validate projection-only behavior.
4. Introduce contract tests for governance policy and publish guards.

## Exact Recommended Order
1. Freeze and enforce frontend projection-only authority policy.
2. Stabilize shell runtime/listener lifecycle and lock command/overlay/ai-dock ownership.
3. Refactor P0 pages first: Library -> Media Studio -> Publishing -> Workflows -> Governance -> Settings -> Operations Centers.
4. Refactor P1 pages next: AI Command -> Content Studio -> Campaign Studio -> Integrations -> Insights -> Research -> Setup -> Home -> Ads Manager.
5. After each page migration, run syntax checks and route smoke checks.

## What Not To Touch
1. Backend governance enforcement in publishing mutation gate.
- runtime/orchestrator-service/server.js assertPublishingMutationAllowed logic.

2. Protected read/write middleware behavior.
- runtime/orchestrator-service/server.js key middleware and timing-safe comparisons.

3. Backbone durable store contracts and status models.
- runtime/orchestrator-service/lib/ops/backbone.js entity schemas and policy normalization.

## What Must Be Protected
1. Doctrine: Backend owns operational authority; frontend projects operational authority.
2. Approval-before-publish and freeze-publishing safety rules.
3. Durable audit trail entities: approvals, tasks, handoffs, events, notifications.
4. Project isolation path protections and sanitized logging.
5. Existing route IDs and backend endpoint contracts during frontend redesign.
