# B2 Smart Launcher + New Project Wizard Architecture

## Goal
Turn the global + New button into a premium smart creation center for the AI Business Operating System.

## Why
The current launcher works, but it is still a simple modal. The product needs a global creation experience that supports projects, campaigns, content, media, publishing, approvals, workflows, and AI-guided operations.

## Problems to fix
- Tip message creates visual noise
- Close button is too large
- Launcher is too tall on mobile
- New Project is missing
- Creation options are not grouped by intent
- Current launcher is not yet a real guided workflow system

## Product principle
+ New should not be a list of buttons. It should be a guided creation surface.

## Smart Launcher Target

### Primary actions
- New Project
- New Campaign
- New Content
- New Media
- New Publishing Task
- New Approval
- Custom Workflow

### Future wizard phases
1. Choose what to create
2. Define goal
3. Select project / market / language
4. Choose channel or output type
5. Ask AI to prepare draft
6. Review
7. Save or route to workspace

## New Project Wizard v1
For now, New Project routes safely to Setup.

Future full wizard:
- Project name
- Business type
- Market
- Language
- Currency
- Website
- Channels
- Brand tone
- Goals
- Confirm and create

## Rules
- No backend changes in B2.1
- No heavy intelligence inside render
- No Auto Mode
- No new global listeners without guard flag
- Keep mobile-first behavior
- Keep launcher scrollable
- Close on X, outside click, and Escape

## Files in scope
- public/control-center/app.js
- public/control-center/styles.css

## Out of scope
- Backend project creation API
- Project database migration
- Full multi-step wizard persistence
- AI project generation backend

## Success criteria
- + New opens clean smart launcher
- New Project appears first
- Tip message removed
- Close is compact X
- Launcher closes on outside click
- Launcher closes on Escape
- Mobile layout is compact and scrollable
- No syntax errors
