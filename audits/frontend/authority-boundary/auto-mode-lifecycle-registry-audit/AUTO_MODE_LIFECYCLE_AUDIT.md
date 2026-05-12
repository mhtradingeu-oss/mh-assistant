# Auto Mode Lifecycle Audit

## Scope
- Branch: architecture/frontend-consolidation-v1
- Baseline: a8f3f3a, fdf81ef, c4dee6f, 736b0e9
- Mode: audit only
- Surfaces: `automation-engine.js`, `pages/publishing.js`, `pages/workflows.js`, route lifecycle in `app.js` and `router.js`

## Doctrine Check
- Backend remains durable operational authority.
- Frontend Auto Mode is runtime projection/control.
- Start is explicit user action at current active surfaces.
- Gate approve/skip is runtime flow control, not backend governance approval.

## 1) Ownership and State Map

### Engine-owned state
- Module-level runtime state: `autoModeState` in `public/control-center/automation-engine.js`.
- Runtime context/token: `autoModeRuntime = { context, runToken }`.
- Listener registry: `autoModeListeners` set.

### Persisted state
- Session persistence key: `mh-auto-mode-state-v1` in `window.sessionStorage`.
- Reload behavior: persisted `running` or `waiting_approval` is normalized to paused/off with warning log at read time.

### Controller state
- `createAutoModeController(...)` sets engine runtime context and exposes control API.
- Controller identity is engine-global; no per-route isolated controller store.

### Page-level state
- Publishing page state:
  - `publishingAutomationState` progress/result
  - `publishingAutomationEnabled`
  - `publishingAutoModeControllerReady`
  - `publishingAutoModeUnsubscribe`
- Workflows page state:
  - `workflowAutomationState` progress/result/cursor/lastPlan/lastResults
  - `workflowAutomationEnabled`
  - `workflowAutoModeUnsubscribe`
  - `workflowBridgeRegistered` (legacy loop bridge)

### Gate state
- Engine gate state: `autoModeState.status === "waiting_approval"` with `approvalRequiredStep` payload.

## 2) Controller Creation Map

### Publishing
- Creation location: `ensurePublishingAutoModeBinding(...)` in `public/control-center/pages/publishing.js`.
- Trigger: render/bind path when `publishingAutomationEnabled === true`.
- Guard: `publishingAutoModeControllerReady`.
- Type: render-time conditional creation.
- Duplicate risk: guarded one-time creation for page lifecycle; no explicit teardown reset.

### Workflows active route
- Current active light route does not mount legacy Auto Mode controls.
- No active-route controller creation observed in mounted light render path.

### Workflows legacy loop (dormant)
- Creation locations:
  - bind preamble path when `workflowAutomationEnabled` true
  - auto-start click handler
- Triggers: bind/render-time conditional and explicit click-time.
- Guards: `workflowAutomationEnabled`, plus unsubscribe replacement pattern.
- Duplicate risk: controller can be recreated; engine context is overwritten, not isolated.

### automation-engine internals
- `createAutoModeController(...)` has no external hard guard; repeated calls replace runtime context.
- Module-load creates initial `autoModeState` from persisted state.

## 3) Subscription and Cleanup Map

### subscribeAutoMode locations
- Engine defines `subscribeAutoMode(listener)` returning unsubscribe function.
- Publishing subscribes in `ensurePublishingAutoModeBinding(...)`.
- Workflows legacy loop subscribes in bind preamble and auto-start click path.

### Unsubscribe handling
- Publishing: stores unsubscribe in `publishingAutoModeUnsubscribe`; no explicit invocation found in route teardown.
- Workflows legacy: calls existing unsubscribe before replacing listener in both bind preamble and auto-start path.

### Route unmount cleanup support vs usage
- App orchestration supports route cleanup via route render return function (`activeRouteCleanup`, `disposeActiveRouteCleanup(...)`).
- Publishing and Workflows route render functions currently do not return cleanup handlers.
- Result: route-level cleanup channel exists but is not used by these pages for Auto Mode subscriptions/bridge listener state.

### Leak/callback risk
- Publishing: medium stale callback risk (`publishingRenderCallback`, scheduled timer, long-lived subscription).
- Workflows legacy: medium to high latent risk if reactivated (module-level flags/subscription refs and bridge listener persist process-wide).

## 4) Where Auto Mode Can Start

### startAutoMode call sites
- Publishing: Auto Prepare button click handler.
- Workflows legacy: Auto Start button click handler.
- No start call found in mounted Workflows light route handlers.

### Trigger classification
- Publishing: explicit click.
- Workflows legacy: explicit click.
- Render/mount start risk: not observed as direct start call.

### Bridge/event startup risk
- Workflows bridge (`mh:submit-workflow`) can trigger workflow execution path (run APIs) in legacy route flow, but not `startAutoMode` directly.
- Risk is latent because bridge is currently dormant with legacy loop not mounted/invoked.

### Hidden startup risk
- Session persistence does not auto-resume running state after reload; state is downgraded to paused/off.
- Hidden start-from-reload risk is low.

## 5) Where Auto Mode Runs Actions

### Engine execution surfaces
- `runAutomationPlan(plan, options)` executes safe steps sequentially.
- Auto loop execution (`runAutoModeLoop`) handles gated/wait/continue semantics.
- `runAutomationStep` step types:
  - `navigate`
  - `generate_prompt`
  - `save_local_draft`
  - `create_draft`
  - `prepare_workflow`
  - `prepare_publishing_draft`
  - `create_handoff`

### Shared-context writes from Auto Mode
- `setSharedAiDraft(...)` for prompt generation.
- `setSharedHandoff(...)` for draft/workflow/publishing/handoff steps.

### Durable writes from Auto Mode paths
- Some step handlers call optional `createProjectHandoff(...)` when context provides it.
- This is backend durable handoff mutation, not governance approval mutation.

### Gated publish intent
- `publish_now`-like intent is blocked/gated by safety/gate logic (not auto-executed as durable publish).

## 6) Gate Semantics

### Gate creation
- Gate set when `gateForStep(step).required` in auto loop.
- Engine writes `approvalRequiredStep` and status `waiting_approval`.

### approveCurrentGate
- Preconditions: waiting gate present.
- Behavior: logs approval, may navigate to target route, advances step index, resumes loop or completes.
- Does not call backend approvals API.

### skipCurrentStep
- Preconditions: waiting gate present.
- Behavior: skips indexed step, resumes loop or completes.
- Does not call backend approvals API.

### Governance distinction
- Auto gate approve/skip is frontend runtime flow-control only.
- Backend governance approval remains server-side approvals endpoints and durable backbone records.

## 7) Lifecycle Risk Classification

- Publishing subscription lifecycle: medium
  - Guarded single subscribe, but no explicit unmount cleanup use.
- Workflows active route: safe/low
  - Active light route does not mount Auto Mode controls.
- Workflows legacy loop: high (latent)
  - Dormant now; when active, mixed bind/click subscription wiring plus bridge/listener persistence risk.
- automation-engine global state: medium
  - Intentional module-global design; cross-surface context replacement possible.
- sessionStorage persistence: safe/low to medium
  - Non-auto-resume on reload is safer; stale paused metadata still persists.
- bridge listener: medium to high (latent)
  - Global window listener with no explicit remove path in workflow page.
- repeated route navigation: medium
  - Cleanup framework exists in app, but not used by these route pages for Auto Mode resources.
- stale callback risk: medium
  - Publishing render callback/timer and long-lived subscription can outlive intended route visit lifecycle.
- duplicate toast/progress risk: medium
  - Possible if stale subscribers survive and continue rerender scheduling.

## 8) Publishing vs Workflows Comparison

- Publishing
  - Active Auto Mode controls mounted.
  - Controller/subscription established from bind/render path after user enables automation.
  - Durable publish operations are backend-authoritative and separately guarded.

- Workflows
  - Active route is light shell without Auto Mode controls.
  - Heavy Auto Mode/run loop exists in dormant legacy path.
  - Legacy path includes additional global bridge listener risk if reactivated.

## 9) Conclusion
- Current behavior aligns with explicit-click start doctrine on active surfaces.
- Primary lifecycle gap is missing explicit route-teardown ownership for Auto Mode subscriptions/listeners despite available app cleanup framework.
- Safest next step is contract/documentation-level lifecycle registry before any helper/module refactor.