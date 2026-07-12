# Artifact / Version Vocabulary Freeze Recommendation

This Phase 1A-4 inventory freezes observed artifact, asset, output, version, revision, lineage, checksum, storage, retention, rollback, identity, locator, and durability vocabulary and records recommendations only. It does not approve artifact IDs, asset IDs, version fields, revision fields, storage paths, retention behavior, rollback behavior, migrations, schemas, registries, or runtime changes.

## Executive Recommendation

Freeze current vocabulary as federated, domain-scoped, read-only evidence.
Do not collapse artifact/asset/result/registry vocabularies or version/revision/history/snapshot vocabularies into a single global contract during Phase 1A-4.

## Implementation Truth vs Authority

- Implementation-truth priority: current production runtime code.
- Evidence priority: source-proven writer/resolver behavior.
- Authorization authority: security and route authorization only.
- Governance authority: approval/policy decisions only.
- Contract authority: future approved contract only.

## Output Materiality Vocabulary (Freeze)

- TRANSIENT_RESULT
- PREVIEW
- DRAFT_OUTPUT
- SESSION_STATE
- BROWSER_CONTEXT
- DURABLE_OPERATIONAL_RECORD
- DURABLE_DOMAIN_RECORD
- IN_MEMORY_RUNTIME_RECORD
- NON_DURABLE_RUNTIME_RECORD
- RUNTIME_REGISTRY_RECORD
- PROCESS_LIFETIME_STORE
- ASSET
- ARTIFACT
- DOCUMENT
- REPORT
- EXPORT_PACKAGE
- EXTERNAL_RESULT_REFERENCE
- PUBLICATION_REFERENCE
- AUDIT_RECORD
- JOB_RESULT_ENVELOPE
- RUNTIME_RESULT_CONTRACT
- UNKNOWN_REQUIRES_PROOF

## Source Classification Vocabulary (Freeze)

- OUTPUT_PRODUCER
- ARTIFACT_WRITER
- ASSET_WRITER
- STORAGE_RESOLVER
- PROJECT_SCOPE_SOURCE
- VERSION_FIELD_SOURCE
- REVISION_FIELD_SOURCE
- HISTORY_SOURCE
- LINEAGE_SOURCE
- PROVENANCE_SOURCE
- RESULT_ENVELOPE_SOURCE
- RUNTIME_REGISTRY_SOURCE
- NON_DURABLE_STORE
- PROCESS_LIFETIME_STORE
- ATOMIC_WRITE_SOURCE
- DURABILITY_HELPER
- BACKUP_SOURCE
- QUARANTINE_SOURCE
- LOCATOR_SOURCE
- FILE_PATH_SOURCE
- EXTERNAL_REFERENCE_SOURCE
- PUBLICATION_REFERENCE_SOURCE
- DISABLED_COMPATIBILITY_ROUTE
- DOMAIN_SPECIFIC_ROLLBACK_SOURCE
- UNKNOWN_REQUIRES_PROOF

## Identity / Locator Vocabulary (Freeze)

Keep separate:

- IDENTITY_FIELD
- identity_kind
- identity_scope
- identity_stability
- identity_collision_state
- raw_identity_value
- source_identity_value
- source_identity_type
- source_vocabulary
- LOCATOR
- STORAGE_KEY
- FILE_PATH
- RELATIVE_PATH
- EXTERNAL_URL
- PROVIDER_REFERENCE
- DISPLAY_FILENAME
- SOURCE_FILENAME
- PATH_DERIVED_KEY
- UNKNOWN_REQUIRES_PROOF

Future-only identity_kind values:

- GENERATED_ID
- DOMAIN_RECORD_ID
- EXTERNAL_PROVIDER_ID
- CALLER_PROVIDED_ID
- COMPOSITE_ID
- PATH_DERIVED_ID
- FILENAME_DERIVED_ID
- URL_DERIVED_ID
- COALESCED_PROJECTION_ID
- UNKNOWN_REQUIRES_PROOF

## Version / Revision / History / Snapshot Vocabulary (Freeze)

Keep separate:

- version_scope
- version_semantics
- version_authority
- version_mutability
- version_ordering
- version_source
- version_storage
- version_current_pointer
- version_restore_eligibility
- revision_scope
- history_kind
- snapshot_kind
- revision
- revisions[]
- current_revision_id
- output_versions[]
- preview_history[]
- history[]
- contract_version
- protocol_version
- version_id (UI/domain scoped label)
- UNKNOWN_REQUIRES_PROOF

Future-only version_scope values:

- CONTENT_REVISION
- MEDIA_OUTPUT_VERSION
- PROTOCOL_VERSION
- CONTRACT_VERSION
- SCHEMA_VERSION
- BUSINESS_VERSION
- STORAGE_VERSION
- UI_VERSION_LABEL
- SNAPSHOT_SEQUENCE
- UNKNOWN_REQUIRES_PROOF

## Lifecycle Namespace Vocabulary (Freeze)

Separate namespaces:

- draft_state
- review_state
- approval_state
- governance_state
- finalization_state
- publication_state
- archive_state
- deletion_state
- immutability_state
- storage_state
- external_reference_state

## Integrity Vocabulary (Freeze)

Separate concerns:

- FILESYSTEM_WRITE_INTEGRITY_ONLY
- atomic_write
- tmp_file
- backup_copy
- corrupt_quarantine
- checksum_generated
- checksum_stored
- checksum_validated
- checksum_enforced
- duplicate_detection
- UNKNOWN_REQUIRES_PROOF

Rule: atomic write is not content checksum enforcement and not end-to-end semantic integrity.

## Retention / Backup / Restore / Rollback Vocabulary (Freeze)

Separate concerns:

- collection truncation behavior
- max_collection_length
- truncation_strategy
- retention_policy_state
- retention_duration
- retention_trigger
- legal_hold
- archive_policy
- backup_supported
- backup_validation_state
- restore_supported
- restore_point
- rollback_supported
- rollback_target
- recovery_supported
- DOMAIN_SPECIFIC_EXTERNAL_ENTITY_ROLLBACK
- UNKNOWN_REQUIRES_PROOF

Rules:

- bounded collection is not retention policy
- backup copy is not complete restore flow
- retry/resume/replay are not rollback

## Scope Taxonomy (Freeze)

- organization_scope
- workspace_scope
- project_scope
- environment_scope
- process_scope
- browser_scope
- session_scope
- storage_scope
- data_scope
- visibility_scope
- retention_scope
- identity_scope

## Domain-Specific Clarifications

- Record name ai_artifact proves a domain record and domain writer behavior only.
- It does not prove universal artifact identity, checksum, immutable version chain, or rollback eligibility.
- Worker result contract fields (completed_at, metadata, outputs[]) do not prove durable snapshot semantics without separate snapshot writer/store proof.
- Disabled 410 compatibility routes prove blocked/absent lifecycle support, not restore support.

## Future Artifact Contract Fields (Recommendation Only)

### Identity

- contract_version
- conceptual_artifact_type
- raw_output_type
- materiality_class
- artifact_id
- asset_id
- document_id
- report_id
- external_reference_id
- identity_kind
- identity_scope
- identity_stability
- identity_collision_state
- raw_identity_value
- source_identity_value
- source_identity_type
- source_vocabulary
- source_path

### Locator and Storage

- locator
- storage_key
- storage_provider
- storage_path
- relative_path
- external_url
- display_filename
- original_filename
- external_reference_type

### Producer and Provenance

- producer_type
- producer_id
- role_id
- provider_id
- provider_operation
- model_id
- worker_id
- request_id
- correlation_id
- job_id
- workflow_id
- task_id
- approval_id

### Version and Lineage

- version_id
- revision_id
- version_scope
- version_semantics
- version_authority
- version_mutability
- version_ordering
- version_source
- version_storage
- version_current_pointer
- version_restore_eligibility
- revision_scope
- history_kind
- snapshot_kind
- parent_artifact_id
- parent_asset_id
- source_record_id
- derived_from
- generated_from
- supersedes

### Durability and Recovery

- durability_class
- persistence_state
- process_lifetime_only
- restart_persistent
- storage_backend
- atomic_write_supported
- backup_supported
- restore_supported
- retention_policy_state
- cleanup_policy_state

## Future Version Contract Fields (Recommendation Only)

- version_contract_version
- entity_type
- entity_id
- version_id
- revision_id
- version_number
- revision_number
- version_scope
- version_semantics
- version_authority
- version_mutability
- version_ordering
- version_source
- version_storage
- version_current_pointer
- version_restore_eligibility
- revision_scope
- history_kind
- snapshot_kind
- change_reason
- change_summary
- created_by
- created_at
- approved_by
- approval_id
- checksum
- snapshot_reference
- current_flag
- superseded_flag
- immutable_flag
- restore_eligible
- rollback_eligible
- lineage_reference
- evidence_version

## Federated Projection Plan

1. Read ops backbone durable records as one source family.
2. Read media-native result envelopes/registries/providers as second family.
3. Read integrations snapshots/audit/storage as third family.
4. Read security/path-isolation/path-resolver as fourth family.
5. Read frontend projections separately and never treat projection labels as implementation ownership.

## Shadow Comparison Plan

- Compare raw identity values, locator values, and storage keys without destructive normalization.
- Compare content revision semantics vs media output version semantics vs UI version labels.
- Compare runtime registry process-lifetime behavior vs durable stores.
- Compare checksum fields vs atomic write helper behavior.
- Compare publication references vs external ownership/reconciliation states.

## Migration Order

1. Freeze vocabulary and preserve raw values.
2. Build federated read-only projection.
3. Add shadow comparison reports and mismatch metrics.
4. Design contracts after compatibility proof.
5. Migrate producers before consumers.
6. Keep dual-read compatibility before enforcement.

## Raw Preservation and Migration Rules

- Preserve raw IDs, raw paths, raw filenames, raw URLs, source vocabulary, and domain.
- Never destructively rewrite coalesced library IDs in place.
- Never normalize filenames into stable IDs without migration proof.
- Never infer identity from locator alone.
- Rollback path for migration must restore legacy reads without deleting new metadata.

## Future Namespace Model (Illustrative Only)

Illustrations only, not approved runtime IDs:

- domain_record.ai.artifact
- domain_record.ops.content_item
- asset.media.rendered_file
- result.media.worker_result
- reference.publishing.remote_post
- audit.scheduler.entry
- registry.runtime.worker

## Unresolved Decisions

- Whether content revision and media output_versions should share a single canonical version vocabulary.
- Whether non-durable customer-operations stores should gain durable backing in a future approved phase.
- Whether checksum storage should become mandatory for selected artifact classes.
- Whether rollback semantics should remain domain-specific or become contract-standardized.
- Whether UI version labels should map to durable version references.

## Forbidden Actions

- Do not create a global Artifact Registry in Phase 1A-4.
- Do not create a global Version Registry in Phase 1A-4.
- Do not rename existing IDs in place.
- Do not collapse identity and locator dimensions.
- Do not infer rollback from retry/resume/replay.
- Do not infer versioning from timestamps alone.
- Do not infer ownership from external URLs.

## Phase 1A-4 Exit Criteria

Phase 1A-4 is complete only when all items below are true:

- Exactly five approved artifact documentation files exist.
- All five files contain the Phase 1A-4 freeze notice.
- Implementation-truth priority is separated from authorization and governance authority.
- Durable and non-durable runtime stores are separated.
- Runtime registries are not classified as durable stores.
- Worker result envelopes are not classified as snapshots without durable snapshot proof.
- Identity and locator are separated.
- version_scope and version/revision/history/snapshot separation are explicit.
- lifecycle namespaces are explicit.
- collection truncation behavior is separated from retention policy.
- backup is separated from restore and rollback.
- disabled compatibility routes are not classified as restore sources.
- domain-specific rollback remains domain-specific.
- external-reference ownership gaps are explicit.
- no runtime code, storage behavior, or project data changed.
