# MH-OS Global UI/UX System Plan

## Status
Plan-only checkpoint before global or page-level implementation.

## Baseline
- 07760fb Add global UI UX system audit
- 0e3ce52 Add Library final closeout
- a481599 Add Integrations step 1 closeout

## Purpose
Define one global UI/UX operating standard for MH Assistant OS before continuing deeper page-by-page upgrades.

## Why this is required
Library and Integrations proved that page-by-page polish works, but also exposed system-level design needs:
- typography consistency
- card density consistency
- button hierarchy consistency
- drawer/context preservation
- selected state behavior
- feedback/message behavior
- AI Guidance pattern
- badge/color usage
- compact operating-surface layout

The goal is to stop isolated page patching and move to one repeatable MH-OS design language.

## Global Page Structure Standard

Each major page should follow this model unless there is a documented reason not to:

1. Header / Context Bar
   - page title
   - project/context
   - global actions only

2. Executive Summary / Readiness Strip
   - compact metrics
   - readiness/gaps
   - next recommended action

3. Main Workspace
   - primary data/cards/table/grid
   - scan-friendly content
   - no long repeated explanations

4. Right Action / Decision Rail or Drawer
   - selected item context
   - primary actions
   - secondary actions
   - danger zone if needed
   - technical details only when useful

5. AI Guidance
   - recommended next step
   - why it matters
   - suggested destination
   - no duplicated action buttons

6. Feedback Surface
   - compact message after user actions
   - success/error/warning/info
   - no silent clicks

## Typography Standard

Use one consistent scale:

- Page title: 15–17px, strong weight
- Section title: 13–15px
- Card title: 12.5–14px
- Body text: 12–13px
- Metadata: 11–12px
- Badge text: 10–11px
- Button text: 11–12px
- Eyebrow text: 10–11px uppercase, controlled letter spacing

Rules:
- Avoid oversized headings inside dense operating pages.
- Avoid tiny unreadable text below 10px except decorative badges.
- Keep line-height readable: 1.25–1.45 depending on density.
- Do not define random page-specific font sizes unless documented.

## Color / Surface Standard

Use existing global tokens where possible:
- dark operating background
- subtle elevated surfaces
- clear border contrast
- controlled accent color
- no neon overuse
- danger separated visually
- success/warning/danger badges consistent across pages

Rules:
- Avoid raw white backgrounds inside dark pages.
- Avoid page-specific color drift.
- Avoid heavy gradients unless used as global operating-surface language.
- Use consistent selected/focused/active states.

## Card Density Standard

Cards should be compact and scannable.

Each card/row should prioritize:
- title
- status
- one short metadata line
- one primary action
- optional secondary actions

Avoid:
- paragraph-heavy cards
- repeated full paths
- repeated diagnostics
- all buttons having equal weight
- cards taller than needed

## Button Hierarchy Standard

Every page should use consistent action hierarchy:

### Global Actions
Examples:
- Refresh
- Run diagnostics
- Open AI Workspace
- New

Location:
- header/top utility only

### Primary Item Action
One clear main CTA per selected item/card.

### Secondary Actions
Useful but visually quieter:
- Copy
- Test
- Sync
- Rename
- Review

### Dangerous Actions
Separated:
- Delete
- Archive
- Revoke
- Disconnect

Rules:
- Do not show the same action in multiple places with equal weight.
- Do not make every button visually primary.
- Every action should explain itself with feedback.

## Drawer / Panel Behavior Standard

Drawer/panel UX must preserve user context.

Rules:
- Opening a drawer should keep selected item highlighted.
- Closing a drawer should not lose scroll position.
- Closing should return focus/context to the originating item when safe.
- Drawer title should clearly identify selected item.
- Drawer should show requirements/details/actions in predictable order.
- Escape/backdrop/close button should all behave consistently.
- No drawer should hide important feedback.

Required drawer structure:
1. Selected item summary
2. Status / readiness
3. Requirements / fields / validation
4. Primary action
5. Secondary actions
6. Technical details if needed

## Feedback Standard

Every meaningful click should show feedback.

Actions requiring feedback:
- open setup/drawer
- close drawer
- select item
- copy path
- test connection
- sync
- connect/reconnect
- approve/review
- archive/delete
- AI prompt/routing actions
- diagnostics

Message types:
- info
- success
- warning
- error

Rules:
- No silent action.
- Feedback must not imply backend success if only frontend routing happened.
- Feedback should be compact and user-facing.
- Errors should be specific and actionable.

## Selected State Standard

Every page with selectable items should provide:
- visible selected state
- selected item summary
- preserved context after actions
- clear relation between selected item and action panel/drawer

Rules:
- Do not allow the user to lose context after closing a drawer.
- Do not duplicate selected item labels excessively.
- Keep selected item status visible.

## AI Guidance Standard

AI Guidance should not be decorative.

It should show:
- Recommended next step
- Why it matters
- What risk/gap remains
- Suggested destination/page
- Ask AI action where appropriate

Avoid:
- repeating every action button
- generic “AI can help” text
- internal architecture language

## Per-Page Upgrade Checklist

Every page upgrade must follow:

1. Page Truth Audit
2. Duplicate UI + Feedback Audit
3. Implementation Plan
4. Small Safe Patch
5. Terminal Validation
6. Browser QA
7. Commit
8. Closeout

No page should go directly to visual implementation without audit and plan.

## Integrations Step 2 Requirements

Use this global plan to guide Integrations Step 2:

- smaller connector cards/rows
- cleaner text hierarchy
- preserve scroll position after drawer close
- keep selected connector highlighted
- compact requirements display
- drawer requirements/details/actions order
- global typography alignment
- consistent button hierarchy
- no raw white strips
- no long repeated diagnostics inside cards

## Non-goals
This plan does not implement production changes.
No CSS/JS/backend/API/data changes are made by this document.

## Next step
Create a Global UI/UX System Closeout or proceed to:
Integrations Step 2 Context Preservation + Compact Card Plan.
