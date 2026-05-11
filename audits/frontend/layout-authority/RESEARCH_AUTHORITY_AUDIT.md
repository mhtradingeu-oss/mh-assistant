# Research Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Research is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local research intelligence workspace.

Confirmed local surface signals:

- researchRoot
- research-lab-wrapper
- research-overview-grid
- research-workspace-grid
- research-card-grid
- research-findings-grid
- research-opportunity-grid
- research-note-composer
- research-saved-list
- research-toolbar

Confirmed behavior complexity:

- research intelligence refresh
- fetchProjectInsights
- fetchProjectLearning
- research AI prompt handoff
- research route handoff
- createProjectHandoff
- save finding
- save reusable research block
- save recommendation
- opportunity routing
- navigation to AI Command
- navigation to Campaign Studio
- navigation to Content Studio
- navigation to SEO Workflow / Workflows
- navigation to Ads Manager
- data-research-* action attributes

## Current issue

Research is currently both:

1. A Page Standard route
2. A full custom research intelligence operating surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Research should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `researchRoute`

## Non-goals

Do not change:

- route id
- data-page
- research refresh behavior
- fetchProjectInsights behavior
- fetchProjectLearning behavior
- research note behavior
- research recommendation behavior
- AI handoff behavior
- route handoff behavior
- data-research-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- fetchProjectInsights
- fetchProjectLearning
- createProjectHandoff
- setSharedHandoff
- research AI prompt routing
- research route handoffs
- save finding
- save block
- save recommendation
- opportunity routing
- all data-research-* attributes

## Recommended next patch

Research Authority Patch:

- add `disableStandardLayout: true` to `researchRoute`
- no CSS edits
- no behavior edits
- validate JS and data/projects

## No-change confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
