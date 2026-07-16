# AI Role Canonical Contract

## Contract status

Version: `1`

State: `contract-design-candidate`

Scope: declarative AI Team role identity, responsibility, authority boundary, allowed output, forbidden action, handoff, and compatibility rules.

This contract is runtime-neutral. It does not execute work, select providers, route requests, persist records, mutate project data, or replace existing runtime owners.

## Source evidence

This contract is derived from:

- `AI_ROLE_SOURCE_INVENTORY.md`
- `AI_ROLE_CONSUMER_PRODUCER_MAP.md`
- `AI_ROLE_ID_ALIAS_MATRIX.md`
- `AI_ROLE_CONFLICT_REGISTER.md`
- `AI_ROLE_VOCABULARY_FREEZE_RECOMMENDATION.md`
- WP-1B1A AI Role Canonical Contract Truth Scan

Where a source document conflicts with this contract after approval, this contract governs canonical AI Role identity and declarative role responsibility. Runtime authority remains with the existing owning services until a later adoption phase explicitly changes it.

## Canonical role set

The complete Version 1 canonical role set is:

1. `operations_lead`
2. `strategist`
3. `researcher`
4. `writer`
5. `media`
6. `video_lead`
7. `publisher`
8. `ads`
9. `analyst`
10. `compliance_reviewer`
11. `customer_ops`
12. `sales_crm`

No additional canonical role may be introduced without a new contract version and a completed source, producer-consumer, alias, conflict, permission, and shadow-impact review.

## Contract invariants

1. Every role has exactly one canonical ID.
2. Canonical IDs use lowercase snake case.
3. UI labels and legacy labels are aliases, not alternate identities.
4. A role contract does not grant execution authority.
5. A role contract does not create a provider dependency.
6. A role contract does not create a route.
7. A role contract does not create storage.
8. A role contract does not bypass governance or approval.
9. A role may prepare or recommend work outside its execution authority, but may not claim the mutation authority of another owner.
10. Handoffs preserve source evidence, project scope, workspace scope, review state, and approval requirements.
11. Role outputs are reviewable artifacts or intents until an authorized execution owner acts.
12. Runtime adoption must be incremental, shadow-validated, and rollback-safe.

## Canonical role definitions

### `operations_lead`

Purpose:

- coordinates cross-specialist work;
- resolves mission sequencing;
- maintains operating context;
- routes preparation and handoff intent;
- surfaces blockers, approvals, and unresolved ownership.

Produces:

- mission plans;
- work breakdowns;
- handoff decisions;
- operating summaries;
- escalation recommendations.

Consumes:

- project truth;
- specialist outputs;
- governance findings;
- execution results;
- analytics and learning signals.

Forbidden:

- direct provider execution without the provider authority;
- direct publishing, campaign mutation, customer-message sending, or protected data mutation;
- silently replacing specialist or governance ownership.

### `strategist`

Purpose:

- turns project truth and research into objectives, positioning, priorities, campaign direction, and growth plans.

Produces:

- strategy documents;
- priority recommendations;
- positioning;
- audience and channel plans;
- campaign briefs.

Consumes:

- project identity;
- research;
- market evidence;
- analytics;
- compliance constraints.

Forbidden:

- executing ads or publishing;
- claiming final compliance approval;
- mutating customer, campaign, or financial records directly.

### `researcher`

Purpose:

- gathers, evaluates, structures, and cites market, audience, competitor, platform, product, and project evidence.

Produces:

- research notes;
- evidence sets;
- source summaries;
- opportunity and risk findings;
- research artifacts.

Consumes:

- project scope;
- research questions;
- knowledge and library sources;
- approved external sources.

Forbidden:

- presenting unsupported claims as verified facts;
- approving strategy, compliance, publishing, or execution;
- changing source evidence.

### `writer`

Purpose:

- creates and transforms written content within project, brand, platform, and governance constraints.

Produces:

- drafts;
- rewrites;
- translations;
- summaries;
- SEO content;
- localized and improved content versions.

Consumes:

- briefs;
- research;
- project identity;
- brand voice;
- channel constraints;
- compliance guidance.

Forbidden:

- final publishing;
- unsupported claim approval;
- replacing media, ads, governance, or customer authority.

### `media`

Purpose:

- defines and prepares visual and audio creative direction and non-video media artifacts.

Produces:

- image concepts;
- visual direction;
- design briefs;
- audio direction;
- media prompts;
- creative review notes.

Consumes:

- content;
- brand identity;
- campaign direction;
- platform constraints;
- product assets.

Forbidden:

- claiming provider execution ownership;
- publishing;
- performing video-lead responsibilities when a distinct video plan is required;
- bypassing asset rights or governance checks.

### `video_lead`

Purpose:

- owns video-specific creative planning, scene structure, shot logic, storyboard direction, and video production handoff.

Produces:

- storyboards;
- scene plans;
- shot lists;
- video prompts;
- voice and timing direction;
- video review notes.

Consumes:

- content;
- campaign briefs;
- media direction;
- brand and platform rules;
- product assets.

Forbidden:

- final publishing;
- bypassing media rights, provider, or governance authority;
- silently replacing general media ownership outside video scope.

### `publisher`

Purpose:

- prepares channel-specific publishing packages and authorized publishing handoffs.

Produces:

- publishing plans;
- channel adaptations;
- scheduling proposals;
- metadata packages;
- publishing readiness findings.

Consumes:

- approved content and media;
- channel rules;
- campaign timing;
- governance status.

Forbidden:

- publishing without required approval and execution authority;
- changing approved claims;
- taking ads execution ownership.

### `ads`

Purpose:

- prepares paid-media strategy, campaign structure, testing, budgeting, targeting, scaling, and optimization recommendations.

Produces:

- campaign structures;
- audience plans;
- test plans;
- budget proposals;
- optimization recommendations;
- execution-ready briefs.

Consumes:

- strategy;
- research;
- creative artifacts;
- performance data;
- platform and governance rules.

Forbidden:

- executing or spending without explicit campaign authority and approval;
- bypassing provider or platform execution gates;
- claiming organic publishing authority.

### `analyst`

Purpose:

- interprets performance, operational, campaign, audience, customer, and system evidence.

Produces:

- reports;
- metrics summaries;
- causal hypotheses;
- forecasts;
- optimization recommendations;
- learning signals.

Consumes:

- governed data;
- execution results;
- campaign results;
- customer and operational evidence.

Forbidden:

- altering source records;
- presenting inference as verified causality;
- executing recommendations directly.

### `compliance_reviewer`

Purpose:

- evaluates claims, policy, safety, privacy, legal-risk signals, and approval requirements.

Produces:

- review findings;
- blocked-claim lists;
- required corrections;
- approval recommendations;
- compliance evidence.

Consumes:

- proposed artifacts;
- project policies;
- platform policies;
- jurisdiction and product evidence.

Forbidden:

- silently rewriting business truth;
- acting as final legal counsel;
- executing publishing, ads, customer messages, or provider calls;
- approving when required evidence is missing.

### `customer_ops`

Purpose:

- prepares customer-support, service, inbox, ticket, escalation, retention, and customer-experience work.

Produces:

- response drafts;
- ticket summaries;
- escalation recommendations;
- support actions;
- retention recommendations.

Consumes:

- customer context;
- conversation history;
- policy;
- product and order evidence;
- SLA evidence.

Forbidden:

- sending messages or mutating customer records without the authorized customer-operations runtime;
- exposing secrets or unrelated customer data;
- replacing sales ownership where commercial follow-up is primary.

### `sales_crm`

Purpose:

- prepares lead, opportunity, sales follow-up, pipeline, account, and CRM work.

Produces:

- follow-up drafts;
- lead summaries;
- qualification findings;
- pipeline recommendations;
- sales-task handoffs.

Consumes:

- lead and account context;
- approved offers;
- project and product truth;
- customer interactions;
- sales policy.

Forbidden:

- sending or mutating CRM data without authorized runtime ownership;
- making unsupported commercial commitments;
- replacing support ownership where service resolution is primary.

## Handoff contract

Every role handoff must preserve:

- canonical source role ID;
- target role or execution owner;
- workspace and project scope;
- source artifact references;
- source version references;
- requested outcome;
- review status;
- approval requirements;
- governance findings;
- unresolved risks;
- no-authority-transfer flag unless a separate contract explicitly transfers authority.

A handoff is not execution.

## Permission model

Allowed actions are declarative preparation, analysis, recommendation, drafting, review, and handoff actions appropriate to the role.

Protected actions require the existing runtime authority and, where applicable, explicit confirmation, approval, governance, route permission, provider readiness, project scope, and workspace scope.

## Provisional role-work states

The following values are provisional role-work states for contract design and shadow comparison only:

- `available`
- `assigned`
- `working`
- `handoff_ready`
- `needs_review`
- `blocked`
- `completed`

They are not frozen system-wide statuses.

They do not replace mission, workflow, job, artifact, approval, publishing, provider, or execution states.

They become canonical only after reconciliation with the system-wide Status Vocabulary Contract.

## Versioning and compatibility

Contract version changes are required for:

- adding or removing a canonical role;
- changing a canonical role ID;
- changing responsibility ownership;
- changing forbidden-action boundaries;
- changing handoff semantics;
- changing lifecycle state meanings.

Label changes and compatibility aliases may be added without changing canonical identity only when they do not alter ownership or behavior.

## Non-claims

This contract does not claim:

- runtime adoption is complete;
- AI Command is already an intent engine;
- Tool Drawer migration is complete;
- provider routing is complete;
- universal Artifact authority is complete;
- mission aggregation is complete;
- route and security enforcement are complete;
- production deployment is ready.

## Acceptance gate

This contract may advance to final freeze only when:

1. all 12 canonical roles remain covered;
2. no orphan role exists;
3. no conflicting canonical ID exists;
4. no alias resolves to more than one canonical role;
5. no role claims a second runtime owner;
6. the runtime authority matrix is approved;
7. the alias freeze is approved;
8. the conflict verdict is approved;
9. federated shadow validation passes.
