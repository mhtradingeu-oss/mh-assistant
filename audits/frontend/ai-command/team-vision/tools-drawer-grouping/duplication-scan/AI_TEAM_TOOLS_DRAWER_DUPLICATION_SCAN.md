# AI Team Tools Drawer Duplication and Prior Attempts Scan

## Purpose

Before changing the AI Command tools drawer, this scan checks for duplication, prior attempts, existing ownership, and CSS/JS overlap.

## Rule

Do not create a new tools system.

Improve the existing system only if the scan confirms the safest ownership point.

## Items checked

- tool-dock.js ownership
- AI Command canonical tools
- Smart Tool Dock
- Smart Tool Drawer
- source-required logic
- drawer CSS layers
- prior audit/patch files
- duplicate function definitions
- repeated CSS blocks or competing selectors

## Expected decision

After this scan, decide one of:

1. Documentation-only closeout.
2. CSS/label-only polish.
3. Small grouping logic patch inside existing render functions.
4. Source-required UX polish.
5. No action if duplication risk is too high.

## Safety

No backend changes.
No routing changes.
No durable task creation.
No workflow execution.
No publishing execution.
No CRM/customer mutation.
No governance approval execution.
