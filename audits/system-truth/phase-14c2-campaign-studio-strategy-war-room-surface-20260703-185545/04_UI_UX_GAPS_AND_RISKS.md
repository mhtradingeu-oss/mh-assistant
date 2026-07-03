# UI UX Gaps and Risks

## Gaps
1. Premium Strategy War Room framing is implied but not explicitly visible.
2. Campaign brief status is spread across sections and not presented as a single snapshot.
3. Handoff packet intent is available but not clearly previewed as a packet.
4. Review-only execution boundary is not prominent inside the strategy area.

## Risks
1. Duplicate UI risk if a new section repeats all existing form fields.
2. Behavior risk if new buttons trigger new handler logic.
3. Source-of-truth confusion risk if readiness states are computed with new schema/state.

## Risk Controls
- Add compact summary cards only, derived from existing values and executionReadiness.
- Avoid new action handlers.
- Reuse existing classes and semantic blocks.
- Keep all changes in campaign-studio.js render-only path.
