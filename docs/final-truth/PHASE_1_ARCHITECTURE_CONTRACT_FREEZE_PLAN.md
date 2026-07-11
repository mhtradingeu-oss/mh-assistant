# Phase 1 Architecture Contract Freeze Plan

> **Phase 0 truth baseline**
>
> Current truth at Git HEAD `bf5681b9f291ed56595860fa4bbcdc747b406271`.
> This document is audit, planning, and reconciliation evidence.
> It is not runtime implementation and is not production certification.


Entry baseline: `bf5681b9f291ed56595860fa4bbcdc747b406271`. Phase 1 is a contract-and-shadow phase, not a product expansion, registry rewrite, provider rollout, archive operation, or data migration.

## Outcome and constraints

Phase 1 exits only when eight versioned contracts have one declared canonical location, schemas, validators, fixture coverage, compatibility mappings, consumer inventory, shadow comparisons, migration sequence and explicit non-goals. Existing runtime behavior remains authoritative until each migration is separately approved and proven.

Forbidden during Phase 1 contract freeze: enabling new providers; changing credentials; executing workflows/providers/scheduler; changing production data; deleting/archiving compatibility code or documents; silently renaming IDs/statuses; introducing a second capability/provider/task/job/workflow/library/memory/artifact system; or treating a schema proposal as implemented runtime behavior.

Recommended canonical location: `runtime/contracts/` for runtime-neutral JSON-schema-like definitions and pure validators, with domain adapters remaining under their current owners. Final location must first be checked against package/module boundaries; do not create it until the freeze design is approved.

## Contract plans

### Capability Contract

- Current ingredients/candidates: `backbone.js:52-255`, AI tool dock, integration adapters, media engine/model/worker registries, Audience OS templates, customer readiness flags.
- Missing fields: `id`, aliases, display name, domain, owner, surface, mode, input/output schema, handler, provider requirement, permissions, approval, job/workflow identity, artifact/version behavior, errors, readiness state/evidence, cost/privacy/region, deprecation.
- Duplicate/migration risk: very high; local tools and provider capabilities overlap semantically but are not proven duplicates.
- Schema proposal: immutable ID + version; typed inputs/outputs; owner references; execution mode enum; authority and approval policy references; provider requirements; persistence contract; readiness state ladder; evidence timestamp/HEAD.
- Validation/shadow: inventory every current capability source; adapt into a read-only federated projection; compare IDs, displayed readiness and handler resolution without changing execution.
- Exit: 100% inventoried sources, zero unexplained ID collisions, every visible capability maps to a handler or honest planned/placeholder state.

### Provider Contract

- Ingredients/candidates: AI provider registry/config, integration provider registry/adapter manager, native media provider catalog/router/readiness.
- Missing: universal capability IDs, credential reference (never secret), health, selection/fallback, retry/timeout, normalization, audit, cost, privacy, region, local/cloud, readiness evidence.
- Risk: a new global registry would duplicate working authorities. Use a federated contract/projection first.
- Schema: provider ID/domain/version; adapter owner; capabilities; configuration schema; credential-reference type; health probe; routing policy; timeout/retry; fallback; output schema; audit events; metadata; readiness ladder (`named`, `registered`, `configured`, `credentialed`, `healthy`, `routable`, `executes`, `tested`, `certified`).
- Shadow: compare current router choice/result normalization with contract-derived projection; no provider calls required for structural comparison.
- Exit: all providers represented, unsupported explicit, no secret values serialized, router differences explained.

### Mission Contract

- Ingredients/candidates: AI Full Team preview, workflow runs, tasks, handoffs, approvals, execution jobs, events.
- Missing: durable mission ID, user intent/context snapshot, participants, plan steps, dependencies, approval graph, executions/results, artifacts, learning links, terminal state.
- Risk: creating Missions as a second Workflow/Job system. Mission must reference, never replace, existing identities.
- Schema: mission ID/version/project; intent; context refs; roles; plan; linked task/workflow/job/handoff/approval/artifact IDs; state; audit timeline; outcome/learning refs.
- Shadow: derive mission views from existing records for selected fixtures; write nothing.
- Exit: every transition in intent→learning can carry correlation IDs; ownership and terminal semantics approved.

### Artifact Contract

- Ingredients/candidates: AI artifacts, execution artifact writer, media output storage, Library assets, content/campaign records.
- Missing: universal identity/type/MIME/schema, provenance, producer, project, mission/job refs, storage locator, checksum, sensitivity, approval, lifecycle, version head, retention.
- Risk: dual-write paths and incompatible domain semantics.
- Schema: artifact ID/type/schema version; project; producer/capability/provider; input provenance; canonical locator; SHA-256; created/updated; status; approval; version ref; lineage; retention/access policy.
- Shadow: adapt existing entities; compare IDs, paths, hashes and status without moving/writing files.
- Exit: all durable output classes map losslessly or have documented gaps; no storage migration in freeze phase.

### Handoff Contract

- Ingredients/candidates: backbone handoffs, shared frontend context, AI Command draft routing, `MH_OS_PAGE_TO_AI_TEAM_HANDOFF_CONTRACT.md`.
- Missing: one version, source/destination owner types, payload schema, artifact refs, required review/approval, acceptance/expiry/idempotency, audit/correlation IDs.
- Risk: UI context handoffs confused with durable backend handoffs.
- Schema: handoff ID/version/project; source/destination role/surface; intent; context/artifact refs; requested action; constraints; review/approval; state; timestamps; idempotency key; audit refs.
- Shadow: validate captured fixtures from every source/destination; compare normalization and routing.
- Exit: all active handoff producers/consumers pass; local-only handoffs labeled as such.

### Memory Contract

- Ingredients/candidates: backbone AI memory scopes, media learning memory, project context, recommendations/learning stores.
- Missing: subject/owner, provenance, confidence, sensitivity, consent, retention/expiry, write authority, contradiction/supersession, retrieval policy, audit.
- Risk: conflating knowledge, transient context, recommendations and learned patterns.
- Schema: memory ID/version/project; scope/subject; content or artifact ref; source; confidence; sensitivity; retention; status; supersedes; created-by; read/write policy; audit refs.
- Shadow: read-only adapters and retrieval comparison; redact secrets/PII fixtures.
- Exit: scope boundaries and deletion/retention policy approved; no silent learning writes.

### Governance Contract

- Ingredients/candidates: default policy rules, approval statuses, mutation gate, provider gate, route permissions, escalation chains.
- Missing: versioned policy bundle, subject/action/resource grammar, risk tier, approver rules, override constraints, evidence, decision expiry, audit correlation.
- Risk: Settings/frontends or default merges becoming parallel policy authority.
- Schema: policy ID/version/project scope; effect; subject; action; resource; conditions; risk; required approvals; override; expiry; source/evidence; audit event schema.
- Shadow: evaluate recorded/synthetic read-only decisions through current and proposed evaluators; zero unexplained allow decisions.
- Exit: deny/allow parity, all sensitive routes classified, defaults and overrides explicit.

### Version Contract

- Ingredients/candidates: backbone/system/entity versions, content revisions, artifact metadata, dual-path migration versions.
- Missing: universal version ID, parent/head, immutable content hash, schema version vs content version distinction, author/reason, approval, rollback pointer.
- Risk: retrofitting mutable JSON and confusing schema/runtime/content versions.
- Schema: version ID; entity/artifact ID; schema version; parent(s); SHA-256; created-by/at; reason; state; approval; canonical head; rollback reference.
- Shadow: generate read-only version projections/hashes for fixtures; compare existing revision semantics.
- Exit: semantics approved for every versioned domain; migrations and rollback explicitly designed.

## Validation program

1. Build a consumer/producer/import/call graph for all eight contracts.
2. Capture non-secret, non-mutating fixtures from tracked test/audit data only.
3. Validate schemas and alias/status mappings.
4. Run shadow projections against existing runtime outputs without changing authority.
5. Report every mismatch by severity and owner; zero silent coercion.
6. Add pure contract tests, route-policy parity tests, fixture tests and link checks.
7. Require separate approvals for runtime adoption, data migration, provider tests and UI changes.

## Documentation governance

- Maintain a canonical document manifest with domain, owner, status (`canonical`, `supporting`, `historical`, `superseded`), effective HEAD/date, replacement and inbound links.
- “final”, “master”, “canonical”, “PASS” and “CERTIFIED” in a title never establish current authority.
- Current code/runtime contracts outrank docs; docs must state target versus current implementation explicitly.
- A canonical replacement requires approved content comparison, unique-decision extraction, all inbound-link updates, a supersession banner/pointer, validator pass and separate commit.
- Historical evidence remains immutable; corrections are appended through new reconciliation records.

## Archive governance and proposed convention

Use an existing proven repository convention. If Phase 1 confirms none, use `audits/archive/` with subdirectories by domain and date; never create a competing archive root. Before any future move: tracked status, dynamic/runtime/script/test/doc/package references, SHA-256, unique decisions, recovery need, replacement, proposed path, owner, rollback and validation must be recorded in a manifest.

Superseded documents are not deleted merely because a replacement exists. Preserve a pointer or link mapping, update every inbound link, validate the documentation graph, and isolate cleanup in a dedicated commit containing no production/data/provider changes. Archive and removal commits must be separate from contract/runtime migrations.

## Phase sequence and exit criteria

- 1A: inventory/ownership and vocabulary freeze.
- 1B: schema proposals and pure validators.
- 1C: adapters and read-only shadow comparison.
- 1D: canonical document manifest/supersession policy.
- 1E: freeze review and signed evidence pack.

Phase 1 exits when all eight contracts have approved canonical locations and owners; every current producer/consumer is mapped; aliases/statuses are explicit; shadow mismatches are resolved or accepted; no new duplicate registry/system exists; no secrets/data/providers were mutated; forbidden changes are absent; tests and rollback plans pass; and a clean-HEAD evidence pack records the result.

Readiness at this Phase 0 baseline: **YES — ready to begin contract freeze, not ready to claim contract completion.**
