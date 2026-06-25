# T184-A — AI Command Final UX Truth Audit

## Status
Audit only. No implementation.

## Purpose
Inspect the real AI Command page after recent voice, bottom control, and design attempts to decide the final UI/UX cleanup path.

## User Observations To Verify
- The plus icon should be for upload/file/source, not confused with specialist selection.
- The specialist dropdown should clearly support individual specialist vs full AI Team.
- Voice should likely be one smart icon, with language inferred from user context instead of visible language clutter.
- New chat and recent chats should work like ChatGPT.
- Existing drawer/tool drawer may be unnecessary or should be reduced to a clean context/source panel.
- CSS/design should be clean, not stacked from repeated patches.
- All AI Team behavior files and related handlers must be audited before the next patch.

## Audit Questions
1. What is the active render path?
2. What controls exist in the final composer?
3. What does the plus button actually do?
4. Is there real upload/file/drop support?
5. How are source and Library selection currently handled?
6. How is specialist selection handled?
7. How is Full Team vs Solo handled?
8. Is voice language selector still necessary in UI?
9. Is the voice recorder module loaded and reachable?
10. Are New Chat and Recent Chats correctly wired after ID cleanup?
11. Do we still need Tool Drawer, or only a compact context/source panel?
12. Are there duplicate IDs or duplicate handlers?
13. Which CSS blocks actually control the visible page?

## Boundary
- No implementation in this step.
- AI Command page only.
- No backend changes.
- No route changes.
- No provider execution.
- No commit before review.
