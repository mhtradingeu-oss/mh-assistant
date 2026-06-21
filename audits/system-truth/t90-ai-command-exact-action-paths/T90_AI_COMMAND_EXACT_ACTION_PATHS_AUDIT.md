# T90 — AI Command Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/ai-command.js`

This follows T89, which confirmed AI Command is the highest-risk remaining core surface.

## Actions to classify

### 1. Main Ask / Send command
Expected classification:
- May call `executeProjectAiChat` or guidance bridge.
- Must classify whether it executes backend AI directly.
- Must confirm whether no external publish/task/approval action happens.

### 2. Voice button
Expected classification:
- UI/input helper only unless it executes command.

### 3. Suggested prompt chips / specialist prompt chips
Expected classification:
- Prompt prefill only unless they trigger backend execution.

### 4. Prepare button
Expected classification:
- Preview/draft preparation only unless it creates backend record.

### 5. Draft task button
Expected classification:
- Task-shaped output preview, or backend task creation if API exists.
- Must confirm exact behavior.

### 6. Draft workflow button
Expected classification:
- Workflow preview/handoff only unless backend workflow creation/execution exists.

### 7. Handoff button
Expected classification:
- Shared handoff or backend handoff.
- Backend handoff creation must be confirmed if present.

### 8. Response Continue
Expected classification:
- May call AI guidance/AI chat again.
- Must classify backend AI execution.

### 9. Response Copy
Expected classification:
- Clipboard only.

### 10. Response Use
Expected classification:
- Moves response into composer/preview only unless backend mutation.

### 11. Response Save
Expected classification:
- Local output save or backend persistence.
- Must classify.

### 12. Response Convert
Expected classification:
- Converts response to preview/task/handoff locally unless backend mutation.

### 13. Response Send
Expected classification:
- Route/handoff/send path.
- Must classify whether backend handoff is created.

### 14. Response Read
Expected classification:
- Read-aloud/local UI only unless external service.

### 15. Preview Copy / Use / Send / Save / Read / Clear
Expected classification:
- Copy/use/read/clear likely local.
- Send/save must classify backend handoff or local output persistence.

### 16. Tool Dock / Drawer actions
Expected classification:
- May be delegated to `tool-dock.js`.
- Must decide whether tool-dock is part of same authority closeout or separate T-series.

## Decision Rule
- If AI backend execution exists from Ask/Continue, it can be allowed as the explicit purpose of AI Command, but must be clearly operator-triggered and not claim external execution.
- If task/handoff/approval/backend mutation occurs without confirmation, patch.
- If save is local only, no confirmation required.
- If tool-dock owns separate backend actions, audit `ai-command/tool-dock.js` separately.
- Do not redesign AI Command in this pass.
