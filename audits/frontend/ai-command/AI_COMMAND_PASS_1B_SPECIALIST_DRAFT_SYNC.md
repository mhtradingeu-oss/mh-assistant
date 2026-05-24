# AI Command Pass 1B - Specialist Draft Sync

## Summary

This pass fixes a Meeting Room UX issue found during browser QA.

When a user opened AI Command from Home through a specialist handoff, the composer contained a role-specific prompt. If the user then selected a different specialist inside AI Command, the selected specialist changed but the old role prompt stayed in the composer.

## What changed

- Manual specialist selection now checks whether the current composer draft came from a Home handoff or starts with a role prompt.
- If so, AI Command replaces the composer text with a safe prompt for the newly selected specialist.
- If the composer contains a normal user-written draft, it is preserved.
- Home handoff context is still cleared when the user manually changes specialists.

## Files changed

- public/control-center/pages/ai-command.js
- audits/frontend/ai-command/AI_COMMAND_PASS_1B_SPECIALIST_DRAFT_SYNC.md

## What was intentionally not changed

- No backend changes.
- No API changes.
- No router, app, state, runtime, shared-context, project data, or tool-dock changes.
- No CSS changes.
- No autonomous execution.
- No publish, approval, CRM, customer reply, task creation, or workflow run behavior.

## Browser QA checklist

- [ ] Open AI Command from Home by clicking Video Lead.
- [ ] Confirm composer says Video Lead.
- [ ] Select Strategist in AI Command.
- [ ] Confirm composer updates to Strategist.
- [ ] Select Content Writer.
- [ ] Confirm composer updates to Content Writer.
- [ ] Type a custom manual draft.
- [ ] Select another specialist.
- [ ] Confirm custom manual draft is not overwritten unless it starts with "Act as the".
- [ ] Confirm no console errors.

## Recommendation

If browser QA passes, commit this as a small follow-up fix to AI Command Pass 1.
