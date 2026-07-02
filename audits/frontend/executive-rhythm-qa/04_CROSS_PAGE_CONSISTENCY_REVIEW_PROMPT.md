# 04 — CROSS-PAGE CONSISTENCY REVIEW ONLY

## Mission
Perform a focused cross-page consistency review for the three executive rhythm pages.

This is not a code refactor.
This is not a CSS patch.
This is a UX consistency audit.

Do not modify runtime files.
Do not modify CSS.
Do not modify backend.
Do not touch data/projects.
Create only one markdown report.

## Pages to review
- public/control-center/pages/home.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/governance.js

## Context from previous cognition review
- Home is useful but too dense.
- AI Command has the strongest AI Team concept but feels compressed.
- Governance is the cleanest and closest to the executive operating rhythm.
- Final target: AI Business Operating System, not admin/debug dashboard.

## Questions to answer

1. Do the three pages use the same executive rhythm?
2. Are page headers consistent?
3. Are status/readiness cards consistent?
4. Are next-best-action sections consistent?
5. Are AI guidance sections consistent?
6. Are evidence/source sections consistent?
7. Are action buttons named consistently?
8. Are empty/loading/error states consistent?
9. Which page should become the canonical pattern?
10. What must be standardized before visual rollout?

## Required output
Create only:

audits/frontend/executive-rhythm-qa/04_CROSS_PAGE_CONSISTENCY_REVIEW.md

## Output format
Keep the report concise but useful.

Required sections:
- Executive conclusion
- Consistency score table
- Header consistency
- Status/readiness consistency
- Next best action consistency
- AI guidance consistency
- Evidence/support consistency
- Button/action naming consistency
- Canonical pattern recommendation
- Standardization checklist before rollout

## Strict limits
- Do not inspect the whole repo.
- Do not create more reports.
- Do not write more than 220 lines.
- Do not include long code excerpts.
- Be specific. Avoid generic "no issue found" language.
