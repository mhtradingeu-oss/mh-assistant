const AI_TOOL_DOCK_TOOLS = [
  {
    id: "rewrite",
    icon: "✍",
    label: "Rewrite",
    badge: "Text",
    template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
  },
  {
    id: "translate",
    icon: "🌍",
    label: "Translate",
    badge: "Market",
    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
  },
  {
    id: "improve",
    icon: "✨",
    label: "Improve",
    badge: "AI",
    template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
  },
  {
    id: "summarize",
    icon: "☷",
    label: "Summarize",
    badge: "Brief",
    template: "Summarize the current content into clear bullet points, decisions, risks, and next actions for {projectName}."
  },
  {
    id: "sources",
    icon: "📚",
    label: "Sources",
    badge: "Library",
    template: "Use selected Library or project sources for {projectName} to prepare a grounded draft. Mention what source context is needed before writing."
  },
  {
    id: "templates",
    icon: "▦",
    label: "Templates",
    badge: "Studio",
    template: "Recommend the best Content Studio template for this request. Options may include company profile, contract draft, speech, presentation outline, blog article, product page, or campaign package."
  },
  {
    id: "create",
    icon: "＋",
    label: "Create",
    badge: "Draft",
    template: "Create a structured draft for {projectName}. Ask which output is needed if unclear: company profile, contract draft, speech, presentation outline, blog article, campaign package, or landing page."
  },
  {
    id: "media-brief",
    icon: "◐",
    label: "Media Brief",
    badge: "Design",
    template: "Prepare a design brief for Media Studio from the current content or conversation. Include objective, format, visual direction, required assets, copy summary, language, tone, and CTA."
  },
  {
    id: "more",
    icon: "⋯",
    label: "More",
    badge: "Tools",
    template: "Show the most useful specialist tools for this request and recommend the next best action. Do not execute anything."
  }
];

function tokenReplace(template = "", values = {}) {
  return String(template)
    .replace(/\{projectName\}/g, values.projectName || "this project")
    .replace(/\{campaign\}/g, values.campaign || "the active campaign")
    .replace(/\{specialistLabel\}/g, values.specialistLabel || "the active specialist");
}

export function renderAiToolDock({ projectName = "", escapeHtml }) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");

  return `
    <section class="mhos-tool-dock aicmd-tool-dock" aria-label="AI quick tools">
      <div class="mhos-tool-dock-head">
        <span class="mhos-tool-dock-kicker">Quick tools</span>
        <span class="mhos-tool-dock-copy">Prefill only · review before sending</span>
      </div>
      <div class="mhos-tool-dock-list">
        ${AI_TOOL_DOCK_TOOLS.map((tool) => `
          <button
            type="button"
            class="mhos-tool-dock-item"
            data-aicmd-tool-dock="${safe(tool.id)}"
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
  `;
}

export function bindAiToolDock({
  root = document,
  session,
  input,
  projectName = "",
  aiContext = {},
  persistSessionDraft,
  sessionKey,
  updateStatus
}) {
  if (!root || !session) return;

  Array.from(root.querySelectorAll("[data-aicmd-tool-dock]")).forEach((btn) => {
    btn.onclick = () => {
      const template = btn.getAttribute("data-aicmd-tool-dock-template") || "";
      const label = btn.getAttribute("data-aicmd-tool-dock") || "tool";
      if (!template) return;

      const text = tokenReplace(template, {
        projectName,
        campaign: aiContext.campaign,
        specialistLabel: session.teamMode === "team" ? "Full Team" : "active specialist"
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
}
