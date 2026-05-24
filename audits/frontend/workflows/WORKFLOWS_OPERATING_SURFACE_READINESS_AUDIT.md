# Workflows Operating Surface Readiness Audit

## Purpose

Audit the Workflows page after AI Command technical acceptance.

AI Command is now technically accepted as a chat-first planning and preview surface. The next required check is whether the Workflows operating surface is ready to receive, display, or represent workflow-related outputs in a clean, scalable way.

## Scope

This audit checks:

- Workflows route and page ownership.
- Workflows rendering files.
- Workflows CSS ownership.
- AI Command to Workflows connection points.
- Draft Workflow / handoff readiness.
- UI/UX readiness.
- Duplication risk.
- Technical risks before implementation.

## Files to inspect

See generated evidence files:

- `WORKFLOWS_FILES.txt`
- `WORKFLOWS_REFERENCES.txt`
- `WORKFLOWS_AI_COMMAND_CONNECTIONS.txt`
- `WORKFLOWS_CSS_REFERENCES.txt`

## Initial questions

- Does Workflows have a dedicated page module?
- Does Workflows render from one source of truth?
- Does the router point to the correct page?
- Does AI Command route workflow previews toward Workflows?
- Are workflow actions currently real, local previews, or placeholders?
- Is the page visually consistent with the accepted operating surface pattern?
- Are there duplicate CSS layers?
- Is the page ready for AI-generated workflow outputs?

## Technical checklist

- [ ] Workflows page file exists.
- [ ] Workflows route exists.
- [ ] Workflows nav link exists.
- [ ] Workflows render function is clear.
- [ ] Workflows page passes syntax validation.
- [ ] Workflows CSS selectors are scoped.
- [ ] No obvious duplicate workflow components.
- [ ] AI Command has workflow output route or preview mapping.
- [ ] Draft Workflow preview remains local/gated.
- [ ] No backend execution is triggered automatically.

## UX checklist

- [ ] Page has a clear purpose.
- [ ] Page explains workflow status clearly.
- [ ] User can distinguish draft, active, paused, completed workflows.
- [ ] AI-generated workflow previews have an obvious destination.
- [ ] Empty state is useful.
- [ ] Main actions are not visually duplicated.
- [ ] Page follows the accepted App Shell / Operating Surface direction.

## Risks to identify

- Placeholder UI pretending to be real execution.
- Multiple competing workflow renderers.
- Workflow CSS spread across too many layers.
- AI Command generating workflow previews with no clear destination.
- Missing distinction between draft workflow and executable workflow.
- Overcrowded cards or unclear status labels.

## Current status

Pending evidence review.

## Recommendation

Do not implement changes until evidence files are reviewed.

Next step after this audit:

- Decide whether Workflows needs:
  - QA closeout only,
  - small UX polish,
  - technical connection patch,
  - or a full page operating-surface redesign.

## Evidence review result

The initial scan confirms that Workflows is a real operating surface, not a placeholder.

Confirmed:

- `public/control-center/pages/workflows.js` exists.
- `public/control-center/styles/mhos-workflow-primitives.css` exists.
- `router.js` imports and registers `workflowsRoute`.
- `index.html` includes a Workflows nav item.
- AI Command routes workflow outputs to `workflows`.
- AI Command tool-dock contains multiple tools with `frontendOwnerPage: "workflows"`.
- Workflows can consume shared handoff context via `getSharedHandoff(projectName, "workflows", operations)`.
- Workflows has local drafts, session state, workflow catalog, builder section, execution section, and automation state.

## Main risk identified

Workflows includes UI labels and controls that may imply execution:

- Run Workflow
- Run
- Run full automation
- Start automation
- Pause / Resume / Stop
- Save as Task

Before visual polish or implementation, these controls require a safety audit to confirm whether they are:

- local preview only,
- simulated execution,
- gated execution,
- or real backend/runtime mutation.

## Current technical status

Workflows is connected and non-empty, but not ready for closeout.

Status:

- Technical connection: present.
- AI Command connection: present.
- Handoff intake: present.
- UX safety clarity: needs review.
- Execution semantics: needs deep audit.
- Visual operating-surface readiness: pending browser QA.

## Recommendation

Proceed next with:

`Workflows Execution Safety & UX Semantics Audit`

Do not polish or redesign Workflows until execution behavior, gating, and button semantics are confirmed.
