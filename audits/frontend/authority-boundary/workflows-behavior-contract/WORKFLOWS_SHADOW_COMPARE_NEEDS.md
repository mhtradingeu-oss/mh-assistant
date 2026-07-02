# Workflows Shadow-Compare Needs

## Purpose
Freeze parity expectations before any Workflows extraction, lifecycle rewiring, or dormant-surface changes.

## What Must Be Compared

For every compared action, capture and compare:
- action key
- active or dormant path
- trigger source (button, bridge event, automation step)
- input snapshot
- API calls attempted (function and endpoint)
- shared-context writes (`setSharedAiDraft`, `setSharedHandoff`)
- run state changes (status, run id, history, result)
- handoff persistence state (local cache only vs durable backend)
- auto mode state (enabled/status/step/gate)
- navigation target
- visible message/error output category and text

## Required Action Keys
- Active light route
  - `wf_light_prepare`
  - `wf_light_send_ai`
  - `wf_light_open_campaign`
  - `wf_light_open_tasks`
- Legacy runtime (currently dormant)
  - `wf_manual_run`
  - `wf_bridge_auto_run`
  - `wf_run_full_automation`
  - `wf_run_step_automation`
  - `wf_auto_start`
  - `wf_auto_pause`
  - `wf_auto_resume`
  - `wf_auto_stop`
  - `wf_auto_gate_approve`
  - `wf_auto_gate_skip`
  - `wf_create_handoff`
  - `wf_save_structured_task`

## Safe Trace Schema (Design Only)

```json
{
  "event_id": "string",
  "timestamp": "ISO-8601",
  "route": "workflows",
  "project": "string",
  "action_key": "string",
  "path_state": "active|dormant",
  "trigger": {
    "type": "click|bridge_event|automation_step",
    "source": "element_or_event_name"
  },
  "input_snapshot": {
    "workflow_id": "string",
    "project": "string",
    "campaign": "string",
    "goal": "string"
  },
  "before_snapshot": {
    "shared_context": {
      "ai_draft_present": true,
      "handoff_present": true
    },
    "run_state": {
      "status": "idle|running|completed|failed",
      "run_id": "string"
    },
    "auto_mode": {
      "enabled": false,
      "status": "idle|running|waiting_approval|paused|stopped|completed|failed",
      "gate_required": false
    }
  },
  "api_observation": {
    "intended": {
      "function": "string_or_null",
      "endpoint": "string_or_null",
      "payload": {}
    },
    "actual": {
      "function": "string_or_null",
      "endpoint": "string_or_null",
      "payload": {},
      "attempted": true,
      "succeeded": true
    }
  },
  "shared_context_writes": [
    {
      "fn": "setSharedAiDraft|setSharedHandoff",
      "destination": "string",
      "durable_intent": false
    }
  ],
  "after_snapshot": {
    "shared_context": {
      "ai_draft_present": true,
      "handoff_present": true
    },
    "run_state": {
      "status": "idle|running|completed|failed",
      "run_id": "string"
    },
    "auto_mode": {
      "enabled": false,
      "status": "idle|running|waiting_approval|paused|stopped|completed|failed",
      "gate_required": false
    },
    "navigation": {
      "target_route": "string_or_null"
    }
  },
  "ui_result": {
    "show_message_called": true,
    "show_error_called": false,
    "message_text": "string",
    "error_text": "string"
  },
  "parity_result": {
    "passed": true,
    "mismatches": []
  }
}
```

## Forbidden Rule: No Duplicate Backend Call
- Shadow mode must never execute a second backend mutation for one user action.
- For durable mutation actions, shadow instrumentation is observe-only.
- Disallowed duplicate calls include:
  - `/workflows/:workflowId/run`
  - `/ai/workflows/:workflowId/run`
  - `/handoffs`
  - `/handoffs/:handoffId/consume`
  - `/approvals`
  - `/approvals/:approvalId/decision`
- Any duplicate durable mutation is an automatic parity failure.

## Actions That Must Be Observe-Only
- `wf_manual_run`
- `wf_bridge_auto_run`
- `wf_create_handoff` when durable create is intended
- any action that would call workflow run or approval durable endpoints

Reason:
- These actions mutate backend durable truth and must never be double-fired for comparison.

## Pass Criteria
- Same action key routing and path-state classification.
- Same API call intent and actual call behavior (or same non-call behavior).
- Same shared-context write semantics.
- Same run-state transition class.
- Same handoff durability classification.
- Same auto-mode transition class.
- Same navigation target.
- Same visible message/error behavior class.

## Fail Criteria
- Any unexpected backend call introduced or removed.
- Any payload semantic drift on durable actions.
- Any path-state drift (active action appears dormant or vice versa).
- Any hidden Auto Mode start from render/mount.
- Any gate action implying backend governance approval.
- Any duplicate backend mutation attempt.

## Immediate Constraint Before Extraction
- No Workflows extraction work should proceed until shadow-compare plan is approved and mapped to this contract.