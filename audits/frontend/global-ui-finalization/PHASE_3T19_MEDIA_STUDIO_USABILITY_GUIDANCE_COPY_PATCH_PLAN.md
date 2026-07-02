# PHASE 3T.19 — Media Studio Usability Guidance Copy Patch Plan

## Status
Plan-only. No production changes.

## Baseline
- Previous commit: 90b0aef Add Media Studio full media generation QA decision

## Purpose
Prepare a safe copy-only usability guidance patch for Media Studio.

## Why This Exists
Phase 3T.18 confirmed Media Studio supports a full media workflow but is not easy enough for an operator.

The page has strong capability, but the operator needs clearer guidance about:
- what to do first
- which mode to choose
- when to generate prompt vs output
- what provider-not-connected means
- what to do after timeout/generation error
- what Save Draft vs Save to Library vs Prepare Publishing Package means

## Patch Type
Copy-only guidance patch.

Allowed:
- add/clarify user-facing helper copy
- clarify button-adjacent explanations
- clarify provider-not-connected fallback wording
- clarify local prompt/job-ready mode
- clarify generated output vs prepared prompt
- clarify Save Draft / Save to Library / Prepare Publishing Package meanings

Forbidden:
- no JS behavior changes
- no backend/API changes
- no route changes
- no CSS layout changes
- no provider execution changes
- no generation logic changes
- no false claim that output is generated when provider is not connected
- no IVR/call-center/phone execution claim

## Copy Areas To Review
- page header subtitle
- next action copy
- generator fallback note
- mode tabs helper
- prompt/brief helper
- Generate Output helper
- Output Preview error explanation
- API readiness panel message
- queue status wording
- Save Draft / Save to Library / Prepare Publishing Package guidance

## Proposed Copy Direction
The UI should clearly communicate:

1. **Start here**
   - Choose Image, Video, Voice, or Campaign Pack.
   - Fill objective, format, brand style, and prompt/brief.
   - Use Generate Prompt From Context first.

2. **Local preparation mode**
   - If no generation backend is connected, the system prepares a prompt/job-ready draft.
   - This is still useful for review, Library save, AI review, or provider handoff.

3. **Provider-backed generation**
   - Generate Output attempts real provider/backend generation.
   - If the provider returns image/video/audio output, it appears in preview.
   - If the provider times out or is not connected, keep the prompt/job-ready draft and continue review.

4. **Safe next actions**
   - Save Draft stores work in Media Studio.
   - Save to Library stores the selected prompt/output/reference for reuse.
   - Prepare Publishing Package creates a review/handoff package and does not publish.

5. **Audio boundary**
   - Voice mode prepares voiceover scripts/audio outputs.
   - It does not run IVR, phone calls, realtime voice, or call center workflows.

## Browser QA Checklist For Future Patch

| Check | Result | Notes |
|---|---|---|
| Media Studio opens without fatal error | TODO | |
| Header guidance is clearer | TODO | |
| Mode choice is clearer | TODO | |
| Local prompt-ready mode is clear | TODO | |
| Provider-backed generation meaning is clear | TODO | |
| Timeout/generation error next step is clear | TODO | |
| Save Draft meaning is clear | TODO | |
| Save to Library meaning is clear | TODO | |
| Prepare Publishing Package meaning is clear | TODO | |
| No IVR/call-center claim introduced | TODO | |
| No behavior changed | TODO | |
| No CSS layout regression | TODO | |
| Validation passes | TODO | |

## Decision
Ready to prepare a future copy-only patch.

## Recommended Next Step
Proceed to:

**PHASE 3T.20 — Media Studio Usability Guidance Copy Patch**

Only after user approval.

## Protected Behavior
- No production changes in this phase.
- No JS behavior edits in this phase.
- No backend/API edits.
- No CSS layout edits.
- No route additions.
- Preserve full media workflow boundaries.
- Preserve local prompt/job-ready fallback.
- Preserve provider-not-connected fallback.
- Preserve no-IVR/no-call-center boundary.
