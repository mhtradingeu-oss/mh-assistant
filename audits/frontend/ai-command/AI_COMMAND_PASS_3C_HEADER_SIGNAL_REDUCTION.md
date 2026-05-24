# AI Command Pass 3C - Header and Context Signal Reduction

## Summary

This pass reduces visual noise in the AI Command meeting room after browser QA.

The final accepted implementation is CSS-only. Earlier markup-level experimentation was reverted because it introduced JavaScript template risk. The final approach preserves all JavaScript, handlers, IDs, data attributes, tool behavior, routing, and backend behavior.

## Files changed

- public/control-center/styles/12-pages.css
- audits/frontend/ai-command/AI_COMMAND_PASS_3C_HEADER_SIGNAL_REDUCTION.md

## Final accepted changes

- Hide the redundant conversation context strip.
- Hide the redundant left-side Full Team Mode explanatory card.
- Keep the Full Team orchestration path visible in the Conversation Room header.
- Improve the Full Team orchestration chain visually.
- Compact the empty chat state.
- Keep planned specialists visible in the same AI Team rail, but make them visually secondary.

## Why CSS-only

A JavaScript/template markup attempt was tested and reverted because it introduced a syntax error risk. The final implementation avoids changing runtime behavior and keeps the page stable.

## What was intentionally not changed

- No JavaScript changes.
- No backend changes.
- No tool-dock changes.
- No route changes.
- No data/projects changes.
- No center tool duplication.
- No right panel behavior changes.
- No output tab behavior changes.
- No autonomous execution.

## Safety notes

- All selectors are scoped under `[data-page="ai-command"]`.
- Existing markup remains intact.
- The context strip is hidden visually only.
- The Full Team side explanatory card is hidden visually only.
- The Full Team path remains available in the Conversation Room header.
- Planned specialists remain visible but secondary.

## Browser QA result

Accepted visual decisions:

- The AI Command page is cleaner and closer to chat-first.
- Solo Specialist view is less crowded.
- Full Team view no longer duplicates the same team path in the left panel.
- Empty conversation space is more compact.
- The right tools/output area remains unchanged.

## Remaining debt

- Later CSS consolidation should merge older AI Command styling layers after selector mapping.
- A future markup-level context rail may be considered only after extracting the conversation section into a safer component boundary.
- Accessibility review remains needed for keyboard/focus and screen-reader clarity.

## Recommended next step

If validation and browser QA pass, commit this pass as the final Pass 3C CSS-only signal reduction.
