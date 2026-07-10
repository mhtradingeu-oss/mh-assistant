# M5-1 — Unknown Route Candidate Classification Patch Design

## Status

`PATCH_DESIGN_RECORDED`

## Mode

Design-only.

No production source, runtime behavior, AI Command behavior, operating contract, route authority, or application contract is modified.

## Source of Truth

- Commit: `7caf9a2 Record unknown route candidate truth scan`
- Parent phase: `M5-0`
- Baseline:
  - Failures: `0`
  - Warnings: `9`
  - Unknown route candidates: `6`
  - Alias drift signals: `53`
  - Handoff drift pairs: `0`

## Unknown Candidates

- `action`
- `analysis`
- `automation-engine`
- `command`
- `idle`
- `set-page`

## Design Principle

The six candidates must not receive artificial page owners.

They must also not be placed in a broad global ignore list.

Classification must use extraction provenance and source context.

The classifier must distinguish between:

- Control Center page routes
- AI internal decision routes
- UI actions and events
- status and lifecycle values
- subsystem and handoff-source identifiers

## Candidate Classification

### `action`

- Bucket: `action_or_event_vocabulary`
- Page owner: none
- Evidence: appears as generic action vocabulary and as an internal AI decision route
- Safe rule: classify only when provenance proves an action, event, or internal decision field
- Must not be interpreted as a Control Center destination page

### `analysis`

- Bucket: `internal_decision_route_or_mode`
- Page owner: none
- Evidence: appears as `route: "analysis"` inside AI Command decision logic
- Safe rule: classify only when provenance proves an internal AI decision route, mode, intent, or output category
- Must not be interpreted as a Control Center page route

### `automation-engine`

- Bucket: `subsystem_or_handoff_source`
- Page owner: none
- Evidence:
  - checker source identifier for `public/control-center/automation-engine.js`
  - explicit handoff source in the operating contract
- Safe rule: classify only in subsystem, producer, source, origin, or handoff context

### `command`

- Bucket: `internal_decision_route_or_command_vocabulary`
- Page owner: none
- Evidence: appears as `route: "command"` inside AI Command decision logic
- Safe rule: classify only when provenance proves an internal decision route, command, intent, action, or event field
- Must not be confused with the canonical `ai-command` page route

### `idle`

- Bucket: `status_or_state_identifier`
- Page owner: none
- Evidence: lifecycle or execution-state vocabulary
- Safe rule: classify only in status, state, lifecycle, availability, or execution-state context

### `set-page`

- Bucket: `router_action_or_input_event`
- Page owner: none
- Evidence: represents an instruction to change page state
- Safe rule: treat as an action or event identifier, never as the destination route itself

## M5-2 Recommended Scope

Target only:

```text
scripts/audit/ai-team-contract-conformance-check.mjs
```
Allowed
Add narrow context-aware classification.
Add explicit non-page classification buckets.
Use extraction provenance or source-field context.
Preserve detection of genuine unknown page routes.
Report classified non-page identifiers as informational evidence.
Forbidden
No runtime changes.
No AI Command changes.
No operating-contract changes.
No router or app behavior changes.
No route-owner additions for the six candidates.
No global token suppression.
No token-only allowlist.
No reduction of warnings by hiding unresolved identifiers.
Proposed M5-2 Classifier Direction

The checker should classify an identifier using both:

identifier value
+
source file
+
source field or syntax context
+
known contract route set

Suggested classification order:

1. canonical contract page
2. known runtime page alias
3. role or role alias
4. provider, integration, or channel
5. input identifier
6. status or lifecycle identifier
7. internal AI decision route
8. UI action or event
9. subsystem or handoff source
10. unknown candidate

The final fallback must remain:

unknown_candidate

This preserves drift detection for genuinely unknown page routes.

Expected M5-2 Validation

Target:

Failures: 0
Unknown route candidates: 0
Handoff drift pairs: 0

Unknown route candidates: 0 is acceptable only if all six candidates are removed through evidence-backed classification.

## Decision

```text
can_patch_now: false
recommended_next_phase: M5-2
patch_target: conformance checker only
review_required: true
```

## Evidence Summary
Checker classifier evidence

The current checker:

classifies canonical pages and known non-page buckets;
sends unresolved values to unknown_candidate;
emits one warning for each unknown candidate;
reports six unknown candidates in the current baseline.
Runtime evidence
analysis appears as an internal AI decision route.
command appears as an internal AI decision route.
action appears as action/event vocabulary and internal decision routing.
automation-engine appears as a subsystem and handoff source.
idle represents operational state.
set-page represents a page-change action rather than a destination page.
Final Status

PATCH_DESIGN_RECORDED

ready for review before commit.
