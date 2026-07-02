# P0.3.2A Safe AI Chat Backend Route

## Problem

AI Team natural conversation cannot safely use the existing `/ai/guidance` route because that route is guidance/output oriented and builds a guidance prompt.

## Fix

Added a separate safe chat-only route:

- `POST /media-manager/project/:project/ai/chat`
- `POST /public/media-manager/project/:project/ai/chat`

Added orchestrator chat execution:

- `buildChatPrompt`
- `extractChatProviderText`
- `executeChat`

## Behavior

The new route is for natural specialist chat only:
- answers directly like a specialist
- supports conversational continuity via provided messages/context
- does not create tasks, workflows, handoffs, approvals, CRM updates, customer replies, exports, publishing, or backend mutations

## Safety Label

`chat_only_no_operational_side_effects`

## Relationship to Guidance

- `/ai/chat` is for natural conversation.
- `/ai/guidance` remains the work conversion engine for Draft / Task / Workflow / Handoff / Route.
- Future frontend work should pass recent chat messages to `/ai/guidance` when converting conversation into structured work.

## Files Changed

- `runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `runtime/orchestrator-service/server.js`
