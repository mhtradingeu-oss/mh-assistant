# 03 — EXECUTIVE COGNITION REVIEW ONLY

## Mission
Perform a focused executive cognition review for the three current executive rhythm pages.

This is not a code refactor.
This is not a runtime audit.
This is a UX/product thinking audit.

Do not modify runtime files.
Do not modify CSS.
Do not modify backend.
Do not touch data/projects.
Create only one markdown report.

## Pages to review
- public/control-center/pages/home.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/governance.js

## Current visual observations from browser screenshots
Use these observations as QA context:
- Home is functionally useful but visually dense and still feels like an internal dashboard.
- AI Command has the strongest concept, but the conversation/output/workspace areas feel compressed.
- Governance is cleaner than Home and AI Command, but lower sections feel flat/report-like.
- The final product should feel like an AI Business Operating System, not an admin/debug panel.

## Questions to answer for each page

1. What is the page trying to help the user decide?
2. Is the page mission clear within 5 seconds?
3. Is the next best action clear?
4. Is the AI role clear?
5. Is the evidence/source/supporting data clear?
6. Is the page showing too much raw data?
7. Is the page visually calm or too dense?
8. Does it feel like an executive operating surface?
9. What should be hidden, collapsed, renamed, or promoted?
10. What is the safest UX improvement for this page?

## Required scoring
Score each page from 1 to 10 for:
- Mission clarity
- Next best action clarity
- AI guidance clarity
- Executive calmness
- Launch-ready UX

## Required output
Create only:

audits/frontend/executive-rhythm-qa/03_EXECUTIVE_COGNITION_REVIEW.md

## Output format
Keep the report concise but useful.

Required sections:
- Executive conclusion
- Page cognition score table
- Home review
- AI Command review
- Governance review
- Common cognition gaps
- Recommended canonical page rhythm
- Recommended next step

## Strict limits
- Do not inspect the whole repo.
- Do not create more reports.
- Do not write more than 220 lines.
- Do not include long code excerpts.
- Be specific. Avoid saying only "no issue found".
