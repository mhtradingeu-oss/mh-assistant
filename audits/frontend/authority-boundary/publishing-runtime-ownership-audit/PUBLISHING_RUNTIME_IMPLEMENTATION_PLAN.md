# Publishing Runtime Implementation Plan (Future, If Implementation Is Approved)

## Recommended next step
- Selected option: F. Create shadow-compare plan before extraction.

### Why this is safest
- Publishing mixes local-only convenience paths and backend-durable authority paths.
- Auto Mode lifecycle uses module-level binding state and render-time attachment.
- Governance enforcement is currently backend-only and must remain the primary authority boundary.
- Shadow-compare allows parity checks before any structural movement of handlers/functions.

## Step-by-step future implementation (not executed in this phase)

1. Freeze behavior contract (no code movement)
- Capture a behavior contract for each publishing action (draft, schedule, reschedule, approve, publish, fail, handoff load, AI push, auto prepare/stop/approve/skip).
- Define expected preconditions, backend call expectation, and resulting durable artifacts.

2. Add lifecycle registry comments/doc only
- Add a publishing lifecycle registry document that maps each click/control to:
  - local state mutations
  - backend mutation calls
  - shared-context writes
  - expected durable outputs
- No functional edits yet.

3. Introduce non-invasive shadow instrumentation
- Add temporary trace wrapper (feature-flagged) around publishing handlers to log:
  - action key
  - item localOnly vs durable id
  - backend call attempted/succeeded/failed
  - resulting queue status shown in UI
- Persist traces in a dedicated audit log artifact path.

4. Run side-by-side parity checks
- Compare old handler outputs vs extracted candidate helper outputs for identical input snapshots.
- Block any extraction if parity fails on status transitions or API payloads.

5. First safe code extraction (after parity pass)
- Extract only pure payload helpers first:
  - buildSchedulePayload
  - buildLocalDraftPayload
  - buildPublishingAiPrompt
- Keep event binding in place until all parity checks pass.

6. Controlled action dispatcher extraction
- Extract a thin action dispatcher that routes action keys to existing current implementations.
- Keep rollback switch to old direct handlers.

7. Decide backend movement scope
- For any authority-adjacent local path that can be misunderstood as durable truth (especially localOnly publish/fail/approve markings), decide whether to:
  - keep as explicit local simulation, or
  - require backend confirmation before terminal status display.

## Exact first safe change
- Create a publishing lifecycle registry artifact (audit doc) with an immutable action contract table and parity assertions.
- No production behavior changes.

## Files to touch (future)
- public/control-center/pages/publishing.js (only when implementation phase is approved)
- public/control-center/automation-engine.js (only if lifecycle teardown is introduced)
- audits/frontend/authority-boundary/publishing-runtime-ownership-audit/ (registry + parity reports)

## Validation commands (future implementation phase)
```bash
cd /opt/mh-assistant
node --check public/control-center/pages/publishing.js
node --check public/control-center/automation-engine.js
node --check public/control-center/app.js
node --check public/control-center/api.js
node --check public/control-center/shared-context.js

rg -n "createAutoModeController|subscribeAutoMode|startAutoMode|stopAutoMode|approveCurrentGate|skipCurrentStep" \
  public/control-center/pages/publishing.js public/control-center/automation-engine.js

rg -n "savePublishingSchedule|reschedulePublishingItem|approvePublishingItem|publishPublishingItem|failPublishingItem" \
  public/control-center/pages/publishing.js public/control-center/api.js

rg -n "assertPublishingMutationAllowed|approval_before_publish|freeze_publishing" \
  runtime/orchestrator-service/server.js runtime/orchestrator-service/lib/ops/backbone.js
```

## Browser QA checklist (future implementation phase)

1. Routing and mount
- Open publishing route and verify page renders once without duplicate action toasts.

2. Local-only flow
- Create local draft, approve local draft, mark local draft failed, mark local draft published.
- Confirm UI clearly indicates local-only nature and no backend durable IDs created.

3. Durable schedule flow
- Save schedule for backend item.
- Reschedule existing item.
- Verify queue status and timing update after reloadProjectData.

4. Governance-enforced ready/publish
- Attempt ready/publish without backend approval and verify governance block response.
- Approve via governance path, then ready/publish succeeds.

5. Failure flow
- Mark backend item failed and verify durable result record appears after refresh.

6. Handoff + AI push
- Load workflow handoff, verify fields hydrate correctly.
- Send to AI workspace and verify destination route receives expected draft context.

7. Auto Mode
- Start Auto Prepare only by explicit click.
- Confirm waiting_approval gate appears at publish step.
- Verify Approve and Continue / Skip Step buttons work as expected.
- Confirm no automatic publish occurs from initial render.

8. Regression checks
- Re-enter publishing route multiple times and verify no duplicate subscriptions/toasts.

## Rollback plan (future implementation phase)

1. Keep extraction behind a runtime flag for one release cycle.
2. If parity mismatch or lifecycle regression appears:
- disable extraction flag
- restore direct handler path
- preserve gathered trace logs for diagnosis
3. Re-run validation commands and browser QA checklist before re-enabling.

## Explicit non-goals
- No backend authority redesign in this phase.
- No policy_rules changes.
- No UI redesign.
- No route-role model changes.
- No modifications to data/projects files.
- No conversion of local draft UX into mandatory backend persistence during first extraction pass.