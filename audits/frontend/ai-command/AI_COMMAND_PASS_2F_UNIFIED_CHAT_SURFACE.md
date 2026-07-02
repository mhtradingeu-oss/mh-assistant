
# AI Command Pass 2F — Real Unified Chat Surface

## Summary

This pass adds a real unified chat wrapper around the conversation header, specialist conversation, and composer, making the center feel like one connected ChatGPT-style chat/meeting surface. Visual splits are removed, and the sections are visually connected with a single surface. Action buttons remain available only through the official tools/right panel, not the center. All handlers remain null-safe. No backend/API/runtime behavior was added.

## Files changed
- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css

## What was improved
- Unified chat surface: Conversation header, context, empty state, and composer now visually belong to one surface, with compact context and a single chat area.
- Composer: Large rounded textarea, clear send button, quiet language/market chips, and a small disabled voice button. Pills under input are minimized.
- Header: More compact, less vertical dominance, workflow strip is quieter and less tall.
- Solo Specialist: Shows a clear line "Solo conversation with [Specialist]" inside the chat surface.
- Full Team: Shows "Full team meeting — coordinated review" and a subtle workflow chain inside the chat surface.
- Bottom status: Metrics are now a quiet, compact strip that does not compete with the chat.

## Solo Specialist behavior
- Inside the chat surface, a clear line: "Solo conversation with [Specialist]" is shown.
- Right panel tools are filtered to the selected specialist.
- Left roster remains simple.

## Full Team behavior
- Inside the chat surface, a clear line: "Full team meeting — coordinated review" is shown.
- Subtle workflow text: Strategist → Writer → Media/Video → Compliance → Publisher → Operations.
- Guidance/draft-preview only; no multi-agent execution.

## Tool duplication decision
- Action buttons and tools remain available only through the official tools/right panel, not the center. No tools are duplicated in the center. If icons are shown, only existing markup is used.

## Voice UI decision
- The composer keeps a small disabled voice button. No real voice recording is implemented.

## What was intentionally not changed
- No backend/API/runtime behavior was added.
- No new CSS files were created.
- No changes to right panel tool logic or handlers.
- No autonomous execution, publishing, approval, CRM, customer reply, workflow run, or task creation behavior was added.

## Safety notes
- All IDs and data attributes required for automation and QA are preserved.
- No backend or runtime logic was touched.
- No global or non-page-scoped CSS was added.
- No new CSS files were created.

## Browser QA checklist
- [ ] Chat surface is visually unified (header, context, chat, composer)
- [ ] Context is visible but compact and secondary
- [ ] Composer is large, rounded, and clear
- [ ] Voice and attach/context buttons are present but disabled
- [ ] Send button is clear and prominent
- [ ] Language/market chips are quiet and compact
- [ ] Header is compact, workflow strip is quiet
- [ ] Solo Specialist shows correct line
- [ ] Full Team shows correct line and workflow chain
- [ ] Bottom status is quiet and compact
- [ ] No tool duplication in center
- [ ] All required IDs and data attributes are present

## Recommended next step
- Consider further compacting the left roster and right tool panel for even more focus on the chat area.
- Explore adding subtle animation for message send/receive.
- Review accessibility and keyboard navigation for the unified chat surface.
