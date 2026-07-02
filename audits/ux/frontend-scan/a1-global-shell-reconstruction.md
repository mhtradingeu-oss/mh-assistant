# A1 Global Shell Reconstruction

## Goal
Turn the Control Center shell into a clean international AI operating system interface.

## Current problem
The frontend has accumulated multiple UX generations:
- Command Center UX
- AI Workspace UX
- Executive Dashboard UX

This creates visual density, repeated actions, and unclear hierarchy.

## Target shell
- One minimal header
- One primary + New action
- One AI Workspace entry
- One command/AI bar shown only when needed
- Context details moved into pages instead of the global header

## Files in scope
- public/control-center/index.html
- public/control-center/app.js
- public/control-center/styles.css

## Out of scope
- Backend changes
- Route changes
- Page feature rewrites
- AI runtime changes
- Publishing/scheduler/runtime changes

## Success criteria
- Header is visually smaller
- Command bar is hidden by default
- AI Workspace is unified
- + New opens guided workflow launcher
- No syntax errors
- No page route regressions
