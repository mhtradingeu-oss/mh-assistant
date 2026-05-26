
import {
  setSharedLibrarySourceBridge,
  getSharedAiSource,
  clearSharedAiSource,
  getSourceTypeMapping,
  setSharedAiDrawerReturn,
  getSharedAiDrawerReturn,
  clearSharedAiDrawerReturn
} from "../../shared-context.js";



function moveFocusOutOfDrawer(drawer, fallbackTarget = null) {
  if (!drawer || typeof document === "undefined") return;

  const active = document.activeElement;
  if (active && drawer.contains(active)) {
    if (fallbackTarget && typeof fallbackTarget.focus === "function") {
      fallbackTarget.focus({ preventScroll: true });
      return;
    }

    const composer = document.querySelector("[data-aicmd-composer-input], textarea, input");
    if (composer && typeof composer.focus === "function") {
      composer.focus({ preventScroll: true });
      return;
    }

    if (typeof active.blur === "function") {
      active.blur();
    }
  }
}

function escapeHtml(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char] || char);
}

function tryAutoOpenDrawerAfterLibrary(projectName) {
  const returnContext = getSharedAiDrawerReturn(projectName) || getSharedAiDrawerReturn("__default__");
  if (!returnContext?.drawerOpen) return;

  const drawer = document.querySelector("[data-aicmd-tool-drawer]");
  const root = drawer?.closest?.("[data-page='ai-command'], .ai-command-page, body") || document;

  let targetButton = null;
  if (returnContext.toolId) {
    targetButton = root.querySelector(`[data-aicmd-tool-dock="${returnContext.toolId}"]`);
  }

  if (!targetButton) {
    targetButton = root.querySelector("[data-aicmd-tool-dock][data-aicmd-tool-dock-action='guided']")
      || root.querySelector("[data-aicmd-tool-dock]");
  }

  if (targetButton && typeof targetButton.click === "function") {
    targetButton.click();
  }

  const activeDrawer = document.querySelector("[data-aicmd-tool-drawer]");
  let drawerIsOpen = Boolean(
    activeDrawer &&
    activeDrawer.hidden === false &&
    activeDrawer.getAttribute("aria-hidden") === "false" &&
    activeDrawer.classList.contains("is-open")
  );

  if (!drawerIsOpen && activeDrawer) {
    if (returnContext.toolId) activeDrawer.dataset.pendingTool = returnContext.toolId;
    if (returnContext.specialistId) activeDrawer.dataset.specialistId = returnContext.specialistId;
    if (returnContext.modeId) activeDrawer.dataset.modeId = returnContext.modeId;
    if (returnContext.teamMode) activeDrawer.dataset.teamMode = returnContext.teamMode;

    activeDrawer.hidden = false;
    activeDrawer.setAttribute("aria-hidden", "false");
    activeDrawer.classList.add("is-open");

    drawerIsOpen = true;
  }

  if (drawerIsOpen && activeDrawer) {
    applySharedAiSourceToDrawer(activeDrawer, projectName);

    const selectedSource = getSharedAiSource(projectName) || getSharedAiSource("__default__");
    const msg = activeDrawer.querySelector("[data-aicmd-tool-drawer-status]") || document.querySelector("[data-aicmd-tool-drawer-status]");
    if (msg) {
      msg.textContent = selectedSource?.name
        ? "Source added to drawer."
        : "Returned to drawer. No source selected.";
    }

    clearSharedAiDrawerReturn(projectName);
    clearSharedAiDrawerReturn("__default__");
  }
}

// --- Helper to build AI Drawer Return Context ---
function buildAiDrawerReturnContext({
  projectName = "",
  origin = "ai-command",
  drawerOpen = true,
  specialistId = "",
  modeId = "",
  toolId = "",
  teamMode = "solo",
  sourceType = "",
  outputType = "",
  created_at = null,
  extra = {}
} = {}) {
  return {
    type: "ai_drawer_return",
    origin,
    drawerOpen,
    specialistId,
    modeId,
    toolId,
    teamMode,
    sourceType,
    outputType,
    created_at: created_at || new Date().toISOString(),
    ...extra
  };
}

// --- When Open Library is clicked from tool dock, store both bridge and drawer return context ---
function handleOpenLibraryFromDrawer({
  projectName = "",
  specialistId = "",
  modeId = "",
  toolId = "",
  teamMode = "solo",
  sourceType = "",
  outputType = ""
} = {}) {
  // Build and store drawer return context
  const payload = buildAiDrawerReturnContext({
    projectName,
    origin: "ai-command",
    drawerOpen: true,
    specialistId,
    modeId,
    toolId,
    teamMode,
    sourceType,
    outputType
  });
  setSharedAiDrawerReturn(projectName || "__default__", payload);
  // Also set library source bridge context if needed (existing logic)
  // ...existing bridge logic...
}

function formatSharedAiSource(source = {}) {
  if (!source || !source.name) return null;
  const name = source.name || "(no name)";
  const type = source.asset_type || source.type || "asset";
  const path = source.file_path || source.filename || source.fileName || "";
  return { name, type, path };
}

function getSelectedLibrarySource(projectName = "") {
  return getSharedAiSource(projectName) || getSharedAiSource("__default__");
}

function truncatePromptText(value = "", maxLength = 900) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function compactSourceReference(value = "", maxLength = 120) {
  const text = String(value || "").trim();
  if (!text || text.length <= maxLength) return text;
  const parts = text.split(/[\/]/).filter(Boolean);
  const tail = parts.slice(-2).join("/");
  if (tail && tail.length < maxLength) return `.../${tail}`;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

function buildSelectedSourceContextBlock(projectName = "") {
  const source = getSelectedLibrarySource(projectName);
  if (!source?.name) return "";

  const name = source.name || source.filename || source.fileName || "Selected Library source";
  const type = source.asset_type || source.type || source.source_type || "Library asset";
  const sourceId = source.asset_id || source.id || source.mutation_id || "";
  const path = source.file_path || source.path || source.filename || source.fileName || "";
  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  const sourceOfTruth = typeof source.source_of_truth === "boolean"
    ? (source.source_of_truth ? "yes" : "no")
    : (source.source_of_truth || "");

  const lines = [
    "Selected Library source context:",
    `- Source name: ${name}.`,
    `- Source type: ${type}.`
  ];

  if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  if (preview) lines.push(`- Text preview: ${preview}`);

  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
  return lines.join("\n");
}

function setDrawerSourceWarning(drawer, message = "") {
  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  if (!warning) return;
  const hasMessage = Boolean(message);
  warning.hidden = !hasMessage;
  warning.textContent = message;
}

function sourceMetadataNeedsLibrarySource(rawValue = "") {
  return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
}

function isDrawerSourceRequired(drawer) {
  return drawer?.dataset?.sourceRequired === "true";
}

function validateDrawerSourceRequirement(drawer, projectName = "") {
  if (!isDrawerSourceRequired(drawer)) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  const source = getSelectedLibrarySource(projectName);
  if (source?.name) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  setDrawerSourceWarning(
    drawer,
    "This tool needs a source. Choose from Library or change the source type before continuing."
  );
  return false;
}

export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  if (!drawer) return;
  const source = getSelectedLibrarySource(projectName);
  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");

  if (!source || !source.name) {
    if (selectedNode) {
      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
    }
    if (sourceInput && !sourceInput.value) {
      sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
    }
    validateDrawerSourceRequirement(drawer, projectName);
    return;
  }

  // Render compact selected source card
  const { name, type, path } = formatSharedAiSource(source);
  if (selectedNode) {
    selectedNode.innerHTML = `
      <div class=\"mhos-tool-drawer-source-card\">
        <div class=\"mhos-tool-drawer-source-eyebrow\">Selected Source</div>
        <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
        <div class=\"mhos-tool-drawer-source-actions\">
          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change Source</button>
          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove</button>
        </div>
      </div>
    `;
  }

  // Set placeholder for Source Details if empty
  if (sourceInput && !sourceInput.value) {
    sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
  }

  // Set select value if possible
  if (sourceSelect) {
    const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
      const value = `${option.value || ""} ${option.textContent || ""}`;
      return /library|source|asset|brand|product/i.test(value);
    });
    if (libraryOption) sourceSelect.value = libraryOption.value;
  }

  // Attach actions
  if (selectedNode) {
    const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
    if (changeBtn) {
      changeBtn.onclick = () => {
        drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
      };
    }
    const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
    if (removeBtn) {
      removeBtn.onclick = () => {
        clearSharedAiSource(projectName || "__default__");
        clearSharedAiSource("__default__");
        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
        if (sourceInput) sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
        if (sourceSelect) sourceSelect.value = "";
        validateDrawerSourceRequirement(drawer, projectName);
      };
    }
  }

  validateDrawerSourceRequirement(drawer, projectName);
}
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

export const TOOL_DOCK_BY_SPECIALIST = {
  strategist: [
    {
      id: "campaign-plan",
      icon: "🎯",
      label: "Campaign",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "campaign-studio",
      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
      sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
      outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
    },
    {
      id: "launch-plan",
      icon: "🚀",
      label: "Launch",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "campaign-studio",
      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
      sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
      outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
    },
    {
      id: "audience",
      icon: "◎",
      label: "Audience",
      badge: "Map",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "campaign-studio",
      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
      outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
      template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
    },
    {
      id: "offer",
      icon: "◆",
      label: "Offer",
      badge: "Value",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "campaign-studio",
      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
      sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
      outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
      template: "Create offer angles for {projectName}. Include value proposition, benefits, proof points, CTA ideas, and risk notes."
    },
    {
      id: "funnel",
      icon: "⌁",
      label: "Funnel",
      badge: "Flow",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "campaign-studio",
      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
      sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
      outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
      template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
    },
    {
      id: "priority",
      icon: "✓",
      label: "Priority",
      badge: "Next",
      actionType: "preview",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
      sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
      outputTypes: ["next_best_action", "priority_list", "blocker_map", "action_sequence"],
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
      label: "Prepare Send-Off",
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
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
      sourceTypes: ["current_chat", "campaign_brief", "brand_guidelines", "product_images", "reference_asset", "library_source", "manual_input"],
      outputTypes: ["visual_brief", "creative_direction", "format_brief", "asset_requirements"],
      template: "Prepare a visual brief for {projectName}. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA."
    },
    {
      id: "moodboard",
      icon: "▧",
      label: "Moodboard",
      badge: "Style",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "library"],
      sourceTypes: ["current_chat", "brand_guidelines", "reference_asset", "campaign_mood", "library_source", "manual_input"],
      outputTypes: ["moodboard_direction", "style_notes", "reference_list", "brand_alignment_notes"],
      template: "Define a moodboard direction for {projectName}. Include visual references, atmosphere, color feel, texture, layout mood, and brand alignment."
    },
    {
      id: "image-prompt",
      icon: "🖼",
      label: "Image",
      badge: "Prompt",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "library"],
      sourceTypes: ["current_chat", "visual_brief", "brand_guidelines", "product_data", "reference_asset", "manual_input"],
      outputTypes: ["image_prompt", "prompt_variants", "negative_prompt", "style_prompt"],
      template: "Create image generation prompts for {projectName}. Include scene, subject, lighting, style, composition, negative constraints, and brand notes."
    },
    {
      id: "asset-list",
      icon: "▣",
      label: "Assets",
      badge: "List",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "library", "workflows"],
      sourceTypes: ["current_chat", "campaign_brief", "library_folder", "brand_assets", "product_images", "manual_input"],
      outputTypes: ["asset_checklist", "missing_assets", "asset_request_brief", "production_requirements"],
      template: "Create an asset checklist for {projectName}. Include logos, product shots, lifestyle images, certificates, icons, testimonials, and missing assets."
    },
    {
      id: "layout",
      icon: "▤",
      label: "Layout",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
      sourceTypes: ["current_chat", "content_draft", "visual_brief", "brand_guidelines", "reference_asset", "manual_input"],
      outputTypes: ["layout_plan", "section_hierarchy", "responsive_notes", "cta_placement"],
      template: "Create a layout plan for {projectName}. Include sections, hierarchy, visual blocks, CTA placement, and responsive notes."
    },
    {
      id: "brand-check",
      icon: "◆",
      label: "Brand Check",
      badge: "Review",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "governance", "library"],
      sourceTypes: ["current_chat", "brand_guidelines", "visual_brief", "selected_asset", "library_source", "manual_input"],
      outputTypes: ["brand_check_report", "style_risks", "missing_assets", "improvement_actions"],
      template: "Review the visual direction for brand consistency. Flag risks, missing assets, style mismatches, and improvement actions."
    }
  ],

  video_lead: [
    {
      id: "reel-script",
      icon: "🎬",
      label: "Reel",
      badge: "Script",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
      sourceTypes: ["current_chat", "campaign_brief", "content_draft", "product_data", "library_source", "manual_input"],
      outputTypes: ["reel_script", "short_video_script", "hook_variants", "overlay_copy"],
      template: "Write a short-form reel script for {projectName}. Include hook, scene sequence, voiceover, text overlays, CTA, and shot notes."
    },
    {
      id: "storyboard",
      icon: "▥",
      label: "Storyboard",
      badge: "Video",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "library", "publishing"],
      sourceTypes: ["current_chat", "script_draft", "visual_brief", "reference_asset", "product_images", "manual_input"],
      outputTypes: ["storyboard", "scene_plan", "caption_plan", "asset_requirements"],
      template: "Create a storyboard for {projectName}. Include scenes, camera direction, motion, captions, assets needed, and CTA."
    },
    {
      id: "shot-list",
      icon: "◫",
      label: "Shot List",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "workflows", "library"],
      sourceTypes: ["current_chat", "storyboard", "visual_brief", "product_data", "production_notes", "manual_input"],
      outputTypes: ["shot_list", "b_roll_list", "prop_list", "production_checklist"],
      template: "Create a shot list for {projectName}. Include product shots, lifestyle shots, closeups, transitions, and required props."
    },
    {
      id: "voiceover",
      icon: "🎙",
      label: "Voiceover",
      badge: "Audio",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "content-studio"],
      sourceTypes: ["current_chat", "script_draft", "campaign_brief", "brand_voice", "manual_input"],
      outputTypes: ["voiceover_script", "audio_direction", "pacing_notes", "tone_variants"],
      template: "Draft a voiceover script for {projectName}. Include tone, pacing, hook, proof points, and CTA."
    },
    {
      id: "video-cta",
      icon: "▶",
      label: "Video CTA",
      badge: "Action",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "media-studio",
      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
      sourceTypes: ["current_chat", "campaign_brief", "offer_data", "video_script", "manual_input"],
      outputTypes: ["video_cta_options", "soft_cta", "direct_cta", "urgency_cta", "brand_cta"],
      template: "Create CTA options for a video campaign for {projectName}. Include soft, direct, urgency, and brand-led versions."
    }
  ],

  publisher: [
    {
      id: "publish-check",
      icon: "📤",
      label: "Publish Check",
      badge: "Ready",
      actionType: "preview",
      safetyLevel: "review_only",
      frontendOwnerPage: "publishing",
      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
      sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],
      outputTypes: ["publishing_readiness_check", "missing_items", "channel_fit_review", "risk_notes"],
      template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."
    },
    {
      id: "channel-pack",
      icon: "▦",
      label: "Channel Pack",
      badge: "Prep",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "publishing",
      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
      sourceTypes: ["content_draft", "media_asset", "campaign_brief", "channel_notes", "library_source", "manual_input"],
      outputTypes: ["channel_pack", "caption_pack", "format_notes", "approval_checklist"],
      template: "Prepare a channel package for {projectName}. Include caption, hashtags, format notes, asset needs, schedule notes, and approval checklist."
    },
    {
      id: "schedule",
      icon: "🗓",
      label: "Draft Schedule",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "publishing",
      destinations: ["chat-preview", "publishing", "workflows"],
      sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],
      outputTypes: ["schedule_builder", "calendar_slot_options", "dependency_notes", "review_gates"],
      template: "Draft a publishing schedule for {projectName}. Include channels, timing, dependencies, review gates, and next actions."
    },
    {
      id: "hashtags",
      icon: "#",
      label: "Hashtags",
      badge: "SEO",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "publishing",
      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
      sourceTypes: ["content_draft", "topic", "market", "channel_notes", "seo_brief", "manual_input"],
      outputTypes: ["hashtag_pack", "discoverability_tags", "platform_tag_groups", "market_tags"],
      template: "Suggest hashtags and discoverability tags for {projectName}. Group them by brand, product, audience, niche, and market."
    },
    {
      id: "approval-pack",
      icon: "✓",
      label: "Governance Review",
      badge: "Pack",
      actionType: "source_required",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "publishing", "workflows"],
      sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],
      outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],
      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
    }
  ],

  ads: [
    {
      id: "ad-angle",
      icon: "📣",
      label: "Ad Angle",
      badge: "Paid",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ads-manager",
      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
      sourceTypes: ["campaign_brief", "audience_notes", "offer_data", "proof_points", "library_source", "manual_input"],
      outputTypes: ["ad_angle", "angle_variants", "pain_benefit_map", "compliance_risks"],
      template: "Create paid ad angles for {projectName}. Include hook, audience pain, benefit, proof, CTA, and compliance risks."
    },
    {
      id: "ad-copy",
      icon: "✦",
      label: "Ad Copy",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ads-manager",
      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
      sourceTypes: ["ad_angle", "campaign_brief", "landing_page_copy", "product_data", "manual_input"],
      outputTypes: ["ad_copy", "headline_variants", "primary_text_variants", "cta_variants"],
      template: "Draft paid ad copy variants for {projectName}. Include primary text, headline, CTA, and angle notes."
    },
    {
      id: "targeting",
      icon: "◎",
      label: "Targeting",
      badge: "Map",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ads-manager",
      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
      outputTypes: ["audience_map", "targeting_ideas", "exclusions", "funnel_stage_map"],
      template: "Map targeting ideas for {projectName}. Include audience groups, interests, exclusions, funnel stage, and testing notes."
    },
    {
      id: "creative-test",
      icon: "A/B",
      label: "Creative",
      badge: "Test",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "ads-manager",
      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
      sourceTypes: ["creative_assets", "campaign_brief", "ad_copy", "performance_notes", "manual_input"],
      outputTypes: ["ab_test_plan", "creative_test_matrix", "hypotheses", "success_signals"],
      template: "Create a creative testing plan for {projectName}. Include hypotheses, variants, success signals, and next actions."
    },
    {
      id: "landing-match",
      icon: "↔",
      label: "Landing",
      badge: "Match",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "ads-manager",
      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
      sourceTypes: ["ad_copy", "landing_page_copy", "offer_data", "proof_points", "library_source", "manual_input"],
      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
      template: "Review ad-to-landing-page message match for {projectName}. Identify gaps, stronger claims, CTA improvements, and trust signals."
    }
  ],

  analyst: [
    {
      id: "seo-brief",
      icon: "🔎",
      label: "SEO Brief",
      badge: "Search",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "insights",
      destinations: ["chat-preview", "insights", "content-studio", "library"],
      sourceTypes: ["topic", "market", "language", "audience", "library_source", "manual_input"],
      outputTypes: ["seo_brief", "search_intent_map", "content_structure", "meta_ideas", "internal_links"],
      template: "Create an SEO brief for {projectName}. Include keywords, search intent, content structure, meta ideas, internal links, and risks."
    },
    {
      id: "insights",
      icon: "📊",
      label: "Insights",
      badge: "Data",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "insights",
      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
      sourceTypes: ["insights_data", "analytics_summary", "performance_notes", "current_chat", "manual_input"],
      outputTypes: ["insights_summary", "optimization_actions", "missing_data_notes", "risk_notes"],
      template: "Summarize insights for {projectName}. Include what is working, what is weak, missing data, and next optimization actions."
    },
    {
      id: "keywords",
      icon: "⌕",
      label: "Keywords",
      badge: "SEO",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "insights",
      destinations: ["chat-preview", "insights", "content-studio", "library"],
      sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
      outputTypes: ["keyword_groups", "commercial_keywords", "informational_keywords", "branded_keywords", "local_keywords"],
      template: "Suggest keyword groups for {projectName}. Include commercial, informational, branded, product, and local intent clusters."
    },
    {
      id: "performance",
      icon: "↗",
      label: "Performance",
      badge: "Review",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "insights",
      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
      sourceTypes: ["analytics_summary", "performance_notes", "campaign_results", "content_inventory", "manual_input"],
      outputTypes: ["performance_review", "wins", "risks", "experiment_recommendations"],
      template: "Review performance signals for {projectName}. Identify wins, risks, gaps, and recommended next experiments."
    },
    {
      id: "content-gap",
      icon: "▥",
      label: "Gaps",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "insights",
      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
      sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
      outputTypes: ["content_gap_report", "missing_topics", "missing_pages", "priority_actions"],
      template: "Identify content gaps for {projectName}. Include missing pages, missing topics, weak funnel stages, and priority actions."
    }
  ],

  compliance_reviewer: [
    {
      id: "claims-check",
      icon: "🛡",
      label: "Claims",
      badge: "Check",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
      sourceTypes: ["content_draft", "claim_list", "proof_doc", "product_data", "legal_doc", "manual_input"],
      outputTypes: ["claims_check", "risk_flags", "proof_requirements", "safe_wording_notes"],
      template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
    },
    {
      id: "safe-rewrite",
      icon: "♻",
      label: "Safe Rewrite",
      badge: "Copy",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "content-studio"],
      sourceTypes: ["content_draft", "claims_check", "legal_doc", "proof_doc", "manual_input"],
      outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
      template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
    },
    {
      id: "evidence",
      icon: "📎",
      label: "Evidence",
      badge: "Need",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "library", "workflows"],
      sourceTypes: ["content_draft", "claim_list", "product_data", "legal_doc", "research_proof_docs", "manual_input"],
      outputTypes: ["evidence_needed", "required_proof", "recommended_proof", "optional_proof"],
      template: "List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof."
    },
    {
      id: "gdpr",
      icon: "🔒",
      label: "GDPR",
      badge: "Review",
      actionType: "source_required",
      safetyLevel: "review_only",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "workflows", "publishing"],
      sourceTypes: ["workflow_draft", "privacy_policy", "tracking_plan", "data_use_notes", "manual_input"],
      outputTypes: ["gdpr_review", "consent_risks", "tracking_notes", "disclosure_requirements"],
      template: "Review GDPR/privacy considerations for this content or workflow. Flag consent, tracking, data use, and disclosure risks."
    },
    {
      id: "approval-notes",
      icon: "✓",
      label: "Governance Notes",
      badge: "Notes",
      actionType: "source_required",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "governance",
      destinations: ["chat-preview", "governance", "publishing", "workflows"],
      sourceTypes: ["final_copy", "claims_check", "approval_context", "asset_checklist", "manual_input"],
      outputTypes: ["approval_notes", "risk_summary", "reviewer_requirements", "unresolved_issues"],
      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
    }
  ],

  operations: [
    {
      id: "task-plan",
      icon: "☑",
      label: "Task Plan",
      badge: "Ops",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
      outputTypes: ["task_plan", "owner_map", "priority_list", "dependency_notes"],
      template: "Turn this into a task plan for {projectName}. Include owners, priorities, dependencies, risks, and next steps."
    },
    {
      id: "workflow",
      icon: "⚙",
      label: "Draft Workflow",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "task", "handoff"],
      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
      outputTypes: ["workflow_draft", "step_sequence", "trigger_notes", "review_gates", "execution_risks"],
      template: "Draft a workflow for {projectName}. Include steps, triggers, inputs, outputs, owners, review gates, and execution risks."
    },
    {
      id: "handoff",
      icon: "⇄",
      label: "Prepare Handoff",
      badge: "Route",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
    },
    {
      id: "timeline",
      icon: "⏱",
      label: "Timeline",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
      sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
      outputTypes: ["timeline", "milestones", "blockers", "safe_sequence"],
      template: "Create a timeline for {projectName}. Include milestones, blockers, dependencies, and safe sequencing."
    },
    {
      id: "checklist",
      icon: "☷",
      label: "Checklist",
      badge: "Ops",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "governance", "publishing"],
      sourceTypes: ["current_chat", "readiness_gaps", "asset_requirements", "approval_notes", "manual_input"],
      outputTypes: ["execution_checklist", "approval_checklist", "asset_checklist", "qa_steps"],
      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
    }
  ],

  customer_ops: [
    {
      id: "reply-draft",
      icon: "💬",
      label: "Reply",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "governance"],
      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
    },
    {
      id: "ticket",
      icon: "🎫",
      label: "Draft Ticket",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
      outputTypes: ["ticket_draft", "issue_summary", "priority_note", "missing_information"],
      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
    },
    {
      id: "sla",
      icon: "⏳",
      label: "SLA",
      badge: "Risk",
      actionType: "preview",
      safetyLevel: "review_only",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
    },
    {
      id: "summary",
      icon: "☷",
      label: "Summary",
      badge: "CX",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
      outputTypes: ["thread_summary", "sentiment_review", "open_questions", "response_context"],
      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
    }
  ],

  sales_crm: [
    {
      id: "sales-pitch",
      icon: "💼",
      label: "Pitch",
      badge: "Sales",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
      sourceTypes: ["lead_context", "sales_notes", "product_data", "offer_data", "proof_points", "manual_input"],
      outputTypes: ["sales_pitch", "value_proposition", "pain_solution_map", "cta_note"],
      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
    },
    {
      id: "follow-up",
      icon: "↩",
      label: "Follow-up",
      badge: "Email",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
      sourceTypes: ["lead_context", "meeting_notes", "sales_notes", "offer_data", "manual_input"],
      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
      template: "Draft a sales follow-up for {projectName}. Include context, value reminder, question, CTA, and next step."
    },
    {
      id: "objections",
      icon: "❓",
      label: "Objection",
      badge: "Sales",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
      sourceTypes: ["lead_context", "sales_notes", "product_data", "proof_points", "objection_notes", "manual_input"],
      outputTypes: ["objection_handling", "proof_needed", "safe_answers", "next_action"],
      template: "Prepare objection handling for {projectName}. Include likely objections, safe answers, proof needed, and next action."
    },
    {
      id: "lead-brief",
      icon: "◎",
      label: "Lead Brief",
      badge: "CRM",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
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
          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change Source</button>
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
    .join(" ")
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bSeo\b/g, "SEO")
    .replace(/\bFaq\b/g, "FAQ")
    .replace(/\bCta\b/g, "CTA")
    .replace(/\bCrm\b/g, "CRM")
    .replace(/\bGdpr\b/g, "GDPR")
    .replace(/\bAi\b/g, "AI");
}



function getMetaValues(rawValue = "") {
  return String(rawValue || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function populateDrawerSelect(select, rawValue = "", fallbackLabel = "Auto") {
  if (!select) return;
  const values = getMetaValues(rawValue);
  select.innerHTML = "";

  const fallback = document.createElement("option");
  fallback.value = "";
  fallback.textContent = fallbackLabel;
  select.appendChild(fallback);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
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
        updateStatus?.("This tool needs a source. Choose from Library or change the source type before continuing.");
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

