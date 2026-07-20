# Mission and Workflow Phase 1A Closeout Decision

Status: Phase 1A documentation closeout decision

## Purpose and decision status

This decision closes Phase 1A-5 documentation by distinguishing current tasks, workflow runs, scheduler jobs, handoffs, approvals, and learning records from the unimplemented universal Mission aggregate. It is subordinate to the [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md).

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md`.
- Supporting records: [source inventory](MISSION_WORKFLOW_SOURCE_INVENTORY.md), [producer-consumer map](MISSION_WORKFLOW_CONSUMER_PRODUCER_MAP.md), [entity matrix](MISSION_TASK_WORKFLOW_JOB_MATRIX.md), [conflict register](MISSION_WORKFLOW_CONFLICT_REGISTER.md), and [vocabulary freeze](MISSION_WORKFLOW_VOCABULARY_FREEZE_RECOMMENDATION.md).

## Current Authority and Mutation Owners

Current authority remains federated by bounded runtime capability:

| Capability | Current authoritative owner | Current mutation owner |
| --- | --- | --- |
| Tasks and task-related operational evidence | Operations Backbone | Its explicit task lifecycle functions and related event or queue writers |
| Workflow definitions | No canonical durable workflow-definition owner is proven | None; frontend workflow vocabulary and playbooks are projections or drafts and cannot mutate a definition authority that does not exist |
| Workflow runs and run-related evidence | Operations Backbone | Its explicit workflow-run lifecycle functions and related event, notification, queue, or artifact writers |
| Scheduler jobs and scheduler audit evidence | Scheduler storage and helpers, together with installed scheduler handlers | Installed scheduler handlers acting through scheduler storage for job creation and transitions; the scheduler audit writer for its own evidence |
| Execution jobs, execution results, and domain evidence | The domain execution handler or bridge responsible for the applicable job type | That installed domain handler and its explicit result or evidence writer |
| Handoffs and approvals related to work coordination | Operations Backbone and the installed governance decision functions, each within its own record boundary | Their explicit handoff, approval, event, and linked-record lifecycle functions |

No page, preview, browser cache, checklist, report, or Mission terminology owns mutations. Where evidence is stored with a task, workflow run, scheduler job, execution result, handoff, or approval, it remains owned and mutated by that record's current domain owner.

## Entity Boundaries

- A **task** is a durable unit of operational work in the Operations Backbone.
- A **workflow definition** describes a reusable workflow; no canonical durable definition registry is proven here.
- A **workflow run** is a durable record of one workflow invocation and is not its definition.
- A **job** is a scheduler-owned execution record and is not a workflow run or a Mission.
- An **execution** is the domain handler's attempt to perform job-specific work; a separate durable execution-attempt identity is not proven.
- A **Mission** would be a durable coordinating aggregate across intent, plan, tasks, runs, jobs, executions, approvals, results, and learning. That aggregate is not implemented in the current runtime.

## Projection Boundaries

Producers include Operations Backbone functions, workflow and scheduler handlers, governance decision functions, execution bridges, and domain job owners. Consumers include Workflows, AI Command, Task/Queue/Job centers, Governance, Publishing, Insights, and domain handlers. Frontend previews, Full Team Mission UX, AI Full Team coordination, browser sessions, page handoffs, reports, and status summaries are projections or compatibility transports. They must not become mutation authorities and do not constitute a Mission runtime.

## Scope and compatibility

- **Project scope:** current durable operational entities are Project-scoped unless a source explicitly states otherwise.
- **Workspace scope:** Workspace-to-Project relationships exist, but no durable Workspace Mission aggregate or Workspace Mission permission model exists.
- **Compatibility behavior:** route aliases, transient browser context, page destinations, entity-specific correlation fields, and legacy scheduler/execution shapes remain source-qualified compatibility behavior.

## Current verified capabilities

Durable task, workflow-run, handoff, approval, event, and selected scheduler/job records exist with domain-specific identities and lifecycle handling. These are reusable foundations. A workflow definition is not a run; a scheduler entry is not execution; a handoff is not permission; approval is not execution; result storage is not learning closure.

## Explicit non-capabilities and unresolved contradictions

- No durable `mission_id`, Mission store, universal objective/plan aggregate, root correlation, execution-attempt identity, checkpoint/resume protocol, or universal intent-to-learning chain is proven.
- Mission-like UI coordination coexists with multiple durable entity models and must not be reported as a Mission runtime.
- Entity status, retry, failure, resume, replay, approval, and completion vocabularies remain domain-specific.

## Deferred Mission Aggregate

A universal durable Mission aggregate is not implemented in the current runtime. A future Mission coordination contract may be proposed only as a declarative orchestration layer over existing task, workflow, scheduler, governance, execution, artifact, and memory owners. It must delegate each durable mutation to the current domain owner rather than duplicate a store, lifecycle, or mutation path. Deferred work includes a root identity, correlation mapping, attempts, checkpoints, result/artifact linkage, approval consumption, idempotency, and learning closure.

## Adoption gate and validation requirements

Adoption requires a fresh inventory, collision-free identity and state mappings, Project/Workspace permission design, compatibility and migration plans, shadow correlation, idempotency and retry proof, crash/recovery tests, approval-to-execution linkage, artifact/result lineage, and end-to-end learning evidence without duplicate stores.

## Non-production-certification statement

This Phase 1A closeout is documentation-only and is not runtime certification. It does not certify workflow execution, scheduler durability, retry safety, recovery, provider success, Mission execution, or production readiness.

## Phase 1A closeout verdict

`PHASE_1A_5_DOCUMENTATION_CLOSED=YES` — current workflow ownership is preserved; a universal Mission runtime remains deferred.
