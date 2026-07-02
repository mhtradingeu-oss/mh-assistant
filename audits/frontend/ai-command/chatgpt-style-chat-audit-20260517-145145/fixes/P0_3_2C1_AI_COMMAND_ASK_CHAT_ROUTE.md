# P0.3.2C1 AI Command Ask Chat Route Wiring

## Goal

Wire the existing Ask AI Team button to the new safe `/ai/chat` route without redesigning the page.

## Changed

- Imported `executeProjectAiChat`.
- Response bridge availability now checks the chat API function.
- Ask AI Team now calls `executeProjectAiChat`.
- The user turn is saved into `session.messages`.
- The assistant reply is saved into `session.messages`.
- `responseHistory` remains populated for compatibility with existing latest-response actions.
- Local output storage now persists `messages` alongside `responses`.

## Why Minimal

This patch focuses only on routing Ask to real chat first. UI rendering can be upgraded next.

## Current Behavior

- `/ai/chat` should provide natural specialist conversation.
- Existing response cards still display the latest reply through compatibility `responseHistory`.
- No workflow, task, handoff, publish, CRM, customer reply, approval, export, or backend mutation is executed.

## Next Step

P0.3.2C2 should render `session.messages` as the primary ChatGPT-style conversation window and keep `responseHistory` for work-output conversion.

## Live Route Smoke Test

After restarting the live orchestrator server, `/media-manager/project/:project/ai/chat` no longer returns 404.

Current smoke-test result:

- `HTTP/1.1 503 Service Unavailable`
- `Protected write routes are disabled until MH_CONTROL_CENTER_WRITE_KEY is configured on the server.`

This confirms the route is registered and protected. Full provider execution requires configuring `MH_CONTROL_CENTER_WRITE_KEY` on the server.

## P0.3.2C2 Specialist Chat UI Isolation

The AI Command conversation renderer was updated so the primary chat area shows only the selected specialist or Full Team conversation.

Shared replies from other specialists are no longer mixed into the active chat stream. They are moved into a separate collapsed `Shared room history` section.

This preserves room continuity while making each specialist conversation feel like a normal focused chat.
