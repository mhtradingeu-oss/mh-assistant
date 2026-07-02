# PHASE 3X.2 — Workflows Execution / Automation Safety Audit

## Status
Audit-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3X.1 — Workflows Finalization Truth Audit`
- Previous commit: `b8cde0e Add Workflows finalization truth audit`

## Purpose
Determine what Workflows actions actually do before any browser QA, copy patch, UI patch, or closeout.

Workflows is high-risk because it includes:
- backend workflow run helpers
- AI workflow run helpers
- external event bridge
- automation-engine integration
- auto mode controls
- auto approve / auto skip controls
- AI Command handoffs
- Task Center handoffs
- Publishing route hints
- Governance gate implications

## Audit Questions
For every Workflows action, determine:
- Is it UI-only?
- Does it update local session state?
- Does it write localStorage?
- Does it create a shared handoff?
- Does it persist a handoff through backend?
- Does it call workflow backend run APIs?
- Does it use automation-engine?
- Does it start/pause/resume/stop auto mode?
- Does it approve or skip a gate?
- Does it affect Publishing or Governance?
- Does it require confirmation?
- Does wording match actual behavior?

## Required Output
This phase must produce:
- Workflows action-risk matrix.
- Active surface versus preserved helper evidence.
- API/backend route evidence.
- Automation-engine evidence.
- Governance/Publishing boundary evidence.
- Recommendation for next phase.

## Safety Rules
- Do not change Workflows code.
- Do not change automation-engine code.
- Do not change API/backend code.
- Do not change CSS.
- Do not run mutating Workflows actions in browser.
- Do not trigger `mh:submit-workflow`.
- Do not start auto mode.
- Do not approve/skip automation gates.
- Do not claim Workflows execution is safe unless evidence proves it.
