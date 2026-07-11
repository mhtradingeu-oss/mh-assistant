# Capability Source Inventory

> **Phase 1A-2 freeze notice:** This Phase 1A-2 inventory freezes observed capability vocabulary and records recommendations only. It does not approve capability IDs, tool IDs, action IDs, provider operations, model IDs, provider routing, execution behavior, permissions, approvals, migrations, registries, schemas, or runtime changes.

## Authority and baseline

Current production code is implementation truth. Phase 1A-2 documentation is a scoped architectural inventory and vocabulary-freeze baseline only; it is not runtime authority. A future approved Capability Contract may become normative only after explicit review, shadow comparison, validation, migration approval and adoption.

Verified branch `main`, HEAD `e7e385cbdcf7ce00275293b46ca6abf19ed1cdea`, and `origin/main...HEAD = 0 0`. Current worktree scope is limited to the five uncommitted Phase 1A-2 documents under `docs/contracts/capabilities/`. Evidence pack `/tmp/mhos-phase1a2-capability-inventory-20260711-204708/180_summary.env` captured the pre-documentation runtime/code baseline, matched the required audit, reported 335 syntax files, zero failures, and no execution, provider-call, project-data-write or runtime-change assertions. Confidence HIGH.

## Required dimension separation

- Capability family, individual capability, tool surface, action surface, provider operation, model identity, workflow operation, job operation and artifact operation remain separate dimensions.
- Visibility, selection, use, preview, draft production, backend execution, provider execution, workflow execution, approval state, artifact production and output materiality remain separate decisions.
- `provider_id`, `provider_capability_operation`, `model_id` and `worker_id` remain separate fields.
- UI mode, execution transport and durability requirement remain separate fields.
- Implementation maturity, test maturity and production certification remain separate classifications.
- `observed_role_owner`, `observed_page_owner`, `observed_execution_owner`, `observed_provider_owner`, `proposed_role_owner` and `proposed_page_owner` remain separate ownership fields.
- `organization_id`, `workspace_id`, `project_id`, `environment_id`, `brand_id`, `campaign_id`, `customer_id` and `conversation_id` remain separate scope fields.
- Use `UNKNOWN_REQUIRES_PROOF` or `UNRESOLVED` when the current code does not prove a value.

## Source register

| Complete repository path / evidence | Classification | Authority | Symbols and capability surface | Callers/consumers, storage and tests | Confidence / unresolved ownership |
|---|---|---|---|---|---|
| `public/control-center/pages/ai-command/tool-dock.js:397-1270` | FRONTEND_TOOL_VISIBILITY | Visibility/prompt setup only | `BASE_TOOL_DOCK_TOOLS`, `TOOL_DOCK_BY_SPECIALIST`; rewrite, translate, improve and specialist tool IDs | AI Command renderer/composer; no durable execution grant | HIGH; many IDs duplicate page action IDs or conceptual capabilities |
| `public/control-center/pages/ai-command.js:385-519,703-728,3472-3580` | FRONTEND_EXPERIENCE_MODEL | Preview/route UX | tabs, specialist actions, `preview`, `route`, `generate_prompt`, `publish_now` strings | AI Command session, API guidance, destination pages | HIGH; labels/actions do not prove backend execution |
| `public/control-center/runtime/ai-team/ai-team-operating-contract.js:85-515` | FRONTEND_EXPERIENCE_MODEL | UX ownership/forbidden-action projection | allowed outputs, forbidden actions, page owners, handoff destinations | AI Command/page projections; conformance audits | HIGH; not backend capability authority |
| `runtime/orchestrator-service/lib/ops/backbone.js:84-112,196-262,1574-2122,2452-3257` | BACKEND_OPERATIONAL_AUTHORITY | Durable operational authority | workflow/task/job/handoff/approval/event/publishing lifecycles and actions | `runtime/orchestrator-service/server.js`; project operation storage/projections | HIGH; current reusable foundation, not a unified capability registry |
| `runtime/orchestrator-service/lib/ops/ai-orchestrator.js:182-340,1003-1801` | BACKEND_EXECUTION_HANDLER | AI guidance/prompt orchestration | prompt personas, provider calls, workflow IDs, structured output | Server AI routes, OpenAI provider, AI Command | HIGH; provider success/certification not proven by handler presence |
| `runtime/orchestrator-service/lib/ai/provider-registry.js:1-31` | PROVIDER_REGISTRY | AI provider factory lookup | OpenAI factory only | AI orchestrator/provider config | HIGH; registered ≠ configured/healthy/executed |
| `runtime/orchestrator-service/lib/ai/providers/openai.js:129-389` | PROVIDER_ADAPTER | OpenAI request/response adapter | chat/guidance structured outputs | AI orchestrator | HIGH implementation; current credential/health/execution UNKNOWN_REQUIRES_PROOF |
| `runtime/orchestrator-service/lib/media/provider-layer.js:118-414` | BACKEND_EXECUTION_HANDLER | Media generation bridge | image/video provider calls, prompt-only/fallback responses | Media manager server routes and pages | HIGH; per-operation live readiness requires separate proof |
| `runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:3-155` | MODEL_REGISTRY | Catalog only | OpenAI, Google, Runway, Kling, Pika and native models | readiness/model selection | HIGH; catalog entries are targets, not certification |
| `runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js:1-30` | PROVIDER_REGISTRY | Configuration projection | `configured`, `missing_credentials` from environment keys | Readiness consumers | HIGH; configuration is not health or execution proof |
| `runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:1-67` | BACKEND_EXECUTION_HANDLER | Adapter dispatch | provider adapter lookup and unsupported error | job dispatch/native media | HIGH; missing adapter explicitly blocks providers |
| `runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:1-90` | PROVIDER_ADAPTER | OpenAI media adapter | image/voice execution methods | provider execution router | HIGH implementation; live execution not performed in audit |
| `runtime/orchestrator-service/lib/media/native/models/default-models.js:1-89`; `models/model-registry-store.js:1-35` | MODEL_REGISTRY | Model metadata/store | image/video/audio/voice model IDs | selection engine and dispatch | HIGH; model availability remains environment-dependent |
| `runtime/orchestrator-service/lib/media/native/registry/worker-registry-store.js:1-39`; `worker-selection-engine.js` | WORKER_REGISTRY | Worker registration/selection | worker IDs and capability maps | dispatch orchestrator | HIGH; registered/heartbeat/healthy/executed are distinct states |
| `runtime/orchestrator-service/lib/media/native/capabilities/local-rendering-capabilities.js:1-52` | BACKEND_DOMAIN_MAPPING | Environment detection | GPU/ffmpeg/python/node and local media readiness | native media readiness | HIGH; detected binaries do not certify model runtime |
| `runtime/orchestrator-service/lib/media/native/rendering/rendering-{image,video,audio,voice-chat}-adapter.js` | PROVIDER_ADAPTER | Output adapters | output types image/video/audio/voice_chat | native runtime executor | HIGH; artifact/version uniformity not proven |
| `runtime/orchestrator-service/lib/media/native/media-output-storage.js`; `runtime/orchestrator-service/lib/media/library-engine.js` | ARTIFACT_OUTPUT_SOURCE | Media output/storage | output paths/asset records | media pages/server routes | HIGH; universal artifact ID, lineage, checksum and rollback are not proven |
| `runtime/orchestrator-service/lib/execution/scheduler-storage.js`; `scheduler-helpers.js`; `execution-job-bridge.js` | JOB_PAYLOAD_SOURCE | Durable scheduler/job support | scheduler entries, execution bridge actions | server/Scheduler consumers | HIGH; job creation does not prove completion |
| `runtime/orchestrator-service/lib/execution/{intelligence-loop,recommendation-builders,recommendation-runtime,smart-suggestions}.js` | BACKEND_DOMAIN_MAPPING | Intelligence/recommendation production | recommendations, next best action, learning signals | projections/pages | HIGH; forecasting/simulation certification not proven |
| `runtime/orchestrator-service/lib/security/{runtime-security-enforcement,provider-execution-gate,governance-mutation-gate}.js` | BACKEND_SECURITY_GATE | Execution/security decision | provider/destructive/governance classification | server mutations/providers | HIGH; frontend copy is not a substitute for these gates |
| `runtime/orchestrator-service/lib/integrations/provider-registry.js`; `adapter-manager.js`; `providers/*.js` | PROVIDER_REGISTRY / PROVIDER_ADAPTER | Integration discovery/dispatch | WooCommerce, Shopify, eBay, TikTok, Meta, Google, website, ops, AI media, unsupported | integration routes/storage/sync history | HIGH; operation coverage varies by provider |
| `runtime/orchestrator-service/lib/customer-operations/**` | BACKEND_EXECUTION_HANDLER | Customer domain records/channels | conversations, messages, tickets, SLA, escalation, inbox; channel/provider mappings | customer routes/projections/stores | HIGH; suggested reply/CRM/send/voice execution maturity varies and must remain separate |
| `public/control-center/api.js` and active `public/control-center/pages/*.js` | FRONTEND_PROJECTION | API payload producer/consumer | page actions, owner IDs, routes and readiness states | Backend server routes | HIGH; buttons and API clients alone prove neither handler success nor authority |
| `scripts/audit/*capability*`, AI Command/media/integration/workflow audits and syntax checks | TEST_OR_VALIDATOR | Test only | static/runtime-shaped conformance | CI/manual audit | HIGH classification; historical PASS is not current production certification |
| `docs/**` outside this phase | DOCUMENTATION_ONLY or HISTORICAL_EVIDENCE | None | intended features/claims | Human readers | HIGH classification; cannot override code |

## Unresolved ownership

No single current source owns conceptual capability ID, tool ID, action ID, provider operation, model identity, visibility, use, execution, provider grant, approval, artifact/version and scope simultaneously. Provider cost/privacy metadata, organization scope, universal artifact lineage, cross-project isolation, mission semantics, environment scoping, and production certification are UNKNOWN_REQUIRES_PROOF.

Observed page visibility does not prove role ownership, execution authority, provider success, durable output, artifact compliance or production certification. Historical documents and labels cannot override current implementation truth.
