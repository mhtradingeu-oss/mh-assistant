# Auto Mode Lifecycle Registry Contract

## Status
Documentation-only contract.

## Branch
architecture/frontend-consolidation-v1

## Baseline
590e465 Add auto mode lifecycle registry audit

## Purpose
This contract defines lifecycle ownership for Auto Mode-capable frontend surfaces before any implementation changes.

## Doctrine
- Backend owns durable operational authority.
- Frontend projects operational authority.
- Auto Mode must start only from explicit user action.
- Auto Mode must not start from route render, mount, reload, or hidden bridge behavior.
- Auto Mode gate approve/skip is frontend runtime flow control only.
- Auto Mode gate approve/skip is not backend governance approval.
- Any subscription/listener must have a documented cleanup owner before implementation.

## Registry

| route_id | surface_id | active_status | owner_file | controller_key | subscription_key | create_trigger | start_trigger | stop_trigger | cleanup_trigger | teardown_expected | durable_action_allowed | gate_semantics | risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| publishing | publishing-auto-prepare | active | public/control-center/pages/publishing.js | publishingAutoModeControllerReady | publishingAutoModeUnsubscribe | bind/render after explicit automation enabled | explicit Auto Prepare click | explicit Stop Auto Mode click | future route cleanup handler | yes | optional handoff only; no direct publish mutation | runtime gate only; not governance approval | medium |
| workflows | workflows-light-route | active | public/control-center/pages/workflows.js | none | none | none | none | none | none | no | none | no gate mounted | low |
| workflows | workflows-legacy-execution-loop | dormant | public/control-center/pages/workflows.js | workflowAutomationEnabled / controller via legacy bind | workflowAutoModeUnsubscribe | legacy bind or explicit Auto Start click if reactivated | explicit Auto Start click only | explicit Stop Auto Mode click | future route cleanup handler if reactivated | yes before reactivation | optional handoff / workflow run depending action | runtime gate only; not governance approval | high latent |
| global | automation-engine-runtime | active module runtime | public/control-center/automation-engine.js | autoModeRuntime | autoModeListeners | createAutoModeController caller | caller startAutoMode only | caller stopAutoMode only | caller-owned unsubscribe | yes by caller | step-dependent; durable writes only through explicit context hooks | engine waiting_approval gate only | medium |
| browser-session | auto-mode-session-storage | active | public/control-center/automation-engine.js | AUTO_MODE_STORAGE_KEY | none | module read/write | no start from storage | stop/pause writes state | n/a | no | none | persisted gate state must not auto-run | low-medium |
| workflows | workflows-bridge-listener | dormant | public/control-center/pages/workflows.js | workflowBridgeRegistered | window mh:submit-workflow listener | registerWorkflowBridge if legacy loop activated | event-driven workflow run, not Auto Mode start | none | future removeEventListener handler | yes before reactivation | durable workflow run possible | not gate approval | high latent |

## Required Future Implementation Rules

1. Route render functions that create Auto Mode subscriptions must return cleanup handlers.
2. Cleanup handlers must call unsubscribe functions exactly once.
3. Cleanup handlers must clear route-owned timers/callbacks where applicable.
4. Global engine state must not be reset blindly during route cleanup.
5. Route cleanup must not cancel backend durable operations already requested.
6. Dormant Workflows legacy loop must not be reactivated without a separate explicit implementation decision.
7. Publishing extraction must not begin until this lifecycle contract is committed.

## Non-goals
- No production code changes in this contract.
- No backend changes.
- No route render changes.
- No Auto Mode controller refactor.
- No Workflows legacy reactivation.
- No Publishing extraction yet.

## Recommended next implementation after this contract
1. Publishing pure-helper extraction, or
2. Documentation-backed route cleanup design for Publishing Auto Mode.

Recommended first code change:
- Publishing pure-helper extraction only if it does not touch Auto Mode lifecycle or durable publishing actions.
