# AI Command Pass 1 Acceptance QA

## Purpose

Confirm that the Home-to-AI specialist handoff and selected-specialist draft synchronization work correctly after Pass 1 and Pass 1B.

## Accepted implementation

- Home visible AI Workforce cards are clickable through `.mhos-workflow-step[data-role-id]`.
- Home specialist click opens AI Command with a role-specific prompt.
- AI Command infers the selected specialist from the Home prompt bridge.
- AI Command displays Home handoff context when the inferred specialist is active.
- Manual specialist selection clears stale Home handoff context.
- If the composer contains a Home/role prompt, changing specialist replaces it with the newly selected specialist prompt.
- If the composer contains a normal custom draft, it is preserved unless it starts with `Act as the`.
- AI Command remains guidance/draft/preview/route-only.

## Manual QA checklist

### Home to AI Command

- [ ] Click Strategist from Home.
- [ ] AI Command opens.
- [ ] Composer contains Strategist prompt.
- [ ] Strategist is selected.
- [ ] Home handoff context is visible.

- [ ] Click Video Lead from Home.
- [ ] AI Command opens.
- [ ] Composer contains Video Lead prompt.
- [ ] Video Lead is selected.
- [ ] Home handoff context is visible.

### Specialist switching inside AI Command

- [ ] After opening from Home as Video Lead, select Strategist.
- [ ] Composer updates to Strategist prompt.
- [ ] Home handoff context clears.
- [ ] Select Content Writer.
- [ ] Composer updates to Content Writer prompt.

### Safety

- [ ] Ask remains chat-only.
- [ ] Draft creates preview only.
- [ ] Task creates preview only.
- [ ] Draft Workflow creates preview only.
- [ ] Prepare Handoff creates preview only.
- [ ] No autonomous execution is triggered.

## Result

- [ ] Passed
- [ ] Needs follow-up

## Issues found

- None currently documented.

## Recommendation

If this QA passes, proceed to AI Command Pass 2: Meeting Room Roster Clarity.
