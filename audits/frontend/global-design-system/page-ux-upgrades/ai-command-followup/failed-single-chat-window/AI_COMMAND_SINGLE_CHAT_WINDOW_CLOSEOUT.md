# AI Command Single Chat Window Closeout

## Status

Implemented as a terminal-only frontend patch. No commit created.

## Browser issue addressed

Previous attempts produced mixed UI layers. This patch creates one clean chat-window presentation for AI Command.

## Files changed

- `public/control-center/pages/ai-command.js`
- `public/control-center/styles/12-pages.css`

## Design result

- Single chat shell.
- Composer and conversation share one visual window.
- Specialist selector lives inside chat controls.
- Source icon routes to Library/source context.
- Voice icon is planned/disabled unless capability is confirmed.
- New/settings are compact chat controls.
- Team / Tools / Output / Flow are full-width secondary tabs.
- Project/market/language/readiness chip strip is hidden from the primary chat layout.
- Guidance/recent card and old flow cards are hidden from the primary chat layout.

## Safety preserved

- No backend/API changes.
- No router/app changes.
- No `data/projects` changes.
- No AI provider behavior changes.
- No Tool Drawer behavior changes.
- No selected Library source bridge behavior changes.
- No planned specialists activated.
- No real voice runtime added.
- No publish/send/approve/execute/CRM/workflow/task behavior added.

## Browser QA checklist

- Desktop shows one central chat window.
- Mobile shows the same chat-window mental model.
- No separate Specialist Conversation card appears as a second chat box.
- Composer is inside the chat shell.
- Team / Tools / Output / Flow tabs are full width.
- Tools and Output do not appear as narrow panels with empty right space.
- Send button behavior is unchanged.
- Specialist selector changes existing specialist only.
- Source button opens Library.
- Voice button communicates planned state only.
