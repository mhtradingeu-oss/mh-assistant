# STEP 19D — Publishing Approve/Fail Confirmation Gate Audit

Date: 2026-05-13
Mode: AUDIT ONLY (documentation-only)
Branch: architecture/frontend-consolidation-v1

---

## 1. Executive Summary

STEP 19C added exactly one `window.confirm` gate before `publishPublishingItem` — the highest-risk publishing action. This audit examines the two remaining ungated actions on the Publishing page: `approvePublishingItem` (sets status `ready`) and `failPublishingItem` (sets status `failed`).

Key findings:

- `approvePublishingItem` has no frontend confirmation gate. However, its backend endpoint enforces both `freeze_publishing` and `approval_before_publish` governance checks — the server is an active backstop and will reject the call if governance is not satisfied.
- `failPublishingItem` has no frontend confirmation gate. Its backend endpoint calls `assertPublishingMutationAllowed` but the `fail` action is **not** in any governance-sensitive action list — no freeze check, no approval check. The backend does not restrict it. It is completely unconstrained at the server layer, creates a permanent `recordPublishingExecutionOutcome` audit record (`manual_publish_failed`), and triggers `logCriticalFailure`.
- Recommended STEP 19E candidate: **`failPublishingItem`** — it is terminal, irreversible, backend-unconstrained, and the frontend is the only line of defense.
- `approvePublishingItem` is deferred: backend enforcement is present and provides an adequate backstop for the current risk tier.

No code changes were made in this step.

---

## 2. Current Publish Confirmation Status After STEP 19C

Source of truth: `public/control-center/pages/publishing.js`

| Action | API Function | Frontend Gate | Backend Gate |
|---|---|---|---|
| Publish | `publishPublishingItem` | ✅ Added in STEP 19C (L1480) | `assertPublishingMutationAllowed('publish')` + approval check |
| Approve (ready) | `approvePublishingItem` | ❌ None | `assertPublishingMutationAllowed('ready')` + freeze + approval checks |
| Fail | `failPublishingItem` | ❌ None | `assertPublishingMutationAllowed('fail')` — no governance checks enforced |
| Reschedule | `reschedulePublishingItem` | ❌ None | `assertPublishingMutationAllowed('reschedule')` + freeze check |
| Schedule | `savePublishingSchedule` | ❌ None | `assertPublishingMutationAllowed('schedule')` + freeze check |

Confirm call count in `publishing.js` as of STEP 19C:
- Total: **1** — at L1480, inside the `action === "publish"` branch only.

---

## 3. Approve Action Risk Analysis

**API call:** `approvePublishingItem(projectName, current.jobId, { notes: ... })`
**API wrapper:** `public/control-center/api.js` L1818 → `POST /media-manager/project/:project/publishing/:jobId/ready`
**Frontend handler location:** `public/control-center/pages/publishing.js` ~L1507–L1530
**Frontend confirm gate:** None

### Handler Flow

```
approveBtn.onclick
  → validate: item selected
  → if localOnly: updateLocalDraft → return
  → runAndRefresh(() => approvePublishingItem(...))
```

No `window.confirm` before the API call.

### Backend Enforcement (server.js L11942)

The `/ready` endpoint calls:

```js
assertPublishingMutationAllowed(req.params.project, 'ready', { jobId, status: 'ready' })
```

Inside `assertPublishingMutationAllowed` (server.js L13614):

```js
const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
```

`'ready'` is in **both** lists. This means:
1. If `freeze_publishing` is true → call is **rejected** by backend.
2. If `approval_before_publish` is true (default) → backend checks `getLatestPublishingApproval` and requires `status === 'approved'` or `'overridden'`.

### Risk Assessment

- **Effect:** Sets item status to `ready` — an intermediate pre-publish approval state.
- **Reversibility:** Moderate — `ready` can be overridden or rescheduled; it is not a final terminal state.
- **Backend backstop:** Strong — both freeze and approval governance checks apply. Backend will reject unapproved approve calls under default policy.
- **Inadvertent click risk:** Present — no frontend gate, button is in the same action panel as publish/fail.
- **Conclusion:** Backend enforcement provides adequate protection for the current risk tier. Frontend confirmation desirable but deferred.

---

## 4. Fail Action Risk Analysis

**API call:** `failPublishingItem(projectName, current.jobId, { notes: ... })`
**API wrapper:** `public/control-center/api.js` L1852 → `POST /media-manager/project/:project/publishing/:jobId/fail`
**Frontend handler location:** `public/control-center/pages/publishing.js` ~L1532–L1557
**Frontend confirm gate:** None

### Handler Flow

```
failBtn.onclick
  → validate: item selected
  → if localOnly: updateLocalDraft → return
  → runAndRefresh(() => failPublishingItem(...))
```

No `window.confirm` before the API call.

### Backend Enforcement (server.js L12050)

The `/fail` endpoint calls:

```js
assertPublishingMutationAllowed(req.params.project, 'fail', { jobId, status: 'failed' })
```

Inside `assertPublishingMutationAllowed` (server.js L13614):

```js
const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
// → 'fail' is NOT in this list → freeze check does NOT apply
const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
// → 'fail' is NOT in this list → approval check does NOT apply
```

`'fail'` and `'failed'` are absent from both governance-sensitive lists. `assertPublishingMutationAllowed` passes through unconditionally for `fail`.

### Backend Side Effects (server.js L12050+)

The `/fail` endpoint performs two irreversible operations beyond a status update:

1. `updateScheduledJobRecord(project, jobId, { status: 'failed', notes })` — permanent status write.
2. `recordPublishingExecutionOutcome(project, jobId, { execution_status: 'failed', action_type: 'manual_publish_failed', notes })` — creates a permanent audit outcome record.
3. `logCriticalFailure('publishing_fail', ...)` — server-side critical failure log entry.

### Risk Assessment

- **Effect:** Sets item status to `failed` — a **terminal negative state** in the publishing lifecycle.
- **Reversibility:** Low — `failed` status can be updated but the `recordPublishingExecutionOutcome` record with `manual_publish_failed` is permanent. The audit trail cannot be undone.
- **Backend backstop:** **None** — `assertPublishingMutationAllowed` enforces no governance constraints on `fail`. Frontend is the sole line of defense.
- **Inadvertent click risk:** High — same action panel as approve/publish; one misclick with no gate creates an irreversible audit outcome.
- **Conclusion:** `failPublishingItem` is the highest-priority unprotected action remaining in the Publishing page. It must be the STEP 19E implementation target.

---

## 5. Backend / API Evidence

### API Wrappers (public/control-center/api.js)

```js
// L1818
export async function approvePublishingItem(projectName, jobId, payload = {}) {
  return sendJson(`/media-manager/project/.../publishing/.../ready`, "POST", payload, "Failed to approve publishing item");
}

// L1852
export async function failPublishingItem(projectName, jobId, payload = {}) {
  return sendJson(`/media-manager/project/.../publishing/.../fail`, "POST", payload, "Failed to mark publishing item as failed");
}
```

### Server Endpoints (server.js)

| Endpoint | Line | Governance Action Key | freeze_publishing | approval_before_publish |
|---|---|---|---|---|
| `POST /publishing/:jobId/ready` | L11942 | `'ready'` | ✅ Enforced | ✅ Enforced |
| `POST /publishing/:jobId/fail` | L12050 | `'fail'` | ❌ Not enforced | ❌ Not enforced |
| `POST /publishing/:jobId/publish` | L11986 | `'publish'` | ✅ Enforced | ✅ Enforced |

### Backbone Default Policy (lib/ops/backbone.js L20)

```js
approval_required_actions: ['publish', 'launch', 'budget_change', 'integration_reconnect', 'execution_mode_change']
// Note: 'fail' is not in this list
policy_rules: {
  approval_before_publish: true,  // applies to 'ready' and 'publish' actions
  freeze_publishing: false         // applies to 'schedule', 'reschedule', 'ready', 'publish'
}
```

`fail` is absent from all governance-sensitive action lists in both backbone defaults and `assertPublishingMutationAllowed`. No backend rule can prevent an inadvertent fail action.

---

## 6. Recommended Smallest STEP 19E Candidate

**Candidate: `failPublishingItem`**

Rationale (ordered by priority):

1. **Zero backend protection** — `assertPublishingMutationAllowed` applies no constraints for `fail`. Frontend confirmation is the **only** available gate.
2. **Permanent audit record** — `recordPublishingExecutionOutcome` with `action_type: 'manual_publish_failed'` cannot be reversed.
3. **`logCriticalFailure` invoked** — the server explicitly classifies this as a critical failure event. Inadvertent triggering creates operational noise.
4. **Terminal negative state** — `failed` status stops the item's publishing lifecycle. Recovery requires deliberate rescheduling.
5. **`approvePublishingItem` deferred** — `ready` action has strong backend enforcement (approval + freeze checks), making it lower urgency.

Scope of STEP 19E: Add exactly **one** `window.confirm` gate before the `failPublishingItem` call inside `failBtn.onclick`, mirroring the STEP 19C pattern. No other changes.

---

## 7. Proposed Confirmation Copy for STEP 19E Candidate

Proposed gate for `failPublishingItem`, to be placed inside `failBtn.onclick` immediately before `runAndRefresh(...)`:

```text
Confirm fail action

Action: Mark this publishing item as failed.
Risk: This creates a permanent failure record and stops the publishing lifecycle for this item.
Policy: Use only when this item cannot proceed and requires explicit failure logging.

Select Cancel to keep this item in its current state.
```

Placement: Same pattern as STEP 19C — `const confirmed = window.confirm(...)` followed by `if (!confirmed) { rerender(); return; }` before `runAndRefresh(...)`.

---

## 8. What Must Not Be Patched Yet

The following actions must not receive a confirmation gate in STEP 19E:

| Action | Reason to Defer |
|---|---|
| `approvePublishingItem` | Backend enforces freeze + approval_before_publish; backstop present. Lower priority. |
| `reschedulePublishingItem` | Scheduling mutation; backend freeze check applies; not a terminal state. |
| `savePublishingSchedule` | Schedule-only; backend freeze check applies; reversible by rescheduling. |
| `publishingAutoPrepareBtn` | Auto-mode abstraction; starts a multi-step preparation sequence, not a direct mutation. |
| `publishingAutoApproveBtn` | Auto-mode approval gate; programmatic path; confirmation pattern not established. |
| `publishingAutoSkipBtn` | Auto-mode step skip; not a publishing execution action. |
| `publishingLoadHandoffBtn` | Context-only; loads handoff data into form; no backend write. |
| `publishingPushAiBtn` | Context-only; navigates to AI command page; no mutation. |

Only `failPublishingItem` is the STEP 19E implementation target.

---

## 9. Validation Commands and Results

Commands executed:

```sh
git status --short
node --check public/control-center/pages/publishing.js
node --check public/control-center/api.js
node --check runtime/orchestrator-service/server.js
node --check runtime/orchestrator-service/lib/ops/backbone.js
node --check public/control-center/app.js
node --check public/control-center/router.js
grep -n "confirm(\|approvePublishingItem\|failPublishingItem\|publishPublishingItem" public/control-center/pages/publishing.js
```

Results:

**git status --short:**
- Clean working tree. No uncommitted modifications to any production file.

**node --check:**
- `public/control-center/pages/publishing.js` — passed
- `public/control-center/api.js` — passed
- `runtime/orchestrator-service/server.js` — passed
- `runtime/orchestrator-service/lib/ops/backbone.js` — passed
- `public/control-center/app.js` — passed
- `public/control-center/router.js` — passed

**grep output (line references in publishing.js):**

```
1288:  approvePublishingItem,         ← import
1289:  publishPublishingItem,         ← import
1290:  failPublishingItem,            ← import
1480:  window.confirm("Confirm publish action...")  ← STEP 19C gate (only confirm in file)
1486:  publishPublishingItem(...)     ← gated call (STEP 19C)
1524:  approvePublishingItem(...)     ← NO gate (as expected)
1548:  failPublishingItem(...)        ← NO gate (STEP 19E target)
1702:  approvePublishingItem,         ← closure/auto reference
1703:  publishPublishingItem,         ← closure/auto reference
1704:  failPublishingItem             ← closure/auto reference
1780:  approvePublishingItem,         ← closure/auto reference
1781:  publishPublishingItem,         ← closure/auto reference
1782:  failPublishingItem,            ← closure/auto reference
1794:  approvePublishingItem,         ← closure/auto reference
1795:  publishPublishingItem,         ← closure/auto reference
1796:  failPublishingItem             ← closure/auto reference
```

Total `confirm(` calls in publishing.js: **1** (L1480 — STEP 19C, publish only). Confirmed unchanged.

---

## 10. Explicit No-Code-Change Statement

No production code was changed in STEP 19D.

Files modified: **none**.

The following were inspected read-only:
- `public/control-center/pages/publishing.js`
- `public/control-center/api.js`
- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/ops/backbone.js`
- `audits/frontend/safety/STEP_19C_PUBLISH_CONFIRMATION_GATE_PATCH.md`
- `audits/frontend/safety/STEP_18_DANGEROUS_ACTION_CONFIRMATION_AUDIT.md`

This document is the sole output of STEP 19D. Implementation begins in STEP 19E.
