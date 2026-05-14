# STEP 36 - Clean Global CSS Layer Plan and Controlled Introduction

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: PLAN FIRST + minimal safe implementation

---

## Executive Summary

STEP 36 introduces a controlled clean global CSS layer for future page-by-page adoption without redesigning any current page and without removing legacy CSS.

This step keeps runtime behavior stable by using opt-in selectors only and by preserving all frontend/backend contracts defined in STEP 33B, STEP 34, and STEP 35.

---

## Decision

Decision: **B) Add one new clean CSS layer file with no page adoption yet.**

Why this is safe now:
- The new layer contains only namespaced opt-in classes and namespaced tokens.
- No existing page currently uses the new class namespace.
- No global overrides were added for existing shared classes such as `.btn`, `.card`, `.panel`.
- No page selectors, IDs, data attributes, JS handlers, API calls, backend behavior, or confirmations were changed.

---

## Files Inspected

1. `public/control-center/index.html`
2. `public/control-center/styles/00-tokens.css`
3. `public/control-center/styles/08-components-foundation.css`
4. `public/control-center/styles/14-page-standard.css`
5. `audits/frontend/global-ui/STEP_33B_GLOBAL_UI_UX_PRESERVATION_CONTRACT.md`
6. `audits/frontend/global-ui/STEP_34_GLOBAL_UI_SYSTEM_AUDIT.md`
7. `audits/frontend/global-ui/STEP_35_FINAL_DESIGN_DIRECTION_AND_TOKENS_PLAN.md`

Files introduced/updated in this step:
1. `public/control-center/styles/15-clean-operating-layer.css`
2. `public/control-center/index.html` (added stylesheet import after `14-page-standard.css`)

---

## Proposed Clean Layer Location

Primary file location:
- `public/control-center/styles/15-clean-operating-layer.css`

Load order location:
- Loaded in `public/control-center/index.html` immediately after `14-page-standard.css`.

Rationale:
- The clean layer is available globally for future adoption.
- Since selectors are opt-in and namespaced, current pages remain visually unchanged.

---

## CSS Ownership Rules

1. Legacy/shared active styles remain owned by existing files (`00` to `14`).
2. The clean layer owns only namespaced opt-in primitives for future adoption.
3. Page teams may adopt clean-layer classes only during documented page checkpoints.
4. Any adoption patch must preserve IDs, data attributes, handlers, API paths, confirmations, and protected copy/provenance wording.
5. Legacy CSS remains source-of-truth until each page passes adoption validation.

---

## Allowed Selectors

Allowed in clean layer:
1. Namespaced class selectors only (example namespace: `.mhos-clean-*`).
2. Namespaced custom properties (example: `--mhos-clean-*`).
3. Optional state classes only when attached to namespaced roots (example: `.mhos-clean-surface.is-raised`).
4. Utility and primitive selectors that require explicit page opt-in.

---

## Forbidden Selectors

Forbidden in clean layer:
1. Existing global primitives (`.btn`, `.card`, `.panel`, `.badge`, etc.).
2. Existing page or route selectors (`[data-page=...]`, page-specific classes, existing section selectors).
3. Global element overrides (`body`, `main`, `button`, `input`, etc.) for redesign purposes.
4. Existing IDs and data attributes used by runtime handlers.
5. Any selector designed to force broad visual replacement of current pages.

---

## Opt-In Adoption Model

1. Keep clean layer loaded globally but inert by default.
2. During a page checkpoint, add namespaced classes to that page only.
3. Validate no behavior/copy/provenance/safety regression.
4. Keep fallback to legacy styles until page QA is complete.
5. Repeat page-by-page; do not perform all-pages-at-once adoption.

---

## Validation Checklist

1. Import order confirms `15-clean-operating-layer.css` is after `14-page-standard.css`.
2. New file contains only namespaced opt-in selectors/tokens.
3. No global overrides for `.btn`, `.card`, `.panel`.
4. No page-specific selectors or ID/data-attribute selectors added.
5. No JS, API, backend, route, data/projects, or confirmation logic changes.
6. Protected copy/provenance wording is unchanged.
7. Syntax/readability checks pass for added files.

---

## Rollout Order

1. Keep STEP 36 as controlled layer introduction.
2. Pick one low-risk page for first opt-in adoption.
3. Run audit -> small patch -> validation -> QA closeout -> checkpoint.
4. Expand to additional pages only after first adoption stability is confirmed.
5. Evaluate duplication cleanup only after multiple successful page adoptions.

---

## Legacy CSS Deletion Prohibition

Legacy CSS and existing active global CSS must not be deleted during STEP 36.

Deletion/removal is explicitly blocked until:
1. clean-layer adoption has been validated page-by-page,
2. no selector regressions are observed,
3. ownership and parity checks are documented,
4. dedicated cleanup checkpoints approve safe removal.

---

## Recommended First Page for Adoption

Recommended first page: **Task Center**

Reason:
1. Operational layout is rich enough to validate shells/surfaces/chips.
2. Lower risk than Publishing/Campaign/Library critical mutation flows.
3. Good candidate for proving opt-in class strategy with minimal authority risk.

---

## Explicit Preservation Statement

This step preserves all required constraints:
- IDs preserved.
- Data attributes preserved.
- JS handlers preserved.
- API calls and backend behavior preserved.
- Route behavior preserved.
- Confirmations preserved.
- data/projects untouched.
- Protected copy/provenance wording unchanged.

---

## Explicit No Page Redesign Statement

STEP 36 is not a page redesign and not a CSS cleanup step.

It only introduces a controlled, opt-in clean CSS layer for future page-by-page adoption.
