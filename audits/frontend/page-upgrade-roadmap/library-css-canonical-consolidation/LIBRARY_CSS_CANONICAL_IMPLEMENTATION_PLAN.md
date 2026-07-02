# Library CSS Canonical Consolidation Implementation Plan

## Status
Plan-only checkpoint before CSS implementation.

## Baseline
Audit committed in:
4c254b5 Add Library CSS canonical consolidation audit

## Problem confirmed
The Library page CSS has accumulated multiple generations of styling inside:
- public/control-center/styles/14-page-standard.css

The audit found:
- 103 Library-related selectors
- 21 duplicated Library selectors
- multiple historical Library sections:
  - Library Workspace UX Polish
  - Library Interaction + Density Fix
  - Library professional polish
  - LIBRARY UX POLISH
  - LIBRARY UX FINAL SIZE + DARK UPLOAD FIX
  - LIBRARY DOCUMENT PREVIEW
  - LIBRARY OPERATING SURFACE PANELS

## Goal
Create one canonical scoped Library CSS section:

LIBRARY CANONICAL OPERATING SURFACE

This section should become the only active Library visual authority.

## Implementation type
CSS-only.

## Allowed production file
- public/control-center/styles/14-page-standard.css

## Forbidden files
- public/control-center/pages/library.js
- public/control-center/pages/library/*.js
- public/control-center/api.js
- public/control-center/app.js
- public/control-center/index.html
- backend/runtime files
- data/projects
- legacy files

## Canonical CSS section structure
The final Library CSS section should be organized as:

1. Library shell / page container
2. Overview and required asset cards
3. Upload area
4. Workspace layout
5. Folder list
6. Toolbar
7. Filter bar
8. Asset grid
9. Preview / inspector
10. Action Panel
11. AI Panel
12. Document preview
13. Responsive behavior

## Consolidation rules

### 1. Scope all Library rules
Prefer:
[data-page="library"] ...

Avoid unscoped Library rules unless they are intentionally shared and proven safe.

### 2. Do not add another styling layer
The implementation must not append another large Library CSS block while leaving the old sections active.

### 3. Merge, then remove old duplicates
Repeated selectors must be merged into the canonical section.

### 4. Preserve behavior
CSS must not hide or disable:
- upload controls
- refresh controls
- filter/search controls
- folder controls
- asset cards
- selected card state
- preview area
- source-of-truth controls
- status controls
- rename/archive/delete controls
- Action Panel
- AI Panel

### 5. Preserve visual intent
The page should remain:
- compact
- readable
- premium
- dark but not too heavy
- clear active states
- clear selected asset state
- consistent with MH-OS operating surface design

## Target density decisions
- Use compact card spacing.
- Avoid oversized nested cards.
- Keep grid cards readable but not oversized.
- Keep side panel usable without excessive internal scrolling.
- Use controlled accent color.
- Avoid neon overuse.
- Keep destructive actions visually separated.

## Implementation stages

### Stage A — Snapshot before change
Before editing CSS:
- save current Library CSS ranges to an audit artifact
- count duplicated selectors again

### Stage B — Build canonical section
Create one canonical section in the CSS file.

### Stage C — Remove or neutralize old Library sections
Remove duplicated historical Library sections only after their rules are represented in the canonical section.

### Stage D — Validate
Run:
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/library/*.js
- node --check public/control-center/app.js
- node scripts/check-control-center-legacy-assets.js

### Stage E — Browser QA
Browser QA must confirm:
- Library loads
- no stuck loading
- upload button visible
- refresh button visible
- filters visible
- folders visible
- asset grid visible
- selected card visible
- preview area visible
- Action Panel visible
- AI Panel visible
- source-of-truth action visible
- copy path action visible
- archive/delete actions preserved
- legacy CSS/JS not loaded

## Rollback plan
If Library fails to load or UI breaks:
- git checkout -- public/control-center/styles/14-page-standard.css
- do not commit
- record failure in audit notes

If committed and later found broken:
- git revert <commit>
