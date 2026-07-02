# 02 — AI Command UI Render Signals

Generated: Sat Jun  6 22:47:26 CEST 2026

public/control-center/pages/ai-command/tool-dock.js:10:} from "../../shared-context.js";
public/control-center/pages/ai-command/tool-dock.js:77:    if (returnContext.specialistId) activeDrawer.dataset.specialistId = returnContext.specialistId;
public/control-center/pages/ai-command/tool-dock.js:79:    if (returnContext.teamMode) activeDrawer.dataset.teamMode = returnContext.teamMode;
public/control-center/pages/ai-command/tool-dock.js:96:        : "Returned to drawer. No source selected.";
public/control-center/pages/ai-command/tool-dock.js:109:  specialistId = "",
public/control-center/pages/ai-command/tool-dock.js:112:  teamMode = "solo",
public/control-center/pages/ai-command/tool-dock.js:113:  sourceType = "",
public/control-center/pages/ai-command/tool-dock.js:122:    specialistId,
public/control-center/pages/ai-command/tool-dock.js:125:    teamMode,
public/control-center/pages/ai-command/tool-dock.js:126:    sourceType,
public/control-center/pages/ai-command/tool-dock.js:133:// --- When Open Library is clicked from tool dock, store both bridge and drawer return context ---
public/control-center/pages/ai-command/tool-dock.js:136:  specialistId = "",
public/control-center/pages/ai-command/tool-dock.js:139:  teamMode = "solo",
public/control-center/pages/ai-command/tool-dock.js:140:  sourceType = "",
public/control-center/pages/ai-command/tool-dock.js:143:  // Build and store drawer return context
public/control-center/pages/ai-command/tool-dock.js:148:    specialistId,
public/control-center/pages/ai-command/tool-dock.js:151:    teamMode,
public/control-center/pages/ai-command/tool-dock.js:152:    sourceType,
public/control-center/pages/ai-command/tool-dock.js:156:  // Also set library source bridge context if needed (existing logic)
public/control-center/pages/ai-command/tool-dock.js:160:function formatSharedAiSource(source = {}) {
public/control-center/pages/ai-command/tool-dock.js:161:  if (!source || !source.name) return null;
public/control-center/pages/ai-command/tool-dock.js:162:  const name = source.name || "(no name)";
public/control-center/pages/ai-command/tool-dock.js:163:  const type = source.asset_type || source.type || "asset";
public/control-center/pages/ai-command/tool-dock.js:164:  const path = source.file_path || source.filename || source.fileName || "";
public/control-center/pages/ai-command/tool-dock.js:172:function truncatePromptText(value = "", maxLength = 900) {
public/control-center/pages/ai-command/tool-dock.js:188:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:189:  if (!source?.name) return "";
public/control-center/pages/ai-command/tool-dock.js:191:  const name = source.name || source.filename || source.fileName || "Selected Library source";
public/control-center/pages/ai-command/tool-dock.js:192:  const type = source.asset_type || source.type || source.source_type || "Library asset";
public/control-center/pages/ai-command/tool-dock.js:193:  const sourceId = source.asset_id || source.id || source.mutation_id || "";
public/control-center/pages/ai-command/tool-dock.js:194:  const path = source.file_path || source.path || source.filename || source.fileName || "";
public/control-center/pages/ai-command/tool-dock.js:195:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
public/control-center/pages/ai-command/tool-dock.js:196:  const sourceOfTruth = typeof source.source_of_truth === "boolean"
public/control-center/pages/ai-command/tool-dock.js:197:    ? (source.source_of_truth ? "yes" : "no")
public/control-center/pages/ai-command/tool-dock.js:198:    : (source.source_of_truth || "");
public/control-center/pages/ai-command/tool-dock.js:201:    "Selected Library source context:",
public/control-center/pages/ai-command/tool-dock.js:206:  if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
public/control-center/pages/ai-command/tool-dock.js:208:  if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
public/control-center/pages/ai-command/tool-dock.js:209:  if (preview) lines.push(`- Text preview: ${preview}`);
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:216:  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
public/control-center/pages/ai-command/tool-dock.js:223:function sourceMetadataNeedsLibrarySource(rawValue = "") {
public/control-center/pages/ai-command/tool-dock.js:224:  return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
public/control-center/pages/ai-command/tool-dock.js:228:  return drawer?.dataset?.sourceRequired === "true";
public/control-center/pages/ai-command/tool-dock.js:237:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:238:  if (source?.name) {
public/control-center/pages/ai-command/tool-dock.js:245:    "This tool needs a source. Choose from Library or change the source type before continuing."
public/control-center/pages/ai-command/tool-dock.js:252:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:253:  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
public/control-center/pages/ai-command/tool-dock.js:254:  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:255:  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:257:  if (!source || !source.name) {
public/control-center/pages/ai-command/tool-dock.js:259:      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:261:    if (sourceInput && !sourceInput.value) {
public/control-center/pages/ai-command/tool-dock.js:262:      sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
public/control-center/pages/ai-command/tool-dock.js:268:  // Render compact selected source card
public/control-center/pages/ai-command/tool-dock.js:269:  const { name, type, path } = formatSharedAiSource(source);
public/control-center/pages/ai-command/tool-dock.js:272:      <div class=\"mhos-tool-drawer-source-card\">
public/control-center/pages/ai-command/tool-dock.js:273:        <div class=\"mhos-tool-drawer-source-eyebrow\">Selected Source</div>
public/control-center/pages/ai-command/tool-dock.js:274:        <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
public/control-center/pages/ai-command/tool-dock.js:275:        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
public/control-center/pages/ai-command/tool-dock.js:276:        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
public/control-center/pages/ai-command/tool-dock.js:277:        <div class=\"mhos-tool-drawer-source-actions\">
public/control-center/pages/ai-command/tool-dock.js:278:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change Source</button>
public/control-center/pages/ai-command/tool-dock.js:279:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove</button>
public/control-center/pages/ai-command/tool-dock.js:286:  if (sourceInput && !sourceInput.value) {
public/control-center/pages/ai-command/tool-dock.js:287:    sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
public/control-center/pages/ai-command/tool-dock.js:291:  if (sourceSelect) {
public/control-center/pages/ai-command/tool-dock.js:292:    const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
public/control-center/pages/ai-command/tool-dock.js:294:      return /library|source|asset|brand|product/i.test(value);
public/control-center/pages/ai-command/tool-dock.js:296:    if (libraryOption) sourceSelect.value = libraryOption.value;
public/control-center/pages/ai-command/tool-dock.js:301:    const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
public/control-center/pages/ai-command/tool-dock.js:307:    const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
public/control-center/pages/ai-command/tool-dock.js:312:        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:313:        if (sourceInput) sourceInput.placeholder = "Optional: add audience, usage notes, product angle, claims to avoid, or context instructions...";
public/control-center/pages/ai-command/tool-dock.js:314:        if (sourceSelect) sourceSelect.value = "";
public/control-center/pages/ai-command/tool-dock.js:328:    template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
public/control-center/pages/ai-command/tool-dock.js:335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
public/control-center/pages/ai-command/tool-dock.js:342:    template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
public/control-center/pages/ai-command/tool-dock.js:354:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:357:      sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:359:      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
public/control-center/pages/ai-command/tool-dock.js:367:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:370:      sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:372:      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:380:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:393:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:396:      sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:406:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:409:      sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:418:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:419:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:422:      sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:435:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:438:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
public/control-center/pages/ai-command/tool-dock.js:448:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:451:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:461:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:464:      sourceTypes: ["composer_text", "selected_text", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
public/control-center/pages/ai-command/tool-dock.js:474:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:477:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:486:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:487:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:489:      destinations: ["preview", "content-studio", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:490:      sourceTypes: ["composer_text", "selected_text", "content_draft", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:495:      id: "sources",
public/control-center/pages/ai-command/tool-dock.js:499:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:500:      safetyLevel: "context_only",
public/control-center/pages/ai-command/tool-dock.js:503:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "source_of_truth_assets", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:504:      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
public/control-center/pages/ai-command/tool-dock.js:505:      template: "Prepare source context for the next Content Writer task for {projectName}. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input."
public/control-center/pages/ai-command/tool-dock.js:513:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:516:      sourceTypes: ["topic", "market", "language", "audience", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:526:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:528:      destinations: ["chat-preview", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:529:      sourceTypes: ["existing_content", "composer_text", "content_draft", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:531:      template: "Repurpose existing content for {projectName}. Ask or infer the source format and target format: blog to posts, profile to pitch, product page to ad copy, transcript to article, notes to presentation outline, or long text to email sequence."
public/control-center/pages/ai-command/tool-dock.js:534:      id: "send",
public/control-center/pages/ai-command/tool-dock.js:542:      sourceTypes: ["current_draft", "preview", "current_chat"],
public/control-center/pages/ai-command/tool-dock.js:543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
public/control-center/pages/ai-command/tool-dock.js:544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
public/control-center/pages/ai-command/tool-dock.js:554:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:557:      sourceTypes: ["current_chat", "campaign_brief", "brand_guidelines", "product_images", "reference_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:558:      outputTypes: ["visual_brief", "creative_direction", "format_brief", "asset_requirements"],
public/control-center/pages/ai-command/tool-dock.js:559:      template: "Prepare a visual brief for {projectName}. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA."
public/control-center/pages/ai-command/tool-dock.js:567:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:569:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:570:      sourceTypes: ["current_chat", "brand_guidelines", "reference_asset", "campaign_mood", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:575:      id: "image-prompt",
public/control-center/pages/ai-command/tool-dock.js:580:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:582:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:583:      sourceTypes: ["current_chat", "visual_brief", "brand_guidelines", "product_data", "reference_asset", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:584:      outputTypes: ["image_prompt", "prompt_variants", "negative_prompt", "style_prompt"],
public/control-center/pages/ai-command/tool-dock.js:585:      template: "Create image generation prompts for {projectName}. Include scene, subject, lighting, style, composition, negative constraints, and brand notes."
public/control-center/pages/ai-command/tool-dock.js:588:      id: "asset-list",
public/control-center/pages/ai-command/tool-dock.js:592:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:593:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:596:      sourceTypes: ["current_chat", "campaign_brief", "library_folder", "brand_assets", "product_images", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:597:      outputTypes: ["asset_checklist", "missing_assets", "asset_request_brief", "production_requirements"],
public/control-center/pages/ai-command/tool-dock.js:598:      template: "Create an asset checklist for {projectName}. Include logos, product shots, lifestyle images, certificates, icons, testimonials, and missing assets."
public/control-center/pages/ai-command/tool-dock.js:606:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:609:      sourceTypes: ["current_chat", "content_draft", "visual_brief", "brand_guidelines", "reference_asset", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:618:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:619:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
public/control-center/pages/ai-command/tool-dock.js:622:      sourceTypes: ["current_chat", "brand_guidelines", "visual_brief", "selected_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:623:      outputTypes: ["brand_check_report", "style_risks", "missing_assets", "improvement_actions"],
public/control-center/pages/ai-command/tool-dock.js:624:      template: "Review the visual direction for brand consistency. Flag risks, missing assets, style mismatches, and improvement actions."
public/control-center/pages/ai-command/tool-dock.js:635:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:638:      sourceTypes: ["current_chat", "campaign_brief", "content_draft", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:648:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:651:      sourceTypes: ["current_chat", "script_draft", "visual_brief", "reference_asset", "product_images", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:652:      outputTypes: ["storyboard", "scene_plan", "caption_plan", "asset_requirements"],
public/control-center/pages/ai-command/tool-dock.js:653:      template: "Create a storyboard for {projectName}. Include scenes, camera direction, motion, captions, assets needed, and CTA."
public/control-center/pages/ai-command/tool-dock.js:661:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
public/control-center/pages/ai-command/tool-dock.js:664:      sourceTypes: ["current_chat", "storyboard", "visual_brief", "product_data", "production_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:674:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:676:      destinations: ["chat-preview", "media-studio", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:677:      sourceTypes: ["current_chat", "script_draft", "campaign_brief", "brand_voice", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:687:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:690:      sourceTypes: ["current_chat", "campaign_brief", "offer_data", "video_script", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:702:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:703:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:706:      sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:707:      outputTypes: ["publishing_readiness_check", "missing_items", "channel_fit_review", "risk_notes"],
public/control-center/pages/ai-command/tool-dock.js:708:      template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."
public/control-center/pages/ai-command/tool-dock.js:716:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:719:      sourceTypes: ["content_draft", "media_asset", "campaign_brief", "channel_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:721:      template: "Prepare a channel package for {projectName}. Include caption, hashtags, format notes, asset needs, schedule notes, and approval checklist."
public/control-center/pages/ai-command/tool-dock.js:731:      destinations: ["chat-preview", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:732:      sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:733:      outputTypes: ["schedule_builder", "calendar_slot_options", "dependency_notes", "review_gates"],
public/control-center/pages/ai-command/tool-dock.js:734:      template: "Draft a publishing schedule for {projectName}. Include channels, timing, dependencies, review gates, and next actions."
public/control-center/pages/ai-command/tool-dock.js:742:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:745:      sourceTypes: ["content_draft", "topic", "market", "channel_notes", "seo_brief", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:754:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:758:      sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:759:      outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],
public/control-center/pages/ai-command/tool-dock.js:760:      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
public/control-center/pages/ai-command/tool-dock.js:771:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:774:      sourceTypes: ["campaign_brief", "audience_notes", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:784:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:787:      sourceTypes: ["ad_angle", "campaign_brief", "landing_page_copy", "product_data", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:797:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:810:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:813:      sourceTypes: ["creative_assets", "campaign_brief", "ad_copy", "performance_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:822:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:823:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:826:      sourceTypes: ["ad_copy", "landing_page_copy", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:827:      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
public/control-center/pages/ai-command/tool-dock.js:839:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:842:      sourceTypes: ["topic", "market", "language", "audience", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:851:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:852:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:855:      sourceTypes: ["insights_data", "analytics_summary", "performance_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:865:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:868:      sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:877:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:878:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:881:      sourceTypes: ["analytics_summary", "performance_notes", "campaign_results", "content_inventory", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:882:      outputTypes: ["performance_review", "wins", "risks", "experiment_recommendations"],
public/control-center/pages/ai-command/tool-dock.js:891:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:894:      sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:900:  compliance_reviewer: [
public/control-center/pages/ai-command/tool-dock.js:906:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:907:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:910:      sourceTypes: ["content_draft", "claim_list", "proof_doc", "product_data", "legal_doc", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:920:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:922:      destinations: ["chat-preview", "governance", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:923:      sourceTypes: ["content_draft", "claims_check", "legal_doc", "proof_doc", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:924:      outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
public/control-center/pages/ai-command/tool-dock.js:932:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:933:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:935:      destinations: ["chat-preview", "governance", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:936:      sourceTypes: ["content_draft", "claim_list", "product_data", "legal_doc", "research_proof_docs", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:945:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:946:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:949:      sourceTypes: ["workflow_draft", "privacy_policy", "tracking_plan", "data_use_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:950:      outputTypes: ["gdpr_review", "consent_risks", "tracking_notes", "disclosure_requirements"],
public/control-center/pages/ai-command/tool-dock.js:958:      actionType: "source_required",
public/control-center/pages/ai-command/tool-dock.js:961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:962:      sourceTypes: ["final_copy", "claims_check", "approval_context", "asset_checklist", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:963:      outputTypes: ["approval_notes", "risk_summary", "reviewer_requirements", "unresolved_issues"],
public/control-center/pages/ai-command/tool-dock.js:964:      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:975:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:978:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:991:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:992:      outputTypes: ["workflow_draft", "step_sequence", "trigger_notes", "review_gates", "execution_risks"],
public/control-center/pages/ai-command/tool-dock.js:993:      template: "Draft a workflow for {projectName}. Include steps, triggers, inputs, outputs, owners, review gates, and execution risks."
public/control-center/pages/ai-command/tool-dock.js:1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1005:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
public/control-center/pages/ai-command/tool-dock.js:1006:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
public/control-center/pages/ai-command/tool-dock.js:1014:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1017:      sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1027:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1030:      sourceTypes: ["current_chat", "readiness_gaps", "asset_requirements", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1031:      outputTypes: ["execution_checklist", "approval_checklist", "asset_checklist", "qa_steps"],
public/control-center/pages/ai-command/tool-dock.js:1032:      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1046:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1059:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1068:      actionType: "preview",
public/control-center/pages/ai-command/tool-dock.js:1069:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1072:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1073:      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
public/control-center/pages/ai-command/tool-dock.js:1074:      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:1082:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1085:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1086:      outputTypes: ["thread_summary", "sentiment_review", "open_questions", "response_context"],
public/control-center/pages/ai-command/tool-dock.js:1087:      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
public/control-center/pages/ai-command/tool-dock.js:1098:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1101:      sourceTypes: ["lead_context", "sales_notes", "product_data", "offer_data", "proof_points", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1114:      sourceTypes: ["lead_context", "meeting_notes", "sales_notes", "offer_data", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1115:      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
public/control-center/pages/ai-command/tool-dock.js:1116:      template: "Draft a sales follow-up for {projectName}. Include context, value reminder, question, CTA, and next step."
public/control-center/pages/ai-command/tool-dock.js:1124:      safetyLevel: "review_only",
public/control-center/pages/ai-command/tool-dock.js:1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1127:      sourceTypes: ["lead_context", "sales_notes", "product_data", "proof_points", "objection_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1147:function getSpecialistTools(specialistId = "") {
public/control-center/pages/ai-command/tool-dock.js:1148:  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
public/control-center/pages/ai-command/tool-dock.js:1151:export function getAiToolDockTools({ specialistId = "", teamMode = "solo", limit = 9 } = {}) {
public/control-center/pages/ai-command/tool-dock.js:1152:  const tools = teamMode === "team"
public/control-center/pages/ai-command/tool-dock.js:1158:    : getSpecialistTools(specialistId);
public/control-center/pages/ai-command/tool-dock.js:1163:function getDockTools({ specialistId = "", teamMode = "solo" } = {}) {
public/control-center/pages/ai-command/tool-dock.js:1164:  if (teamMode === "team") {
public/control-center/pages/ai-command/tool-dock.js:1172:  return getSpecialistTools(specialistId).slice(0, 9);
public/control-center/pages/ai-command/tool-dock.js:1179:    .replace(/\{specialistLabel\}/g, values.specialistLabel || "the active specialist");
public/control-center/pages/ai-command/tool-dock.js:1208:          Choose the output, source, and destination before preparing a review-only composer prompt.
public/control-center/pages/ai-command/tool-dock.js:1219:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-source-select></select>
public/control-center/pages/ai-command/tool-dock.js:1220:            <div class="mhos-tool-drawer-selected-source" data-aicmd-tool-drawer-selected-source></div>
public/control-center/pages/ai-command/tool-dock.js:1221:            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
public/control-center/pages/ai-command/tool-dock.js:1258:                data-aicmd-tool-drawer-source-details
public/control-center/pages/ai-command/tool-dock.js:1283:          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1307:export function renderAiToolDock({ projectName = "", specialistId = "", teamMode = "solo", escapeHtml }) {
public/control-center/pages/ai-command/tool-dock.js:1311:  const tools = getDockTools({ specialistId, teamMode });
public/control-center/pages/ai-command/tool-dock.js:1312:  const label = teamMode === "team" ? "Team guided tools" : "Specialist guided tools";
public/control-center/pages/ai-command/tool-dock.js:1318:        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
public/control-center/pages/ai-command/tool-dock.js:1330:            data-aicmd-tool-dock-safety="${safe(tool.safetyLevel || "review_only")}"
public/control-center/pages/ai-command/tool-dock.js:1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
public/control-center/pages/ai-command/tool-dock.js:1333:            data-aicmd-tool-dock-sources="${safe(joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])))}"
public/control-center/pages/ai-command/tool-dock.js:1437:    "- Do not invent certifications, claims, ingredients, prices, guarantees, or statistics without source evidence."
public/control-center/pages/ai-command/tool-dock.js:1445:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
public/control-center/pages/ai-command/tool-dock.js:1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1449:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1452:  const sourceInstruction = sourceDetails
public/control-center/pages/ai-command/tool-dock.js:1453:    ? `${source}. Source details: ${sourceDetails}.`
public/control-center/pages/ai-command/tool-dock.js:1454:    : `${source}. If the selected source is not available in the current context, ask me to choose, paste, upload, or open the relevant source before producing final content.`;
public/control-center/pages/ai-command/tool-dock.js:1463:    `- Source/input: ${sourceInstruction}`,
public/control-center/pages/ai-command/tool-dock.js:1484:    `Create the requested ${output.toLowerCase()} as review-ready content.`,
public/control-center/pages/ai-command/tool-dock.js:1485:    "Use only the available context and selected source details.",
public/control-center/pages/ai-command/tool-dock.js:1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1506:    "- Prepare review-ready output only.",
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1520:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Auto");
public/control-center/pages/ai-command/tool-dock.js:1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1524:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1528:  if (source !== "Auto" && source !== "Current chat or ask if source is needed") summaryParts.push("Library source selected");
public/control-center/pages/ai-command/tool-dock.js:1558:  drawer.dataset.specialistId = session?.modeId || "";
public/control-center/pages/ai-command/tool-dock.js:1560:  drawer.dataset.teamMode = session?.teamMode || "solo";
public/control-center/pages/ai-command/tool-dock.js:1568:    `Prepare ${btn.getAttribute("data-aicmd-tool-dock-label") || "this tool"} for the active project. Choose the output, source, destination, language, and tone before using it in the composer.`
public/control-center/pages/ai-command/tool-dock.js:1570:  setDrawerText(drawer, "[data-aicmd-tool-drawer-safety]", humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-safety") || "review_only"));
public/control-center/pages/ai-command/tool-dock.js:1573:  const rawSources = btn.getAttribute("data-aicmd-tool-dock-sources") || "";
public/control-center/pages/ai-command/tool-dock.js:1575:  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";
public/control-center/pages/ai-command/tool-dock.js:1579:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-source-select]"), rawSources, "Choose source / input");
public/control-center/pages/ai-command/tool-dock.js:1615:  const actionType = tool.requiresSelectedSource && !tool.actionType ? "source_required" : (tool.actionType || tool.action || "guided");
public/control-center/pages/ai-command/tool-dock.js:1622:    "data-aicmd-tool-dock-safety": tool.safetyLevel || "review_only",
public/control-center/pages/ai-command/tool-dock.js:1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
public/control-center/pages/ai-command/tool-dock.js:1625:    "data-aicmd-tool-dock-sources": joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])),
public/control-center/pages/ai-command/tool-dock.js:1637:    text: template || tool.template || tool.prompt || "",
public/control-center/pages/ai-command/tool-dock.js:1653:  specialistLabel = "",
public/control-center/pages/ai-command/tool-dock.js:1671:      const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:1678:        specialistId: drawer?.dataset?.specialistId || "",
public/control-center/pages/ai-command/tool-dock.js:1681:        teamMode: session?.teamMode || "solo",
public/control-center/pages/ai-command/tool-dock.js:1682:        sourceType: selectedSourceType,
public/control-center/pages/ai-command/tool-dock.js:1687:        type: "library_source_selection",
public/control-center/pages/ai-command/tool-dock.js:1690:        sourceType: selectedSourceType,
public/control-center/pages/ai-command/tool-dock.js:1692:        targetSection: "asset-workspace",
public/control-center/pages/ai-command/tool-dock.js:1701:      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
public/control-center/pages/ai-command/tool-dock.js:1708:  // Patch drawer population to apply source
public/control-center/pages/ai-command/tool-dock.js:1720:        updateStatus?.("This tool needs a source. Choose from Library or change the source type before continuing.");
public/control-center/pages/ai-command/tool-dock.js:1729:          specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
public/control-center/pages/ai-command/tool-dock.js:1742:        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
public/control-center/pages/ai-command/tool-dock.js:1776:        specialistLabel: session.teamMode === "team" ? "Full Team" : specialistLabel || "active specialist"
public/control-center/pages/ai-command/tool-dock.js:1788:        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);
public/control-center/pages/publishing/publishing-payloads.js:58:  const draftContext = asObject(payload.draft_context);
public/control-center/pages/publishing/publishing-payloads.js:60:    id: asString(handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
public/control-center/pages/publishing/publishing-payloads.js:61:    sourcePage: asString(handoff?.source_page || "workflows"),
public/control-center/pages/publishing/publishing-payloads.js:67:    contentItem: firstText(output.content_item, output.contentItem, output.summary, payload.prompt),
public/control-center/pages/publishing/publishing-payloads.js:68:    summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),
public/control-center/pages/home/render-sections.js:87:    return `<p class="home-empty-note">AI team status is not available yet.</p>`;
public/control-center/pages/home/render-sections.js:91:    <div class="home-ai-team-grid">
public/control-center/pages/home/render-sections.js:93:          <button class="home-ai-team-card" type="button" data-role-id="${escapeHtml(agent.id || "")}" title="Click to open ${escapeHtml(agent.name)} workspace">
public/control-center/pages/home/render-sections.js:94:          <div class="home-ai-team-card-head">
public/control-center/pages/campaign-studio.js:1:import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/campaign-studio.js:7:} from "../asset-library.js";
public/control-center/pages/campaign-studio.js:60:  reviewRole: "admin"
public/control-center/pages/campaign-studio.js:114:function renderTeamOpsSummary(model, escapeHtml) {
public/control-center/pages/campaign-studio.js:119:      <div class="data-row"><span>Review owner</span><strong>${escapeHtml(titleCase(CAMPAIGN_ROLE_DEFAULTS.reviewRole))}</strong></div>
public/control-center/pages/campaign-studio.js:121:      <div class="data-row"><span>Readiness</span><strong>${escapeHtml(model.executionReadiness.status)}</strong></div>
public/control-center/pages/campaign-studio.js:210:  const assets = asObject(state.data.assets);
public/control-center/pages/campaign-studio.js:212:  const context = asObject(state.context);
public/control-center/pages/campaign-studio.js:214:  const market = context.currentMarket || overviewData.market || "";
public/control-center/pages/campaign-studio.js:215:  const language = context.currentLanguage || overviewData.language || "";
public/control-center/pages/campaign-studio.js:216:  const campaignName = context.activeCampaign || `${context.currentProject || "Campaign"} Launch`;
public/control-center/pages/campaign-studio.js:217:  const missingAssets = getMissingAssetLabels(assets);
public/control-center/pages/campaign-studio.js:218:  const requiredAssetTypes = getCategoryReadinessList(assets).map((item) => item.display_label || item.label || item.asset_type);
public/control-center/pages/campaign-studio.js:232:    productFocus: context.currentProject || overviewData.project_name || "",
public/control-center/pages/campaign-studio.js:252:    assetChecklist: missingAssets.length ? missingAssets.join(", ") : requiredAssetTypes.join(", "),
public/control-center/pages/campaign-studio.js:325:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:381:  const handoffId = asString(handoff?.id || handoff?.updated_at || handoff?.created_at || handoff?.payload?.prompt);
public/control-center/pages/campaign-studio.js:411:    assetChecklist: firstNonEmpty(joinPackageList(pkg.requiredAssets || pkg.required_assets), session.values.assetChecklist),
public/control-center/pages/campaign-studio.js:425:    source_page: "ai-command",
public/control-center/pages/campaign-studio.js:452:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:455:    review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
public/control-center/pages/campaign-studio.js:457:    linked_assets: [],
public/control-center/pages/campaign-studio.js:469:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:471:    source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
public/control-center/pages/campaign-studio.js:473:    source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
public/control-center/pages/campaign-studio.js:485:      review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
public/control-center/pages/campaign-studio.js:487:      draft_context: buildCampaignRecordPayload(projectName, session)
public/control-center/pages/campaign-studio.js:853:    publishingBlockers.push("Critical creative or offer assets are still missing.");
public/control-center/pages/campaign-studio.js:873:  if (!checks.website) seoBlockers.push("Website source is not connected yet.");
public/control-center/pages/campaign-studio.js:878:  if (!values.audiencePrimary || !values.audienceNeed) approvalBlockers.push("Audience framing is incomplete for creative review.");
public/control-center/pages/campaign-studio.js:978:    if (missingAssets.length) missingInputs.push("Supporting assets");
public/control-center/pages/campaign-studio.js:989:        ? "Proof assets, FAQ content, educational visual set"
public/control-center/pages/campaign-studio.js:1010:  const assets = asObject(state.data.assets);
public/control-center/pages/campaign-studio.js:1025:    "campaign_assets",
public/control-center/pages/campaign-studio.js:1026:    "social_assets",
public/control-center/pages/campaign-studio.js:1029:  const campaignAssetCategories = getCategoryReadinessList(assets)
public/control-center/pages/campaign-studio.js:1030:    .filter((item) => campaignAssetKeys.includes(item.asset_type));
public/control-center/pages/campaign-studio.js:1031:  const missingAssets = getMissingAssetLabels(assets, campaignAssetKeys);
public/control-center/pages/campaign-studio.js:1032:  const requiredAssetTypes = uniqueStrings(campaignAssetCategories.map((item) => item.display_label || item.label || item.asset_type));
public/control-center/pages/campaign-studio.js:1033:  const assetTypesPresent = uniqueStrings(
public/control-center/pages/campaign-studio.js:1036:      .map((item) => item.display_label || item.label || item.asset_type)
public/control-center/pages/campaign-studio.js:1044:  const sourceCoverage = asObject(insights.data_coverage);
public/control-center/pages/campaign-studio.js:1047:  Object.entries(sourceCoverage).forEach(([key, item]) => {
public/control-center/pages/campaign-studio.js:1129:    assetTypesPresent,
public/control-center/pages/campaign-studio.js:1132:    assetNextAction: getAssetNextAction(assets, campaignAssetKeys),
public/control-center/pages/campaign-studio.js:1256:  const projectName = state.context.currentProject || "";
public/control-center/pages/campaign-studio.js:1323:      const prompt = `Build an execution plan for campaign ${session.values.campaignName || "this campaign"} with goal ${session.values.campaignGoal || "launch"}, channels ${session.values.channelPlan || "to be defined"}, and offer ${session.values.offerHeadline || "to be defined"}. Use current project intelligence, readiness blockers, and recommendation signals.`;
public/control-center/pages/campaign-studio.js:1326:        input.value = prompt;
public/control-center/pages/campaign-studio.js:1329:        source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:1332:          prompt,
public/control-center/pages/campaign-studio.js:1335:          draft_context: buildCampaignRecordPayload(projectName, session)
public/control-center/pages/campaign-studio.js:1340:        source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:1342:        source_role: CAMPAIGN_ROLE_DEFAULTS.ownerRole,
public/control-center/pages/campaign-studio.js:1344:        source_service_domain: CAMPAIGN_ROLE_DEFAULTS.serviceDomain,
public/control-center/pages/campaign-studio.js:1351:          prompt,
public/control-center/pages/campaign-studio.js:1355:          review_role: CAMPAIGN_ROLE_DEFAULTS.reviewRole,
public/control-center/pages/campaign-studio.js:1357:          draft_context: buildCampaignRecordPayload(projectName, session)
public/control-center/pages/campaign-studio.js:1363:      showMessage?.("Campaign context sent to AI Command.");
public/control-center/pages/campaign-studio.js:1375:  const assetsBtn = $("campaignReviewAssetsBtn");
public/control-center/pages/campaign-studio.js:1376:  if (assetsBtn) {
public/control-center/pages/campaign-studio.js:1377:    assetsBtn.onclick = () => navigateTo("library");
public/control-center/pages/campaign-studio.js:1416:      const model = buildCampaignModel(state, session, session.values);
public/control-center/pages/campaign-studio.js:1417:      if (model.executionReadiness.missingIntegrations.length) {
public/control-center/pages/campaign-studio.js:1421:      if (model.executionReadiness.missingAssets.length) {
public/control-center/pages/campaign-studio.js:1454:    description: "Plan campaign basics, launch waves, channel mix, and required assets in one execution-oriented workspace."
public/control-center/pages/campaign-studio.js:1475:    const projectName = state.context.currentProject || "";
public/control-center/pages/campaign-studio.js:1505:    const model = buildCampaignModel(state, session, values);
public/control-center/pages/campaign-studio.js:1511:      assetTypesPresent,
public/control-center/pages/campaign-studio.js:1513:      assetNextAction,
public/control-center/pages/campaign-studio.js:1530:    } = model;
public/control-center/pages/campaign-studio.js:1531:    const activeCampaignLabel = safeText(firstNonEmpty(state.context.activeCampaign, values.campaignName), projectName || "Campaign Studio");
public/control-center/pages/campaign-studio.js:1557:        <section class="mhos-campaign-command-header mhos-context-ribbon" aria-label="Campaign command board">
public/control-center/pages/campaign-studio.js:1558:          <div class="mhos-campaign-command-main mhos-context-main">
public/control-center/pages/campaign-studio.js:1559:            <div class="mhos-campaign-kicker-row mhos-context-kicker">
public/control-center/pages/campaign-studio.js:1560:              <span class="mhos-campaign-kicker mhos-context-kicker">Campaign Command Board</span>
public/control-center/pages/campaign-studio.js:1563:            <h2 class="mhos-campaign-title mhos-context-title">${escapeHtml(activeCampaignLabel)}</h2>
public/control-center/pages/campaign-studio.js:1564:            <p class="mhos-campaign-summary mhos-context-description">${escapeHtml(goalLabel)}</p>
public/control-center/pages/campaign-studio.js:1565:            <div class="mhos-campaign-context-row mhos-context-chip-row" aria-label="Campaign context">
public/control-center/pages/campaign-studio.js:1566:              <span class="mhos-campaign-context-item mhos-context-chip">Market <strong class="mhos-campaign-context-value">${escapeHtml(marketLabel)}</strong></span>
public/control-center/pages/campaign-studio.js:1567:              <span class="mhos-campaign-context-item mhos-context-chip">Product <strong class="mhos-campaign-context-value">${escapeHtml(productLabel)}</strong></span>
public/control-center/pages/campaign-studio.js:1568:              <span class="mhos-campaign-context-item mhos-context-chip">Budget <strong class="mhos-campaign-context-value">${escapeHtml(budgetLabel)}</strong></span>
public/control-center/pages/campaign-studio.js:1569:              <span class="mhos-campaign-context-item mhos-context-chip">Window <strong class="mhos-campaign-context-value">${escapeHtml(launchWindowLabel)}</strong></span>
public/control-center/pages/campaign-studio.js:1573:          <aside class="mhos-campaign-strategist-panel mhos-context-actions mhos-executive-ai-panel" aria-label="Campaign strategist recommendation">
public/control-center/pages/campaign-studio.js:1579:          <div class="mhos-campaign-actions mhos-context-actions mhos-executive-action-row" aria-label="Campaign command actions">
public/control-center/pages/campaign-studio.js:1580:            <button id="campaignRefreshIntelligenceBtn" class="btn btn-secondary mhos-context-action" type="button">Refresh campaign intelligence</button>
public/control-center/pages/campaign-studio.js:1581:            <button id="campaignSaveDraftBtn" class="btn btn-secondary mhos-context-action" type="button">Save campaign draft</button>
public/control-center/pages/campaign-studio.js:1582:            <button id="campaignBuildPlanBtn" class="btn btn-primary mhos-context-action" type="button">Save campaign plan</button>
public/control-center/pages/campaign-studio.js:1617:                Lock the core campaign definition first so planning, routing, and AI prompts all reference the same structure.
public/control-center/pages/campaign-studio.js:1640:                  helper: "Use the operational framing the team should align around across planning and execution.",
public/control-center/pages/campaign-studio.js:1666:                  helper: "Optional hard stop or review date.",
public/control-center/pages/campaign-studio.js:1687:                Keep product, audience, offer, and channel choices explicit so downstream teams do not have to reinterpret the plan.
public/control-center/pages/campaign-studio.js:1791:                        <span>Supporting assets</span>
public/control-center/pages/campaign-studio.js:1838:                Review the recommended campaign direction, required assets, and real blockers before sending the plan into downstream work.
public/control-center/pages/campaign-studio.js:1883:                  name: "assetChecklist",
public/control-center/pages/campaign-studio.js:1885:                  value: values.assetChecklist,
public/control-center/pages/campaign-studio.js:1886:                  helper: "Define what must exist before the campaign can execute smoothly across channels and waves.",
public/control-center/pages/campaign-studio.js:1896:                  placeholder: "Anything the execution team must know",
public/control-center/pages/campaign-studio.js:1903:                ${renderAssetDependencyRows(state.data.assets, campaignAssetKeys, escapeHtml, "Product, pricing, and campaign assets are covered.")}
public/control-center/pages/campaign-studio.js:1904:                <div class="simple-banner" style="margin-top: 12px;">${escapeHtml(assetNextAction)}</div>
public/control-center/pages/campaign-studio.js:1908:                  "Missing assets",
public/control-center/pages/campaign-studio.js:1911:                  "Required assets currently look covered."
public/control-center/pages/campaign-studio.js:1947:                  "Approval inputs look complete enough for review."
public/control-center/pages/campaign-studio.js:1960:                Send campaign context to AI prefills the current campaign draft and then navigates there. The downstream send actions open the linked workspace with the current campaign context attached.
public/control-center/pages/campaign-studio.js:1972:                  <span class="home-action-title">Send campaign context to AI</span>
public/control-center/pages/campaign-studio.js:1973:                  <span class="home-action-meta">Prefill AI Command with the current draft, blockers, and campaign context, then open that page.</span>
public/control-center/pages/campaign-studio.js:1998:                  <span class="home-action-title">Review campaign assets in Library</span>
public/control-center/pages/campaign-studio.js:1999:                  <span class="home-action-meta">Navigation only. Review missing assets before execution starts.</span>
public/control-center/pages/media-studio-workspace.js:25:} from "../asset-library.js";
public/control-center/pages/media-studio-workspace.js:26:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/media-studio-workspace.js:30:const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
public/control-center/pages/media-studio-workspace.js:32:const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
public/control-center/pages/media-studio-workspace.js:33:const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
public/control-center/pages/media-studio-workspace.js:36:const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
public/control-center/pages/media-studio-workspace.js:41:  reviewRole: "compliance_reviewer",
public/control-center/pages/media-studio-workspace.js:44:const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
public/control-center/pages/media-studio-workspace.js:75:    id: "prompt-engineer",
public/control-center/pages/media-studio-workspace.js:77:    purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
public/control-center/pages/media-studio-workspace.js:79:    suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
public/control-center/pages/media-studio-workspace.js:85:    bestUse: "Right before preparing a Publishing package for downstream review.",
public/control-center/pages/media-studio-workspace.js:151:  return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name, "Workspace");
public/control-center/pages/media-studio-workspace.js:155:  return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name);
public/control-center/pages/media-studio-workspace.js:159:  return asObject(state.data.assets);
public/control-center/pages/media-studio-workspace.js:166:  if (["prompt_ready", "prompt ready", "ready"].includes(normalized)) return "prompt_ready";
public/control-center/pages/media-studio-workspace.js:167:  if (["generating", "running", "processing", "in_progress"].includes(normalized)) return "generating";
public/control-center/pages/media-studio-workspace.js:168:  if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
public/control-center/pages/media-studio-workspace.js:178:  if (status === "prompt_ready" || status === "generating" || status === "needs_review") return "warning";
public/control-center/pages/media-studio-workspace.js:234:function upsertLocalLibraryAsset(projectName, asset) {
public/control-center/pages/media-studio-workspace.js:238:    ...asObject(asset),
public/control-center/pages/media-studio-workspace.js:239:    id: asString(asset.id || `media-library-${Date.now()}`),
public/control-center/pages/media-studio-workspace.js:240:    source_signature: asString(asset.source_signature),
public/control-center/pages/media-studio-workspace.js:245:    const sameSignature = nextAsset.source_signature && asString(item.source_signature) === nextAsset.source_signature;
public/control-center/pages/media-studio-workspace.js:261:    source: "Local draft",
public/control-center/pages/media-studio-workspace.js:270:  const context = asObject(state.context);
public/control-center/pages/media-studio-workspace.js:274:    project: firstText(context.currentProject, overview.project_name),
public/control-center/pages/media-studio-workspace.js:275:    campaign: firstText(context.activeCampaign, overview.active_campaign),
public/control-center/pages/media-studio-workspace.js:276:    product: firstText(overview.project_name, context.currentProject),
public/control-center/pages/media-studio-workspace.js:281:    prompt: "",
public/control-center/pages/media-studio-workspace.js:284:    reviewNotes: "",
public/control-center/pages/media-studio-workspace.js:297:  prompt = "",
public/control-center/pages/media-studio-workspace.js:299:  providerStatus = "prompt_ready",
public/control-center/pages/media-studio-workspace.js:302:  provider = "",
public/control-center/pages/media-studio-workspace.js:303:  model = "",
public/control-center/pages/media-studio-workspace.js:310:    prompt: asString(prompt),
public/control-center/pages/media-studio-workspace.js:312:    provider_status: MEDIA_PREVIEW_STATES.includes(asString(providerStatus)) ? asString(providerStatus) : "prompt_ready",
public/control-center/pages/media-studio-workspace.js:315:    provider: asString(provider),
public/control-center/pages/media-studio-workspace.js:316:    model: asString(model),
public/control-center/pages/media-studio-workspace.js:317:    library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
public/control-center/pages/media-studio-workspace.js:335:    prompt: firstText(raw.prompt, raw.input_prompt),
public/control-center/pages/media-studio-workspace.js:337:    providerStatus: firstText(raw.provider_status, raw.status, "prompt_ready"),
public/control-center/pages/media-studio-workspace.js:340:    provider: firstText(raw.provider),
public/control-center/pages/media-studio-workspace.js:341:    model: firstText(raw.model),
public/control-center/pages/media-studio-workspace.js:342:    libraryAssetRef: raw.library_asset_ref || null,
public/control-center/pages/media-studio-workspace.js:351:    prompt: clean(seedPrompt),
public/control-center/pages/media-studio-workspace.js:353:    providerStatus: firstText(seed.providerStatus, "prompt_ready"),
public/control-center/pages/media-studio-workspace.js:356:    provider: firstText(seed.provider, ""),
public/control-center/pages/media-studio-workspace.js:357:    model: firstText(seed.model, ""),
public/control-center/pages/media-studio-workspace.js:371:    session.versioning = createVersioningState(session.form?.prompt, session.form?.reviewNotes, {
public/control-center/pages/media-studio-workspace.js:377:    session.versioning.versions = createVersioningState(session.form?.prompt, session.form?.reviewNotes).versions;
public/control-center/pages/media-studio-workspace.js:425:  return createVersioningState(itemObject.prompt || "", itemObject.reviewNotes || "", {
public/control-center/pages/media-studio-workspace.js:434:  current.prompt = clean(session.form.prompt);
public/control-center/pages/media-studio-workspace.js:435:  current.notes = clean(session.form.reviewNotes);
public/control-center/pages/media-studio-workspace.js:443:  session.form.prompt = current.prompt || "";
public/control-center/pages/media-studio-workspace.js:444:  session.form.reviewNotes = current.notes || "";
public/control-center/pages/media-studio-workspace.js:499:function normalizeMediaItem(rawItem, state, source = "Backend media job") {
public/control-center/pages/media-studio-workspace.js:505:    title: firstText(raw.title, raw.name, raw.prompt, `${titleCase(mode)} media job`),
public/control-center/pages/media-studio-workspace.js:508:    project: firstText(raw.project, raw.project_name, state.context?.currentProject),
public/control-center/pages/media-studio-workspace.js:509:    campaign: firstText(raw.campaign, raw.campaign_name, raw.campaign_id, state.context?.activeCampaign),
public/control-center/pages/media-studio-workspace.js:515:    prompt: firstText(raw.prompt, raw.generation_prompt),
public/control-center/pages/media-studio-workspace.js:517:    referenceAsset: firstText(raw.reference_asset, raw.referenceAsset, raw.asset_id),
public/control-center/pages/media-studio-workspace.js:521:    provider: asString(raw.provider || ""),
public/control-center/pages/media-studio-workspace.js:522:    model: asString(raw.model || ""),
public/control-center/pages/media-studio-workspace.js:525:    review_role: asString(raw.review_role || MEDIA_ROLE_DEFAULTS.reviewRole),
public/control-center/pages/media-studio-workspace.js:531:    preview_history: asArray(raw.preview_history),
public/control-center/pages/media-studio-workspace.js:533:    asset_lineage: asArray(raw.asset_lineage),
public/control-center/pages/media-studio-workspace.js:537:    reviewNotes: firstText(raw.review_notes, raw.reviewNotes, asArray(raw.comments)[0]?.text),
public/control-center/pages/media-studio-workspace.js:538:    source,
public/control-center/pages/media-studio-workspace.js:560:    needs_review: 4,
public/control-center/pages/media-studio-workspace.js:562:    prompt_ready: 6,
public/control-center/pages/media-studio-workspace.js:622:      ? `${failedLoads} Media Studio data source${failedLoads === 1 ? "" : "s"} could not be loaded. Available data is still shown.`
public/control-center/pages/media-studio-workspace.js:628:    session.error = "Backend media data is unavailable. Media Studio is running in local draft mode.";
public/control-center/pages/media-studio-workspace.js:660:  const draftContext = asObject(payload.draft_context);
public/control-center/pages/media-studio-workspace.js:662:  const sourcePage = asString(handoff?.source_page || "workflows");
public/control-center/pages/media-studio-workspace.js:677:      payload.prompt ||
public/control-center/pages/media-studio-workspace.js:682:    sourcePage,
public/control-center/pages/media-studio-workspace.js:695:    objective: firstText(output.goal, output.objective, payload.goal, payload.suggested_media_brief, payload.prompt, contentVersion.prompt),
public/control-center/pages/media-studio-workspace.js:696:    prompt: firstText(output.prompt, output.media_prompt, payload.suggested_media_brief, payload.prompt, contentVersion.prompt, draftContext.lastCommand),
public/control-center/pages/media-studio-workspace.js:727:    prompt: item.prompt || "",
public/control-center/pages/media-studio-workspace.js:728:    referenceAsset: item.referenceAsset || asArray(item.asset_lineage)[0] || "",
public/control-center/pages/media-studio-workspace.js:730:    reviewNotes: item.reviewNotes || "",
public/control-center/pages/media-studio-workspace.js:777:  if (!clean(form.prompt) && intent !== "generate-prompt") errors.prompt = "Prompt or brief is required.";
public/control-center/pages/media-studio-workspace.js:793:    `Campaign: ${form.campaign || state.context?.activeCampaign || "current campaign"}.`,
public/control-center/pages/media-studio-workspace.js:801:function improvePrompt(prompt) {
public/control-center/pages/media-studio-workspace.js:802:  const base = clean(prompt) || "Create brand-safe campaign media.";
public/control-center/pages/media-studio-workspace.js:806:function makeBrandSafe(prompt) {
public/control-center/pages/media-studio-workspace.js:807:  const base = clean(prompt) || "Create brand-safe campaign media.";
public/control-center/pages/media-studio-workspace.js:811:function adaptGerman(prompt) {
public/control-center/pages/media-studio-workspace.js:812:  const base = clean(prompt) || "Create brand-safe campaign media.";
public/control-center/pages/media-studio-workspace.js:816:function convertImagePromptToVideoBrief(prompt) {
public/control-center/pages/media-studio-workspace.js:817:  const base = clean(prompt) || "Create a product-focused image concept.";
public/control-center/pages/media-studio-workspace.js:821:function convertVideoBriefToVoiceover(prompt) {
public/control-center/pages/media-studio-workspace.js:822:  const base = clean(prompt) || "Create a short video plan.";
public/control-center/pages/media-studio-workspace.js:827:  const contextPrompt = clean(session.form.prompt) || buildPromptFromContext(state, session);
public/control-center/pages/media-studio-workspace.js:830:    contextPrompt,
public/control-center/pages/media-studio-workspace.js:833:    convertImagePromptToVideoBrief(contextPrompt),
public/control-center/pages/media-studio-workspace.js:836:    convertVideoBriefToVoiceover(contextPrompt),
public/control-center/pages/media-studio-workspace.js:839:    `${contextPrompt}\n\nCampaign pack outputs: image hero, video short, voiceover script, channel cutdowns, and publishing-ready metadata.`
public/control-center/pages/media-studio-workspace.js:843:function buildMediaPayload(session, status = "prompt_ready") {
public/control-center/pages/media-studio-workspace.js:858:    prompt: session.form.prompt,
public/control-center/pages/media-studio-workspace.js:860:    reference_asset: session.form.referenceAsset,
public/control-center/pages/media-studio-workspace.js:862:    review_notes: session.form.reviewNotes,
public/control-center/pages/media-studio-workspace.js:863:    provider: mode === "video" ? "video provider pending" : mode === "voice" ? "voice provider pending" : "image provider pending",
public/control-center/pages/media-studio-workspace.js:864:    model: "backend generation pending",
public/control-center/pages/media-studio-workspace.js:866:    review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
public/control-center/pages/media-studio-workspace.js:869:    asset_lineage: clean(session.form.referenceAsset) ? [session.form.referenceAsset] : [],
public/control-center/pages/media-studio-workspace.js:874:      prompt: version.prompt,
public/control-center/pages/media-studio-workspace.js:876:      provider_status: version.provider_status,
public/control-center/pages/media-studio-workspace.js:879:      provider: version.provider,
public/control-center/pages/media-studio-workspace.js:880:      model: version.model,
public/control-center/pages/media-studio-workspace.js:881:      library_asset_ref: version.library_asset_ref || null,
public/control-center/pages/media-studio-workspace.js:901:    prompt: session.form.prompt,
public/control-center/pages/media-studio-workspace.js:904:    reference_asset: session.form.referenceAsset
public/control-center/pages/media-studio-workspace.js:912:    provider: response?.provider,
public/control-center/pages/media-studio-workspace.js:913:    model: response?.model,
public/control-center/pages/media-studio-workspace.js:924:    improved_prompt: response?.improved_prompt,
public/control-center/pages/media-studio-workspace.js:932:    provider: response?.provider || "",
public/control-center/pages/media-studio-workspace.js:933:    model: response?.model || "",
public/control-center/pages/media-studio-workspace.js:942:  if (normalized === "needs_review") return "needs_review";
public/control-center/pages/media-studio-workspace.js:965:  const mediaPreview = resolvePreviewMedia(payload);
public/control-center/pages/media-studio-workspace.js:968:  const sourceMediaId = firstText(selectedItem?.id, session.formSourceId);
public/control-center/pages/media-studio-workspace.js:969:  const sourceSignature = [
public/control-center/pages/media-studio-workspace.js:971:    toKey(sourceMediaId),
public/control-center/pages/media-studio-workspace.js:974:    clean(version?.prompt || session.form.prompt)
public/control-center/pages/media-studio-workspace.js:979:    source_signature: sourceSignature,
public/control-center/pages/media-studio-workspace.js:984:    media_job_id: sourceMediaId,
public/control-center/pages/media-studio-workspace.js:986:    prompt: firstText(version?.prompt, session.form.prompt),
public/control-center/pages/media-studio-workspace.js:988:    url: firstText(payload.url, mediaPreview.imageUrl),
public/control-center/pages/media-studio-workspace.js:989:    image_url: mediaPreview.imageUrl,
public/control-center/pages/media-studio-workspace.js:990:    video_url: mediaPreview.videoUrl,
public/control-center/pages/media-studio-workspace.js:991:    audio_url: mediaPreview.audioUrl,
public/control-center/pages/media-studio-workspace.js:996:    notes: firstText(version?.notes, session.form.reviewNotes, selectedItem?.reviewNotes),
public/control-center/pages/media-studio-workspace.js:997:    source: "media-studio",
public/control-center/pages/media-studio-workspace.js:1006:function findExistingLibrarySave(session, projectName, sourceSignature) {
public/control-center/pages/media-studio-workspace.js:1007:  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(sourceSignature));
public/control-center/pages/media-studio-workspace.js:1010:    const libraryAsset = asObject(payload.library_asset);
public/control-center/pages/media-studio-workspace.js:1011:    const routeMatches = asString(entry?.destination_page) === "library" && asString(entry?.source_page) === "media-studio";
public/control-center/pages/media-studio-workspace.js:1012:    return routeMatches && asString(libraryAsset.source_signature) === asString(sourceSignature);
public/control-center/pages/media-studio-workspace.js:1037:  const hasPrompt = Boolean(clean(version.prompt || session.form.prompt));
public/control-center/pages/media-studio-workspace.js:1040:    session.validation = { ...session.validation, librarySave: "Version needs prompt or output payload before saving to Library." };
public/control-center/pages/media-studio-workspace.js:1046:  const existing = findExistingLibrarySave(session, projectName, libraryAsset.source_signature);
public/control-center/pages/media-studio-workspace.js:1056:    source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:1058:    source_role: selectedItem?.owner_role || ownerRoleForMode(session.form.mode || session.mode || "image"),
public/control-center/pages/media-studio-workspace.js:1059:    destination_role: MEDIA_ROLE_DEFAULTS.reviewRole,
public/control-center/pages/media-studio-workspace.js:1060:    source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
public/control-center/pages/media-studio-workspace.js:1073:      library_asset: libraryAsset
public/control-center/pages/media-studio-workspace.js:1086:    source_signature: libraryAsset.source_signature,
public/control-center/pages/media-studio-workspace.js:1102:        source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1106:        source_signature: libraryAsset.source_signature,
public/control-center/pages/media-studio-workspace.js:1118:        source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1127:      source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1132:  version.library_asset_ref = reference;
public/control-center/pages/media-studio-workspace.js:1133:  version.provider_status = "saved_to_library";
public/control-center/pages/media-studio-workspace.js:1134:  if (["draft", "prompt_ready"].includes(normalizeStatus(version.readiness_status || "draft", "draft"))) {
public/control-center/pages/media-studio-workspace.js:1149:      provider_status: version.provider_status,
public/control-center/pages/media-studio-workspace.js:1153:    provider: version.provider || "",
public/control-center/pages/media-studio-workspace.js:1154:    model: version.model || "",
public/control-center/pages/media-studio-workspace.js:1160:function saveDraftToSession(projectName, state, session, status = "prompt_ready") {
public/control-center/pages/media-studio-workspace.js:1180:    draftJobs: counts.draft + counts.prompt_ready,
public/control-center/pages/media-studio-workspace.js:1181:    needsReview: counts.needs_review,
public/control-center/pages/media-studio-workspace.js:1193:      why: `${failed.title} is blocked. Review the prompt and reference asset before routing downstream.`
public/control-center/pages/media-studio-workspace.js:1196:  const needsReview = selectedItem?.status === "needs_review" ? selectedItem : null;
public/control-center/pages/media-studio-workspace.js:1200:      why: `${needsReview.title} needs brand and format review before it can become package-ready.`
public/control-center/pages/media-studio-workspace.js:1218:      action: "Finish the strongest prompt draft",
public/control-center/pages/media-studio-workspace.js:1219:      why: "Draft media work exists. Complete prompt, brand style, format, and output purpose before review."
public/control-center/pages/media-studio-workspace.js:1224:    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
public/control-center/pages/media-studio-workspace.js:1261:  return "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:1364:      .media-specialist-grid,
public/control-center/pages/media-studio-workspace.js:1372:      .media-specialist-card {
public/control-center/pages/media-studio-workspace.js:1400:      .media-preview-title {
public/control-center/pages/media-studio-workspace.js:1408:      .media-preview-copy,
public/control-center/pages/media-studio-workspace.js:1445:      .media-status-pill.is-needs-review,
public/control-center/pages/media-studio-workspace.js:1446:      .media-status-pill.is-prompt-ready,
public/control-center/pages/media-studio-workspace.js:1466:      .media-prompt-box {
public/control-center/pages/media-studio-workspace.js:1572:        .media-specialist-grid {
public/control-center/pages/media-studio-workspace.js:1613:    asObject(payload.campaign_pack).image_prompt ||
public/control-center/pages/media-studio-workspace.js:1622:    selectedItem?.library_asset_ref?.handoff_id ||
public/control-center/pages/media-studio-workspace.js:1623:    selectedVersionEntry(session)?.library_asset_ref?.handoff_id
public/control-center/pages/media-studio-workspace.js:1626:  const hasItemSource = Boolean(clean(selectedItem?.source));
public/control-center/pages/media-studio-workspace.js:1632:      status: "Library source",
public/control-center/pages/media-studio-workspace.js:1640:      detail: "A reference asset is named, but source-of-truth status still needs review."
public/control-center/pages/media-studio-workspace.js:1646:      status: "Workflow context",
public/control-center/pages/media-studio-workspace.js:1647:      detail: "Inbound or job context exists; attach Library source when claims or product truth matter."
public/control-center/pages/media-studio-workspace.js:1652:    status: "Missing source",
public/control-center/pages/media-studio-workspace.js:1653:    detail: "Attach a Library asset or load a source-backed handoff before final package routing."
public/control-center/pages/media-studio-workspace.js:1660:  const source = getMediaSourceReadiness(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1662:  const promptText = firstText(version?.prompt, form.prompt, selectedItem?.prompt, selectedItem?.brief);
public/control-center/pages/media-studio-workspace.js:1663:  const hasBrief = Boolean(promptText || clean(form.objective || selectedItem?.objective));
public/control-center/pages/media-studio-workspace.js:1669:  const needsGovernance = source.state === "missing" || /claim|proof|medical|guarantee|legal|privacy|gdpr|discount|pricing/i.test(promptText);
public/control-center/pages/media-studio-workspace.js:1673:      key: "source",
public/control-center/pages/media-studio-workspace.js:1675:      state: source.state,
public/control-center/pages/media-studio-workspace.js:1676:      status: source.status,
public/control-center/pages/media-studio-workspace.js:1677:      detail: source.detail
public/control-center/pages/media-studio-workspace.js:1686:        : "Complete the objective, prompt, channel, and format before review."
public/control-center/pages/media-studio-workspace.js:1691:      state: isBrandSafe && hasBrandCue ? "ready" : promptText ? "warning" : "missing",
public/control-center/pages/media-studio-workspace.js:1692:      status: isBrandSafe && hasBrandCue ? "Brand guided" : promptText ? "Review brand fit" : "Needs prompt",
public/control-center/pages/media-studio-workspace.js:1704:        : "Output, selected version, and review notes should be checked before handoff."
public/control-center/pages/media-studio-workspace.js:1712:        ? "Prepare Governance Review if source, claim, legal, privacy, or pricing risk exists."
public/control-center/pages/media-studio-workspace.js:1713:        : "No obvious governance escalation signal in current prompt context."
public/control-center/pages/media-studio-workspace.js:1738:  const packageCount = `${formatCount(metrics.total)} jobs/assets`;
public/control-center/pages/media-studio-workspace.js:1747:          <h2>Creative preparation, review, and routing workspace</h2>
public/control-center/pages/media-studio-workspace.js:1748:          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
public/control-center/pages/media-studio-workspace.js:1756:      <div class="media-command-meta" aria-label="Media Studio context">
public/control-center/pages/media-studio-workspace.js:1769:        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
public/control-center/pages/media-studio-workspace.js:1778:  const source = getMediaSourceReadiness(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1780:  const hasBrief = Boolean(firstText(version?.prompt, form.prompt, form.objective, selectedItem?.prompt, selectedItem?.brief));
public/control-center/pages/media-studio-workspace.js:1782:  const savedToLibrary = Boolean(version?.library_asset_ref?.handoff_id || selectedItem?.library_asset_ref?.handoff_id);
public/control-center/pages/media-studio-workspace.js:1794:      state: source.state,
public/control-center/pages/media-studio-workspace.js:1795:      detail: source.status
public/control-center/pages/media-studio-workspace.js:1815:      detail: handoffPrepared ? "Prepared" : packageReady ? "Package ready" : "Needs review"
public/control-center/pages/media-studio-workspace.js:1848:        <span class="card-badge neutral">${escapeHtml(formatCount(metrics.total))} jobs/assets</span>
