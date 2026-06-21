# T71 — Remaining Frontend Risk Rebaseline After Core Surfaces

## Status
Audit-only. No production files changed.

## Baseline
This rebaseline excludes the runtime-authority surfaces already reviewed and closed through T70.

## Counts
- Total page JS files: 35
- Closed/excluded files: 14
- Remaining open files: 21

## Next Candidate
- File: `public/control-center/pages/media-studio-workspace.js`
- Priority: P0
- Score: 3437.3
- Lines: 3753

## Remaining Open Ranking
| Rank | File | Priority | Score | Lines | Events | Writes | Authority Words |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | `public/control-center/pages/media-studio-workspace.js` | P0 | 3437.3 | 3753 | 28 | 932 | 1344 |
| 2 | `public/control-center/pages/content-studio-workspace.js` | P0 | 1956.1 | 2461 | 15 | 563 | 671 |
| 3 | `public/control-center/pages/research.js` | P0 | 545.3 | 1613 | 11 | 131 | 252 |
| 4 | `public/control-center/pages/integrations/builders.js` | P0 | 191.4 | 818 | 0 | 45 | 101 |
| 5 | `public/control-center/pages/ads-manager.js` | P0 | 159.2 | 624 | 5 | 25 | 114 |
| 6 | `public/control-center/pages/publishing/publishing-payloads.js` | P0 | 148.7 | 119 | 0 | 40 | 62 |
| 7 | `public/control-center/pages/integrations/cards.js` | P0 | 83.8 | 414 | 0 | 20 | 43 |
| 8 | `public/control-center/pages/integrations/drawer.js` | P1 | 54.5 | 439 | 0 | 16 | 19 |
| 9 | `public/control-center/pages/library/command-router.js` | P1 | 47.2 | 64 | 0 | 14 | 16 |
| 10 | `public/control-center/pages/library/ai-panel.js` | P1 | 36.7 | 123 | 0 | 5 | 30 |
| 11 | `public/control-center/pages/library/listener-lifecycle.js` | P2 | 34.5 | 63 | 4 | 5 | 17 |
| 12 | `public/control-center/pages/library/action-panel.js` | P2 | 28.3 | 150 | 0 | 12 | 22 |
| 13 | `public/control-center/pages/integrations/diagnostics.js` | P2 | 25.4 | 159 | 0 | 6 | 13 |
| 14 | `public/control-center/pages/home/render-sections.js` | P2 | 25 | 156 | 0 | 7 | 19 |
| 15 | `public/control-center/pages/integrations/layout.js` | P2 | 24.2 | 187 | 0 | 4 | 20 |
| 16 | `public/control-center/pages/library/projection-adapter.js` | P2 | 16.1 | 21 | 0 | 6 | 2 |
| 17 | `public/control-center/pages/library/session-store.js` | P2 | 15.2 | 45 | 0 | 6 | 1 |
| 18 | `public/control-center/pages/integrations/render.js` | P2 | 15 | 206 | 0 | 2 | 12 |
| 19 | `public/control-center/pages/library/catalog-readiness.js` | P3 | 10.9 | 65 | 0 | 1 | 10 |
| 20 | `public/control-center/pages/integrations/utils.js` | P3 | 9.8 | 114 | 0 | 3 | 3 |
| 21 | `public/control-center/pages/integrations/state.js` | P3 | 5.6 | 93 | 0 | 2 | 1 |

## Closed / Excluded Surfaces
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`
- `public/control-center/pages/campaign-studio.js`
- `public/control-center/pages/customer-center.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/home.js`
- `public/control-center/pages/insights.js`
- `public/control-center/pages/integrations.js`
- `public/control-center/pages/library.js`
- `public/control-center/pages/operations-centers.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/settings.js`
- `public/control-center/pages/setup.js`
- `public/control-center/pages/workflows.js`

## Decision Rule
Take the next candidate from this ranking and perform a focused runtime-authority audit before any patch.
