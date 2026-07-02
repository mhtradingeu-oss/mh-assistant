# PHASE 3T.18 — Media Studio Full Media Generation Browser QA / Patch Decision

## Status
Manual Browser QA completed.

## Baseline
- Previous commit: 4cf419f Add Media Studio full media generation boundary plan

## Scope
Browser QA and patch decision for Media Studio full media workflow after provider-readiness and audio-boundary planning.

## QA Findings

Media Studio loaded and the full media workflow is visible, including:
- Image mode
- Video mode
- Voice mode
- Campaign Pack mode
- Generate Prompt From Context
- Generate Output
- Save Draft
- Save to Library
- Prepare Publishing Package
- AI Command Review
- Media queue
- Output preview
- API readiness panel
- Brand/source/readiness side panels

However, the user experience is not clear enough for an operator who does not already understand the workflow.

Observed issue:
- `Generate Output` attempted `/api/media/generate-image`
- Request timed out after 20000ms
- Output moved to `Generation Error`
- Provider/backend state showed generator backend not connected / prompt-job ready
- The screen did not clearly explain the practical next action after this state

## Checks

| Check | Result | Notes |
|---|---|---|
| Media Studio page opens without fatal error | PASS | Media Studio loaded successfully. |
| No console errors | PASS | No fatal page-level error observed. |
| Command header remains readable | PASS | Header is readable. |
| Workflow strip remains readable | PASS | Workflow strip is visible. |
| Image mode is available | PASS | Image mode is available. |
| Video mode is available | PASS | Video mode is available. |
| Voice mode is available | PASS | Voice mode is available. |
| Campaign-pack mode is available | PASS | Campaign-pack mode is available. |
| Generate Prompt From Context works as local preparation | PASS | Local preparation path is visible. |
| Generate from project setup works as local preparation | PASS | Local preparation path is visible. |
| Improve prompt remains review/preparation only | PASS | Review/preparation control is visible. |
| Make brand-safe remains review/preparation only | PASS | Review/preparation control is visible. |
| Adapt to German market remains review/preparation only | PASS | Review/preparation control is visible. |
| Convert image prompt to video brief works locally | PASS | Local conversion control is visible. |
| Convert video brief to voiceover script works locally | PASS | Local conversion control is visible. |
| Generate all formats creates multi-format brief locally | PASS | Multi-format control is visible. |
| Generate Output handles provider-not-configured fallback safely | PARTIAL | Safe fallback exists, but UX explanation is not clear enough. |
| Provider-not-configured fallback says prompt/job is ready | PASS | Fallback wording exists. |
| Image preview area supports image output when payload exists | PASS | Image preview path exists. |
| Video preview area supports video output when payload exists | PASS | Video preview path exists. |
| Audio preview area supports audio output when payload exists | PASS | Audio preview path exists. |
| Voice script is not presented as IVR/call center | PASS | No IVR/call-center claim observed. |
| Audio output is not presented as phone/call-center execution | PASS | No phone/call-center claim observed. |
| Save Draft remains safe | PASS | Save Draft is visible and safe. |
| Save to Library remains review/reference flow | PASS | Library save is visible. |
| Prepare Publishing Package remains handoff/review flow | PASS | Publishing package remains handoff/review oriented. |
| AI Command Review remains context/review-only | PASS | AI review remains context-only. |
| Media queue rows remain readable | PASS | Queue rows are readable. |
| Media specialists remain readable | PASS | Specialist cards are readable. |
| Creative readiness side panels remain readable | PASS | Side panels are readable. |
| Mobile/narrow layout does not overflow | NOT TESTED | Desktop QA only in this pass. |

## Decision
**B) Copy-only readiness / usability patch needed.**

## Reason
Media Studio is powerful and supports full media workflow boundaries, but the page is not easy enough for an operator.

The next patch should not change behavior. It should only improve guidance copy and state explanation.

## Required Next Patch Type
Copy-only usability guidance patch.

Do not change:
- JS behavior
- backend/API
- CSS layout
- routes
- provider execution
- media generation logic

## Patch Goals
- Explain what the user should do first.
- Explain Image / Video / Voice / Campaign Pack modes.
- Explain local prompt-ready mode.
- Explain provider-backed generation mode.
- Explain what `Generate Output` does.
- Explain what to do when provider is not connected or generation times out.
- Explain Save Draft vs Save to Library vs Prepare Publishing Package.
- Preserve no-IVR/no-call-center boundary.

## Recommended Next Step
Proceed to:

PHASE 3T.19 — Media Studio Usability Guidance Copy Patch Plan

## Production Notes
- No production changes in this phase.
- No CSS edits.
- No JS behavior edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- Local prompt/job-ready fallback remains preserved.
- Provider-not-configured fallback remains preserved.
- Image/video/audio/campaign-pack workflow boundaries remain preserved.
- No-IVR/no-call-center claim boundary remains preserved.
