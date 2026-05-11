# Workflows Authority Patch Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Workflows route authority only

## Summary

Workflows is now explicitly marked as a Custom Surface Model route.

The patch adds:

- `disableStandardLayout: true`

to `workflowsRoute`.

## Why

Workflows owns a complete execution workspace:

- workflowsRoot
- wfexec-shell
- workflow catalog
- workflow builder / launcher
- execution status/result
- automation controls
- AI handoff actions

Keeping it inside Page Standard wrapping created layout authority ambiguity.

## Files changed

- public/control-center/pages/workflows.js
- audits/frontend/layout-authority/WORKFLOWS_AUTHORITY_PATCH_AUDIT.md

## Behavior preserved

No behavior changes were made.

Preserved:

- route id: workflows
- data-page="workflows"
- workflowsRoot
- wfexec-shell
- data-wf-* attributes
- runProjectWorkflow
- runProjectAiWorkflow
- runAutomationPlan
- workflow draft persistence
- workflow catalog actions
- AI Command handoff
- navigation to ai-command
- navigation to campaign-studio
- navigation to task-center

## No-change confirmation

No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
No page-standard.js changed.
No index.html changed.
