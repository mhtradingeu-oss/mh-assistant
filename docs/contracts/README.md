# MH-OS Engineering Contracts Index

Status: Canonical engineering navigation index
Scope: Documentation only
Authority: Navigation and precedence guidance; runtime authority remains with the proven backend owners identified by each contract.

## Purpose

This directory contains the engineering contracts, source inventories, authority decisions, compatibility records, and supporting evidence used to govern MH-OS implementation.

This index is the primary navigation point for `docs/contracts/`. It does not replace the contracts it links to, and it does not convert historical evidence into runtime authority.

## Authority and Reading Order

Use this order when reviewing or implementing MH-OS:

1. Current runtime implementation truth and proven backend owners.
2. Approved canonical architecture and Architecture Decision Records.
3. Domain-specific canonical contracts and current-truth supplements.
4. Source inventories, producer-consumer maps, matrices, conflict registers, and freeze recommendations.
5. Historical audits and evidence.

Where documents appear to conflict, prefer the more recent, explicitly scoped current-truth or canonical contract, then verify the active runtime owner before changing code.

## Canonical Architecture

- [MH-OS Canonical Architecture](architecture/MH_OS_CANONICAL_ARCHITECTURE.md)
- [ADR-001: Principal, Workspace and Project Model](architecture/ADR-001-PRINCIPAL-WORKSPACE-PROJECT-MODEL.md)

## Identity and Workspace

- [Current Architecture Truth](identity-workspace/IDENTITY_WORKSPACE_CURRENT_ARCHITECTURE_TRUTH.md)
- [Runtime Truth Supplement](identity-workspace/IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md)
- [Current vs Target Matrix](identity-workspace/IDENTITY_WORKSPACE_CURRENT_VS_TARGET_MATRIX.md)
- [Gap Register](identity-workspace/IDENTITY_WORKSPACE_GAP_REGISTER.md)
- [Freeze Recommendation](identity-workspace/IDENTITY_WORKSPACE_FREEZE_RECOMMENDATION.md)
- [No-Patch Verdict](identity-workspace/IDENTITY_WORKSPACE_NO_PATCH_VERDICT.md)

## Capabilities

- [Canonical Capability Execution Contract](capabilities/canonical-capability-execution-contract.md)
- [Capability Source Inventory](capabilities/CAPABILITY_SOURCE_INVENTORY.md)
- [Capability Consumer-Producer Map](capabilities/CAPABILITY_CONSUMER_PRODUCER_MAP.md)
- [Capability ID and Alias Matrix](capabilities/CAPABILITY_ID_ALIAS_MATRIX.md)
- [Capability Conflict Register](capabilities/CAPABILITY_CONFLICT_REGISTER.md)
- [Capability Vocabulary Freeze Recommendation](capabilities/CAPABILITY_VOCABULARY_FREEZE_RECOMMENDATION.md)

## AI Roles

- [Canonical AI Role Contract](ai-roles/AI_ROLE_CANONICAL_CONTRACT.md)
- [AI Role Alias Freeze](ai-roles/AI_ROLE_ALIAS_FREEZE.md)
- [AI Role Runtime Authority Matrix](ai-roles/AI_ROLE_RUNTIME_AUTHORITY_MATRIX.md)
- [AI Role Consumer-Producer Map](ai-roles/AI_ROLE_CONSUMER_PRODUCER_MAP.md)
- [AI Role Source Inventory](ai-roles/AI_ROLE_SOURCE_INVENTORY.md)
- [AI Role ID and Alias Matrix](ai-roles/AI_ROLE_ID_ALIAS_MATRIX.md)
- [AI Role Conflict Register](ai-roles/AI_ROLE_CONFLICT_REGISTER.md)
- [AI Role Conflict Verdict](ai-roles/AI_ROLE_CONFLICT_VERDICT.md)
- [AI Role Vocabulary Freeze Recommendation](ai-roles/AI_ROLE_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Governance

- [Governance Approval Matrix](governance/GOVERNANCE_APPROVAL_MATRIX.md)
- [Governance Source Inventory](governance/GOVERNANCE_SOURCE_INVENTORY.md)
- [Governance Consumer-Producer Map](governance/GOVERNANCE_CONSUMER_PRODUCER_MAP.md)
- [Governance Conflict Register](governance/GOVERNANCE_CONFLICT_REGISTER.md)
- [Governance Vocabulary Freeze Recommendation](governance/GOVERNANCE_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Security and Route Authority

- [Route Access Scope Matrix](security/ROUTE_ACCESS_SCOPE_MATRIX.md)
- [Route, Permission and Security Source Inventory](security/ROUTE_PERMISSION_SECURITY_SOURCE_INVENTORY.md)
- [Route, Permission and Security Consumer-Producer Map](security/ROUTE_PERMISSION_SECURITY_CONSUMER_PRODUCER_MAP.md)
- [Route, Permission and Security Conflict Register](security/ROUTE_PERMISSION_SECURITY_CONFLICT_REGISTER.md)
- [Route, Permission and Security Vocabulary Freeze Recommendation](security/ROUTE_PERMISSION_SECURITY_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Providers

- [Provider Source Inventory](providers/PROVIDER_SOURCE_INVENTORY.md)
- [Provider Consumer-Producer Map](providers/PROVIDER_CONSUMER_PRODUCER_MAP.md)
- [Provider ID and Operation Model Matrix](providers/PROVIDER_ID_OPERATION_MODEL_MATRIX.md)
- [Provider Conflict Register](providers/PROVIDER_CONFLICT_REGISTER.md)
- [Provider Vocabulary Freeze Recommendation](providers/PROVIDER_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Missions, Tasks and Workflows

- [Mission, Task, Workflow and Job Matrix](missions/MISSION_TASK_WORKFLOW_JOB_MATRIX.md)
- [Mission and Workflow Source Inventory](missions/MISSION_WORKFLOW_SOURCE_INVENTORY.md)
- [Mission and Workflow Consumer-Producer Map](missions/MISSION_WORKFLOW_CONSUMER_PRODUCER_MAP.md)
- [Mission and Workflow Conflict Register](missions/MISSION_WORKFLOW_CONFLICT_REGISTER.md)
- [Mission and Workflow Vocabulary Freeze Recommendation](missions/MISSION_WORKFLOW_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Artifacts and Versioning

- [Artifact Source Inventory](artifacts/ARTIFACT_SOURCE_INVENTORY.md)
- [Artifact Consumer-Producer Map](artifacts/ARTIFACT_CONSUMER_PRODUCER_MAP.md)
- [Artifact ID, Version and Revision Matrix](artifacts/ARTIFACT_ID_VERSION_REVISION_MATRIX.md)
- [Artifact Conflict Register](artifacts/ARTIFACT_CONFLICT_REGISTER.md)
- [Artifact Version Vocabulary Freeze Recommendation](artifacts/ARTIFACT_VERSION_VOCABULARY_FREEZE_RECOMMENDATION.md)

## Product Documentation

For the product model, page architecture, AI Team operating model, release sequence, and production-readiness guidance, use the [MH-OS Canonical Documentation Set](../mh-os/README.md).

## Change Discipline

Before changing any contract or runtime behavior:

1. perform a current-HEAD truth scan;
2. discover existing capabilities and owners;
3. map producers and consumers;
4. confirm the source of truth;
5. design the narrow contract or implementation;
6. validate compatibility, authority boundaries, and regression risk;
7. commit and push only after explicit review and approval.
