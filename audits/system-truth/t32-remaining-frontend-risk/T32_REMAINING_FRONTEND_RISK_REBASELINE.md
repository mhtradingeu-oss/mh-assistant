# T32 — Remaining Frontend Risk Rebaseline After Closeouts

## Status
Audit-only. No production files changed.

## Purpose
Rebaseline remaining frontend page risk after closing:
- Workflows
- Publishing
- Library
- AI Command
- AI Command Tool Dock
- Integrations
- Settings

## Counts
- Total page JS files: 35
- Closed targets excluded from next-page ranking: 7
- Remaining open page JS files: 28

## Closed Targets Snapshot
| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 1124.4 | `public/control-center/pages/publishing.js` | 2060 | 1 | 20 | 409 | 704 | 7 | 2 | 136 |
| 2 | P0 | 581.6 | `public/control-center/pages/ai-command.js` | 6183 | 1 | 34 | 166 | 566 | 0 | 6 | 505 |
| 3 | P0 | 411.3 | `public/control-center/pages/settings.js` | 2057 | 5 | 4 | 115 | 483 | 1 | 0 | 122 |
| 4 | P0 | 404.7 | `public/control-center/pages/integrations.js` | 1992 | 1 | 13 | 124 | 403 | 2 | 0 | 69 |
| 5 | P0 | 385.4 | `public/control-center/pages/library.js` | 3563 | 26 | 58 | 82 | 157 | 4 | 1 | 224 |
| 6 | P0 | 370.9 | `public/control-center/pages/workflows.js` | 2395 | 1 | 40 | 44 | 798 | 8 | 2 | 162 |
| 7 | P0 | 187.5 | `public/control-center/pages/ai-command/tool-dock.js` | 1867 | 4 | 8 | 53 | 162 | 0 | 0 | 37 |


## Remaining Open Page Ranking
| Rank | Priority | Score | File | Lines | innerHTML | Events | API/write signals | Authority words | Confirmations | Storage | Escape evidence |
|---:|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | P0 | 604.1 | `public/control-center/pages/media-studio-workspace.js` | 3659 | 1 | 27 | 197 | 447 | 0 | 4 | 280 |
| 2 | P0 | 418.2 | `public/control-center/pages/governance.js` | 1490 | 2 | 9 | 93 | 705 | 4 | 0 | 209 |
| 3 | P0 | 285.3 | `public/control-center/pages/content-studio-workspace.js` | 2404 | 1 | 14 | 90 | 205 | 0 | 4 | 180 |
| 4 | P0 | 241.3 | `public/control-center/pages/operations-centers.js` | 2268 | 5 | 26 | 49 | 300 | 1 | 0 | 268 |
| 5 | P0 | 138.7 | `public/control-center/pages/campaign-studio.js` | 2023 | 1 | 12 | 45 | 72 | 0 | 0 | 165 |
| 6 | P0 | 102.9 | `public/control-center/pages/home.js` | 1164 | 1 | 14 | 27 | 77 | 0 | 0 | 83 |
| 7 | P0 | 98.5 | `public/control-center/pages/setup.js` | 1787 | 3 | 25 | 17 | 25 | 0 | 6 | 172 |
| 8 | P0 | 78.2 | `public/control-center/pages/integrations/builders.js` | 818 | 0 | 0 | 22 | 91 | 0 | 0 | 17 |
| 9 | P1 | 62.2 | `public/control-center/pages/customer-center.js` | 470 | 0 | 1 | 20 | 50 | 0 | 0 | 28 |
| 10 | P1 | 50.5 | `public/control-center/pages/integrations/cards.js` | 414 | 0 | 0 | 15 | 43 | 0 | 0 | 8 |
| 11 | P1 | 43.8 | `public/control-center/pages/insights.js` | 1520 | 1 | 4 | 13 | 19 | 0 | 0 | 115 |
| 12 | P2 | 27 | `public/control-center/pages/publishing/publishing-payloads.js` | 119 | 0 | 0 | 6 | 29 | 0 | 0 | 6 |
| 13 | P2 | 26.2 | `public/control-center/pages/integrations/drawer.js` | 439 | 0 | 0 | 6 | 26 | 0 | 0 | 6 |
| 14 | P2 | 24.1 | `public/control-center/pages/research.js` | 1613 | 1 | 11 | 1 | 13 | 0 | 0 | 101 |
| 15 | P2 | 23.7 | `public/control-center/pages/ads-manager.js` | 624 | 1 | 4 | 5 | 10 | 0 | 0 | 62 |
| 16 | P2 | 22.3 | `public/control-center/pages/integrations/diagnostics.js` | 159 | 0 | 0 | 5 | 20 | 0 | 0 | 6 |
| 17 | P3 | 17.8 | `public/control-center/pages/library/action-panel.js` | 150 | 0 | 0 | 3 | 17 | 0 | 0 | 0 |
| 18 | P3 | 12.5 | `public/control-center/pages/library/command-router.js` | 64 | 0 | 0 | 1 | 14 | 0 | 0 | 0 |
| 19 | P3 | 12.3 | `public/control-center/pages/integrations/utils.js` | 114 | 0 | 0 | 1 | 14 | 0 | 0 | 2 |
| 20 | P3 | 11 | `public/control-center/pages/integrations/layout.js` | 187 | 0 | 0 | 1 | 10 | 0 | 0 | 3 |


## Suggested Next Step
Start with the highest remaining P1/P2 page from the open ranking, but audit-only first.

## Notes
This score is a heuristic prioritization model, not a security verdict.
Use exact focused audits before any patch.
Do not patch from T32 alone.
