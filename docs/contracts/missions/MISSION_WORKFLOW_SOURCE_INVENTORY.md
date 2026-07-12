# Mission / Workflow Source Inventory

"This Phase 1A-5 inventory freezes observed mission, objective, task, workflow, job, execution, scheduler, handoff, approval, correlation, context, completion, failure, retry, resume, replay, workspace, and learning vocabulary and records recommendations only. It does not approve mission IDs, workflow IDs, state transitions, scheduler behavior, retry/resume behavior, migrations, schemas, registries, or runtime changes."

## Scope and Baseline

- Repository baseline verified from current HEAD and Git state.
  - `HEAD=4f1d5f702b2c9207f97a2080f979dffdbef16556`
  - `BRANCH=main`
  - `WORKTREE_CHANGE_COUNT=0`
  - `ORIGIN_MAIN_DELTA=0 0`
  - Evidence: `/tmp/mhos-phase1a5-mission-workflow-inventory-20260712-021728/260_summary.env:1-28`
- Evidence pack verified.
  - `AUDIT=MH_OS_PHASE_1A5_MISSION_WORKFLOW_SOURCE_INVENTORY`
  - `SYNTAX_FILES_CHECKED=335`
  - `SYNTAX_FAILURES=0`
  - `SERVER_STARTED=NO`
  - `PROVIDER_CALLS=NO`
  - `PRODUCTION_PATCH=NO`
  - Evidence: `/tmp/mhos-phase1a5-mission-workflow-inventory-20260712-021728/260_summary.env:1-28`

## Executive Findings

- Durable Mission Aggregate: `MISSING`
  - No `mission` durable collection exists in the canonical operations backbone. The durable entity list includes campaigns, content items, media jobs, workflow runs, AI command/artifact/recommendation/memory records, tasks, approvals, notifications, queue, handoffs, events, and team, but no mission entity or mission storage path.
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:14-49`, `runtime/orchestrator-service/lib/ops/backbone.js:780-848`
  - Source classification: `MISSION_SOURCE`, `TASK_STORAGE_SOURCE`, `WORKFLOW_STORAGE_SOURCE`, `HANDOFF_STORAGE_SOURCE`, `APPROVAL_REQUEST_SOURCE`
  - Confidence: `HIGH`
- Mission ID: `MISSING`
  - No canonical `mission_id` field was proven in the backbone task/workflow/approval/handoff/scheduler owners. The current backbone correlation is entity-specific and project-scoped.
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2052-3161`
  - Source classification: `CORRELATION_SOURCE`
  - Confidence: `HIGH`
- Root correlation ID: `MISSING`
  - No canonical `root_id`, `root_correlation_id`, or universal correlation envelope was proven in the current runtime owners.
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2052-3161`
  - Source classification: `CORRELATION_SOURCE`
  - Confidence: `HIGH`
- Full Team Mission: `COORDINATION_MODE_ONLY`
  - `teamMode` exists in browser session state and local storage, and Full Team output is explicitly limited to coordinated draft previews with no workflow/task/send/publish/approval execution.
  - Evidence: `public/control-center/pages/ai-command.js:956-1266`, `public/control-center/pages/ai-command.js:1760-1806`, `public/control-center/pages/ai-command.js:3694-3703`
  - Source classification: `FRONTEND_EXPERIENCE_MODEL`, `CONTEXT_SOURCE`
  - Confidence: `HIGH`
- Long-running workspace for mission/workflow execution: `BROWSER_WORKSPACE` plus separate non-mission conversation stores
  - AI Command chat sessions are browser-local (`window.localStorage`) and capped client-side.
  - Customer-operations conversations exist separately but are not mission workspaces; the store shown here is process-memory `Map`, not durable mission/workflow workspace state.
  - Evidence: `public/control-center/pages/ai-command.js:956-1266`, `runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:1-52`
  - Source classification: `WORKSPACE_SOURCE`, `SESSION_SOURCE`, `CONVERSATION_ONLY`
  - Confidence: `HIGH`

## Source Register

| Source | Classification | Current truth | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| `runtime/orchestrator-service/lib/ops/backbone.js` | `TASK_STORAGE_SOURCE`, `WORKFLOW_STORAGE_SOURCE`, `APPROVAL_REQUEST_SOURCE`, `HANDOFF_STORAGE_SOURCE`, `RESULT_SOURCE`, `EVENT_SOURCE`, `CORRELATION_SOURCE` | Canonical project-scoped durable operations owner. No mission store. | `runtime/orchestrator-service/lib/ops/backbone.js:780-848`, `runtime/orchestrator-service/lib/ops/backbone.js:2052-3161`, `runtime/orchestrator-service/lib/ops/backbone.js:3839-4010` | HIGH |
| `runtime/orchestrator-service/server.js` | `WORKFLOW_RUN_SOURCE`, `TASK_INSTANCE_SOURCE`, `APPROVAL_DECISION_SOURCE`, `HANDOFF_SOURCE`, `SCHEDULER_SOURCE`, `COMPATIBILITY_SOURCE` | Canonical route registration and mutation surface; routes delegate to backbone or scheduler helpers. | `runtime/orchestrator-service/server.js:12212-12315`, `runtime/orchestrator-service/server.js:12672-12953`, `runtime/orchestrator-service/server.js:23085-23386` | HIGH |
| `runtime/orchestrator-service/lib/execution/scheduler-storage.js` | `SCHEDULER_STORAGE_SOURCE`, `AUDIT_SOURCE` | File-backed scheduler queue under project execution path plus JSONL audit log. | `runtime/orchestrator-service/lib/execution/scheduler-storage.js:1-60` | HIGH |
| `runtime/orchestrator-service/lib/execution/scheduler-helpers.js` | `SCHEDULER_SOURCE`, `RETRY_SOURCE` | Builds scheduler job records, due checks, and stale-lock checks; no resume/replay contract. | `runtime/orchestrator-service/lib/execution/scheduler-helpers.js:1-59` | HIGH |
| `runtime/orchestrator-service/lib/execution/execution-job-bridge.js` | `JOB_SOURCE`, `EXECUTION_RESULT_SOURCE`, `FAILURE_SOURCE` | Dispatch bridge for publish/email/media/ads job types; returns execution result payloads per job type. | `runtime/orchestrator-service/lib/execution/execution-job-bridge.js:1-130` | HIGH |
| `runtime/orchestrator-service/lib/execution/intelligence-loop.js` | `LEARNING_SIGNAL_SOURCE`, `RECOMMENDATION_SOURCE`, `MEMORY_SOURCE` | Partial learning loop triggered after scheduler job completion; writes recommendation and learning stores when not skipped by env flags. | `runtime/orchestrator-service/lib/execution/intelligence-loop.js:1-100` | HIGH |
| `runtime/orchestrator-service/lib/execution/performance-storage.js` | `LEARNING_SIGNAL_SOURCE`, `RECOMMENDATION_SOURCE`, `MEMORY_SOURCE`, `STORAGE_SOURCE` | File-backed performance, recommendation, and learning stores behind intelligence paths. | `runtime/orchestrator-service/lib/execution/performance-storage.js:1-116` | HIGH |
| `public/control-center/pages/ai-command.js` | `FRONTEND_EXPERIENCE_MODEL`, `FRONTEND_PROJECTION`, `SESSION_SOURCE`, `BROWSER_WORKSPACE` | Browser-local AI team/session/history/preview model. Full Team is review/preview only. | `public/control-center/pages/ai-command.js:956-1266`, `public/control-center/pages/ai-command.js:1760-1806`, `public/control-center/pages/ai-command.js:4077`, `public/control-center/pages/ai-command.js:6796-6800` | HIGH |
| `public/control-center/runtime/authority/authority-projection.js` | `FRONTEND_PROJECTION` | Explicit projection-only reader for approvals, workflow runs, handoffs, AI recommendations, and AI memory. | `public/control-center/runtime/authority/authority-projection.js:1-71` | HIGH |
| `public/control-center/api.js` | `FRONTEND_PROJECTION` | Frontend consumer for task center, approvals, and handoffs APIs. | `public/control-center/api.js:1670-1692`, `public/control-center/api.js:1988-1994`, `public/control-center/api.js:2239-2293` | HIGH |
| `public/control-center/pages/operations-centers.js` | `FRONTEND_PROJECTION` | Task Center consumer of backend task-center projection. | `public/control-center/pages/operations-centers.js:735-748` | HIGH |
| `public/control-center/pages/content-studio-workspace.js` | `FRONTEND_PROJECTION` | Content Studio consumes tasks, approvals, handoffs, events, and operations snapshot together. | `public/control-center/pages/content-studio-workspace.js:800-816` | HIGH |
| `public/control-center/pages/media-studio-workspace.js` | `FRONTEND_PROJECTION` | Media Studio consumes media jobs, content items, tasks, approvals, handoffs, events, and operations snapshot together. | `public/control-center/pages/media-studio-workspace.js:576-590` | HIGH |
| `runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js` | `WORKSPACE_SOURCE`, `SESSION_SOURCE`, `CONVERSATION_ONLY` | Separate customer conversation runtime store; process-memory `Map`, not a mission/workflow workspace. | `runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:1-52` | HIGH |

## Mission Aggregate Findings

### Classification

- Durable mission aggregate: `MISSING`
- Mission vocabulary in UI/docs: `MISSION_PROJECTION_ONLY`
- Full Team mission runtime entity: `COORDINATION_MODE_ONLY`

### Proof

- The canonical durable operations owner initializes these file-backed entities and no mission file:
  - `campaigns.json`
  - `content-items.json`
  - `media-jobs.json`
  - `workflow-runs.json`
  - `ai-commands.json`
  - `ai-artifacts.json`
  - `ai-recommendations.json`
  - `ai-memory.json`
  - `tasks.json`
  - `approvals.json`
  - `notifications.json`
  - `queue.json`
  - `handoffs.json`
  - `team.json`
  - `governance.json`
  - `events.json`
- Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:780-848`

### What is missing

- No `mission_id`
- No mission collection owner
- No mission-level parent/root correlation
- No mission task/workflow/job/handoff/approval/result collections
- No mission-level resume/checkpoint semantics
- No mission completion derivation

## Task Sources

- Durable task writer: `createTask(projectName, input)`
  - Writes task record into `tasks.json`
  - Also upserts a queue item into `queue.json`
  - Can link tasks back to another entity through `linked_entity`
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2425-2564`
  - Source classification: `TASK_INSTANCE_SOURCE`, `TASK_STORAGE_SOURCE`, `DEPENDENCY_SOURCE`, `CORRELATION_SOURCE`
  - Confidence: `HIGH`
- Task route handlers
  - `GET /media-manager/project/:project/tasks`
  - `POST /media-manager/project/:project/tasks`
  - `GET /media-manager/project/:project/tasks/:taskId`
  - Public aliases also exist
  - Evidence: `runtime/orchestrator-service/server.js:12672-12717`
  - Source classification: `TASK_INSTANCE_SOURCE`, `COMPATIBILITY_SOURCE`
  - Confidence: `HIGH`
- Task shape proved today
  - `id`, `project`, `title`, `description`, `owner_role`, `assignee_role`, `team_role`, `service_domain`, `source_page`, `linked_entity`, `priority`, `status`, `lifecycle_state`, `queue_status`, `workflow_id`, `source_type`, `source_id`, `route_target`, `handoff_roles`, `responsibility`, `output`, `notes`, timestamps, history
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2445-2497`
  - Confidence: `HIGH`
- Task gaps
  - No mission link
  - No explicit reviewer role field on the persisted task record; review role is embedded under `responsibility`
  - No explicit parent task / subtask / depends_on / blocked_by persistence in this owner
  - No durable completion aggregate beyond task status/history

## Workflow Sources

- Durable workflow run writer: `recordWorkflowRun(projectName, input)`
  - Requires `workflow_id`
  - Writes run records into `workflow-runs.json`
  - Also projects queue state into `queue.json`
  - Emits notifications and events
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2052-2148`
  - Source classification: `WORKFLOW_RUN_SOURCE`, `WORKFLOW_STORAGE_SOURCE`, `STATE_TRANSITION_SOURCE`, `RESULT_SOURCE`
  - Confidence: `HIGH`
- Workflow run routes
  - `GET /media-manager/project/:project/workflows/runs`
  - `GET /media-manager/project/:project/workflows/runs/:runId`
  - `POST /media-manager/project/:project/workflows/:workflowId/run`
  - Public aliases also exist
  - Evidence: `runtime/orchestrator-service/server.js:12212-12315`
  - Source classification: `WORKFLOW_RUN_SOURCE`, `COMPATIBILITY_SOURCE`
  - Confidence: `HIGH`
- Workflow run shape proved today
  - `id`, `project`, `workflow_id`, `workflow_type`, `title`, `status`, `lifecycle_state`, `source`, `route_target`, `created_by`, timestamps, `inputs`, `outputs`, `intelligence_stamp`, `linked_entities`, `history`
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2062-2096`
  - Confidence: `HIGH`
- Workflow definition gap
  - No canonical workflow-definition registry was proven here.
  - Current owner records workflow runs, not a universal definition schema.
  - The frontend workflows page uses workflow vocabulary and active session language, but that does not prove a durable workflow-definition entity.
  - Evidence: `public/control-center/pages/workflows.js:1988-1997`
  - Source classification: `WORKFLOW_RUN_SOURCE`, `FRONTEND_EXPERIENCE_MODEL`
  - Confidence: `HIGH`

## Job / Execution Sources

- Scheduler job record writer
  - `POST /schedule_execution_job` validates job type, schedule, mode, and `package_payload`, then appends a job record to scheduler storage and audit logs it.
  - Evidence: `runtime/orchestrator-service/server.js:23085-23178`
  - Source classification: `JOB_SOURCE`, `SCHEDULER_SOURCE`, `SCHEDULER_STORAGE_SOURCE`
  - Confidence: `HIGH`
- Execution bridge
  - `executeJobBridge(job)` dispatches `publish`, `email`, `media`, and `ads` jobs and returns execution-state payloads.
  - Evidence: `runtime/orchestrator-service/lib/execution/execution-job-bridge.js:1-130`
  - Source classification: `JOB_SOURCE`, `EXECUTION_ATTEMPT_SOURCE`, `EXECUTION_RESULT_SOURCE`
  - Confidence: `HIGH`
- Scheduler job shape
  - `id`, `project`, `type`, `source_package_id`, `channel`, `execution_endpoint`, `execution_state`, `scheduled_at`, `mode`, `package_payload`, `status`, `attempts`, `max_attempts`, `locked_at`, `locked_by`, `last_error`, timestamps
  - Evidence: `runtime/orchestrator-service/lib/execution/scheduler-helpers.js:22-58`
  - Confidence: `HIGH`
- Execution gaps
  - No separate durable `execution_id` or `attempt_id`
  - Attempts are tracked by numeric `attempts`, not by distinct attempt records
  - No mission parent link
  - No root correlation envelope

## Scheduler Findings

- Scheduler storage is file-backed per project under execution storage.
  - `scheduler.json` stores jobs
  - `execution/logs/scheduler-*.jsonl` stores audit logs
  - Evidence: `runtime/orchestrator-service/lib/execution/scheduler-storage.js:16-52`
  - Source classification: `SCHEDULER_STORAGE_SOURCE`, `AUDIT_SOURCE`
  - Confidence: `HIGH`
- Scheduler queue route classifies jobs into `pending`, `due`, `running`, `failed`, `completed`, `retryable`.
  - Evidence: `runtime/orchestrator-service/server.js:23179-23255`
  - Confidence: `HIGH`
- Worker-once route semantics
  - Locks all due or stale-running jobs
  - Executes through `executeJobBridge`
  - Marks jobs `completed`, `retryable`, or `failed`
  - Updates intelligence loop after completed jobs
  - Evidence: `runtime/orchestrator-service/server.js:23256-23386`
  - Source classification: `SCHEDULER_SOURCE`, `RETRY_SOURCE`, `FAILURE_SOURCE`, `LEARNING_SIGNAL_SOURCE`
  - Confidence: `HIGH`
- Scheduler classification
  - Durability: `DURABLE`
  - Execution model: `FILE_BACKED + BRIDGE_ONLY`
  - Mission relationship: `MISSING`
  - Resume/replay: `MISSING`
  - Locking: `PARTIAL` via `locked_at` / `locked_by`
  - Duplicate prevention: `UNKNOWN_REQUIRES_PROOF`
  - Recovery: `PARTIAL`; stale-running lock expiry exists, but crash-safe replay/idempotency proof is missing

## Handoff Findings

- Durable handoff writer: `createHandoff(projectName, input)`
  - Writes `handoffs.json`
  - Stores `source_page`, `destination_page`, `source_role`, `destination_role`, linked/source entity, payload, timestamps, status/history
  - Supersedes previous available handoffs for the same route pair
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2955-3040`
  - Source classification: `HANDOFF_SOURCE`, `HANDOFF_STORAGE_SOURCE`, `CONTEXT_SOURCE`
  - Confidence: `HIGH`
- Handoff consume path
  - Changes only handoff record state to `consumed`
  - Does not itself grant permission or execute work
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:3121-3144`
  - Confidence: `HIGH`
- Handoff routes
  - `GET/POST /media-manager/project/:project/handoffs`
  - `POST /media-manager/project/:project/handoffs/:handoffId/consume`
  - Evidence: `runtime/orchestrator-service/server.js:12905-12953`
  - Confidence: `HIGH`
- Explicit boundary
  - Handoff `!=` permission
  - Handoff `!=` approval
  - Handoff `!=` execution
  - Handoff `!=` completed collaboration

## Approval Findings

- Durable approval writer: `createApproval(projectName, input)`
  - Requires `entity_type` and `entity_id`
  - Writes `approvals.json`
  - Adds approval queue entry and updates linked content/media entities
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2569-2760`
  - Source classification: `APPROVAL_REQUEST_SOURCE`, `APPROVAL_DECISION_SOURCE`, `CORRELATION_SOURCE`
  - Confidence: `HIGH`
- Approval decision path: `decideApproval(projectName, approvalId, input)`
  - Valid decisions: `approved`, `rejected`, `changes_requested`, `escalated`, `overridden`, `cancelled`
  - Updates approval record and linked entity state
  - May create an escalation task
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2762-2953`
  - Confidence: `HIGH`
- Approval routes
  - `GET/POST /media-manager/project/:project/approvals`
  - `POST /media-manager/project/:project/approvals/:approvalId/decision`
  - Evidence: `runtime/orchestrator-service/server.js:12719-12798`
  - Confidence: `HIGH`
- Explicit boundary
  - Approved `!=` executed
  - Approved `!=` succeeded
  - Approved `!=` completed
  - Approved `!=` published

## Correlation Findings

- Current correlation is entity-specific and project-scoped.
- Proved fields include:
  - `task.id`, `task.workflow_id`, `task.source_id`, `task.linked_entity`
  - `workflow_run.id`, `workflow_run.workflow_id`, `workflow_run.linked_entities`
  - `approval.id`, `approval.entity_type`, `approval.entity_id`, `approval.linked_execution_id`
  - `handoff.id`, `handoff.linked_entity`, `handoff.source_entity`
  - scheduler `job.id`
- Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2052-3161`, `runtime/orchestrator-service/lib/execution/scheduler-helpers.js:22-58`
- Aggregate correlation classification: `ENTITY_LINKS_ONLY`
- Missing from current owners:
  - universal `mission_id`
  - universal `root_id`
  - durable `execution_id`
  - durable `attempt_id`

## State / Transition Findings

- State vocabularies are independent per entity class.
  - Workflows: `queued`, `running`, `completed`, `failed`, `cancelled`
  - Tasks: `open`, `queued`, `in_progress`, `blocked`, `completed`, `cancelled`
  - Approvals: `pending`, `approved`, `rejected`, `changes_requested`, `escalated`, `overridden`, `cancelled`
  - Handoffs: `available`, `consumed`, `superseded`, `cancelled`
  - Scheduler jobs: `pending`, `running`, `completed`, `failed`, `retryable`
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:52-111`, `runtime/orchestrator-service/server.js:23179-23386`
  - Confidence: `HIGH`
- No universal mission/workflow/task/job state machine was proven.
- Approval decisions mutate linked content/media records, but that is a domain-specific bridge, not a universal lifecycle contract.

## Dependency / Ordering Findings

- Task persistence does not prove durable `depends_on`, `blocked_by`, `parent_task`, or `subtask` fields in the canonical task owner.
- Workflow run persistence does not prove a formal durable dependency graph or step graph in the run owner.
- Full Team preview lists staged human-readable steps, but they are UI draft guidance only.
- Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2425-2497`, `public/control-center/pages/ai-command.js:1768-1805`
- Dependency classification: `ADVISORY OR UI-ONLY` for the proven workflow/team-mode draft layer; `UNKNOWN_REQUIRES_PROOF` for strict backend enforcement beyond queue routing.

## Completion / Result Findings

- Workflow completion is represented by run `status`, `lifecycle_state`, `outputs`, events, notifications, and optional AI artifact creation in the run route.
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2067-2148`, `runtime/orchestrator-service/server.js:12277-12305`
- Task completion is represented by task `status` and `history`; no separate result aggregate was proven.
  - Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:2445-2497`
- Scheduler job completion is represented by scheduler `status=completed`, `execution_state`, audit log entry, and optional intelligence-loop update.
  - Evidence: `runtime/orchestrator-service/server.js:23289-23327`
- Approval completion is decision state only.
- Handoff completion is `consumed`, not execution success.

## Failure Model Findings

- Workflow run failure is status-string based; no separate failure record aggregate was proven.
- Scheduler jobs capture `last_error`, `status=retryable|failed`, and audit logs.
  - Evidence: `runtime/orchestrator-service/server.js:23328-23371`
- Approvals treat rejection/escalation/cancelled as approval outcomes, not execution failures.
- Customer conversation runtime is separate and does not prove mission failure handling.

## Retry / Resume / Replay / Cancel Findings

- Retry
  - Proved only for scheduler jobs through `attempts`, `max_attempts`, `status=retryable`, and re-selection by due check.
  - Evidence: `runtime/orchestrator-service/lib/execution/scheduler-helpers.js:12-18`, `runtime/orchestrator-service/server.js:23328-23371`
- Resume
  - Not proved for scheduler jobs, workflow runs, tasks, or AI Command mission/workflow state.
  - Stale-running lock expiry is not equivalent to resumable execution.
- Replay
  - Not proved.
- Cancel
  - Status vocabularies include `cancelled`, but no canonical scheduler/job replay-or-cancel route contract was proven here.
- Explicit boundary
  - Retry `!=` resume
  - Retry `!=` replay
  - Retry `!=` rollback
  - Cancel `!=` rollback

## Context Propagation Findings

- Durable task/workflow/approval/handoff context is limited to project-scoped records plus linked entities, route targets, payloads, and notes.
- AI Command preserves browser-local conversation context and can convert it into previews only.
  - Evidence: `public/control-center/pages/ai-command.js:3294-3388`, `public/control-center/pages/ai-command.js:6736-6822`
- Handoffs preserve source and destination pages and payload, but do not themselves prove permission or approval continuity.
- Durable mission context snapshot: `MISSING`

## Long-Running Workspace Findings

- AI Command workspace/session: `BROWSER_WORKSPACE`
  - In-memory session map plus browser `localStorage`
  - Evidence: `public/control-center/pages/ai-command.js:956-1266`
- Customer-operations conversations: separate non-mission runtime store
  - Current store is process-memory `Map`
  - Evidence: `runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:1-52`
- Checkpoints/resume tokens for mission/workflow workspace: `MISSING`

## Learning / Feedback Loop Findings

- Partial learning loop exists after completed scheduler jobs.
  - `updateIntelligenceLoop(projectName, context)` can write recommendation and learning stores and attach feedback/job references in history.
  - Evidence: `runtime/orchestrator-service/lib/execution/intelligence-loop.js:1-100`
- Learning/recommendation storage is file-backed behind intelligence paths.
  - Evidence: `runtime/orchestrator-service/lib/execution/performance-storage.js:37-105`
- Current linkage classification: `PARTIAL`
  - No mission-level closed loop
  - No universal causal chain across task -> workflow -> job -> result -> recommendation -> memory

## Durability / Storage Findings

- Durable operational records
  - `tasks.json`, `workflow-runs.json`, `approvals.json`, `handoffs.json`, `queue.json`, `events.json`, `scheduler.json`, recommendations/learning stores
- Non-durable runtime records
  - AI Command browser session map and local storage
  - customer-operations conversation in-memory store
- Projection-only consumers
  - Authority projection helper and frontend API/page consumers
- Evidence: `runtime/orchestrator-service/lib/ops/backbone.js:780-848`, `runtime/orchestrator-service/lib/execution/scheduler-storage.js:16-52`, `public/control-center/runtime/authority/authority-projection.js:1-71`, `public/control-center/pages/ai-command.js:956-1266`, `runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js:1-52`

## Tests and Validators

- Narrow runtime validators were identified, but Phase 1A-5 did not execute them.
- Relevant validator evidence includes:
  - `scripts/verify-scheduler-automation.js` for create/list/run/retry scheduler flows
  - `audits/frontend/task-center/ai-command-handoff/runtime-test/AI_COMMAND_TASK_CENTER_HANDOFF_TEST_SCRIPT.md`
  - `audits/frontend/home/HOME_UNIT_3_PHASE_2_WORKFLOW_CHAIN_AND_ESCALATION_SPEC.md`
- Evidence: `/tmp/mhos-phase1a5-mission-workflow-inventory-20260712-021728/210_tests_audits.txt:1-240`
- Test maturity summary
  - Tasks/workflows/handoffs/approvals: `PARTIALLY_TESTED`
  - Scheduler execution/retry: `VALIDATOR_PRESENT BUT NOT CERTIFIED HERE`
  - Mission aggregate: `NOT_TESTED BECAUSE NOT IMPLEMENTED`

## Confidence and Unresolved Ownership

- High-confidence current owners
  - backbone durable ops storage
  - server route registration and scheduler worker-once path
  - AI Command browser-local session and Full Team preview model
- Unresolved or future-only areas
  - durable Mission aggregate owner
  - universal workflow-definition owner
  - root correlation owner
  - durable execution-attempt owner
  - checkpoint/resume workspace owner
  - closed-loop learning owner across all execution entities
