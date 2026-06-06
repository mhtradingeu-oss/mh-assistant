# 01 — AI Command File Ownership

Generated: Sat Jun  6 22:47:25 CEST 2026

## Candidate files
public/control-center/ai-team-model.js
public/control-center/asset-library.js
public/control-center/legacy/09-command-legacy-isolation.legacy.css
public/control-center/pages/ai-command.js
public/control-center/pages/ai-command/tool-dock.js
public/control-center/pages/campaign-studio.js
public/control-center/pages/content-studio-workspace.js
public/control-center/pages/library.js
public/control-center/pages/library/action-panel.js
public/control-center/pages/library/ai-panel.js
public/control-center/pages/library/catalog-readiness.js
public/control-center/pages/library/command-router.js
public/control-center/pages/library/listener-lifecycle.js
public/control-center/pages/library/projection-adapter.js
public/control-center/pages/library/session-store.js
public/control-center/pages/media-studio-workspace.js
public/control-center/runtime/command-runtime.js
public/control-center/styles/04-command-layer.css
public/control-center/styles/05-ai-layer.css

## Route / page references
public/control-center/ai-team-model.js:19:    primaryPages: ["home", "campaign-studio", "ai-command"],
public/control-center/ai-team-model.js:28:    primaryPages: ["content-studio", "campaign-studio", "ai-command"],
public/control-center/ai-team-model.js:55:    primaryPages: ["publishing", "queue-center", "ai-command"],
public/control-center/ai-team-model.js:111:  "ai-command": ["operations_lead", "strategist"],
public/control-center/ui/page-standard.js:8:  "ai-command",
public/control-center/ui/page-standard.js:23:    title: "Executive Command Center",
public/control-center/ui/page-standard.js:25:    primary: { label: "Open AI Workspace", route: "ai-command" },
public/control-center/ui/page-standard.js:49:  "ai-command": {
public/control-center/ui/page-standard.js:50:    eyebrow: "AI Workspace",
public/control-center/ui/page-standard.js:51:    title: "AI Workspace",
public/control-center/ui/page-standard.js:65:    title: "Campaign Command Center",
public/control-center/ui/page-standard.js:102:    primary: { label: "Generate Recommendations", route: "ai-command" },
public/control-center/ui/page-standard.js:132:  "focus-ai-send": "#aiCommandSendBtn",
public/control-center/ui/page-standard.js:309:    home: "Review blockers and ask AI Workspace for the next best operating plan.",
public/control-center/ui/page-standard.js:313:    "ai-command": "Run a structured task for the highest-risk blocker.",
public/control-center/ui/page-standard.js:359:    const input = document.getElementById("quickCommandInput");
public/control-center/ui/page-standard.js:365:    context.navigateTo?.("ai-command");
public/control-center/ui/page-standard.js:366:    context.showMessage?.("AI prompt queued in AI Workspace.");
public/control-center/ui/page-standard.js:432:      <button type="button" class="btn btn-secondary" id="stdSmartStripBtn">Open AI Workspace</button>
public/control-center/ui/page-standard.js:479:  const input = document.getElementById("quickCommandInput");
public/control-center/ui/page-standard.js:485:  context.navigateTo?.("ai-command");
public/control-center/ui/page-standard.js:486:  context.showMessage?.("AI prompt queued in AI Workspace.");
public/control-center/system-intelligence.js:192:      relatedPages: ["home", "integrations", "ai-command"]
public/control-center/system-intelligence.js:224:      relatedPages: ["workflows", "ai-command", "publishing"]
public/control-center/system-intelligence.js:272:      relatedPages: ["ai-command", "publishing"]
public/control-center/system-intelligence.js:303:      relatedPages: ["ai-command", "workflows"]
public/control-center/system-intelligence.js:309:      id: "library-source-of-truth",
public/control-center/system-intelligence.js:333:      relatedPages: ["home", "workflows", "ai-command"]
public/control-center/system-intelligence.js:386:    targetPage: "ai-command",
public/control-center/system-intelligence.js:387:    actionLabel: "Open AI Workspace",
public/control-center/system-intelligence.js:441:      summary: "Use AI Workspace to review priorities and proceed with the next operating step.",
public/control-center/system-intelligence.js:442:      targetPage: "ai-command",
public/control-center/system-intelligence.js:443:      actionLabel: "Open AI Workspace"
public/control-center/system-intelligence.js:453:      targetPage: "ai-command",
public/control-center/system-intelligence.js:454:      actionLabel: "Open AI Workspace"
public/control-center/system-intelligence.js:470:    targetPage: asString(candidate.targetPage || candidate.target_page) || "ai-command",
public/control-center/system-intelligence.js:471:    actionLabel: asString(candidate.actionLabel || candidate.action_label) || "Open AI Workspace"
public/control-center/index.html:119:            <button class="nav-item" data-route="ai-command" data-page="ai-command" type="button">AI Command</button>
public/control-center/index.html:155:          <button id="openAiBtn" class="btn btn-secondary" data-action="open-ai-command" type="button">
public/control-center/index.html:156:            Open AI Workspace
public/control-center/index.html:195:                aria-controls="globalCommandBar"
public/control-center/index.html:198:                Command
public/control-center/index.html:212:                AI Workspace
public/control-center/index.html:221:        <!-- Command bar -->
public/control-center/index.html:224:        <section id="globalCommandBar" class="command-bar" aria-hidden="true" hidden aria-label="Global command bar">
public/control-center/index.html:238:              id="quickCommandInput"
public/control-center/index.html:249:            <button id="runQuickCommandBtn" class="btn btn-primary" data-action="send-ai-command" type="button">Run</button>
public/control-center/automation-engine.js:251:    const targetPage = asString(rec?.targetPage || "ai-command");
public/control-center/automation-engine.js:339:  const destination = asString(step?.targetPage || "ai-command");
public/control-center/automation-engine.js:354:        lastCommand: prompt,
public/control-center/automation-engine.js:389:            lastCommand: prompt,
public/control-center/runtime/command-runtime.js:2:  Control Center Command Runtime
public/control-center/runtime/command-runtime.js:32:  - openGlobalCommandBar()
public/control-center/runtime/command-runtime.js:33:  - closeGlobalCommandBarSafe()
public/control-center/runtime/command-runtime.js:34:  - setMobileCommandExpanded()
public/control-center/runtime/command-runtime.js:48:function getCommandRuntimeSnapshot({
public/control-center/runtime/command-runtime.js:112:  initializeCommandRuntime()
public/control-center/runtime/command-runtime.js:113:  openCommandRuntime()
public/control-center/runtime/command-runtime.js:114:  closeCommandRuntime()
public/control-center/runtime/command-runtime.js:115:  toggleCommandRuntime()
public/control-center/runtime/command-runtime.js:116:  syncCommandRuntime()
public/control-center/runtime/command-runtime.js:126:  getCommandRuntimeSnapshot
public/control-center/runtime/authority/route-role-fallback.js:17:  "ai-command": ACTIVE_ROUTE_ROLES,
public/control-center/legacy/page-standard.legacy-20260508.js:8:  "ai-command",
public/control-center/legacy/page-standard.legacy-20260508.js:23:    title: "Executive Command Center",
public/control-center/legacy/page-standard.legacy-20260508.js:25:    primary: { label: "Open AI Workspace", route: "ai-command" },
public/control-center/legacy/page-standard.legacy-20260508.js:49:  "ai-command": {
public/control-center/legacy/page-standard.legacy-20260508.js:50:    eyebrow: "AI Workspace",
public/control-center/legacy/page-standard.legacy-20260508.js:51:    title: "AI Workspace",
public/control-center/legacy/page-standard.legacy-20260508.js:65:    title: "Campaign Command Center",
public/control-center/legacy/page-standard.legacy-20260508.js:102:    primary: { label: "Generate Recommendations", route: "ai-command" },
public/control-center/legacy/page-standard.legacy-20260508.js:130:  insights: { previous: "Publishing", next: "AI Command" },
public/control-center/legacy/page-standard.legacy-20260508.js:131:  "ai-command": { previous: "Insights", next: "Workflows" },
public/control-center/legacy/page-standard.legacy-20260508.js:132:  workflows: { previous: "AI Command", next: "Ads Manager" },
public/control-center/legacy/page-standard.legacy-20260508.js:142:    { label: "Ask executive AI", description: "Turn system state into a short action plan.", route: "ai-command" }
public/control-center/legacy/page-standard.legacy-20260508.js:160:    { label: "Diagnose with AI", description: "Send connector failures and coverage gaps to AI Command.", action: "focus-integration-ai" }
public/control-center/legacy/page-standard.legacy-20260508.js:162:  "ai-command": [
public/control-center/legacy/page-standard.legacy-20260508.js:170:    { label: "Build custom workflow with AI", description: "Use AI Workspace to assemble a workflow for the current blocker.", action: "focus-build-workflow" },
public/control-center/legacy/page-standard.legacy-20260508.js:195:    { label: "Copy publish payload", description: "Send selected publishing context to AI Command for packaging.", action: "focus-publishing-ai" },
public/control-center/legacy/page-standard.legacy-20260508.js:205:    { label: "Generate recommendations", description: "Turn performance signals into priorities.", route: "ai-command" },
public/control-center/legacy/page-standard.legacy-20260508.js:206:    { label: "Record feedback", description: "Preserve what worked and what failed in learning memory.", route: "ai-command" },
public/control-center/legacy/page-standard.legacy-20260508.js:257:  "ai-command": {
public/control-center/legacy/page-standard.legacy-20260508.js:350:  "focus-ai-send": "#aiCommandSendBtn",
public/control-center/legacy/page-standard.legacy-20260508.js:505:  const aiCommands = asArray(ops.ai_commands?.items);
public/control-center/legacy/page-standard.legacy-20260508.js:563:    aiCommandsTotal: asNumber(ops.ai_commands?.total, aiCommands.length),
public/control-center/legacy/page-standard.legacy-20260508.js:564:    aiCommandsCompleted: asNumber(ops.ai_commands?.completed_count, countByStatus(aiCommands, ["completed"])),
public/control-center/legacy/page-standard.legacy-20260508.js:597:      card("AI team", `${m.aiCommandsTotal} commands`, "Role-aware AI work and generated artifacts available to route.", m.aiCommandsTotal ? "success" : "neutral"),
public/control-center/legacy/page-standard.legacy-20260508.js:619:    "ai-command": [
public/control-center/legacy/page-standard.legacy-20260508.js:621:      card("Recent commands", String(m.aiCommandsTotal), "Structured and freeform commands recorded by the OS.", m.aiCommandsTotal ? "success" : "neutral"),
public/control-center/legacy/page-standard.legacy-20260508.js:676:      card("AI settings", m.aiCommandsTotal ? "In use" : "Configurable", "AI command and automation behavior can be governed here.", "success"),
public/control-center/legacy/page-standard.legacy-20260508.js:703:    "ai-command": [
public/control-center/legacy/page-standard.legacy-20260508.js:758:    card("Next step", firstText([m.recommendations[0]], "Open AI Workspace for guidance"), "Recommended operating move.", m.recommendations.length ? "warning" : "neutral")
public/control-center/legacy/page-standard.legacy-20260508.js:764:    home: "Review the highest-risk blocker and ask AI Command for an owner-by-owner plan.",
public/control-center/legacy/page-standard.legacy-20260508.js:768:    "ai-command": "Run a structured task for the highest-risk blocker and route the artifact.",
public/control-center/legacy/page-standard.legacy-20260508.js:859:          <button type="button" class="btn btn-primary std-full-width" id="stdNextBestActionBtn">Send To AI Command</button>
public/control-center/legacy/page-standard.legacy-20260508.js:925:    { label: "Open AI Workspace", route: "ai-command" },
public/control-center/legacy/page-standard.legacy-20260508.js:977:    const input = document.getElementById("quickCommandInput");
public/control-center/legacy/page-standard.legacy-20260508.js:979:    context.navigateTo("ai-command");
public/control-center/legacy/page-standard.legacy-20260508.js:980:    context.showMessage?.("AI prompt queued in AI Command.");
public/control-center/legacy/page-standard.legacy-20260508.js:1051:      const input = document.getElementById("quickCommandInput");
public/control-center/legacy/page-standard.legacy-20260508.js:1053:      context.navigateTo("ai-command");
public/control-center/legacy/page-standard.legacy-20260508.js:1054:      context.showMessage?.("AI prompt queued in AI Command.");
public/control-center/legacy/page-standard.legacy-20260508.js:1078:    "ai-command": [
public/control-center/legacy/page-standard.legacy-20260508.js:1166:  if (aiDescription) aiDescription.textContent = "AI assistance is available from AI Workspace.";
public/control-center/legacy/page-standard.legacy-20260508.js:1168:  if (nextBest) nextBest.textContent = "Open AI Workspace for the next recommended action.";
public/control-center/legacy/page-standard.legacy-20260508.js:1177:      context.navigateTo("ai-command");
public/control-center/legacy/page-standard.legacy-20260508.js:1178:      context.showMessage?.("AI Command opened.");
public/control-center/legacy/09-command-legacy-isolation.legacy.css:2:  Command Legacy Isolation
public/control-center/legacy/integrations.monolith-20260508.js:498:        dataScope: ["Alerts", "Commands", "Approvals"],
public/control-center/legacy/integrations.monolith-20260508.js:2527:      const input = $("quickCommandInput");
public/control-center/legacy/integrations.monolith-20260508.js:2531:      navigateTo("ai-command");
public/control-center/legacy/integrations.monolith-20260508.js:2532:      showMessage?.("Integration review prompt added to AI Command.");
public/control-center/legacy/styles.legacy-full.css:4282:  /* --- Recent Commands --- */
public/control-center/legacy/styles.legacy-full.css:4433:/* AI Command Operating Center (scoped) */
public/control-center/legacy/styles.legacy-full.css:4434:section[data-page="ai-command"] .aicmd-shell {
public/control-center/legacy/styles.legacy-full.css:4444:section[data-page="ai-command"] .aicmd-section {
public/control-center/legacy/styles.legacy-full.css:4452:section[data-page="ai-command"] .aicmd-section-head {
public/control-center/legacy/styles.legacy-full.css:4460:section[data-page="ai-command"] .aicmd-section-head h3 {
public/control-center/legacy/styles.legacy-full.css:4467:section[data-page="ai-command"] .aicmd-main-grid {
public/control-center/legacy/styles.legacy-full.css:4474:section[data-page="ai-command"] .aicmd-left-stack,
public/control-center/legacy/styles.legacy-full.css:4475:section[data-page="ai-command"] .aicmd-right-stack {
public/control-center/legacy/styles.legacy-full.css:4481:section[data-page="ai-command"] .aicmd-overview-grid {
public/control-center/legacy/styles.legacy-full.css:4487:section[data-page="ai-command"] .aicmd-stat {
public/control-center/legacy/styles.legacy-full.css:4497:section[data-page="ai-command"] .aicmd-stat span {
public/control-center/legacy/styles.legacy-full.css:4504:section[data-page="ai-command"] .aicmd-stat strong {
public/control-center/legacy/styles.legacy-full.css:4511:section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-full.css:4515:section[data-page="ai-command"] .aicmd-rec-title {
public/control-center/legacy/styles.legacy-full.css:4522:section[data-page="ai-command"] .aicmd-rec-reason {
public/control-center/legacy/styles.legacy-full.css:4529:section[data-page="ai-command"] .aicmd-chip-row {
public/control-center/legacy/styles.legacy-full.css:4536:section[data-page="ai-command"] .aicmd-chip {
public/control-center/legacy/styles.legacy-full.css:4548:section[data-page="ai-command"] .aicmd-chip.is-active {
public/control-center/legacy/styles.legacy-full.css:4554:section[data-page="ai-command"] .aicmd-input-grid {
public/control-center/legacy/styles.legacy-full.css:4561:section[data-page="ai-command"] .aicmd-label {
public/control-center/legacy/styles.legacy-full.css:4570:section[data-page="ai-command"] .aicmd-select,
public/control-center/legacy/styles.legacy-full.css:4571:section[data-page="ai-command"] .aicmd-input,
public/control-center/legacy/styles.legacy-full.css:4572:section[data-page="ai-command"] .aicmd-textarea {
public/control-center/legacy/styles.legacy-full.css:4582:section[data-page="ai-command"] .aicmd-select,
public/control-center/legacy/styles.legacy-full.css:4583:section[data-page="ai-command"] .aicmd-input {
public/control-center/legacy/styles.legacy-full.css:4588:section[data-page="ai-command"] .aicmd-textarea {
public/control-center/legacy/styles.legacy-full.css:4596:section[data-page="ai-command"] .aicmd-select:focus,
public/control-center/legacy/styles.legacy-full.css:4597:section[data-page="ai-command"] .aicmd-input:focus,
public/control-center/legacy/styles.legacy-full.css:4598:section[data-page="ai-command"] .aicmd-textarea:focus {
public/control-center/legacy/styles.legacy-full.css:4604:section[data-page="ai-command"] .aicmd-validation {
public/control-center/legacy/styles.legacy-full.css:4611:section[data-page="ai-command"] .aicmd-validation.is-visible {
public/control-center/legacy/styles.legacy-full.css:4615:section[data-page="ai-command"] .aicmd-action-row {
public/control-center/legacy/styles.legacy-full.css:4621:section[data-page="ai-command"] .aicmd-btn {
public/control-center/legacy/styles.legacy-full.css:4634:section[data-page="ai-command"] .aicmd-btn:hover {
public/control-center/legacy/styles.legacy-full.css:4638:section[data-page="ai-command"] .aicmd-btn:disabled {
public/control-center/legacy/styles.legacy-full.css:4643:section[data-page="ai-command"] .aicmd-btn-primary {
public/control-center/legacy/styles.legacy-full.css:4649:section[data-page="ai-command"] .aicmd-btn-secondary {
public/control-center/legacy/styles.legacy-full.css:4654:section[data-page="ai-command"] .aicmd-btn-ghost {
public/control-center/legacy/styles.legacy-full.css:4658:section[data-page="ai-command"] .aicmd-draft-state {
public/control-center/legacy/styles.legacy-full.css:4664:section[data-page="ai-command"] .aicmd-suggestions,
public/control-center/legacy/styles.legacy-full.css:4665:section[data-page="ai-command"] .aicmd-agent-grid {
public/control-center/legacy/styles.legacy-full.css:4670:section[data-page="ai-command"] .aicmd-suggestion-card,
public/control-center/legacy/styles.legacy-full.css:4671:section[data-page="ai-command"] .aicmd-agent-card {
public/control-center/legacy/styles.legacy-full.css:4679:section[data-page="ai-command"] .aicmd-suggestion-card h4,
public/control-center/legacy/styles.legacy-full.css:4680:section[data-page="ai-command"] .aicmd-agent-card h4 {
public/control-center/legacy/styles.legacy-full.css:4686:section[data-page="ai-command"] .aicmd-suggestion-card p,
public/control-center/legacy/styles.legacy-full.css:4687:section[data-page="ai-command"] .aicmd-agent-card p {
public/control-center/legacy/styles.legacy-full.css:4694:section[data-page="ai-command"] .aicmd-agent-meta {
public/control-center/legacy/styles.legacy-full.css:4698:section[data-page="ai-command"] .aicmd-agent-meta span {
public/control-center/legacy/styles.legacy-full.css:4707:section[data-page="ai-command"] .aicmd-empty-state {
public/control-center/legacy/styles.legacy-full.css:4717:section[data-page="ai-command"] .aicmd-result-time {
public/control-center/legacy/styles.legacy-full.css:4723:  section[data-page="ai-command"] .aicmd-main-grid {
public/control-center/legacy/styles.legacy-full.css:4727:  section[data-page="ai-command"] .aicmd-overview-grid {
public/control-center/legacy/styles.legacy-full.css:4731:  section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-full.css:4737:  section[data-page="ai-command"] .aicmd-shell {
public/control-center/legacy/styles.legacy-full.css:4741:  section[data-page="ai-command"] .aicmd-input-grid,
public/control-center/legacy/styles.legacy-full.css:4742:  section[data-page="ai-command"] .aicmd-overview-grid,
public/control-center/legacy/styles.legacy-full.css:4743:  section[data-page="ai-command"] .aicmd-agent-grid {
public/control-center/legacy/styles.legacy-full.css:4747:  section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-full.css:4751:  section[data-page="ai-command"] .aicmd-btn {
public/control-center/legacy/styles.legacy-20260508.css:2959:section[data-page="ai-command"] .aicmd-shell {
public/control-center/legacy/styles.legacy-20260508.css:2969:section[data-page="ai-command"] .aicmd-section {
public/control-center/legacy/styles.legacy-20260508.css:2977:section[data-page="ai-command"] .aicmd-section-head {
public/control-center/legacy/styles.legacy-20260508.css:2985:section[data-page="ai-command"] .aicmd-section-head h3 {
public/control-center/legacy/styles.legacy-20260508.css:2992:section[data-page="ai-command"] .aicmd-main-grid {
public/control-center/legacy/styles.legacy-20260508.css:2999:section[data-page="ai-command"] .aicmd-left-stack,
public/control-center/legacy/styles.legacy-20260508.css:3000:section[data-page="ai-command"] .aicmd-right-stack {
public/control-center/legacy/styles.legacy-20260508.css:3006:section[data-page="ai-command"] .aicmd-overview-grid {
public/control-center/legacy/styles.legacy-20260508.css:3012:section[data-page="ai-command"] .aicmd-stat {
public/control-center/legacy/styles.legacy-20260508.css:3022:section[data-page="ai-command"] .aicmd-stat span {
public/control-center/legacy/styles.legacy-20260508.css:3029:section[data-page="ai-command"] .aicmd-stat strong {
public/control-center/legacy/styles.legacy-20260508.css:3036:section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-20260508.css:3040:section[data-page="ai-command"] .aicmd-rec-title {
public/control-center/legacy/styles.legacy-20260508.css:3047:section[data-page="ai-command"] .aicmd-rec-reason {
public/control-center/legacy/styles.legacy-20260508.css:3054:section[data-page="ai-command"] .aicmd-chip-row {
public/control-center/legacy/styles.legacy-20260508.css:3061:section[data-page="ai-command"] .aicmd-chip {
public/control-center/legacy/styles.legacy-20260508.css:3073:section[data-page="ai-command"] .aicmd-chip.is-active {
public/control-center/legacy/styles.legacy-20260508.css:3079:section[data-page="ai-command"] .aicmd-input-grid {
public/control-center/legacy/styles.legacy-20260508.css:3086:section[data-page="ai-command"] .aicmd-label {
public/control-center/legacy/styles.legacy-20260508.css:3095:section[data-page="ai-command"] .aicmd-select,
public/control-center/legacy/styles.legacy-20260508.css:3096:section[data-page="ai-command"] .aicmd-input,
public/control-center/legacy/styles.legacy-20260508.css:3097:section[data-page="ai-command"] .aicmd-textarea {
public/control-center/legacy/styles.legacy-20260508.css:3107:section[data-page="ai-command"] .aicmd-select,
public/control-center/legacy/styles.legacy-20260508.css:3108:section[data-page="ai-command"] .aicmd-input {
public/control-center/legacy/styles.legacy-20260508.css:3113:section[data-page="ai-command"] .aicmd-textarea {
public/control-center/legacy/styles.legacy-20260508.css:3121:section[data-page="ai-command"] .aicmd-select:focus,
public/control-center/legacy/styles.legacy-20260508.css:3122:section[data-page="ai-command"] .aicmd-input:focus,
public/control-center/legacy/styles.legacy-20260508.css:3123:section[data-page="ai-command"] .aicmd-textarea:focus {
public/control-center/legacy/styles.legacy-20260508.css:3129:section[data-page="ai-command"] .aicmd-validation {
public/control-center/legacy/styles.legacy-20260508.css:3136:section[data-page="ai-command"] .aicmd-validation.is-visible {
public/control-center/legacy/styles.legacy-20260508.css:3140:section[data-page="ai-command"] .aicmd-action-row {
public/control-center/legacy/styles.legacy-20260508.css:3146:section[data-page="ai-command"] .aicmd-btn {
public/control-center/legacy/styles.legacy-20260508.css:3159:section[data-page="ai-command"] .aicmd-btn:hover {
public/control-center/legacy/styles.legacy-20260508.css:3163:section[data-page="ai-command"] .aicmd-btn:disabled {
public/control-center/legacy/styles.legacy-20260508.css:3168:section[data-page="ai-command"] .aicmd-btn-primary {
public/control-center/legacy/styles.legacy-20260508.css:3174:section[data-page="ai-command"] .aicmd-btn-secondary {
public/control-center/legacy/styles.legacy-20260508.css:3179:section[data-page="ai-command"] .aicmd-btn-ghost {
public/control-center/legacy/styles.legacy-20260508.css:3183:section[data-page="ai-command"] .aicmd-draft-state {
public/control-center/legacy/styles.legacy-20260508.css:3189:section[data-page="ai-command"] .aicmd-suggestions,
public/control-center/legacy/styles.legacy-20260508.css:3190:section[data-page="ai-command"] .aicmd-agent-grid {
public/control-center/legacy/styles.legacy-20260508.css:3195:section[data-page="ai-command"] .aicmd-suggestion-card,
public/control-center/legacy/styles.legacy-20260508.css:3196:section[data-page="ai-command"] .aicmd-agent-card {
public/control-center/legacy/styles.legacy-20260508.css:3204:section[data-page="ai-command"] .aicmd-suggestion-card h4,
public/control-center/legacy/styles.legacy-20260508.css:3205:section[data-page="ai-command"] .aicmd-agent-card h4 {
public/control-center/legacy/styles.legacy-20260508.css:3211:section[data-page="ai-command"] .aicmd-suggestion-card p,
public/control-center/legacy/styles.legacy-20260508.css:3212:section[data-page="ai-command"] .aicmd-agent-card p {
public/control-center/legacy/styles.legacy-20260508.css:3219:section[data-page="ai-command"] .aicmd-agent-meta {
public/control-center/legacy/styles.legacy-20260508.css:3223:section[data-page="ai-command"] .aicmd-agent-meta span {
public/control-center/legacy/styles.legacy-20260508.css:3232:section[data-page="ai-command"] .aicmd-empty-state {
public/control-center/legacy/styles.legacy-20260508.css:3242:section[data-page="ai-command"] .aicmd-result-time {
public/control-center/legacy/styles.legacy-20260508.css:3248:section[data-page="ai-command"] .aicmd-main-grid {
public/control-center/legacy/styles.legacy-20260508.css:3252:section[data-page="ai-command"] .aicmd-overview-grid {
public/control-center/legacy/styles.legacy-20260508.css:3256:section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-20260508.css:3262:section[data-page="ai-command"] .aicmd-shell {
public/control-center/legacy/styles.legacy-20260508.css:3266:section[data-page="ai-command"] .aicmd-input-grid,
public/control-center/legacy/styles.legacy-20260508.css:3267:section[data-page="ai-command"] .aicmd-overview-grid,
public/control-center/legacy/styles.legacy-20260508.css:3268:section[data-page="ai-command"] .aicmd-agent-grid {
public/control-center/legacy/styles.legacy-20260508.css:3272:section[data-page="ai-command"] .aicmd-stat-wide {
public/control-center/legacy/styles.legacy-20260508.css:3276:section[data-page="ai-command"] .aicmd-btn {
public/control-center/styles/15-clean-operating-layer.css:858:/* MH-OS Campaign Studio Command Header - Phase 1 */
public/control-center/styles/14-page-standard.css:425:   AI Workspace Recovery
public/control-center/styles/14-page-standard.css:430:.ai-command-card,
public/control-center/styles/14-page-standard.css:454:.ai-command-card button,
public/control-center/styles/14-page-standard.css:2819:[data-page="library"] .std-ai-btn[data-library-use-ai-source] {
public/control-center/styles/14-page-standard.css:2829:[data-page="library"] .std-ai-btn[data-library-use-ai-source]:hover {
public/control-center/styles/14-page-standard.css:2843:[data-page="library"] .std-ai-btn[data-library-use-ai-source] {
public/control-center/styles/14-page-standard.css:2853:[data-page="library"] .std-ai-btn[data-library-use-ai-source]::before {
public/control-center/styles/14-page-standard.css:2885:[data-page="library"] .std-ai-btn[data-library-use-ai-source] {
public/control-center/styles/08-components-foundation.css:81:.library-inspector-ai-source-guide {
public/control-center/styles/08-components-foundation.css:90:.library-inspector-ai-source-guide-text {
public/control-center/styles/08-components-foundation.css:93:.library-inspector-ai-source-guide.is-hidden {
public/control-center/styles/08-components-foundation.css:1620:.library-source-guide-inline {
public/control-center/styles/08-components-foundation.css:1624:.library-source-guide-inline .mhos-guide-box {
public/control-center/styles/08-components-foundation.css:1632:.library-source-guide-inline .mhos-guide-box-head {
public/control-center/styles/08-components-foundation.css:1637:.library-source-guide-inline .mhos-guide-box-body {
public/control-center/styles/12-pages.css:109:/* --- AI Command Header Session Density Polish --- */
public/control-center/styles/12-pages.css:110:[data-page="ai-command"] .aicmd-room-header {
public/control-center/styles/12-pages.css:117:[data-page="ai-command"] .aicmd-room-title {
public/control-center/styles/12-pages.css:123:[data-page="ai-command"] .aicmd-room-subtitle {
public/control-center/styles/12-pages.css:130:[data-page="ai-command"] .aicmd-room-header-actions {
public/control-center/styles/12-pages.css:136:[data-page="ai-command"] .aicmd-room-session-select {
public/control-center/styles/12-pages.css:141:[data-page="ai-command"] .aicmd-room-header-actions .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:142:[data-page="ai-command"] .aicmd-room-header-actions .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:148:[data-page="ai-command"] .aicmd-room-flow {
public/control-center/styles/12-pages.css:154:[data-page="ai-command"] .aicmd-room-flow-step {
public/control-center/styles/12-pages.css:162:[data-page="ai-command"] .aicmd-room-flow-step strong {
public/control-center/styles/12-pages.css:166:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:170:[data-page="ai-command"] .aicmd-room-status-strip {
public/control-center/styles/12-pages.css:179:/* --- AI Command Chat-First Unified Surface --- */
public/control-center/styles/12-pages.css:180:[data-page="ai-command"] .aicmd-unified-chat-surface {
public/control-center/styles/12-pages.css:193:[data-page="ai-command"] .aicmd-unified-chat-surface > * {
public/control-center/styles/12-pages.css:197:[data-page="ai-command"] .aicmd-unified-chat-surface > *:not(:last-child) {
public/control-center/styles/12-pages.css:201:[data-page="ai-command"] .aicmd-unified-chat-surface .aicmd-room-conversation-head {
public/control-center/styles/12-pages.css:209:[data-page="ai-command"] .aicmd-room-specialist-conversation {
public/control-center/styles/12-pages.css:217:[data-page="ai-command"] .aicmd-v2-composer.aicmd-room-composer.aicmd-chatgpt-composer {
public/control-center/styles/12-pages.css:226:[data-page="ai-command"] .aicmd-v2-composer-head {
public/control-center/styles/12-pages.css:234:[data-page="ai-command"] .aicmd-v2-composer-title-row {
public/control-center/styles/12-pages.css:241:[data-page="ai-command"] .aicmd-v2-composer-icon {
public/control-center/styles/12-pages.css:256:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:263:[data-page="ai-command"] .aicmd-v2-draft-state {
public/control-center/styles/12-pages.css:270:[data-page="ai-command"] .aicmd-chatgpt-input-shell {
public/control-center/styles/12-pages.css:274:[data-page="ai-command"] .aicmd-v2-textarea.aicmd-chatgpt-textarea {
public/control-center/styles/12-pages.css:289:[data-page="ai-command"] .aicmd-v2-textarea.aicmd-chatgpt-textarea:focus {
public/control-center/styles/12-pages.css:294:[data-page="ai-command"] .aicmd-chatgpt-toolbar {
public/control-center/styles/12-pages.css:302:[data-page="ai-command"] .aicmd-chatgpt-tools-left,
public/control-center/styles/12-pages.css:303:[data-page="ai-command"] .aicmd-chatgpt-tools-right {
public/control-center/styles/12-pages.css:309:[data-page="ai-command"] .aicmd-chatgpt-icon-btn {
public/control-center/styles/12-pages.css:323:[data-page="ai-command"] .aicmd-chatgpt-enter-hint {
public/control-center/styles/12-pages.css:328:[data-page="ai-command"] .aicmd-chatgpt-send-btn {
public/control-center/styles/12-pages.css:340:[data-page="ai-command"] .aicmd-chatgpt-send-btn:disabled {
public/control-center/styles/12-pages.css:345:[data-page="ai-command"] .aicmd-chatgpt-context-row {
public/control-center/styles/12-pages.css:350:[data-page="ai-command"] #aicmdV2Status {
public/control-center/styles/12-pages.css:1082:.library-inspector-ai-source-guide {
public/control-center/styles/12-pages.css:1091:.library-inspector-ai-source-guide-text {
public/control-center/styles/12-pages.css:1096:  Scope: page-specific layouts for Home, Setup, Library, and AI Workspace.
public/control-center/styles/12-pages.css:1462:/* AI Workspace operating context strip */
public/control-center/styles/12-pages.css:3371:   Scoped to AI Command page. Does not affect other pages.
public/control-center/styles/12-pages.css:4768:[data-page="ai-command"] {
public/control-center/styles/12-pages.css:4774:[data-page="ai-command"] .aicmd-v2-shell {
public/control-center/styles/12-pages.css:4783:[data-page="ai-command"] .aicmd-v2-header {
public/control-center/styles/12-pages.css:4791:[data-page="ai-command"] .aicmd-v2-header-meta,
public/control-center/styles/12-pages.css:4792:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:4799:[data-page="ai-command"] .aicmd-v2-header-meta {
public/control-center/styles/12-pages.css:4804:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:4808:[data-page="ai-command"] .aicmd-v2-meta-chip {
public/control-center/styles/12-pages.css:4819:[data-page="ai-command"] .aicmd-v2-meta-chip.is-project {
public/control-center/styles/12-pages.css:4823:[data-page="ai-command"] .aicmd-v2-meta-chip span,
public/control-center/styles/12-pages.css:4824:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:4829:[data-page="ai-command"] .aicmd-v2-meta-chip span {
public/control-center/styles/12-pages.css:4835:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:4842:[data-page="ai-command"] .aicmd-v2-body {
public/control-center/styles/12-pages.css:4848:[data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:4855:[data-page="ai-command"] .aicmd-v2-mode-toggle {
public/control-center/styles/12-pages.css:4863:[data-page="ai-command"] .aicmd-v2-toggle-btn {
public/control-center/styles/12-pages.css:4871:[data-page="ai-command"] .aicmd-v2-toggle-btn.is-active {
public/control-center/styles/12-pages.css:4876:[data-page="ai-command"] .aicmd-v2-team-mission {
public/control-center/styles/12-pages.css:4883:[data-page="ai-command"] .aicmd-v2-team-mission-label,
public/control-center/styles/12-pages.css:4884:[data-page="ai-command"] .aicmd-v2-team-mission-text {
public/control-center/styles/12-pages.css:4888:[data-page="ai-command"] .aicmd-v2-team-mission-label {
public/control-center/styles/12-pages.css:4892:[data-page="ai-command"] .aicmd-v2-rail-head {
public/control-center/styles/12-pages.css:4902:[data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:4906:[data-page="ai-command"] .aicmd-v2-spec-btn {
public/control-center/styles/12-pages.css:4914:[data-page="ai-command"] .aicmd-v2-spec-btn:hover {
public/control-center/styles/12-pages.css:4919:[data-page="ai-command"] .aicmd-v2-spec-btn.is-active {
public/control-center/styles/12-pages.css:4927:[data-page="ai-command"] .aicmd-v2-spec-icon {
public/control-center/styles/12-pages.css:4936:[data-page="ai-command"] .aicmd-v2-spec-name {
public/control-center/styles/12-pages.css:4940:[data-page="ai-command"] .aicmd-v2-spec-summary {
public/control-center/styles/12-pages.css:4944:[data-page="ai-command"] .aicmd-v2-main {
public/control-center/styles/12-pages.css:4951:[data-page="ai-command"] .aicmd-v2-composer,
public/control-center/styles/12-pages.css:4952:[data-page="ai-command"] .aicmd-v2-profile,
public/control-center/styles/12-pages.css:4953:[data-page="ai-command"] .aicmd-v2-tools,
public/control-center/styles/12-pages.css:4954:[data-page="ai-command"] .aicmd-v2-chat,
public/control-center/styles/12-pages.css:4955:[data-page="ai-command"] .aicmd-v2-preview,
public/control-center/styles/12-pages.css:4956:[data-page="ai-command"] .aicmd-v2-context,
public/control-center/styles/12-pages.css:4957:[data-page="ai-command"] .aicmd-v2-media-status,
public/control-center/styles/12-pages.css:4958:[data-page="ai-command"] .aicmd-v2-safety,
public/control-center/styles/12-pages.css:4959:[data-page="ai-command"] .aicmd-v2-history,
public/control-center/styles/12-pages.css:4960:[data-page="ai-command"] .aicmd-v2-prompts {
public/control-center/styles/12-pages.css:4966:[data-page="ai-command"] .aicmd-v2-composer {
public/control-center/styles/12-pages.css:4973:[data-page="ai-command"] .aicmd-v2-composer-head,
public/control-center/styles/12-pages.css:4974:[data-page="ai-command"] .aicmd-v2-composer-title-row {
public/control-center/styles/12-pages.css:4980:[data-page="ai-command"] .aicmd-v2-composer-head {
public/control-center/styles/12-pages.css:4984:[data-page="ai-command"] .aicmd-v2-composer-icon {
public/control-center/styles/12-pages.css:4994:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:4998:[data-page="ai-command"] .aicmd-v2-draft-state {
public/control-center/styles/12-pages.css:5008:[data-page="ai-command"] .aicmd-v2-lang-strip {
public/control-center/styles/12-pages.css:5014:[data-page="ai-command"] .aicmd-v2-planned-chip,
public/control-center/styles/12-pages.css:5015:[data-page="ai-command"] .aicmd-v2-readiness-chip,
public/control-center/styles/12-pages.css:5016:[data-page="ai-command"] .aicmd-v2-preview-chip {
public/control-center/styles/12-pages.css:5021:[data-page="ai-command"] .aicmd-v2-textarea {
public/control-center/styles/12-pages.css:5030:[data-page="ai-command"] .aicmd-v2-textarea:focus {
public/control-center/styles/12-pages.css:5035:[data-page="ai-command"] .aicmd-v2-quick-actions {
public/control-center/styles/12-pages.css:5041:[data-page="ai-command"] .aicmd-v2-quick-btn {
public/control-center/styles/12-pages.css:5055:[data-page="ai-command"] .aicmd-v2-quick-btn:hover {
public/control-center/styles/12-pages.css:5060:[data-page="ai-command"] .aicmd-v2-quick-btn strong {
public/control-center/styles/12-pages.css:5065:[data-page="ai-command"] .aicmd-v2-action-row {
public/control-center/styles/12-pages.css:5069:[data-page="ai-command"] .aicmd-v2-btn-primary,
public/control-center/styles/12-pages.css:5070:[data-page="ai-command"] .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:5071:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5077:[data-page="ai-command"] .aicmd-v2-btn-primary {
public/control-center/styles/12-pages.css:5083:[data-page="ai-command"] .aicmd-v2-btn-secondary {
public/control-center/styles/12-pages.css:5089:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5093:[data-page="ai-command"] .aicmd-v2-btn-primary:hover,
public/control-center/styles/12-pages.css:5094:[data-page="ai-command"] .aicmd-v2-btn-secondary:hover,
public/control-center/styles/12-pages.css:5095:[data-page="ai-command"] .aicmd-v2-btn-ghost:hover {
public/control-center/styles/12-pages.css:5100:[data-page="ai-command"] .aicmd-v2-btn-primary:hover {
public/control-center/styles/12-pages.css:5104:[data-page="ai-command"] .aicmd-v2-composer-hint {
public/control-center/styles/12-pages.css:5108:[data-page="ai-command"] .aicmd-v2-profile {
public/control-center/styles/12-pages.css:5112:[data-page="ai-command"] .aicmd-v2-profile-header {
public/control-center/styles/12-pages.css:5117:[data-page="ai-command"] .aicmd-v2-profile-icon {
public/control-center/styles/12-pages.css:5128:[data-page="ai-command"] .aicmd-v2-profile-title {
public/control-center/styles/12-pages.css:5132:[data-page="ai-command"] .aicmd-v2-profile-purpose {
public/control-center/styles/12-pages.css:5136:[data-page="ai-command"] .aicmd-v2-strength-row {
public/control-center/styles/12-pages.css:5142:[data-page="ai-command"] .aicmd-v2-strength-chip {
public/control-center/styles/12-pages.css:5151:[data-page="ai-command"] .aicmd-v2-strength-chip.is-tool {
public/control-center/styles/12-pages.css:5156:[data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5162:[data-page="ai-command"] .aicmd-v2-tab-btn {
public/control-center/styles/12-pages.css:5169:[data-page="ai-command"] .aicmd-v2-tab-btn span,
public/control-center/styles/12-pages.css:5170:[data-page="ai-command"] .aicmd-v2-tab-btn small {
public/control-center/styles/12-pages.css:5174:[data-page="ai-command"] .aicmd-v2-tab-btn.is-active {
public/control-center/styles/12-pages.css:5179:[data-page="ai-command"] .aicmd-v2-chat,
public/control-center/styles/12-pages.css:5180:[data-page="ai-command"] .aicmd-v2-preview {
public/control-center/styles/12-pages.css:5186:[data-page="ai-command"] .aicmd-v2-chat-title,
public/control-center/styles/12-pages.css:5187:[data-page="ai-command"] .aicmd-v2-preview-title,
public/control-center/styles/12-pages.css:5188:[data-page="ai-command"] .aicmd-v2-tools-title,
public/control-center/styles/12-pages.css:5189:[data-page="ai-command"] .aicmd-v2-context-label,
public/control-center/styles/12-pages.css:5190:[data-page="ai-command"] .aicmd-v2-history-title {
public/control-center/styles/12-pages.css:5194:[data-page="ai-command"] .aicmd-v2-chat-subtitle,
public/control-center/styles/12-pages.css:5195:[data-page="ai-command"] .aicmd-v2-preview-subtitle {
public/control-center/styles/12-pages.css:5199:[data-page="ai-command"] .aicmd-v2-chat-stack {
public/control-center/styles/12-pages.css:5204:[data-page="ai-command"] .aicmd-v2-chat-card {
public/control-center/styles/12-pages.css:5210:[data-page="ai-command"] .aicmd-v2-chat-card.is-latest {
public/control-center/styles/12-pages.css:5214:[data-page="ai-command"] .aicmd-v2-chat-meta,
public/control-center/styles/12-pages.css:5215:[data-page="ai-command"] .aicmd-v2-chat-label,
public/control-center/styles/12-pages.css:5216:[data-page="ai-command"] .aicmd-v2-preview-label,
public/control-center/styles/12-pages.css:5217:[data-page="ai-command"] .aicmd-v2-preview-what-heading,
public/control-center/styles/12-pages.css:5218:[data-page="ai-command"] .aicmd-v2-context-item-label {
public/control-center/styles/12-pages.css:5222:[data-page="ai-command"] .aicmd-v2-chat-latest {
public/control-center/styles/12-pages.css:5226:[data-page="ai-command"] .aicmd-v2-chat-user,
public/control-center/styles/12-pages.css:5227:[data-page="ai-command"] .aicmd-v2-chat-response {
public/control-center/styles/12-pages.css:5232:[data-page="ai-command"] .aicmd-v2-chat-response p {
public/control-center/styles/12-pages.css:5236:[data-page="ai-command"] .aicmd-v2-chat-actions,
public/control-center/styles/12-pages.css:5237:[data-page="ai-command"] .aicmd-v2-preview-actions {
public/control-center/styles/12-pages.css:5241:[data-page="ai-command"] .aicmd-v2-preview-empty-state {
public/control-center/styles/12-pages.css:5252:[data-page="ai-command"] .aicmd-v2-preview-empty-state strong {
public/control-center/styles/12-pages.css:5256:[data-page="ai-command"] .aicmd-v2-preview-empty-state span {
public/control-center/styles/12-pages.css:5261:[data-page="ai-command"] .aicmd-v2-preview-body {
public/control-center/styles/12-pages.css:5265:[data-page="ai-command"] .aicmd-v2-preview-empty-state {
public/control-center/styles/12-pages.css:5270:[data-page="ai-command"] .aicmd-v2-chat-card {
public/control-center/styles/12-pages.css:5274:[data-page="ai-command"] .aicmd-v2-chat-card:hover {
public/control-center/styles/12-pages.css:5279:[data-page="ai-command"] .aicmd-v2-btn-primary:focus-visible,
public/control-center/styles/12-pages.css:5280:[data-page="ai-command"] .aicmd-v2-btn-secondary:focus-visible,
public/control-center/styles/12-pages.css:5281:[data-page="ai-command"] .aicmd-v2-btn-ghost:focus-visible {
public/control-center/styles/12-pages.css:5286:[data-page="ai-command"] .aicmd-v2-tool-btn:focus-visible {
public/control-center/styles/12-pages.css:5292:[data-page="ai-command"] .aicmd-v2-prompt-chip:focus-visible {
public/control-center/styles/12-pages.css:5298:[data-page="ai-command"] .aicmd-v2-spec-btn:focus-visible {
public/control-center/styles/12-pages.css:5303:[data-page="ai-command"] .aicmd-v2-preview-output-title {
public/control-center/styles/12-pages.css:5307:[data-page="ai-command"] .aicmd-v2-preview-summary,
public/control-center/styles/12-pages.css:5308:[data-page="ai-command"] .aicmd-v2-preview-draft {
public/control-center/styles/12-pages.css:5312:[data-page="ai-command"] .aicmd-v2-preview-draft {
public/control-center/styles/12-pages.css:5323:[data-page="ai-command"] .aicmd-v2-preview-structured-grid {
public/control-center/styles/12-pages.css:5330:[data-page="ai-command"] .aicmd-v2-preview-section {
public/control-center/styles/12-pages.css:5338:[data-page="ai-command"] .aicmd-v2-preview-section + .aicmd-v2-preview-section {
public/control-center/styles/12-pages.css:5342:[data-page="ai-command"] .aicmd-v2-preview-list li,
public/control-center/styles/12-pages.css:5343:[data-page="ai-command"] .aicmd-v2-preview-steps li {
public/control-center/styles/12-pages.css:5347:[data-page="ai-command"] .aicmd-v2-tools-head,
public/control-center/styles/12-pages.css:5348:[data-page="ai-command"] .aicmd-v2-history-head {
public/control-center/styles/12-pages.css:5355:[data-page="ai-command"] .aicmd-v2-tools-subtitle,
public/control-center/styles/12-pages.css:5356:[data-page="ai-command"] .aicmd-v2-tools-count,
public/control-center/styles/12-pages.css:5357:[data-page="ai-command"] .aicmd-v2-history-count {
public/control-center/styles/12-pages.css:5363:[data-page="ai-command"] .aicmd-v2-tools-grid {
public/control-center/styles/12-pages.css:5367:[data-page="ai-command"] .aicmd-v2-tool-btn {
public/control-center/styles/12-pages.css:5374:[data-page="ai-command"] .aicmd-v2-tool-label {
public/control-center/styles/12-pages.css:5378:[data-page="ai-command"] .aicmd-v2-tool-meta {
public/control-center/styles/12-pages.css:5385:[data-page="ai-command"] .aicmd-v2-tool-meta span {
public/control-center/styles/12-pages.css:5395:[data-page="ai-command"] .aicmd-v2-context-grid {
public/control-center/styles/12-pages.css:5399:[data-page="ai-command"] .aicmd-v2-context-item {
public/control-center/styles/12-pages.css:5405:[data-page="ai-command"] .aicmd-v2-context-item.is-scoped {
public/control-center/styles/12-pages.css:5410:[data-page="ai-command"] .aicmd-v2-context-item.is-scoped .aicmd-v2-context-item-label {
public/control-center/styles/12-pages.css:5414:[data-page="ai-command"] .aicmd-v2-media-status-list {
public/control-center/styles/12-pages.css:5419:[data-page="ai-command"] .aicmd-v2-media-status-list li {
public/control-center/styles/12-pages.css:5423:[data-page="ai-command"] .aicmd-v2-history-list {
public/control-center/styles/12-pages.css:5429:[data-page="ai-command"] .aicmd-v2-history-item {
public/control-center/styles/12-pages.css:5438:[data-page="ai-command"] .aicmd-v2-history-type {
public/control-center/styles/12-pages.css:5443:[data-page="ai-command"] .aicmd-v2-history-item strong {
public/control-center/styles/12-pages.css:5448:[data-page="ai-command"] .aicmd-v2-history-item p {
public/control-center/styles/12-pages.css:5455:[data-page="ai-command"] .aicmd-v2-readiness-strip {
public/control-center/styles/12-pages.css:5460:  [data-page="ai-command"] .aicmd-v2-quick-actions,
public/control-center/styles/12-pages.css:5461:  [data-page="ai-command"] .aicmd-v2-context-grid {
public/control-center/styles/12-pages.css:5465:  [data-page="ai-command"] .aicmd-v2-tools-grid {
public/control-center/styles/12-pages.css:5471:  [data-page="ai-command"] .aicmd-v2-shell {
public/control-center/styles/12-pages.css:5475:  [data-page="ai-command"] .aicmd-v2-body {
public/control-center/styles/12-pages.css:5479:  [data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:5484:  [data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5489:  [data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5493:  [data-page="ai-command"] .aicmd-v2-preview-structured-grid,
public/control-center/styles/12-pages.css:5494:  [data-page="ai-command"] .aicmd-v2-media-status-list {
public/control-center/styles/12-pages.css:5500:  [data-page="ai-command"] .aicmd-v2-header {
public/control-center/styles/12-pages.css:5504:  [data-page="ai-command"] .aicmd-v2-header-actions,
public/control-center/styles/12-pages.css:5505:  [data-page="ai-command"] .aicmd-v2-header-actions button,
public/control-center/styles/12-pages.css:5506:  [data-page="ai-command"] .aicmd-v2-action-row button {
public/control-center/styles/12-pages.css:5510:  [data-page="ai-command"] .aicmd-v2-quick-actions,
public/control-center/styles/12-pages.css:5511:  [data-page="ai-command"] .aicmd-v2-context-grid,
public/control-center/styles/12-pages.css:5512:  [data-page="ai-command"] .aicmd-v2-tools-grid,
public/control-center/styles/12-pages.css:5513:  [data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5737:[data-page="ai-command"] .aicmd-v2-composer {
public/control-center/styles/12-pages.css:5744:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:5760:[data-page="ai-command"] .aicmd-v2-action-row {
public/control-center/styles/12-pages.css:5765:[data-page="ai-command"] #aicmdV2AskBtn {
public/control-center/styles/12-pages.css:5770:[data-page="ai-command"] .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:5771:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5775:[data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:5779:[data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5783:[data-page="ai-command"] .aicmd-v2-spec-btn {
public/control-center/styles/12-pages.css:5787:[data-page="ai-command"] .aicmd-v2-spec-summary {
public/control-center/styles/12-pages.css:5794:[data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5798:[data-page="ai-command"] .aicmd-v2-tab-btn small {
public/control-center/styles/12-pages.css:5802:[data-page="ai-command"] .aicmd-v2-chat-composer-note {
public/control-center/styles/12-pages.css:5808:   Page-scoped operating room layout for AI Command.
public/control-center/styles/12-pages.css:5811:[data-page="ai-command"] {
public/control-center/styles/12-pages.css:5816:[data-page="ai-command"] [data-role="strategist"] { --role-accent: #22d3ee; --role-soft: rgba(34, 211, 238, 0.12); }
public/control-center/styles/12-pages.css:5817:[data-page="ai-command"] [data-role="writer"] { --role-accent: #a78bfa; --role-soft: rgba(167, 139, 250, 0.12); }
public/control-center/styles/12-pages.css:5818:[data-page="ai-command"] [data-role="media"] { --role-accent: #f472b6; --role-soft: rgba(244, 114, 182, 0.12); }
public/control-center/styles/12-pages.css:5819:[data-page="ai-command"] [data-role="video_lead"] { --role-accent: #fb7185; --role-soft: rgba(251, 113, 133, 0.12); }
public/control-center/styles/12-pages.css:5820:[data-page="ai-command"] [data-role="publisher"] { --role-accent: #38bdf8; --role-soft: rgba(56, 189, 248, 0.12); }
public/control-center/styles/12-pages.css:5821:[data-page="ai-command"] [data-role="ads"] { --role-accent: #f59e0b; --role-soft: rgba(245, 158, 11, 0.12); }
public/control-center/styles/12-pages.css:5822:[data-page="ai-command"] [data-role="analyst"] { --role-accent: #34d399; --role-soft: rgba(52, 211, 153, 0.12); }
public/control-center/styles/12-pages.css:5823:[data-page="ai-command"] [data-role="compliance_reviewer"] { --role-accent: #60a5fa; --role-soft: rgba(96, 165, 250, 0.12); }
public/control-center/styles/12-pages.css:5824:[data-page="ai-command"] [data-role="operations"] { --role-accent: #c084fc; --role-soft: rgba(192, 132, 252, 0.12); }
public/control-center/styles/12-pages.css:5825:[data-page="ai-command"] [data-role="customer_ops"] { --role-accent: #2dd4bf; --role-soft: rgba(45, 212, 191, 0.12); }
public/control-center/styles/12-pages.css:5826:[data-page="ai-command"] [data-role="sales_crm"] { --role-accent: #fbbf24; --role-soft: rgba(251, 191, 36, 0.12); }
public/control-center/styles/12-pages.css:5827:[data-page="ai-command"] [data-role="team"] { --role-accent: #22d3ee; --role-soft: rgba(34, 211, 238, 0.12); }
public/control-center/styles/12-pages.css:5829:[data-page="ai-command"] .aicmd-v2-composer-label,
public/control-center/styles/12-pages.css:5830:[data-page="ai-command"] .aicmd-v2-tool-label,
public/control-center/styles/12-pages.css:5831:[data-page="ai-command"] .aicmd-room-active-copy strong,
public/control-center/styles/12-pages.css:5832:[data-page="ai-command"] .aicmd-room-output-body h3,
public/control-center/styles/12-pages.css:5833:[data-page="ai-command"] .aicmd-room-panel-head strong {
public/control-center/styles/12-pages.css:5837:[data-page="ai-command"] .aicmd-v2-chat-card,
public/control-center/styles/12-pages.css:5838:[data-page="ai-command"] .aicmd-v2-chat-empty,
public/control-center/styles/12-pages.css:5839:[data-page="ai-command"] .aicmd-v2-composer-primary-note,
public/control-center/styles/12-pages.css:5840:[data-page="ai-command"] .aicmd-room-response-card {
public/control-center/styles/12-pages.css:5844:[data-page="ai-command"] .aicmd-room-shell {
public/control-center/styles/12-pages.css:5851:[data-page="ai-command"] .aicmd-room-header {
public/control-center/styles/12-pages.css:5861:[data-page="ai-command"] .aicmd-room-title-block {
public/control-center/styles/12-pages.css:5865:[data-page="ai-command"] .aicmd-room-eyebrow,
public/control-center/styles/12-pages.css:5866:[data-page="ai-command"] .aicmd-room-kicker,
public/control-center/styles/12-pages.css:5867:[data-page="ai-command"] .aicmd-room-panel-kicker {
public/control-center/styles/12-pages.css:5876:[data-page="ai-command"] .aicmd-room-title {
public/control-center/styles/12-pages.css:5884:[data-page="ai-command"] .aicmd-room-subtitle {
public/control-center/styles/12-pages.css:5892:[data-page="ai-command"] .aicmd-room-header-actions {
public/control-center/styles/12-pages.css:5896:[data-page="ai-command"] .aicmd-room-meta {
public/control-center/styles/12-pages.css:5900:[data-page="ai-command"] .aicmd-room-flow {
public/control-center/styles/12-pages.css:5907:[data-page="ai-command"] .aicmd-room-flow-step {
public/control-center/styles/12-pages.css:5920:[data-page="ai-command"] .aicmd-room-flow-step.is-active {
public/control-center/styles/12-pages.css:5926:[data-page="ai-command"] .aicmd-room-flow-step.is-complete {
public/control-center/styles/12-pages.css:5930:[data-page="ai-command"] .aicmd-room-flow-number {
public/control-center/styles/12-pages.css:5943:[data-page="ai-command"] .aicmd-room-flow-step strong,
public/control-center/styles/12-pages.css:5944:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:5952:[data-page="ai-command"] .aicmd-room-flow-step strong {
public/control-center/styles/12-pages.css:5956:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:5960:[data-page="ai-command"] .aicmd-room-grid {
public/control-center/styles/12-pages.css:5969:[data-page="ai-command"] .aicmd-room-team-panel,
public/control-center/styles/12-pages.css:5970:[data-page="ai-command"] .aicmd-room-center,
public/control-center/styles/12-pages.css:5971:[data-page="ai-command"] .aicmd-room-output {
public/control-center/styles/12-pages.css:5975:[data-page="ai-command"] .aicmd-room-team-panel,
public/control-center/styles/12-pages.css:5976:[data-page="ai-command"] .aicmd-room-output {
public/control-center/styles/12-pages.css:5983:[data-page="ai-command"] .aicmd-room-team-panel {
