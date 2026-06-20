# T38 — Remaining Frontend Risk Rebaseline After Media Studio Closeout

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend page risk after closing Media Studio runtime authority.

## Closed Targets
- Workflows
- Publishing
- Library
- AI Command
- AI Command Tool Dock
- Integrations
- Settings
- Media Studio Workspace

## Counts
- Total page JS files: 35
- Closed targets excluded from next-page ranking: 8
- Remaining open page JS files: 27

## Closed Targets Snapshot
| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 1186 | `public/control-center/pages/publishing.js` | 2060 | 1 | 20 | 431 | 751 | 7 | 2 | 136 |
| 2 | P0 | 819.8 | `public/control-center/pages/media-studio-workspace.js` | 3753 | 1 | 29 | 261 | 709 | 1 | 4 | 280 |
| 3 | P0 | 729.5 | `public/control-center/pages/ai-command.js` | 6183 | 1 | 34 | 184 | 953 | 0 | 6 | 505 |
| 4 | P0 | 454.4 | `public/control-center/pages/workflows.js` | 2395 | 1 | 40 | 64 | 939 | 8 | 2 | 162 |
| 5 | P0 | 440.2 | `public/control-center/pages/settings.js` | 2057 | 5 | 4 | 128 | 484 | 1 | 0 | 122 |
| 6 | P0 | 420.6 | `public/control-center/pages/library.js` | 3563 | 26 | 58 | 97 | 165 | 4 | 1 | 224 |
| 7 | P0 | 406.7 | `public/control-center/pages/integrations.js` | 1992 | 1 | 13 | 124 | 410 | 2 | 0 | 69 |
| 8 | P0 | 201.2 | `public/control-center/pages/ai-command/tool-dock.js` | 1867 | 4 | 8 | 55 | 195 | 0 | 0 | 37 |


## Remaining Open Page Ranking
| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 440.5 | `public/control-center/pages/governance.js` | 1490 | 2 | 9 | 102 | 714 | 4 | 0 | 209 |
| 2 | P0 | 383.2 | `public/control-center/pages/content-studio-workspace.js` | 2404 | 1 | 14 | 113 | 374 | 0 | 4 | 180 |
| 3 | P0 | 322.3 | `public/control-center/pages/operations-centers.js` | 2268 | 5 | 26 | 61 | 495 | 1 | 0 | 268 |
| 4 | P0 | 176.9 | `public/control-center/pages/campaign-studio.js` | 2023 | 1 | 12 | 56 | 122 | 0 | 0 | 165 |
| 5 | P0 | 110.9 | `public/control-center/pages/home.js` | 1164 | 1 | 14 | 28 | 98 | 0 | 0 | 83 |
| 6 | P0 | 106 | `public/control-center/pages/setup.js` | 1787 | 3 | 25 | 19 | 36 | 0 | 6 | 172 |
| 7 | P0 | 78.8 | `public/control-center/pages/integrations/builders.js` | 818 | 0 | 0 | 22 | 93 | 0 | 0 | 17 |
| 8 | P1 | 69.8 | `public/control-center/pages/customer-center.js` | 470 | 0 | 1 | 20 | 77 | 0 | 0 | 28 |
| 9 | P1 | 68.4 | `public/control-center/pages/insights.js` | 1520 | 1 | 4 | 22 | 36 | 0 | 0 | 115 |
| 10 | P1 | 50.5 | `public/control-center/pages/integrations/cards.js` | 414 | 0 | 0 | 15 | 43 | 0 | 0 | 8 |
| 11 | P1 | 43.8 | `public/control-center/pages/research.js` | 1613 | 1 | 11 | 7 | 36 | 0 | 0 | 101 |
| 12 | P2 | 31.2 | `public/control-center/pages/publishing/publishing-payloads.js` | 119 | 0 | 0 | 6 | 44 | 0 | 0 | 6 |
| 13 | P2 | 26.2 | `public/control-center/pages/integrations/drawer.js` | 439 | 0 | 0 | 6 | 26 | 0 | 0 | 6 |
| 14 | P2 | 23.7 | `public/control-center/pages/ads-manager.js` | 624 | 1 | 4 | 5 | 10 | 0 | 0 | 62 |
| 15 | P2 | 22.3 | `public/control-center/pages/integrations/diagnostics.js` | 159 | 0 | 0 | 5 | 20 | 0 | 0 | 6 |
| 16 | P2 | 22.2 | `public/control-center/pages/library/action-panel.js` | 150 | 0 | 0 | 5 | 17 | 0 | 0 | 0 |
| 17 | P3 | 12.5 | `public/control-center/pages/library/ai-panel.js` | 123 | 0 | 0 | 2 | 6 | 0 | 0 | 0 |
| 18 | P3 | 12.5 | `public/control-center/pages/library/command-router.js` | 64 | 0 | 0 | 1 | 14 | 0 | 0 | 0 |
| 19 | P3 | 12.3 | `public/control-center/pages/integrations/utils.js` | 114 | 0 | 0 | 1 | 14 | 0 | 0 | 2 |
| 20 | P3 | 12 | `public/control-center/pages/home/render-sections.js` | 156 | 0 | 0 | 3 | 11 | 0 | 0 | 34 |


## Suggested Next Step
Start with the highest remaining P0/P1 page from the open ranking, audit-only first.

## Notes
This score is a heuristic prioritization model, not a security verdict.
Use exact focused audits before any patch.
Do not patch from T38 alone.
