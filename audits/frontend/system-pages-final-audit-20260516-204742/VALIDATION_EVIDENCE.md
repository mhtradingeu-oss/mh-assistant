# Validation Evidence

## Repository Snapshot

Initial `git status --short` before audit files:

```text
```

Initial `git diff --name-only` before audit files:

```text
```

Recent history:

```text
b84a3a3 Polish AI Team specialist coverage and tool map
d9c440a Add AI Command final room deep audit
57bbfda Redesign AI Team command center operating room
ad51426 Add AI Team full UX redesign plan
bf3e348 Clarify AI Team workspace layout
f9ba659 Simplify AI Team composer and chat UX
af7f420 Polish AI Team chat guidance and composer continuation
9dffb24 Expand customer operations read-only routes
032442d Add customer operations read-only routes
7cc02a2 Wire customer operations runtime into orchestrator server
5d1fe4c Polish AI Team command center actions and composer behavior
d2d9d5c Add customer operations integration conversation session flow
```

## Required Syntax Checks

All required checks exited with code 0 and no syntax output:

```bash
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/operations-centers.js
node --check public/control-center/api.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check runtime/orchestrator-service/server.js
```

Result:

```text
PASS
```

## Duplicate ID Scan

Command:

```bash
grep -o 'id="[^"]*"' public/control-center/pages/*.js | sort | uniq -c | sort -nr | sed -n '1,160p'
```

Top output:

```text
      6 public/control-center/pages/media-studio-workspace.js:id="${escapeHtml(item.id)}"
      5 public/control-center/pages/publishing.js:id="${escapeHtml(item.id)}"
      5 public/control-center/pages/library.js:id="${escapeHtml(asset.id || asset.asset_id || "
      5 public/control-center/pages/governance.js:id="${escapeHtml(selectedItem.id)}"
      5 public/control-center/pages/governance.js:id="${escapeHtml(item.id)}"
      4 public/control-center/pages/settings.js:id="${fieldId}"
      3 public/control-center/pages/media-studio-workspace.js:id="${escapeHtml(id)}"
      2 public/control-center/pages/setup.js:id="setup-${escapeHtml(name)}"
      2 public/control-center/pages/settings.js:id="settings-section-${section.id}"
      2 public/control-center/pages/media-studio-workspace.js:id="mediaQueuePanel"
      2 public/control-center/pages/media-studio-workspace.js:id="mediaOutputPreviewPanel"
      2 public/control-center/pages/content-studio-workspace.js:id="contentHandoffPanel"
      2 public/control-center/pages/campaign-studio.js:id="campaign-${escapeHtml(name)}"
```

Interpretation:
- Dynamic IDs are expected in repeated data structures.
- `mediaQueuePanel`, `mediaOutputPreviewPanel`, and `contentHandoffPanel` should receive runtime uniqueness validation because they are static IDs appearing more than once in source.

## Route Registration Evidence

`router.js` registers:

```text
home
ai-command
workflows
task-center
queue-center
job-monitor
notification-center
campaign-studio
content-studio
media-studio
publishing
ads-manager
insights
research
setup
library
integrations
settings
governance
```

Referenced but not registered:

```text
operations-centers
```

Observed references:

```text
public/control-center/pages/home.js:938
public/control-center/pages/ai-command.js:91
public/control-center/pages/ai-command.js:1127
public/control-center/pages/ai-command.js:1142
```

## App Wiring Evidence

`app.js` render context passes:

```text
fetchProjectInsights
fetchProjectLearning
fetchProjectOperations
saveProjectSetup
executeProjectAiCommand
saveProjectConnectorSource
removeProjectConnectorSource
fetchProjectIntegrationControlCenter
connectProjectIntegration
reconnectProjectIntegration
testProjectIntegration
syncProjectIntegration
importProjectIntegrationHistory
disconnectProjectIntegration
runProjectWorkflow
runProjectAiWorkflow
createProjectTask
createProjectApproval
saveProjectCampaign
createProjectHandoff
consumeProjectHandoff
markProjectNotification
savePublishingSchedule
reschedulePublishingItem
approvePublishingItem
publishPublishingItem
failPublishingItem
fetchProjectTaskCenter
fetchProjectQueueCenter
fetchProjectJobMonitor
fetchProjectNotificationCenter
```

## API Inventory Evidence

`api.js` exports functions for:

```text
core project loading
asset catalog and registry operations
insights and learning
operations snapshot
setup and business templates
workflows and AI workflows
AI command and guidance
tasks and approvals
governance and policy
integration control center actions
publishing actions
operations center fetchers
team settings
campaign/content/media/handoff/event APIs
upload and protected media fetch
```

Notable app-context gap:

```text
fetchProjectOperationsSchema is exported but not passed into route render context.
```

## CSS Inventory Evidence

Line counts:

```text
   137 public/control-center/styles/00-tokens.css
    40 public/control-center/styles/01-reset.css
   257 public/control-center/styles/02-layer-system.css
    98 public/control-center/styles/03-app-shell.css
   147 public/control-center/styles/04-command-layer.css
   196 public/control-center/styles/05-ai-layer.css
   193 public/control-center/styles/07-sidebar.css
   835 public/control-center/styles/08-components-foundation.css
  1565 public/control-center/styles/09-operations-centers.css
   169 public/control-center/styles/10-topbar-canonical.css
  6011 public/control-center/styles/12-pages.css
   640 public/control-center/styles/13-home-executive.css
  2452 public/control-center/styles/14-page-standard.css
   482 public/control-center/styles/15-clean-operating-layer.css
     0 public/control-center/styles/integrations/cards.css
     0 public/control-center/styles/integrations/drawer.css
     0 public/control-center/styles/integrations/forms.css
     0 public/control-center/styles/integrations/grid.css
     0 public/control-center/styles/integrations/layout.css
     0 public/control-center/styles/integrations/responsive.css
```

## Sandbox Note

Initial read-only shell calls hit a sandbox setup error:

```text
bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted
```

The read-only inspection and validation commands were rerun with approved escalation. No source files were changed.

