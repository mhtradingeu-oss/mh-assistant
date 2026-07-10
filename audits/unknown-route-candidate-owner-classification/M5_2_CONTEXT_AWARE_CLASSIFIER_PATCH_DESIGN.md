# M5-2A — Context Aware Classifier Patch Design

## Status

`PATCH_DESIGN_RECORDED`

## Mode

Design only.

No checker code, runtime, AI Command, contract, router, or application behavior changes are allowed in this phase.

---

# Objective

Replace identifier-only unknown route classification with evidence-based context-aware classification.

The goal is:

- reduce false positives;
- preserve real route drift detection;
- never hide unknown routes.

---

# Current Problem

Current classifier flow:

```text
identifier
↓
known buckets
↓
```
unknown_candidate

Problem:

Generic terms and internal identifiers may look like routes.

Examples:

command
analysis
action
set-page

are not necessarily pages.

Final Classification Order
1. canonical_contract_page

2. runtime_page_alias

3. role_id

4. role_alias

5. known_non_page

6. provider_integration_channel

7. status_lifecycle_identifier

8. internal_ai_decision_route

9. ui_action_event

10. subsystem_handoff_source

11. unknown_candidate
Safety Invariants
Unknown remains the final fallback

The classifier must always preserve:

unknown_candidate

for identifiers that have no proven classification.

No token burial

Forbidden:

global ignore lists;
token-only allowlists;
artificial owners.
Evidence Required

Classification requires:

identifier
+
source file
+
source field
+
syntax context
+
known relationships
Candidate Decisions
action

Classification:

ui_action_event

Reason:

Represents action vocabulary and UI event concepts.

Not a page.

analysis

Classification:

internal_ai_decision_route

Reason:

Appears as AI decision routing.

Not a Control Center page.

automation-engine

Classification:

subsystem_handoff_source

Reason:

Represents subsystem/source ownership.

Not a page.

command

Classification:

internal_ai_decision_route

Reason:

Different from canonical page:

ai-command
idle

Classification:

status_lifecycle_identifier

Reason:

Operational state.

Not navigation.

set-page

Classification:

ui_action_event

Reason:

Page mutation action.

Not destination.

M5-2 Implementation Scope

Allowed:

add classifier helpers;
add context extraction;
add evidence reporting;
preserve unknown fallback.

Target:

scripts/audit/ai-team-contract-conformance-check.mjs

Forbidden:

runtime changes;
AI Command changes;
contract changes;
route ownership changes;
hiding unknown routes.
Validation

Required:

Failures: 0
Handoff drift pairs: 0

Unknown candidates:

0 only when every candidate has evidence-backed classification
## Decision

M5-2A design approved

Implementation:
NOT ALLOWED YET

Next:
M5-2B narrow checker patch after review

