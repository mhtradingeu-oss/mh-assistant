# ADR-001: Principal -> Workspace -> Project Canonical Model

Status: Proposed
Decision type: Foundational architecture
Scope: MH-OS entity hierarchy and runtime authority

## Context

Repository evidence shows mature runtime authorities for Workspace and Project Identity.

The runtime also distinguishes security principal behavior from project business identity.

Organization and tenant vocabulary exists primarily in documentation and isolated references, without a proven canonical runtime lifecycle or authority.

## Decision

Adopt the following canonical model:

```text
Security Principal -> Workspace -> Project
```

Use Project as the universal business entity.

Treat brand, application, artist, store, clinic, restaurant, salon, agency, SaaS and other business types as Project templates or configurations.

Do not introduce Organization as a runtime authority at this stage.

## Consequences

Positive:

- aligns architecture with existing runtime;
- avoids duplicate entity authorities;
- supports any business type through Project templates;
- preserves separation between authentication and business identity;
- simplifies Workspace governance and Project scoping;
- reduces migration risk.

Constraints:

- documentation implying a mandatory Organization runtime must be corrected;
- Workspace ownership semantics must remain explicit;
- Project templates must not become parallel entity models;
- future Organization runtime requires a separate approved ADR and migration plan.

## Rejected Alternatives

### Identity -> Organization -> Workspace -> Project

Rejected for current implementation because no canonical Organization runtime, storage, lifecycle or ownership authority is proven.

### Principal equals Project Identity

Rejected because authentication identity and business identity serve different security and operational purposes.

### Brand as a top-level entity

Rejected because brand is one possible Project identity or template and would fragment the universal business model.

## Validation Required Before Adoption

- verify the authority files remain present;
- confirm no hidden Organization producer/storage authority exists;
- confirm Workspace-to-Project relationship authority;
- confirm project-local projection is subordinate;
- review documentation conflicts;
- run the existing Workspace, relationship, project identity and projection verification suites.
