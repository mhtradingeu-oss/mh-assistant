# Research Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Research route authority only

## Summary

Research is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `researchRoute`.

## Why

Research owns a complete research intelligence workspace:

- researchRoot
- research-lab-wrapper
- research-workspace-grid
- research note composer
- research saved findings
- AI prompt handoffs
- route handoffs
- opportunity routing

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/research.js
- audits/frontend/layout-authority/RESEARCH_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: research
- data-page="research"
- researchRoot
- research-lab-wrapper
- research refresh behavior
- fetchProjectInsights
- fetchProjectLearning
- createProjectHandoff
- saved findings
- saved blocks
- saved recommendations
- data-research-* attributes
- AI Command handoff
- route handoffs

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
