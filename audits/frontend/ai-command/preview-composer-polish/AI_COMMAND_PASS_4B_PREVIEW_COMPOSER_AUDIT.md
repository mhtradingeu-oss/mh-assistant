# AI Command Pass 4B - Preview Density and Chat Composer Audit

## Purpose

Audit AI Command after the task route contract was accepted.

The goal is to reduce visual traffic in the Output Workspace and make the chat composer clearer and more professional.

## Browser finding

Confirmed:

- AI Command to Task Center route works.
- Task Center receives review-only incoming handoff.
- Output Workspace / preview panel is visually crowded.
- The same AI response appears multiple times.
- Chat composer is functional but not visually clear enough.

## Desired UX contract

### Output Workspace

Show only:

- concise result summary
- one main result block
- next steps if present
- route/safety status

Avoid:

- repeating the full AI response multiple times
- showing Chat reply and Main output with identical content
- long duplicated blocks in the right panel

### Chat Composer

Should clearly show:

- who the user is chatting with
- what the chat is for
- clear input area
- clear send action
- compact supporting controls
- better readability similar to a professional AI assistant chat

## Safety constraints

- No backend changes.
- No route changes.
- No Task Center changes.
- No Workflows changes.
- No durable task creation.
- No mutation actions enabled.

## Recommended implementation

Separate into two small patches:

1. Preview Density Patch
   - reduce duplicate preview text
   - show only one main result area
   - keep route/safety card visible

2. Chat Composer Clarity CSS Patch
   - improve label, spacing, textarea contrast, send button, and helper text

## Status

Pending evidence review and patch.
