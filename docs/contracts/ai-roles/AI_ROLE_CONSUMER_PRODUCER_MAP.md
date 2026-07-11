# AI Role Consumer / Producer Map

> **Phase 1A-1 freeze notice:** This inventory freezes observed vocabulary at the audited HEAD and records recommendations only. It does not approve runtime role IDs, aliases, permissions, authority mappings, migrations, data rewriting, or enforcement changes.

Current runtime code is implementation truth; this map is an architectural inventory; a future contract becomes authoritative only after explicit approval and adoption. Short evidence labels refer to the complete paths listed in `AI_ROLE_SOURCE_INVENTORY.md` and do not supersede them.

This graph records load-bearing edges. “Exact evidence” is current-HEAD code; confidence does not imply contract approval.

| Role value | Producer | Consumer | Field | Transformation | Authority impact | Exact evidence | Confidence | Migration risk |
|---|---|---|---|---|---|---|---|---|
| backend nine-role set | `TEAM_ROLE_DEFS` | route/domain/workflow projections | `id` | literal | Operational membership | `backbone.js:114-193` BACKEND_OPERATIONAL_AUTHORITY | HIGH | Critical |
| strategist/writer/designer/etc. | project templates | project team store | `ai_team_defaults` | none | Seeds durable team | `server.js:7334-7445` BACKEND_DOMAIN_MAPPING | HIGH | High |
| active role | backend team model | frontend router | `operations.team_service_model.active_role` | fallback admin | Controls UI route visibility | `authority-projection.js:81-88`; `route-role-fallback.js:53-66` | HIGH | Critical |
| role IDs | backend team model | Home/operations pages | `owner_role`, `reviewer_role`, `assignee_role` | lowercase/exact equality | Items may be hidden on alias drift | `home.js:286-288`; `operations-centers.js:713` FRONTEND_PROJECTION | HIGH | High |
| strategist | backbone defaulting | tasks/workflows/domain owner | `role`, `owner_role` | `normalizeRoleKey(...,'strategist')` | Ownership fallback | `backbone.js:361,533` BACKEND_OPERATIONAL_AUTHORITY | HIGH | High |
| system_orchestrator | backbone automation | events/audit consumers | `role` | none | Identifies system-produced activity | `backbone.js:392,2105,3477` | HIGH | Medium |
| compliance_reviewer/admin/strategist | domain + escalation definitions | approval/reviewer/escalation projections | `review_role`, chain entries | literal | Governance responsibility | `backbone.js:196-262` | HIGH | Critical |
| writer/designer/video_lead/publisher/ads_operator/analyst | service domains | handoff routing | `handoff_to` | literal | Allowed destination suggestion | `backbone.js:196-244` | HIGH | High |
| frontend 12-role set | operating contract | AI Command/page owners/tool dock | `id`, owner/support roles | canonical-or-alias | UX ownership only | contract `85-258,326-474`; tool dock `422-1229` | HIGH | High |
| admin | settings/backend projection | frontend contract normalizer | role ID | admin→operations | Can erase privileged identity | contract `260-265,518-525` | HIGH | Critical |
| designer | backend/project state | frontend contract normalizer | role ID | designer→media_director | Changes page/tool identity | contract `275-278,518-525` | HIGH | Critical |
| content_writer | legacy UI/session | frontend normalizer | role ID | content_writer→writer | Compatibility-only | contract `270-274` | HIGH | Medium |
| ads_optimizer | `ai-team-model.js` | page presentation | `id` | no shared normalizer proven | UI-only ID may miss backend consumers | `ai-team-model.js:60-68,114-117` | HIGH | High |
| seo_insights_analyst | `ai-team-model.js` | page presentation | `id` | contract can map→analyst | UI filter mismatch before normalization | `ai-team-model.js:69-77,107-125`; contract `295-299` | HIGH | Medium |
| operations_lead | `ai-team-model.js` | page owner display | `id` | contract can map→operations | Not a backend member | `ai-team-model.js:96-125`; contract `260-263` | HIGH | High |
| specialist ID | AI Command selection | backend AI orchestrator | `specialistId` / `specialist_id` | page aliases + backend mode map | Sets prompt identity, not execution grant | `ai-command.js:121-136`; `ai-orchestrator.js:182-219` | HIGH | High |
| media | AI Command lane | backend prompt mode/instruction | `specialistId` | media→content mode; creative instruction | Loses designer/media_director distinction | `ai-orchestrator.js:138-150,286-289` | HIGH | High |
| ads | AI Command lane | backend prompt mode/instruction | `specialistId` | ads→ads mode | Prompt identity differs from ads_operator | `ai-orchestrator.js:145,301-304` | HIGH | Medium |
| seo | AI Command lane | backend prompt instruction | `specialistId` | specialist mode mapping only if exact map present | Contextual analyst identity | `ai-orchestrator.js:146,306-309` | HIGH | Medium |
| researcher | frontend selection | backend prompt | `specialistId` | researcher→research mode | Prompt works without backend operational membership | `ai-orchestrator.js:147,188-190` | HIGH | High |
| customer_ops | frontend selection/context | backend prompt | `specialistId`; session `modeId` | exact | Customer-scoped guidance; no backbone authority | `ai-orchestrator.js:321-324`; `ai-command.js:5399-5406` | HIGH | High |
| sales_crm / sales | frontend selection | backend prompt | `specialistId` | frontend sales_crm may need lane conversion to sales | Prompt identity may fall to generic | contract `245-256`; `ai-orchestrator.js:326+` | MEDIUM | High |
| crm keyword | AI Command inference | selected specialist | inferred mode | crm→customer_ops | Conflates customer and sales concepts | `ai-command.js:672-674` FRONTEND_EXPERIENCE_MODEL | HIGH | High |
| page owner/support roles | frontend contract | page UX and destination routing | `ownerRole`, `supportRoles` | normalized frontend IDs | Does not grant backend permission | contract `326-474` | HIGH | High |
| route role list | backend projection or fallback | router visibility | route + role array | literal membership | UI gating only | `authority-projection.js:66-88`; fallback `15-66` | HIGH | Critical |
| HTTP caller key/scope | request/security catalog | backend route classification | access/scope | method/domain classifier | Actual HTTP security dimension, independent of AI role | `runtime/orchestrator-service/lib/security/route-permission-catalog.js:154-203` | HIGH | Critical |
| owner/reviewer role | studio pages | task/workflow/approval APIs | `owner_role`, `reviewer_role` | usually none | Durable ownership/review | campaign `469,499,1402`; content `667`; governance `1390`; workflows `1570` | HIGH | High |
| handoff route + context | AI Command/workspaces | shared-context/destination page | source/destination page, payload role fields | page-specific normalization | Context routing, not permission | `ai-command.js:2639-2772`; contract `476-491` | HIGH | High |
| campaign handoff role/context | AI Command preview | destination workspace | browser object | JSON serialization | Non-durable compatibility path | `ai-command.js:6319-6355` | HIGH | Medium |
| team settings | Settings page | project-team API/backend store | `active_role`, `owner_role`, members | literal payload | Durable governance/team configuration | `settings.js:740-746,1853-1859`; `api.js:2038-2052` | HIGH | Critical |
| specialist ID/name | AI orchestrator | provider prompt | prompt lines | lowercase only | Provider persona, not provider grant | `ai-orchestrator.js:193-258` | HIGH | High |
| role | operations projection | AI memory/context readers | unspecified | no uniform contract found | Memory isolation unproven | `authority-projection.js:61-64` | LOW | Critical |
| unknown raw role | `normalizeAiTeamRoleId` caller | frontend experience consumer | role ID | unknown→operations | Dangerous UX fallback; grants no proven authority | contract `518-525` FRONTEND_COMPATIBILITY | HIGH | Critical |
| owner role | campaign/content/research workspaces | task/workflow records and page filters | `owner_role` | literal/default | Task assignment and workflow ownership; not route execution permission | campaign `469,499,1402`; content `667`; research `1005` | HIGH | High |
| reviewer role | Governance/approval producer | approvals and reviewer queues | `reviewer_role` | literal | Reviewer responsibility only; not authority to approve unless separately enforced | governance `1390`; research `79` | HIGH | Critical |
| source/destination role | handoff producers | durable/browser handoff consumers | role-bearing payload fields | page-specific/unknown | Collaboration routing only; never destination execution grant | backbone `196-244`; AI Command `2639-2772` | MEDIUM | High |
| system_orchestrator | backend automation | audit/event projection | `role` | literal | `SYSTEM_ACTOR` provenance, never member selection | backbone `392,2105,3477` | HIGH | High |

## Graph interpretation

The backend authority graph and frontend experience graph meet through unversioned strings. No single normalization boundary is proven for durable project team, task, workflow, handoff, approval, browser session, and provider prompt paths. Accordingly, aliases must be preserved as input compatibility metadata while authorization checks continue to use the authoritative raw/backend identity until shadow comparison proves equivalence.

Route visibility, page ownership/support, backend execution permission, action permission, workflow ownership, task assignment, reviewer responsibility, escalation responsibility, tool view/use/execute, prompt persona, provider capability authorization, memory scope and context scope are independent consumer dimensions. An edge in this table proves only the stated dimension.

## Boundary precision required for a future contract

| Concern | Current observation | Future recommendation only |
|---|---|---|
| Source vocabulary | Backend, frontend operating contract, legacy page model, AI Command and stored records emit different strings | Record a stable `source_vocabulary` identifier at ingress |
| Raw value preservation | Uniform preservation is not proven | Retain `raw_role_id` unchanged beside any derived identity |
| Ingress boundary | Normalization occurs in multiple callers/helpers | Use one typed ingress result without changing current behavior until approved |
| Transformation boundary | Alias maps, keyword inference, lowercase conversion and fallbacks differ | Record each transformation and its `normalization_reason` |
| Normalization boundary | No system-wide boundary exists | Return structured conceptual, authority, projection, persona and lane outputs independently |
| Decision boundary | Route visibility, action execution, provider access and display selection are separate decisions | Record `decision_reason`, decision dimension and authority source for each decision |
| Egress boundary | Payloads may emit raw or locally normalized values | Emit the contract version and preserve source provenance; never rewrite durable truth silently |
| Unknown values | Frontend helper can fall back to operations | Preserve and report unknown; grant no backend authority; allow only an explicitly marked UX fallback |

## Handoff transport classes

| Transport class | Observed/future meaning | Authority rule |
|---|---|---|
| Browser context | In-page or browser-local context, including `localStorage` compatibility objects (`public/control-center/pages/ai-command.js:6319-6355`) | Not durable; never evidence of operational acceptance or execution authority |
| Session context | Current-session selection, messages and scoped context (`public/control-center/pages/ai-command.js:2639-2772,5399-5413`) | Ephemeral conversation context; not project-system truth |
| Durable operational handoff | Backend handoff lifecycle and role/domain routing (`runtime/orchestrator-service/lib/ops/backbone.js:196-244` and handoff builders/consumers) | Durable collaboration record only; destination execution still requires its own permission decision |
| Project storage handoff | A handoff persisted with project data, where proven by the backend storage path | Must retain project isolation, raw role provenance and persistence version; exact uniform behavior remains UNKNOWN_REQUIRES_PROOF |
