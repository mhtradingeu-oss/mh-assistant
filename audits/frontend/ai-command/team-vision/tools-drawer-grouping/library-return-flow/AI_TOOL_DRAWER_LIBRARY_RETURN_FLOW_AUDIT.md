# AI Tool Drawer Library Return Flow Audit

## Purpose

Audit the user flow:

Tool Drawer -> Change Source -> Library -> choose source -> return to AI Command -> same drawer context continues.

## UX requirement

When a user clicks Change Source from a source-required tool:

- Library should open or focus source selection.
- User should choose a source.
- AI Command should receive the selected source.
- The Smart Tool Drawer should show the selected source.
- The user should be able to continue with Use in Composer.
- The selected tool context should not be lost.

## Current risk

The compact UX pass should not hide or break the source return flow.

## Allowed future patch

If a gap is confirmed, implement the smallest patch that restores:

- pending drawer tool identity
- pending drawer metadata
- selected source display
- return to AI Command
- drawer reopen after source selection

## Not allowed

- No new drawer system.
- No duplicate source system.
- No backend execution.
- No route behavior changes.
- No publishing/task/workflow execution.
