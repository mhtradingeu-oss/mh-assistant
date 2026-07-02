# AI Command Team Technical Connection QA

## Purpose

Confirm that the AI Team inside AI Command is technically connected after the chat-first, tool drawer, and signal reduction passes.

## Areas to verify

- Specialist roster rendering
- Solo Specialist mode
- Full Team mode
- Home-to-AI handoff
- Draft sync when switching specialists
- Tool dock mapping per specialist
- Output Workspace preview
- Output tabs
- Save / Clear / Ask buttons
- No JavaScript console errors

## Manual QA checklist

### Direct AI Command

- [ ] Open AI Command directly.
- [ ] Confirm Solo Specialist mode loads.
- [ ] Select Strategist.
- [ ] Select Content Writer.
- [ ] Select Media Director.
- [ ] Select Video Lead.
- [ ] Select Publisher.
- [ ] Select Ads Optimizer.
- [ ] Select SEO & Insights Analyst.
- [ ] Select Compliance Reviewer.
- [ ] Select Operations Lead.
- [ ] Confirm each selection updates:
  - [ ] Header name
  - [ ] Role summary
  - [ ] Composer title
  - [ ] Draft prompt
  - [ ] Right Canonical Tools title
  - [ ] Right Canonical Tools cards

### Full Team

- [ ] Switch to Full Team.
- [ ] Confirm Full AI Team header appears.
- [ ] Confirm team orchestration path appears.
- [ ] Confirm duplicate Full Team side card is hidden.
- [ ] Confirm composer changes to coordinated team guidance.
- [ ] Confirm right tools reflect team mode where applicable.

### Home handoff

- [ ] Go to Home.
- [ ] Click visible AI Workforce specialist card.
- [ ] Confirm AI Command opens.
- [ ] Confirm correct specialist is selected.
- [ ] Confirm Home handoff context is loaded when applicable.
- [ ] Switch specialist manually.
- [ ] Confirm stale Home handoff context clears.
- [ ] Confirm composer draft updates to newly selected specialist.

### Tools / output

- [ ] Click a canonical tool card.
- [ ] Confirm composer/tool hint updates.
- [ ] Confirm Output Workspace creates preview only.
- [ ] Switch Draft tab.
- [ ] Switch Task tab.
- [ ] Switch Draft Workflow tab.
- [ ] Switch Prepare Handoff tab.
- [ ] Switch Export tab.
- [ ] Confirm no backend execution is triggered.

### Buttons

- [ ] Ask/send button works.
- [ ] Voice button remains disabled or safe if not implemented.
- [ ] Save works or stays safely local.
- [ ] Clear works.
- [ ] New Session works.
- [ ] Recent chats selector remains usable.
- [ ] Settings button remains safe.

### Browser console

- [ ] No SyntaxError.
- [ ] No ReferenceError.
- [ ] No handler missing errors.
- [ ] No tool-dock errors.
- [ ] No route errors.

## Technical acceptance

This pass is accepted only if:

- All expected specialists can be selected.
- Full Team mode can be selected.
- Home handoff works.
- Right tools remain connected.
- Output preview remains gated/local.
- No console errors appear during QA.

## Remaining debt

- Backend execution remains gated.
- Voice input remains future implementation.
- Accessibility review remains future work.
- CSS consolidation remains future work.

## Technical evidence scan

### Validation

Required checks:

- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/pages/home.js`
- `node --check public/control-center/pages/ai-command/tool-dock.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:

- [x] Passed

### Evidence categories to confirm

The scan should confirm:

- Specialist definitions exist.
- Planned specialists exist.
- Suggested prompts exist.
- Mode aliases exist.
- `getPhase1SpecialistById(...)` exists.
- `getAiRoomRoleId(...)` exists.
- Specialist buttons use `data-aicmdv2-specialist`.
- Full Team switch uses `data-aicmdv2-team-mode`.
- Session state uses `session.modeId` and `session.teamMode`.
- Draft persistence uses `persistSessionDraft(...)`.
- Home handoff uses prompt bridge / `bridgeContext`.
- Right tools use `getAiToolDockTools(...)`.
- Tool binding uses `bindAiToolDock(...)`.
- Tool cards use `data-aicmdv2-tool`.
- Output tabs use `data-aicmdv2-output-tab`.

### Browser QA result

- [ ] Passed
- [ ] Needs follow-up
- [x] Pending manual browser confirmation

### Issues found

- None documented yet.

## Closeout rule

Do not close this QA until:

- The evidence scan confirms the expected code connections.
- Manual browser QA confirms all expected specialists and Full Team mode work.
- No console errors appear.


## Technical evidence summary

The code-level scan confirmed the expected AI Team connections:

- Specialist definitions, planned specialists, suggested prompts, and mode aliases are present.
- `getPhase1SpecialistById(...)` and `getAiRoomRoleId(...)` are present.
- Specialist selection uses `data-aicmdv2-specialist`.
- Full Team mode uses `data-aicmdv2-team-mode`.
- Session state uses `session.modeId` and `session.teamMode`.
- Draft persistence uses `persistSessionDraft(...)`.
- Home handoff uses prompt bridge / `bridgeContext`.
- Right tools use `getAiToolDockTools(...)`.
- Tool binding uses `bindAiToolDock(...)`.
- Tool cards use `data-aicmdv2-tool`.
- Output tabs use `data-aicmdv2-output-tab`.

Technical status: passed.

Manual browser QA remains required before final AI Team closure.
