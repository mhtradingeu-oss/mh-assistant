# Workflows Runtime Ownership Audit

## Scope
- Branch: architecture/frontend-consolidation-v1
- Baseline: c4dee6f, 736b0e9, 02dde34
- Mode: audit only (no production code changes)
- Primary page audited: public/control-center/pages/workflows.js
- Related runtime surfaces: public/control-center/automation-engine.js, public/control-center/shared-context.js, public/control-center/api.js, runtime/orchestrator-service/server.js, runtime/orchestrator-service/lib/ops/backbone.js

## Doctrine Alignment Check
- Backend authority doctrine is explicit in public/control-center/runtime/authority/authority-projection.js:7-18.
- Route fallback authority projection exists in public/control-center/runtime/authority/route-role-fallback.js.
- Workflows contains authority-adjacent execution helpers and Auto Mode controls, but durable authority remains in backend workflow/handoff/approval routes and backbone persistence.

## 1) What Workflows Owns Today

### Display-only state
- Overview cards, counts, readiness/status display in current exported route render: public/control-center/pages/workflows.js:1782-1913.
- Legacy execution-loop renderer output sections (overview/recommendation/automation/catalog/result): public/control-center/pages/workflows.js:615-920.

### Local session/UI state
- In-memory sessions by project via workflowSessions map: public/control-center/pages/workflows.js:106, 309-356.
- Local draft persistence key and helpers: public/control-center/pages/workflows.js:104, 250-306.
- UI-only automation banners/progress/cursor state: public/control-center/pages/workflows.js:111-116.

### Workflow plan generation
- Workflow builder prompt generation and fallback output packaging: public/control-center/pages/workflows.js:500-538.
- Recommendation-to-workflow mapping: public/control-center/pages/workflows.js:543-612.
- Automation plan generation delegated to automation-engine buildAutomationPlan/getAutoFixPlan: public/control-center/pages/workflows.js:14-27, 1622, 1651.

### Auto Mode state
- Module-level toggles/subscription refs in workflows page: public/control-center/pages/workflows.js:108-110.
- Engine-owned state machine in sessionStorage and module runtime: public/control-center/automation-engine.js:4, 30-34, 62-90, 125-142, 607-739.

### Approval/gate state
- Auto Mode gate state is runtime-local (approvalRequiredStep) in automation engine: public/control-center/automation-engine.js:71, 535-541, 675-731.
- Approve/skip gate handlers in workflows page call engine gate APIs with local context: public/control-center/pages/workflows.js:1724-1736.

### Handoff state
- Shared-context in-memory handoff cache is read/write frontend cache: public/control-center/shared-context.js:3, 69-76.
- Workflows writes handoffs locally and may persist to backend when createProjectHandoff is available: public/control-center/pages/workflows.js:1076-1093, 1291-1304, 1390-1399.

### Backend-projected workflow state
- Session run state is refreshed from operations.workflows.items (backend projection): public/control-center/pages/workflows.js:367-391.
- Current route also projects operations totals/readiness only: public/control-center/pages/workflows.js:1766-1777, 1815-1913.

### Durable workflow actions
- runProjectWorkflow / runProjectAiWorkflow -> backend durable run routes: public/control-center/api.js:1477-1507.
- createProjectHandoff / consumeProjectHandoff -> backend durable handoff routes: public/control-center/api.js:2162-2188.
- Backend records workflow runs durably: runtime/orchestrator-service/server.js:11096-11134.
- Backend records handoffs durably: runtime/orchestrator-service/server.js:11523-11554 and runtime/orchestrator-service/lib/ops/backbone.js:2958-3130.

### Local-only UX actions
- Current exported route actions are prompt prep, AI draft seed, and navigation: public/control-center/pages/workflows.js:1917-1989.
- Shared-context-only handoff/draft writes are local cache until explicit durable handoff call occurs: public/control-center/shared-context.js:52-76.

### High-risk execution actions
- Durable AI workflow execution route: runtime/orchestrator-service/server.js:11188-11286.
- Durable workflow run recording route: runtime/orchestrator-service/server.js:11096-11134.
- Durable handoff create/consume routes: runtime/orchestrator-service/server.js:11523-11554.
- Backend approval decision routes (governance boundary): runtime/orchestrator-service/server.js:11371-11409.

## 2) Where Workflow Runtime Actions Are Defined

### Action definitions found in workflows page
- start Auto Mode: public/control-center/pages/workflows.js:1681-1696
- pause Auto Mode: public/control-center/pages/workflows.js:1700-1704
- resume Auto Mode: public/control-center/pages/workflows.js:1708-1712
- stop Auto Mode: public/control-center/pages/workflows.js:1716-1720
- approve gate: public/control-center/pages/workflows.js:1724-1728
- skip step: public/control-center/pages/workflows.js:1732-1736
- run automation plan (full): public/control-center/pages/workflows.js:1619-1643
- run single automation step: public/control-center/pages/workflows.js:1648-1676
- create handoff (workflow->ai-command): public/control-center/pages/workflows.js:1076-1093
- navigate to target route: public/control-center/pages/workflows.js:1097, 1579, 1615, 1984, 1989

### Engine definitions
- createAutoModeController/start/pause/resume/stop/approve/skip/subscribe: public/control-center/automation-engine.js:589-739
- runAutomationPlan: public/control-center/automation-engine.js:473-520

### Important active-vs-defined nuance
- The above runtime controls are defined in workflows.js, but current exported route render does not call bindWorkflowExecutionLoop/registerWorkflowBridge/renderWorkflowExecutionLoop.
- Current exported route is the light builder shell path: public/control-center/pages/workflows.js:1741-1991.
- Therefore many workflow runtime buttons/data attributes are presently defined in code but not mounted in the active route template.

## 3) Auto Mode Lifecycle Findings

- createAutoModeController import in workflows: public/control-center/pages/workflows.js:16.
- createAutoModeController use sites in workflows: public/control-center/pages/workflows.js:1215, 1686.
- subscribeAutoMode use sites in workflows: public/control-center/pages/workflows.js:1217, 1688.
- startAutoMode call site in workflows: public/control-center/pages/workflows.js:1692.
- runAutomationPlan call sites in workflows: public/control-center/pages/workflows.js:1634, 1663.
- Auto Mode starts from explicit user click handler (workflowAutoStartBtn), not from mount: public/control-center/pages/workflows.js:1683-1696.
- Controller/subscription binding also appears inside bindWorkflowExecutionLoop preamble if workflowAutomationEnabled is already true: public/control-center/pages/workflows.js:1214-1218.
- Guard flags exist: workflowAutomationEnabled and workflowAutoModeUnsubscribe replacement logic: public/control-center/pages/workflows.js:110, 1214-1217, 1685-1688.
- Unsubscribe cleanup exists as replacement before new subscribe, but no explicit route unmount teardown in workflows file.
- Repeated route-visit leak risk:
  - In current active route path, Auto Mode controls are not mounted, so leak risk is latent.
  - In legacy execution-loop path, module-level flags/subscription refs can persist across route revisits; duplicate subscription is partially guarded by unsubscribe replacement and bridge registration flag (workflowBridgeRegistered), but not fully lifecycle-scoped.

## 4) Backend Authority Alignment

### Actions that call backend
- Workflow run creation:
  - Frontend call: runProjectWorkflow/runProjectAiWorkflow in workflows handlers (public/control-center/pages/workflows.js:1166-1177, 1364-1377)
  - API routes: public/control-center/api.js:1477-1507
  - Server handlers: runtime/orchestrator-service/server.js:11096-11134, 11188-11286
- Durable handoff create/consume:
  - Frontend calls: public/control-center/pages/workflows.js:1091-1093, 956-957
  - API routes: public/control-center/api.js:2162-2188
  - Server handlers: runtime/orchestrator-service/server.js:11523-11554

### Frontend-only actions
- Prompt preparation + quick command input seed + navigateTo in current route: public/control-center/pages/workflows.js:1917-1989.
- Shared-context handoff/draft cache writes without guaranteed backend persistence: public/control-center/pages/workflows.js:1291-1304, 1390-1399, 1566-1578, 1602-1614; public/control-center/shared-context.js:52-76.
- Auto Mode gate controls are engine-local state transitions/navigation, not backend approvals: public/control-center/automation-engine.js:675-731.

### Durable handoff/workflow run status
- Durable workflow runs: recorded via recordWorkflowRun in server/backbone path: runtime/orchestrator-service/server.js:11096-11134 and runtime/orchestrator-service/lib/ops/backbone.js:2042-2142.
- Durable handoffs: create/consume in backbone collections and events: runtime/orchestrator-service/lib/ops/backbone.js:2958-3130.

### Alignment conclusion
- Durable truth remains backend-owned.
- Workflows frontend mixes projection/local UX with optional durable writes.
- Any action that mutates workflow run, handoff, or approval semantics should stay backend-authoritative.

## 5) Approval/Gate Boundary

- Auto Mode gate approval in workflows/automation-engine is frontend runtime gating, not backend durable approval:
  - approveCurrentGate/skipCurrentStep operate on autoModeState and optional navigation only: public/control-center/automation-engine.js:675-731.
- No direct backend approval decision call is made by workflow Auto Mode gate actions.
- Backend has separate durable approvals APIs and storage:
  - server routes: runtime/orchestrator-service/server.js:11371-11409
  - backbone approvals persistence/decision: runtime/orchestrator-service/lib/ops/backbone.js:2557-2919
- runAutomationPlan enforces safe-action constraints via type whitelist and block patterns:
  - safe types: public/control-center/automation-engine.js:6-14
  - block patterns: public/control-center/automation-engine.js:16-26
  - safety checks: public/control-center/automation-engine.js:192-214, 473-520
- Therefore: Auto Mode gate approval != governance approval. It is an execution-flow pause/continue gate in frontend, not a durable policy decision.

## 6) Handoff Boundary

### Where handoffs are created
- In automation engine run steps (create_draft/create_handoff/prepare_workflow/prepare_publishing_draft): public/control-center/automation-engine.js:360-469.
- In workflows push-to-AI and local seed actions: public/control-center/pages/workflows.js:1076-1093, 1291-1304, 1390-1399, 1566-1578, 1602-1614.

### Durable vs cache
- Shared-context handoffs are cache-level (in-memory map): public/control-center/shared-context.js:3, 69-76.
- Durable handoffs require createProjectHandoff/consumeProjectHandoff APIs -> backend backbone handoffs store.

### Workflow steps and handoff targets
- To AI Command: pushWorkflowToAiCommand path in workflows page.
- To Publishing/Content/Media/Library/Workflows: automation-engine targetPage in create_handoff/create_draft/prepare_* steps.
- To Campaign route (local navigation): current route button navigation and route hints (campaign-studio) in catalog metadata.

### Orphan risk
- Cached handoffs can be superseded/lost if not durably persisted.
- Optional persistence pattern (allowPersistent flags and catch-ignore) can leave partial local-only transfer.

### Authority-adjacent handoff actions
- Any handoff that implies ownership transfer, next role, or route transition should be treated authority-adjacent even if initiated from frontend.

## 7) Loading/Session Lifecycle

- Session state initialization and cache keyed by project: public/control-center/pages/workflows.js:309-356.
- Intelligence loading lifecycle with loadingPromise, status/error, and rerender: public/control-center/pages/workflows.js:962-1029.
- Render-triggered runtime work:
  - Current exported route render builds a light UI and binds local button handlers only.
  - Legacy execution-loop path can trigger ensureWorkflowIntelligenceLoaded and runtime calls when handlers run.
- Rebind/listener behavior:
  - registerWorkflowBridge uses global workflowBridgeRegistered guard with window listener: public/control-center/pages/workflows.js:1107-1197.
  - No explicit removeEventListener teardown in workflows file.
- Cleanup:
  - Auto Mode subscribe replacement calls prior unsubscribe if present, but no explicit route unmount cleanup.

## 8) Authority Risk Classification (Summary)

- Safe projection:
  - Operations/readiness/workflow totals rendering and catalog/readiness derivations.
- Safe local UX:
  - Local draft save/clear, quick prompt prep, local navigation, client-side validation.
- Authority-adjacent:
  - Handoff payload shaping, role-like ownership metadata in task payload, auto gate decisions.
- Duplicate authority risk:
  - Frontend cache handoff state can diverge from durable backend handoff records.
  - Legacy runtime paths exist in code but may not match currently mounted UI behavior.
- High-risk execution:
  - Durable workflow run creation and AI workflow execution endpoints.
- Needs backend confirmation:
  - Any workflow run persistence, handoff durability, approval/governance decisions.
- Needs explicit user action:
  - Auto Mode start/pause/resume/stop/approve/skip and manual run operations in legacy runtime path.
- Should not be changed yet:
  - Legacy runtime control surfaces until behavior contract and shadow-compare plan are documented.

## 9) Compare Workflows With Publishing

### Shared Auto Mode risks
- Both rely on module-level Auto Mode state/subscriptions and process-lifetime flags.
- Both use explicit button-trigger starts, but lifecycle teardown/unsubscribe is not strictly route-unmount managed.

### Durable backend authority differences
- Publishing active UI directly mounts durable mutation controls (schedule/approve/publish/fail) and backend governance gates are central.
- Workflows current exported route is primarily local prep/navigation; heavy durable runtime actions exist mostly in legacy, not currently mounted path.

### Local-only state differences
- Publishing local-only branches can mark statuses for local drafts and are tightly coupled to queue semantics.
- Workflows local state centers on drafts/prompts/handoffs and run session visualization.

### Handoff model differences
- Publishing handoff usage is focused on loading/pushing operational publish context.
- Workflows handoff usage is broader cross-page orchestration (workflows <-> ai-command plus automation-engine-generated destination handoffs).

### Which should refactor first and why
- Publishing should remain first for pure-helper extraction (already audited + has shadow-compare plan and direct durable mutation risk).
- Workflows should first complete behavior contract and shadow-compare planning because active route and legacy runtime path are split, increasing hidden parity risk.

## 10) Recommended Next Step

Recommended option: B. Create workflows behavior contract.

Why this is safest:
- Audit found two behavior surfaces in one file: a currently mounted light route and a legacy heavy runtime loop with Auto Mode controls.
- Before any extraction or lifecycle registry work, expected behavior must be frozen in a contract to avoid accidentally activating/deactivating paths.
- This aligns with doctrine: Audit -> Confirm -> Decide -> Implement, and with non-extraction-before-contract/shadow-compare constraints.

## Risk Summary
- Primary risk: mixed active vs dormant runtime surfaces in workflows.js can cause accidental behavior drift during future refactor.
- Secondary risk: frontend Auto Mode gates can be mistaken for governance approvals; they are not durable backend approvals.
- Tertiary risk: optional/non-mandatory durable handoff persistence can create local cache vs backend truth divergence.