# Final Canonical Source Map

> **Phase 0 truth baseline**
>
> Current truth at Git HEAD `bf5681b9f291ed56595860fa4bbcdc747b406271`.
> This document is audit, planning, and reconciliation evidence.
> It is not runtime implementation and is not production certification.


Baseline: `bf5681b9f291ed56595860fa4bbcdc747b406271`. “Canonical” means current runtime ownership proven by callers, not filename language. Where authority is split, the required result is `NO_SINGLE_CANONICAL_SOURCE`.

| Domain | Canonical source | Projection source | Compatibility source | Storage source | Tests/evidence | Confidence | Unresolved issue / classification |
|---|---|---|---|---|---|---|---|
| AI roles | NO_SINGLE_CANONICAL_SOURCE: `lib/ops/backbone.js:114-178` owns operational team roles; AI Command owns active chat roles | `public/control-center/ai-team-model.js:13-126`; `pages/ai-command.js` | AI Command alias normalizers; route-role fallback | project team JSON via backbone | `scripts/audit/validate-ai-team-operating-contract.mjs` | high | IDs/coverage differ; DUPLICATED |
| Route permissions | `lib/security/route-permission-catalog.js` + enforcement middleware | `runtime/authority/authority-projection.js` | `runtime/authority/route-role-fallback.js`; `backbone.js:180-194` | policy/project stores | backend permission scripts; route-shadow audits | high | Prove enforcement vs projection parity |
| Governance | `lib/ops/backbone.js` policy/approval operations + `lib/security/governance-mutation-gate.js` | `pages/governance.js` | default policy merge in backbone | project governance/approval JSON | governance verification scripts | high | Contract split between policy, gate, route |
| Approvals | backbone approval functions/status model | Governance/Publishing/Operations pages | legacy route aliases | project approvals JSON | durable approval scripts | high | Universal approval subject/action schema absent |
| Operations | `lib/ops/backbone.js` | `pages/operations-centers.js` | `/public` route aliases | project task/queue/job/notification/event JSON | operations authority audits | high | File concurrency/recovery |
| Workflows | backbone workflow functions + server handlers | `pages/workflows.js` | `/public` aliases | workflow-runs JSON | workflow audits | high | No universal Mission correlation |
| Handoffs | backbone handoff functions/server handlers | shared context + destination pages | local AI draft/handoff payloads | handoffs JSON | handoff audit scripts/docs | high | Payload schemas differ; NO_SINGLE_CANONICAL_SOURCE at contract level |
| Scheduler | server scheduler composition + `lib/execution/scheduler-storage.js` | Publishing/Operations | older execution package routes | scheduler JSON paths | scheduler verification scripts | medium-high | Retry/idempotency/recovery certification |
| AI provider registry | `lib/ai/provider-registry.js` | AI readiness in UI | env aliases in `provider-config.js` | environment only | live-readiness scripts, not run here | high | OpenAI-only; no global router |
| Integration registry | `lib/integrations/provider-registry.js` | Integrations page/API | unsupported adapter and route aliases | integrations/token/audit/sync JSON | integration audits | high | Separate from AI/media provider registries |
| Media model registry | `lib/media/native/models/model-registry-store.js` + `default-models.js` | Media Studio/native readiness | provider model catalog | native model/worker stores | native media audit docs/scripts | medium-high | Runtime availability not established |
| Media worker registry | `lib/media/native/registry/worker-registry-store.js` | Media readiness projection | external GPU worker adapter | worker registry store | protocol/demo files are not certification | high | Health/execution proof absent |
| Customer channel registry | customer runtime channel store + integration mapper | Customer Center | integration-seeded bridge | customer-operations stores | readiness snapshot | high | Voice/IVR/CRM false |
| Capabilities | NO_SINGLE_CANONICAL_SOURCE | AI tool dock, pages, readiness panels | historical capability maps | domain-specific | audit maps only | high | Specialized maps need federated contract, not new duplicate registry |
| Artifacts | NO_SINGLE_CANONICAL_SOURCE; backbone AI artifacts + execution writer + media output storage | AI/Content/Media/Library pages | canonical/legacy writer paths | multiple project files/output dirs | static/audit coverage | high | Universal Artifact Contract missing |
| Versions | NO_SINGLE_CANONICAL_SOURCE | content/media/page-local version UI | entity-specific fields | multiple JSON stores | no universal validator | high | Universal Version Contract missing |
| Memory | backbone AI memory operations | AI Command/API | media learning memory is separate domain | AI memory and media learning files | AI/learning scripts | high | Retention/privacy/provenance not unified |
| Recommendations | execution recommendation runtime + backbone recommendation store | Home/Insights/AI | smart suggestions legacy surface | recommendations/learning JSON | intelligence-loop scripts | high | Evaluation/confidence contract missing |
| Frontend routing | `public/control-center/router.js` | sidebar/index/app shell | route aliases/fallback map | N/A | frontend route audits | high | Route access must stay backend-projected |
| Project data | `lib/data/unified-data-path-resolver.js` + `lib/security/project-isolation.js` per domain callers | project selector/pages | legacy path fallback/dual write | `data/projects/<slug>/...` | isolation/storage scripts | high | NO_SINGLE_CANONICAL_SOURCE for every domain path until migration closes |
| Audit evidence | Git-tracked audit documents plus external Phase 0 pack for this run | this `docs/final-truth/` set | historical closeouts | repo `audits/`; `/tmp` pack is ephemeral | hash manifest `180_hash_manifest.sha256` | high | Define retention/import policy without copying in Phase 0 |
| CSS ownership | design-system/page CSS imports and index order | page modules/classes | `public/control-center/legacy/*.css` | N/A | CSS/frontend audits | medium | Full cascade ownership needs browser/import proof |
| Documentation doctrine | `docs/product/FINAL_PRODUCT_VISION_2027.md` for target; current code for implementation truth | `docs/mh-os/` | historical `audits/` | Git | link/governance audits | high | Titles do not confer authority; canonical manifest absent |

## Canonical-source conclusions

1. Backend operational authority is strongest in `runtime/orchestrator-service/lib/ops/backbone.js` and security middleware, but this does not make it the universal source for AI role UX, providers, artifacts or versions.
2. Provider authority is intentionally specialized today; a Phase 1 Provider Contract should federate it rather than replace working registries immediately.
3. Frontend role/tool/fallback maps are projections or compatibility sources and must not silently become enforcement sources.
4. Current code and tests outrank every “canonical”, “final”, “master”, “PASS”, or “CERTIFIED” document title.
