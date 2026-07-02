# AI Command Pass 3C - Header Signal Reduction Plan

## Summary

This plan prepares a controlled simplification of AI Command's top operating area and conversation header after the chat-first and right-panel passes.

The page now works, but the visible hierarchy is still too busy. The next pass should reduce repeated signals and visual boxes while preserving behavior, IDs, handlers, route logic, tool behavior, and backend authority.

## Current baseline

- Branch: architecture/frontend-consolidation-v1
- Current HEAD includes:
  - Home specialist handoff
  - AI Command chat-first meeting room
  - Header/session density polish
  - Right panel readability polish
  - Right tools/output drawer audit
  - Right panel CSS authority map
- Current working tree was clean before this plan.
- Validation passed:
  - public/control-center/pages/ai-command.js
  - public/control-center/app.js
  - public/control-center/router.js

## Problem observed

The page is functional, but too much information is visible at once:

- Global app top bar
- AI Team Command Center hero
- Session controls
- Project / Mode / Market / Language / Readiness pills
- Workflow steps
- Conversation Room header
- Conversation status
- Four context cards:
  - Shared room context
  - Selected specialist
  - Tools / next action
  - Latest selected reply

This creates a crowded workspace and competes with the chat-first goal.

## Scan findings

### Header / session / flow markup

The top area is rendered from:

- `renderPhase1Header(...)`
- `.aicmd-room-header`
- `.aicmd-room-title`
- `.aicmd-room-subtitle`
- `.aicmd-room-header-actions`
- `.aicmd-room-flow`
- `.aicmd-room-flow-step`
- `.aicmd-room-status-strip`

### Conversation room / context markup

The center chat metadata is rendered from:

- `renderAiRoomConversationHeader(...)`
- `renderPhase3SpecialistConversation(...)`
- `.aicmd-room-conversation-head`
- `.aicmd-room-context-strip`
- `.aicmd-room-context-item`

### CSS layering risk

The scan found multiple layers for:

- `.aicmd-room-header`
- `.aicmd-room-title`
- `.aicmd-room-subtitle`
- `.aicmd-room-header-actions`
- `.aicmd-room-flow`
- `.aicmd-room-flow-step`
- `.aicmd-room-status-strip`
- `.aicmd-room-conversation-head`
- `.aicmd-room-context-strip`
- `.aicmd-room-context-item`

Therefore the next implementation should avoid adding another large override layer.

## UX decision

AI Command should show the minimum necessary operating signals:

1. Who am I working with?
   - Solo specialist or Full AI Team.

2. What is the current project context?
   - Project / market / language / readiness as compact metadata.

3. What is the next action?
   - One clear next action signal.

4. Where do I act?
   - Center chat.

5. Where are tools?
   - Right panel.

## What should be reduced

### Top hero

Keep:

- AI Team Command Center
- One very short sentence

Reduce:

- Large empty hero height
- Overemphasized session card
- Visual dominance of meta pills

### Workflow strip

Keep:

- Ask / Draft / Review / Route / Execute / Monitor as orientation

Reduce:

- Card-like weight
- Height
- Repeated descriptions
- Visual competition with center chat

### Conversation header

Keep:

- Current specialist/team name
- Availability
- One-line role summary

Reduce:

- Large header block feel
- Extra badges/chips if visually noisy

### Context boxes

Recommended change:

Replace the four large context boxes with a compact context rail or two-row summary:

- Context: Project session
- Mode: Solo specialist or Team workflow
- Next: active next action
- Last: no reply yet / latest reply

Do not remove the underlying state; only reduce visual weight.

## What must not change

- No backend changes.
- No API changes.
- No tool-dock.js changes.
- No right-panel behavior changes.
- No center tool duplication.
- No route changes.
- No data/project changes.
- No autonomous execution.
- No real voice behavior.
- No removal of IDs/data attributes used by handlers.

## Recommended Pass 3C implementation

### Name

AI Command Pass 3C - Header Signal Reduction

### Scope

Small controlled implementation.

Allowed files:

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- audits/frontend/ai-command/AI_COMMAND_PASS_3C_HEADER_SIGNAL_REDUCTION.md

### Recommended changes

1. Update `renderPhase1Header(...)` copy/classes only if needed.
2. Keep session controls but make them visually smaller.
3. Keep workflow steps but make them more like a slim progress rail.
4. Update `renderPhase3SpecialistConversation(...)` to reduce context card weight:
   - Prefer compact rail over four large cards.
   - Preserve information.
   - Preserve state.
5. Add a small page-scoped CSS block only if needed:
   - `/* --- AI Command Header Signal Reduction --- */`

## Browser QA checklist

- [ ] Solo Specialist still works.
- [ ] Full Team still works.
- [ ] Specialist switching still updates header, chat, and tools.
- [ ] Context still shows project/mode/next/last.
- [ ] Right tools remain unchanged.
- [ ] Output tabs still work.
- [ ] Composer still works.
- [ ] Header is visually lighter.
- [ ] No console errors.

## Final recommendation

Proceed to a small controlled Pass 3C implementation after this plan is committed.

Do not perform broad CSS cleanup in Pass 3C.
