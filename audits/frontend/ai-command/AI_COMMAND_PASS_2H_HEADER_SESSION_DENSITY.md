# AI Command Pass 2H - Header and Session Density Polish

## Summary

This pass reduces the visual weight of the AI Command header, session controls, and workflow strip after the chat-first meeting room pass.

## Files changed

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- audits/frontend/ai-command/AI_COMMAND_PASS_2H_HEADER_SESSION_DENSITY.md

## What changed

- Shortened the AI Team Command Center subtitle.
- Changed New Session to a compact New button.
- Changed Settings to a compact settings icon button.
- Reduced header vertical padding.
- Reduced workflow strip height and visual dominance.
- Reduced status strip padding and density.
- Consolidated duplicate Pass 2H CSS into one page-scoped section.

## What was intentionally not changed

- No backend changes.
- No API/runtime changes.
- No router, state, app, shared-context, or data changes.
- No right tools/output behavior changes.
- No autonomous execution.
- No voice behavior.
- No center tool duplication restored.

## Safety notes

All existing IDs and data attributes remain preserved:

- aicmdV2SessionSelect
- aicmdV2NewSessionBtn
- aicmdV2SettingsBtn
- aicmdV2Input
- aicmdV2AskBtn
- aicmdV2VoiceBtn
- data-aicmdv2-specialist
- data-aicmdv2-team-mode
- data-aicmdv2-tool
- data-aicmdv2-output-tab

## Browser QA checklist

- [ ] Header is more compact.
- [ ] Recent chats / New / Settings cluster is usable.
- [ ] Workflow strip remains visible but quieter.
- [ ] Unified chat surface remains intact.
- [ ] Right tools/output panel remains unchanged.
- [ ] No console errors.

## Recommended next step

If browser QA passes, commit this as a small follow-up to the chat-first meeting room commit.
