# STEP 12 - Authority-Adjacent Action Label Audit

Date: 2026-05-13
Scope: Documentation-only UX/doctrine audit (no production code changes)
Branch context: architecture/frontend-consolidation-v1

## 1) Executive Summary

This Step 12 audit reviewed authority-adjacent, ambiguous, destructive, and backend-controlled action labels across the Control Center rollout surfaces before any wording cleanup or UX rollout.

Primary outcome:
- The highest risk is not hidden backend bypass; it is operator misunderstanding caused by labels that do not clearly state destination, authority path, or mutation scope.
- Navigation labels are usually acceptable when they explicitly name the destination workspace.
- Backend mutation labels remain the most sensitive category and need wording that makes backend authority legible.
- Destructive labels already exist in Library and in deferred Operations Center controls; those should not be enabled or standardized casually.

Audit decision:
- No code changes in this step.
- Treat this as the wording-risk inventory and replacement-language baseline before any label patching.

## 2) Files Inspected

Doctrine references used for classification
- audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md
- audits/frontend/master/ACTION_DESTINATION_MAP.md
- audits/frontend/master/PAGE_BLUEPRINTS.md

Primary execution and authority-adjacent surfaces
- public/control-center/pages/workflows.js
- public/control-center/pages/publishing.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/governance.js
- public/control-center/pages/settings.js
- public/control-center/pages/library.js
- public/control-center/pages/integrations.js
- public/control-center/pages/operations-centers.js

Adjacent routing and workspace surfaces
- public/control-center/pages/campaign-studio.js
- public/control-center/pages/content-studio-workspace.js
- public/control-center/pages/media-studio-workspace.js
- public/control-center/pages/ads-manager.js
- public/control-center/pages/insights.js
- public/control-center/pages/research.js
- public/control-center/pages/setup.js
- public/control-center/pages/home.js

Shared shell validation surfaces
- public/control-center/app.js
- public/control-center/router.js

## 3) High-Risk Label Inventory

### A) Workflows
- Run Full Automation
- Run Step-by-Step
- Start Auto Mode From Plan
- Approve and Continue
- Run Workflow
- Run
- Start Workflow

Why high risk:
- These labels sit on orchestration surfaces that can create tasks, handoffs, plans, workflow runs, and downstream execution state.
- Several labels do not reveal whether the action navigates, starts a backend workflow, or only advances a gated local flow.

### B) Publishing
- Publish
- Approve
- Fail
- Auto Prepare
- Auto Approve
- Auto Skip

Why high risk:
- These labels are attached to backend-controlled publishing mutations or gated publishing flows.
- Short verbs hide whether the action requests backend mutation, records review state, or advances only a local plan.

### C) Governance
- Approve
- Reject
- Request Changes
- Escalate
- Override
- Save Governance Policy
- Sync Settings Rules

Why high risk:
- These labels operate on approval state and policy state, both of which are authority-adjacent and durable.
- Override in particular needs explicit provenance because it implies exceptional authority.

### D) Settings
- Save Settings
- Auto-run trusted actions
- Act unless blocked by policy
- Auto sync
- Refresh defaults

Why high risk:
- Settings is a policy editor and team/governance bridge, not a neutral preferences page.
- Terse automation wording can imply broader autonomous authority than the backend model actually permits.

### E) Library
- Archive
- Soft-delete
- Classify Assets
- Extract Docs
- Upload Asset
- Save

Why high risk:
- Library contains destructive and mutation-capable actions on project assets.
- Archive and Soft-delete are dangerous-action labels and must not read as harmless housekeeping.

### F) Integrations
- Sync
- Fix connection
- Reconnect
- Run diagnostics
- Open setup

Why high risk:
- These labels can imply refresh-only behavior when they actually request backend integration or health operations.
- Sync is especially overloaded because it can mean inspect state, test connection, or run data movement.

### G) Content / Media / Route handoff surfaces
- Generate Draft
- Improve
- Translate / Adapt
- Approve
- Reject
- Regenerate
- Save to Library
- Start Media Job
- Generate Output
- Send to Publishing if ready
- Make brand-safe

Why high risk:
- These labels combine AI actions, local draft persistence, review decisions, Library mutations, and Publishing handoffs in the same workspace.
- Some are acceptable intent labels, but several still hide whether the action is AI-only, local-only, backend-backed, or downstream routing.

## 4) Ambiguous Label Inventory

Labels judged ambiguous because they fail doctrine expectations for explicit destination or authority path:

- Workflows: Run, Run Workflow, Start Workflow, Approve and Continue
- Publishing: Approve, Publish, Fail, Auto Prepare
- Governance: Approve, Reject, Override, Refresh
- Settings: Save Settings, Auto sync, Refresh defaults
- Library: Save, Refresh, Classify Assets, Extract Docs
- Integrations: Sync, Fix connection, Reconnect
- Campaign Studio: Build Campaign, Refresh Intelligence, Review Dependencies, Review Assets
- Content Studio: Improve, Approve, Reject, Regenerate
- Media Studio: Start Media Job, Generate Output, Make brand-safe, Save prompt draft
- Ads Manager: Review Creatives, Open Publishing
- Insights: Refresh insights
- Research: Save Finding, Save Block, Save Recommendation
- Setup: Run smart action, Complete now, Fix now, Validate now, Review readiness
- Home: Start campaign, Start With AI, Fix In <route>

Ambiguity pattern:
- Single-verb primaries that hide destination
- Review verbs that do not say whether they record durable state
- Save verbs that do not say local draft vs backend save
- Smart or AI verbs that do not declare whether they prepare, navigate, or run

## 5) Dangerous / Destructive Label Inventory

Currently visible or deferred dangerous-action wording:

### Active destructive surface
- Library: Archive
- Library: Soft-delete

### Deferred but audit-relevant Operations Center labels
- Delete task
- Retry item
- Approve item
- Publish item
- Remove item
- Retry job
- Cancel job
- Rerun job
- Delete job
- Acknowledge notification
- Resolve notification
- Dismiss notification
- Delete notification

Risk note:
- Even disabled labels matter now because they establish the rollout vocabulary that will later shape operator trust and confirmation design.
- Publish item and Delete job are especially risky because they compress strong authority semantics into short generic verbs.

## 6) Backend-Controlled Label Inventory

Labels currently attached to actions that are backend-controlled or should be presented as backend-authorized requests:

- Publishing: Approve, Publish, Fail, Save schedule / reschedule paths
- Governance: Approve, Reject, Request Changes, Escalate, Override, Save Governance Policy
- Settings: Save Settings when it writes governance/team policy state
- Library: Archive, Soft-delete, Upload Asset, backend-backed Save paths
- Integrations: Sync, Reconnect, Run diagnostics where connected to provider checks or backend sync
- Workflows: Run Workflow / Run Full Automation when they invoke backend workflow surfaces
- AI Command: Send to specialist mode when it results in durable backend AI execution rather than prefill-only behavior

Doctrine interpretation:
- These labels should read as requests into a backend authority boundary, not as if the frontend itself owns the mutation.

## 7) Recommended Replacement Labels Using ACTION_DESTINATION_MAP

Recommended wording rules:
- Use Navigate when the button only opens another page.
- Use Open AI when the button only opens AI Workspace or preloads a prompt.
- Use Start Workflow for true backend workflow start.
- Use Prepare Draft or Prepare Package for local composition and readiness actions.
- Use Create Task or Create Handoff when the action writes operational routing artifacts.
- Use Request Approval when frontend action is proposing a governance decision path.
- Use Run Backend Action only when the action is truly invoking a backend mutation or operation.
- Use Dangerous Action wording for destructive or irreversible operations.

Suggested replacements:

| Current label | Recommended label | Canonical type | Note |
| --- | --- | --- | --- |
| Run Full Automation | Start Workflow: Full Automation Plan | Start Workflow | Makes the execution boundary explicit. |
| Run Step-by-Step | Start Workflow: Guided Steps | Start Workflow | Reduces vague run language. |
| Start Auto Mode From Plan | Start Workflow: Auto Mode From Approved Plan | Start Workflow | Clarifies precondition. |
| Approve and Continue | Request Approval and Continue to Next Step | Request Approval | Removes execute-now implication. |
| Run Workflow | Start Workflow | Start Workflow | Canonical wording. |
| Run | Start Workflow | Start Workflow | Replace bare verb. |
| Publish | Run Backend Action: Publish Approved Item | Run Backend Action | Makes backend mutation explicit. |
| Approve | Request Approval Decision | Request Approval | Use where frontend is issuing a durable decision request. |
| Fail | Run Backend Action: Mark as Failed | Run Backend Action | Prefer descriptive failure state mutation. |
| Auto Prepare | Prepare Package: Auto Mode Plan | Prepare Package | Makes clear this is preparation, not publication. |
| Save Governance Policy | Run Backend Action: Save Governance Policy | Run Backend Action | Durable policy mutation. |
| Sync Settings Rules | Run Backend Action: Sync Settings to Governance | Run Backend Action | Explicit destination and backend target. |
| Save Settings | Run Backend Action: Save Team and Policy Settings | Run Backend Action | Removes neutral-preferences framing. |
| Archive | Dangerous Action: Archive Asset | Dangerous Action | Standard destructive taxonomy. |
| Soft-delete | Dangerous Action: Delete Asset Record | Dangerous Action | Soft-delete is implementation detail, not user-safe wording. |
| Sync | Run Backend Action: Sync Integration Data | Run Backend Action | Avoid bare Sync. |
| Reconnect | Run Backend Action: Reconnect Integration | Run Backend Action | Explicit backend action. |
| Fix connection | Open Setup: Repair Integration Connection | Navigate or Run Backend Action | Final wording depends on actual behavior. |
| Send to Publishing | Create Handoff: Send to Publishing | Create Handoff | Prefer artifact-oriented routing language. |
| Send to AI Workspace | Open AI: Send Context to AI Workspace | Open AI | Distinguishes navigate/prefill from run. |
| Save to Library | Create Handoff: Save Version to Library | Create Handoff | Better than neutral save. |
| Start Media Job | Start Workflow: Media Generation Job | Start Workflow | Clarifies execution kind. |
| Generate Output | Run Backend Action: Generate Media Output | Run Backend Action | Explicit generated backend work. |
| Send to Publishing if ready | Create Handoff: Send Approved Media to Publishing | Create Handoff | Removes conditional ambiguity. |
| Open Publishing | Navigate: Open Publishing Workspace | Navigate | Remove execution ambiguity. |
| Refresh insights | Run Backend Action: Refresh Insight Data | Run Backend Action | Only if live refresh truly invokes backend fetch. |
| Save Finding | Prepare Draft: Save Research Finding | Prepare Draft | If session/local only. |
| Save Recommendation | Prepare Draft: Save Research Recommendation | Prepare Draft | If session/local only. |
| Run smart action | Navigate to Recommended Next Step | Navigate | Current label is too opaque. |
| Complete now | Open Missing Setup Fields | Navigate | Use action that reflects actual behavior. |
| Validate now | Run Backend Action: Validate Setup Readiness | Run Backend Action or Navigate | Depends on actual implementation scope. |
| Start campaign | Navigate: Open Campaign Studio | Navigate | If no mutation occurs. |
| Start With AI | Open AI: Review Recommended Next Action | Open AI | Avoid implication of autonomous execution. |

## 8) Prioritized Patch Plan

### Phase A - Wording-only safest labels
- Convert all bare navigation labels to explicit Navigate or Open AI wording.
- Replace bare Send verbs with destination-explicit Create Handoff or Open AI wording.
- Remove ambiguous Run labels where the action is actually Start Workflow.

### Phase B - Confirmation taxonomy
- Standardize labels and follow-up confirmation copy for Request Approval, Run Backend Action, and Dangerous Action.
- Separate review/approval language from publish/mutate language in multi-step flows.

### Phase C - Backend provenance badges
- Add visible provenance near backend-controlled actions such as: Backend governed, Requires approval, or Policy-enforced.
- Distinguish local-only saves from durable backend saves across Content, Media, Setup, and AI Workspace.

### Phase D - Dangerous action confirmation review
- Audit Library destructive actions and all deferred Operations Center mutations before enabling any of them.
- Require explicit Dangerous Action copy, strong confirmation prompts, and backend audit visibility.

## 9) Files NOT To Patch Yet

Do not patch yet in this step:
- public/control-center/pages/workflows.js
- public/control-center/pages/publishing.js
- public/control-center/pages/governance.js
- public/control-center/pages/settings.js
- public/control-center/pages/library.js
- public/control-center/pages/integrations.js
- public/control-center/pages/operations-centers.js
- public/control-center/pages/campaign-studio.js
- public/control-center/pages/content-studio-workspace.js
- public/control-center/pages/media-studio-workspace.js
- public/control-center/pages/ads-manager.js
- public/control-center/pages/insights.js
- public/control-center/pages/research.js
- public/control-center/pages/setup.js
- public/control-center/pages/home.js
- public/control-center/pages/ai-command.js

Reason:
- Step 12 is audit-only and documentation-only by instruction.
- The vocabulary should be patched only after this inventory is reviewed as a single doctrine-aligned system, not file by file.

## 10) Validation Commands and Results

Commands required by step:
- git status --short
- node --check public/control-center/pages/publishing.js
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/pages/governance.js
- node --check public/control-center/pages/settings.js
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/operations-centers.js
- node --check public/control-center/pages/campaign-studio.js
- node --check public/control-center/pages/content-studio-workspace.js
- node --check public/control-center/pages/media-studio-workspace.js
- node --check public/control-center/pages/ads-manager.js
- node --check public/control-center/pages/insights.js
- node --check public/control-center/pages/research.js
- node --check public/control-center/pages/setup.js
- node --check public/control-center/pages/home.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js

Result summary:
- git status --short: ?? audits/frontend/safety/STEP_12_AUTHORITY_ADJACENT_ACTION_LABEL_AUDIT.md
- node --check public/control-center/pages/publishing.js: pass (exit 0)
- node --check public/control-center/pages/workflows.js: pass (exit 0)
- node --check public/control-center/pages/ai-command.js: pass (exit 0)
- node --check public/control-center/pages/governance.js: pass (exit 0)
- node --check public/control-center/pages/settings.js: pass (exit 0)
- node --check public/control-center/pages/library.js: pass (exit 0)
- node --check public/control-center/pages/integrations.js: pass (exit 0)
- node --check public/control-center/pages/operations-centers.js: pass (exit 0)
- node --check public/control-center/pages/campaign-studio.js: pass (exit 0)
- node --check public/control-center/pages/content-studio-workspace.js: pass (exit 0)
- node --check public/control-center/pages/media-studio-workspace.js: pass (exit 0)
- node --check public/control-center/pages/ads-manager.js: pass (exit 0)
- node --check public/control-center/pages/insights.js: pass (exit 0)
- node --check public/control-center/pages/research.js: pass (exit 0)
- node --check public/control-center/pages/setup.js: pass (exit 0)
- node --check public/control-center/pages/home.js: pass (exit 0)
- node --check public/control-center/app.js: pass (exit 0)
- node --check public/control-center/router.js: pass (exit 0)
- No syntax errors were introduced by this step (documentation-only).

## 11) Explicit No-Code-Change Statement

Step 12 delivered documentation-only authority-adjacent label auditing.
No production code behavior was modified in this step.