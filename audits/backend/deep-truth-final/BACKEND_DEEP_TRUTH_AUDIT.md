# MH-Assistant Backend Deep Truth Audit

Generated from the evidence pack in `audits/backend/deep-truth-final/` and spot-checked against `runtime/orchestrator-service/server.js`.

## Summary

MH-Assistant has a real backend, but it is not yet a production-grade backend architecture. The active backend is a single large Express service at `runtime/orchestrator-service/server.js` with supporting `lib/` modules for AI, operations, integrations, customer operations, media, persistence, observability, and security. It exposes a broad HTTP surface covering health, project/setup, media/library, operations centers, campaigns, content items, media jobs, workflows, AI command, tasks, approvals, governance, notifications, handoffs, events, insights, learning, customer operations, native media, integrations, publishing, legacy WooCommerce/product flows, scheduler flows, and media helper APIs.

The strongest built areas are route coverage, JSON-file persistence, protected read/write middleware, project slug validation, customer operations read-only projections, AI command provider bridges, workflow and handoff records, publishing schedule/status records, and governance checks around publish/ready mutations.

The largest production gaps are authentication/authorization model maturity, route surface duplication through `/public/...` aliases, file-backed state instead of a transactional database, limited automated backend tests, missing durable queues/workers, partial external provider execution, no customer write operations, no real CRM/message/call mutation layer, no Prisma/schema despite audit placeholders, and several high-risk legacy e-commerce publishing/product mutation routes.

## Evidence Reviewed

- Route inventory: `03-server-routes-all.txt`, `03-server-routes-get.txt`, `03-server-routes-mutations.txt`, `03-router-routes-all.txt`
- Feature route scans: `04-content-media-campaign-routes.txt`, `04-customer-crm-message-call-routes.txt`, `04-integrations-provider-routes.txt`, `04-operations-workflow-task-routes.txt`, `04-publishing-governance-routes.txt`
- Risk/security scans: `05-high-risk-mutations.txt`, `05-destructive-references.txt`, `05-send-execution-references.txt`, `06-auth-security-key-guards.txt`, `15-dangerous-runtime-patterns.txt`, `15-risk-keywords.txt`
- Persistence/env/test scans: `06-env-usage-map.txt`, `11-file-persistence-map.txt`, `13-test-file-map.txt`, `13-scripts-map.txt`, `13-validation-command-map.txt`, `14-node-check-results.txt`
- Source spot checks: `runtime/orchestrator-service/server.js`, `runtime/orchestrator-service/lib/execution/execution-job-bridge.js`, `runtime/orchestrator-service/lib/ai/providers/openai.js`

## Backend Shape

| Area | Evidence | Status | Notes |
|---|---:|---|---|
| Runtime | `runtime/orchestrator-service/server.js`, Express 5.2.1 | Fully built, monolithic | One main server file owns almost all HTTP behavior. |
| Package/runtime config | `02-orchestrator-package-json.txt` | Partially production-ready | Has Express, Helmet, CORS, compression, multer, axios. No TypeScript, no DB client, no migration tooling. |
| Root package/Prisma/tsconfig | empty evidence files | Planned/not present | `02-package-json.txt`, `02-prisma-config.txt`, `02-prisma-schema.txt`, `02-tsconfig.txt`, `01-prisma-file-map.txt` are empty. |
| Validation | `14-node-check-results.txt`, package scripts | Partially built | Syntax checks exist for `server.js`, `api.js`, `router.js`, `app.js`; broader tests are script-based smoke checks. |
| Persistence | `11-file-persistence-map.txt` | Fully built for local/file mode; partial for production | Uses JSON files, atomic-ish write helper, dual canonical/legacy paths, backups. No database transactions or migrations. |
| Security middleware | `06-auth-security-key-guards.txt`, `server.js:199-361` | Partially built | Central read/write key middleware exists. It is key-based, not user/session/RBAC based. |

## Existing Backend Features

| Module | Existing features | Built state | Read-only routes | Write/mutation routes |
|---|---|---|---|---|
| Health/readiness | Health and readiness checks, data/access readiness state | Fully built | `GET /health`, `/healthz`, `/readyz` | None |
| Project/setup | Project create, rename, template apply, setup save, startup payload, project payload, asset catalog, parity readiness | Mostly built | `GET /media-manager/projects`, `/media-manager/asset-catalog`, `/media-manager/project/:project/startup`, `/media-manager/project/:project`, `/media-manager/project/:project/storage/parity-readiness`, `/media-manager/storage/parity-readiness` and `/public/...` aliases | `POST /media-manager/projects`, `/media-manager/project/:project/rename`, `/media-manager/project/:project/apply-template`, `/media-manager/project/:project/setup` and `/public/...` aliases |
| Media/library | Project tree, registry, file serving, upload, asset status/rename/source-of-truth/archive/delete, library refresh | Mostly built | `GET /media/projects`, `/media/tree/:project`, `/media/registry/:project`, `/media/file/:project/:type/:filename` | `POST /media/upload`, `/media-manager/project/:project/assets/:assetId/status`, `/rename`, `/source-of-truth`, `/archive`, `/delete`, `DELETE /media-manager/project/:project/assets/:assetId`, `POST /media-manager/project/:project/library/refresh` |
| Content/campaigns | Campaign list/get/upsert, content item list/get/upsert, generated content and campaign package helpers | Mostly built | `GET /media-manager/project/:project/campaigns`, `/campaigns/:campaignId`, `/content-items`, `/content-items/:contentItemId` and `/public/...` aliases | `POST /media-manager/project/:project/campaigns`, `PATCH /campaigns/:campaignId`, `POST /content-items`, `PATCH /content-items/:contentItemId` and `/public/...` aliases |
| Operations centers | Operations snapshot, task center, queue center, job monitor, notification center, schema | Mostly built | `GET /media-manager/project/:project/operations`, `/task-center`, `/queue-center`, `/job-monitor`, `/notification-center`, `/operations/schema` and `/public/...` aliases | Mutations are via tasks, media jobs, workflows, notifications, handoffs, approvals, and publishing routes |
| Tasks | Task list/get/create | Built | `GET /media-manager/project/:project/tasks`, `/tasks/:taskId` and `/public/...` aliases | `POST /media-manager/project/:project/tasks` and `/public/...` alias |
| Media jobs | Media job list/get/upsert/update | Built | `GET /media-manager/project/:project/media-jobs`, `/media-jobs/:mediaJobId` and `/public/...` aliases | `POST /media-manager/project/:project/media-jobs`, `PATCH /media-jobs/:mediaJobId` and `/public/...` aliases |
| Workflows | Workflow run list/get, workflow run record, AI workflow execution bridge | Partially built | `GET /media-manager/project/:project/workflows/runs`, `/runs/:runId` and `/public/...` aliases | `POST /media-manager/project/:project/workflows/:workflowId/run`, `/ai/workflows/:workflowId/run` and `/public/...` aliases |
| AI command/team | Team model read/write, AI command list/get/execute, chat, guidance, artifacts, recommendations, memory, OpenAI provider | Mostly built | `GET /media-manager/project/:project/team`, `/ai/commands`, `/ai/commands/:commandId`, `/ai/artifacts`, `/ai/recommendations`, `/ai/memory` and `/public/...` aliases | `POST /media-manager/project/:project/team`, `/ai/command`, `/ai/chat`, `/ai/guidance`, `/ai/workflows/:workflowId/run` and `/public/...` aliases |
| Handoffs/events | Handoff list/create/consume, events list | Built | `GET /media-manager/project/:project/handoffs`, `/events` and `/public/...` aliases | `POST /media-manager/project/:project/handoffs`, `/handoffs/:handoffId/consume` and `/public/...` aliases |
| Approvals/governance | Approval list/create/decision, governance summary/policy, publishing mutation guard | Mostly built | `GET /media-manager/project/:project/approvals`, `/governance`, `/governance/policy` and `/public/...` aliases | `POST /media-manager/project/:project/approvals`, `/approvals/:approvalId/decision`, `/governance/policy` and `/public/...` aliases |
| Publishing | Schedule/reschedule/ready/publish/fail records, connector preview payloads, manual publish result recording, governance guard | Partially built | Publishing read data is surfaced through operations/governance/scheduler reviews rather than a complete REST read surface | `POST /media-manager/project/:project/publishing/schedule`, `/:jobId/reschedule`, `/:jobId/ready`, `/:jobId/publish`, `/:jobId/fail` and `/public/...` aliases |
| Integrations/providers | Integration control-center read, connect/reconnect/test/sync/import-history/disconnect, token redaction, provider readiness | Partially built | `GET /media-manager/project/:project/integrations/control-center`, `/public/...` alias; native media provider reads | `POST /media-manager/project/:project/integrations/:integrationId/connect`, `/reconnect`, `/test`, `/sync`, `/import-history`, `/disconnect` and `/public/...` aliases |
| Native media | Provider list/readiness, dispatch generation through native media orchestrator | Partially built | `GET /media-manager/project/:project/native-media/providers`, `/providers/readiness` and `/public/...` aliases | `POST /media-manager/project/:project/native-media/generate` |
| Customer operations | Readiness, inbox, conversations, messages, customers, tickets, channels, SLA, escalations, projections | Read-only built; mutation layer planned | `GET /api/projects/:project/customer-operations/...`; `GET /media-manager/project/:project/customer-operations/...`; `/public/...` aliases | None. Source comment explicitly says these routes do not send replies, mutate CRM, create/update tickets, assign conversations, place calls, trigger IVR, send provider messages, or auto-reply. |
| Insights/learning | Project insight and learning projections | Built/partial depending provider data | `GET /api/insights/:project`, `/api/learning/:project`, `/public/api/...` aliases | None in HTTP surface |
| Legacy task/orchestrator | Task classification, ingest, today/next, Telegram command | Partially built | `GET /today`, `/next` | `POST /task`, `/ingest`, `/telegram-command` |
| Legacy WooCommerce/product | Product list/read, optimize/prepare update, backup/clone, apply prepared copy, publish clone, replace original, cleanup clone, publish blog, rollback | High-risk partial | `GET /products`, `/optimize-product/:id`, `/prepare-product-update/:id` | `POST /backup-and-clone-product/:id`, `/apply-prepared-copy-to-clone/:originalId/:cloneId`, `/publish-clone/:cloneId`, `/replace-original-product/:originalId/:cloneId`, `/cleanup-clone/:cloneId`, `/publish-blog/:draftId`, `/rollback-product/:productId` |
| Scheduler/optimization/media helpers | Schedule execution job, queue read, worker once, feedback, performance summary, optimization recommendations, media prompt/brand/generation helpers | Partially built | `GET /scheduler_queue`, `/get_performance_summary`, `/get_smart_suggestions` | `POST /schedule_execution_job`, `/run_scheduler_worker_once`, `/record_execution_feedback`, `/generate_optimization_recommendations`, `/api/media/improve-prompt`, `/api/media/brand-check`, `/api/media/generate-image`, `/api/media/generate-video-brief`, `/api/media/generate-voice-script`, `/api/media/generate-campaign-pack` |
| Static/generated output | Control center static serving and generated output serving | Built with caveats | `GET /media-manager`, `/control-center`, `/generated-output/:project/:filename` | None |

## Fully Built vs Partial vs Planned

### Fully Built

- Express runtime boots with Helmet, CORS, compression, JSON parsing, centralized error handling, and route rate limits for Telegram/AI endpoints.
- Central protected write key middleware covers `POST`, `PATCH`, and `DELETE` for `/media-manager/...`, `/public/media-manager/...`, `/api/media/...`, and listed legacy mutation routes.
- Central protected read key middleware covers sensitive `GET` routes for `/media-manager/...`, `/public/media-manager/...`, `/public/api/...`, `/api/...`, legacy project/media reads, scheduler queue, products, suggestions, and generated output.
- Project slug path/body/query validation is mounted globally after security middleware.
- File-backed project/setup/library/ops persistence exists, including canonical/legacy compatibility and JSON write helpers.
- Customer operations HTTP surface is read-only.
- AI command routes, team model routes, workflow execution routes, handoff routes, task routes, approval routes, and event routes exist.
- Publishing mutation endpoints exist and call governance checks for schedule/reschedule/ready/publish/fail.
- Integration control center routes exist with token/secret redaction in summaries.

### Partially Implemented

- Production authentication is only a shared key model. There is no user identity, tenant membership, RBAC, per-route permission scope, audit principal, session, OAuth, or admin separation.
- `/public/media-manager/...` mirrors sensitive reads and writes. These are still key-protected, but the naming broadens attack surface and is risky for production semantics.
- Persistence is JSON/file based. It has some atomic-write behavior, but not transactional consistency, concurrent write safety, relational constraints, migrations, backups/restore policy, or query indexing.
- Integrations have connection/action models and provider adapters, but many provider states remain unsupported, not configured, or bridge-only.
- AI command has OpenAI provider support and structured response normalization, but production readiness depends on env keys, provider error handling, observability, rate limit policy, and output governance.
- Native media generation dispatch exists, but not all provider/worker paths are proven as production execution.
- Publishing can mark jobs as published/failed and produce connector/manual records, but external auto-publish connectors are still bridges or next layers.
- Scheduler and execution workers are HTTP-triggered and file-backed, not a durable queue/worker system.
- WooCommerce routes perform real external mutations and backups, but remain legacy, high-risk, and not integrated into a modern approval/RBAC model.
- Test coverage is mostly syntax and smoke scripts. There is no comprehensive route, auth, mutation-safety, persistence, or provider-contract test suite.

### Only Planned / Not Present

- Prisma/database schema and config are absent in this evidence pack.
- TypeScript configuration is absent.
- Customer operation mutations are absent: no send reply, CRM write, ticket create/update, assignment, call/IVR, provider-message, or auto-reply routes.
- Durable production queue infrastructure is absent.
- Full external publishing adapter layer is not complete.
- Role/permission/multi-user administration is absent.
- Full customer data privacy controls, retention tooling, export/delete workflows, and consent enforcement are not present in the backend evidence.

## Read-Only Route Inventory

Read-only routes are all `GET` routes from `03-server-routes-get.txt`. They fall into these groups:

- Health/readiness: `/health`, `/healthz`, `/readyz`
- Project/storage/setup reads: `/media-manager/projects`, `/media-manager/asset-catalog`, `/media-manager/project/:project/startup`, `/media-manager/project/:project`, `/media-manager/project/:project/storage/parity-readiness`, `/media-manager/storage/parity-readiness`, with `/public/...` aliases
- Legacy media reads: `/media/projects`, `/media/tree/:project`, `/media/registry/:project`, `/media/file/:project/:type/:filename`
- Operations reads: `/media-manager/project/:project/operations`, `/task-center`, `/queue-center`, `/job-monitor`, `/notification-center`, `/operations/schema`, with `/public/...` aliases
- Team/AI reads: `/team`, `/ai/commands`, `/ai/commands/:commandId`, `/ai/artifacts`, `/ai/recommendations`, `/ai/memory`, with `/public/...` aliases
- Campaign/content/media-job/workflow reads: `/campaigns`, `/campaigns/:campaignId`, `/content-items`, `/content-items/:contentItemId`, `/media-jobs`, `/media-jobs/:mediaJobId`, `/workflows/runs`, `/workflows/runs/:runId`, with `/public/...` aliases
- Task/approval/governance/notification/handoff/event reads: `/tasks`, `/tasks/:taskId`, `/approvals`, `/governance`, `/governance/policy`, `/notifications`, `/handoffs`, `/events`, with `/public/...` aliases
- Insights/learning reads: `/api/insights/:project`, `/api/learning/:project`, with `/public/api/...` aliases
- Customer operations reads: `/api/projects/:project/customer-operations/readiness`, `/inbox`, `/conversations`, `/conversations/:conversationId`, `/conversations/:conversationId/messages`, `/customers/:customerId`, `/tickets`, `/channels`; plus `/media-manager/project/:project/customer-operations/health`, `/readiness`, `/channels`, `/inbox`, `/conversations`, `/messages`, `/customers`, `/sla`, `/escalations`, with `/public/...` aliases
- Native media/integration reads: `/native-media/providers`, `/native-media/providers/readiness`, `/integrations/control-center`, with `/public/...` aliases
- Legacy reads: `/today`, `/next`, `/products`, `/optimize-product/:id`, `/prepare-product-update/:id`, `/scheduler_queue`, `/get_performance_summary`, `/get_smart_suggestions`
- Static/generated reads: `/media-manager`, `/media-manager/`, `/control-center`, `/generated-output/:project/:filename`

## Write and Mutation Route Inventory

Mutation routes are all `POST`, `PATCH`, and `DELETE` routes from `03-server-routes-mutations.txt`. They fall into these groups:

- Legacy orchestrator: `POST /task`, `/ingest`, `/telegram-command`
- Execution bridges: `POST /execute_publish_package`, `/execute_email_package`, `/generate_media_from_prompt`, `/build_ad_execution_package`
- Legacy WooCommerce/product mutations: `POST /backup-and-clone-product/:id`, `/apply-prepared-copy-to-clone/:originalId/:cloneId`, `/publish-clone/:cloneId`, `/replace-original-product/:originalId/:cloneId`, `/cleanup-clone/:cloneId`, `/publish-blog/:draftId`, `/rollback-product/:productId`
- Media/library mutations: `POST /media/upload`, `/media-manager/project/:project/assets/:assetId/status`, `/rename`, `/source-of-truth`, `/archive`, `/delete`; `DELETE /media-manager/project/:project/assets/:assetId`
- Project/setup mutations: `POST /media-manager/projects`, `/media-manager/project/:project/rename`, `/apply-template`, `/setup`, with `/public/...` aliases
- Team/campaign/content/media job mutations: `POST /team`, `/campaigns`, `/content-items`, `/media-jobs`; `PATCH /campaigns/:campaignId`, `/content-items/:contentItemId`, `/media-jobs/:mediaJobId`, with `/public/...` aliases
- Workflow/AI mutations: `POST /workflows/:workflowId/run`, `/ai/command`, `/ai/chat`, `/ai/guidance`, `/ai/workflows/:workflowId/run`, with `/public/...` aliases
- Tasks/approvals/governance/notifications/handoffs: `POST /tasks`, `/approvals`, `/approvals/:approvalId/decision`, `/governance/policy`, `/handoffs`, `/handoffs/:handoffId/consume`; `PATCH /notifications/:notificationId`, with `/public/...` aliases
- Source registry mutations: `POST /sources`; `DELETE /sources/:sourceType`, with `/public/...` aliases
- Native media/integration mutations: `POST /native-media/generate`, `/integrations/:integrationId/connect`, `/reconnect`, `/test`, `/sync`, `/import-history`, `/disconnect`, with `/public/...` aliases except native generation
- Publishing mutations: `POST /publishing/schedule`, `/publishing/:jobId/reschedule`, `/publishing/:jobId/ready`, `/publishing/:jobId/publish`, `/publishing/:jobId/fail`, with `/public/...` aliases
- Scheduler/feedback/media helper mutations: `POST /schedule_execution_job`, `/run_scheduler_worker_once`, `/record_execution_feedback`, `/generate_optimization_recommendations`, `/api/media/improve-prompt`, `/api/media/brand-check`, `/api/media/generate-image`, `/api/media/generate-video-brief`, `/api/media/generate-voice-script`, `/api/media/generate-campaign-pack`

## High-Risk Routes and Patterns

| Risk | Evidence | Severity | Finding |
|---|---|---:|---|
| Shared-key security model | `server.js:199-361` | High | Protected routes rely on one configured server key. This is better than open routes but not enough for multi-user production. |
| `/public/...` write aliases | `03-server-routes-mutations.txt`, `server.js:12322` | High | Public-looking aliases exist for sensitive project, AI, workflow, governance, integration, and publishing writes. They are key-protected but should not remain as production API names. |
| Legacy WooCommerce mutators | `05-high-risk-mutations.txt` | High | Product clone/publish/replace/cleanup/blog/rollback routes can mutate external commerce systems. They need stricter approval, RBAC, idempotency, audit, and rollback guarantees. |
| Publishing state mutation | `server.js:12324-12614`, `server.js:14120-14190` | High | Publishing can mark items ready/published/failed. Governance checks exist, but production needs stronger actor identity and immutable audit trail. |
| File-backed mutable state | `11-file-persistence-map.txt` | High | Many writes use JSON files. Atomic rename helps, but concurrent requests and partial cross-file updates can still diverge. |
| Customer data exposure risk | customer operations routes | High | Customer operations read routes expose inbox, conversations, messages, customers, tickets, channels, SLA, and escalations. They are protected by read key, but production requires per-user permissions, PII controls, logging, retention, and consent checks. |
| Control key bootstrap for local UI | `server.js:12642-12655` | Medium | Localhost bootstrap injects read/write keys into the Control Center page. It is local-only by hostname, but must not be enabled or proxied in production. |
| Error detail leakage | route handlers frequently return `error.message` | Medium | Many handlers expose raw exception messages. Some are sanitized by helper, but this is inconsistent. |
| No database/migration layer | empty Prisma evidence | Medium/High | Production recovery, consistency, and auditability are weak without durable transactional storage. |
| Limited tests | `13-test-file-map.txt`, package scripts | Medium | Backend safety relies on smoke scripts and syntax checks, not comprehensive route/security tests. |

## Customer Operations Protection Confirmation

Customer operations are protected in the current backend surface:

- All customer operations HTTP routes are `GET` only.
- `/api/projects/:project/customer-operations/...` routes are covered by the protected read-key middleware because `/api/` matches the sensitive read route pattern.
- `/media-manager/project/:project/customer-operations/...` and `/public/media-manager/project/:project/customer-operations/...` routes are covered by the protected read-key middleware because `/media-manager/project/` and `/public/media-manager/project/` match sensitive read patterns.
- The server comment before the customer projection routes states they do not send customer replies, mutate CRM, create/update tickets, assign conversations, place calls, trigger IVR, send provider messages, or auto-reply.

Production caveat: "protected" currently means possession of the shared control key. It does not mean user-specific authorization, least privilege, PII access scope, CRM consent policy, or customer-data audit compliance.

## AI Command, Workflow, and Publishing Bridge Confirmation

| Bridge | Exists? | Evidence | Status |
|---|---|---|---|
| AI command execute | Yes | `POST /media-manager/project/:project/ai/command`, `/ai/chat`, `/ai/guidance` | Built; provider-dependent |
| AI provider | Yes | `lib/ai/providers/openai.js`, `lib/ai/provider-config.js` | Built for OpenAI config; env-dependent |
| AI workflow bridge | Yes | `POST /media-manager/project/:project/ai/workflows/:workflowId/run` | Built as run record/output bridge |
| Workflow run bridge | Yes | `POST /media-manager/project/:project/workflows/:workflowId/run` | Built as durable record/handoff path |
| Handoff bridge | Yes | `GET/POST /handoffs`, `POST /handoffs/:handoffId/consume` | Built |
| Execution job bridge | Yes | `lib/execution/execution-job-bridge.js` | Built for publish/email/media/ads package execution states |
| Publishing package bridge | Yes | `POST /execute_publish_package` | Built, outputs `manual_publish_ready` |
| Email package bridge | Yes | `POST /execute_email_package` | Built, outputs `pending_execution` and `ready_for_provider_send` |
| Media prompt bridge | Yes | `POST /generate_media_from_prompt` | Partial; mock output marked `mock_output: true` |
| Ad package bridge | Yes | `POST /build_ad_execution_package` | Built as package builder/review bridge |
| Publishing schedule/status bridge | Yes | `/publishing/schedule`, `/:jobId/reschedule`, `/:jobId/ready`, `/:jobId/publish`, `/:jobId/fail` | Partial; records state and manual publish outcomes, external auto-publish remains next layer |
| Governance publishing guard | Yes | `assertPublishingMutationAllowed` | Built with freeze and approval-before-publish checks |

## Missing Pieces for 100% Production-Ready Backend

- Replace shared-key access with real auth: users, sessions/OAuth, tenant/project membership, RBAC, API keys by scope, service accounts, key rotation, and audit principals.
- Remove or deprecate `/public/...` mutation aliases and move to explicit `/api/...` versioned routes.
- Add a database-backed domain model for projects, assets, campaigns, content, media jobs, workflows, tasks, approvals, governance, integrations, publishing jobs, events, customer operations, and audit logs.
- Add migrations and schema ownership. Prisma evidence is empty, so either add Prisma or choose another formal migration layer.
- Add idempotency keys and transaction boundaries for all writes, especially publishing, integrations, media upload, project rename, WooCommerce mutations, and scheduler jobs.
- Add durable queue/workers for scheduler, publishing, AI jobs, media generation, integration sync, email send, and long-running workflows.
- Add immutable audit logs for every mutation with actor, project, request ID, before/after summary, route, IP/client, and result.
- Add route-level authorization and permission tests for every read/write route.
- Add customer operations write layer only after policy design: reply/send, CRM update, ticket assignment/status, call/IVR, provider webhooks, consent, PII retention, and human approval rules.
- Add production-grade provider adapters for publishing, email, CRM, messaging, calls/IVR, WooCommerce, Meta, TikTok, Google, analytics, and media generation.
- Add webhook ingestion verification for providers, including signatures, replay protection, idempotency, and dead-letter handling.
- Add validation schemas for every request body/query/path, not only ad hoc normalization.
- Add consistent error sanitization and structured error codes.
- Add rate limits for all sensitive reads/writes, not only Telegram/AI endpoints.
- Add secrets management and remove any possibility of key injection into browser output outside local development.
- Add backup/restore/disaster recovery procedures for file data or migrate to managed durable storage.
- Add concurrency controls or move away from JSON file writes before multi-user production.
- Add observability: metrics, traces, route latency, provider latency, queue depth, job status, failed mutation alerts, and security events.
- Add production CI: unit tests, integration tests, route contract tests, mutation safety tests, auth tests, provider mocks, filesystem persistence tests, and smoke tests.
- Add API documentation/versioning and a deprecation policy for legacy routes.

## Recommendations

### Phase 1: Lock Down Safety

1. Disable production use of `/public/...` write aliases or gate them behind an explicit compatibility flag.
2. Require user identity and role claims for every protected route, keeping the current control key only as a bootstrap/admin service key.
3. Add route permission mapping for all routes in `03-server-routes-all.txt`.
4. Add request validation schemas for all mutation routes.
5. Add audit logging for all write routes before changing persistence.

### Phase 2: Stabilize State

1. Define the production data model and migration strategy.
2. Move high-value state out of JSON files: projects, users, assets, tasks, approvals, publishing jobs, integrations, customer operations, events.
3. Add idempotency and transaction boundaries for all mutations.
4. Add durable queues for workflow/media/publishing/integration jobs.
5. Keep legacy file compatibility as read/import fallback, not primary production state.

### Phase 3: Complete Execution Bridges

1. Convert publishing bridges from manual/state records into provider adapters with dry-run, approval, execute, verify, rollback, and webhook confirmation states.
2. Complete email send provider bridge and delivery status ingestion.
3. Complete CRM/message/call/IVR customer operations mutations behind approval and consent policies.
4. Complete integration sync/import-history with provider-specific contracts and replay-safe jobs.
5. Add provider contract tests with mocked external systems.

### Phase 4: Production Observability and Compliance

1. Add structured logs, metrics, traces, and alerts for every critical route and worker.
2. Add PII classification, retention, deletion/export, consent enforcement, and customer-operation audit controls.
3. Add security tests for auth bypass, key misuse, route aliasing, path traversal, malformed JSON, upload abuse, and provider webhook spoofing.
4. Add backup/restore drills and runbooks.
5. Publish API docs and enforce route versioning.

### Phase 5: Legacy Route Retirement

1. Move WooCommerce/product legacy mutations behind a modern project-scoped API and approval model.
2. Retire `/task`, `/ingest`, Telegram command, scheduler worker HTTP trigger, and old helper endpoints or wrap them in the same v1 API/auth model.
3. Remove browser key bootstrap from any environment that is not guaranteed local-only.
4. Delete unused planned placeholders or implement them formally.

## Final Readiness Verdict

The backend is feature-rich and has meaningful safety work already in place, especially protected read/write middleware, project slug validation, read-only customer operations, AI/workflow/publishing bridges, and governance checks. It is best classified as a strong local/semi-automatic operations backend, not a 100% production-ready backend.

Estimated production readiness: 60-70% for internal controlled operation, 35-45% for multi-user/customer-data production SaaS operation.

The fastest path to production is not more routes. It is identity, authorization, durable state, transactional writes, queue/workers, provider contracts, customer-data controls, and test coverage.
