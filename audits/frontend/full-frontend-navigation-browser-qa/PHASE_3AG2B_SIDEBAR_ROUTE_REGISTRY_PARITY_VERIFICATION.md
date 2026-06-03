# PHASE 3AG.2B — Sidebar / Route Registry Parity Verification

## Status
Verification-only.

No production implementation is approved in this phase.

## Purpose
Verify whether the sidebar covers all user-facing Control Center pages and classify route-only/internal surfaces before committing the 3AG.2 Browser QA matrix.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3AG.2 — Full Frontend Navigation Browser QA Matrix`
- Current concern: Browser QA was recorded, but we need stronger evidence for remaining pages such as Insights, Ads Manager, Research, and any missing sidebar pages.

## Checks Required
- Sidebar `data-route` entries.
- Router/page route exports.
- Route metadata ids/labels.
- Routes visible in sidebar.
- Routes registered but hidden/route-only.
- Sidebar entries with no registered route.
- Registered routes missing from sidebar.
- Decision whether any route must be added to the sidebar.


## 1) Sidebar data-route entries
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

## 2) Sidebar visible labels around nav
      <div id="fatalStartupSteps" class="fatal-startup-steps">No startup steps recorded yet.</div>
      <div class="fatal-error-actions">
        <button id="fatalRetryBtn" class="btn btn-primary" type="button">Retry</button>
        <button id="fatalAccessKeyBtn" class="btn btn-secondary" type="button">Set Access Key</button>
      </div>
    </section>

    <!-- Global loading -->
    <div id="loadingOverlay" class="loading-overlay" aria-hidden="true">
      <div class="loading-card" role="status" aria-live="polite">
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

          <div class="topbar-left">
            <div class="page-context">
              <span id="pageEyebrow" class="page-eyebrow">Start</span>
              <h2 id="pageTitle" class="page-title">Home</h2>
            </div>
          </div>

          <div class="topbar-right">
            <div class="workspace-chip" aria-label="Current workspace">
              <span class="workspace-dot"></span>
              <strong id="ctxProject">-</strong>
            </div>

            <div class="exec-action-cluster" aria-label="Executive actions">
              <button
                id="commandToggleBtn"
                class="btn btn-secondary command-toggle"
                type="button"
                aria-label="Toggle command bar"
                aria-controls="globalCommandBar"

## 3) Router imports / registry / fallback route markers
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

## 4) Route exports in page files
public/control-center/pages/campaign-studio.js:1448:export const campaignStudioRoute = {
public/control-center/pages/media-studio-workspace.js:3462:export const mediaStudioRoute = {
public/control-center/pages/operations-centers.js:1747:export const taskCenterRoute = {
public/control-center/pages/operations-centers.js:1782:export const queueCenterRoute = {
public/control-center/pages/operations-centers.js:1830:export const jobMonitorRoute = {
public/control-center/pages/operations-centers.js:1878:export const notificationCenterRoute = {
public/control-center/pages/operations-centers.js:2065:export const operationsCentersRoute = {
public/control-center/pages/research.js:1101:export const researchRoute = {
public/control-center/pages/ai-command.js:4660:export const aiCommandRoute = {
public/control-center/pages/library.js:2884:export const libraryRoute = {
public/control-center/pages/home.js:643:export const homeRoute = {
public/control-center/pages/insights.js:1027:export const insightsRoute = {
public/control-center/pages/content-studio-workspace.js:2247:export const contentStudioRoute = {
public/control-center/pages/governance.js:1460:export const governanceRoute = {
public/control-center/pages/integrations.js:1556:export const integrationsRoute = {
public/control-center/pages/setup.js:1325:export const setupRoute = {
public/control-center/pages/publishing.js:1908:export const publishingRoute = {
public/control-center/pages/workflows.js:1769:export const workflowsRoute = {
public/control-center/pages/settings.js:2017:export const settingsRoute = {
public/control-center/pages/ads-manager.js:286:export const adsManagerRoute = {

## 5) Route id / label markers in page files
public/control-center/pages/ai-command/tool-dock.js:324:    id: "rewrite",
public/control-center/pages/ai-command/tool-dock.js:326:    label: "Rewrite",
public/control-center/pages/ai-command/tool-dock.js:331:    id: "translate",
public/control-center/pages/ai-command/tool-dock.js:333:    label: "Translate",
public/control-center/pages/ai-command/tool-dock.js:338:    id: "improve",
public/control-center/pages/ai-command/tool-dock.js:340:    label: "Improve",
public/control-center/pages/ai-command/tool-dock.js:349:      id: "campaign-plan",
public/control-center/pages/ai-command/tool-dock.js:351:      label: "Campaign",
public/control-center/pages/ai-command/tool-dock.js:362:      id: "launch-plan",
public/control-center/pages/ai-command/tool-dock.js:364:      label: "Launch",
public/control-center/pages/ai-command/tool-dock.js:375:      id: "audience",
public/control-center/pages/ai-command/tool-dock.js:377:      label: "Audience",
public/control-center/pages/ai-command/tool-dock.js:388:      id: "offer",
public/control-center/pages/ai-command/tool-dock.js:390:      label: "Offer",
public/control-center/pages/ai-command/tool-dock.js:401:      id: "funnel",
public/control-center/pages/ai-command/tool-dock.js:403:      label: "Funnel",
public/control-center/pages/ai-command/tool-dock.js:414:      id: "priority",
public/control-center/pages/ai-command/tool-dock.js:416:      label: "Priority",
public/control-center/pages/ai-command/tool-dock.js:430:      id: "write",
public/control-center/pages/ai-command/tool-dock.js:432:      label: "Write",
public/control-center/pages/ai-command/tool-dock.js:443:      id: "rewrite",
public/control-center/pages/ai-command/tool-dock.js:445:      label: "Rewrite",
public/control-center/pages/ai-command/tool-dock.js:456:      id: "translate",
public/control-center/pages/ai-command/tool-dock.js:458:      label: "Translate",
public/control-center/pages/ai-command/tool-dock.js:469:      id: "improve",
public/control-center/pages/ai-command/tool-dock.js:471:      label: "Improve",
public/control-center/pages/ai-command/tool-dock.js:482:      id: "check",
public/control-center/pages/ai-command/tool-dock.js:484:      label: "Check",
public/control-center/pages/ai-command/tool-dock.js:495:      id: "sources",
public/control-center/pages/ai-command/tool-dock.js:497:      label: "Sources",
public/control-center/pages/ai-command/tool-dock.js:508:      id: "seo",
public/control-center/pages/ai-command/tool-dock.js:510:      label: "SEO",
public/control-center/pages/ai-command/tool-dock.js:521:      id: "repurpose",
public/control-center/pages/ai-command/tool-dock.js:523:      label: "Repurpose",
public/control-center/pages/ai-command/tool-dock.js:534:      id: "send",
public/control-center/pages/ai-command/tool-dock.js:536:      label: "Prepare Send-Off",
public/control-center/pages/ai-command/tool-dock.js:549:      id: "visual-brief",
public/control-center/pages/ai-command/tool-dock.js:551:      label: "Visual Brief",
public/control-center/pages/ai-command/tool-dock.js:562:      id: "moodboard",
public/control-center/pages/ai-command/tool-dock.js:564:      label: "Moodboard",
public/control-center/pages/ai-command/tool-dock.js:575:      id: "image-prompt",
public/control-center/pages/ai-command/tool-dock.js:577:      label: "Image",
public/control-center/pages/ai-command/tool-dock.js:588:      id: "asset-list",
public/control-center/pages/ai-command/tool-dock.js:590:      label: "Assets",
public/control-center/pages/ai-command/tool-dock.js:601:      id: "layout",
public/control-center/pages/ai-command/tool-dock.js:603:      label: "Layout",
public/control-center/pages/ai-command/tool-dock.js:614:      id: "brand-check",
public/control-center/pages/ai-command/tool-dock.js:616:      label: "Brand Check",
public/control-center/pages/ai-command/tool-dock.js:630:      id: "reel-script",
public/control-center/pages/ai-command/tool-dock.js:632:      label: "Reel",
public/control-center/pages/ai-command/tool-dock.js:643:      id: "storyboard",
public/control-center/pages/ai-command/tool-dock.js:645:      label: "Storyboard",
public/control-center/pages/ai-command/tool-dock.js:656:      id: "shot-list",
public/control-center/pages/ai-command/tool-dock.js:658:      label: "Shot List",
public/control-center/pages/ai-command/tool-dock.js:669:      id: "voiceover",
public/control-center/pages/ai-command/tool-dock.js:671:      label: "Voiceover",
public/control-center/pages/ai-command/tool-dock.js:682:      id: "video-cta",
public/control-center/pages/ai-command/tool-dock.js:684:      label: "Video CTA",
public/control-center/pages/ai-command/tool-dock.js:698:      id: "publish-check",
public/control-center/pages/ai-command/tool-dock.js:700:      label: "Publish Check",
public/control-center/pages/ai-command/tool-dock.js:711:      id: "channel-pack",
public/control-center/pages/ai-command/tool-dock.js:713:      label: "Channel Pack",
public/control-center/pages/ai-command/tool-dock.js:724:      id: "schedule",
public/control-center/pages/ai-command/tool-dock.js:726:      label: "Draft Schedule",
public/control-center/pages/ai-command/tool-dock.js:737:      id: "hashtags",
public/control-center/pages/ai-command/tool-dock.js:739:      label: "Hashtags",
public/control-center/pages/ai-command/tool-dock.js:750:      id: "approval-pack",
public/control-center/pages/ai-command/tool-dock.js:752:      label: "Governance Review",
public/control-center/pages/ai-command/tool-dock.js:766:      id: "ad-angle",
public/control-center/pages/ai-command/tool-dock.js:768:      label: "Ad Angle",
public/control-center/pages/ai-command/tool-dock.js:779:      id: "ad-copy",
public/control-center/pages/ai-command/tool-dock.js:781:      label: "Ad Copy",
public/control-center/pages/ai-command/tool-dock.js:792:      id: "targeting",
public/control-center/pages/ai-command/tool-dock.js:794:      label: "Targeting",
public/control-center/pages/ai-command/tool-dock.js:805:      id: "creative-test",
public/control-center/pages/ai-command/tool-dock.js:807:      label: "Creative",
public/control-center/pages/ai-command/tool-dock.js:818:      id: "landing-match",
public/control-center/pages/ai-command/tool-dock.js:820:      label: "Landing",
public/control-center/pages/ai-command/tool-dock.js:834:      id: "seo-brief",
public/control-center/pages/ai-command/tool-dock.js:836:      label: "SEO Brief",
public/control-center/pages/ai-command/tool-dock.js:847:      id: "insights",
public/control-center/pages/ai-command/tool-dock.js:849:      label: "Insights",
public/control-center/pages/ai-command/tool-dock.js:860:      id: "keywords",
public/control-center/pages/ai-command/tool-dock.js:862:      label: "Keywords",
public/control-center/pages/ai-command/tool-dock.js:873:      id: "performance",
public/control-center/pages/ai-command/tool-dock.js:875:      label: "Performance",
public/control-center/pages/ai-command/tool-dock.js:886:      id: "content-gap",
public/control-center/pages/ai-command/tool-dock.js:888:      label: "Gaps",
public/control-center/pages/ai-command/tool-dock.js:902:      id: "claims-check",
public/control-center/pages/ai-command/tool-dock.js:904:      label: "Claims",
public/control-center/pages/ai-command/tool-dock.js:915:      id: "safe-rewrite",
public/control-center/pages/ai-command/tool-dock.js:917:      label: "Safe Rewrite",
public/control-center/pages/ai-command/tool-dock.js:928:      id: "evidence",
public/control-center/pages/ai-command/tool-dock.js:930:      label: "Evidence",
public/control-center/pages/ai-command/tool-dock.js:941:      id: "gdpr",
public/control-center/pages/ai-command/tool-dock.js:943:      label: "GDPR",
public/control-center/pages/ai-command/tool-dock.js:954:      id: "approval-notes",
public/control-center/pages/ai-command/tool-dock.js:956:      label: "Governance Notes",
public/control-center/pages/ai-command/tool-dock.js:970:      id: "task-plan",
public/control-center/pages/ai-command/tool-dock.js:972:      label: "Task Plan",
public/control-center/pages/ai-command/tool-dock.js:983:      id: "workflow",
public/control-center/pages/ai-command/tool-dock.js:985:      label: "Draft Workflow",
public/control-center/pages/ai-command/tool-dock.js:996:      id: "handoff",
public/control-center/pages/ai-command/tool-dock.js:998:      label: "Prepare Handoff",
public/control-center/pages/ai-command/tool-dock.js:1009:      id: "timeline",
public/control-center/pages/ai-command/tool-dock.js:1011:      label: "Timeline",
public/control-center/pages/ai-command/tool-dock.js:1022:      id: "checklist",
public/control-center/pages/ai-command/tool-dock.js:1024:      label: "Checklist",
public/control-center/pages/ai-command/tool-dock.js:1038:      id: "reply-draft",
public/control-center/pages/ai-command/tool-dock.js:1040:      label: "Reply",
public/control-center/pages/ai-command/tool-dock.js:1051:      id: "ticket",
public/control-center/pages/ai-command/tool-dock.js:1053:      label: "Draft Ticket",
public/control-center/pages/ai-command/tool-dock.js:1064:      id: "sla",
public/control-center/pages/ai-command/tool-dock.js:1066:      label: "SLA",
public/control-center/pages/ai-command/tool-dock.js:1077:      id: "summary",
public/control-center/pages/ai-command/tool-dock.js:1079:      label: "Summary",
public/control-center/pages/ai-command/tool-dock.js:1093:      id: "sales-pitch",
public/control-center/pages/ai-command/tool-dock.js:1095:      label: "Pitch",
public/control-center/pages/ai-command/tool-dock.js:1106:      id: "follow-up",
public/control-center/pages/ai-command/tool-dock.js:1108:      label: "Follow-up",
public/control-center/pages/ai-command/tool-dock.js:1119:      id: "objections",
public/control-center/pages/ai-command/tool-dock.js:1121:      label: "Objection",
public/control-center/pages/ai-command/tool-dock.js:1132:      id: "lead-brief",
public/control-center/pages/ai-command/tool-dock.js:1134:      label: "Lead Brief",
public/control-center/pages/publishing/publishing-payloads.js:63:    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
public/control-center/pages/publishing/publishing-payloads.js:75:    title: firstText(session.form.title, session.form.contentItem, "Publishing item"),
public/control-center/pages/publishing/publishing-payloads.js:92:    title: firstText(session.form.title, session.form.contentItem, "Publishing draft"),
public/control-center/pages/campaign-studio.js:16:    label: "Wave 1",
public/control-center/pages/campaign-studio.js:23:    label: "Wave 2",
public/control-center/pages/campaign-studio.js:30:    label: "Wave 3",
public/control-center/pages/campaign-studio.js:191:      title: "Recommendation",
public/control-center/pages/campaign-studio.js:200:    title: readableValue(record.title || record.label || record.domain, "Recommendation"),
public/control-center/pages/campaign-studio.js:263:      recordId: "",
public/control-center/pages/campaign-studio.js:271:      lastAiHandoffId: ""
public/control-center/pages/campaign-studio.js:592:      title: label,
public/control-center/pages/campaign-studio.js:608:    title: item,
public/control-center/pages/campaign-studio.js:625:        title: item,
public/control-center/pages/campaign-studio.js:632:      title: firstNonEmpty(record.query, record.page, record.title, record.label, "SEO opportunity"),
public/control-center/pages/campaign-studio.js:645:      title: "Paid efficiency",
public/control-center/pages/campaign-studio.js:653:      title: firstNonEmpty(record.campaign_name, record.title, record.label, "Top paid signal"),
public/control-center/pages/campaign-studio.js:661:      title: firstNonEmpty(record.campaign_name, record.title, record.label, "Paid risk"),
public/control-center/pages/campaign-studio.js:689:      title: channelLabel(key),
public/control-center/pages/campaign-studio.js:697:      title: channelLabel(key),
public/control-center/pages/campaign-studio.js:709:      title: channelLabel(key),
public/control-center/pages/campaign-studio.js:717:        title: channelLabel(item),
public/control-center/pages/campaign-studio.js:725:      title: "No weak platform flagged yet",
public/control-center/pages/campaign-studio.js:791:    label: "Email",
public/control-center/pages/campaign-studio.js:798:    label: "SEO / Landing Pages",
public/control-center/pages/campaign-studio.js:803:    label: "Analytics / Tracking",
public/control-center/pages/campaign-studio.js:818:      label: "Insights feedback loop",
public/control-center/pages/campaign-studio.js:1051:        title: channelLabel(key),
public/control-center/pages/campaign-studio.js:1061:      title: channelLabel(key),
public/control-center/pages/campaign-studio.js:1071:      title: channelLabel(record.integration_id),
public/control-center/pages/campaign-studio.js:1449:  id: "campaign-studio",
public/control-center/pages/campaign-studio.js:1453:    title: "Campaign Studio",
public/control-center/pages/campaign-studio.js:1622:                  label: "Campaign name",
public/control-center/pages/campaign-studio.js:1630:                  label: "Campaign goal",
public/control-center/pages/campaign-studio.js:1638:                  label: "Campaign type",
public/control-center/pages/campaign-studio.js:1646:                  label: "Market",
public/control-center/pages/campaign-studio.js:1656:                  label: "Start date",
public/control-center/pages/campaign-studio.js:1664:                  label: "End date",
public/control-center/pages/campaign-studio.js:1672:                  label: "Budget",
public/control-center/pages/campaign-studio.js:1692:                  label: "Product focus",
public/control-center/pages/campaign-studio.js:1700:                  label: "Product angle",
public/control-center/pages/campaign-studio.js:1709:                  label: "Primary audience",
public/control-center/pages/campaign-studio.js:1718:                  label: "Audience need / pain point",
public/control-center/pages/campaign-studio.js:1727:                  label: "Channel plan",
public/control-center/pages/campaign-studio.js:1735:                  label: "Offer headline",
public/control-center/pages/campaign-studio.js:1744:                  label: "Offer detail",
public/control-center/pages/campaign-studio.js:1753:                  label: "Audience stage",
public/control-center/pages/campaign-studio.js:1803:                        label: "Wave name",
public/control-center/pages/campaign-studio.js:1811:                        label: "Wave focus",
public/control-center/pages/campaign-studio.js:1820:                        label: "Wave channels",
public/control-center/pages/campaign-studio.js:1884:                  label: "Asset checklist",
public/control-center/pages/campaign-studio.js:1893:                  label: "Execution notes",
public/control-center/pages/media-studio-workspace.js:47:    id: "visual-director",
public/control-center/pages/media-studio-workspace.js:48:    title: "Visual Director",
public/control-center/pages/media-studio-workspace.js:54:    id: "video-strategist",
public/control-center/pages/media-studio-workspace.js:55:    title: "Video Strategist",
public/control-center/pages/media-studio-workspace.js:61:    id: "voice-director",
public/control-center/pages/media-studio-workspace.js:62:    title: "Voice Director",
public/control-center/pages/media-studio-workspace.js:68:    id: "brand-guardian",
public/control-center/pages/media-studio-workspace.js:69:    title: "Brand Guardian",
public/control-center/pages/media-studio-workspace.js:75:    id: "prompt-engineer",
public/control-center/pages/media-studio-workspace.js:76:    title: "Prompt Engineer",
public/control-center/pages/media-studio-workspace.js:82:    id: "publishing-assistant",
public/control-center/pages/media-studio-workspace.js:83:    title: "Publishing Assistant",
public/control-center/pages/media-studio-workspace.js:285:    title: "",
public/control-center/pages/media-studio-workspace.js:349:    id: "v1",
public/control-center/pages/media-studio-workspace.js:474:      selectedId: "",
public/control-center/pages/media-studio-workspace.js:477:      formSourceId: "",
public/control-center/pages/media-studio-workspace.js:482:      loadedHandoffId: "",
public/control-center/pages/media-studio-workspace.js:505:    title: firstText(raw.title, raw.name, raw.prompt, `${titleCase(mode)} media job`),
public/control-center/pages/media-studio-workspace.js:683:    title: firstText(
public/control-center/pages/media-studio-workspace.js:731:    title: item.title || "",
public/control-center/pages/media-studio-workspace.js:848:    title: firstText(session.form.title, `${titleCase(mode)} media for ${session.form.campaign || session.form.project || "campaign"}`),
public/control-center/pages/media-studio-workspace.js:902:    title: session.form.title,
public/control-center/pages/media-studio-workspace.js:985:    title: firstText(selectedItem?.title, session.form.title, `${titleCase(mediaType)} ${titleCase(asString(version?.id || "version"))}`),
public/control-center/pages/media-studio-workspace.js:1674:      label: "Source",
public/control-center/pages/media-studio-workspace.js:1681:      label: "Creative",
public/control-center/pages/media-studio-workspace.js:1690:      label: "Brand",
public/control-center/pages/media-studio-workspace.js:1699:      label: "Publishing",
public/control-center/pages/media-studio-workspace.js:1708:      label: "Governance",
public/control-center/pages/media-studio-workspace.js:1788:      label: "Brief",
public/control-center/pages/media-studio-workspace.js:1793:      label: "Source",
public/control-center/pages/media-studio-workspace.js:1798:      label: "Generate/Prepare",
public/control-center/pages/media-studio-workspace.js:1803:      label: "Review",
public/control-center/pages/media-studio-workspace.js:1808:      label: "Save to Library",
public/control-center/pages/media-studio-workspace.js:1813:      label: "Handoff",
public/control-center/pages/media-studio-workspace.js:1952:          ${renderField({ id: "mediaProjectInput", name: "project", label: "Project", value: form.project }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1953:          ${renderField({ id: "mediaCampaignInput", name: "campaign", label: "Campaign", value: form.campaign }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1956:          ${renderField({ id: "mediaProductInput", name: "product", label: "Product", value: form.product }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1957:          ${renderField({ id: "mediaChannelInput", name: "channel", label: "Channel", value: form.channel, options: CHANNELS }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1960:          ${renderField({ id: "mediaFormatInput", name: "format", label: "Format", value: form.format, helper: "Examples: 1:1 product image, 9:16 reel, voiceover script, marketplace hero." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1961:          ${renderField({ id: "mediaPurposeInput", name: "outputPurpose", label: "Output purpose", value: form.outputPurpose, options: OUTPUT_PURPOSES }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1963:        ${renderField({ id: "mediaObjectiveInput", name: "objective", label: "Objective", value: form.objective, multiline: true, rows: 3 }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1964:        ${renderField({ id: "mediaBrandStyleInput", name: "brandStyle", label: "Brand style", value: form.brandStyle, multiline: true, rows: 3 }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1965:        ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1967:          ${renderField({ id: "mediaReferenceInput", name: "referenceAsset", label: "Reference asset if available", value: form.referenceAsset, helper: "Use an asset id, filename, or source note already known to the project." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1968:          ${renderField({ id: "mediaTitleInput", name: "title", label: "Job title", value: form.title, helper: "Optional operator-facing queue title." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1970:        ${renderField({ id: "mediaReviewNotesInput", name: "reviewNotes", label: "Review notes", value: form.reviewNotes, multiline: true, rows: 3, errorKey: "reviewNotes" }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:2663:      title: source.title || session.form.title || "Media handoff",
public/control-center/pages/media-studio-workspace.js:2677:        title: source.title || session.form.title || "Media handoff",
public/control-center/pages/media-studio-workspace.js:3031:        title: firstText(summary.title, session.form.title)
public/control-center/pages/media-studio-workspace.js:3137:            title: `Review ${item.title || session.form.title || "media job"}`,
public/control-center/pages/media-studio-workspace.js:3203:            title: `Complete media job ${item.title || session.form.title || "media job"}`,
public/control-center/pages/media-studio-workspace.js:3239:        modeId: "media",
public/control-center/pages/media-studio-workspace.js:3241:        lastResponseTitle: item?.title || session.form.title || "Media Studio Review",
public/control-center/pages/media-studio-workspace.js:3255:          title: item?.title || session.form.title || "",
public/control-center/pages/media-studio-workspace.js:3405:          modeId: "media",
public/control-center/pages/media-studio-workspace.js:3407:          lastResponseTitle: `${specialist.title} Assist`,
public/control-center/pages/media-studio-workspace.js:3420:            title: `${specialist.title} Assist`,
public/control-center/pages/media-studio-workspace.js:3463:  id: "media-studio",
public/control-center/pages/media-studio-workspace.js:3467:    title: "Media Studio",
public/control-center/pages/operations-centers.js:175:        label: "Prioritize backlog",
public/control-center/pages/operations-centers.js:180:        label: "Unblock selected task",
public/control-center/pages/operations-centers.js:185:        label: "Summarize execution risk",
public/control-center/pages/operations-centers.js:190:        label: "Explain owner workload",
public/control-center/pages/operations-centers.js:195:        label: "Identify overdue risk",
public/control-center/pages/operations-centers.js:205:        label: "Triage queue pressure",
public/control-center/pages/operations-centers.js:210:        label: "Review selected queue item",
public/control-center/pages/operations-centers.js:215:        label: "Find throughput blockers",
public/control-center/pages/operations-centers.js:225:        label: "Triage failures",
public/control-center/pages/operations-centers.js:230:        label: "Inspect selected job",
public/control-center/pages/operations-centers.js:235:        label: "Summarize job health",
public/control-center/pages/operations-centers.js:244:      label: "Rank alert urgency",
public/control-center/pages/operations-centers.js:249:      label: "Review selected alert",
public/control-center/pages/operations-centers.js:254:      label: "Summarize operational signal",
public/control-center/pages/operations-centers.js:295:      label: "Runtime",
public/control-center/pages/operations-centers.js:302:      label: "Queue Pressure",
public/control-center/pages/operations-centers.js:309:      label: "Failed Jobs",
public/control-center/pages/operations-centers.js:316:      label: "Critical Alerts",
public/control-center/pages/operations-centers.js:323:      label: "Approvals",
public/control-center/pages/operations-centers.js:330:      label: "Publishing",
public/control-center/pages/operations-centers.js:337:      label: "Providers",
public/control-center/pages/operations-centers.js:344:      label: "Claim Risk",
public/control-center/pages/operations-centers.js:351:      label: "Inbox",
public/control-center/pages/operations-centers.js:464:          { label: "Source", value: titleCase(source) },
public/control-center/pages/operations-centers.js:465:          { label: "Destination", value: "Task Center" },
public/control-center/pages/operations-centers.js:466:          { label: "Status", value: "Review-only intake" },
public/control-center/pages/operations-centers.js:467:          { label: "Created", value: createdAt ? formatDateTime(createdAt) : "Not set" }
public/control-center/pages/operations-centers.js:542:          title: "System Signal",
public/control-center/pages/operations-centers.js:559:              { value: "all", label: "All Tasks", count: formatCount(taskCenter.total) },
public/control-center/pages/operations-centers.js:560:              { value: "open", label: "Open", count: formatCount(taskCenter.open_count) },
public/control-center/pages/operations-centers.js:561:              { value: "blocked", label: "Blocked", count: formatCount(taskCenter.blocked_count) },
public/control-center/pages/operations-centers.js:562:              { value: "overdue", label: "Overdue", count: formatCount(taskCenter.overdue_count) },
public/control-center/pages/operations-centers.js:563:              { value: "due_soon", label: "Due Soon", count: formatCount(taskCenter.due_soon_count) }
public/control-center/pages/operations-centers.js:622:                    { label: "Assignee", value: selectedItem.assignee || selectedItem.owner || "-" },
public/control-center/pages/operations-centers.js:623:                    { label: "Owner role", value: titleCase(selectedItem.assignee_role || selectedItem.owner_role || "-") },
public/control-center/pages/operations-centers.js:624:                    { label: "Due", value: formatDateTime(selectedItem.due_at) },
public/control-center/pages/operations-centers.js:625:                    { label: "Due state", value: titleCase(selectedItem.due_state || "unscheduled") },
public/control-center/pages/operations-centers.js:626:                    { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
public/control-center/pages/operations-centers.js:627:                    { label: "Source", value: titleCase(selectedItem.source_page || "-") },
public/control-center/pages/operations-centers.js:628:                    { label: "Domain", value: titleCase(selectedItem.service_domain || "-") },
public/control-center/pages/operations-centers.js:629:                    { label: "Linked entity", value: selectedItem.linked_entity?.label || selectedItem.linked_entity?.entity_type || "-" }
public/control-center/pages/operations-centers.js:782:          `Title: ${asString(incomingHandoff.title || incomingHandoff.summary || incomingHandoff.payload?.title || incomingHandoff.payload?.summary || "Incoming task handoff")}`,
public/control-center/pages/operations-centers.js:913:          title: "System Signal",
public/control-center/pages/operations-centers.js:930:              { value: "all", label: "All Queues", count: formatCount(totalItems) },
public/control-center/pages/operations-centers.js:971:                    { label: "Queue type", value: titleCase(selectedItem.queue_type || "queue") },
public/control-center/pages/operations-centers.js:972:                    { label: "Assignee", value: selectedItem.assignee || "-" },
public/control-center/pages/operations-centers.js:973:                    { label: "Priority", value: titleCase(selectedItem.priority || "normal") },
public/control-center/pages/operations-centers.js:974:                    { label: "Status", value: titleCase(selectedItem.status || "queued") },
public/control-center/pages/operations-centers.js:975:                    { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) },
public/control-center/pages/operations-centers.js:976:                    { label: "Entity", value: selectedItem.entity_type || "-" }
public/control-center/pages/operations-centers.js:1203:          title: "System Signal",
public/control-center/pages/operations-centers.js:1220:              { value: "all", label: "All Jobs", count: formatCount(asArray(jobMonitor.items).length) },
public/control-center/pages/operations-centers.js:1221:              { value: "running", label: "Running", count: formatCount(jobMonitor.running_count) },
public/control-center/pages/operations-centers.js:1222:              { value: "failed", label: "Failed", count: formatCount(jobMonitor.failed_count) },
public/control-center/pages/operations-centers.js:1223:              { value: "completed", label: "Completed", count: formatCount(jobMonitor.completed_count) }
public/control-center/pages/operations-centers.js:1261:                    { label: "Owner", value: selectedItem.owner || "-" },
public/control-center/pages/operations-centers.js:1262:                    { label: "Kind", value: titleCase(selectedItem.kind || "job") },
public/control-center/pages/operations-centers.js:1263:                    { label: "Retries", value: formatCount(selectedItem.retry_count) },
public/control-center/pages/operations-centers.js:1264:                    { label: "Health", value: titleCase(selectedItem.health_state || "unknown") },
public/control-center/pages/operations-centers.js:1265:                    { label: "Status", value: titleCase(selectedItem.status || "unknown") },
public/control-center/pages/operations-centers.js:1266:                    { label: "Updated", value: formatDateTime(selectedItem.updated_at || selectedItem.created_at) }
public/control-center/pages/operations-centers.js:1426:      title: `${titleCase(key)} disconnected`,
public/control-center/pages/operations-centers.js:1450:    title: asString(item.title) || "Notification",
public/control-center/pages/operations-centers.js:1558:          title: "System Signal",
public/control-center/pages/operations-centers.js:1575:              { value: "all", label: "All Alerts", count: formatCount(baseAlerts.length) },
public/control-center/pages/operations-centers.js:1576:              { value: "critical", label: "Critical", count: formatCount(notificationCenter.critical_count) },
public/control-center/pages/operations-centers.js:1577:              { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
public/control-center/pages/operations-centers.js:1578:              { value: "provider", label: "Provider", count: formatCount(providerAlerts.length) },
public/control-center/pages/operations-centers.js:1579:              { value: "inbox", label: "Inbox", count: formatCount(inboxList.length) }
public/control-center/pages/operations-centers.js:1617:                    { label: "Severity", value: titleCase(selectedItem.severity || "info") },
public/control-center/pages/operations-centers.js:1618:                    { label: "Source", value: titleCase(selectedItem.source || selectedItem.item_type || "system") },
public/control-center/pages/operations-centers.js:1619:                    { label: "Created", value: formatDateTime(selectedItem.created_at) },
public/control-center/pages/operations-centers.js:1620:                    { label: "Route", value: selectedItem.route?.route || selectedItem.route || "-" }
public/control-center/pages/operations-centers.js:1748:  id: "task-center",
public/control-center/pages/operations-centers.js:1752:    title: "Task Center",
public/control-center/pages/operations-centers.js:1783:  id: "queue-center",
public/control-center/pages/operations-centers.js:1787:    title: "Queue Center",
public/control-center/pages/operations-centers.js:1831:  id: "job-monitor",
public/control-center/pages/operations-centers.js:1835:    title: "Job Monitor",
public/control-center/pages/operations-centers.js:1879:  id: "notification-center",
public/control-center/pages/operations-centers.js:1883:    title: "Notification Center",
public/control-center/pages/operations-centers.js:1942:      title: "Task Center",
public/control-center/pages/operations-centers.js:1950:      title: "Queue Center",
public/control-center/pages/operations-centers.js:1958:      title: "Job Monitor",
public/control-center/pages/operations-centers.js:1966:      title: "Notification Center",
public/control-center/pages/operations-centers.js:1993:          title: "Operations Health Overview",
public/control-center/pages/operations-centers.js:2066:  id: "operations-centers",
public/control-center/pages/operations-centers.js:2067:  label: "Operations Centers",
public/control-center/pages/operations-centers.js:2070:    title: "Operations Centers",
public/control-center/pages/research.js:6:  campaign: { route: "campaign-studio", label: "Campaign Studio", destinationRole: "strategist", destinationDomain: "campaign" },
public/control-center/pages/research.js:7:  content: { route: "content-studio", label: "Content Studio", destinationRole: "writer", destinationDomain: "content" },
public/control-center/pages/research.js:8:  seo: { route: "workflows", label: "SEO Workflow", destinationRole: "strategist", destinationDomain: "research" },
public/control-center/pages/research.js:9:  ads: { route: "ads-manager", label: "Ads Manager", destinationRole: "ads_operator", destinationDomain: "campaign" },
public/control-center/pages/research.js:10:  ai: { route: "ai-command", label: "AI Command", destinationRole: "admin", destinationDomain: "governance" }
public/control-center/pages/research.js:204:            title: item,
public/control-center/pages/research.js:381:      ]).map((segment) => ({ title: segment }))
public/control-center/pages/research.js:492:        title: item.title,
public/control-center/pages/research.js:519:      title: item.keyword,
public/control-center/pages/research.js:525:      title: item.title,
public/control-center/pages/research.js:538:      title: item.title,
public/control-center/pages/research.js:572:      title: item.title,
public/control-center/pages/research.js:578:      title: item.title,
public/control-center/pages/research.js:584:      title: item.keyword,
public/control-center/pages/research.js:645:        title: "",
public/control-center/pages/research.js:721:      label: "Summarize research",
public/control-center/pages/research.js:722:      modeId: "research",
public/control-center/pages/research.js:727:      label: "Find market gaps",
public/control-center/pages/research.js:728:      modeId: "research",
public/control-center/pages/research.js:733:      label: "Suggest competitor angle",
public/control-center/pages/research.js:734:      modeId: "research",
public/control-center/pages/research.js:739:      label: "Identify SEO opportunities",
public/control-center/pages/research.js:740:      modeId: "seo",
public/control-center/pages/research.js:745:      label: "Suggest content directions",
public/control-center/pages/research.js:746:      modeId: "content",
public/control-center/pages/research.js:751:      label: "Suggest ad test ideas",
public/control-center/pages/research.js:752:      modeId: "ads",
public/control-center/pages/research.js:757:      label: "Identify risks before launch",
public/control-center/pages/research.js:758:      modeId: "executive",
public/control-center/pages/research.js:912:              lastResponseTitle: "Research prompt",
public/control-center/pages/research.js:930:              lastResponseTitle: "Research prompt",
public/control-center/pages/research.js:1044:        title: session.noteDraft.title.trim() || "Untitled research finding",
public/control-center/pages/research.js:1051:      session.noteDraft = { title: "", body: "", tags: "" };
public/control-center/pages/research.js:1064:        title: item.title,
public/control-center/pages/research.js:1088:        title: opportunity.title,
public/control-center/pages/research.js:1102:  id: "research",
public/control-center/pages/research.js:1106:    title: "Research",
public/control-center/pages/research.js:1163:        title: item.title,
public/control-center/pages/research.js:1168:          { label: "Positioning", value: item.positioning },
public/control-center/pages/research.js:1169:          { label: "Pricing", value: item.pricing },
public/control-center/pages/research.js:1170:          { label: "Gap", value: item.opportunityGap }
public/control-center/pages/research.js:1174:        title: item.title,
public/control-center/pages/research.js:1179:          { label: "Momentum", value: item.momentum },
public/control-center/pages/research.js:1180:          { label: "Seasonality", value: item.seasonality || "Not mapped yet" },
public/control-center/pages/research.js:1181:          { label: "Region", value: item.region || safeText(state.context.currentMarket, "Global") }
public/control-center/pages/research.js:1187:        title: item.title,
public/control-center/pages/research.js:1192:          { label: "Pain points", value: item.painPoints.join(", ") || "Not mapped yet" },
public/control-center/pages/research.js:1193:          { label: "Intent", value: item.intents.join(", ") || "Not mapped yet" },
public/control-center/pages/research.js:1194:          { label: "Triggers", value: item.triggers.join(", ") || "Not mapped yet" }
public/control-center/pages/research.js:1198:        title: item.keyword,
public/control-center/pages/research.js:1203:          { label: "Intent", value: item.intent },
public/control-center/pages/research.js:1204:          { label: "Difficulty", value: item.difficulty },
public/control-center/pages/research.js:1205:          { label: "Theme", value: item.theme }
public/control-center/pages/research.js:1234:                label: "Project",
public/control-center/pages/research.js:1239:                label: "Intelligence status",
public/control-center/pages/research.js:1244:                label: "Top opportunities",
public/control-center/pages/research.js:1249:                label: "Key risks",
public/control-center/pages/research.js:1254:                label: "Competitor signals",
public/control-center/pages/research.js:1259:                label: "Audience signals",
public/control-center/pages/research.js:1264:                label: "SEO opportunity level",
public/control-center/pages/research.js:1269:                label: "Missing intelligence",
public/control-center/pages/library/session-store.js:2:  selectedAssetId: "",
public/control-center/pages/library/catalog-readiness.js:49:      actionId: "upload-missing-required-assets",
public/control-center/pages/library/catalog-readiness.js:51:      label: "Upload missing required assets",
public/control-center/pages/library/catalog-readiness.js:58:    actionId: "review-library-assets",
public/control-center/pages/library/catalog-readiness.js:60:    label: "Review and approve Library assets",
public/control-center/pages/library/ai-panel.js:68:      title: "Close missing asset gaps",
public/control-center/pages/library/ai-panel.js:76:      title: "Select an asset to start",
public/control-center/pages/library/ai-panel.js:87:      title: "Confirm source-of-truth",
public/control-center/pages/library/ai-panel.js:95:      title: "Review before production",
public/control-center/pages/library/ai-panel.js:102:    title: "Asset ready for operating use",
public/control-center/pages/ai-command.js:35:                id: "strategist",
public/control-center/pages/ai-command.js:36:                label: "Strategist",
public/control-center/pages/ai-command.js:42:                id: "writer",
public/control-center/pages/ai-command.js:43:                label: "Content Writer",
public/control-center/pages/ai-command.js:49:                id: "media",
public/control-center/pages/ai-command.js:50:                label: "Media Director",
public/control-center/pages/ai-command.js:56:                id: "video_lead",
public/control-center/pages/ai-command.js:57:                label: "Video Lead",
public/control-center/pages/ai-command.js:63:                id: "publisher",
public/control-center/pages/ai-command.js:64:                label: "Publisher",
public/control-center/pages/ai-command.js:70:                id: "ads",
public/control-center/pages/ai-command.js:71:                label: "Ads Optimizer",
public/control-center/pages/ai-command.js:77:                id: "analyst",
public/control-center/pages/ai-command.js:78:                label: "SEO & Insights Analyst",
public/control-center/pages/ai-command.js:84:                id: "compliance_reviewer",
public/control-center/pages/ai-command.js:85:                label: "Compliance Reviewer",
public/control-center/pages/ai-command.js:91:                id: "operations",
public/control-center/pages/ai-command.js:92:                label: "Operations Lead",
public/control-center/pages/ai-command.js:98:                id: "customer_ops",
public/control-center/pages/ai-command.js:99:                label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:141:		id: "strategist",
public/control-center/pages/ai-command.js:142:		label: "Strategist",
public/control-center/pages/ai-command.js:154:		id: "writer",
public/control-center/pages/ai-command.js:155:		label: "Content Writer",
public/control-center/pages/ai-command.js:167:		id: "media",
public/control-center/pages/ai-command.js:168:		label: "Media Director",
public/control-center/pages/ai-command.js:180:		id: "video_lead",
public/control-center/pages/ai-command.js:181:		label: "Video Lead",
public/control-center/pages/ai-command.js:193:		id: "publisher",
public/control-center/pages/ai-command.js:194:		label: "Publisher",
public/control-center/pages/ai-command.js:206:		id: "ads",
public/control-center/pages/ai-command.js:207:		label: "Ads Optimizer",
public/control-center/pages/ai-command.js:219:		id: "analyst",
public/control-center/pages/ai-command.js:220:		label: "SEO & Insights Analyst",
public/control-center/pages/ai-command.js:232:		id: "compliance_reviewer",
public/control-center/pages/ai-command.js:233:		label: "Compliance Reviewer",
public/control-center/pages/ai-command.js:245:		id: "operations",
public/control-center/pages/ai-command.js:246:		label: "Operations Lead",
public/control-center/pages/ai-command.js:258:		id: "customer_ops",
public/control-center/pages/ai-command.js:259:		label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:288:		{ label: "What should I do next?", sub: "Review priorities and blockers" },
public/control-center/pages/ai-command.js:289:		{ label: "Draft a campaign brief", sub: "Map objective, audience, and channels" },
public/control-center/pages/ai-command.js:290:		{ label: "Review launch readiness", sub: "Identify what is blocking launch" },
public/control-center/pages/ai-command.js:291:		{ label: "Suggest the next campaign move", sub: "Based on current project state" }
public/control-center/pages/ai-command.js:294:		{ label: "Draft campaign captions", sub: "For the active campaign" },
public/control-center/pages/ai-command.js:295:		{ label: "Write a hook sequence", sub: "3 hook variants to test" },
public/control-center/pages/ai-command.js:296:		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
public/control-center/pages/ai-command.js:297:		{ label: "Suggest message variants", sub: "Test different angles and tones" }
public/control-center/pages/ai-command.js:300:		{ label: "Write a creative brief", sub: "For the next campaign visual" },
public/control-center/pages/ai-command.js:301:		{ label: "Review brand consistency", sub: "Flag misaligned assets" },
public/control-center/pages/ai-command.js:302:		{ label: "Map format requirements", sub: "By platform and campaign phase" },
public/control-center/pages/ai-command.js:303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
public/control-center/pages/ai-command.js:306:		{ label: "Write a reel script", sub: "For the current campaign" },
public/control-center/pages/ai-command.js:307:		{ label: "Plan short-form content", sub: "Map next 4 video concepts" },
public/control-center/pages/ai-command.js:308:		{ label: "Outline motion direction", sub: "Align visuals with campaign tone" },
public/control-center/pages/ai-command.js:309:		{ label: "Map video asset needs", sub: "By platform and format" }
public/control-center/pages/ai-command.js:312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
public/control-center/pages/ai-command.js:313:		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
public/control-center/pages/ai-command.js:314:		{ label: "Check scheduled jobs", sub: "Review the current queue" },
public/control-center/pages/ai-command.js:315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
public/control-center/pages/ai-command.js:318:		{ label: "Draft ad concepts", sub: "For the current campaign" },
public/control-center/pages/ai-command.js:319:		{ label: "Review targeting angles", sub: "Map audience and platform fit" },
public/control-center/pages/ai-command.js:320:		{ label: "Suggest creative variants", sub: "Test different hooks and CTAs" },
public/control-center/pages/ai-command.js:321:		{ label: "Plan paid campaign structure", sub: "Objective, audience, creative, budget" }
public/control-center/pages/ai-command.js:324:		{ label: "Review SEO signals", sub: "Top queries, CTR gaps, weak pages" },
public/control-center/pages/ai-command.js:325:		{ label: "Analyze content performance", sub: "What is working and what is not" },
public/control-center/pages/ai-command.js:326:		{ label: "Map data coverage gaps", sub: "Which integrations are missing" },
public/control-center/pages/ai-command.js:327:		{ label: "Suggest next improvements", sub: "Based on current signals" }
public/control-center/pages/ai-command.js:330:		{ label: "Check claims for approval", sub: "Review all marketing claims" },
public/control-center/pages/ai-command.js:331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
public/control-center/pages/ai-command.js:332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
public/control-center/pages/ai-command.js:333:		{ label: "Review approval requirements", sub: "What needs sign-off" }
public/control-center/pages/ai-command.js:336:		{ label: "Turn this into tasks", sub: "Break down into action items" },
public/control-center/pages/ai-command.js:337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
public/control-center/pages/ai-command.js:338:		{ label: "Review execution health", sub: "Check blockers and failed jobs" },
public/control-center/pages/ai-command.js:339:		{ label: "Map the next execution steps", sub: "Sequence and prioritize" }
public/control-center/pages/ai-command.js:342:		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
public/control-center/pages/ai-command.js:343:		{ label: "Draft customer reply", sub: "Safe response for review" },
public/control-center/pages/ai-command.js:344:		{ label: "Check SLA risk", sub: "Flag urgency and escalation path" },
public/control-center/pages/ai-command.js:345:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
public/control-center/pages/ai-command.js:348:		{ label: "Qualify this lead", sub: "Fit, intent, urgency, next step" },
public/control-center/pages/ai-command.js:349:		{ label: "Draft outreach", sub: "Personalized message for review" },
public/control-center/pages/ai-command.js:350:		{ label: "Build follow-up sequence", sub: "Multi-step sales cadence" },
public/control-center/pages/ai-command.js:351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
public/control-center/pages/ai-command.js:357:	{ label: "What should the executive AI team focus on?", sub: "Strategy, execution, and risk review" },
public/control-center/pages/ai-command.js:358:	{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },
public/control-center/pages/ai-command.js:359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:366:	{ id: "ask", title: "Ask", description: "Write the request and choose the team lane." },
public/control-center/pages/ai-command.js:367:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
public/control-center/pages/ai-command.js:368:	{ id: "review", title: "Review", description: "Check safety, scope, language, and destination." },
public/control-center/pages/ai-command.js:369:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
public/control-center/pages/ai-command.js:370:	{ id: "execute", title: "Execute", description: "Execution stays gated in backend-owned surfaces." },
public/control-center/pages/ai-command.js:371:	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
public/control-center/pages/ai-command.js:375:	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
public/control-center/pages/ai-command.js:376:	{ id: "task", label: "Task", helper: "Task-shaped output" },
public/control-center/pages/ai-command.js:377:	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
public/control-center/pages/ai-command.js:378:	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
public/control-center/pages/ai-command.js:379:	{ id: "export", label: "Export", helper: "File-ready package" }
public/control-center/pages/ai-command.js:407:		label: "Admin / Governance",
public/control-center/pages/ai-command.js:413:		label: "Researcher",
public/control-center/pages/ai-command.js:419:		label: "Automation Architect",
public/control-center/pages/ai-command.js:428:		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
public/control-center/pages/ai-command.js:429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
public/control-center/pages/ai-command.js:430:		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
public/control-center/pages/ai-command.js:431:		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
public/control-center/pages/ai-command.js:434:		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
public/control-center/pages/ai-command.js:435:		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
public/control-center/pages/ai-command.js:436:		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
public/control-center/pages/ai-command.js:437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
public/control-center/pages/ai-command.js:440:		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
public/control-center/pages/ai-command.js:441:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
public/control-center/pages/ai-command.js:442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
public/control-center/pages/ai-command.js:443:		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
public/control-center/pages/ai-command.js:444:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
public/control-center/pages/ai-command.js:447:		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
public/control-center/pages/ai-command.js:448:		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
public/control-center/pages/ai-command.js:449:		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
public/control-center/pages/ai-command.js:450:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
public/control-center/pages/ai-command.js:451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
public/control-center/pages/ai-command.js:454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
public/control-center/pages/ai-command.js:457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
public/control-center/pages/ai-command.js:458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:461:		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
public/control-center/pages/ai-command.js:462:		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
public/control-center/pages/ai-command.js:463:		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
public/control-center/pages/ai-command.js:464:		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
public/control-center/pages/ai-command.js:465:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
public/control-center/pages/ai-command.js:468:		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
public/control-center/pages/ai-command.js:469:		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
public/control-center/pages/ai-command.js:470:		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
public/control-center/pages/ai-command.js:471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
public/control-center/pages/ai-command.js:472:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
public/control-center/pages/ai-command.js:477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
public/control-center/pages/ai-command.js:478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
public/control-center/pages/ai-command.js:479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
public/control-center/pages/ai-command.js:483:		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
public/control-center/pages/ai-command.js:484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
public/control-center/pages/ai-command.js:485:		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
public/control-center/pages/ai-command.js:486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
public/control-center/pages/ai-command.js:493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
public/control-center/pages/ai-command.js:494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
public/control-center/pages/ai-command.js:495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
public/control-center/pages/ai-command.js:501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
public/control-center/pages/ai-command.js:504:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
public/control-center/pages/ai-command.js:505:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
public/control-center/pages/ai-command.js:506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
public/control-center/pages/ai-command.js:512:	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
public/control-center/pages/ai-command.js:513:	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
public/control-center/pages/ai-command.js:514:	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
public/control-center/pages/ai-command.js:515:	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
public/control-center/pages/ai-command.js:522:	{ id: "strategy", label: "Strategy" },
public/control-center/pages/ai-command.js:523:	{ id: "content", label: "Content" },
public/control-center/pages/ai-command.js:524:	{ id: "campaign", label: "Campaign" },
public/control-center/pages/ai-command.js:525:	{ id: "integration", label: "Integration" },
public/control-center/pages/ai-command.js:526:	{ id: "asset", label: "Asset" },
public/control-center/pages/ai-command.js:527:	{ id: "research", label: "Research" },
public/control-center/pages/ai-command.js:528:	{ id: "report", label: "Report" },
public/control-center/pages/ai-command.js:529:	{ id: "automation", label: "Automation" }
public/control-center/pages/ai-command.js:533:	{ id: "current-project", label: "Current project" },
public/control-center/pages/ai-command.js:534:	{ id: "selected-context", label: "Selected page/context" },
public/control-center/pages/ai-command.js:535:	{ id: "campaign", label: "Campaign" },
public/control-center/pages/ai-command.js:536:	{ id: "product", label: "Product" }
public/control-center/pages/ai-command.js:550:		id: "strategist",
public/control-center/pages/ai-command.js:557:		id: "writer",
public/control-center/pages/ai-command.js:564:		id: "designer",
public/control-center/pages/ai-command.js:571:		id: "media",
public/control-center/pages/ai-command.js:578:		id: "ads",
public/control-center/pages/ai-command.js:585:		id: "analyst",
public/control-center/pages/ai-command.js:592:		id: "researcher",
public/control-center/pages/ai-command.js:599:		id: "operations",
public/control-center/pages/ai-command.js:657:				title: "AI command auto plan"
public/control-center/pages/ai-command.js:936:			modeId: "operations",
public/control-center/pages/ai-command.js:964:			lastAppliedHandoffId: "",
public/control-center/pages/ai-command.js:976:                        activeChatSessionId: "",
public/control-center/pages/ai-command.js:1133:                title: titleSeed.slice(0, 80) || "AI Team session",
public/control-center/pages/ai-command.js:1386:		title: "Draft output",
public/control-center/pages/ai-command.js:1395:		safetyLabel: "Guidance and draft only. No backend execution.",
public/control-center/pages/ai-command.js:1404:				title: `Task: Strategic plan for ${projectName || "current project"}`,
public/control-center/pages/ai-command.js:1417:			title: `Strategist Guidance: Next operating move`,
public/control-center/pages/ai-command.js:1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
public/control-center/pages/ai-command.js:1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
public/control-center/pages/ai-command.js:1465:			title: "Media Brief: Visual direction draft",
public/control-center/pages/ai-command.js:1476:			safetyLabel: "No media generation executed. Brief and routing only.",
public/control-center/pages/ai-command.js:1484:			title: outputType === "task" ? "Task: Video production plan" : "Video Brief: Hook, script, storyboard",
public/control-center/pages/ai-command.js:1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
public/control-center/pages/ai-command.js:1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
public/control-center/pages/ai-command.js:1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
public/control-center/pages/ai-command.js:1519:			title: outputType === "task" ? "Task: Paid test plan" : "Ads Draft: Angles and tests",
public/control-center/pages/ai-command.js:1540:			safetyLabel: "No budget updates or ad launches executed."
public/control-center/pages/ai-command.js:1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
public/control-center/pages/ai-command.js:1554:			safetyLabel: "No analytics mutation or fake metrics. Guidance only."
public/control-center/pages/ai-command.js:1561:			title: "Compliance Draft: Risk review checklist",
public/control-center/pages/ai-command.js:1570:			safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."
public/control-center/pages/ai-command.js:1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
public/control-center/pages/ai-command.js:1601:			safetyLabel: "No reply sent, ticket created, SLA changed, or escalation triggered."
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1646:				title: "Workflow: Operating sequence",
public/control-center/pages/ai-command.js:1654:				safetyLabel: "Workflow run is not started. This is a draft preview only."
public/control-center/pages/ai-command.js:1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
public/control-center/pages/ai-command.js:1667:			safetyLabel: "No workflow run and no backend task creation executed."
public/control-center/pages/ai-command.js:1677:		? { id: "operations", label: "Full Team" }
public/control-center/pages/ai-command.js:1699:		specialistId: "team",
public/control-center/pages/ai-command.js:1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
public/control-center/pages/ai-command.js:1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
public/control-center/pages/ai-command.js:1741:		`Title: ${humanizeValue(output.title)}`,
public/control-center/pages/ai-command.js:1808:                blocks.push({ label: "Main output", items: mainLines });
public/control-center/pages/ai-command.js:1815:                blocks.push({ label: "Details", items: bullets });
public/control-center/pages/ai-command.js:1822:                blocks.push({ label: "Next steps", items: steps, ordered: true });
public/control-center/pages/ai-command.js:1824:                blocks.push({ label: "Next step", items: [compactPreviewText(preview.nextStep, 280)] });
public/control-center/pages/ai-command.js:2032:		title: "Project status briefing",
public/control-center/pages/ai-command.js:2062:		title: "Content intelligence briefing",
public/control-center/pages/ai-command.js:2098:		title: "SEO & traffic briefing",
public/control-center/pages/ai-command.js:2133:		title: "Paid performance briefing",
public/control-center/pages/ai-command.js:2164:		title: "Research & evidence briefing",
public/control-center/pages/ai-command.js:2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
public/control-center/pages/ai-command.js:2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
public/control-center/pages/ai-command.js:2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
public/control-center/pages/ai-command.js:2206:		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
public/control-center/pages/ai-command.js:2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and review the first step in the owning workspace."] };
public/control-center/pages/ai-command.js:2224:		title: "Operations routing brief",
public/control-center/pages/ai-command.js:2337:		lastResponseTitle: asString(response?.title),
public/control-center/pages/ai-command.js:2513:		title: firstAiInboundText(preview.title, normalized.title, `Inbound handoff from ${normalized.sourceLabel}`),
public/control-center/pages/ai-command.js:2652:		title: normalized.title,
public/control-center/pages/ai-command.js:2675:		lastResponseTitle: normalized.title,
public/control-center/pages/ai-command.js:2737:			title: "Command failed",
public/control-center/pages/ai-command.js:2774:		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
public/control-center/pages/ai-command.js:3217:			title: humanizeValue(msg.response?.title, "Artifact"),
public/control-center/pages/ai-command.js:3289:                ? { id: "team", label: "Full Team" }
public/control-center/pages/ai-command.js:3406:			title: "Close critical readiness gaps before scale",
public/control-center/pages/ai-command.js:3415:			title: "Resolve asset blockers for execution flow",
public/control-center/pages/ai-command.js:3425:			title: "Repair integration coverage for stronger AI output",
public/control-center/pages/ai-command.js:3434:			title: "Define the active campaign operating plan",
public/control-center/pages/ai-command.js:3442:		title: "Generate next content wave from current signals",
public/control-center/pages/ai-command.js:3784:                ? { label: "Full AI Team" }
public/control-center/pages/ai-command.js:3876:		{ id: "chat", label: "Chat", hint: bridgeStatus.available ? "Connected" : "Guarded" },
public/control-center/pages/ai-command.js:3877:		{ id: "preview", label: "Preview", hint: "Draft output" },
public/control-center/pages/ai-command.js:3878:		{ id: "tools", label: "Tools", hint: "Role actions" },
public/control-center/pages/ai-command.js:3879:		{ id: "context", label: "Context", hint: "Live state" },
public/control-center/pages/ai-command.js:3880:		{ id: "history", label: "History", hint: "Saved outputs" }
public/control-center/pages/ai-command.js:3962:		{ label: "Read preview", value: "Ready", className: "is-available" },
public/control-center/pages/ai-command.js:3963:		{ label: "Voice input", value: "Coming", className: "is-planned" },
public/control-center/pages/ai-command.js:3964:		{ label: "Team chat", value: bridgeStatus.available ? "Ready" : "Coming", className: bridgeStatus.available ? "is-available" : "is-planned" },
public/control-center/pages/ai-command.js:3965:		{ label: "Media gen", value: "Coming", className: "is-planned" },
public/control-center/pages/ai-command.js:3966:		{ label: "GPU video", value: "Coming", className: "is-planned" },
public/control-center/pages/ai-command.js:3967:		{ label: "Image prompt generation", value: providerConfigured ? "Provider may be ready" : "Provider dependent", className: providerConfigured ? "is-available" : "is-planned" }
public/control-center/pages/ai-command.js:4059:		? { id: "team", label: "Full Team" }
public/control-center/pages/ai-command.js:4142:		? { id: "team", label: "Full Team" }
public/control-center/pages/ai-command.js:4294:        const selectedSpec = isTeam ? { id: "team", label: "Full Team", position: "Team workflow" } : getPhase1SpecialistById(session.modeId);
public/control-center/pages/ai-command.js:4378:                                specialistLabel: "You",
public/control-center/pages/ai-command.js:4535:	const specialist = session.teamMode === "team" ? { label: "Full Team" } : getPhase1SpecialistById(session.modeId);
public/control-center/pages/ai-command.js:4539:		{ label: "Project", value: projectName || "Not selected", present: Boolean(projectName) },
public/control-center/pages/ai-command.js:4540:		{ label: "Specialist", value: specialist.label || "Specialist", present: true },
public/control-center/pages/ai-command.js:4541:		{ label: "Market", value: languagePlan.market, present: true },
public/control-center/pages/ai-command.js:4542:		{ label: "Conversation language", value: languagePlan.conversationLanguage, present: true },
public/control-center/pages/ai-command.js:4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
public/control-center/pages/ai-command.js:4544:		{ label: "Mode", value: session.teamMode === "team" ? "Full Team" : "Solo Specialist", present: true },
public/control-center/pages/ai-command.js:4545:		{ label: "Destination", value: destination, present: Boolean(destination) },
public/control-center/pages/ai-command.js:4546:		{ label: "Session state", value: sessionState, present: true },
public/control-center/pages/ai-command.js:4547:		{ label: "Readiness", value: readiness != null ? `${readiness}/100` : "No readiness data", present: readiness != null },
public/control-center/pages/ai-command.js:4548:		{ label: "Integrations", value: aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal} connected` : "No coverage data", present: aiContext.coveredCount > 0 },
public/control-center/pages/ai-command.js:4549:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
public/control-center/pages/ai-command.js:4550:		{ label: "Operations", value: state.data.operations ? "Snapshot available" : "No operations snapshot", present: Boolean(state.data.operations) }
public/control-center/pages/ai-command.js:4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
public/control-center/pages/ai-command.js:4555:			{ label: "Tickets", value: "Draft / monitored in Operations", present: true, scoped: true },
public/control-center/pages/ai-command.js:4556:			{ label: "SLA", value: "Safe review only", present: true, scoped: true },
public/control-center/pages/ai-command.js:4557:			{ label: "Escalations", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4558:			{ label: "Channels", value: "Managed in Integrations", present: true, scoped: true }
public/control-center/pages/ai-command.js:4562:				{ label: "Leads", value: "Discovery / qualification", present: true, scoped: true },
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4564:				{ label: "Outreach", value: "Draft only", present: true, scoped: true },
public/control-center/pages/ai-command.js:4565:				{ label: "Follow-ups", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4566:				{ label: "Pipeline", value: "Operations handoff", present: true, scoped: true }
public/control-center/pages/ai-command.js:4623:			title: item.responseTitle || item.specialistLabel || "Specialist response",
public/control-center/pages/ai-command.js:4629:			title: preview.title || "Draft preview",
public/control-center/pages/ai-command.js:4661:	id: "ai-command",
public/control-center/pages/ai-command.js:4665:		title: "AI Workspace",
public/control-center/pages/ai-command.js:4852:		                saveAiChatSession(sessionKey, session, { title: "Previous AI Team session" });
public/control-center/pages/ai-command.js:5065:		                        ? { id: "team", label: "Full Team" }
public/control-center/pages/ai-command.js:5073:		                        specialistLabel: "You",
public/control-center/pages/ai-command.js:5162:                                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5173:		                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5478:					lastResponseTitle: latestResponse.responseTitle || "Generated specialist response",
public/control-center/pages/ai-command.js:5493:							title: latestResponse.responseTitle,
public/control-center/pages/ai-command.js:5584:							lastResponseTitle: output.title || "",
public/control-center/pages/library.js:90:  { key: "logos", label: "Logos", types: ["logo"] },
public/control-center/pages/library.js:91:  { key: "product_images", label: "Product Images", types: ["product_photos", "packaging_images"] },
public/control-center/pages/library.js:92:  { key: "videos", label: "Videos", types: ["product_videos"] },
public/control-center/pages/library.js:93:  { key: "documents", label: "Documents", types: ["brand_guideline", "partner_docs", "testimonials_reviews", "certificates"] },
public/control-center/pages/library.js:94:  { key: "legal", label: "Legal", types: ["legal_doc"] },
public/control-center/pages/library.js:95:  { key: "pricing", label: "Pricing", types: ["pricing_doc", "product_csv"] },
public/control-center/pages/library.js:96:  { key: "campaign_materials", label: "Campaign Materials", types: ["social_assets", "campaign_assets"] }
public/control-center/pages/library.js:102:    label: "Logos",
public/control-center/pages/library.js:109:    label: "Brand Guidelines",
public/control-center/pages/library.js:116:    label: "Product CSV / Product Data",
public/control-center/pages/library.js:123:    label: "Product Images",
public/control-center/pages/library.js:130:    label: "Videos",
public/control-center/pages/library.js:137:    label: "Legal / Pricing Documents",
public/control-center/pages/library.js:144:    label: "Research Documents",
public/control-center/pages/library.js:152:  { key: "all_assets", label: "All Assets" },
public/control-center/pages/library.js:153:  { key: "logos", label: "Logos", types: ["logo"] },
public/control-center/pages/library.js:154:  { key: "product_data", label: "Product Data", types: ["product_csv"] },
public/control-center/pages/library.js:155:  { key: "product_images", label: "Product Images", types: ["product_photos"] },
public/control-center/pages/library.js:156:  { key: "packaging_images", label: "Packaging Images", types: ["packaging_images"] },
public/control-center/pages/library.js:157:  { key: "videos", label: "Videos", types: ["product_videos"] },
public/control-center/pages/library.js:158:  { key: "legal_pricing", label: "Legal & Pricing", types: ["legal_doc", "pricing_doc"] },
public/control-center/pages/library.js:159:  { key: "brand_guidelines", label: "Brand Guidelines", types: ["brand_guideline"] },
public/control-center/pages/library.js:160:  { key: "research_certificates", label: "Research / Certificates", types: ["partner_docs", "testimonials_reviews", "certificates"] },
public/control-center/pages/library.js:161:  { key: "uploaded_session", label: "Uploaded This Session" },
public/control-center/pages/library.js:162:  { key: "source_of_truth", label: "Source of Truth" },
public/control-center/pages/library.js:163:  { key: "archived", label: "Archived" }
public/control-center/pages/library.js:555:      selectedAssetId: "",
public/control-center/pages/library.js:804:    category_label: "Media Studio Generated",
public/control-center/pages/library.js:1584:    { value: "all", label: "All types" },
public/control-center/pages/library.js:1592:    { value: "all", label: "All sources" },
public/control-center/pages/library.js:1593:    { value: "media-studio", label: "Media Studio" },
public/control-center/pages/library.js:1594:    { value: "generated-media", label: "Generated Media" },
public/control-center/pages/library.js:1595:    { value: "publishing-ready", label: "Publishing Ready" }
public/control-center/pages/library.js:2885:  id: "library",
public/control-center/pages/library.js:2889:    title: "Library",
public/control-center/pages/library.js:2917:          title: "Choose source for AI Command",
public/control-center/pages/library.js:2923:            { id: "back-to-ai-command", label: "Back to Drawer" },
public/control-center/pages/library.js:2924:            { id: "dismiss-guide", label: "Dismiss" }
public/control-center/pages/home.js:168:    { id: "strategist", name: "Strategist", fallback: "Align campaign priorities and launch sequencing." },
public/control-center/pages/home.js:169:    { id: "writer", name: "Content Writer", fallback: "Prepare high-conversion messaging for active channels." },
public/control-center/pages/home.js:170:    { id: "designer", name: "Media Director", fallback: "Polish visual direction and creative consistency." },
public/control-center/pages/home.js:171:    { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
public/control-center/pages/home.js:172:    { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
public/control-center/pages/home.js:173:    { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
public/control-center/pages/home.js:174:    { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
public/control-center/pages/home.js:175:    { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
public/control-center/pages/home.js:176:    { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
public/control-center/pages/home.js:410:      title: `${humanizeStatus(item?.channel, "Channel")} • ${humanizeStatus(item?.execution_status, "Unknown")}`,
public/control-center/pages/home.js:418:      title: `${humanizeStatus(item?.channel, "Channel")} • ${humanizeStatus(item?.status, "Scheduled")}`,
public/control-center/pages/home.js:426:      title: compact(item?.title || item?.summary || item?.kind, "Notification"),
public/control-center/pages/home.js:475:    secondaryActionLabel: "Review Setup Foundation",
public/control-center/pages/home.js:504:        title: "System Health",
public/control-center/pages/home.js:510:        title: "Project Readiness",
public/control-center/pages/home.js:516:        title: "Automation",
public/control-center/pages/home.js:522:        title: "Intelligence",
public/control-center/pages/home.js:528:        title: "Active Campaign",
public/control-center/pages/home.js:537:        label: "Ready",
public/control-center/pages/home.js:543:        label: "Missing",
public/control-center/pages/home.js:549:        label: "Failed",
public/control-center/pages/home.js:555:        label: "Needs Attention",
public/control-center/pages/home.js:561:        label: "Completed",
public/control-center/pages/home.js:567:        label: "Next Step",
public/control-center/pages/home.js:644:  id: "home",
public/control-center/pages/home.js:648:    title: "Executive Command Center",
public/control-center/pages/home.js:667:      { title: "Integrations", items: dashboard.blockers.integrations, tone: "warning" },
public/control-center/pages/home.js:668:      { title: "Assets", items: dashboard.blockers.assets, tone: "warning" },
public/control-center/pages/home.js:669:      { title: "Failed Jobs", items: dashboard.blockers.failedJobs, tone: "danger" },
public/control-center/pages/home.js:670:      { title: "Readiness Gaps", items: dashboard.blockers.readinessGaps, tone: "warning" }
public/control-center/pages/home.js:976:                    id: "pending-approvals",
public/control-center/pages/insights.js:5:    id: "facebook",
public/control-center/pages/insights.js:6:    label: "Facebook",
public/control-center/pages/insights.js:9:    emptyTitle: "No Facebook insight feed yet"
public/control-center/pages/insights.js:12:    id: "instagram",
public/control-center/pages/insights.js:13:    label: "Instagram",
public/control-center/pages/insights.js:16:    emptyTitle: "No Instagram insight feed yet"
public/control-center/pages/insights.js:19:    id: "tiktok",
public/control-center/pages/insights.js:20:    label: "TikTok",
public/control-center/pages/insights.js:23:    emptyTitle: "No TikTok insight feed yet"
public/control-center/pages/insights.js:26:    id: "youtube",
public/control-center/pages/insights.js:27:    label: "YouTube",
public/control-center/pages/insights.js:30:    emptyTitle: "No YouTube insight feed yet"
public/control-center/pages/insights.js:33:    id: "website",
public/control-center/pages/insights.js:34:    label: "Website",
public/control-center/pages/insights.js:37:    emptyTitle: "No website analytics feed yet"
public/control-center/pages/insights.js:40:    id: "seo",
public/control-center/pages/insights.js:41:    label: "SEO / Search",
public/control-center/pages/insights.js:44:    emptyTitle: "No Search Console feed yet"
public/control-center/pages/insights.js:47:    id: "paid",
public/control-center/pages/insights.js:48:    label: "Paid Ads",
public/control-center/pages/insights.js:51:    emptyTitle: "No paid performance feed yet"
public/control-center/pages/insights.js:421:        label: "Total reach",
public/control-center/pages/insights.js:426:        label: "Total engagement",
public/control-center/pages/insights.js:431:        label: "Total clicks",
public/control-center/pages/insights.js:436:        label: "Total conversions",
public/control-center/pages/insights.js:441:        label: "Attributed value",
public/control-center/pages/insights.js:446:        label: "Total spend",
public/control-center/pages/insights.js:451:        label: "Overall ROAS",
public/control-center/pages/insights.js:456:        label: "SEO visibility",
public/control-center/pages/insights.js:526:      title: item.label,
public/control-center/pages/insights.js:543:      title: item.label,
public/control-center/pages/insights.js:649:      title: "Best hooks",
public/control-center/pages/insights.js:653:      title: "Best content formats",
public/control-center/pages/insights.js:657:      title: "Best channels",
public/control-center/pages/insights.js:661:      title: "Best posting windows",
public/control-center/pages/insights.js:665:      title: "Strongest CTA pattern",
public/control-center/pages/insights.js:669:      title: "Weak patterns to avoid",
public/control-center/pages/insights.js:700:      title: "Connect live platform insight feeds",
public/control-center/pages/insights.js:708:      title: "Rewrite or repurpose weak content",
public/control-center/pages/insights.js:716:      title: "Scale what is already working",
public/control-center/pages/insights.js:724:      title: "Activate website and GA4 intelligence",
public/control-center/pages/insights.js:732:      title: "Activate Search Console intelligence",
public/control-center/pages/insights.js:740:      title: "Activate paid campaign intelligence",
public/control-center/pages/insights.js:748:      title: "Insight Engine is ready for deeper optimization",
public/control-center/pages/insights.js:756:      label: "What should we improve next?",
public/control-center/pages/insights.js:760:      label: "Which platform is strongest?",
public/control-center/pages/insights.js:764:      label: "Which posts should we repurpose?",
public/control-center/pages/insights.js:768:      label: "What SEO opportunities are most valuable?",
public/control-center/pages/insights.js:772:      label: "What weak content should be rewritten?",
public/control-center/pages/insights.js:776:      label: "What winning pattern should we scale?",
public/control-center/pages/insights.js:1028:  id: "insights",
public/control-center/pages/insights.js:1032:    title: "Insights",
public/control-center/pages/insights.js:1096:        title: "Website",
public/control-center/pages/insights.js:1100:          { label: "Sessions", value: formatCompact(websiteIntel.summary.sessions) },
public/control-center/pages/insights.js:1101:          { label: "Conversions", value: formatCompact(websiteIntel.summary.conversions) }
public/control-center/pages/insights.js:1106:        title: "SEO / Search",
public/control-center/pages/insights.js:1110:          { label: "Clicks", value: formatCompact(seoIntel.summary.clicks) },
public/control-center/pages/insights.js:1111:          { label: "CTR", value: formatPercent(seoIntel.summary.ctr, 2) }
public/control-center/pages/insights.js:1116:        title: "Paid Media",
public/control-center/pages/insights.js:1120:          { label: "Spend", value: formatCurrency(paidIntel.summary.spend, currency) },
public/control-center/pages/insights.js:1121:          { label: "ROAS", value: paidIntel.summary.roas == null ? "--" : `${paidIntel.summary.roas.toFixed(2)}x` }
public/control-center/pages/content-studio-workspace.js:63:    id: "content-strategist",
public/control-center/pages/content-studio-workspace.js:64:    title: "Content Strategist",
public/control-center/pages/content-studio-workspace.js:70:    id: "copywriter",
public/control-center/pages/content-studio-workspace.js:71:    title: "Copywriter",
public/control-center/pages/content-studio-workspace.js:77:    id: "seo-writer",
public/control-center/pages/content-studio-workspace.js:78:    title: "SEO Writer",
public/control-center/pages/content-studio-workspace.js:84:    id: "social-writer",
public/control-center/pages/content-studio-workspace.js:85:    title: "Social Media Writer",
public/control-center/pages/content-studio-workspace.js:91:    id: "email-writer",
public/control-center/pages/content-studio-workspace.js:92:    title: "Email Writer",
public/control-center/pages/content-studio-workspace.js:98:    id: "script-writer",
public/control-center/pages/content-studio-workspace.js:99:    title: "Script Writer",
public/control-center/pages/content-studio-workspace.js:105:    id: "marketplace-copywriter",
public/control-center/pages/content-studio-workspace.js:106:    title: "Marketplace Copywriter",
public/control-center/pages/content-studio-workspace.js:112:    id: "brand-guardian",
public/control-center/pages/content-studio-workspace.js:113:    title: "Brand Guardian",
public/control-center/pages/content-studio-workspace.js:224:    title: "",
public/control-center/pages/content-studio-workspace.js:361:    id: "v1",
public/control-center/pages/content-studio-workspace.js:481:    title: firstText(raw.title, `${modeLabel(mode)} draft`),
public/control-center/pages/content-studio-workspace.js:543:      selectedId: "",
public/control-center/pages/content-studio-workspace.js:544:      formSourceId: "",
public/control-center/pages/content-studio-workspace.js:549:      loadedHandoffId: "",
public/control-center/pages/content-studio-workspace.js:574:    title: item.title || "",
public/control-center/pages/content-studio-workspace.js:635:    title: firstText(session.form.title, `${modeLabel(session.form.mode)} for ${session.form.campaign || session.form.project || "campaign"}`),
public/control-center/pages/content-studio-workspace.js:741:    title: firstText(payload.title, output.title, selectedVersion.title),
public/control-center/pages/content-studio-workspace.js:1275:      <div class="section"><strong>Title:</strong> ${escapeHtml(title)}</div>
public/control-center/pages/content-studio-workspace.js:1305:      <div class="segment"><strong>Title:</strong> ${escapeHtml(title)}</div>
public/control-center/pages/content-studio-workspace.js:1584:      title: firstText(selectedItem?.title, session.form.title, "Content handoff")
public/control-center/pages/content-studio-workspace.js:1720:        handoff_id: "",
public/control-center/pages/content-studio-workspace.js:1734:      handoff_id: "",
public/control-center/pages/content-studio-workspace.js:1853:        title: firstText(handoff.title, session.form.title),
public/control-center/pages/content-studio-workspace.js:2036:        modeId: "content",
public/control-center/pages/content-studio-workspace.js:2038:        lastResponseTitle: firstText(selectedItem?.title, session.form.title, "Content Draft"),
public/control-center/pages/content-studio-workspace.js:2051:          title: firstText(selectedItem?.title, session.form.title),
public/control-center/pages/content-studio-workspace.js:2217:          modeId: "content",
public/control-center/pages/content-studio-workspace.js:2219:          lastResponseTitle: `${agent.title} Assist`,
public/control-center/pages/content-studio-workspace.js:2232:            title: `${agent.title} Assist`,
public/control-center/pages/content-studio-workspace.js:2248:  id: "content-studio",
public/control-center/pages/content-studio-workspace.js:2252:    title: "Content Studio",
public/control-center/pages/integrations/cards.js:140:    return { action: "select", label: "Open details" };
public/control-center/pages/integrations/cards.js:144:    return { action: "sync", label: "Run backend sync" };
public/control-center/pages/integrations/cards.js:155:    return { action: "connect", label: "Complete setup" };
public/control-center/pages/integrations/cards.js:158:  return { action: "connect", label: "Connect" };
public/control-center/pages/integrations/builders.js:24:      label: "Social Insights",
public/control-center/pages/integrations/builders.js:28:      label: "Paid Ads",
public/control-center/pages/integrations/builders.js:32:      label: "Website Analytics",
public/control-center/pages/integrations/builders.js:36:      label: "SEO / Search Console",
public/control-center/pages/integrations/builders.js:40:      label: "Commerce / Orders",
public/control-center/pages/integrations/builders.js:44:      label: "Email / CRM",
public/control-center/pages/integrations/builders.js:48:      label: "Automation",
public/control-center/pages/integrations/builders.js:89:      title: card.label,
public/control-center/pages/integrations/builders.js:113:      title: `Connect ${missingCritical[0].label} next`,
public/control-center/pages/integrations/builders.js:120:      title: `Repair ${reconnectNeeded[0].label}`,
public/control-center/pages/integrations/builders.js:127:      title: "Finish partially configured integrations",
public/control-center/pages/integrations/builders.js:134:      title: "Close data coverage gaps",
public/control-center/pages/integrations/builders.js:144:      title: "Integration layer is structurally healthy",
public/control-center/pages/integrations/builders.js:151:      label: "What should I connect next?",
public/control-center/pages/integrations/builders.js:155:      label: "Which integrations are critical before launch?",
public/control-center/pages/integrations/builders.js:159:      label: "Why is SEO intelligence incomplete?",
public/control-center/pages/integrations/builders.js:163:      label: "Which platform is blocking full attribution?",
public/control-center/pages/integrations/builders.js:167:      label: "What tools are needed for paid optimization?",
public/control-center/pages/integrations/builders.js:177:    label: "Sales",
public/control-center/pages/integrations/builders.js:182:    label: "Social",
public/control-center/pages/integrations/builders.js:187:    label: "Tracking",
public/control-center/pages/integrations/builders.js:192:    label: "Communication / CRM",
public/control-center/pages/integrations/builders.js:197:    label: "Additional Growth",
public/control-center/pages/integrations/builders.js:300:      title: card.label,
public/control-center/pages/integrations/builders.js:308:      title: card.label,
public/control-center/pages/integrations/builders.js:322:            title: card.label,
public/control-center/pages/integrations/builders.js:388:      title: String(item.title || item.summary || item.message || item.event || item.type || "Integration event"),
public/control-center/pages/integrations/builders.js:409:          title: `${card.label} sync checkpoint`,
public/control-center/pages/integrations/builders.js:420:          title: `${card.label} connection test`,
public/control-center/pages/integrations/builders.js:431:          title: `${card.label} history import`,
public/control-center/pages/integrations/builders.js:442:          title: `${card.label} needs repair`,
public/control-center/pages/integrations/builders.js:463:      id: "sales-channels",
public/control-center/pages/integrations/builders.js:464:      title: "Sales Channels",
public/control-center/pages/integrations/builders.js:469:      id: "social-channels",
public/control-center/pages/integrations/builders.js:470:      title: "Social Channels",
public/control-center/pages/integrations/builders.js:475:      id: "marketing-tracking-tools",
public/control-center/pages/integrations/builders.js:476:      title: "Marketing & Tracking Tools",
public/control-center/pages/integrations/builders.js:481:      id: "email-crm",
public/control-center/pages/integrations/builders.js:482:      title: "Email & CRM",
public/control-center/pages/integrations/builders.js:487:      id: "ai-automation-tools",
public/control-center/pages/integrations/builders.js:488:      title: "AI / Automation Tools",
public/control-center/pages/integrations/builders.js:692:    status_label: "Connected",
public/control-center/pages/integrations/builders.js:725:          domainTitle: domain.title
public/control-center/pages/integrations/drawer.js:57:      label: "Requirements",
public/control-center/pages/integrations/drawer.js:64:      label: "Validation",
public/control-center/pages/integrations/drawer.js:71:      label: "Actions",
public/control-center/pages/integrations/drawer.js:96:    return { action: "unavailable", label: "Unavailable" };
public/control-center/pages/integrations/drawer.js:100:    return { action: "manage", label: "Manage" };
public/control-center/pages/integrations/drawer.js:104:    return { action: "connect", label: "Complete setup" };
public/control-center/pages/integrations/drawer.js:108:    return { action: "reconnect", label: "Reconnect integration" };
public/control-center/pages/integrations/drawer.js:112:    return { action: "reconnect", label: "Repair integration connection" };
public/control-center/pages/integrations/drawer.js:115:  return { action: "connect", label: "Connect" };
public/control-center/pages/integrations/state.js:27:      selectedIntegrationId: "",
public/control-center/pages/integrations/state.js:31:      activeDrawerIntegrationId: "",
public/control-center/pages/integrations/state.js:33:      validationIntegrationId: "",
public/control-center/pages/governance.js:118:  if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
public/control-center/pages/governance.js:119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
public/control-center/pages/governance.js:120:  if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
public/control-center/pages/governance.js:121:  if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
public/control-center/pages/governance.js:122:  if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
public/control-center/pages/governance.js:123:  if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
public/control-center/pages/governance.js:124:  if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
public/control-center/pages/governance.js:125:  if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
public/control-center/pages/governance.js:538:    queue_title: item.title || "Approval item",
public/control-center/pages/governance.js:559:      queue_title: item.title || "Claim review item",
public/control-center/pages/governance.js:576:      queue_title: item.title || "Brand safety review",
public/control-center/pages/governance.js:593:      queue_title: item.title || "Publish guardrail",
public/control-center/pages/governance.js:608:    queue_title: item.title || "Escalation item",
public/control-center/pages/governance.js:625:      label: "Summarize governance state",
public/control-center/pages/governance.js:630:      label: "Review selected decision",
public/control-center/pages/governance.js:635:      label: "Find governance gaps",
public/control-center/pages/governance.js:1357:          title: `${button.getAttribute("data-title") || "Governance item"} approval`,
public/control-center/pages/governance.js:1461:  id: "governance",
public/control-center/pages/governance.js:1465:    title: "Governance",
public/control-center/pages/integrations.js:41:    id: "website-commerce",
public/control-center/pages/integrations.js:42:    title: "Website & Commerce",
public/control-center/pages/integrations.js:46:        id: "website",
public/control-center/pages/integrations.js:48:        label: "Website",
public/control-center/pages/integrations.js:58:          { key: "url", label: "Website URL", placeholder: "https://brand.com", required: true },
public/control-center/pages/integrations.js:59:          { key: "apiKey", label: "API key", placeholder: "Website API key", type: "password" },
public/control-center/pages/integrations.js:60:          { key: "webhookUrl", label: "Webhook URL", placeholder: "https://brand.com/webhooks/mh", required: false }
public/control-center/pages/integrations.js:64:        id: "woocommerce",
public/control-center/pages/integrations.js:66:        label: "WooCommerce",
public/control-center/pages/integrations.js:76:          { key: "storeUrl", label: "Store URL", placeholder: "https://brand.com", required: true },
public/control-center/pages/integrations.js:77:          { key: "consumerKey", label: "Consumer key", placeholder: "ck_...", type: "password" },
public/control-center/pages/integrations.js:78:          { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_...", type: "password" }
public/control-center/pages/integrations.js:82:        id: "shopify",
public/control-center/pages/integrations.js:84:        label: "Shopify",
public/control-center/pages/integrations.js:93:          { key: "storeDomain", label: "Store domain", placeholder: "brand.myshopify.com", required: true },
public/control-center/pages/integrations.js:94:          { key: "adminToken", label: "Admin token", placeholder: "shpat_...", type: "password" },
public/control-center/pages/integrations.js:95:          { key: "storeId", label: "Store ID", placeholder: "Shopify store ID" }
public/control-center/pages/integrations.js:99:        id: "amazon",
public/control-center/pages/integrations.js:103:        label: "Amazon",
public/control-center/pages/integrations.js:112:          { key: "merchantId", label: "Merchant ID", placeholder: "Amazon merchant ID", required: true },
public/control-center/pages/integrations.js:113:          { key: "sellerUrl", label: "Store URL", placeholder: "https://amazon.com/shops/brand" },
public/control-center/pages/integrations.js:114:          { key: "accessToken", label: "Access token", placeholder: "Amazon access token", type: "password" }
public/control-center/pages/integrations.js:118:        id: "ebay",
public/control-center/pages/integrations.js:120:        label: "eBay",
public/control-center/pages/integrations.js:129:          { key: "sellerId", label: "Seller ID", placeholder: "eBay seller ID", required: true },
public/control-center/pages/integrations.js:130:          { key: "storeUrl", label: "Store URL", placeholder: "https://ebay.com/usr/brand" },
public/control-center/pages/integrations.js:131:          { key: "accessToken", label: "Access token", placeholder: "eBay access token", type: "password" }
public/control-center/pages/integrations.js:137:    id: "social",
public/control-center/pages/integrations.js:138:    title: "Social Platforms",
public/control-center/pages/integrations.js:142:        id: "facebook",
public/control-center/pages/integrations.js:144:        label: "Facebook",
public/control-center/pages/integrations.js:154:          { key: "pageUrl", label: "Page URL", placeholder: "https://facebook.com/brand", required: true },
public/control-center/pages/integrations.js:155:          { key: "pageId", label: "Page ID", placeholder: "Facebook page ID", required: false },
public/control-center/pages/integrations.js:156:          { key: "accessToken", label: "Access token", placeholder: "Facebook access token", type: "password" }
public/control-center/pages/integrations.js:160:        id: "instagram",
public/control-center/pages/integrations.js:162:        label: "Instagram",
public/control-center/pages/integrations.js:172:          { key: "profileUrl", label: "Profile URL", placeholder: "https://instagram.com/brand", required: true },
public/control-center/pages/integrations.js:173:          { key: "businessAccountId", label: "Business account ID", placeholder: "Instagram business account ID" },
public/control-center/pages/integrations.js:174:          { key: "accessToken", label: "Access token", placeholder: "Instagram access token", type: "password" }
public/control-center/pages/integrations.js:178:        id: "tiktok",
public/control-center/pages/integrations.js:180:        label: "TikTok",
public/control-center/pages/integrations.js:190:          { key: "profileUrl", label: "Profile URL", placeholder: "https://tiktok.com/@brand", required: true },
public/control-center/pages/integrations.js:191:          { key: "accountId", label: "Account ID", placeholder: "TikTok business account ID" },
public/control-center/pages/integrations.js:192:          { key: "accessToken", label: "Access token", placeholder: "TikTok access token", type: "password" }
public/control-center/pages/integrations.js:196:        id: "youtube",
public/control-center/pages/integrations.js:198:        label: "YouTube",
public/control-center/pages/integrations.js:208:          { key: "channelUrl", label: "Channel URL", placeholder: "https://youtube.com/@brand", required: true },
public/control-center/pages/integrations.js:209:          { key: "channelId", label: "Channel ID", placeholder: "YouTube channel ID" },
public/control-center/pages/integrations.js:210:          { key: "accessToken", label: "Access token", placeholder: "YouTube OAuth token", type: "password" }
public/control-center/pages/integrations.js:214:        id: "linkedin",
public/control-center/pages/integrations.js:216:        label: "LinkedIn",
public/control-center/pages/integrations.js:225:          { key: "companyUrl", label: "Company URL", placeholder: "https://linkedin.com/company/brand", required: true },
public/control-center/pages/integrations.js:226:          { key: "companyId", label: "Company ID", placeholder: "LinkedIn company ID" },
public/control-center/pages/integrations.js:227:          { key: "accessToken", label: "Access token", placeholder: "LinkedIn OAuth token", type: "password" }
public/control-center/pages/integrations.js:233:    id: "analytics",
public/control-center/pages/integrations.js:234:    title: "Analytics & Tracking",
public/control-center/pages/integrations.js:238:        id: "ga4",
public/control-center/pages/integrations.js:240:        label: "Google Analytics / GA4",
public/control-center/pages/integrations.js:250:          { key: "propertyId", label: "GA4 property ID", placeholder: "GA4 property ID", required: true },
public/control-center/pages/integrations.js:251:          { key: "measurementId", label: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
public/control-center/pages/integrations.js:252:          { key: "accessToken", label: "Access token", placeholder: "GA4 access token", type: "password" }
public/control-center/pages/integrations.js:256:        id: "gtm",
public/control-center/pages/integrations.js:258:        label: "Google Tag Manager",
public/control-center/pages/integrations.js:267:          { key: "containerId", label: "Container ID", placeholder: "GTM-XXXXXXX", required: true },
public/control-center/pages/integrations.js:268:          { key: "workspaceId", label: "Workspace ID", placeholder: "GTM workspace ID" },
public/control-center/pages/integrations.js:269:          { key: "accessToken", label: "Access token", placeholder: "GTM access token", type: "password" }
public/control-center/pages/integrations.js:273:        id: "meta-pixel",
public/control-center/pages/integrations.js:275:        label: "Meta Pixel",
public/control-center/pages/integrations.js:284:          { key: "pixelId", label: "Pixel ID", placeholder: "Meta pixel ID", required: true },
public/control-center/pages/integrations.js:285:          { key: "adAccountId", label: "Ad account ID", placeholder: "act_123..." },
public/control-center/pages/integrations.js:286:          { key: "accessToken", label: "Access token", placeholder: "Meta access token", type: "password" }
public/control-center/pages/integrations.js:290:        id: "tiktok-pixel",
public/control-center/pages/integrations.js:292:        label: "TikTok Pixel",
public/control-center/pages/integrations.js:301:          { key: "pixelId", label: "Pixel ID", placeholder: "TikTok pixel ID", required: true },
public/control-center/pages/integrations.js:302:          { key: "accountId", label: "Account ID", placeholder: "TikTok Ads account ID" },
public/control-center/pages/integrations.js:303:          { key: "accessToken", label: "Access token", placeholder: "TikTok token", type: "password" }
public/control-center/pages/integrations.js:307:        id: "search-console",
public/control-center/pages/integrations.js:309:        label: "Search Console",
public/control-center/pages/integrations.js:319:          { key: "propertyUrl", label: "Property URL", placeholder: "https://brand.com", required: true },
public/control-center/pages/integrations.js:320:          { key: "siteDomain", label: "Domain property", placeholder: "sc-domain:brand.com" },
public/control-center/pages/integrations.js:321:          { key: "accessToken", label: "Access token", placeholder: "Search Console token", type: "password" }
public/control-center/pages/integrations.js:325:        id: "custom-analytics",
public/control-center/pages/integrations.js:327:        label: "Custom Analytics Endpoint",
public/control-center/pages/integrations.js:336:          { key: "endpointUrl", label: "Endpoint URL", placeholder: "https://api.brand.com/analytics", required: true },
public/control-center/pages/integrations.js:337:          { key: "clientId", label: "Client ID", placeholder: "Analytics client ID" },
public/control-center/pages/integrations.js:338:          { key: "accessToken", label: "Access token", placeholder: "API token", type: "password" }
public/control-center/pages/integrations.js:344:    id: "email-crm",
public/control-center/pages/integrations.js:345:    title: "Email & CRM",
public/control-center/pages/integrations.js:349:        id: "smtp",
public/control-center/pages/integrations.js:353:        label: "SMTP / Email Sending",
public/control-center/pages/integrations.js:363:          { key: "senderEmail", label: "Sender email", placeholder: "support@brand.com", required: true },
public/control-center/pages/integrations.js:364:          { key: "smtpHost", label: "SMTP host", placeholder: "smtp.provider.com", required: true },
public/control-center/pages/integrations.js:365:          { key: "smtpPort", label: "SMTP port", placeholder: "587" }
public/control-center/pages/integrations.js:369:        id: "mailer",
public/control-center/pages/integrations.js:373:        label: "Mailer Integration",
public/control-center/pages/integrations.js:382:          { key: "providerName", label: "Provider name", placeholder: "SendGrid / Mailgun / Resend", required: true },
public/control-center/pages/integrations.js:383:          { key: "apiKey", label: "API key", placeholder: "Mailer API key", type: "password" },
public/control-center/pages/integrations.js:384:          { key: "senderDomain", label: "Sender domain", placeholder: "brand.com" }
public/control-center/pages/integrations.js:388:        id: "mailchimp",
public/control-center/pages/integrations.js:390:        label: "Mailchimp",
public/control-center/pages/integrations.js:399:          { key: "audienceId", label: "Audience ID", placeholder: "Mailchimp audience ID", required: true },
public/control-center/pages/integrations.js:400:          { key: "apiKey", label: "API key", placeholder: "Mailchimp API key", type: "password" },
public/control-center/pages/integrations.js:401:          { key: "serverPrefix", label: "Server prefix", placeholder: "us1" }
public/control-center/pages/integrations.js:405:        id: "crm",
public/control-center/pages/integrations.js:409:        label: "CRM Integration",
public/control-center/pages/integrations.js:418:          { key: "workspaceId", label: "Workspace / account ID", placeholder: "CRM workspace ID", required: true },
public/control-center/pages/integrations.js:419:          { key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },
public/control-center/pages/integrations.js:420:          { key: "pipelineId", label: "Pipeline ID", placeholder: "Primary pipeline ID" }
public/control-center/pages/integrations.js:426:    id: "ads",
public/control-center/pages/integrations.js:427:    title: "Ads Platforms",
public/control-center/pages/integrations.js:431:        id: "meta-ads",
public/control-center/pages/integrations.js:433:        label: "Meta Ads",
public/control-center/pages/integrations.js:443:          { key: "adAccountId", label: "Ad account ID", placeholder: "act_123456789", required: true },
public/control-center/pages/integrations.js:444:          { key: "businessId", label: "Business ID", placeholder: "Meta business ID" },
public/control-center/pages/integrations.js:445:          { key: "accessToken", label: "Access token", placeholder: "Meta ads token", type: "password" }
public/control-center/pages/integrations.js:449:        id: "google-ads",
public/control-center/pages/integrations.js:451:        label: "Google Ads",
public/control-center/pages/integrations.js:461:          { key: "customerId", label: "Customer ID", placeholder: "123-456-7890", required: true },
public/control-center/pages/integrations.js:462:          { key: "managerId", label: "Manager / MCC ID", placeholder: "Google Ads MCC ID" },
public/control-center/pages/integrations.js:463:          { key: "refreshToken", label: "Refresh token", placeholder: "Google Ads refresh token", type: "password" }
public/control-center/pages/integrations.js:467:        id: "tiktok-ads",
public/control-center/pages/integrations.js:469:        label: "TikTok Ads",
public/control-center/pages/integrations.js:478:          { key: "advertiserId", label: "Advertiser ID", placeholder: "TikTok advertiser ID", required: true },
public/control-center/pages/integrations.js:479:          { key: "accountScope", label: "Account scope", placeholder: "Region / business scope" },
public/control-center/pages/integrations.js:480:          { key: "accessToken", label: "Access token", placeholder: "TikTok ads token", type: "password" }
public/control-center/pages/integrations.js:486:    id: "ops",
public/control-center/pages/integrations.js:487:    title: "AI / Automation / Ops Tools",
public/control-center/pages/integrations.js:491:        id: "google-drive",
public/control-center/pages/integrations.js:493:        label: "Google Drive",
public/control-center/pages/integrations.js:502:          { key: "folderId", label: "Folder ID", placeholder: "Google Drive folder ID", required: true },
public/control-center/pages/integrations.js:503:          { key: "workspaceEmail", label: "Workspace email", placeholder: "ops@brand.com" },
public/control-center/pages/integrations.js:504:          { key: "accessToken", label: "Access token", placeholder: "Drive OAuth token", type: "password" }
public/control-center/pages/integrations.js:508:        id: "slack",
public/control-center/pages/integrations.js:510:        label: "Slack",
public/control-center/pages/integrations.js:519:          { key: "workspaceId", label: "Workspace ID", placeholder: "Slack workspace ID", required: true },
public/control-center/pages/integrations.js:520:          { key: "channelId", label: "Channel ID", placeholder: "Channel ID for alerts" },
public/control-center/pages/integrations.js:521:          { key: "botToken", label: "Bot token", placeholder: "xoxb-...", type: "password" }
public/control-center/pages/integrations.js:525:        id: "telegram",
public/control-center/pages/integrations.js:527:        label: "Telegram",
public/control-center/pages/integrations.js:536:          { key: "botName", label: "Bot / workspace name", placeholder: "MH Assistant Ops Bot", required: true },
public/control-center/pages/integrations.js:537:          { key: "chatId", label: "Chat ID", placeholder: "Telegram chat ID" },
public/control-center/pages/integrations.js:538:          { key: "botToken", label: "Bot token", placeholder: "Telegram bot token", type: "password" }
public/control-center/pages/integrations.js:542:        id: "notion",
public/control-center/pages/integrations.js:544:        label: "Notion",
public/control-center/pages/integrations.js:553:          { key: "workspaceName", label: "Workspace name", placeholder: "Brand Ops Workspace", required: true },
public/control-center/pages/integrations.js:554:          { key: "databaseId", label: "Database ID", placeholder: "Primary Notion database ID" },
public/control-center/pages/integrations.js:555:          { key: "accessToken", label: "Integration token", placeholder: "Notion token", type: "password" }
public/control-center/pages/integrations.js:559:        id: "zapier-make",
public/control-center/pages/integrations.js:561:        label: "Zapier / Make",
public/control-center/pages/integrations.js:570:          { key: "endpointUrl", label: "Webhook / scenario URL", placeholder: "https://hooks.zapier.com/...", required: true },
public/control-center/pages/integrations.js:571:          { key: "workspaceId", label: "Workspace / scenario ID", placeholder: "Zap / Make scenario ID" },
public/control-center/pages/integrations.js:572:          { key: "secretKey", label: "Secret key", placeholder: "Automation secret", type: "password" }
public/control-center/pages/integrations.js:576:        id: "webhook",
public/control-center/pages/integrations.js:578:        label: "Internal Webhook",
public/control-center/pages/integrations.js:587:          { key: "webhookUrl", label: "Webhook URL", placeholder: "https://ops.brand.com/webhook", required: true },
public/control-center/pages/integrations.js:588:          { key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },
public/control-center/pages/integrations.js:589:          { key: "secretKey", label: "Secret key", placeholder: "Webhook secret", type: "password" }
public/control-center/pages/integrations.js:638:      domainTitle: domain.title
public/control-center/pages/integrations.js:652:      selectedIntegrationId: "",
public/control-center/pages/integrations.js:656:      activeDrawerIntegrationId: "",
public/control-center/pages/integrations.js:658:      drawerOriginIntegrationId: "",
public/control-center/pages/integrations.js:660:      restoreFocusIntegrationId: "",
public/control-center/pages/integrations.js:662:      validationIntegrationId: "",
public/control-center/pages/integrations.js:910:    return { action: "select", label: "Open setup" };
public/control-center/pages/integrations.js:913:    return { action: "sync", label: "Run backend sync" };
public/control-center/pages/integrations.js:1149:    return { label: "Open setup", action: "select" };
public/control-center/pages/integrations.js:1154:      label: "Run backend sync",
public/control-center/pages/integrations.js:1167:    return { label: "Complete setup", action: "select" };
public/control-center/pages/integrations.js:1170:  return { label: "Connect", action: "connect" };
public/control-center/pages/integrations.js:1557:  id: "integrations",
public/control-center/pages/integrations.js:1561:    title: "Integrations",
public/control-center/pages/setup.js:6:  { name: "project_name", label: "Project name" },
public/control-center/pages/setup.js:7:  { name: "project_type", label: "Project type" },
public/control-center/pages/setup.js:8:  { name: "website_url", label: "Website URL" },
public/control-center/pages/setup.js:9:  { name: "brand_promise", label: "Brand promise" },
public/control-center/pages/setup.js:10:  { name: "market", label: "Market" },
public/control-center/pages/setup.js:11:  { name: "language", label: "Language" },
public/control-center/pages/setup.js:12:  { name: "currency", label: "Currency" },
public/control-center/pages/setup.js:13:  { name: "audience_primary", label: "Primary audience" },
public/control-center/pages/setup.js:14:  { name: "primary_goal", label: "Primary goal" },
public/control-center/pages/setup.js:15:  { name: "competitors", label: "Competitors" },
public/control-center/pages/setup.js:16:  { name: "social_channels", label: "Channels" }
public/control-center/pages/setup.js:21:    id: "business-basics",
public/control-center/pages/setup.js:22:    title: "Business Basics",
public/control-center/pages/setup.js:27:    id: "brand-identity",
public/control-center/pages/setup.js:28:    title: "Brand Identity",
public/control-center/pages/setup.js:33:    id: "market-language",
public/control-center/pages/setup.js:34:    title: "Market & Language",
public/control-center/pages/setup.js:39:    id: "audience",
public/control-center/pages/setup.js:40:    title: "Audience",
public/control-center/pages/setup.js:45:    id: "goals",
public/control-center/pages/setup.js:46:    title: "Goals",
public/control-center/pages/setup.js:51:    id: "competitors",
public/control-center/pages/setup.js:52:    title: "Competitors",
public/control-center/pages/setup.js:57:    id: "channels",
public/control-center/pages/setup.js:58:    title: "Channels",
public/control-center/pages/setup.js:159:    return { tone: "success", label: "Validated" };
public/control-center/pages/setup.js:163:    return { tone: "warning", label: "Needs review" };
public/control-center/pages/setup.js:166:  return { tone: "neutral", label: "Partial" };
public/control-center/pages/setup.js:284:  if (complete === total) return { tone: "success", label: "Ready" };
public/control-center/pages/setup.js:285:  if (complete === 0) return { tone: "danger", label: "Missing" };
public/control-center/pages/setup.js:371:      label: "Launch readiness: strong"
public/control-center/pages/setup.js:689:    { id: "setupBusinessIdentityStatus", value: businessIdentityStatus },
public/control-center/pages/setup.js:690:    { id: "setupBrandStatus", value: brandStatus },
public/control-center/pages/setup.js:691:    { id: "setupLocalizationStatus", value: localizationStatus },
public/control-center/pages/setup.js:692:    { id: "setupChannelsStatus", value: channelsStatus },
public/control-center/pages/setup.js:693:    { id: "setupContentTruthStatus", value: contentTruthStatus },
public/control-center/pages/setup.js:694:    { id: "setupAiGuidanceStatus", value: aiGuidanceStatus }
public/control-center/pages/setup.js:1247:  { value: "ecommerce", label: "eCommerce / Products" },
public/control-center/pages/setup.js:1248:  { value: "artist_singer", label: "Artist / Singer" },
public/control-center/pages/setup.js:1249:  { value: "beauty_salon", label: "Beauty Salon" },
public/control-center/pages/setup.js:1250:  { value: "real_estate", label: "Real Estate" },
public/control-center/pages/setup.js:1251:  { value: "service_business", label: "Service Business" },
public/control-center/pages/setup.js:1252:  { value: "restaurant", label: "Restaurant / Cafe" },
public/control-center/pages/setup.js:1253:  { value: "agency", label: "Agency" },
public/control-center/pages/setup.js:1254:  { value: "local_business", label: "Local Business" }
public/control-center/pages/setup.js:1326:  id: "setup",
public/control-center/pages/setup.js:1330:    title: "Smart Guided Setup",
public/control-center/pages/setup.js:1500:                  ${renderField({ name: "project_name", label: "Project name", value: values.project_name, helper: "Canonical project identifier.", placeholder: "e.g. Hairotic Men", escapeHtml, required: true })}
public/control-center/pages/setup.js:1501:                  ${renderField({ name: "project_type", label: "Project type", value: values.project_type, helper: "Broad business model.", placeholder: "e.g. Ecommerce", escapeHtml, required: true })}
public/control-center/pages/setup.js:1502:                  ${renderField({ name: "website_url", label: "Website URL", value: values.website_url, helper: "Primary destination.", placeholder: "https://example.com", type: "url", escapeHtml, required: true })}
public/control-center/pages/setup.js:1503:                  ${renderField({ name: "launch_window", label: "Launch window", value: values.launch_window, helper: "Planned launch period.", placeholder: "Q3 2026", escapeHtml })}
public/control-center/pages/setup.js:1511:                  ${renderField({ name: "brand_name", label: "Brand / display name", value: values.brand_name, helper: "Public-facing brand name.", placeholder: "Brand name", escapeHtml })}
public/control-center/pages/setup.js:1512:                  ${renderField({ name: "brand_promise", label: "Brand promise", value: values.brand_promise, helper: "What value this brand consistently delivers.", placeholder: "Promise in one sentence", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1513:                  ${renderField({ name: "brand_voice", label: "Brand voice", value: values.brand_voice, helper: "Tone rules for AI and content teams.", placeholder: "Confident, clear, practical", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1514:                  ${renderField({ name: "offer_positioning", label: "Offer positioning", value: values.offer_positioning, helper: "How the offer should be framed.", placeholder: "Why this offer wins", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1515:                  ${renderField({ name: "visual_identity", label: "Visual identity", value: values.visual_identity, helper: "Visual guardrails and cues.", placeholder: "Photography style, color direction, layout cues", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1523:                  ${renderField({ name: "market", label: "Market", value: values.market, helper: "Primary region.", placeholder: "e.g. US", escapeHtml, required: true })}
public/control-center/pages/setup.js:1524:                  ${renderField({ name: "language", label: "Language", value: values.language, helper: "Primary content language.", placeholder: "e.g. English", escapeHtml, required: true })}
public/control-center/pages/setup.js:1525:                  ${renderField({ name: "currency", label: "Currency", value: values.currency, helper: "Commercial currency.", placeholder: "e.g. USD", escapeHtml, required: true })}
public/control-center/pages/setup.js:1533:                  ${renderField({ name: "audience_primary", label: "Primary audience", value: values.audience_primary, helper: "Main customer segment.", placeholder: "Who are we targeting?", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1534:                  ${renderField({ name: "audience_problem", label: "Audience problem", value: values.audience_problem, helper: "What problem they want solved.", placeholder: "Core pain point", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1535:                  ${renderField({ name: "audience_geography", label: "Audience geography", value: values.audience_geography, helper: "Geography details for this audience.", placeholder: "Countries or regions", escapeHtml })}
public/control-center/pages/setup.js:1543:                  ${renderField({ name: "primary_goal", label: "Primary goal", value: values.primary_goal, helper: "Main measurable objective.", placeholder: "Increase qualified sales", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1544:                  ${renderField({ name: "secondary_goal", label: "Secondary goal", value: values.secondary_goal, helper: "Supporting objective.", placeholder: "Optional secondary outcome", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1552:                  ${renderField({ name: "competitors", label: "Competitors", value: values.competitors, helper: "Comma-separated list.", placeholder: "Competitor A, Competitor B", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1553:                  ${renderField({ name: "differentiation", label: "Differentiation", value: values.differentiation, helper: "How this brand stands out.", placeholder: "Why customers choose us", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1561:                  ${renderField({ name: "social_channels", label: "Channels", value: values.social_channels, helper: "Comma-separated channels (e.g. Instagram, Email).", placeholder: "instagram, facebook, email", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1562:                  ${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}
public/control-center/pages/publishing.js:32:    { key: "draft", label: "Draft" },
public/control-center/pages/publishing.js:33:    { key: "source", label: "Source" },
public/control-center/pages/publishing.js:34:    { key: "package", label: "Package" },
public/control-center/pages/publishing.js:35:    { key: "approval", label: "Approval" },
public/control-center/pages/publishing.js:36:    { key: "schedule", label: "Schedule" },
public/control-center/pages/publishing.js:37:    { key: "handoff", label: "Manual Completion Handoff" }
public/control-center/pages/publishing.js:61:    { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
public/control-center/pages/publishing.js:62:    { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
public/control-center/pages/publishing.js:63:    { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
public/control-center/pages/publishing.js:64:    { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
public/control-center/pages/publishing.js:65:    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
public/control-center/pages/publishing.js:66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
public/control-center/pages/publishing.js:67:    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
public/control-center/pages/publishing.js:358:    title: "",
public/control-center/pages/publishing.js:367:      selectedId: "",
public/control-center/pages/publishing.js:370:      formSourceId: "",
public/control-center/pages/publishing.js:373:      loadedHandoffId: "",
public/control-center/pages/publishing.js:409:    title: firstText(raw.title, raw.name, preview.title, preview.headline),
public/control-center/pages/publishing.js:532:    title: item.title || "",
public/control-center/pages/publishing.js:580:        title: firstText(session.form.title, "Prepared publishing draft")
public/control-center/pages/publishing.js:945:    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
public/control-center/pages/publishing.js:1002:      focusId: "",
public/control-center/pages/publishing.js:1019:    focusId: "",
public/control-center/pages/publishing.js:1795:        title: firstText(summary.title, session.form.title),
public/control-center/pages/publishing.js:1816:        modeId: "operations",
public/control-center/pages/publishing.js:1818:        lastResponseTitle: current?.title || session.form.title || "Publishing Execution Review",
public/control-center/pages/publishing.js:1833:          publishing_title: current?.title || session.form.title || "",
public/control-center/pages/publishing.js:1909:  id: "publishing",
public/control-center/pages/publishing.js:1913:    title: "Publishing",
public/control-center/pages/workflows.js:31:    id: "launch-campaign",
public/control-center/pages/workflows.js:32:    title: "Launch Campaign",
public/control-center/pages/workflows.js:35:    aiModeId: "strategist",
public/control-center/pages/workflows.js:39:    id: "create-content-plan",
public/control-center/pages/workflows.js:40:    title: "Create Content Plan",
public/control-center/pages/workflows.js:43:    aiModeId: "writer",
public/control-center/pages/workflows.js:47:    id: "build-media-job",
public/control-center/pages/workflows.js:48:    title: "Build Media Job",
public/control-center/pages/workflows.js:51:    aiModeId: "media",
public/control-center/pages/workflows.js:55:    id: "prepare-publishing-package",
public/control-center/pages/workflows.js:56:    title: "Prepare Publishing Package",
public/control-center/pages/workflows.js:59:    aiModeId: "operations",
public/control-center/pages/workflows.js:63:    id: "generate-report",
public/control-center/pages/workflows.js:64:    title: "Generate Report",
public/control-center/pages/workflows.js:67:    aiModeId: "analyst",
public/control-center/pages/workflows.js:71:    id: "research-competitors",
public/control-center/pages/workflows.js:72:    title: "Research Competitors",
public/control-center/pages/workflows.js:75:    aiModeId: "researcher",
public/control-center/pages/workflows.js:79:    id: "fix-integrations",
public/control-center/pages/workflows.js:80:    title: "Fix Integrations",
public/control-center/pages/workflows.js:83:    aiModeId: "operations",
public/control-center/pages/workflows.js:214:    runId: "",
public/control-center/pages/workflows.js:325:      lastAppliedHandoffId: "",
public/control-center/pages/workflows.js:528:    title: `${workflow.title} review package`,
public/control-center/pages/workflows.js:544:        label: "Open AI Workspace",
public/control-center/pages/workflows.js:568:      title: `System intelligence: ${globalAction.title || mapped.title}`,
public/control-center/pages/workflows.js:577:      workflowId: "fix-integrations",
public/control-center/pages/workflows.js:578:      title: "Prepare Fix Integrations review next",
public/control-center/pages/workflows.js:587:      workflowId: "prepare-publishing-package",
public/control-center/pages/workflows.js:588:      title: "Prepare publishing package handoff before distribution",
public/control-center/pages/workflows.js:597:      workflowId: "launch-campaign",
public/control-center/pages/workflows.js:598:      title: "Define launch campaign workflow",
public/control-center/pages/workflows.js:608:    title: `Continue with ${selected.title}`,
public/control-center/pages/workflows.js:1077:    lastResponseTitle: asString(run.output?.title || workflow.title),
public/control-center/pages/workflows.js:1089:      workflow_title: workflow.title,
public/control-center/pages/workflows.js:1174:        title: workflow.title,
public/control-center/pages/workflows.js:1307:              lastResponseTitle: "Workflow seed"
public/control-center/pages/workflows.js:1386:        title: activeWorkflow.title,
public/control-center/pages/workflows.js:1429:        title: `${activeWorkflow.title} failed`,
public/control-center/pages/workflows.js:1550:        title: `${workflow.title} • ${inputs.campaign || inputs.project || projectName || "Project"}`,
public/control-center/pages/workflows.js:1555:          workflow_title: workflow.title,
public/control-center/pages/workflows.js:1589:        modeId: "operations",
public/control-center/pages/workflows.js:1591:        lastResponseTitle: "Workflow recommendation"
public/control-center/pages/workflows.js:1600:            modeId: "operations",
public/control-center/pages/workflows.js:1602:            lastResponseTitle: "Workflow recommendation"
public/control-center/pages/workflows.js:1625:        modeId: "operations",
public/control-center/pages/workflows.js:1627:        lastResponseTitle: "Custom workflow builder"
public/control-center/pages/workflows.js:1636:            modeId: "operations",
public/control-center/pages/workflows.js:1638:            lastResponseTitle: "Custom workflow builder"
public/control-center/pages/workflows.js:1770:  id: "workflows",
public/control-center/pages/workflows.js:1774:    title: "Workflows",
public/control-center/pages/workflows.js:1871:          title: "Select Template",
public/control-center/pages/workflows.js:1876:          title: "Complete Context",
public/control-center/pages/workflows.js:1881:          title: "Prepare Package",
public/control-center/pages/workflows.js:1886:          title: "Review with AI",
public/control-center/pages/workflows.js:1891:          title: "Create Task / Handoff",
public/control-center/pages/workflows.js:1896:          title: "Continue in Destination",
public/control-center/pages/workflows.js:1901:          title: "Track Result",
public/control-center/pages/workflows.js:2255:          lastResponseTitle: activeWorkflow.title,
public/control-center/pages/workflows.js:2258:              label: "Workflows",
public/control-center/pages/workflows.js:2304:            title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
public/control-center/pages/workflows.js:2309:              workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
public/control-center/pages/workflows.js:2330:              title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow task handoff"),
public/control-center/pages/workflows.js:2335:                workflow_title: asString(stateModel.selectedWorkflow?.name || stateModel.selectedWorkflow?.title || "Workflow"),
public/control-center/pages/settings.js:13:    label: "Planning Mode",
public/control-center/pages/settings.js:18:    label: "Guided Execution",
public/control-center/pages/settings.js:23:    label: "Semi-Auto",
public/control-center/pages/settings.js:28:    label: "Approval-First",
public/control-center/pages/settings.js:33:    label: "Full AI Assist",
public/control-center/pages/settings.js:38:    label: "Emergency Safe Mode",
public/control-center/pages/settings.js:67:    id: "strategist",
public/control-center/pages/settings.js:68:    label: "Strategist",
public/control-center/pages/settings.js:73:    id: "writer",
public/control-center/pages/settings.js:74:    label: "Writer",
public/control-center/pages/settings.js:79:    id: "designer",
public/control-center/pages/settings.js:80:    label: "Designer",
public/control-center/pages/settings.js:85:    id: "videoLead",
public/control-center/pages/settings.js:86:    label: "Video Lead",
public/control-center/pages/settings.js:91:    id: "publisher",
public/control-center/pages/settings.js:92:    label: "Publisher",
public/control-center/pages/settings.js:97:    id: "adsOperator",
public/control-center/pages/settings.js:98:    label: "Ads Operator",
public/control-center/pages/settings.js:103:    id: "analyst",
public/control-center/pages/settings.js:104:    label: "Analyst",
public/control-center/pages/settings.js:109:    id: "complianceReviewer",
public/control-center/pages/settings.js:110:    label: "Compliance Reviewer",
public/control-center/pages/settings.js:115:    id: "admin",
public/control-center/pages/settings.js:116:    label: "Admin",
public/control-center/pages/settings.js:124:    id: "project",
public/control-center/pages/settings.js:125:    title: "Project Settings",
public/control-center/pages/settings.js:127:    backendLabel: "Project profile fields are ready for backend save",
public/control-center/pages/settings.js:129:      { path: "project.projectName", label: "Project name", type: "text", critical: true, placeholder: "project-name" },
public/control-center/pages/settings.js:130:      { path: "project.brandName", label: "Brand name", type: "text", critical: true, placeholder: "Brand name" },
public/control-center/pages/settings.js:132:        path: "project.market",
public/control-center/pages/settings.js:133:        label: "Market",
public/control-center/pages/settings.js:139:        path: "project.language",
public/control-center/pages/settings.js:140:        label: "Language",
public/control-center/pages/settings.js:146:        path: "project.currency",
public/control-center/pages/settings.js:147:        label: "Currency",
public/control-center/pages/settings.js:153:        path: "project.timezone",
public/control-center/pages/settings.js:154:        label: "Timezone",
public/control-center/pages/settings.js:159:      { path: "project.website", label: "Website", type: "url", critical: true, placeholder: "https://brand.com" },
public/control-center/pages/settings.js:161:        path: "project.defaultCampaignMode",
public/control-center/pages/settings.js:162:        label: "Default campaign mode",
public/control-center/pages/settings.js:167:        path: "project.businessType",
public/control-center/pages/settings.js:168:        label: "Business type / project type",
public/control-center/pages/settings.js:176:    id: "operating",
public/control-center/pages/settings.js:177:    title: "Operating Modes",
public/control-center/pages/settings.js:179:    backendLabel: "Operating policy is active now and ready for backend persistence",
public/control-center/pages/settings.js:182:        path: "operating.primaryMode",
public/control-center/pages/settings.js:183:        label: "System operating mode",
public/control-center/pages/settings.js:189:        path: "operating.actionPolicy",
public/control-center/pages/settings.js:190:        label: "Action policy",
public/control-center/pages/settings.js:196:        path: "operating.emergencyOwner",
public/control-center/pages/settings.js:197:        label: "Emergency safe mode owner",
public/control-center/pages/settings.js:202:        path: "operating.modeNotes",
public/control-center/pages/settings.js:203:        label: "Operating notes",
public/control-center/pages/settings.js:210:    id: "ai",
public/control-center/pages/settings.js:211:    title: "AI Settings",
public/control-center/pages/settings.js:213:    backendLabel: "AI orchestration defaults are partially backend-ready",
public/control-center/pages/settings.js:216:        path: "ai.tone",
public/control-center/pages/settings.js:217:        label: "AI tone / brand tone",
public/control-center/pages/settings.js:223:        path: "ai.responseStyle",
public/control-center/pages/settings.js:224:        label: "Response style",
public/control-center/pages/settings.js:229:        path: "ai.generationStrictness",
public/control-center/pages/settings.js:230:        label: "Generation strictness",
public/control-center/pages/settings.js:236:        path: "ai.approvalRequiredMode",
public/control-center/pages/settings.js:237:        label: "Approval-required mode",
public/control-center/pages/settings.js:243:        path: "ai.creativitySafetyBalance",
public/control-center/pages/settings.js:244:        label: "AI creativity / safety balance",
public/control-center/pages/settings.js:249:        path: "ai.claimSafetyMode",
public/control-center/pages/settings.js:250:        label: "Claim safety mode",
public/control-center/pages/settings.js:256:        path: "ai.contentGenerationDefaults",
public/control-center/pages/settings.js:257:        label: "Content generation defaults",
public/control-center/pages/settings.js:262:        path: "ai.mediaGenerationDefaults",
public/control-center/pages/settings.js:263:        label: "Media generation defaults",
public/control-center/pages/settings.js:270:    id: "automation",
public/control-center/pages/settings.js:271:    title: "Automation Rules",
public/control-center/pages/settings.js:273:    backendLabel: "Automation routing rules sync into the durable governance policy",
public/control-center/pages/settings.js:276:        path: "automation.enabledRules",
public/control-center/pages/settings.js:277:        label: "Active automation rules",
public/control-center/pages/settings.js:283:        path: "automation.readinessThreshold",
public/control-center/pages/settings.js:284:        label: "Campaign readiness threshold",
public/control-center/pages/settings.js:289:        path: "automation.failurePolicy",
public/control-center/pages/settings.js:290:        label: "Automation failure policy",
public/control-center/pages/settings.js:295:        path: "automation.routingNotes",
public/control-center/pages/settings.js:296:        label: "Automation routing notes",
public/control-center/pages/settings.js:303:    id: "publishing",
public/control-center/pages/settings.js:304:    title: "Publishing Defaults",
public/control-center/pages/settings.js:306:    backendLabel: "Publishing defaults sync into the durable governance policy",
public/control-center/pages/settings.js:309:        path: "publishing.channels",
public/control-center/pages/settings.js:310:        label: "Default publishing channels",
public/control-center/pages/settings.js:316:        path: "publishing.schedulingBehavior",
public/control-center/pages/settings.js:317:        label: "Default scheduling behavior",
public/control-center/pages/settings.js:322:        path: "publishing.approvalBeforePublish",
public/control-center/pages/settings.js:323:        label: "Approval before publish",
public/control-center/pages/settings.js:327:        path: "publishing.namingConvention",
public/control-center/pages/settings.js:328:        label: "Naming conventions",
public/control-center/pages/settings.js:333:        path: "publishing.contentRouting",
public/control-center/pages/settings.js:334:        label: "Content routing defaults",
public/control-center/pages/settings.js:339:        path: "publishing.campaignOutputs",
public/control-center/pages/settings.js:340:        label: "Campaign output defaults",
public/control-center/pages/settings.js:347:    id: "approval",
public/control-center/pages/settings.js:348:    title: "Approval Rules",
public/control-center/pages/settings.js:350:    backendLabel: "Approval policy syncs into the durable governance and team records",
public/control-center/pages/settings.js:353:        path: "approval.contentOwner",
public/control-center/pages/settings.js:354:        label: "Content approval owner",
public/control-center/pages/settings.js:360:        path: "approval.mediaOwner",
public/control-center/pages/settings.js:361:        label: "Media approval owner",
public/control-center/pages/settings.js:367:        path: "approval.adsOwner",
public/control-center/pages/settings.js:368:        label: "Ads approval owner",
public/control-center/pages/settings.js:374:        path: "approval.requirements",
public/control-center/pages/settings.js:375:        label: "What requires human approval",
public/control-center/pages/settings.js:381:        path: "approval.revisionRules",
public/control-center/pages/settings.js:382:        label: "Rejection / revision rules",
public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
public/control-center/pages/settings.js:388:        label: "Escalation notes",
public/control-center/pages/settings.js:395:    id: "team",
public/control-center/pages/settings.js:396:    title: "Team Permissions",
public/control-center/pages/settings.js:398:    backendLabel: "Permissions are modeled now and ready for future role persistence",
public/control-center/pages/settings.js:401:        path: "team.roles",
public/control-center/pages/settings.js:402:        label: "Roles / access levels",
public/control-center/pages/settings.js:407:        path: "team.serviceCoverage",
public/control-center/pages/settings.js:408:        label: "Active team services",
public/control-center/pages/settings.js:413:        path: "team.editAccess",
public/control-center/pages/settings.js:414:        label: "Who can edit",
public/control-center/pages/settings.js:420:        path: "team.publishAccess",

## 6) Known route references / navigateTo targets
public/control-center/pages/campaign-studio.js:478:      route: "campaign-studio",
public/control-center/pages/campaign-studio.js:1362:      navigateTo("ai-command");
public/control-center/pages/campaign-studio.js:1371:      navigateTo("publishing");
public/control-center/pages/campaign-studio.js:1377:    assetsBtn.onclick = () => navigateTo("library");
public/control-center/pages/campaign-studio.js:1384:      navigateTo("content-studio");
public/control-center/pages/campaign-studio.js:1392:      navigateTo("media-studio");
public/control-center/pages/campaign-studio.js:1400:      navigateTo("ads-manager");
public/control-center/pages/campaign-studio.js:1418:        navigateTo("integrations");
public/control-center/pages/campaign-studio.js:1422:        navigateTo("library");
public/control-center/pages/campaign-studio.js:1425:      navigateTo("insights");
public/control-center/pages/media-studio-workspace.js:1065:      route: "media-studio",
public/control-center/pages/media-studio-workspace.js:2650:      route: "media-studio",
public/control-center/pages/media-studio-workspace.js:3147:              route: "media-studio",
public/control-center/pages/media-studio-workspace.js:3215:              route: "media-studio",
public/control-center/pages/media-studio-workspace.js:3261:      navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3426:        navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3456:    navigateTo("publishing");
public/control-center/pages/operations-centers.js:121:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:132:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:299:      route: "job-monitor"
public/control-center/pages/operations-centers.js:306:      route: "queue-center"
public/control-center/pages/operations-centers.js:313:      route: "job-monitor"
public/control-center/pages/operations-centers.js:320:      route: "notification-center"
public/control-center/pages/operations-centers.js:327:      route: "notification-center"
public/control-center/pages/operations-centers.js:334:      route: "publishing"
public/control-center/pages/operations-centers.js:341:      route: "integrations"
public/control-center/pages/operations-centers.js:348:      route: "governance"
public/control-center/pages/operations-centers.js:355:      route: "notification-center"
public/control-center/pages/operations-centers.js:1429:      route: { route: "integrations" }
public/control-center/pages/operations-centers.js:1941:      route: "task-center",
public/control-center/pages/operations-centers.js:1949:      route: "queue-center",
public/control-center/pages/operations-centers.js:1957:      route: "job-monitor",
public/control-center/pages/operations-centers.js:1965:      route: "notification-center",
public/control-center/pages/operations-centers.js:2017:                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
public/control-center/pages/operations-centers.js:2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
public/control-center/pages/operations-centers.js:2038:                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
public/control-center/pages/research.js:6:  campaign: { route: "campaign-studio", label: "Campaign Studio", destinationRole: "strategist", destinationDomain: "campaign" },
public/control-center/pages/research.js:7:  content: { route: "content-studio", label: "Content Studio", destinationRole: "writer", destinationDomain: "content" },
public/control-center/pages/research.js:8:  seo: { route: "workflows", label: "SEO Workflow", destinationRole: "strategist", destinationDomain: "research" },
public/control-center/pages/research.js:9:  ads: { route: "ads-manager", label: "Ads Manager", destinationRole: "ads_operator", destinationDomain: "campaign" },
public/control-center/pages/research.js:10:  ai: { route: "ai-command", label: "AI Command", destinationRole: "admin", destinationDomain: "governance" }
public/control-center/pages/research.js:894:      navigateTo("ai-command");
public/control-center/pages/research.js:937:        navigateTo("ai-command");
public/control-center/pages/ai-command.js:444:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
public/control-center/pages/ai-command.js:458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:465:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
public/control-center/pages/ai-command.js:472:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
public/control-center/pages/ai-command.js:479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:4889:				navigateTo("settings");
public/control-center/pages/library.js:1957:        navigateTo("ai-command");
public/control-center/pages/library.js:2094:      navigateTo("ai-command");
public/control-center/pages/library.js:2824:      navigateTo("ai-command");
public/control-center/pages/library.js:2834:      navigateTo("ai-command");
public/control-center/pages/library.js:2849:      navigateTo("ai-command");
public/control-center/pages/library.js:2863:      navigateTo("ai-command");
public/control-center/pages/library.js:2879:      navigateTo("ai-command");
public/control-center/pages/library.js:2941:            navigateTo("ai-command");
public/control-center/pages/home.js:476:    secondaryActionRoute: "setup",
public/control-center/pages/home.js:1042:      navigateTo("ai-command");
public/control-center/pages/insights.js:950:      navigateTo("ai-command");
public/control-center/pages/insights.js:966:            route: "insights",
public/control-center/pages/insights.js:1003:            route: "insights",
public/control-center/pages/insights.js:1021:      navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:1513:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:1560:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:1676:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:2058:      navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2089:        navigateTo("media-studio");
public/control-center/pages/content-studio-workspace.js:2121:        navigateTo("publishing");
public/control-center/pages/content-studio-workspace.js:2238:        navigateTo("ai-command");
public/control-center/pages/governance.js:1442:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1454:      context.navigateTo("ai-command");
public/control-center/pages/integrations.js:1536:      navigateTo("ai-command");
public/control-center/pages/setup.js:1070:      navigateTo("setup");
public/control-center/pages/setup.js:1153:      navigateTo("ai-command");
public/control-center/pages/setup.js:1171:      navigateTo("library");
public/control-center/pages/setup.js:1178:      navigateTo("integrations");
public/control-center/pages/setup.js:1185:      navigateTo("campaign-studio");
public/control-center/pages/setup.js:1212:      navigateTo("home");
public/control-center/pages/publishing.js:1844:      navigateTo("ai-command");
public/control-center/pages/workflows.js:545:        route: "ai-command",
public/control-center/pages/workflows.js:1104:  navigateTo("ai-command");
public/control-center/pages/workflows.js:1571:      navigateTo("task-center");
public/control-center/pages/workflows.js:1607:      navigateTo("ai-command");
public/control-center/pages/workflows.js:1643:      navigateTo("ai-command");
public/control-center/pages/workflows.js:2259:              route: "workflows",
public/control-center/pages/workflows.js:2272:        navigateTo("ai-command");
public/control-center/pages/workflows.js:2294:          navigateTo("campaign-studio");
public/control-center/pages/workflows.js:2319:          navigateTo("task-center");
public/control-center/pages/settings.js:1876:              route: "governance",
public/control-center/pages/settings.js:1933:        context.navigateTo("governance");
public/control-center/pages/settings.js:1959:      context.navigateTo("ai-command");
public/control-center/pages/settings.js:1971:      context.navigateTo("ai-command");
public/control-center/pages/ads-manager.js:270:      navigateTo("ai-command");
public/control-center/pages/ads-manager.js:277:    publishingBtn.onclick = () => navigateTo("publishing");
public/control-center/pages/ads-manager.js:282:    libraryBtn.onclick = () => navigateTo("library");
public/control-center/app.js:493:  navigateTo("home");
public/control-center/app.js:537:        navigateTo("home");
public/control-center/app.js:3086:      navigateTo("home");
public/control-center/app.js:3094:        navigateTo("ai-command");
public/control-center/app.js:3598:  navigateTo("ai-command");
public/control-center/app.js:3997:        navigateTo("setup");
public/control-center/app.js:4065:      navigateTo("ai-command");
public/control-center/index.html:115:            <button class="nav-item is-active" data-route="home" data-page="home" type="button">Home</button>
public/control-center/index.html:116:            <button class="nav-item" data-route="setup" data-page="setup" type="button">Setup</button>
public/control-center/index.html:117:            <button class="nav-item" data-route="library" data-page="library" type="button">Library</button>
public/control-center/index.html:118:            <button class="nav-item" data-route="integrations" data-page="integrations" type="button">Integrations</button>
public/control-center/index.html:119:            <button class="nav-item" data-route="ai-command" data-page="ai-command" type="button">AI Command</button>
public/control-center/index.html:120:            <button class="nav-item" data-route="workflows" data-page="workflows" type="button">Workflows</button>
public/control-center/index.html:121:            <button class="nav-item" data-route="publishing" data-page="publishing" type="button">Publishing</button>
public/control-center/index.html:122:            <button class="nav-item" data-route="insights" data-page="insights" type="button">Insights</button>
public/control-center/index.html:127:            <button class="nav-item" data-route="campaign-studio" data-page="campaign-studio" type="button">Campaign Studio</button>
public/control-center/index.html:128:            <button class="nav-item" data-route="content-studio" data-page="content-studio" type="button">Content Studio</button>
public/control-center/index.html:129:            <button class="nav-item" data-route="media-studio" data-page="media-studio" type="button">Media Studio</button>
public/control-center/index.html:130:            <button class="nav-item" data-route="ads-manager" data-page="ads-manager" type="button">Ads Manager</button>
public/control-center/index.html:131:            <button class="nav-item" data-route="research" data-page="research" type="button">Research</button>
public/control-center/index.html:136:            <button class="nav-item" data-route="operations-centers" data-page="operations-centers" type="button">Operations Overview</button>
public/control-center/index.html:137:            <button class="nav-item" data-route="task-center" data-page="task-center" type="button">Task Center</button>
public/control-center/index.html:138:            <button class="nav-item" data-route="queue-center" data-page="queue-center" type="button">Queue Center</button>
public/control-center/index.html:139:            <button class="nav-item" data-route="job-monitor" data-page="job-monitor" type="button">Job Monitor</button>
public/control-center/index.html:140:            <button class="nav-item" data-route="notification-center" data-page="notification-center" type="button">Notifications</button>
public/control-center/index.html:141:            <button class="nav-item" data-route="governance" data-page="governance" type="button">Governance</button>
public/control-center/index.html:142:            <button class="nav-item" data-route="settings" data-page="settings" type="button">Settings</button>

---

## Parity Decision

Status: Pass for existing registered routes.

Confirmed:
- Sidebar includes all current user-facing primary routes.
- Sidebar includes all current secondary studio routes.
- Sidebar includes all current system operations routes.
- Router registry includes the same current user-facing surfaces.
- No Customer / IVR / CRM route is currently registered.
- No Customer / IVR / CRM sidebar item exists currently.

Decision:
- Do not add Customer / IVR / CRM routes during 3AG.
- Treat Customer Operations / Communications as a future major surface group.
- Continue with 3AG.2 closeout for current registered routes only.
- Start 3AH after 3AG.3 closeout.
