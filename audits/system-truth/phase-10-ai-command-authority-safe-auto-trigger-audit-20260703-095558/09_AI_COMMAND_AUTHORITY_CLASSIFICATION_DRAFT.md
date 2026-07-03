# Phase 10 AI Command Authority Classification Draft

## Categories

### A — Explicit user Ask only
AI backend execution only happens after explicit user action.

### B — Safe context/open-only behavior
AI panel opens or receives context, but no backend execution or publish action occurs.

### C — Safe automation preparation
Only allowed draft/handoff/prompt/preparation actions are allowed.

### D — Active backend execution with guard
Backend helper is called, but only through explicit action and safe UI path.

### E — Suspicious auto authority risk
Autonomous/timer/listener path can execute backend, publish, ads, workflow, or mutate without explicit user action.

## Phase 10 rule
No patch unless exact active unsafe authority is proven.
