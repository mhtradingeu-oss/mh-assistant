# AI Command Pass 4B-2 - Typing Indicator Audit

## Purpose

Add a clear specialist working / typing indicator while AI Command is waiting for a specialist response.

## UX problem

Currently, after the user sends a message, there is no clear visible signal that the specialist is working.

## Desired behavior

When the user sends a message:

- Show a visible status in the chat area.
- Use the selected specialist name.
- Examples:
  - Operations Lead is preparing your response...
  - Content Writer is drafting...
  - Full AI Team is reviewing...
- Remove the indicator when the response arrives or errors.
- Keep route/output behavior unchanged.

## Safety constraints

- No backend changes.
- No route changes.
- No Task Center changes.
- No Workflows changes.
- No durable task creation.
- No mutation behavior.
