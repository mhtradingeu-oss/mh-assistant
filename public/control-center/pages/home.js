import {
  renderActivityItems,
  renderAiTeamCards,
  renderBadge,
  renderBlockerColumn,
  renderCompactList,
  renderHomeExecutiveIntro
} from "./home/render-sections.js";

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
    { id: "writer", name: "Content Writer", fallback: "Prepare high-conversion messaging for active channels." },
    { id: "designer", name: "Media Director", fallback: "Polish visual direction and creative consistency." },
    { id: "video_lead", name: "Video Lead", fallback: "Queue the next motion and short-form variants." },
    { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
    { id: "ads_operator", name: "Ads Optimizer", fallback: "Optimize paid testing, creative variants, and budget decisions." },
    { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
    { id: "compliance_reviewer", name: "Compliance Reviewer", fallback: "Review claims, approvals, and publish safety before release." },
    { id: "admin", name: "Operations Lead", fallback: "Clear blockers and keep execution flow healthy." }
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
    primaryActionLabel: nextActionRoute === "ai-command" ? "Open AI Workspace" : `Open ${humanizeStatus(nextActionRoute)}`,
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
        : "No scheduled action yet — open Publishing or Campaign Studio to prepare the next launch step."
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
        : "No execution recorded yet — start with a campaign or publishing package to create the first signal.",
      recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "Ask Executive AI to generate the next best action from readiness, blockers, and recent activity.",
      feedback: asString(learningLessons[0]).trim() || "Connect insights or run a reviewed campaign so the learning engine can capture feedback."
    },

    advanced: {
      projectName: projectName || "Project not selected yet",
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
function setGlobalAiPrompt($, prompt) {
  const input = $("quickCommandInput");
  if (input) {
    input.value = prompt;
    input.focus?.();
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
  render({ getState, $, escapeHtml, navigateTo, showMessage }) {    const state = getState();
    const dashboard = buildExecutiveData(state);
    const aiTeamCards = buildAiTeamCards(state);

    const root = $("homeExecRoot");
    if (!root) return;

    const capabilityCards = asArray(dashboard.capabilities).slice(0, 5);
    const statusItems = asArray(dashboard.statusBoard).slice(0, 6);
    const campaignChannels = asArray(dashboard.campaign.channels);

    root.innerHTML = `
      <div class="home-command-center">
        ${renderHomeExecutiveIntro({
          dashboard,
          capabilityCards,
          escapeHtml,
          formatPercent,
          toneLabel
        })}

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Critical Gaps</p>
              <h3>What is blocking progress?</h3>
            </div>
            ${renderBadge(dashboard.totalBlockers ? "warning" : "success", dashboard.totalBlockers ? `${formatCount(dashboard.totalBlockers)} blockers` : "Clear", escapeHtml)}
          </div>

          <div class="home-blocker-grid">
            ${renderBlockerColumn("Integrations", dashboard.blockers.integrations, "warning", escapeHtml)}
            ${renderBlockerColumn("Assets", dashboard.blockers.assets, "warning", escapeHtml)}
            ${renderBlockerColumn("Failed Jobs", dashboard.blockers.failedJobs, "danger", escapeHtml)}
            ${renderBlockerColumn("Readiness Gaps", dashboard.blockers.readinessGaps, "warning", escapeHtml)}
          </div>
        </section>

        <section class="home-two-column-grid">
          <article class="card home-decision-section">
            <div class="home-decision-section-head">
              <div>
                <p class="card-label">Launch Snapshot</p>
                <h3>Are we ready to publish?</h3>
              </div>
              ${renderBadge(
                dashboard.launchSnapshot.campaignReadiness === "Ready" ? "success" : "warning",
                dashboard.launchSnapshot.campaignReadiness,
                escapeHtml
              )}
            </div>

            <div class="home-status-grid">
              <article>
                <span class="data-label">Publish Ready</span>
                <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.publishReadiness))}</strong>
              </article>
              <article>
                <span class="data-label">Media Ready</span>
                <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.mediaReadiness))}</strong>
              </article>
              <article>
                <span class="data-label">Email</span>
                <strong>${escapeHtml(dashboard.launchSnapshot.emailReadiness)}</strong>
              </article>
              <article>
                <span class="data-label">Scheduled Jobs</span>
                <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.scheduledJobs))}</strong>
              </article>
            </div>
          </article>

          <article class="card home-decision-section">
            <div class="home-decision-section-head">
              <div>
                <p class="card-label">Active Campaign</p>
                <h3>${escapeHtml(compact(dashboard.campaign.name, "No active campaign"))}</h3>
              </div>
              ${renderBadge(dashboard.campaign.name ? "success" : "warning", dashboard.campaign.currentStage, escapeHtml)}
            </div>

            <div class="home-campaign-summary">
              <p><strong>Execution Mode:</strong> ${escapeHtml(dashboard.campaign.executionMode)}</p>
              <p><strong>Next Scheduled:</strong> ${escapeHtml(dashboard.campaign.nextScheduledAction)}</p>
              <p><strong>Channels:</strong> ${escapeHtml(campaignChannels.length ? campaignChannels.join(", ") : "No channels selected")}</p>
            </div>
          </article>
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Status Board</p>
              <h3>Operating state at a glance</h3>
            </div>
          </div>

          <div class="home-status-board">
            ${statusItems.map((item) => `
              <article class="home-status-board-card">
                <span class="data-label">${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <p>${escapeHtml(item.hint)}</p>
                ${renderBadge(item.tone, toneLabel(item.tone), escapeHtml)}
              </article>
            `).join("")}
          </div>
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Recent Activity</p>
              <h3>What happened recently?</h3>
            </div>
            <button id="homeOpenOperationsBtn" class="btn btn-secondary" type="button">
              Open Operations
            </button>
          </div>

          ${renderActivityItems(dashboard.recentActivity, escapeHtml)}
        </section>

        <section class="card home-decision-section">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">AI Workspace Snapshot</p>
              <h3>Who should help next?</h3>
            </div>
            <button id="homeOpenAiTeamBtn" class="btn btn-secondary" type="button">
              Open AI Workspace
            </button>
          </div>

          ${renderAiTeamCards(aiTeamCards, escapeHtml)}
        </section>

        <section class="card home-decision-section home-ai-panel">
          <div class="home-decision-section-head">
            <div>
              <p class="card-label">Ask Executive AI</p>
              <h3>Get guidance without leaving the dashboard</h3>
            </div>
          </div>

          <div class="home-ai-prompt-grid">
            <button id="homePromptNextBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">What should I do next?</span>
              <span class="home-action-meta">Use AI Workspace to prioritize today’s move.</span>
            </button>

            <button id="homePromptReadinessBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Why is readiness low?</span>
              <span class="home-action-meta">Use AI Workspace to explain blockers clearly.</span>
            </button>

            <button id="homePromptLaunchBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Summarize launch blockers</span>
              <span class="home-action-meta">Prepare a short launch risk summary.</span>
            </button>

            <button id="homePromptPlanBtn" class="quick-action-btn" type="button">
              <span class="home-action-title">Prepare today’s action plan</span>
              <span class="home-action-meta">Turn the dashboard into next tasks.</span>
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
              <span class="home-action-title">Open AI Workspace</span>
              <span class="home-action-meta">Send current next action to AI for guidance.</span>
            </button>
          </div>
        </section>
      </div>
    `;

    const openRoute = (route, message = "") => {
      navigateTo(route);
      if (message) showMessage?.(message);
    };

    const openAiWithPrompt = (prompt) => {
      setGlobalAiPrompt($, prompt);
      navigateTo("ai-command");
      showMessage?.("Prompt prepared in AI Command.");
    };

    const primaryActionBtn = $("homePrimaryActionBtn");
    if (primaryActionBtn) primaryActionBtn.onclick = () => openRoute(dashboard.primaryActionRoute, "Primary action opened.");

    const secondaryActionBtn = $("homeSecondaryActionBtn");
    if (secondaryActionBtn) secondaryActionBtn.onclick = () => openRoute(dashboard.secondaryActionRoute, "Setup foundation opened.");

    const askExecutiveAiBtn = $("homeAskExecutiveAiBtn");
    if (askExecutiveAiBtn) {
      askExecutiveAiBtn.onclick = () => openAiWithPrompt(`Summarize the current project status and recommend the best next action for ${dashboard.projectName || "this project"}.`);
    }

    const nextBtn = $("homeNextActionBtn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (dashboard.nextBestAction.route === "ai-command") {
          setGlobalAiPrompt($, dashboard.nextBestAction.recommendation);
        }

        openRoute(dashboard.nextBestAction.route, "Next best action opened.");
      };
    }

    const askNextActionBtn = $("homeAskNextActionBtn");
    if (askNextActionBtn) {
      askNextActionBtn.onclick = () => openAiWithPrompt(`Explain this next best action and give me the exact steps: ${dashboard.nextBestAction.recommendation}`);
    }

    const operationsBtn = $("homeOpenOperationsBtn");
    if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");

    const aiTeamBtn = $("homeOpenAiTeamBtn");
    if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");

    const quickCampaignBtn = $("homeQuickStartCampaignBtn");
    if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");

    const quickAssetBtn = $("homeQuickUploadAssetBtn");
    if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");

    const quickConnectBtn = $("homeQuickConnectPlatformBtn");
    if (quickConnectBtn) quickConnectBtn.onclick = () => openRoute("integrations");

    const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
    if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");

    const quickAiBtn = $("homeQuickOpenAiBtn");
    if (quickAiBtn) {
      quickAiBtn.onclick = () => openAiWithPrompt(dashboard.nextBestAction.recommendation);
    }

    const promptNextBtn = $("homePromptNextBtn");
    if (promptNextBtn) {
      promptNextBtn.onclick = () => openAiWithPrompt("What should I do next for this project? Prioritize the answer based on readiness, blockers, campaign state, and recent activity.");
    }

    const promptReadinessBtn = $("homePromptReadinessBtn");
    if (promptReadinessBtn) {
      promptReadinessBtn.onclick = () => openAiWithPrompt("Why is readiness low? Explain the missing integrations, assets, failed jobs, and readiness gaps in simple steps.");
    }

    const promptLaunchBtn = $("homePromptLaunchBtn");
    if (promptLaunchBtn) {
      promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");
    }

    const promptPlanBtn = $("homePromptPlanBtn");
    if (promptPlanBtn) {
      promptPlanBtn.onclick = () => openAiWithPrompt("Prepare today’s action plan from the current dashboard. Give me prioritized tasks with owners and expected outcomes.");
    }
  }
};
