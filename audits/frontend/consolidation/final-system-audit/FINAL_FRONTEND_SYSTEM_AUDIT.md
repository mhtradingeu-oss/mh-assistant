# FINAL FRONTEND SYSTEM AUDIT

Date: 2026-05-12
Repository: /opt/mh-assistant
Branch: architecture/frontend-consolidation-v1
Scope: Audit only. No production code changes.
Evidence source: audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt

## Executive Verdict
Frontend Consolidation Pass 1 produced real structural progress. The operations, governance, and settings closeout work is materially improved and largely stable at architecture level. However, the system is not fully complete: runtime authority projection is mixed with frontend fallback authority logic, Auto Mode remains concentrated in high-risk operating surfaces, and several large monolithic pages still carry high change risk.

This is a strong stabilization milestone, not end-state completion.

## 1) What Has Been Completed
- Route-level explicit layout authority has been applied broadly via disableStandardLayout: true across active pages.
- Operations surfaces now own their shell explicitly through ops-shell templates in task-center, queue-center, job-monitor, and notification-center.
- Governance owns its own surface through governance-shell.
- Settings is running as its own dedicated page surface with disableStandardLayout enabled.
- Recent Pass 1 fixes are visible in history and align with closeout intent:
  - e061a22 Clean Operations in-page loading states
  - 69d354f Clean Governance duplicate heading labels
  - 3b567ff Clean Settings duplicate heading labels
  - b09ce0f Fix operations center loading settlement
  - c73886b Add frontend consolidation QA report

## 2) What Is Truly Stable Now
- Operations/Governance/Settings shell separation is structurally correct.
- Operations async fetch lifecycle is now tied to session loading flags in fetch execution paths (set true before call, false in success/failure), not a render-only illusion.
- Standard Page Shell injection is no longer driving these operating surfaces.
- Backend durable authority endpoints for workflows, approvals, governance policy, and handoffs are present and wired.

## 3) What Is Partially Done (Not Complete)
- Frontend authority projection is partially aligned, but frontend still carries fallback route authority tables in both app.js and router.js.
- Auto Mode has guardrails but is still coupled to large pages (publishing/workflows) that also contain dense UI logic.
- Intelligence usage is not centralized to a thin runtime boundary; recommendation/intelligence computation can still be pulled from frontend pathways.
- Large page decomposition has not started; complexity remains concentrated.

## 4) What Is Still Risky
- High-complexity monolith pages (1.8k to 3.2k lines) increase regression probability and slow safe iteration.
- Auto Mode and automation planning are embedded in UI-heavy surfaces, increasing the chance of accidental lifecycle coupling.
- Authority compatibility debt remains due duplicated role/route fallback logic in frontend while backend also projects route_permissions.
- Global listeners exist in core app and selected pages, increasing cross-surface side effect risk.

## 5) What Should Be Fixed Next
- Audit and isolate runtime authority for Publishing first.
- Audit and isolate runtime authority for Workflows second.
- Audit AI Command operating-room behavior and handoff flow third.
- After authority boundaries are explicit, perform helper extraction on large pages (no redesign yet).

## 6) What Should Not Be Touched Yet
- Do not redesign large UX surfaces before runtime ownership mapping is complete.
- Do not rewrite backend authority systems; backend appears to be the strongest current source of durable authority.
- Do not remove compatibility shell utilities yet; keep as safety fallback until full ownership migration proof exists.

## 7) Correct Implementation Order From Here
1. Snapshot current behavior and retain evidence baseline.
2. Audit runtime authority for Publishing (source of truth, gates, approvals, handoffs).
3. Audit runtime authority for Workflows (automation plan generation, approval stops, handoff effects).
4. Audit AI Command as operating room and command dispatcher.
5. Extract helpers from largest pages without changing runtime behavior.
6. Define canonical operating surface UX standard after runtime authority is verified.
7. Implement changes in controlled migration slices with shadow compare and validation.

## 8) Clarifying Core Terms
- Code stability: Whether code runs predictably without regressions under current behavior.
- UX completion: Whether the interaction model is coherent, focused, and operator-effective for target outcomes.
- Runtime authority: Which layer is the source of truth for decisions, permissions, approvals, and state transitions.
- Operating surface maturity: How production-ready each page is as an operational console (clarity, safety, observability, handoff quality, change resilience).

A surface can be code-stable but still not UX-complete or authority-correct.

## 9) What Is Needed To Reach World-Class AI Business OS Frontend
- Strict authority projection discipline: backend decides, frontend projects.
- Canonical operating room pattern with safe command execution and explicit approval visibility.
- Cross-page handoff reliability with clear ownership transitions and role visibility.
- Runtime-isolated automation with explicit user-triggered starts and observable gates.
- Decomposition of large page monoliths into tested helpers/components while preserving behavior.
- UX system based on clear operator flow: context, decision, action, confirmation.

## 10) Final Plan After This Audit
- Treat current state as stabilized baseline, not finished product.
- Run focused authority audits first (Publishing, then Workflows, then AI Command).
- Use controlled migration pattern only:
  - snapshot
  - audit
  - isolate
  - helper extraction
  - shadow compare
  - switch source
  - validate
  - commit

---

## Required Audit Areas

### A) Git And Branch State
- Current branch: architecture/frontend-consolidation-v1
- Last 20 commits captured in evidence file.
- Git status shows dirty working tree due untracked audit folders:
  - audits/frontend/consolidation/final-system-audit/
  - audits/frontend/consolidation/pass-2-surface-ownership/
- No tracked production deltas were introduced by this audit.

### B) Frontend Route Ownership
- disableStandardLayout is enabled across active pages listed in evidence, including operations, governance, settings, workflows, publishing, ai-command, media/content/campaign/library/integrations/home/research/setup/insights/ads.
- Custom operating surfaces:
  - Operations pages: ops-shell
  - Governance: governance-shell
  - Settings: settings-page-surface
  - Several other pages use dedicated page roots (for example workflowsRoot, publishingRoot, ctrlRoomRoot).
- Standard Page Shell status:
  - Utility still exists in ui/page-standard.js.
  - In current route set, it appears mostly compatibility-only because pages are marked disableStandardLayout.
- Double wrap risk:
  - Low for current routes because app.js applies standard shell only when disableStandardLayout is false.
  - Residual future risk if a route forgets disableStandardLayout.
- Shell ownership clarity:
  - Clear for Operations and Governance.
  - Settings owns a dedicated surface but naming is not shell-standardized (settings-page-surface vs explicit settings-shell).

### C) Operations / Governance / Settings Closeout
- Operations structural correctness:
  - Route templates and shell ownership are clean.
  - Fetch lifecycle toggles loading state before/after async calls in queue/job/notification routes.
  - Task Center fetch path is direct and stable but does not use an explicit loading-state card pattern like the others.
- Governance structural correctness:
  - Session load/refresh lifecycle is explicit and stateful.
  - Governance shell ownership is clean.
- Settings structural correctness:
  - Durable settings load is explicit and guarded by loaded/loading flags.
  - Settings surface is custom and isolated from standard shell.
- Remaining follow-up:
  - Unify shell naming conventions and explicitly document Settings shell contract.
  - Keep monitoring for latent loading-state drift in Task Center path.

### D) Runtime / Auto Mode / Heavy Intelligence Risk
- Auto Mode import points:
  - publishing.js imports createAutoModeController, startAutoMode, subscribeAutoMode.
  - workflows.js imports createAutoModeController, startAutoMode, runAutomationPlan and related controls.
- Auto Mode initialization:
  - Explicit user actions trigger starts (buttons such as auto prepare/start).
  - Publishing calls ensurePublishingAutoModeBinding during render, but controller init is guarded by publishingAutomationEnabled and does not auto-start execution by itself.
- buildSystemIntelligence usage:
  - Used directly in automation-engine.js to build automation plans and flow plans.
  - Indirect intelligence reads also appear in pages (for example readiness blockers in publishing).
- Heavy intelligence in render/layout risk:
  - No evidence of heavy intelligence inside page-standard layout utility.
  - Some intelligence-derived calls can still occur from page render pathways, so runtime isolation is not complete.
- Before any redesign:
  - Must complete runtime authority and Auto Mode lifecycle audits for Publishing, Workflows, AI Command.

### E) Backend Authority / Frontend Projection Alignment
- Backend appears to own:
  - route_permissions and team_service_model projection
  - workflow runs
  - approvals creation/decision
  - governance policy
  - handoff creation/consumption
- Frontend still appears to own/duplicate:
  - fallback route authority matrices in app.js and router.js
  - local role fallback behavior when backend projection is absent
- Route permissions/team roles/approvals/workflow ownership:
  - Durable backend model exists and is rich.
  - Frontend consumes projected permissions but keeps compatibility fallback copies.
- Handoffs and AI commands:
  - Frontend uses shared-context caches and backend handoff APIs; this is projection-oriented but still contains client-side orchestration glue.
- Compatibility debt:
  - duplicated route access constants and fallback logic in frontend.
- Authority-like frontend logic still present:
  - route access fallback and local role persistence behavior.

### F) Large Page Risk Ranking
See FRONTEND_RISK_MATRIX.md for full table.

### G) UX / AI Business Operating System Maturity
- Closest to target vision:
  - Operations centers (task/queue/job/notification) as operating surfaces.
  - Governance as explicit decision/approval console.
- Mid maturity:
  - Settings (strong operational controls, but still mixed concern density).
  - Workflows (powerful but risk-heavy due automation/runtime coupling).
- Farthest from final vision:
  - Large studios (media/content/campaign/library) due size and mixed responsibilities.
  - Publishing and AI Command due critical runtime authority and automation impact.
- Redesign last:
  - Publishing, Workflows, AI Command, then media/content/library surfaces.
- Canonical patterns to keep:
  - Explicit shell ownership per route.
  - User-triggered automation with visible approval gates.
  - Backend-projected authority.
- Patterns to avoid:
  - hidden lifecycle starts
  - duplicated authority tables
  - monolithic page expansion
  - redesign before authority isolation

### H) Final Recommendation

#### What Is Done
- Layout authority migration is materially advanced.
- Operations/Governance/Settings closeout is structurally credible.
- Evidence and branch trail are consistent with claimed Pass 1 outcomes.

#### What Is Not Done
- Runtime authority boundary completion is not done.
- Auto Mode risk isolation is not done.
- Large page decomposition is not done.

#### What Is Stable
- Explicit route ownership and shell separation in key operational pages.
- Backend durable endpoints for authority workflows.

#### What Is Risky
- High-complexity monolith pages.
- Auto Mode concentration in high-impact pages.
- Frontend fallback authority duplication.

#### What To Fix First
1. Publishing runtime authority audit.
2. Workflows runtime authority audit.
3. AI Command operating-room audit.

#### What To Delay
1. Major UX redesign.
2. Backend rewrites.
3. Removal of compatibility shell utilities.

#### Final Implementation Sequence
1. Freeze baseline and preserve evidence.
2. Publishing authority audit and isolation.
3. Workflows authority audit and isolation.
4. AI Command authority audit and isolation.
5. Large-page helper extraction planning and execution.
6. UX operating surface standardization.
7. Controlled source switch with shadow compare and validation.
