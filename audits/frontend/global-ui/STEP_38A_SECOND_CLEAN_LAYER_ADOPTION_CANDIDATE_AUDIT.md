# STEP 38A — Second Clean Layer Adoption Candidate Audit
Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: AUDIT ONLY / documentation-only

## Executive summary
Queue Center is confirmed as the safe and preferred second candidate for STEP 38B clean-layer opt-in adoption.

Queue Center shares the same Operations surface architecture and binding model as Task Center (the first opt-in candidate), making the structural mapping to clean-layer primitives nearly identical. The render hierarchy mirrors Task Center's wrapper/surface segmentation, all interactive behavior is anchored by preserved IDs and data attributes, and the clean layer is opt-in, namespaced, and inert by default.

The single structural difference from Task Center is the main toolbar: Queue Center uses `#queueCenterSearch` + `#queueCenterStatus` only (no owner/source selects), and the Action Panel includes an `ops-mini-list` / `ops-mini-item` block for queue-type count breakdown. Neither difference introduces additional risk — both elements are non-critical wrappers that can be left without clean-layer classes.

Recommended risk classification for STEP 38B: LOW-MEDIUM (UI regression risk only, no backend/handler contract changes when preservation rules are respected).

## Files inspected
- public/control-center/pages/operations-centers.js
- public/control-center/styles/09-operations-centers.css
- public/control-center/styles/15-clean-operating-layer.css

## Candidate page/section
- Candidate page: Operations
- Candidate section: Queue Center route (`data-page="queue-center"`)
- Primary render functions:
  - `renderQueueCenterLayout(...)`
  - `renderQueueCenter(...)`
  - `queueCenterRoute.render(...)`

## Current UI structure (Queue Center)
Queue Center render hierarchy in operations-centers.js (`renderQueueCenterLayout`):

1. `section.page.is-active[data-page="queue-center"]`
2. `div.ops-shell.ops-workspace`
3. `section.std-context-ribbon` (header/context ribbon)
4. `section.panel.ops-executive-strip` (cross-center runtime signal strip, via `renderExecutiveRuntimeStrip`)
5. `div.ops-layout-grid`
6. `article.panel.ops-main-column`
7. `aside.ops-right-rail`
8. `section.panel.ops-detail-card`
9. `section.panel.ops-action-panel`
10. `section.panel.ops-ai-panel`

Observed current visual surfaces:
- Container and layout shells: `ops-shell`, `ops-workspace`, `ops-layout-grid`, `ops-main-column`, `ops-right-rail`
- Card/surface regions: `panel`, `std-context-ribbon`, `ops-executive-strip`, `ops-detail-card`, `ops-action-panel`, `ops-ai-panel`
- Focus/tab controls: `ops-focus-tabs`, `ops-focus-tab`, `is-active`
- Toolbar controls: `ops-toolbar`, `ops-toolbar-compact`, `command-input`, `sidebar-select`
- Table surfaces: `ops-table-wrap`, `ops-table`, `ops-state-row`, `ops-queue-state`
- Detail/action rows: `ops-detail-stack`, `ops-detail-summary`, `ops-action-row`, `ops-mini-list`, `ops-mini-item`, `ops-deferred-list`, `ops-deferred-action`
- Interactive links/buttons: `ops-select-link`, `btn` variants, `quick-action-btn`, `ops-runtime-signal`
- Status markers: `card-badge` with tone classes (`danger`/`warning`/`success`/`neutral`), `error-state ops-queue-state`
- Selection state: `tr.is-selected`

## Action/handler/API inventory

### Handler and selector contract that must be preserved
Queue Center-specific IDs and selectors with bound handlers:

- `#queueCenterRefreshBtn` (click → `refreshQueueCenter`)
- `#queueCenterRefreshBtnHeader` (click → `refreshQueueCenter`)
- `#queueCenterSearch` (input → search filter)
- `#queueCenterStatus` (change → status filter)
- `[data-ops-focus]` (focus-tab switching — shared handler)
- `[data-ops-select]` (table-row/selection switching — shared handler)
- `[data-ops-route]` (route navigation buttons — shared handler)
- `[data-ops-ai-open]` (AI workspace open — shared handler)
- `[data-ops-ai-prompt]` (AI prompt handoff — shared handler)

Additional Queue Center route-critical attributes:
- `data-page="queue-center"`
- `tr.is-selected` (selected row visual treatment)
- `item._opsKey` (internal selection consistency keying)

Note: Queue Center does not have `#queueCenterOwner` or `#queueCenterSource` selects. The toolbar is limited to search + status filter only. This makes the binding surface slightly smaller than Task Center.

### API/backend contract that must not change
Queue Center live fetch path and usage:
- `context.fetchProjectQueueCenter(projectName)`
- `api function fetchProjectQueueCenter(projectName)`
- endpoint: `/media-manager/project/{projectName}/queue-center`

Related operations-center fetches (shared runtime strip / adjacent centers):
- `fetchProjectTaskCenter` → `/media-manager/project/{projectName}/task-center`
- `fetchProjectJobMonitor` → `/media-manager/project/{projectName}/job-monitor`
- `fetchProjectNotificationCenter` → `/media-manager/project/{projectName}/notification-center`

Context wiring from app render context (must remain unchanged):
- `fetchProjectQueueCenter`
- `fetchProjectTaskCenter`
- `fetchProjectJobMonitor`
- `fetchProjectNotificationCenter`

## Current CSS dependencies (09-operations-centers.css)
Queue Center visuals are heavily `data-page`-scoped and depend on existing class names. All selectors are prefixed with `[data-page="queue-center"]`:

- `.ops-shell` / `.ops-workspace` — container layout
- `.ops-layout-grid` — two-column grid layout
- `.ops-main-column` — main article column
- `.ops-right-rail` — right sidebar rail
- `.panel` and `.panel-header` descendants — card/surface styling
- `.std-context-ribbon`, `.std-context-description`, `.std-context-chip`, `.std-context-btn` — header ribbon and metrics chips
- `.ops-executive-strip` and runtime signal descendants: `.ops-executive-strip .panel-header`, `.ops-executive-strip .panel-kicker`, `.ops-executive-strip .panel-header h3`, `.ops-executive-strip .panel-header p`, `.ops-executive-strip .card-badge.neutral`
- `.ops-runtime-signal-grid`, `.ops-runtime-signal`, `.ops-runtime-signal strong`, `.ops-runtime-signal small`, `.ops-runtime-signal .card-badge`
- `.ops-focus-tabs` / `.ops-focus-tab` / `.ops-focus-tab.is-active` — tab switching bar
- `.ops-toolbar`, `.ops-toolbar .command-input`, `.ops-toolbar .sidebar-select` — toolbar inputs
- `.ops-main-column .empty-box` — empty state placeholder
- `.ops-queue-state`, `.ops-queue-state strong`, `.ops-queue-state span` — error/state display
- `.ops-state-row td`, `.ops-state-row .ops-queue-state` — state table row
- `.ops-table-wrap`, `.ops-table`, `.ops-table th`, `.ops-table td`, `.ops-table tr.is-selected td` — main data table
- `.ops-select-link` — item selection button in table
- `.ops-detail-card`, `.ops-action-panel`, `.ops-ai-panel` — right rail panels
- `.ops-detail-grid` — detail layout within right rail
- `.ops-action-row` — action button row
- `.ops-right-rail .btn` — right-rail button sizing
- `.ops-mini-list`, `.ops-deferred-list` — queue count breakdown and deferred action list
- `.ops-mini-item`, `.ops-mini-item span` — per-queue-type count row
- `.ops-deferred-action` — disabled deferred action buttons
- `.quick-actions`, `.quick-actions .quick-action-btn` — AI prompt chips
- `.ops-prompt-title`, `.ops-prompt-meta` — AI prompt labels
- Responsive overrides under `@media max-width 1180px` and `820px`

Important dependency implication:
- All Queue Center styling relies on existing legacy class names and `data-page` scoping. STEP 38B must be strictly additive and must not remove, rename, or reorder any existing classes or attributes.

## Clean-layer compatibility check (15-clean-operating-layer.css)
Relevant clean opt-in primitives available:

- `mhos-clean-root`, `mhos-clean-shell` — container-level opt-in and shell layout
- `mhos-clean-stack` — vertical flex stack with gap
- `mhos-clean-surface` (+ `is-raised`) — surface background, border, radius
- `mhos-clean-title` — primary heading color
- `mhos-clean-copy` — secondary copy color
- `mhos-clean-eyebrow` — muted eyebrow label
- `mhos-clean-rail` — sidebar/rail flex layout
- `mhos-clean-pill` (+ `is-ai`, `is-info`) — informational chip/tag

Safety contract in STEP 36 clean layer explicitly supports this approach:
- No global element resets
- No overrides for legacy shared classes
- No page-targeting selectors
- No behavior coupling
- All selectors use `:where()` for zero-specificity cascade safety

## Risk classification
Overall classification for Queue Center as second opt-in target: **LOW-MEDIUM**

Risk breakdown:
| Area | Risk | Rationale |
|---|---|---|
| Backend/API contract | LOW | No API code is touched |
| Handler breakage | LOW | IDs and data attributes preserved exactly |
| Visual regression | MEDIUM | Additive class stacking on existing scoped surfaces |
| Cross-page regression | LOW | Clean layer is opt-in and namespaced with zero-specificity `:where()` selectors |
| Structural novelty | LOW | Queue Center architecture is nearly identical to Task Center (already proven) |

The `ops-mini-list` / `ops-mini-item` block is Queue Center-specific and not present in Task Center. These elements are display-only read surfaces (queue type counts) and carry no handler bindings. They are safe to leave without clean-layer classes in STEP 38B.

## Preservation requirements (must hold for STEP 38B)
1. Do not change any handler logic, event binding, or function behavior.
2. Do not remove or rename any existing IDs (`queueCenterRefreshBtn`, `queueCenterRefreshBtnHeader`, `queueCenterSearch`, `queueCenterStatus`) or data attributes.
3. Do not change API call names, endpoint paths, or `projectName` flow.
4. Do not remove existing Queue Center classes currently targeted by `09-operations-centers.css`.
5. Only add `mhos-clean-*` classes to non-critical wrapper/surface elements.
6. Do not alter copy, provenance messaging, or deferred-mutation safety language.
7. No CSS edits in STEP 38B if following this minimal class-only adoption pass.
8. Do not touch `ops-mini-list`, `ops-mini-item`, or `ops-deferred-list` elements with clean-layer classes.
9. Do not add clean-layer classes to any element carrying an event-bound ID or critical data attribute.

## Recommended STEP 38B patch scope (smallest viable candidate)
Scope must be strictly class-additive in `operations-centers.js` Queue Center layout only (`renderQueueCenterLayout`).

Recommended additive class targets:

| Element | Existing classes | Add class |
|---|---|---|
| `div.ops-shell.ops-workspace` | `ops-shell ops-workspace` | `mhos-clean-shell` |
| `article.panel.ops-main-column` | `panel ops-main-column` | `mhos-clean-stack` |
| `aside.ops-right-rail` | `ops-right-rail` | `mhos-clean-stack` |
| `section.panel` (executive strip) | `panel ops-executive-strip` | `mhos-clean-surface` (optional `is-raised`) |
| `section.panel.ops-detail-card` | `panel ops-detail-card` | `mhos-clean-surface` |
| `section.panel.ops-action-panel` | `panel ops-action-panel` | `mhos-clean-surface` |
| `section.panel.ops-ai-panel` | `panel ops-ai-panel` | `mhos-clean-surface` |

Optional later phase (not in smallest patch):
- Selective `mhos-clean-pill` on non-critical `std-context-chip` informational chips only, after visual QA confirms no readability regressions.
- `mhos-clean-eyebrow` on `.std-context-eyebrow` span, after confirming no contrast regression.

Out-of-scope for STEP 38B:
- No selector/ID renames
- No event handler changes
- No route behavior changes
- No API/backend changes
- No copy/provenance text rewrites
- No edits to `09-operations-centers.css` or `15-clean-operating-layer.css`
- No clean-layer classes on `ops-mini-list`, `ops-mini-item`, `ops-deferred-list`, `ops-deferred-action` blocks
- No clean-layer classes on toolbar inputs (`#queueCenterSearch`, `#queueCenterStatus`)
- No clean-layer classes on `ops-table-wrap` or `ops-table` surfaces

## Alternative candidate if Queue Center is deferred
If visual regression tolerance is lower than expected during dry QA, Job Monitor is the next closest structural candidate. It shares the same Operations surface architecture and binding model. Its render function (`renderJobMonitorLayout` / `renderJobMonitor`) follows the same wrapper/surface pattern.

## Explicit no-code-change statement
This STEP 38A checkpoint is audit/documentation-only.
No production code behavior was modified.
No CSS was modified.
No JS was modified.
No backend or data/projects artifacts were modified.
