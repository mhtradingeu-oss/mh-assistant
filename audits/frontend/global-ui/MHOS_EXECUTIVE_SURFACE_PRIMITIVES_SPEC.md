# MHOS EXECUTIVE SURFACE PRIMITIVES SPECIFICATION

**Date:** 2026-05-23
**Branch:** architecture/frontend-consolidation-v1

---

## 1. Purpose
Define the next shared primitive layer for MH-OS: executive operating surfaces. These primitives will unify executive page composition, enable consistent executive UX, and provide a safe foundation for future migration from page-specific to global executive patterns.

## 2. Why Executive Surface Primitives Are Needed
- Current executive pages (e.g., Campaign Studio) use a mix of context, action, and workflow primitives, but lack a unified executive surface layer.
- Shared executive primitives will reduce duplication, improve maintainability, and enable rapid, safe rollout of new executive features.
- They provide a clear separation between global executive structure and page-specific identity.

## 3. Relationship To Existing Primitive Layers
- Executive surface primitives will layer above context, action, and workflow primitives.
- They compose lower-level primitives (e.g., mhos-context-*, mhos-action-*, mhos-workflow-*) into higher-order executive surfaces.
- They do not replace page identity primitives, but provide a shared structure for all executive operating pages.

## 4. Executive Surface Categories
- Executive surface (overall container)
- Executive panel (main executive block)
- Executive summary grid (metric/summary layout)
- Executive summary item (individual metric/summary)
- Executive metric label/value/note
- Executive AI panel (AI/strategist guidance)
- Executive guidance (next move, recommendation)
- Executive action row (primary actions)

## 5. Proposed Primitives
- `.mhos-executive-surface`
- `.mhos-executive-panel`
- `.mhos-executive-summary-grid`
- `.mhos-executive-summary-item`
- `.mhos-executive-metric-label`
- `.mhos-executive-metric-value`
- `.mhos-executive-metric-note`
- `.mhos-executive-ai-panel`
- `.mhos-executive-guidance`
- `.mhos-executive-action-row`

## 6. Naming Convention
- All executive surface primitives use the prefix `.mhos-executive-*`.
- Structure: `.mhos-executive-[surface|panel|summary-grid|summary-item|metric-label|metric-value|metric-note|ai-panel|guidance|action-row]`
- No page-specific or legacy names.

## 7. Ownership Rules
- Executive surface primitives own only structure, layout, and shared executive visual language.
- Page-specific logic, copy, and identity remain with the page (e.g., Campaign Studio).
- No logic or content extraction; only structure and visual primitives.

## 8. What Should Become Shared
- Executive surface container and panel structure
- Summary grid and summary item structure
- Metric label/value/note structure
- Action row structure
- AI/guidance panel structure (not content)

## 9. What Must Stay Page-Specific
- All strategist/AI logic and copy
- Metric selection and summary content
- Action button set and labels
- Any campaign- or page-specific callouts, hints, or field groupings
- Orchestration logic and workflow step content

## 10. Candidate Selectors From Campaign Studio
- `.mhos-campaign-command-header` → `.mhos-executive-surface`
- `.mhos-campaign-command-main` → `.mhos-executive-panel`
- `.mhos-campaign-actions` → `.mhos-executive-action-row`
- `.mhos-campaign-operating-summary` → `.mhos-executive-summary-grid`
- `.mhos-campaign-summary-item` → `.mhos-executive-summary-item`
- `.mhos-campaign-metric-label` → `.mhos-executive-metric-label`
- `.mhos-campaign-metric-value` → `.mhos-executive-metric-value`
- `.mhos-campaign-metric-note` → `.mhos-executive-metric-note`
- `.mhos-campaign-strategist-panel` → `.mhos-executive-ai-panel`
- `.mhos-campaign-panel-action` → `.mhos-executive-guidance`

## 11. Extraction Risk
- Premature extraction may break campaign/page identity or logic.
- Over-generalizing strategist/AI panel risks loss of page-specific guidance.
- Shared metric/summary structure must not force all pages to use identical metrics.
- Action row must allow for page-specific button sets.

## 12. Safe Introduction Strategy
- Introduce new `.mhos-executive-*` primitives as additive classes, not replacements.
- Do not remove or rename campaign/page selectors in first pass.
- Migrate structure/layout only; keep all logic and content local.
- Validate visually and functionally after each migration.

## 13. Future Page Adoption Plan
1. Define and document executive surface primitives.
2. Add `.mhos-executive-*` classes to Campaign Studio executive surface (alongside existing selectors).
3. Validate visual and functional stability.
4. Gradually migrate other executive pages to shared primitives.
5. Remove legacy selectors only after all pages are migrated and validated.

## 14. Validation Strategy
- Visual regression testing after each migration step.
- Confirm no loss of page-specific identity, logic, or copy.
- Use grep to confirm only structure/layout primitives are global.
- Validate all executive pages for consistency.

## 15. Success Criteria
- All executive pages use `.mhos-executive-*` primitives for shared structure.
- No loss of page-specific identity, logic, or content.
- Visual and functional consistency across all executive surfaces.
- Safe, reversible migration with clear audit trail.

---

**This is a specification only. No CSS or JS changes made.**
