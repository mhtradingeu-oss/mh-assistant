# PHASE 3AG.1 — Sidebar Navigation Evidence

## Sidebar nav region
        <div class="loading-spinner" aria-hidden="true"></div>
        <h3 id="loadingTitle">Loading project</h3>
        <p id="loadingText">Please wait while the system loads the workspace.</p>
      </div>
    </div>

    <div class="os-layout">
      <!-- Sidebar -->
      <aside id="sidebarNav" class="sidebar" aria-label="Main navigation">
        <div class="sidebar-brand">
          <div class="brand-badge">AI OS</div>
          <h1>MH Assistant</h1>
          <p>Marketing, launch, content, ads, insights, and operations.</p>
        </div>

        <div class="sidebar-project">
          <label for="projectSwitcher" class="sidebar-label">Current Project</label>
          <select id="projectSwitcher" class="sidebar-select" aria-label="Current Project">
            <option value="">Select project</option>
          </select>
        </div>

        <nav class="sidebar-nav" aria-label="Primary navigation">
          <div class="nav-group">
            <div class="nav-group-title">Primary</div>
            <button class="nav-item is-active" data-route="home" data-page="home" type="button">Home</button>
            <button class="nav-item" data-route="setup" data-page="setup" type="button">Setup</button>
            <button class="nav-item" data-route="library" data-page="library" type="button">Library</button>
            <button class="nav-item" data-route="integrations" data-page="integrations" type="button">Integrations</button>
            <button class="nav-item" data-route="ai-command" data-page="ai-command" type="button">AI Command</button>
            <button class="nav-item" data-route="workflows" data-page="workflows" type="button">Workflows</button>
            <button class="nav-item" data-route="publishing" data-page="publishing" type="button">Publishing</button>
            <button class="nav-item" data-route="insights" data-page="insights" type="button">Insights</button>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">Secondary</div>
            <button class="nav-item" data-route="campaign-studio" data-page="campaign-studio" type="button">Campaign Studio</button>
            <button class="nav-item" data-route="content-studio" data-page="content-studio" type="button">Content Studio</button>
            <button class="nav-item" data-route="media-studio" data-page="media-studio" type="button">Media Studio</button>
            <button class="nav-item" data-route="ads-manager" data-page="ads-manager" type="button">Ads Manager</button>
            <button class="nav-item" data-route="research" data-page="research" type="button">Research</button>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">System</div>
            <button class="nav-item" data-route="operations-centers" data-page="operations-centers" type="button">Operations Overview</button>
            <button class="nav-item" data-route="task-center" data-page="task-center" type="button">Task Center</button>
            <button class="nav-item" data-route="queue-center" data-page="queue-center" type="button">Queue Center</button>
            <button class="nav-item" data-route="job-monitor" data-page="job-monitor" type="button">Job Monitor</button>
            <button class="nav-item" data-route="notification-center" data-page="notification-center" type="button">Notifications</button>
            <button class="nav-item" data-route="governance" data-page="governance" type="button">Governance</button>
            <button class="nav-item" data-route="settings" data-page="settings" type="button">Settings</button>
          </div>
        </nav>

        <div class="sidebar-actions">
          <button id="refreshAllBtn" class="btn btn-primary" data-action="refresh-project" type="button">
            Refresh All
          </button>
          <button id="openAiBtn" class="btn btn-secondary" data-action="open-ai-command" type="button">
            Open AI Workspace
          </button>
        </div>
      </aside>

      <!-- Main shell -->
      <div class="main-shell">
        <!-- Topbar -->
        <header id="topbar" class="topbar" role="banner">
          <button
            id="sidebarToggleBtn"
            class="sidebar-toggle"
            type="button"
            aria-label="Toggle sidebar"
            aria-controls="sidebarNav"
            aria-expanded="false"
          >
            ☰
          </button>


## Sidebar data-route entries
115:            <button class="nav-item is-active" data-route="home" data-page="home" type="button">Home</button>
116:            <button class="nav-item" data-route="setup" data-page="setup" type="button">Setup</button>
117:            <button class="nav-item" data-route="library" data-page="library" type="button">Library</button>
118:            <button class="nav-item" data-route="integrations" data-page="integrations" type="button">Integrations</button>
119:            <button class="nav-item" data-route="ai-command" data-page="ai-command" type="button">AI Command</button>
120:            <button class="nav-item" data-route="workflows" data-page="workflows" type="button">Workflows</button>
121:            <button class="nav-item" data-route="publishing" data-page="publishing" type="button">Publishing</button>
122:            <button class="nav-item" data-route="insights" data-page="insights" type="button">Insights</button>
127:            <button class="nav-item" data-route="campaign-studio" data-page="campaign-studio" type="button">Campaign Studio</button>
128:            <button class="nav-item" data-route="content-studio" data-page="content-studio" type="button">Content Studio</button>
129:            <button class="nav-item" data-route="media-studio" data-page="media-studio" type="button">Media Studio</button>
130:            <button class="nav-item" data-route="ads-manager" data-page="ads-manager" type="button">Ads Manager</button>
131:            <button class="nav-item" data-route="research" data-page="research" type="button">Research</button>
136:            <button class="nav-item" data-route="operations-centers" data-page="operations-centers" type="button">Operations Overview</button>
137:            <button class="nav-item" data-route="task-center" data-page="task-center" type="button">Task Center</button>
138:            <button class="nav-item" data-route="queue-center" data-page="queue-center" type="button">Queue Center</button>
139:            <button class="nav-item" data-route="job-monitor" data-page="job-monitor" type="button">Job Monitor</button>
140:            <button class="nav-item" data-route="notification-center" data-page="notification-center" type="button">Notifications</button>
141:            <button class="nav-item" data-route="governance" data-page="governance" type="button">Governance</button>
142:            <button class="nav-item" data-route="settings" data-page="settings" type="button">Settings</button>

## App/nav route references
public/control-center/app.js:14:  navigateTo,
public/control-center/app.js:493:  navigateTo("home");
public/control-center/app.js:537:        navigateTo("home");
public/control-center/app.js:1199:      ? event.target.closest("button, a, [data-route], [data-page], [data-action], input, select, textarea") || event.target
public/control-center/app.js:1212:      dataRoute: String(element.getAttribute("data-route") || ""),
public/control-center/app.js:2038:let activeRouteCleanup = null;
public/control-center/app.js:2039:let activeRouteCleanupRoute = "";
public/control-center/app.js:2041:function disposeActiveRouteCleanup(nextRoute = "") {
public/control-center/app.js:2042:  if (!activeRouteCleanup) {
public/control-center/app.js:2043:    activeRouteCleanupRoute = nextRoute || "";
public/control-center/app.js:2047:  if (activeRouteCleanupRoute && nextRoute && activeRouteCleanupRoute === nextRoute) {
public/control-center/app.js:2051:  const cleanup = activeRouteCleanup;
public/control-center/app.js:2052:  activeRouteCleanup = null;
public/control-center/app.js:2053:  activeRouteCleanupRoute = "";
public/control-center/app.js:2064:  disposeActiveRouteCleanup(currentRoute);
public/control-center/app.js:2076:      navigateTo,
public/control-center/app.js:2115:      activeRouteCleanup = renderResult;
public/control-center/app.js:2116:      activeRouteCleanupRoute = currentRoute;
public/control-center/app.js:2123:        navigateTo,
public/control-center/app.js:2136:    navigateTo,
public/control-center/app.js:3032:  const fallbackLabelRoutes = {
public/control-center/app.js:3044:    const labeledRoute = fallbackLabelRoutes[String(item.textContent || "").trim()] || "";
public/control-center/app.js:3045:    const route = item.getAttribute("data-route") || labeledRoute;
public/control-center/app.js:3047:    item.setAttribute("data-route", route);
public/control-center/app.js:3086:      navigateTo("home");
public/control-center/app.js:3094:        navigateTo("ai-command");
public/control-center/app.js:3102:      navigateTo(targetRoute);
public/control-center/app.js:3111:      ? event.target.closest("button, a, [data-route], [data-page], [data-action]")
public/control-center/app.js:3117:    const routeAttr = String(candidate.getAttribute("data-route") || "").trim();
public/control-center/app.js:3119:    const clickedNavItem = Boolean(candidate.closest(".nav-item[data-route], [data-shell-route], [data-global-route]"));
public/control-center/app.js:3124:      navigateTo(routeAttrAllowed);
public/control-center/app.js:3185:      navigateTo(route);
public/control-center/app.js:3371:    const clickedNavItem = event.target.closest(".nav-item[data-route]");
public/control-center/app.js:3527:  const navItems = Array.from(document.querySelectorAll(".nav-item[data-route]"));
public/control-center/app.js:3529:    const route = item.getAttribute("data-route") || "";
public/control-center/app.js:3548:    navigateTo(matches[0].route);
public/control-center/app.js:3555:  navigateTo(top[0].route);
public/control-center/app.js:3598:  navigateTo("ai-command");
public/control-center/app.js:3779:      navigateTo(route);
public/control-center/app.js:3997:        navigateTo("setup");
public/control-center/app.js:4023:        navigateTo(route);
public/control-center/app.js:4065:      navigateTo("ai-command");
public/control-center/router.js:30:const routeRegistry = {
public/control-center/router.js:186:  const navItems = Array.from(document.querySelectorAll(".nav-item[data-route]"));
public/control-center/router.js:189:    const itemRoute = item.getAttribute("data-route");
public/control-center/router.js:200:  return routeRegistry[route] || getFallbackRoute(route);
public/control-center/router.js:218:export function navigateTo(route, emit = true) {
public/control-center/pages/campaign-studio.js:1246:  navigateTo,
public/control-center/pages/campaign-studio.js:1362:      navigateTo("ai-command");
public/control-center/pages/campaign-studio.js:1371:      navigateTo("publishing");
public/control-center/pages/campaign-studio.js:1377:    assetsBtn.onclick = () => navigateTo("library");
public/control-center/pages/campaign-studio.js:1384:      navigateTo("content-studio");
public/control-center/pages/campaign-studio.js:1392:      navigateTo("media-studio");
public/control-center/pages/campaign-studio.js:1400:      navigateTo("ads-manager");
public/control-center/pages/campaign-studio.js:1418:        navigateTo("integrations");
public/control-center/pages/campaign-studio.js:1422:        navigateTo("library");
public/control-center/pages/campaign-studio.js:1425:      navigateTo("insights");
public/control-center/pages/campaign-studio.js:1466:    navigateTo,
public/control-center/pages/campaign-studio.js:1487:      navigateTo,
public/control-center/pages/campaign-studio.js:2012:      navigateTo,
public/control-center/pages/media-studio-workspace.js:2716:  navigateTo,
public/control-center/pages/media-studio-workspace.js:3085:        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3261:      navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3275:      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3371:        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3426:        navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3434:async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
public/control-center/pages/media-studio-workspace.js:3456:    navigateTo("publishing");
public/control-center/pages/media-studio-workspace.js:3479:    navigateTo,
public/control-center/pages/media-studio-workspace.js:3494:      navigateTo,
public/control-center/pages/media-studio-workspace.js:3652:      navigateTo,
public/control-center/pages/operations-centers.js:77:      context.navigateTo(route);
public/control-center/pages/operations-centers.js:121:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:132:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:2017:                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
public/control-center/pages/operations-centers.js:2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
public/control-center/pages/operations-centers.js:2038:                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
public/control-center/pages/research.js:851:  navigateTo,
public/control-center/pages/research.js:894:      navigateTo("ai-command");
public/control-center/pages/research.js:937:        navigateTo("ai-command");
public/control-center/pages/research.js:987:        navigateTo(action.route);
public/control-center/pages/research.js:991:        navigateTo(action.route);
public/control-center/pages/research.js:1007:      navigateTo(item.routeTarget.route);
public/control-center/pages/research.js:1119:    navigateTo,
public/control-center/pages/research.js:1137:      navigateTo,
public/control-center/pages/research.js:1601:      navigateTo,
public/control-center/pages/ai-command.js:4678:			navigateTo,
public/control-center/pages/ai-command.js:4889:				navigateTo("settings");
public/control-center/pages/ai-command.js:5499:				navigateTo(destination);
public/control-center/pages/ai-command.js:5594:				navigateTo(destination);
public/control-center/pages/library.js:1496:  navigateTo,
public/control-center/pages/library.js:1516:      navigateTo,
public/control-center/pages/library.js:1691:        navigateTo,
public/control-center/pages/library.js:1722:        navigateTo,
public/control-center/pages/library.js:1758:        navigateTo,
public/control-center/pages/library.js:1789:        navigateTo,
public/control-center/pages/library.js:1957:        navigateTo("ai-command");
public/control-center/pages/library.js:2055:          navigateTo,
public/control-center/pages/library.js:2083:          navigateTo,
public/control-center/pages/library.js:2094:      navigateTo("ai-command");
public/control-center/pages/library.js:2123:        navigateTo,
public/control-center/pages/library.js:2158:        navigateTo,
public/control-center/pages/library.js:2187:        navigateTo,
public/control-center/pages/library.js:2739:        navigateTo,
public/control-center/pages/library.js:2824:      navigateTo("ai-command");
public/control-center/pages/library.js:2834:      navigateTo("ai-command");
public/control-center/pages/library.js:2849:      navigateTo("ai-command");
public/control-center/pages/library.js:2863:      navigateTo("ai-command");
public/control-center/pages/library.js:2879:      navigateTo("ai-command");
public/control-center/pages/library.js:2901:    navigateTo,
public/control-center/pages/library.js:2941:            navigateTo("ai-command");
public/control-center/pages/library.js:3157:      navigateTo,
public/control-center/pages/home.js:656:  render({ getState, $, escapeHtml, navigateTo, showMessage }) {
public/control-center/pages/home.js:1036:      navigateTo(route);
public/control-center/pages/home.js:1042:      navigateTo("ai-command");
public/control-center/pages/insights.js:947:function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
public/control-center/pages/insights.js:950:      navigateTo("ai-command");
public/control-center/pages/insights.js:980:      navigateTo(route);
public/control-center/pages/insights.js:1021:      navigateTo("ai-command");
public/control-center/pages/insights.js:1045:    navigateTo,
public/control-center/pages/insights.js:1416:      navigateTo,
public/control-center/pages/insights.js:1433:          navigateTo,
public/control-center/pages/insights.js:1451:          navigateTo,
public/control-center/pages/insights.js:1466:        navigateTo,
public/control-center/pages/insights.js:1493:            navigateTo,
public/control-center/pages/insights.js:1509:            navigateTo,
public/control-center/pages/content-studio-workspace.js:1790:  navigateTo,
public/control-center/pages/content-studio-workspace.js:2058:      navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2089:        navigateTo("media-studio");
public/control-center/pages/content-studio-workspace.js:2121:        navigateTo("publishing");
public/control-center/pages/content-studio-workspace.js:2238:        navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2264:    navigateTo,
public/control-center/pages/content-studio-workspace.js:2278:      navigateTo,
public/control-center/pages/content-studio-workspace.js:2397:      navigateTo,
public/control-center/pages/governance.js:1442:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1454:      context.navigateTo("ai-command");
public/control-center/pages/integrations.js:1197:  navigateTo,
public/control-center/pages/integrations.js:1536:      navigateTo("ai-command");
public/control-center/pages/integrations.js:1574:    navigateTo,
public/control-center/pages/integrations.js:1835:      navigateTo,
public/control-center/pages/integrations.js:1852:        navigateTo,
public/control-center/pages/setup.js:836:  navigateTo,
public/control-center/pages/setup.js:1070:      navigateTo("setup");
public/control-center/pages/setup.js:1153:      navigateTo("ai-command");
public/control-center/pages/setup.js:1171:      navigateTo("library");
public/control-center/pages/setup.js:1178:      navigateTo("integrations");
public/control-center/pages/setup.js:1185:      navigateTo("campaign-studio");
public/control-center/pages/setup.js:1212:      navigateTo("home");
public/control-center/pages/setup.js:1342:    navigateTo,
public/control-center/pages/setup.js:1678:      navigateTo,
public/control-center/pages/publishing.js:148:function ensurePublishingAutoModeBinding(getState, navigateTo, render) {
public/control-center/pages/publishing.js:156:    createAutoModeController(getState, { getState, navigateTo });
public/control-center/pages/publishing.js:1456:  navigateTo,
public/control-center/pages/publishing.js:1474:  ensurePublishingAutoModeBinding(getState, navigateTo, render);
public/control-center/pages/publishing.js:1844:      navigateTo("ai-command");
public/control-center/pages/publishing.js:1863:      ensurePublishingAutoModeBinding(getState, navigateTo, render);
public/control-center/pages/publishing.js:1868:        context: { getState, navigateTo, projectName },
public/control-center/pages/publishing.js:1894:      await approveCurrentGate({ context: { getState, navigateTo, projectName } });
public/control-center/pages/publishing.js:1902:      await skipCurrentStep({ context: { getState, navigateTo, projectName } });
public/control-center/pages/publishing.js:1926:    navigateTo,
public/control-center/pages/publishing.js:2008:      navigateTo,
public/control-center/pages/publishing.js:2022:        navigateTo,
public/control-center/pages/workflows.js:1067:  navigateTo,
public/control-center/pages/workflows.js:1104:  navigateTo("ai-command");
public/control-center/pages/workflows.js:1209:  navigateTo,
public/control-center/pages/workflows.js:1222:    createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
public/control-center/pages/workflows.js:1478:        navigateTo,
public/control-center/pages/workflows.js:1511:        navigateTo,
public/control-center/pages/workflows.js:1528:        navigateTo,
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:1607:      navigateTo("ai-command");
public/control-center/pages/workflows.js:1643:      navigateTo("ai-command");
public/control-center/pages/workflows.js:1663:        context: { getState, navigateTo, createProjectHandoff, projectName },
public/control-center/pages/workflows.js:1692:        context: { getState, navigateTo, createProjectHandoff, projectName },
public/control-center/pages/workflows.js:1714:      createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
public/control-center/pages/workflows.js:1722:        context: { getState, navigateTo, createProjectHandoff, projectName }
public/control-center/pages/workflows.js:1739:      await resumeAutoMode({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1755:      await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1763:      await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
public/control-center/pages/workflows.js:1786:    navigateTo,
public/control-center/pages/workflows.js:2272:        navigateTo("ai-command");
public/control-center/pages/workflows.js:2294:          navigateTo("campaign-studio");
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/workflows.js:2347:          navigateTo(route);
public/control-center/pages/settings.js:1933:        context.navigateTo("governance");
public/control-center/pages/settings.js:1959:      context.navigateTo("ai-command");
public/control-center/pages/settings.js:1971:      context.navigateTo("ai-command");
public/control-center/pages/ads-manager.js:240:  navigateTo,
public/control-center/pages/ads-manager.js:270:      navigateTo("ai-command");
public/control-center/pages/ads-manager.js:277:    publishingBtn.onclick = () => navigateTo("publishing");
public/control-center/pages/ads-manager.js:282:    libraryBtn.onclick = () => navigateTo("library");
public/control-center/pages/ads-manager.js:304:    navigateTo,
public/control-center/pages/ads-manager.js:604:      navigateTo,
public/control-center/pages/ads-manager.js:611:        navigateTo,
