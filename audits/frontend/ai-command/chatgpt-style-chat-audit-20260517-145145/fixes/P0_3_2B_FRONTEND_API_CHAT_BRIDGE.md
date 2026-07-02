# P0.3.2B Frontend API Chat Bridge

## Goal

Expose the new safe backend AI chat route to the Control Center frontend.

## Added

- `executeProjectAiChat(projectName, payload)`

## Endpoint

- `POST /media-manager/project/:project/ai/chat`

## Relationship to Existing API

- `executeProjectAiChat` is for natural specialist conversation.
- `executeProjectAiGuidance` remains for structured guidance/work conversion.

## Safety

This patch only adds the API bridge.
It does not change AI Command UI behavior yet.
It does not create tasks, workflows, handoffs, publishing, CRM updates, customer replies, exports, or backend mutations.
