# AI Command Replacement Render Plan

## Status

Audit only. No production change.

## Problem

CSS overlays and shell-class patches failed because the old AI Command render structure remains active.

The page currently mixes:
- operating room header
- project/context chips
- flow cards
- team panel
- separate specialist conversation
- separate composer
- separate output/tools areas

## Required direction

Replace the primary AI Command render structure with one clean chat-first shell instead of hiding old sections with CSS.

## Target render model

1. Compact header:
   - AI Command
   - short safety statement
   - no large context chip strip

2. Single chat window:
   - specialist selector
   - source/library context button
   - voice planned/disabled button
   - new/recent/settings compact controls
   - conversation history
   - composer using existing input/send behavior
   - same visual shell for messages and input

3. Secondary tabs:
   - Team
   - Tools
   - Output
   - Flow

4. Safety:
   - no backend/API changes
   - no app/router changes
   - no data/projects changes
   - no provider behavior changes
   - no planned specialist activation
   - no real voice runtime
   - no publish/send/approve/execute/CRM/workflow/task behavior

## Implementation rule

Do not add another CSS overlay.

Create a replacement render helper and make the main render call use it.

Preserve existing IDs/handlers where needed:
- `aicmdV2AskBtn`
- `quickCommandInput`
- specialist selection behavior
- Tool Drawer prompt behavior
- selected Library source bridge
- output review/handoff behavior
