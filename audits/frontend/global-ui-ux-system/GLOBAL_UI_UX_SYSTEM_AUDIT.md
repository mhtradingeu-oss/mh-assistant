# MH-OS Global UI/UX System Audit

## Status
Audit-only checkpoint.

## Purpose
Define the current truth of the Control Center UI system before applying deeper page-by-page final polish.

## Why this audit exists
Library is complete as the pilot page.
Integrations Step 1 is complete, but visual review showed system-level issues that should not be solved page-by-page in isolation:
- typography inconsistency
- card density inconsistency
- long text hierarchy issues
- drawer/context preservation needs
- button hierarchy inconsistency
- color/token drift
- repeated panel patterns
- page-specific styling drift

## Scope
- public/control-center/styles/
- public/control-center/pages/
- public/control-center/app.js
- completed Library and Integrations audit references

## Questions
- What global typography rules currently exist?
- Which colors and surface tokens are actually used?
- Which card/panel/drawer patterns repeat across pages?
- Which button/action patterns should be standardized?
- Which feedback patterns exist?
- How should selected state and drawer close behavior work globally?
- Which pages use custom operating surfaces?
- What reusable UI rules should guide every page from now on?

## Non-goals
- No production CSS changes.
- No production JS changes.
- No page implementation changes.
- No backend changes.
- No API changes.
- No data changes.

## Evidence
See:
- GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt

## Expected next step
Create a Global UI/UX System Plan defining:
- typography scale
- spacing scale
- card density
- panel/drawer rules
- action hierarchy
- feedback rules
- selected-state rules
- AI guidance rules
- per-page upgrade checklist
