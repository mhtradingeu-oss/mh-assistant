# AI Command Tools, Drawer, and Preview QA

## Purpose

Confirm that AI Command right-side tools, output drawer/workspace, preview generation, and output tabs remain technically connected and safe after the chat-first and signal-reduction passes.

## Technical areas

- Tool catalog / tool-dock module.
- Tool rendering in right panel.
- Tool click binding.
- Output Workspace.
- Output tabs.
- Prepare / Task / Workflow / Handoff preview buttons.
- Save / Clear.
- No backend execution from preview actions.

## Code evidence checklist

- [x] `tool-dock.js` passes syntax validation.
- [x] `getAiToolDockTools(...)` exists.
- [x] `bindAiToolDock(...)` exists.
- [x] AI Command imports `bindAiToolDock` and `getAiToolDockTools`.
- [x] Right tools render `data-aicmdv2-tool`.
- [x] Tool buttons are bound from `[data-aicmdv2-tool]`.
- [x] Output tabs render `data-aicmdv2-output-tab`.
- [x] Output tab buttons are bound from `[data-aicmdv2-output-tab]`.
- [x] `session.outputPreview` is used for preview state.
- [x] `session.activeOutputTab` is used for selected tab state.
- [x] Prepare button exists: `aicmdV2PrepareBtn`.
- [x] Draft Task button exists: `aicmdV2DraftTaskBtn`.
- [x] Draft Workflow button exists: `aicmdV2DraftWorkflowBtn`.
- [x] Handoff button exists: `aicmdV2HandoffBtn`.

## Manual browser QA checklist

### Right tools

- [ ] Open AI Command.
- [ ] Select Strategist.
- [ ] Confirm right panel title shows Strategist Canonical Tools.
- [ ] Click first tool card.
- [ ] Confirm composer/tool hint updates.
- [ ] Select Content Writer.
- [ ] Confirm tools change.
- [ ] Select Media Director.
- [ ] Confirm tools change.
- [ ] Select Full Team.
- [ ] Confirm team tool mode is safe and visible.

### Output Preview

- [ ] Type or load a prompt.
- [ ] Click Ask/send if available.
- [ ] Confirm generated response appears or safe placeholder appears.
- [ ] Click Prepare.
- [ ] Confirm Output Workspace preview appears.
- [ ] Click Draft Task.
- [ ] Confirm Task preview appears.
- [ ] Click Draft Workflow.
- [ ] Confirm Workflow preview appears.
- [ ] Click Prepare Handoff.
- [ ] Confirm Handoff preview appears.
- [ ] Confirm no backend execution happens automatically.

### Output tabs

- [ ] Switch Draft tab.
- [ ] Switch Task tab.
- [ ] Switch Draft Workflow tab.
- [ ] Switch Prepare Handoff tab.
- [ ] Switch Export tab.
- [ ] Confirm preview content remains safe/local.
- [ ] Confirm no console errors.

### Buttons and safety

- [ ] Save works or remains local/safe.
- [ ] Clear clears draft/preview safely.
- [ ] Voice remains disabled or safe if not implemented.
- [ ] No tool-dock errors.
- [ ] No ReferenceError.
- [ ] No SyntaxError.
- [ ] No route errors.

## Acceptance

This QA can close only if:

- Tool dock code connection is confirmed.
- Right tools change by specialist or team mode.
- Tool clicks do not break composer/preview.
- Output preview remains gated/local.
- Output tabs work.
- No console errors appear.

## Remaining debt

- Real backend execution remains gated.
- Tool drawer accessibility review remains needed.
- CSS consolidation remains future work.


## Technical evidence summary

The code-level scan confirmed the expected tools, drawer, and preview connections:

- `tool-dock.js` passes syntax validation.
- `getAiToolDockTools(...)` and `bindAiToolDock(...)` are present.
- AI Command imports `bindAiToolDock` and `getAiToolDockTools`.
- Right tools render `data-aicmdv2-tool`.
- Tool buttons are bound from `[data-aicmdv2-tool]`.
- Output tabs render `data-aicmdv2-output-tab`.
- Output tab buttons are bound from `[data-aicmdv2-output-tab]`.
- `session.outputPreview` is used for preview state.
- `session.activeOutputTab` is used for selected tab state.
- Preview action buttons exist:
  - `aicmdV2PrepareBtn`
  - `aicmdV2DraftTaskBtn`
  - `aicmdV2DraftWorkflowBtn`
  - `aicmdV2HandoffBtn`

Technical status: passed.

Manual browser QA remains required before final Tools / Drawer / Preview closure.
