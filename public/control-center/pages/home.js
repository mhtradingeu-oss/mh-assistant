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

  const completedExecutions = sortedExecution.filter((item) => statusTone(item?.execution_status) === "success");

  const readyCount = [
    asNumber(readinessScore) >= 80 ? 1 : 0,
    asNumber(connectorScore) >= 70 ? 1 : 0,
    failedExecutions.length === 0 ? 1 : 0
  ].reduce((sum, value) => sum + value, 0);

  const blockers = criticalGaps.length
    ? criticalGaps.slice(0, 4)
    : failedExecutions.slice(0, 4).map((item) => {
      const channel = humanizeStatus(item?.channel, "Channel");
      const status = humanizeStatus(item?.execution_status, "Failed");
      return `${channel}: ${status}`;
    });

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
        tone: statusTone("", systemScore)
      },
      {
        title: "Project Readiness",
        value: formatPercent(readinessScore),
        detail: criticalGaps.length ? `${formatCount(criticalGaps.length)} blockers` : "Ready for scale",
        tone: statusTone("", readinessScore)
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
      nextScheduledAction: nextScheduled
        ? `${humanizeStatus(nextScheduled.status, "Scheduled")}: ${formatRelativeDate(nextScheduled.scheduled_for || nextScheduled.updated_at)}`
        : "No scheduled action yet"
    },

    blockers,
    schedulerQueue,
    recentExecutionSummary,

    recent: {
      execution: latestExecution
        ? `${humanizeStatus(latestExecution.execution_status, "Completed")} on ${humanizeStatus(latestExecution.channel, "Channel")}`
        : "No execution recorded yet",
      recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "No recommendation generated yet",
      feedback: asString(learningLessons[0]).trim() || "No feedback captured yet"
    },

    aiChief: {
      title: "Executive AI Chief of Staff",
      description: "Turn live system signals into focused decisions for setup, execution, and growth.",
      prompts: [
        "Create a 24-hour executive plan from current readiness, blockers, and failed runs.",
        "Summarize the fastest path from current state to publishing-ready.",
        "Create owner-by-owner actions for Strategist, Writer, Analyst, and Operations.",
        "Recommend whether to improve setup, content, or publishing first and explain why."
      ]
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

function bindHomeActions({ $, navigateTo, showMessage, dashboard }) {
  const primaryBtn = $("homeExecPrimaryBtn");
  if (primaryBtn) {
    primaryBtn.onclick = () => {
      navigateTo(dashboard.primaryActionRoute);
    };
  }

  const secondaryBtn = $("homeExecSecondaryBtn");
  if (secondaryBtn) {
    secondaryBtn.onclick = () => {
      navigateTo(dashboard.secondaryActionRoute);
    };
  }

  const nextBtn = $("homeExecNextActionBtn");
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

  const campaignBtn = $("homeExecCampaignBtn");
  if (campaignBtn) {
    campaignBtn.onclick = () => {
      navigateTo("campaign-studio");
    };
  }

  const setupBtn = $("homeExecSetupBtn");
  if (setupBtn) {
    setupBtn.onclick = () => {
      navigateTo("setup");
    };
  }

  const teamButtons = Array.from(document.querySelectorAll("[data-home-exec-agent]"));
  teamButtons.forEach((button) => {
    button.onclick = () => {
      const role = asString(button.getAttribute("data-home-exec-agent")) || "team";
      const input = $("quickCommandInput");
      if (input) {
        input.value = `Create a concise action plan for the ${role} role using current project priorities and blockers.`;
      }
      navigateTo("ai-command");
      showMessage?.("Agent task opened in AI Command.");
    };
  });

  const aiPromptButtons = Array.from(document.querySelectorAll("[data-home-ai-prompt]"));
  aiPromptButtons.forEach((button) => {
    button.onclick = () => {
      const prompt = asString(button.getAttribute("data-home-ai-prompt"));
      const input = $("quickCommandInput");
      if (input) {
        input.value = prompt;
      }
      navigateTo("ai-command");
      showMessage?.("Executive prompt opened in AI Command.");
    };
  });

  const aiChiefBtn = $("homeExecAiChiefBtn");
  if (aiChiefBtn) {
    aiChiefBtn.onclick = () => {
      const input = $("quickCommandInput");
      if (input) {
        input.value = dashboard.aiChief.prompts[0];
      }
      navigateTo("ai-command");
    };
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
    const aiTeam = buildAiTeamCards(state);

    const root = $("homeExecRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="home-exec-shell">
        <section class="card home-exec-header">
          <div class="home-exec-header-main">
            <div>
              <div class="setup-kicker">${escapeHtml(dashboard.projectName || "Project not selected")}</div>
              <h3 class="home-exec-project">Executive Command Center</h3>
              <div class="home-exec-summary">${escapeHtml(dashboard.oneLineSummary)}</div>
            </div>
            <div class="home-exec-header-actions">
              <span class="card-badge ${dashboard.headerTone}">${escapeHtml(dashboard.headerStatus)}</span>
              <button id="homeExecPrimaryBtn" class="btn btn-primary" type="button">${escapeHtml(dashboard.primaryActionLabel)}</button>
              <button id="homeExecSecondaryBtn" class="btn btn-secondary" type="button">${escapeHtml(dashboard.secondaryActionLabel)}</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Page Power Summary</h3>
            <span class="card-badge neutral">Executive Snapshot</span>
          </div>
          <div class="home-exec-power-grid">
            ${dashboard.capabilities.map((capability) => `
              <article class="home-exec-power-card tone-${escapeHtml(capability.tone)}">
                <span class="data-label">${escapeHtml(capability.title)}</span>
                <strong>${escapeHtml(capability.value)}</strong>
                <p>${escapeHtml(capability.detail)}</p>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Current Status</h3>
            <span class="card-badge ${dashboard.health.criticalAlerts ? "warning" : "success"}">${dashboard.health.criticalAlerts ? "Needs attention" : "Stable"}</span>
          </div>
          <div class="home-exec-status-grid">
            ${dashboard.statusBoard.map((statusItem) => `
              <article class="home-exec-status-card tone-${escapeHtml(statusItem.tone)}">
                <span class="data-label">${escapeHtml(statusItem.label)}</span>
                <strong>${escapeHtml(statusItem.value)}</strong>
                <p>${escapeHtml(statusItem.hint)}</p>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="home-exec-main-grid">
          <section class="card home-exec-campaign">
            <div class="card-head">
              <h3>Main Work Area</h3>
              <span class="card-badge neutral">Campaign + Execution</span>
            </div>

            ${dashboard.campaign.name
              ? `
              <div class="home-exec-snapshot-grid">
                <div class="data-row"><span>Campaign name</span><strong>${escapeHtml(dashboard.campaign.name)}</strong></div>
                <div class="data-row"><span>Channels</span><strong>${escapeHtml(dashboard.campaign.channels.length ? dashboard.campaign.channels.join(", ") : "Not assigned")}</strong></div>
                <div class="data-row"><span>Current stage</span><strong>${escapeHtml(dashboard.campaign.currentStage)}</strong></div>
                <div class="data-row"><span>Next scheduled action</span><strong>${escapeHtml(dashboard.campaign.nextScheduledAction)}</strong></div>
              </div>
            `
              : `<div class="empty-box">No active campaign is selected yet. Start in Campaign Studio to create your launch plan.</div>`
            }

            <div class="home-exec-stream-block">
              <div class="home-exec-stream-head">
                <h4>Recent Execution Summary</h4>
              </div>
              ${dashboard.recentExecutionSummary.length
                ? `<ul class="home-exec-stream-list">
                    ${dashboard.recentExecutionSummary.map((item) => `
                      <li class="home-exec-stream-item">
                        <div>
                          <strong>${escapeHtml(item.channel)}</strong>
                          <p>${escapeHtml(item.when)}</p>
                        </div>
                        <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(item.status)}</span>
                      </li>
                    `).join("")}
                  </ul>`
                : `<div class="empty-box">No execution events yet. Run a workflow or schedule publishing to populate timeline.</div>`
              }
            </div>

            <div>
              <button id="homeExecCampaignBtn" class="btn btn-secondary" type="button">Open Campaign Studio</button>
            </div>
          </section>

          <section class="home-exec-side-stack">
            <section class="card home-exec-next">
              <div class="card-head">
                <h3>Smart Next Action</h3>
                <span class="card-badge warning">Recommended</span>
              </div>
              <p class="home-exec-next-title">${escapeHtml(dashboard.nextBestAction.recommendation)}</p>
              <p class="home-exec-next-why">${escapeHtml(dashboard.nextBestAction.whyItMatters)}</p>
              <div class="home-exec-next-actions">
                <button id="homeExecNextActionBtn" class="btn btn-primary" type="button">${escapeHtml(dashboard.nextBestAction.buttonLabel)}</button>
                <button id="homeExecSetupBtn" class="btn btn-secondary" type="button">Open Setup</button>
              </div>
            </section>

            <section class="card home-exec-blockers">
              <div class="card-head">
                <h3>Critical Blockers</h3>
                <span class="card-badge ${dashboard.blockers.length ? "danger" : "success"}">${dashboard.blockers.length ? "Action required" : "No critical blockers"}</span>
              </div>
              ${dashboard.blockers.length
                ? `<ul class="simple-list">
                    ${dashboard.blockers.map((blocker) => `<li>${escapeHtml(blocker)}</li>`).join("")}
                  </ul>`
                : `<div class="empty-box">No critical blockers are open. Continue by scaling the active campaign.</div>`
              }
            </section>

            <section class="card">
              <div class="card-head">
                <h3>Scheduler Queue</h3>
                <span class="card-badge neutral">Automation</span>
              </div>
              ${dashboard.schedulerQueue.length
                ? `<ul class="home-exec-stream-list">
                    ${dashboard.schedulerQueue.map((item) => `
                      <li class="home-exec-stream-item">
                        <div>
                          <strong>${escapeHtml(item.channel)}</strong>
                          <p>${escapeHtml(item.when)}</p>
                        </div>
                        <span class="card-badge ${escapeHtml(item.tone)}">${escapeHtml(item.status)}</span>
                      </li>
                    `).join("")}
                  </ul>`
                : `<div class="empty-box">No scheduled jobs. Use Publishing to queue the next execution wave.</div>`
              }
            </section>
          </section>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>AI Team Overview</h3>
            <span class="card-badge neutral">Role Agents</span>
          </div>
          <div class="home-exec-team-grid">
            ${aiTeam.map((agent) => `
              <article class="home-exec-agent-card">
                <div class="home-ai-agent-head">
                  <h4>${escapeHtml(agent.name)}</h4>
                  <span class="card-badge ${agent.tone}">${escapeHtml(agent.status)}</span>
                </div>
                <p class="home-exec-agent-summary">${escapeHtml(agent.summary)}</p>
                <button class="btn btn-secondary" type="button" data-home-exec-agent="${escapeHtml(agent.name)}">Open ${escapeHtml(agent.name)}</button>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="card home-exec-ai-chief">
          <div class="card-head">
            <h3>${escapeHtml(dashboard.aiChief.title)}</h3>
            <button id="homeExecAiChiefBtn" class="btn btn-primary" type="button">Open In AI Command</button>
          </div>
          <p class="home-exec-next-why">${escapeHtml(dashboard.aiChief.description)}</p>
          <div class="home-exec-ai-prompt-grid">
            ${dashboard.aiChief.prompts.map((prompt) => `
              <button class="btn btn-secondary home-exec-ai-prompt" type="button" data-home-ai-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>
            `).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h3>Recent Decision Memory</h3>
            <span class="card-badge neutral">Latest</span>
          </div>
          <div class="home-exec-recent-grid">
            <article class="home-exec-recent-card">
              <span class="data-label">Last execution</span>
              <p>${escapeHtml(dashboard.recent.execution)}</p>
            </article>
            <article class="home-exec-recent-card">
              <span class="data-label">Last recommendation</span>
              <p>${escapeHtml(dashboard.recent.recommendation)}</p>
            </article>
            <article class="home-exec-recent-card">
              <span class="data-label">Last feedback</span>
              <p>${escapeHtml(dashboard.recent.feedback)}</p>
            </article>
          </div>
        </section>

        <details class="card home-exec-advanced">
          <summary>
            <span>View details</span>
            <span class="card-badge neutral">Advanced</span>
          </summary>
          <div class="home-exec-snapshot-grid">
            <div class="data-row"><span>Project</span><strong>${escapeHtml(dashboard.advanced.projectName)}</strong></div>
            <div class="data-row"><span>Unread notifications</span><strong>${escapeHtml(formatCount(dashboard.advanced.notifications))}</strong></div>
            <div class="data-row"><span>Pending tasks</span><strong>${escapeHtml(formatCount(dashboard.advanced.pendingTasks))}</strong></div>
            <div class="data-row"><span>Pending approvals</span><strong>${escapeHtml(formatCount(dashboard.advanced.pendingApprovals))}</strong></div>
            <div class="data-row"><span>Scheduled jobs</span><strong>${escapeHtml(formatCount(dashboard.advanced.scheduledJobs))}</strong></div>
            <div class="data-row"><span>Execution records</span><strong>${escapeHtml(formatCount(dashboard.advanced.executionResults))}</strong></div>
            <div class="data-row"><span>Next schedule</span><strong>${escapeHtml(dashboard.advanced.nextSchedule)}</strong></div>
            <div class="data-row"><span>Last execution time</span><strong>${escapeHtml(dashboard.advanced.lastExecution)}</strong></div>
          </div>
        </details>
      </div>
    `;

    bindHomeActions({ $, navigateTo, showMessage, dashboard });
  }
};
