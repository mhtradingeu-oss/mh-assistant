# Provider Source Inventory

> This Phase 1A-3 inventory freezes observed provider vocabulary and records recommendations only. It does not approve provider IDs, provider operations, application actions, adapter actions, models, workers, credentials, configuration, health, routing, fallback, execution, certification, migrations, schemas, registries, or runtime changes.

## Repository Baseline

- Repository: MH-Assistant-PRODUCTION-LOCAL
- Branch: main
- HEAD: 2e736823fad56a75c668fb709242b2f7ef602f70
- origin/main: same HEAD
- origin/main...HEAD: 0 0

## Documentation Authority Model

- Current production code is implementation truth.
- Phase 1A-3 documents are inventory and vocabulary-freeze evidence only.
- A future approved Provider Contract may become normative only after review, read-only federated projection, shadow comparison, migration approval, and runtime adoption.
- Historical PASS reports, UI labels, and catalog rows do not override current implementation truth.

## Current-Head Implementation Ownership (Not Security Authority)

- AI execution implementation owner: runtime/orchestrator-service/lib/ai/providers/openai.js.
- AI registry owner: runtime/orchestrator-service/lib/ai/provider-registry.js.
- Media dispatch implementation owners: runtime/orchestrator-service/lib/media/provider-layer.js and runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js.
- Integration adapter dispatch owner: runtime/orchestrator-service/lib/integrations/adapter-manager.js with registry owner in runtime/orchestrator-service/lib/integrations/provider-registry.js.
- Security authorization and governance boundaries remain separate in runtime/orchestrator-service/lib/security/provider-execution-gate.js, runtime/orchestrator-service/lib/security/runtime-security-enforcement.js, and runtime/orchestrator-service/lib/security/governance-mutation-gate.js.

Execution implementation ownership is not security authorization, governance approval, credential access authority, or production certification.

## Source Register (Contract-Shaping)

| Source path | Classification | Current-head proof summary | Confidence |
|---|---|---|---|
| runtime/orchestrator-service/lib/ai/provider-registry.js | PROVIDER_REGISTRY | openai is the only AI provider factory currently registered. | HIGH |
| runtime/orchestrator-service/lib/ai/provider-config.js | PROVIDER_CONFIGURATION_SOURCE | Provider and model references come from environment keys; this proves reference usage, not credential validity. | HIGH |
| runtime/orchestrator-service/lib/ai/providers/openai.js | PROVIDER_ADAPTER | AI OpenAI adapter path exists with normalization and usage logging code paths. | HIGH |
| runtime/orchestrator-service/lib/media/provider-layer.js | BACKEND_EXECUTION_HANDLER | Media application actions are implemented and mapped through media-layer logic. | HIGH |
| runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js | PROVIDER_MODEL_CATALOG | Catalog includes openai, google, runway, kling, pika, and native model rows. | HIGH |
| runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js | READINESS_PROJECTION | Readiness labels are projection states and are not health or certification proof. | HIGH |
| runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js | PROVIDER_ADAPTER | image path is implemented; raw voice_chat is present as unsupported/not implemented behavior. | HIGH |
| runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js | ROUTING_IMPLEMENTATION | Native and adapter routing paths are separated by implementation. | HIGH |
| runtime/orchestrator-service/lib/media/native/registry/worker-registry-store.js | WORKER_REGISTRY | Worker records are persisted in runtime memory structures. | HIGH |
| runtime/orchestrator-service/lib/integrations/provider-registry.js | PROVIDER_REGISTRY | Integration adapters include website, commerce, social, ops, and explicit unsupported wrappers. | HIGH |
| runtime/orchestrator-service/lib/integrations/adapter-manager.js | BACKEND_EXECUTION_HANDLER | Integration adapter actions connect, testConnection, syncCurrent, and importHistory are dispatched here. | HIGH |
| runtime/orchestrator-service/lib/integrations/audit-log.js | AUDIT_OBSERVABILITY_SOURCE | Integration audit records are written for adapter actions. | HIGH |
| runtime/orchestrator-service/lib/integrations/sync-history.js | OUTPUT_NORMALIZATION_SOURCE | Sync snapshots and integration output records are persisted. | HIGH |
| runtime/orchestrator-service/lib/security/provider-execution-gate.js | BACKEND_SECURITY_GATE | Provider action classification exists as security input, not implementation dispatch ownership. | HIGH |
| runtime/orchestrator-service/lib/security/runtime-security-enforcement.js | BACKEND_SECURITY_GATE | Route-level enforcement exists as a separate security boundary. | HIGH |
| runtime/orchestrator-service/lib/security/governance-mutation-gate.js | BACKEND_GOVERNANCE_GATE | Governance approval and mutation controls are separate from provider dispatch. | HIGH |
| public/control-center/pages/integrations.js | FRONTEND_PROJECTION | UI can display unsupported and readiness labels that are not runtime authority. | HIGH |

## Provider Domain Inventory

### AI / LLM

- openai is the only active AI registry provider in current-head AI provider registry code.
- Anthropic, Mistral, DeepSeek, Qwen, Llama, and Ollama mentions are not current AI registry ownership proof in this phase.

### Media / Voice / Audio

- OpenAI media-layer paths are implemented, but Phase 1A-3 does not certify execution success.
- voice_chat and voice.realtime remain separate vocabularies in this phase.
- video_brief and video.generate remain separate vocabularies in this phase.

### Commerce / Integration

- Integration adapters are dispatched through adapter-manager and registry mapping.
- Unsupported wrappers for amazon, smtp, mailer, and crm are explicit and must remain explicit.

### Customer Operations / Communication

- Conversation and sync records exist, but conversation storage is not a communication provider contract.
- No universal current-head communication provider abstraction for message send, IVR, and CRM execution was proven.
- Unsupported communication-related wrappers remain unsupported rather than implicitly missing.

### Infrastructure

- Worker registry and local runtime wrappers exist for media-native paths.
- No pluggable provider abstraction was proven for queue provider, scheduler provider, or object storage provider dimensions at the audited HEAD.

## ComfyUI Current-Head Status

- No active current-head provider registry, adapter, router, or execution implementation ownership was proven for ComfyUI by this Phase 1A-3 audit.
- Documentation or historical mentions do not establish runtime support.
- Classification: DOCUMENTATION_ONLY_PROVIDER and NOT_OBSERVED_IN_CURRENT_RUNTIME.

## ElevenLabs Current-Head Status

- ElevenLabs appears in repository vocabulary coverage, but active current-head provider registry and adapter ownership were not proven in the audited runtime source set.
- Classification: DOCUMENTATION_ONLY_PROVIDER and UNKNOWN_REQUIRES_PROOF.

## Scope Taxonomy Baseline

- credential_scope: process/global environment key references.
- configuration_scope: process-level provider and adapter config resolution.
- execution_scope: runtime service dispatch boundaries.
- data_scope: request, response, audit, and sync payload boundaries.
- project_scope: integration and domain records may be project-associated.
- organization_scope: not proven as runtime provider contract authority in this phase.
- environment_scope: environment key resolution and deployment context labels.
- browser_scope and process_scope remain distinct.

## Output Normalization And Artifact Behavior Baseline

- raw provider response is distinct from normalized provider response.
- normalized domain result is distinct from durable artifact.
- providerResult or insights_ready style labels are not artifact contracts.
- output materiality must remain explicit and source-qualified.

## Tests And Validation Baseline

- No provider calls were performed in this phase.
- No provider health calls were performed in this phase.
- No provider certification was performed in this phase.
- No server start and no HTTP calls were performed in this phase.
