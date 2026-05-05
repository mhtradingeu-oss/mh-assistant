import {
  buildSystemIntelligence,
  getReadinessBlockers
} from "../system-intelligence.js";
import {
  buildAutomationPlan,
  createAutoModeController,
  getAutoModeState,
  startAutoMode,
  stopAutoMode,
  approveCurrentGate,
  skipCurrentStep,
  subscribeAutoMode,
  getAutoFixPlan,
  getAutoFlowPlan,
  runAutomationPlan
} from "../automation-engine.js";

const homeAutomationState = {
  mode: "fix",
  progress: "",
  result: "",
  running: false
};
let homeAutoModeUnsubscribe = null;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatPercent(value) {
  return `${Math.max(0, Math.round(asNumber(value, 0)))}%`;
}

function formatCount(value) {
  return String(Math.max(0, Math.round(asNumber(value, 0))));
}

function statusTone(input, score) {
  const text = asString(input).toLowerCase();

  if (
    text.includes("critical") ||
    text.includes("failed") ||
    text.includes("blocked") ||
    text.includes("error") ||
    text.includes("missing")
  ) {
    return "danger";
  }

  if (
    text.includes("warning") ||
    text.includes("pending") ||
    text.includes("partial") ||
    text.includes("review")
  ) {
    return "warning";
  }

  if (
    text.includes("ready") ||
    text.includes("healthy") ||
    text.includes("connected") ||
    text.includes("active") ||
    text.includes("complete")
  ) {
    return "success";
  }

  const parsed = Number(score);
  if (Number.isFinite(parsed)) {
    if (parsed >= 80) return "success";
    if (parsed >= 50) return "warning";
    return "danger";
  }

  return "neutral";
}

function toneLabel(tone) {
  if (tone === "success") return "Healthy";
  if (tone === "warning") return "Attention";
  if (tone === "danger") return "Critical";
  return "Unknown";
}

function humanizeStatus(value, fallback = "Unknown") {
  const raw = asString(value).trim();
  if (!raw) return fallback;
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function parseTimestamp(item) {
  const fields = ["updated_at", "completed_at", "executed_at", "scheduled_for", "created_at"];
  for (const field of fields) {
    const value = item?.[field];
    if (!value) continue;
    const stamp = Date.parse(value);
    if (Number.isFinite(stamp)) {
      return stamp;
    }
  }
  return 0;
}

function formatRelativeDate(value) {
  const stamp = Date.parse(value || "");
  if (!Number.isFinite(stamp)) return "Not available";
  return new Date(stamp).toLocaleString();
}

function dedupe(values = []) {
  return Array.from(new Set(values.filter(Boolean)));
}

function compact(value, fallback = "-") {
  const text = asString(value).trim();
  return text || fallback;
}

function routeForAction(action) {
  const text = asString(action).toLowerCase();
  if (/(connector|integration|sync)/.test(text)) return "integrations";
  if (/(asset|library|upload|brand file)/.test(text)) return "library";
  if (/(campaign|launch wave|brief)/.test(text)) return "campaign-studio";
  if (/(publish|schedule|queue)/.test(text)) return "publishing";
  if (/(ad|budget|paid)/.test(text)) return "ads-manager";
  if (/(content|copy)/.test(text)) return "content-studio";
  return "ai-command";
}

function buildAiTeamCards(state) {
  const operations = asObject(state.data.operations);
  const notifications = asArray(operations.notifications?.items);
  const tasks = asArray(operations.tasks?.items);
  const approvals = asArray(operations.approvals?.items);

  const roles = [
    { id: "strategist", name: "Strategist", fallback: "Align campaign priorities and launch sequencing." },
    { id: "writer", name: "Writer", fallback: "Prepare high-conversion messaging for active channels." },
    { id: "designer", name: "Designer", fallback: "Polish visual direction and creative consistency." },
    { id: "video_lead", name: "Media Agent", fallback: "Queue the next media variants for launch assets." },
    { id: "ads_operator", name: "Ads Specialist", fallback: "Optimize paid testing and budget decisions." },
    { id: "analyst", name: "Analyst", fallback: "Read weak signals and recommend improvements." },
    { id: "admin", name: "Operations", fallback: "Clear blockers and keep execution flow healthy." }
  ];

  return roles.map((role) => {
    const roleNotifications = notifications.filter((item) => asString(item?.owner_role).toLowerCase() === role.id);
    const roleTasks = tasks.filter((item) => asString(item?.owner_role).toLowerCase() === role.id);
    const roleApprovals = approvals.filter((item) => asString(item?.reviewer_role).toLowerCase() === role.id);

    const latest = roleNotifications[0] || roleTasks[0] || roleApprovals[0] || null;
    const statusRaw = asString(latest?.status || latest?.level || "idle");
    const tone = statusTone(statusRaw);

    return {
      ...role,
      tone,
      status: humanizeStatus(statusRaw, "Idle"),
      summary: latest
        ? asString(latest.title || latest.summary || latest.action || role.fallback)
        : role.fallback
    };
  });
}

function buildExecutiveData(state) {
  const overview = asObject(state.data.overview);
  const readiness = asObject(state.data.readiness);
  const integrations = asObject(state.data.integrations);
  const activity = asObject(state.data.activity);
  const assets = asObject(state.data.assets);
  const operations = asObject(state.data.operations);

  const overviewData = asObject(overview.overview);
  const readinessData = asObject(readiness.dashboard);
  const readinessPriorities = asObject(readinessData.priorities || readiness.priorities);

  const scheduledJobs = asArray(activity.scheduled_jobs);
  const executionResults = asArray(activity.execution_results);
  const recommendations = asArray(readinessData.next_best_actions).length
    ? asArray(readinessData.next_best_actions)
    : asArray(overview.next_best_actions);

  const insights = asObject(activity.insights);
  const learning = asObject(activity.learning);
  const notifications = asArray(operations.notifications?.items);

  const sortedExecution = executionResults
    .slice()
    .sort((a, b) => parseTimestamp(b) - parseTimestamp(a));
  const sortedSchedule = scheduledJobs
    .slice()
    .sort((a, b) => parseTimestamp(a) - parseTimestamp(b));

  const latestExecution = sortedExecution[0] || null;
  const nextScheduled = sortedSchedule[0] || null;

  const projectName =
    asString(state.context.currentProject) ||
    asString(overviewData.project_name);

  const readinessScore =
    readinessData.readiness_score ??
    overviewData.readiness_score ??
    0;

  const connectorScore =
    integrations.readiness?.readiness_score ??
    overviewData.connector_readiness_score ??
    0;

  const criticalGaps = asArray(readinessPriorities.critical);
  const failedExecutions = sortedExecution.filter((item) => statusTone(item?.execution_status) === "danger");
  const unreadNotifications = notifications.filter((item) => !item?.read_at);

  const connectorChecks = asObject(integrations.readiness?.checks);
  const connectorKeys = Object.keys(connectorChecks);
  const connectedConnectorCount = connectorKeys.filter((key) => Boolean(connectorChecks[key])).length;
  const missingIntegrations = asArray(integrations.readiness?.missing).map((item) => humanizeStatus(item)).filter(Boolean);

  const categoryReadiness = asArray(assets.category_readiness?.categories);
  const missingAssetLabels = [
    ...asArray(assets.missing_assets?.assets),
    ...asArray(assets.missing_assets?.missing),
    ...asArray(assets.missing_assets?.blockers),
    ...categoryReadiness
      .filter((item) => item?.required !== false && ["missing", "needs review"].includes(asString(item.status).toLowerCase()))
      .map((item) => asString(item.display_label || item.label || item.asset_type))
  ].map((item) => item.trim()).filter(Boolean);
  const missingAssets = dedupe(missingAssetLabels).map((item) => humanizeStatus(item));

  const assetItems = asArray(assets.assets);
  const sourceOfTruthCount = assetItems.filter((item) => Boolean(item.source_of_truth || item.use_as_source_of_truth)).length;

  const insightsRecommendations = asArray(insights.recommendations);
  const learningLessons = asArray(learning.system_lessons);
  const tasks = asArray(operations.tasks?.items);
  const approvals = asArray(operations.approvals?.items);

  const automationTone = failedExecutions.length
    ? "danger"
    : scheduledJobs.length
      ? "success"
      : "warning";

  const intelligenceScore = insightsRecommendations.length + learningLessons.length;
  const intelligenceTone = intelligenceScore > 0 ? "success" : "warning";

  const fallbackAction =
    criticalGaps[0]
      ? `Resolve: ${criticalGaps[0]}`
      : failedExecutions.length
        ? "Recover failed execution items"
        : "Review and confirm next launch move";

  const nextAction = asString(recommendations[0]).trim() || fallbackAction;
  const nextActionRoute = routeForAction(nextAction);

  const whyItMatters = criticalGaps.length
    ? "Removing this blocker increases launch confidence and prevents avoidable delays."
    : failedExecutions.length
      ? "Stabilizing this now protects delivery quality and keeps automation reliable."
      : "Acting now keeps momentum and converts current readiness into measurable output.";

  const activeCampaignName =
    asString(state.context.activeCampaign) ||
    asString(latestExecution?.wave_name) ||
    asString(nextScheduled?.wave_name);

  const activeChannels = dedupe([
    asString(latestExecution?.channel),
    asString(nextScheduled?.channel)
  ]).slice(0, 3);

  const currentStage = humanizeStatus(
    latestExecution?.execution_status ||
    nextScheduled?.status ||
    readinessData.readiness_status ||
    overviewData.readiness_status,
    "Not started"
  );

  const systemScore = Math.round((asNumber(readinessScore) + asNumber(connectorScore)) / 2);

  const pendingTasks = tasks.filter((item) => {
    const text = asString(item?.status || "").toLowerCase();
    return text.includes("pending") || text.includes("in_progress") || text.includes("review");
  });

  const pendingApprovals = approvals.filter((item) => {
    const text = asString(item?.status || "").toLowerCase();
    return !text || text.includes("pending") || text.includes("requested");
  });

  const mediaJobs = asArray(operations.media_jobs?.items);
  const mediaReadyCount = mediaJobs.filter((item) => statusTone(item?.status) === "success").length;

  const publishingQueue = asArray(operations.queues?.items).filter((item) =>
    asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
  );
  const publishReadyCount = publishingQueue.filter((item) => {
    const status = asString(item.status || item.publish_status || item.execution_status).toLowerCase();
    return ["ready", "manual_publish_ready", "scheduled", "queued"].includes(status);
  }).length + scheduledJobs.length;

  const emailConnected = Boolean(
    connectorChecks.email || connectorChecks.mailer || connectorChecks.smtp || connectorChecks.mailchimp
  );

  const readinessMissing = [
    ...asArray(readinessData.missing),
    ...asArray(readiness.missing_fields)
  ].map((item) => compact(item, "")).filter(Boolean);

  const completedExecutions = sortedExecution.filter((item) => statusTone(item?.execution_status) === "success");

  const readyCount = [
    asNumber(readinessScore) >= 80 ? 1 : 0,
    asNumber(connectorScore) >= 70 ? 1 : 0,
    failedExecutions.length === 0 ? 1 : 0
  ].reduce((sum, value) => sum + value, 0);

  const recentExecutionSummary = sortedExecution.slice(0, 4).map((item) => {
    const channel = humanizeStatus(item?.channel, "Channel");
    const status = humanizeStatus(item?.execution_status, "Unknown");
    const when = formatRelativeDate(item?.executed_at || item?.updated_at || item?.created_at);
    return {
      channel,
      status,
      when,
      tone: statusTone(item?.execution_status)
    };
  });

  const schedulerQueue = sortedSchedule.slice(0, 4).map((item) => {
    const channel = humanizeStatus(item?.channel, "Channel");
    const status = humanizeStatus(item?.status, "Scheduled");
    const when = formatRelativeDate(item?.scheduled_for || item?.updated_at || item?.created_at);
    return {
      channel,
      status,
      when,
      tone: statusTone(item?.status)
    };
  });

  const recentActivity = [
    ...sortedExecution.slice(0, 8).map((item) => ({
      kind: "Execution",
      title: `${humanizeStatus(item?.channel, "Channel")} • ${humanizeStatus(item?.execution_status, "Unknown")}`,
      detail: compact(item?.wave_name, "Execution result"),
      when: formatRelativeDate(item?.executed_at || item?.updated_at || item?.created_at),
      tone: statusTone(item?.execution_status),
      stamp: parseTimestamp(item)
    })),
    ...sortedSchedule.slice(0, 8).map((item) => ({
      kind: "Schedule",
      title: `${humanizeStatus(item?.channel, "Channel")} • ${humanizeStatus(item?.status, "Scheduled")}`,
      detail: compact(item?.wave_name, "Scheduled job"),
      when: formatRelativeDate(item?.scheduled_for || item?.updated_at || item?.created_at),
      tone: statusTone(item?.status),
      stamp: parseTimestamp(item)
    })),
    ...notifications.slice(0, 8).map((item) => ({
      kind: "Alert",
      title: compact(item?.title || item?.summary || item?.kind, "Notification"),
      detail: compact(item?.action || item?.status || item?.level, "Review required"),
      when: formatRelativeDate(item?.updated_at || item?.created_at),
      tone: statusTone(item?.level || item?.status),
      stamp: parseTimestamp(item)
    }))
  ].sort((a, b) => b.stamp - a.stamp).slice(0, 10);

  const blockers = {
    integrations: missingIntegrations,
    assets: missingAssets,
    failedJobs: failedExecutions.slice(0, 8).map((item) =>
      `${humanizeStatus(item?.channel, "Channel")}: ${humanizeStatus(item?.execution_status, "Failed")}`
    ),
    readinessGaps: dedupe([
      ...criticalGaps.map((item) => compact(item, "")).filter(Boolean),
      ...readinessMissing
    ]).slice(0, 10)
  };

  const totalBlockers =
    blockers.integrations.length +
    blockers.assets.length +
    blockers.failedJobs.length +
    blockers.readinessGaps.length;

  const campaignReadinessTone = totalBlockers ? "warning" : "success";

  return {
    projectName,
    headerStatus: humanizeStatus(
      readinessData.readiness_status || overviewData.readiness_status || overviewData.status,
      "Not ready"
    ),
    headerTone: statusTone(readinessData.readiness_status || overviewData.readiness_status, readinessScore),
    oneLineSummary: projectName
      ? `${projectName} is at ${formatPercent(readinessScore)} readiness with ${formatPercent(connectorScore)} connector coverage and ${formatCount(criticalGaps.length)} critical blocker${criticalGaps.length === 1 ? "" : "s"}.`
      : "Select a project to view executive status, system health, and clear next actions.",
    primaryActionLabel: nextActionRoute === "ai-command" ? "Open AI Command" : `Open ${humanizeStatus(nextActionRoute)}`,
    primaryActionRoute: nextActionRoute,
    secondaryActionLabel: "Review Setup Foundation",
    secondaryActionRoute: "setup",

    health: {
      systemScore,
      projectReadiness: asNumber(readinessScore),
      connectorReadiness: asNumber(connectorScore),
      connectorCoverage: `${connectedConnectorCount}/${connectorKeys.length || 0}`,
      automationStatus: toneLabel(automationTone),
      automationTone,
      intelligenceStatus: intelligenceScore > 0 ? "Active" : "Needs input",
      intelligenceTone,
      criticalAlerts: criticalGaps.length + failedExecutions.length + unreadNotifications.length
    },

    nextBestAction: {
      recommendation: nextAction,
      whyItMatters,
      route: nextActionRoute,
      buttonLabel: nextActionRoute === "ai-command" ? "Start With AI" : `Fix In ${humanizeStatus(nextActionRoute)}`
    },

    capabilities: [
      {
        title: "System Health",
        value: formatPercent(systemScore),
        detail: dashboardLabelFromScore(systemScore),
        tone: statusTone("score", systemScore)
      },
      {
        title: "Project Readiness",
        value: formatPercent(readinessScore),
        detail: criticalGaps.length ? `${formatCount(criticalGaps.length)} blockers` : "Ready for scale",
        tone: statusTone("score", readinessScore)
      },
      {
        title: "Automation",
        value: formatCount(scheduledJobs.length),
        detail: `${formatCount(failedExecutions.length)} failed jobs`,
        tone: automationTone
      },
      {
        title: "Intelligence",
        value: formatCount(intelligenceScore),
        detail: intelligenceScore ? "Signals captured" : "Needs fresh feedback",
        tone: intelligenceTone
      },
      {
        title: "Active Campaign",
        value: activeCampaignName ? "Live" : "Missing",
        detail: activeCampaignName || "No campaign selected",
        tone: activeCampaignName ? "success" : "warning"
      }
    ],

    statusBoard: [
      {
        label: "Ready",
        value: formatCount(readyCount),
        hint: "Core pillars healthy",
        tone: readyCount >= 2 ? "success" : "warning"
      },
      {
        label: "Missing",
        value: formatCount(criticalGaps.length),
        hint: "Critical setup or assets",
        tone: criticalGaps.length ? "danger" : "success"
      },
      {
        label: "Failed",
        value: formatCount(failedExecutions.length),
        hint: "Execution failures",
        tone: failedExecutions.length ? "danger" : "success"
      },
      {
        label: "Needs Attention",
        value: formatCount(unreadNotifications.length + pendingTasks.length + pendingApprovals.length),
        hint: "Notifications, tasks, approvals",
        tone: unreadNotifications.length + pendingTasks.length + pendingApprovals.length ? "warning" : "success"
      },
      {
        label: "Completed",
        value: formatCount(completedExecutions.length),
        hint: "Recent successful runs",
        tone: completedExecutions.length ? "success" : "neutral"
      },
      {
        label: "Next Step",
        value: humanizeStatus(nextActionRoute),
        hint: nextAction,
        tone: "neutral"
      }
    ],

    campaign: {
      name: activeCampaignName,
      channels: activeChannels,
      currentStage,
      executionMode: compact(state.context.executionMode || overviewData.execution_mode, "Not set"),
      nextScheduledAction: nextScheduled
        ? `${humanizeStatus(nextScheduled.status, "Scheduled")}: ${formatRelativeDate(nextScheduled.scheduled_for || nextScheduled.updated_at)}`
        : "No scheduled action yet"
    },

    blockers,
    totalBlockers,
    schedulerQueue,
    recentExecutionSummary,
    recentActivity,

    launchSnapshot: {
      publishReadiness: publishReadyCount,
      mediaReadiness: mediaReadyCount,
      emailReadiness: emailConnected ? "Connected" : "Missing",
      scheduledJobs: scheduledJobs.length,
      campaignReadiness: campaignReadinessTone === "success" ? "Ready" : "At risk"
    },

    systemHealth: {
      apiStatus: overviewData.project_name || readinessData.readiness_score != null ? "Operational" : "Partial",
      sourceOfTruth: sourceOfTruthCount ? `${sourceOfTruthCount} assets marked` : "Not configured",
      missingRequiredData: totalBlockers,
      missingDataList: dedupe([
        ...blockers.integrations.map((item) => `Integration: ${item}`),
        ...blockers.assets.map((item) => `Asset: ${item}`),
        ...blockers.readinessGaps.map((item) => `Readiness: ${item}`)
      ]).slice(0, 6)
    },

    recent: {
      execution: latestExecution
        ? `${humanizeStatus(latestExecution.execution_status, "Completed")} on ${humanizeStatus(latestExecution.channel, "Channel")}`
        : "No execution recorded yet",
      recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "No recommendation generated yet",
      feedback: asString(learningLessons[0]).trim() || "No feedback captured yet"
    },

    advanced: {
      projectName: projectName || "Not selected",
      notifications: unreadNotifications.length,
      pendingTasks: pendingTasks.length,
      pendingApprovals: pendingApprovals.length,
      scheduledJobs: scheduledJobs.length,
      executionResults: executionResults.length,
      nextSchedule: nextScheduled ? formatRelativeDate(nextScheduled.scheduled_for || nextScheduled.updated_at) : "Not available",
      lastExecution: latestExecution ? formatRelativeDate(latestExecution.executed_at || latestExecution.updated_at) : "Not available"
    }
  };
}

function dashboardLabelFromScore(score) {
  if (score >= 85) return "Strong operating state";
  if (score >= 65) return "Stable with gaps";
  return "Recovery needed";
}

function renderHomeAutomationPlan(plan, escapeHtml) {
  if (!plan.length) return `<div class="empty-box">No safe automation steps are available right now.</div>`;
  return `
    <ol class="home-decision-list home-decision-list-spaced">
      ${plan.map((step, index) => `
        <li>
          <strong>${escapeHtml(`Step ${index + 1}`)}:</strong>
          ${escapeHtml(step.action)}
          <span class="small-text">(${escapeHtml(step.type)} -> ${escapeHtml(step.targetPage)})</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function renderHomeAutoModeLogs(logs, escapeHtml) {
  const recent = asArray(logs).slice(-5).reverse();
  if (!recent.length) return `<div class="empty-box">No Auto Mode logs yet.</div>`;
  return `
    <ul class="home-decision-list home-decision-list-spaced">
      ${recent.map((entry) => `<li><strong>${escapeHtml(entry.level || "info")}:</strong> ${escapeHtml(entry.message || "")}</li>`).join("")}
    </ul>
  `;
}

function bindHomeActions({ $, getState, navigateTo, showMessage, dashboard, render }) {
  createAutoModeController(getState, { getState, navigateTo });
  if (homeAutoModeUnsubscribe) homeAutoModeUnsubscribe();
  homeAutoModeUnsubscribe = subscribeAutoMode(() => {
    render();
  });

  const primaryBtn = $("homeExecPrimaryBtn");
  if (primaryBtn) {
    primaryBtn.onclick = () => {
      navigateTo(dashboard.primaryActionRoute);
    };
  }

  const nextBtn = $("homeNextActionBtn");
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (dashboard.nextBestAction.route === "ai-command") {
        const input = $("quickCommandInput");
        if (input) {
          input.value = dashboard.nextBestAction.recommendation;
        }
      }
      navigateTo(dashboard.nextBestAction.route);
      showMessage?.("Next best action opened.");
    };
  }

  const campaignBtn = $("homeCampaignOpenBtn");
  if (campaignBtn) {
    campaignBtn.onclick = () => {
      navigateTo("campaign-studio");
    };
  }

  const quickCampaignBtn = $("homeQuickStartCampaignBtn");
  if (quickCampaignBtn) quickCampaignBtn.onclick = () => navigateTo("campaign-studio");

  const quickAssetBtn = $("homeQuickUploadAssetBtn");
  if (quickAssetBtn) quickAssetBtn.onclick = () => navigateTo("library");

  const quickConnectBtn = $("homeQuickConnectPlatformBtn");
  if (quickConnectBtn) quickConnectBtn.onclick = () => navigateTo("integrations");

  const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
  if (quickReadinessBtn) quickReadinessBtn.onclick = () => navigateTo("setup");

  const quickAiBtn = $("homeQuickOpenAiBtn");
  if (quickAiBtn) {
    quickAiBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) input.value = dashboard.nextBestAction.recommendation;
      navigateTo("ai-command");
    };
  }

  Array.from(document.querySelectorAll("[data-home-global-route]")).forEach((button) => {
    button.onclick = () => {
      const route = button.getAttribute("data-home-global-route") || "";
      const prompt = button.getAttribute("data-home-global-prompt") || "";
      if (!route) return;
      if (route === "ai-command" && prompt) {
        const input = $("quickCommandInput");
        if (input) input.value = prompt;
      }
      navigateTo(route);
    };
  });

  const previewPlanEl = $("homeAutomationPlanPreview");
  const progressEl = $("homeAutomationProgress");
  const resultEl = $("homeAutomationResult");

  function currentPlan() {
    const state = getState();
    if (homeAutomationState.mode === "flow") return getAutoFlowPlan(state);
    if (homeAutomationState.mode === "all") return buildAutomationPlan(state);
    return getAutoFixPlan(state);
  }

  function updateAutomationStatus() {
    if (progressEl) progressEl.textContent = homeAutomationState.progress || "";
    if (resultEl) resultEl.textContent = homeAutomationState.result || "";
  }

  async function executePlan(mode) {
    homeAutomationState.mode = mode;
    const plan = currentPlan();
    if (!plan.length) {
      homeAutomationState.progress = "";
      homeAutomationState.result = "No safe automation steps to run.";
      updateAutomationStatus();
      return;
    }

    const confirmed = window.confirm(`Automation will run ${plan.length} safe step(s). Continue?`);
    if (!confirmed) return;

    homeAutomationState.running = true;
    homeAutomationState.result = "";
    homeAutomationState.progress = `Step 0 / ${plan.length}`;
    updateAutomationStatus();

    const outcome = await runAutomationPlan(plan, {
      context: { getState, navigateTo },
      onProgress: ({ index, total, step, result }) => {
        homeAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
        updateAutomationStatus();
      }
    });

    homeAutomationState.running = false;
    homeAutomationState.result = outcome.status === "success"
      ? "Automation finished: success."
      : `Automation stopped: ${outcome.status}.`;
    updateAutomationStatus();
    showMessage?.(homeAutomationState.result);
    render();
  }

  const fixAllBtn = $("homeFixAllIssuesBtn");
  if (fixAllBtn) {
    fixAllBtn.onclick = () => executePlan("fix");
  }

  const smartFlowBtn = $("homeRunSmartFlowBtn");
  if (smartFlowBtn) {
    smartFlowBtn.onclick = () => executePlan("flow");
  }

  if (previewPlanEl) {
    const plan = currentPlan();
    previewPlanEl.innerHTML = plan.length
      ? `<ol class="home-decision-list home-decision-list-spaced">${plan.map((step, index) => `<li><strong>Step ${index + 1}:</strong> ${step.action} (${step.type} -> ${step.targetPage})</li>`).join("")}</ol>`
      : `<div class="empty-box">No safe automation steps are available right now.</div>`;
  }

  updateAutomationStatus();

  const autoGuidedBtn = $("homeAutoGuidedBtn");
  if (autoGuidedBtn) {
    autoGuidedBtn.onclick = async () => {
      const plan = getAutoFixPlan(getState());
      await startAutoMode(plan, {
        mode: "guided",
        context: { getState, navigateTo }
      });
      showMessage?.("Guided Auto Mode started.");
    };
  }

  const autoUntilApprovalBtn = $("homeAutoUntilApprovalBtn");
  if (autoUntilApprovalBtn) {
    autoUntilApprovalBtn.onclick = async () => {
      const plan = buildAutomationPlan(getState());
      await startAutoMode(plan, {
        mode: "auto_until_approval",
        context: { getState, navigateTo }
      });
      showMessage?.("Auto Mode started until approval gate.");
    };
  }

  const autoStopBtn = $("homeAutoStopBtn");
  if (autoStopBtn) {
    autoStopBtn.onclick = () => {
      stopAutoMode();
      showMessage?.("Auto Mode stopped.");
    };
  }

  const autoApproveBtn = $("homeAutoApproveBtn");
  if (autoApproveBtn) {
    autoApproveBtn.onclick = async () => {
      await approveCurrentGate({ context: { getState, navigateTo } });
      showMessage?.("Approval gate accepted.");
    };
  }

  const autoSkipBtn = $("homeAutoSkipBtn");
  if (autoSkipBtn) {
    autoSkipBtn.onclick = async () => {
      await skipCurrentStep({ context: { getState, navigateTo } });
      showMessage?.("Gated step skipped.");
    };
  }
}

export const homeRoute = {
  id: "home",
  meta: {
    eyebrow: "Executive",
    title: "Executive Command Center",
    description: "Understand the whole system in seconds and take the most important action now."
  },
  template: `
    <section class="page is-active" data-page="home">
      <div id="homeExecRoot"></div>
    </section>
  `,
    render({ getState, $, escapeHtml, navigateTo, showMessage }) {
    const state = getState();
    const dashboard = buildExecutiveData(state);

    const root = $("homeExecRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="home-decision-shell">
        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Executive Overview</p>
              <h3>Operating Snapshot</h3>
            </div>
            <span class="card-badge ${escapeHtml(statusTone("score", dashboard.health.systemScore))}">
              ${escapeHtml(formatPercent(dashboard.health.systemScore))}
            </span>
          </div>

          <p class="home-decision-copy">${escapeHtml(dashboard.oneLineSummary)}</p>

          <div class="home-decision-kpi-grid">
            <article class="home-decision-kpi-card">
              <span class="data-label">Active Project</span>
              <strong>${escapeHtml(compact(dashboard.projectName, "Not selected"))}</strong>
            </article>

            <article class="home-decision-kpi-card">
              <span class="data-label">Readiness Score</span>
              <strong>${escapeHtml(formatPercent(dashboard.health.projectReadiness))}</strong>
            </article>

            <article class="home-decision-kpi-card">
              <span class="data-label">Connector Status</span>
              <strong>${escapeHtml(dashboard.health.connectorCoverage)}</strong>
            </article>

            <article class="home-decision-kpi-card">
              <span class="data-label">Critical Alerts</span>
              <strong>${escapeHtml(formatCount(dashboard.health.criticalAlerts))}</strong>
            </article>
          </div>
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Next Best Action</p>
              <h3>What should I do next?</h3>
            </div>
            <span class="card-badge warning">Recommended</span>
          </div>

          <div class="home-decision-next">
            <p class="home-decision-next-title">${escapeHtml(dashboard.nextBestAction.recommendation)}</p>
            <p class="home-decision-copy">${escapeHtml(dashboard.nextBestAction.whyItMatters)}</p>
            <button id="homeNextActionBtn" class="btn btn-primary" type="button">
              ${escapeHtml(dashboard.nextBestAction.buttonLabel)}
            </button>
          </div>
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Quick Actions</p>
              <h3>Where should I click?</h3>
            </div>
          </div>

          <div class="home-decision-quick-actions">
            <button id="homeQuickStartCampaignBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Start campaign</span>
              <span class="home-action-meta">Open Campaign Studio and work on launch waves.</span>
            </button>

            <button id="homeQuickUploadAssetBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Upload asset</span>
              <span class="home-action-meta">Open Library and close missing asset blockers.</span>
            </button>

            <button id="homeQuickConnectPlatformBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Connect platform</span>
              <span class="home-action-meta">Open Integrations and fix connector gaps.</span>
            </button>

            <button id="homeQuickReviewReadinessBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Review readiness</span>
              <span class="home-action-meta">Open Setup and resolve foundation issues.</span>
            </button>

            <button id="homeQuickOpenAiBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Open AI Command</span>
              <span class="home-action-meta">Send current next action to AI for guidance.</span>
            </button>
          </div>
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">System Health</p>
              <h3>Can we trust the current state?</h3>
            </div>
          </div>

          <div class="home-decision-health-grid">
            <article class="home-decision-kpi-card">
              <span class="data-label">API Status</span>
              <strong>${escapeHtml(dashboard.systemHealth.apiStatus)}</strong>
            </article>

            <article class="home-decision-kpi-card">
              <span class="data-label">Source of Truth</span>
              <strong>${escapeHtml(dashboard.systemHealth.sourceOfTruth)}</strong>
            </article>

            <article class="home-decision-kpi-card">
              <span class="data-label">Missing Required Data</span>
              <strong>${escapeHtml(formatCount(dashboard.systemHealth.missingRequiredData))}</strong>
            </article>
          </div>
        </section>
      </div>
    `;

    const nextBtn = $("homeNextActionBtn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (dashboard.nextBestAction.route === "ai-command") {
          const input = $("quickCommandInput");
          if (input) {
            input.value = dashboard.nextBestAction.recommendation;
          }
        }

        navigateTo(dashboard.nextBestAction.route);
        showMessage?.("Next best action opened.");
      };
    }

    const quickCampaignBtn = $("homeQuickStartCampaignBtn");
    if (quickCampaignBtn) quickCampaignBtn.onclick = () => navigateTo("campaign-studio");

    const quickAssetBtn = $("homeQuickUploadAssetBtn");
    if (quickAssetBtn) quickAssetBtn.onclick = () => navigateTo("library");

    const quickConnectBtn = $("homeQuickConnectPlatformBtn");
    if (quickConnectBtn) quickConnectBtn.onclick = () => navigateTo("integrations");

    const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
    if (quickReadinessBtn) quickReadinessBtn.onclick = () => navigateTo("setup");

    const quickAiBtn = $("homeQuickOpenAiBtn");
    if (quickAiBtn) {
      quickAiBtn.onclick = () => {
        const input = $("quickCommandInput");
        if (input) input.value = dashboard.nextBestAction.recommendation;
        navigateTo("ai-command");
      };
    }
  }
};
