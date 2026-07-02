# Final Frontend Browser QA Plan

## Status

Planned.

## Branch

- `architecture/frontend-consolidation-v1`

## Purpose

Run a final browser QA pass after completing the Global Frontend Authority Map.

This QA pass must verify that frontend authority boundaries are preserved visually and interactively before any final UX polish or design-system consolidation begins.

## QA Rules

- Do not change production code during QA.
- Do not change CSS during QA.
- Do not change backend/API behavior.
- Do not touch `data/projects`.
- Record issues as evidence first.
- Only create implementation patches after issue scope is confirmed.
- Keep disabled mutation controls disabled.
- Confirm AI never appears to silently approve, publish, send, or execute.
- Confirm route actions are clearly navigation/handoff only.
- Confirm source/evidence and governance boundaries remain clear.

## Pages To QA

1. Home
2. Setup
3. Library
4. AI Command
5. Campaign Studio
6. Content Studio
7. Media Studio
8. Publishing
9. Ads Manager
10. Insights
11. Research
12. Integrations
13. Workflows
14. Customer Center
15. Settings
16. Governance
17. Operations Overview
18. Task Center
19. Queue Center
20. Job Monitor
21. Notification Center

## Global QA Checklist

For every page:

- Page loads without console errors.
- Sidebar active state is correct.
- Topbar title/description updates correctly.
- Page has clear purpose.
- Primary action is obvious.
- Secondary actions are not confusing.
- Buttons do not imply unavailable execution.
- AI actions are review/preparation/handoff only.
- Route buttons navigate correctly.
- Disabled future mutations remain disabled.
- No visual overflow on desktop.
- No broken cards/panels.
- No duplicate obvious section headers.
- No old placeholder “Section 1 / Section 2” language remains where already patched.
- Empty states are clear.
- Loading states are clear.
- Error states are clear.
- Mobile/sidebar scroll should be checked separately.

## Authority-Specific QA

### Setup

- Local draft is visually distinct from backend Save Setup.
- Business template does not imply backend persistence until Save Setup.
- AI fill actions are local suggestions only.
- Continue buttons are route/navigation only.

### Library

- Upload is explicit.
- Source-of-truth marking is not confused with Governance approval.
- Approve for use is not confused with publishing.
- Soft-delete is not confused with physical delete unless backend says so.
- AI source handoff is clearly AI context only.

### AI Command

- Composer works.
- Specialist selection works.
- Tool Drawer opens/closes.
- Source-required warning is clear.
- Library source return flow works.
- AI output does not imply publish/approve/send/execute.

### Publishing

- Schedule/manual completion/fail/approval boundaries are clear.
- Asset blockers are visible.
- Publishing does not imply external provider publishing unless backend contract is explicit.

### Settings / Governance

- Settings save is confirmation-gated.
- Governance decisions are confirmation-gated.
- Policy authority remains clear.
- Approval decisions do not imply direct publishing.

### Operations

- Task/Queue/Job mutation buttons remain disabled.
- Notification Mark Read is read-state only.
- Governance decision from Notification Center is confirmation-gated.
- Operations Overview routes only.

## Evidence To Capture

For each page, record:

- Page URL/hash.
- Visual status: pass / issue.
- Console status: pass / issue.
- Interaction status: pass / issue.
- Authority clarity: pass / issue.
- Notes.
- Screenshot reference if available.

## Final Output

Create a QA report:

- `FINAL_FRONTEND_BROWSER_QA_REPORT.md`

The report should classify issues as:

- P0: broken navigation or runtime error
- P1: authority confusion / unsafe wording
- P2: major UX/layout issue
- P3: minor polish
- P4: future enhancement

## Recommended After QA

Only after QA:

1. Fix P0/P1 issues first.
2. Apply narrow copy guards where authority confusion exists.
3. Apply low-risk UX polish page-by-page.
4. Create a design-system consolidation audit before CSS cleanup.
5. Run browser QA again after every production patch.

