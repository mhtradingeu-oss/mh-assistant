# Page Completion Matrix

| Page | Route ID | Primary purpose | Completion state | UX score | AI connection score | Workflow connection score | Responsive score | Main risk | Priority | Recommended next action |
|---|---|---|---:|---:|---:|---:|---:|---|---|---|
| Home / Dashboard | `home` | Executive status, readiness, next action, quick routing | Mostly Complete | 8 | 8 | 7 | 8 | Routes to missing `operations-centers` | P1 High | Fix Operations destination to registered route or add overview route |
| Setup | `setup` | Configure project identity, market, audience, dependencies | Mostly Complete | 8 | 7 | 8 | 8 | AI helper labels are partly local, not central AI Team | P2 Medium | Add explicit System Setup Assistant handoff |
| AI Team Command Center | `ai-command` | Central specialist AI room and output routing | Mostly Complete | 9 | 10 | 8 | 8 | Shared handoff reader defined but not invoked; missing `operations-centers`; `researcher` alias gap | P1 High | Standardize inbound AI handoffs and route aliases |
| Library / Brand Assets | `library` | Asset readiness, upload, preview, classify, status, archive/delete | Mostly Complete / Risky | 8 | 8 | 7 | 7 | Undefined `nextId` in pagination handler | P0 Critical | Fix pagination handler and verify selected-asset workflows |
| Campaign Studio | `campaign-studio` | Campaign planning, readiness, wave/channel routing | Mostly Complete | 8 | 9 | 9 | 8 | Autosave clarity | P2 Medium | Clarify save state and add create-task action |
| Content Studio | `content-studio` | Draft/improve/translate content and route outputs | Mostly Complete | 8 | 5 | 8 | 8 | AI handoff may arrive empty | P1 High | Set quick input or consume durable AI handoff |
| Media Studio | `media-studio` | Generate/review media outputs and route to publishing | Mostly Complete | 8 | 5 | 8 | 8 | AI handoff may arrive empty; duplicate conditional IDs | P1 High | Standardize AI handoff and runtime ID check |
| Publishing | `publishing` | Queue, approve, schedule, publish, fail, monitor publishing | Mostly Complete / Risky | 7 | 5 | 8 | 8 | AI handoff may arrive empty; action clarity | P1 High | Fix AI handoff and add Queue/Job Monitor next actions |
| Workflows | `workflows` | Prepare workflow packages and route to owner pages | Partial / Mostly Complete | 7 | 8 | 8 | 7 | Legacy unmounted execution-loop code; `researcher` mode mismatch | P1 High | Map research to Analyst or add specialist; clean legacy surface |
| Task Center | `task-center` | Durable task backlog, owners, status, due-state | Mostly Complete | 8 | 8 | 8 | 8 | Generic Open AI has no selected context | P2 Medium | Preload selected task AI prompt |
| Queue Center | `queue-center` | Operational queues and owner routing | Mostly Complete | 8 | 8 | 8 | 8 | Generic Open AI has no selected context | P2 Medium | Preload selected queue item prompt |
| Job Monitor | `job-monitor` | Job status, failures, logs, retry readiness | Mostly Complete | 8 | 8 | 8 | 8 | Retry/cancel controls deferred | P2 Medium | Keep deferred labels; preload selected job prompt |
| Notification Center | `notification-center` | Alerts, failures, approvals, provider and claim risk | Mostly Complete | 8 | 8 | 8 | 8 | Resolve/dismiss/delete deferred | P2 Medium | Preload selected alert prompt |
| Integrations | `integrations` | Connect/test/sync/import/disconnect platforms | Mostly Complete | 8 | 6 | 7 | 7 | AI specialist handoff not prominent; empty modular CSS files | P2 Medium | Add Operations Lead repair handoff and route failures |
| Settings | `settings` | Defaults, roles, AI behavior, approvals, governance bridge | Mostly Complete | 8 | 7 | 7 | 7 | Generic Open AI has no context; long form | P2 Medium | Preload settings summary prompt |
| Governance | `governance` | Approvals, policy, owners, violations, overrides | Mostly Complete / Risky | 8 | 7 | 7 | 7 | Backend approval decisions lack confirmation | P1 High | Add confirm gates for decisions and override |
| Insights | `insights` | Performance, SEO, paid, website, and optimization intelligence | Mostly Complete | 8 | 8 | 8 | 7 | Generic Open AI has no context | P2 Medium | Add Ask Analyst handoff and workflow route |
| Research | `research` | Market, audience, competitor, SEO, opportunity intelligence | Mostly Complete | 8 | 8 | 8 | 7 | Research/Analyst specialist naming mismatch | P2 Medium | Standardize research AI specialist mapping |
| Ads Manager | `ads-manager` | Paid media readiness, budget, pacing, creative mapping | Partial | 7 | 6 | 6 | 7 | Local-only budget/metric edits can look durable | P1 High | Add durable ad plan/task/handoff or label planning-only |
| Operations Centers Composite | `operations-centers` | Intended operations overview | Broken / Missing | 2 | 4 | 2 | N/A | Referenced but not registered | P0 Critical | Register overview route or change references |
| Customer Operations | Missing / Planned | Inbox, reply drafts, tickets, SLA, CRM handoff | Planned | 3 | 7 | 3 | N/A | AI specialist exists but no mounted page | P1 High | Keep draft/review only and route to Task Center until backend UI exists |

