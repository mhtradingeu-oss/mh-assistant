# Operations Shared Scaffold Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit of shared Operations Centers scaffold

Doctrine:
- Backend owns operational authority.
- Frontend projects operational authority.

References inspected:
- public/control-center/pages/operations-centers.js
- public/control-center/styles/09-operations-centers.css
- public/control-center/styles/08-components-foundation.css
- public/control-center/styles/12-pages.css
- public/control-center/styles/14-page-standard.css
- audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md
- audits/frontend/design-system/FRONTEND_CSS_FOUNDATION_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_3_LAYOUT_PATCH_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_4_VISUAL_QA_AUDIT.md

---

## 1. Executive Summary

The Operations Centers surface is currently split across two layout paradigms:

- Task Center uses a dedicated operating-surface layout via `renderTaskCenterLayout`.
- Queue Center, Job Monitor, and Notification Center still render through legacy `renderOperationsScaffold`.

This preserves old layer duplication:
- 0. Executive Runtime
- Operations Command Signal
- 1. Operations Overview
- 2. Current Focus Tab

Result:
- Repeated header-like blocks before the main view.
- Inconsistent page anatomy across System pages.
- Shared scaffold markup that does not have matching shared CSS definitions.

Primary conclusion:
The next consolidation step must define and enforce one-way layout ownership for all Operations pages:
- Page Header
- System Signal Bar
- Main View
- Right Rail
- Action Panel
- AI Panel

---

## 2. Current Shared Scaffold Map

### 2.1 `renderExecutiveRuntimeStrip`

Purpose:
- Builds cross-center runtime signal strip from live operations state.
- Computes signals for Runtime, Queue Pressure, Failed Jobs, Critical Alerts, Approvals, Publishing, Providers, Claim Risk, Inbox.

Called by:
- `renderOperationsScaffold` with defaults:
  - Kicker: `0. Executive Runtime`
  - Title: `Operations Command Signal`
  - Badge: `Live context`
- `renderTaskCenterLayout` with Task-specific labels:
  - Kicker: `System Runtime`
  - Title: `System Signal`
  - Badge: `Supporting context`

### 2.2 `renderOperationsScaffold`

Purpose:
- Legacy shared six-block page composition used by non-Task centers.

Fixed section order:
1. Executive Runtime strip
2. Operations Overview panel
3. Current Focus Tab panel
4. Item List/Table + Selected Item Details split
5. Action/Resolution panel
6. Operations AI Assistant panel

Consumers:
- Queue Center
- Job Monitor
- Notification Center

### 2.3 `renderTaskCenterLayout`

Purpose:
- Dedicated operating-surface implementation aligned with standard zones.

Structure:
- Header zone: `std-context-ribbon`
- Supporting signal zone: Task-specific `renderExecutiveRuntimeStrip`
- Main and right rail: `ops-layout-grid`
  - Main View
  - Selected Task
  - Action Panel
  - AI Panel

### 2.4 Queue Center render path

Path:
- `queueCenterRoute.render`
- `renderQueueCenter`
- `renderOperationsScaffold`

Queue-specific content passed into shared scaffold:
- Queue metrics and filters
- Queue table
- Selected queue details
- Queue resolution actions
- AI prompt set

### 2.5 Job Monitor render path

Path:
- `jobMonitorRoute.render`
- `renderJobMonitor`
- `renderOperationsScaffold`

Job-specific content passed into shared scaffold:
- Job health metrics
- Job table and logs
- Selected job details
- Execution inspection actions
- AI prompt set

### 2.6 Notifications render path

Path:
- `notificationCenterRoute.render`
- `renderNotificationCenter`
- `renderOperationsScaffold`

Notification-specific content passed into shared scaffold:
- Alert/inbox metrics
- Alert table
- Selected alert details
- Notification actions (including mark-read)
- AI prompt set

---

## 3. Old Duplicated UX Layers

Duplicated legacy layers still present in shared scaffold:

- Layer A: `0. Executive Runtime`
  - A system signal surface rendered above page content.
- Layer B: `Operations Command Signal`
  - Heading identity for Layer A.
- Layer C: `1. Operations Overview`
  - A second header-style summary surface.
- Layer D: `2. Current Focus Tab`
  - A third pre-content panel before the main list.

Why this is duplication:
- Standard already expects a single Page Header zone with context and metrics.
- Legacy scaffold introduces two additional top-level summary sections before actual work surface.
- This creates stacked context surfaces and weakens hierarchy.

---

## 4. Shared vs Page-Specific Responsibilities

Shared today:
- Utility and session helpers:
  - `ensureSession`, `filterBySearch`, route/selection/focus binding helpers.
- Shared AI prompt routing behavior via `bindOpsAssistantButtons`.
- Shared runtime signal computation and strip renderer.
- Shared legacy scaffold shell (`renderOperationsScaffold`).

Page-specific today:
- Data fetch entry points and route metadata.
- Filter state keys and focused modes.
- Table columns and row semantics.
- Details cards and action content.
- Prompt copy per page.

Problem boundary:
- Shared render shell and shared CSS contract are out of sync.
- Non-Task pages depend on many `ops-*` classes without corresponding shared style definitions.

---

## 5. CSS Map

### 5.1 Shared ops classes (currently reliable)

From foundational styles:
- Generic shared primitives from `08-components-foundation.css`:
  - `.panel`, `.panel-header`, `.card-badge`, `.btn`, `.quick-actions`, `.empty-box`, `.loading-state`, `.error-state`, `.command-input`, `.sidebar-select`

From page standard:
- `14-page-standard.css`:
  - `std-context-*` families (used by Task Center header)

### 5.2 Task-only scoped classes

In `09-operations-centers.css`, all selectors are scoped under `[data-page="task-center"]`.
These include:
- Layout: `.ops-shell`, `.ops-workspace`, `.ops-layout-grid`, `.ops-main-column`, `.ops-right-rail`
- Runtime strip refinements: `.ops-executive-strip`, `.ops-runtime-signal*`
- Focus and toolbar: `.ops-focus-tabs`, `.ops-focus-tab`, `.ops-toolbar`
- Table/select: `.ops-table*`, `.ops-select-link`
- Right rail: `.ops-detail-grid`, `.ops-action-panel`, `.ops-ai-panel`, `.ops-deferred-*`
- Prompt text: `.ops-prompt-title`, `.ops-prompt-meta`

### 5.3 Old or unscoped classes still used by non-Task pages

Used heavily in `renderOperationsScaffold` and non-Task renderers, but not currently backed by shared Operations CSS rules:
- `.ops-workspace-grid`
- `.panel-span-2`
- `.ops-resolution-grid`
- `.ops-metric-grid`, `.ops-metric-card`
- `.ops-toolbar-compact`
- `.ops-detail-stack`, `.ops-detail-summary`
- `.ops-mini-list`, `.ops-mini-item`
- `.ops-log-list`, `.ops-log-item`, `.ops-log-meta`
- `.ops-lane`, `.ops-lane-head`, `.ops-list`, `.ops-list-item`
- `.ops-alert-list`, `.ops-alert-item`, `.ops-alert-head`

Implication:
- Queue/Job/Notifications are functionally complete, but visually constrained by generic panel/base styles rather than a cohesive shared operations style layer.

### 5.4 Missing classes (contract gap)

Missing as shared canonical classes for all operations pages:
- Shared two-column operations layout container
- Shared right rail stack container
- Shared main-view table rhythm and row density
- Shared selected-item card shells
- Shared action panel and AI panel shell variants
- Shared compact system signal bar style

### 5.5 Duplicate or conflicting selectors

Conflict patterns relevant to operations migration:
- `08-components-foundation.css` defines `.std-page-shell` as grid while `14-page-standard.css` redefines as flex.
- Task CSS scopes `.ops-shell` and `.ops-workspace` only for Task page, so same class names in other pages do not get equivalent behavior.
- Nested selector `.ops-detail-card .ops-detail-card` in Task styles is semantically overloaded and increases future ambiguity during extraction.

---

## 6. Desired One-Way Standard

Canonical target for all Operations pages:

1. Page Header
- Single `std-context-ribbon` identity and page metrics.
- No secondary overview block above main work.

2. System Signal Bar
- Compact supporting strip directly below header.
- Reuses executive runtime signal data and route buttons.
- Must be visually subordinate to page header.

3. Main View
- Primary table/list and filters.
- Explicit loading, error, and empty states.

4. Right Rail
- Stable rail containing selected-item details plus two panel zones.

5. Action Panel
- Safe and route-aware actions only for layout pass.
- Deferred mutation actions rendered disabled where applicable.

6. AI Panel
- Prompt-only guidance and AI navigation.
- No autonomous execution.

One-way rule:
- Legacy numbered blocks (`1. Operations Overview`, `2. Current Focus Tab`) are retired in future render path.
- Page-level semantics own identity; scaffold only provides structure and slots.

---

## 7. Per-Page Migration Strategy

### 7.1 Queue Center

Plan:
- Replace `renderOperationsScaffold` with a dedicated `renderQueueCenterLayout` using standard zones.
- Keep queue data filtering, selection, routing, and refresh logic unchanged.
- Move queue-specific content into Main View and Right Rail slots.

Safe reuse:
- Existing queue metrics, table rows, and actions content blocks.

### 7.2 Job Monitor

Plan:
- Replace `renderOperationsScaffold` with `renderJobMonitorLayout`.
- Keep health-state logic, logs list, and route actions unchanged.
- Promote selected-job diagnostics into Right Rail detail + Action panel.

Safe reuse:
- Existing metrics, logs mapping, and prompt generation.

### 7.3 Notifications

Plan:
- Replace `renderOperationsScaffold` with `renderNotificationCenterLayout`.
- Keep alert assembly, severity filtering, and mark-read behavior unchanged.
- Keep list/detail/action semantics intact, only relocate into standard zones.

Safe reuse:
- Existing focus modes, alert grouping, mark-read wiring, prompt generation.

---

## 8. What Can Be Reused From Task Center

High-confidence reusable assets:
- Header-zone pattern using `std-context-ribbon`.
- Compact system signal positioning under header.
- Main + right rail grid (`ops-layout-grid` concept).
- Panel zone naming and semantics:
  - Main View
  - Selected item
  - Action Panel
  - AI Panel
- Deferred mutation presentation pattern (disabled buttons with explicit reason text).

Reuse boundary:
- Preserve Task-specific copy, columns, and filters as page-local.
- Reuse structure and class contract, not Task-specific wording.

---

## 9. What Must Be Extracted Later

Shared helper/render extraction targets (Step 2+ implementation phase):

- `renderOperationsStandardShell(...)`
  - Standard zone wrapper and slot injection.

- `renderSystemSignalBar(...)`
  - Compact runtime signal strip shared by all operations pages.

- Shared panel-slot renderers:
  - `renderOpsMainViewSlot(...)`
  - `renderOpsRightRailSlot(...)`
  - `renderOpsActionPanelSlot(...)`
  - `renderOpsAiPanelSlot(...)`

- Shared CSS contract file for operations scaffold class families:
  - Unscoped reusable `ops-*` layout classes for all operations pages.
  - Keep page-level overrides scoped by `[data-page="..."]` only for local differences.

Important constraint:
- Extraction is structural only. It must not alter handlers, routes, or backend contracts.

---

## 10. What Must Not Be Deleted Yet

Do not delete in Step 2 planning phase:
- `renderExecutiveRuntimeStrip` data/signal logic.
- Non-Task route render functions and their fetch/reload wiring.
- Existing selection/filter/search handlers.
- Existing mark-read behavior in Notification Center.
- Existing route IDs and meta objects.
- Legacy scaffold function until all three non-Task pages are migrated and validated.

Reason:
- These pieces still anchor behavior and operational continuity.

---

## 11. Risk Classification

High risk:
- Re-layout of three pages without introducing behavior drift.
- CSS contract consolidation where classes currently have partial or no shared style ownership.

Medium risk:
- Preserving visual hierarchy while keeping runtime signal discoverable.
- Maintaining responsive behavior parity across operations pages.

Low risk:
- Prompt-only AI panel consistency.
- Header copy/metric normalization.

Behavioral regression risks to watch:
- Lost route buttons from runtime signals.
- Selected-item persistence after filter changes.
- Broken mark-read bindings in Notification Center.
- Non-Task pages visually degrading due to class extraction mis-scope.

---

## 12. Recommended Step 2: Operations Shared Scaffold UX Contract

Create and approve:
- `audits/frontend/operations-centers/OPERATIONS_SHARED_SCAFFOLD_UX_CONTRACT.md`

Contract must define:
- Standard zone map and strict order.
- Canonical shared class names and ownership file.
- Slot API for page-specific content injection.
- Accessibility baseline for action/deferred controls.
- Responsive breakpoints and right-rail collapse behavior.
- Explicit do-not-change list:
  - Handlers
  - Routes
  - API contracts
  - Backend authority boundaries

Recommended consolidation sequence:
1. Approve contract and class map.
2. Extract shared shell and signal bar renderer.
3. Migrate Queue Center to standard shell.
4. Migrate Job Monitor to standard shell.
5. Migrate Notifications to standard shell.
6. Remove legacy numbered overview/focus blocks.
7. Remove legacy scaffold only after all pages pass validation.

---

## 13. No-Change Confirmation

Confirmed for this audit task:
- Documentation-only work.
- No backend files changed.
- No `data/projects` changes.
- No runtime frontend code changes.
- No CSS changes.
- No handler additions.
- No route behavior changes.
- No API contract changes.

This file records audit findings only and prepares Step 2 UX contract work.

Update:
- Step 2 UX Contract created: `audits/frontend/operations-centers/OPERATIONS_SHARED_SCAFFOLD_UX_CONTRACT.md`
