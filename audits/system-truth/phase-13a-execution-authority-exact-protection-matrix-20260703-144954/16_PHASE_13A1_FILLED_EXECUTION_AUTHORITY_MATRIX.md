# PHASE 13A.1 — Filled Execution Authority Protection Matrix

## Status
NEEDS FOLLOW-UP PATCH PLAN — PUBLIC MUTATION ALIASES REQUIRE HARDENING DECISION

## Mode
Scan evidence classification only.

No production code change.

## Executive Verdict

The scan did not prove an AI Command silent execution path.

However, the backend exposes many `/public/media-manager/...` mutation aliases, including publishing, integrations, AI command, task, approval, handoff, source, workflow, and project setup writes.

The server comments say these public write aliases remain protected by the same centralized write-key middleware as canonical `/media-manager/...` routes, but Phase 13A did not yet prove route-by-route middleware coverage in a machine-checkable matrix.

Therefore this phase should not be locked as PASS. It should be locked as:

NEEDS FOLLOW-UP PATCH PLAN / AUTHORITY HARDENING PLAN

## Evidence Summary

### Confirmed safe

- No production diff.
- No forbidden diff.
- Syntax validation passed.
- AI Command actions are preview / handoff / route oriented.
- AI Command repeatedly states no execution, no publish, no send, no CRM mutation, no workflow run, no backend action.
- Frontend public write alias scan did not show direct calls to `/public/media-manager/...` write aliases.

### Confirmed risk surface

Backend public mutation aliases exist for:

- project rename/create/setup/team/template
- campaigns/content/media jobs
- workflow run
- AI command/chat/guidance/workflow run
- tasks
- approvals and approval decisions
- governance policy
- notifications patch
- handoffs and handoff consume
- sources create/delete
- integrations connect/reconnect/test/sync/import-history/disconnect
- publishing schedule/reschedule/ready/publish/fail

### Important note

These aliases may be protected by centralized write-key middleware, but Phase 13A should not assume protection without exact route-by-route proof or a dedicated hardening patch.

## Filled Matrix

| Category | Backend route/action | Method | Public alias exists | Frontend direct public alias caller | AI Command direct execution | Write protection proof | Confirmation gate | Governance gate | Audit log | Provider/external effect | Risk | Verdict |
|---|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Native media | /media-manager/project/:project/native-media/generate | POST | Not proven in public alias list | Unknown/canonical caller needs proof | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Needs policy proof | Has action logging indicators from Phase 13 | Yes/possible provider job | Critical | Needs follow-up proof |
| Publishing schedule | /media-manager/project/:project/publishing/schedule | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Needs governance mapping proof | Action logging appears present | External publish indirect/no direct publish | High | Needs hardening plan |
| Publishing reschedule | /media-manager/project/:project/publishing/:jobId/reschedule | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Needs governance mapping proof | Action logging appears present | External publish indirect/no direct publish | High | Needs hardening plan |
| Publishing ready | /media-manager/project/:project/publishing/:jobId/ready | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Needs approval mapping proof | Action logging appears present | Can mark ready for publishing | Critical | Needs hardening plan |
| Publishing publish | /public/media-manager/project/:project/publishing/:jobId/publish | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Must require approval/governance proof | Needs exact proof | Potential live publishing | Critical | Needs hardening / likely future retire public alias |
| Integrations connect | /media-manager/project/:project/integrations/:integrationId/connect | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Not governance, but critical auth required | Needs exact proof | External connector effect | Critical | Needs hardening plan |
| Integrations reconnect | /media-manager/project/:project/integrations/:integrationId/reconnect | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | Not governance, but critical auth required | Needs exact proof | External connector effect | Critical | Needs hardening plan |
| Integrations test | /media-manager/project/:project/integrations/:integrationId/test | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | N/A or connector policy | Needs exact proof | Possible external ping | High | Needs hardening plan |
| Integrations sync | /media-manager/project/:project/integrations/:integrationId/sync | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | N/A or connector policy | Needs exact proof | External data sync | High | Needs hardening plan |
| Integrations import history | /media-manager/project/:project/integrations/:integrationId/import-history | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | N/A or connector policy | Needs exact proof | External data import | High | Needs hardening plan |
| Integrations disconnect | /media-manager/project/:project/integrations/:integrationId/disconnect | POST | Yes | No direct public caller found | No direct AI silent execution proven | Needs exact middleware proof | Needs caller proof | N/A or connector policy | Needs exact proof | External connector destructive effect | Critical | Needs hardening plan |
| Workflow run | /public/media-manager/project/:project/workflows/:workflowId/run and AI workflow run | POST | Yes | Needs exact caller proof | AI Command has workflow preview but no silent run proven | Needs exact middleware proof | Needs caller proof | Needs operations authority proof | Needs exact proof | Internal execution | High/Critical | Needs hardening plan |
| Task create | /public/media-manager/project/:project/tasks | POST | Yes | Needs exact caller proof | AI Command task previews only; durable creation not proven | Needs exact middleware proof | Needs caller proof | Needs operations owner proof | Needs exact proof | Durable mutation | Medium/High | Needs hardening plan |
| Approval create | /public/media-manager/project/:project/approvals | POST | Yes | Needs exact caller proof | AI Command advisory only | Needs exact middleware proof | Needs caller proof | Governance owned | Needs exact proof | Durable approval mutation | High | Needs hardening plan |
| Approval decision | /public/media-manager/project/:project/approvals/:approvalId/decision | POST | Yes | Operations Centers has confirmation UI for decisions | AI Command cannot approve directly based on scan | Needs exact middleware proof | Confirmed in Operations Centers scan | Governance owned | Needs exact proof | Durable approval decision | Critical | Needs hardening plan |
| Handoff create | /public/media-manager/project/:project/handoffs | POST | Yes | Needs exact caller proof | AI Command handles draft/handoff previews; backend handoff creation needs exact proof | Needs exact middleware proof | Needs caller proof | Destination-owned | Needs exact proof | Durable handoff mutation | Medium/High | Needs hardening plan |
| Governance policy | /public/media-manager/project/:project/governance/policy | POST | Yes | Needs exact caller proof | AI Command advisory only | Needs exact middleware proof | Needs caller proof | Governance/admin owned | Needs exact proof | Policy mutation | Critical | Needs hardening plan |
| Notifications patch | /public/media-manager/project/:project/notifications/:notificationId | PATCH | Yes | Operations Centers Mark Read has confirmation/read-state-only wording | No AI direct mutation proven | Needs exact middleware proof | Confirmed for Mark Read path | N/A | Needs exact proof | Durable notification mutation | Medium | Safe with notes / needs proof |
| Sources create/delete | /public/media-manager/project/:project/sources and /sources/:sourceType | POST/DELETE | Yes | Needs exact caller proof | No AI direct mutation proven | Needs exact middleware proof | Needs caller proof | Source registry authority required | Needs exact proof | Durable source registry mutation/destructive | High/Critical | Needs hardening plan |

## Key Finding

The main risk is not AI Command silent execution.

The main risk is broad legacy `/public/media-manager/...` write alias exposure. Even if protected by write-key middleware, the system needs a dedicated hardening decision:

1. Keep public write aliases temporarily but prove write-key coverage.
2. Add explicit route retirement headers / warning telemetry.
3. Move frontend callers to canonical `/media-manager/...` routes if any remain.
4. Retire or block public mutation aliases in a future patch after compatibility proof.
5. Ensure publishing/integration/native-media routes have confirmation + audit + governance/owner gates.

## Recommended Next Phase

PHASE 13B — Public Write Alias Protection / Retirement Plan

Mode:
- PLAN ONLY first
- NO CODE CHANGE

Then, only after plan approval:

PHASE 13B.1 — Public Write Alias Hardening Patch

Possible tiny patch candidates:
- add explicit public mutation alias warning telemetry
- enforce/verify centralized write-key middleware for all public mutation aliases
- add response headers marking public mutation aliases deprecated
- block selected highest-risk public aliases only if frontend usage is proven zero
- keep canonical routes untouched
