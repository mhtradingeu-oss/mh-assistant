# STEP 18 - Dangerous Action Confirmation Audit

Date: 2026-05-13
Mode: AUDIT ONLY (documentation-only)
Branch: architecture/frontend-consolidation-v1

## 1. Executive Summary

This audit reviewed dangerous and backend-controlled actions across Library, Publishing, Workflows, Integrations, Governance, Settings, Media Studio, and Content Studio, then traced frontend wrappers and backend enforcement.

Key findings:
- Explicit confirmation exists in only a narrow subset of dangerous flows:
  - Library: status change (except approved), archive, soft-delete
  - Workflows: full automation and step automation start
- Most high-impact actions still execute without a dedicated confirmation step:
  - Publishing execution controls (approve, publish, fail, schedule/reschedule)
  - Governance decisions and policy saves
  - Integrations connect/reconnect/sync/disconnect
  - Media and Content approval/handoff mutations
  - Settings durable save to governance and team backend records
- Backend authority and policy enforcement are clearly present in API wrappers, server endpoints, and backbone governance rules.

Risk posture:
- Confirmation coverage is partial and inconsistent across dangerous action classes.
- External-effect actions and policy mutation actions require standardized confirmation patterns before further UX automation.

## 2. Dangerous Action Taxonomy

- Destructive action
  - Archive, soft-delete, remove from active registry/state.
- Backend-controlled mutation
  - Any UI action that writes through frontend API wrappers into orchestrator endpoints.
- Approval decision mutation
  - Approve/reject/escalate/override decision on governed entities.
- Workflow execution
  - Trigger workflow run, auto-run steps, auto mode start/resume.
- Publishing execution
  - Approve ready state, publish now, fail, schedule/reschedule.
- Policy mutation
  - Save governance policy, sync settings into governance policy, save settings to durable governance/team.
- Integration control
  - Connect/reconnect/sync/disconnect/import against external systems.
- External-effect action
  - Actions that can trigger outbound publish, provider sync, or external-state changes.

## 3. Current Confirmation Inventory

Confirmed present:

- Library confirmations
  - Set asset status (except approved): line 2216
  - Archive asset: line 2254
  - Soft-delete asset: line 2329
  - Source: public/control-center/pages/library.js

- Workflow automation confirmations
  - Run full automation plan: line 1635
  - Run next automation step: line 1665
  - Source: public/control-center/pages/workflows.js

Observed pattern quality:
- Existing confirmation copy is plain and immediate.
- No standard severity/risk template across pages.
- No explicit policy-rule echo in dialogs (for example approval_before_publish, freeze_publishing).

## 4. Missing Confirmation Inventory

No explicit confirm step detected for these high-impact actions:

- Publishing page
  - Schedule/reschedule/publish/approve/fail flows in handler block lines 1390-1565
  - Source: public/control-center/pages/publishing.js

- Integrations page
  - Connect/reconnect/disconnect/sync/import in handler block lines 1396-1525
  - Source: public/control-center/pages/integrations.js

- Governance page
  - Approval decisions and policy save/sync actions in handler block lines 920-1055
  - Source: public/control-center/pages/governance.js

- Settings page
  - Save Settings durable write path lines 1728-1795
  - Source: public/control-center/pages/settings.js

- Media Studio
  - Approve/reject/request approval/create task/send to publishing/save backend job in lines 2768-2895 and 3040-3145
  - Source: public/control-center/pages/media-studio-workspace.js

- Content Studio
  - Send to media/publishing, approve/reject version, save to backend/handoff paths in lines 2010-2225
  - Source: public/control-center/pages/content-studio-workspace.js

- Workflows gaps
  - Auto mode start/resume/approve gate/skip step and direct workflow run paths without explicit confirmation
  - Source: public/control-center/pages/workflows.js

## 5. Per-Page Dangerous Action Table

| Page | Dangerous action | Handler evidence | Current confirmation | Risk level | Confirmation status |
| --- | --- | --- | --- | --- | --- |
| Library | Set non-approved status | status action handler at line 2216 | Yes | Medium | Covered |
| Library | Archive asset | archive handler lines 2235-2264 | Yes | High | Covered |
| Library | Soft-delete asset | delete handler lines 2310-2341 | Yes | Critical | Covered |
| Library | Toggle source of truth | setProjectAssetSourceOfTruth call line 2183 | No | High | Missing |
| Publishing | Save schedule / reschedule | lines 1419-1423 | No | High | Missing |
| Publishing | Publish now | publishPublishingItem line 1481 | No | Critical (external effect) | Missing |
| Publishing | Approve publishing item | approvePublishingItem line 1519 | No | High | Missing |
| Publishing | Mark failed | failPublishingItem line 1543 | No | High | Missing |
| Workflows | Run full automation | window.confirm line 1635 | Yes | High | Covered |
| Workflows | Run step automation | window.confirm line 1665 | Yes | Medium | Covered |
| Workflows | Start/resume/approve/skip auto mode | lines 1690-1742 | No | High | Missing |
| Workflows | Run workflow backend execution | runProjectWorkflow and runProjectAiWorkflow lines 1173/1371 | No | High | Missing |
| Integrations | Connect / reconnect | lines 1434-1436 | No | High (external provider state) | Missing |
| Integrations | Disconnect | line 1457 | No | High | Missing |
| Integrations | Sync | line 1484 | No | High (external effect) | Missing |
| Governance | Approve/reject/escalate/override | decideProjectApproval line 940 | No | Critical | Missing |
| Governance | Create approval request | createProjectApproval line 972 | No | High | Missing |
| Governance | Save governance policy | updateProjectGovernancePolicy line 1014 | No | Critical (policy mutation) | Missing |
| Governance | Sync settings to governance | updateProjectGovernancePolicy line 1035 | No | Critical (policy mutation) | Missing |
| Settings | Save Settings (durable backend writes) | saveProjectTeam + updateProjectGovernancePolicy lines 1744-1745 | No | Critical (policy + team authority mutation) | Missing |
| Media Studio | Save media backend job | saveProjectMediaJob line 2376 | No | High | Missing |
| Media Studio | Approve/reject via approval decision | decideProjectApproval lines 2791 and 2859 | No | High | Missing |
| Media Studio | Request approval | createProjectApproval line 2813 | No | High | Missing |
| Media Studio | Create task | createProjectTask line 2879 | No | Medium | Missing |
| Media Studio | Send to publishing handoff | createProjectHandoff line 3106 | No | High (downstream external path) | Missing |
| Content Studio | Save content backend | saveProjectContentItem line 694 | No | High | Missing |
| Content Studio | Execute AI command for generation/adaptation | executeProjectAiCommand lines 1887 and 1997 | No | Medium/High | Missing |
| Content Studio | Send media/publishing handoff | createProjectHandoff lines 1697/1753 and send handlers 2063-2118 | No | High | Missing |
| Content Studio | Approve/reject selected version | approve/reject actions lines 2150-2161 | No | High | Missing |

## 6. Required Confirmation Copy Patterns

Recommended standardized patterns (for Step 19 implementation):

- Pattern A: Destructive
  - Title: Confirm destructive action
  - Body: This will remove active availability for this item. This action may be difficult to reverse.
  - Context tokens: item title, item id, project
  - Actions: Cancel, Confirm destructive action

- Pattern B: Publishing external effect
  - Title: Confirm publish action
  - Body: This action may send content to external channels.
  - Context tokens: channel(s), scheduled time, approval status
  - Policy echo: approval_before_publish and freeze_publishing state
  - Actions: Cancel, Confirm publish

- Pattern C: Workflow execution
  - Title: Confirm workflow execution
  - Body: This will run workflow steps that can create downstream tasks, approvals, or handoffs.
  - Context tokens: workflow id/title, execution mode
  - Actions: Cancel, Run workflow

- Pattern D: Governance decision
  - Title: Confirm governance decision
  - Body: This changes approval state and audit trail for the selected entity.
  - Context tokens: entity type/id, decision, note
  - Actions: Cancel, Confirm decision

- Pattern E: Policy mutation
  - Title: Confirm policy update
  - Body: This updates enforceable governance rules used by backend authority.
  - Context tokens: changed policy keys
  - Actions: Cancel, Save policy

- Pattern F: Integration control
  - Title: Confirm integration action
  - Body: This will perform provider-level action against an external integration.
  - Context tokens: integration name, action type (connect/reconnect/sync/disconnect/import)
  - Actions: Cancel, Confirm action

## 7. Backend Evidence (api.js / server.js / backbone.js)

Frontend API wrappers (mutation authority entry points):
- archiveProjectAsset line 1443
- deleteProjectAsset line 1460
- runProjectWorkflow line 1477
- runProjectAiWorkflow line 1494
- executeProjectAiCommand line 1511
- createProjectTask line 1524
- createProjectApproval line 1549
- decideProjectApproval line 1574
- updateProjectGovernancePolicy line 1621
- connectProjectIntegration line 1686
- reconnectProjectIntegration line 1703
- syncProjectIntegration line 1737
- disconnectProjectIntegration line 1771
- savePublishingSchedule line 1788
- reschedulePublishingItem line 1801
- approvePublishingItem line 1818
- publishPublishingItem line 1835
- failPublishingItem line 1852
- saveProjectTeam line 1935
- saveProjectContentItem line 2006
- saveProjectMediaJob line 2055
- createProjectHandoff line 2162
- Source: public/control-center/api.js

Server authority endpoints:
- assets archive/delete: lines 10624 and 10652
- team update: line 10860
- workflow run: line 11133
- ai command/workflow: lines 11283 and 11285
- tasks create: line 11325
- approvals create/decision: lines 11406 and 11408
- governance policy update: line 11456
- handoff create: line 11551
- integration connect/reconnect/sync/disconnect: lines 11760, 11772, 11792, 11808
- publishing schedule/reschedule/ready/publish/fail: lines 11818, 11884, 11942, 11986, 12050
- Source: runtime/orchestrator-service/server.js

Backbone policy enforcement:
- DEFAULT_POLICY_RULES includes approval_before_publish, allow_admin_override, auto_escalate_critical_risk, freeze_publishing: lines 20-26
- approval_required_actions includes publish and integration_reconnect: line 845
- execution policy requires rules and audit logging: lines 847-850
- publish freeze and approval enforcement checks: lines 1344, 1452, 1460
- Source: runtime/orchestrator-service/lib/ops/backbone.js

## 8. Items Safe For Next Patch

Safe candidates for Step 19 (smallest viable, behavior-preserving where possible):
- Standardize confirmation copy strings where confirm already exists:
  - Library confirm messages for status/archive/soft-delete
  - Workflow automation confirm messages for full/step execution
- Add non-invasive pre-confirm helper text near dangerous controls before modal rollout:
  - Publishing execution buttons
  - Governance policy save area
  - Integrations action controls
- Add shared confirmation copy specification document and map keys to actions before wiring UI components.

## 9. Items Not Safe Yet

Not safe without explicit design + implementation controls:
- Replacing dangerous action behavior or action ordering in Publishing, Governance, Settings, Integrations, Workflows, Media Studio, Content Studio.
- Changing backend-controlled action labels or policy semantics.
- Introducing silent auto-confirm behavior for external-effect actions.
- Altering handler logic, routes, ids, classes, or data attributes during confirmation rollout planning.

## 10. Recommended STEP 19 Scope

Recommended Step 19 option:
- Implement a minimal, standardized confirmation layer for dangerous actions beginning with highest-risk categories only.

Proposed order:
1. Publish now / approve / fail / reschedule in Publishing
2. Governance decisions and policy save/sync
3. Integration connect/reconnect/sync/disconnect
4. Settings durable save-all
5. Media and Content approval/handoff execution controls

Step 19 guardrails:
- No backend contract changes in first pass.
- No CSS refactor in first pass.
- Confirmation copy must include action, entity, and risk context.
- Keep existing handlers and wiring; insert confirm gate only.

## 11. Validation Results

Commands run for this audit evidence collection:
- grep scans for dangerous verbs and confirm usage across all specified frontend files
- targeted read of handler blocks for dangerous actions and confirmation logic
- backend authority grep scans across:
  - public/control-center/api.js
  - runtime/orchestrator-service/server.js
  - runtime/orchestrator-service/lib/ops/backbone.js
- git status --short
- git diff --stat

Audit validation outcome:
- Evidence confirms existing confirmation coverage is limited to Library and two Workflow automation prompts.
- Evidence confirms broad missing confirmation coverage in backend-controlled action paths.
- Evidence confirms backend authority and policy enforcement exist and should be reflected in confirmation copy.
- Workspace status confirms documentation-only output for this step:
  - One untracked file: audits/frontend/safety/STEP_18_DANGEROUS_ACTION_CONFIRMATION_AUDIT.md
  - No other modified or staged files in this step.

## 12. Explicit No-Code-Change Statement

Step 18 was completed as audit-only documentation.

No production frontend code was modified.
No CSS was modified.
No backend files were modified.
No data/projects files were modified.
No route behavior was modified.
No handlers were modified.
No ids, classes, or data attributes were modified.