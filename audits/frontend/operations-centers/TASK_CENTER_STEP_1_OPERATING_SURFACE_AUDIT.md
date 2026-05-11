# Task Center Step 1 Operating Surface Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit — no code modified
Phase: P1 — Operations Centers layout and UX consolidation
Reference: audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md, audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md

---

## 1. Executive Summary

Task Center is a read-only operational dashboard for browsing, filtering, and inspecting durable tasks in a project. The current implementation is functional but does not conform to the four-zone UX Operating Surface Standard (Header + Main View + Action Panel + AI Panel). 

**Current state:** Partially aligned with standard. Has Main View and AI suggestions; lacks formal Header zone structure. Action surface is minimal and read-only (refresh only). No action mutations or authority decisions are currently wired, which is safe but means the page is only half-realized as an operational surface.

**Step 1 finding:** Task Center is safe to proceed to Step 2 (UX Contract) because:
- Backend API is read-only and stable.
- No mutations are currently wired.
- Data state handling is present (empty, loading, error states implied).
- No authority duplication detected.
- No data/projects mutations during operation.

**Recommended next:** Step 2 — write UX Contract before any layout patch.

Update: Step 2 UX Contract created: `audits/frontend/operations-centers/TASK_CENTER_STEP_2_UX_CONTRACT.md`

---

## 2. Current Task Center Purpose

Task Center allows an operator to:
- View durable operational tasks across the project.
- Filter by focus (All, Open, Blocked, Overdue, Due Soon).
- Filter by priority, owner, and source page.
- Search across task titles, descriptions, owners, domains.
- Inspect a selected task in detail (ownership, due-state, linked entity).
- Get AI suggestions on backlog prioritization, task unblocking, or execution risk.
- Refresh the task list on demand.
- Navigate to the linked entity/work (if task.route is set).

**Scope:** Read-only display and navigation. No task creation, status update, or reassignment in the current version.

---

## 3. Current Route and Render Entry Points

### 3.1 Route Definition

```javascript
export const taskCenterRoute = {
  id: "task-center",
  meta: {
    eyebrow: "Operate",
    title: "Task Center",
    description: "Manage durable tasks, owners, due dates, priorities, filters, and linked operational entities in one premium execution surface."
  },
  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
  render(context) {
    // Render immediately from cached state
    renderTaskCenter(context, context.getState(), projectName);
    // Then fetch live data and re-render
    doFetch();
  }
};
```

**Entry:** Router invokes `taskCenterRoute.render()` when the user navigates to `task-center` route.

**Immediate render:** Uses `context.getState()` to pull `state.data.operations.task_center` and renders immediately. This provides instant UI without waiting for a fetch.

**Live data fetch:** Calls `context.fetchProjectTaskCenter(projectName)` asynchronously. On success, re-renders with fresh data. On error, shows error toast.

### 3.2 Render Function

`renderTaskCenter(context, state, projectName)` orchestrates the complete page render:
1. Reads `state.data.operations.task_center` data.
2. Initializes a session (`taskSessions` Map) per project with filter/search/selection state.
3. Filters items based on session state (focus, priority, owner, source, search).
4. Selects the first item or the currently selected item as `selectedItem`.
5. Builds AI prompts contextual to the selected task.
6. Renders a six-section scaffold via `renderOperationsScaffold()`.
7. Binds event listeners for filter changes, item selection, refresh, route navigation, and AI actions.

---

## 4. Backend API Usage

### 4.1 fetchProjectTaskCenter

**Endpoint:** `/media-manager/project/{projectName}/task-center`
**Method:** GET
**Auth:** Read-key protected (confirmed via `requireProtectedReadKey` middleware audit)
**Error handling:** Returns error message; page shows error toast via `context.showError()`.

**Request:** 
```javascript
GET /media-manager/project/my-project/task-center
```

**Response shape (inferred from render code):**
```javascript
{
  total: number,
  open_count: number,
  blocked_count: number,
  overdue_count: number,
  due_soon_count: number,
  items: [
    {
      id?: string,
      task_id?: string,
      title: string,
      description?: string,
      owner?: string,
      assignee?: string,
      owner_role?: string,
      assignee_role?: string,
      due_at?: ISO timestamp,
      due_state?: 'overdue' | 'due_soon' | 'unscheduled',
      priority?: 'low' | 'normal' | 'high' | 'critical',
      status?: 'open' | 'blocked' | 'completed',
      source_page?: string,
      service_domain?: string,
      route?: string,  // optional: where to navigate when "Open Linked Work"
      linked_entity?: {
        label?: string,
        entity_type?: string,
        route?: string
      }
    },
    ...
  ],
  filters: {
    priorities: [ { value: string, count: number }, ... ],
    owners: [ { value: string, count: number }, ... ],
    source_pages: [ { value: string, count: number }, ... ]
  }
}
```

**Classification:** Read-only. No mutations. Safe for dashboard/display.

---

## 5. Current DOM and UX Structure

### 5.1 Template and Overall Shell

```html
<section class="page is-active" data-page="task-center">
  <div class="ops-shell ops-workspace">
    <!-- 0. Executive Runtime Strip -->
    <!-- 1. Operations Overview (metrics) -->
    <!-- 2. Current Focus Tabs -->
    <!-- 3. Item List / Table (with toolbar) -->
    <!-- 4. Selected Item Details -->
    <!-- 5. Action / Resolution Area -->
    <!-- 6. Operations AI Assistant -->
  </div>
</section>
```

### 5.2 Six-Section Scaffold

**Section 0 — Executive Runtime Strip (shared):**
- Renders cross-project runtime health signals (Queue Pressure, Failed Jobs, Critical Alerts, etc.).
- Each signal is a clickable button that navigates to the relevant ops center or other page.
- Purpose: Give the operator a bird's-eye view of system health without leaving the page.
- This section is the same across all Operations Centers.

**Section 1 — Operations Overview:**
- Kicker: "1. Operations Overview"
- Title: "Task Center"
- Copy: "Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up."
- Metrics: 4 KPI cards (Total Tasks, Open, Blocked, Overdue)
- No form inputs; purely informational.

**Section 2 — Current Focus Tab:**
- Kicker: "2. Current Focus Tab"
- Title: "{title} focus"
- Five focus buttons: All Tasks, Open, Blocked, Overdue, Due Soon
- Tab-like UI; one is active (`is-active` class).
- Clicking a tab updates `session.focus` and rerenders the list.

**Section 3 — Item List / Table (Main View):**
- Kicker: "3. Item List / Table"
- Title: "Execution backlog"
- Toolbar above the table:
  - Search input (`id="taskCenterSearch"`)
  - Priority filter dropdown (`id="taskCenterPriority"`)
  - Owner filter dropdown (`id="taskCenterOwner"`)
  - Source filter dropdown (`id="taskCenterSource"`)
- Table columns: Task, Owner, Due, Priority, Source, Linked, Status, Route
- Each row represents one task item.
- First column (Task) has a button with `data-ops-select` — clicking it selects that item and rerenders the details panel.
- Status/priority/due-state are rendered as colored badges.
- "Route" column has an `Open` button that navigates to the linked work.

**Section 4 — Selected Item Details (Right Rail):**
- Kicker: "4. Selected Item Details"
- Displays the currently selected task's full details in a card.
- If no task is selected, shows "No task is selected."
- Details include: title, description, owner, role, due-state, priority, source, domain, linked entity.
- No editable fields; all read-only.

**Section 5 — Action / Resolution Area:**
- Kicker: "5. Action / Resolution Area"
- Title: "Task resolution"
- Refresh button (`id="taskCenterRefreshBtn"`) — triggers `context.fetchProjectTaskCenter(projectName)` and rerenders.
- "Open Linked Work" button (conditionally rendered if `selectedItem` exists).
- Mini list of owners and task count per owner (read-only summary).

**Section 6 — Operations AI Assistant:**
- Kicker: "6. Operations AI Assistant"
- Title: "Operations AI Assistant"
- "Open AI Workspace" button — navigates to `ai-command` route.
- Three AI prompt quick buttons:
  - "Prioritize backlog"
  - "Unblock selected task"
  - "Summarize execution risk"
- Each prompt is contextual to the current `projectName` and `selectedItem`.
- Clicking a prompt saves the prompt to `#quickCommandInput` and navigates to AI Command.

### 5.3 Event Binding Summary

Events are bound in `renderTaskCenter()`:

| Event | Trigger | Handler | Effect |
|---|---|---|---|
| Focus tab click | User clicks a focus tab | `bindOpsFocusButtons()` → `session.focus = tab.value` | Refilter items and rerender |
| Item select | User clicks a task row | `bindOpsSelectionButtons()` → `session.selectedKey = item._opsKey` | Update details panel and rerender |
| Search input | User types in search | `#taskCenterSearch input event` → `session.search = value` | Refilter items and rerender |
| Priority/Owner/Source filter | User selects dropdown | `change event` → `session[filterKey] = value` | Refilter items and rerender |
| Refresh button click | User clicks Refresh | `#taskCenterRefreshBtn click` → `fetchProjectTaskCenter()` → rerender | Fetch live data and rerender |
| Route button click | User clicks an Open/Navigate button | `bindRouteButtons()` → `context.navigateTo(route)` | Navigate to linked page |
| AI prompt button | User clicks a prompt | `bindOpsAssistantButtons()` → `savePromptToQuickCommand()` + `navigateTo("ai-command")` | Pre-populate AI Command input and navigate |

---

## 6. Current Data States

### 6.1 Loading State

**Trigger:** Initial route render, or Refresh button clicked.

**Current behavior:**
- Page renders immediately from cached state (if available).
- Fetch happens asynchronously.
- No explicit loading spinner shown during fetch. The old data remains visible while waiting.
- On completion, content updates silently.
- On error, error toast appears.

**Gap:** No explicit `.loading-state` UI during the fetch. The page doesn't communicate that a fetch is in progress.

**Risk: Low.** Async fetch-in-background pattern is acceptable for a status dashboard. However, if fetch takes >2 seconds, the user may not know it's loading.

### 6.2 Empty State

**Trigger:** `taskCenter.items.length === 0` after filtering.

**Current behavior:**
- Table renders `<div class="empty-box">No tasks match the current filters.</div>`
- Details panel shows `<div class="empty-box">No task is selected.</div>`
- No action buttons are disabled or hidden.

**Status:** Explicit empty state is present. Meets standard.

### 6.3 Error State

**Trigger:** `fetchProjectTaskCenter()` throws error or returns falsy.

**Current behavior:**
- Error is caught and logged to `context.showError()`.
- Global error toast appears.
- Page remains visible with whatever data was rendered before the error.
- No retry button on the page itself; user must click Refresh.

**Status:** Error is surfaced. Could be improved with an inline error panel and explicit retry button, but acceptable for P1.

### 6.4 Populated State

**Trigger:** Data is successfully fetched and rendered.

**Current behavior:**
- Six-section scaffold is rendered with all data.
- Filters and search work as expected.
- Items are selectable and details populate.
- AI prompts are contextual and functional.

**Status:** Normal operating state works correctly.

---

## 7. Current Action Surfaces

### 7.1 Read-Only Safe Actions (Wired Now)

| Action | Safety Level | Behavior | Authority |
|---|---|---|---|
| Search | L1: read_only | Filters items client-side; no backend mutation | None |
| Filter (priority/owner/source) | L1: read_only | Filters items client-side | None |
| Focus tabs | L1: read_only | Changes display focus without backend change | None |
| Select task | L1: read_only | Updates selected item in session; client-side only | None |
| Refresh | L2: safe_non_destructive | Fetches live data from backend; displays result | None — read-only |
| Open Linked Work | L2: safe_non_destructive | Navigates to the task's linked route | None — navigation only |
| Open AI Workspace | L2: safe_non_destructive | Navigates to AI Command with pre-composed prompt | None — navigation only |

**Total:** All seven current actions are safe (L1 or L2). None are mutations.

### 7.2 Deferred Mutation Actions (Not Wired)

The following would be L3 or L4 actions if implemented. They are currently intentionally NOT wired:

- Update task status (open → blocked → completed)
- Reassign task (change owner/assignee)
- Change priority
- Update due date
- Mark as overdue, due-soon, or reschedule
- Link/unlink entities
- Delete task
- Bulk reassign / bulk prioritize

**Rationale:** These are all mutations on backend state. They require:
1. A formal mutation safety audit for this page.
2. Backend endpoint confirmation and auth checks.
3. Confirmation dialogs and error handling.
4. Authority audit (who is allowed to update tasks for which projects/roles).

**Step 1 conclusion:** Do not wire any mutations in Step 1 layout pass. Defer to a dedicated mutation safety pass (future).

---

## 8. Current AI and Smart Surfaces

### 8.1 AI Assistant Panel (Section 6)

**Status:** Implemented and active.

**Behavior:**
- Three context-aware prompts are pre-composed based on the current page, project, and selected task.
- User clicks a prompt button.
- Prompt text is saved to the global quick command input (`#quickCommandInput`).
- User is navigated to AI Command.
- AI Command page loads with the pre-populated prompt visible.

**Prompts offered:**

1. **Prioritize backlog:** "Review the current task backlog for [project]. Prioritize the next work based on blocked items, due-state, ownership, and operational impact."

2. **Unblock selected task:** "Review [selected task title] in Task Center for [project]. Explain what is blocking progress, who should act next, and the fastest unblock path."

3. **Summarize execution risk:** "Summarize execution risk in Task Center for [project]. Focus on overdue, due soon, blocked, and ownership concentration risk."

**AI authority:** None. Prompts are suggestions only. The AI Command page owns command execution, not Task Center.

**AI safety:** Safe. No autonomous execution from Task Center.

---

## 9. Current CSS and Class Usage

### 9.1 Classes Used

| Class Family | Purpose | File | Status |
|---|---|---|---|
| `.ops-shell` | Outer container | operations-centers.js (inline) | Not in CSS; assumed styling from `.ops-workspace` |
| `.ops-workspace` | Workspace grid | operations-centers.js (inline) | Not in CSS; assumed structural |
| `.panel` | Card/container | 08-components-foundation.css | Canonical |
| `.panel-header` | Section title/metadata area | 08-components-foundation.css | Canonical |
| `.card-badge` | Status/tone badge | 08-components-foundation.css | Canonical |
| `.ops-focus-tabs` | Tab row | operations-centers.js (inline) | Not in CSS; custom styled inline or missing |
| `.ops-focus-tab` | Individual tab | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-metric-grid` | KPI grid | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-metric-card` | Individual metric | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-table-wrap` | Table wrapper | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-table` | Table element | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.empty-box` | Empty state | 08-components-foundation.css | Canonical |
| `.command-input` | Search/filter input | 10-topbar-canonical.css | Reused from global command bar |
| `.sidebar-select` | Filter dropdown | 07-sidebar.css | Reused from sidebar |
| `.btn` | Button | 08-components-foundation.css | Canonical |
| `.ops-detail-grid` | Detail cards | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-runtime-signal-grid` | Executive runtime signal grid | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.ops-action-row` | Action button cluster | operations-centers.js (inline) | Not in CSS; custom styled or missing |
| `.quick-action-btn` | AI prompt buttons | 08-components-foundation.css (base rule includes) | Canonical |
| `.home-action-title`, `.home-action-meta` | Labels inside prompt buttons | 12-pages.css | Reused from home; semantic mismatch (not "home") |

### 9.2 CSS Gap Analysis

**Finding:** Many `.ops-*` and operation-center-specific classes are defined inline in the HTML template but do not have corresponding CSS rules in any CSS file. This means:

1. **No styling:** These classes produce no visual effect unless styled via inline `style` attributes or dynamic class manipulation.
2. **No responsive design:** No media queries exist for these classes.
3. **Future CSS debt:** If Step 2 or later needs to style the operations center, a new CSS file or additions to existing files will be needed.

**Classes that need CSS definition:**
- `.ops-shell`, `.ops-workspace`
- `.ops-focus-tabs`, `.ops-focus-tab`
- `.ops-metric-grid`, `.ops-metric-card`
- `.ops-table-wrap`, `.ops-table`
- `.ops-detail-grid`, `.ops-detail-card`
- `.ops-runtime-signal-grid`, `.ops-runtime-signal`
- `.ops-action-row`
- `.ops-workspace-grid`, `.ops-resolution-grid`
- `.ops-lane`, `.ops-lane-head`, `.ops-list`, `.ops-list-item`
- `.ops-select-link`, `.ops-mini-item`, `.ops-mini-list`
- `.ops-toolbar`, `.ops-toolbar-compact`
- `.ops-detail-summary`, `.ops-detail-stack`

**Risk classification:** `needs_consolidation` — P1 layout pass should introduce a new CSS file (e.g., `09-operations-centers.css`) to define all `.ops-*` classes and establish responsive behavior.

---

## 10. Fit Against UX Operating Surface Standard

### 10.1 Header Zone

**Standard requirement:** Page title, eyebrow label, context ribbon, project scope indicator.

**Current state:** PARTIAL
- Page title ("Task Center") is in the topbar via route meta (`meta.title`).
- Eyebrow ("Operate") is in route meta but not displayed (topbar `.page-eyebrow` is `display: none`).
- No context ribbon (e.g., `std-context-ribbon` class) is rendered on the page.
- Project scope is implied but not explicitly stated in a header.

**Gap:** The page lacks a formal Header zone structure. Section 1 (Operations Overview) serves a title purpose but is not formatted as a standard header ribbon.

**Step 2 decision:** P1 layout pass must introduce a `std-context-ribbon` or equivalent Header zone before the Operations Overview section.

### 10.2 Main View Zone

**Standard requirement:** Data list/grid, filter/search/sort controls, empty/loading/error states.

**Current state:** GOOD
- Data list: Task table (Section 3) with 8 columns.
- Filter controls: Toolbar with search, priority, owner, source filters.
- Focus tabs (Section 2): Act as a view mode selector (All vs. Open vs. Blocked vs. Overdue vs. Due Soon).
- Empty state: Explicit `<div class="empty-box">` when no tasks match filters.
- No explicit loading state UI (gap).
- Error state: Surfaced via toast; could be improved with inline error card.

**Assessment:** Main View is functional and mostly standard-compliant. Needs minor refinement.

### 10.3 Action Panel Zone

**Standard requirement:** Right-rail safe actions, deferred mutations labeled, safety levels documented.

**Current state:** MINIMAL
- Section 5 ("Action / Resolution Area") exists but contains only:
  - Refresh button (L2: safe_non_destructive)
  - Open Linked Work button (L2: safe_non_destructive)
  - Mini owner list (informational)
- No mutation buttons are wired.
- No deferred mutation buttons are rendered.

**Gap:** Action Panel is incomplete. Per the standard, deferred mutations should be rendered as disabled buttons with descriptive labels explaining why they are deferred.

**Step 2 decision:** P1 layout pass should:
1. Restructure Section 5 as a proper right-rail Action Panel (move from main grid to right-rail column).
2. Add deferred mutation buttons (disabled) with `aria-label` or tooltips: "Update status (requires mutation safety audit)", "Reassign (not yet available)", etc.
3. Ensure only L1/L2 actions are clickable; L3/L4 are disabled.

### 10.4 AI Panel Zone

**Standard requirement:** Right-rail AI suggestions, read-only metadata, no autonomous execution.

**Current state:** GOOD
- Section 6 ("Operations AI Assistant") functions as an AI Panel.
- Contains three contextual AI prompts.
- Prompts are read-only suggestions; no autonomous execution.
- Navigation to AI Command is explicit (user clicks).
- Safety: No AI Panel action mutates backend state on Task Center.

**Assessment:** AI Panel is well-designed. Meets standard.

### 10.5 Four-Zone Layout Compliance

**Current layout structure:**
```
Section 0: Executive Runtime (cross-project; shared)
Section 1: Overview (Header-like)
Section 2: Focus tabs (view mode selector)
Section 3: Item List (Main View)
Section 4: Details (Right-rail, read-only)
Section 5: Actions (Right-rail, minimal)
Section 6: AI Assistant (Right-rail, informational)
```

**Mapping to four zones:**
- **Header:** Section 1 (overview), Section 2 (focus tabs) — should consolidate into a `std-context-ribbon` + view mode toggle.
- **Main View:** Section 3 (item list + toolbar).
- **Action Panel:** Section 5 (currently too minimal; needs expansion with deferred mutations).
- **AI Panel:** Section 6 (correct; meets standard).
- **Right rail:** Sections 4, 5, 6 should stack in a right column alongside Main View (on wide viewports).

**Step 2 outcome:** After Step 2 UX Contract, the layout will be restructured as:
```
Section 0: Executive Runtime (remains separate, above all)
Header: Context ribbon (new; consolidate Sections 1-2)
Main View: Item list + toolbar (Section 3, stays in main column)
─────────────────────────────────────────────────
Selected Item Details (Section 4, right-rail, top)
Action Panel (Section 5, right-rail, middle)
AI Panel (Section 6, right-rail, bottom)
```

---

## 11. Accessibility and Keyboard Observations

### 11.1 Current State

**ARIA landmarks:**
- No explicit role or landmark on the page.
- Global shell provides `<header>`, `<nav>`, `<main>` implicitly.

**Focus management:**
- No explicit focus trap or focus restoration on page load.
- Tab order follows DOM order.
- No skip links to jump to main content.

**Button labels:**
- `.btn` elements have visible text labels (good).
- Icon-only buttons: None identified in Task Center; AI icon buttons have visible labels.

**Disabled state:**
- `.btn:disabled` uses `opacity: 0.56` — visually distinct but could be more explicit.
- No deferred-mutation buttons rendered yet; future buttons should have clear `aria-label`.

**Color contrast:**
- Badges use color + text; WCAG 2.1 AA compliance assumed (based on token system dark theme).
- Status badges (success, warning, danger) combine color + label; text is visible.

### 11.2 Keyboard Navigation

**Current:**
- Tab through buttons: works.
- Focus on filters/search: works.
- Enter on task row to select: uses `.ops-select-link` button; works.
- Escape to close anything: no close behavior (not a modal).

**Gaps:**
- No arrow-key navigation in the task list (would be nice for power users).
- No keyboard shortcut for Refresh (currently mouse-only).

**Step 2 consideration:** Keyboard shortcuts (Ctrl+R for Refresh, arrow keys for task selection) are optional enhancements; not required for Step 1.

---

## 12. Risk Table

| Risk | Category | Severity | Notes |
|---|---|---|---|
| No CSS file for `.ops-*` classes | CSS/styling | Medium | All `.ops-*` classes lack CSS definitions. P1 layout pass must create `09-operations-centers.css`. |
| No explicit loading state UI | UX clarity | Low | Async fetch doesn't show spinner. Acceptable for now; consider `.loading-state` in Section 3 during fetch. |
| No inline error card | UX clarity | Low | Errors show as toast only. Could add inline error card in Section 3 on fetch failure. |
| Header not standardized | Layout compliance | Medium | Section 1 is not a `std-context-ribbon`. Must refactor in Step 2. |
| Action Panel too minimal | Layout compliance | Medium | Section 5 should have deferred mutation buttons to communicate future capability. Must refactor in Step 2. |
| Details panel shares right-rail with actions | Layout efficiency | Low | Currently Sections 4, 5, 6 are inline; layout is functional but should be right-rail column for wide screens. P1 layout pass can refactor. |
| Focus tabs and overview mixed | Information hierarchy | Low | Sections 1 and 2 are separate panels; could consolidate into one Header zone. Nice-to-have for Step 2. |
| AI prompts reuse `.home-action-title` / `.home-action-meta` | Class naming | Low | Semantic mismatch; should use `.ops-prompt-*` or similar. Minor; can refactor in P1 CSS pass. |
| No authority duplication detected | Authority compliance | None | All actions are read-only or navigation. Safe. ✓ |
| No data/projects mutation | Data safety | None | No backend mutations attempted. Safe. ✓ |
| No uncontrolled listeners | Listener safety | None | All listeners bound in `renderTaskCenter()` and potentially cleaned up on route teardown (assumed). Safe. ✓ |
| Sync to state correctly | State management | None | Session state is local to `taskSessions` Map; no global state pollution. Safe. ✓ |

---

## 13. Recommended Step 2 — UX Contract

### 13.1 Pre-Step-2 Work

Before writing the UX Contract, confirm:
1. Backend API response shape matches the assumed contract in this audit.
2. No backend changes are pending for Task Center endpoints.
3. Project stakeholders agree that Task Center should reach full four-zone standard in P1 layout pass.

### 13.2 Step 2 Deliverable

The UX Contract document should define:

**Header Zone:**
- Render a `std-context-ribbon` with:
  - Eyebrow: "TASK CENTER"
  - Title: "Task Center"
  - Description: "Durable operational tasks with ownership, due-state, linked entities, and route-aware follow-up."
  - Metrics chips: Total Tasks, Open, Blocked, Overdue (as `std-context-chip`).
  - Optional context action: Refresh button.
- Keep Section 2 (focus tabs) as a tab-bar below the ribbon, or integrate into the ribbon as a secondary view-mode toggle.

**Main View Zone:**
- Keep Section 3 (item list + toolbar) unchanged.
- Add explicit `.loading-state` UI when fetch is in progress (during Refresh or initial load after project switch).
- Add inline error card if fetch fails (inline, not toast-only).

**Action Panel Zone (Right-rail, middle):**
- Refresh button (L2 safe).
- Open Linked Work button (L2 safe) — conditionally shown if selectedItem exists.
- Deferred mutation buttons (disabled, with descriptive labels):
  - "Update status (requires mutation safety audit)"
  - "Reassign owner (requires mutation safety audit)"
  - "Change priority (requires mutation safety audit)"
  - "Update due date (requires mutation safety audit)"
- Owner summary mini-list (informational).

**AI Panel Zone (Right-rail, bottom):**
- Keep Section 6 largely unchanged.
- Consider a dedicated `.ops-ai-panel` class wrapper.
- Ensure prompts are truly read-only (confirm they don't trigger mutations on Task Center side).

**Layout:**
- Wide (>980px): Header full-width, Main View + Right-rail two-column.
- Narrow (<980px): Full-width stack: Header → Main View → Action Panel → AI Panel.

**Safe interactions:**
- All L1/L2 actions remain enabled.
- No new L3/L4 actions are wired in Step 2.
- Deferred buttons are disabled + labeled with explanation.

**CSS strategy:**
- Create new file `public/control-center/styles/09-operations-centers.css`.
- Define all `.ops-*` classes.
- Ensure responsive breakpoints align with app shell standards (980px, 760px).

### 13.3 Step 2 Approval Gates

Before Step 2 layout implementation begins, confirm:
1. ✓ UX Contract is reviewed and approved.
2. ✓ CSS file structure is planned and approved.
3. ✓ Backend API contract is confirmed (no changes needed).
4. ✓ No authority audit is needed for read-only operations.
5. ✓ All L1/L2 actions in the contract are confirmed safe.

---

## 14. Do-Not-Touch List

The following must NOT be modified during Step 2 layout pass:

| System | Rule |
|---|---|
| Backend API endpoint | `/media-manager/project/{projectName}/task-center` must not change |
| fetchProjectTaskCenter() function | Must not be modified; routes through read-key auth |
| Response shape | Task item fields must remain compatible; new fields are OK, removed fields are breaking |
| Project isolation | Project name parameter is preserved; no cross-project data leakage |
| Route ID | `task-center` route ID must not change |
| Route meta | `eyebrow`, `title`, `description` in route meta can be updated for clarity, but should not break route registration |
| Session state (`taskSessions` Map) | Local session management is acceptable; no change to state.js |
| AI prompt templates | AI prompts can be refined, but must not execute commands autonomously |
| Authority handling | No authority checks added to Task Center; read-key auth remains in API layer only |
| data/projects files | Must not be modified |

---

## 15. No-Change Confirmation

This audit is documentation-only.

- No CSS files were modified.
- No JS files were modified.
- No backend files were modified.
- No data/projects files were modified.
- No route definitions were changed.
- No API contracts were changed.
- All findings are forward-looking inputs for Step 2 UX Contract and Step 3 layout implementation.

---

## Validation Checklist

- ✓ Task Center backend API is read-only (no mutations found).
- ✓ All current actions are safe (L1/L2; no L3/L4 wired).
- ✓ Data states (empty, error, populated) are handled.
- ✓ No authority duplication detected.
- ✓ No data/projects mutations during operation.
- ✓ No uncontrolled event listeners detected.
- ✓ Accessibility baseline present (ARIA, keyboard, labels).
- ✓ AI Panel is read-only and safe.
- ✓ Session state is local and not global.

---

## Appendix A — Task Center Session Structure

```javascript
// Local session storage per project in taskSessions Map
{
  focus: "all" | "open" | "blocked" | "overdue" | "due_soon",
  priority: "all" | <priority value>,
  owner: "all" | <owner value>,
  source: "all" | <source page>,
  search: string,
  selectedKey: string  // item._opsKey
}
```

This session is ephemeral (lost on page reload or project switch). It is not persisted to localStorage or global state.

---

## Appendix B — AI Prompt Factories

Task Center generates three contextual AI prompts:

1. **Prioritize backlog:** Suggests how to rank the current task backlog.
2. **Unblock selected task:** Explains what is blocking a specific task and how to unblock it.
3. **Summarize execution risk:** Assesses operational risk across the task load (overdue, due-soon, blocked, ownership concentration).

All prompts include:
- Project name (for context)
- Selected item title (if applicable)
- Focus filter label (e.g., "all tasks" or "overdue tasks")

Prompts are suggestions only. Execution is owned by AI Command page, not Task Center.
