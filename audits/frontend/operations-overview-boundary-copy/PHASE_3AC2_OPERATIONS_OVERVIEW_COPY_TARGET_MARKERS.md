# PHASE 3AC.2 — Operations Overview Copy Target Markers

## Candidate risky copy strings
1979:            <span class="std-context-eyebrow">Operations Command Layer</span>
1981:            <p class="std-context-description">A unified entry point for execution, queues, runtime jobs, and operational notifications for ${context.escapeHtml(projectName)}.</p>
1993:          title: "Execution Overview",
2003:                  <div class="panel-kicker">Command Handoff</div>
2004:                  <h3>Choose the operational surface</h3>
2046:                  <h3>Review before execution</h3>
2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>
2051:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
2052:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
2053:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>

## Relevant source ranges

### Operations Overview render
function renderOperationsCentersOverview(context) {
  const root = document.querySelector('[data-page="operations-centers"] .ops-shell');
  if (!root) return;

  const state = typeof context.getState === "function" ? context.getState() : {};
  const projectName = asString(state.activeProject || state.projectName || state.currentProject || "current project");
  const operations = asObject(asObject(state.data).operations);

  const taskCount = asArray(operations.tasks?.items || operations.tasks).length;
  const queueCount = asArray(operations.queue?.items || operations.queue).length;
  const jobCount = asArray(operations.jobs?.items || operations.jobs).length;
  const notificationCount = asArray(operations.notifications?.items || operations.notifications).length;

  const centers = [
    {
      route: "task-center",
      title: "Task Center",
      kicker: "Execution",
      count: taskCount,
      description: "Review generated tasks, owners, priorities, and execution readiness.",
      action: "Open Task Center"
    },
    {
      route: "queue-center",
      title: "Queue Center",
      kicker: "Operations Queue",
      count: queueCount,
      description: "Inspect queued jobs, waiting work, and operational pressure.",
      action: "Open Queue Center"
    },
    {
      route: "job-monitor",
      title: "Job Monitor",
      kicker: "Runtime",
      count: jobCount,
      description: "Monitor job status, failures, completed runs, and runtime signals.",
      action: "Open Job Monitor"
    },
    {
      route: "notification-center",
      title: "Notification Center",
      kicker: "Signals",
      count: notificationCount,
      description: "Review notifications, warnings, approvals, and attention signals.",
      action: "Open Notifications"
    }
  ];

  root.innerHTML = `
    <section class="page is-active" data-page="operations-centers">
      <div class="ops-workspace">
        <div class="std-context-ribbon">
          <div>
            <span class="std-context-eyebrow">Operations Command Layer</span>
            <h2>Operations Centers</h2>
            <p class="std-context-description">A unified entry point for execution, queues, runtime jobs, and operational notifications for ${context.escapeHtml(projectName)}.</p>
          </div>
          <div class="std-context-actions">
            <span class="std-context-chip"><span>Tasks</span><strong>${context.escapeHtml(formatCount(taskCount))}</strong></span>
            <span class="std-context-chip"><span>Queue</span><strong>${context.escapeHtml(formatCount(queueCount))}</strong></span>
            <span class="std-context-chip"><span>Jobs</span><strong>${context.escapeHtml(formatCount(jobCount))}</strong></span>
            <span class="std-context-chip"><span>Signals</span><strong>${context.escapeHtml(formatCount(notificationCount))}</strong></span>
          </div>
        </div>

        ${renderExecutiveRuntimeStrip(context, {
          kicker: "Operations",
          title: "Execution Overview",
          description: "Use this page as the routing hub from AI Team drafts, workflows, tasks, and runtime signals into the correct operations workspace.",
          badge: "Composite route"
        })}

        <div class="ops-layout-grid">
          <div class="ops-main-column">
            <section class="panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Command Handoff</div>
                  <h3>Choose the operational surface</h3>
                  <p>AI Team can prepare drafts, tasks, workflows, and handoffs. This overview routes the work to the correct operations center for review and monitoring.</p>
                </div>
              </div>

              <div class="ops-runtime-signal-grid">
                ${centers.map((center) => `
                  <article class="ops-runtime-signal">
                    <span>${context.escapeHtml(center.kicker)}</span>
                    <strong>${context.escapeHtml(center.title)}</strong>
                    <small>${context.escapeHtml(center.description)}</small>
                    <span class="card-badge neutral">${context.escapeHtml(formatCount(center.count))}</span>
                    <div class="ops-action-row">
                      <button class="btn btn-secondary" type="button" data-route="${context.escapeHtml(center.route)}">
                        ${context.escapeHtml(center.action)}
                      </button>
                    </div>
                  </article>
                `).join("")}
              </div>
            </section>
          </div>

          <aside class="ops-right-rail">
            <section class="panel ops-ai-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">AI Team Connection</div>
                  <h3>Operations Lead handoff</h3>
                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
                </div>
              </div>
              <div class="ops-action-row">
                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
              </div>
            </section>

            <section class="panel ops-action-panel mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Safety</div>
                  <h3>Review before execution</h3>
                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>
                </div>
              </div>
              <div class="ops-deferred-list">
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: create task from draft</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: execute workflow</button>
                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Planned: acknowledge signal</button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  `;

  bindRouteButtons(root, context);
}

export const operationsCentersRoute = {
  id: "operations-centers",
  label: "Operations Centers",
  template: `<section class="page is-active" data-page="operations-centers"><div class="ops-shell"></div></section>`,
  render(context) {
    renderOperationsCentersOverview(context);
  }
};

