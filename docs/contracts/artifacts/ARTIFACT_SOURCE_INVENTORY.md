# Artifact Source Inventory (Phase 1A-4)

This Phase 1A-4 inventory freezes observed artifact, asset, output, version, revision, lineage, checksum, storage, retention, rollback, identity, locator, and durability vocabulary and records recommendations only. It does not approve artifact IDs, asset IDs, version fields, revision fields, storage paths, retention behavior, rollback behavior, migrations, schemas, registries, or runtime changes.

## Repository Baseline

- Repository: /Users/nadeemnour/Desktop/MH-Assistant-PRODUCTION-LOCAL
- Branch: main
- HEAD: aa17b89532e760ffdd717edbde6b09a276ec8d4b
- origin/main: aa17b89532e760ffdd717edbde6b09a276ec8d4b
- origin/main...HEAD: 0 0

## Documentation Truth Priority

- Implementation-truth priority: current runtime writers/resolvers in runtime/orchestrator-service.
- Evidence priority: line-anchored current HEAD code over historical PASS documents.
- Ownership priority: current writer ownership and resolver ownership.

Implementation ownership is not the same as:

- execution authorization
- governance approval
- artifact-contract authority
- version-contract authority
- production certification

## Source Register (Current HEAD)

| Source path and symbol | Source classification | Materiality / durability meaning | Implementation maturity | Confidence |
| --- | --- | --- | --- | --- |
| runtime/orchestrator-service/lib/ops/backbone.js:getOperationsPaths | STORAGE_RESOLVER | DURABLE_OPERATIONAL_RECORD writer paths under data/projects/<project>/ops | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/ops/backbone.js:createAiArtifact | ARTIFACT_WRITER | Domain record named ai_artifact; artifact_semantics_scope=DOMAIN_SCOPED | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/ops/backbone.js:upsertContentItem | REVISION_FIELD_SOURCE | CONTENT_REVISION source (revision/current_revision_id/revisions) | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/ops/backbone.js:upsertMediaJob | VERSION_FIELD_SOURCE | MEDIA_OUTPUT_VERSION labels (output_versions) + history arrays | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/ops/backbone.js:createApproval/decideApproval | APPROVAL_STATE_SOURCE | Governance/approval state transitions; not publication authority by itself | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:resolve/pickRoots | STORAGE_RESOLVER | Canonical/legacy read/write/fallback resolution | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:writeDual | ARTIFACT_WRITER | Dual-write behavior; STORAGE_KEY/FILE_PATH mapping by domain | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/integrations/storage.js:writeJsonFile | ATOMIC_WRITE_SOURCE / DURABILITY_HELPER | FILESYSTEM_WRITE_INTEGRITY_ONLY (temp+rename+backup); not checksum enforcement | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/integrations/storage.js:readJsonFileDurable | QUARANTINE_SOURCE / RECOVERY_SOURCE | Corrupt/empty durable file quarantine; not rollback | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/integrations/sync-history.js:appendIntegrationSyncHistory | HISTORY_SOURCE | collection truncation behavior with bounded append array | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/media/native/media-output-storage.js:writeMediaOutput | ASSET_WRITER / FILE_PATH_SOURCE | FILE_PATH/RELATIVE_PATH writer; identity remains separate | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/media/library-engine.js:buildLibraryAsset | LOCATOR_SOURCE / ASSET_IDENTITY_SOURCE | COALESCED_PROJECTION_ID from asset_id, id, file_id, file_name | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/media/native/models/model-registry-store.js:registerModel | RUNTIME_REGISTRY_SOURCE / PROCESS_LIFETIME_STORE | RUNTIME_REGISTRY_RECORD; IN_MEMORY_RUNTIME_RECORD; PROCESS_LIFETIME_ONLY | REGISTRY_ONLY | HIGH |
| runtime/orchestrator-service/lib/media/native/registry/worker-registry-store.js:upsertWorker | RUNTIME_REGISTRY_SOURCE / PROCESS_LIFETIME_STORE | RUNTIME_REGISTRY_RECORD; IN_MEMORY_RUNTIME_RECORD; PROCESS_LIFETIME_ONLY | REGISTRY_ONLY | HIGH |
| runtime/orchestrator-service/lib/media/native/protocol/worker-result-contract.js:createWorkerResultContract | RESULT_ENVELOPE_SOURCE | JOB_RESULT_ENVELOPE / RUNTIME_RESULT_CONTRACT / TRANSIENT_RESULT | PARTIAL | HIGH |
| runtime/orchestrator-service/server.js:/media-manager/publish/job/:jobId | DISABLED_COMPATIBILITY_ROUTE | HISTORICAL_LIFECYCLE_BRIDGE disabled (410); RECOVERY_GAP_EVIDENCE | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/server.js:rollback_product route | DOMAIN_SPECIFIC_ROLLBACK_SOURCE | DOMAIN_SPECIFIC_EXTERNAL_ENTITY_ROLLBACK (commerce product only) | PARTIAL | MEDIUM |
| runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js | NON_DURABLE_STORE / PROCESS_LIFETIME_STORE | NON_DURABLE_RUNTIME_RECORD; SESSION_STATE; PROCESS_LIFETIME_ONLY | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js | NON_DURABLE_STORE / PROCESS_LIFETIME_STORE | NON_DURABLE_RUNTIME_RECORD; SESSION_STATE; PROCESS_LIFETIME_ONLY | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js | NON_DURABLE_STORE / PROCESS_LIFETIME_STORE | NON_DURABLE_RUNTIME_RECORD; SESSION_STATE; PROCESS_LIFETIME_ONLY | IMPLEMENTED_PATH | HIGH |
| runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js | NON_DURABLE_STORE / PROCESS_LIFETIME_STORE | NON_DURABLE_RUNTIME_RECORD; SESSION_STATE; PROCESS_LIFETIME_ONLY | IMPLEMENTED_PATH | HIGH |
| public/control-center/api.js | FRONTEND_PROJECTION | Endpoint projection and UX integration, not runtime writer ownership | FRONTEND_ONLY | HIGH |
| public/control-center/pages/library.js | FRONTEND_EXPERIENCE_MODEL | UI labels/status prompts, not governance/storage mutation authority by itself | FRONTEND_ONLY | HIGH |

## Identity / Locator Separation

Keep these separate for every row:

- IDENTITY_FIELD
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

Evidence-backed correction:

- runtime/orchestrator-service/lib/media/library-engine.js:42 coalesces candidate IDs and filenames into projection identity.
- This proves a projection compatibility behavior, not stable universal identity.

## Materiality and Durability Findings

- Durable operational/domain records are primarily in runtime/orchestrator-service/lib/ops/backbone.js file-backed collections.
- In-memory Maps in customer-operations and native model/worker registries are real implementations but non-durable runtime stores.
- Worker result contract is a RESULT_ENVELOPE_SOURCE and JOB_RESULT_ENVELOPE, not a durable snapshot without storage proof.

## Version / Revision / History Separation

- version_scope examples observed:
  - CONTENT_REVISION (content revision fields)
  - MEDIA_OUTPUT_VERSION (output_versions labels)
  - PROTOCOL_VERSION / CONTRACT_VERSION (protocol contracts)
  - UI_VERSION_LABEL (frontend projection labels)
- history arrays and preview_history are not immutable version chains.

## Integrity / Retention / Recovery Separation

- Atomic write helper behavior in integrations/storage is filesystem write durability, not content checksum enforcement.
- Bounded collections are collection truncation behavior, not retention policy.
- Backup and quarantine are not complete restore/rollback flows.

## Unresolved Ownership Gaps

- Universal artifact and version contract authority remains UNKNOWN_REQUIRES_PROOF.
- External reference ownership/lifecycle guarantees remain UNKNOWN_REQUIRES_PROOF.
- Cross-domain identity stability and collision protection remain UNKNOWN_REQUIRES_PROOF.
