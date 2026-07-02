# T151 — Frontend CSS Foundation and Operating Surface Audit

## Status
Audit only.

## Baseline
- a036f3d Close Operations Centers runtime authority audit

## Purpose
Establish the frontend design-system and operating-surface foundation before any further page redesign.

## Why Now
Runtime authority closeouts are now completed for Customer Center and Operations Centers.
The next risk is visual/UX entropy: duplicated CSS layers, inconsistent page structure, and uneven Action Panel / AI Panel patterns.

## Questions to Answer
1. Which CSS files define global app shell styles?
2. Which CSS files define page-specific overrides?
3. Where are duplicated card/panel/button/table patterns?
4. Which pages already follow Header / Main View / Action Panel / AI Panel?
5. Which pages need operating-surface normalization?
6. Which CSS rules are risky because of important declarations, high z-index, fixed positioning, or broad selectors?
7. What foundation tokens/components should be standardized before page redesign?

## Hard Constraints
No production code changes.
No CSS changes.
No backend changes.
No API changes.
No route changes.
No data/projects changes.

## Evidence to Collect
- CSS inventory:
- Global shell files:
- Page-specific CSS:
- Risky selectors:
- Duplicated patterns:
- Operating-surface ready pages:
- Operating-surface incomplete pages:
- Recommended next phase:
