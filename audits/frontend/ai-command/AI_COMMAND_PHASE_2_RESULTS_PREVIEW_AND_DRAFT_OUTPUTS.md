# AI Command — Phase 2: Results Preview and Draft Outputs

**Date:** 2026-05-15  
**Branch:** architecture/frontend-consolidation-v1  
**Status:** Implemented (frontend-only, no backend authority changes)

## Summary

Phase 2 adds visible, role-aware draft output previews to AI Command so users can immediately see useful results after safe actions. The page now creates and displays local guidance/task/workflow/handoff/media-brief previews without backend execution. Preview actions support copy, composer reuse, destination routing with shared draft context, local-only save, local-only clear, and optional browser-only read aloud.

## Files Changed

- public/control-center/pages/ai-command.js
- public/control-center/styles/12-pages.css
- audits/frontend/ai-command/AI_COMMAND_PHASE_2_RESULTS_PREVIEW_AND_DRAFT_OUTPUTS.md

## What Phase 2 Added

- A new Specialist Output Preview panel in AI Command.
- Local transient output state model in session plus local browser save for previews.
- Role-aware preview templates for specialist outputs.
- Composer action wiring to generate visible local previews.
- Preview action buttons for safe frontend-only operations.
- Honest media capability status panel.
- Browser-only "Read preview" support using SpeechSynthesis when available.

## Results Preview Behavior

- Panel title: Specialist Output Preview.
- Empty state text:
  "Choose a specialist, write a request, then prepare guidance, a task draft, a workflow draft, or a handoff preview."
- When populated, panel shows:
  - output type
  - active specialist
  - output status
  - preview title/summary
  - bullets and/or steps
  - destination route
  - next safe action
  - confirmation note
  - safety label

## Local Output State Model

Phase 2 output previews are local/transient and track:

- outputType: guidance | task | workflow | handoff | media_brief
- specialistId
- title
- summary
- bullets
- steps
- destinationRoute
- confirmationRequired
- generatedAt
- sourcePrompt
- status: draft_preview
- safetyLabel
- nextSafeAction
- confirmationNote

Persistence scope:

- Session memory: session.outputPreview
- Optional local browser save: localStorage key mh-ai-command-local-outputs-v1
- No backend writes for preview generation

## Button Behavior

Composer actions:

- Prepare Guidance:
  - Generates local guidance preview
  - No backend execution
- Draft Task:
  - Frames task prompt and generates local task preview
  - Includes title/steps/destination/safety notes
  - No backend task creation
- Draft Workflow:
  - Added in Phase 2
  - Frames workflow prompt and generates local workflow preview
  - No backend workflow run
- Prepare Handoff:
  - Frames handoff prompt and generates local handoff preview
  - No backend handoff creation
- Save Local Draft:
  - Saves composer draft locally only
- Clear:
  - Clears composer draft only

Suggested prompts:

- Fill composer and focus composer
- No auto execution
- User must explicitly click a prepare/draft button

Preview action buttons:

- Copy preview:
  - Uses navigator.clipboard when available
  - No backend
- Use in composer:
  - Inserts preview text into composer
  - No backend
- Send to destination:
  - Navigates only
  - Sets shared draft/handoff context using existing frontend shared-context mechanism
  - Shows: "Draft context prepared. Review before saving or executing."
  - No backend mutation
- Save local draft:
  - Saves preview in local browser storage only
- Clear preview:
  - Clears local preview state only
- Read preview:
  - Uses browser SpeechSynthesis when available
  - Reads local preview text only
  - Disabled/unsupported safely when not available

## Specialist Output Templates

Role-aware preview templates implemented for:

- Strategist: priorities, blockers, next move, campaign/workflow destination
- Content Writer: copy task structure, hooks/captions/CTA/review, Content Studio destination
- Media Director: media brief with visual direction/prompt ideas/assets, Media Studio destination, no generation claim
- Video Lead: hook/script/storyboard draft, Media Studio destination, explicit provider/worker requirement
- Publisher: publishing checklist/schedule draft, Publishing destination, confirmation required
- Ads Optimizer: ad angle/testing draft, Ads Manager destination, no budget/update execution
- SEO & Insights Analyst: analysis plan/signals/gaps, Insights destination, no fake analytics
- Compliance Reviewer: risk review checklist/safety notes, Governance destination, confirmation required
- Operations Lead: task/workflow/handoff planning, Task Center/Workflows destination, no workflow run
- Full Team mode: combined team preview with safe routing

## Media Capability Status Treatment

Compact panel added with honest capability messaging:

- Image prompt / provider routing: configured or status not connected yet
- Video brief generation: Draft-ready
- Native GPU video rendering: Requires connected GPU worker
- Voice script: Draft-ready
- Realtime voice chat: Future connection

No fake media execution claims are made.

## Read/Listen Treatment

- Added "Read preview" action in preview panel.
- Uses browser SpeechSynthesis only.
- Reads local preview text only.
- No microphone capture.
- No backend audio.
- No realtime voice chat claim.

## Safety Confirmations

- No backend execution enabled from Phase 2 preview flow.
- No workflow runs started.
- No publish/approve/delete/archive/sync destructive actions added.
- Backend authority model remains unchanged.
- Frontend remains projection + draft preview layer.

## What Remains Frontend-Only

- Output previews are local draft artifacts.
- Preview save is local browser storage only.
- Destination send is route navigation + shared draft context only.
- Read preview is local browser speech only.

## What Backend Execution Was Not Enabled

Not enabled from Phase 2 preview actions:

- executeProjectAiCommand
- createProjectTask
- runProjectWorkflow / runProjectAiWorkflow
- createProjectHandoff
- publishing execution endpoints
- approval mutation endpoints

## What Remains for Phase 3

- Durable creation path with explicit confirmations and governance gates.
- Explicit backend draft/task/workflow/handoff persistence options.
- Stronger destination intake UX for preview packages.
- Optional richer message stream integration (while preserving authority boundaries).

## Validation Results

Commands run:

- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- grep -n '!important' public/control-center/styles/12-pages.css public/control-center/styles/14-page-standard.css public/control-center/styles/15-clean-operating-layer.css || true
- git status --short
- git diff --stat
- git diff -- public/control-center/pages/ai-command.js | sed -n '1,520p'
- git diff -- public/control-center/styles/12-pages.css | sed -n '1,420p'
- git diff -- audits/frontend/ai-command/AI_COMMAND_PHASE_2_RESULTS_PREVIEW_AND_DRAFT_OUTPUTS.md | sed -n '1,280p'

Observed expectations:

- JS syntax checks passed.
- Existing !important entries remain in 14-page-standard.css (pre-existing); no Phase 2 !important additions required.
- Diff scope limited to Phase 2 frontend files and the new Phase 2 audit file.

## Known Follow-Up Items

- Optionally restore and modernize legacy message stream/render helpers for richer draft/result history (still draft-only by default).
- Add richer destination-specific preview envelope format for each receiving page.
- Add non-destructive preview version history in-browser.
- Add explicit "create durable artifact" gates in future phase with confirmation and backend policy checks.
