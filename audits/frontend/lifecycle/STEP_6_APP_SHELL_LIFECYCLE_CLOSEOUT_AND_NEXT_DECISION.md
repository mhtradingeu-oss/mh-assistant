# Step 6: App Shell Lifecycle Closeout And Next Migration Decision

Audit Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: Audit and decision only

## Executive Summary

The app-shell lifecycle phase is complete and stable.

Closeout decision:
- App-shell migration is complete for the planned Phase A listener set.
- No additional app-shell listener migration is needed now.
- Publishing and Workflows are not safe as immediate next lifecycle targets.
- Recommended next target: Library page.
- Recommended next move type: tiny integration (limited, compatibility-first, no behavior change).

Authority boundary statement:
- Backend authority remains unchanged.
- Frontend remains a projection/runtime UX layer and does not become policy authority.

## Completed Steps Status

Step 1: Route authority boundary documentation  
- Complete. No backend authority changes.

Step 2: Lifecycle registry foundation  
- Complete. Reusable registry exists with idempotent cleanup and safety guards.

Step 3: Listener/timer density audit  
- Complete. Identified app-shell first, Library second, complex pages later.

Step 4: App-shell lifecycle integration  
- Complete. 5 app-shell listeners moved to lifecycle registration in app.js.

Step 5: App-shell smoke/regression audit  
- Complete. No route regression, no duplicate registration risk with current guards.

Step 5B: Step 4 wording clarification  
- Complete. Documentation clarified that cleanup is available but not invoked on normal route changes.

## Current Safe Baseline

Verified safe baseline in current branch:
- lifecycle registry module is valid.
- app.js and router.js syntax are valid.
- app-shell lifecycle registration is module-level and guarded.
- no lifecycle cleanup is triggered during normal route changes.
- duplicate hashchange listeners are intentional and separated by concern:
  - route/navigation sync
  - AI dock context sync

App-shell listeners currently integrated through lifecycle registry:
- window mh:route-change
- window hashchange route/navigation handler
- window resize responsive handler
- window orientationchange responsive handler
- window hashchange AI dock context sync

Conclusion:
- Phase A objective is satisfied.
- No additional app-shell migration is required at this stage.

## Pages Not Safe For Immediate Lifecycle Migration

### Publishing page
Risk level: Medium to High  
Why not now:
- auto-mode subscription lifecycle and controller readiness coupling
- render timer scheduling tied to automation state
- failure mode complexity if cleanup order is wrong

Evidence signals:
- publishingAutoModeUnsubscribe and subscribeAutoMode flow
- publishingRenderTimer scheduling gate

Decision:
- Not safe as the immediate next target.

### Workflows page
Risk level: High  
Why not now:
- multiple subscribe/unsubscribe paths for auto-mode
- custom window event bridge plus automation loop coupling
- broader blast radius if lifecycle ordering is wrong

Evidence signals:
- workflowAutoModeUnsubscribe reassignment paths
- window mh:submit-workflow bridge
- repeated subscribeAutoMode attachment sites

Decision:
- Not safe as the immediate next target.

## Candidate Evaluation Table

| Candidate | Risk | Current listener pattern | Migration complexity | Suitability now |
|---|---|---|---|---|
| Library page | Low | already has listener-lifecycle module with mount and unmount | Low | Best next target |
| Operations Centers page | Low to Medium | many root-scoped direct listeners, no unified disposer | Medium | Good second target |
| Setup page | Medium | timer-heavy form autosave/focus timing | Medium | Later |
| AI Command page | Medium | automation/session coupling, unsubscribe state variables | Medium to High | Later |

## Recommended Next Target

Recommended target: Library page

Why this is safest next:
- already uses an internal listener lifecycle abstraction pattern
- already has explicit mount and unmount flow for global page listeners
- migration can be done with compatibility adapter style and minimal behavior risk
- change can be constrained to lifecycle plumbing only, without UI or route changes

Why not Operations Centers first:
- large set of direct root listeners across four centers
- no existing single disposal abstraction
- would require introducing new disposal scaffolding before migration

## Recommended Next Step Type

Recommended type: tiny integration

Reasoning:
- audit-only is no longer necessary for choosing the target; evidence is sufficient.
- skeleton module only is unnecessary because lifecycle-registry already exists.
- tiny integration in Library can be narrow and reversible:
  - swap internal listener lifecycle plumbing to shared runtime lifecycle registry
  - preserve existing page behavior and contracts
  - keep scope constrained to listener registration/unregistration only

Proposed shape for next step:
- keep Library render behavior unchanged
- preserve current mountLibraryGlobalListeners and unmountLibraryGlobalListeners behavior
- replace internal listener collection internals with shared lifecycle-registry-backed implementation

## Validation Commands And Results

Commands executed:
- git status --short
- node --check public/control-center/runtime/lifecycle/lifecycle-registry.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js

Results:
- git status: clean at validation time
- lifecycle-registry.js: PASS
- app.js: PASS
- router.js: PASS

## Rollback Note

This step is documentation-only.
Rollback is trivial:
- remove this Step 6 document if needed.
- no runtime rollback required because no production code was changed in this step.

## Explicit No-Code-Change Statement

This Step 6 task is audit and decision only.
- No production code changed.
- app.js was not modified.
- router.js was not modified.
- pages were not modified.
- CSS was not modified.
- backend was not modified.
- data/projects were not modified.

## Final Decision

App-shell lifecycle phase is closed out as complete.

Immediate next lifecycle migration target should be the Library page via a tiny integration approach, while Publishing and Workflows remain deferred due to higher coupling and risk.
