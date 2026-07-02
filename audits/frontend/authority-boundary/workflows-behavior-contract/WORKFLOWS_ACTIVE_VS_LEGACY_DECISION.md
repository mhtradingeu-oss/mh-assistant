# Workflows Active vs Legacy Decision Contract

## Current Status
- `public/control-center/pages/workflows.js` contains two behavior surfaces in one module.
- Active mounted surface: light route shell rendered by exported `workflowsRoute.render(...)` into `#workflowsRoot`.
- Legacy surface: execution-loop renderer, binder, bridge listener, manual run controls, automation controls, and Auto Mode controls are defined but not invoked by active route render.
- Therefore current production behavior is light route only; heavy runtime loop is dormant.

## Risk Statement
- Mixed active and dormant surfaces in one file create high parity drift risk during extraction.
- Hidden re-activation risk exists if legacy functions are accidentally wired during unrelated cleanup.
- Authority confusion risk exists if runtime Auto Mode gate approval is mistaken for backend governance approval.
- Handoff divergence risk exists when local cache handoff is used without durable backend persistence.

## Decision Options

### Option A: Keep light route active and archive legacy loop
- Description
  - Keep current mounted light route as operational surface.
  - Formally deprecate and archive dormant legacy execution-loop controls.
- Benefits
  - Lowest immediate behavioral risk.
  - Simplifies route lifecycle and avoids hidden runtime side effects.
- Risks
  - Legacy capabilities remain unavailable unless reintroduced elsewhere.
  - Requires careful archival plan to avoid losing reusable pure helpers.

### Option B: Re-activate heavy loop with lifecycle guardrails
- Description
  - Intentionally remount legacy execution-loop UI and handlers.
  - Add explicit lifecycle guardrails for bridge/listener/subscription management.
- Benefits
  - Restores full workflow runtime controls in one page.
- Risks
  - Highest regression risk: durable run/handoff behavior, Auto Mode flow, and route lifecycle coupling.
  - Requires strict shadow-compare and safety controls before rollout.

### Option C: Extract useful pure helpers and retire runtime controls
- Description
  - Keep light route active.
  - Extract pure helper logic from legacy path where safe.
  - Retire runtime control bindings from the route surface.
- Benefits
  - Balances maintainability and risk control.
  - Preserves reusable logic without reviving dormant runtime mutations.
- Risks
  - Requires precise boundary mapping to avoid partial behavioral drift.

### Option D: Move durable execution controls to backend-projected operating surface
- Description
  - Keep frontend focused on projection and explicit request initiation.
  - Relocate durable workflow execution control surfaces to backend-projected operations UI patterns.
- Benefits
  - Strongest alignment with backend authority doctrine.
  - Reduces frontend authority-adjacent mutation complexity.
- Risks
  - Larger product and UX change scope.
  - Requires phased migration and compatibility planning.

## Recommended Direction
- Recommended path: A now, then C, then evaluate D.
- Why this is safest
  - Current mounted truth is light route and should be preserved first.
  - Immediate re-activation (B) introduces avoidable high-risk lifecycle and authority regressions.
  - C allows low-risk simplification once behavior and parity are frozen.
  - D is strategically aligned but should follow after parity-safe stabilization.

## What Must Not Be Changed Yet
- Do not rewire route render to call legacy execution-loop functions until shadow-compare contract is approved.
- Do not start Auto Mode from render/mount or implicit route entry paths.
- Do not blur Auto Mode gate approval with backend governance approval routes.
- Do not convert local shared-context handoff cache into implied durable authority.
- Do not change backend durable workflow/handoff/approval route ownership.

## Decision Gate Prerequisites
- Behavior contract approved.
- Shadow-compare needs approved.
- QA and rollback contract approved.
- Explicit implementation decision recorded (A, B, C, or D) before any code change.