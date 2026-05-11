# CSS Step 2C - Retire Duplicate .std-main-content-slot From 08

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Phase: CSS Step 2C
Scope: Runtime CSS patch only plus audit documentation

## 1. What Was Removed/Retired

Retired duplicate .std-main-content-slot ownership from:

- public/control-center/styles/08-components-foundation.css

Change type:

- Grouped selector update (not standalone block removal).

Before:

```css
.std-section-block,
.std-work-area,
.std-main-content-slot,
.std-advanced-grid,
.setup-main,
.setup-side,
.home-main-left,
.home-main-right,
.std-main-left,
.std-main-right {
  display: grid;
  gap: 14px;
  min-width: 0;
}
```

After:

```css
.std-section-block,
.std-work-area,
.std-advanced-grid,
.setup-main,
.setup-side,
.home-main-left,
.home-main-right,
.std-main-left,
.std-main-right {
  display: grid;
  gap: 14px;
  min-width: 0;
}
```

Only .std-main-content-slot was removed from the group. The rule remains intact for all remaining selectors.

## 2. Selector Form: Standalone Or Grouped

The .std-main-content-slot occurrence in 08-components-foundation.css was part of a grouped selector. Step 2C removed only that selector token and preserved the rule body and all remaining selectors intact.

## 3. Why 14 Remains Canonical

Canonical ownership for std-* primitives remains in:

- public/control-center/styles/14-page-standard.css

Confirmed .std-main-content-slot remains present in 14 with explicit definitions at:

- line 229 (standalone rule with min-width: 0)
- line 295 (grouped selector for pointer-events: auto)

No changes were made to 14 in this step.

## 4. Why .std-main-grid Was Not Touched

.std-main-grid remains in 08-components-foundation.css because:

- It is not duplicated in 14-page-standard.css.
- Step 2C scopes only to .std-main-content-slot retirement.
- Future cleanup of .std-main-grid ownership migration will be handled in a separate step if needed.

## 5. Behavior Preservation Note

Behavior preservation is maintained because:

- .std-main-content-slot remains defined in canonical owner 14-page-standard.css.
- The shared grid layout rule still applies to remaining selectors (.std-section-block, .std-work-area, etc.).
- Runtime JS and route files were not modified and pass syntax checks.
- Index load order was not changed.

## 6. Files Changed

- public/control-center/styles/08-components-foundation.css
- audits/frontend/design-system/CSS_STEP_2C_STD_MAIN_CONTENT_SLOT_08_CLEANUP.md

## 7. Validation Results

Executed commands:

1. git status --short
2. grep -RInE "std-main-content-slot|std-main-grid|std-page-shell" public/control-center/styles/08-components-foundation.css public/control-center/styles/12-pages.css public/control-center/styles/14-page-standard.css public/control-center/ui/page-standard.js
3. node --check public/control-center/app.js
4. node --check public/control-center/router.js
5. node --check public/control-center/ui/page-standard.js
6. git diff --stat
7. git status --short data/projects

Observed results:

- 08-components-foundation.css modified; Step 2C audit doc added.
- grep shows no .std-main-content-slot in 08-components-foundation.css.
- grep confirms .std-main-grid remains in 08-components-foundation.css (untouched per scope).
- grep confirms .std-main-content-slot remains in 14-page-standard.css.
- grep confirms .std-page-shell no longer exists in 08 or 12 (Steps 2A/2B cleanup).
- node --check passed for app.js, router.js, and ui/page-standard.js.
- data/projects remains unchanged.

## 8. Remaining std-* Cleanup Deferred

Deferred items remain out of Step 2C scope:

- .std-main-grid migration from 08 to 14 (future step).
- Any additional std-* ownership consolidation.

No changes were made to:

- public/control-center/styles/12-pages.css
- public/control-center/styles/14-page-standard.css
- runtime JS
- backend
- data/projects
- index.html load order
- legacy files/folders
- Governance runtime
- Settings runtime
