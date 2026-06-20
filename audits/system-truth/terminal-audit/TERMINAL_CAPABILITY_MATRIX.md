# Terminal Capability Matrix

## Capability Matrix
| Capability | server.js hits | lib hits | frontend page hits | Status |
|---|---:|---:|---:|---|
| governance | 129 | 328 | 16 | partial/connected |
| approval | 252 | 822 | 16 | partial/connected |
| handoff | 35 | 193 | 19 | partial/connected |
| workflow | 66 | 315 | 18 | partial/connected |
| campaign | 617 | 872 | 19 | partial/connected |
| publishing | 458 | 775 | 21 | partial/connected |
| learning | 151 | 579 | 8 | partial/connected |
| integration | 547 | 1732 | 22 | partial/connected |
| media | 2055 | 2495 | 18 | partial/connected |
| security | 478 | 1004 | 0 | backend-present / frontend-hidden-or-unclear |

## Page Matrix
| Page | Lines | API refs | Has AI refs | Has Action Panel refs | disableStandardLayout | Risk | Priority |
|---|---:|---:|---|---|---|---:|---|
| public/control-center/pages/ads-manager.js | 624 | 0 | yes | no | yes | 3.5 | P3 |
| public/control-center/pages/ai-command.js | 6183 | 18 | yes | no | yes | 40.4 | P0 |
| public/control-center/pages/ai-command/tool-dock.js | 1867 | 0 | yes | no | no | 15.8 | P1 |
| public/control-center/pages/campaign-studio.js | 2023 | 38 | yes | no | yes | 13.1 | P1 |
| public/control-center/pages/content-studio-workspace.js | 2404 | 12 | yes | no | yes | 13 | P1 |
| public/control-center/pages/customer-center.js | 470 | 0 | yes | yes | no | 0.5 | P3 |
| public/control-center/pages/governance.js | 1490 | 7 | yes | yes | yes | 7.5 | P2 |
| public/control-center/pages/home.js | 1164 | 0 | yes | yes | yes | 9 | P2 |
| public/control-center/pages/home/render-sections.js | 156 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/insights.js | 1520 | 17 | yes | no | yes | 4.1 | P3 |
| public/control-center/pages/integrations.js | 1965 | 0 | yes | no | yes | 17.3 | P1 |
| public/control-center/pages/integrations/builders.js | 818 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/cards.js | 414 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/diagnostics.js | 159 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/drawer.js | 439 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/layout.js | 187 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/render.js | 206 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/integrations/state.js | 93 | 0 | no | no | no | 0 | P3 |
| public/control-center/pages/integrations/utils.js | 114 | 0 | no | no | no | 0 | P3 |
| public/control-center/pages/library.js | 3563 | 8 | yes | yes | yes | 90.3 | P0 |
| public/control-center/pages/library/action-panel.js | 150 | 0 | yes | yes | no | 0 | P3 |
| public/control-center/pages/library/ai-panel.js | 123 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/library/catalog-readiness.js | 65 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/library/command-router.js | 64 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/library/listener-lifecycle.js | 63 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/library/projection-adapter.js | 21 | 0 | no | no | no | 0 | P3 |
| public/control-center/pages/library/session-store.js | 45 | 0 | no | no | no | 0 | P3 |
| public/control-center/pages/media-studio-workspace.js | 3659 | 11 | yes | no | yes | 22.8 | P0 |
| public/control-center/pages/operations-centers.js | 2268 | 23 | yes | yes | yes | 22.8 | P0 |
| public/control-center/pages/publishing.js | 2037 | 0 | yes | no | yes | 135.2 | P0 |
| public/control-center/pages/publishing/publishing-payloads.js | 119 | 0 | yes | no | no | 0 | P3 |
| public/control-center/pages/research.js | 1613 | 22 | yes | no | yes | 6.6 | P2 |
| public/control-center/pages/settings.js | 2057 | 9 | yes | yes | yes | 8.3 | P2 |
| public/control-center/pages/setup.js | 1787 | 4 | yes | no | yes | 29.4 | P0 |
| public/control-center/pages/workflows.js | 2366 | 28 | yes | yes | yes | 129.3 | P0 |

## Recommended Classification
- P0: audit before touching; likely authority/runtime risk.
- P1: targeted page truth audit before UX polish.
- P2: safe improvement candidate after validation.
- P3: likely low risk, but still requires normal QA.
