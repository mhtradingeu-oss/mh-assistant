# CONTEXT & EXECUTIVE HEADER PRIMITIVES READINESS AUDIT

**Date:** 2026-05-23
**Branch:** architecture/frontend-consolidation-v1

---

## 1. Readiness Summary
The MH-OS frontend is not yet ready for broad extraction of context, executive header, or command header primitives. These selectors are deeply entangled with page-specific logic, legacy overrides, and have high cascade and identity risk. Only the most isolated, non-overlapping primitives should be considered for initial extraction, and only after explicit review.

## 2. Current Header Systems Inventory
- `.topbar`, `.topbar-left`, `.topbar-center`, `.topbar-right` (10-topbar-canonical.css)
- `.home-exec-header`, `.home-header-title`, `.home-header-subtitle`, `.home-header-status`, `.home-header-score` (13-home-executive.css)
- `.std-context-ribbon`, `.std-context-title`, `.std-context-chip`, `.std-context-actions` (14-page-standard.css)
- `.publishing-command-header`, `.publishing-command-header-title`, `.publishing-command-header-context` (12-pages.css)
- `:where(.mhos-clean-header)` and related (15-clean-operating-layer.css)

## 3. Current Context Ribbon / Summary Systems Inventory
- `.std-context-ribbon`, `.std-context-chip`, `.std-context-title`, `.std-context-description`, `.std-context-metrics` (14-page-standard.css)
- `.home-header-status`, `.home-header-score`, `.home-header-score-label` (13-home-executive.css)
- `.publishing-command-header-status`, `.publishing-command-header-context` (12-pages.css)
- `.governance-evidence-summary`, `.governance-evidence-summary-header` (12-pages.css)

## 4. Command Header Candidates
- `.publishing-command-header`, `.publishing-command-header-title`, `.publishing-command-header-context`, `.publishing-command-header-status`, `.publishing-command-header-safety` (12-pages.css)
- `.std-context-actions`, `.std-context-btn` (14-page-standard.css)
- `.exec-action-btn`, `#execNewBtn`, `#execAskAiBtn` (10-topbar-canonical.css)

## 5. Strategist / AI Next Move Candidates
- `.home-header-title`, `.home-header-subtitle`, `.home-header-status` (13-home-executive.css)
- `.std-context-title`, `.std-context-description` (14-page-standard.css)
- Strategist/AI summary and recommendation blocks in home.js, ai-command.js, campaign-studio.js

## 6. Operating Summary Candidates
- `.home-header-score`, `.home-header-score-label` (13-home-executive.css)
- `.std-context-metrics` (14-page-standard.css)
- `.publishing-command-header-status` (12-pages.css)
- `.governance-evidence-summary-header` (12-pages.css)

## 7. Selectors Safe To Extract First
- `.std-context-chip` (if not duplicated/overridden)
- `.std-context-ribbon` (if not duplicated/overridden)
- Possibly `.exec-action-btn` (if not used outside topbar)

## 8. Selectors Not Safe To Extract Yet
- `.home-exec-header`, `.home-header-title`, `.home-header-subtitle`, `.home-header-status`, `.home-header-score` (entangled with home page logic)
- `.publishing-command-header*` (used in multiple page contexts, legacy overrides)
- `.std-context-title`, `.std-context-description`, `.std-context-actions`, `.std-context-btn` (potential legacy overlap)
- Any selector with overrides in 12-pages.css or 13-home-executive.css
- `:where(.mhos-clean-header)` and related (used as global shell)

## 9. Page-by-Page Header Consistency Findings
- **home.js:** Uses custom executive header and strategist/AI summary blocks; not fully aligned with standard context ribbon.
- **campaign-studio.js:** Uses context and strategist/AI summary, but with custom logic and markup.
- **ai-command.js:** Uses strategist/AI summary, but not standard context ribbon.
- **publishing.js:** Uses `.publishing-command-header` and context, but with unique structure.
- **workflows.js:** Uses context and summary, but with custom context logic.
- **research.js:** Uses context and strategist/AI summary, but with custom structure.

## 10. Dependency and Cascade Risks
- Many selectors are overridden or duplicated across 12-pages.css, 13-home-executive.css, and 14-page-standard.css.
- Import order is critical; context and header primitives must be imported after tokens but before legacy overrides.
- Some selectors use high specificity or are referenced in JS-generated markup.
- Extraction may break page identity or context if not coordinated with page logic refactor.

## 11. Proposed New Files
- `mhos-context-primitives.css` (for context ribbons, chips, summary blocks)
- `mhos-command-primitives.css` (for command headers, action strips)
- `mhos-executive-header-primitives.css` (for executive/strategist header blocks, if needed)

## 12. Exact Extraction Order
1. Extract `.std-context-chip` and `.std-context-ribbon` to `mhos-context-primitives.css` (only if not duplicated/overridden)
2. Extract `.exec-action-btn` to `mhos-command-primitives.css` (only if not used outside topbar)
3. Audit `.std-context-title`, `.std-context-description`, `.std-context-actions`, `.std-context-btn` for duplication/override risk before extraction
4. Do not extract `.publishing-command-header*`, `.home-exec-header`, or strategist/AI summary blocks until page logic is unified

## 13. First Safe Extraction Recommendation
Extract only `.std-context-chip` and `.std-context-ribbon` to `mhos-context-primitives.css` if and only if:
- They are not duplicated or overridden in 12-pages.css or 13-home-executive.css
- They are not referenced with high-specificity selectors elsewhere
- All usages are updated to import the new file

## 14. Validation Commands
- `grep -RIn "std-context-chip\|std-context-ribbon" public/control-center/styles/`
- `grep -RIn "std-context-chip\|std-context-ribbon" public/control-center/pages/`
- `git diff --stat`
- `git status --short`

## 15. Rollback Strategy
- Keep all extractions in a single commit
- Do not delete or modify original selectors until all pages are validated
- If any regression is detected, revert the commit and restore original imports
- Maintain a detailed extraction report for traceability

---

**No CSS or JS changes made. This is an audit only.**
