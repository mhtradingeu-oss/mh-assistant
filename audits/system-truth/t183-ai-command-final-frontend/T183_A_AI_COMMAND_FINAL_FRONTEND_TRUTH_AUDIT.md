# T183-A — AI Command Final Frontend Truth Audit

## Status
Audit only. No implementation.

## Purpose
Restart AI Command finalization from source truth after discovering that the visual result did not match the intended final UX.

## User Requirement
AI Command must become a clean, powerful, ChatGPT-like AI Team command page with working bottom icons, voice, upload/source flow, specialist/team intelligence, handoff, workflow preparation, clean CSS, no duplication, and a final professional layout.

## Audit Questions
- What render path is actually active?
- Which legacy render paths still exist?
- Which CSS blocks actually control the visible page?
- Did the intended final CSS block get written to the CSS file?
- Why did the browser visual result not change?
- Which UI elements are hidden incorrectly?
- Which controls are working, planned, or only visual?
- What is the final layout contract before the next patch?

## Boundary
- AI Command page only.
- No backend changes.
- No provider execution changes.
- No route changes.
- No voice recording/TTS implementation in this audit.
- No CSS patch until the audit is reviewed.

## Final Goal
Define and implement the final AI Command page phase by phase:
1. Source truth audit.
2. Final UX contract.
3. Render cleanup.
4. CSS authority cleanup.
5. Bottom controls QA.
6. AI Team behavior polish.
7. Source/upload/tool flow.
8. Voice modes roadmap.
9. Browser QA.
10. Commit only after clean validation.
