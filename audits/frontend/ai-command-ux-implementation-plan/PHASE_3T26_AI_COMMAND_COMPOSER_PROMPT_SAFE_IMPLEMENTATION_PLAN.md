# PHASE 3T.26 — AI Command Composer/Prompt UX Safe Implementation Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Previous phase: PHASE 3T.25 — AI Command UX Composer + Suggested Prompts Improvement Plan
- Browser QA result from 3T.24B: Pass with notes
- Known UX findings:
  - Suggested prompts work but feel repetitive / insufficiently specialist-specific.
  - Composer should be closer to the conversation room.
  - User should keep page context visible while typing.
  - Page is powerful but visually dense.

## Purpose
Define the smallest safe implementation scope for improving AI Command UX without changing authority, execution, backend behavior, routes, or provider behavior.

## Non-Negotiable Boundaries
- No backend changes.
- No API changes.
- No route changes.
- No provider execution changes.
- No workflow execution changes.
- No publishing changes.
- No CRM/customer mutation.
- No data/projects changes.
- No new execution actions.
- No new durable operations.
- No extraction/refactor in the same patch.
- Suggested prompts must remain prefill-only.
- Composer send behavior must remain explicit user action.
- Route buttons must navigate only.
- Review-only boundaries must remain visible.
- Safety copy must not be weakened.

## Proposed Safe Implementation Scope

### Patch Area 1 — Suggested Prompt Text Diversity

Allowed:
- Update specialist prompt labels/templates only.
- Make prompts more specialist-specific.
- Add clearer review-only wording.
- Keep all prompt actions as `preview` or existing safe route actions.
- Preserve existing data structures and handler behavior.

Not allowed:
- No new backend calls.
- No auto-send.
- No auto-execute.
- No publishing/workflow/CRM/approval claims.

### Patch Area 2 — Composer Placement Clarification

Allowed:
- Improve composer location only if existing IDs and handlers remain stable.
- Prefer moving or visually associating the existing composer with the conversation area.
- Preserve existing textarea ID and send button ID.
- Preserve existing event binding selectors.
- Add copy that clarifies: suggested prompts prefill only.

Not allowed:
- No duplicate composer unless strictly necessary.
- No replacing handlers.
- No new global command behavior.
- No new route behavior.

### Patch Area 3 — Review/Draft Safety Clarification

Allowed:
- Add or adjust small copy near composer/output workspace:
  - "Draft/review only."
  - "Execution happens in the destination workspace."
  - "Nothing is published, approved, sent, or run here."
- Keep copy concise to avoid making the page denser.

Not allowed:
- No weakening existing safety text.
- No hiding safety text.

## Preferred First Patch
The safest first implementation should be:

1. Improve `SPECIALIST_SUGGESTED_PROMPTS` / `TEAM_SUGGESTED_PROMPTS` text variety.
2. Add minimal local guidance copy near the existing composer.
3. Avoid layout movement in the first patch unless the existing markup makes it low-risk.
4. Defer physical composer relocation if it risks breaking handlers.

## Composer Relocation Decision
Do not move the composer in the first implementation unless the patch can prove:
- the same textarea ID remains
- the same send button ID remains
- input persistence still works
- Ctrl/Cmd+Enter still works
- prompt prefill still focuses the same textarea
- send still calls the same service path
- browser QA passes

If uncertain, start with prompt diversity and composer guidance copy only.

## Required Evidence Before Implementation
Before touching production code, capture:
- current render function around composer
- current handler bindings for input/send/prompt chips
- current prompt arrays
- current safety copy around composer/output workspace

## Browser QA Required After Any Patch
- Page loads.
- Specialist selection works.
- Full Team mode works.
- Prompt chips prefill only.
- Prompt chip text differs by specialist.
- Composer typing works.
- Ctrl/Cmd+Enter works.
- Send button works.
- Response appears.
- Safety copy remains visible.
- No publish/workflow/CRM/approval/customer action is executed.
- Route buttons navigate only.

## Decision
No implementation in PHASE 3T.26.

Recommended next phase:
PHASE 3T.27 — AI Command Prompt Diversity + Composer Guidance Safe Patch

That patch should be small, production-safe, and not include extraction.
