# CAMPAIGN STUDIO COMPOSITION OWNERSHIP AUDIT

**Date:** 2026-05-23
**Branch:** architecture/frontend-consolidation-v1

---

## 1. Executive Summary
This audit analyzes Campaign Studio's composition structures to determine which are shared executive operating patterns and which are campaign-specific identity patterns. The goal is to prepare for a future executive surface system by mapping ownership boundaries and identifying candidate primitives for global extraction.

## 2. Current Campaign Composition Map
- Executive header ribbon (context, title, summary, chips)
- Strategist panel (AI/operator recommendation)
- Command actions row (primary actions)
- Operating summary strip (readiness, intelligence, blockers, channels)
- Context chips (market, product, budget, window)
- Metric summaries (readiness, intelligence, blockers, channels)
- Wave planning cards
- Product/audience/channel definition cards
- Orchestration lanes (workflow chain, escalation lane)

## 3. Shared Executive Patterns Detected
- Executive header ribbon (context/title/summary)
- Command actions row (primary actions)
- Operating summary strip (readiness, intelligence, blockers, channels)
- Context chips (market, product, budget, window)
- Metric summaries (readiness, intelligence, blockers, channels)
- Orchestration lanes (workflow chain, escalation lane)

## 4. Campaign-Specific Identity Patterns
- Strategist panel (AI/operator recommendation, campaign-specific copy)
- Wave planning cards (campaign launch structure)
- Product/audience/channel definition cards (campaign-specific fields)
- Campaign-specific callouts and hints

## 5. Mixed Responsibility Structures
- Context chips: shared pattern, but chip types/labels are campaign-specific
- Operating summary: shared structure, but metric selection and copy are campaign-specific
- Command actions: shared row, but button set and labels are campaign-specific

## 6. Which Structures Should Become Global Executive Surfaces
- Executive header ribbon (context/title/summary)
- Command actions row (structure only)
- Operating summary strip (structure only)
- Context chip row (structure only)
- Orchestration lanes (workflow chain, escalation lane)
- Metric summary article/card

## 7. Which Structures Must Remain Campaign-Specific
- Strategist panel (content, logic, and copy)
- Wave planning cards (structure and logic)
- Product/audience/channel definition cards
- Campaign-specific callouts, hints, and field groupings
- Any AI/operator recommendation logic

## 8. Candidate Future Primitives
- `.mhos-executive-header`
- `.mhos-executive-actions`
- `.mhos-executive-summary-strip`
- `.mhos-executive-chip-row`
- `.mhos-executive-chip`
- `.mhos-executive-metric-summary`
- `.mhos-executive-workflow-chain`
- `.mhos-executive-escalation-lane`

## 9. Composition Layering Strategy
- Foundation: context ribbon, chip row, summary strip, actions row as global primitives
- Identity: strategist panel, wave planning, campaign-specific cards as local/campaign primitives
- Metrics: summary/metric cards as global, but metric selection as campaign-specific
- Orchestration: workflow chain/escalation lane as global, but step content as campaign-specific

## 10. Risks Of Premature Extraction
- Breaking campaign-specific logic or copy
- Over-generalizing strategist/AI panel
- Extracting chip/metric types that are not relevant to all executive pages
- Forcing global primitives before all pages are audited
- Loss of campaign identity or clarity

## 11. Recommended Ownership Boundaries
- Extract only structure/layout primitives for executive surfaces
- Keep strategist panel, wave planning, and campaign-specific cards local
- Allow chip/metric row structure to be global, but chip/metric types/labels local
- Do not extract any logic or copy

## 12. Future Migration Path
1. Audit all executive pages for shared patterns
2. Extract only structure/layout primitives (header, actions, summary, chip row, workflow chain)
3. Refactor Campaign Studio to use global primitives for structure only
4. Keep strategist panel, wave planning, and campaign-specific cards local
5. Validate with visual and functional regression
6. Migrate other executive pages to shared primitives

## 13. Validation Strategy
- Visual regression testing after each extraction
- Confirm no loss of campaign-specific identity or logic
- Use grep to confirm only structure/layout primitives are global
- Validate all executive pages for consistency

## 14. Rollback Strategy
- Each extraction in a separate commit
- If regression or loss of identity, revert to previous commit
- Maintain audit trail for all composition changes

---

**No CSS or JS changes made. This is an audit only.**
