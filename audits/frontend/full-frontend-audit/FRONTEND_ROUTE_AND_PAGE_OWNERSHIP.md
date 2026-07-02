# Frontend Route And Page Ownership

## Route graph ownership (evidence-first)
Source of truth for routes is router.js routeRegistry, with route objects exported from pages files.

| Route | Owner file | disableStandardLayout | Shell ownership | data-page match | Notes |
|---|---|---|---|---|---|
| home | public/control-center/pages/home.js | true | Custom root mount (#homeExecRoot) | yes | Executive surface |
| setup | public/control-center/pages/setup.js | true | Custom root mount (#setupRoot) | yes | Guided setup surface |
| library | public/control-center/pages/library.js | true | Custom root mount (#libraryRoot) | yes | Includes action/AI panel modules |
| integrations | public/control-center/pages/integrations.js | true | Custom root mount (#integrationsRoot) | yes | Drawer/listener handling in-page |
| ai-command | public/control-center/pages/ai-command.js | true | Custom root mount (#ctrlRoomRoot) | yes | AI workspace surface |
| workflows | public/control-center/pages/workflows.js | true | Custom root mount (#workflowsRoot) | yes | Auto mode controls here |
| campaign-studio | public/control-center/pages/campaign-studio.js | true | Custom root mount (#campaignStudioRoot) | yes | Execution build page |
| content-studio | public/control-center/pages/content-studio-workspace.js | true | Custom root mount (#contentStudioRoot) | yes | File name differs from route id |
| media-studio | public/control-center/pages/media-studio-workspace.js | true | Custom root mount (#mediaStudioRoot) | yes | File name differs from route id |
| publishing | public/control-center/pages/publishing.js | true | Custom root mount (#publishingRoot) | yes | Auto mode controls here |
| ads-manager | public/control-center/pages/ads-manager.js | true | Custom root mount (#adsManagerRoot) | yes | Mostly local planner behavior |
| insights | public/control-center/pages/insights.js | true | Custom root mount (#insightsRoot) | yes | Uses fetchProjectInsights + handoff |
| research | public/control-center/pages/research.js | true | Custom root mount (#researchRoot) | yes | Uses insights/learning + routing |
| governance | public/control-center/pages/governance.js | true | governance-shell | yes | Dedicated governance shell |
| settings | public/control-center/pages/settings.js | true | settings-page-surface | yes | Dedicated settings shell surface |
| task-center | public/control-center/pages/operations-centers.js | true | ops-shell | yes | Shared owner file |
| queue-center | public/control-center/pages/operations-centers.js | true | ops-shell | yes | Shared owner file |
| job-monitor | public/control-center/pages/operations-centers.js | true | ops-shell | yes | Shared owner file |
| notification-center | public/control-center/pages/operations-centers.js | true | ops-shell | yes | Shared owner file |

## Duplicate route and alias check
- Duplicate route IDs detected: none.
- Navigation target validation (navigateTo/data-route/data-page/hash targets vs route IDs): no invalid targets.
- Old alias signal: CSS still references [data-page="notifications"] in operations stylesheet, while canonical route is notification-center.

## disableStandardLayout and double wrapping risk
- All exported page routes set disableStandardLayout: true.
- app.js only applies applyStandardPageLayout when disableStandardLayout is false.
- Current double-wrap risk: low for active routes.
- Compatibility shell remains present in ui/page-standard.js and can reactivate if a route opts out of disableStandardLayout later.

## Route names vs data-page values
- Route IDs and data-page attributes are consistent across all 19 active routes.
- Path naming inconsistency exists only at file level:
  - content-studio route in content-studio-workspace.js
  - media-studio route in media-studio-workspace.js

## Sidebar/nav alignment
index.html nav items align with route IDs:
- home, setup, library, integrations, ai-command, workflows, publishing, insights
- campaign-studio, content-studio, media-studio, ads-manager, research
- task-center, queue-center, job-monitor, notification-center, governance, settings

## Quick action and in-page navigation integrity
- navigateTo targets across app/pages resolve to valid routes.
- No broken navigation targets found from static marker scan.

## Ownership observations
- operations-centers.js owns 4 operations routes in one file (high coupling, shared lifecycle).
- router.js and app.js both define route role fallback maps (authority duplication risk, see runtime authority audit).

## Page shell and panel maturity (toward Header + Main View + Action Panel + AI Panel)

| Page | Current shell type | In-page loading state evidence | Action Panel concept | AI Panel concept | Gap to target structure |
|---|---|---|---|---|---|
| home | custom executive surface | yes | partial (decision/actions blocks) | partial (AI prompt routing) | needs explicit persistent side panels |
| setup | custom setup surface | yes | partial (guided actions) | partial (prompt routing) | needs explicit panelized action/AI rails |
| library | custom operating surface | yes | explicit (library action panel module) | explicit (library ai panel module) | closest to target; formalize as reference page |
| integrations | custom integrations surface | yes | partial (connector actions) | partial (AI recommendation blocks) | needs explicit dedicated AI panel region |
| ai-command | custom AI workspace | yes | partial (task/action controls) | explicit (AI core workspace) | needs clearer split between main execution and side action rail |
| workflows | custom workflow surface | yes | explicit (workflow execution controls) | partial (AI context routing) | needs stable panel boundary contract |
| campaign-studio | custom campaign surface | yes | partial (campaign actions) | partial (AI handoff prompts) | needs explicit action/AI side panels |
| content-studio-workspace | custom content surface | yes | partial | partial | needs explicit panelized operating-room layout |
| media-studio-workspace | custom media surface | yes | partial-to-strong (job actions) | partial (AI-assisted prompts/checks) | needs standardized AI panel frame |
| publishing | custom publishing surface | yes | strong (approve/schedule/publish controls) | partial (AI prompt assist) | needs explicit AI side panel contract |
| ads-manager | custom ads surface | yes | partial | partial | needs panelized action + AI regions |
| insights | custom insights surface | yes | partial | partial | needs explicit action and AI panel lanes |
| research | custom research surface | yes | partial | partial | needs explicit panelized operating-room pattern |
| governance | governance-shell | yes | partial (governance actions) | partial (AI prompt shortcuts) | needs explicit AI panel lane and action rail standardization |
| settings | settings-page-surface | yes | partial (save/diagnostic actions) | partial (AI suggestion actions) | needs explicit panel boundaries |
| task-center | ops-shell | yes | strong (queue/task controls) | partial (AI route buttons) | needs explicit AI side panel standard |
| queue-center | ops-shell | yes | strong | partial | needs explicit AI side panel standard |
| job-monitor | ops-shell | yes | strong | partial | needs explicit AI side panel standard |
| notification-center | ops-shell | yes | strong | partial | needs explicit AI side panel standard |
