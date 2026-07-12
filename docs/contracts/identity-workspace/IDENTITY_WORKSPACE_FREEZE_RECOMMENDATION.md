
Phase 1A-8 — Freeze Recommendation
Freeze decisions
1. Preserve the current Project runtime

Do not replace or rewrite the existing project runtime.

Target composition:

Authenticated Principal
→ Workspace
→ Membership
→ Authorized Project Context
→ Existing Project Runtime
2. Preserve project path isolation

Filesystem isolation is a valid security control and must remain in place.

It must be complemented by identity and permission enforcement, not replaced.

3. Preserve the existing security layers

Retain:

shared-key protection during compatibility;
route classification;
provider execution gates;
governance mutation gates;
approvals;
manual-execution proof;
audit logging.

Authenticated identity must be added above these layers.

4. Preserve the Operations Backbone

Do not create parallel systems for:

tasks;
jobs;
workflow runs;
handoffs;
approvals;
queues;
events;
notifications;
AI commands;
AI memory;
recommendations.
5. Preserve durable handoffs

Frontend shared-context caches remain transient UX compatibility only.

6. Freeze role vocabularies separately

Do not merge backend operational roles and frontend experience roles blindly.

The future contract must define:

operational_role_id
experience_role_id
aliases
compatibility mappings
permissions
service domains
page presentation
7. Build Workspace above Project

Workspace must provide:

ownership;
membership;
shared policy;
shared integrations;
shared assets;
shared relationships;
quotas and cost controls.

Project remains the business execution scope.

8. Do not migrate files or data yet

No asset, project, knowledge or HairoticMen migration is authorized before:

contracts;
compatibility mappings;
ownership maps;
shadow projections;
checksum proof;
rollback design.
9. No source switch before shadow comparison

Required sequence:

Inventory
→ Contract
→ Adapter
→ Shadow projection
→ Compare
→ Security review
→ Adoption decision
→ Source switch
10. Secret rotation is mandatory but deferred

Credential rotation must occur in a dedicated authorized security phase, not
inside this audit-only phase.
