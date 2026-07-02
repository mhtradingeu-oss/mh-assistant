# Operations Shared Scaffold Step 2 UX Contract

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only UX contract for shared Operations Centers consolidation
Prerequisite: Step 1 audit committed (`e4afdf3`)

Doctrine:
- Backend owns operational authority.
- Frontend projects operational authority.

References:
- audits/frontend/operations-centers/OPERATIONS_SHARED_SCAFFOLD_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_2_UX_CONTRACT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_3_LAYOUT_PATCH_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_4_VISUAL_QA_AUDIT.md
- audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md
- audits/frontend/design-system/FRONTEND_CSS_FOUNDATION_AUDIT.md
- public/control-center/pages/operations-centers.js
- public/control-center/styles/09-operations-centers.css

---

## 1. Executive Summary

This contract defines the target shared UX architecture for Queue Center, Job Monitor, and Notifications before any runtime or CSS implementation work.

Current state:
- Task Center is already migrated to dedicated `renderTaskCenterLayout` and Step 4 refinement.
- Queue Center, Job Monitor, and Notifications still rely on legacy `renderOperationsScaffold`.

Problem:
- Legacy scaffold stacks duplicate hierarchy layers before main operational work:
  - `0. Executive Runtime`
  - `Operations Command Signal`
  - `1. Operations Overview`
  - `2. Current Focus Tab`
- Non-Task pages use `ops-*` structures without a complete shared operations CSS contract.

Contract intent:
- Set one shared, premium, consistent operating-surface standard.
- Preserve all current behavior and authority boundaries.
- Define migration sequence and safety gates for future layout-only runtime passes.

---

## 2. Target Shared Operations Standard

All Operations pages must converge to this six-surface structure:

1. Page Header
- `std-context-ribbon`-based page identity and purpose.
- Project scope and page metrics.
- Optional safe header actions only.

2. System Signal Bar
- Compact cross-center runtime signal strip.
- Supporting context below header (not a competing header).

3. Main View
- Primary list/table/lane content and focus controls.
- Explicit loading/error/empty states.

4. Right Rail
- Persistent secondary context rail.
- Hosts detail, action, and AI surfaces.

5. Action Panel
- Safe L1/L2 actions only during layout-oriented phases.
- L3/L4 controls remain deferred and disabled until approved audits.

6. AI Panel
- Prompt-only guidance and route-to-AI behavior.
- No in-panel execution.

---

## 3. Replacements for Old Numbered Layers

Legacy scaffold layers are replaced as follows:

1. `0. Executive Runtime` -> System Signal Bar
- Keep runtime signal content and route links.
- Reposition as compact supporting strip.

2. `1. Operations Overview` -> Page Header / purpose summary
- Merge overview identity and metric intent into the page header ribbon.
- Avoid separate top-level overview card.

3. `2. Current Focus Tab` -> Main View focus controls
- Focus tabs stay, but become part of Main View controls above the primary data surface.
- Avoid standalone pre-content focus panel.

---

## 4. Shared Renderer Contract

Future runtime target (contract only, no implementation in this step):

1. `renderOperationsPageShell(...)`
- Purpose: shared structural shell for all operations pages.
- Responsibilities:
  - Render six-surface order.
  - Accept page slots/content renderers.
  - Keep semantics and class contract consistent.

2. `renderSystemSignalBar(...)`
- Purpose: shared compact signal strip replacing legacy runtime block posture.
- Responsibilities:
  - Reuse `buildExecutiveRuntimeSignals` output.
  - Preserve route buttons and signal metadata.
  - Keep visual priority below page header.

3. Page-specific main view renderers
- Queue: queue inventory and filters.
- Job: job inventory/lane health and logs context.
- Notifications: alert/inbox grouping and severity control.

4. Page-specific right rail renderers
- Selected item detail renderer (per page).
- Action panel renderer (safe actions only).
- AI panel renderer (prompt-only, route to AI Command).

Contract rule:
- Shared shell owns structure.
- Page renderers own content semantics.
- No change to fetch contracts, handlers, or route IDs.

---

## 5. Per-Page Target Contracts

### 5.1 Queue Center

Target surfaces:
- Header: Queue identity, project scope, queue metrics summary.
- System Signal Bar: shared cross-center status context.
- Main View: queue list/table + focus/filter controls.
- Right Rail: selected queue item detail + action panel + AI panel.

Behavior preservation:
- Keep current filtering, selection, refresh, route-open actions, and AI prompt routing.

### 5.2 Job Monitor

Target surfaces:
- Header: Job monitor identity, health and counts.
- System Signal Bar: shared cross-center status context.
- Main View: job status/lane or table-driven operational inspection.
- Right Rail: selected job detail + action panel + AI panel.

Behavior preservation:
- Keep status focus logic, kind filtering, refresh flow, route navigation, and AI prompt routing.

### 5.3 Notifications

Target surfaces:
- Header: Notification center identity and alert/inbox metrics.
- System Signal Bar: shared cross-center status context.
- Main View: severity/priority grouped alert stream + focus controls.
- Right Rail: selected notification detail + action panel + AI panel.

Behavior preservation:
- Keep severity filters, focus modes, mark-read behavior, route navigation, and AI prompt routing.

---

## 6. Queue Center Target Contract

Queue Center must provide:

1. Header metrics
- Visible item count.
- Queue pressure summary by queue type.
- Active/total indicators.

2. Queue groups / visible items
- Main list/table remains the primary work surface.
- Route ownership remains explicit per row/item.

3. Focus tabs
- Queue-type focus tabs remain in Main View control area.

4. Search/filter
- Search and status filtering remain inline and persistent.

5. Selected queue item detail
- Right-rail detail card reflects current selected item.

6. Action Panel (safe actions only)
- Allowed: refresh and open owner page.
- No mutation actions activated.

7. AI Panel (prompt-only)
- Keep triage/explanation prompts.
- Route to AI Command only.

---

## 7. Job Monitor Target Contract

Job Monitor must provide:

1. Header metrics
- Health state.
- Running/completed/failed counts.

2. Status/lane view
- Main View presents status-focused operational scan (table/lane hybrid acceptable).
- Focus controls remain visible and stateful.

3. Job detail panel
- Right-rail detail card shows owner, kind, retries, state, updated time.

4. Action Panel (safe actions only)
- Allowed: refresh and open job context routes.
- No retry/force/stop/destructive job actions activated.

5. AI Panel (prompt-only)
- Keep failure triage and health summary prompts.
- Route to AI Command only.

---

## 8. Notifications Target Contract

Notifications must provide:

1. Header metrics
- Active alerts, unread inbox, critical count, approval count.

2. Priority/severity grouping
- Main View supports focus modes and severity filtering.
- Grouping and ordering prioritize critical urgency.

3. Notification detail panel
- Right-rail detail card shows selected signal context and owner route.

4. Action Panel (safe actions only)
- Allowed: refresh, open source route, mark-read where currently supported.
- No mutation/destructive authority actions introduced.

5. AI Panel (prompt-only)
- Keep urgency ranking and interpretation prompts.
- Route to AI Command only.

---

## 9. CSS Contract

### 9.1 Shared operations classes (future shared ownership)

Future shared class families for all operations pages:
- Layout shell: `ops-shell`, `ops-workspace`, `ops-layout-grid`, `ops-main-column`, `ops-right-rail`
- System signal: `ops-executive-strip`, `ops-runtime-signal-grid`, `ops-runtime-signal`
- Main controls: `ops-focus-tabs`, `ops-focus-tab`, `ops-toolbar`
- Main data surface: `ops-table-wrap`, `ops-table`, `ops-select-link`
- Right rail: `ops-detail-*`, `ops-action-panel`, `ops-ai-panel`, `ops-action-row`

### 9.2 Page-specific classes (must remain page-local)

Page-local classes should remain scoped under `[data-page="..."]` when semantics differ:
- Queue-specific display variants
- Job log/lane variants
- Notification alert grouping variants

### 9.3 What `09-operations-centers.css` should eventually own

`09-operations-centers.css` should become canonical home for:
- Shared operations structural layout rules.
- Shared operations panel rhythm and spacing.
- Shared system signal bar presentation.
- Shared operations table and right-rail baseline patterns.

### 9.4 What remains task-only for now

Task-only refined overrides remain scoped for now:
- Task-specific compact chips and wording treatment.
- Task-specific rail width tuning.
- Task-specific deferred-control visual micro-adjustments.

### 9.5 What must not be deleted yet

Do not delete yet:
- Legacy `renderOperationsScaffold`.
- Existing non-Task `ops-*` usage in render paths.
- Task-specific scoped rules that currently stabilize Task Center.

Deletion gates:
- All non-Task pages migrated and validated.
- Shared CSS ownership established and QA-passed.

---

## 10. Migration Sequence

Planned sequence:

1. Step 3A: Queue Center layout-only patch
- Move Queue Center to shared standard shell and zone order.
- Preserve behavior and route/data contracts.

2. Step 3B: Job Monitor layout-only patch
- Move Job Monitor to shared standard shell and zone order.
- Preserve behavior and route/data contracts.

3. Step 3C: Notifications layout-only patch
- Move Notifications to shared standard shell and zone order.
- Preserve behavior and route/data contracts.

4. Step 4: Shared CSS consolidation
- Promote shared operations classes into canonical shared ownership in `09-operations-centers.css`.
- Keep page-local deltas scoped.

5. Step 5: Operations final QA
- Cross-page visual hierarchy QA.
- Behavior regression QA.
- State and responsive QA.
- Safety and non-negotiable verification.

---

## 11. Safety Rules

For all future runtime passes under this contract:

- No mutations enabled without required audits.
- No backend changes.
- No route behavior changes.
- No response-shape changes.
- No destructive action enablement.
- Preserve existing filters, navigation, selection, and AI prompt routing behavior.
- Keep authority boundaries intact: backend decides, frontend projects.

---

## 12. Do-Not-Touch List

Do not modify during shared scaffold consolidation passes:
- Backend endpoints and backend handlers.
- API signatures and payload shapes in operations fetch/update paths.
- Route IDs, route semantics, or route-level navigation contracts.
- Existing `data/projects` files or project data content.
- Global shell behavior (topbar/sidebar/command layer/AI dock/loading overlay).
- Access-key/auth-related behavior.

Also do not:
- Add new handler families for mutation in this phase.
- Wire deferred mutation buttons.
- Delete old shared scaffold before all three page migrations are validated.

---

## 13. Validation Plan for Future Runtime Passes

For each migration step (3A, 3B, 3C, 4, 5), run:

1. Syntax and file safety
- `node --check public/control-center/pages/operations-centers.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`

2. Repo hygiene
- `git status --short`
- `git diff --stat`
- `git status --short data/projects`

3. Behavior checks (manual/runtime)
- Focus tabs switch and persist expected selection behavior.
- Search/filter controls update visible rows/groups correctly.
- Selected-item detail panel updates correctly.
- Safe actions keep existing route/navigation behavior.
- AI panel prompts still route to AI Command only.

4. State checks
- Explicit loading, error, empty, and populated states are visible and coherent.

5. Isolation checks
- Non-target operations pages remain behaviorally unchanged until their designated migration step.
- No cross-page CSS leakage from page-local overrides.

---

## 14. No-Change Confirmation

This Step 2 document is documentation-only.

Confirmed in this step:
- No backend changes.
- No `data/projects` changes.
- No runtime frontend file changes.
- No CSS changes.
- No handler additions.
- No route behavior changes.
- No API contract changes.
- No action wiring changes.
- Old scaffold not deleted.

This file is the required contract baseline before any shared scaffold runtime/CSS implementation work.
