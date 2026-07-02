# Publishing Shadow-Compare Plan

## Objective
Define parity checks that allow future extraction to be validated without changing publishing behavior or duplicating backend mutations.

## Compare Scope
- Target: publishing handlers in public/control-center/pages/publishing.js
- Target APIs: savePublishingSchedule, reschedulePublishingItem, approvePublishingItem, publishPublishingItem, failPublishingItem
- Target lifecycle: Auto Mode prepare/stop/approve-gate/skip-gate behavior
- Out of scope in shadow-run: duplicate backend mutation calls

## Required Compare Points Per Action
- action key
- selected item id
- localOnly status
- payload sent to API
- backend function called or not called
- local draft mutations
- shared-context writes
- queue status before and after
- visible status label before and after
- reloadProjectData called or not
- showMessage called or not
- showError called or not
- Auto Mode state before and after

## Safe Shadow Trace Schema (Design Only, Not Implemented)

```json
{
  "event_id": "string-uuid-or-monotonic-id",
  "timestamp": "ISO-8601",
  "route": "publishing",
  "project": "string",
  "action_key": "save_draft|schedule|reschedule|pause|retry|approve|publish|fail|load_handoff|send_ai|auto_prepare|auto_stop|auto_approve_gate|auto_skip_gate|local_only_publish|local_only_approve|local_only_fail",
  "item_id": "jobId or local draft id",
  "local_only": true,
  "before_snapshot": {
    "session": {
      "selected_id": "string",
      "form": {},
      "validation": {}
    },
    "queue": {
      "item_status": "draft|ready|scheduled|published|failed",
      "visible_label": "string"
    },
    "auto_mode": {
      "enabled": false,
      "status": "idle|running|waiting_approval|paused|completed|failed",
      "step_index": 0
    }
  },
  "intended_api_call": {
    "function": "string-or-null",
    "endpoint": "string-or-null",
    "payload": {}
  },
  "actual_api_call": {
    "function": "string-or-null",
    "endpoint": "string-or-null",
    "payload": {},
    "attempted": true,
    "succeeded": true
  },
  "after_snapshot": {
    "session": {
      "selected_id": "string",
      "form": {},
      "validation": {}
    },
    "queue": {
      "item_status": "draft|ready|scheduled|published|failed",
      "visible_label": "string"
    },
    "auto_mode": {
      "enabled": false,
      "status": "idle|running|waiting_approval|paused|completed|failed",
      "step_index": 0
    }
  },
  "ui_visible_result": {
    "show_message_called": true,
    "show_error_called": false,
    "message_text": "string",
    "error_text": "string"
  },
  "error": {
    "name": "string",
    "message": "string",
    "code": "string"
  },
  "parity_result": {
    "passed": true,
    "mismatches": []
  }
}
```

## Forbidden Rule: No Duplicate Backend Call
- Shadow mode must never issue a second backend mutation for the same user action.
- For mutation actions, shadow logic is observe-only and compare-only.
- Disallowed in shadow mode: any second call to /publishing/schedule, /publishing/:jobId/reschedule, /publishing/:jobId/ready, /publishing/:jobId/publish, /publishing/:jobId/fail.
- Reason: duplicate calls can create double status transitions, duplicate execution results, duplicate queue events, or duplicate notifications.

## Never Shadow-Execute (Observe Only)
- publish
- fail
- approve ready
- reschedule
- all backend mutations

Why:
- These paths are authoritative and durable in backend storage.
- Server routes enforce governance and can reject/mutate based on current policy and approval state.
- Double execution can alter durable truth and invalidate parity evidence.

## Compare Mechanics
- Capture before snapshot at click-handler entry.
- Capture intended API function and payload at decision point.
- Observe actual API invocation metadata from wrapper/interceptor (no second call).
- Capture after snapshot after rerender/reload settle point.
- Emit parity result with field-level mismatch list.

## Parity Pass Criteria
- Action mapping unchanged: same action key and target id resolution.
- API parity unchanged: same backend function called (or intentionally not called) with equivalent payload semantics.
- Local draft parity unchanged: same local storage mutation semantics for localOnly paths.
- Shared-context parity unchanged: same setSharedAiDraft/setSharedHandoff writes for AI/handoff actions.
- UI parity unchanged: equivalent visible status label, same message/error behavior category.
- Reload parity unchanged: reloadProjectData invocation matches baseline for durable actions.
- Auto Mode parity unchanged: no auto-start from render; same gated behavior for publish-like steps.

## Parity Fail Conditions
- Backend call introduced/removed unexpectedly for an action.
- Payload field/value drift for durable mutation actions.
- LocalOnly path starts invoking durable backend mutation.
- Durable path stops invoking reloadProjectData.
- Success path emits showError or failure path suppresses showError.
- Auto Mode begins without explicit button click.
- Any duplicate backend mutation detected for one user action.

## Decision Gate After Shadow-Compare
- Pass: proceed to pure-helper extraction only.
- Fail: block extraction, capture mismatch evidence, rollback candidate implementation.
