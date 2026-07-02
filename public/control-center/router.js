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
import { customerCenterRoute } from "./pages/customer-center.js";
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
  [customerCenterRoute.id]: customerCenterRoute,
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
}


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

function escapeHtmlMin(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAccessDeniedRoute(route, reason = "") {
  const detail = reason || `Route "${route}" is not available for the current role.`;
  return {
    id: "__access-denied__",
    meta: {
      eyebrow: "Access",
      title: "Route Blocked",
      description: "This workspace route is blocked by role access rules."
    },
    template: `
      <section class="page is-active" data-page="access-denied">
        <div class="page-grid">
          <div class="panel panel-span-2">
            <div class="access-denied-box">
              <div class="access-denied-icon">&#128274;</div>
              <h3 class="access-denied-title">Route blocked: ${escapeHtmlMin(route)}</h3>
              <p class="access-denied-detail">${escapeHtmlMin(detail)}</p>
              <p class="access-denied-hint">
                To access this page, use the <strong>Role</strong> selector in the top bar and switch to a permitted role.
                For full access during internal testing, select <strong>admin</strong>.
              </p>
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
  return getFallbackRouteAccess(route, DEFAULT_ROLE, { useDefaultRoleMessage: true });
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
  notifyRouteChange(route);

  // Sync browser URL — setting the same hash value does not re-fire hashchange
  const newHash = `#${route}`;
  if (typeof location !== "undefined" && location.hash !== newHash) {
    location.hash = newHash;
  }

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
