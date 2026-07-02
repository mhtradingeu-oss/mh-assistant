# AI Command Final Chat-First Target

## Current truth

Previous CSS/class overlay attempts failed because the old primary render structure remained active.

The current primary render still mounts:
- heavy header
- team rail
- operating flow
- context chip strip
- separate specialist conversation
- separate composer
- separate output workspace
- separate tools panel

## Final target

AI Command must become one clean chat-first workspace on desktop and mobile.

## Required design

1. Compact header only:
   - AI Command
   - short safety line
   - no Project / Market / Language / Readiness chip strip above chat

2. Single chat window:
   - messages/history and composer in one visual box
   - specialist dropdown/menu inside chat header or composer
   - source/library icon
   - voice icon disabled/planned unless capability is confirmed
   - send button keeps existing `aicmdV2AskBtn`
   - input keeps existing `aicmdV2Input`
   - Recent/New/Settings are compact controls, not cards

3. Secondary full-width tabs:
   - Team
   - Tools
   - Output
   - Flow

4. Team safety:
   - active specialists selectable only if currently supported
   - planned lanes remain planned/destination-owned
   - Full Team remains current behavior only

5. Authority safety:
   - no backend/API/router/app/data changes
   - no provider behavior changes
   - no Tool Drawer behavior changes
   - no selected Library source bridge behavior changes
   - no publish/send/approve/execute/CRM/workflow/task behavior added

## Implementation rule

Codex must not add another CSS overlay.
Codex must propose a replacement render plan first.
