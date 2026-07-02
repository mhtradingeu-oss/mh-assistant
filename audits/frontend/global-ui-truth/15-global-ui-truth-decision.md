# Global UI Truth Decision

## Status
Global UI truth audit completed.

## Confirmed Facts
- The current UI has an active CSS load order through `public/control-center/index.html`.
- `00-tokens.css` is the first active design authority file.
- Active shell and primitive files already exist.
- Legacy CSS exists under `public/control-center/legacy/` and must not be used as design authority.
- Broad visual redesign must not be based on legacy selectors.
- Home micro-polish experiment was stashed and is not part of the clean global UI work.

## Active CSS Authority
Initial active authority layers:
1. Tokens
2. Reset
3. Layer system
4. App shell
5. Sidebar / Topbar
6. Command / AI layers
7. Component foundation
8. Page and operating layers
9. MHOS primitives

## Design Direction
The next work should create a controlled Global Design System v1 using the existing active CSS stack.

## Safe First Implementation Candidate
Do not rewrite existing CSS files broadly.

Preferred first implementation:
- Add or refine a small active global design primitive layer.
- Use existing token system where possible.
- Do not touch legacy.
- Do not remove old selectors yet.
- Apply first to Home as a composition pass only after global primitives are confirmed.

## Decision
Proceed to Global Design System v1 plan before any Home redesign implementation.
