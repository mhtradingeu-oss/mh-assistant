# Phase 1K — Home Recommended AI Button Dynamic Label Patch

Purpose:
- Fix UX mismatch where recommended specialist button said "Ask Head Office AI" while routing to the dynamic recommended specialist.

Changed source file:
- public/control-center/pages/home.js

Scope:
- Text/label only.
- Button now displays: Ask {recommendedSpecialist.name}
- Fallback: Ask Recommended AI

No routing, prompt, AI Command, backend, or contract changes.
