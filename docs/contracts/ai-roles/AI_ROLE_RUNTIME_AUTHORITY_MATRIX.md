# AI Role Runtime Authority Matrix

## Status

Version: `1`

State: `contract-design-candidate`

This matrix records declarative role responsibility and current authority boundaries. It does not transfer runtime authority.

## Authority principles

1. AI Roles prepare, analyze, review, recommend, and hand off.
2. Existing backend and domain runtimes remain mutation authorities.
3. Provider execution remains with provider and execution owners.
4. Route authority remains with route and security owners.
5. Storage authority remains with each domain storage owner.
6. Approval and governance remain separate from role identity.
7. A role may be responsible for an outcome without being the execution owner.
8. No role is a registry, provider, route, storage layer, or database owner.

## Matrix

| Canonical role | Declarative responsibility owner | Current proven authority owner | Target or adoption owner | Review or approval owner | Authority result |
|---|---|---|---|---|---|
| `operations_lead` | mission coordination and specialist sequencing | existing mission, workflow, task, and execution services where present | canonical mission aggregate and orchestration adoption | governance and explicit approver | no direct mutation authority |
| `strategist` | strategy and prioritization preparation | existing campaign, workflow, content, and project services where present | canonical strategy and campaign handoff adoption | business owner and governance | no direct execution authority |
| `researcher` | research evidence and findings | existing research, Library, project-context, and source-reading paths where present | canonical research and retrieval adoption | source and evidence review | no source mutation authority |
| `writer` | written-content preparation | existing Content Studio and backend AI-command path | canonical Content capability runtime adoption | content review and governance | no publishing authority |
| `media` | visual and audio creative preparation | existing Media Studio, media runtime, and provider-owned execution paths | canonical Media capability runtime adoption | creative and governance review | no provider or publishing authority |
| `video_lead` | video planning and production handoff | existing video and native-media runtime paths where present | canonical Video capability runtime adoption | creative and governance review | no provider or publishing authority |
| `publisher` | publishing preparation and readiness | existing publishing, channel, and adapter paths where present | canonical Publishing capability runtime adoption | explicit publishing approval | no implicit publish authority |
| `ads` | paid-media planning and optimization preparation | existing ads, campaign, integration, and platform paths where present | canonical Ads capability runtime adoption | budget, compliance, and campaign approvers | no implicit spend authority |
| `analyst` | interpretation, reporting, and learning recommendations | existing insights, analytics, reporting, and learning paths where present | canonical analytics and learning adoption | evidence and business review | no source-data mutation authority |
| `compliance_reviewer` | compliance review and approval recommendation | existing governance, approval, policy, and security owners | canonical governance-review projection adoption | authorized approver | no legal or execution authority |
| `customer_ops` | customer-service preparation and escalation | existing customer-operations runtime and channel owners | canonical Customer Operations capability adoption | customer policy and escalation approvers | no implicit send or mutation authority |
| `sales_crm` | sales and CRM preparation | existing CRM, workflow, communication, and customer-domain paths where present | canonical Sales and CRM capability adoption | sales policy and commercial approvers | no implicit send or CRM mutation authority |

## Runtime-neutrality rules

This matrix must not be imported as a direct mutation router before the Canonical Runtime Adoption phase.

Any adoption must:

- resolve current owner first;
- compare role projection with current behavior;
- preserve old identifiers during compatibility;
- add no duplicate registry;
- add no second mutation owner;
- pass shadow comparison;
- preserve rollback.

## Multiple-owner verdict

No canonical AI Role is approved as an independent runtime mutation owner in Version 1.

Domain services, execution services, provider routers, route-security owners, and storage owners remain authoritative.
