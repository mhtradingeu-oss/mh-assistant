# AI Role Vocabulary Freeze Recommendation

> **Phase 1A-1 freeze notice:** This inventory freezes observed vocabulary at the audited HEAD and records recommendations only. It does not approve runtime role IDs, aliases, permissions, authority mappings, migrations, data rewriting, or enforcement changes.

## Executive recommendation

Freeze all observed identifiers now; add none and delete/rename none until a versioned Phase 1B contract separates conceptual roles, backend authority IDs, frontend projection IDs, display labels, AI Command lanes, and compatibility aliases. Use backend literals for current authorization and preserve raw incoming/stored values. Never authorize through the frontend alias map.

Evidence: backend authority is `runtime/orchestrator-service/lib/ops/backbone.js:114-262` (BACKEND_OPERATIONAL_AUTHORITY, HIGH); frontend aliases are `public/control-center/runtime/ai-team/ai-team-operating-contract.js:260-324,518-525` (FRONTEND_COMPATIBILITY, HIGH); HTTP security is scope/key based, not role based, in `runtime/orchestrator-service/lib/security/route-permission-catalog.js:154-203` (BACKEND_SECURITY_AUTHORITY, HIGH).

**Authority hierarchy:** current runtime code is implementation truth; these documents are an architectural inventory; any future contract is future authority only after explicit approval, shadow validation, migration review and runtime adoption.

## Proposed vocabulary (recommendation only)

| Conceptual role | Proposed conceptual ID | Current backend authority ID | Current backend domain owner | Frontend projection ID | Prompt persona | Prompt lane ID | Role kind | Runtime adoption status | Qualification flags | Preserved aliases | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Operations coordinator | operations | UNRESOLVED | UNRESOLVED | operations | operations | operations | AI_SPECIALIST | PROPOSED_NOT_APPROVED | AUTHORITY_MAPPING_UNRESOLVED; PROMPT_PERSONA_PRESENT | operations_lead, executive, head_office, command_center | Must remain separate from admin pending privilege-safe design and shadow proof |
| Administrator | admin | admin | no primary domain; governance reviewer | admin fallback; lossy-mapped elsewhere | none proven | none | HUMAN_OR_PRIVILEGED_MEMBER | EXISTING_BACKEND_AUTHORITY | PRIVILEGED_IDENTITY | admin | No operations↔admin authority mapping is approved |
| System automation | system_orchestrator | system actor only | system orchestration | none | none | none | SYSTEM_ACTOR | EXISTING_SYSTEM_ACTOR | NON_SELECTABLE | none | Exclude from specialist lists absent future actor contract |
| Strategy | strategist | strategist | strategist owns campaign | strategist | strategist | campaign | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | campaign, strategy | Existing authority ID; aliases remain scoped inputs |
| Content writing | writer | writer | writer owns content | writer | writer | content | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | content_writer, copywriter, content, copy | Alias deprecation requires later proof and approval |
| Visual production | designer | designer | designer owns media | folded into media_director | designer accepted by prompt map | media | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | AUTHORITY_MAPPING_UNRESOLVED | none | Asset production; remain distinct pending capability audit |
| Creative direction | media_director | UNRESOLVED | designer currently owns media | media_director | creative direction | media | AI_SPECIALIST | FRONTEND_EXPERIENCE_ONLY | AUTHORITY_MAPPING_UNRESOLVED; PROMPT_PERSONA_PRESENT | media, creative, visual; current designer mapping | Direction/review/orchestration; SPLIT_REQUIRED |
| Video | video_lead | video_lead | media owned by designer | video_lead | video_lead | video | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | video, motion, reel, storyboard, voiceover | Existing authority; domain ownership remains separate |
| Publishing | publisher | publisher | publisher owns publishing | publisher | publisher | operations | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | publish, publishing, schedule | Existing authority ID |
| Paid media | ads_operator | ads_operator | no dedicated backend ads domain | ads_operator | ads | ads | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | ads_optimizer, ads, paid, paid_media, roas | ads is a lane; ads_optimizer is display/legacy |
| Performance analysis | analyst | analyst | analyst owns research | analyst | analyst/SEO analyst | seo | AI_SPECIALIST | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT | seo_insights_analyst, insights, seo, reporting, metrics | SEO is contextual lane; analyst covers metrics/patterns |
| Evidence research | researcher | UNRESOLVED | analyst | researcher | researcher | research | AI_SPECIALIST | FRONTEND_EXPERIENCE_ONLY | PROMPT_PERSONA_PRESENT; AUTHORITY_MAPPING_UNRESOLVED | research | Evidence/market/competitor/sources; distinct from analyst |
| Compliance review | compliance_reviewer | compliance_reviewer | compliance_reviewer owns governance | compliance_reviewer | compliance_reviewer | compliance | AI_SPECIALIST/REVIEWER | EXISTING_BACKEND_AUTHORITY | PROMPT_PERSONA_PRESENT; REVIEWER_IDENTITY | compliance, governance, safety, approval | Aliases do not grant review authority |
| Customer operations | customer_ops | UNRESOLVED | UNRESOLVED | customer_ops | customer_ops | customer/support intent | AI_SPECIALIST | FRONTEND_EXPERIENCE_ONLY | PROMPT_PERSONA_PRESENT; AUTHORITY_MAPPING_UNRESOLVED | customer_operations, customer, support, inbox, ticket | Support/SLA/escalation; distinct from sales |
| Sales/CRM | sales_crm | UNRESOLVED | UNRESOLVED | sales_crm | sales | sales | AI_SPECIALIST | FRONTEND_EXPERIENCE_ONLY | PROMPT_PERSONA_PRESENT; AUTHORITY_MAPPING_UNRESOLVED | sales, crm, lead, retention, lifecycle | Pipeline/commercial relationships; distinct from support |
| Full-team coordination | none | none | none | team mode | none | team/executive | COORDINATION_MODE | COORDINATION_MODE_ONLY | NON_AUTHORIZATION_IDENTITY | team | Never a role or authorization identity |

## Alias status

- Preserve all aliases above as input compatibility values and record their source. Do not persist a rewritten value without also retaining the raw value.
- Future deprecation candidates after shadow proof: `content_writer`, `ads_optimizer`, `seo_insights_analyst`, `operations_lead`.
- Context-specific aliases that must not become global authority aliases: `media`, `content`, `ads`, `seo`, `research`, `compliance`, `customer`, `support`, `sales`, `crm`, `approval`, `governance`.
- `admin→operations` is not an approved semantic alias; it is a current frontend compatibility behavior. `designer→media_director` is likewise not approved for authority.

### Typed alias model (future documentation recommendation)

Aliases must carry a type and scope; they must not be treated as universally interchangeable:

- `LEGACY_ROLE_ID`: previously emitted/persisted role identifier accepted for compatibility.
- `DISPLAY_VARIANT`: presentation label or UI identity that grants no authority.
- `PROMPT_LANE`: routing/mode key such as media, ads or SEO; not necessarily a specialist identity.
- `INTENT_KEYWORD`: natural-language classifier input such as crm, ticket or storyboard.
- `PAGE_LABEL`: page-local label or owner presentation.
- `COORDINATION_MODE`: orchestration choice such as team; never an authorization principal.
- `CONTEXTUAL_ALIAS`: equivalence valid only in a named boundary/domain.

This taxonomy documents future contract needs only. It does not reclassify runtime strings or change current normalization.

## Required Phase 1B contract fields

These are recommendations for Phase 1B only; this document does not create or approve a schema.

### A. Identity

`contract_version`, `conceptual_role_id`, `source_role_id`, `source_vocabulary`, `canonical_runtime_id` (only after adoption is separately approved), `role_kind`, `runtime_adoption_status`.

### B. Authority

`backend_authority_role_id`, `route_visibility`, `route_execution_permissions`, `allowed_actions`, `forbidden_actions`. Visibility is not execution authority.

### C. Experience

`frontend_projection_id`, `display_label`, `ai_command_lane_id`, `aliases`, `page_owner_roles`, `page_support_roles`.

### D. Collaboration

`reviewer_roles`, `escalation_roles`, `handoff_from`, `handoff_to`, `workflow_ownership`, `task_ownership`.

### E. Capability and Provider Access

`tool_view_capabilities`, `tool_use_capabilities`, `tool_execute_capabilities`, `provider_prompt_personas`, `provider_capability_grants`. Prompt persona is not provider authorization.

### F. Data and Lifecycle

`memory_scope`, `context_scope`, `persistence_version`, `normalization_reason`, `unknown_role_behavior`, `compatibility_metadata`, `migration_metadata`, `provenance`.

Unknown-role behavior must preserve the raw ID, source vocabulary and normalization reason; return a structured unknown result; grant no backend authority; make any required fallback explicitly UX-only; log/shadow-report the unknown; and never silently persist the fallback as canonical truth.

### Future decision-provenance projection

A future structured result should recommend, without implementing, separate fields: `raw_role_id`, `source_vocabulary`, `conceptual_role_id`, `backend_authority_id`, `frontend_projection_id`, `prompt_persona`, `prompt_lane`, `normalization_reason`, `decision_reason`, and `contract_version`. Ingress should capture raw provenance; normalization should derive typed identities without overwriting raw input; decision boundaries should select only the identity dimension they require; egress should include version and provenance. No direct data rewrite is recommended.

## Future extensibility architecture (not implemented or approved)

### Custom AI roles

A future organization-scoped extension mechanism should allow Executive Assistant, Web Developer, Legal Advisor, Financial Advisor, Translator, Trainer, Coach and custom specialists without editing MH-OS core. Extensions should declare identity, provenance, prompt persona, capability requests, tool view/use/execute boundaries, provider grants, memory/context scope and project scope. Registration must not grant backend authority by default.

**Web Developer** may plan, generate code, review, refactor, test, advise on architecture and prepare deployment artifacts. Those capabilities are distinct from deployment authority, environment credentials, merge permission or production execution.

**Executive Assistant** may prepare scheduling, meetings, notes, reminders, inbox triage, coordination and administrative workflow drafts. The specialization must not inherit admin, calendar-write, messaging, approval or other privileged authority without separate grants and confirmation.

### Module contract

Future Restaurant, Salon, Accounting, Music, Marketplace, Booking, HR and CRM modules should integrate through an approved Module Contract rather than hard-coded role expansion. A module should declare pages, domain vocabulary, events, storage interfaces, capabilities, role relationships and isolation requirements. This is a future registration model only; no module registry is created here.

### Project isolation

Future identity, memory, artifacts and authority should be scoped through `Organization → Workspace → Project → Project Context → Brand → Environment`. No role, prompt context, handoff, provider credential, memory item or artifact should cross a boundary without an explicit independently authorized relationship. Existing enforcement completeness remains UNKNOWN_REQUIRES_PROOF.

### Human, AI and system identities

Future contracts must keep `HUMAN_USER`, `AI_SPECIALIST` and `SYSTEM_ACTOR` as different identity classes. Authentication, delegation, prompt persona, audit actor and operational authority must not be inferred across classes.

### AI Production Workspace vision

A future workspace may support long-running missions, durable artifacts, research, planning, versions, approvals and resumable work. Each transition should preserve provenance and require the owning boundary's authority. This is product vision, not a claim that missions, resume semantics or artifact versioning exist now.

### Storage evolution

Current project JSON behavior remains implementation truth. A future repository abstraction may support PostgreSQL for durable relational state, Redis for bounded ephemeral coordination, object storage for artifacts, and Docker-based deployment packaging. No direct migration is recommended. Any evolution must use additive repositories, dual reads/writes where safe, shadow validation, isolation tests, reversible cutover and rollback before approval.

## Migration order

1. Freeze and hash current vocabularies; inventory durable/browser values without mutation.
2. Complete Phase 1A-2 capability source inventory, especially tool/provider/memory scope.
3. Define Phase 1B additive, versioned contract and structured normalization result; retain raw IDs.
4. Add read-only dual resolution and decision logging. Existing backend decisions remain authoritative.
5. Shadow route, action, reviewer, escalation, task, workflow, handoff, tool, provider, memory and context decisions.
6. Resolve admin/operations, designer/media_director/media, researcher/analyst, and customer_ops/sales_crm explicitly.
7. Migrate producers before consumers, then durable data only with reversible per-record provenance.
8. Enforce only after reviewed parity/security exceptions and rollback rehearsal.

## Shadow comparison plan

For every observed raw role, alias, unknown value, route, action and stored record, compute `{legacy_decision, proposed_decision, raw_id, normalized_id, authority_id, reason}` without changing behavior. Compare allow/deny, page visibility, owner, reviewer, escalation chain, destination, tool visibility/use/execute, provider gate, prompt persona, memory filters and context inputs. Treat every privilege widening, identity loss, unknown→operations fallback, and researcher/customer/sales collapse as a blocking difference. Include missing/partial backend projections and browser handoff compatibility paths.

## Rollback plan

The future migration must be additive and feature-flagged. Rollback disables new resolution/enforcement, restores legacy reads and decisions, and leaves raw IDs and old fields intact. Never require a destructive data rewrite to roll back. Provider, route and governance gates must default to current backend behavior or deny when the authority identity is unknown.

## Unresolved decisions

- Whether operations becomes a new unprivileged backend authority role or remains purely conceptual.
- Whether designer and media_director are distinct roles or one role with separate capability profiles.
- Whether researcher becomes the research-domain owner and how existing analyst-owned records migrate.
- Backend authority and escalation membership for customer_ops and sales_crm.
- Provider capability grants and memory/context isolation per role.
- Whether system_orchestrator needs an actor contract separate from team roles.
- How route visibility, page ownership and execution permission are represented without conflation.

## Forbidden actions during the freeze

No role/alias/display rename; no permission, route, page-owner, workflow, handoff, approval, storage, provider or project-data change; no registry/schema/validator implementation; no implicit collapse; no unknown-value authorization fallback; no destructive migration.

## Phase 1A-1 exit criteria

- Five documentation files reviewed against current HEAD and evidence pack.
- Every identified source classified and authority boundaries stated.
- All discovered IDs/aliases and producer/consumer edges represented.
- Conflicts registered with proof and future subphase.
- Vocabulary freeze approved as recommendation only.
- Exactly five new documentation files, with no production/project-data/role/alias/permission change, commit or push.

On those conditions, Phase 1A-1 may exit to Phase 1A-2 capability source inventory; it is not approval to implement a role contract.
