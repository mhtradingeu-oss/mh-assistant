# Provider Vocabulary Freeze Recommendation

> This Phase 1A-3 inventory freezes observed provider vocabulary and records recommendations only. It does not approve provider IDs, provider operations, application actions, adapter actions, models, workers, credentials, configuration, health, routing, fallback, execution, certification, migrations, schemas, registries, or runtime changes.

## Executive Recommendation

Freeze the current vocabulary as a read-only evidence layer and do not collapse AI, media, integration, customer-operations, model, or worker sources into a single global provider contract yet.

Recommended next step:

1. Build a federated read-only projection over the current AI, media, integration, customer, model, and worker sources.
2. Shadow-compare provider IDs, model IDs, worker IDs, readiness labels, and unsupported states across the current registries.
3. Design Phase 1B contracts only after the projection proves which values are stable, duplicated, or incompatible.

## Frozen Vocabulary

### Provider State Vocabulary

Use these states only as independent dimensions:

- NAMED
- DOCUMENTED
- CATALOGED
- REGISTERED
- ADAPTER_PRESENT
- OPERATION_DECLARED
- CONFIGURED
- CREDENTIALED
- HEALTH_CHECK_SUPPORTED
- HEALTHY
- ROUTABLE
- SELECTABLE
- FALLBACK_CAPABLE
- WORKER_AVAILABLE
- MODEL_AVAILABLE
- EXECUTION_ATTEMPTED
- EXECUTION_SUCCEEDED
- OUTPUT_NORMALIZED
- TESTED
- CERTIFIED_CURRENT_HEAD
- UNSUPPORTED
- BLOCKED
- DISABLED
- UNKNOWN_REQUIRES_PROOF

### Provider Domain Vocabulary

Use only the domains already observed in current-head source and UI projections:

- AI / LLM
- Media
- Voice / Audio
- Commerce / Integration
- Communication
- Infrastructure
- Security / Governance
- Frontend projection

### Conceptual Provider Operation Vocabulary

Use conceptual provider operations as a separate namespace:

- chat.generate
- text.generate
- text.structured_generate
- image.generate
- image.edit
- video.generate
- speech.generate
- speech.transcribe
- voice.realtime

### MH-OS Application Action Vocabulary

Use application action vocabulary separately from provider operations:

- guidance
- ad_ideas
- content_pack
- seo_plan
- research_report
- operations_plan
- video_brief
- voice_script
- campaign_pack
- prompt_improve
- brand_check

### Integration Adapter Action Vocabulary

- connect
- testConnection
- syncCurrent
- importHistory

### Job / Workflow Action Vocabulary

- job.dispatch
- retry
- cancel
- resume

Application actions and adapter actions are not provider operations merely because they eventually use a provider.
Any unproven mapping must remain UNKNOWN_REQUIRES_PROOF.

### Model / Worker Vocabulary

Keep model IDs and worker IDs raw and domain-scoped.

- Model IDs must remain separate from provider IDs.
- Worker IDs must remain separate from model IDs.
- A catalog row is not a selectable runtime model.
- A worker record is not a healthy worker.
- A demo worker ID is not a production worker ID.

### Configuration / Credential Vocabulary

Keep these dimensions separate:

Configuration declaration state:

- CONFIG_NOT_DECLARED
- CONFIG_REFERENCE_DECLARED
- CONFIG_PRESENT
- CONFIG_VALUE_NOT_INSPECTED
- CONFIG_VALIDATION_NOT_PERFORMED
- CONFIG_VALIDATED
- UNKNOWN_REQUIRES_PROOF

Credential reference state:

- CREDENTIAL_REFERENCE_NOT_DECLARED
- CREDENTIAL_REFERENCE_PRESENT
- UNKNOWN_REQUIRES_PROOF

Credential value state:

- CREDENTIAL_VALUE_NOT_INSPECTED
- CREDENTIAL_VALUE_PRESENT
- CREDENTIAL_VALUE_MISSING
- UNKNOWN_REQUIRES_PROOF

Credential validation state:

- CREDENTIAL_VALIDATION_NOT_PERFORMED
- CREDENTIAL_VALIDATED
- CREDENTIAL_INVALID
- UNKNOWN_REQUIRES_PROOF

Catalog key references for google, runway, kling, and pika prove only reference declaration, not execution, health, routing, or certification.

### Health / Readiness Vocabulary

Keep these concepts separate:

- CONFIGURATION_READINESS
- CREDENTIAL_READINESS
- ADAPTER_READINESS
- MODEL_READINESS
- WORKER_READINESS
- ROUTE_READINESS
- HEALTH_CHECK_SUPPORTED
- HEALTHY
- DEGRADED
- BLOCKED
- UNSUPPORTED
- UNKNOWN_REQUIRES_PROOF

### Routing / Fallback Vocabulary

Keep these concepts separate:

- provider lookup
- adapter dispatch
- model selection
- worker selection
- policy routing
- global routing
- fallback provider
- fallback model
- fallback worker

Do not create a global Provider Router in Phase 1A-3.

### Implementation / Test / Certification Vocabulary

Implementation maturity:

- IMPLEMENTED_PATH
- PARTIAL
- ADAPTER_ONLY
- CATALOG_ONLY
- REGISTRY_ONLY
- FRONTEND_ONLY
- LOCAL_RUNTIME_WRAPPER
- BLOCKED
- UNSUPPORTED
- MISSING
- UNKNOWN_REQUIRES_PROOF

Test maturity:

- TESTED_CURRENT_HEAD
- PARTIALLY_TESTED
- STATIC_ONLY
- AUDIT_ONLY
- DEMO_ONLY
- NOT_TESTED
- TEST_GAP
- UNKNOWN_REQUIRES_PROOF

Production certification:

- CERTIFIED_CURRENT_HEAD
- NOT_CERTIFIED
- UNSUPPORTED
- BLOCKED
- NOT_APPLICABLE
- UNKNOWN_REQUIRES_PROOF

These dimensions must never be collapsed.

### Reliability Vocabulary

Keep these concepts explicit per operation:

- timeout
- retry
- backoff
- rate limit handling
- idempotency key
- deduplication
- cancellation
- resume

### Cost / Privacy / Region Vocabulary

Use only raw, observed metadata fields:

- estimated cost
- actual cost
- token usage
- media usage
- request units
- budget limit
- provider pricing
- privacy classification
- sensitive-data allowance
- PII restrictions
- retention behavior
- training-data behavior
- region
- local / cloud
- consent
- redaction

### Scope Vocabulary

Keep these scopes separate:

- credential_scope
- configuration_scope
- execution_scope
- data_scope
- project_scope
- organization_scope
- environment_scope
- browser_scope
- process_scope

Example: OPENAI_API_KEY can be process scoped for credential reference while execution data may include project context.

### Output / Artifact Vocabulary

Keep these concepts separate:

- raw provider response
- normalized provider response
- normalized domain result
- transient result
- durable record
- asset
- artifact
- external result reference
- audit record
- response_normalization_state
- domain_result_normalization_state
- output materiality
- artifact_behavior
- external_reference_behavior
- storage_behavior

## Future Contract Fields

Recommend the following future-only contract groups without creating a schema:

### Identity

- contract_version
- provider_domain
- conceptual_provider_id
- raw_provider_id
- source_vocabulary
- source_path
- adapter_id

### Operation

- provider_operation_id
- conceptual_provider_operation
- raw_provider_operation
- operation_namespace
- observed_application_action
- observed_adapter_action
- operation_adoption_status
- supported_inputs
- supported_outputs
- model_ids
- worker_requirements

### Configuration And Credentials

- configuration_state
- credential_reference_state
- credential_value_state
- credential_validation_state
- credential_scope
- environment_scope
- redaction_policy

### Health And Routing

- health_check_supported
- health_state
- readiness_state
- routing_state
- selection_policy
- fallback_policy
- local_cloud_type
- region

### Reliability

- timeout_policy
- retry_policy
- backoff_policy
- rate_limit_policy
- idempotency_policy
- cancellation_policy

### Governance And Data

- security_gate
- approval_requirement
- privacy_classification
- sensitive_data_policy
- retention_policy
- project_scope
- organization_scope
- data_scope

### Cost And Observability

- pricing_metadata
- estimated_cost
- actual_usage
- request_id
- correlation_id
- job_id
- duration
- attempt
- error_code
- audit_event

### Output And Certification

- output_normalization
- artifact_behavior
- implementation_maturity
- test_maturity
- certification_state
- unsupported_reason
- evidence_version

### Decision Provenance

- selection_reason
- fallback_reason
- security_decision
- approval_decision
- output_normalization_state
- artifact_decision
- organization_id
- workspace_id
- project_id
- environment_id
- decision_timestamp

These are recommendations only and are not approved runtime IDs or schema fields.

## Federated Projection Plan

1. Read current AI registry and provider config as one source family.
2. Read current media catalog, media readiness, native model registry, worker registry, and provider router as a second family.
3. Read current integration registry and adapter manager as a third family.
4. Read security and governance gates as a fourth family.
5. Read frontend projections separately and never treat labels as authority.

## Shadow Comparison Plan

- Compare raw provider IDs without normalizing away domain differences.
- Compare readiness labels against actual router decisions.
- Compare model catalogs against registered and enabled model lists.
- Compare worker registry state against worker selection and dispatch outcomes.
- Compare unsupported UI rows against unsupported backend wrappers.

## Migration Order

1. Freeze current vocabulary and keep raw values.
2. Build a federated read-only projection.
3. Add shadow comparison reports.
4. Design contract fields only after drift is measured.
5. Introduce compatibility layers only after proof, not before.

## Rollback Plan

- Keep all current-head raw values available.
- Do not rewrite provider IDs, model IDs, worker IDs, or unsupported IDs in place.
- If a future projection proves incorrect, revert only the projection layer first.

## Extensibility Model

Allow future support for custom AI providers, custom media providers, custom integration providers, custom local runtimes, custom models, custom workers, organization-scoped providers, project-scoped providers, and environment-scoped configuration only through separate adapters and projections.

Registration alone must not grant visibility, selection, routing, credential access, execution, fallback participation, project access, or production certification.

## Unresolved Decisions

- Whether a future provider contract should unify AI and media provider IDs or keep domain-scoped IDs.
- Whether local and worker-executed models should share a single selection vocabulary.
- Whether readiness should ever be represented as a boolean in future contracts.
- Whether unsupported providers should remain explicit wrapper states or become separate registry records.
- Whether voice_chat should remain raw runtime vocabulary while voice.realtime remains conceptual only.

## Forbidden Actions

- Do not create a global Provider Router.
- Do not rename current provider IDs.
- Do not renormalize model IDs into provider IDs.
- Do not merge readiness with health.
- Do not infer certification from syntax, audit scripts, or historical PASS documents.
- Do not collapse unsupported states into missing states.
- Do not normalize provider IDs globally across provider_domain boundaries.
- Do not silently normalize voice_chat, video_brief, voice_script, prompt_improve, or brand_check into provider operation claims.

## Future Namespace Model (Illustrative Only)

Illustrations only, not approved runtime IDs:

- provider.ai.openai
- provider.media.openai
- provider.integration.google
- provider_operation.text.generate
- provider_operation.image.generate
- application_action.ai.guidance
- application_action.media.video_brief
- adapter_action.integration.test_connection
- adapter_action.integration.sync_current
- model.openai.gpt_image_example

These are namespace illustrations only and are not approved runtime IDs.

## Ingress / Egress / Raw Preservation Recommendation (Future Only)

- normalize only at typed ingress boundaries
- retain raw provider, model, worker, and action IDs
- retain source_vocabulary and provider_domain
- emit explicit target vocabulary at egress
- never perform context-free global normalization
- never rewrite stored IDs destructively
- record normalization reason and contract_version

Do not implement this in Phase 1A-3.

## Phase 1A-3 Exit Criteria

Phase 1A-3 is complete only when all items below are true:

- Exactly five approved provider documentation files exist.
- All five files contain the freeze notice.
- Provider families and individual providers are distinguishable.
- Provider IDs are domain-scoped and source-qualified.
- Provider operation, application action, and adapter action are distinct.
- Configuration state and credential states are distinct.
- credential_reference_state, credential_value_state, and credential_validation_state are distinct.
- Implementation, test, and certification states are distinct.
- Implemented path and execution success are distinct.
- Readiness and health are distinct.
- Model ID and provider ID are distinct.
- Worker record and worker health are distinct.
- Google and OpenAI provider domain collisions are documented.
- ComfyUI and ElevenLabs current-head status are explicit.
- Customer Operations and Infrastructure provider gaps are explicit.
- cost, privacy, and region metadata gaps are explicit.
- Output normalization and artifact behavior are distinct.
- Scope taxonomy is explicit and separated.
- Conflict severities use CRITICAL, HIGH, MEDIUM, or LOW only.
- Target phases use precise phase names.
- Raw values are preserved and no global Provider Router is approved.
- No provider is promoted to healthy or certified without proof.
- No secret value is included.
- No runtime code, project data, configuration, or environment state changed.
