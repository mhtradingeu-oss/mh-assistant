# T164D Step 1 — AI Command Real UI Source Scan

## Status
Evidence scan only. No implementation.

## Purpose
Inspect the current AI Command source before any UI visibility patch.

## Scope
Checked:
- AI Command page source
- Tool Dock source
- shared handoff/source context
- backend team model authority
- app/router syntax
- server syntax

## Decision Gate
No patch should be applied until this scan is reviewed.

## What the next review must decide
- exact insertion point for AI Team State Bar
- whether an existing team/status strip can be upgraded instead of adding a duplicate
- whether Flow/Output tabs already provide a safe place for workflow visibility
- whether risk/governance/source/destination chips already exist and only need clearer wording
- first safe UI-only patch target
