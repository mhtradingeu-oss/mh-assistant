# Home / Command Center — Browser QA

## Status
Manual browser QA completed from local runtime.

## Runtime URL
`http://127.0.0.1:3000/control-center/#home`

## Confirmed Strengths
- Home page loads successfully.
- Project status is visible.
- System health and project readiness are visible.
- Next Best Action is present.
- Exceptions/blockers are visible.
- Operational destination links are present.
- AI Guidance and AI Team sections are present.
- Customer Operations Pulse is present.
- No obvious broken layout or crash was observed.

## UX Findings

### P1 — First screen density
The first screen is functional but vertically heavy. The Hero, Next Best Action, and KPI cards consume significant height before the operator reaches deeper context.

### P1 — Next Best Action clarity
The current next action appears as a system key-like label (`product_videos`). It should be translated into clearer executive language for the operator.

### P1 — Next Best Action panel height
The panel contains unused vertical space around the scheduled-action strip and can be made more compact without losing meaning.

### P2 — KPI hierarchy
Automation and Intelligence cards show `0`, which may visually weaken the perceived system value. They should either be clarified or visually de-emphasized.

### P1 — Operational destinations layout
The destination section is too long as full-width rows. It should become a compact grid or clearer action area.

### P2 — AI Team density
The AI Team section is useful, but role cards should remain compact and highlight the most relevant specialist.

### P2 — Customer Operations wording
`Planned/Partial` and `Planned/Not Ready` may confuse production users. It should be framed as a disabled/not-enabled module rather than a failure.

## Patch Decision
Proceed with a targeted Home P1 polish patch.

## Patch Rules
- Do not rewrite Home.
- Do not change backend data binding.
- Do not introduce a new global CSS authority.
- Avoid broad CSS cleanup.
- Patch only active Home files.
- Validate with `node --check`.
- Re-test in browser after patch.
