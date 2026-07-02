# T182 — AI Command Final Cleanup Audit

## Status
Audit only. No implementation in this step.

## Purpose
Inspect AI Command after the ChatGPT-like shell and voice dictation baseline to decide the next safe cleanup/consolidation step.

## Audit Questions
- Is the ChatGPT-like shell the active path?
- Are old Tools / Output / Flow panels still active, hidden, or only legacy functions?
- Are duplicate IDs present?
- Are voice controls uniquely wired?
- Is the Mic language selector connected to the recognition language resolver?
- Is CSS layered too heavily?
- Can AI Command proceed to Audio Recording / Voice Conversation safely?
- What must be consolidated before adding more features?

## Current Known Baseline
- Voice dictation baseline committed.
- AI Team audit/readiness docs committed.
- Runtime data noise restored.
- Working tree was clean before this audit.

## Decision Gate
No additional implementation should happen until this audit is reviewed.

## T182-A Findings

### Confirmed Risks
- AI Command contains legacy UI functions and legacy composer markup.
- Some IDs appear multiple times in source.
- The final composer path is active, but old source-level duplicates increase maintenance risk.
- CSS is heavily layered and must be consolidated before adding more advanced voice modes.
- Voice dictation is complete, but full voice conversation is not implemented yet.

### First Safe Cleanup Scope
Allowed:
- Fix obvious markup typos.
- Verify active control handlers.
- Rename or isolate legacy IDs only after confirming inactive path.
- Keep backend and execution behavior unchanged.

Forbidden:
- Backend changes.
- Provider execution changes.
- Recording/TTS implementation before cleanup.
- Large CSS redesign before source truth is confirmed.

### Next Decision
After T182-A review, choose one:
1. Wire inactive bottom controls: plus, specialist, status.
2. Rename legacy duplicate IDs.
3. Consolidate AI Command CSS into a single final scoped block.
4. Start Voice Modes implementation only after UI cleanup.

## T182-B Legacy Composer ID Isolation

### Purpose
Reduce active/legacy control conflict risk before wiring more AI Command bottom controls.

### Changes
- Isolated legacy composer IDs where safe.
- Fixed malformed legacy send button attribute.
- Normalized final send button disabled spacing.
- Normalized selected voice language spacing.

### Boundary
- No backend changes.
- No API changes.
- No provider execution changes.
- No voice conversation implementation.
- No CSS consolidation yet.

### Next Required Review
- Confirm remaining duplicate IDs are from inactive legacy surfaces or decide renaming strategy.
- Verify plus / specialist / status / source / mic / voice / send button behavior.

## T182-C Remaining Duplicate IDs Review

### Purpose
Locate remaining duplicate source-level IDs after isolating the legacy composer input/send controls.

### Current Concern
The active final composer is safer after T182-B, but source-level duplicate IDs still remain for source, status, session, settings, new session, and preview controls.

### Required Decision
For every remaining duplicate ID:
- confirm whether both instances can render at the same time;
- if not active, rename the legacy one;
- if active, replace one side with a data attribute or scoped query;
- do not change backend behavior.

### Next Safe Step
Apply only source-level ID isolation where the legacy path is confirmed inactive.

## T182-D Duplicate ID Isolation Patch

### Purpose
Remove remaining source-level duplicate IDs that could confuse direct `getElementById` handlers before adding further voice/conversation features.

### Changes
- Renamed chat-first topbar source button to `aicmdV2SourceBtnTopbar`.
- Renamed chat-first header controls:
  - `aicmdV2SessionSelectChatFirst`
  - `aicmdV2NewSessionBtnChatFirst`
  - `aicmdV2SettingsBtnChatFirst`
- Renamed legacy composer status to `aicmdV2StatusLegacy`.
- Renamed legacy preview buttons to `Legacy` IDs.

### Boundary
- No backend changes.
- No provider execution changes.
- No voice conversation implementation.
- No CSS consolidation yet.

### Next Required Review
Confirm no duplicate IDs remain in AI Command source, then wire final bottom controls.

## T182-E Bottom Controls Wiring Audit

### Purpose
Verify whether the final AI Command bottom controls are wired or only visually present.

### Controls to Verify
- Plus / attach tools
- Specialist selector
- Status / thinking state
- Source picker
- Mic language selector
- Mic dictation
- Voice conversation button
- Send button

### Decision Gate
Only after this audit should wiring patches be applied.

## T182-F Bottom Controls Wiring Patch

### Purpose
Make final AI Command composer controls respond safely before deeper voice conversation work.

### Completed Wiring
- Plus button opens AI tools / Tool Drawer through the existing safe tool button flow.
- Source button opens source/tool flow through the existing safe tool button flow.
- Specialist pill opens the existing specialist selector.
- Status pill toggles the AI Team context drawer.
- Voice conversation icon is enabled as a safe planned-mode action explaining the next provider-backed phase.
- Mic language and mic dictation were already wired in T181.
- Send was already wired to the guarded AI chat route.

### Boundary
- No backend changes.
- No provider execution changes.
- No recording implementation.
- No TTS implementation.
- No realtime voice implementation.
- Voice conversation button does not execute; it explains the required next phase.

### Next Required Step
Browser QA all final bottom controls, then decide between:
1. CSS/design consolidation.
2. Voice modes implementation starting with Audio Recording Mode.

## T182-F Browser QA Closeout

### Status
Closed after final bottom controls wiring.

### Browser QA Checklist
- Plus button opens AI tools / Tool Drawer.
- Specialist pill opens specialist selector.
- Status pill toggles AI Team context drawer.
- Source button opens source/tool flow.
- Mic language selector cycles Auto / AR / EN / DE.
- Mic dictation captures speech into composer.
- Voice conversation icon provides safe planned-mode message.
- Send remains guarded through AI chat route.

### Remaining Work
- CSS/design consolidation.
- Header/message visual polish.
- Audio Recording mode.
- Backend STT provider route.
- Specialist TTS response.
- Full voice conversation mode.

### Commit Boundary
Runtime data files were restored and excluded.
