# Phase 13A — Execution Authority Exact Protection Matrix

## Legend

| Field | Meaning |
|---|---|
| Backend route | Exact backend route or primitive |
| Method | GET/POST/PATCH/PUT/DELETE/local write |
| Public alias | Whether /public equivalent exists |
| Frontend caller | Page/API helper that calls it |
| AI Command reachable | Direct / indirect / no / unknown |
| Write protection | write key / read key / middleware / unknown |
| Confirmation gate | frontend confirmation before action |
| Governance gate | approval/policy requirement |
| Audit log | explicit action/event logging |
| Provider execution | actual provider job/external effect |
| Risk | Low/Medium/High/Critical |
| Verdict | safe / safe with notes / needs follow-up / blocker |

## Routes to classify after scan review

| Category | Backend route/action | Method | Public alias | Frontend caller | AI Command reachable | Write protection | Confirmation gate | Governance gate | Audit log | Provider execution | Risk | Initial verdict |
|---|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Native media | /media-manager/project/:project/native-media/generate | POST | likely yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/unknown | Critical | Needs exact proof |
| Publishing | /media-manager/project/:project/publishing/schedule | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | no/indirect | High | Needs exact proof |
| Publishing | /media-manager/project/:project/publishing/:jobId/reschedule | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | no/indirect | High | Needs exact proof |
| Publishing | /media-manager/project/:project/publishing/:jobId/ready | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | no/indirect | Critical | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/connect | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/external | Critical | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/reconnect | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/external | Critical | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/test | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | maybe | High | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/sync | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/external | High | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/import-history | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/external | High | Needs exact proof |
| Integrations | /media-manager/project/:project/integrations/:integrationId/disconnect | POST | yes/no to verify | TBD | TBD | TBD | TBD | TBD | TBD | yes/external | Critical | Needs exact proof |
| Workflow | recordWorkflowRun / workflow route | local/POST | TBD | TBD | TBD | TBD | TBD | TBD | TBD | no | High | Needs exact proof |
| Task | createTask / task route | local/POST | TBD | TBD | TBD | TBD | TBD | TBD | TBD | no | Medium/High | Needs exact proof |
| Approval | createApproval / decide approval | local/POST/PATCH | TBD | TBD | TBD | TBD | TBD | TBD | TBD | no | High/Critical | Needs exact proof |
| Handoff | createHandoff / handoff route | local/POST | TBD | TBD | TBD | TBD | TBD | TBD | TBD | no | Medium/High | Needs exact proof |
