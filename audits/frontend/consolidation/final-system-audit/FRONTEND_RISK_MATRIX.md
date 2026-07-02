# FRONTEND RISK MATRIX

Date: 2026-05-12
Evidence: audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt

| file | line count | ownership type | risk level | risk reason | next action | priority |
|---|---:|---|---|---|---|---|
| public/control-center/pages/media-studio-workspace.js | 3216 | Custom workspace surface, disableStandardLayout, heavy handoff orchestration | critical | Largest page, mixed UI + runtime + handoff persistence logic, high regression blast radius | helper extraction | P1 |
| public/control-center/pages/library.js | 2955 | Custom library operating surface, disableStandardLayout | high | Very large page with asset + handoff merge logic; high UX/state complexity | audit only | P2 |
| public/control-center/pages/content-studio-workspace.js | 2336 | Custom studio surface, disableStandardLayout, durable handoff routing | high | Large surface with drafting, approvals, routing, and persistence paths combined | helper extraction | P1 |
| public/control-center/pages/campaign-studio.js | 1981 | Custom studio surface, disableStandardLayout, route-handoff hub | high | Large orchestration page with multi-destination handoffs and mixed responsibilities | helper extraction | P2 |
| public/control-center/pages/workflows.js | 1992 | Custom workflows operating surface, disableStandardLayout, Auto Mode host | critical | Auto Mode controls, runAutomationPlan, global listener, and execution orchestration in one large page | runtime isolation | P0 |
| public/control-center/pages/settings.js | 1929 | Custom settings surface, disableStandardLayout, governance bridge projection | medium | Large but mostly configuration projection; some authority-adjacent concerns remain | backend projection alignment | P2 |
| public/control-center/pages/ai-command.js | 1976 | Custom AI workspace surface, disableStandardLayout, command center role | high | Core operating-room semantics and handoff consumption; high impact if behavior drifts | audit only | P1 |
| public/control-center/pages/publishing.js | 1838 | Custom publishing operating surface, disableStandardLayout, Auto Mode host | critical | Auto Mode start path and publishing execution controls in high-impact runtime surface | runtime isolation | P0 |
| public/control-center/pages/integrations.js | 1672 | Custom integrations surface, disableStandardLayout | medium | Large page and global key listener; operational impact but lower authority risk than publishing/workflows | audit only | P3 |

## Risk Type Summary

| file | primary risk type |
|---|---|
| public/control-center/pages/media-studio-workspace.js | large monolith |
| public/control-center/pages/library.js | UX complexity |
| public/control-center/pages/content-studio-workspace.js | backend/frontend authority mismatch |
| public/control-center/pages/campaign-studio.js | UX complexity |
| public/control-center/pages/workflows.js | Auto Mode |
| public/control-center/pages/settings.js | backend/frontend authority mismatch |
| public/control-center/pages/ai-command.js | runtime authority |
| public/control-center/pages/publishing.js | Auto Mode |
| public/control-center/pages/integrations.js | global listener |

## Notes
- Operations and Governance are not in this matrix because this table is limited to the requested large/high-risk surfaces list.
- Risk level reflects operational blast radius and authority sensitivity, not only code quality.
- Priority scale: P0 immediate audit/isolation, P1 near-term controlled extraction, P2 planned follow-up, P3 monitor and defer.
