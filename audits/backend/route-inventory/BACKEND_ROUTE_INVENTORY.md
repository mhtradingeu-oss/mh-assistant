# Backend Route Inventory and Legacy Classification

Date: 2026-05-11

Branch: `architecture/frontend-consolidation-v1`

Doctrine:

- Backend owns operational authority.
- Frontend projects operational authority.

This audit is documentation-only. No backend route was removed, renamed, or behaviorally changed.

## Scope

Inspected:

- `runtime/orchestrator-service/server.js`
- `public/control-center/api.js`
- `public/control-center/pages/*.js`
- `public/control-center/app.js` only where it directly probed route usage
- `runtime/orchestrator-service/package.json`
- `scripts/*` where route usage was referenced by verification scripts

Notes:

- There is no root-level `package.json`; the service package manifest is `runtime/orchestrator-service/package.json`.
- Route usage is marked `not found` when no direct usage was found in the inspected frontend files. That does not prove absence of external, script, or manual consumers.
- `/public/media-manager/...` aliases are registered and protected, but no direct current `api.js` or `pages/*.js` usage was found in this branch.

## Global Middleware Baseline

These are app-wide middleware registrations rather than endpoint routes, but they define route protection and slug safety.

| Line | Middleware | Current role |
| --- | --- | --- |
| 252 | `requireProtectedControlWriteKey` | Protects `POST`/`PATCH`/`DELETE` `/media-manager/...`, `/public/media-manager/...`, and selected legacy write routes. |
| 312 | `requireProtectedReadKey` | Protects sensitive `GET` routes including media-manager project reads, `/public/api/...`, `/media/file/...`, `/today`, `/next`, and product legacy reads. |
| 379 | `applyRouteRateLimit` | Applies route-specific throttling for `/telegram-command` and paths containing `/ai`. |
| 809 | `validateRawProjectSlugPathSegment` | Rejects traversal/separator project slugs in raw route path segments. |
| 811 | `app.param('project')` | Normalizes and validates `:project` route params. |
| 842 | `validateOptionalProjectSlugFields` | Normalizes optional `project` fields in body/query. |
| 13553 | `assertPublishingMutationAllowed` | Enforces publishing governance before protected publishing mutations. |

## Route Count Summary

Explicit Express route registrations counted: 196.

| Classification | Count |
| --- | ---: |
| `canonical_project_scoped` | 16 |
| `public_project_scoped` | 71 |
| `legacy_generic` | 5 |
| `execution_bridge` | 4 |
| `scheduler_runtime` | 3 |
| `product_legacy` | 10 |
| `media_legacy` | 5 |
| `integration_runtime` | 7 |
| `ai_runtime` | 13 |
| `operations_runtime` | 49 |
| `internal_or_script` | 13 |
| `unknown_usage` | 0 |

## Route Inventory

| Line | Method | Route | Handler | Protection/auth status | Frontend usage | Classification | Risk | Future recommendation |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 9120 | GET | <code>/health</code> | inline | no key | not found | internal_or_script | low | document |
| 9128 | GET | <code>/healthz</code> | inline | no key | found: scripts | internal_or_script | low | document |
| 9136 | GET | <code>/readyz</code> | inline | no key | not found | internal_or_script | low | document |
| 9141 | GET | <code>/media-manager/project/:project/storage/parity-readiness</code> | inline | read-key; slug if project | not found | canonical_project_scoped | medium | investigate |
| 9152 | GET | <code>/public/media-manager/project/:project/storage/parity-readiness</code> | inline | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 9163 | GET | <code>/media-manager/storage/parity-readiness</code> | inline | read-key | not found | internal_or_script | medium | investigate |
| 9174 | GET | <code>/public/media-manager/storage/parity-readiness</code> | inline | read-key | not found | public_project_scoped | medium | deprecate later |
| 9185 | POST | <code>/task</code> | inline | write-key legacy pattern | not found | legacy_generic | medium | deprecate later |
| 9193 | GET | <code>/today</code> | inline | read-key | not found | legacy_generic | medium | deprecate later |
| 9209 | GET | <code>/next</code> | inline | read-key | not found | legacy_generic | medium | deprecate later |
| 9225 | POST | <code>/ingest</code> | inline | write-key legacy pattern | not found | legacy_generic | medium | deprecate later |
| 9241 | POST | <code>/execute_publish_package</code> | inline | project context; no key pattern | found: scheduler helper | execution_bridge | medium | bridge |
| 9299 | POST | <code>/execute_email_package</code> | inline | project context; no key pattern | found: scheduler helper | execution_bridge | medium | bridge |
| 9356 | POST | <code>/generate_media_from_prompt</code> | inline | project context; no key pattern | found: scheduler helper | execution_bridge | medium | bridge |
| 9416 | POST | <code>/build_ad_execution_package</code> | inline | project context; no key pattern | found: scheduler helper | execution_bridge | medium | bridge |
| 9469 | GET | <code>/products</code> | inline async | read-key | not found | product_legacy | medium | deprecate later |
| 9488 | GET | <code>/optimize-product/:id</code> | inline async | read-key | server-internal/telegram | product_legacy | medium | document |
| 9533 | GET | <code>/prepare-product-update/:id</code> | inline async | read-key | server-internal/telegram | product_legacy | medium | document |
| 9619 | POST | <code>/backup-and-clone-product/:id</code> | inline async | write-key legacy pattern | server-internal/telegram | product_legacy | medium | document |
| 9703 | POST | <code>/apply-prepared-copy-to-clone/:originalId/:cloneId</code> | inline async | write-key legacy pattern | server-internal/telegram | product_legacy | medium | document |
| 9821 | GET | <code>/media/projects</code> | inline | no key apparent | not found | media_legacy | medium | deprecate later |
| 9826 | GET | <code>/media/tree/:project</code> | inline | read-key; slug | not found | media_legacy | medium | deprecate later |
| 9852 | POST | <code>/media/upload</code> | inline | write-key; body slug | found: api.js | media_legacy | medium | document |
| 9922 | GET | <code>/media/registry/:project</code> | inline | read-key; slug | not found | media_legacy | medium | deprecate later |
| 9926 | GET | <code>/media/file/:project/:type/:filename</code> | inline | read-key; slug | found: pages/library.js | media_legacy | medium | document |
| 10255 | POST | <code>/media-manager/project/:project/rename</code> | handleRenameMediaManagerProject | write-key; slug if project | not found | canonical_project_scoped | medium | investigate |
| 10257 | POST | <code>/public/media-manager/project/:project/rename</code> | handleRenameMediaManagerProject | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10259 | POST | <code>/media-manager/project/:project/apply-template</code> | handleApplyBusinessTemplateToProject | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10261 | POST | <code>/public/media-manager/project/:project/apply-template</code> | handleApplyBusinessTemplateToProject | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10263 | POST | <code>/media-manager/projects</code> | handleCreateMediaManagerProject | write-key | found: api.js | internal_or_script | low | document |
| 10265 | POST | <code>/public/media-manager/projects</code> | handleCreateMediaManagerProject | write-key | not found | public_project_scoped | medium | deprecate later |
| 10267 | GET | <code>/media-manager/projects</code> | inline | read-key | found: api.js | internal_or_script | low | document |
| 10271 | GET | <code>/public/media-manager/projects</code> | inline | read-key | not found | public_project_scoped | medium | deprecate later |
| 10275 | GET | <code>/media-manager/asset-catalog</code> | inline | read-key | found: api.js | internal_or_script | low | document |
| 10281 | GET | <code>/public/media-manager/asset-catalog</code> | inline | read-key | not found | public_project_scoped | medium | deprecate later |
| 10287 | GET | <code>/media-manager/project/:project/startup</code> | inline | read-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10297 | GET | <code>/public/media-manager/project/:project/startup</code> | inline | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10307 | GET | <code>/media-manager/project/:project</code> | inline | read-key; slug if project | not found | canonical_project_scoped | medium | investigate |
| 10317 | GET | <code>/public/media-manager/project/:project</code> | inline | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10454 | POST | <code>/media-manager/project/:project/assets/:assetId/status</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10508 | POST | <code>/media-manager/project/:project/assets/:assetId/rename</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10538 | POST | <code>/media-manager/project/:project/assets/:assetId/source-of-truth</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10563 | POST | <code>/media-manager/project/:project/assets/:assetId/archive</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10591 | POST | <code>/media-manager/project/:project/assets/:assetId/delete</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10622 | DELETE | <code>/media-manager/project/:project/assets/:assetId</code> | inline | write-key; slug if project | not found | canonical_project_scoped | medium | investigate |
| 10653 | POST | <code>/media-manager/project/:project/library/refresh</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10663 | POST | <code>/media-manager/project/:project/setup</code> | inline | write-key; slug if project | found: api.js | canonical_project_scoped | low | keep |
| 10673 | POST | <code>/public/media-manager/project/:project/setup</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10693 | GET | <code>/media-manager/project/:project/operations</code> | handleGetProjectOperations | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10694 | GET | <code>/public/media-manager/project/:project/operations</code> | handleGetProjectOperations | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10752 | GET | <code>/media-manager/project/:project/task-center</code> | handleGetTaskCenter | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10753 | GET | <code>/public/media-manager/project/:project/task-center</code> | handleGetTaskCenter | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10754 | GET | <code>/media-manager/project/:project/queue-center</code> | handleGetQueueCenter | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10755 | GET | <code>/public/media-manager/project/:project/queue-center</code> | handleGetQueueCenter | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10756 | GET | <code>/media-manager/project/:project/job-monitor</code> | handleGetJobMonitor | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10757 | GET | <code>/public/media-manager/project/:project/job-monitor</code> | handleGetJobMonitor | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10758 | GET | <code>/media-manager/project/:project/notification-center</code> | handleGetNotificationCenter | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10759 | GET | <code>/public/media-manager/project/:project/notification-center</code> | handleGetNotificationCenter | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10768 | GET | <code>/media-manager/project/:project/operations/schema</code> | handleGetOperationsSchema | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10769 | GET | <code>/public/media-manager/project/:project/operations/schema</code> | handleGetOperationsSchema | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10797 | GET | <code>/media-manager/project/:project/team</code> | handleGetProjectTeam | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10798 | GET | <code>/public/media-manager/project/:project/team</code> | handleGetProjectTeam | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10799 | POST | <code>/media-manager/project/:project/team</code> | handleUpdateProjectTeam | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10800 | POST | <code>/public/media-manager/project/:project/team</code> | handleUpdateProjectTeam | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10845 | GET | <code>/media-manager/project/:project/campaigns</code> | handleListCampaigns | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10846 | GET | <code>/public/media-manager/project/:project/campaigns</code> | handleListCampaigns | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10847 | POST | <code>/media-manager/project/:project/campaigns</code> | handleUpsertCampaign | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10848 | POST | <code>/public/media-manager/project/:project/campaigns</code> | handleUpsertCampaign | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10849 | PATCH | <code>/media-manager/project/:project/campaigns/:campaignId</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10856 | PATCH | <code>/public/media-manager/project/:project/campaigns/:campaignId</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10863 | GET | <code>/media-manager/project/:project/campaigns/:campaignId</code> | handleGetCampaign | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 10864 | GET | <code>/public/media-manager/project/:project/campaigns/:campaignId</code> | handleGetCampaign | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10910 | GET | <code>/media-manager/project/:project/content-items</code> | handleListContentItems | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10911 | GET | <code>/public/media-manager/project/:project/content-items</code> | handleListContentItems | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10912 | POST | <code>/media-manager/project/:project/content-items</code> | handleUpsertContentItem | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10913 | POST | <code>/public/media-manager/project/:project/content-items</code> | handleUpsertContentItem | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10914 | PATCH | <code>/media-manager/project/:project/content-items/:contentItemId</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10921 | PATCH | <code>/public/media-manager/project/:project/content-items/:contentItemId</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10928 | GET | <code>/media-manager/project/:project/content-items/:contentItemId</code> | handleGetContentItem | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 10929 | GET | <code>/public/media-manager/project/:project/content-items/:contentItemId</code> | handleGetContentItem | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10976 | GET | <code>/media-manager/project/:project/media-jobs</code> | handleListMediaJobs | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10977 | GET | <code>/public/media-manager/project/:project/media-jobs</code> | handleListMediaJobs | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10978 | POST | <code>/media-manager/project/:project/media-jobs</code> | handleUpsertMediaJob | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10979 | POST | <code>/public/media-manager/project/:project/media-jobs</code> | handleUpsertMediaJob | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10980 | PATCH | <code>/media-manager/project/:project/media-jobs/:mediaJobId</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 10987 | PATCH | <code>/public/media-manager/project/:project/media-jobs/:mediaJobId</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 10994 | GET | <code>/media-manager/project/:project/media-jobs/:mediaJobId</code> | handleGetMediaJob | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 10995 | GET | <code>/public/media-manager/project/:project/media-jobs/:mediaJobId</code> | handleGetMediaJob | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11012 | GET | <code>/media-manager/project/:project/workflows/runs</code> | handleListWorkflowRuns | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 11013 | GET | <code>/public/media-manager/project/:project/workflows/runs</code> | handleListWorkflowRuns | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11029 | GET | <code>/media-manager/project/:project/workflows/runs/:runId</code> | handleGetWorkflowRun | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 11030 | GET | <code>/public/media-manager/project/:project/workflows/runs/:runId</code> | handleGetWorkflowRun | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11072 | POST | <code>/media-manager/project/:project/workflows/:workflowId/run</code> | handleRunWorkflow | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11073 | POST | <code>/public/media-manager/project/:project/workflows/:workflowId/run</code> | handleRunWorkflow | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11218 | GET | <code>/media-manager/project/:project/ai/commands</code> | handleListAiCommands | read-key; slug if project | not found | ai_runtime | medium | investigate |
| 11219 | GET | <code>/public/media-manager/project/:project/ai/commands</code> | handleListAiCommands | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11220 | GET | <code>/media-manager/project/:project/ai/commands/:commandId</code> | handleGetAiCommand | read-key; slug if project | not found | ai_runtime | medium | investigate |
| 11221 | GET | <code>/public/media-manager/project/:project/ai/commands/:commandId</code> | handleGetAiCommand | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11222 | POST | <code>/media-manager/project/:project/ai/command</code> | handleExecuteAiCommand | write-key; slug if project | found: api.js | ai_runtime | medium | keep |
| 11223 | POST | <code>/public/media-manager/project/:project/ai/command</code> | handleExecuteAiCommand | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11224 | POST | <code>/media-manager/project/:project/ai/workflows/:workflowId/run</code> | handleExecuteAiWorkflow | write-key; slug if project | found: api.js | ai_runtime | medium | keep |
| 11225 | POST | <code>/public/media-manager/project/:project/ai/workflows/:workflowId/run</code> | handleExecuteAiWorkflow | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11226 | GET | <code>/media-manager/project/:project/ai/artifacts</code> | handleListAiArtifacts | read-key; slug if project | not found | ai_runtime | medium | investigate |
| 11227 | GET | <code>/public/media-manager/project/:project/ai/artifacts</code> | handleListAiArtifacts | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11228 | GET | <code>/media-manager/project/:project/ai/recommendations</code> | handleListAiRecommendations | read-key; slug if project | not found | ai_runtime | medium | investigate |
| 11229 | GET | <code>/public/media-manager/project/:project/ai/recommendations</code> | handleListAiRecommendations | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11230 | GET | <code>/media-manager/project/:project/ai/memory</code> | handleListAiMemory | read-key; slug if project | not found | ai_runtime | medium | investigate |
| 11231 | GET | <code>/public/media-manager/project/:project/ai/memory</code> | handleListAiMemory | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11262 | GET | <code>/media-manager/project/:project/tasks</code> | handleListTasks | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11263 | GET | <code>/public/media-manager/project/:project/tasks</code> | handleListTasks | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11264 | POST | <code>/media-manager/project/:project/tasks</code> | handleCreateTask | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11265 | POST | <code>/public/media-manager/project/:project/tasks</code> | handleCreateTask | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11266 | GET | <code>/media-manager/project/:project/tasks/:taskId</code> | inline | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 11279 | GET | <code>/public/media-manager/project/:project/tasks/:taskId</code> | inline | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11343 | GET | <code>/media-manager/project/:project/approvals</code> | handleListApprovals | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11344 | GET | <code>/public/media-manager/project/:project/approvals</code> | handleListApprovals | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11345 | POST | <code>/media-manager/project/:project/approvals</code> | handleCreateApproval | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11346 | POST | <code>/public/media-manager/project/:project/approvals</code> | handleCreateApproval | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11347 | POST | <code>/media-manager/project/:project/approvals/:approvalId/decision</code> | handleApprovalDecision | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11348 | POST | <code>/public/media-manager/project/:project/approvals/:approvalId/decision</code> | handleApprovalDecision | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11391 | GET | <code>/media-manager/project/:project/governance</code> | handleGetGovernance | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11392 | GET | <code>/public/media-manager/project/:project/governance</code> | handleGetGovernance | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11393 | GET | <code>/media-manager/project/:project/governance/policy</code> | handleGetGovernancePolicy | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11394 | GET | <code>/public/media-manager/project/:project/governance/policy</code> | handleGetGovernancePolicy | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11395 | POST | <code>/media-manager/project/:project/governance/policy</code> | handleUpdateGovernancePolicy | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11396 | POST | <code>/public/media-manager/project/:project/governance/policy</code> | handleUpdateGovernancePolicy | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11413 | GET | <code>/media-manager/project/:project/notifications</code> | handleListNotifications | read-key; slug if project | not found | operations_runtime | medium | investigate |
| 11414 | GET | <code>/public/media-manager/project/:project/notifications</code> | handleListNotifications | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11415 | PATCH | <code>/media-manager/project/:project/notifications/:notificationId</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11428 | PATCH | <code>/public/media-manager/project/:project/notifications/:notificationId</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11488 | GET | <code>/media-manager/project/:project/handoffs</code> | handleListHandoffs | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11489 | GET | <code>/public/media-manager/project/:project/handoffs</code> | handleListHandoffs | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11490 | POST | <code>/media-manager/project/:project/handoffs</code> | handleCreateHandoff | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11491 | POST | <code>/public/media-manager/project/:project/handoffs</code> | handleCreateHandoff | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11492 | POST | <code>/media-manager/project/:project/handoffs/:handoffId/consume</code> | handleConsumeHandoff | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11493 | POST | <code>/public/media-manager/project/:project/handoffs/:handoffId/consume</code> | handleConsumeHandoff | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11510 | GET | <code>/media-manager/project/:project/events</code> | handleListEvents | read-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11511 | GET | <code>/public/media-manager/project/:project/events</code> | handleListEvents | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11533 | GET | <code>/api/insights/:project</code> | handleGetProjectInsights | read-key; slug | found: api.js | canonical_project_scoped | low | keep |
| 11534 | GET | <code>/public/api/insights/:project</code> | handleGetProjectInsights | read-key; slug | not found | public_project_scoped | medium | deprecate later |
| 11535 | GET | <code>/api/learning/:project</code> | handleGetProjectLearning | read-key; slug | found: api.js | canonical_project_scoped | low | keep |
| 11536 | GET | <code>/public/api/learning/:project</code> | handleGetProjectLearning | read-key; slug | not found | public_project_scoped | medium | deprecate later |
| 11538 | POST | <code>/media-manager/project/:project/sources</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11564 | POST | <code>/public/media-manager/project/:project/sources</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11590 | DELETE | <code>/media-manager/project/:project/sources/:sourceType</code> | inline | write-key; slug if project | found: api.js | operations_runtime | low | keep |
| 11601 | DELETE | <code>/public/media-manager/project/:project/sources/:sourceType</code> | inline | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11696 | GET | <code>/media-manager/project/:project/integrations/control-center</code> | handleGetProjectIntegrationControlCenter | read-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11697 | GET | <code>/public/media-manager/project/:project/integrations/control-center</code> | handleGetProjectIntegrationControlCenter | read-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11699 | POST | <code>/media-manager/project/:project/integrations/:integrationId/connect</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11705 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/connect</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11711 | POST | <code>/media-manager/project/:project/integrations/:integrationId/reconnect</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11717 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/reconnect</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11723 | POST | <code>/media-manager/project/:project/integrations/:integrationId/test</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11727 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/test</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11731 | POST | <code>/media-manager/project/:project/integrations/:integrationId/sync</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11735 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/sync</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11739 | POST | <code>/media-manager/project/:project/integrations/:integrationId/import-history</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11743 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/import-history</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11747 | POST | <code>/media-manager/project/:project/integrations/:integrationId/disconnect</code> | inline async | write-key; slug if project | found: api.js | integration_runtime | low | keep |
| 11751 | POST | <code>/public/media-manager/project/:project/integrations/:integrationId/disconnect</code> | inline async | write-key; slug if project | not found | public_project_scoped | medium | deprecate later |
| 11757 | POST | <code>/media-manager/project/:project/publishing/schedule</code> | inline | write-key + governance; slug | found: api.js | operations_runtime | high | keep |
| 11790 | POST | <code>/public/media-manager/project/:project/publishing/schedule</code> | inline | write-key + governance; slug | not found | public_project_scoped | high | deprecate later |
| 11823 | POST | <code>/media-manager/project/:project/publishing/:jobId/reschedule</code> | inline | write-key + governance; slug | found: api.js | operations_runtime | high | keep |
| 11852 | POST | <code>/public/media-manager/project/:project/publishing/:jobId/reschedule</code> | inline | write-key + governance; slug | not found | public_project_scoped | high | deprecate later |
| 11881 | POST | <code>/media-manager/project/:project/publishing/:jobId/ready</code> | inline | write-key + governance; slug | found: api.js | operations_runtime | high | keep |
| 11903 | POST | <code>/public/media-manager/project/:project/publishing/:jobId/ready</code> | inline | write-key + governance; slug | not found | public_project_scoped | high | deprecate later |
| 11925 | POST | <code>/media-manager/project/:project/publishing/:jobId/publish</code> | inline | write-key + governance; slug | found: api.js | operations_runtime | high | keep |
| 11957 | POST | <code>/public/media-manager/project/:project/publishing/:jobId/publish</code> | inline | write-key + governance; slug | not found | public_project_scoped | high | deprecate later |
| 11989 | POST | <code>/media-manager/project/:project/publishing/:jobId/fail</code> | inline | write-key + governance; slug | found: api.js | operations_runtime | high | keep |
| 12021 | POST | <code>/public/media-manager/project/:project/publishing/:jobId/fail</code> | inline | write-key + governance; slug | not found | public_project_scoped | high | deprecate later |
| 12053 | GET | <code>/media-manager</code> | inline | no key apparent | browser/static | internal_or_script | low | document |
| 12057 | GET | <code>/media-manager/</code> | inline | no key apparent | browser/static | internal_or_script | low | document |
| 12061 | GET | <code>/^/control-center$/</code> | inline | no key apparent | browser/static | internal_or_script | low | document |
| 12094 | USE | <code>/^/control-center/(?:index.html)?$/</code> | inline | entry/static no key | browser/static | internal_or_script | low | document |
| 12121 | USE | <code>/control-center</code> | express.static | static/no key | browser/static | internal_or_script | low | document |
| 12129 | USE | <code>/public</code> | express.static | static/no key | browser/static | internal_or_script | low | document |
| 12131 | GET | <code>/generated-output/:project/:filename</code> | inline | read-key; slug | not found | canonical_project_scoped | medium | investigate |
| 14149 | POST | <code>/telegram-command</code> | inline async | write-key legacy pattern; rate-limited | not found | legacy_generic | medium | deprecate later |
| 20093 | POST | <code>/publish-clone/:cloneId</code> | inline async | write-key legacy + governance | not found | product_legacy | high | deprecate later |
| 20136 | POST | <code>/replace-original-product/:originalId/:cloneId</code> | inline async | write-key legacy + governance | not found | product_legacy | high | deprecate later |
| 20225 | POST | <code>/cleanup-clone/:cloneId</code> | inline async | write-key legacy pattern | not found | product_legacy | medium | deprecate later |
| 20272 | POST | <code>/publish-blog/:draftId</code> | inline async | write-key legacy + governance | server-internal/telegram | product_legacy | high | document |
| 20378 | POST | <code>/rollback-product/:productId</code> | inline async | write-key legacy + governance | not found | product_legacy | high | deprecate later |
| 20885 | POST | <code>/schedule_execution_job</code> | inline | project context; no key pattern | found: scripts | scheduler_runtime | medium | bridge |
| 20979 | GET | <code>/scheduler_queue</code> | inline | project context; no read-key pattern | found: scripts | scheduler_runtime | medium | bridge |
| 21056 | POST | <code>/run_scheduler_worker_once</code> | inline | project context; no key pattern | found: scripts | scheduler_runtime | high | bridge |
| 21186 | POST | <code>/record_execution_feedback</code> | inline | project context; no key pattern | found: scripts | operations_runtime | low | keep |
| 21258 | GET | <code>/get_performance_summary</code> | inline | project context; no read-key pattern | found: scripts | operations_runtime | low | keep |
| 21277 | POST | <code>/generate_optimization_recommendations</code> | inline | project context; no key pattern | found: scripts | operations_runtime | low | keep |
| 21305 | POST | <code>/api/media/improve-prompt</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21335 | POST | <code>/api/media/brand-check</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21365 | POST | <code>/api/media/generate-image</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21395 | POST | <code>/api/media/generate-video-brief</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21425 | POST | <code>/api/media/generate-voice-script</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21455 | POST | <code>/api/media/generate-campaign-pack</code> | inline async | project context; no key pattern | found: api.js | ai_runtime | medium | keep |
| 21485 | GET | <code>/get_smart_suggestions</code> | inline | project context; no read-key pattern | found: scripts | operations_runtime | low | keep |

## Frontend Usage Found

Direct current frontend usage was found for these route families:

- `/media-manager/projects` and `/media-manager/asset-catalog`
- `/media-manager/project/:project/startup`
- `/media-manager/project/:project/operations` and operations center projections
- `/media-manager/project/:project/setup`, `/apply-template`, `/library/refresh`
- `/media-manager/project/:project/assets/:assetId/...` soft mutation routes, except hard `DELETE /assets/:assetId`
- `/media-manager/project/:project/team`, `/campaigns`, `/content-items`, `/media-jobs`
- `/media-manager/project/:project/workflows/:workflowId/run`
- `/media-manager/project/:project/ai/command` and `/ai/workflows/:workflowId/run`
- `/media-manager/project/:project/tasks`, `/approvals`, `/governance`, `/sources`, `/integrations`, `/publishing`, `/handoffs`, `/events`, and notification mark-read route
- `/api/insights/:project`, `/api/learning/:project`
- `/api/media/*`
- `/media/upload` and `/media/file/:project/:type/:filename`

Script or server-internal usage was found for:

- Scheduler helpers: `/execute_publish_package`, `/execute_email_package`, `/generate_media_from_prompt`, `/build_ad_execution_package`
- Scheduler verification: `/schedule_execution_job`, `/scheduler_queue`, `/run_scheduler_worker_once`
- Intelligence loop verification: `/record_execution_feedback`, `/get_performance_summary`, `/generate_optimization_recommendations`, `/get_smart_suggestions`
- Telegram/server-internal product flows: `/optimize-product/:id`, `/prepare-product-update/:id`, `/backup-and-clone-product/:id`, `/apply-prepared-copy-to-clone/:originalId/:cloneId`, `/publish-blog/:draftId`

## Frontend Usage Not Found

Notable direct frontend usage not found in `api.js` or `pages/*.js`:

- All `/public/media-manager/...` and `/public/api/...` aliases.
- `/task`, `/today`, `/next`, `/ingest`, `/telegram-command`.
- Legacy media reads except `/media/file/:project/:type/:filename`; this includes `/media/projects`, `/media/tree/:project`, and `/media/registry/:project`.
- Project detail fallback route `GET /media-manager/project/:project`.
- Project rename route `POST /media-manager/project/:project/rename`.
- Hard delete route `DELETE /media-manager/project/:project/assets/:assetId`.
- Detail reads for campaigns, content items, media jobs, workflow runs, AI command records, AI artifacts, AI recommendations, AI memory, tasks, and notifications list.
- `/generated-output/:project/:filename`.
- WooCommerce/WordPress product mutation routes except server-internal telegram references.

## Legacy Routes Found

Legacy route families found:

- Generic legacy: `/task`, `/today`, `/next`, `/ingest`, `/telegram-command`.
- Product legacy: `/products`, `/optimize-product/:id`, `/prepare-product-update/:id`, `/backup-and-clone-product/:id`, `/apply-prepared-copy-to-clone/:originalId/:cloneId`, `/publish-clone/:cloneId`, `/replace-original-product/:originalId/:cloneId`, `/cleanup-clone/:cloneId`, `/publish-blog/:draftId`, `/rollback-product/:productId`.
- Media legacy: `/media/projects`, `/media/tree/:project`, `/media/upload`, `/media/registry/:project`, `/media/file/:project/:type/:filename`.
- Public aliases: `/public/media-manager/...` and `/public/api/...`.

No deletion or renaming is recommended in this phase. Mark deprecations as documentation-only until consumers and compatibility requirements are explicitly resolved.

## Risks

- High risk: publishing mutations and product publish/replace/rollback routes. These must retain `assertPublishingMutationAllowed` and protected write-key behavior.
- Medium risk: public aliases are protected but not directly used by current frontend wrappers; they may still exist for compatibility.
- Medium risk: scheduler and execution bridge routes require project context but are not matched by the centralized protected key middleware patterns.
- Medium risk: `/api/media/*` is used by frontend and may call providers or persist media results, but is not matched by the protected write-key middleware patterns.
- Medium risk: several detail read routes are registered without direct frontend usage found; future consolidation should investigate before deprecating.

## Future Direction

- Keep canonical non-public `/media-manager/project/:project/...` routes used by the current frontend.
- Document and preserve public aliases until a separate compatibility decision is made.
- Bridge scheduler and execution endpoints into clearer project-scoped operational APIs before any deprecation.
- Investigate unused detail-read and legacy routes with logs or access telemetry before changing route behavior.
- Do not weaken publishing governance, protected read/write keys, slug validation, or project isolation.
