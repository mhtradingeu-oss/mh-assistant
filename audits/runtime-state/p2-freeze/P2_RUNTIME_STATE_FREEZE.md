# P2 — Runtime State Freeze

## STATUS
P2 FOUNDATION COMPLETE

---

# CONFIRMED ARCHITECTURE

## Canonical selector layer
state.js now exposes projection-safe runtime selectors.

Current selectors:
- selectCurrentProject
- selectActiveRoute
- selectOperationsSnapshot
- selectProjectPayload
- selectSystemHealth
- selectActiveRoleProjection

---

# ADOPTED PAGES

## Home
Reads runtime state through selectors.

## AI Workspace
Reads runtime state through selectors.

## Workflows Render Layer
Reads runtime state through selectors.

---

# NOT YET MIGRATED

## High-risk runtime surfaces
Still intentionally isolated:
- workflowSessions
- durable handoffs
- automation runtime
- shared-context bridges
- orchestration runtime
- overlay runtime
- router compatibility maps

---

# DOCTRINE

Selectors are:
- read-only
- projection-safe
- behavior-compatible

Selectors must never:
- mutate runtime
- own authority
- replace backend governance
- own workflow orchestration

---

# RESULT

Frontend runtime architecture is now stabilized enough for:
- router consolidation
- overlay isolation
- workflow runtime isolation
- shared-context decomposition
- AI runtime orchestration cleanup
