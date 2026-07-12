# Mission / Workflow Vocabulary Freeze Recommendation

"This Phase 1A-5 inventory freezes observed mission, objective, task, workflow, job, execution, scheduler, handoff, approval, correlation, context, completion, failure, retry, resume, replay, workspace, and learning vocabulary and records recommendations only. It does not approve mission IDs, workflow IDs, state transitions, scheduler behavior, retry/resume behavior, migrations, schemas, registries, or runtime changes."

This Phase 1A-5 inventory freezes observed mission, objective, task, workflow, job, execution, scheduler, handoff, approval, correlation, context, completion, failure, retry, resume, replay, workspace, and learning vocabulary and records recommendations only. It does not approve runtime mission IDs, workflow IDs, state transitions, scheduler behavior, retry/resume behavior, migrations, schemas, registries, or runtime changes.

## Executive Recommendation

Freeze current mission/workflow vocabulary as federated, domain-scoped, read-only evidence.
Do not collapse mission/task/workflow/job/execution/handoff/approval/workspace vocabulary into a single global runtime contract during Phase 1A-5.

## Entity Separation Invariants

Current evidence requires these entity families to remain distinct:

`MISSION` != `TASK` != `WORKFLOW_DEFINITION` != `WORKFLOW_RUN` != `WORKFLOW_STEP` != `JOB` != `EXECUTION_ATTEMPT` != `SCHEDULER_ENTRY` != `HANDOFF` != `APPROVAL_REQUEST` != `APPROVAL_DECISION` != `RESULT` != `FAILURE_RECORD` != `EVENT` != `RECOMMENDATION` != `WORKSPACE`.

The following boundaries are mandatory documentation truths and do not create a future contract: task creation is not task execution; a workflow definition is not a workflow run; a job record is not an execution attempt; a scheduler entry is not job execution; a handoff is not permission; approval is not execution; result availability is not parent completion; retry is not resume, replay, or rollback; a browser workspace is not a durable workspace; recommendation storage is not a closed learning loop; and Full Team mode is not a durable Mission Aggregate.

No durable Mission Aggregate, `mission_id`, or universal root correlation is proven. Full Team remains `COORDINATION_MODE_ONLY`; current correlation remains `ENTITY_LINKS_ONLY`; AI Command remains a `BROWSER_WORKSPACE`; and learning-loop closure remains `PARTIAL` or `MISSING` according to source scope.

## Implementation Truth vs Authority

- Implementation-truth priority: current production runtime code.
- Evidence priority: source-proven writer, route, projection, and storage behavior.
- Authorization authority: protected-route and governance gate behavior only.
- Governance authority: approval and policy decision behavior only.
- Contract authority: future approved mission/workflow/execution contracts only.

## Mission / Entity Vocabulary (Freeze)

Keep separate:

- `MISSION`
- `OBJECTIVE`
- `GOAL`
- `CAMPAIGN`
- `TASK`
- `SUBTASK`
- `WORKFLOW_DEFINITION`
- `WORKFLOW_RUN`
- `WORKFLOW_STEP`
- `JOB`
- `EXECUTION_ATTEMPT`
- `SCHEDULER_ENTRY`
- `HANDOFF`
- `APPROVAL_REQUEST`
- `APPROVAL_DECISION`
- `RESULT`
- `FAILURE_RECORD`
- `EVENT`
- `NOTIFICATION`
- `RECOMMENDATION`
- `LEARNING_SIGNAL`
- `MEMORY_RECORD`
- `WORKSPACE`
- `SESSION`
- `CONVERSATION`
- `CHECKPOINT`
- `COORDINATION_MODE`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- task is not mission
- workflow definition is not workflow run
- workflow run is not job
- job is not execution attempt
- scheduler entry is not execution success
- handoff is not approval
- approval is not execution
- browser session is not durable workspace

## Task Vocabulary (Freeze)

Keep separate:

- `task_id`
- `task_type`
- `owner_role`
- `assignee_role`
- `review_role`
- `task_status`
- `task_lifecycle_state`
- `task_queue_status`
- `priority`
- `linked_entity`
- `workflow_id`
- `source_type`
- `source_id`
- `route_target`
- `handoff_roles`
- `task_output`
- `task_notes`
- `UNKNOWN_REQUIRES_PROOF`

Rule: task creation is not task execution and not task completion proof.

## Workflow Vocabulary (Freeze)

Keep separate:

- `workflow_definition_id`
- `workflow_run_id`
- `workflow_id`
- `workflow_type`
- `workflow_status`
- `workflow_lifecycle_state`
- `workflow_inputs`
- `workflow_outputs`
- `linked_entities`
- `intelligence_stamp`
- `workflow_output_artifact`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- workflow definition is not workflow run
- workflow run output is not mission completion
- workflow status strings do not prove a universal state machine

## Job / Execution Vocabulary (Freeze)

Keep separate:

- `job_id`
- `execution_id`
- `attempt_id`
- `execution_state`
- `execution_backend`
- `scheduled_at`
- `attempts`
- `max_attempts`
- `locked_at`
- `locked_by`
- `last_error`
- `package_payload`
- `result_reference`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- current scheduler `job.id` is not automatically `execution_id`
- current numeric attempts are not durable `attempt_id` records
- bridge execution result is not a universal execution contract

## Scheduler Vocabulary (Freeze)

Keep separate:

- `scheduler_entry_id`
- `schedule_type`
- `scheduled_at`
- `mode`
- `due`
- `running`
- `retryable`
- `completed`
- `failed`
- `lock_expired`
- `worker_id`
- `audit_log`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- scheduler entry is not mission schedule
- stale lock handling is not resume support
- retryable is not replayed or resumed

## Handoff Vocabulary (Freeze)

Keep separate:

- `handoff_id`
- `source_page`
- `destination_page`
- `source_role`
- `destination_role`
- `source_entity`
- `linked_entity`
- `payload`
- `handoff_status`
- `consumed_at`
- `expires_at`
- `route_key`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- handoff is not permission
- handoff is not approval
- handoff is not execution
- consumed handoff is not completed work

## Approval Vocabulary (Freeze)

Keep separate:

- `approval_id`
- `entity_type`
- `entity_id`
- `requested_action`
- `requested_by`
- `reviewer_role`
- `risk_level`
- `approval_status`
- `lifecycle_state`
- `decision_note`
- `linked_execution_id`
- `escalation_chain`
- `policy_flags`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- approved is not executed
- rejected is not technical failure
- escalated is not resume or retry

## Correlation Vocabulary (Freeze)

Keep separate:

- `mission_id`
- `root_correlation_id`
- `parent_id`
- `correlation_id`
- `trace_id`
- `workflow_id`
- `workflow_run_id`
- `task_id`
- `job_id`
- `execution_id`
- `attempt_id`
- `scheduler_id`
- `handoff_id`
- `approval_id`
- `entity_id`
- `source_id`
- `linked_entity`
- `project_id`
- `conversation_id`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- do not infer root mission correlation from independent entity IDs
- linked entity is not root correlation
- project scope is not mission scope

## State Vocabulary (Freeze)

Separate namespaces:

- `mission_state`
- `task_status`
- `task_lifecycle_state`
- `workflow_status`
- `workflow_lifecycle_state`
- `job_status`
- `execution_state`
- `scheduler_status`
- `handoff_status`
- `approval_status`
- `result_state`
- `failure_state`
- `workspace_state`

Rule: do not create a universal state machine from unrelated strings.

## Completion / Failure Vocabulary (Freeze)

Keep separate:

- `completed`
- `consumed`
- `approved`
- `published`
- `succeeded`
- `failed`
- `rejected`
- `cancelled`
- `retryable`
- `result_available`
- `artifact_saved`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- completion is not uniform across entities
- result available is not mission complete
- approval complete is not execution complete

## Retry / Resume / Replay / Cancel Vocabulary (Freeze)

Keep separate:

- `retry`
- `requeue`
- `resume`
- `replay`
- `restart`
- `recover`
- `cancel`
- `abort`
- `compensate`
- `rollback`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- retry is not resume
- retry is not replay
- cancel is not rollback
- stale lock recovery is not resumable execution proof

## Context / Scope Vocabulary (Freeze)

Keep separate:

- `project_context`
- `campaign_context`
- `customer_context`
- `conversation_context`
- `source_page`
- `destination_page`
- `role_context`
- `intent_context`
- `objective_context`
- `approval_context`
- `artifact_context`
- `provider_context`
- `memory_context`
- `browser_context`
- `session_context`
- `durable_context`
- `prompt_context`
- `execution_payload`
- `audit_context`
- `UNKNOWN_REQUIRES_PROOF`

Rule: browser/session context is not durable mission context.

## Workspace / Checkpoint Vocabulary (Freeze)

Keep separate:

- `workspace_id`
- `session_id`
- `conversation_id`
- `chat_session_id`
- `checkpoint_id`
- `resume_token`
- `workspace_history`
- `workspace_tab`
- `output_workspace_tab`
- `UNKNOWN_REQUIRES_PROOF`

Rules:

- conversation is not workspace by default
- browser-local chat session is not durable checkpoint
- no checkpoint/resume contract should be inferred where none is proved

## Learning Vocabulary (Freeze)

Keep separate:

- `recommendation_id`
- `memory_id`
- `learning_pattern`
- `confidence`
- `support_count`
- `learned_from`
- `evidence`
- `feedback_record_id`
- `job_id`
- `summary`
- `alerts`
- `UNKNOWN_REQUIRES_PROOF`

Rule: recommendation persistence is not closed-loop learning proof.

## Maturity / Test / Certification Vocabulary (Freeze)

Keep separate:

- `IMPLEMENTED`
- `IMPLEMENTED_UI_ONLY`
- `IMPLEMENTED_NOT_TESTED`
- `PARTIAL`
- `MISSING`
- `PARTIALLY_TESTED`
- `VALIDATOR_PRESENT`
- `NOT_TESTED`
- `NOT_CERTIFIED`
- `UNKNOWN_REQUIRES_PROOF`

Rule: syntax pass and historical PASS reports are not production certification.

## Future Mission Contract Fields (Recommendation Only)

### Identity

- `contract_version`
- `mission_id`
- `mission_type`
- `mission_kind`
- `root_correlation_id`
- `parent_mission_id`
- `source_vocabulary`
- `source_path`

### Scope

- `organization_id`
- `workspace_id`
- `project_id`
- `environment_id`
- `campaign_id`
- `customer_id`
- `conversation_id`

### Intent

- `objective`
- `desired_outcome`
- `success_criteria`
- `constraints`
- `priority`
- `risk_classification`

### Team

- `owner_role`
- `participant_roles`
- `reviewer_roles`
- `escalation_roles`
- `system_actor`

### Lifecycle

- `mission_state`
- `current_stage`
- `started_at`
- `completed_at`
- `canceled_at`
- `failure_state`
- `completion_reason`

### Links

- `task_ids`
- `workflow_ids`
- `job_ids`
- `scheduler_ids`
- `handoff_ids`
- `approval_ids`
- `artifact_ids`
- `result_ids`
- `learning_signal_ids`

### Recovery

- `resumable`
- `checkpoint_ids`
- `retry_policy`
- `resume_policy`
- `replay_policy`
- `cancellation_policy`
- `recovery_state`

### Governance

- `approval_state`
- `security_decision`
- `governance_decision`
- `audit_event_ids`

### Maturity

- `implementation_maturity`
- `test_maturity`
- `certification_state`
- `evidence_version`

## Future Workflow Contract Fields (Recommendation Only)

- `workflow_contract_version`
- `workflow_definition_id`
- `workflow_run_id`
- `mission_id`
- `root_correlation_id`
- `workflow_type`
- `workflow_version`
- `step_ids`
- `stage_ids`
- `current_step_id`
- `dependency_graph`
- `transition_rules`
- `terminal_states`
- `failure_states`
- `retry_policy`
- `resume_policy`
- `cancellation_policy`
- `approval_requirements`
- `context_snapshot`
- `result_ids`
- `artifact_ids`
- `event_ids`
- `project_id`
- `workspace_id`
- `created_by`
- `created_at`
- `completed_at`
- `implementation_maturity`
- `test_maturity`
- `certification_state`

## Future Execution Contract Fields (Recommendation Only)

- `job_id`
- `execution_id`
- `attempt_id`
- `mission_id`
- `workflow_run_id`
- `task_id`
- `scheduler_id`
- `root_correlation_id`
- `executor_type`
- `provider_id`
- `model_id`
- `worker_id`
- `payload_reference`
- `state`
- `attempt_number`
- `timeout_policy`
- `retry_policy`
- `idempotency_key`
- `cancellation_state`
- `resume_state`
- `replay_state`
- `result_reference`
- `failure_code`
- `failure_reason`
- `started_at`
- `finished_at`
- `audit_event_ids`
- `project_id`
- `environment_id`

## Federated Projection Plan

1. Read backbone durable ops records as one source family.
2. Read scheduler and execution bridge records as a second source family.
3. Read AI recommendation, memory, and learning stores as a third source family.
4. Read browser-local AI Command session/history context as a separate non-durable family.
5. Read customer-operations conversation runtime as a separate conversation domain and never treat it as mission workspace ownership.

## Shadow Comparison Plan

- Compare `teamMode` and Full Team UI language against durable writes and confirm no mission records are created.
- Compare `workflow_id` vs `workflow_run.id` vs scheduler `job.id` without destructive normalization.
- Compare approval decisions against actual workflow/job execution evidence.
- Compare handoff destinations against protected-route authority proofs.
- Compare scheduler retry behavior against claimed resume/replay semantics.
- Compare AI recommendations/memory against learning-store patterns and downstream actions.

## Migration Order

1. Freeze vocabulary and preserve raw current values.
2. Build federated read-only mission/workflow projections.
3. Add shadow comparison reports for correlation, execution, approval, and handoff drift.
4. Design mission/workflow/execution contracts after compatibility proof.
5. Add new producer fields before changing consumers.
6. Keep dual-read compatibility before any enforcement or deprecation.

## Rollback Plan

- Preserve raw IDs, raw route targets, raw pages, raw workflow IDs, raw job IDs, raw approval IDs, raw handoff IDs, and raw browser session values.
- Never rename existing IDs in place.
- Never collapse job IDs into execution IDs without compatibility proof.
- Never infer durable mission IDs from browser session or linked entity values.
- Any future migration must restore legacy reads without deleting new metadata.

## Extensibility Model

Future-only support should allow:

- custom mission types
- custom workflow types
- custom workflow steps
- custom task types
- custom schedulers
- custom execution adapters
- custom approval policies
- custom handoff types
- custom checkpoint strategies
- custom learning signals
- plugin-created missions
- organization-scoped missions
- project-scoped missions
- cross-project coordination with explicit grants

Rules:

- registration alone must not grant execution
- registration alone must not grant scheduling
- registration alone must not grant provider access
- registration alone must not grant project access
- registration alone must not grant approval authority
- registration alone must not grant context access

## Unresolved Decisions

- Whether mission should become a durable aggregate or remain a federated projection over multiple existing records.
- Whether workflow definitions should gain a separate durable owner before any mission contract work.
- Whether scheduler job IDs and future execution IDs should remain distinct.
- Whether browser-local AI Command sessions should ever become durable shared workspaces.
- Whether customer conversations should ever link into a mission/workflow aggregate or remain a separate domain.
- Whether closed-loop learning requires human validation before recommendation promotion.

## Forbidden Actions

- Do not create a global Mission Registry in Phase 1A-5.
- Do not create a global Workflow Registry in Phase 1A-5.
- Do not rename existing IDs in place.
- Do not collapse handoff and approval.
- Do not collapse approval and execution.
- Do not collapse retry and resume.
- Do not collapse browser sessions into durable workspaces.
- Do not infer root mission correlation from linked entities.

## Phase 1A-5 Exit Criteria

Phase 1A-5 is complete only when all items below are true:

- Exactly five approved mission/workflow documentation files exist.
- All five files contain the Phase 1A-5 freeze notice.
- Repository baseline and evidence pack were verified at the required HEAD.
- Durable mission aggregate absence or presence is classified from runtime proof, not naming.
- Full Team mode is explicitly separated from Mission aggregate claims.
- Workflow run, task, job, scheduler, handoff, and approval entities are separated.
- Root correlation gaps are explicit.
- Retry, resume, replay, cancel, and rollback are explicitly separated.
- Browser-local workspace/session state is separated from durable workspace claims.
- Learning/recommendation storage is separated from closed-loop mission learning claims.
- No runtime code, tests, scripts, configuration, or project data changed.
