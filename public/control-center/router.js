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

const DEFAULT_ROLE = "strategist";
const ACTIVE_ROUTE_ROLES = [
  "strategist",
  "writer",
  "designer",
  "video_lead",
  "publisher",
  "ads_operator",
  "analyst",
  "compliance_reviewer",
  "admin"
];
const DEFAULT_ROUTE_ROLE_ACCESS = {
  home: ["strategist", "analyst", "admin"],
  "ai-command": ACTIVE_ROUTE_ROLES,
  "campaign-studio": ["strategist", "ads_operator", "admin"],
  "content-studio": ["writer", "strategist", "compliance_reviewer", "admin"],
  "media-studio": ["designer", "video_lead", "compliance_reviewer", "admin"],
  publishing: ["publisher", "compliance_reviewer", "admin"],
  research: ["strategist", "analyst", "writer", "admin"],
  setup: ACTIVE_ROUTE_ROLES,
  "task-center": ACTIVE_ROUTE_ROLES,
  "queue-center": ACTIVE_ROUTE_ROLES,
  "job-monitor": ACTIVE_ROUTE_ROLES,
  "notification-center": ACTIVE_ROUTE_ROLES,
  governance: ["compliance_reviewer", "admin", "analyst"],
  "ads-manager": ["ads_operator", "strategist", "analyst", "admin"],
  insights: ["analyst", "strategist", "ads_operator", "admin"],
  integrations: ["admin"],
  workflows: ACTIVE_ROUTE_ROLES,
  library: ["designer", "video_lead", "publisher", "admin"],
  settings: ["admin"]
};

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

let routeAccessResolver = null;

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

function getAccessDeniedRoute(route, reason = "") {
  const detail = reason || "This route is not available for the current role.";
  return {
    id: "__access-denied__",
    meta: {
      eyebrow: "Access",
      title: "Restricted",
      description: "This workspace route is blocked by role access rules."
    },
    template: `
      <section class="page is-active" data-page="access-denied">
        <div class="page-grid">
          <div class="panel panel-span-2">
            <div class="empty-box">
              Route blocked: ${route}. ${detail}
            </div>
          </div>
        </div>
      </section>
    `
  };
}

function normalizeRouteAccessResult(result, route) {
  if (typeof result === "boolean") {
    return {
      allowed: result,
      reason: result ? "" : `Access to ${route} is restricted.`
    };
  }

  if (result && typeof result === "object") {
    return {
      allowed: result.allowed !== false,
      reason: String(result.reason || "")
    };
  }

  return {
    allowed: true,
    reason: ""
  };
}

function getDefaultRouteAccess(route) {
  const allowedRoles = DEFAULT_ROUTE_ROLE_ACCESS[route];
  if (!Array.isArray(allowedRoles)) {
    return {
      allowed: true,
      reason: ""
    };
  }

  const allowed = allowedRoles.includes(DEFAULT_ROLE);
  return {
    allowed,
    reason: allowed
      ? ""
      : `Access to ${route} is restricted until a permitted role is active.`
  };
}

function getRouteAccess(route) {
  if (typeof routeAccessResolver !== "function") {
    return getDefaultRouteAccess(route);
  }

  try {
    return normalizeRouteAccessResult(routeAccessResolver(route), route);
  } catch (_) {
    return getDefaultRouteAccess(route);
  }
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
  const access = getRouteAccess(route);
  if (!access.allowed) {
    return getAccessDeniedRoute(route, access.reason);
  }

  return routeRegistry[route] || getFallbackRoute(route);
}

export function setRouteAccessResolver(resolver) {
  routeAccessResolver = typeof resolver === "function" ? resolver : null;
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
