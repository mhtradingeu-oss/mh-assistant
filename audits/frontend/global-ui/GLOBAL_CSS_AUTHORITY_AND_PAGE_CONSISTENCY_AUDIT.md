# GLOBAL CSS AUTHORITY AND PAGE CONSISTENCY AUDIT

## 1. Executive Summary

The primary reason for UI inconsistency in MH-OS is a combination of CSS duplication, overlapping selectors, legacy and modern page architectures coexisting, missing shared primitives, and unfinished page transformations. The system currently suffers from:
- Competing global and page-specific selectors
- Inconsistent adoption of design tokens and primitives
- Legacy CSS and architecture still present in several pages
- Page-specific overrides and hardcoded values
- Incomplete migration to unified, authority-driven design layers

## 2. CSS Authority Map

| File | Intended Responsibility | Actual Responsibility | Conflicts | Duplication Risk | Action |
|------|------------------------|----------------------|-----------|------------------|--------|
| 00-tokens.css | Global tokens (color, typography, spacing, motion) | Used as intended, but not universally adopted | Some pages use hardcoded values or legacy tokens | Low | KEEP, enforce adoption |
| 03-app-shell.css | App shell, layout, viewport | Mostly correct, but some layout logic leaks into pages | Minor overlap with page-specific layout | Medium | KEEP, refactor for stricter shell/page separation |
| 08-components-foundation.css | Foundation for cards, panels, buttons, forms | Used for modern surfaces, but legacy classes persist | Overlap with legacy/old card classes | High | SPLIT legacy/modern, enforce modern adoption |
| 12-pages.css | Page-level overrides and patches | Mix of legacy and modern, often used for quick fixes | High risk of selector collision | High | FREEZE, refactor, migrate to primitives |
| 13-home-executive.css | Home page executive surface | Modern, but some styles duplicate foundation | Overlap with foundation and page shell | Medium | KEEP, deduplicate with foundation |
| 14-page-standard.css | Standard page shell for modern pages | Modern, but not universally adopted | Some pages use legacy shells | Medium | KEEP, enforce as default |
| 15-clean-operating-layer.css | Workflow/AI/campaign/operating surfaces | Modern, but contains both primitives and page-specifics | Overlap with foundation and page CSS | Medium | SPLIT primitives vs. page-specific |
| 09-operations-centers.css | Task/Queue/Job/Notification centers | Page-specific, semi-modern | Some legacy selectors remain | Medium | REFINE, migrate to standard shell |
| 10-topbar-canonical.css | Topbar, workspace header | Modern, but not always used | Some pages use custom headers | Medium | KEEP, enforce as header authority |
| integrations/*.css | Integration-specific, but all files empty | Not used | None | None | REMOVE or repurpose |

## 3. Global Design Authority

- **Tokens:** 00-tokens.css
- **Typography:** 00-tokens.css (should be universal)
- **Density/Spacing:** 00-tokens.css
- **Motion:** 00-tokens.css (tokens), 08-components-foundation.css (applied)
- **Shell:** 03-app-shell.css
- **Topbar:** 10-topbar-canonical.css
- **Sidebar:** 03-app-shell.css
- **Cards/Surfaces:** 08-components-foundation.css, 15-clean-operating-layer.css (for AI/Workflow)
- **Forms:** 08-components-foundation.css
- **Buttons:** 08-components-foundation.css
- **Page Headers:** 14-page-standard.css, 10-topbar-canonical.css
- **AI Operating Surfaces:** 15-clean-operating-layer.css
- **Campaign/Workflow Surfaces:** 15-clean-operating-layer.css

## 4. Selector Duplication & Conflict Scan

- Overlapping selectors: `.card`, `.panel`, `.std-kpi-card`, `.status-card` appear in both 08-components-foundation.css and 12-pages.css
- Hardcoded values: Some pages use `font-size`, `color`, or `padding` directly instead of tokens
- Page-specific selectors: e.g., `.home-header-title`, `.campaign-studio-hero`, `.ops-shell` duplicate shell/foundation logic
- Risky patterns: Use of `[data-page]` selectors for scoping, but not always sufficient to prevent leaks

**Examples:**
- `.card` defined in both foundation and page CSS
- `.panel` and `.card-head` styles repeated
- `.std-context-title` vs. `.page-title` vs. `.home-header-title`

## 5. Page Generation Classification

| Page | Generation | Notes |
|------|------------|-------|
| Home | Modern Operating Surface | Uses executive/modern shell |
| Setup | Semi-modern Hybrid | Mix of modern shell and legacy patches |
| Library | Semi-modern Hybrid | Some legacy selectors remain |
| Integrations | Semi-modern Hybrid | Modern structure, but not fully unified |
| AI Command | Modern Operating Surface | Uses modern primitives |
| Workflows | Modern Operating Surface | Modern, but some legacy selectors |
| Publishing | Semi-modern Hybrid | Modern, but with legacy patches |
| Campaign Studio | Modern Operating Surface | Modern, but some legacy CSS remains |
| Content Studio | Modern Operating Surface | Modern |
| Media Studio | Modern Operating Surface | Modern |
| Ads Manager | Semi-modern Hybrid | Some legacy selectors |
| Research | Modern Operating Surface | Modern |
| Task Center | Semi-modern Hybrid | Uses 09-operations-centers.css, not fully migrated |
| Queue Center | Semi-modern Hybrid | Uses 09-operations-centers.css, not fully migrated |
| Job Monitor | Semi-modern Hybrid | Uses 09-operations-centers.css, not fully migrated |
| Notifications | Semi-modern Hybrid | Uses 09-operations-centers.css, not fully migrated |
| Governance | Modern Operating Surface | Modern |
| Settings | Semi-modern Hybrid | Some legacy selectors remain |

- **Needs Premium Transformation:** Setup, Library, Publishing, Ads Manager, Task/Queue/Job/Notification Centers, Settings
- **Needs Polish Only:** Home, AI Command, Workflows, Campaign Studio, Content Studio, Media Studio, Research, Governance

## 6. Header Consistency Audit

- **Topbar:** 10-topbar-canonical.css is the intended authority, but some pages use custom headers or legacy `.page-title`/`.home-header-title`/`.std-context-title`.
- **Page headers:** 14-page-standard.css and 13-home-executive.css define different header systems.
- **Final system:** Unify on 10-topbar-canonical.css for workspace header, 14-page-standard.css for page context, and enforce token-based typography.

## 7. Typography Consistency Audit

- **Causes of inconsistency:**
  - Hardcoded `font-size` and `font-weight` in page CSS
  - Legacy classes not using tokens
  - Old card/header styles in 12-pages.css
  - Page-specific labels and headings
  - Incomplete adoption of `--font-size-*` tokens

- **Fix:**
  - Remove hardcoded values
  - Enforce token usage
  - Refactor legacy classes

## 8. Surface/Card Consistency Audit

- **Causes:**
  - `.card`, `.panel`, `.status-card`, etc. defined in multiple files
  - Some pages use legacy `.card`/`.panel` from 12-pages.css, others use modern from 08-components-foundation.css
  - Page-specific card overrides (e.g., `.home-snapshot-card`, `.campaign-studio-panel-block`)
  - Issue is both CSS and page architecture (DOM structure, class usage)

- **Fix:**
  - Migrate all cards to use foundation primitives
  - Remove legacy card classes
  - Refactor page DOM to use shared primitives

## 9. AI Team / Meeting Room Status

- **Already built:**
  - AI Command page uses modern primitives and shared context
  - Meeting room/workforce primitives exist in 15-clean-operating-layer.css
- **Partially done:**
  - Not all pages use the new primitives
  - Some AI surfaces still use legacy or hybrid CSS
- **Missing:**
  - Universal adoption of AI/meeting room primitives
  - Consistent motion and interaction patterns

## 10. Motion System Readiness

- **Safe:**
  - Modern pages using 08-components-foundation.css and 15-clean-operating-layer.css
- **Not safe:**
  - Legacy pages, or pages with incomplete migration (Setup, Library, Task/Queue/Job/Notification Centers)

## 11. Risk Assessment

- **Continuing page-by-page without authority cleanup:** High risk of further duplication and inconsistency
- **Global CSS changes without page classification:** High risk of breakage
- **Deleting CSS too early:** High risk of regressions
- **Redesigning before shared primitives:** High risk of repeating legacy mistakes

## 12. Professional Fix Strategy

1. Freeze current stable layers (foundation, shell, tokens)
2. Create and publish CSS authority map
3. Define and document shared page primitives (cards, headers, forms, etc.)
4. Transform pages by priority (see below)
5. Remove duplicates only after replacement is complete
6. Final consistency pass and visual QA

## 13. Recommended File Architecture

- **15-clean-operating-layer.css:** Should be split into primitives (shared) and page-specific (AI/campaign/workflow)
- **Campaign/Workflow/AI primitives:** Move to dedicated primitives file, import into page CSS as needed
- **Legacy files:** Freeze, then remove after migration

## 14. Transformation Priority Order

- **P0:** Home, AI Command, Workflows, Campaign Studio, Content Studio, Media Studio, Governance, Research
- **P1:** Setup, Library, Publishing, Ads Manager, Integrations
- **P2:** Task Center, Queue Center, Job Monitor, Notifications
- **P3:** Settings, any remaining legacy/utility pages

## 15. Safe Implementation Plan

**Phase 1: Audit and Freeze**
- Do not edit legacy CSS except for critical bugs
- Freeze 12-pages.css and legacy selectors
- Document all authority and shared primitives

**Phase 2: Authority and Primitives**
- Refactor/split 08-components-foundation.css and 15-clean-operating-layer.css into primitives and page-specific
- Enforce token usage in all modern files

**Phase 3: Page Transformation**
- For each page (by priority):
  - Refactor DOM to use shared primitives
  - Remove page-specific overrides
  - Validate with visual regression tools

**Phase 4: Cleanup and QA**
- Remove legacy CSS only after all pages migrated
- Run full visual QA
- Commit in small, page-scoped increments

**Validation Commands:**
- `git status --short`
- `git diff --stat`
- Visual regression tests (if available)

**Commit Strategy:**
- One commit per page transformation
- Separate commits for authority/primitives refactor
- Final cleanup commit

## 16. Final Success Criteria

- All pages use shared primitives and tokens
- No duplicate or conflicting selectors
- Typography, cards, headers, and surfaces are visually consistent
- Motion and interaction are unified
- No legacy CSS remains in use
- MH-OS achieves international visual quality, unified design system, and a true AI operating system feel
