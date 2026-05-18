const BASE_TOOL_DOCK_TOOLS = [
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
  }
];

const TOOL_DOCK_BY_SPECIALIST = {
  strategist: [
    {
      id: "campaign-plan",
      icon: "🎯",
      label: "Campaign",
      badge: "Plan",
      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
    },
    {
      id: "launch-plan",
      icon: "🚀",
      label: "Launch",
      badge: "Plan",
      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
    },
    {
      id: "audience",
      icon: "◎",
      label: "Audience",
      badge: "Map",
      template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
    },
    {
      id: "offer",
      icon: "◆",
      label: "Offer",
      badge: "Value",
      template: "Create offer angles for {projectName}. Include value proposition, benefits, proof points, CTA ideas, and risk notes."
    },
    {
      id: "funnel",
      icon: "⌁",
      label: "Funnel",
      badge: "Flow",
      template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
    },
    {
      id: "priority",
      icon: "✓",
      label: "Priority",
      badge: "Next",
      template: "Prioritize the next best actions for {projectName}. Separate urgent, important, blocked, and later work."
    }
  ],

  writer: [
    {
      id: "write",
      icon: "✍",
      label: "Write",
      badge: "Create",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "content-studio",
      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "manual_input"],
      outputTypes: ["company_profile", "product_copy", "email", "blog_article", "landing_page", "contract_draft", "presentation_outline", "speech", "faq", "proposal", "social_post", "ad_copy"],
      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
    },
    {
      id: "rewrite",
      icon: "♻",
      label: "Rewrite",
      badge: "Edit",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ai-command",
      destinations: ["composer", "content-studio"],
      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
      outputTypes: ["professional_rewrite", "shorter_rewrite", "simpler_rewrite", "persuasive_rewrite", "premium_rewrite", "platform_specific_rewrite"],
      template: "Rewrite the current text for {projectName}. Keep the meaning, improve clarity, structure, and tone. Offer variants such as professional, shorter, simpler, more persuasive, premium, or platform-specific. Do not publish anything."
    },
    {
      id: "translate",
      icon: "🌍",
      label: "Translate",
      badge: "Localize",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "content-studio",
      destinations: ["composer", "content-studio"],
      sourceTypes: ["composer_text", "selected_text", "current_chat"],
      outputTypes: ["translation", "localization", "market_adaptation", "cta_localization"],
      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
    },
    {
      id: "improve",
      icon: "✨",
      label: "Improve",
      badge: "Quality",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ai-command",
      destinations: ["composer", "content-studio"],
      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
      outputTypes: ["clarity_improvement", "structure_improvement", "cta_improvement", "readability_improvement", "conversion_improvement"],
      template: "Improve this content for {projectName}. Focus on clarity, flow, value proposition, CTA strength, trust signals, readability, and conversion. Return practical improvements and a better draft."
    },
    {
      id: "check",
      icon: "✓",
      label: "Check",
      badge: "Review",
      actionType: "preview",
      safetyLevel: "review_only",
      frontendOwnerPage: "ai-command",
      destinations: ["preview", "content-studio", "compliance"],
      sourceTypes: ["composer_text", "selected_text", "content_draft", "current_chat"],
      outputTypes: ["grammar_check", "spelling_check", "tone_check", "readability_check", "cta_check", "claim_risk_check", "seo_check", "compliance_notes"],
      template: "Check this content for {projectName}. Review grammar, spelling, tone, readability, CTA strength, claim risk, missing proof, SEO weakness, and compliance notes. Return issues, severity, and suggested fixes."
    },
    {
      id: "sources",
      icon: "📚",
      label: "Sources",
      badge: "Context",
      actionType: "source_required",
      safetyLevel: "context_only",
      frontendOwnerPage: "library",
      destinations: ["library", "ai-command", "content-studio"],
      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "source_of_truth_assets", "manual_input"],
      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
      template: "Prepare source context for the next Content Writer task for {projectName}. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input."
    },
    {
      id: "seo",
      icon: "🔎",
      label: "SEO",
      badge: "Search",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "content-studio",
      destinations: ["content-studio", "insights", "library"],
      sourceTypes: ["topic", "market", "language", "audience", "current_chat", "library_folder"],
      outputTypes: ["seo_brief", "keyword_clusters", "search_intent_map", "blog_outline", "meta_pack", "faq_ideas", "internal_link_plan", "content_gap_notes"],
      template: "Prepare SEO support for {projectName}. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes."
    },
    {
      id: "repurpose",
      icon: "⇄",
      label: "Repurpose",
      badge: "Adapt",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "content-studio",
      destinations: ["chat-preview", "content-studio", "publishing"],
      sourceTypes: ["existing_content", "composer_text", "content_draft", "current_chat", "library_folder"],
      outputTypes: ["blog_to_social", "profile_to_pitch", "product_to_ad_copy", "transcript_to_article", "notes_to_presentation", "long_text_to_email_sequence"],
      template: "Repurpose existing content for {projectName}. Ask or infer the source format and target format: blog to posts, profile to pitch, product page to ad copy, transcript to article, notes to presentation outline, or long text to email sequence."
    },
    {
      id: "send",
      icon: "➜",
      label: "Send",
      badge: "Route",
      actionType: "route",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "ai-command",
      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
      sourceTypes: ["current_draft", "preview", "current_chat"],
      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
    }
  ],
  media: [
    {
      id: "visual-brief",
      icon: "🎨",
      label: "Visual Brief",
      badge: "Design",
      template: "Prepare a visual brief for {projectName}. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA."
    },
    {
      id: "moodboard",
      icon: "▧",
      label: "Moodboard",
      badge: "Style",
      template: "Define a moodboard direction for {projectName}. Include visual references, atmosphere, color feel, texture, layout mood, and brand alignment."
    },
    {
      id: "image-prompt",
      icon: "🖼",
      label: "Image",
      badge: "Prompt",
      template: "Create image generation prompts for {projectName}. Include scene, subject, lighting, style, composition, negative constraints, and brand notes."
    },
    {
      id: "asset-list",
      icon: "▣",
      label: "Assets",
      badge: "List",
      template: "Create an asset checklist for {projectName}. Include logos, product shots, lifestyle images, certificates, icons, testimonials, and missing assets."
    },
    {
      id: "layout",
      icon: "▤",
      label: "Layout",
      badge: "Plan",
      template: "Create a layout plan for {projectName}. Include sections, hierarchy, visual blocks, CTA placement, and responsive notes."
    },
    {
      id: "brand-check",
      icon: "◆",
      label: "Brand Check",
      badge: "Review",
      template: "Review the visual direction for brand consistency. Flag risks, missing assets, style mismatches, and improvement actions."
    }
  ],

  video_lead: [
    {
      id: "reel-script",
      icon: "🎬",
      label: "Reel",
      badge: "Script",
      template: "Write a short-form reel script for {projectName}. Include hook, scene sequence, voiceover, text overlays, CTA, and shot notes."
    },
    {
      id: "storyboard",
      icon: "▥",
      label: "Storyboard",
      badge: "Video",
      template: "Create a storyboard for {projectName}. Include scenes, camera direction, motion, captions, assets needed, and CTA."
    },
    {
      id: "shot-list",
      icon: "◫",
      label: "Shot List",
      badge: "Plan",
      template: "Create a shot list for {projectName}. Include product shots, lifestyle shots, closeups, transitions, and required props."
    },
    {
      id: "voiceover",
      icon: "🎙",
      label: "Voiceover",
      badge: "Audio",
      template: "Draft a voiceover script for {projectName}. Include tone, pacing, hook, proof points, and CTA."
    },
    {
      id: "video-cta",
      icon: "▶",
      label: "Video CTA",
      badge: "Action",
      template: "Create CTA options for a video campaign for {projectName}. Include soft, direct, urgency, and brand-led versions."
    }
  ],

  publisher: [
    {
      id: "publish-check",
      icon: "📤",
      label: "Publish Check",
      badge: "Ready",
      template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."
    },
    {
      id: "channel-pack",
      icon: "▦",
      label: "Channel Pack",
      badge: "Prep",
      template: "Prepare a channel package for {projectName}. Include caption, hashtags, format notes, asset needs, schedule notes, and approval checklist."
    },
    {
      id: "schedule",
      icon: "🗓",
      label: "Schedule",
      badge: "Plan",
      template: "Draft a publishing schedule for {projectName}. Include channels, timing, dependencies, review gates, and next actions."
    },
    {
      id: "hashtags",
      icon: "#",
      label: "Hashtags",
      badge: "SEO",
      template: "Suggest hashtags and discoverability tags for {projectName}. Group them by brand, product, audience, niche, and market."
    },
    {
      id: "approval-pack",
      icon: "✓",
      label: "Approval",
      badge: "Pack",
      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
    }
  ],

  ads: [
    {
      id: "ad-angle",
      icon: "📣",
      label: "Ad Angle",
      badge: "Paid",
      template: "Create paid ad angles for {projectName}. Include hook, audience pain, benefit, proof, CTA, and compliance risks."
    },
    {
      id: "ad-copy",
      icon: "✦",
      label: "Ad Copy",
      badge: "Draft",
      template: "Draft paid ad copy variants for {projectName}. Include primary text, headline, CTA, and angle notes."
    },
    {
      id: "targeting",
      icon: "◎",
      label: "Targeting",
      badge: "Map",
      template: "Map targeting ideas for {projectName}. Include audience groups, interests, exclusions, funnel stage, and testing notes."
    },
    {
      id: "creative-test",
      icon: "A/B",
      label: "Creative",
      badge: "Test",
      template: "Create a creative testing plan for {projectName}. Include hypotheses, variants, success signals, and next actions."
    },
    {
      id: "landing-match",
      icon: "↔",
      label: "Landing",
      badge: "Match",
      template: "Review ad-to-landing-page message match for {projectName}. Identify gaps, stronger claims, CTA improvements, and trust signals."
    }
  ],

  analyst: [
    {
      id: "seo-brief",
      icon: "🔎",
      label: "SEO Brief",
      badge: "Search",
      template: "Create an SEO brief for {projectName}. Include keywords, search intent, content structure, meta ideas, internal links, and risks."
    },
    {
      id: "insights",
      icon: "📊",
      label: "Insights",
      badge: "Data",
      template: "Summarize insights for {projectName}. Include what is working, what is weak, missing data, and next optimization actions."
    },
    {
      id: "keywords",
      icon: "⌕",
      label: "Keywords",
      badge: "SEO",
      template: "Suggest keyword groups for {projectName}. Include commercial, informational, branded, product, and local intent clusters."
    },
    {
      id: "performance",
      icon: "↗",
      label: "Performance",
      badge: "Review",
      template: "Review performance signals for {projectName}. Identify wins, risks, gaps, and recommended next experiments."
    },
    {
      id: "content-gap",
      icon: "▥",
      label: "Gaps",
      badge: "Plan",
      template: "Identify content gaps for {projectName}. Include missing pages, missing topics, weak funnel stages, and priority actions."
    }
  ],

  compliance_reviewer: [
    {
      id: "claims-check",
      icon: "🛡",
      label: "Claims",
      badge: "Check",
      template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
    },
    {
      id: "safe-rewrite",
      icon: "♻",
      label: "Safe Rewrite",
      badge: "Copy",
      template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
    },
    {
      id: "evidence",
      icon: "📎",
      label: "Evidence",
      badge: "Need",
      template: "List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof."
    },
    {
      id: "gdpr",
      icon: "🔒",
      label: "GDPR",
      badge: "Review",
      template: "Review GDPR/privacy considerations for this content or workflow. Flag consent, tracking, data use, and disclosure risks."
    },
    {
      id: "approval-notes",
      icon: "✓",
      label: "Approval",
      badge: "Notes",
      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
    }
  ],

  operations: [
    {
      id: "task-plan",
      icon: "☑",
      label: "Task Plan",
      badge: "Ops",
      template: "Turn this into a task plan for {projectName}. Include owners, priorities, dependencies, risks, and next steps."
    },
    {
      id: "workflow",
      icon: "⚙",
      label: "Workflow",
      badge: "Draft",
      template: "Draft a workflow for {projectName}. Include steps, triggers, inputs, outputs, owners, review gates, and execution risks."
    },
    {
      id: "handoff",
      icon: "⇄",
      label: "Handoff",
      badge: "Route",
      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
    },
    {
      id: "timeline",
      icon: "⏱",
      label: "Timeline",
      badge: "Plan",
      template: "Create a timeline for {projectName}. Include milestones, blockers, dependencies, and safe sequencing."
    },
    {
      id: "checklist",
      icon: "☷",
      label: "Checklist",
      badge: "Ops",
      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
    }
  ],

  customer_ops: [
    {
      id: "reply-draft",
      icon: "💬",
      label: "Reply",
      badge: "Draft",
      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
    },
    {
      id: "ticket",
      icon: "🎫",
      label: "Ticket",
      badge: "Draft",
      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
    },
    {
      id: "sla",
      icon: "⏳",
      label: "SLA",
      badge: "Risk",
      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
    },
    {
      id: "summary",
      icon: "☷",
      label: "Summary",
      badge: "CX",
      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
    }
  ],

  sales_crm: [
    {
      id: "sales-pitch",
      icon: "💼",
      label: "Pitch",
      badge: "Sales",
      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
    },
    {
      id: "follow-up",
      icon: "↩",
      label: "Follow-up",
      badge: "Email",
      template: "Draft a sales follow-up for {projectName}. Include context, value reminder, question, CTA, and next step."
    },
    {
      id: "objections",
      icon: "❓",
      label: "Objection",
      badge: "Sales",
      template: "Prepare objection handling for {projectName}. Include likely objections, safe answers, proof needed, and next action."
    },
    {
      id: "lead-brief",
      icon: "◎",
      label: "Lead Brief",
      badge: "CRM",
      template: "Create a lead brief for {projectName}. Include profile, need, fit, opportunity, risks, and recommended outreach."
    }
  ]
};

function getSpecialistTools(specialistId = "") {
  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
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
          Review the requirements before preparing the composer prompt.
        </p>

        <div class="mhos-tool-drawer-grid">
          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Output types</span>
            <div class="mhos-tool-drawer-chips" data-aicmd-tool-drawer-outputs></div>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Sources / inputs</span>
            <div class="mhos-tool-drawer-chips" data-aicmd-tool-drawer-sources></div>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Destinations</span>
            <div class="mhos-tool-drawer-chips" data-aicmd-tool-drawer-destinations></div>
          </div>

          <div class="mhos-tool-drawer-section">
            <span class="mhos-tool-drawer-section-label">Safety</span>
            <div class="mhos-tool-drawer-safety" data-aicmd-tool-drawer-safety>Review only</div>
          </div>
        </div>

        <div class="mhos-tool-drawer-note">
          This drawer is preparation-only. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
        </div>

        <div class="mhos-tool-drawer-actions">
          <button class="btn btn-primary" type="button" data-aicmd-tool-drawer-use>Use in Composer</button>
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-close>Cancel</button>
        </div>
      </section>
    </aside>
  `;
}

export function renderAiToolDock({ projectName = "", specialistId = "", teamMode = "solo", escapeHtml }) {
  const safe = typeof escapeHtml === "function"
    ? escapeHtml
    : (value) => String(value ?? "");
  const tools = getDockTools({ specialistId, teamMode });
  const label = teamMode === "team" ? "Team quick tools" : "Specialist quick tools";

  return `
    <section class="mhos-tool-dock aicmd-tool-dock" aria-label="${safe(label)}">
      <div class="mhos-tool-dock-head">
        <span class="mhos-tool-dock-kicker">${safe(label)}</span>
        <span class="mhos-tool-dock-copy">Smart tools · review before action</span>
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
            data-aicmd-tool-dock-action="${safe(tool.actionType || "prefill")}"
            data-aicmd-tool-dock-safety="${safe(tool.safetyLevel || "review_only")}"
            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
            data-aicmd-tool-dock-destinations="${safe(joinMetaList(tool.destinations))}"
            data-aicmd-tool-dock-sources="${safe(joinMetaList(tool.sourceTypes))}"
            data-aicmd-tool-dock-outputs="${safe(joinMetaList(tool.outputTypes))}"
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
  return String(value || "")
    .split("_")
    .join(" ")
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderDrawerChips(node, rawValue = "") {
  if (!node) return;
  const values = String(rawValue || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  node.innerHTML = values.length
    ? values.slice(0, 12).map((item) => `<span class="mhos-tool-drawer-chip">${humanizeMeta(item)}</span>`).join("")
    : `<span class="mhos-tool-drawer-chip is-muted">Not required</span>`;
}

function setDrawerText(root, selector, value) {
  const node = root.querySelector(selector);
  if (node) node.textContent = value || "";
}

function closeToolDrawer(drawer) {
  if (!drawer) return;
  drawer.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  drawer.classList.remove("is-open");
}

function openToolDrawer({ drawer, btn, text, input, session, projectName, persistSessionDraft, sessionKey, updateStatus }) {
  if (!drawer || !btn) return false;

  drawer.dataset.pendingTemplate = text;
  drawer.dataset.pendingTool = btn.getAttribute("data-aicmd-tool-dock") || "tool";

  setDrawerText(drawer, "[data-aicmd-tool-drawer-icon]", btn.getAttribute("data-aicmd-tool-dock-icon") || "✦");
  setDrawerText(drawer, "[data-aicmd-tool-drawer-title]", btn.getAttribute("data-aicmd-tool-dock-label") || "Smart tool");
  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-action") || "guided")} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
  setDrawerText(drawer, "[data-aicmd-tool-drawer-description]", btn.getAttribute("data-aicmd-tool-dock-template") || "Prepare this tool before using it.");
  setDrawerText(drawer, "[data-aicmd-tool-drawer-safety]", humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-safety") || "review_only"));

  renderDrawerChips(drawer.querySelector("[data-aicmd-tool-drawer-outputs]"), btn.getAttribute("data-aicmd-tool-dock-outputs"));
  renderDrawerChips(drawer.querySelector("[data-aicmd-tool-drawer-sources]"), btn.getAttribute("data-aicmd-tool-dock-sources"));
  renderDrawerChips(drawer.querySelector("[data-aicmd-tool-drawer-destinations]"), btn.getAttribute("data-aicmd-tool-dock-destinations"));

  drawer.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  drawer.classList.add("is-open");
  updateStatus?.(`${btn.getAttribute("data-aicmd-tool-dock-label") || "Tool"} setup opened. Review requirements, then use in composer.`);
  return true;
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

  const useBtn = root.querySelector("[data-aicmd-tool-drawer-use]");
  if (useBtn) {
    useBtn.onclick = () => {
      const template = drawer?.dataset?.pendingTemplate || "";
      const label = drawer?.dataset?.pendingTool || "tool";
      if (!template) return;

      const text = tokenReplace(template, {
        projectName,
        campaign: aiContext.campaign,
        specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
      });

      session.draftMessage = text;
      session.composerText = text;
      if (input) input.value = text;

      if (typeof persistSessionDraft === "function") {
        persistSessionDraft(sessionKey, session, `${label} drawer tool loaded`);
      }

      if (typeof updateStatus === "function") {
        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
      }

      closeToolDrawer(drawer);
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
}

