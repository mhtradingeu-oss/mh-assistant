# Phase 13C — Public Mutation Alias Write-Key Coverage Matrix

## Legend

| Field | Meaning |
|---|---|
| Public alias exists | Route exists under /public/media-manager |
| Phase 13B.1 headers | Middleware detects mutation alias and adds visibility headers |
| Compatibility classification | classifyPublicAliasAccess applies public alias decision logic |
| Unauthorized production behavior | Expected outcome without write key in production |
| Authorized production behavior | Expected outcome with valid write key in production |
| Canonical route affected | Whether /media-manager canonical route is changed |
| Verdict | Coverage proof status |

## Matrix

| Category | Public alias/action | Public alias exists | Phase 13B.1 headers | Compatibility classification | Unauthorized production behavior | Authorized production behavior | Canonical route affected | Verdict |
|---|---|---:|---:|---:|---|---|---:|---|
| Publishing | publishing ready | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Publishing | publishing publish | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Publishing | schedule/reschedule/fail | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Integrations | connect/reconnect/disconnect | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Integrations | test/sync/import-history | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Governance | governance policy mutation | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Approvals | approval create/decision | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Sources | source create/delete | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Workflow | workflow run / AI workflow run | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Tasks | task create | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Handoffs | handoff create/consume | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Notifications | notification patch | yes | yes | yes | 403 route_permission_denied | allowed with deprecated headers | no | Covered by classification proof |
| Project/content/media | project/team/campaign/content/media writes | yes | yes | yes | 403 route_permission_denied in production public mutation | allowed with deprecated headers | no | Covered by classification proof |

## Important boundary

This proof is module-level/static middleware behavior proof.

It does not perform live HTTP requests and does not execute provider/publishing/integration mutations.

That is intentional for scan/test-only safety.
