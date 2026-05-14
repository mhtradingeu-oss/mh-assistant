# STEP 39A — Third Clean Layer Adoption Candidate Audit

**Date:** 2026-05-14
**Branch:** architecture/frontend-consolidation-v1
**Mode:** AUDIT ONLY — documentation only
**Status:** COMPLETE — no code changed

---

## Executive Summary

STEP 38E closed the Operations Clean Layer Visual QA Checkpoint, establishing that Task Center and Queue Center have both adopted `mhos-clean-*` classes. Browser visual QA for those two centers is required before broad rollout, and is currently **PENDING**.

This audit assesses **Job Monitor** as the third candidate for clean-layer opt-in adoption. The inspection confirms Job Monitor shares the exact same structural layout pattern as Task Center and Queue Center. The wrapper/surface mapping is unambiguous. No handler, ID, data attribute, API, CSS, backend, or copy changes are required.

**Conclusion:** Job Monitor is a low-risk, high-confidence third candidate. STEP 39B patch scope is defined and small. STEP 39B must not proceed until Task Center and Queue Center visual QA is accepted or consciously deferred.

---

## Files Inspected

| File | Role |
|---|---|
| `public/control-center/pages/operations-centers.js` | Job Monitor render logic, route definition, session/filter/handler wiring |
| `public/control-center/styles/09-operations-centers.css` | Job Monitor scoped CSS block (`[data-page="job-monitor"]`) |
| `public/control-center/styles/15-clean-operating-layer.css` | Clean layer token and class definitions |

---

## Candidate Page / Section

**Page:** Job Monitor (`data-page="job-monitor"`)
**Route export:** `jobMonitorRoute` (line 1743)
**Primary render function:** `renderJobMonitor` (line 1245)
**Layout template function:** `renderJobMonitorLayout` (line 1036)
**Session map:** `jobSessions` (per-project keyed session state)

---

## Current UI Structure

Rendered by `renderJobMonitorLayout(...)`. Structure mirrors Task Center and Queue Center exactly:

```
<section class="page is-active" data-page="job-monitor">
  <div class="ops-shell ops-workspace">                         ← ROOT WRAPPER (no clean classes yet)
    <section class="std-context-ribbon">                        ← context bar (preserved, no clean class)
      ...eyebrow, title, metrics, refresh button header...
    </section>

    <!-- renderExecutiveRuntimeStrip(...) -->                    ← runtime strip helper (no clean class)

    <div class="ops-layout-grid">                               ← layout grid
      <article class="panel ops-main-column">                   ← main column (no clean class yet)
        <div class="panel-header">...</div>
        <!-- renderOpsFocusTabs([All Jobs, Running, Failed, Completed]) -->
        <div class="ops-toolbar ops-toolbar-compact">
          <input id="jobMonitorSearch" ...>                     ← HANDLER ANCHOR — must not change
          <select id="jobMonitorKind" ...>                      ← HANDLER ANCHOR — must not change
        </div>
        <!-- error state: .ops-job-state -->
        <!-- renderOpsTable(["Kind","Job","Owner","Retries","Health","Status","Updated","Route"]) -->
          <!-- rows: data-ops-select per item -->               ← DATA ATTRIBUTE — must not change
      </article>

      <aside class="ops-right-rail">                            ← right rail (no clean class yet)
        <section class="panel ops-detail-card">                 ← detail card (no clean class yet)
          ...selected job detail rows...
        </section>

        <section class="panel ops-action-panel">                ← action panel (no clean class yet)
          <button id="jobMonitorRefreshBtn" ...>                ← HANDLER ANCHOR — must not change
          <!-- renderRouteAction(selectedItem) -->              ← data-ops-route — must not change
          <!-- .ops-log-list with execution_logs -->
          <!-- .ops-deferred-list with disabled deferred buttons -->
        </section>

        <section class="panel ops-ai-panel">                    ← AI panel (no clean class yet)
          <button data-ops-ai-open ...>                         ← DATA ATTRIBUTE — must not change
          <!-- .quick-actions: data-ops-ai-prompt per prompt -->← DATA ATTRIBUTE — must not change
        </section>
      </aside>
    </div>
  </div>
</section>
```

### Comparison to Adopted Centers

| Element | Task Center | Queue Center | Job Monitor (current) |
|---|---|---|---|
| `.ops-shell.ops-workspace` | `mhos-clean-root mhos-clean-shell` | `mhos-clean-root mhos-clean-shell` | _(none)_ |
| `.panel.ops-main-column` | `mhos-clean-stack` | `mhos-clean-stack` | _(none)_ |
| `.ops-right-rail` | `mhos-clean-stack` | `mhos-clean-stack` | _(none)_ |
| `.panel.ops-detail-card` | `mhos-clean-surface` | `mhos-clean-surface` | _(none)_ |
| `.panel.ops-action-panel` | `mhos-clean-surface` | `mhos-clean-surface` | _(none)_ |
| `.panel.ops-ai-panel` | `mhos-clean-surface` | `mhos-clean-surface` | _(none)_ |

---

## Action / Handler / API Inventory

### IDs (event listener anchors — must be preserved exactly)

| ID | Handler | Risk if changed |
|---|---|---|
| `jobMonitorRefreshBtn` | `click` → `refreshJobMonitor()` | Breaks main refresh button in Action Panel |
| `jobMonitorRefreshBtnHeader` | `click` → `refreshJobMonitor()` | Breaks header-level refresh button in context ribbon |
| `jobMonitorSearch` | `input` → sets `session.search`, rerenders | Breaks search filter |
| `jobMonitorKind` | `change` → sets `session.kind`, rerenders | Breaks kind filter |

### Data Attributes (DOM query anchors — must be preserved exactly)

| Attribute | Handler | Risk if changed |
|---|---|---|
| `data-ops-select` | `bindOpsSelectionButtons` → sets `session.selectedKey`, rerenders | Breaks row selection |
| `data-ops-route` (via `renderRouteAction`) | `bindRouteButtons` → context.navigate | Breaks all route actions |
| `data-ops-ai-open` | `bindOpsAssistantButtons` → opens AI workspace | Breaks AI open button |
| `data-ops-ai-prompt` | `bindOpsAssistantButtons` → opens AI with prompt | Breaks all AI quick prompts |

### API / Backend Calls (must not be altered)

| Call | Context | Trigger |
|---|---|---|
| `context.fetchProjectJobMonitor(projectName)` | Async live fetch; result merged into `ops.job_monitor` | Route mount + header/action refresh buttons |
| `context.reloadProjectData?.(projectName)` | Fallback reload when `fetchProjectJobMonitor` is absent | Refresh buttons when no fetch function available |
| `context.showError?.(message)` | Error display side-effect | Catch handlers |
| `context.getState()` | State retrieval | Used throughout render and rerender |

### State Session (must not be altered)

`jobSessions` map keyed by `projectName`. Fields: `focus`, `kind`, `search`, `selectedKey`, `isLoading`, `errorMessage`.

---

## Current CSS Dependencies in 09-operations-centers.css

All CSS for Job Monitor is scoped under `[data-page="job-monitor"]`. The following classes are referenced (lines 764–1165):

| Selector fragment | Purpose |
|---|---|
| `.ops-shell`, `.ops-workspace` | Root layout container |
| `.ops-layout-grid` | Two-column grid |
| `.ops-main-column` | Main left column |
| `.ops-right-rail` | Right sidebar |
| `.panel`, `.panel-header`, `.panel-header h3`, `.panel-header p` | Panel base and typography |
| `.std-context-ribbon`, `.std-context-description`, `.std-context-chip`, `.std-context-btn` | Context bar |
| `.ops-executive-strip` and sub-selectors | Runtime strip |
| `.ops-runtime-signal-grid`, `.ops-runtime-signal`, `.ops-runtime-signal strong/small/.card-badge` | Signal grid |
| `.ops-focus-tabs`, `.ops-focus-tab`, `.ops-focus-tab strong/span`, `.ops-focus-tab.is-active` | Focus tab strip |
| `.ops-toolbar`, `.ops-toolbar .command-input`, `.ops-toolbar .sidebar-select` | Toolbar |
| `.ops-main-column .empty-box` | Empty state |
| `.ops-job-state`, `.ops-job-state strong`, `.ops-job-state span` | Error/loading inline state |
| `.ops-state-row td`, `.ops-state-row .ops-job-state` | Error state table row |
| `.ops-table-wrap`, `.ops-table`, `.ops-table th/td`, `.ops-table th`, `.ops-table tr.is-selected td` | Table |
| `.ops-select-link`, `.ops-select-link span` | Row selection buttons |
| `.ops-detail-card`, `.ops-action-panel`, `.ops-ai-panel` | Right rail panel sections |
| `.ops-detail-grid` | Detail grid |
| `.ops-action-row` | Action row in action panel |
| `.ops-right-rail .btn` | Button sizing in right rail |
| `.ops-log-list`, `.ops-deferred-list` | Log and deferred action lists |
| `.ops-log-item`, `.ops-log-item p`, `.ops-log-meta` | Execution log items |
| `.ops-deferred-action` | Disabled deferred action buttons |
| `.quick-actions`, `.quick-actions .quick-action-btn`, `.ops-prompt-title`, `.ops-prompt-meta` | AI prompt quick actions |

**Key observation:** The `[data-page="job-monitor"]` scope means that adding `mhos-clean-*` classes to wrappers will not conflict with any existing rules. Clean layer classes use `:where()` selectors with zero specificity, so they cannot override scoped ops CSS.

---

## Risk Classification

| Dimension | Assessment |
|---|---|
| Structural pattern match | EXACT — identical to Task Center and Queue Center |
| Handler/ID sensitivity | LOW — no handlers attached to targeted wrapper elements |
| Data attribute sensitivity | LOW — no data attributes on targeted wrapper elements |
| API/backend exposure | NONE — clean classes are additive HTML attributes only |
| CSS conflict risk | NEGLIGIBLE — clean layer uses `:where()` (zero specificity); page scope isolates ops rules |
| Copy/provenance risk | NONE — no text content or aria labels are changed |
| Mutation safety | NOT APPLICABLE — STEP 39B adds classes only; no mutation controls are touched |
| Deferred actions | UNAFFECTED — all deferred buttons retain `disabled` state and are class-independent |
| Overall risk | **LOW** |

---

## Visual QA Dependency from STEP 38E

STEP 38E established the following dependency chain:

> Task Center and Queue Center have adopted `mhos-clean-*` classes.
> Browser visual QA for both centers must be completed and accepted (or consciously deferred) before broad rollout continues.

**Current status of this dependency:**

| Center | Clean Classes Adopted | Browser Visual QA |
|---|---|---|
| Task Center | YES (STEP 38B / 38C) | **PENDING** |
| Queue Center | YES (STEP 38B / 38C) | **PENDING** |
| Job Monitor | NO — STEP 39B candidate | Not yet applicable |

**STEP 39B must not be implemented until:**
- Task Center and Queue Center browser visual QA is accepted, **OR**
- The team makes a documented and conscious decision to defer visual QA and proceed.

This audit is not a gate bypass. It documents the candidate. Execution authority rests with the team.

---

## Preservation Requirements

The following must remain unchanged in any STEP 39B patch:

1. `id="jobMonitorRefreshBtn"` — must not be renamed, moved, or removed
2. `id="jobMonitorRefreshBtnHeader"` — must not be renamed, moved, or removed
3. `id="jobMonitorSearch"` — must not be renamed, moved, or removed
4. `id="jobMonitorKind"` — must not be renamed, moved, or removed
5. `data-ops-select` on all table row buttons — must not be changed
6. `data-ops-route` on all route action buttons — must not be changed
7. `data-ops-ai-open` on the AI open button — must not be changed
8. `data-ops-ai-prompt` on all AI prompt buttons — must not be changed
9. `data-page="job-monitor"` on the `<section>` root — must not be changed (CSS scoping anchor)
10. All `aria-label`, `aria-live`, and accessible text content — must not be changed
11. All existing CSS classes — must not be removed; only additive
12. `context.fetchProjectJobMonitor`, `context.reloadProjectData`, `context.showError` — not touched
13. `jobSessions` session state map — not touched
14. All copy/provenance text (eyebrow, title, description, kicker labels) — not changed

---

## Recommended STEP 39B Patch Scope

If visual QA dependency is resolved (accepted or deferred), STEP 39B should apply exactly these class additions to `renderJobMonitorLayout` in `public/control-center/pages/operations-centers.js`:

| Element (current) | Addition |
|---|---|
| `<div class="ops-shell ops-workspace">` | `→ <div class="ops-shell ops-workspace mhos-clean-root mhos-clean-shell">` |
| `<article class="panel ops-main-column">` | `→ <article class="panel ops-main-column mhos-clean-stack">` |
| `<aside class="ops-right-rail">` | `→ <aside class="ops-right-rail mhos-clean-stack">` |
| `<section class="panel ops-detail-card">` | `→ <section class="panel ops-detail-card mhos-clean-surface">` |
| `<section class="panel ops-action-panel">` | `→ <section class="panel ops-action-panel mhos-clean-surface">` |
| `<section class="panel ops-ai-panel">` | `→ <section class="panel ops-ai-panel mhos-clean-surface">` |

**Total changes:** 6 class string additions, 1 function (`renderJobMonitorLayout`).
**No other files are modified.**

### What STEP 39B must NOT include

- No CSS edits to `09-operations-centers.css` or `15-clean-operating-layer.css`
- No handler changes
- No ID or data attribute changes
- No API or backend changes
- No copy or provenance text changes
- No removal of existing CSS classes
- No `renderJobMonitor` function logic changes
- No session state changes
- No route definition changes to `jobMonitorRoute`

---

## Explicit No-Code-Change Statement

**No production code was modified in STEP 39A.**

- `public/control-center/pages/operations-centers.js` — **not modified**
- `public/control-center/styles/09-operations-centers.css` — **not modified**
- `public/control-center/styles/15-clean-operating-layer.css` — **not modified**
- All backend files — **not modified**
- All data/projects files — **not modified**

This document is the sole output of STEP 39A.

---

## Next Steps

| Step | Condition | Action |
|---|---|---|
| Browser Visual QA: Task Center | PENDING | Must be completed or deferred |
| Browser Visual QA: Queue Center | PENDING | Must be completed or deferred |
| STEP 39B: Job Monitor clean layer opt-in | Blocked on visual QA | Implement 6-class addition per scope above |
| STEP 39C: Job Monitor visual QA | After 39B | Browser inspection of clean layer on Job Monitor |
