# T91 — AI Command Main Execution Path Audit

## Status
Audit-only. No production files changed.

## Scope
Classify the main AI Command execution path inside:

- `public/control-center/pages/ai-command.js`

This follows T89/T90.

## Why this matters
T90 showed that most AI Command buttons are local preview, local save, clipboard, navigation, or shared context handoff only.

The remaining authority-sensitive path is the main Ask / Send command, because it calls `executeProjectAiChat`.

## Paths to classify

### 1. Composer input / Enter key
Classify whether Enter only triggers the Ask button.

### 2. Main Ask button
Classify whether this calls `executeProjectAiChat`.

### 3. Backend AI chat execution payload
Classify payload shape:
- prompt/message
- projectName
- specialist/mode/team mode
- route target
- context
- whether it can trigger external actions

### 4. AI response handling
Classify whether the response:
- is saved locally
- creates backend task/approval/handoff
- only prepares output preview
- only appends chat history

### 5. Safety language
Confirm whether prompts instruct the AI not to claim execution/publishing/approval happened.

### 6. Follow-up / continue behavior
Confirm whether Continue only focuses composer or triggers backend AI.

## Decision Rule
- If Ask explicitly calls backend AI chat only and does not create task/approval/handoff/publish, close as intentional AI execution.
- If Ask can cause backend mutation beyond AI chat, patch.
- If response handling creates backend handoff/task/approval without confirmation, patch.
- If Continue executes AI without explicit send, patch.
