# Library Operating Intelligence Layer Audit

## Status
Audit-only checkpoint.

## Purpose
Identify safe read-only intelligence tools that can be surfaced inside the Library page after CSS canonical consolidation.

## Current baseline
- Library CSS canonical consolidation is closed.
- Library visual authority is now consolidated.
- No implementation should begin before identifying available data, safe UI locations, and mutation boundaries.

## Candidate read-only tools
- Readiness Score
- Next Best Action
- Missing Assets Assistant
- Source-of-Truth Coverage
- Selected Asset Trust Status
- Suggested Destination
- AI Prompt Preview
- System Connection Strip
- Recent Activity / asset change summary if data exists

## Strict non-goals
- No backend changes.
- No API changes.
- No data/projects changes.
- No mutation handlers.
- No new execution actions.
- No auto classify implementation.
- No bulk approve/archive/delete.
- No source-of-truth automation.
- No AI extraction that writes data.

## Evidence
See:
- LIBRARY_OPERATING_INTELLIGENCE_EVIDENCE.txt

## Required decision before implementation
The next plan must define:
- which tools can be built from existing data
- where each tool should appear
- which tools are read-only only
- which tools require future backend/governance audit
- which existing selectors and handlers must remain untouched
