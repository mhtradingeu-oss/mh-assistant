# P1.14 — Frontend Authority Deprecation Map

## Doctrine
Backend owns operational authority.
Frontend projects operational authority.

## Purpose
Define which frontend authority remnants are temporary compatibility layers and how they will be retired.

## Deprecation classes

### A. Keep as projection
These are allowed permanently:
- UI selected tab
- expanded/collapsed panels
- local draft text before save
- visual filters and sorting
- preview-only summaries
- transient route labels

### B. Temporary compatibility only
These remain until backend source switch is complete:
- DEFAULT_ROUTE_ROLE_ACCESS in app.js
- DEFAULT_ROUTE_ROLE_ACCESS in router.js
- ACTIVE_ROUTE_ROLES in app.js
- ACTIVE_ROUTE_ROLES in router.js
- static AGENT_CARDS in ai-command.js
- static role cards in Home fallback
- shared-context handoff cache

### C. Must migrate to backend projection
These must be read from backend operations projection:
- route permissions
- active role
- AI team members
- service domains
- workflow ownership
- approval ownership
- handoff lifecycle
- publishing guardrails
- governance policy
- escalation chain

### D. Must not be reintroduced
Forbidden in frontend:
- new permission source of truth
- new approval authority
- new workflow execution authority
- new governance policy rules
- new durable handoff store
- heavy intelligence inside render
- auto mode initialization on page load

## Current progress

Completed:
- authority-projection helper created
- Home reads AI team projection
- AI Command reads specialist projection
- app.js reads active role and route permissions through helper
- router.js shadow plan documented

Not yet switched:
- router.js still uses local route fallback
- workflows and publishing still contain runtime compatibility logic
- automation-engine remains frontend runtime compatibility layer

## Retirement order

1. Add router projection compatibility helper.
2. Shadow-compare app/router route decisions.
3. Switch router to backend projection with fallback.
4. Downgrade frontend AI team static maps to fallback-only.
5. Downgrade shared-context handoffs to transient-only documentation.
6. Move workflow/automation authority to backend runtime.
7. Remove unused frontend authority maps after stability window.

## Protected rule
No authority removal without:
- snapshot
- node --check
- behavior comparison
- rollback-safe commit
