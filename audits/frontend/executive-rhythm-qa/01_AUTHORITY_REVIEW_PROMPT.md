# 01 — AUTHORITY REVIEW ONLY

## Mission
Perform a small read-only authority review for the MH-OS Control Center frontend.

Do not modify runtime files.
Do not modify CSS.
Do not modify backend.
Do not touch data/projects.
Create only one markdown report.

## Context
The project is MH-OS / MH Assistant.
Current goal:
- Backend owns operational authority.
- Frontend projects operational authority.
- Frontend pages must become clean operating surfaces, not competing authority layers.

## Review only these files first
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/shared-context.js
- public/control-center/state.js
- public/control-center/ui/page-standard.js
- public/control-center/pages/home.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/governance.js

## Questions to answer

1. What currently owns App Shell authority?
2. What currently owns route authority?
3. What currently owns project context?
4. What currently owns AI workspace context?
5. What currently owns page render authority?
6. Are Home, AI Command, and Governance using compatible authority patterns?
7. Are there any duplicated authority sources?
8. Which files are safe to keep as canonical?
9. Which files should not be changed in the next visual pass?
10. What is the safest next implementation step?

## Required output
Create only:

audits/frontend/executive-rhythm-qa/01_AUTHORITY_REVIEW.md

## Output format
Keep the report concise.

Required sections:
- Executive conclusion
- Authority map table
- Duplicate authority risks
- Canonical authority recommendation
- Files safe to touch next
- Files not safe to touch next
- Recommended next step

## Strict limits
- Do not inspect the whole repo.
- Do not create more reports.
- Do not write more than 180 lines.
- Do not include long code excerpts.
