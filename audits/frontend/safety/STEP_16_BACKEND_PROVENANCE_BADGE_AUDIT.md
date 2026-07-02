# STEP 16 - Backend Provenance Badge Audit

Date: 2026-05-13
Mode: Audit-only (documentation-only)
Branch: architecture/frontend-consolidation-v1

## 1. Executive Summary

This audit maps where provenance/safety badges or inline hints should appear before any future UX work on backend-controlled or authority-adjacent actions.

Findings:
- High-impact actions are broadly present across Publishing, Workflows, Governance, Settings, Library, Integrations, Operations Centers, Media Studio, Content Studio, Campaign Studio, and AI Command.
- Backend authority is explicit in API wrappers and server endpoints, but frontend provenance visibility is inconsistent.
- Governance and publishing policy gates exist in backend defaults and enforcement paths, yet equivalent frontend provenance badges are not consistently surfaced.
- Destructive and approval-gated actions should remain unpatched until confirmation/provenance implementation is explicit and standardized.

Outcome:
- Safe to proceed only with tiny, copy-only provenance hints on non-mutating surfaces.
- Not safe to patch labels for backend mutation verbs, approval decisions, publishing execution, destructive actions, or workflow execution controls.

## 2. Provenance Badge Taxonomy

- Context only:
  - Route/prompt context transfer only; no backend mutation.
- Draft only:
  - Local or draft-state preparation only; no execution side effect.
- Backend enforced:
  - Action issues a backend request that mutates durable state.
- Policy controlled:
  - Action behavior governed by backend policy rules.
- Requires approval:
  - Action is blocked or gated until approval state is satisfied.
- External effect possible:
  - Action can produce outward execution impact (publish/sync/send).
- Dangerous action:
  - Irreversible or high-risk destructive/admin override action.
- Deferred / disabled:
  - Control intentionally non-operational pending safety pass.
- Source of truth:
  - Marks canonical authority record/value used downstream.

## 3. Badge Decision Rules

- Badge required:
  - Any control that calls backend mutation wrappers in api.js.
  - Any action potentially affecting external destinations.
  - Any action mapped to policy_rules or approval gates.

- Inline hint enough:
  - Context-only AI route open.
  - Draft-only local preparation with no backend mutation.
  - Read-only status/diagnostic panels.

- Modal confirmation needed:
  - Dangerous action (archive/delete/irreversible).
  - External effect action with high impact and immediate execution.
  - Approval/policy override pathways.

- No badge needed:
  - Pure navigation to non-mutating view without implied execution.

## 4. Per-Page Badge Candidates Table

| Page | Action/Area | Current label/copy | Authority owner | Recommended badge | Step 14 confirmation level | Patch priority | Safe to patch next |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Publishing | AI context route | Open AI: Send Context to AI Workspace | Frontend projection (context handoff) | Context only | A/B | Low | Yes |
| Publishing | Publish queue execution controls | Approve / Mark Failed / Auto Prepare Publishing / Approve and Continue | Backend enforced + policy controlled | Backend enforced + Requires approval + External effect possible | D/E/F | Critical | No |
| Publishing | Schedule/reschedule flow | Schedule + time controls + queue actions | Backend enforced | Backend enforced + External effect possible | C/D/F | High | No |
| Workflows | Manual workflow run | Run Workflow / Run / Run Full Automation / Run Step-by-Step | Backend enforced | Backend enforced | C/F | High | No |
| Workflows | Auto gate actions | Approve and Continue / Skip Step | Policy controlled + requires approval | Requires approval + Policy controlled | E/F | Critical | No |
| Workflows | Recommendation save draft text | Save Draft / Recommendation saved | Mixed local + durable | Draft only (if local-only) or Backend enforced (if persisted) | B/C/F | Medium | Conditional |
| Governance | AI open/prompt assist | Open AI: Review in AI Workspace | Frontend projection (route/prompt) | Context only | A/B | Low | Yes |
| Governance | Approval decisions | Approve / Reject / Escalate / Override | Backend enforced + policy controlled | Requires approval + Policy controlled | E/F | Critical | No |
| Governance | Governance policy persistence | Save policy / Sync settings | Backend enforced + policy controlled | Policy controlled + Backend enforced | D/F | Critical | No |
| Settings | Durable settings save | Save all settings/policy/team | Backend enforced + policy controlled | Backend enforced + Policy controlled | D/F | High | No |
| Settings | Read-only policy summaries | Explanatory summaries in settings cards | Frontend projection | Context only | A | Low | Yes |
| Library | Source authority toggle | Source-of-truth update controls | Backend enforced | Source of truth + Backend enforced | C/F | High | No |
| Library | Archive/delete asset | Archive / Delete | Backend enforced (destructive) | Dangerous action | G/F | Critical | No |
| Library | Non-destructive metadata update | Rename/status updates | Backend enforced | Backend enforced | C/F | Medium | No |
| Integrations | Connect/reconnect/sync/import/disconnect | Connect / Reconnect / Sync / Import / Disconnect | Backend enforced + external effect possible | Backend enforced + External effect possible | C/D/F | High | No |
| Integrations | AI diagnostics prompt route | Prompt to AI Command | Frontend projection | Context only | A/B | Low | Yes |
| Operations Centers | AI open/prompt route | Open AI: Review in AI Workspace / prompt chips | Frontend projection | Context only | A/B | Low | Yes |
| Operations Centers | Deferred mutation controls | Deferred action labels (disabled) | Safety-locked (deferred) | Deferred/disabled | H | Critical | No |
| Operations Centers | Mark read / queue triage mutation | Mark read + operational updates | Backend enforced | Backend enforced | C/F | Medium | No |
| Media Studio | Generate media job | Generate / Start media job | Backend enforced | Backend enforced | C/F | High | No |
| Media Studio | Route handoff actions | Send to publishing / create handoff/task | Backend enforced | Backend enforced + External effect possible | C/D/F | High | No |
| Media Studio | AI context route | Send to AI command | Frontend projection with context payload | Context only | A/B | Low | Yes |
| Content Studio | Approve/reject/version state | Approve / Reject / Regenerate / Save draft | Mixed local/backend | Requires approval or Draft only depending path | B/E/F | High | No |
| Content Studio | Handoff to other pages | Send to publishing/media handoff | Backend enforced | Backend enforced + External effect possible | C/D/F | High | No |
| Content Studio | AI prompt route | AI prompt routing actions | Frontend projection | Context only | A/B | Low | Yes |
| Campaign Studio | Campaign save and routing | Save campaign / route handoff actions | Backend enforced | Backend enforced | C/F | High | No |
| Campaign Studio | Planning-only sections | Plan/wave review blocks | Frontend projection | Context only | A | Low | Yes |
| AI Command | Command prepare/prefill | Command prepared / draft saved | Frontend projection | Context only | A/B | Low | Yes |
| AI Command | Durable execute path | Execute/run command semantics | Backend enforced + external effect possible | Backend enforced + External effect possible | C/D/F | Critical | No |

## 5. Page-by-Page Candidate Notes

### Publishing
- Route/context candidate: AI context push control.
- Not safe: publish/approve/fail/schedule/reschedule/auto-mode gate controls.

### Workflows
- Not safe: run and auto-mode controls due backend execution and approval gates.
- Conditional-only: local draft messaging where true local-only behavior is explicit.

### Governance
- Safe: AI open/prompt assist context hints.
- Not safe: decision and policy mutation controls.

### Settings
- Safe: read-only explanatory context copy.
- Not safe: save/policy mutation semantics.

### Library
- Not safe: archive/delete/source-of-truth mutation labels.
- Safe: read-only explanatory copy around provenance concepts only.

### Integrations
- Safe: context-only diagnostics prompt route hints.
- Not safe: connect/reconnect/sync/import/disconnect action labels.

### Operations Centers
- Safe: AI context-only panels.
- Not safe: deferred mutation labels and active mutation controls.

### Media Studio
- Safe: context-only AI routing hints.
- Not safe: generate/create task/handoff/send-to-publishing semantics.

### Content Studio
- Safe: context-only AI routing hints.
- Not safe: approval/reject/handoff/save-library mutation labels.

### Campaign Studio
- Safe: planning context hints in non-mutating areas.
- Not safe: save/route/handoff mutation semantics.

### AI Command
- Safe: prefill/draft/prepare context hints.
- Not safe: durable execute semantics or publish-now style outcomes.

## 6. Backend Evidence

### Frontend API wrappers (public/control-center/api.js)
- fetchProjects: line 1005
- fetchAllCoreProjectData: line 1029
- fetchProjectOperations: line 1315
- saveProjectSetup: line 1358
- setProjectAssetSourceOfTruth: line 1426
- archiveProjectAsset: line 1443
- deleteProjectAsset: line 1460
- runProjectWorkflow: line 1477
- runProjectAiWorkflow: line 1494
- executeProjectAiCommand: line 1511
- createProjectTask: line 1524
- createProjectApproval: line 1549
- decideProjectApproval: line 1574
- updateProjectGovernancePolicy: line 1621
- connectProjectIntegration: line 1686
- reconnectProjectIntegration: line 1703
- syncProjectIntegration: line 1737
- disconnectProjectIntegration: line 1771
- savePublishingSchedule: line 1788
- reschedulePublishingItem: line 1801
- approvePublishingItem: line 1818
- publishPublishingItem: line 1835
- failPublishingItem: line 1852
- saveProjectCampaign: line 1961
- createProjectHandoff: line 2162

### Backend endpoints (runtime/orchestrator-service/server.js)
- /media-manager/project/:project/startup: line 10348
- /media-manager/project/:project/assets/:assetId/archive: line 10624
- /media-manager/project/:project/assets/:assetId/delete: line 10652
- /media-manager/project/:project/operations: line 10754
- /media-manager/project/:project/workflows/:workflowId/run: line 11133
- /media-manager/project/:project/ai/command: line 11283
- /media-manager/project/:project/ai/workflows/:workflowId/run: line 11285
- /media-manager/project/:project/tasks (GET/POST): lines 11323, 11325
- /media-manager/project/:project/approvals (GET/POST): lines 11404, 11406
- /media-manager/project/:project/approvals/:approvalId/decision: line 11408
- /media-manager/project/:project/governance: line 11452
- /media-manager/project/:project/governance/policy (GET/POST): lines 11454, 11456
- /media-manager/project/:project/handoffs (GET/POST): lines 11549, 11551
- /media-manager/project/:project/sources (POST): line 11599
- /media-manager/project/:project/integrations/control-center: line 11757
- /media-manager/project/:project/integrations/:integrationId/connect: line 11760
- /media-manager/project/:project/integrations/:integrationId/reconnect: line 11772
- /media-manager/project/:project/integrations/:integrationId/sync: line 11792
- /media-manager/project/:project/integrations/:integrationId/disconnect: line 11808
- /media-manager/project/:project/publishing/schedule: line 11818
- /media-manager/project/:project/publishing/:jobId/reschedule: line 11884
- /media-manager/project/:project/publishing/:jobId/ready: line 11942
- /media-manager/project/:project/publishing/:jobId/publish: line 11986
- /media-manager/project/:project/publishing/:jobId/fail: line 12050

### Governance/authority defaults (runtime/orchestrator-service/lib/ops/backbone.js)
- DEFAULT_POLICY_RULES: lines 20-26
  - approval_before_publish
  - high_risk_claim_review_required
  - brand_safety_review_required
  - allow_admin_override
  - auto_escalate_critical_risk
  - freeze_publishing
- approval_required_actions: line 845
- execution_policy and audit logging: lines 847-850
- policy normalization merge with defaults: lines 1184-1205
- publish freeze and approval enforcement paths: lines 1344, 1452, 1460

### Missing provenance surface noted
- Multiple backend mutation controls still lack explicit frontend provenance badges (backend enforced/policy controlled/requires approval/external effect possible), especially in publishing/workflows/integrations/settings and destructive library actions.

## 7. Items Safe For Next Tiny Patch

Safe candidates (copy-only or static hint-only, no handler changes):
- Add static "Context only" hint text in existing AI helper panels where controls only route/prefill AI.
- Add static "Draft only" hint text in clearly local-only draft sections where no backend call is triggered.
- Add static "Deferred / disabled" explanatory hint adjacent to already-disabled mutation controls in Operations Centers (without changing those labels).
- Add static read-only "Policy controlled by backend" helper text in Governance/Settings informational sections (not action buttons).

## 8. Items NOT Safe To Patch Yet

- Any label tied to backend mutation verbs in publishing/workflows/governance/settings/integrations/library.
- Destructive actions (archive/delete) pending confirmation/badge standard completion.
- Publishing and workflow execution controls until confirmation/provenance model implementation is explicit in UI.
- Any change requiring backend audit-log fields or provenance source fields that are not yet visibly surfaced to frontend payloads.

## 9. Recommended STEP 17 Scope

Recommended option: A. copy-only provenance hints.

Why this option:
- Smallest safe increment.
- No handler/API/backend dependency.
- Can improve user trust and authority clarity before badge component rollout.

Exact smallest safe patch suggestion for Step 17:
- Add 3-6 short static provenance hints in existing non-mutating panel copy areas only:
  - Context-only AI helper panels.
  - Deferred/disabled operations panels.
  - Read-only governance/settings policy explanation areas.

## 10. Validation Commands and Results

Executed exactly:
- git status --short
- node --check public/control-center/pages/publishing.js
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/pages/governance.js
- node --check public/control-center/pages/settings.js
- node --check public/control-center/pages/library.js
- node --check public/control-center/pages/integrations.js
- node --check public/control-center/pages/operations-centers.js
- node --check public/control-center/pages/media-studio-workspace.js
- node --check public/control-center/pages/content-studio-workspace.js
- node --check public/control-center/pages/campaign-studio.js
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/api.js
- node --check runtime/orchestrator-service/server.js
- node --check runtime/orchestrator-service/lib/ops/backbone.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- grep -RIn "publish\|approve\|reject\|fail\|archive\|delete\|sync\|reconnect\|connect\|disconnect\|save\|schedule\|reschedule\|run\|execute\|workflow\|auto\|approval\|governance\|policy\|handoff\|task\|generate\|media job\|queue\|backend\|source-of-truth" (target files) | sed -n '1,360p'

Results summary:
- git status --short: clean during validation run.
- All node --check validations passed (exit 0).
- Grep command executed successfully and returned expected backend-authority adjacent action anchors across all required files.

## 11. Explicit No-Code-Change Statement

Step 16 is audit-only and documentation-only.

No production code was modified.
No frontend JS behavior was modified.
No CSS was modified.
No backend code was modified.
No data/projects files were modified.
No route behavior was modified.