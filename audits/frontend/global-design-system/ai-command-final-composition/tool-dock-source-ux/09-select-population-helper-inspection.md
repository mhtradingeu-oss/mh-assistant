# AI-COMMAND-GDS-2F — Select Population Helper Inspection

Generated: Sat Jun  6 23:31:56 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: c01297d

## Helper definitions
1182:function joinMetaList(value = []) {
1186:function getToolMetaList(tool = {}, key = "", fallback = []) {
1387:function populateDrawerSelect(select, rawValue = "", fallbackLabel = "Auto") {
1552:function openToolDrawer({ drawer, btn, text, input, session, projectName, persistSessionDraft, sessionKey, updateStatus }) {
1608:export function openAiToolDrawerFromMetadata({

## Excerpts
      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
      outputTypes: ["lead_brief", "fit_summary", "opportunity_notes", "risk_notes", "outreach_recommendation"],
      template: "Create a lead brief for {projectName}. Include profile, need, fit, opportunity, risks, and recommended outreach."
    }
  ]
};

function getSpecialistTools(specialistId = "") {
  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
}

export function getAiToolDockTools({ specialistId = "", teamMode = "solo", limit = 9 } = {}) {
  const tools = teamMode === "team"
    ? [
      ...TOOL_DOCK_BY_SPECIALIST.strategist.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.writer.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
    ]
    : getSpecialistTools(specialistId);

  return Number.isFinite(limit) ? tools.slice(0, limit) : tools.slice();
}

function getDockTools({ specialistId = "", teamMode = "solo" } = {}) {
  if (teamMode === "team") {
    return [
      ...TOOL_DOCK_BY_SPECIALIST.strategist.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.writer.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
    ];
  }

  return getSpecialistTools(specialistId).slice(0, 9);
}

function tokenReplace(template = "", values = {}) {
  return String(template)
    .replace(/\{projectName\}/g, values.projectName || "this project")
    .replace(/\{campaign\}/g, values.campaign || "the active campaign")
    .replace(/\{specialistLabel\}/g, values.specialistLabel || "the active specialist");
}

function joinMetaList(value = []) {
  return Array.isArray(value) ? value.filter(Boolean).join("|") : "";
}

function getToolMetaList(tool = {}, key = "", fallback = []) {
  const value = tool?.[key];
  return Array.isArray(value) && value.length ? value : fallback;
}

function renderSmartToolDrawerShell(safe) {
  return `
    <aside class="mhos-tool-drawer" data-aicmd-tool-drawer hidden aria-hidden="true">
      <div class="mhos-tool-drawer-backdrop" data-aicmd-tool-drawer-close></div>
      <section class="mhos-tool-drawer-card" role="dialog" aria-modal="true" aria-label="Smart tool setup">
        <div class="mhos-tool-drawer-head">
          <div class="mhos-tool-drawer-title-block">
            <span class="mhos-tool-drawer-icon" data-aicmd-tool-drawer-icon>✦</span>
            <div>
              <p class="mhos-tool-drawer-kicker" data-aicmd-tool-drawer-action>Smart tool</p>
              <h3 data-aicmd-tool-drawer-title>Tool setup</h3>
            </div>
          </div>
          <button class="mhos-tool-drawer-close" type="button" data-aicmd-tool-drawer-close aria-label="Close tool drawer">×</button>
        </div>

        <p class="mhos-tool-drawer-description" data-aicmd-tool-drawer-description>
          Choose the output, source, and destination before preparing a review-only composer prompt.
        </p>

        <div class="mhos-tool-drawer-grid">
          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">1. Output type</span>
            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-output-select></select>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">2. Source / input</span>
            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-source-select></select>
            <div class="mhos-tool-drawer-selected-source" data-aicmd-tool-drawer-selected-source></div>
            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">3. Destination</span>
            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-destination-select></select>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">4. Options</span>
            <div class="mhos-tool-drawer-two-col">
              <label>
                <span>Language</span>
                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-language>
                  <option value="">Auto / project language</option>

  drawer.setAttribute("aria-hidden", "true");
  drawer.classList.remove("is-open");
}

function openToolDrawer({ drawer, btn, text, input, session, projectName, persistSessionDraft, sessionKey, updateStatus }) {
  if (!drawer || !btn) return false;

  drawer.dataset.pendingTemplate = text;
  drawer.dataset.pendingTool = btn.getAttribute("data-aicmd-tool-dock") || "tool";
  const actionType = btn.getAttribute("data-aicmd-tool-dock-action") || "guided";
  drawer.dataset.specialistId = session?.modeId || "";
  drawer.dataset.modeId = session?.modeId || "";
  drawer.dataset.teamMode = session?.teamMode || "solo";

  setDrawerText(drawer, "[data-aicmd-tool-drawer-icon]", btn.getAttribute("data-aicmd-tool-dock-icon") || "✦");
  setDrawerText(drawer, "[data-aicmd-tool-drawer-title]", btn.getAttribute("data-aicmd-tool-dock-label") || "Smart tool");
  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(actionType)} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
  setDrawerText(
    drawer,
    "[data-aicmd-tool-drawer-description]",
    `Prepare ${btn.getAttribute("data-aicmd-tool-dock-label") || "this tool"} for the active project. Choose the output, source, destination, language, and tone before using it in the composer.`
  );
  setDrawerText(drawer, "[data-aicmd-tool-drawer-safety]", humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-safety") || "review_only"));

  const toolId = btn.getAttribute("data-aicmd-tool-dock-id") || btn.getAttribute("data-tool-id") || "";
  const tool = AI_COMMAND_TOOLS.find((item) => item && item.id === toolId) || {};
  const rawOutputs = btn.getAttribute("data-aicmd-tool-dock-outputs")
    || joinMetaList(getToolMetaList(tool, "outputTypes", [toolId || "tool_output"]));
  const rawSources = btn.getAttribute("data-aicmd-tool-dock-sources")
    || joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat", "library_source", "manual_input"]));
  const rawDestinations = btn.getAttribute("data-aicmd-tool-dock-destinations")
    || joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview", "composer"]));
  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";


  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-output-select]"), rawOutputs, "Choose output type");
  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-source-select]"), rawSources, "Choose source / input");
  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-destination-select]"), rawDestinations, "Choose destination");

  Array.from(drawer.querySelectorAll("select, input, textarea")).forEach((field) => {
    field.oninput = () => {
      updateDrawerPromptSummary(drawer);
      validateDrawerSourceRequirement(drawer, projectName);
    };
    field.onchange = () => {

export function openAiToolDrawerFromMetadata({
  root = typeof document !== "undefined" ? document : null,
  tool = {},
  template = "",
  input,
  session,
  projectName = "",
  persistSessionDraft,
  sessionKey,
  updateStatus
} = {}) {
  const drawer = root?.querySelector?.("[data-aicmd-tool-drawer]");
  const actionType = tool.requiresSelectedSource && !tool.actionType ? "source_required" : (tool.actionType || tool.action || "guided");
  const meta = {
    "data-aicmd-tool-dock": tool.id || "tool",
    "data-aicmd-tool-dock-label": tool.label || "Smart tool",
    "data-aicmd-tool-dock-icon": tool.icon || "✦",
    "data-aicmd-tool-dock-badge": tool.badge || "",
    "data-aicmd-tool-dock-action": actionType,
    "data-aicmd-tool-dock-safety": tool.safetyLevel || "review_only",
    "data-aicmd-tool-dock-owner": tool.frontendOwnerPage || tool.owner || "ai-command",
    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
    "data-aicmd-tool-dock-sources": joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])),
    "data-aicmd-tool-dock-outputs": joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"]))
  };
  const btn = {
    getAttribute(name) {
      return meta[name] || "";
    }
  };

  return openToolDrawer({
    drawer,
    btn,
    text: template || tool.template || tool.prompt || "",
    input,
    session,
    projectName,
    persistSessionDraft,
    sessionKey,
    updateStatus
  });
}

## AI Command caller excerpt
                        };
                }
		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
		toolButtons.forEach((btn) => {
			btn.onclick = () => {
				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
				if (!toolId) return;

				const tool = getPhase35ToolSet(session).find((entry) => entry.id === toolId);
				if (!tool) return;

				const preparedPrompt = applyTokenTemplate(tool.template, {
					projectName,
					specialistLabel: session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label,
					campaign: aiContext.campaign
				});

				const drawerTool = {
					...tool,
					actionType: tool.requiresSelectedSource ? "source_required" : (tool.actionType || "guided"),
					destinations: asArray(tool.destinations).length ? tool.destinations : [getToolDestinationRoute(tool, session)],
					sourceTypes: asArray(tool.sourceTypes).length ? tool.sourceTypes : ["current_chat"],
					outputTypes: asArray(tool.outputTypes).length ? tool.outputTypes : [asString(tool.intent || tool.id || "draft").replace(/[^a-z0-9_]+/g, "_")]
				};

				const opened = openAiToolDrawerFromMetadata({
					root: document,
					tool: drawerTool,
					template: preparedPrompt,
					input,
					session,
					projectName,
					persistSessionDraft,
					sessionKey,
					updateStatus
				});

				if (!opened) {
					updateStatus("Smart tool drawer is unavailable. Refresh AI Command and try again.");
				}
			};
		});

		// ── SAVE DRAFT ───────────────────────────────────────────────
		const saveBtn = $("aicmdV2SaveBtn");
		if (saveBtn) {
