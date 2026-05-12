# Publishing Extraction Candidates

## Decision Basis
- Sequence is fixed: Audit -> Confirm -> Decide -> Implement.
- This document defines what is safe to extract only after behavior contract and shadow-compare pass.

## Safe Pure Candidates (First)

### buildSchedulePayload
- Current role: deterministic payload builder from session.form.
- Purity: pure function with no side effects.
- Extraction safety: high.

### buildLocalDraftPayload
- Current role: deterministic local draft record builder.
- Purity: near-pure (depends on nowIso for timestamp), no external mutation.
- Extraction safety: high if timestamp behavior remains identical.

### normalizeQueueItem
- Current role: data normalization of queue source records.
- Purity: pure projection utility.
- Extraction safety: high.

### buildPublishingAiPrompt
- Current role: deterministic prompt formatter from selected/session/handoff values.
- Purity: pure string assembly.
- Extraction safety: high.

### validation helpers
- validateBuilder and supporting input checks.
- Purity: deterministic validation over session.form (writes session.validation).
- Extraction safety: medium-high, preserve exact error messages and intent mapping.

## Unsafe Extraction Candidates (Not First)
- bindPublishingWorkspace event handlers and dispatch branching.
- runAndRefresh wrapper and its success/error/reload ordering.
- localOnly versus durable mutation branch logic.
- queue action routing for publish/pause/retry/review/schedule.
- shared-context handoff write flow in send-to-AI handler.
- auto mode button handlers and lifecycle coupling.

Reason:
- These blocks encode behavior-critical control flow and authority boundaries.
- Extracting them early risks behavior drift and hidden side effects.

## Blocked Until Later
- action dispatcher extraction
- Auto Mode lifecycle refactor
- backend mutation wrapper extraction
- localOnly terminal status redesign
- UI redesign

## Recommended Implementation Order
1. Lock contract and shadow-compare schema as immutable baseline.
2. Add non-invasive, observe-only parity instrumentation (no behavior change).
3. Run parity on full publishing action matrix.
4. Extract pure helpers only: buildSchedulePayload, buildLocalDraftPayload, normalizeQueueItem, buildPublishingAiPrompt, validation helpers.
5. Re-run parity and browser QA contract.
6. Only then evaluate dispatcher or lifecycle extraction in a separate phase.

## Guardrails For Any Future Extraction
- Never change backend endpoint mapping in extraction-only PRs.
- Never alter durable versus localOnly branch decisions in helper extraction phase.
- Never alter message text categories (success vs error) during pure extraction.
- Preserve explicit Auto Prepare click as the only Auto Mode start trigger.
- Preserve governance authority at backend assertPublishingMutationAllowed boundary.
