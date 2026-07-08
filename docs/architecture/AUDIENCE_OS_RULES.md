# Audience OS Rules

## Purpose

Audience OS is a platform-aware, manual-first, draft-only, governed audience planning system operated by the AI Team.

It is not a TikTok-only feature.

It helps the system generate, review, and govern audience blueprints before any external platform execution is allowed.

## Allowed Behavior

Audience OS may:

- Generate audience blueprints.
- Generate draft audience plans.
- Recommend include and exclude rules.
- Map canonical events to platform events.
- Identify missing tracking events.
- Recommend next actions.
- Request governance approval.
- Handoff to Ads Manager, Campaign Studio, AI Command, Insights, and Governance.

## Forbidden Behavior

Audience OS must not:

- Create audiences directly inside an external platform during MVP.
- Launch campaigns.
- Mutate budgets.
- Publish ads.
- Bypass provider execution gates.
- Bypass governance approval.
- Place business logic inside server.js.
- Place business logic inside Media OS.
- Place business logic inside TikTok or WooCommerce provider files.

## Canonical Backend Placement

Allowed future backend domain:

runtime/orchestrator-service/lib/growth/audience-os/

Preferred future backend files:

- runtime/orchestrator-service/lib/growth/audience-os/audience-template-registry.js
- runtime/orchestrator-service/lib/growth/audience-os/audience-blueprint-builder.js
- runtime/orchestrator-service/lib/growth/audience-os/audience-rule-engine.js
- runtime/orchestrator-service/lib/growth/audience-os/audience-platform-mapper.js
- runtime/orchestrator-service/lib/growth/audience-os/audience-governance.js
- runtime/orchestrator-service/lib/growth/audience-os/audience-readiness-scoring.js

## Canonical Frontend Placement

Allowed future frontend placement:

public/control-center/pages/ads-manager/audience-os-panel.js

Audience OS should appear inside Ads Manager as a section or tab.

Do not create this page without explicit later approval:

public/control-center/pages/audience-os.js

## Forbidden Placement

Audience OS business logic must not be added to:

- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/media/
- runtime/orchestrator-service/lib/integrations/providers/tiktok.js
- runtime/orchestrator-service/lib/integrations/providers/woocommerce.js
- public/control-center/pages/media-studio.js
- public/control-center/state/
- infra/

## AI Team Ownership

Default ownership model:

ownerRole: ads_operator
reviewRoles: strategist, analyst, compliance_reviewer
approvalRequired: true

Role responsibilities:

- Operations Lead owns readiness decision and routing.
- Strategist owns funnel architecture and audience blueprint.
- Ads Operator owns platform structure and campaign mapping.
- Analyst owns event health, audience size, and performance feedback.
- Researcher owns market and competitor audience angles.
- Content Writer owns audience-specific messaging.
- Media Director and Video Lead own creative briefs per audience.
- Compliance Reviewer owns GDPR, platform policy, claims, and risk review.
- Publisher owns Spark Ads and organic-to-paid bridge.

## Governance Rules

Audience OS must follow these rules:

- No platform write without approval.
- No campaign launch from Audience OS.
- No budget mutation from Audience OS.
- No lookalike recommendation if the source size is too small.
- No bottom-of-funnel campaign if purchase event is not verified.
- No no-purchase exclusion if purchase event is missing.
- External execution must later go through Provider Execution Gate.
- High-risk actions must go through Governance Mutation Gate.

## Platform Safety

Audience OS may read or map platform readiness signals.

Audience OS must not implement direct platform mutation logic.

External platform execution must follow this path:

Provider Capability -> Provider Execution Gate -> Governance Mutation Gate -> Approval -> Execution -> Audit Log

Forbidden direct path:

Button -> External API Mutation

## Duplication Rules

Do not create duplicate systems with names such as:

- audience-builder
- audience-constructor
- audience-manager
- audiences
- retargeting-engine
- lookalike-builder
- segment-builder

unless they are inside the canonical Audience OS domain and explicitly approved by the phase plan.

## Phase Rules

Completed phases:

- Phase 3A: deep truth scan.
- Phase 3A.1: active source scan.
- Phase 3B.1: Audience OS product contract repair.
- Phase 3C.1: contract validator and active scope guard.
- Phase 3C.4: rules and unified safety guard.

Next allowed implementation phase after guards:

Phase 3D - Audience Blueprint Registry MVP

Phase 3D must still be manual-first, draft-only, governed, and non-executing.

## Required Validation

Before and after any Audience OS change, run:

- node scripts/audit/validate-audience-os-contract.mjs
- node scripts/audit/audience-os-active-scope-check.mjs
- node scripts/audit/audience-os-safety-guard.mjs
- node scripts/audit/validate-ai-team-operating-contract.mjs
- node scripts/audit/ai-team-contract-conformance-check.mjs

## Commit Rules

Never use git add .

Audience OS commits must be narrow and must not include unrelated dirty files.

Forbidden in Audience OS commits unless explicitly approved:

- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/media/
- public/control-center/pages/media-studio.js
- data/projects/hairoticmen/ops/
- infra/
