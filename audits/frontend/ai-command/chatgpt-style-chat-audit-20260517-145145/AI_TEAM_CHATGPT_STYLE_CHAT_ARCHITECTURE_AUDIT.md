# AI Team ChatGPT-Style Chat Architecture Audit

## Goal

Determine the correct architecture to make AI Team behave like a natural ChatGPT-style specialist chat:

- normal chat first
- voice input/read aloud support
- file/context attach UX
- Enter to send / Shift+Enter newline
- saved chat sessions/history
- ability to convert conversation into Draft / Task / Workflow / Handoff / Route
- no unsafe backend execution

## Current Known Problem

The current Ask flow behaves like a guidance/output generator, not a normal chat. It uses the guidance bridge and response history. This can make simple messages like `hi` slow and produce project readiness/report-style output.

## Questions This Audit Must Answer

1. Is `executeProjectAiGuidance` hardwired to produce structured guidance?
2. Can chat-first be implemented safely inside `ai-command.js` only?
3. Do we need a backend `chat` mode or parameter to separate chat from guidance?
4. Where should normal chat messages live?
5. Where should generated work outputs live?
6. How should old chat sessions be stored/listed?
7. How should voice input/read aloud behave now?
8. What is the minimum safe implementation plan?

## Target Architecture

### Separate Chat from Output

- `session.messages` should be the normal chat thread:
  - user
  - assistant/specialist
  - system/context notes

- `session.responseHistory` or output preview should be work-output history:
  - Draft
  - Task
  - Workflow
  - Handoff
  - Route package

### Chat UX

- Chat window should feel like ChatGPT:
  - message bubbles
  - composer at bottom
  - Enter sends
  - Shift+Enter creates newline
  - voice icon
  - read aloud
  - attach/context button
  - tools/output buttons nearby but not mixed with chat

### Session History

Need a visible session list:
- New Session
- Saved sessions
- session title
- selected specialist/team mode
- latest message preview
- restore session

### Backend

If current backend guidance route forces report-style answers, add a safe `chat` mode or lightweight chat route later. Do not execute tasks or mutate backend from chat.

## Required Result

This audit should decide between:

### Option A: Frontend-only Chat Mode
Use existing guidance endpoint but with strict chat prompt and separate `session.messages`.

### Option B: Backend Chat Mode
Add a safe backend chat mode/route because guidance endpoint is structurally output/report-oriented.

### Option C: Hybrid
Frontend separates chat/output now, backend chat mode later.

## Safety

No source code changes in this audit.
