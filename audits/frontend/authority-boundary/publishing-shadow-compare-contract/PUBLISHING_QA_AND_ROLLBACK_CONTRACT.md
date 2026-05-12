# Publishing QA And Rollback Contract

## Browser QA Checklist (Post-Extraction Only)

1. Route loads
- Open publishing route and verify content loads correctly.
- Confirm no duplicate initial toast or duplicated action side effects.

2. Local draft flow
- Create new draft, save draft, edit and save again.
- Confirm local draft persists as localOnly behavior when no durable job is returned.

3. Durable schedule flow
- Schedule a new item (durable path).
- Reschedule existing item.
- Verify queue status/timing updates after reloadProjectData.

4. Governance block path
- Attempt approve/publish with job not approved by governance.
- Verify backend block response is surfaced as error and durable state does not advance.

5. Approved publish path
- Approve durable job through governance-approved route.
- Execute publish and verify durable status/result transition to published.

6. Fail path
- Mark durable item failed.
- Verify durable result and failed status appear after reload.

7. Load handoff path
- Load available workflow handoff.
- Confirm form hydration fields: project/campaign/channel/content/title/notes.

8. Send to AI path
- Send publishing context to AI workspace.
- Confirm navigation occurs and handoff/AI context is present.

9. Auto prepare explicit only
- Verify Auto Mode does not start on route render.
- Start Auto Prepare only via explicit button click.
- Verify gate step requires manual approve/skip.

10. Route revisit stability
- Revisit publishing route multiple times.
- Confirm no duplicate subscription behavior, duplicate progress logs, or duplicate toasts.

## Validation Commands

```bash
cd /opt/mh-assistant

git status --short

node --check public/control-center/pages/publishing.js
node --check public/control-center/automation-engine.js
node --check public/control-center/api.js
node --check public/control-center/shared-context.js
node --check runtime/orchestrator-service/server.js

rg -n "savePublishingSchedule|reschedulePublishingItem|approvePublishingItem|publishPublishingItem|failPublishingItem" \
  public/control-center/pages/publishing.js public/control-center/api.js

rg -n "startAutoMode|stopAutoMode|approveCurrentGate|skipCurrentStep|prepare_publishing_draft|publish_now" \
  public/control-center/pages/publishing.js public/control-center/automation-engine.js

rg -n "assertPublishingMutationAllowed|approval_before_publish|freeze_publishing" \
  runtime/orchestrator-service/server.js
```

## Rollback Contract

### Trigger Conditions
- Shadow parity fails.
- Browser QA regression in durable mutation behavior.
- Auto Mode starts implicitly or gate behavior drifts.
- Message/error/reload behavior diverges from contract.

### Exact Rollback Steps
1. Revert implementation commit that introduced extraction.
2. Keep audit/contract artifacts under audits/frontend/authority-boundary/publishing-shadow-compare-contract.
3. Restore direct publishing handlers as behavioral source of truth.
4. Re-run parity checks and browser QA checklist.
5. Re-open extraction only with new evidence and explicit approval.

### Rollback Verification
- Durable routes still map to the same backend endpoints.
- localOnly paths remain local-only and do not mutate backend.
- runAndRefresh behavior remains action -> reload -> success message with error catch path.
- Auto Mode remains explicit-start only.

## Explicit Non-Goals
- No backend governance rule redesign.
- No mutation endpoint redesign.
- No event-handler architecture rewrite in this phase.
- No localOnly semantic redesign in this phase.
- No publishing UI redesign in this phase.
