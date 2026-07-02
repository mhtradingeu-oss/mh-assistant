# Workflows Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

Workflows is currently listed in Page Standard REQUIRED_ROUTES, but it renders a full local workflow execution surface.

Confirmed local surface signals:

- `workflowsRoot`
- `wfexec-shell`
- `wfexec-section`
- `wfexec-overview-grid`
- `wfexec-field-grid`
- `wfexec-catalog-grid`
- `wfexec-left`
- `wfexec-right`
- `wfexec-operating-strip`

Confirmed behavior complexity:

- workflow catalog
- workflow builder / launcher
- workflow run state
- runProjectWorkflow
- runProjectAiWorkflow
- runAutomationPlan
- automation start / pause / resume / stop
- save workflow task
- workflow draft persistence
- AI Command handoff
- navigation to AI Command
- navigation to Campaign Studio
- navigation to Task Center

## Current issue

Workflows is currently both:

1. A Page Standard route
2. A full custom workflow execution surface

This creates layout authority ambiguity and possible visual shift/double surface behavior.

## Target model

Workflows should move to:

- Custom Surface Model

Required authority decision:

- add `disableStandardLayout: true` to `workflowsRoute`

## Non-goals

Do not change:

- route id
- data-page
- workflow execution behavior
- automation behavior
- AI handoff behavior
- draft persistence
- workflow catalog
- data-wf-* attributes
- API wrappers
- backend
- data/projects
- CSS in this step

## Behavior that must be preserved

- runProjectWorkflow
- runProjectAiWorkflow
- runAutomationPlan
- workflow draft persistence
- workflow catalog actions
- workflow run history
- save task behavior
- AI Command handoff
- navigation to ai-command
- navigation to campaign-studio
- navigation to task-center
- all `data-wf-*` attributes

## Recommended next patch

Workflows Authority Patch:

- add `disableStandardLayout: true` to `workflowsRoute`
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
