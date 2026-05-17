# Official Documentation Structure Proposal

Generated: 20260517-132208 UTC
Mode: AUDIT-ONLY. No existing documentation or application source files were modified.
Audit folder: audits/documentation-canonicalization-20260517-132208

## Recommended Future Location

Use docs/mh-os/ for official canonical documentation. Keep audits/ as evidence and implementation history. Avoid audits/canonical/ as the primary source of truth because canonical docs should live with durable system documentation, not audit output.

## Proposed Structure

```text
docs/mh-os/
  README.md
  MH_OS_OPERATING_MODEL_AND_PAGE_RELATIONSHIP.md
  MH_OS_PAGE_QUALITY_STANDARD.md
  MH_OS_FRONTEND_ARCHITECTURE_MAP.md
  MH_OS_PAGE_REGISTRY_AND_WORKFLOW_MAP.md
  MH_OS_AI_TEAM_OPERATING_MODEL.md
  MH_OS_PAGE_TO_AI_TEAM_HANDOFF_CONTRACT.md
  MH_OS_CUSTOMER_AND_VOICE_OPERATIONS_MODEL.md
  MH_OS_IVR_VOICE_CHANNEL_MODEL.md
  MH_OS_PRODUCTION_READINESS_CHECKLIST.md
  MH_OS_BACKLOG_AND_RELEASE_SEQUENCE.md
  MH_OS_SAFE_UPGRADE_PROTOCOL.md
  archive-index.md
  evidence-index.md
```

## Canonical Ownership Rules

- Canonical docs state product direction and current truth.
- Audit docs provide evidence and lineage.
- Runtime/backend capability claims must cite source-code validation or current route inventories.
- Planned/disabled functionality must be explicitly labeled.
- No page is considered final unless it satisfies the page quality standard or has an approved deferral.

## Archive Index Proposal

Create a future docs/mh-os/archive-index.md that maps old plans to their superseding canonical doc. Do not move files until that index and an archive PR are approved.
