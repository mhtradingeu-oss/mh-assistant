# Artifact ID / Version / Revision Matrix (Phase 1A-4)

This Phase 1A-4 inventory freezes observed artifact, asset, output, version, revision, lineage, checksum, storage, retention, rollback, identity, locator, and durability vocabulary and records recommendations only. It does not approve artifact IDs, asset IDs, version fields, revision fields, storage paths, retention behavior, rollback behavior, migrations, schemas, registries, or runtime changes.

## Matrix Rules

- Implementation-truth priority: runtime writers/resolvers first.
- Frontend projection is not artifact-contract authority.
- Non-durable runtime implementations are not mocks by default.

## Domain Matrix

| Domain | Inventory granularity | Raw output type | Materiality class | durability_class | identity_kind | Identity fields | Locator / path fields | version_scope | version_semantics | Snapshot/history | Approval/publication | Retention model | Restore/rollback model | Implementation | Test maturity | Certification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI / Ops | DOMAIN_RECORD | ai_command | DURABLE_OPERATIONAL_RECORD | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID | id, artifact_ids, recommendation_ids, memory_ids | FILE_PATH via ops store files | UNKNOWN_REQUIRES_PROOF | command record lifecycle | history[] | linked approvals possible | collection truncation behavior | no universal restore pointer | IMPLEMENTED_PATH | AUDIT_ONLY | NOT_CERTIFIED |
| AI / Ops | DOMAIN_RECORD | ai_artifact | ARTIFACT (domain scoped) | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID | id, source_type, source_id | ops ai-artifacts.json locator | UNKNOWN_REQUIRES_PROOF | artifact_semantics_scope=DOMAIN_SCOPED | history[] | optional governance links | collection truncation behavior | UNKNOWN_REQUIRES_PROOF | IMPLEMENTED_PATH | AUDIT_ONLY | NOT_CERTIFIED |
| Content | DOMAIN_RECORD | content_item | DRAFT_OUTPUT / DURABLE_DOMAIN_RECORD | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID | id, campaign_id, current_revision_id | ops content-items.json locator | CONTENT_REVISION | mutable revision list | revisions[] + history[] | approval_state and publication_state present | collection truncation behavior | no explicit rollback target | IMPLEMENTED_PATH | PARTIALLY_TESTED | NOT_CERTIFIED |
| Media Ops | DOMAIN_RECORD | media_job | DRAFT_OUTPUT / DURABLE_DOMAIN_RECORD | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID | id, campaign_id, content_item_id, publishing_job_id | ops media-jobs.json locator | MEDIA_OUTPUT_VERSION | output version labels, not immutable chain | output_versions[] + preview_history[] + history[] | approval_state separate from publication_state | collection truncation behavior | no formal rollback pointer | IMPLEMENTED_PATH | PARTIALLY_TESTED | NOT_CERTIFIED |
| Media Native | RESULT_ENVELOPE | worker_result | JOB_RESULT_ENVELOPE / TRANSIENT_RESULT | PROCESS_LIFETIME_ONLY unless persisted by caller | DOMAIN_RECORD_ID | job_id, worker_id | outputs[] may contain EXTERNAL_URL/PROVIDER_REFERENCE | CONTRACT_VERSION | runtime result envelope semantics | metadata.completed_at only | no inherent approval/publication state | UNKNOWN_REQUIRES_PROOF | UNKNOWN_REQUIRES_PROOF | PARTIAL | STATIC_ONLY | NOT_CERTIFIED |
| Media Native | RUNTIME_REGISTRY_RECORD | model registry row | IN_MEMORY_RUNTIME_RECORD / SESSION_STATE | PROCESS_LIFETIME_ONLY | DOMAIN_RECORD_ID | model_id, provider, media_type | in-memory Map key | UNKNOWN_REQUIRES_PROOF | registry capability metadata | metadata.registered_at only | none | n/a | n/a | REGISTRY_ONLY | DEMO_ONLY | NOT_CERTIFIED |
| Media Native | RUNTIME_REGISTRY_RECORD | worker registry row | IN_MEMORY_RUNTIME_RECORD / SESSION_STATE | PROCESS_LIFETIME_ONLY | DOMAIN_RECORD_ID | worker_id, status | in-memory Map key + endpoint locator | UNKNOWN_REQUIRES_PROOF | runtime worker availability metadata | updated_at only | none | n/a | n/a | REGISTRY_ONLY | DEMO_ONLY | NOT_CERTIFIED |
| Media Storage | STORAGE_OBJECT | file output | ASSET | restart_persistent=depends on filesystem | PATH_DERIVED_ID (job folder + filename); UNKNOWN_REQUIRES_PROOF | output_path (locator), relative_path (locator) | FILE_PATH and RELATIVE_PATH | UNKNOWN_REQUIRES_PROOF | file artifact output only | directory-per-job | no inherent approval state | UNKNOWN_REQUIRES_PROOF | UNKNOWN_REQUIRES_PROOF | IMPLEMENTED_PATH | AUDIT_ONLY | NOT_CERTIFIED |
| Library Projection | FRONTEND_PROJECTION_ROW | projected asset | FRONTEND_PROJECTION / ASSET | projection-only | COALESCED_PROJECTION_ID | asset_id from asset_id, id, file_id, file_name | preview_url, file_path, filename | UI_VERSION_LABEL where present | UI projection semantics | n/a | UI status labels not governance authority | archive/delete flags are registry-facing labels | projection has no restore proof | FRONTEND_ONLY | AUDIT_ONLY | NOT_CERTIFIED |
| Integrations | SNAPSHOT_ROW | integration snapshot | SNAPSHOT (domain-specific file) | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID (integration id in filename) | integration id | FILE_PATH snapshot path | UNKNOWN_REQUIRES_PROOF | integration payload snapshot | sync history arrays | none intrinsic | collection truncation behavior | UNKNOWN_REQUIRES_PROOF | IMPLEMENTED_PATH | AUDIT_ONLY | NOT_CERTIFIED |
| Integrations | AUDIT_ROW | integration audit log entry | AUDIT_RECORD | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID (entry-defined) | entry-defined IDs | FILE_PATH audit log | UNKNOWN_REQUIRES_PROOF | append audit trail | append-only array | none intrinsic | collection truncation behavior | UNKNOWN_REQUIRES_PROOF | IMPLEMENTED_PATH | AUDIT_ONLY | NOT_CERTIFIED |
| Publishing | DOMAIN_RECORD | publishing_job queue row | DURABLE_OPERATIONAL_RECORD / PUBLICATION_REFERENCE | restart_persistent=UNKNOWN_REQUIRES_PROOF | DOMAIN_RECORD_ID | job_id/entity_id | queue locators + external refs | UNKNOWN_REQUIRES_PROOF | state machine labels by route | queue/event history | governed publication_state route checks | collection truncation behavior | disabled compatibility polling route | IMPLEMENTED_PATH | PARTIALLY_TESTED | NOT_CERTIFIED |
| Customer Operations | PROCESS_LIFETIME_STORE | conversation/message/ticket/escalation | NON_DURABLE_RUNTIME_RECORD / SESSION_STATE | PROCESS_LIFETIME_ONLY | DOMAIN_RECORD_ID | conversation_id/message_id/ticket_id/escalation_id | in-memory Map only | UNKNOWN_REQUIRES_PROOF | runtime-only record semantics | metadata.updated_at only | no durable governance proof | n/a | n/a | IMPLEMENTED_PATH | DEMO_ONLY | NOT_CERTIFIED |

## Identity / Locator Hardening Notes

- identity_kind must remain distinct from locator kind.
- FILE_PATH, RELATIVE_PATH, DISPLAY_FILENAME, SOURCE_FILENAME, EXTERNAL_URL, and PROVIDER_REFERENCE are not IDENTITY_FIELD unless code proves identity usage.
- Library coalesced projection identity is collision-prone and rename-sensitive.

## Version-Scope Hardening Notes

Recommended future fields (recommendation only):

- version_scope
- version_semantics
- version_authority
- version_mutability
- version_ordering
- version_source
- version_storage
- version_current_pointer
- version_restore_eligibility
