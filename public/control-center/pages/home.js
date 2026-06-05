import {
  renderActivityItems,
  renderAiTeamCards,
  renderBadge,
  renderBlockerColumn,
  renderCompactList,
  renderHomeExecutiveIntro
} from "./home/render-sections.js";
import {
  getProjectedActiveRole,
  getProjectedTeamMembers
} from "../runtime/authority/authority-projection.js";

import {
  selectCurrentProject,
  selectOperationsSnapshot
} from "../state.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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

function humanizeExecutiveAction(value, fallback = "Next executive action") {
  const raw = asString(value).trim();
  if (!raw) return fallback;

  const normalized = raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const known = {
    "product videos": "Create product videos to unblock launch readiness",
    "connector ecommerce": "Connect ecommerce data to improve launch confidence",
    "ecommerce": "Connect ecommerce data to improve launch confidence",
    "analytics": "Connect analytics to strengthen decision quality",
    "amazon": "Review Amazon connector readiness",
    "ebay": "Review eBay connector readiness",
    "setup": "Complete setup foundation before execution",
    "library": "Prepare missing brand assets",
    "integrations": "Connect required platforms",
    "campaign studio": "Prepare the next campaign wave"
  };

  const key = normalized.toLowerCase();
  if (known[key]) return known[key];

  return normalized.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function compactModuleState(value, fallback = "Not enabled yet") {
  const text = asString(value).trim();
  if (!text) return fallback;
  if (/planned\/partial|planned|not ready|partial/i.test(text)) {
    return fallback;
  }
  return text;
}

function buildOperatingPath(dashboard = {}) {
  const blockers = asObject(dashboard.blockers);
  const campaign = asObject(dashboard.campaign);
  const launch = asObject(dashboard.launchSnapshot);
  const health = asObject(dashboard.health);

  return [
    {
      title: "Setup foundation",
      meta: health.projectReadiness >= 80 ? "Foundation is mostly ready" : "Review setup and readiness gaps",
      tone: health.projectReadiness >= 80 ? "is-live" : "is-warning",
      status: health.projectReadiness >= 80 ? "Ready" : "Needs review"
    },
    {
      title: "Prepare assets",
      meta: asArray(blockers.assets).length ? `${formatCount(asArray(blockers.assets).length)} missing asset groups` : "Assets ready for next step",
      tone: asArray(blockers.assets).length ? "is-warning" : "is-live",
      status: asArray(blockers.assets).length ? "Needs assets" : "Ready"
    },
    {
      title: "Connect platforms",
      meta: asArray(blockers.integrations).length ? `${formatCount(asArray(blockers.integrations).length)} integrations missing` : "Core integrations connected",
      tone: asArray(blockers.integrations).length ? "is-warning" : "is-live",
      status: asArray(blockers.integrations).length ? "Needs connection" : "Ready"
    },
    {
      title: "Build campaign",
      meta: campaign.name ? `Active: ${campaign.name}` : "No active campaign selected",
      tone: campaign.name ? "is-live" : "is-warning",
      status: campaign.name ? "Active" : "Missing"
    },
    {
      title: "Publish / execute",
      meta: launch.campaignReadiness === "Ready" ? "Execution path looks clear" : "Resolve blockers before publishing",
      tone: launch.campaignReadiness === "Ready" ? "is-live" : "is-warning",
      status: launch.campaignReadiness || "At risk"
    }
  ];
}

function pickRecommendedSpecialist(aiTeamCards = [], dashboard = {}) {
  const blockers = asObject(dashboard.blockers);
  const next = asString(dashboard.nextBestAction?.recommendation).toLowerCase();

  if (next.includes("video") || asArray(blockers.assets).length) {
    return (
      aiTeamCards.find((card) => /video/i.test(card.name || card.id || "")) ||
      aiTeamCards.find((card) => /media/i.test(card.name || card.id || "")) ||
      aiTeamCards.find((card) => /creative|brand|content/i.test(card.name || card.id || "")) ||
      aiTeamCards[0]
    );
  }

  if (asArray(blockers.integrations).length) {
    return aiTeamCards.find((card) => /operations|integrations|automation|system/i.test(card.name || card.id || "")) || aiTeamCards[0];
  }

  return aiTeamCards.find((card) => card.status === "Active role") || aiTeamCards[0] || null;
}


function routeForAction(action) {
  const text = asString(action).toLowerCase();
  if (/(video|media|product video|asset|library|upload|brand file)/.test(text)) return "library";
  if (/(connector|integration|sync|platform)/.test(text)) return "integrations";
  if (/(campaign|launch wave|brief)/.test(text)) return "campaign-studio";
  if (/(publish|schedule|queue)/.test(text)) return "publishing";
  if (/(ad|budget|paid)/.test(text)) return "ads-manager";
  if (/(content|copy)/.test(text)) return "content-studio";
  return "ai-command";
}

function buildAiTeamCards(state) {
  const operations = asObject(selectOperationsSnapshot(state));
  const notifications = asArray(operations.notifications?.items);
  const tasks = asArray(operations.tasks?.items);
  const approvals = asArray(operations.approvals?.items);

  const projectedMembers = getProjectedTeamMembers(state);
  const projectedActiveRole = asString(
    getProjectedActiveRole(state)
  ).toLowerCase();

  const roles = projectedMembers.length
    ? projectedMembers.map((member) => ({
        id: asString(member.role || member.id).toLowerCase(),
        name: asString(
          member.name ||
          member.role ||
          member.id ||
          "AI Specialist"
        ),
        fallback: asString(
          member.description ||
          member.summary ||
          "Ready to support this project."
        )
      }))
    : [
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
      status:
        role.id === projectedActiveRole
          ? "Active role"
          : humanizeStatus(statusRaw, "Idle"),
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
  const operations = asObject(selectOperationsSnapshot(state));

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
    asString(selectCurrentProject(state)) ||
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

  const rawNextAction = asString(recommendations[0]).trim() || fallbackAction;
  const nextAction = humanizeExecutiveAction(rawNextAction, "Ask AI Command");
  const nextActionRoute = routeForAction(rawNextAction || nextAction);

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

  const urgencyLabel = criticalGaps.length
    ? "Urgent"
    : failedExecutions.length
      ? "Attention"
      : "Normal";

  const workflowImpact = criticalGaps.length
    ? `Unblocks ${formatCount(criticalGaps.length)} critical path${criticalGaps.length === 1 ? "" : "s"}`
    : failedExecutions.length
      ? `Stabilizes ${formatCount(failedExecutions.length)} failed job${failedExecutions.length === 1 ? "" : "s"}`
      : "Maintains operational flow";

  const continuationSummary = nextScheduled
    ? `Next: ${humanizeStatus(nextScheduled.status, "Scheduled")} — ${formatRelativeDate(nextScheduled.scheduled_for || nextScheduled.updated_at)}`
    : "No scheduled action yet";

  const confidenceSummary = intelligenceScore > 0
    ? `Signals: ${formatCount(intelligenceScore)}`
    : "Needs input";

  const escalationSummary = pendingApprovals.length
    ? `${formatCount(pendingApprovals.length)} approval${pendingApprovals.length === 1 ? "" : "s"} required`
    : "No escalations";

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
        executiveHealthStrip: {
          statusLabel: campaignReadinessTone === "success" ? "Healthy" : totalBlockers ? "Attention" : "Unknown",
          confidenceLabel: intelligenceTone === "success" ? `Signals: ${formatCount(intelligenceScore)}` : "Needs Input",
          escalationLabel: failedExecutions.length ? `Escalations: ${formatCount(failedExecutions.length)}` : "None",
          approvals: formatCount(pendingApprovals.length),
          confidence: formatPercent(systemScore),
          escalations: formatCount(failedExecutions.length),
          summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
        },
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
      buttonLabel: nextActionRoute === "ai-command" ? "Start With AI" : `Fix In ${humanizeStatus(nextActionRoute)}`,
      urgencyLabel,
      workflowImpact,
      continuationSummary,
      confidenceSummary,
      escalationSummary
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
  disableStandardLayout: true,
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
    const aiTeamCards = buildAiTeamCards(state);

    const capabilityCards = asArray(dashboard.capabilities).slice(0, 4);
    const statusItems = asArray(dashboard.statusBoard).slice(0, 6);
    const campaignChannels = asArray(dashboard.campaign.channels);
    const blockerColumns = [
      { title: "Integrations", items: dashboard.blockers.integrations, tone: "warning" },
      { title: "Assets", items: dashboard.blockers.assets, tone: "warning" },
      { title: "Failed Jobs", items: dashboard.blockers.failedJobs, tone: "danger" },
      { title: "Readiness Gaps", items: dashboard.blockers.readinessGaps, tone: "warning" }
    ];
    const activeBlockerColumns = blockerColumns.filter((column) => asArray(column.items).length).slice(0, 4);

    const topAttentionCards = [
      {
        title: "Assets",
        detail: dashboard.blockers.assets.length
          ? `${formatCount(dashboard.blockers.assets.length)} missing asset groups need preparation.`
          : "Asset library looks ready for the current operating path.",
        tone: dashboard.blockers.assets.length ? "is-warning" : "is-live"
      },
      {
        title: "Integrations",
        detail: dashboard.blockers.integrations.length
          ? `${formatCount(dashboard.blockers.integrations.length)} platform connections need attention.`
          : "Required platform connections look stable.",
        tone: dashboard.blockers.integrations.length ? "is-warning" : "is-live"
      },
      {
        title: "Readiness gaps",
        detail: dashboard.blockers.readinessGaps.length
          ? `${formatCount(dashboard.blockers.readinessGaps.length)} readiness gap${dashboard.blockers.readinessGaps.length === 1 ? "" : "s"} still affect confidence.`
          : "No critical readiness gaps are currently blocking the main path.",
        tone: dashboard.blockers.readinessGaps.length ? "is-warning" : "is-live"
      }
    ];

    const operatingPath = buildOperatingPath(dashboard);
    const recommendedSpecialist = pickRecommendedSpecialist(aiTeamCards, dashboard);
    const attentionBlockerColumns = activeBlockerColumns.slice(0, 3);

    root.innerHTML = `
      <div class="home-command-center mhos-os-page">

        <section class="mhos-os-header" aria-label="Executive Command Brief">
          <div class="mhos-os-header-main">
            <div>
              <p class="mhos-os-kicker">AI Operations Command</p>
              <h1 class="mhos-os-title">${escapeHtml(dashboard.projectName || "Project Command Center")}</h1>
              <p class="mhos-os-subtitle">${escapeHtml(dashboard.oneLineSummary)}</p>
            </div>
            <div class="mhos-os-chip-row">
              ${renderBadge(dashboard.headerTone, dashboard.headerStatus, escapeHtml)}
              <span class="mhos-os-chip ${dashboard.totalBlockers ? "is-warning" : "is-live"}">
                <span class="mhos-os-live-dot"></span>
                ${escapeHtml(dashboard.totalBlockers ? `${formatCount(dashboard.totalBlockers)} attention signals` : "Clear path")}
              </span>
            </div>
          </div>

          <div class="mhos-os-brief-grid">
            <article class="mhos-os-brief-card mhos-motion-soft">
              <span class="mhos-os-brief-label">System Health</span>
              <strong class="mhos-os-brief-value">${escapeHtml(formatPercent(dashboard.health?.systemScore))}</strong>
              <span class="mhos-os-brief-hint">${escapeHtml(dashboardLabelFromScore(dashboard.health?.systemScore))}</span>
            </article>
            <article class="mhos-os-brief-card mhos-motion-soft">
              <span class="mhos-os-brief-label">Readiness</span>
              <strong class="mhos-os-brief-value">${escapeHtml(formatPercent(dashboard.health?.projectReadiness))}</strong>
              <span class="mhos-os-brief-hint">${escapeHtml(dashboard.totalBlockers ? "Needs focused action" : "Ready for next move")}</span>
            </article>
            <article class="mhos-os-brief-card mhos-motion-soft">
              <span class="mhos-os-brief-label">Connector Coverage</span>
              <strong class="mhos-os-brief-value">${escapeHtml(dashboard.health?.connectorCoverage || "0/0")}</strong>
              <span class="mhos-os-brief-hint">${escapeHtml(dashboard.blockers.integrations.length ? "Connections need attention" : "Core platforms connected")}</span>
            </article>
            <article class="mhos-os-brief-card mhos-motion-soft">
              <span class="mhos-os-brief-label">Primary Focus</span>
              <strong class="mhos-os-brief-value">${escapeHtml(dashboard.nextBestAction.route === "ai-command" ? "AI Guidance" : humanizeStatus(dashboard.nextBestAction.route))}</strong>
              <span class="mhos-os-brief-hint">${escapeHtml(dashboard.nextBestAction.urgencyLabel)}</span>
            </article>
          </div>
        </section>

        <div class="mhos-os-layout">
          <main class="mhos-os-main">

            <section class="mhos-os-decision-card mhos-motion-soft" aria-label="Primary Decision">
              <div class="mhos-os-chip-row">
                <span class="mhos-os-chip ${dashboard.nextBestAction.urgencyLabel === "Urgent" ? "is-danger" : dashboard.nextBestAction.urgencyLabel === "Attention" ? "is-warning" : "is-live"}">${escapeHtml(dashboard.nextBestAction.urgencyLabel)}</span>
                <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.workflowImpact)}</span>
                <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.confidenceSummary)}</span>
              </div>
              <div>
                <p class="mhos-os-kicker">Next Best Action</p>
                <h2 class="mhos-os-decision-title">${escapeHtml(dashboard.nextBestAction.recommendation)}</h2>
                <p class="mhos-os-decision-copy">${escapeHtml(dashboard.nextBestAction.whyItMatters)}</p>
              </div>
              <div class="mhos-os-chip-row">
                <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.continuationSummary)}</span>
                <span class="mhos-os-chip">Next: ${escapeHtml(humanizeStatus(dashboard.nextBestAction.route))}</span>
                <span class="mhos-os-chip">${escapeHtml(dashboard.nextBestAction.escalationSummary)}</span>
              </div>
              <div class="mhos-os-action-row">
                <button id="homeNextActionBtn" class="mhos-next-action-btn" type="button">
                  ${escapeHtml(dashboard.nextBestAction.buttonLabel)}
                </button>
                <button id="homeAskNextActionBtn" class="mhos-next-action-btn is-ghost" type="button">
                  Ask AI to explain
                </button>
                <button id="homeOpenOperationsBtn" class="btn btn-secondary btn-sm" type="button">
                  Operations Centers
                </button>
              </div>
            </section>

            <section class="mhos-os-section" aria-label="What Needs Attention">
              <div class="mhos-os-section-head">
                <div>
                  <p class="mhos-os-kicker">What needs attention</p>
                  <h2 class="mhos-os-section-title">${dashboard.totalBlockers ? "Top operating blockers" : "No critical blockers"}</h2>
                  <p class="mhos-os-section-copy">
                    ${dashboard.totalBlockers ? "The system is highlighting only the areas that affect the next operating move." : "The current path is clear. Continue with the next best action."}
                  </p>
                </div>
                ${renderBadge(dashboard.totalBlockers ? "warning" : "success", dashboard.totalBlockers ? `${formatCount(dashboard.totalBlockers)} signals` : "Clear", escapeHtml)}
              </div>

              <div class="mhos-os-attention-grid">
                ${topAttentionCards.map((item) => `
                  <article class="mhos-os-attention-card mhos-motion-soft">
                    <span class="mhos-os-chip ${escapeHtml(item.tone)}">${escapeHtml(item.title)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <span>${escapeHtml(item.detail)}</span>
                  </article>
                `).join("")}
              </div>
            </section>

            <section class="mhos-os-section" aria-label="Operating Path">
              <div class="mhos-os-section-head">
                <div>
                  <p class="mhos-os-kicker">Operating path</p>
                  <h2 class="mhos-os-section-title">From readiness to execution</h2>
                  <p class="mhos-os-section-copy">A simple guided path that keeps setup, assets, integrations, campaign, and execution in the right order.</p>
                </div>
              </div>

              <div class="mhos-os-path">
                ${operatingPath.map((step, index) => `
                  <article class="mhos-os-path-step mhos-motion-soft">
                    <span class="mhos-os-path-index">${index + 1}</span>
                    <div>
                      <h3 class="mhos-os-path-title">${escapeHtml(step.title)}</h3>
                      <p class="mhos-os-path-meta">${escapeHtml(step.meta)}</p>
                    </div>
                    <span class="mhos-os-chip ${escapeHtml(step.tone)}">${escapeHtml(step.status)}</span>
                  </article>
                `).join("")}
              </div>
            </section>

            <details class="mhos-os-evidence-panel">
              <summary class="mhos-os-panel-title">System details and evidence</summary>
              <div class="home-status-grid">
                <div class="home-status-item">
                  <span class="data-label">Publish Ready</span>
                  <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.publishReadiness))}</strong>
                </div>
                <div class="home-status-item">
                  <span class="data-label">Media Ready</span>
                  <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.mediaReadiness))}</strong>
                </div>
                <div class="home-status-item">
                  <span class="data-label">Email</span>
                  <strong>${escapeHtml(dashboard.launchSnapshot.emailReadiness)}</strong>
                </div>
                <div class="home-status-item">
                  <span class="data-label">Scheduled Jobs</span>
                  <strong>${escapeHtml(formatCount(dashboard.launchSnapshot.scheduledJobs))}</strong>
                </div>
              </div>

              ${attentionBlockerColumns.length ? `
                <div class="home-blocker-grid home-exception-grid">
                  ${attentionBlockerColumns.map((column) =>
                    renderBlockerColumn(column.title, column.items, column.tone, escapeHtml)
                  ).join("")}
                </div>
              ` : `
                <p class="mhos-os-panel-copy">No detailed blockers are currently available for this project.</p>
              `}

              <div class="home-status-board">
                ${statusItems.map((item) => `
                  <article class="home-status-board-card">
                    <span class="data-label">${escapeHtml(item.label)}</span>
                    <strong>${escapeHtml(item.value)}</strong>
                    <p>${escapeHtml(item.hint)}</p>
                  </article>
                `).join("")}
              </div>
            </details>

            <details class="mhos-os-evidence-panel">
              <summary class="mhos-os-panel-title">Recent activity</summary>
              ${renderActivityItems(dashboard.recentActivity, escapeHtml)}
            </details>

          </main>

          <aside class="mhos-os-rail" aria-label="Action and AI Guidance">

            <section class="mhos-os-action-panel">
              <div>
                <p class="mhos-os-kicker">Navigate & execute</p>
                <h2 class="mhos-os-panel-title">Safe next destinations</h2>
                <p class="mhos-os-panel-copy">Use the shortest route to complete the operating path.</p>
              </div>

              <button id="homeQuickReviewReadinessBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Review Setup Foundation</span>
                <span class="home-action-meta">Resolve foundation issues and complete setup.</span>
              </button>
              <button id="homeQuickUploadAssetBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Asset Library</span>
                <span class="home-action-meta">Prepare missing brand and campaign assets.</span>
              </button>
              <button id="homeQuickConnectPlatformBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Integrations</span>
                <span class="home-action-meta">Connect required platforms and providers.</span>
              </button>
              <button id="homeQuickStartCampaignBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Campaign Studio</span>
                <span class="home-action-meta">Build the next launch wave.</span>
              </button>
            </section>

            <section class="mhos-os-ai-panel">
              <div>
                <p class="mhos-os-kicker">Recommended AI Specialist</p>
                <h2 class="mhos-os-panel-title">${escapeHtml(recommendedSpecialist?.name || "Executive AI")}</h2>
                <p class="mhos-os-panel-copy">
                  ${escapeHtml(recommendedSpecialist?.summary || "Use AI Command to turn the current state into a clear operating plan.")}
                </p>
              </div>

              ${recommendedSpecialist ? `
                <button class="quick-action-btn mhos-motion-soft" type="button" data-role-id="${escapeHtml(recommendedSpecialist.id)}">
                  <span class="home-action-title">Ask ${escapeHtml(recommendedSpecialist.name)}</span>
                  <span class="home-action-meta">${escapeHtml(recommendedSpecialist.status || "Ready to guide")}</span>
                </button>
              ` : ""}

              <button id="homeQuickOpenAiBtn" class="quick-action-btn" type="button">
                <span class="home-action-title">Open AI Workspace</span>
                <span class="home-action-meta">Get guidance on the next best action.</span>
              </button>

              <button id="homeOpenAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
                Open AI Command
              </button>
              <button id="homeOpenFullAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
                Open Full Team
              </button>
            </section>

            <section class="mhos-os-ai-panel">
              <div>
                <p class="mhos-os-kicker">AI prompts</p>
                <h2 class="mhos-os-panel-title">Ask the system</h2>
              </div>

              <button id="homePromptNextBtn" class="home-ai-prompt-card" type="button">
                <span class="home-prompt-title">What is the next executive action?</span>
                <span class="home-prompt-meta">Clarify why this is the focus and what to do next.</span>
              </button>
              <button id="homePromptReadinessBtn" class="home-ai-prompt-card" type="button">
                <span class="home-prompt-title">Why is readiness low?</span>
                <span class="home-prompt-meta">Explain blockers and readiness gaps in operational terms.</span>
              </button>
              <button id="homePromptLaunchBtn" class="home-ai-prompt-card" type="button">
                <span class="home-prompt-title">Summarize launch blockers</span>
                <span class="home-prompt-meta">Prepare a launch risk summary.</span>
              </button>
              <button id="homePromptPlanBtn" class="home-ai-prompt-card" type="button">
                <span class="home-prompt-title">Turn next action into a plan</span>
                <span class="home-prompt-meta">Convert the next action into a stepwise operating plan.</span>
              </button>
            </section>

            <section class="mhos-os-evidence-panel">
              <p class="mhos-os-kicker">Customer operations</p>
              <h2 class="mhos-os-panel-title">Not enabled as a live channel yet</h2>
              <p class="mhos-os-panel-copy">
                ${escapeHtml(compactModuleState(dashboard.health?.customerOpsStatus, "Customer Ops activates when CRM/live channels are connected."))}
              </p>
              <span class="mhos-os-chip">${escapeHtml(compactModuleState(dashboard.health?.commReadiness, "Communication readiness activates when live channels are connected."))}</span>
            </section>

          </aside>
        </div>

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


    const handleAiRoleClick = (roleId, roleName) => {
      const projectLabel = dashboard.projectName || "this project";
      const rolePrompts = {
        strategist: `Act as the Strategist for ${projectLabel}. Review readiness, blockers, campaign state, and next best action. Give me the highest-impact strategic moves. Do not execute anything; prepare guidance only.`,
        writer: `Act as the Content Writer for ${projectLabel}. Review the current project context and suggest the next best writing actions, messaging angles, and content priorities. Do not execute anything; prepare guidance only.`,
        designer: `Act as the Media Director for ${projectLabel}. Review the visual/asset readiness and suggest the next best creative actions. Do not execute anything; prepare guidance only.`,
        video_lead: `Act as the Video Lead for ${projectLabel}. Review the project context and suggest the next best short-form/video actions. Do not execute anything; prepare guidance only.`,
        publisher: `Act as the Publisher for ${projectLabel}. Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing. Do not execute anything; prepare guidance only.`,
        ads_operator: `Act as the Ads Optimizer for ${projectLabel}. Review campaign readiness, channels, and paid media opportunities. Suggest next ad actions safely. Do not execute anything; prepare guidance only.`,
        analyst: `Act as the SEO & Insights Analyst for ${projectLabel}. Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next. Do not execute anything; prepare guidance only.`,
        compliance_reviewer: `Act as the Compliance Reviewer for ${projectLabel}. Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release. Do not execute anything; prepare guidance only.`,
        admin: `Act as the Operations Lead for ${projectLabel}. Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps. Do not execute anything; prepare guidance only.`
      };

      const prompt = rolePrompts[roleId] || `Act as the ${roleName} specialist for ${projectLabel}. Review the current project context and recommend the next best actions. Do not execute anything; prepare guidance only.`;
      openAiWithPrompt(prompt);
      showMessage?.(`${roleName} context prepared in AI Command.`);
    };

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
    const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
    if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");

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
      promptPlanBtn.onclick = () => openAiWithPrompt("Prepare today's action plan from the current dashboard. Give me prioritized tasks with owners and expected outcomes.");
    }

    const aiRoleCards = document.querySelectorAll(".home-ai-team-card, .mhos-specialist, .mhos-workflow-step[data-role-id]");
    aiRoleCards.forEach((card) => {
      const roleId = card.getAttribute("data-role-id");
      const roleName = card.querySelector("strong")?.textContent || "AI Specialist";
      card.onclick = () => handleAiRoleClick(roleId, roleName);
    });
  }
};
