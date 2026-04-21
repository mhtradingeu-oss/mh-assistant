import { renderDurableSystemSummary } from "../durable-ui.js";
import { setSharedHandoff } from "../shared-context.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatPercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return `${Math.max(0, Math.round(parsed))}%`;
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function statusTone(status, score) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("critical") ||
    normalized.includes("failed") ||
    normalized.includes("blocked") ||
    normalized.includes("missing") ||
    normalized.includes("offline")
  ) {
    return "danger";
  }

  if (
    normalized.includes("partial") ||
    normalized.includes("warning") ||
    normalized.includes("pending") ||
    normalized.includes("scheduled") ||
    normalized.includes("draft")
  ) {
    return "warning";
  }

  if (
    normalized.includes("ready") ||
    normalized.includes("connected") ||
    normalized.includes("active") ||
    normalized.includes("aligned") ||
    normalized.includes("complete")
  ) {
    return "success";
  }

  const parsedScore = Number(score);
  if (Number.isFinite(parsedScore)) {
    if (parsedScore >= 80) return "success";
    if (parsedScore >= 50) return "warning";
    return "danger";
  }

  return "neutral";
}

function countConnectedSources(sources) {
  return Object.values(asObject(sources)).filter((entry) => {
    if (entry == null) return false;
    if (typeof entry === "object") {
      const value = entry.value ?? entry.status ?? entry.connected ?? "";
      return Boolean(String(value).trim());
    }
    return Boolean(String(entry).trim());
  }).length;
}

function countReadyChecks(checks) {
  return Object.values(asObject(checks)).filter(Boolean).length;
}

function renderEmpty(message, escapeHtml) {
  return `<div class="empty-box">${escapeHtml(message)}</div>`;
}

function renderOverviewField(label, value, escapeHtml) {
  return `
    <div class="home-overview-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `;
}

function renderPriorityItems(items, emptyText, escapeHtml) {
  if (!items.length) {
    return renderEmpty(emptyText, escapeHtml);
  }

  return `
    <div class="home-list">
      ${items.map((item, index) => `
        <div class="home-list-item">
          <div class="home-list-item-head">
            <div class="home-list-title">${escapeHtml(String(item.title || item))}</div>
            <span class="home-list-index">${index + 1}</span>
          </div>
          ${
            item.meta
              ? `<div class="home-list-meta">${escapeHtml(String(item.meta))}</div>`
              : ""
          }
        </div>
      `).join("")}
    </div>
  `;
}

function getActivityTimestamp(item) {
  const fields = [
    "scheduled_for",
    "executed_at",
    "completed_at",
    "created_at",
    "updated_at"
  ];

  for (const field of fields) {
    const value = item?.[field];
    if (!value) continue;
    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return 0;
}

function buildRecentActivity(executionResults, scheduledJobs) {
  const executionItems = executionResults.map((item, index) => ({
    kind: "Execution",
    title: item?.wave_name || item?.channel || `Execution ${index + 1}`,
    meta: [
      item?.channel ? `Channel: ${item.channel}` : "",
      item?.execution_status ? `Status: ${item.execution_status}` : "",
      item?.notes || ""
    ].filter(Boolean).join(" • "),
    tone: statusTone(item?.execution_status),
    timestamp: getActivityTimestamp(item),
    order: index
  }));

  const scheduledItems = scheduledJobs.map((item, index) => ({
    kind: "Scheduled",
    title: item?.wave_name || item?.channel || `Scheduled job ${index + 1}`,
    meta: [
      item?.channel ? `Channel: ${item.channel}` : "",
      item?.status ? `Status: ${item.status}` : "",
      item?.scheduled_for ? `At: ${item.scheduled_for}` : ""
    ].filter(Boolean).join(" • "),
    tone: statusTone(item?.status),
    timestamp: getActivityTimestamp(item),
    order: index + executionResults.length
  }));

  return [...executionItems, ...scheduledItems]
    .sort((a, b) => {
      if (b.timestamp !== a.timestamp) {
        return b.timestamp - a.timestamp;
      }
      return a.order - b.order;
    })
    .slice(0, 6);
}

function buildExecutivePrompts({
  projectName,
  readinessStatus,
  criticalGaps,
  nextBestActions,
  missingConnectors,
  missingAssets
}) {
  const projectLabel = projectName || "this project";
  const gapLine = criticalGaps.length
    ? criticalGaps.slice(0, 3).join(", ")
    : "no critical gaps have been classified yet";
  const actionLine = nextBestActions.length
    ? nextBestActions.slice(0, 3).join("; ")
    : "propose the next three highest-value actions";

  return [
    {
      label: "Executive summary",
      prompt: `Create an executive summary for ${projectLabel}. Include current readiness status (${readinessStatus || "unknown"}), major risks, and the next decision I should make today.`
    },
    {
      label: "Close launch blockers",
      prompt: `For ${projectLabel}, turn these critical gaps into an execution plan: ${gapLine}. Prioritize by launch risk, owner, and fastest path to resolution.`
    },
    {
      label: "Connector recovery plan",
      prompt: `Review ${projectLabel} connector readiness. Missing or weak connectors: ${missingConnectors.length ? missingConnectors.join(", ") : "none listed"}. Recommend the smallest set of fixes needed to move toward launch.`
    },
    {
      label: "Asset completion brief",
      prompt: `Review the asset situation for ${projectLabel}. Missing required assets: ${missingAssets.length ? missingAssets.join(", ") : "none listed"}. Turn this into a concise production brief for the team.`
    },
    {
      label: "Next best actions",
      prompt: `Using the current project context for ${projectLabel}, evaluate these next-best actions: ${actionLine}. Re-rank them and explain which one should happen first and why.`
    }
  ];
}

function bindHomeActions({
  $,
  navigateTo,
  showMessage,
  promptItems,
  projectName,
  createProjectHandoff
}) {
  const routeButtons = [
    ["homeOpenSetupBtn", "setup"],
    ["homeOpenAiBtn", "ai-command"],
    ["homeQuickSetupBtn", "setup"],
    ["homeQuickLibraryBtn", "library"],
    ["homeQuickIntegrationsBtn", "integrations"],
    ["homeQuickCampaignBtn", "campaign-studio"],
    ["homeQuickPublishingBtn", "publishing"],
    ["homeQuickAiBtn", "ai-command"]
  ];

  routeButtons.forEach(([id, route]) => {
    const element = $(id);
    if (!element) return;
    element.onclick = () => {
      navigateTo(route);
    };
  });

  const promptButtons = Array.from(document.querySelectorAll("[data-home-prompt]"));
  promptButtons.forEach((button, index) => {
    button.onclick = () => {
      const prompt = promptItems[index]?.prompt || "";
      const input = $("quickCommandInput");
      if (input) {
        input.value = prompt;
      }
      if (projectName && prompt) {
        const handoff = {
          source_page: "home",
          destination_page: "ai-command",
          linked_entity: {
            entity_type: "project",
            entity_id: projectName,
            route: "home",
            label: projectName
          },
          payload: {
            prompt,
            draft_context: {
              origin: "home",
              projectName,
              promptType: promptItems[index]?.label || "Executive prompt"
            }
          }
        };
        setSharedHandoff(projectName, "ai-command", handoff);
        createProjectHandoff?.(projectName, handoff).catch((error) => {
          console.warn("Failed to persist Home handoff:", error.message);
        });
      }
      navigateTo("ai-command");
      if (typeof showMessage === "function") {
        showMessage("Executive prompt added to AI Command.");
      }
    };
  });
}

export const homeRoute = {
  id: "home",
  meta: {
    eyebrow: "Executive",
    title: "Home",
    description: "A high-signal control center for project readiness, launch decisions, and next actions."
  },
  template: `
    <section class="page is-active" data-page="home">
      <div class="home-wrapper">
        <div class="home-hero">
          <div class="home-hero-content">
            <div class="home-kicker">MH Assistant OS</div>
            <h3 id="homeHeroTitle" class="home-hero-title">Executive Home</h3>
            <p id="homeHeroText" class="home-hero-text"></p>
            <div id="homeHeroStatus" class="home-status-strip"></div>
          </div>

          <div class="home-hero-actions">
            <button id="homeOpenSetupBtn" class="btn btn-secondary" type="button">Review Setup</button>
            <button id="homeOpenAiBtn" class="btn btn-primary" type="button">Ask AI</button>
          </div>
        </div>

        <div id="homeKpiStrip" class="kpi-grid"></div>

        <div class="home-main-grid">
          <div class="home-main-left">
            <section class="card">
              <div class="card-head">
                <h3>Project Overview</h3>
                <span id="homeOverviewBadge" class="card-badge">Summary</span>
              </div>
              <div id="homeProjectOverview"></div>
            </section>

            <div class="grid-2">
              <section class="card">
                <div class="card-head">
                  <h3>Critical Gaps</h3>
                  <span id="homeCriticalBadge" class="card-badge">0 items</span>
                </div>
                <div id="homeCriticalGaps"></div>
              </section>

              <section class="card">
                <div class="card-head">
                  <h3>Next Best Actions</h3>
                  <span id="homeActionsBadge" class="card-badge">Recommended</span>
                </div>
                <div id="homeNextActions"></div>
              </section>
            </div>

            <section class="card">
              <div class="card-head">
                <h3>Recent Activity</h3>
                <span id="homeActivityBadge" class="card-badge">Activity</span>
              </div>
              <div id="homeRecentActivity"></div>
            </section>
          </div>

          <aside class="home-main-right">
            <section class="card">
              <div class="card-head">
                <h3>Launch Status</h3>
                <span id="homeLaunchBadge" class="card-badge">Status</span>
              </div>
              <div id="homeLaunchStatus"></div>
            </section>

            <div id="homeDurableSystem"></div>

            <section class="card">
              <div class="card-head">
                <h3>Quick Actions</h3>
                <span class="card-badge neutral">Navigate</span>
              </div>
              <div id="homeQuickActions"></div>
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Executive AI Prompts</h3>
                <span class="card-badge neutral">Assist</span>
              </div>
              <div id="homeExecutivePrompts"></div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    safeText,
    navigateTo,
    showMessage,
    createProjectHandoff
  }) {
    const state = getState();
    const overview = asObject(state.data.overview);
    const readiness = asObject(state.data.readiness);
    const assets = asObject(state.data.assets);
    const integrations = asObject(state.data.integrations);
    const activity = asObject(state.data.activity);

    const overviewData = asObject(overview.overview);
    const readinessDashboard = asObject(readiness.dashboard);
    const priorities = asObject(readinessDashboard.priorities || readiness.priorities);
    const sources = asObject(integrations.sources?.sources);
    const checks = asObject(integrations.readiness?.checks);

    const projectName =
      state.context.currentProject ||
      overviewData.project_name ||
      "";
    const readinessScore =
      readinessDashboard.readiness_score ??
      overviewData.readiness_score ??
      0;
    const readinessStatus =
      readinessDashboard.readiness_status ||
      overviewData.readiness_status ||
      "Not ready";
    const connectorsScore =
      integrations.readiness?.readiness_score ??
      overviewData.connector_readiness_score ??
      0;

    const assetsList = asArray(assets.assets);
    const routedAssets = asArray(assets.routes?.routed_assets);
    const missingAssets = asArray(assets.missing_assets?.missing);
    const missingConnectors = asArray(integrations.readiness?.missing);
    const criticalGaps = asArray(priorities.critical);
    const nextBestActions = asArray(readinessDashboard.next_best_actions).length
      ? asArray(readinessDashboard.next_best_actions)
      : asArray(overview.next_best_actions);
    const scheduledJobs = asArray(activity.scheduled_jobs);
    const executionResults = asArray(activity.execution_results);
    const recentActivity = buildRecentActivity(executionResults, scheduledJobs);

    const fallbackCriticalGaps = criticalGaps.length
      ? criticalGaps
      : [
          ...missingConnectors.slice(0, 2).map((item) => `Connect ${item}`),
          ...missingAssets.slice(0, 2).map((item) => `Provide ${item}`)
        ];
    const fallbackActions = nextBestActions.length
      ? nextBestActions
      : [
          missingConnectors.length ? "Complete the highest-impact connector setup." : "",
          missingAssets.length ? "Close the missing asset requirements for launch." : "",
          Number(readinessScore) < 80 ? "Review readiness blockers and assign owners." : "Review the latest launch wave and confirm execution."
        ].filter(Boolean);

    const connectedSourcesCount = countConnectedSources(sources);
    const connectorSlots = Math.max(
      Object.keys(sources).length,
      Object.keys(checks).length,
      missingConnectors.length + connectedSourcesCount
    );
    const readyChecksCount = countReadyChecks(checks);
    const totalAssets =
      assetsList.length ||
      toNumber(overviewData.total_assets, 0);
    const scheduledCount = activity.total_scheduled_jobs ?? scheduledJobs.length;
    const executionCount = activity.total_execution_results ?? executionResults.length;
    const totalJobs = toNumber(scheduledCount, 0) + toNumber(executionCount, 0);

    const latestExecution = executionResults[0] || null;
    const latestScheduled = scheduledJobs[0] || null;
    const activeCampaign =
      state.context.activeCampaign ||
      latestExecution?.wave_name ||
      latestScheduled?.wave_name ||
      "Not selected yet";
    const launchStatusText =
      latestExecution?.execution_status ||
      latestScheduled?.status ||
      readinessStatus;
    const launchTone = statusTone(launchStatusText, readinessScore);
    const launchSummary = latestExecution
      ? `Last execution on ${safeText(latestExecution.channel, "unknown channel")} is ${safeText(latestExecution.execution_status, "pending")}.`
      : latestScheduled
        ? `Next scheduled wave is ${safeText(latestScheduled.wave_name, "unnamed")} on ${safeText(latestScheduled.channel, "unknown channel")}.`
        : "No launches have been scheduled yet.";

    const executivePrompts = buildExecutivePrompts({
      projectName,
      readinessStatus,
      criticalGaps: fallbackCriticalGaps,
      nextBestActions: fallbackActions,
      missingConnectors,
      missingAssets
    });

    const heroTitle = projectName
      ? `${projectName} Executive Home`
      : "MH Assistant OS Executive Home";
    const heroText = projectName
      ? `Review readiness, resolve launch blockers, and keep ${projectName} moving with a compact decision-first view.`
      : "Select a project to load readiness, launch status, activity, and recommended next actions.";

    if ($("homeHeroTitle")) {
      $("homeHeroTitle").textContent = heroTitle;
    }

    if ($("homeHeroText")) {
      $("homeHeroText").textContent = heroText;
    }

    if ($("homeHeroStatus")) {
      $("homeHeroStatus").innerHTML = `
        <div class="home-status-chip">
          <span>Readiness</span>
          <strong>${escapeHtml(formatPercent(readinessScore))} • ${escapeHtml(safeText(readinessStatus))}</strong>
        </div>
        <div class="home-status-chip">
          <span>Campaign</span>
          <strong>${escapeHtml(safeText(activeCampaign))}</strong>
        </div>
        <div class="home-status-chip">
          <span>Launch focus</span>
          <strong>${escapeHtml(safeText(launchStatusText))}</strong>
        </div>
      `;
    }

    if ($("homeKpiStrip")) {
      const kpis = [
        {
          title: "Readiness",
          value: formatPercent(readinessScore),
          meta: `${safeText(readinessStatus)} • ${formatCount(fallbackCriticalGaps.length)} critical gaps`
        },
        {
          title: "Connectors",
          value: `${formatCount(Math.max(connectedSourcesCount, readyChecksCount))}/${formatCount(connectorSlots)}`,
          meta: `${formatPercent(connectorsScore)} readiness • ${formatCount(missingConnectors.length)} missing`
        },
        {
          title: "Assets",
          value: formatCount(totalAssets),
          meta: `${formatCount(routedAssets.length)} routed • ${formatCount(missingAssets.length)} required missing`
        },
        {
          title: "Jobs",
          value: formatCount(totalJobs),
          meta: `${formatCount(scheduledCount)} scheduled • ${formatCount(executionCount)} execution records`
        }
      ];

      $("homeKpiStrip").innerHTML = kpis.map((item) => `
        <div class="kpi-card">
          <div class="kpi-title">${escapeHtml(item.title)}</div>
          <div class="kpi-value">${escapeHtml(item.value)}</div>
          <div class="kpi-meta">${escapeHtml(item.meta)}</div>
        </div>
      `).join("");
    }

    if ($("homeOverviewBadge")) {
      const tone = statusTone(overviewData.status || overviewData.alignment_status, readinessScore);
      $("homeOverviewBadge").className = `card-badge ${tone}`;
      $("homeOverviewBadge").textContent = safeText(overviewData.status || overviewData.alignment_status, "Live");
    }

    if ($("homeProjectOverview")) {
      const overviewSummary = projectName
        ? `${safeText(overviewData.project_type, "Project")} for ${safeText(state.context.currentMarket, "unknown market")} in ${safeText(state.context.currentLanguage, "unknown language")}. ${formatCount(totalAssets)} registered assets and ${formatCount(Math.max(connectedSourcesCount, readyChecksCount))} active connectors are currently in view.`
        : "Project context will appear here once a workspace is selected.";

      $("homeProjectOverview").innerHTML = projectName
        ? `
          <p class="home-section-copy">${escapeHtml(overviewSummary)}</p>
          <div class="home-overview-grid">
            ${renderOverviewField("Project", safeText(projectName), escapeHtml)}
            ${renderOverviewField("Market", safeText(state.context.currentMarket), escapeHtml)}
            ${renderOverviewField("Language", safeText(state.context.currentLanguage), escapeHtml)}
            ${renderOverviewField("Execution mode", safeText(state.context.executionMode), escapeHtml)}
            ${renderOverviewField("Project type", safeText(overviewData.project_type), escapeHtml)}
            ${renderOverviewField("Website", safeText(overviewData.website_url), escapeHtml)}
            ${renderOverviewField("Alignment", safeText(overviewData.alignment_status), escapeHtml)}
            ${renderOverviewField("Connected sources", formatCount(Math.max(connectedSourcesCount, readyChecksCount)), escapeHtml)}
          </div>
        `
        : renderEmpty("Select a project to view the executive summary.", escapeHtml);
    }

    if ($("homeCriticalBadge")) {
      const tone = fallbackCriticalGaps.length ? "danger" : "success";
      $("homeCriticalBadge").className = `card-badge ${tone}`;
      $("homeCriticalBadge").textContent = `${formatCount(fallbackCriticalGaps.length)} items`;
    }

    if ($("homeCriticalGaps")) {
      const criticalItems = fallbackCriticalGaps.map((item) => ({
        title: item,
        meta: "Critical launch blockers should be resolved before scaling execution."
      }));
      $("homeCriticalGaps").innerHTML = renderPriorityItems(
        criticalItems,
        "No critical gaps detected. This area will stay quiet until a launch risk appears.",
        escapeHtml
      );
    }

    if ($("homeActionsBadge")) {
      const tone = fallbackActions.length ? "warning" : "neutral";
      $("homeActionsBadge").className = `card-badge ${tone}`;
      $("homeActionsBadge").textContent = `${formatCount(fallbackActions.length)} queued`;
    }

    if ($("homeNextActions")) {
      const actionItems = fallbackActions.slice(0, 5).map((item, index) => ({
        title: item,
        meta: index === 0
          ? "Best immediate move based on the currently loaded project state."
          : "Recommended follow-up action."
      }));

      $("homeNextActions").innerHTML = renderPriorityItems(
        actionItems,
        "No actions are queued yet. Load project data or ask AI for recommendations.",
        escapeHtml
      );
    }

    if ($("homeLaunchBadge")) {
      $("homeLaunchBadge").className = `card-badge ${launchTone}`;
      $("homeLaunchBadge").textContent = safeText(launchStatusText, "Unknown");
    }

    if ($("homeLaunchStatus")) {
      $("homeLaunchStatus").innerHTML = projectName
        ? `
          <p class="home-section-copy">${escapeHtml(launchSummary)}</p>
          <div class="data-stack">
            <div class="data-row"><span>Active campaign</span><strong>${escapeHtml(safeText(activeCampaign))}</strong></div>
            <div class="data-row"><span>Last execution</span><strong>${escapeHtml(safeText(latestExecution?.execution_status || latestExecution?.wave_name, "No execution yet"))}</strong></div>
            <div class="data-row"><span>Scheduled next</span><strong>${escapeHtml(safeText(latestScheduled?.wave_name || latestScheduled?.status, "Nothing scheduled"))}</strong></div>
            <div class="data-row"><span>Execution channel</span><strong>${escapeHtml(safeText(latestExecution?.channel || latestScheduled?.channel, "Not available"))}</strong></div>
          </div>
        `
        : renderEmpty("Launch status will appear after a project is selected.", escapeHtml);
    }

    if ($("homeDurableSystem")) {
      $("homeDurableSystem").innerHTML = renderDurableSystemSummary(state.data.operations, escapeHtml, {
        title: "Cross-Page Durable Handoff Model",
        kicker: "Shared Backbone",
        emptyText: "Durable cross-page counts will appear once the project operations snapshot is loaded."
      });
    }

    if ($("homeActivityBadge")) {
      $("homeActivityBadge").className = `card-badge ${recentActivity.length ? "neutral" : "warning"}`;
      $("homeActivityBadge").textContent = `${formatCount(recentActivity.length)} recent`;
    }

    if ($("homeRecentActivity")) {
      $("homeRecentActivity").innerHTML = recentActivity.length
        ? `
          <div class="home-list">
            ${recentActivity.map((item) => `
              <div class="home-list-item">
                <div class="home-list-item-head">
                  <div>
                    <div class="home-activity-kind">${escapeHtml(item.kind)}</div>
                    <div class="home-list-title">${escapeHtml(item.title)}</div>
                  </div>
                  <span class="card-badge ${item.tone}">${escapeHtml(item.kind)}</span>
                </div>
                <div class="home-list-meta">${escapeHtml(item.meta || "Activity captured without detail.")}</div>
              </div>
            `).join("")}
          </div>
        `
        : renderEmpty("No recent activity has been recorded for this project yet.", escapeHtml);
    }

    if ($("homeQuickActions")) {
      $("homeQuickActions").innerHTML = `
        <div class="quick-actions">
          <button id="homeQuickSetupBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Review setup</span>
            <span class="home-action-meta">Check project basics, readiness, and onboarding gaps.</span>
          </button>
          <button id="homeQuickLibraryBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Open library</span>
            <span class="home-action-meta">Inspect assets, folders, and missing required files.</span>
          </button>
          <button id="homeQuickIntegrationsBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Check integrations</span>
            <span class="home-action-meta">Review connector readiness and missing platform links.</span>
          </button>
          <button id="homeQuickCampaignBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Plan campaign</span>
            <span class="home-action-meta">Move into campaign design, launch waves, and execution planning.</span>
          </button>
          <button id="homeQuickPublishingBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Go to publishing</span>
            <span class="home-action-meta">Review schedule, queue, and channel delivery status.</span>
          </button>
          <button id="homeQuickAiBtn" class="quick-action-btn" type="button">
            <span class="home-action-title">Ask AI</span>
            <span class="home-action-meta">Open AI Command with project context ready to use.</span>
          </button>
        </div>
      `;
    }

    if ($("homeExecutivePrompts")) {
      $("homeExecutivePrompts").innerHTML = executivePrompts.length
        ? `
          <div class="home-prompt-grid">
            ${executivePrompts.map((item, index) => `
              <button class="home-prompt-btn" type="button" data-home-prompt="${index}">
                <span class="home-prompt-label">${escapeHtml(item.label)}</span>
                <span class="home-prompt-text">${escapeHtml(item.prompt)}</span>
              </button>
            `).join("")}
          </div>
        `
        : renderEmpty("Executive AI prompts will appear here when project context is available.", escapeHtml);
    }

    bindHomeActions({
      $,
      navigateTo,
      showMessage,
      promptItems: executivePrompts,
      projectName,
      createProjectHandoff
    });
  }
};
