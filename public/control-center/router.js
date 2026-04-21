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
  notificationCenterRoute
} from "./pages/operations-centers.js";
import { setupRoute } from "./pages/setup.js";
import { libraryRoute } from "./pages/library.js";
import { integrationsRoute } from "./pages/integrations.js";
import { settingsRoute } from "./pages/settings.js";
import { governanceRoute } from "./pages/governance.js";

const routeRegistry = {
  [homeRoute.id]: homeRoute,
  [aiCommandRoute.id]: aiCommandRoute,
  [workflowsRoute.id]: workflowsRoute,
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

function getPageRoot() {
  return document.getElementById("pageRoot");
}

function getFallbackRoute(route) {
  return {
    id: route,
    meta: {
      eyebrow: "System",
      title: "Page",
      description: "Workspace view"
    },
    template: `
      <section class="page is-active">
        <div class="page-grid">
          <div class="panel panel-span-2">
            <div class="empty-box">Unknown route: ${route}</div>
          </div>
        </div>
      </section>
    `
  };
}

function updatePageHeader(route) {
  const routeDef = getRouteDefinition(route);
  const meta = routeDef.meta;

  const eyebrow = document.getElementById("pageEyebrow");
  const title = document.getElementById("pageTitle");
  const description = document.getElementById("pageDescription");

  if (eyebrow) eyebrow.textContent = meta.eyebrow;
  if (title) title.textContent = meta.title;
  if (description) description.textContent = meta.description;
}

function updateActiveNav(route) {
  const navItems = Array.from(document.querySelectorAll(".nav-item[data-route]"));

  navItems.forEach((item) => {
    const itemRoute = item.getAttribute("data-route");
    item.classList.toggle("is-active", itemRoute === route);
  });
}

export function getRouteDefinition(route) {
  return routeRegistry[route] || getFallbackRoute(route);
}

export function renderRouteTemplate(route) {
  const root = getPageRoot();
  if (!root) return;

  const routeDef = getRouteDefinition(route);
  root.innerHTML = routeDef.template;

  updatePageHeader(route);
  updateActiveNav(route);
}

export function navigateTo(route, emit = true) {
  renderRouteTemplate(route);

  if (emit) {
    window.dispatchEvent(
      new CustomEvent("mh:route-change", {
        detail: { route }
      })
    );
  }
}

export function initRouter() {
  renderRouteTemplate("home");
}
