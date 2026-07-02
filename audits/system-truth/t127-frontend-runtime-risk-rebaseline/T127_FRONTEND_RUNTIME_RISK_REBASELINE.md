# T127 — Fresh Frontend Runtime Risk Rebaseline

## Status
Audit-only. No production files changed.

## Purpose
Create a fresh runtime-risk ranking after closing the major authority surfaces:

- Setup
- Customer Center
- Insights
- Media Studio
- Content Studio
- Research
- AI Command main
- AI Command Tool Dock
- Library
- Publishing
- Governance
- Operations Centers
- Workflows
- Settings
- Campaign Studio
- Integrations

## Summary
- Total page JS files scanned: 32
- Closed files excluded from active ranking: 14
- Open files remaining: 18
- Open files with positive runtime risk score: 18

## Top Open Runtime Risk Files
| Rank | File | Score | Lines | Main signals |
|---:|---|---:|---:|---|
| 1 | `media-studio-workspace.js` | 16724 | 3766 | ai_execution:716, mutation:613, handoff_task_workflow:382, publishing_governance:268, backend_api:184 |
| 2 | `content-studio-workspace.js` | 8378 | 2491 | ai_execution:386, mutation:285, handoff_task_workflow:201, backend_api:134, publishing_governance:117 |
| 3 | `home.js` | 5232 | 1164 | ai_execution:266, mutation:226, handoff_task_workflow:80, provider_integration:62, publishing_governance:59 |
| 4 | `integrations/builders.js` | 3620 | 818 | provider_integration:180, mutation:175, ai_execution:118, publishing_governance:7, handoff_task_workflow:4 |
| 5 | `integrations/cards.js` | 1694 | 414 | provider_integration:126, mutation:72, ai_execution:19, disabled_readonly:4, publishing_governance:1 |
| 6 | `integrations/drawer.js` | 1542 | 439 | provider_integration:121, mutation:59, ai_execution:18, disabled_readonly:2 |
| 7 | `ads-manager.js` | 946 | 624 | ai_execution:61, mutation:34, backend_api:16, publishing_governance:10, handoff_task_workflow:8 |
| 8 | `publishing/publishing-payloads.js` | 594 | 119 | handoff_task_workflow:24, mutation:19, publishing_governance:17, ai_execution:17, backend_api:4 |
| 9 | `integrations/render.js` | 574 | 206 | provider_integration:34, ai_execution:33, mutation:13 |
| 10 | `integrations/diagnostics.js` | 268 | 159 | provider_integration:19, mutation:13, ai_execution:2 |
| 11 | `home/render-sections.js` | 219 | 156 | ai_execution:23, mutation:8, backend_api:1, publishing_governance:1 |
| 12 | `library/command-router.js` | 138 | 64 | mutation:14, ai_execution:4, disabled_readonly:2, publishing_governance:1 |
| 13 | `library/ai-panel.js` | 117 | 123 | ai_execution:11, mutation:4, handoff_task_workflow:2, publishing_governance:1, disabled_readonly:1 |
| 14 | `integrations/utils.js` | 112 | 114 | mutation:7, provider_integration:7 |
| 15 | `library/action-panel.js` | 108 | 150 | disabled_readonly:25, mutation:13, publishing_governance:6, ai_execution:4, handoff_task_workflow:1 |
| 16 | `library/listener-lifecycle.js` | 76 | 63 | mutation:7, ai_execution:2, provider_integration:1 |
| 17 | `library/session-store.js` | 64 | 45 | publishing_governance:5, mutation:3 |
| 18 | `library/projection-adapter.js` | 57 | 21 | mutation:6, backend_api:1 |

## Closed Files
| Rank | File | Score | Lines | Main signals |
|---:|---|---:|---:|---|
| 1 | `ai-command.js` | 13423 | 6183 | ai_execution:1695, mutation:689, handoff_task_workflow:550, disabled_readonly:513, publishing_governance:320 |
| 2 | `ai-command/tool-dock.js` | -4597 | 1867 | ai_execution:308, publishing_governance:148, mutation:133, backend_api:103, handoff_task_workflow:80 |
| 3 | `campaign-studio.js` | -2830 | 2071 | ai_execution:559, mutation:212, backend_api:107, handoff_task_workflow:63, publishing_governance:52 |
| 4 | `customer-center.js` | -8958 | 470 | disabled_readonly:73, ai_execution:42, mutation:41, handoff_task_workflow:30, backend_api:23 |
| 5 | `governance.js` | 2068 | 1521 | publishing_governance:841, mutation:313, ai_execution:182, handoff_task_workflow:159, backend_api:65 |
| 6 | `insights.js` | -6887 | 1520 | ai_execution:175, mutation:158, backend_api:52, publishing_governance:23, handoff_task_workflow:20 |
| 7 | `integrations.js` | 2301 | 2006 | provider_integration:862, mutation:349, ai_execution:242, backend_api:61, publishing_governance:60 |
| 8 | `library.js` | -5053 | 3593 | mutation:300, disabled_readonly:293, ai_execution:215, backend_api:152, publishing_governance:50 |
| 9 | `operations-centers.js` | 2519 | 2280 | handoff_task_workflow:632, mutation:358, ai_execution:301, publishing_governance:238, backend_api:152 |
| 10 | `publishing.js` | 5818 | 2060 | mutation:934, publishing_governance:590, handoff_task_workflow:243, ai_execution:184, backend_api:77 |
| 11 | `research.js` | -6744 | 1642 | ai_execution:182, mutation:124, backend_api:64, publishing_governance:37, handoff_task_workflow:36 |
| 12 | `settings.js` | -1027 | 2057 | publishing_governance:414, mutation:318, ai_execution:285, provider_integration:112, backend_api:44 |
| 13 | `setup.js` | -5833 | 1792 | mutation:272, ai_execution:124, provider_integration:92, backend_api:46, disabled_readonly:22 |
| 14 | `workflows.js` | 3815 | 2407 | handoff_task_workflow:801, mutation:474, ai_execution:405, backend_api:143, provider_integration:57 |

## Decision Rule
Continue with the highest open positive-risk page unless it is:

1. helper-only,
2. already covered by a parent surface,
3. string-only referenced,
4. unused/dead file,
5. or better handled by a duplicate/dead-code cleanup pass.

If the top remaining files are low-risk helpers, run an ownership/usage audit before patching.

## Next Step
Use this rebaseline to choose T128.
