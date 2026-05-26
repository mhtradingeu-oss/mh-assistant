# PHASE 3T.25 — AI Command UX Composer + Suggested Prompts Improvement Plan

## Status
Plan-only / audit-only.

No production implementation is approved in this phase.

## Baseline
- Previous phase: PHASE 3T.24B — AI Command UX Browser QA Baseline
- Previous QA evidence commit: a96c73e Add AI Command browser QA evidence
- Browser QA result: Pass with notes

## Why this phase exists
Manual browser QA confirmed that AI Command is functional and safe, but UX improvements are needed before decomposition/extraction.

Confirmed notes:
- Suggested prompts work and do not auto-send, but they feel repetitive or insufficiently specialist-specific.
- The composer/typing area should be closer to the conversation room, not separated in a header-like location.
- User should be able to keep the page context visible while typing.
- The page is powerful but visually dense.
- Draft/review actions should remain clearly separated from execution actions.

## Purpose
Create a controlled UX improvement plan for:
1. Composer placement.
2. Suggested prompt diversity.
3. Specialist-specific prompt clarity.
4. Review-only safety boundaries.
5. Future implementation scope.

## Non-Negotiable Boundaries
- No backend changes.
- No API changes.
- No route changes.
- No provider execution changes.
- No workflow execution changes.
- No publishing changes.
- No CRM/customer action changes.
- No data/projects changes.
- No extraction in this planning phase.
- Preserve review-only boundaries.
- Preserve safety copy.
- Suggested prompts must prefill only and must not auto-send.
- Route buttons must navigate only and must not execute destination actions.

## UX Problem 1 — Composer Placement

### Current problem
The composer/typing experience can feel separated from the active conversation or page context.

### Desired behavior
The typing area should feel attached to the conversation room:
- visible near the chat stream
- easy to type while seeing specialist context
- not hidden in a header-like area
- not separated from response/output context
- not confused with global command/search

### Future implementation options

#### Option A — Move composer into conversation room
Place the composer directly below the active conversation stream.

Pros:
- Most natural chat UX.
- User sees previous messages while typing.
- Reduces confusion with global command.

Risks:
- Requires careful layout changes.
- Must not break existing handlers.

#### Option B — Sticky local composer inside AI Command workspace
Keep composer visible at bottom of the AI Command conversation panel.

Pros:
- Strong UX for long pages.
- User can scroll output while composer remains accessible.

Risks:
- More CSS/layout risk.
- Must avoid covering content.

#### Option C — Duplicate lightweight local quick composer
Keep current composer but add a smaller local composer near the chat.

Pros:
- Less risky initially.

Risks:
- Duplicate inputs can confuse users.
- Not preferred unless implementation constraints require it.

### Recommended option
Option A first, if implementation can preserve IDs, handlers, and state.
Option B may be better later after layout QA.
Avoid Option C unless necessary.

## UX Problem 2 — Suggested Prompt Repetition

### Current problem
Suggested prompts appear too similar and may not fully reflect the selected specialist.

### Desired behavior
Suggested prompts should:
- change clearly based on selected specialist
- reflect the selected domain
- prepare review-ready work only
- make destination ownership clear
- never imply execution
- stay editable after prefill

### Prompt design rules
Each specialist should have:
- 3 core prompts
- 2 context-aware prompts
- 1 safe handoff prompt
- 1 review/check prompt

### Example specialist prompt directions

#### Strategist
- Build launch strategy draft.
- Map next best campaign move.
- Identify blockers and owners.
- Prepare strategy handoff to Campaign Studio.

#### Content Writer
- Draft German captions and hooks.
- Rewrite weak copy for clarity.
- Prepare publisher handoff package.
- Review tone and CTA alignment.

#### Media Director
- Prepare visual direction brief.
- Map required assets.
- Review brand alignment.
- Prepare media handoff to Media Studio.

#### Video Lead
- Draft short-form video script.
- Build storyboard outline.
- Prepare voiceover direction.
- Route video brief to Media Studio.

#### Publisher
- Review publish readiness.
- Prepare schedule draft.
- Flag pre-publish blockers.
- Prepare publishing handoff for approval.

#### Compliance Reviewer
- Check claims and risky language.
- Prepare approval notes.
- Flag missing evidence.
- Prepare governance review handoff.

#### Operations Lead
- Convert output into task plan.
- Draft workflow handoff.
- Identify owner/dependency chain.
- Prepare next safe route.

#### Customer Ops
- Draft support reply for review.
- Prepare escalation summary.
- Classify customer issue.
- Route support/sales/ops handoff.

#### Sales / CRM
- Draft lead follow-up.
- Prepare pipeline next step.
- Summarize lead context.
- Prepare CRM handoff without mutation.

## UX Problem 3 — Draft/Review vs Execution Clarity

### Current problem
AI Command has many controls: Draft, Task, Workflow, Handoff, Export, Route, Copy, Use, Save, Read.
Even if safe, users may not immediately understand which controls only prepare output and which workspace owns execution.

### Desired behavior
Every action cluster should communicate:
- “This prepares a draft/review package.”
- “Execution happens in the destination workspace.”
- “Nothing is published, approved, sent, or run here.”

## Proposed Future Implementation Scope

### Safe first implementation candidate
A future implementation phase may:
- adjust composer placement within existing AI Command markup
- improve prompt text arrays
- preserve all existing data attributes and handlers where possible
- add no backend/API changes
- add no execution logic
- keep route buttons navigation-only
- add no new provider calls

### What must not be implemented first
Do not start with:
- file decomposition
- handler extraction
- new backend service
- new route
- new API
- new execution action
- large CSS redesign
- duplicate composer unless required

## Browser QA Requirements After Any Future Patch
- AI Command loads.
- Composer visible near conversation.
- Typing works.
- Suggested prompt prefill works and does not auto-send.
- Specialist-specific prompts differ visibly.
- Send prompt works.
- Response appears.
- Preview/handoff remains review-only.
- Route buttons navigate only.
- Safety copy remains visible.
- No publish/workflow/CRM/approval/customer action is executed.

## Decision
No implementation in PHASE 3T.25.

Recommended next phase:
PHASE 3T.26 — AI Command Composer/Prompt UX Patch Plan
or
PHASE 3T.26 — AI Command Composer/Prompt UX Safe Implementation

Choice depends on whether the current plan is approved.
