# Media Studio Step 2C - Formatter Extraction Plan

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only plan (no runtime extraction in this step)
Primary source: public/control-center/pages/media-studio-workspace.js

## 1. Executive Summary

This document defines the exact future extraction plan for pure formatter helpers into a dedicated module at public/control-center/pages/media-studio/media-formatters.js. The scope is intentionally narrow and behavior-preserving: pure formatter/string/shape helpers only.

Step 2B conclusion is preserved:
- First safe extraction candidate is pure helpers only.
- No storage, payload, session, render, role-default, or bind logic moves in this pass.

Doctrine alignment:
- Backend owns operational authority.
- Frontend projects operational authority.

## 2. Why This Step Exists

### 2.1 Reduce Media Studio size safely

`media-studio-workspace.js` is 3215 lines. Approximately 125 lines near the top and two regions deeper in the file are pure stateless formatting utilities. Extracting them without touching surrounding code creates a measurably smaller source file for future work while carrying no behavioral risk.

### 2.2 Preserve behavior absolutely

All 15 candidate helpers are pure or near-pure functions: deterministic input → output with no side effects, no DOM access, no localStorage writes, no session mutation, and no backend interaction. Moving them and re-importing them cannot change observable behavior if done correctly.

### 2.3 Prepare future premium UX work

The long-term UX goal is:
> MH-OS must become an international, powerful, smart AI Business Operating System.
> Every page must move toward: Header + Main View + Action Panel + AI Panel.

Clean module boundaries are a prerequisite for sustainable premium UI work. Isolating pure format helpers first is the lowest-risk first step toward that boundary discipline.

### 2.4 Avoid touching authority, state, and orchestration

Step 2B classified the following as defer or do-not-extract-yet:
- `bindMediaStudio` — operational sequencing
- `sendPublishingHandoff` — authority handoff
- `mediaStudioRoute.render` + `loadMediaWorkspace` — first-load lifecycle
- All localStorage adapters, payload builders, approval/task/handoff action wiring, and role defaults

This step explicitly does not plan to touch those surfaces.

## 3. Exact Candidate Helper List

- asArray
- asObject
- asString
- clean
- titleCase
- toKey
- nowIso
- firstText
- formatDateTime
- formatCount
- statusTone
- statusClass
- safeJsonParse
- parseStructuredList
- normalizeMediaUrl

## 4. Helper Contracts And Extraction Risk

Notes on usage counts:
- Counts below are in-file usage counts from source scan, excluding the definition line.
- These are planning metrics only and not runtime assertions.

| Helper | Source line | Input -> Output contract | Dependencies | Side effects | Usage count / usage regions | Extraction risk |
|---|---:|---|---|---|---|---|
| asArray | 90 | any -> array (returns [] when not array) | none | none | 37 uses; regions around 227-243, 529-537, 612-619, 1828-1829, 2091 | Low |
| asObject | 94 | any -> object (returns {} when null/non-object) | none | none | 37 uses; regions around 159, 270-271, 500, 658-660, 933-979, 1816-1834, 1925-1948 | Low |
| asString | 98 | any -> string (null/undefined -> empty string) | none | none | 59 uses; regions around 184, 239-318, 520-541, 639-644, 952-1080, 1985-2015, 2785-3096 | Low |
| clean | 103 | any -> trimmed string | asString | none | 48 uses; regions around 114-123, 739-747, 771-796, 1006, 1821-1835, 2077-2079, 2432 | Low |
| titleCase | 107 | string-like -> title-cased label (underscore/hyphen normalization) | asString | none | 29 uses; regions around 505, 817-899, 1560-1664, 1797, 2063-2146, 2303 | Low |
| toKey | 113 | string-like -> normalized lowercase key | clean | none | 11 uses; regions around 147-163, 501, 918-923, 939-942, 1049, 3097 | Low |
| nowIso | 117 | none -> ISO timestamp string | Date | non-deterministic timestamp source | 11 uses; regions around 241-262, 318-358, 904, 970-971, 1057-1077, 1125, 2353 | Low-Medium (time dependency) |
| firstText | 121 | variadic values -> first non-empty trimmed string | clean | none | 90 uses; broad regions across defaults, normalization, payload composition, rendering, generation/error text, handoff mapping | Low |
| formatDateTime | 129 | date-like -> localized short date/time string or Not recorded | Intl.DateTimeFormat, Date | locale/timezone dependent formatting | 1 use; region around 2102 | Low-Medium (locale output variance) |
| formatCount | 140 | numeric-like -> rounded non-negative integer string | Number math | none | 9 uses; regions around 1571-1579, 1790, 2122 | Low |
| statusTone | 176 | status string -> semantic tone label (success/warning/danger/neutral) | none | none | 4 uses; regions around 1603, 1880, 2066, 2198 | Low |
| statusClass | 183 | status string -> CSS-safe class fragment | asString | none | 1 use; region around 1560 | Low |
| safeJsonParse | 450 | string/object + fallback -> parsed object or fallback | asString, JSON.parse | catches parse errors internally | 1 use; region around 329 (version summary fallback parse) | Low |
| parseStructuredList | 1908 | text -> list line array (prefers bullet/numbered, else prefixed fallback lines) | asString, clean | none | 1 use; region around 2015 (video brief text rendering) | Low |
| normalizeMediaUrl | 1915 | url-like + data-image flag -> allowed media URL or empty string | clean, regex checks | none | 11 uses; regions around 1931-1948 (preview URL selection chain) | Low |

## 4a. Intra-Module Dependency Graph

The following internal dependency chain must be respected in module declaration order:

```
asString          (no deps)
  ├── clean       (→ asString)
  │     ├── toKey (→ clean)
  │     ├── firstText (→ clean)
  │     ├── parseStructuredList (→ asString, clean)
  │     └── normalizeMediaUrl (→ clean)
  ├── titleCase   (→ asString)
  ├── statusClass (→ asString)
  └── safeJsonParse (→ asString)

asArray           (no deps)
asObject          (no deps)
nowIso            (no deps beyond Date built-in)
formatDateTime    (no deps beyond Date/Intl built-ins)
formatCount       (no deps beyond Number/Math built-ins)
statusTone        (no deps)
```

Required declaration order in `media-formatters.js`:
1. `asString`
2. `asArray`
3. `asObject`
4. `clean`
5. `titleCase`
6. `toKey`
7. `nowIso`
8. `firstText`
9. `formatDateTime`
10. `formatCount`
11. `statusTone`
12. `statusClass`
13. `safeJsonParse`
14. `parseStructuredList`
15. `normalizeMediaUrl`

## 5. Proposed Future Module API

Target module path:
- public/control-center/pages/media-studio/media-formatters.js

Proposed export surface for a future runtime pass:

```js
export function asArray(value) {}
export function asObject(value) {}
export function asString(value) {}
export function clean(value) {}
export function titleCase(value) {}
export function toKey(value) {}
export function nowIso() {}
export function firstText(...values) {}
export function formatDateTime(value) {}
export function formatCount(value) {}
export function statusTone(status) {}
export function statusClass(status) {}
export function safeJsonParse(value, fallback = {}) {}
export function parseStructuredList(text, fallbackPrefix = "-") {}
export function normalizeMediaUrl(url, allowDataImage = false) {}
```

Constraints for that future module:
- Keep function names and signatures identical.
- Keep behavior identical (including fallback strings and URL acceptance rules).
- Keep no side effects except nowIso timestamp generation and safeJsonParse try/catch behavior.

## 6. Import Plan For A Future Extraction Pass

Future Step 2D import patch plan (not executed in Step 2C):

1. Create public/control-center/pages/media-studio/media-formatters.js with exact helper implementations copied verbatim.
2. In public/control-center/pages/media-studio-workspace.js add grouped imports from the new module.
3. Remove duplicated in-file helper declarations only after imports are active.
4. Do not change call sites, order, branching, or payload structures.
5. Keep all non-helper functions in place.

Import style target:

```js
import {
  asArray,
  asObject,
  asString,
  clean,
  titleCase,
  toKey,
  nowIso,
  firstText,
  formatDateTime,
  formatCount,
  statusTone,
  statusClass,
  safeJsonParse,
  parseStructuredList,
  normalizeMediaUrl
} from "./media-studio/media-formatters.js";
```

## 7. Parity Validation Plan (Future Runtime Pass)

Required checks:
- node --check public/control-center/pages/media-studio-workspace.js
- node --check public/control-center/pages/media-studio/media-formatters.js
- node --check public/control-center/api.js
- node --check public/control-center/app.js

Import and definition checks:
- grep for new import list in media-studio-workspace.js
- grep to verify removed inline definitions for the 15 helpers from media-studio-workspace.js
- grep to verify exported helper names in media-formatters.js

Optional deterministic helper smoke script (only if future pass allows):
- Execute a small script that imports formatter helpers and checks deterministic outputs for:
  - asArray/asObject/asString/clean/titleCase/toKey/firstText
  - formatCount/statusTone/statusClass
  - safeJsonParse fallback behavior
  - parseStructuredList behavior
  - normalizeMediaUrl allow/deny matrix
- Avoid strict snapshot assertions for formatDateTime unless locale is fixed.
- For nowIso, assert ISO shape only, not exact value.

## 8. What Not To Include In media-formatters.js

Explicit exclusions:
- storage helpers
- payload builders
- render functions
- session helpers
- role defaults
- bind handlers

Concrete examples to exclude:
- readDraftMap/writeDraftMap and related storage wrappers
- buildMediaPayload/buildGenerationRequestPayload/buildPublishingHandoff
- renderScopedStyles and all render* section builders
- ensureSession/syncFormFromItem/resetForm/versioning orchestration
- MEDIA_ROLE_DEFAULTS/SPECIALISTS/ownerRoleForMode
- bindMediaStudio/sendPublishingHandoff

## 9. Safe Future Step 2D Execution Plan

Proceed to Step 2D only after this Step 2C plan is committed.

Step 2D must follow this sequence exactly:

1. **Create** `public/control-center/pages/media-studio/media-formatters.js` with all 15 helpers exported, in the declaration order specified in Section 4a.
2. **Add** the import block from Section 6 to the top of `media-studio-workspace.js`, immediately after the existing imports.
3. **Remove** the 15 function definitions from `media-studio-workspace.js`:
   - Remove `asArray` through `statusClass` from the contiguous block near lines 90–193.
   - Remove `safeJsonParse` from near line 450.
   - Remove `parseStructuredList` from near line 1908.
   - Remove `normalizeMediaUrl` from near line 1915.
4. **Verify** surrounding code is intact and no helper call sites are broken.
5. **Run** the full parity validation plan from Section 7.
6. **Confirm** zero behavior change: no generation, approval, handoff, task, save, local draft, or session behavior altered.
7. **Confirm** `data/projects` is unchanged.
8. **Confirm** backend, `api.js`, and `app.js` are unchanged.

**No UI changes, no panel additions, no backend changes, no handler rewiring are permitted in Step 2D.**

## 10. Stop Conditions

Step 2D must halt and return to documentation if any of the following are true:

| Stop condition | Description |
|---|---|
| Hidden state dependency | Any candidate helper reads or writes session state, `mediaStudioSessions`, or form fields at runtime |
| Load-order dependency | Any helper is called before the ES module import can safely resolve (e.g., inline IIFE at parse time before import) |
| Media Studio session state dependency | Any helper accepts or closes over session-specific values that differ per project key |
| Behavior change required | Extraction cannot be completed without altering any return value, side effect, or call contract |
| Import path mismatch | The `media-studio-workspace.js` module system does not support the `./media-studio/` relative path at runtime |
| Circular import | `media-formatters.js` imports from `media-studio-workspace.js` or any other workspace module |
| Syntax error | `node --check` fails on either file after extraction |

If any stop condition is triggered: revert the extraction, document the blocker in a new Step 2D-BLOCKED audit file, and do not proceed.

## 11. No-Change Confirmation

This Step 2C artifact is documentation-only.
No backend, data/projects, media-studio-workspace.js, api.js, app.js, runtime behavior, handlers, or authority flow was changed.
