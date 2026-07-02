# Frontend Page Risk Matrix

| Page | File | Lines | Route | Ownership | Shell | Backend connected? | Runtime risk | Authority risk | CSS risk | UX maturity | Overall risk | Next action | Priority |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| Home | public/control-center/pages/home.js | 905 | home | single-route owner | custom root mount | indirect | low | low | medium | medium | medium | keep as executive shell baseline, map panel standard | P3 |
| Setup | public/control-center/pages/setup.js | 1562 | setup | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | tighten setup->backend contract doc | P2 |
| Library | public/control-center/pages/library.js | 2955 | library | single-route owner + submodules | custom root mount | yes | medium | medium | high | medium | high | lock library css authority and panel boundaries | P1 |
| Integrations | public/control-center/pages/integrations.js | 1672 | integrations | single-route owner + submodules | custom root mount | yes | medium | medium | medium | medium | medium | resolve orphan submodule ownership (layout/state) | P2 |
| AI Command | public/control-center/pages/ai-command.js | 1976 | ai-command | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | define AI panel boundary vs workflows handoff | P2 |
| Workflows | public/control-center/pages/workflows.js | 1992 | workflows | single-route owner | custom root mount | yes | high | high | medium | medium | high | formalize Auto Mode trigger/gate contract | P1 |
| Campaign Studio | public/control-center/pages/campaign-studio.js | 1981 | campaign-studio | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | document handoff payload authority boundary | P2 |
| Content Studio Workspace | public/control-center/pages/content-studio-workspace.js | 2336 | content-studio | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | align file naming conventions with route doctrine | P3 |
| Media Studio Workspace | public/control-center/pages/media-studio-workspace.js | 3216 | media-studio | single-route owner | custom root mount | yes | high | medium | medium | medium | high | verify backend/local handoff failover contract | P1 |
| Publishing | public/control-center/pages/publishing.js | 1838 | publishing | single-route owner | custom root mount | yes | high | high | medium | medium | high | lock publish gate behavior and explicit approvals | P1 |
| Ads Manager | public/control-center/pages/ads-manager.js | 617 | ads-manager | single-route owner | custom root mount | limited/direct-low | low | low | medium | medium | low | decide whether to increase backend projection depth | P3 |
| Insights | public/control-center/pages/insights.js | 1519 | insights | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | align insight->handoff policy with governance | P2 |
| Research | public/control-center/pages/research.js | 1612 | research | single-route owner | custom root mount | yes | medium | medium | medium | medium | medium | define canonical research intelligence cache policy | P2 |
| Governance | public/control-center/pages/governance.js | 1100 | governance | single-route owner | governance-shell | yes | medium | high | medium | medium | high | reduce frontend policy-shaping authority | P1 |
| Settings | public/control-center/pages/settings.js | 1929 | settings | single-route owner | settings-page-surface | yes | medium | high | medium | medium | high | move policy normalization authority backend-side | P1 |
| Task Center | public/control-center/pages/operations-centers.js | 1837 | task-center | shared owner file | ops-shell | yes | medium | medium | medium | medium | medium | split lifecycle ownership doc for ops centers | P2 |
| Queue Center | public/control-center/pages/operations-centers.js | 1837 | queue-center | shared owner file | ops-shell | yes | medium | medium | medium | medium | medium | split lifecycle ownership doc for ops centers | P2 |
| Job Monitor | public/control-center/pages/operations-centers.js | 1837 | job-monitor | shared owner file | ops-shell | yes | medium | medium | medium | medium | medium | split lifecycle ownership doc for ops centers | P2 |
| Notification Center | public/control-center/pages/operations-centers.js | 1837 | notification-center | shared owner file | ops-shell | yes | medium | medium | medium | medium | medium | retire notifications alias selectors after policy decision | P2 |

## Matrix notes
- All route exports currently use disableStandardLayout: true.
- Operations centers share one large file, increasing coupling risk for lifecycle and regression.
- Highest-risk pages are those combining automation, authority-adjacent payload shaping, and cross-page handoff logic.
