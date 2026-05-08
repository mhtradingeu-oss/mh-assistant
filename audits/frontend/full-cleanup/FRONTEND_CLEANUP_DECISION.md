# FRONTEND CLEANUP DECISION

## Current Problem
The frontend still loads the legacy monolithic stylesheet:

public/control-center/styles.css

This file has thousands of lines and many duplicated systems:
- topbar
- command bar
- command backdrop
- AI dock
- cards
- workspace
- loading overlays
- responsive rules
- mobile shell rules

## Result
The modular CSS files cannot fully control the UI because the old stylesheet still contains active competing rules.

## Decision
Stop adding more override layers.

Move to controlled legacy stylesheet retirement.

## Cleanup Strategy
1. Scan all frontend files.
2. Identify which pages/components depend on old styles.css.
3. Create a temporary clean replacement stylesheet.
4. Keep styles.css as backup only.
5. Load modular CSS + clean compatibility CSS.
6. Test every main page.
7. Delete or archive legacy rules only after validation.

## Rule
Do not delete styles.css immediately.
First replace runtime load with a clean compatibility layer.
