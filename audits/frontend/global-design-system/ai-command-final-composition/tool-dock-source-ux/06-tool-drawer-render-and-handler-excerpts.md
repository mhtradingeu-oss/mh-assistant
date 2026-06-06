# 06 — Tool Drawer Render Excerpts

## Render area
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
                  <option value="German">German</option>
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </label>
              <label>
                <span>Tone</span>
                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-tone>
                  <option value="">Auto / brand tone</option>
                  <option value="Professional">Professional</option>
                  <option value="Premium">Premium</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Simple and clear">Simple and clear</option>
                </select>
              </label>
            </div>

            <label class="mhos-tool-drawer-field">
              <span>Source details</span>
              <input
                class="mhos-tool-drawer-input"
                data-aicmd-tool-drawer-source-details
                type="text"
                placeholder="Example: use current chat only, Brand Profile folder, product file, legal docs..."
              />
            </label>

            <label class="mhos-tool-drawer-field">
              <span>Extra brief</span>
              <textarea
                class="mhos-tool-drawer-textarea"
                data-aicmd-tool-drawer-extra-brief
                rows="3"
                placeholder="Add audience, goal, keywords, offer, product, or any must-use information..."
              ></textarea>
            </label>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Safety</span>
            <div class="mhos-tool-drawer-safety" data-aicmd-tool-drawer-safety>Review only</div>
          </div>
        </div>

        <div class="mhos-tool-drawer-summary">
          <span>Setup summary</span>
          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
        </div>

        <div class="mhos-tool-drawer-note">
          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
        </div>

        <div class="mhos-tool-drawer-actions">
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change source</button>
          <button class="btn btn-primary" type="button" data-aicmd-tool-drawer-use>Use in Composer</button>
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-close>Cancel</button>
        </div>
      </section>
    </aside>
  `;
}

export function renderAiToolDrawerShell({ escapeHtml } = {}) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");
  return renderSmartToolDrawerShell(safe);
}

export function renderAiToolDock({ projectName = "", specialistId = "", teamMode = "solo", escapeHtml }) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");
  const tools = getDockTools({ specialistId, teamMode });
  const label = teamMode === "team" ? "Team guided tools" : "Specialist guided tools";

  return `
    <section class="mhos-tool-dock aicmd-tool-dock" aria-label="${safe(label)}">
      <div class="mhos-tool-dock-head">
        <span class="mhos-tool-dock-kicker">${safe(label)}</span>
        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
      </div>
      <div class="mhos-tool-dock-list">
        ${tools.map((tool) => `
          <button
            type="button"
            class="mhos-tool-dock-item"
            data-aicmd-tool-dock="${safe(tool.id)}"
            data-aicmd-tool-dock-label="${safe(tool.label)}"
            data-aicmd-tool-dock-icon="${safe(tool.icon)}"
            data-aicmd-tool-dock-badge="${safe(tool.badge)}"
            data-aicmd-tool-dock-action="${safe(tool.actionType || "guided")}"
            data-aicmd-tool-dock-safety="${safe(tool.safetyLevel || "review_only")}"
            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
            data-aicmd-tool-dock-sources="${safe(joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])))}"
            data-aicmd-tool-dock-outputs="${safe(joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"])))}"
            data-aicmd-tool-dock-template="${safe(tool.template)}"
            title="${safe(tool.template)}"
          >
            <span class="mhos-tool-dock-icon" aria-hidden="true">${safe(tool.icon)}</span>
            <span class="mhos-tool-dock-label">${safe(tool.label)}</span>
            <span class="mhos-tool-dock-badge">${safe(tool.badge)}</span>
          </button>
        `).join("")}
      </div>
    </section>
    ${renderSmartToolDrawerShell(safe)}
  `;
}

function humanizeMeta(value = "") {
  const raw = String(value || "").trim();
  const normalized = raw.toLowerCase();

  const exactLabels = {
    ai: "AI",
    seo: "SEO",
    crm: "CRM",
    cta: "CTA",
    gdpr: "GDPR",
    faq: "FAQ"
  };

  if (exactLabels[normalized]) return exactLabels[normalized];

  return raw
    .split("_")

## Validation / Use handlers
    option.textContent = humanizeMeta(value);
    select.appendChild(option);
  });
}

function getSelectedLabel(drawer, selector, fallback = "Auto") {
  const select = drawer?.querySelector?.(selector);
  if (!select || !select.value) return fallback;
  return humanizeMeta(select.value);
}

function getDrawerFieldValue(drawer, selector) {
  const node = drawer?.querySelector?.(selector);
  return String(node?.value || "").trim();
}

function isSeoRelevantOutput(output = "") {
  const value = String(output || "").toLowerCase();
  return value.includes("blog") ||
    value.includes("seo") ||
    value.includes("meta") ||
    value.includes("landing page") ||
    value.includes("article");
}

function buildOutputSpecificRules(output = "") {
  if (!isSeoRelevantOutput(output)) return [];

  return [
    "SEO quality rules:",
    "- Start with a clear SEO title/H1.",
    "- Define search intent before writing.",
    "- Suggest a primary keyword and 3-6 secondary keyword ideas if not provided.",
    "- Use a clean H2/H3 structure.",
    "- Include a meta title and meta description.",
    "- Include FAQ ideas when useful.",
    "- Mention internal link opportunities if relevant.",
    "- Do not invent certifications, claims, ingredients, prices, guarantees, or statistics without source evidence."
  ];
}

function buildSmartToolComposerPrompt({ drawer, baseTemplate, projectName }) {
  const title = drawer?.querySelector?.("[data-aicmd-tool-drawer-title]")?.textContent || "Smart tool";
  const action = drawer?.querySelector?.("[data-aicmd-tool-drawer-action]")?.textContent || "Guided";
  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto / infer from request");
  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto / project language");
  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto / brand tone");
  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
  const extraBrief = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-extra-brief]");

  const sourceInstruction = sourceDetails
    ? `${source}. Source details: ${sourceDetails}.`
    : `${source}. If the selected source is not available in the current context, ask me to choose, paste, upload, or open the relevant source before producing final content.`;
  const selectedSourceContext = buildSelectedSourceContextBlock(projectName);

  const lines = [
    `Use the ${title} tool for the active project${projectName ? ` (${projectName})` : ""}.`,
    "",
    "Selected setup:",
    `- Tool mode: ${action}.`,
    `- Output type: ${output}.`,
    `- Source/input: ${sourceInstruction}`,
    `- Destination: ${destination}.`,
    `- Language: ${language}.`,
    `- Tone: ${tone}.`
  ];

  if (baseTemplate) {
    lines.push("", "Tool instruction:", baseTemplate);
  }

  if (selectedSourceContext) {
    lines.push("", selectedSourceContext);
  }

  if (extraBrief) {
    lines.push(`- Extra brief: ${extraBrief}.`);
  }

  lines.push(
    "",
    "Task:",
    `Create the requested ${output.toLowerCase()} as review-ready content.`,
    "Use only the available context and selected source details.",
    "If required facts are missing, ask concise follow-up questions before writing the final version.",
    "Do not repeat this setup back to the user unless useful; produce the best practical output.",
    "",
    "Language handling:",
    "- If the selected language is auto, use the active project language when known.",
    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
    "- Do not mix languages inside the publishable content unless the user asks for bilingual output."
  );

  const outputRules = buildOutputSpecificRules(output);
  if (outputRules.length) {
    lines.push("", ...outputRules);
  }

  lines.push(
    "",
    "Destination rule:",
    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
    "",
    "Safety:",
    "- Prepare review-ready output only.",
    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
    "- Do not make unsupported claims. Mark missing proof clearly."
  );

  return lines.join("\n");
}

function updateDrawerPromptSummary(drawer) {
  if (!drawer) return;
  const summary = drawer.querySelector("[data-aicmd-tool-drawer-summary]");
  if (!summary) return;

  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto");
  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Auto");
  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto language");
  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto tone");
  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
  const extraBrief = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-extra-brief]");

  let summaryParts = [];
  if (source !== "Auto" && source !== "Current chat or ask if source is needed") summaryParts.push("Library source selected");
  summaryParts.push(output);
  summaryParts.push(destination);
  summaryParts.push(language);
  summaryParts.push(tone);
  if (extraBrief) summaryParts.push("Extra brief added");

  summary.textContent = summaryParts.filter(Boolean).join(" · ");
}


function setDrawerText(root, selector, value) {
  const node = root.querySelector(selector);
  if (node) node.textContent = value || "";
}

function closeToolDrawer(drawer, fallbackTarget = null) {
  moveFocusOutOfDrawer(drawer, fallbackTarget);
  if (!drawer) return;
  drawer.hidden = true;
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

  const rawOutputs = btn.getAttribute("data-aicmd-tool-dock-outputs") || "";
  const rawSources = btn.getAttribute("data-aicmd-tool-dock-sources") || "";
  const rawDestinations = btn.getAttribute("data-aicmd-tool-dock-destinations") || "";
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
      updateDrawerPromptSummary(drawer);
      validateDrawerSourceRequirement(drawer, projectName);
    };
  });
  applySharedAiSourceToDrawer(drawer, projectName);
  updateDrawerPromptSummary(drawer);
  validateDrawerSourceRequirement(drawer, projectName);

  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  drawer.classList.add("is-open");
  updateStatus?.(`${btn.getAttribute("data-aicmd-tool-dock-label") || "Tool"} setup opened. Review requirements, then use in composer.`);
  return true;
}

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

export function bindAiToolDock({
  root = document,
  session,
  input,
  projectName = "",
  aiContext = {},
  specialistLabel = "",
  persistSessionDraft,
  sessionKey,
  updateStatus
}) {
  if (!root || !session) return;

  const drawer = root.querySelector("[data-aicmd-tool-drawer]");

  Array.from(root.querySelectorAll("[data-aicmd-tool-drawer-close]")).forEach((btn) => {
    btn.onclick = () => closeToolDrawer(drawer);
  });

  const openLibraryBtn = root.querySelector("[data-aicmd-tool-drawer-open-library]");
  if (openLibraryBtn) {
    openLibraryBtn.onclick = () => {
      // Library Source Bridge workflow
      const project = projectName || "__default__";
      const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
      const selectedSourceType = drawerSourceSelect?.value || "auto";
      const mapping = getSourceTypeMapping(selectedSourceType);
      const drawerReturnContext = buildAiDrawerReturnContext({
        projectName: project,
        origin: "ai-command",
        drawerOpen: true,
        specialistId: drawer?.dataset?.specialistId || "",
        modeId: drawer?.dataset?.modeId || "",
        toolId: drawer?.dataset?.pendingTool || "",
        teamMode: session?.teamMode || "solo",
        sourceType: selectedSourceType,
        outputType: drawer?.querySelector?.("[data-aicmd-tool-drawer-output-select]")?.value || ""
      });

      const payload = {
        type: "library_source_selection",
        origin: "ai-command",
        returnTarget: "ai-command",
        sourceType: selectedSourceType,
        libraryFilter: mapping.libraryFilter,
        targetSection: "asset-workspace",
        drawerReturnContext,
        created_at: new Date().toISOString()
      };
      setSharedLibrarySourceBridge(project, payload);
      setSharedLibrarySourceBridge("__default__", payload);

      setSharedAiDrawerReturn(project, drawerReturnContext);
      setSharedAiDrawerReturn("__default__", drawerReturnContext);
      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
      if (typeof window !== "undefined") {
        window.location.hash = "#library";
      }
    };
  }

  // Patch drawer population to apply source
  if (drawer) {
    applySharedAiSourceToDrawer(drawer, projectName);
  }

  const useBtn = root.querySelector("[data-aicmd-tool-drawer-use]");
  if (useBtn) {
    useBtn.onclick = () => {
      const template = drawer?.dataset?.pendingTemplate || "";
      const label = drawer?.dataset?.pendingTool || "tool";
      if (!template) return;
      if (!validateDrawerSourceRequirement(drawer, projectName)) {
        updateStatus?.("This tool needs a source. Choose one from Library before continuing.");
        return;
      }

      const text = tokenReplace(
        buildSmartToolComposerPrompt({ drawer, baseTemplate: template, projectName }),
        {
          projectName,
          campaign: aiContext.campaign,
          specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
        }
      );

      session.draftMessage = text;
      session.composerText = text;
      if (input) input.value = text;

      if (typeof persistSessionDraft === "function") {
        persistSessionDraft(sessionKey, session, `${label} drawer tool loaded`);
      }

      if (typeof updateStatus === "function") {
        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
      }

      closeToolDrawer(drawer, input);
      input?.focus?.();
    };
  }


  Array.from(root.querySelectorAll("[data-aicmd-tool-dock]")).forEach((btn) => {
    btn.onclick = () => {
      const template = btn.getAttribute("data-aicmd-tool-dock-template") || "";
      const label = btn.getAttribute("data-aicmd-tool-dock") || "tool";
      const actionType = btn.getAttribute("data-aicmd-tool-dock-action") || "prefill";
      if (!template) return;

      if (actionType !== "prefill") {
        const opened = openToolDrawer({
          drawer,
          btn,
          text: template,
          input,
          session,
          projectName,
          persistSessionDraft,
          sessionKey,
          updateStatus
        });
        if (opened) return;
      }

      const text = tokenReplace(template, {
        projectName,
        campaign: aiContext.campaign,
        specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
      });

      session.draftMessage = text;
      session.composerText = text;
      if (input) input.value = text;

      if (typeof persistSessionDraft === "function") {
        persistSessionDraft(sessionKey, session, `${label} dock tool loaded`);
      }

      if (typeof updateStatus === "function") {
        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);
      }

      input?.focus?.();
    };
  });

  // --- Ensure drawer is restored after navigation from Library ---
  const restoreProjectName = projectName || "__default__";
  [0, 60, 180].forEach((delay) => {
    setTimeout(() => tryAutoOpenDrawerAfterLibrary(restoreProjectName), delay);
  });

}

