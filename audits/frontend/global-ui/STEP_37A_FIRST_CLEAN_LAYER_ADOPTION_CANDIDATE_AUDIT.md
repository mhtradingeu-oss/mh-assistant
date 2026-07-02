# STEP 37A - First Clean Layer Adoption Candidate Audit
Date: 2026-05-14
Branch: architecture/frontend-consolidation-v1
Mode: AUDIT ONLY / documentation-only

## Executive summary
Operations / Task Center is a safe first candidate for STEP 37B clean-layer opt-in, if adoption is constrained to additive mhos-clean-* classes on non-critical wrapper and surface elements only.

The Task Center structure is already segmented with stable wrapper classes and data-page scoping, while interactive behavior is anchored by preserved IDs and data attributes. The clean layer is opt-in and inert by default, and its contract explicitly avoids global selector overrides.

Recommended risk classification for STEP 37B: LOW-MEDIUM (UI regression risk only, no backend/handler contract changes when preservation rules are respected).

## Files inspected
- public/control-center/pages/operations-centers.js
- public/control-center/styles/09-operations-centers.css
- public/control-center/styles/15-clean-operating-layer.css
- public/control-center/api.js
- public/control-center/app.js

## Candidate page/section
- Candidate page: Operations
- Candidate section: Task Center route (data-page="task-center")
- Primary render functions:
  - renderTaskCenterLayout(...)
  - renderTaskCenter(...)
  - taskCenterRoute.render(...)

## Current UI structure (Task Center)
Task Center render hierarchy in operations-centers.js:
1. section.page.is-active[data-page="task-center"]
2. div.ops-shell.ops-workspace
3. section.std-context-ribbon (header/context ribbon)
4. section.panel.ops-executive-strip (cross-center runtime signal strip)
5. div.ops-layout-grid
6. article.panel.ops-main-column
7. aside.ops-right-rail
8. section.panel.ops-detail-card
9. section.panel.ops-action-panel
10. section.panel.ops-ai-panel
11. textarea#taskCenterSummaryBuffer[hidden]

Observed current visual surfaces:
- Container and layout shells: ops-shell, ops-workspace, ops-layout-grid, ops-main-column, ops-right-rail
- Card/surface regions: panel, std-context-ribbon, ops-executive-strip, ops-detail-card, ops-action-panel, ops-ai-panel
- Interactive chips/buttons/tabs/links: std-context-chip, btn variants, ops-focus-tab, ops-select-link, quick-action-btn, ops-runtime-signal
- Status markers: card-badge with tone classes (danger/warning/success/neutral), state rows and error-state blocks

## Action/handler/API inventory
### Handler and selector contract that must be preserved
Task Center-specific IDs and selectors with bound handlers:
- #taskCenterRefreshBtn (click)
- #taskCenterRefreshBtnRail (click)
- #taskCenterCopySummaryBtn (click)
- #taskCenterSummaryBuffer (copy source buffer)
- #taskCenterSearch (input)
- #taskCenterPriority (change)
- #taskCenterOwner (change)
- #taskCenterSource (change)
- [data-ops-focus] (focus-tab switching)
- [data-ops-select] (table-row/selection switching)
- [data-ops-route] (route navigation buttons)
- [data-ops-ai-open] (AI workspace open)
- [data-ops-ai-prompt] (AI prompt handoff)

Additional Task Center route-critical attributes:
- data-page="task-center"
- table row selection class is-selected
- internal keying _opsKey used for selection consistency

### API/backend contract that must not change
Task Center live fetch path and usage:
- context.fetchProjectTaskCenter(projectName)
- api function fetchProjectTaskCenter(projectName)
- endpoint: /media-manager/project/{projectName}/task-center

Related operations-center fetches (shared runtime strip / adjacent centers):
- fetchProjectQueueCenter -> /media-manager/project/{projectName}/queue-center
- fetchProjectJobMonitor -> /media-manager/project/{projectName}/job-monitor
- fetchProjectNotificationCenter -> /media-manager/project/{projectName}/notification-center

Context wiring from app render context (must remain unchanged):
- fetchProjectTaskCenter
- fetchProjectQueueCenter
- fetchProjectJobMonitor
- fetchProjectNotificationCenter

## Current CSS dependencies (09-operations-centers.css)
Task Center visuals are heavily data-page scoped and depend on existing class names:
- [data-page="task-center"] .ops-shell / .ops-workspace
- [data-page="task-center"] .ops-layout-grid / .ops-main-column / .ops-right-rail
- [data-page="task-center"] .panel and panel-header descendants
- [data-page="task-center"] .std-context-* ribbon, description, chip, button
- [data-page="task-center"] .ops-executive-strip and .ops-runtime-signal*
- [data-page="task-center"] .ops-focus-tabs / .ops-focus-tab / .is-active
- [data-page="task-center"] .ops-toolbar and input/select controls
- [data-page="task-center"] .ops-table* and .is-selected row treatment
- [data-page="task-center"] .ops-select-link
- [data-page="task-center"] .ops-detail-card / .ops-action-panel / .ops-ai-panel / .ops-detail-grid
- [data-page="task-center"] .ops-action-row / .ops-deferred-list / .ops-deferred-action
- [data-page="task-center"] .quick-actions / .quick-action-btn / .ops-prompt-* 
- Responsive behavior under @media max-width 1180px and 820px

Important dependency implication:
- Existing Task Center styling relies on legacy classes and descendants; STEP 37B must be additive and must not remove/rename existing classes or attributes.

## Clean-layer compatibility check (15-clean-operating-layer.css)
Relevant clean opt-in primitives available:
- mhos-clean-root, mhos-clean-shell
- mhos-clean-stack
- mhos-clean-surface (+ is-raised)
- mhos-clean-title
- mhos-clean-copy
- mhos-clean-eyebrow
- mhos-clean-rail
- mhos-clean-pill (+ is-ai, is-info)

Safety contract in STEP 36 clean layer supports this approach:
- no global element resets
- no overrides for legacy shared classes
- no page-targeting selectors
- no behavior coupling

## Risk classification
Overall classification for Task Center as first opt-in target: LOW-MEDIUM

Risk breakdown:
- LOW: Backend/API contract risk (if no API code touched)
- LOW: Handler breakage risk (if IDs/data attributes preserved exactly)
- MEDIUM: Visual regression risk due to additive class stacking on existing surfaces
- LOW: Cross-page regression risk (clean layer is opt-in and namespaced)

## Preservation requirements (must hold for STEP 37B)
1. Do not change any handler logic, event binding, or function behavior.
2. Do not remove/rename existing IDs, data attributes, or route attributes.
3. Do not change API call names, endpoint paths, or projectName flow.
4. Do not remove existing Task Center classes currently targeted by 09-operations-centers.css.
5. Only add mhos-clean-* classes to non-critical wrapper/surface elements.
6. Do not alter copy, provenance messaging, or deferred-mutation safety language.
7. No CSS edits in STEP 37B if following this minimal class-only adoption pass.

## Recommended STEP 37B patch scope (smallest viable candidate)
If proceeding with Task Center first, scope should be strictly class-additive in operations-centers.js Task Center layout only.

Recommended additive class targets:
- div.ops-shell.ops-workspace -> add mhos-clean-shell
- article.panel.ops-main-column -> add mhos-clean-stack
- aside.ops-right-rail -> add mhos-clean-stack
- section.panel.ops-executive-strip -> add mhos-clean-surface (optional is-raised)
- section.panel.ops-detail-card -> add mhos-clean-surface
- section.panel.ops-action-panel -> add mhos-clean-surface
- section.panel.ops-ai-panel -> add mhos-clean-surface

Optional later phase (not in smallest patch):
- Selective mhos-clean-pill on non-critical informational chips only, after visual QA confirms no readability regressions.

Out-of-scope for STEP 37B:
- No selector/ID renames
- No event handler changes
- No route behavior changes
- No API/backend changes
- No copy/provenance text rewrites
- No edits to 09-operations-centers.css or 15-clean-operating-layer.css

## Alternative candidate if Task Center is deferred
If visual regression tolerance is lower than expected during dry QA, Queue Center is the next closest structural candidate because it shares the same Operations surface architecture and binding model.

## Explicit no-code-change statement
This STEP 37A checkpoint is audit/documentation-only.
No production code behavior was modified.
No CSS was modified.
No JS was modified.
No backend or data/projects artifacts were modified.
