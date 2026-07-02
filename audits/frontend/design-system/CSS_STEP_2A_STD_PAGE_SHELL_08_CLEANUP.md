# CSS Step 2A - Retire Duplicate .std-page-shell From 08

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Phase: CSS Step 2A
Scope: Runtime CSS patch only + audit documentation

## 1. What Was Removed/Retired

Removed duplicate `.std-page-shell` definition from:

- `public/control-center/styles/08-components-foundation.css`

Removed block:

```css
.std-page-shell {
  display: grid;
  gap: 18px;
  min-width: 0;
}
```

No other `std-*` selectors were modified in `08-components-foundation.css` during Step 2A.

## 2. Why 14 Remains Canonical

Canonical ownership for standard page primitives remains in:

- `public/control-center/styles/14-page-standard.css`

Confirmed active `.std-page-shell` definitions in 14:

- line 6 (`.std-page-shell` canonical shell)
- line 295 (interaction safety grouped selector includes `.std-page-shell`)

Load order keeps 14 after 08 and 12, so 14 remains the effective owner for `.std-page-shell` behavior.

## 3. Behavior Preservation Note

Step 2A removes only the duplicate definition in 08 and relies on the existing canonical definition in 14.

Expected runtime behavior is preserved because:

- `.std-page-shell` still exists in 14 (canonical owner).
- Runtime JS and routing files are unchanged and pass syntax checks.
- Index stylesheet load order was not changed.

## 4. Files Changed

- `public/control-center/styles/08-components-foundation.css`
- `audits/frontend/design-system/CSS_STEP_2A_STD_PAGE_SHELL_08_CLEANUP.md`

## 5. Validation Results

Executed commands:

1. `git status --short`
2. `grep -RInE "std-page-shell" public/control-center/styles/08-components-foundation.css public/control-center/styles/12-pages.css public/control-center/styles/14-page-standard.css`
3. `node --check public/control-center/app.js`
4. `node --check public/control-center/router.js`
5. `node --check public/control-center/ui/page-standard.js`
6. `git diff --stat`
7. `git status --short data/projects`

Results:

- `git status --short`: only `public/control-center/styles/08-components-foundation.css` was changed at validation time.
- `grep`: `.std-page-shell` no longer present in 08; present in 12 (line 10); present in 14 (line 6 and line 295).
- `node --check` for `app.js`, `router.js`, `ui/page-standard.js`: all passed (no syntax errors).
- `git diff --stat`: removal-only delta in 08 (`6 ------`) at validation time.
- `git status --short data/projects`: no changes.

## 6. Deferred Duplicates (Not In Scope For Step 2A)

Still deferred by design:

- Duplicate `.std-page-shell` in `public/control-center/styles/12-pages.css` (untouched in this step).

No changes were made to:

- `public/control-center/styles/12-pages.css`
- `public/control-center/styles/14-page-standard.css`
- runtime JS
- backend
- `data/projects`
- index load order
- legacy files/folders
