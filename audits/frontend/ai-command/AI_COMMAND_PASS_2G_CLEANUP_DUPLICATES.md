# AI Command Pass 2G - Cleanup Duplicates Before Commit

## Summary

This cleanup pass removes duplicate/noisy code introduced during Pass 2E/2F browser polish.

## What changed

- Removed the no-op `.replace()` around `renderAiRoomConversationHeader`.
- Removed unused `renderAiToolDock` import when no longer used by the center.
- Consolidated AI Command chat-first CSS into one page-scoped block.
- Removed overlapping Pass 2E/2F CSS layers from the top of `12-pages.css`.

## What was intentionally not changed

- No backend changes.
- No API/runtime changes.
- No route/state/shared-context changes.
- No tool-dock behavior changes.
- No autonomous execution.
- No center tool duplication restored.

## Browser QA checklist

- [ ] AI Command loads without console errors.
- [ ] Center remains one unified chat surface.
- [ ] No duplicate quick tools in the center.
- [ ] Right Canonical Tools still appear and work.
- [ ] Solo Specialist works.
- [ ] Full Team works.
- [ ] Composer input and send button work.
