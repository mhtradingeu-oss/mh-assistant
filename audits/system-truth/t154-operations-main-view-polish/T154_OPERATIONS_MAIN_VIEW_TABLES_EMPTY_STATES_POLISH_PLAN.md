# T154 — Operations Main View / Tables / Empty States Polish Plan

## Status
Plan only. No implementation yet.

## Baseline
- 6b2a791 Polish Operations right rail clarity

## Scope
Plan the next CSS-only Operations polish pass focused on:
- Main working view
- Tables
- Filters/toolbars
- Empty states
- Readability and density

## Allowed File
Future implementation may touch only:

- `public/control-center/styles/09-operations-centers.css`

## Forbidden Files
Do not touch:
- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- `public/control-center/pages/operations-centers.js`
- backend files
- route files
- API files
- data/projects files

## Runtime Constraints
No behavior change.
No action behavior change.
No mutation behavior change.
No provider execution change.
No AI execution change.
No backend/API/route change.

## Candidate Polish Areas

### 1. Main View Rhythm
Selectors:
- `.ops-main-column`
- `.ops-layout-grid`

Goal:
Improve visual rhythm without changing layout ownership.

### 2. Toolbar Density
Selectors:
- `.ops-toolbar`
- `.ops-toolbar .command-input`
- `.ops-toolbar .sidebar-select`

Goal:
Improve filter/search spacing and prevent cramped controls.

### 3. Table Readability
Selectors:
- `.ops-table-wrap`
- `.ops-table`
- `.ops-table th`
- `.ops-table td`
- `.ops-table tr.is-selected td`

Goal:
Improve row readability and selected-state clarity.

### 4. Empty States
Selectors:
- `.ops-main-column .empty-box`

Goal:
Make empty operational states clearer and less visually heavy.

## Recommended First Patch
T154A should be a CSS-only patch focused on:

- `.ops-table-wrap`
- `.ops-table`
- `.ops-main-column .empty-box`

Reason:
This improves the main working area without touching actions, backend authority, routing, or mutation behavior.

## Browser QA Required After Patch
Verify:
- `#operations-centers`
- `#task-center`
- `#queue-center`
- `#job-monitor`
- `#notification-center`

Checks:
- No crash.
- No console syntax error.
- Main view remains readable.
- Tables remain readable.
- Empty states remain centered and clear.
- Right rail remains visible after T153C.
- Action Panel and AI Panel remain visible.
- Disabled actions remain disabled.
- No behavior changes.
- No mobile/responsive layout break.
