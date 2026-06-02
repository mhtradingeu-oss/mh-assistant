# PHASE 3AD.1 — Operations Centers Route and Navigation Evidence

## Router registration
// public/control-center/router.js

import { homeRoute } from "./pages/home.js";
import { aiCommandRoute } from "./pages/ai-command.js";
import { campaignStudioRoute } from "./pages/campaign-studio.js";
import { contentStudioRoute } from "./pages/content-studio-workspace.js";
import { mediaStudioRoute } from "./pages/media-studio-workspace.js";
import { publishingRoute } from "./pages/publishing.js";
import { adsManagerRoute } from "./pages/ads-manager.js";
import { insightsRoute } from "./pages/insights.js";
import { researchRoute } from "./pages/research.js";
import { workflowsRoute } from "./pages/workflows.js";
import {
  taskCenterRoute,
  queueCenterRoute,
  jobMonitorRoute,
  notificationCenterRoute,
  operationsCentersRoute
} from "./pages/operations-centers.js";
import { setupRoute } from "./pages/setup.js";
import { libraryRoute } from "./pages/library.js";
import { integrationsRoute } from "./pages/integrations.js";
import { settingsRoute } from "./pages/settings.js";
import { governanceRoute } from "./pages/governance.js";
import {
  DEFAULT_ROLE,
  getFallbackRouteAccess
} from "./runtime/authority/route-role-fallback.js";

const routeRegistry = {
  [homeRoute.id]: homeRoute,
  [aiCommandRoute.id]: aiCommandRoute,
  [workflowsRoute.id]: workflowsRoute,
  [operationsCentersRoute.id]: operationsCentersRoute,
  [taskCenterRoute.id]: taskCenterRoute,
  [queueCenterRoute.id]: queueCenterRoute,
  [jobMonitorRoute.id]: jobMonitorRoute,
  [notificationCenterRoute.id]: notificationCenterRoute,
  [campaignStudioRoute.id]: campaignStudioRoute,
  [contentStudioRoute.id]: contentStudioRoute,
  [mediaStudioRoute.id]: mediaStudioRoute,
  [publishingRoute.id]: publishingRoute,
  [adsManagerRoute.id]: adsManagerRoute,
  [insightsRoute.id]: insightsRoute,
  [researchRoute.id]: researchRoute,
  [setupRoute.id]: setupRoute,
  [libraryRoute.id]: libraryRoute,
  [integrationsRoute.id]: integrationsRoute,
  [settingsRoute.id]: settingsRoute,
  [governanceRoute.id]: governanceRoute
};

let routeAccessResolver = null;

const routeChangeSubscribers = new Set();

export function subscribeRouteChange(handler) {
  if (typeof handler !== "function") return () => {};
  routeChangeSubscribers.add(handler);
  return () => routeChangeSubscribers.delete(handler);
}

function notifyRouteChange(route) {
  routeChangeSubscribers.forEach((handler) => {
    try {
      handler(route);
    } catch (error) {
      console.warn("Route change subscriber failed:", error?.message || error);
    }
  });

## Sidebar placement
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


## Operations route exports and metadata
1747:export const taskCenterRoute = {
1748:  id: "task-center",
1750:  meta: {
1782:export const queueCenterRoute = {
1783:  id: "queue-center",
1785:  meta: {
1830:export const jobMonitorRoute = {
1831:  id: "job-monitor",
1833:  meta: {
1878:export const notificationCenterRoute = {
1879:  id: "notification-center",
1881:  meta: {
2065:export const operationsCentersRoute = {
2066:  id: "operations-centers",
2067:  label: "Operations Centers",
2068:  meta: {

## Home route to Operations Overview
882:            <button id="homeOpenOperationsBtn" class="btn btn-secondary btn-sm" type="button">
1081:    const operationsBtn = $("homeOpenOperationsBtn");
1082:    if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");

## Operations Overview route/card links
1979:            <span class="std-context-eyebrow">Operations Routing Layer</span>
2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
2038:                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
2046:                  <h3>Routing-only safety</h3>
