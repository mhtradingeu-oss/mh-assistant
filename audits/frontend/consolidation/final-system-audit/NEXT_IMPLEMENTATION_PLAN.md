# NEXT IMPLEMENTATION PLAN

Date: 2026-05-12
Scope origin: Final frontend system audit
Doctrine: Backend owns authority. Frontend projects authority.

## Phase 0: Freeze / Confirm Current Baseline
Objective: Lock current stability before new implementation.

- Snapshot branch state and evidence outputs.
- Preserve current runtime behavior for operations/governance/settings.
- Confirm no production-code changes except targeted, approved migration slices.
- Keep compatibility utilities (including standard shell helper) unchanged for fallback safety.

Exit criteria:
- Evidence baseline file is present and accepted.
- No unresolved regressions in known-stable pages.

## Phase 1: Publishing Runtime Ownership Audit
Objective: Prove authority boundary in publishing flow.

- Map all publishing actions by authority type:
  - display-only projection
  - local draft convenience
  - durable write action
  - approval-gated action
- Verify Auto Mode lifecycle is explicit user-driven start only.
- Isolate publishing runtime decisions from presentation helpers.
- Document all backend handoff/approval dependencies and failure handling.

Exit criteria:
- Publishing authority map approved.
- No implicit lifecycle execution paths.
- Clear ownership matrix for publish/approve/fail/reschedule actions.

## Phase 2: Workflows Runtime Ownership Audit
Objective: Isolate automation planning and execution authority.

- Audit buildAutomationPlan and runAutomationPlan usage boundaries.
- Verify approval-gate semantics and manual stop/skip/approve behavior.
- Ensure no hidden execution starts from render or route load.
- Separate execution orchestration helpers from page rendering concerns.

Exit criteria:
- Workflows authority map approved.
- Auto Mode and step automation are explicit and observable.
- Runtime orchestration separated from core view render blocks.

## Phase 3: AI Command Operating Room Audit
Objective: Define AI Command as command room, not hidden authority source.

- Classify AI Command actions into:
  - recommendation
  - dispatch intent
  - handoff projection
  - durable operation request
- Validate handoff consumption and cross-page context behavior.
- Define explicit constraints for command execution and escalation.

Exit criteria:
- AI Command operating contract documented.
- No ambiguous authority behavior in AI command pathways.

## Phase 4: Large Page Extraction Planning
Objective: Reduce risk by controlled decomposition, not redesign.

- Prioritize extraction order by risk and blast radius:
  1. publishing.js
  2. workflows.js
  3. media-studio-workspace.js
  4. content-studio-workspace.js
  5. ai-command.js
- Extract pure helpers first (formatters, selectors, mappings, state transforms).
- Keep behavior frozen during extraction.
- Introduce shadow-compare checks for output parity.

Exit criteria:
- Largest pages reduced in complexity with behavior parity validated.
- No authority semantics changed during extraction phase.

## Phase 5: UX Operating Surface Standard
Objective: Apply canonical operating-surface UX after authority boundaries are stable.

- Standardize page anatomy:
  - Header
  - Main View
  - Action Panel
  - AI Panel
- Standardize safety visibility:
  - current role
  - approval gate state
  - command impact summary
- Standardize no-dup-shell and no-hidden-runtime-action patterns.

Exit criteria:
- Canonical UX pattern approved and documented.
- Applied first to lowest-risk pilot surface before wider rollout.

## Phase 6: Final Implementation Order
1. Freeze baseline and validate current stable state.
2. Complete Publishing authority audit and isolation.
3. Complete Workflows authority audit and isolation.
4. Complete AI Command operating-room audit.
5. Execute helper extraction on largest pages with parity checks.
6. Apply canonical operating-surface UX pattern.
7. Roll out in controlled slices using migration loop:
   - snapshot
   - audit
   - isolate
   - helper extraction
   - shadow compare
   - switch source
   - validate
   - commit

## Non-Goals During This Plan
- No massive rewrite.
- No backend authority rewrite unless a concrete blocker is proven.
- No broad visual redesign before runtime boundary closure.
