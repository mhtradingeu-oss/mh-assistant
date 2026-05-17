# MH-OS Backlog And Release Sequence

Status: Canonical
Created: 2026-05-17

## Current Completed Items

The current documentation and audit evidence recognizes these as recently completed or established:

- Documentation canonicalization audit completed: 715 docs scanned, `docs/mh-os/` recommended as official structure.
- AI Team Final Room V1 completed as a frontend UX/layout redesign.
- AI Team Specialist Coverage / Tool Map V1.1 audit completed.
- AI Command Final Room Deep Audit completed.
- System Pages Final Audit exists as broad page-by-page source material.
- P0.1 Library pagination `nextId` fix completed.
- P0.2 Operations Centers composite route fix completed.
- Runtime governance baseline and P1 freeze checkpoint exist.
- Backend operations backbone, governance defaults, approvals, tasks, handoffs, workflow runs, notifications, events, and publishing queue state are documented as durable backend areas.

## Remaining P0 Tasks

- P0.3 AI Team inbound handoff finalization. Do not apply or touch stashes unless this phase is explicitly opened.
- Governance confirmations for page actions that create, approve, publish, execute, mutate, or send.
- Research/Ads mapping clarity: route ownership, AI specialist defaults, and backend-supported execution boundary.
- Customer Operations/IVR decision: decide whether the next phase is read-only projection, AI Team context, Operations Centers bridge, or dedicated surface.
- Page-to-AI Team handoff adoption for production pages.
- Duplicate route/page/file/ID scans before page work resumes.
- Planned/disabled action audit across AI Team and operations-related pages.
- Confirm current release-critical pages meet the Page Quality Standard or have documented deferrals.

## Remaining P1 Tasks

- Backend authority projection cleanup for frontend role/route/team fallbacks.
- Standard Action Panel and AI Panel adoption on priority pages.
- Settings role/team model drift reduction.
- Workflows authority-adjacent logic review.
- Research and Ads route/handoff contract alignment.
- Release readiness rewrite based on real vs planned capability state.
- Production readiness checklist execution and browser QA.

## Remaining P2 Tasks

- Home final operating-surface upgrade.
- Mobile/responsive polish across non-critical pages.
- Accessibility review.
- Documentation evidence index and archive index.
- Archive/merge old duplicate docs after canonical docs are approved.
- More complete Project Brain / memory visibility.
- Recommendation provenance and confidence display.

## Page-By-Page Finalization Sequence

Use this sequence unless a release blocker changes priority:

1. Library
2. AI Command
3. Workflows
4. Content Studio
5. Media Studio
6. Publishing
7. Governance
8. Settings
9. Operations Centers
10. Setup
11. Integrations
12. Campaign Studio
13. Ads Manager
14. Insights
15. Research
16. Home
17. Customer Operations, only after phase approval
18. IVR / Voice, only after Customer Operations phase decision
19. Sales / CRM, only after destination and mutation boundaries are approved

## One Page / One Concern Per Commit

Every implementation commit should contain either one page audit, one page layout change, one safe action wiring, one route/registry fix, one validation/QA closeout, or one documentation update.

Do not mix frontend, backend, runtime, data, and documentation changes unless the task explicitly requires it and the safety plan is approved.

## Audit-Before-Patch Workflow

1. Run `git status --short` and `git diff --name-only`.
2. Search existing routes/files/docs before creating anything.
3. Read the relevant canonical docs in `docs/mh-os/`.
4. Read the latest page/audit evidence.
5. Classify intended actions by safety level.
6. Patch one page or one concern.
7. Validate with node checks and browser QA if UI changed.
8. Record evidence.
9. Commit only when asked.

## Safe Release Path

1. Approve this canonical documentation set.
2. Complete P0.3 AI Team inbound handoff or explicitly defer it.
3. Confirm governance safety for release-critical actions.
4. Run duplicate route/page/file/ID scans.
5. Finalize pages in the approved sequence.
6. Run production readiness checklist.
7. Validate semi-auto execution path and do not claim full-auto publishing unless proven.
8. Write release notes with honest connected/planned distinctions.
9. Take backup/snapshot where runtime/data changes are involved.
10. Release with rollback path documented.

## Stash Rules

- Do not apply Customer Operations stashes during unrelated work.
- Do not apply P0.3 stashes during documentation or unrelated page work.
- Before touching a stash, inspect its scope and confirm it matches the active phase.
- If a stash touches source outside the requested scope, stop and ask for explicit approval.
