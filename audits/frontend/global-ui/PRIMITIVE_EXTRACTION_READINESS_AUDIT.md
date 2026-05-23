# PRIMITIVE EXTRACTION READINESS AUDIT

## 1. Extraction Readiness Summary
The MH-OS frontend is ready for initial primitive extraction, but only for a small, well-scoped set of selectors. Many candidate primitives are entangled with legacy selectors, page-specific overrides, or have cascade/specificity dependencies. The first extraction must be minimal, reversible, and focused on the most isolated, reusable executive primitives.

## 2. Current Import Order
From index.html:
1. 00-tokens.css
2. 01-reset.css
3. 02-layer-system.css
4. 03-app-shell.css
5. 07-sidebar.css
6. 10-topbar-canonical.css
7. 04-command-layer.css
8. 05-ai-layer.css
9. 08-components-foundation.css
10. 09-operations-centers.css
11. 12-pages.css
12. 13-home-executive.css
13. 14-page-standard.css
14. 15-clean-operating-layer.css

## 3. Candidate Primitive Groups
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-warning`, `.btn-sm`, `.quick-action-btn`, `.std-action-btn`, `.std-ai-btn`
- Cards/Panels: `.card`, `.panel`, `.data-card`, `.kpi-card`, `.metric-card`, `.status-card`, `.action-card`, `.ai-panel`, `.std-kpi-card`, `.std-status-card`, `.std-side-card`
- Context/Chip: `.std-context-chip`, `.std-context-ribbon`, `.std-context-title`, `.std-context-description`, `.std-context-actions`, `.std-context-btn`
- Workflow/Escalation: `.mhos-workflow-chain`, `.mhos-workflow-step`, `.mhos-escalation-lane`, `.mhos-escalation-item`, `.mhos-next-action`, `.mhos-workforce-room`
- Input/Form: `input`, `select`, `textarea`, `.setup-input`, `.setup-textarea`, `.sidebar-select`, `.role-switcher-select`

## 4. Selectors Safe To Extract First
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-warning`, `.btn-sm` (from 08-components-foundation.css)
- `.quick-action-btn`, `.std-action-btn`, `.std-ai-btn` (if not overridden in legacy files)
- `.mhos-workflow-chain`, `.mhos-workflow-step`, `.mhos-escalation-lane`, `.mhos-escalation-item` (from 15-clean-operating-layer.css, already isolated)
- `.std-context-chip` (from 14-page-standard.css, if not duplicated)

## 5. Selectors Not Safe To Extract Yet
- `.card`, `.panel`, `.data-card`, `.kpi-card`, `.metric-card`, `.status-card`, `.action-card`, `.ai-panel`, `.std-kpi-card`, `.std-status-card`, `.std-side-card` (used in both legacy and modern files, risk of breakage)
- `.std-context-title`, `.std-context-description`, `.std-context-actions`, `.std-context-btn` (potential legacy overlap)
- Input/form selectors (shared with legacy and modern, risk of specificity bugs)
- Any selector with overrides in 12-pages.css or 13-home-executive.css

## 6. Dependency Risks
- Many primitives depend on tokens from 00-tokens.css; extraction must preserve token usage
- Some selectors depend on context (e.g., `.btn` inside `.publishing-command-header-actions`)
- Workflow and escalation primitives may depend on variables defined in 15-clean-operating-layer.css

## 7. Cascade / Specificity Risks
- Legacy selectors in 12-pages.css and 13-home-executive.css may override or conflict with extracted primitives
- Import order is critical; extracted files must be imported after tokens but before legacy overrides
- Some selectors use high specificity or `!important` in legacy files

## 8. Proposed New Files
- mhos-action-primitives.css (for buttons, quick actions)
- mhos-workflow-primitives.css (for workflow chains, escalation lanes)
- mhos-context-primitives.css (for context chips, ribbons)

## 9. Exact Extraction Order
1. Extract `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-warning`, `.btn-sm`, `.quick-action-btn`, `.std-action-btn`, `.std-ai-btn` to mhos-action-primitives.css
2. Extract `.mhos-workflow-chain`, `.mhos-workflow-step`, `.mhos-escalation-lane`, `.mhos-escalation-item` to mhos-workflow-primitives.css
3. Extract `.std-context-chip` to mhos-context-primitives.css
4. Pause and validate before extracting any card/panel or input/form primitives

## 10. Validation Commands
- `git status --short`
- `git diff --stat`
- Visual regression test on all affected pages
- Manual check for selector conflicts in browser devtools

## 11. Rollback Strategy
- Each extraction must be a single, reversible commit
- If breakage occurs, revert the commit and restore selectors to original files
- Do not delete original selectors until all pages are validated

## 12. First Safe Extraction Recommendation
Extract only the button/action primitives listed above into mhos-action-primitives.css. This group is the most isolated, least entangled, and easiest to validate. Do not extract cards, panels, or context primitives until button extraction is proven safe.
