# CONTEXT SYSTEM NORMALIZATION AUDIT

**Date:** 2026-05-23
**Branch:** architecture/frontend-consolidation-v1

---

## 1. Executive Summary
Extraction of `.std-context-chip` and `.std-context-ribbon` is **not safe** at this time. These selectors are used both as base primitives and as the foundation for page-scoped overrides in operations centers and other pages. Direct extraction would break context composition and cascade, and risks fragmenting the context system further. A new, unified `mhos-context-*` primitive should be introduced and adopted gradually.

## 2. Why Context Extraction Is Not Safe Yet
- `.std-context-chip` and `.std-context-ribbon` are used as both global primitives and as the base for page-specific overrides (e.g., in 09-operations-centers.css).
- Operations centers, task/queue/job/notification pages, and other modules use these selectors with `[data-page]` scoping and custom cascade.
- Extraction would break page-specific context customizations and introduce cascade bugs.

## 3. Current Context Systems Inventory
- **Base primitives:** `.std-context-chip`, `.std-context-ribbon`, `.std-context-title`, `.std-context-description`, `.std-context-actions`, `.std-context-btn` (14-page-standard.css)
- **Operations centers:** `[data-page] .std-context-*` (09-operations-centers.css)
- **Publishing:** `.publishing-command-header-context` (12-pages.css)
- **AI/Research/Workflow:** Custom context summary blocks, often not using standard primitives

## 4. Base Context Primitive Usage
- Defined in 14-page-standard.css as reusable context UI blocks
- Used directly in some pages, but also as the base for overrides
- Referenced in operations centers, campaign studio, home, workflows, research, and publishing pages

## 5. Page-Scoped Context Overrides
- 09-operations-centers.css: `[data-page] .std-context-ribbon`, `[data-page] .std-context-chip`, etc. provide custom context appearance per operations module
- 12-pages.css: `.publishing-command-header-context` and related selectors for publishing context
- Many pages use context as a composition of base + override, not as a pure primitive

## 6. Operations Centers Context System
- Task, queue, job, and notification centers all use `[data-page] .std-context-*` for context ribbons, chips, and actions
- These overrides are tightly coupled to the operations centers' visual identity and cascade
- Extraction would break these page-specific customizations

## 7. Campaign/Home/Workflow Context Comparison
- **Campaign Studio:** Uses `.std-context-*` and custom `.mhos-campaign-context-*` blocks
- **Home:** Uses custom executive/strategist summary, not always `.std-context-*`
- **Workflows:** Uses context summary, but with custom logic and markup
- **Research:** Uses context summary, but with custom structure
- **Publishing:** Uses `.publishing-command-header-context`, not `.std-context-*`

## 8. Context Naming Problems
- `.std-context-*` is overloaded: used for both base primitives and page-specific overrides
- No clear separation between global primitives and page-scoped context systems
- Naming does not reflect page/module ownership or cascade intent

## 9. Context Composition Problems
- Pages compose context from both base and override selectors, leading to cascade ambiguity
- No clear boundary between what is a primitive and what is a page override
- Some context blocks are duplicated or diverge in markup/behavior

## 10. Proposed Unified Context Model
- Introduce new `mhos-context-*` primitives for global, shared context UI
- Gradually migrate pages to use `mhos-context-*` for base context, keeping `[data-page] .std-context-*` for legacy overrides
- Standardize markup and cascade for all context blocks
- Document ownership and cascade rules for each context system

## 11. What Must Stay Temporarily
- All `[data-page] .std-context-*` overrides in 09-operations-centers.css
- All `.publishing-command-header-context` and related selectors in 12-pages.css
- All custom context blocks in home, workflows, research, and campaign studio

## 12. What Can Be Standardized First
- Introduce `mhos-context-chip` and `mhos-context-ribbon` as new primitives in a new CSS file
- Standardize new pages and refactored modules to use only `mhos-context-*` for context UI
- Audit and refactor `.std-context-*` usage to clarify base vs. override

## 13. Safe Normalization Order
1. Introduce `mhos-context-chip` and `mhos-context-ribbon` primitives (do not extract `.std-context-*` yet)
2. Update new/modernized pages to use `mhos-context-*` primitives
3. Gradually migrate legacy pages from `.std-context-*` to `mhos-context-*` as overrides are removed
4. Only extract `.std-context-*` after all page-scoped overrides are migrated or removed

## 14. Validation Commands
- `grep -RIn "std-context-chip\|std-context-ribbon" public/control-center/styles/`
- `grep -RIn "std-context-chip\|std-context-ribbon" public/control-center/pages/`
- `grep -RIn "mhos-context-chip\|mhos-context-ribbon" public/control-center/`
- `git diff --stat`
- `git status --short`

## 15. First Recommended Implementation Step
**Introduce new `mhos-context-chip` and `mhos-context-ribbon` primitives in a new CSS file.**
- Do not extract or rename `.std-context-*` yet
- Update only new or refactored pages to use the new primitives
- Begin migration plan for legacy overrides

---

**No CSS or JS changes made. This is an audit only.**
