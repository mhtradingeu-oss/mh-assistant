# Task Center Step 2 UX Contract

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only UX contract (no runtime, CSS, backend, or data changes)
Prerequisite: Step 1 audit committed (`d2516f2`)

References:
- audits/frontend/operations-centers/TASK_CENTER_STEP_1_OPERATING_SURFACE_AUDIT.md
- audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md
- audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md
- audits/frontend/design-system/FRONTEND_CSS_FOUNDATION_AUDIT.md
- audits/frontend/design-system/APP_SHELL_LAYER_AUDIT.md
- public/control-center/pages/operations-centers.js
- public/control-center/api.js

Doctrine:
- Backend owns operational authority.
- Frontend projects operational authority.

---

## 1. Executive Summary

This contract defines the target Task Center user experience before any implementation patch.

Step 1 established that Task Center is safe and read-oriented but only partially aligned with the four-zone operating surface standard. Step 2 specifies the exact target layout, behavior contracts, safety boundaries, and deferred mutation posture for the future layout-only implementation.

This file is normative for Step 3 and later. Any implementation that diverges from this contract requires an explicit update to this document first.

---

## 2. Target Task Center UX Purpose

Task Center must make task operations understandable and actionable without expanding authority.

Primary outcomes:
- Make task state understandable within 5 seconds.
- Surface next best work clearly.
- Highlight blocked and overdue risk early.
- Guide users with AI prompts without executing commands in-panel.

Non-goals for Step 3:
- No mutation controls become active.
- No backend contract changes.
- No route behavior changes.

---

## 3. Four-Zone Target Layout

Target structure:

1. Header Zone
2. Main View Zone
3. Action Panel Zone (right rail)
4. AI Panel Zone (right rail)

Desktop intent:
- Header spans full width.
- Main View in left column.
- Right rail stacks: Selected Task Details, Action Panel, AI Panel.

Narrow viewport intent:
- Header -> Main View -> Selected Task Details -> Action Panel -> AI Panel.

Section 0 executive runtime strip may remain above the four zones as a shared Operations Centers surface, provided it does not replace Header obligations.

---

## 4. Header Zone Contract

Header must use shared standard shell classes where available.

Required:
- `std-context-ribbon` root.
- Eyebrow: `TASK CENTER`.
- Title: `Task Center`.
- Project scope label (current project in context).
- Short description (operational purpose).
- Metrics chips in `std-context-metrics`:
  - Total tasks
  - Open
  - Blocked
  - Overdue
  - Due soon

Optional safe action:
- A header-level `Refresh` button may remain if implemented as L2 safe non-destructive fetch only.

Rules:
- Header shows identity/context only.
- No mutation controls in header.
- No heavy fetch orchestration in header render logic.

---

## 5. Main View Zone Contract

Main View must remain the operational reading surface for task backlog state.

Required controls:
- Focus tabs (All/Open/Blocked/Overdue/Due Soon).
- Search input.
- Priority filter.
- Owner filter.
- Source filter.

Required content:
- Task table as primary data surface.
- Selected row state (single active row highlight).

Required data-state rendering:
- Empty state (no tasks available).
- Filtered-empty state (no tasks match active filters).
- Loading state (explicit pending indicator for live fetch).
- Inline error state (in-page card, not toast-only).

Rules:
- Main View remains read/projection focused.
- No inline mutation controls become active.

---

## 6. Right Rail Contract

Right rail must include three stacked surfaces:

1. Selected Task Details card
2. Action Panel
3. AI Panel

Required behavior:
- Selected Task Details updates with active row selection.
- If no selection exists, show explicit details empty state.
- Right rail remains visible in desktop layout and stacks below Main View on narrow viewports.

---

## 7. Action Panel Contract

Action Panel is safe-intent first.

### 7.1 Active L1/L2 actions

Active and enabled:
- Refresh Task Center
- Open Linked Work
- Copy selected task summary (only if safe and non-mutating)

### 7.2 Deferred L3/L4 actions

Must render as disabled controls with clear deferred labels:
- Update status
- Reassign owner
- Change priority
- Update due date
- Delete task

Deferred control requirements:
- Disabled at DOM level (`disabled` attribute).
- Clear label indicating deferral reason (mutation safety pass required).
- No event handlers wired in Step 3.

---

## 8. AI Panel Contract

AI Panel is read-only and prompt-routing only.

Required behavior:
- Show prompts only.
- No command execution inside Task Center.
- Route to AI Command with prepared prompt text.

Suggested prompts:
- Prioritize backlog
- Unblock selected task
- Summarize execution risk
- Explain owner workload
- Identify overdue risk

Rules:
- AI can suggest, not execute.
- All actions are explicit user clicks.
- No autonomous side effects from the panel.

---

## 9. Data State Contract

Task Center must explicitly model and render these states:

1. Cached render
2. Live fetch pending/loading
3. Empty
4. Filtered-empty
5. Fetch error
6. Populated

State expectations:
- Cached render appears immediately from current state.
- Pending/loading surfaces inline in Main View while live fetch is in-flight.
- Fetch errors show inline error card with recovery guidance.
- Empty and filtered-empty have distinct copy.

---

## 10. CSS Contract (Future Implementation Target)

No CSS file is created or modified in this step. This section defines Step 3 targets only.

Future file:
- `public/control-center/styles/09-operations-centers.css`

Classes to define in future implementation:
- `ops-shell`
- `ops-workspace`
- `ops-layout-grid`
- `ops-main-column`
- `ops-right-rail`
- `ops-focus-tabs`
- `ops-focus-tab`
- `ops-toolbar`
- `ops-table-wrap`
- `ops-table`
- `ops-detail-card`
- `ops-action-panel`
- `ops-ai-panel`
- `ops-deferred-action`

Rules:
- Reuse `std-*` where available.
- Avoid semantic reuse of `home-*` classes for operations pages.
- Keep alignment with token and layer system from P0 audits.

---

## 11. Accessibility Contract

Required accessibility baseline:
- Clear heading hierarchy for Header, Main View, Action Panel, AI Panel.
- Predictable keyboard tab order: Header -> Main View controls -> table row actions -> right rail actions -> AI prompts.
- Disabled deferred actions must have clear labels and visible disabled affordance.
- Inline loading/error should support `aria-live` where needed for state announcement.
- All action buttons require explicit, understandable text labels.

---

## 12. Safety Contract

Step 3 and onward must preserve:
- No mutations in Step 3 layout patch.
- No backend changes.
- No API contract changes.
- No `data/projects` mutation.
- No AI autonomous execution.

Authority boundary:
- Backend remains authority owner.
- Frontend remains projection and intent surface only.

---

## 13. Future Implementation Sequence

Execution sequence:

1. Step 3: Layout-only patch
2. Step 4: Panel shell refinement
3. Step 5: First safe action (if not already present)
4. Step 6: Final audit

Gate condition:
- Each step must preserve non-negotiables and safety contract above.

---

## 14. Do-Not-Touch List

Do not modify during Step 3 layout implementation:
- Backend endpoints and handlers.
- API contracts for Task Center payloads.
- Route IDs or route behavior semantics.
- Access-key enforcement patterns.
- `data/projects` content.
- Global shell layers (sidebar/topbar/command bar/AI dock/loading overlay).

Also do not:
- Activate deferred mutation actions.
- Add autonomous AI execution behavior.

---

## 15. No-Change Confirmation

This Step 2 contract is documentation-only.

Confirmed in this step:
- No runtime frontend JS files modified.
- No CSS files modified.
- No backend files modified.
- No route behavior changed.
- No handlers added.
- No API contracts changed.
- No actions newly wired.
- No `data/projects` changes.

This document is the approved target specification for future Step 3 layout-only implementation work.
