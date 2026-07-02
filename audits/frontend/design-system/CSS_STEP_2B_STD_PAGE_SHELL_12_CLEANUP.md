# CSS Step 2B - Retire Duplicate .std-page-shell From 12

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Phase: CSS Step 2B
Scope: Runtime CSS patch only plus audit documentation

## 1. What Was Removed/Retired

Retired duplicate .std-page-shell ownership from:

- public/control-center/styles/12-pages.css

Change type:

- Grouped selector update (not standalone block removal).

Before:

```css
.std-page-shell,
.home-command-center,
.setup-wizard-shell,
.library-smart-shell,
.content-smart-root,
.aicmd-shell {
  display: grid;
  gap: 14px;
  min-width: 0;
}
```

After:

```css
.home-command-center,
.setup-wizard-shell,
.library-smart-shell,
.content-smart-root,
.aicmd-shell {
  display: grid;
  gap: 14px;
  min-width: 0;
}
```

Only .std-page-shell was removed from the group. The rule remains intact for the remaining selectors.

## 2. Selector Form: Standalone Or Grouped

The .std-page-shell occurrence in 12-pages.css was part of a grouped selector. Step 2B removed only that selector token and preserved the rule body and all remaining selectors.

## 3. Why 14 Remains Canonical

Canonical ownership for std-* primitives remains in:

- public/control-center/styles/14-page-standard.css

Confirmed .std-page-shell remains present in 14.

No changes were made to 14 in this step.

## 4. Behavior Preservation Note

Behavior preservation is maintained because:

- .std-page-shell remains defined in canonical owner 14-page-standard.css.
- 12-pages.css still applies shared layout styles to its non-std page-family selectors.
- Runtime JS and route files were not modified and pass syntax checks.
- Index load order was not changed.

## 5. Files Changed

- public/control-center/styles/12-pages.css
- audits/frontend/design-system/CSS_STEP_2B_STD_PAGE_SHELL_12_CLEANUP.md

## 6. Validation Results

Executed commands:

1. git status --short
2. grep -RInE "std-page-shell" public/control-center/styles/08-components-foundation.css public/control-center/styles/12-pages.css public/control-center/styles/14-page-standard.css
3. node --check public/control-center/app.js
4. node --check public/control-center/router.js
5. node --check public/control-center/ui/page-standard.js
6. git diff --stat
7. git status --short data/projects

Observed results:

- 12-pages.css modified; Step 2B audit doc added.
- grep shows no .std-page-shell in 12-pages.css.
- grep confirms .std-page-shell remains absent in 08-components-foundation.css.
- grep confirms .std-page-shell remains present in 14-page-standard.css.
- node --check passed for app.js, router.js, and ui/page-standard.js.
- data/projects remains unchanged.

## 7. Remaining std-* Cleanup Deferred

Deferred items remain out of Step 2B scope, including any additional std-* ownership consolidation beyond .std-page-shell in 12-pages.css.

No changes were made to:

- public/control-center/styles/08-components-foundation.css
- public/control-center/styles/14-page-standard.css
- runtime JS
- backend
- data/projects
- index.html load order
- legacy files/folders
- Governance runtime
- Settings runtime
