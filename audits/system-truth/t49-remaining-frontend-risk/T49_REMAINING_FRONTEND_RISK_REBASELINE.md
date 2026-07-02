# T49 — Remaining Frontend Risk Rebaseline After Operations Centers Closeout

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend page risk after closing Operations Centers runtime authority.

## Closed Targets
- Workflows
- Publishing
- Library
- AI Command
- AI Command Tool Dock
- Integrations
- Settings
- Media Studio Workspace
- Governance
- Operations Centers

## Counts
- Total page JS files: 35
- Closed targets excluded from next-page ranking: 10
- Remaining open page JS files: 25

## Next Candidate
- File: `public/control-center/pages/content-studio-workspace.js`
- Priority: P0
- Score: 533.5
- Lines: 2404
- innerHTML: 1
- Events: 14
- API/write signals: 179
- Authority words: 392
- Confirmations: n/a
- Storage: 4
- Escape evidence: 180

## Closed Targets Snapshot

| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 1525.2 | `public/control-center/pages/publishing.js` | 2060 | 1 | 20 | 589 | 721 | 7 | 2 | 136 |
| 2 | P0 | 1381.5 | `public/control-center/pages/ai-command.js` | 6183 | 1 | 34 | 488 | 893 | 0 | 6 | 505 |
| 3 | P0 | 997.1 | `public/control-center/pages/media-studio-workspace.js` | 3753 | 1 | 29 | 338 | 737 | 1 | 4 | 280 |
| 4 | P0 | 798.7 | `public/control-center/pages/operations-centers.js` | 2268 | 5 | 26 | 274 | 523 | 1 | 0 | 268 |
| 5 | P0 | 784.4 | `public/control-center/pages/governance.js` | 1521 | 2 | 9 | 256 | 738 | 6 | 0 | 209 |
| 6 | P0 | 597.2 | `public/control-center/pages/settings.js` | 2057 | 5 | 4 | 207 | 424 | 1 | 0 | 122 |
| 7 | P0 | 465.1 | `public/control-center/pages/workflows.js` | 2395 | 1 | 40 | 132 | 443 | 8 | 2 | 162 |
| 8 | P0 | 387.2 | `public/control-center/pages/library.js` | 3563 | 26 | 58 | 79 | 187 | 4 | 1 | 224 |
| 9 | P0 | 273.4 | `public/control-center/pages/integrations.js` | 1992 | 1 | 13 | 83 | 256 | 2 | 0 | 69 |
| 10 | P0 | 266.2 | `public/control-center/pages/ai-command/tool-dock.js` | 1867 | 4 | 8 | 90 | 145 | 0 | 0 | 20 |

## Remaining Open Page Ranking

| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 533.5 | `public/control-center/pages/content-studio-workspace.js` | 2404 | 1 | 14 | 179 | 392 | 0 | 4 | 180 |
| 2 | P0 | 254.2 | `public/control-center/pages/campaign-studio.js` | 2023 | 1 | 12 | 90 | 131 | 0 | 0 | 165 |
| 3 | P0 | 211.6 | `public/control-center/pages/home.js` | 1164 | 1 | 14 | 73 | 104 | 0 | 0 | 83 |
| 4 | P0 | 99.1 | `public/control-center/pages/setup.js` | 1787 | 3 | 25 | 16 | 35 | 0 | 6 | 172 |
| 5 | P0 | 86.3 | `public/control-center/pages/customer-center.js` | 470 | 0 | 1 | 28 | 73 | 0 | 0 | 28 |
| 6 | P0 | 77.7 | `public/control-center/pages/insights.js` | 1520 | 1 | 4 | 26 | 38 | 0 | 0 | 115 |
| 7 | P1 | 52 | `public/control-center/pages/publishing/publishing-payloads.js` | 119 | 0 | 0 | 17 | 32 | 0 | 0 | 6 |
| 8 | P1 | 51.5 | `public/control-center/pages/research.js` | 1613 | 1 | 11 | 11 | 32 | 0 | 0 | 101 |
| 9 | P2 | 37.6 | `public/control-center/pages/integrations/builders.js` | 818 | 0 | 0 | 8 | 56 | 0 | 0 | 17 |
| 10 | P2 | 30.3 | `public/control-center/pages/ads-manager.js` | 624 | 1 | 4 | 8 | 10 | 0 | 0 | 62 |
| 11 | P2 | 21.9 | `public/control-center/pages/library/action-panel.js` | 150 | 0 | 0 | 5 | 16 | 0 | 0 | 0 |
| 12 | P3 | 16 | `public/control-center/pages/integrations/cards.js` | 414 | 0 | 0 | 1 | 30 | 0 | 0 | 8 |
| 13 | P3 | 15.5 | `public/control-center/pages/library/command-router.js` | 64 | 0 | 0 | 3 | 9 | 0 | 0 | 0 |
| 14 | P3 | 11 | `public/control-center/pages/integrations/drawer.js` | 439 | 0 | 0 | 0 | 19 | 0 | 0 | 6 |
| 15 | P3 | 9.4 | `public/control-center/pages/library/ai-panel.js` | 123 | 0 | 0 | 1 | 3 | 0 | 0 | 0 |
| 16 | P3 | 9.3 | `public/control-center/pages/integrations/diagnostics.js` | 159 | 0 | 0 | 0 | 13 | 0 | 0 | 6 |
| 17 | P3 | 8.7 | `public/control-center/pages/home/render-sections.js` | 156 | 0 | 0 | 2 | 7 | 0 | 0 | 34 |
| 18 | P3 | 8.4 | `public/control-center/pages/library/listener-lifecycle.js` | 63 | 0 | 1 | 0 | 3 | 0 | 0 | 0 |
| 19 | P3 | 7.7 | `public/control-center/pages/integrations/layout.js` | 187 | 0 | 0 | 0 | 6 | 0 | 0 | 3 |
| 20 | P3 | 7.3 | `public/control-center/pages/integrations/utils.js` | 114 | 0 | 0 | 0 | 4 | 0 | 0 | 2 |
| 21 | P3 | 7.2 | `public/control-center/pages/library/session-store.js` | 45 | 0 | 0 | 0 | 3 | 0 | 0 | 0 |
| 22 | P3 | 7 | `public/control-center/pages/library/projection-adapter.js` | 21 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| 23 | P3 | 6.9 | `public/control-center/pages/integrations/render.js` | 206 | 0 | 0 | 0 | 3 | 0 | 0 | 3 |
| 24 | P3 | 6.8 | `public/control-center/pages/integrations/state.js` | 93 | 0 | 0 | 0 | 2 | 0 | 0 | 1 |
| 25 | P3 | 6.7 | `public/control-center/pages/library/catalog-readiness.js` | 65 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |

## Suggested Next Step
Start with the highest remaining P0/P1 page from the open ranking, audit-only first.

## Notes
This score is a heuristic prioritization model, not a security verdict.
Use exact focused audits before any patch.
Do not patch from T49 alone.
