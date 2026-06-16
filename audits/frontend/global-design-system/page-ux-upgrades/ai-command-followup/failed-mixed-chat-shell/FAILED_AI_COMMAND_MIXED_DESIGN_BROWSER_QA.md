# AI Command Failed Mixed Design Browser QA

## Status

Failed / do not commit as production.

## Browser QA result

The attempted mobile/universal chat-first patches produced mixed UI layers:

1. Original operating-room cards still visible.
2. Mobile tab design visible.
3. Universal chat controls added, but not replacing the old layout.

## Problems observed

- Multiple chat-like boxes appeared.
- Header remained too heavy.
- Project / Active AI / Mode / Market / Language / Readiness chips remained unnecessary above the chat.
- Guidance connected / Recent chats / New / settings still consumed unnecessary space.
- Team / Tools / Output / Flow tabs did not consistently use full width.
- Tools and Output panels appeared narrow with empty space.
- Flow sometimes appeared as old large cards and sometimes compact.
- The page did not feel like one clean ChatGPT-like chat workspace.

## Final product direction

Rebuild AI Command as one clean universal chat window for desktop and mobile:

- One chat shell.
- Messages and composer in the same box.
- Specialist selector in the chat box.
- Source/upload icon in the composer toolbar.
- Voice icon as planned/disabled unless capability exists.
- New/recent/settings as compact chat controls.
- Team / Tools / Output / Flow as full-width secondary tabs below the chat shell.
- No backend/API/data/router changes.
- No planned specialist activation.
