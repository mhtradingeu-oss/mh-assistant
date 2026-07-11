# Capability Vocabulary Freeze Recommendation

> **Phase 1A-2 freeze notice:** This Phase 1A-2 inventory freezes observed capability vocabulary and records recommendations only. It does not approve capability IDs, tool IDs, action IDs, provider operations, model IDs, provider routing, execution behavior, permissions, approvals, migrations, registries, schemas, or runtime changes.

## Documentation authority

Current production code is implementation truth. Phase 1A-2 documentation is a scoped architectural inventory and freeze baseline only. A future approved Capability Contract may become future contract authority only after explicit review, shadow comparison, validation, migration approval and adoption.

## Executive recommendation

Freeze every observed tool/action/provider/model/job/output identifier. Do not unify or rename them. Phase 1B should begin with an additive federated projection over existing sources, preserving raw IDs and current decisions; it must not begin with a replacement registry.

## Namespace recommendation (future only)

Separate these namespaces explicitly:

- conceptual capability namespace
- tool namespace
- action namespace
- provider-operation namespace
- model namespace
- workflow-operation namespace
- job-operation namespace
- artifact-type namespace

Illustrative future examples only: `capability.content.rewrite`, `tool.ai_command.rewrite`, `action.content.preview_rewrite`, `provider.openai.text.generate`, `model.openai.example_model`, `workflow.content.review`, `job.media.render`, `artifact.content_draft`.

These examples are namespace illustrations only and are not approved runtime IDs.

## Proposed conceptual vocabulary

Use future conceptual families such as content transformation, research/evidence, media generation, media transformation, publishing preparation, publishing execution, ads planning, customer service, sales/CRM, operational orchestration, intelligence, integration sync, artifact production, Software / Web Engineering and Administrative Coordination only as projection groupings. Proposed capability IDs must remain `PROPOSED_NOT_APPROVED` until mapped to current tools, actions, handlers and outputs with shadow proof.

Preserve source-qualified tool and action IDs. Classify aliases as legacy ID, display variant, intent keyword, prompt tool, route action, provider operation or contextual alias. Similar labels do not establish equivalence.

A capability family groups related concepts for inventory readability only. It does not prove equivalence of member tools, actions, handlers, providers, permissions, outputs or maturity.

## State vocabulary

- UI modes: `QUICK_ACTION`, `WORKSPACE`, `WORKFLOW`, `BACKGROUND_JOB`, `EXTERNAL_EXECUTION`, `PREVIEW_ONLY`, `DRAFT_ONLY`, `READ_ONLY`, `UNKNOWN`.
- Execution transport: `FRONTEND_LOCAL`, `SYNC_BACKEND_REQUEST`, `ASYNC_JOB`, `DURABLE_TASK`, `WORKFLOW_STEP`, `SCHEDULED_EXECUTION`, `EXTERNAL_SIDE_EFFECT`, `UNKNOWN`.
- Durability requirement: `TRANSIENT`, `SESSION_DURABLE`, `PROJECT_DURABLE`, `ORGANIZATION_DURABLE`, `EXTERNAL_SYSTEM_DURABLE`, `UNKNOWN`.
- Decision states: `TOOL_VISIBLE`, `TOOL_SELECTABLE`, `TOOL_USABLE`, `TOOL_PREVIEWABLE`, `TOOL_DRAFT_CAPABLE`, `TOOL_EXECUTABLE`, `PROVIDER_EXECUTABLE`, `WORKFLOW_EXECUTABLE`, `APPROVAL_GATED`, `ARTIFACT_PRODUCING`.
- Implementation maturity: `IMPLEMENTED`, `PARTIAL`, `BACKEND_ONLY`, `FRONTEND_ONLY`, `UI_PLACEHOLDER`, `BLOCKED`, `PLANNED`, `MISSING`, `UNKNOWN_REQUIRES_PROOF`.
- Test maturity: `TESTED_CURRENT_HEAD`, `PARTIALLY_TESTED`, `STATIC_ONLY`, `NOT_TESTED`, `UNKNOWN_REQUIRES_PROOF`.
- Production certification: `CERTIFIED_CURRENT_HEAD`, `NOT_CERTIFIED`, `BLOCKED`, `NOT_REQUIRED`, `UNKNOWN_REQUIRES_PROOF`.
- Output materiality: `TRANSIENT_RESULT`, `DRAFT_OUTPUT`, `DURABLE_RECORD`, `ARTIFACT`, `ASSET`, `EXTERNAL_RESULT_REFERENCE`, `NO_OUTPUT`, `UNKNOWN`.

Do not infer execution transport or durability from UI mode alone. A `QUICK_ACTION` may still use `SYNC_BACKEND_REQUEST`; a `WORKSPACE` may still create an `ASYNC_JOB`; a `PREVIEW_ONLY` action may still be `TRANSIENT`.

Do not infer production certification from syntax validity, route presence, UI presence, registry presence or historical PASS claims.

## Provider operation precision

Use `provider_capability_operation` as a field separate from `provider_id`, `model_id` and `worker_id`.

Illustrative examples only:

- `provider_id = openai`
- `provider_capability_operation = text.generate`
- `provider_capability_operation = image.generate`
- `model_id = gpt-image-1`

These examples are namespace illustrations only and are not approved runtime IDs. Do not claim current provider support without exact adapter and execution evidence.

## Confirmation and approval taxonomy

Keep these decisions separate:

- `USER_CONFIRMATION`
- `ROLE_REVIEW`
- `FORMAL_APPROVAL`
- `POLICY_DECISION`
- `EXECUTION_AUTHORIZATION`
- `AUDIT_RECORD`

Saving a draft may require `USER_CONFIRMATION` only. Publishing may require `FORMAL_APPROVAL` and `EXECUTION_AUTHORIZATION`. Budget spending may require `POLICY_DECISION` and `FORMAL_APPROVAL`. Frontend wording must not be treated as proof of backend enforcement.

## Ownership and boundary recommendations

Role/page ownership describes responsibility and visibility, not use or execution permission. Provider requirements must separate name, catalog, registered, configured, credentialed, healthy, routable, adapted, executed, tested and certified. Sensitive external, destructive, financial, publishing, customer-facing, credential-sensitive or data-sensitive actions require independently proven confirmation, approval/reviewer, governance gate, execution gate and audit event.

Every output-producing capability should eventually record artifact/asset ID, type, storage, producer, provider, source provenance, approval, checksum, version, lineage, rollback, retention and sensitivity. Until then, output existence does not prove a universal Artifact Contract.

A rewrite response may be `TRANSIENT_RESULT` or `DRAFT_OUTPUT`. A generated image becomes an `ASSET` only after storage succeeds. A publishing result may be an `EXTERNAL_RESULT_REFERENCE` plus an `AUDIT_RECORD`. Artifact production must never be inferred merely from output existence.

Default future scope is project-scoped. Brand/campaign/customer/conversation/organization/shared knowledge, memory read/write and cross-project access require explicit grants. Current isolation completeness remains UNKNOWN_REQUIRES_PROOF.

## Scope model (future only)

Distinguish these scope fields explicitly: `organization_id`, `workspace_id`, `project_id`, `environment_id`, `brand_id`, `campaign_id`, `customer_id`, `conversation_id`.

Environment examples: `development`, `staging`, `production`, `sandbox`.

Project-scoped remains the default future recommendation. Cross-project or organization-wide access requires explicit grants. Current cross-project isolation remains `UNKNOWN_REQUIRES_PROOF` unless code and tests prove it.

## Future capability families (future only)

Software / Web Engineering may eventually include `code_analysis`, `code_generation`, `refactor`, `test_generation`, `technical_audit`, `accessibility_audit`, `performance_audit`, `technical_seo_audit`, `patch_preparation`, `pull_request_preparation`, and `deployment_preparation`.

`code_generation` does not imply repository write, commit, merge, deployment or production authority. This family supports the future Web Developer AI specialist from Phase 1A-1 only as a recommendation.

Administrative Coordination may eventually include `meeting_summary`, `meeting_preparation`, `agenda_draft`, `follow_up_draft`, `reminder_draft`, `calendar_proposal`, `inbox_triage`, `document_organization`, and `administrative_handoff`.

`calendar_proposal` does not imply calendar write. `email_draft` does not imply email send. `reminder_draft` does not imply scheduled execution. Administrative coordination does not imply admin authority. This family supports the future Executive Assistant specialization from Phase 1A-1 only as a recommendation.

AI Production must stay split into separate future families: `deep_research_workspace`, `document_production`, `presentation_production`, `spreadsheet_production`, `growth_page_production`, `full_team_mission`, `long_running_workspace`. Each retains independent implementation maturity, test maturity and production certification.

Do not infer implementation merely because component ingredients exist. These future families depend on Mission Contract, Artifact Contract, Version Contract, Provider Contract, job and workflow integrity, approval and governance, resume/cancel/retry behavior, and cost and observability foundations.

Intelligence must stay split into separate future or current conceptual members: `recommendation_generation`, `next_best_action`, `learning_pattern_update`, `anomaly_detection`, `forecasting`, `simulation`, `executive_brief_generation`.

Do not promote `forecasting` or `simulation` based on recommendation code alone.

## Phase 1B contract fields (future only)

Identity/provenance: `contract_version`, `conceptual_capability_id`, `raw_capability_id`, `raw_tool_id`, `raw_action_id`, `source_vocabulary`, `source_path`, `source_symbol`.

Experience/authority: display label, UI mode, execution transport, durability requirement, visibility decision, selection decision, use decision, execution decision, role/page owner/support, route/handler, decision reasons.

Execution/dependencies: execution mode, workflow/job/task/mission/scheduler dependencies, provider ID, `provider_capability_operation`, model ID, worker ID, timeout/retry/fallback, approval/governance/audit requirements.

Output/scope: inputs, output types, output materiality, artifact/version/lineage, memory/context/project/organization/storage scopes, implementation maturity, test maturity, production certification, compatibility and migration metadata.

## Decision provenance (future only)

Recommend future shadow and decision provenance fields:

- `raw_capability_id`
- `raw_tool_id`
- `raw_action_id`
- `source_vocabulary`
- `conceptual_capability_id`
- `provider_id`
- `provider_capability_operation`
- `model_id`
- `visibility_decision`
- `use_decision`
- `execution_decision`
- `approval_decision`
- `artifact_decision`
- `project_id`
- `environment_id`
- `normalization_rule_id`
- `normalization_reason`
- `decision_reason`
- `contract_version`
- `evidence_version`
- `decision_timestamp`

## Federated projection and shadow plan

Read existing tool docks, page actions, backend services, provider/model/worker registries, workflow/job definitions and output writers without changing ownership. Produce a versioned read-only projection containing raw provenance and independent state dimensions. For every raw ID, compare legacy and proposed visibility, use, execution, provider, approval, artifact and scope decisions. Any privilege widening, provider reroute, unknown fallback, lost provenance or cross-project difference blocks adoption.

## Ingress and egress rule (future only)

Normalize only at typed ingress boundaries. Preserve raw and source IDs in storage and audit. Emit an explicit target vocabulary at egress boundaries. Never perform context-free global normalization.

## Migration and rollback

1. Freeze/hash sources and count raw persisted/session values.
2. Complete Phase 1A-3 provider inventory.
3. Design Phase 1B schema only after review.
4. Add read-only projection and shadow logging.
5. Resolve conflicts and certify per capability/provider/action.
6. Migrate producers before consumers, additively and project by project.
7. Enforce only after security review and rollback rehearsal.

Rollback disables the future projection/enforcement, restores existing source decisions, and retains all raw IDs/fields. No destructive rewrite is acceptable.

## Extensibility model (future only)

Organization/project capabilities, custom roles/modules/tools/providers and plugin/module manifests should declare dependencies, scope, feature flags, licensing/readiness, versions, provider/capability grants and approval requirements. Registration alone grants no visibility, use, execution, provider or cross-project authority. Extensions must remain isolated and source-qualified.

## Unresolved decisions

Provider certification; universal artifact/version semantics; mission/long-running workspace model; organization scope; cross-project isolation; cost/privacy metadata; per-provider fallback/retry; exact equivalence of duplicated tools/actions; and maturity of requested media transforms/AI Production capabilities.

## Forbidden actions

No runtime change, registry/schema/validator/adapter/migration, rename, routing change, permission/approval change, provider call, workflow/job execution, project-data write, commit or push.

## Phase 1A-2 exit criteria

Five documents exist; sources/IDs/edges/conflicts are inventoried; visibility/use/execution and provider states remain separate; unsupported/unknown capabilities are not promoted; the freeze recommendation is future-only; validation passes; and no runtime/project-data change occurred.
