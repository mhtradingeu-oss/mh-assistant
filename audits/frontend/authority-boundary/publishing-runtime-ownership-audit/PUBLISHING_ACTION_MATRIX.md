# Publishing Action Matrix

| action/control | location/line | trigger | frontend/local state? | backend/API call? | durable? | approval required? | risk level | classification | recommendation |
|---|---|---|---|---|---|---|---|---|---|
| Filter queue chip | public/control-center/pages/publishing.js:1383-1388 | click data-publishing-filter | yes | no | no | no | low | Safe local UX | Keep local |
| Select queue row | public/control-center/pages/publishing.js:1391-1397 | click data-publishing-select | yes | no | no | no | low | Safe local UX | Keep local |
| Save Draft (local+optional backend draft save) | public/control-center/pages/publishing.js:1355-1378, 1427-1438 | click Save Draft buttons | yes | yes (savePublishingSchedule) | yes when API succeeds | no | medium | Authority-adjacent | Keep dual path but document local-only fallback clearly |
| Schedule item | public/control-center/pages/publishing.js:1440-1477 | click Schedule | yes | yes (savePublishingSchedule or reschedulePublishingItem) | yes for backend items | policy-dependent on backend | high | Needs backend confirmation | Keep backend as source of truth |
| Queue action: Review | public/control-center/pages/publishing.js:1492-1496 | click queue review action | yes | no | no | no | low | Safe local UX | Keep local |
| Queue action: Schedule jump | public/control-center/pages/publishing.js:1498-1503 | click queue schedule action | yes | no | no | no | low | Safe local UX | Keep local |
| Queue action: Publish (backend item) | public/control-center/pages/publishing.js:1520-1524 | click queue publish action | minor local | yes (publishPublishingItem) | yes | yes (backend governance gate) | critical | High-risk execution | Preserve backend gate, avoid frontend authority logic |
| Queue action: Publish (localOnly item) | public/control-center/pages/publishing.js:1509-1515 | click queue publish action on local draft | yes | no | no | no | high | Duplicate authority risk | Mark as local simulation only in UI copy before refactor |
| Queue action: Pause | public/control-center/pages/publishing.js:1526-1530 | click queue pause action | minor local | yes (reschedulePublishingItem status=draft) | yes | policy-dependent | medium | Needs backend confirmation | Keep backend mutation path |
| Queue action: Retry | public/control-center/pages/publishing.js:1532-1536 | click queue retry action | minor local | yes (reschedulePublishingItem status=scheduled) | yes | policy-dependent | high | Authority-adjacent | Keep backend mutation path |
| Approve selected item (backend) | public/control-center/pages/publishing.js:1542-1563 | click Approve | yes | yes (approvePublishingItem) | yes | yes | high | Needs backend confirmation | Keep backend governance as authority |
| Approve selected item (localOnly) | public/control-center/pages/publishing.js:1552-1557 | click Approve on local draft | yes | no | no | no | medium | Authority-adjacent | Keep as draft convenience only |
| Fail selected item (backend) | public/control-center/pages/publishing.js:1567-1587 | click Mark Failed | yes | yes (failPublishingItem) | yes | policy-dependent | high | High-risk execution | Keep backend as recorder of failure |
| Fail selected item (localOnly) | public/control-center/pages/publishing.js:1576-1580 | click Mark Failed on local draft | yes | no | no | no | medium | Authority-adjacent | Keep local-only and visually distinguish |
| Load Workflow Handoff | public/control-center/pages/publishing.js:1591-1610 | click Load Handoff | yes | no | no | no | medium | Safe local UX | Keep local hydration path |
| Send to AI Workspace | public/control-center/pages/publishing.js:1616-1652 | click Send to AI Workspace | yes (shared context map) | no direct API | no | no | medium | Authority-adjacent | Keep local, consider optional durable handoff later |
| Auto Prepare Publishing | public/control-center/pages/publishing.js:1655-1686 | click Auto Prepare Publishing | yes | via automation engine shared handoff; no direct publish API | mixed | gate at engine level | high | Needs explicit user action | Keep explicit click start only |
| Auto Stop | public/control-center/pages/publishing.js:1689-1694 | click Stop Auto Mode | yes | no | no | no | low | Safe local UX | Keep local |
| Auto Approve Gate | public/control-center/pages/publishing.js:1697-1702 | click Approve and Continue | yes | no direct publishing mutation | no | yes (human click) | medium | Needs explicit user action | Keep explicit click and gate semantics |
| Auto Skip Gate | public/control-center/pages/publishing.js:1705-1710 | click Skip Step | yes | no direct publishing mutation | no | yes (human click) | medium | Needs explicit user action | Keep explicit click and audit logs |
| Auto Mode subscription binding | public/control-center/pages/publishing.js:62-88 | render-time binding when enabled | module-level local | no | no | no | medium | Authority-adjacent lifecycle | Add teardown/registry later (no behavior change first) |
| Backend publishing schedule endpoint | runtime/orchestrator-service/server.js:11818-11849 | API POST /publishing/schedule | no | yes | yes | freeze rule can block | high | Backend authority | Keep as authoritative mutation entrypoint |
| Backend publishing reschedule endpoint | runtime/orchestrator-service/server.js:11884-11939 | API POST /publishing/:jobId/reschedule | no | yes | yes | freeze rule can block | high | Backend authority | Keep as authoritative mutation entrypoint |
| Backend publishing ready endpoint | runtime/orchestrator-service/server.js:11942-11981 | API POST /publishing/:jobId/ready | no | yes | yes | approval_before_publish enforced | critical | Backend authority | Keep strict governance gate |
| Backend publishing publish endpoint | runtime/orchestrator-service/server.js:11988-12049 | API POST /publishing/:jobId/publish | no | yes | yes + execution result | approval_before_publish enforced | critical | Backend authority | Keep strict governance gate |
| Backend publishing fail endpoint | runtime/orchestrator-service/server.js:12052-12113 | API POST /publishing/:jobId/fail | no | yes | yes + execution result | freeze/policy path | high | Backend authority | Keep backend recording path |
| Governance block function | runtime/orchestrator-service/server.js:13614-13704 | called before publish mutations | no | yes | yes | yes | critical | Backend authority | Must remain backend-owned |
| Durable approvals creation/decision | runtime/orchestrator-service/lib/ops/backbone.js:2555-2918 | backend workflow/governance APIs | no | yes | yes | n/a | high | Backend authority | Keep approval truth in backend only |
| Durable handoff create/consume | runtime/orchestrator-service/lib/ops/backbone.js:2931-3128 | backend handoff APIs | no | yes | yes | no | medium | Backend authority | Keep durable handoffs backend-owned |

## Matrix notes
- Frontend local draft statuses are useful UX but are not durable governance truth.
- Durable publish readiness/publish mutations are guarded by backend policy_rules (approval_before_publish, freeze_publishing).
- Auto Mode in publishing starts only on explicit user click and is constrained by automation-engine safety/gate rules.