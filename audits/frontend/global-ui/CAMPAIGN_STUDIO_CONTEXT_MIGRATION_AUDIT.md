# CAMPAIGN STUDIO CONTEXT MIGRATION AUDIT

**Date:** 2026-05-23
**Branch:** architecture/frontend-consolidation-v1

---

## 1. Executive Summary
Campaign Studio is the best candidate for the first fully normalized MH-OS executive operating page. It already uses a modular, role-driven structure and can adopt mhos-context-*, mhos-action-*, and mhos-workflow-* primitives with minimal risk. However, some legacy selectors and page-specific overrides must remain temporarily. Migration should proceed in a staged, reversible manner.

## 2. Current Campaign Studio Structure
- Modular, session-driven page (campaign-studio.js)
- Composed of context ribbon, campaign summary, strategist/AI panel, workflow chain, action strip, and detail panels
- Uses both shared and page-specific selectors

## 3. Current Header / Context Composition
- Context ribbon and summary at the top, using `.std-context-*` selectors (from 14-page-standard.css)
- Campaign/project/chip/title/description blocks
- Some context composed with custom markup and logic

## 4. Current Action System Usage
- Action buttons use `.btn`, `.btn-primary`, `.btn-secondary`, `.std-action-btn`, and custom classes
- Action strips and context actions are present, but not yet using mhos-action-* primitives

## 5. Current Workflow / Orchestration Usage
- Workflow chain and escalation lanes are present for campaign steps and handoffs
- Uses `.mhos-workflow-chain`, `.mhos-workflow-step`, `.mhos-escalation-lane`, etc. (from mhos-workflow-primitives.css)
- Some workflow logic is still page-specific

## 6. Current AI Strategist Structure
- Dedicated strategist/AI summary and recommendation blocks
- Custom markup, not yet using mhos-context-* or mhos-action-* primitives
- AI role and next move are visually present but not fully normalized

## 7. Legacy Selectors Still Used
- `.std-context-*` (ribbon, chip, title, description, actions)
- `.btn`, `.btn-primary`, `.btn-secondary`, `.std-action-btn`
- Page-specific context and summary blocks
- Some workflow and escalation logic is still custom

## 8. Primitive Adoption Opportunities
- Replace `.std-context-ribbon`, `.std-context-chip`, `.std-context-title`, `.std-context-description` with `.mhos-context-*` equivalents
- Replace `.btn`, `.btn-primary`, `.btn-secondary`, `.std-action-btn` with `.mhos-action-*` primitives
- Ensure all workflow chains/escalation lanes use `.mhos-workflow-*` primitives
- Begin using `.mhos-context-actions` for context-level action strips
- Normalize strategist/AI summary using `.mhos-context-summary`, `.mhos-context-main`, `.mhos-context-kicker`, etc.

## 9. What Should Migrate First
- Context ribbon and chip row to `.mhos-context-ribbon`, `.mhos-context-chip-row`, `.mhos-context-chip`
- Action strips to `.mhos-context-actions` and `.mhos-action-*`
- Workflow chain and escalation lanes to `.mhos-workflow-*` (where not already)
- Strategist/AI summary to `.mhos-context-summary`, `.mhos-context-main`, `.mhos-context-kicker`

## 10. What Must Stay Temporarily
- Any `.std-context-*` selectors still used by legacy or non-migrated blocks
- Page-specific context overrides until all composition is migrated
- Custom workflow logic that is not yet compatible with primitives
- Any selectors referenced by downstream handoff or session logic

## 11. Safe Migration Order
1. Migrate context ribbon and chip row to `.mhos-context-*` (additive, do not remove legacy yet)
2. Migrate action strips to `.mhos-context-actions` and `.mhos-action-*`
3. Normalize workflow chain/escalation lanes to `.mhos-workflow-*` everywhere
4. Migrate strategist/AI summary to `.mhos-context-summary` and related primitives
5. Remove legacy `.std-context-*` only after all blocks are migrated and validated

## 12. Recommended First Migration Pass
- Add `.mhos-context-ribbon`, `.mhos-context-chip-row`, `.mhos-context-chip` to the main context block
- Add `.mhos-context-actions` and `.mhos-action-*` to the main action strip
- Ensure workflow chain uses `.mhos-workflow-*` exclusively
- Begin normalizing strategist/AI summary with `.mhos-context-summary` and `.mhos-context-main`
- Do not remove or rename legacy selectors yet

## 13. Validation Strategy
- Visual regression testing before/after each migration step
- Use grep to confirm all context/action/workflow selectors are present and not duplicated
- Validate session and handoff logic is unaffected
- Confirm no visual regressions in downstream pages

## 14. Rollback Strategy
- Each migration step in a separate commit
- Do not remove legacy selectors until all blocks are migrated and validated
- If any regression, revert to previous commit and restore original selectors
- Maintain a migration report for traceability

---

**No CSS or JS changes made. This is an audit only.**
