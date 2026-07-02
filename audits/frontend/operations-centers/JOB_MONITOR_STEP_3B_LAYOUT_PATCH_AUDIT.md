# Job Monitor Step 3B Layout Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Job Monitor layout-only operating surface patch
Prerequisite: Queue Center Step 3A committed (`c16e640`)

Doctrine:
- Backend owns operational authority.
- Frontend projects operational authority.

References:
- audits/frontend/operations-centers/OPERATIONS_SHARED_SCAFFOLD_UX_CONTRACT.md
- audits/frontend/operations-centers/OPERATIONS_SHARED_SCAFFOLD_AUDIT.md
- audits/frontend/operations-centers/QUEUE_CENTER_STEP_3A_LAYOUT_PATCH_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_3_LAYOUT_PATCH_AUDIT.md
- audits/frontend/operations-centers/TASK_CENTER_STEP_4_VISUAL_QA_AUDIT.md
- audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md
- public/control-center/pages/operations-centers.js
- public/control-center/styles/09-operations-centers.css

---

## 1. Summary of Job Monitor layout changes

Job Monitor was moved from legacy shared `renderOperationsScaffold` to a dedicated Job-only renderer path (`renderJobMonitorLayout`) while preserving current behavior and route/data contracts.

Applied operating surface:
- Page Header (`std-context-ribbon`):
  - Eyebrow: `JOB MONITOR`
  - Title: `Job Monitor`
  - Project scope badge
  - Health/running/completed/failed metric chips
  - Safe Refresh action
- System Signal Bar:
  - Uses `renderExecutiveRuntimeStrip` with supporting-context labeling (`System Runtime` / `System Signal`)
  - Keeps runtime signal route links
- Main View:
  - Job focus tabs (all/running/failed/completed)
  - Search and kind filter controls
  - Job table with row selection
  - Explicit loading and inline error projection
  - Empty and filtered-empty messaging
- Right Rail:
  - Selected Job detail card
  - Action Panel (safe actions + deferred controls)
  - AI Panel (prompt-only)

Action Panel now includes:
- Active safe actions:
  - Refresh Job Monitor
  - Open Job Context
- Existing execution logs snapshot display
- Deferred controls (disabled, no handlers):
  - Retry job
  - Cancel job
  - Rerun job
  - Delete job

AI Panel remains prompt-routing only:
- Open AI Workspace
- Prompt buttons route to AI Command
- No in-panel AI execution

---

## 2. Files changed

1. `public/control-center/pages/operations-centers.js`
- Added `renderJobMonitorLayout` for Job Monitor-only operating surface
- Switched `renderJobMonitor` to use dedicated layout path
- Preserved fetch contract (`fetchProjectJobMonitor`) and route wiring
- Preserved focus/search/filter/select/refresh/route/AI prompt behavior
- Added explicit loading/error projection for initial load and refresh cycle

2. `public/control-center/styles/09-operations-centers.css`
- Added `[data-page="job-monitor"]` scoped layout styles
- Added job-monitor scoped state styling for loading/error table-row projection
- Added job-monitor scoped action/deferred/log/AI panel styling

3. `audits/frontend/operations-centers/JOB_MONITOR_STEP_3B_LAYOUT_PATCH_AUDIT.md`
- Created this Step 3B audit record

---

## 3. Behavior preserved checklist

- [x] Job Monitor route id unchanged (`job-monitor`)
- [x] `fetchProjectJobMonitor(projectName)` usage preserved
- [x] Focus tabs preserved (`data-ops-focus`)
- [x] Job item selection preserved (`data-ops-select`)
- [x] Search preserved (`#jobMonitorSearch`)
- [x] Kind filter preserved (`#jobMonitorKind`)
- [x] Visible jobs preserved in main table
- [x] Refresh preserved (header and action-panel refresh buttons)
- [x] Route navigation preserved (`data-ops-route` via `renderRouteAction` and runtime signal links)
- [x] AI prompt navigation preserved (`data-ops-ai-open`, `data-ops-ai-prompt`)

---

## 4. Loading/empty/error state confirmation

Confirmed for Job Monitor dedicated layout path:
- Loading: explicit loading projection inside Main View while keeping header/system signal/right rail shell stable
- Empty: explicit "no jobs available" message when unfiltered data is absent
- Error: explicit inline error projection inside Main View with preserved shell
- Cached: cached jobs remain visible during refresh loading state
- Populated: table renders all filtered results with selection support
- Filtered-empty: explicit "no jobs match current filters" message

No old scaffold fallback is used for Job Monitor loading/error/empty states.

---

## 5. Deferred job action controls list

Rendered disabled with explicit deferred labels and no handlers:
- Retry job (deferred: mutation safety pass)
- Cancel job (deferred: mutation safety pass)
- Rerun job (deferred: mutation safety pass)
- Delete job (deferred: mutation safety pass)

Safety confirmation:
- No retry wiring added
- No cancel wiring added
- No rerun wiring added
- No delete wiring added
- No mutation/destructive actions enabled

---

## 6. CSS scope confirmation

Job Monitor styles are isolated under `[data-page="job-monitor"]` selectors in `09-operations-centers.css`.

Coverage includes:
- Header compact polish
- System Signal Bar compact style
- Main/View and Right Rail layout
- Focus tabs, toolbar, table rhythm, detail cards
- Action panel, log list, and deferred control visuals
- AI panel prompt card styling
- Responsive collapse behavior

Scope safety:
- No unscoped Job Monitor selectors added
- Queue and Task selectors left intact
- No global CSS files modified outside `09-operations-centers.css`

Load-order confirmation:
- Existing load order remains unchanged:
  - `08-components-foundation.css` -> `09-operations-centers.css` -> `12-pages.css`

---

## 7. Confirmation Task/Queue/Notifications unaffected

Task Center:
- Existing dedicated Task renderer path remains intact
- Existing Task styles remain intact

Queue Center:
- Existing dedicated Queue renderer path remains intact
- Existing Queue styles remain intact

Notifications:
- Still uses legacy shared `renderOperationsScaffold`
- No Notification renderer behavior changed

Shared scaffold:
- Not deleted
- Continues to serve Notifications

---

## 8. Confirmation no backend/API/data changes

Confirmed:
- No backend files changed
- No API function signatures changed
- No changes to `fetchProjectJobMonitor` contract
- No route ID changes
- No response shape changes
- No `data/projects` changes

---

## 9. Validation results

Commands executed:
- `git status --short`
- `node --check public/control-center/pages/operations-centers.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `grep -nE "job-monitor|Job Monitor|fetchProjectJobMonitor|renderJob|data-ops|Retry job|Cancel job|Rerun job|Delete job|System Signal|renderExecutiveRuntimeStrip|loading|error|empty" public/control-center/pages/operations-centers.js public/control-center/styles/09-operations-centers.css | sed -n '1,380p'`
- `git diff --stat`
- `git status --short data/projects`

Expected outcome profile:
- JS syntax checks pass
- Job-specific renderer and deferred labels discoverable by grep
- Job scoped selectors present in `09-operations-centers.css`
- `data/projects` remains clean

---

## 10. Remaining work

Remaining shared scaffold migration sequence:
1. Step 3C: Notifications layout-only patch
2. Step 4: Shared operations CSS consolidation
3. Step 5: Operations final QA

Future constraints remain:
- No backend/API contract drift
- No mutation/destructive wiring without required audits
- Keep prompt-only AI behavior in operations panels
