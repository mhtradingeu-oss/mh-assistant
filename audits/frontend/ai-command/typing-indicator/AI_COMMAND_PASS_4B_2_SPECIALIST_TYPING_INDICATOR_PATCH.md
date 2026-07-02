# AI Command Pass 4B-2 - Specialist Typing Indicator Patch

## Summary

This patch adds a clearer specialist working indicator while AI Command waits for an AI response.

## What changed

- Uses existing `session.responseLoading`.
- Adds `getAiSpecialistWorkingMessage(...)`.
- Replaces the plain `Asking specialist...` line inside `renderPhase3SpecialistConversation(...)`.
- Adds animated typing dots and role-aware working messages.

## Examples

- Operations Lead is preparing your task handoff...
- Content Writer is drafting your content...
- Full AI Team is reviewing your request...

## Safety

- No backend changes.
- No route changes.
- No Task Center changes.
- No Workflows changes.
- No durable task creation.
- No mutation behavior.
