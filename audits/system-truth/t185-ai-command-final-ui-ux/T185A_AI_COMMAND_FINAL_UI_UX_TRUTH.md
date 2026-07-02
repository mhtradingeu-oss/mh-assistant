# T185A — AI Command Final UI/UX Truth Report

## Status
Audit / design-contract only. No runtime implementation in this step.

## Baseline
- Branch: architecture/frontend-consolidation-v1
- Latest stable commit: 5954396 Stabilize AI Command state kernel activation
- Working tree must stay clean before implementation.

## Current Source Truth

### Active render path
The active AI Command page renders through:

- `aiCommandRoute.render(context)`
- `root.innerHTML = renderAiCommandChatFirstShell(...)`

This means the current visible page is the ChatFirst / Final Composer surface, not the older full V2 shell.

### Current composer surface
The active composer currently includes:

- plus button
- textarea
- specialist pill
- AI status pill
- source icon
- voice language button
- voice input button
- voice conversation roadmap button
- send button
- quick tools row
- context/source row
- status line

This is functional but too visually dense for the final international UI.

### Legacy presence
Legacy render/UI elements still exist in the source file, including:

- `aicmdV2InputLegacy`
- `aicmdV2AskBtnLegacy`
- `aicmdV2Preview*Legacy`
- `aicmd-chatgpt-*`
- older `aicmd-v2-*` surface blocks

No duplicate ID issue was found, but legacy presence increases maintenance and CSS risk.

### CSS authority problem
AI Command styling is distributed across multiple layers:

- early `aicmd-room` rules
- `aicmd-chatgpt` rules
- `aicmd-v2` rules
- `aicmd-chatfirst` rules
- newer `aicmd-final` rules

This means design patches can be overridden or become stacked. The final page needs one clear authority layer.

## Final UI Contract

### Page goal
AI Command must feel like a clean, premium, ChatGPT-like AI Team Command Center for a business operating system.

### Required layout
1. Minimal header
   - AI Command title
   - project identity
   - connection / guarded status
   - New Chat
   - Recent Chats

2. Main chat stream
   - clean message area
   - no visual clutter
   - clear empty state
   - assistant/user message hierarchy

3. AI Team control
   - compact Specialist / Full Team selector
   - not visually competing with the composer
   - clear active state

4. Bottom composer
   - `+` for upload/source/library/context
   - one textarea
   - one mic button
   - one send button
   - no visible voice language selector in the final clean state
   - no separate voice conversation button until the voice phase is officially implemented

5. Source / Context panel
   - opened from plus/source
   - upload file
   - choose from Library
   - show selected source
   - show project context
   - no provider execution from this panel

## Implementation Boundaries

### Allowed in next patch
- UI cleanup inside active ChatFirst composer only.
- Hide or defer voice language and voice conversation controls.
- Simplify quick tools visual density.
- Add final CSS authority block scoped to `[data-page="ai-command"] .aicmd-final-*`.
- No backend changes.
- No provider execution changes.
- No route changes.

### Not allowed in next patch
- No voice recording implementation.
- No upload implementation beyond opening/labeling source flow.
- No deletion of legacy render paths until browser QA proves they are unreachable.
- No broad CSS rewrite.
- No random visual patches outside AI Command.

## Next phase recommendation
T185B — Browser Visual QA + Composer Cleanup Patch

Patch order:
1. Confirm browser screenshot/current visual state.
2. Simplify active composer controls.
3. Add one scoped final CSS authority block.
4. Validate with node checks.
5. Browser QA.
6. Commit only after clean validation.
