# T135 — Fresh Frontend Runtime Risk Rebaseline

## Status
Generated.

## Baseline
- Media Workspace closed at `70a6640`.
- Content Workspace closed at `3ab22f2`.

## Summary

- Total page JS files: 32
- Closed files: 13
- Open files: 19
- Open positive-risk files: 16

## Top Open Runtime Risk Files

| Rank | File | Score |
|---:|---|---:|
| 1 | `home.js` | 2360 |
| 2 | `insights.js` | 2060 |
| 3 | `setup.js` | 1330 |
| 4 | `customer-center.js` | 1180 |
| 5 | `publishing/publishing-payloads.js` | 1085 |
| 6 | `integrations/builders.js` | 1020 |
| 7 | `integrations/cards.js` | 520 |
| 8 | `ads-manager.js` | 405 |
| 9 | `integrations/drawer.js` | 345 |
| 10 | `integrations/diagnostics.js` | 270 |
| 11 | `library/action-panel.js` | 200 |
| 12 | `home/render-sections.js` | 60 |
| 13 | `library/ai-panel.js` | 60 |
| 14 | `integrations/utils.js` | 55 |
| 15 | `integrations/render.js` | 50 |
| 16 | `library/listener-lifecycle.js` | 25 |

## Decision
Use this rebaseline to select the next exact runtime authority audit target.

Do not patch from this rebaseline alone. Run an exact action-path audit first.