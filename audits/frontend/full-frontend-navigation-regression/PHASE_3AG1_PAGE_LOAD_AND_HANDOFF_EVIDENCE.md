# PHASE 3AG.1 — Page Load and Cross-Surface Handoff Evidence

## Cross-surface route/handoff references
public/control-center/pages/ai-command/tool-dock.js:3:  setSharedLibrarySourceBridge,
public/control-center/pages/ai-command/tool-dock.js:46:function tryAutoOpenDrawerAfterLibrary(projectName) {
public/control-center/pages/ai-command/tool-dock.js:51:  const root = drawer?.closest?.("[data-page='ai-command'], .ai-command-page, body") || document;
public/control-center/pages/ai-command/tool-dock.js:107:  origin = "ai-command",
public/control-center/pages/ai-command/tool-dock.js:133:// --- When Open Library is clicked from tool dock, store both bridge and drawer return context ---
public/control-center/pages/ai-command/tool-dock.js:134:function handleOpenLibraryFromDrawer({
public/control-center/pages/ai-command/tool-dock.js:146:    origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:156:  // Also set library source bridge context if needed (existing logic)
public/control-center/pages/ai-command/tool-dock.js:168:function getSelectedLibrarySource(projectName = "") {
public/control-center/pages/ai-command/tool-dock.js:188:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:191:  const name = source.name || source.filename || source.fileName || "Selected Library source";
public/control-center/pages/ai-command/tool-dock.js:192:  const type = source.asset_type || source.type || source.source_type || "Library asset";
public/control-center/pages/ai-command/tool-dock.js:201:    "Selected Library source context:",
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:223:function sourceMetadataNeedsLibrarySource(rawValue = "") {
public/control-center/pages/ai-command/tool-dock.js:237:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:245:    "This tool needs a source. Choose from Library or change the source type before continuing."
public/control-center/pages/ai-command/tool-dock.js:252:  const source = getSelectedLibrarySource(projectName);
public/control-center/pages/ai-command/tool-dock.js:259:      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:275:        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
public/control-center/pages/ai-command/tool-dock.js:292:    const libraryOption = Array.from(sourceSelect.options || []).find((option) => {
public/control-center/pages/ai-command/tool-dock.js:294:      return /library|source|asset|brand|product/i.test(value);
public/control-center/pages/ai-command/tool-dock.js:296:    if (libraryOption) sourceSelect.value = libraryOption.value;
public/control-center/pages/ai-command/tool-dock.js:304:        drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
public/control-center/pages/ai-command/tool-dock.js:312:        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:355:      frontendOwnerPage: "campaign-studio",
public/control-center/pages/ai-command/tool-dock.js:356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:357:      sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:368:      frontendOwnerPage: "campaign-studio",
public/control-center/pages/ai-command/tool-dock.js:369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:370:      sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:381:      frontendOwnerPage: "campaign-studio",
public/control-center/pages/ai-command/tool-dock.js:382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:394:      frontendOwnerPage: "campaign-studio",
public/control-center/pages/ai-command/tool-dock.js:395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:396:      sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:407:      frontendOwnerPage: "campaign-studio",
public/control-center/pages/ai-command/tool-dock.js:408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:409:      sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:420:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:436:      frontendOwnerPage: "content-studio",
public/control-center/pages/ai-command/tool-dock.js:437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:438:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:449:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:450:      destinations: ["composer", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:462:      frontendOwnerPage: "content-studio",
public/control-center/pages/ai-command/tool-dock.js:463:      destinations: ["composer", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:475:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:476:      destinations: ["composer", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:488:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:489:      destinations: ["preview", "content-studio", "compliance"],
public/control-center/pages/ai-command/tool-dock.js:501:      frontendOwnerPage: "library",
public/control-center/pages/ai-command/tool-dock.js:502:      destinations: ["library", "ai-command", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:503:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "source_of_truth_assets", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:505:      template: "Prepare source context for the next Content Writer task for {projectName}. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input."
public/control-center/pages/ai-command/tool-dock.js:514:      frontendOwnerPage: "content-studio",
public/control-center/pages/ai-command/tool-dock.js:515:      destinations: ["content-studio", "insights", "library"],
public/control-center/pages/ai-command/tool-dock.js:516:      sourceTypes: ["topic", "market", "language", "audience", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:527:      frontendOwnerPage: "content-studio",
public/control-center/pages/ai-command/tool-dock.js:528:      destinations: ["chat-preview", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:529:      sourceTypes: ["existing_content", "composer_text", "content_draft", "current_chat", "library_folder"],
public/control-center/pages/ai-command/tool-dock.js:540:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
public/control-center/pages/ai-command/tool-dock.js:544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
public/control-center/pages/ai-command/tool-dock.js:555:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:557:      sourceTypes: ["current_chat", "campaign_brief", "brand_guidelines", "product_images", "reference_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:568:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:569:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:570:      sourceTypes: ["current_chat", "brand_guidelines", "reference_asset", "campaign_mood", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:581:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:582:      destinations: ["chat-preview", "media-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:594:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:596:      sourceTypes: ["current_chat", "campaign_brief", "library_folder", "brand_assets", "product_images", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:607:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:620:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
public/control-center/pages/ai-command/tool-dock.js:622:      sourceTypes: ["current_chat", "brand_guidelines", "visual_brief", "selected_asset", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:636:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:638:      sourceTypes: ["current_chat", "campaign_brief", "content_draft", "product_data", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:649:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:662:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
public/control-center/pages/ai-command/tool-dock.js:675:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:676:      destinations: ["chat-preview", "media-studio", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:688:      frontendOwnerPage: "media-studio",
public/control-center/pages/ai-command/tool-dock.js:689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
public/control-center/pages/ai-command/tool-dock.js:704:      frontendOwnerPage: "publishing",
public/control-center/pages/ai-command/tool-dock.js:705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:706:      sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:707:      outputTypes: ["publishing_readiness_check", "missing_items", "channel_fit_review", "risk_notes"],
public/control-center/pages/ai-command/tool-dock.js:708:      template: "Review publishing readiness for {projectName}. Check copy, assets, channel fit, schedule, approvals, and missing items. Do not publish."
public/control-center/pages/ai-command/tool-dock.js:717:      frontendOwnerPage: "publishing",
public/control-center/pages/ai-command/tool-dock.js:718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:719:      sourceTypes: ["content_draft", "media_asset", "campaign_brief", "channel_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:730:      frontendOwnerPage: "publishing",
public/control-center/pages/ai-command/tool-dock.js:731:      destinations: ["chat-preview", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:732:      sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:734:      template: "Draft a publishing schedule for {projectName}. Include channels, timing, dependencies, review gates, and next actions."
public/control-center/pages/ai-command/tool-dock.js:743:      frontendOwnerPage: "publishing",
public/control-center/pages/ai-command/tool-dock.js:744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
public/control-center/pages/ai-command/tool-dock.js:752:      label: "Governance Review",
public/control-center/pages/ai-command/tool-dock.js:756:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:758:      sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:772:      frontendOwnerPage: "ads-manager",
public/control-center/pages/ai-command/tool-dock.js:773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:774:      sourceTypes: ["campaign_brief", "audience_notes", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:785:      frontendOwnerPage: "ads-manager",
public/control-center/pages/ai-command/tool-dock.js:786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:798:      frontendOwnerPage: "ads-manager",
public/control-center/pages/ai-command/tool-dock.js:799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:811:      frontendOwnerPage: "ads-manager",
public/control-center/pages/ai-command/tool-dock.js:812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:824:      frontendOwnerPage: "ads-manager",
public/control-center/pages/ai-command/tool-dock.js:825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:826:      sourceTypes: ["ad_copy", "landing_page_copy", "offer_data", "proof_points", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:840:      frontendOwnerPage: "insights",
public/control-center/pages/ai-command/tool-dock.js:841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:842:      sourceTypes: ["topic", "market", "language", "audience", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:847:      id: "insights",
public/control-center/pages/ai-command/tool-dock.js:849:      label: "Insights",
public/control-center/pages/ai-command/tool-dock.js:853:      frontendOwnerPage: "insights",
public/control-center/pages/ai-command/tool-dock.js:854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:855:      sourceTypes: ["insights_data", "analytics_summary", "performance_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:856:      outputTypes: ["insights_summary", "optimization_actions", "missing_data_notes", "risk_notes"],
public/control-center/pages/ai-command/tool-dock.js:857:      template: "Summarize insights for {projectName}. Include what is working, what is weak, missing data, and next optimization actions."
public/control-center/pages/ai-command/tool-dock.js:866:      frontendOwnerPage: "insights",
public/control-center/pages/ai-command/tool-dock.js:867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
public/control-center/pages/ai-command/tool-dock.js:868:      sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:879:      frontendOwnerPage: "insights",
public/control-center/pages/ai-command/tool-dock.js:880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:892:      frontendOwnerPage: "insights",
public/control-center/pages/ai-command/tool-dock.js:893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
public/control-center/pages/ai-command/tool-dock.js:894:      sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:908:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:921:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:922:      destinations: ["chat-preview", "governance", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:934:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:935:      destinations: ["chat-preview", "governance", "library", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:947:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:956:      label: "Governance Notes",
public/control-center/pages/ai-command/tool-dock.js:960:      frontendOwnerPage: "governance",
public/control-center/pages/ai-command/tool-dock.js:961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:976:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
public/control-center/pages/ai-command/tool-dock.js:989:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:1002:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1015:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1028:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
public/control-center/pages/ai-command/tool-dock.js:1032:      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
public/control-center/pages/ai-command/tool-dock.js:1044:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1057:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1070:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1083:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1099:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1112:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1125:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1138:      frontendOwnerPage: "workflows",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1195:      <section class="mhos-tool-drawer-card" role="dialog" aria-modal="true" aria-label="Smart tool setup">
public/control-center/pages/ai-command/tool-dock.js:1201:              <h3 data-aicmd-tool-drawer-title>Tool setup</h3>
public/control-center/pages/ai-command/tool-dock.js:1282:          <span>Setup summary</span>
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1291:          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change Source</button>
public/control-center/pages/ai-command/tool-dock.js:1318:        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
public/control-center/pages/ai-command/tool-dock.js:1331:            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
public/control-center/pages/ai-command/tool-dock.js:1460:    "Selected setup:",
public/control-center/pages/ai-command/tool-dock.js:1487:    "Do not repeat this setup back to the user unless useful; produce the best practical output.",
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1528:  if (source !== "Auto" && source !== "Current chat or ask if source is needed") summaryParts.push("Library source selected");
public/control-center/pages/ai-command/tool-dock.js:1564:  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(actionType)} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
public/control-center/pages/ai-command/tool-dock.js:1575:  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";
public/control-center/pages/ai-command/tool-dock.js:1599:  updateStatus?.(`${btn.getAttribute("data-aicmd-tool-dock-label") || "Tool"} setup opened. Review requirements, then use in composer.`);
public/control-center/pages/ai-command/tool-dock.js:1623:    "data-aicmd-tool-dock-owner": tool.frontendOwnerPage || tool.owner || "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1666:  const openLibraryBtn = root.querySelector("[data-aicmd-tool-drawer-open-library]");
public/control-center/pages/ai-command/tool-dock.js:1667:  if (openLibraryBtn) {
public/control-center/pages/ai-command/tool-dock.js:1668:    openLibraryBtn.onclick = () => {
public/control-center/pages/ai-command/tool-dock.js:1669:      // Library Source Bridge workflow
public/control-center/pages/ai-command/tool-dock.js:1676:        origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1687:        type: "library_source_selection",
public/control-center/pages/ai-command/tool-dock.js:1688:        origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1689:        returnTarget: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1691:        libraryFilter: mapping.libraryFilter,
public/control-center/pages/ai-command/tool-dock.js:1696:      setSharedLibrarySourceBridge(project, payload);
public/control-center/pages/ai-command/tool-dock.js:1697:      setSharedLibrarySourceBridge("__default__", payload);
public/control-center/pages/ai-command/tool-dock.js:1701:      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
public/control-center/pages/ai-command/tool-dock.js:1703:        window.location.hash = "#library";
public/control-center/pages/ai-command/tool-dock.js:1720:        updateStatus?.("This tool needs a source. Choose from Library or change the source type before continuing.");
public/control-center/pages/ai-command/tool-dock.js:1795:  // --- Ensure drawer is restored after navigation from Library ---
public/control-center/pages/ai-command/tool-dock.js:1798:    setTimeout(() => tryAutoOpenDrawerAfterLibrary(restoreProjectName), delay);
public/control-center/pages/publishing/publishing-payloads.js:61:    sourcePage: asString(handoff?.source_page || "workflows"),
public/control-center/pages/publishing/publishing-payloads.js:75:    title: firstText(session.form.title, session.form.contentItem, "Publishing item"),
public/control-center/pages/publishing/publishing-payloads.js:92:    title: firstText(session.form.title, session.form.contentItem, "Publishing draft"),
public/control-center/pages/publishing/publishing-payloads.js:105:export function buildPublishingAiPrompt(projectName, selectedItem, session, handoff) {
public/control-center/pages/publishing/publishing-payloads.js:108:    `Review this publishing execution plan for ${projectName || "the current project"}.`,
public/control-center/pages/home/render-sections.js:2:  Home Executive Runtime Render Sections
public/control-center/pages/home/render-sections.js:32:    return `<p class="home-empty-note">${escapeHtml(emptyText)}</p>`;
public/control-center/pages/home/render-sections.js:36:    <ul class="home-compact-list">
public/control-center/pages/home/render-sections.js:48:    <article class="home-blocker-card">
public/control-center/pages/home/render-sections.js:49:      <div class="home-blocker-head">
public/control-center/pages/home/render-sections.js:62:    return `<p class="home-empty-note">No recent activity recorded yet.</p>`;
public/control-center/pages/home/render-sections.js:66:    <div class="home-activity-list">
public/control-center/pages/home/render-sections.js:68:        <article class="home-activity-item">
public/control-center/pages/home/render-sections.js:74:          <div class="home-activity-meta">
public/control-center/pages/home/render-sections.js:87:    return `<p class="home-empty-note">AI team status is not available yet.</p>`;
public/control-center/pages/home/render-sections.js:91:    <div class="home-ai-team-grid">
public/control-center/pages/home/render-sections.js:93:          <button class="home-ai-team-card" type="button" data-role-id="${escapeHtml(agent.id || "")}" title="Click to open ${escapeHtml(agent.name)} workspace">
public/control-center/pages/home/render-sections.js:94:          <div class="home-ai-team-card-head">
public/control-center/pages/home/render-sections.js:105:export function renderHomeExecutiveIntro({
public/control-center/pages/home/render-sections.js:113:    <section class="card home-exec-hero">
public/control-center/pages/home/render-sections.js:114:      <div class="home-exec-hero-main">
public/control-center/pages/home/render-sections.js:118:          <p class="home-decision-copy">${escapeHtml(dashboard.oneLineSummary)}</p>
public/control-center/pages/home/render-sections.js:121:        <div class="home-exec-hero-status">
public/control-center/pages/home/render-sections.js:128:      <div class="home-exec-hero-actions">
public/control-center/pages/home/render-sections.js:129:        <button id="homePrimaryActionBtn" class="btn btn-primary" type="button">
public/control-center/pages/home/render-sections.js:132:        <button id="homeSecondaryActionBtn" class="btn btn-secondary" type="button">
public/control-center/pages/home/render-sections.js:135:        <button id="homeAskExecutiveAiBtn" class="btn btn-ghost" type="button">
public/control-center/pages/home/render-sections.js:141:    <section class="home-kpi-grid">
public/control-center/pages/home/render-sections.js:143:        <article class="card home-kpi-card">
public/control-center/pages/campaign-studio.js:7:} from "../asset-library.js";
public/control-center/pages/campaign-studio.js:54:const PUBLISHING_KEYS = ["instagram", "facebook", "tiktok", "youtube", "email"];
public/control-center/pages/campaign-studio.js:63:  "content-studio": { role: "writer", domain: "content" },
public/control-center/pages/campaign-studio.js:64:  "media-studio": { role: "designer", domain: "media" },
public/control-center/pages/campaign-studio.js:65:  publishing: { role: "publisher", domain: "publishing" },
public/control-center/pages/campaign-studio.js:66:  "ads-manager": { role: "ads_operator", domain: "campaign" },
public/control-center/pages/campaign-studio.js:67:  "ai-command": { role: "admin", domain: "governance" }
public/control-center/pages/campaign-studio.js:120:      <div class="data-row"><span>Route map</span><strong>${escapeHtml(`Content ${titleCase(CAMPAIGN_ROUTE_ROLES["content-studio"].role)} • Media ${titleCase(CAMPAIGN_ROUTE_ROLES["media-studio"].role)} • Publishing ${titleCase(CAMPAIGN_ROUTE_ROLES.publishing.role)} • Ads ${titleCase(CAMPAIGN_ROUTE_ROLES["ads-manager"].role)}`)}</strong></div>
public/control-center/pages/campaign-studio.js:181:  return message.includes("insights") || message.includes("learning") || message.includes("not found");
public/control-center/pages/campaign-studio.js:266:        insights: null,
public/control-center/pages/campaign-studio.js:279:      insights: session.intelligence?.insights || null,
public/control-center/pages/campaign-studio.js:301:    <div class="setup-field-group">
public/control-center/pages/campaign-studio.js:302:      <div class="setup-field-head">
public/control-center/pages/campaign-studio.js:303:        <label class="setup-label" for="campaign-${escapeHtml(name)}">${escapeHtml(label)}</label>
public/control-center/pages/campaign-studio.js:304:        <span class="setup-field-state is-optional">Draft</span>
public/control-center/pages/campaign-studio.js:308:          ? `<textarea id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
public/control-center/pages/campaign-studio.js:309:          : `<input id="campaign-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="text" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
public/control-center/pages/campaign-studio.js:311:      <div class="setup-helper">${escapeHtml(helper)}</div>
public/control-center/pages/campaign-studio.js:325:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:380:  const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
public/control-center/pages/campaign-studio.js:425:    source_page: "ai-command",
public/control-center/pages/campaign-studio.js:452:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:469:    source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:478:      route: "campaign-studio",
public/control-center/pages/campaign-studio.js:526:    <div class="campaign-studio-empty-state">
public/control-center/pages/campaign-studio.js:539:    <div class="insights-mini-list">
public/control-center/pages/campaign-studio.js:541:        <div class="insights-mini-item">
public/control-center/pages/campaign-studio.js:550:function getInsightSource(state, session) {
public/control-center/pages/campaign-studio.js:553:  const fetchedInsights = asObject(session.intelligence?.insights);
public/control-center/pages/campaign-studio.js:557:    insights: asObject(
public/control-center/pages/campaign-studio.js:558:      fetchedInsights.insights ||
public/control-center/pages/campaign-studio.js:559:      fetchedInsights.data ||
public/control-center/pages/campaign-studio.js:560:      fetchedInsights ||
public/control-center/pages/campaign-studio.js:561:      activity.insights ||
public/control-center/pages/campaign-studio.js:562:      activity.marketing_insights ||
public/control-center/pages/campaign-studio.js:563:      activity.performance_insights ||
public/control-center/pages/campaign-studio.js:564:      overview.insights
public/control-center/pages/campaign-studio.js:598:function collectPublishingWindows(insights, learning, topContent) {
public/control-center/pages/campaign-studio.js:599:  const social = asObject(insights.social);
public/control-center/pages/campaign-studio.js:609:    body: "Best publishing window detected from current campaign intelligence."
public/control-center/pages/campaign-studio.js:613:function collectSeoOpportunities(insights) {
public/control-center/pages/campaign-studio.js:614:  const seo = asObject(insights.seo);
public/control-center/pages/campaign-studio.js:638:function collectPaidSignals(insights) {
public/control-center/pages/campaign-studio.js:639:  const paid = asObject(insights.paid);
public/control-center/pages/campaign-studio.js:662:      body: firstNonEmpty(record.reason, record.insight, record.summary, record.recommendation, "Performance or setup risk detected.")
public/control-center/pages/campaign-studio.js:818:      label: "Insights feedback loop",
public/control-center/pages/campaign-studio.js:835:  missingIntegrations,
public/control-center/pages/campaign-studio.js:841:  const publishingBlockers = [];
public/control-center/pages/campaign-studio.js:847:  if (!values.startDate) publishingBlockers.push("Set a launch start date before pushing work downstream.");
public/control-center/pages/campaign-studio.js:848:  if (!values.channelPlan) publishingBlockers.push("Define the operational channel plan so scheduling knows what to activate.");
public/control-center/pages/campaign-studio.js:849:  if (!connectedChannels.some((item) => PUBLISHING_KEYS.includes(item))) {
public/control-center/pages/campaign-studio.js:850:    publishingBlockers.push("No publishing channel is connected yet.");
public/control-center/pages/campaign-studio.js:853:    publishingBlockers.push("Critical creative or offer assets are still missing.");
public/control-center/pages/campaign-studio.js:882:    publishingBlockers.length ||
public/control-center/pages/campaign-studio.js:887:    missingIntegrations.length ||
public/control-center/pages/campaign-studio.js:895:    missingIntegrations,
public/control-center/pages/campaign-studio.js:896:    publishingBlockers,
public/control-center/pages/campaign-studio.js:903:      missingIntegrations.length +
public/control-center/pages/campaign-studio.js:904:      publishingBlockers.length +
public/control-center/pages/campaign-studio.js:1008:  const integrations = asObject(state.data.integrations);
public/control-center/pages/campaign-studio.js:1011:  const checks = asObject(integrations.readiness?.checks);
public/control-center/pages/campaign-studio.js:1012:  const controlCenter = asObject(integrations.control_center);
public/control-center/pages/campaign-studio.js:1013:  const { insights, learning } = getInsightSource(state, session);
public/control-center/pages/campaign-studio.js:1015:    asArray(learning.recommendations || insights.recommendations || overviewBlock.next_best_actions || readiness.next_best_actions)
public/control-center/pages/campaign-studio.js:1044:  const sourceCoverage = asObject(insights.data_coverage);
public/control-center/pages/campaign-studio.js:1045:  const missingIntegrations = [];
public/control-center/pages/campaign-studio.js:1050:      missingIntegrations.push({
public/control-center/pages/campaign-studio.js:1059:    if (missingIntegrations.find((item) => item.title === channelLabel(key))) return;
public/control-center/pages/campaign-studio.js:1060:    missingIntegrations.push({
public/control-center/pages/campaign-studio.js:1070:    missingIntegrations.push({
public/control-center/pages/campaign-studio.js:1076:  const topContent = asArray(insights.best_performing_content || insights.top_content);
public/control-center/pages/campaign-studio.js:1077:  const weakContent = asArray(insights.underperforming_content || insights.weak_content);
public/control-center/pages/campaign-studio.js:1087:  const publishingWindows = collectPublishingWindows(insights, learning, topContent);
public/control-center/pages/campaign-studio.js:1088:  const seoOpportunities = collectSeoOpportunities(insights);
public/control-center/pages/campaign-studio.js:1089:  const paidSignals = collectPaidSignals(insights);
public/control-center/pages/campaign-studio.js:1103:    missingIntegrations,
public/control-center/pages/campaign-studio.js:1113:    aiRecommendations: asObject(learning.ai_recommendations || insights.ai_recommendations),
public/control-center/pages/campaign-studio.js:1134:    missingIntegrations: uniqueBy(missingIntegrations, (item) => `${item.title}|${item.body}`),
public/control-center/pages/campaign-studio.js:1138:    publishingWindows,
public/control-center/pages/campaign-studio.js:1147:    hasLiveIntelligence: Boolean(Object.keys(insights).length || Object.keys(learning).length)
public/control-center/pages/campaign-studio.js:1185:          : `<div class="setup-helper">${escapeHtml(emptyBody)}</div>`
public/control-center/pages/campaign-studio.js:1194:  fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1201:  if (typeof fetchProjectInsights !== "function" && typeof fetchProjectLearning !== "function") return;
public/control-center/pages/campaign-studio.js:1207:    typeof fetchProjectInsights === "function" ? fetchProjectInsights(projectName) : Promise.resolve(null),
public/control-center/pages/campaign-studio.js:1210:    .then(([insightsResult, learningResult]) => {
public/control-center/pages/campaign-studio.js:1211:      const insightsMissing = insightsResult?.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
public/control-center/pages/campaign-studio.js:1213:      const insights = insightsResult?.status === "fulfilled"
public/control-center/pages/campaign-studio.js:1214:        ? insightsResult.value
public/control-center/pages/campaign-studio.js:1215:        : (insightsMissing ? { project: projectName, generated_at: new Date().toISOString(), data_coverage: {} } : null);
public/control-center/pages/campaign-studio.js:1220:        insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
public/control-center/pages/campaign-studio.js:1224:      session.intelligence.status = (insights || learning) ? "loaded" : "error";
public/control-center/pages/campaign-studio.js:1225:      session.intelligence.insights = insights;
public/control-center/pages/campaign-studio.js:1250:  fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1328:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/campaign-studio.js:1329:        source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:1330:        destination_page: "ai-command",
public/control-center/pages/campaign-studio.js:1340:        source_page: "campaign-studio",
public/control-center/pages/campaign-studio.js:1341:        destination_page: "ai-command",
public/control-center/pages/campaign-studio.js:1343:        destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
public/control-center/pages/campaign-studio.js:1345:        destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
public/control-center/pages/campaign-studio.js:1362:      navigateTo("ai-command");
public/control-center/pages/campaign-studio.js:1367:  const publishingBtn = $("campaignOpenPublishingBtn");
public/control-center/pages/campaign-studio.js:1368:  if (publishingBtn) {
public/control-center/pages/campaign-studio.js:1369:    publishingBtn.onclick = () => {
public/control-center/pages/campaign-studio.js:1370:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "publishing", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1371:      navigateTo("publishing");
public/control-center/pages/campaign-studio.js:1377:    assetsBtn.onclick = () => navigateTo("library");
public/control-center/pages/campaign-studio.js:1383:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "content-studio", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1384:      navigateTo("content-studio");
public/control-center/pages/campaign-studio.js:1391:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "media-studio", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1392:      navigateTo("media-studio");
public/control-center/pages/campaign-studio.js:1399:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "ads-manager", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1400:      navigateTo("ads-manager");
public/control-center/pages/campaign-studio.js:1417:      if (model.executionReadiness.missingIntegrations.length) {
public/control-center/pages/campaign-studio.js:1418:        navigateTo("integrations");
public/control-center/pages/campaign-studio.js:1422:        navigateTo("library");
public/control-center/pages/campaign-studio.js:1425:      navigateTo("insights");
public/control-center/pages/campaign-studio.js:1437:        fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1449:  id: "campaign-studio",
public/control-center/pages/campaign-studio.js:1457:    <section class="page is-active" data-page="campaign-studio">
public/control-center/pages/campaign-studio.js:1469:    fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1490:      fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1499:      fetchProjectInsights,
public/control-center/pages/campaign-studio.js:1515:      missingIntegrations,
public/control-center/pages/campaign-studio.js:1519:      publishingWindows,
public/control-center/pages/campaign-studio.js:1555:      <div class="campaign-studio-wrapper">
public/control-center/pages/campaign-studio.js:1609:        <div class="campaign-studio-layout">
public/control-center/pages/campaign-studio.js:1610:          <form id="campaignStudioForm" class="campaign-studio-main">
public/control-center/pages/campaign-studio.js:1619:              <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/campaign-studio.js:1653:              <div class="setup-form-grid setup-form-grid-3">
public/control-center/pages/campaign-studio.js:1689:              <div class="setup-form-grid">
public/control-center/pages/campaign-studio.js:1800:                    <div class="setup-form-grid">
public/control-center/pages/campaign-studio.js:1868:                <div class="campaign-studio-panel-block">
public/control-center/pages/campaign-studio.js:1869:                  <h4 class="insights-subtitle">Recommended organic channels</h4>
public/control-center/pages/campaign-studio.js:1872:                <div class="campaign-studio-panel-block">
public/control-center/pages/campaign-studio.js:1873:                  <h4 class="insights-subtitle">Recommended paid channels</h4>
public/control-center/pages/campaign-studio.js:1876:                <div class="campaign-studio-panel-block">
public/control-center/pages/campaign-studio.js:1877:                  <h4 class="insights-subtitle">Recommended support channels</h4>
public/control-center/pages/campaign-studio.js:1881:              <div class="setup-form-grid">
public/control-center/pages/campaign-studio.js:1901:              <div class="campaign-studio-panel-block">
public/control-center/pages/campaign-studio.js:1902:                <h4 class="insights-subtitle">Library inputs for campaign planning</h4>
public/control-center/pages/campaign-studio.js:1914:                  "Missing integrations",
public/control-center/pages/campaign-studio.js:1915:                  executionReadiness.missingIntegrations.map((item) => `${item.title}: ${item.body}`),
public/control-center/pages/campaign-studio.js:1917:                  "Required integrations currently look healthy."
public/control-center/pages/campaign-studio.js:1920:                  "Publishing blockers",
public/control-center/pages/campaign-studio.js:1921:                  executionReadiness.publishingBlockers,
public/control-center/pages/campaign-studio.js:1923:                  "No publishing blocker is currently stopping launch routing."
public/control-center/pages/campaign-studio.js:1953:          <aside class="campaign-studio-side">
public/control-center/pages/campaign-studio.js:1972:                  <span class="home-action-title">Send campaign context to AI</span>
public/control-center/pages/campaign-studio.js:1973:                  <span class="home-action-meta">Prefill AI Command with the current draft, blockers, and campaign context, then open that page.</span>
public/control-center/pages/campaign-studio.js:1978:                  <span class="home-action-title">Send to Content Studio</span>
public/control-center/pages/campaign-studio.js:1979:                  <span class="home-action-meta">Open Content Studio with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1982:                  <span class="home-action-title">Send to Media Studio</span>
public/control-center/pages/campaign-studio.js:1983:                  <span class="home-action-meta">Open Media Studio with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1985:                <button id="campaignOpenPublishingBtn" class="quick-action-btn" type="button">
public/control-center/pages/campaign-studio.js:1986:                  <span class="home-action-title">Send to Publishing</span>
public/control-center/pages/campaign-studio.js:1987:                  <span class="home-action-meta">Open Publishing with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1990:                  <span class="home-action-title">Send to Ads Manager</span>
public/control-center/pages/campaign-studio.js:1991:                  <span class="home-action-meta">Open Ads Manager with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1994:                  <span class="home-action-title">Review campaign dependencies</span>
public/control-center/pages/campaign-studio.js:1995:                  <span class="home-action-meta">Jump to the highest-priority place to close launch blockers.</span>
public/control-center/pages/campaign-studio.js:1998:                  <span class="home-action-title">Review campaign assets in Library</span>
public/control-center/pages/campaign-studio.js:1999:                  <span class="home-action-meta">Navigation only. Review missing assets before execution starts.</span>
public/control-center/pages/campaign-studio.js:2015:      fetchProjectInsights,
public/control-center/pages/media-studio-workspace.js:25:} from "../asset-library.js";
public/control-center/pages/media-studio-workspace.js:29:const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
public/control-center/pages/media-studio-workspace.js:30:const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
public/control-center/pages/media-studio-workspace.js:32:const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
public/control-center/pages/media-studio-workspace.js:33:const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
public/control-center/pages/media-studio-workspace.js:71:    bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
public/control-center/pages/media-studio-workspace.js:82:    id: "publishing-assistant",
public/control-center/pages/media-studio-workspace.js:83:    title: "Publishing Assistant",
public/control-center/pages/media-studio-workspace.js:84:    purpose: "Finalize readiness signals and handoff payload quality before publishing.",
public/control-center/pages/media-studio-workspace.js:85:    bestUse: "Right before preparing a Publishing package for downstream review.",
public/control-center/pages/media-studio-workspace.js:86:    suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
public/control-center/pages/media-studio-workspace.js:170:  if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
public/control-center/pages/media-studio-workspace.js:171:  if (["sent_to_publishing", "sent to publishing", "sent"].includes(normalized)) return "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:177:  if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
public/control-center/pages/media-studio-workspace.js:204:function readLibraryAssetMap() {
public/control-center/pages/media-studio-workspace.js:207:    const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
public/control-center/pages/media-studio-workspace.js:214:function writeLibraryAssetMap(map) {
public/control-center/pages/media-studio-workspace.js:217:    window.localStorage?.setItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
public/control-center/pages/media-studio-workspace.js:230:function loadLocalLibraryAssets(projectName) {
public/control-center/pages/media-studio-workspace.js:231:  return asArray(readLibraryAssetMap()[projectKey(projectName)]);
public/control-center/pages/media-studio-workspace.js:234:function upsertLocalLibraryAsset(projectName, asset) {
public/control-center/pages/media-studio-workspace.js:235:  const map = readLibraryAssetMap();
public/control-center/pages/media-studio-workspace.js:239:    id: asString(asset.id || `media-library-${Date.now()}`),
public/control-center/pages/media-studio-workspace.js:249:  writeLibraryAssetMap(map);
public/control-center/pages/media-studio-workspace.js:279:    objective: firstText(overview.primary_goal, overview.goal, "Create publishing-ready media"),
public/control-center/pages/media-studio-workspace.js:304:  libraryAssetRef = null,
public/control-center/pages/media-studio-workspace.js:317:    library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
public/control-center/pages/media-studio-workspace.js:342:    libraryAssetRef: raw.library_asset_ref || null,
public/control-center/pages/media-studio-workspace.js:528:    publishing_job_id: asString(raw.publishing_job_id || ""),
public/control-center/pages/media-studio-workspace.js:557:    publishing_ready: 1,
public/control-center/pages/media-studio-workspace.js:558:    sent_to_publishing: 2,
public/control-center/pages/media-studio-workspace.js:650:    getSharedHandoff(projectName, "media-studio", operations, "workflows") ||
public/control-center/pages/media-studio-workspace.js:651:    getSharedHandoff(projectName, "media-studio", operations, "ai-command") ||
public/control-center/pages/media-studio-workspace.js:652:    getSharedHandoff(projectName, "media-studio", operations, "content-studio") ||
public/control-center/pages/media-studio-workspace.js:653:    getSharedHandoff(projectName, "media-studio", operations)
public/control-center/pages/media-studio-workspace.js:662:  const sourcePage = asString(handoff?.source_page || "workflows");
public/control-center/pages/media-studio-workspace.js:792:    `Create ${form.outputPurpose || "publishing-ready media"} for ${form.product || overview.project_name || "the product"}.`,
public/control-center/pages/media-studio-workspace.js:797:    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
public/control-center/pages/media-studio-workspace.js:803:  return `${base}\n\nProduction constraints: accurate product identity, clean composition, strong focal hierarchy, channel-safe crop, no unsupported claims, no cluttered text, and enough negative space for publishing copy.`;
public/control-center/pages/media-studio-workspace.js:839:    `${contextPrompt}\n\nCampaign pack outputs: image hero, video short, voiceover script, channel cutdowns, and publishing-ready metadata.`
public/control-center/pages/media-studio-workspace.js:881:      library_asset_ref: version.library_asset_ref || null,
public/control-center/pages/media-studio-workspace.js:884:    actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:941:  if (["approved", "publishing_ready", "sent_to_publishing"].includes(normalized)) return "approved";
public/control-center/pages/media-studio-workspace.js:946:function classifyLibraryUsage(session, selectedItem, version, readiness) {
public/control-center/pages/media-studio-workspace.js:957:  if (["publishing_ready", "sent_to_publishing", "approved"].includes(normalizeStatus(readiness.readinessStatus, "draft"))) {
public/control-center/pages/media-studio-workspace.js:958:    usage.push("publishing");
public/control-center/pages/media-studio-workspace.js:963:function buildLibraryAssetPayload(projectName, session, selectedItem, version) {
public/control-center/pages/media-studio-workspace.js:997:    source: "media-studio",
public/control-center/pages/media-studio-workspace.js:998:    usage: classifyLibraryUsage(session, selectedItem, version, readiness),
public/control-center/pages/media-studio-workspace.js:1006:function findExistingLibrarySave(session, projectName, sourceSignature) {
public/control-center/pages/media-studio-workspace.js:1007:  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(sourceSignature));
public/control-center/pages/media-studio-workspace.js:1010:    const libraryAsset = asObject(payload.library_asset);
public/control-center/pages/media-studio-workspace.js:1011:    const routeMatches = asString(entry?.destination_page) === "library" && asString(entry?.source_page) === "media-studio";
public/control-center/pages/media-studio-workspace.js:1012:    return routeMatches && asString(libraryAsset.source_signature) === asString(sourceSignature);
public/control-center/pages/media-studio-workspace.js:1020:async function saveVersionToLibrary({
public/control-center/pages/media-studio-workspace.js:1031:    session.validation = { ...session.validation, librarySave: "Select a version before saving to Library." };
public/control-center/pages/media-studio-workspace.js:1040:    session.validation = { ...session.validation, librarySave: "Version needs prompt or output payload before saving to Library." };
public/control-center/pages/media-studio-workspace.js:1045:  const libraryAsset = buildLibraryAssetPayload(projectName, session, selectedItem, version);
public/control-center/pages/media-studio-workspace.js:1046:  const existing = findExistingLibrarySave(session, projectName, libraryAsset.source_signature);
public/control-center/pages/media-studio-workspace.js:1050:    showMessage?.("Already saved to Library (local reference).");
public/control-center/pages/media-studio-workspace.js:1056:    source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:1057:    destination_page: "library",
public/control-center/pages/media-studio-workspace.js:1061:    destination_service_domain: "library",
public/control-center/pages/media-studio-workspace.js:1065:      route: "media-studio",
public/control-center/pages/media-studio-workspace.js:1069:      project: libraryAsset.project,
public/control-center/pages/media-studio-workspace.js:1070:      campaign: libraryAsset.campaign,
public/control-center/pages/media-studio-workspace.js:1071:      media_type: libraryAsset.media_type,
public/control-center/pages/media-studio-workspace.js:1072:      usage: libraryAsset.usage,
public/control-center/pages/media-studio-workspace.js:1073:      library_asset: libraryAsset
public/control-center/pages/media-studio-workspace.js:1076:    actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:1079:  setSharedHandoff(projectName || "__default__", "library", handoffPayload);
public/control-center/pages/media-studio-workspace.js:1081:    setSharedHandoff("__default__", "library", handoffPayload);
public/control-center/pages/media-studio-workspace.js:1086:    source_signature: libraryAsset.source_signature,
public/control-center/pages/media-studio-workspace.js:1089:    status: "saved_to_library"
public/control-center/pages/media-studio-workspace.js:1097:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1098:        ...libraryAsset,
public/control-center/pages/media-studio-workspace.js:1099:        id: savedId || libraryAsset.id,
public/control-center/pages/media-studio-workspace.js:1102:        source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1106:        source_signature: libraryAsset.source_signature,
public/control-center/pages/media-studio-workspace.js:1109:        status: "saved_to_library"
public/control-center/pages/media-studio-workspace.js:1112:      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Selected version saved to Library.");
public/control-center/pages/media-studio-workspace.js:1114:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1115:        ...libraryAsset,
public/control-center/pages/media-studio-workspace.js:1116:        id: libraryAsset.id,
public/control-center/pages/media-studio-workspace.js:1118:        source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1120:      showMessage?.("Library backend unavailable. Saved as local library handoff.");
public/control-center/pages/media-studio-workspace.js:1123:    upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1124:      ...libraryAsset,
public/control-center/pages/media-studio-workspace.js:1125:      id: libraryAsset.id,
public/control-center/pages/media-studio-workspace.js:1127:      source: "media-studio"
public/control-center/pages/media-studio-workspace.js:1129:    showMessage?.("Selected version saved to Library (local handoff).");
public/control-center/pages/media-studio-workspace.js:1132:  version.library_asset_ref = reference;
public/control-center/pages/media-studio-workspace.js:1133:  version.provider_status = "saved_to_library";
public/control-center/pages/media-studio-workspace.js:1135:    version.readiness_status = "publishing_ready";
public/control-center/pages/media-studio-workspace.js:1136:    session.form.status = "publishing_ready";
public/control-center/pages/media-studio-workspace.js:1138:  session.validation = { ...session.validation, librarySave: "" };
public/control-center/pages/media-studio-workspace.js:1140:  saveDraftToSession(projectName, state, session, normalizeStatus(session.form.status || version.readiness_status || "publishing_ready", "publishing_ready"));
public/control-center/pages/media-studio-workspace.js:1179:    readyAssets: counts.approved + counts.publishing_ready + counts.sent_to_publishing,
public/control-center/pages/media-studio-workspace.js:1183:    publishingReady: counts.publishing_ready,
public/control-center/pages/media-studio-workspace.js:1203:  const ready = selectedItem?.status === "publishing_ready" ? selectedItem : null;
public/control-center/pages/media-studio-workspace.js:1206:      action: "Prepare Publishing Package",
public/control-center/pages/media-studio-workspace.js:1207:      why: `${ready.title} is ready for a safe Publishing package handoff.`
public/control-center/pages/media-studio-workspace.js:1213:      why: "A workflow handoff is available. Load it into the generator to continue the Workflows -> Media Studio -> package handoff flow."
public/control-center/pages/media-studio-workspace.js:1224:    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
public/control-center/pages/media-studio-workspace.js:1241:  const publishingConnected = hasBackend || capabilityFromOperations(operations, ["publishing", "handoff"]);
public/control-center/pages/media-studio-workspace.js:1248:    publishing_handoff: publishingConnected,
public/control-center/pages/media-studio-workspace.js:1261:  return "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:1441:      .media-status-pill.is-publishing-ready {
public/control-center/pages/media-studio-workspace.js:1451:      .media-status-pill.is-sent-to-publishing {
public/control-center/pages/media-studio-workspace.js:1597:  if (normalized === "publishing_ready") return "Package Ready";
public/control-center/pages/media-studio-workspace.js:1598:  if (normalized === "sent_to_publishing") return "Handoff Prepared";
public/control-center/pages/media-studio-workspace.js:1621:  const hasLibraryRef = Boolean(
public/control-center/pages/media-studio-workspace.js:1622:    selectedItem?.library_asset_ref?.handoff_id ||
public/control-center/pages/media-studio-workspace.js:1623:    selectedVersionEntry(session)?.library_asset_ref?.handoff_id
public/control-center/pages/media-studio-workspace.js:1629:  if (hasLibraryRef) {
public/control-center/pages/media-studio-workspace.js:1632:      status: "Library source",
public/control-center/pages/media-studio-workspace.js:1633:      detail: "Linked Library provenance is available for this package."
public/control-center/pages/media-studio-workspace.js:1647:      detail: "Inbound or job context exists; attach Library source when claims or product truth matter."
public/control-center/pages/media-studio-workspace.js:1653:    detail: "Attach a Library asset or load a source-backed handoff before final package routing."
public/control-center/pages/media-studio-workspace.js:1668:  const packageReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1669:  const needsGovernance = source.state === "missing" || /claim|proof|medical|guarantee|legal|privacy|gdpr|discount|pricing/i.test(promptText);
public/control-center/pages/media-studio-workspace.js:1698:      key: "publishing",
public/control-center/pages/media-studio-workspace.js:1699:      label: "Publishing",
public/control-center/pages/media-studio-workspace.js:1703:        ? "Selected version can be prepared as a Publishing package."
public/control-center/pages/media-studio-workspace.js:1707:      key: "governance",
public/control-center/pages/media-studio-workspace.js:1708:      label: "Governance",
public/control-center/pages/media-studio-workspace.js:1709:      state: needsGovernance ? "warning" : "ready",
public/control-center/pages/media-studio-workspace.js:1710:      status: needsGovernance ? "Review risk" : "No obvious risk",
public/control-center/pages/media-studio-workspace.js:1711:      detail: needsGovernance
public/control-center/pages/media-studio-workspace.js:1712:        ? "Prepare Governance Review if source, claim, legal, privacy, or pricing risk exists."
public/control-center/pages/media-studio-workspace.js:1713:        : "No obvious governance escalation signal in current prompt context."
public/control-center/pages/media-studio-workspace.js:1746:          <div class="setup-kicker">Media Studio</div>
public/control-center/pages/media-studio-workspace.js:1748:          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
public/control-center/pages/media-studio-workspace.js:1767:        <button id="mediaHeaderSaveLibraryBtn" class="btn btn-secondary" type="button">Save to Library</button>
public/control-center/pages/media-studio-workspace.js:1768:        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:1775:function getMediaWorkflowSteps(session, selectedItem, handoff) {
public/control-center/pages/media-studio-workspace.js:1782:  const savedToLibrary = Boolean(version?.library_asset_ref?.handoff_id || selectedItem?.library_asset_ref?.handoff_id);
public/control-center/pages/media-studio-workspace.js:1783:  const handoffPrepared = readiness.readinessStatus === "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:1784:  const packageReady = ["publishing_ready", "approved", "sent_to_publishing"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1804:      state: ["approved", "publishing_ready", "sent_to_publishing"].includes(readiness.readinessStatus) ? "ready" : hasOutput ? "active" : "missing",
public/control-center/pages/media-studio-workspace.js:1808:      label: "Save to Library",
public/control-center/pages/media-studio-workspace.js:1809:      state: savedToLibrary ? "ready" : hasOutput || hasBrief ? "active" : "missing",
public/control-center/pages/media-studio-workspace.js:1810:      detail: savedToLibrary ? "Library linked" : "Available after draft"
public/control-center/pages/media-studio-workspace.js:1820:function renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml }) {
public/control-center/pages/media-studio-workspace.js:1821:  const steps = getMediaWorkflowSteps(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1823:    <nav class="media-workflow-strip" id="mediaWorkflowStrip" aria-label="Media Studio workflow: Brief Source Generate Prepare Review Save to Library Handoff">
public/control-center/pages/media-studio-workspace.js:1824:      <div class="media-workflow-title">Brief &rarr; Source &rarr; Generate/Prepare &rarr; Review &rarr; Save to Library &rarr; Handoff</div>
public/control-center/pages/media-studio-workspace.js:1845:          <div class="setup-kicker">Media Overview</div>
public/control-center/pages/media-studio-workspace.js:1856:        <div class="media-overview-item"><span>Publishing-ready handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
public/control-center/pages/media-studio-workspace.js:1868:    ["Publishing", metrics.publishingReady ? "Ready" : "Prepare"],
public/control-center/pages/media-studio-workspace.js:1876:          <div class="setup-kicker">Smart Recommendation</div>
public/control-center/pages/media-studio-workspace.js:1894:        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:1903:      <select id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input">
public/control-center/pages/media-studio-workspace.js:1910:      ? `<textarea id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}">${escapeHtml(value)}</textarea>`
public/control-center/pages/media-studio-workspace.js:1911:      : `<input id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(value)}">`;
public/control-center/pages/media-studio-workspace.js:1914:    <div class="setup-field-group">
public/control-center/pages/media-studio-workspace.js:1915:      <div class="setup-field-head">
public/control-center/pages/media-studio-workspace.js:1916:        <label class="setup-label" for="${escapeHtml(id)}">${escapeHtml(label)}</label>
public/control-center/pages/media-studio-workspace.js:1919:      ${helper ? `<div class="setup-helper">${escapeHtml(helper)}</div>` : ""}
public/control-center/pages/media-studio-workspace.js:1934:          <div class="setup-kicker">Media Generator</div>
public/control-center/pages/media-studio-workspace.js:1935:          <h3>Brief -> Source -> Generate/Prepare -> Review -> Save to Library -> Handoff</h3>
public/control-center/pages/media-studio-workspace.js:1947:            Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
public/control-center/pages/media-studio-workspace.js:1949:      <form id="mediaGeneratorForm" class="setup-form-grid media-generator-form" novalidate>
public/control-center/pages/media-studio-workspace.js:1951:        <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/media-studio-workspace.js:1955:        <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/media-studio-workspace.js:1959:        <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/media-studio-workspace.js:1965:        ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1966:        <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/media-studio-workspace.js:1987:          <div class="setup-kicker">Smart Prompt Intelligence</div>
public/control-center/pages/media-studio-workspace.js:1993:        <button id="mediaPromptFromContextBtn" class="btn btn-secondary" type="button">Generate from project setup</button>
public/control-center/pages/media-studio-workspace.js:2013:            <div class="setup-kicker">Inbound Media Brief</div>
public/control-center/pages/media-studio-workspace.js:2025:  const isContentBrief = summary.sourcePage === "content-studio";
public/control-center/pages/media-studio-workspace.js:2036:          <div class="setup-kicker">${escapeHtml(kicker)}</div>
public/control-center/pages/media-studio-workspace.js:2064:            <div class="setup-kicker">Media Job Queue</div>
public/control-center/pages/media-studio-workspace.js:2078:          <div class="setup-kicker">Media Job Queue</div>
public/control-center/pages/media-studio-workspace.js:2096:              <button type="button" data-media-action="send-publishing" data-media-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:2128:  const publishingReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:2129:  const approvalStatus = ["approved", "publishing_ready", "sent_to_publishing"].includes(readinessStatus) ? "approved" : "pending";
public/control-center/pages/media-studio-workspace.js:2135:    ["package ready", publishingReady],
public/control-center/pages/media-studio-workspace.js:2156:  if (key === "publishing-readiness") return item.status === "publishing_ready" || item.status === "sent_to_publishing" ? "Ready" : "Prepare";
public/control-center/pages/media-studio-workspace.js:2168:          <div class="setup-kicker">Output Readiness State</div>
public/control-center/pages/media-studio-workspace.js:2266:            <div class="setup-kicker">Output Preview</div>
public/control-center/pages/media-studio-workspace.js:2295:      : `<div class="media-prompt-box">${escapeHtml(JSON.stringify(payload, null, 2) || "No image output was returned yet. If the provider is not connected or timed out, keep the prompt/job-ready draft and continue with review, Library save, or provider setup in Integrations.")}</div>`;
public/control-center/pages/media-studio-workspace.js:2332:        <div class="media-prompt-box media-block-gap">${escapeHtml(voiceScript || asString(payload.message) || "No voice script or audio output is available yet. Voice mode prepares voiceover scripts/audio outputs only; it does not run IVR, phone calls, or call-center workflows.")}</div>
public/control-center/pages/media-studio-workspace.js:2343:        <div class="media-check-item"><span>Captions/notes</span><strong>${escapeHtml(firstText(campaignPack.channel_notes, campaignPack.publishing_notes, "Missing"))}</strong></div>
public/control-center/pages/media-studio-workspace.js:2353:          <div class="setup-kicker">Output Preview</div>
public/control-center/pages/media-studio-workspace.js:2376:          <div class="setup-kicker">Versioning</div>
public/control-center/pages/media-studio-workspace.js:2416:          <span>Library link</span>
public/control-center/pages/media-studio-workspace.js:2417:          <strong>${escapeHtml(selected?.library_asset_ref?.handoff_id ? `Saved (${selected.library_asset_ref.local_only ? "Local" : "Backend"})` : "Not saved")}</strong>
public/control-center/pages/media-studio-workspace.js:2420:      <div class="setup-field-group media-block-gap">
public/control-center/pages/media-studio-workspace.js:2421:        <div class="setup-field-head">
public/control-center/pages/media-studio-workspace.js:2422:          <label class="setup-label" for="mediaVersionCompareNotes">Compare notes</label>
public/control-center/pages/media-studio-workspace.js:2424:        <textarea id="mediaVersionCompareNotes" class="setup-input setup-textarea" rows="3">${escapeHtml(versioning.compareNotes || "")}</textarea>
public/control-center/pages/media-studio-workspace.js:2458:        <button class="btn btn-secondary" type="button" data-media-version-action="save-library">Save to Library</button>
public/control-center/pages/media-studio-workspace.js:2459:        <button class="btn btn-primary" type="button" data-media-version-action="send-publishing">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:2461:      ${fieldError(session, "librarySave", escapeHtml)}
public/control-center/pages/media-studio-workspace.js:2479:    ["publishing-readiness", "Publishing readiness"]
public/control-center/pages/media-studio-workspace.js:2486:          <div class="setup-kicker">Asset Preview / Brand Safety Checklist</div>
public/control-center/pages/media-studio-workspace.js:2520:  if (mode.includes("publish") || mode.includes("handoff")) return "publishing-assistant";
public/control-center/pages/media-studio-workspace.js:2579:          <div class="setup-kicker">Brand-Safe Assets</div>
public/control-center/pages/media-studio-workspace.js:2580:          <h3>Library inputs</h3>
public/control-center/pages/media-studio-workspace.js:2584:      ${renderAssetDependencyRows(assetData, MEDIA_ASSET_KEYS, escapeHtml, "Media library inputs are covered.")}
public/control-center/pages/media-studio-workspace.js:2596:    ["publishing handoff", readiness.publishing_handoff],
public/control-center/pages/media-studio-workspace.js:2603:          <div class="setup-kicker">API Readiness</div>
public/control-center/pages/media-studio-workspace.js:2616:      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
public/control-center/pages/media-studio-workspace.js:2636:function buildPublishingHandoff(projectName, session, selectedItem) {
public/control-center/pages/media-studio-workspace.js:2637:  const source = selectedItem || normalizeMediaItem(buildMediaPayload(session, "publishing_ready"), { context: {} }, "Local draft");
public/control-center/pages/media-studio-workspace.js:2641:    source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:2642:    destination_page: "publishing",
public/control-center/pages/media-studio-workspace.js:2646:    destination_service_domain: "publishing",
public/control-center/pages/media-studio-workspace.js:2650:      route: "media-studio",
public/control-center/pages/media-studio-workspace.js:2669:        library_asset_reference: version?.library_asset_ref || null,
public/control-center/pages/media-studio-workspace.js:2685:    actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:2774:          notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
public/control-center/pages/media-studio-workspace.js:2780:        session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:3037:      session.draftMessage = summary.sourcePage === "content-studio"
public/control-center/pages/media-studio-workspace.js:3079:      if (action === "send-publishing") {
public/control-center/pages/media-studio-workspace.js:3080:        session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3082:        if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3084:        saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3085:        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3117:              actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:3140:            summary: session.form.reviewNotes || "Review media output before publishing handoff.",
public/control-center/pages/media-studio-workspace.js:3143:            requested_by: "media-studio",
public/control-center/pages/media-studio-workspace.js:3147:              route: "media-studio",
public/control-center/pages/media-studio-workspace.js:3150:            actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:3185:              actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:3204:            description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
public/control-center/pages/media-studio-workspace.js:3210:            source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:3211:            route_target: "media-studio",
public/control-center/pages/media-studio-workspace.js:3215:              route: "media-studio",
public/control-center/pages/media-studio-workspace.js:3218:            actor: "media-studio"
public/control-center/pages/media-studio-workspace.js:3245:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/media-studio-workspace.js:3246:        source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:3247:        destination_page: "ai-command",
public/control-center/pages/media-studio-workspace.js:3261:      navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3266:  const sendPublishingBtn = document.getElementById("mediaSendToPublishingBtn");
public/control-center/pages/media-studio-workspace.js:3267:  if (sendPublishingBtn) {
public/control-center/pages/media-studio-workspace.js:3268:    sendPublishingBtn.onclick = () => {
public/control-center/pages/media-studio-workspace.js:3270:      session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3272:      if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3274:      saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3275:      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3279:  const headerSaveLibraryBtn = document.getElementById("mediaHeaderSaveLibraryBtn");
public/control-center/pages/media-studio-workspace.js:3280:  if (headerSaveLibraryBtn) {
public/control-center/pages/media-studio-workspace.js:3281:    headerSaveLibraryBtn.onclick = async () => {
public/control-center/pages/media-studio-workspace.js:3283:      await saveVersionToLibrary({
public/control-center/pages/media-studio-workspace.js:3366:      if (action === "send-publishing") {
public/control-center/pages/media-studio-workspace.js:3367:        session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3368:        currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3370:        saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3371:        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3374:      if (action === "save-library") {
public/control-center/pages/media-studio-workspace.js:3375:        await saveVersionToLibrary({
public/control-center/pages/media-studio-workspace.js:3411:        setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/media-studio-workspace.js:3412:          source_page: "media-studio",
public/control-center/pages/media-studio-workspace.js:3413:          destination_page: "ai-command",
public/control-center/pages/media-studio-workspace.js:3426:        navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3434:async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
public/control-center/pages/media-studio-workspace.js:3435:  const handoff = buildPublishingHandoff(projectName, session, selectedItem);
public/control-center/pages/media-studio-workspace.js:3441:    setSharedHandoff(scope, "publishing", handoff);
public/control-center/pages/media-studio-workspace.js:3447:      showMessage?.("Publishing package handoff prepared from Media Studio.");
public/control-center/pages/media-studio-workspace.js:3449:      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3452:    showMessage?.("Publishing package handoff prepared locally.");
public/control-center/pages/media-studio-workspace.js:3456:    navigateTo("publishing");
public/control-center/pages/media-studio-workspace.js:3458:    showError?.(error.message || "Failed to open Publishing.");
public/control-center/pages/media-studio-workspace.js:3463:  id: "media-studio",
public/control-center/pages/media-studio-workspace.js:3468:    description: "Run saved image, video, voice, and campaign-pack jobs with prompts, review states, Library saves, and package routing."
public/control-center/pages/media-studio-workspace.js:3471:    <section class="page is-active" data-page="media-studio">
public/control-center/pages/media-studio-workspace.js:3524:              <div class="setup-kicker">Welcome to Media Studio</div>
public/control-center/pages/media-studio-workspace.js:3526:              <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
public/control-center/pages/media-studio-workspace.js:3538:      if (selectedItem?.library_asset_ref?.handoff_id) rows.push(["Library asset", selectedItem.library_asset_ref.handoff_id]);
public/control-center/pages/media-studio-workspace.js:3549:              <div class="setup-kicker">Source Context</div>
public/control-center/pages/media-studio-workspace.js:3567:        .filter((item) => ["creative", "publishing"].includes(item.key));
public/control-center/pages/media-studio-workspace.js:3572:              <div class="setup-kicker">Creative Readiness</div>
public/control-center/pages/media-studio-workspace.js:3592:        .filter((item) => ["brand", "governance"].includes(item.key));
public/control-center/pages/media-studio-workspace.js:3597:              <div class="setup-kicker">Brand Compliance</div>
public/control-center/pages/media-studio-workspace.js:3598:              <h3>Brand and governance</h3>
public/control-center/pages/media-studio-workspace.js:3610:          <div class="media-hint media-readiness-hint" aria-label="Governance review guidance">Prepare Governance Review if any risk or compliance concern exists.</div>
public/control-center/pages/media-studio-workspace.js:3619:        ${renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml })}
public/control-center/pages/operations-centers.js:75:      const route = button.getAttribute("data-ops-route") || "home";
public/control-center/pages/operations-centers.js:121:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:132:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:172:  if (pageKey === "task-center") {
public/control-center/pages/operations-centers.js:202:  if (pageKey === "queue-center") {
public/control-center/pages/operations-centers.js:222:  if (pageKey === "job-monitor") {
public/control-center/pages/operations-centers.js:236:        preview: "Assess execution health across workflows, media, and publishing jobs.",
public/control-center/pages/operations-centers.js:237:        prompt: `Summarize current execution health for ${projectLabel} across workflows, media, and publishing jobs. Highlight failure clusters, retry patterns, and risk areas.`
public/control-center/pages/operations-centers.js:256:      prompt: `Summarize the current operational notification signal for ${projectLabel} with focus on ${focusLabel}. Highlight approvals, provider health, publishing events, and urgent follow-up.`
public/control-center/pages/operations-centers.js:299:      route: "job-monitor"
public/control-center/pages/operations-centers.js:306:      route: "queue-center"
public/control-center/pages/operations-centers.js:313:      route: "job-monitor"
public/control-center/pages/operations-centers.js:320:      route: "notification-center"
public/control-center/pages/operations-centers.js:327:      route: "notification-center"
public/control-center/pages/operations-centers.js:330:      label: "Publishing",
public/control-center/pages/operations-centers.js:332:      helper: "Publishing alerts",
public/control-center/pages/operations-centers.js:334:      route: "publishing"
public/control-center/pages/operations-centers.js:341:      route: "integrations"
public/control-center/pages/operations-centers.js:348:      route: "governance"
public/control-center/pages/operations-centers.js:355:      route: "notification-center"
public/control-center/pages/operations-centers.js:365:    || "Cross-center runtime health, queue pressure, failures, publishing, governance, and provider signals.";
public/control-center/pages/operations-centers.js:517:    <section class="page is-active" data-page="task-center">
public/control-center/pages/operations-centers.js:662:                  <p>Context-only guidance: opens AI with prompt/context only. No task creation, owner assignment, status change, approval, publishing, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:717:  const prompts = buildOpsAssistantPrompts("task-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:718:  const incomingHandoff = getSharedHandoff(projectName, "task-center", ops);
public/control-center/pages/operations-centers.js:888:    <section class="page is-active" data-page="queue-center">
public/control-center/pages/operations-centers.js:896:            <p class="std-context-description">Review workflow, content, media, approval, publishing, and sync queue pressure for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:987:                  <p>Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
public/control-center/pages/operations-centers.js:1004:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Approve item (disabled: Governance/Publishing-owned)</button>
public/control-center/pages/operations-centers.js:1005:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Publish item (disabled: Publishing-owned and Governance-gated)</button>
public/control-center/pages/operations-centers.js:1015:                  <p>Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1061:  const prompts = buildOpsAssistantPrompts("queue-center", projectName, selectedItem, titleCase(session.focus || "all queues"));
public/control-center/pages/operations-centers.js:1179:    <section class="page is-active" data-page="job-monitor">
public/control-center/pages/operations-centers.js:1187:            <p class="std-context-description">Review running, completed, and failed job state across workflows, media, and publishing for ${escapeHtml(projectLabel)} without triggering workers.</p>
public/control-center/pages/operations-centers.js:1229:                ${["all", "workflow", "media", "publishing"].map((value) => `<option value="${escapeHtml(value)}"${value === session.kind ? " selected" : ""}>${escapeHtml(titleCase(value))}</option>`).join("")}
public/control-center/pages/operations-centers.js:1277:                  <p>Active actions are refresh, route, and AI guidance only. Job retry, cancel, rerun, delete, worker execution, publishing, and approval mutations remain disabled or destination-owned.</p>
public/control-center/pages/operations-centers.js:1310:                  <p>Context-only guidance: opens AI with prompt/context only. No retry, cancel, rerun, delete, worker trigger, approve, publish, Governance bypass, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1355:  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));
public/control-center/pages/operations-centers.js:1419:  const integrations = asObject(state.data.integrations);
public/control-center/pages/operations-centers.js:1420:  const checks = asObject(integrations.readiness?.checks);
public/control-center/pages/operations-centers.js:1429:      route: { route: "integrations" }
public/control-center/pages/operations-centers.js:1454:    route: asObject(item.linked_entity).route || "home",
public/control-center/pages/operations-centers.js:1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:1534:    <section class="page is-active" data-page="notification-center">
public/control-center/pages/operations-centers.js:1542:            <p class="std-context-description">Review operational alerts, unread inbox state, approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:1666:                  <p>Context-only guidance: opens AI with prompt/context only. No mark-read, acknowledge, resolve, dismiss, delete, send, approve, publish, Governance bypass, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1748:  id: "task-center",
public/control-center/pages/operations-centers.js:1755:  template: `<section class="page is-active" data-page="task-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1783:  id: "queue-center",
public/control-center/pages/operations-centers.js:1788:    description: "Review queue pressure and route workflow, content, media, approval, publishing, and sync items to owning workspaces without silent mutation."
public/control-center/pages/operations-centers.js:1790:  template: `<section class="page is-active" data-page="queue-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1831:  id: "job-monitor",
public/control-center/pages/operations-centers.js:1836:    description: "Review job health, failures, retry risk, and execution logs across workflows, media, and publishing without silent job mutation."
public/control-center/pages/operations-centers.js:1838:  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1879:  id: "notification-center",
public/control-center/pages/operations-centers.js:1884:    description: "Review alerts, unread inbox state, approvals, provider health, publishing, claim risks, and workflow completion signals with Mark Read limited to notification read-state."
public/control-center/pages/operations-centers.js:1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1927:  const root = document.querySelector('[data-page="operations-centers"] .ops-shell');
public/control-center/pages/operations-centers.js:1941:      route: "task-center",
public/control-center/pages/operations-centers.js:1949:      route: "queue-center",
public/control-center/pages/operations-centers.js:1957:      route: "job-monitor",
public/control-center/pages/operations-centers.js:1965:      route: "notification-center",
public/control-center/pages/operations-centers.js:1975:    <section class="page is-active" data-page="operations-centers">
public/control-center/pages/operations-centers.js:1994:          description: "Use this page as the routing hub from AI Team drafts, workflows, tasks, and runtime signals into the correct operations workspace.",
public/control-center/pages/operations-centers.js:2005:                  <p>AI Team can prepare drafts, tasks, workflows, and handoffs. This overview routes work to the owning operations center for review, monitoring, or controlled follow-up.</p>
public/control-center/pages/operations-centers.js:2033:                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
public/control-center/pages/operations-centers.js:2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
public/control-center/pages/operations-centers.js:2038:                <button class="btn btn-ghost" type="button" data-route="workflows">Open Workflows</button>
public/control-center/pages/operations-centers.js:2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, approve workflows, mark notifications read, publish, or trigger workers. It only routes to the owning workspace.</p>
public/control-center/pages/operations-centers.js:2066:  id: "operations-centers",
public/control-center/pages/operations-centers.js:2071:    description: "Routing-only overview for Task Center, Queue Center, Job Monitor, Notifications, AI Team, and Workflows."
public/control-center/pages/operations-centers.js:2073:  template: `<section class="page is-active" data-page="operations-centers"><div class="ops-shell"></div></section>`,
public/control-center/pages/research.js:6:  campaign: { route: "campaign-studio", label: "Campaign Studio", destinationRole: "strategist", destinationDomain: "campaign" },
public/control-center/pages/research.js:7:  content: { route: "content-studio", label: "Content Studio", destinationRole: "writer", destinationDomain: "content" },
public/control-center/pages/research.js:8:  seo: { route: "workflows", label: "SEO Workflow", destinationRole: "strategist", destinationDomain: "research" },
public/control-center/pages/research.js:9:  ads: { route: "ads-manager", label: "Ads Manager", destinationRole: "ads_operator", destinationDomain: "campaign" },
public/control-center/pages/research.js:10:  ai: { route: "ai-command", label: "AI Command", destinationRole: "admin", destinationDomain: "governance" }
public/control-center/pages/research.js:245:function buildSourceCoverage(integrations, insights) {
public/control-center/pages/research.js:246:  const readinessChecks = asObject(integrations?.readiness?.checks);
public/control-center/pages/research.js:247:  const sources = asObject(integrations?.sources?.sources);
public/control-center/pages/research.js:248:  const coverage = asObject(insights?.data_coverage);
public/control-center/pages/research.js:250:  const fromInsights = Object.entries(coverage).map(([id, item]) => ({
public/control-center/pages/research.js:257:  const fromIntegrations = Object.keys({ ...sources, ...readinessChecks }).map((id) => {
public/control-center/pages/research.js:270:  return uniqueBy([...fromInsights, ...fromIntegrations], (item) => item.id);
public/control-center/pages/research.js:285:  const integrations = asObject(state.data.integrations);
public/control-center/pages/research.js:287:  const insightsPayload = asObject(session.intelligence.insights);
public/control-center/pages/research.js:290:  const insights = asObject(
public/control-center/pages/research.js:291:    insightsPayload.insights ||
public/control-center/pages/research.js:292:    insightsPayload.data ||
public/control-center/pages/research.js:293:    insightsPayload ||
public/control-center/pages/research.js:294:    activity.insights ||
public/control-center/pages/research.js:295:    activity.marketing_insights ||
public/control-center/pages/research.js:296:    activity.performance_insights ||
public/control-center/pages/research.js:297:    overviewBlock.insights
public/control-center/pages/research.js:307:  const sourceCoverage = buildSourceCoverage(integrations, insights);
public/control-center/pages/research.js:309:    insights,
public/control-center/pages/research.js:311:    asObject(insights.research),
public/control-center/pages/research.js:321:      insights.recommendations,
public/control-center/pages/research.js:331:      insights.risks,
public/control-center/pages/research.js:460:      insights.content_themes,
public/control-center/pages/research.js:611:    integrations,
public/control-center/pages/research.js:612:    insights,
public/control-center/pages/research.js:635:    hasLiveIntelligence: Boolean(Object.keys(insights).length || Object.keys(learning).length)
public/control-center/pages/research.js:653:        insights: null,
public/control-center/pages/research.js:668:  fetchProjectInsights,
public/control-center/pages/research.js:680:    fetchProjectInsights(projectName),
public/control-center/pages/research.js:683:    .then(([insightsResult, learningResult]) => {
public/control-center/pages/research.js:684:      const insights = insightsResult?.status === "fulfilled" ? insightsResult.value : null;
public/control-center/pages/research.js:687:        insightsResult?.status === "rejected" ? insightsResult.reason?.message : "",
public/control-center/pages/research.js:691:      session.intelligence.status = (insights || learning) ? "loaded" : "error";
public/control-center/pages/research.js:692:      session.intelligence.insights = insights;
public/control-center/pages/research.js:697:      if (errorMessage && !(insights || learning)) {
public/control-center/pages/research.js:791:    <div class="insights-list">
public/control-center/pages/research.js:793:        <div class="insights-list-item">
public/control-center/pages/research.js:794:          <div class="insights-list-head">
public/control-center/pages/research.js:798:          <div class="insights-list-meta">${escapeHtml(compactText(firstNonEmpty(item.summary, "Detail pending."), 24, "Detail pending."))}</div>
public/control-center/pages/research.js:854:  fetchProjectInsights,
public/control-center/pages/research.js:880:        fetchProjectInsights,
public/control-center/pages/research.js:894:      navigateTo("ai-command");
public/control-center/pages/research.js:903:        setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/research.js:905:          destination_page: "ai-command",
public/control-center/pages/research.js:919:          destination_page: "ai-command",
public/control-center/pages/research.js:937:        navigateTo("ai-command");
public/control-center/pages/research.js:1122:    fetchProjectInsights,
public/control-center/pages/research.js:1140:      fetchProjectInsights,
public/control-center/pages/research.js:1148:      fetchProjectInsights,
public/control-center/pages/research.js:1326:                <h4 class="insights-subtitle">What matters most now</h4>
public/control-center/pages/research.js:1330:                <h4 class="insights-subtitle">Coverage snapshot</h4>
public/control-center/pages/research.js:1398:                <h4 class="insights-subtitle">Long-tail ideas</h4>
public/control-center/pages/research.js:1400:                <h4 class="insights-subtitle" style="margin-top:16px;">Content themes</h4>
public/control-center/pages/research.js:1404:                <h4 class="insights-subtitle">Missing clusters</h4>
public/control-center/pages/research.js:1406:                <h4 class="insights-subtitle" style="margin-top:16px;">Pages to optimize</h4>
public/control-center/pages/research.js:1416:              <h3>Findings / Saved Insights</h3>
public/control-center/pages/research.js:1417:              <p class="research-section-copy">Capture what was discovered and keep the strongest reusable insights in one place.</p>
public/control-center/pages/research.js:1423:              <input id="researchNoteTitle" class="setup-input" type="text" placeholder="Finding title" value="${escapeHtml(session.noteDraft.title)}" />
public/control-center/pages/research.js:1424:              <textarea id="researchNoteBody" class="setup-input setup-textarea" rows="5" placeholder="Capture the key observation, implication, or market signal...">${escapeHtml(session.noteDraft.body)}</textarea>
public/control-center/pages/research.js:1425:              <input id="researchNoteTags" class="setup-input" type="text" placeholder="Tags, comma separated" value="${escapeHtml(session.noteDraft.tags)}" />
public/control-center/pages/research.js:1430:                <h4 class="insights-subtitle">Saved findings</h4>
public/control-center/pages/research.js:1456:                <h4 class="insights-subtitle">Reusable insight blocks</h4>
public/control-center/pages/research.js:1496:                <h4 class="insights-subtitle">Recommendations</h4>
public/control-center/pages/research.js:1500:                <h4 class="insights-subtitle">Risks to explore next</h4>
public/control-center/pages/research.js:1504:                <h4 class="insights-subtitle">Opportunity map</h4>
public/control-center/pages/research.js:1538:                <h4 class="insights-subtitle">Saved recommendation</h4>
public/control-center/pages/research.js:1562:                <h4 class="insights-subtitle">Send to execution</h4>
public/control-center/pages/research.js:1590:                <span class="home-action-meta" title="${escapeHtml(item.prompt)}">${escapeHtml(item.preview || compactText(item.prompt, 18, ""))}</span>
public/control-center/pages/research.js:1604:      fetchProjectInsights,
public/control-center/pages/library/action-panel.js:1:export function renderLibraryActionPanel({ selectedAsset = null, disabled = false } = {}) {
public/control-center/pages/library/action-panel.js:20:    <section class="card library-action-panel" data-library-action-panel>
public/control-center/pages/library/action-panel.js:21:      <div class="card-head library-panel-head">
public/control-center/pages/library/action-panel.js:28:      <div class="library-panel-hero">
public/control-center/pages/library/action-panel.js:33:      <div class="library-panel-metrics">
public/control-center/pages/library/action-panel.js:34:        <div class="library-panel-metric">
public/control-center/pages/library/action-panel.js:38:        <div class="library-panel-metric">
public/control-center/pages/library/action-panel.js:42:        <div class="library-panel-metric">
public/control-center/pages/library/action-panel.js:48:      <div class="library-panel-section">
public/control-center/pages/library/action-panel.js:49:        <p class="setup-helper">Primary Actions</p>
public/control-center/pages/library/action-panel.js:50:        <div class="library-panel-action-grid library-panel-actions-primary">
public/control-center/pages/library/action-panel.js:51:          <button class="btn btn-primary" type="button" data-library-open="${selectedAssetId}"${disabledAttr}>Open asset</button>
public/control-center/pages/library/action-panel.js:52:          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>
public/control-center/pages/library/action-panel.js:56:      <div class="library-panel-section">
public/control-center/pages/library/action-panel.js:57:        <p class="setup-helper">Utility</p>
public/control-center/pages/library/action-panel.js:58:        <div class="library-panel-action-grid library-panel-actions-utility">
public/control-center/pages/library/action-panel.js:63:      <div class="library-panel-section">
public/control-center/pages/library/action-panel.js:64:        <p class="setup-helper">Decisions</p>
public/control-center/pages/library/action-panel.js:65:        <div class="library-panel-action-grid library-panel-actions-durable">
public/control-center/pages/library/action-panel.js:68:      : `<button class="btn btn-secondary" type="button" data-library-source-truth="${selectedAssetId}"${disabledAttr}>${escapePanelHtml(getPanelSourceOfTruth(selectedAsset) ? "Remove source mark" : "Mark as source")}</button>
public/control-center/pages/library/action-panel.js:69:             <button class="btn btn-secondary" type="button" data-asset-status-action="approved" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Approve for use</button>
public/control-center/pages/library/action-panel.js:70:             <button class="btn btn-secondary" type="button" data-asset-status-action="needs_review" data-library-asset="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Mark for review</button>`}
public/control-center/pages/library/action-panel.js:71:          <button class="btn btn-secondary" type="button" data-library-rename="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Rename asset</button>
public/control-center/pages/library/action-panel.js:72:          <button class="btn btn-secondary" type="button" data-library-archive="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}"${durableDisabledAttr}>Archive asset</button>
public/control-center/pages/library/action-panel.js:76:      <div class="library-panel-section library-panel-section-danger">
public/control-center/pages/library/action-panel.js:77:        <p class="setup-helper">Danger</p>
public/control-center/pages/library/action-panel.js:78:        <button class="btn btn-secondary library-danger-action" type="button" data-library-delete="${selectedAssetId}" data-asset-id="${selectedRegistryAssetId}" title="Soft-delete this asset after confirmation"${durableDisabledAttr}>Soft-delete asset</button>
public/control-center/pages/library/listener-lifecycle.js:5:  const registry = createLifecycleRegistry("library-listeners");
public/control-center/pages/library/listener-lifecycle.js:16:      console.warn("[Library] listener dispose failed", entry.error);
public/control-center/pages/library/listener-lifecycle.js:26:export function mountLibraryListeners({ root, documentRef = document, windowRef = window, handlers = {} } = {}) {
public/control-center/pages/library/session-store.js:1:const DEFAULT_LIBRARY_SESSION = Object.freeze({
public/control-center/pages/library/session-store.js:15:export function createLibrarySession(overrides = {}) {
public/control-center/pages/library/session-store.js:17:    ...DEFAULT_LIBRARY_SESSION,
public/control-center/pages/library/session-store.js:20:      ...DEFAULT_LIBRARY_SESSION.expandedPanels,
public/control-center/pages/library/session-store.js:26:export function normalizeLibrarySession(session = {}) {
public/control-center/pages/library/session-store.js:27:  return createLibrarySession(session);
public/control-center/pages/library/session-store.js:30:export function updateLibrarySession(session = {}, patch = {}) {
public/control-center/pages/library/session-store.js:31:  return normalizeLibrarySession({
public/control-center/pages/library/session-store.js:41:export function isLibraryTransientKey(key) {
public/control-center/pages/library/session-store.js:42:  return Object.prototype.hasOwnProperty.call(DEFAULT_LIBRARY_SESSION, key);
public/control-center/pages/library/catalog-readiness.js:19:export function summarizeLibraryReadiness({ assets = [], requiredCategories = [] } = {}) {
public/control-center/pages/library/catalog-readiness.js:46:export function buildLibraryNextBestAction(readiness = {}) {
public/control-center/pages/library/catalog-readiness.js:53:      suggestedRouteOrAction: "library-upload"
public/control-center/pages/library/catalog-readiness.js:58:    actionId: "review-library-assets",
public/control-center/pages/library/catalog-readiness.js:60:    label: "Review and approve Library assets",
public/control-center/pages/library/catalog-readiness.js:62:    suggestedRouteOrAction: "library-review"
public/control-center/pages/library/ai-panel.js:1:export function renderLibraryAiPanel({ readiness = {}, selectedAsset = null, disabled = false } = {}) {
public/control-center/pages/library/ai-panel.js:8:  const nextBestAction = buildLibraryAiNextBestAction({ readiness, selectedAsset });
public/control-center/pages/library/ai-panel.js:15:    <section class="card library-ai-panel" data-library-ai-panel>
public/control-center/pages/library/ai-panel.js:16:      <div class="card-head library-panel-head">
public/control-center/pages/library/ai-panel.js:23:      <div class="library-panel-hero">
public/control-center/pages/library/ai-panel.js:28:      <div class="library-panel-metrics">
public/control-center/pages/library/ai-panel.js:29:        <div class="library-panel-metric">
public/control-center/pages/library/ai-panel.js:33:        <div class="library-panel-metric">
public/control-center/pages/library/ai-panel.js:37:        <div class="library-panel-metric">
public/control-center/pages/library/ai-panel.js:43:      <div class="library-panel-section">
public/control-center/pages/library/ai-panel.js:44:        <p class="setup-helper">Why it matters</p>
public/control-center/pages/library/ai-panel.js:45:        <div class="library-ai-context-card">
public/control-center/pages/library/ai-panel.js:51:      <div class="library-panel-section">
public/control-center/pages/library/ai-panel.js:52:        <p class="setup-helper">Suggested next move</p>
public/control-center/pages/library/ai-panel.js:53:        <div class="library-ai-context-card">
public/control-center/pages/library/ai-panel.js:63:function buildLibraryAiNextBestAction({ readiness = {}, selectedAsset = null } = {}) {
public/control-center/pages/library/ai-panel.js:69:      description: `${missingCount} required asset category${missingCount === 1 ? "" : "ies"} still need attention before the Library is fully ready.`,
public/control-center/pages/library/ai-panel.js:103:    description: "This selected asset looks ready for downstream campaign, media, and publishing workflows.",
public/control-center/pages/library/ai-panel.js:104:    suggestedMove: "Use Open asset to verify final quality, then proceed to downstream workflows."
public/control-center/pages/library/command-router.js:1:const LIBRARY_COMMANDS = Object.freeze({
public/control-center/pages/library/command-router.js:8:  REFRESH_LIBRARY: "refresh-library",
public/control-center/pages/library/command-router.js:18:export function getLibraryCommands() {
public/control-center/pages/library/command-router.js:19:  return LIBRARY_COMMANDS;
public/control-center/pages/library/command-router.js:22:export function createLibraryCommand(command, payload = {}) {
public/control-center/pages/library/command-router.js:30:export function isLibraryMutationCommand(command) {
public/control-center/pages/library/command-router.js:32:    LIBRARY_COMMANDS.REFRESH_LIBRARY,
public/control-center/pages/library/command-router.js:33:    LIBRARY_COMMANDS.SET_SOURCE_OF_TRUTH,
public/control-center/pages/library/command-router.js:34:    LIBRARY_COMMANDS.UPDATE_STATUS,
public/control-center/pages/library/command-router.js:35:    LIBRARY_COMMANDS.RENAME_ASSET,
public/control-center/pages/library/command-router.js:36:    LIBRARY_COMMANDS.ARCHIVE_ASSET,
public/control-center/pages/library/command-router.js:37:    LIBRARY_COMMANDS.DELETE_ASSET
public/control-center/pages/library/command-router.js:41:export function isLibraryAiCommand(command) {
public/control-center/pages/library/command-router.js:42:  return command === LIBRARY_COMMANDS.SEND_TO_AI;
public/control-center/pages/library/command-router.js:45:export function routeLibraryCommand(commandEnvelope, handlers = {}) {
public/control-center/pages/library/command-router.js:54:      reason: "No handler registered for Library command."
public/control-center/pages/library/projection-adapter.js:1:export function normalizeLibraryAsset(asset = {}) {
public/control-center/pages/library/projection-adapter.js:17:export function normalizeLibraryAssets(assets = []) {
public/control-center/pages/library/projection-adapter.js:19:  return assets.map(normalizeLibraryAsset);
public/control-center/pages/ai-command.js:6:} from "./ai-command/tool-dock.js";
public/control-center/pages/ai-command.js:23:} from "../asset-library.js";
public/control-center/pages/ai-command.js:39:                routeHint: "campaign-studio"
public/control-center/pages/ai-command.js:46:                routeHint: "content-studio"
public/control-center/pages/ai-command.js:53:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:60:                routeHint: "media-studio"
public/control-center/pages/ai-command.js:66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:67:                routeHint: "publishing"
public/control-center/pages/ai-command.js:74:                routeHint: "ads-manager"
public/control-center/pages/ai-command.js:78:                label: "SEO & Insights Analyst",
public/control-center/pages/ai-command.js:80:                summary: "SEO signals, performance data, content insights, and traffic patterns.",
public/control-center/pages/ai-command.js:81:                routeHint: "insights"
public/control-center/pages/ai-command.js:87:                summary: "Claims review, approvals, safety language, and governance checks.",
public/control-center/pages/ai-command.js:88:                routeHint: "governance"
public/control-center/pages/ai-command.js:95:                routeHint: "workflows"
public/control-center/pages/ai-command.js:102:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:109:                routeHint: "workflows"
public/control-center/pages/ai-command.js:148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
public/control-center/pages/ai-command.js:149:		destinations: ["Campaign Studio", "Workflows", "AI Command"],
public/control-center/pages/ai-command.js:161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
public/control-center/pages/ai-command.js:162:		destinations: ["Content Studio", "Publishing", "AI Command"],
public/control-center/pages/ai-command.js:163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
public/control-center/pages/ai-command.js:175:		destinations: ["Asset Library", "Content Studio", "AI Command"],
public/control-center/pages/ai-command.js:188:		destinations: ["Asset Library", "Content Studio", "Media Native"],
public/control-center/pages/ai-command.js:195:		position: "Publishing Readiness Lead",
public/control-center/pages/ai-command.js:197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
public/control-center/pages/ai-command.js:199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
public/control-center/pages/ai-command.js:200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Push to live channels directly"],
public/control-center/pages/ai-command.js:201:		destinations: ["Publishing", "Workflows", "AI Command"],
public/control-center/pages/ai-command.js:202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
public/control-center/pages/ai-command.js:214:		destinations: ["Ads Manager", "Integrations", "Campaign Studio"],
public/control-center/pages/ai-command.js:220:		label: "SEO & Insights Analyst",
public/control-center/pages/ai-command.js:221:		position: "Search and Insights Lead",
public/control-center/pages/ai-command.js:223:		summary: "SEO signals, performance data, content insights, and traffic patterns.",
public/control-center/pages/ai-command.js:224:		placeholder: "Ask the SEO & Insights Analyst to review performance, suggest SEO improvements, or identify top content patterns…",
public/control-center/pages/ai-command.js:226:		cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],
public/control-center/pages/ai-command.js:227:		destinations: ["Insights", "Integrations", "Setup"],
public/control-center/pages/ai-command.js:234:		position: "Claims and Governance Lead",
public/control-center/pages/ai-command.js:236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
public/control-center/pages/ai-command.js:237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
public/control-center/pages/ai-command.js:238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
public/control-center/pages/ai-command.js:239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
public/control-center/pages/ai-command.js:240:		destinations: ["Workflows", "Publishing", "Governance"],
public/control-center/pages/ai-command.js:252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
public/control-center/pages/ai-command.js:253:		destinations: ["Workflows", "Operations Centers", "AI Command"],
public/control-center/pages/ai-command.js:266:		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
public/control-center/pages/ai-command.js:326:		{ label: "Map data coverage gaps", sub: "Which integrations are missing" },
public/control-center/pages/ai-command.js:331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
public/control-center/pages/ai-command.js:332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
public/control-center/pages/ai-command.js:359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
public/control-center/pages/ai-command.js:371:	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
public/control-center/pages/ai-command.js:407:		label: "Admin / Governance",
public/control-center/pages/ai-command.js:422:		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
public/control-center/pages/ai-command.js:444:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
public/control-center/pages/ai-command.js:454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
public/control-center/pages/ai-command.js:458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:465:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
public/control-center/pages/ai-command.js:472:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
public/control-center/pages/ai-command.js:479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
public/control-center/pages/ai-command.js:518:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
public/control-center/pages/ai-command.js:519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
public/control-center/pages/ai-command.js:543:	"Integrations",
public/control-center/pages/ai-command.js:554:		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
public/control-center/pages/ai-command.js:601:		purpose: "Translate intent into executable workflows and handoffs.",
public/control-center/pages/ai-command.js:635:		if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
public/control-center/pages/ai-command.js:653:			targetPage: "ai-command",
public/control-center/pages/ai-command.js:664:			targetPage: "workflows",
public/control-center/pages/ai-command.js:678:			targetPage: "publishing",
public/control-center/pages/ai-command.js:682:				reason: "Requires approval gate before external publishing actions."
public/control-center/pages/ai-command.js:699:	if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
public/control-center/pages/ai-command.js:855:	return message.includes("insights") || message.includes("learning") || message.includes("not found");
public/control-center/pages/ai-command.js:869:		overview.publishing_language ||
public/control-center/pages/ai-command.js:958:				insights: null,
public/control-center/pages/ai-command.js:1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1261:	if (outputType === "workflow") return "workflows";
public/control-center/pages/ai-command.js:1262:	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
public/control-center/pages/ai-command.js:1263:	if (id === "writer") return "content-studio";
public/control-center/pages/ai-command.js:1264:	if (id === "media") return "media-studio";
public/control-center/pages/ai-command.js:1265:	if (id === "video_lead") return "media-studio";
public/control-center/pages/ai-command.js:1266:	if (id === "publisher") return "publishing";
public/control-center/pages/ai-command.js:1267:	if (id === "ads") return "ads-manager";
public/control-center/pages/ai-command.js:1268:	if (id === "analyst") return "insights";
public/control-center/pages/ai-command.js:1269:	if (id === "compliance_reviewer") return "governance";
public/control-center/pages/ai-command.js:1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1273:	return "workflows";
public/control-center/pages/ai-command.js:1303:        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
public/control-center/pages/ai-command.js:1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
public/control-center/pages/ai-command.js:1307:        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
public/control-center/pages/ai-command.js:1308:        const looksInsightLike = /\b(insight|insights|seo|keyword|keywords|analytics|performance|traffic|ranking|search intent|metrics|research|competitor|competitors|market research)\b/.test(text);
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1318:                return { outputType, destinationRoute: explicitDestination || "workflows" };
public/control-center/pages/ai-command.js:1323:                return { outputType, destinationRoute: explicitDestination || "content-studio" };
public/control-center/pages/ai-command.js:1328:                return { outputType, destinationRoute: explicitDestination || "media-studio" };
public/control-center/pages/ai-command.js:1331:        if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
public/control-center/pages/ai-command.js:1332:                outputType = "publishing";
public/control-center/pages/ai-command.js:1333:                return { outputType, destinationRoute: explicitDestination || "publishing" };
public/control-center/pages/ai-command.js:1336:        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
public/control-center/pages/ai-command.js:1337:                outputType = "governance";
public/control-center/pages/ai-command.js:1338:                return { outputType, destinationRoute: explicitDestination || "governance" };
public/control-center/pages/ai-command.js:1343:                return { outputType, destinationRoute: explicitDestination || "insights" };
public/control-center/pages/ai-command.js:1350:                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
public/control-center/pages/ai-command.js:1361:		"campaign-studio": "Campaign Studio",
public/control-center/pages/ai-command.js:1362:		"content-studio": "Content Studio",
public/control-center/pages/ai-command.js:1363:		"media-studio": "Media Studio",
public/control-center/pages/ai-command.js:1364:		publishing: "Publishing",
public/control-center/pages/ai-command.js:1365:		"ads-manager": "Ads Manager",
public/control-center/pages/ai-command.js:1366:		insights: "Insights",
public/control-center/pages/ai-command.js:1367:		integrations: "Integrations",
public/control-center/pages/ai-command.js:1368:		governance: "Governance",
public/control-center/pages/ai-command.js:1369:		"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:1370:		"task-center": "Task Center",
public/control-center/pages/ai-command.js:1371:		setup: "Setup",
public/control-center/pages/ai-command.js:1372:		workflows: "Workflows"
public/control-center/pages/ai-command.js:1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
public/control-center/pages/ai-command.js:1410:					"Route execution draft to Campaign Studio or Workflows"
public/control-center/pages/ai-command.js:1434:				"Outcome-led hook direction for a German publishing draft",
public/control-center/pages/ai-command.js:1448:				"Claims, health, or performance promises need evidence before publishing."
public/control-center/pages/ai-command.js:1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
public/control-center/pages/ai-command.js:1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
public/control-center/pages/ai-command.js:1500:			summary: "Publishing checklist and schedule draft prepared.",
public/control-center/pages/ai-command.js:1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
public/control-center/pages/ai-command.js:1509:				"Prepare handoff for publishing review"
public/control-center/pages/ai-command.js:1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
public/control-center/pages/ai-command.js:1552:				"Recommendations prepared for Insights workspace"
public/control-center/pages/ai-command.js:1566:				"Prepare governance notes",
public/control-center/pages/ai-command.js:1567:				"Route to Governance for formal review"
public/control-center/pages/ai-command.js:1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1855:	const connectors = asObject(state.data.integrations);
public/control-center/pages/ai-command.js:1861:	const insights =
public/control-center/pages/ai-command.js:1862:		asObject(intelligence?.insights) ||
public/control-center/pages/ai-command.js:1863:		asObject(activity.insights) ||
public/control-center/pages/ai-command.js:1864:		asObject(activity.marketing_insights) ||
public/control-center/pages/ai-command.js:1865:		asObject(activity.performance_insights);
public/control-center/pages/ai-command.js:1870:	const coverage = asObject(insights.data_coverage);
public/control-center/pages/ai-command.js:1873:	const recommendations = asArray(learning.recommendations || insights.recommendations);
public/control-center/pages/ai-command.js:1877:	const missingIntegrations = [];
public/control-center/pages/ai-command.js:1881:			missingIntegrations.push({
public/control-center/pages/ai-command.js:1884:				integrations: asArray(item?.integrations)
public/control-center/pages/ai-command.js:1909:		missingIntegrations,
public/control-center/pages/ai-command.js:1911:		integrationSummary: asObject(controlCenter.summary),
public/control-center/pages/ai-command.js:1937:		insights,
public/control-center/pages/ai-command.js:1940:		topContent: asArray(insights.best_performing_content),
public/control-center/pages/ai-command.js:1941:		weakContent: asArray(insights.underperforming_content),
public/control-center/pages/ai-command.js:1942:		website: asObject(insights.website),
public/control-center/pages/ai-command.js:1943:		seo: asObject(insights.seo),
public/control-center/pages/ai-command.js:1944:		paid: asObject(insights.paid),
public/control-center/pages/ai-command.js:1945:		social: asObject(insights.social),
public/control-center/pages/ai-command.js:1946:		learningPatterns: asObject(learning.learning_patterns || insights.learning_patterns),
public/control-center/pages/ai-command.js:1947:		aiRecommendations: asObject(learning.ai_recommendations || insights.ai_recommendations),
public/control-center/pages/ai-command.js:1948:		sourceSummary: asObject(insights.source_summary || learning.source_summary),
public/control-center/pages/ai-command.js:1950:			Boolean(Object.keys(insights).length) ||
public/control-center/pages/ai-command.js:1965:		media: ["media", "design", "visual", "creative brief", "format", "brand", "layout", "image direction", "creative direction", "image", "video", "photo", "asset", "library", "gallery", "footage", "visual assets"],
public/control-center/pages/ai-command.js:1967:		analyst: ["seo", "keyword", "keywords", "query", "search", "meta", "blog topic", "search intent", "ranking", "analytics", "performance", "traffic", "insights", "metrics"],
public/control-center/pages/ai-command.js:2010:		notes.push("Load project insights to unlock live intelligence guidance.");
public/control-center/pages/ai-command.js:2013:	if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {
public/control-center/pages/ai-command.js:2033:		summary: summaryParts.join(" ") || "Project is loaded. Complete integrations to unlock stronger AI guidance.",
public/control-center/pages/ai-command.js:2036:			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.slice(0, 4).map((item) => item.label).join(", ")}.` : "Intelligence coverage is solid.",
public/control-center/pages/ai-command.js:2040:			topRecommendation ? `${topRecommendation.title}: ${topRecommendation.action}` : "Connect missing integrations to produce better recommendations.",
public/control-center/pages/ai-command.js:2048:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
public/control-center/pages/ai-command.js:2049:			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
public/control-center/pages/ai-command.js:2050:			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
public/control-center/pages/ai-command.js:2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
public/control-center/pages/ai-command.js:2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
public/control-center/pages/ai-command.js:2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
public/control-center/pages/ai-command.js:2085:			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
public/control-center/pages/ai-command.js:2119:			routeSuggestion("Insights", "insights", "Review search and website performance together."),
public/control-center/pages/ai-command.js:2120:			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
public/control-center/pages/ai-command.js:2121:			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
public/control-center/pages/ai-command.js:2154:			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
public/control-center/pages/ai-command.js:2155:			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
public/control-center/pages/ai-command.js:2156:			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
public/control-center/pages/ai-command.js:2167:			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.map((item) => item.label).join(", ")}.` : "Main intelligence lanes are structurally connected.",
public/control-center/pages/ai-command.js:2168:			aiContext.criticalGaps.length ? `Critical gaps affecting research quality: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No major setup gaps blocking research quality.",
public/control-center/pages/ai-command.js:2174:			"Prioritize integrations that unlock attribution and performance evidence over vanity metrics."
public/control-center/pages/ai-command.js:2177:			"Review Setup and tighten goals, audience, competitor, and market assumptions.",
public/control-center/pages/ai-command.js:2179:			"Use Insights to identify where the recommendation stack is still blind."
public/control-center/pages/ai-command.js:2182:			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
public/control-center/pages/ai-command.js:2183:			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
public/control-center/pages/ai-command.js:2184:			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
public/control-center/pages/ai-command.js:2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
public/control-center/pages/ai-command.js:2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
public/control-center/pages/ai-command.js:2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
public/control-center/pages/ai-command.js:2205:	if (/reconnect|missing tools|missing integrations/.test(query)) {
public/control-center/pages/ai-command.js:2206:		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
public/control-center/pages/ai-command.js:2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and review the first step in the owning workspace."] };
public/control-center/pages/ai-command.js:2215:	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
public/control-center/pages/ai-command.js:2217:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
public/control-center/pages/ai-command.js:2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
public/control-center/pages/ai-command.js:2220:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
public/control-center/pages/ai-command.js:2221:	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
public/control-center/pages/ai-command.js:2222:	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
public/control-center/pages/ai-command.js:2228:			aiContext.missingIntegrations.length ? "Intelligence coverage gaps may reduce execution quality." : "Core intelligence is available for routing."
public/control-center/pages/ai-command.js:2272:	fetchProjectInsights,
public/control-center/pages/ai-command.js:2286:	const needsDashboard = !state.data.overview || !state.data.readiness || !state.data.integrations || !state.data.activity;
public/control-center/pages/ai-command.js:2296:				const [insightsResult, learningResult] = await Promise.allSettled([
public/control-center/pages/ai-command.js:2297:					fetchProjectInsights(projectName),
public/control-center/pages/ai-command.js:2300:				const insightsMissing = insightsResult.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
public/control-center/pages/ai-command.js:2303:					insightsResult.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
public/control-center/pages/ai-command.js:2310:					insights: insightsResult.status === "fulfilled" ? insightsResult.value : (insightsMissing ? { project: projectName, generated_at: nowIso(), data_coverage: {} } : null),
public/control-center/pages/ai-command.js:2345:	"content-studio": "Content Studio",
public/control-center/pages/ai-command.js:2346:	"media-studio": "Media Studio",
public/control-center/pages/ai-command.js:2347:	publishing: "Publishing",
public/control-center/pages/ai-command.js:2348:	"campaign-studio": "Campaign Studio",
public/control-center/pages/ai-command.js:2349:	workflows: "Workflows",
public/control-center/pages/ai-command.js:2350:	library: "Library",
public/control-center/pages/ai-command.js:2351:	insights: "Insights",
public/control-center/pages/ai-command.js:2352:	integrations: "Integrations",
public/control-center/pages/ai-command.js:2353:	settings: "Settings",
public/control-center/pages/ai-command.js:2354:	governance: "Governance",
public/control-center/pages/ai-command.js:2355:	"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:2356:	"task-center": "Task Center",
public/control-center/pages/ai-command.js:2357:	"queue-center": "Queue Center",
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2361:	"ads-manager": "Ads Manager",
public/control-center/pages/ai-command.js:2362:	setup: "Setup",
public/control-center/pages/ai-command.js:2367:	"content-studio": "writer",
public/control-center/pages/ai-command.js:2368:	"media-studio": "media",
public/control-center/pages/ai-command.js:2369:	publishing: "publisher",
public/control-center/pages/ai-command.js:2370:	"campaign-studio": "strategist",
public/control-center/pages/ai-command.js:2371:	workflows: "operations",
public/control-center/pages/ai-command.js:2372:	library: "media",
public/control-center/pages/ai-command.js:2373:	insights: "seo",
public/control-center/pages/ai-command.js:2374:	integrations: "operations",
public/control-center/pages/ai-command.js:2375:	settings: "operations",
public/control-center/pages/ai-command.js:2376:	governance: "compliance_reviewer",
public/control-center/pages/ai-command.js:2377:	"operations-centers": "operations",
public/control-center/pages/ai-command.js:2378:	"task-center": "operations",
public/control-center/pages/ai-command.js:2379:	"queue-center": "operations",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2383:	"ads-manager": "ads",
public/control-center/pages/ai-command.js:2384:	setup: "operations",
public/control-center/pages/ai-command.js:2399:	content: "content-studio",
public/control-center/pages/ai-command.js:2400:	"content-studio-workspace": "content-studio",
public/control-center/pages/ai-command.js:2401:	media: "media-studio",
public/control-center/pages/ai-command.js:2402:	"media-studio-workspace": "media-studio",
public/control-center/pages/ai-command.js:2403:	publish: "publishing",
public/control-center/pages/ai-command.js:2404:	publisher: "publishing",
public/control-center/pages/ai-command.js:2405:	campaign: "campaign-studio",
public/control-center/pages/ai-command.js:2406:	campaigns: "campaign-studio",
public/control-center/pages/ai-command.js:2407:	workflow: "workflows",
public/control-center/pages/ai-command.js:2408:	asset: "library",
public/control-center/pages/ai-command.js:2409:	"asset-library": "library",
public/control-center/pages/ai-command.js:2410:	operation: "operations-centers",
public/control-center/pages/ai-command.js:2411:	operations: "operations-centers",
public/control-center/pages/ai-command.js:2412:	tasks: "task-center",
public/control-center/pages/ai-command.js:2413:	queue: "queue-center",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/ai-command.js:2416:	integration: "integrations",
public/control-center/pages/ai-command.js:2417:	govern: "governance",
public/control-center/pages/ai-command.js:2418:	home: "workspace"
public/control-center/pages/ai-command.js:2477:	const fallbackRoute = sourcePage === "workspace" ? "workflows" : sourcePage;
public/control-center/pages/ai-command.js:2506:		"workflows"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2638:	const handoff = getSharedHandoff(projectName, "ai-command", operations);
public/control-center/pages/ai-command.js:3407:			reason: `${aiContext.criticalGaps.length} critical setup gap${aiContext.criticalGaps.length === 1 ? "" : "s"} can block launch quality and downstream automation reliability.`,
public/control-center/pages/ai-command.js:3422:	if (aiContext.missingIntegrations.length || aiContext.connectorIssues.length) {
public/control-center/pages/ai-command.js:3423:		const impacted = aiContext.missingIntegrations.length + aiContext.connectorIssues.length;
public/control-center/pages/ai-command.js:3428:			chips: buildImpactChips(["Integrations", "Automation", "Launch readiness"])
public/control-center/pages/ai-command.js:3554:	if (tool.route) return asString(tool.route || "workflows");
public/control-center/pages/ai-command.js:3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:3570:	if (/review|check|compliance|readiness|governance/i.test(asString(tool.label))) return "Review";
public/control-center/pages/ai-command.js:3628:				<button id="aicmdV2SettingsBtn" class="aicmd-v2-btn-ghost" type="button" title="Settings">⚙️</button>
public/control-center/pages/ai-command.js:3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3796:        if (roleId === "seo") return `${label} is reviewing insights and signals...`;
public/control-center/pages/ai-command.js:3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3844:	const preferred = destinations.find((item) => !["chat-preview", "composer", "preview", "ai-command"].includes(asString(item)));
public/control-center/pages/ai-command.js:3953:			<span class="aicmd-v2-lang-chip" title="Publishing language">📝 ${escapeHtml(languagePlan.publishLanguage)}</span>
public/control-center/pages/ai-command.js:4064:		: destination === "Publishing"
public/control-center/pages/ai-command.js:4065:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4147:		: destination === "Publishing"
public/control-center/pages/ai-command.js:4148:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4249:	const integrations = aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal}` : "0 active";
public/control-center/pages/ai-command.js:4258:			<div><span>Active integrations</span><strong>${escapeHtml(integrations)}</strong></div>
public/control-center/pages/ai-command.js:4267:		? "Configured in integrations"
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4414:                                                <span>Home handoff</span>
public/control-center/pages/ai-command.js:4415:                                                <strong>${escapeHtml("Specialist context loaded from Home: " + bridgeContext.specialistLabel)}</strong>
public/control-center/pages/ai-command.js:4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
public/control-center/pages/ai-command.js:4548:		{ label: "Integrations", value: aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal} connected` : "No coverage data", present: aiContext.coveredCount > 0 },
public/control-center/pages/ai-command.js:4558:			{ label: "Channels", value: "Managed in Integrations", present: true, scoped: true }
public/control-center/pages/ai-command.js:4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
public/control-center/pages/ai-command.js:4661:	id: "ai-command",
public/control-center/pages/ai-command.js:4669:		<section class="page is-active" data-page="ai-command">
public/control-center/pages/ai-command.js:4682:			fetchProjectInsights,
public/control-center/pages/ai-command.js:4711:		// ── HOME → AI COMMAND BRIDGE ────────────────────────────────
public/control-center/pages/ai-command.js:4712:		// Consume prompt set by home.js handleAiRoleClick via quickCommandInput.
public/control-center/pages/ai-command.js:4722:					source: "Home",
public/control-center/pages/ai-command.js:4731:			persistSessionDraft(sessionKey, session, detectedSpecialist ? "Specialist context loaded from Home" : "AI prompt loaded from workspace");
public/control-center/pages/ai-command.js:4885:		const settingsBtn = $("aicmdV2SettingsBtn");
public/control-center/pages/ai-command.js:4886:		if (settingsBtn) {
public/control-center/pages/ai-command.js:4887:			settingsBtn.onclick = () => {
public/control-center/pages/ai-command.js:4888:				showMessage?.("Opening Settings.");
public/control-center/pages/ai-command.js:4889:				navigateTo("settings");
public/control-center/pages/ai-command.js:5077:		                        source: "ai-command-chat"
public/control-center/pages/ai-command.js:5117:		                                source: "ai-command-specialist-chat",
public/control-center/pages/ai-command.js:5485:					source_page: "ai-command",
public/control-center/pages/ai-command.js:5574:					source_page: "ai-command",
public/control-center/pages/ai-command.js:5648:				fetchProjectInsights,
public/control-center/pages/library.js:5:  getSharedLibrarySourceBridge,
public/control-center/pages/library.js:6:  clearSharedLibrarySourceBridge,
public/control-center/pages/library.js:20:    source_label: asset.source_label || asset.name || "Library asset",
public/control-center/pages/library.js:27:// --- Library Source Bridge Guide Box ---
public/control-center/pages/library.js:30:import { renderLibraryActionPanel } from "./library/action-panel.js";
public/control-center/pages/library.js:31:import { renderLibraryAiPanel } from "./library/ai-panel.js";
public/control-center/pages/library.js:32:import { normalizeLibraryAsset } from "./library/projection-adapter.js";
public/control-center/pages/library.js:33:import { normalizeLibrarySession } from "./library/session-store.js";
public/control-center/pages/library.js:34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
public/control-center/pages/library.js:35:import { mountLibraryListeners } from "./library/listener-lifecycle.js";
public/control-center/pages/library.js:41:  refreshProjectLibrary,
public/control-center/pages/library.js:53:} from "../asset-library.js";
public/control-center/pages/library.js:55:const librarySessionStore = new Map();
public/control-center/pages/library.js:56:let librarySearchRenderTimer = null;
public/control-center/pages/library.js:57:const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
public/control-center/pages/library.js:58:const LIBRARY_UPLOAD_TYPE_LABELS = {
public/control-center/pages/library.js:74:function getLibraryUploadTypeLabel(assetType = "") {
public/control-center/pages/library.js:76:  return LIBRARY_UPLOAD_TYPE_LABELS[key] || titleCase(key || "asset");
public/control-center/pages/library.js:79:const libraryProtectedUrlCache = new Map();
public/control-center/pages/library.js:80:const LIBRARY_PAGE_SIZE = 10;
public/control-center/pages/library.js:81:const libraryProtectedUrlPromiseCache = new Map();
public/control-center/pages/library.js:82:let disposeLibraryGlobalListeners = null;
public/control-center/pages/library.js:83:let _libraryFeedback = null;
public/control-center/pages/library.js:84:const MAX_CONCURRENT_LIBRARY_THUMB_LOADS = 4;
public/control-center/pages/library.js:85:const LIBRARY_THUMB_BATCH_LIMIT = 18;
public/control-center/pages/library.js:86:let libraryThumbLoadsInFlight = 0;
public/control-center/pages/library.js:87:const libraryThumbLoadQueue = [];
public/control-center/pages/library.js:104:    why: "Logos keep brand identity consistent across setup, media generation, and publishing.",
public/control-center/pages/library.js:118:    why: "Product data anchors facts, variants, and claims for campaign and publishing.",
public/control-center/pages/library.js:151:const LIBRARY_FOLDERS = [
public/control-center/pages/library.js:179:function isLibraryInteractiveElement(target) {
public/control-center/pages/library.js:181:    "button, a, input, select, textarea, label, option, [role='button'], .library-action-menu, .library-action-dropdown, .library-drop-zone"
public/control-center/pages/library.js:185:function bindLibraryControlEventShield(scope) {
public/control-center/pages/library.js:209:    const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
public/control-center/pages/library.js:249:  if (!filePath) return "Library";
public/control-center/pages/library.js:252:  if (!parts.length) return "Library";
public/control-center/pages/library.js:345:function revokeLibraryProtectedUrl(key) {
public/control-center/pages/library.js:346:  const entry = libraryProtectedUrlCache.get(key);
public/control-center/pages/library.js:350:  libraryProtectedUrlCache.delete(key);
public/control-center/pages/library.js:353:function runNextLibraryThumbLoad() {
public/control-center/pages/library.js:354:  if (libraryThumbLoadsInFlight >= MAX_CONCURRENT_LIBRARY_THUMB_LOADS) {
public/control-center/pages/library.js:358:  const nextJob = libraryThumbLoadQueue.shift();
public/control-center/pages/library.js:363:  libraryThumbLoadsInFlight += 1;
public/control-center/pages/library.js:367:      libraryThumbLoadsInFlight = Math.max(0, libraryThumbLoadsInFlight - 1);
public/control-center/pages/library.js:368:      runNextLibraryThumbLoad();
public/control-center/pages/library.js:372:function enqueueLibraryThumbLoad(job) {
public/control-center/pages/library.js:374:    libraryThumbLoadQueue.push(async () => {
public/control-center/pages/library.js:382:    runNextLibraryThumbLoad();
public/control-center/pages/library.js:400:  const cached = libraryProtectedUrlCache.get(cacheKey);
public/control-center/pages/library.js:411:    revokeLibraryProtectedUrl(cacheKey);
public/control-center/pages/library.js:414:  const inFlight = libraryProtectedUrlPromiseCache.get(cacheKey);
public/control-center/pages/library.js:422:    libraryProtectedUrlCache.set(cacheKey, {
public/control-center/pages/library.js:436:  libraryProtectedUrlPromiseCache.set(cacheKey, loadPromise);
public/control-center/pages/library.js:441:    if (libraryProtectedUrlPromiseCache.get(cacheKey) === loadPromise) {
public/control-center/pages/library.js:442:      libraryProtectedUrlPromiseCache.delete(cacheKey);
public/control-center/pages/library.js:447:async function openLibraryAsset(projectName, asset) {
public/control-center/pages/library.js:476:function mountLibraryGlobalListeners() {
public/control-center/pages/library.js:477:  if (disposeLibraryGlobalListeners) {
public/control-center/pages/library.js:481:  disposeLibraryGlobalListeners = mountLibraryListeners({
public/control-center/pages/library.js:484:        Array.from(libraryProtectedUrlCache.keys()).forEach((key) => revokeLibraryProtectedUrl(key));
public/control-center/pages/library.js:489:          if (!button || !button.closest(".library-workspace")) return;
public/control-center/pages/library.js:498:            _libraryFeedback?.("Asset path copied.");
public/control-center/pages/library.js:504:          const link = event.target.closest?.("a.library-link-btn");
public/control-center/pages/library.js:505:          if (!link || !link.closest(".library-workspace")) return;
public/control-center/pages/library.js:513:          openLibraryAsset("", {
public/control-center/pages/library.js:525:          const root = event.target?.closest?.(".library-workspace");
public/control-center/pages/library.js:528:          if (event.target?.closest?.(".library-action-menu")) {
public/control-center/pages/library.js:532:          closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:539:function unmountLibraryGlobalListeners() {
public/control-center/pages/library.js:540:  if (!disposeLibraryGlobalListeners) {
public/control-center/pages/library.js:544:  const dispose = disposeLibraryGlobalListeners;
public/control-center/pages/library.js:545:  disposeLibraryGlobalListeners = null;
public/control-center/pages/library.js:550:function ensureLibrarySession(projectName) {
public/control-center/pages/library.js:552:  if (!librarySessionStore.has(key)) {
public/control-center/pages/library.js:553:    librarySessionStore.set(key, normalizeLibrarySession({
public/control-center/pages/library.js:570:  const current = librarySessionStore.get(key);
public/control-center/pages/library.js:571:  const normalized = normalizeLibrarySession(current);
public/control-center/pages/library.js:573:    librarySessionStore.set(key, normalized);
public/control-center/pages/library.js:575:  return librarySessionStore.get(key);
public/control-center/pages/library.js:578:function dispatchLibraryCommand(command, payload = {}, handlers = {}) {
public/control-center/pages/library.js:579:  const envelope = createLibraryCommand(command, payload);
public/control-center/pages/library.js:580:  return routeLibraryCommand(envelope, handlers);
public/control-center/pages/library.js:583:function closeAllLibraryActionDropdowns() {
public/control-center/pages/library.js:584:  Array.from(document.querySelectorAll(".library-action-dropdown.is-open")).forEach((item) => {
public/control-center/pages/library.js:625:  if (normalized.includes("publishing_ready")) return "publishing_ready";
public/control-center/pages/library.js:626:  if (normalized.includes("sent_to_publishing")) return "sent_to_publishing";
public/control-center/pages/library.js:639:  if (value === "publishing_ready") return "Publishing Ready";
public/control-center/pages/library.js:640:  if (value === "sent_to_publishing") return "Sent to Publishing";
public/control-center/pages/library.js:651:  if (value === "publishing_ready" || value === "sent_to_publishing") return "success";
public/control-center/pages/library.js:731:    const projectionAsset = normalizeLibraryAsset({
public/control-center/pages/library.js:743:      kind: "library_asset",
public/control-center/pages/library.js:748:      source_label: asString(merged.source_label || merged.source || merged.scan_source || "Library"),
public/control-center/pages/library.js:749:      source_key: asString(merged.source_key || merged.source || merged.scan_source || "library").toLowerCase(),
public/control-center/pages/library.js:751:      used_in: asArray(merged.used_in || catalogItem.guidance?.used_in || ["Library"]),
public/control-center/pages/library.js:774:  if (["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status))) return "publishing_ready_asset";
public/control-center/pages/library.js:809:    used_in: asArray(asset.usage).length ? asArray(asset.usage) : ["Library", "Media Studio"],
public/control-center/pages/library.js:848:    .filter((item) => asString(item?.destination_page) === "library" && asString(item?.source_page) === "media-studio")
public/control-center/pages/library.js:851:      const libraryAsset = asObject(payload.library_asset);
public/control-center/pages/library.js:854:          ...libraryAsset,
public/control-center/pages/library.js:858:          status: libraryAsset.status || libraryAsset.readiness_status || item.status
public/control-center/pages/library.js:1002:    const folder = LIBRARY_FOLDERS.find((item) => item.key === selectedFolderKey);
public/control-center/pages/library.js:1024:      || (selectedSource === "media-studio" && asset.kind === "managed_media")
public/control-center/pages/library.js:1026:      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
public/control-center/pages/library.js:1049:  return LIBRARY_FOLDERS.map((folder) => {
public/control-center/pages/library.js:1119:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1120:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1126:      <div class="library-preview-frame">
public/control-center/pages/library.js:1127:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1135:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1136:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1142:      <div class="library-preview-frame">
public/control-center/pages/library.js:1143:        <video class="library-preview-video" controls src="${escapeHtml(asString(asset.video_url || previewUrl))}"></video>
public/control-center/pages/library.js:1150:      <div class="library-preview-frame">
public/control-center/pages/library.js:1151:        <audio class="library-preview-audio" controls src="${escapeHtml(asString(asset.audio_url || previewUrl))}"></audio>
public/control-center/pages/library.js:1159:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1160:          <div class="library-preview-fallback">Loading protected image preview...</div>
public/control-center/pages/library.js:1166:      <div class="library-preview-frame">
public/control-center/pages/library.js:1167:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1175:        <div class="library-preview-frame" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1176:          <div class="library-preview-fallback">Loading protected video preview...</div>
public/control-center/pages/library.js:1182:      <div class="library-preview-frame">
public/control-center/pages/library.js:1183:        <video class="library-preview-video" controls src="${escapeHtml(previewUrl)}"></video>
public/control-center/pages/library.js:1195:      ? `<button class="btn btn-primary" type="button" data-library-open="${escapeHtml(asset.id)}">Open document</button>`
public/control-center/pages/library.js:1200:        <div class="library-pdf-preview">
public/control-center/pages/library.js:1208:        <div class="library-preview-fallback library-document-preview" data-library-protected-preview data-preview-asset-id="${escapeHtml(asset.id || asset.asset_id || "")}">
public/control-center/pages/library.js:1209:          <div class="library-preview-extension">PDF</div>
public/control-center/pages/library.js:1211:          <div class="library-preview-copy">Loading protected PDF preview...</div>
public/control-center/pages/library.js:1217:      <div class="library-preview-fallback library-document-preview">
public/control-center/pages/library.js:1218:        <div class="library-preview-extension">${escapeHtml((previewExtension || "doc").toUpperCase())}</div>
public/control-center/pages/library.js:1220:        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
public/control-center/pages/library.js:1221:        <div class="library-document-preview-actions">
public/control-center/pages/library.js:1223:          <button class="btn btn-secondary" type="button" id="libraryAiExtractSelectedDocBtn">Extract with AI</button>
public/control-center/pages/library.js:1231:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(asset.text_preview)}</div>`;
public/control-center/pages/library.js:1236:    return `<div class="library-preview-fallback library-preview-text-fallback">${escapeHtml(jsonFallback)}</div>`;
public/control-center/pages/library.js:1240:    <div class="library-preview-fallback">
public/control-center/pages/library.js:1241:      <div class="library-preview-extension">${escapeHtml((asset.extension || "file").toUpperCase())}</div>
public/control-center/pages/library.js:1242:      <div class="library-preview-copy">Preview not available for this file type.</div>
public/control-center/pages/library.js:1274:      previewNode.innerHTML = `<img src="${escapeHtml(resolved.objectUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image">`;
public/control-center/pages/library.js:1279:      previewNode.innerHTML = `<video class="library-preview-video" controls src="${escapeHtml(resolved.objectUrl)}"></video>`;
public/control-center/pages/library.js:1285:        <div class="library-pdf-preview">
public/control-center/pages/library.js:1299:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
public/control-center/pages/library.js:1319:    const resolved = await enqueueLibraryThumbLoad(() => getProtectedAssetObjectUrl(projectName, asset, {
public/control-center/pages/library.js:1347:function protectLibraryInteractiveControls(scope) {
public/control-center/pages/library.js:1371:    return `Classify the current library assets for ${project}, propose best category keys, and flag items that should be source-of-truth.`;
public/control-center/pages/library.js:1378:  return `Extract key facts from these library documents for ${project}: ${docs}. Return compliance notes, pricing references, and campaign-usable claims.`;
public/control-center/pages/library.js:1487:function bindLibraryWorkspace({
public/control-center/pages/library.js:1503:  _libraryFeedback = showMessage;
public/control-center/pages/library.js:1507:    bindLibraryWorkspace({
public/control-center/pages/library.js:1549:  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / LIBRARY_PAGE_SIZE));
public/control-center/pages/library.js:1551:  const pageStart = (session.page - 1) * LIBRARY_PAGE_SIZE;
public/control-center/pages/library.js:1552:  const paginatedAssets = filteredAssets.slice(pageStart, pageStart + LIBRARY_PAGE_SIZE);
public/control-center/pages/library.js:1593:    { value: "media-studio", label: "Media Studio" },
public/control-center/pages/library.js:1595:    { value: "publishing-ready", label: "Publishing Ready" }
public/control-center/pages/library.js:1600:  // --- Library Explainer/Onboarding Block ---
public/control-center/pages/library.js:1601:  const explainerBox = $("libraryExplainerBox");
public/control-center/pages/library.js:1604:      <section class="library-explainer" aria-label="Library source-of-truth workspace explainer">
public/control-center/pages/library.js:1605:        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
public/control-center/pages/library.js:1606:        <ol class="library-explainer-steps">
public/control-center/pages/library.js:1609:          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
public/control-center/pages/library.js:1616:  const taxonomyBox = $("libraryTaxonomyBox");
public/control-center/pages/library.js:1619:      <div class="library-taxonomy-chips" aria-label="Library taxonomy">
public/control-center/pages/library.js:1634:  const requiredBox = $("libraryRequiredAssetsGrid");
public/control-center/pages/library.js:1643:        <article class="library-required-card">
public/control-center/pages/library.js:1644:          <div class="library-required-card-head">
public/control-center/pages/library.js:1648:          <p class="library-required-why">${escapeHtml(reasonHint)}</p>
public/control-center/pages/library.js:1649:          <div class="library-required-card-foot">
public/control-center/pages/library.js:1654:              data-library-required-action="${escapeHtml(item.action)}"
public/control-center/pages/library.js:1655:              data-library-required-key="${escapeHtml(item.key)}"
public/control-center/pages/library.js:1656:              data-library-upload-type="${escapeHtml(item.uploadType)}"
public/control-center/pages/library.js:1664:  const typeSelect = $("libraryFilterTypeSelect");
public/control-center/pages/library.js:1673:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:1682:      bindLibraryWorkspace({
public/control-center/pages/library.js:1700:  const statusSelect = $("libraryFilterStatusSelect");
public/control-center/pages/library.js:1704:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:1713:      bindLibraryWorkspace({
public/control-center/pages/library.js:1731:  const sourceSelect = $("libraryFilterSourceSelect");
public/control-center/pages/library.js:1740:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:1749:      bindLibraryWorkspace({
public/control-center/pages/library.js:1767:  const sortSelect = $("librarySortSelect");
public/control-center/pages/library.js:1771:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:1780:      bindLibraryWorkspace({
public/control-center/pages/library.js:1798:  const gridBody = $("libraryAssetGridBody");
public/control-center/pages/library.js:1809:            ? `<div class="library-grid-thumb-shell" data-library-protected-thumb="${escapeHtml(asset.id)}"><div class="library-grid-icon">IMG</div></div>`
public/control-center/pages/library.js:1810:            : `<img class="library-grid-thumb" src="${escapeHtml(assetPreviewUrl)}" alt="${escapeHtml(asset.name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'library-grid-icon', textContent: '${escapeHtml((asset.extension || "file").toUpperCase())}' }))">`
public/control-center/pages/library.js:1811:          : `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`;
public/control-center/pages/library.js:1815:          <article class="library-grid-card${isSelected ? " is-active" : ""}" data-library-grid-select="${escapeHtml(asset.id)}" tabindex="0" aria-label="Select ${escapeHtml(asset.name)}" aria-selected="${isSelected ? "true" : "false"}">
public/control-center/pages/library.js:1816:            <div class="library-grid-preview">${previewNode}</div>
public/control-center/pages/library.js:1817:            <div class="library-grid-title" title="${escapeHtml(asset.name)}">${escapeHtml(titleName)}</div>
public/control-center/pages/library.js:1818:            <div class="library-grid-meta" title="${escapeHtml(asset.filename || "-")}">${escapeHtml(fileName)}</div>
public/control-center/pages/library.js:1819:            <div class="library-grid-foot">
public/control-center/pages/library.js:1821:              <span class="library-grid-type">${escapeHtml(asset.asset_type)}</span>
public/control-center/pages/library.js:1829:  const gridPagination = $("libraryGridPagination");
public/control-center/pages/library.js:1835:      <div class="library-grid-page-info">Showing ${escapeHtml(String(showingStart))}-${escapeHtml(String(showingEnd))} of ${escapeHtml(String(filteredAssets.length))}</div>
public/control-center/pages/library.js:1836:      <div class="library-grid-page-actions">
public/control-center/pages/library.js:1837:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="prev"${session.page <= 1 ? " disabled" : ""}>Previous</button>
public/control-center/pages/library.js:1839:        <button class="btn btn-secondary btn-sm" type="button" data-library-grid-page="next"${session.page >= totalPages ? " disabled" : ""}>Next</button>
public/control-center/pages/library.js:1844:  const protectedThumbNodes = Array.from(document.querySelectorAll("[data-library-protected-thumb]"));
public/control-center/pages/library.js:1847:      const leftId = left.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1848:      const rightId = right.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1853:    .slice(0, LIBRARY_THUMB_BATCH_LIMIT);
public/control-center/pages/library.js:1856:    const assetId = node.getAttribute("data-library-protected-thumb") || "";
public/control-center/pages/library.js:1864:      className: "library-grid-thumb",
public/control-center/pages/library.js:1866:      fallbackMarkup: `<div class="library-grid-icon">${escapeHtml((asset.extension || "file").toUpperCase())}</div>`,
public/control-center/pages/library.js:1871:  const previewVisual = $("libraryPreviewVisual");
public/control-center/pages/library.js:1875:    const protectedPreviewNode = previewVisual.querySelector("[data-library-protected-preview]");
public/control-center/pages/library.js:1887:  const previewMeta = $("libraryPreviewMeta");
public/control-center/pages/library.js:1891:        <div class="library-inspector-title">
public/control-center/pages/library.js:1896:        <div class="library-inspector-quick">
public/control-center/pages/library.js:1902:        <div class="library-inspector-path">${escapeHtml(assetContextHint(selectedAsset))}</div>
public/control-center/pages/library.js:1904:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Review Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Review Source in AI Command</button>
public/control-center/pages/library.js:1906:        <div class="library-inspector-ai-source-guide${getSharedLibrarySourceBridge(projectName) ? "" : " is-hidden"}" aria-live="polite">
public/control-center/pages/library.js:1907:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.</span>
public/control-center/pages/library.js:1910:        <details class="library-inspector-more">
public/control-center/pages/library.js:1917:            <div class="data-row"><span>Source</span><strong>${escapeHtml(selectedAsset.source_label || "Library")}</strong></div>
public/control-center/pages/library.js:1925:    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
public/control-center/pages/library.js:1928:      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
public/control-center/pages/library.js:1948:        const bridgeReturn = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:1954:        clearSharedLibrarySourceBridge(sourceProjectName);
public/control-center/pages/library.js:1955:        clearSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:1957:        navigateTo("ai-command");
public/control-center/pages/library.js:1962:  const actionPanelMount = $("libraryActionPanelMount");
public/control-center/pages/library.js:1964:    actionPanelMount.innerHTML = renderLibraryActionPanel({
public/control-center/pages/library.js:1970:  const aiPanelMount = $("libraryAiPanelMount");
public/control-center/pages/library.js:1972:    aiPanelMount.innerHTML = renderLibraryAiPanel({
public/control-center/pages/library.js:1979:  const activityBox = $("libraryRecentActivity");
public/control-center/pages/library.js:1995:  const uploadSummary = $("libraryUploadSummary");
public/control-center/pages/library.js:2008:      : `<div class="empty-box">No uploads in this session yet. Choose files and upload them to start building the asset library.</div>`;
public/control-center/pages/library.js:2011:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
public/control-center/pages/library.js:2014:      const action = button.getAttribute("data-library-required-action") || "review";
public/control-center/pages/library.js:2015:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
public/control-center/pages/library.js:2016:      const requiredKey = button.getAttribute("data-library-required-key") || "";
public/control-center/pages/library.js:2020:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2025:      for (const folder of LIBRARY_FOLDERS) {
public/control-center/pages/library.js:2038:          const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
public/control-center/pages/library.js:2045:        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
public/control-center/pages/library.js:2046:        bindLibraryWorkspace({
public/control-center/pages/library.js:2063:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
public/control-center/pages/library.js:2067:        const uploadInput = $("libraryUploadInput");
public/control-center/pages/library.js:2074:        bindLibraryWorkspace({
public/control-center/pages/library.js:2094:      navigateTo("ai-command");
public/control-center/pages/library.js:2099:  const selectButtons = Array.from(document.querySelectorAll("[data-library-select]"));
public/control-center/pages/library.js:2104:      dispatchLibraryCommand("select-asset", {
public/control-center/pages/library.js:2105:        assetId: button.getAttribute("data-library-select") || ""
public/control-center/pages/library.js:2111:      const selectedId = button.getAttribute("data-library-select") || "";
public/control-center/pages/library.js:2114:      bindLibraryWorkspace({
public/control-center/pages/library.js:2132:  const selectableRows = Array.from(document.querySelectorAll("[data-library-row-select]"));
public/control-center/pages/library.js:2135:      if (isLibraryInteractiveElement(event.target)) {
public/control-center/pages/library.js:2139:      const nextId = row.getAttribute("data-library-row-select") || "";
public/control-center/pages/library.js:2142:      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
public/control-center/pages/library.js:2149:      bindLibraryWorkspace({
public/control-center/pages/library.js:2169:      const nextId = row.getAttribute("data-library-row-select") || "";
public/control-center/pages/library.js:2171:      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
public/control-center/pages/library.js:2178:      bindLibraryWorkspace({
public/control-center/pages/library.js:2196:  const selectableCards = Array.from(document.querySelectorAll("[data-library-grid-select]"));
public/control-center/pages/library.js:2199:      if (isLibraryInteractiveElement(event.target)) return;
public/control-center/pages/library.js:2200:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2202:      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
public/control-center/pages/library.js:2215:      const nextId = card.getAttribute("data-library-grid-select") || "";
public/control-center/pages/library.js:2217:      dispatchLibraryCommand("select-asset", { assetId: nextId }, {
public/control-center/pages/library.js:2228:  const folderButtons = Array.from(document.querySelectorAll("[data-library-folder-select]"));
public/control-center/pages/library.js:2231:      const folderKey = button.getAttribute("data-library-folder-select") || "all_assets";
public/control-center/pages/library.js:2233:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:2251:  const viewToggleButtons = Array.from(document.querySelectorAll("[data-library-view-mode]"));
public/control-center/pages/library.js:2254:    const mode = button.getAttribute("data-library-view-mode") || "grid";
public/control-center/pages/library.js:2256:    dispatchLibraryCommand("set-view-mode", {
public/control-center/pages/library.js:2269:  const finderWorkspace = $("libraryFinderWorkspace");
public/control-center/pages/library.js:2271:    finderWorkspace.setAttribute("data-library-view-mode", session.viewMode === "grid" ? "grid" : "list");
public/control-center/pages/library.js:2272:    protectLibraryInteractiveControls(finderWorkspace);
public/control-center/pages/library.js:2275:  const toolbarUpload = $("libraryToolbarUploadBtn");
public/control-center/pages/library.js:2277:    toolbarUpload.onclick = () => $("libraryUploadInput")?.click();
public/control-center/pages/library.js:2280:  const openButtons = Array.from(document.querySelectorAll("[data-library-open]"));
public/control-center/pages/library.js:2283:      const id = button.getAttribute("data-library-open") || "";
public/control-center/pages/library.js:2284:      dispatchLibraryCommand("open-preview", { assetId: id }, {
public/control-center/pages/library.js:2298:        await openLibraryAsset(projectName, asset);
public/control-center/pages/library.js:2308:  const sourceOfTruthButtons = Array.from(document.querySelectorAll("[data-library-source-truth]"));
public/control-center/pages/library.js:2311:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2318:      const assetId = button.getAttribute("data-library-source-truth") || "";
public/control-center/pages/library.js:2342:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2350:      const id = button.getAttribute("data-library-asset") || "";
public/control-center/pages/library.js:2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
public/control-center/pages/library.js:2365:        await updateProjectAssetStatus(activeProjectName, assetId, status, `Status changed to ${status} from Control Center Library.`);
public/control-center/pages/library.js:2378:  const archiveButtons = Array.from(document.querySelectorAll("[data-library-archive]"));
public/control-center/pages/library.js:2381:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2388:      const id = button.getAttribute("data-library-archive") || "";
public/control-center/pages/library.js:2397:      if (!confirm(`Confirm archive action\n\nAction: Archive this asset.\nRisk: The asset is removed from active Library views but remains in the registry. This does not delete the physical file.\n\nSelect Cancel to keep this asset active.`)) {
public/control-center/pages/library.js:2402:        await archiveProjectAsset(activeProjectName, assetId, "Archived from Control Center Library.");
public/control-center/pages/library.js:2412:  const renameButtons = Array.from(document.querySelectorAll("[data-library-rename]"));
public/control-center/pages/library.js:2415:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2422:      const id = button.getAttribute("data-library-rename") || "";
public/control-center/pages/library.js:2453:  const deleteButtons = Array.from(document.querySelectorAll("[data-library-delete]"));
public/control-center/pages/library.js:2456:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2463:      const id = button.getAttribute("data-library-delete") || "";
public/control-center/pages/library.js:2472:      if (!confirm(`Confirm soft-delete action\n\nAction: Soft-delete this asset from active views.\nRisk: This applies a registry-level soft delete and removes the asset from active Library flows. This action does not silently publish, approve, or run workflows.\n\nSelect Cancel to keep this asset available.`)) {
public/control-center/pages/library.js:2477:        await deleteProjectAsset(activeProjectName, assetId, "Soft deleted from Control Center Library.");
public/control-center/pages/library.js:2489:  const actionToggleButtons = Array.from(document.querySelectorAll(".library-action-toggle"));
public/control-center/pages/library.js:2495:      const menu = button.closest(".library-action-menu");
public/control-center/pages/library.js:2496:      const dropdown = menu?.querySelector(".library-action-dropdown");
public/control-center/pages/library.js:2500:      closeAllLibraryActionDropdowns();
public/control-center/pages/library.js:2509:  const pickUploadTypeButtons = Array.from(document.querySelectorAll("[data-library-upload-type]"));
public/control-center/pages/library.js:2512:      const uploadType = button.getAttribute("data-library-upload-type") || "logo";
public/control-center/pages/library.js:2514:      const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2522:  const gridPageButtons = Array.from(document.querySelectorAll("[data-library-grid-page]"));
public/control-center/pages/library.js:2528:      const action = button.getAttribute("data-library-grid-page");
public/control-center/pages/library.js:2535:      dispatchLibraryCommand("set-page", { page: nextPage }, {
public/control-center/pages/library.js:2545:  const searchInput = $("librarySearchInput");
public/control-center/pages/library.js:2549:      dispatchLibraryCommand("set-filter", {
public/control-center/pages/library.js:2559:      if (librarySearchRenderTimer) {
public/control-center/pages/library.js:2560:        window.clearTimeout(librarySearchRenderTimer);
public/control-center/pages/library.js:2563:      librarySearchRenderTimer = window.setTimeout(() => {
public/control-center/pages/library.js:2569:  const uploadTypeSelect = $("libraryUploadTypeSelect");
public/control-center/pages/library.js:2574:      const label = getLibraryUploadTypeLabel(assetType);
public/control-center/pages/library.js:2581:      dispatchLibraryCommand("upload-type-change", { uploadType }, {
public/control-center/pages/library.js:2592:  const dropZone = $("libraryDropZone");
public/control-center/pages/library.js:2593:  const uploadInput = $("libraryUploadInput");
public/control-center/pages/library.js:2594:  const uploadBtn = $("libraryUploadBtn");
public/control-center/pages/library.js:2601:      const info = $("libraryDropInfo");
public/control-center/pages/library.js:2606:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2623:      openLibraryFilePicker();
public/control-center/pages/library.js:2641:    if (!dropZone.dataset.libraryDndBound) {
public/control-center/pages/library.js:2662:      dropZone.dataset.libraryDndBound = "1";
public/control-center/pages/library.js:2665:    const openLibraryFilePicker = () => {
public/control-center/pages/library.js:2686:    const chooseFilesBtn = $("libraryChooseFilesBtn");
public/control-center/pages/library.js:2691:        openLibraryFilePicker();
public/control-center/pages/library.js:2699:    uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2700:    uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2711:      const files = Array.from($("libraryUploadInput")?.files || []);
public/control-center/pages/library.js:2719:        assetType = getUploadAssetType(session, catalog, $("libraryUploadTypeSelect")?.value);
public/control-center/pages/library.js:2730:      bindLibraryWorkspace({
public/control-center/pages/library.js:2774:        const input = $("libraryUploadInput");
public/control-center/pages/library.js:2776:        const dropInfo = $("libraryDropInfo");
public/control-center/pages/library.js:2778:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2779:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2790:        uploadBtn.disabled = session.uploading || !Array.from($("libraryUploadInput")?.files || []).length;
public/control-center/pages/library.js:2791:        uploadBtn.textContent = session.uploading ? "Uploading to Library..." : "Upload asset to Library";
public/control-center/pages/library.js:2799:  const refreshBtn = $("libraryRefreshScanBtn");
public/control-center/pages/library.js:2808:        await refreshProjectLibrary(projectName);
public/control-center/pages/library.js:2810:        showMessage?.("Library backend scan refreshed.");
public/control-center/pages/library.js:2812:        showError?.(error.message || "Failed to refresh library scan.");
public/control-center/pages/library.js:2819:  const classifyBtn = $("libraryAiClassifyBtn");
public/control-center/pages/library.js:2824:      navigateTo("ai-command");
public/control-center/pages/library.js:2829:  const missingBtn = $("libraryAiMissingBtn");
public/control-center/pages/library.js:2834:      navigateTo("ai-command");
public/control-center/pages/library.js:2839:  const extractSelectedDocBtn = $("libraryAiExtractSelectedDocBtn");
public/control-center/pages/library.js:2849:      navigateTo("ai-command");
public/control-center/pages/library.js:2854:  const extractBtn = $("libraryAiExtractBtn");
public/control-center/pages/library.js:2863:      navigateTo("ai-command");
public/control-center/pages/library.js:2868:  const sendToAiBtn = document.querySelector("[data-library-command=\"send-to-ai\"]");
public/control-center/pages/library.js:2879:      navigateTo("ai-command");
public/control-center/pages/library.js:2884:export const libraryRoute = {
public/control-center/pages/library.js:2885:  id: "library",
public/control-center/pages/library.js:2889:    title: "Library",
public/control-center/pages/library.js:2890:    description: "Smart Asset Library"
public/control-center/pages/library.js:2893:    <section class="page is-active" data-page="library">
public/control-center/pages/library.js:2894:      <div id="libraryRoot"></div>
public/control-center/pages/library.js:2909:    // --- Library Source Bridge Contextual Guide Strip ---
public/control-center/pages/library.js:2911:    const activeSourceBridge = getSharedLibrarySourceBridge(activeProjectName) || getSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:2912:    const activeSourceMapping = activeSourceBridge?.type === "library_source_selection"
public/control-center/pages/library.js:2919:            "Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.",
public/control-center/pages/library.js:2923:            { id: "back-to-ai-command", label: "Back to Drawer" },
public/control-center/pages/library.js:2932:      const guideBox = document.getElementById("librarySourceBridgeGuideBox");
public/control-center/pages/library.js:2934:        const backBtn = guideBox.querySelector('[data-guide-action="back-to-ai-command"]');
public/control-center/pages/library.js:2939:            clearSharedLibrarySourceBridge(guideProjectName);
public/control-center/pages/library.js:2940:            clearSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:2941:            navigateTo("ai-command");
public/control-center/pages/library.js:2947:            clearSharedLibrarySourceBridge(guideProjectName);
public/control-center/pages/library.js:2948:            clearSharedLibrarySourceBridge("__default__");
public/control-center/pages/library.js:2956:      if (activeSourceBridge && activeSourceBridge.type === "library_source_selection") {
public/control-center/pages/library.js:2957:        const assetWorkspace = document.getElementById("libraryAssetWorkspace") || document.querySelector('[data-library-section="asset-workspace"]');
public/control-center/pages/library.js:2975:    const session = ensureLibrarySession(projectName);
public/control-center/pages/library.js:2996:    const root = $("libraryRoot");
public/control-center/pages/library.js:2999:    mountLibraryGlobalListeners();
public/control-center/pages/library.js:3002:      <div class="library-smart-shell">
public/control-center/pages/library.js:3006:              <div class="setup-kicker">Asset Control System</div>
public/control-center/pages/library.js:3008:              <p class="setup-helper">
public/control-center/pages/library.js:3012:            <button id="libraryRefreshScanBtn" class="btn btn-secondary" type="button">Refresh Library scan</button>
public/control-center/pages/library.js:3014:          <div id="libraryOverviewCards" class="library-overview-grid"></div>
public/control-center/pages/library.js:3023:          <div id="libraryRequiredAssetsGrid" class="library-required-grid"></div>
public/control-center/pages/library.js:3026:        <section class="card library-actions-card">
public/control-center/pages/library.js:3029:            <p class="card-subtitle">Upload or register asset candidates. Approval, source-of-truth status, and publishing readiness remain separate steps.</p>
public/control-center/pages/library.js:3030:            <div class="library-action-toolbar">
public/control-center/pages/library.js:3031:              <button id="libraryAiClassifyBtn" class="btn btn-secondary" type="button">Classify Assets</button>
public/control-center/pages/library.js:3032:              <button id="libraryAiMissingBtn" class="btn btn-secondary" type="button">Review Missing</button>
public/control-center/pages/library.js:3033:              <button id="libraryAiExtractBtn" class="btn btn-secondary" type="button">Extract Docs</button>
public/control-center/pages/library.js:3036:          <div class="library-upload-grid">
public/control-center/pages/library.js:3037:            <div id="libraryDropZone" class="library-drop-zone" role="button" tabindex="0">
public/control-center/pages/library.js:3038:              <strong>Upload asset to Library</strong>
public/control-center/pages/library.js:3040:              <small id="libraryDropInfo">No files selected</small>
public/control-center/pages/library.js:3041:              <button id="libraryChooseFilesBtn" class="btn btn-secondary btn-sm" type="button">Choose Files</button>
public/control-center/pages/library.js:3042:              <input id="libraryUploadInput" class="library-file-input" type="file" multiple>
public/control-center/pages/library.js:3044:            <div class="library-upload-controls">
public/control-center/pages/library.js:3045:              <label class="setup-label" for="libraryUploadTypeSelect">Classify upload as</label>
public/control-center/pages/library.js:3046:              <select id="libraryUploadTypeSelect" class="setup-input" aria-label="Upload asset type">
public/control-center/pages/library.js:3051:              <div class="setup-helper">Upload and classify for readiness in one step.</div>
public/control-center/pages/library.js:3052:              <button id="libraryUploadBtn" class="btn btn-primary" type="button">Upload asset to Library</button>
public/control-center/pages/library.js:3055:          <div id="libraryUploadSummary" class="library-upload-summary"></div>
public/control-center/pages/library.js:3058:        <section id="libraryAssetWorkspace" class="card library-asset-workspace-section" data-library-section="asset-workspace">
public/control-center/pages/library.js:3063:          ${sourceGuideHtml ? `<div id="librarySourceBridgeGuideBox" class="library-source-guide-inline">${sourceGuideHtml}</div>` : ""}
public/control-center/pages/library.js:3064:            <div id="libraryFinderWorkspace" class="library-workspace-grid library-finder-workspace" data-library-view-mode="${escapeHtml(session.viewMode || "grid")}">
public/control-center/pages/library.js:3065:            <div class="library-workspace-main">
public/control-center/pages/library.js:3066:              <div class="library-finder-topbar">
public/control-center/pages/library.js:3067:                <div class="library-finder-sidebar-title"></div>
public/control-center/pages/library.js:3068:                <div class="library-folder-list">
public/control-center/pages/library.js:3069:                  ${LIBRARY_FOLDERS.map((folder) => {
public/control-center/pages/library.js:3073:                      <button type="button" class="library-folder-item ${active ? "is-active" : ""}" data-library-folder-select="${escapeHtml(folder.key)}">
public/control-center/pages/library.js:3082:              <div class="library-finder-toolbar">
public/control-center/pages/library.js:3083:                <button id="libraryToolbarUploadBtn" class="btn btn-secondary btn-sm" type="button">Quick Upload</button>
public/control-center/pages/library.js:3086:              <div class="library-filter-bar">
public/control-center/pages/library.js:3087:                <div class="library-filter-field">
public/control-center/pages/library.js:3088:                  <label class="setup-label" for="libraryFilterTypeSelect">Type</label>
public/control-center/pages/library.js:3089:                  <select id="libraryFilterTypeSelect" class="setup-input" aria-label="Filter by type"></select>
public/control-center/pages/library.js:3091:                <div class="library-filter-field">
public/control-center/pages/library.js:3092:                  <label class="setup-label" for="libraryFilterStatusSelect">Status</label>
public/control-center/pages/library.js:3093:                  <select id="libraryFilterStatusSelect" class="setup-input" aria-label="Filter by status">
public/control-center/pages/library.js:3099:                    <option value="publishing_ready">Publishing ready</option>
public/control-center/pages/library.js:3100:                    <option value="sent_to_publishing">Sent to publishing</option>
public/control-center/pages/library.js:3106:                <div class="library-filter-field">
public/control-center/pages/library.js:3107:                  <label class="setup-label" for="libraryFilterSourceSelect">Source</label>
public/control-center/pages/library.js:3108:                  <select id="libraryFilterSourceSelect" class="setup-input" aria-label="Filter by source"></select>
public/control-center/pages/library.js:3110:                <div class="library-filter-field">
public/control-center/pages/library.js:3111:                  <label class="setup-label" for="librarySortSelect">Sort</label>
public/control-center/pages/library.js:3112:                  <select id="librarySortSelect" class="setup-input" aria-label="Sort assets">
public/control-center/pages/library.js:3120:                <div class="library-filter-field library-filter-search">
public/control-center/pages/library.js:3121:                  <label class="setup-label" for="librarySearchInput">Search</label>
public/control-center/pages/library.js:3122:                  <input id="librarySearchInput" class="setup-input" type="text" placeholder="Search by name, path, type, or usage" />
public/control-center/pages/library.js:3126:              <div id="libraryAssetGridBody" class="library-grid-body"></div>
public/control-center/pages/library.js:3127:              <div id="libraryGridPagination" class="library-grid-pagination"></div>
public/control-center/pages/library.js:3130:            <aside class="library-workspace-side">
public/control-center/pages/library.js:3131:              <div class="library-side-stack">
public/control-center/pages/library.js:3132:                <section class="card library-preview-card">
public/control-center/pages/library.js:3137:                  <div id="libraryPreviewVisual"></div>
public/control-center/pages/library.js:3138:                  <div id="libraryPreviewMeta" class="library-preview-meta"></div>
public/control-center/pages/library.js:3140:                <div id="libraryActionPanelMount" class="library-panel-mount"></div>
public/control-center/pages/library.js:3141:                <div id="libraryAiPanelMount" class="library-panel-mount"></div>
public/control-center/pages/library.js:3148:    bindLibraryWorkspace({
public/control-center/pages/library.js:3165:      unmountLibraryGlobalListeners();
public/control-center/pages/home.js:7:  renderHomeExecutiveIntro
public/control-center/pages/home.js:8:} from "./home/render-sections.js";
public/control-center/pages/home.js:132:  if (/(connector|integration|sync)/.test(text)) return "integrations";
public/control-center/pages/home.js:133:  if (/(asset|library|upload|brand file)/.test(text)) return "library";
public/control-center/pages/home.js:134:  if (/(campaign|launch wave|brief)/.test(text)) return "campaign-studio";
public/control-center/pages/home.js:135:  if (/(publish|schedule|queue)/.test(text)) return "publishing";
public/control-center/pages/home.js:136:  if (/(ad|budget|paid)/.test(text)) return "ads-manager";
public/control-center/pages/home.js:137:  if (/(content|copy)/.test(text)) return "content-studio";
public/control-center/pages/home.js:138:  return "ai-command";
public/control-center/pages/home.js:172:    { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
public/control-center/pages/home.js:174:    { id: "analyst", name: "SEO & Insights Analyst", fallback: "Read weak signals and recommend measurable improvements." },
public/control-center/pages/home.js:205:  const integrations = asObject(state.data.integrations);
public/control-center/pages/home.js:220:  const insights = asObject(activity.insights);
public/control-center/pages/home.js:244:    integrations.readiness?.readiness_score ??
public/control-center/pages/home.js:252:  const connectorChecks = asObject(integrations.readiness?.checks);
public/control-center/pages/home.js:255:  const missingIntegrations = asArray(integrations.readiness?.missing).map((item) => humanizeStatus(item)).filter(Boolean);
public/control-center/pages/home.js:271:  const insightsRecommendations = asArray(insights.recommendations);
public/control-center/pages/home.js:282:  const intelligenceScore = insightsRecommendations.length + learningLessons.length;
public/control-center/pages/home.js:358:  const publishingQueue = asArray(operations.queues?.items).filter((item) =>
public/control-center/pages/home.js:359:    asString(item.entity_type) === "publishing_job" || asString(item.queue_type) === "publishing"
public/control-center/pages/home.js:361:  const publishReadyCount = publishingQueue.filter((item) => {
public/control-center/pages/home.js:435:    integrations: missingIntegrations,
public/control-center/pages/home.js:447:    blockers.integrations.length +
public/control-center/pages/home.js:473:    primaryActionLabel: nextActionRoute === "ai-command" ? "Open AI Workspace" : `Open ${humanizeStatus(nextActionRoute)}`,
public/control-center/pages/home.js:475:    secondaryActionLabel: "Review Setup Foundation",
public/control-center/pages/home.js:476:    secondaryActionRoute: "setup",
public/control-center/pages/home.js:494:      buttonLabel: nextActionRoute === "ai-command" ? "Start With AI" : `Fix In ${humanizeStatus(nextActionRoute)}`,
public/control-center/pages/home.js:545:        hint: "Critical setup or assets",
public/control-center/pages/home.js:581:        : "No scheduled action yet — open Publishing or Campaign Studio to prepare the next launch step."
public/control-center/pages/home.js:603:        ...blockers.integrations.map((item) => `Integration: ${item}`),
public/control-center/pages/home.js:612:        : "No execution recorded yet — start with a campaign or publishing package to create the first signal.",
public/control-center/pages/home.js:613:      recommendation: asString(recommendations[0]).trim() || asString(insightsRecommendations[0]).trim() || "Ask Executive AI to generate the next best action from readiness, blockers, and recent activity.",
public/control-center/pages/home.js:614:      feedback: asString(learningLessons[0]).trim() || "Connect insights or run a reviewed campaign so the learning engine can capture feedback."
public/control-center/pages/home.js:643:export const homeRoute = {
public/control-center/pages/home.js:644:  id: "home",
public/control-center/pages/home.js:652:    <section class="page is-active" data-page="home">
public/control-center/pages/home.js:653:      <div id="homeExecRoot"></div>
public/control-center/pages/home.js:659:    const root = $("homeExecRoot");
public/control-center/pages/home.js:667:      { title: "Integrations", items: dashboard.blockers.integrations, tone: "warning" },
public/control-center/pages/home.js:675:      <div class="home-command-center">
public/control-center/pages/home.js:677:        <section class="home-exec-header">
public/control-center/pages/home.js:678:          <div class="home-header-left">
public/control-center/pages/home.js:679:            <p class="home-header-eyebrow">Executive Command Center</p>
public/control-center/pages/home.js:680:            <h1 class="home-header-title">${escapeHtml(dashboard.projectName || "Project Command Center")}</h1>
public/control-center/pages/home.js:681:            <p class="home-header-subtitle">${escapeHtml(dashboard.oneLineSummary)}</p>
public/control-center/pages/home.js:684:          <div class="home-header-status">
public/control-center/pages/home.js:686:            <div class="home-header-score">
public/control-center/pages/home.js:688:              <span class="home-header-score-label">System Health</span>
public/control-center/pages/home.js:716:            <button id="homeNextActionBtn" class="mhos-next-action-btn" type="button">
public/control-center/pages/home.js:719:            <button id="homeAskNextActionBtn" class="mhos-next-action-btn is-ghost" type="button">
public/control-center/pages/home.js:726:        <div class="home-snapshot-grid executive-signal-grid">
public/control-center/pages/home.js:728:            <article class="card home-snapshot-card executive-signal-card">
public/control-center/pages/home.js:738:        <article class="card home-workspace-section home-exception-section">
public/control-center/pages/home.js:739:          <div class="home-section-head">
public/control-center/pages/home.js:749:            <div class="home-blocker-grid home-exception-grid">
public/control-center/pages/home.js:755:            <div class="home-empty-state home-exception-clear">
public/control-center/pages/home.js:763:        <div class="home-workspace-main">
public/control-center/pages/home.js:764:          <div class="home-workspace-grid">
public/control-center/pages/home.js:765:            <article class="card home-workspace-section">
public/control-center/pages/home.js:766:              <div class="home-section-head">
public/control-center/pages/home.js:779:              <div class="home-status-grid">
public/control-center/pages/home.js:780:                <div class="home-status-item">
public/control-center/pages/home.js:784:                <div class="home-status-item">
public/control-center/pages/home.js:788:                <div class="home-status-item">
public/control-center/pages/home.js:792:                <div class="home-status-item">
public/control-center/pages/home.js:799:            <article class="card home-workspace-section">
public/control-center/pages/home.js:800:              <div class="home-section-head">
public/control-center/pages/home.js:804:                  <span class="section-helper">Tracks campaign, publishing, and media readiness. Shows current campaign state and next scheduled actions.</span>
public/control-center/pages/home.js:809:              <div class="home-campaign-info">
public/control-center/pages/home.js:810:                <div class="home-campaign-row">
public/control-center/pages/home.js:811:                  <span class="home-info-label">Execution Mode</span>
public/control-center/pages/home.js:814:                <div class="home-campaign-row">
public/control-center/pages/home.js:815:                  <span class="home-info-label">Next Scheduled</span>
public/control-center/pages/home.js:818:                <div class="home-campaign-row">
public/control-center/pages/home.js:819:                  <span class="home-info-label">Channels</span>
public/control-center/pages/home.js:827:          <article class="card home-workspace-section">
public/control-center/pages/home.js:828:            <div class="home-section-head">
public/control-center/pages/home.js:834:            <div class="home-status-board">
public/control-center/pages/home.js:836:                <article class="home-status-board-card">
public/control-center/pages/home.js:848:        <section class="card home-action-panel">
public/control-center/pages/home.js:849:          <div class="home-panel-head">
public/control-center/pages/home.js:856:          <div class="home-action-group">
public/control-center/pages/home.js:857:            <p class="home-action-group-title">Continue Setup & Configuration</p>
public/control-center/pages/home.js:858:            <button id="homeQuickReviewReadinessBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:859:              <span class="home-action-title">Review Setup Foundation</span>
public/control-center/pages/home.js:860:              <span class="home-action-meta">Resolve foundation issues and complete setup.</span>
public/control-center/pages/home.js:864:          <div class="home-action-group">
public/control-center/pages/home.js:865:            <p class="home-action-group-title">Build & Launch</p>
public/control-center/pages/home.js:866:            <button id="homeQuickStartCampaignBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:867:              <span class="home-action-title">Campaign Studio</span>
public/control-center/pages/home.js:868:              <span class="home-action-meta">Create launch waves and campaign briefs.</span>
public/control-center/pages/home.js:870:            <button id="homeQuickUploadAssetBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:871:              <span class="home-action-title">Asset Library</span>
public/control-center/pages/home.js:872:              <span class="home-action-meta">Upload and organize brand assets.</span>
public/control-center/pages/home.js:876:          <div class="home-action-group">
public/control-center/pages/home.js:877:            <p class="home-action-group-title">Integrations & Automation</p>
public/control-center/pages/home.js:878:            <button id="homeQuickConnectPlatformBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:879:              <span class="home-action-title">Integrations</span>
public/control-center/pages/home.js:880:              <span class="home-action-meta">Connect platforms and configure automation.</span>
public/control-center/pages/home.js:882:            <button id="homeOpenOperationsBtn" class="btn btn-secondary btn-sm" type="button">
public/control-center/pages/home.js:887:          <div class="home-action-group">
public/control-center/pages/home.js:888:            <p class="home-action-group-title">AI Guidance</p>
public/control-center/pages/home.js:889:            <button id="homeQuickOpenAiBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:890:              <span class="home-action-title">Open AI Workspace</span>
public/control-center/pages/home.js:891:              <span class="home-action-meta">Get AI guidance on the next best action.</span>
public/control-center/pages/home.js:897:        <section class="card home-ai-guidance-panel">
public/control-center/pages/home.js:898:          <div class="home-panel-head">
public/control-center/pages/home.js:904:            <button id="homeOpenAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
public/control-center/pages/home.js:909:          <div class="home-ai-prompt-grid">
public/control-center/pages/home.js:910:            <button id="homePromptNextBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:911:              <span class="home-prompt-title">What is the next executive action?</span>
public/control-center/pages/home.js:912:              <span class="home-prompt-meta">AI can clarify why this is the focus and what to do next.</span>
public/control-center/pages/home.js:915:            <button id="homePromptReadinessBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:916:              <span class="home-prompt-title">Why is readiness low?</span>
public/control-center/pages/home.js:917:              <span class="home-prompt-meta">AI explains blockers and readiness gaps in operational terms.</span>
public/control-center/pages/home.js:920:            <button id="homePromptLaunchBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:921:              <span class="home-prompt-title">Summarize launch blockers</span>
public/control-center/pages/home.js:922:              <span class="home-prompt-meta">AI prepares a risk summary for launch and escalation.</span>
public/control-center/pages/home.js:925:            <button id="homePromptPlanBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:926:              <span class="home-prompt-title">Turn next action into a plan</span>
public/control-center/pages/home.js:927:              <span class="home-prompt-meta">AI converts the next action into a stepwise operational plan.</span>
public/control-center/pages/home.js:964:                <button id="homeOpenFullAiTeamBtn" class="btn btn-ghost btn-sm" type="button">Open Full Team</button>
public/control-center/pages/home.js:1004:        <section class="card home-customer-ops-panel">
public/control-center/pages/home.js:1005:          <div class="home-panel-head">
public/control-center/pages/home.js:1012:          <div class="home-customer-ops-body">
public/control-center/pages/home.js:1013:            <span class="home-customer-ops-badge">${dashboard.health?.customerOpsStatus || "Planned/Partial"}</span>
public/control-center/pages/home.js:1014:            <span class="home-comm-readiness-badge">Communication Readiness: <strong>${dashboard.health?.commReadiness || "Planned/Not Ready"}</strong></span>
public/control-center/pages/home.js:1022:        <section class="card home-activity-panel">
public/control-center/pages/home.js:1023:          <div class="home-section-head">
public/control-center/pages/home.js:1042:      navigateTo("ai-command");
public/control-center/pages/home.js:1054:        publisher: `Act as the Publisher for ${projectLabel}. Review publishing readiness, scheduled jobs, blockers, and what must be checked before publishing. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:1056:        analyst: `Act as the SEO & Insights Analyst for ${projectLabel}. Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:1057:        compliance_reviewer: `Act as the Compliance Reviewer for ${projectLabel}. Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release. Do not execute anything; prepare guidance only.`,
public/control-center/pages/home.js:1066:    const nextBtn = $("homeNextActionBtn");
public/control-center/pages/home.js:1069:        if (dashboard.nextBestAction.route === "ai-command") {
public/control-center/pages/home.js:1076:    const askNextActionBtn = $("homeAskNextActionBtn");
public/control-center/pages/home.js:1081:    const operationsBtn = $("homeOpenOperationsBtn");
public/control-center/pages/home.js:1082:    if (operationsBtn) operationsBtn.onclick = () => openRoute("operations-centers");
public/control-center/pages/home.js:1084:    const aiTeamBtn = $("homeOpenAiTeamBtn");
public/control-center/pages/home.js:1085:    if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");
public/control-center/pages/home.js:1086:    const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
public/control-center/pages/home.js:1087:    if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");
public/control-center/pages/home.js:1089:    const quickCampaignBtn = $("homeQuickStartCampaignBtn");
public/control-center/pages/home.js:1090:    if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");
public/control-center/pages/home.js:1092:    const quickAssetBtn = $("homeQuickUploadAssetBtn");
public/control-center/pages/home.js:1093:    if (quickAssetBtn) quickAssetBtn.onclick = () => openRoute("library");
public/control-center/pages/home.js:1095:    const quickConnectBtn = $("homeQuickConnectPlatformBtn");
public/control-center/pages/home.js:1096:    if (quickConnectBtn) quickConnectBtn.onclick = () => openRoute("integrations");
public/control-center/pages/home.js:1098:    const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
public/control-center/pages/home.js:1099:    if (quickReadinessBtn) quickReadinessBtn.onclick = () => openRoute("setup");
public/control-center/pages/home.js:1101:    const quickAiBtn = $("homeQuickOpenAiBtn");
public/control-center/pages/home.js:1106:    const promptNextBtn = $("homePromptNextBtn");
public/control-center/pages/home.js:1111:    const promptReadinessBtn = $("homePromptReadinessBtn");
public/control-center/pages/home.js:1113:      promptReadinessBtn.onclick = () => openAiWithPrompt("Why is readiness low? Explain the missing integrations, assets, failed jobs, and readiness gaps in simple steps.");
public/control-center/pages/home.js:1116:    const promptLaunchBtn = $("homePromptLaunchBtn");
public/control-center/pages/home.js:1118:      promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");
public/control-center/pages/home.js:1121:    const promptPlanBtn = $("homePromptPlanBtn");
public/control-center/pages/home.js:1126:    const aiRoleCards = document.querySelectorAll(".home-ai-team-card, .mhos-specialist, .mhos-workflow-step[data-role-id]");
public/control-center/pages/insights.js:55:const insightsRefreshState = new Map();
public/control-center/pages/insights.js:57:function getInsightsRefreshState(projectName) {
public/control-center/pages/insights.js:59:  if (!insightsRefreshState.has(key)) {
public/control-center/pages/insights.js:60:    insightsRefreshState.set(key, {
public/control-center/pages/insights.js:65:  return insightsRefreshState.get(key);
public/control-center/pages/insights.js:68:function setInsightsRefreshState(projectName, nextState) {
public/control-center/pages/insights.js:70:  const current = getInsightsRefreshState(projectName);
public/control-center/pages/insights.js:71:  insightsRefreshState.set(key, {
public/control-center/pages/insights.js:220:    sources: asObject(state.data.integrations?.sources?.sources),
public/control-center/pages/insights.js:221:    checks: asObject(state.data.integrations?.readiness?.checks)
public/control-center/pages/insights.js:229:    activity.insights ||
public/control-center/pages/insights.js:230:    activity.marketing_insights ||
public/control-center/pages/insights.js:231:    activity.performance_insights ||
public/control-center/pages/insights.js:232:    overview.insights
public/control-center/pages/insights.js:462:      ? "The Insight Engine is structurally ready, but live performance feeds are still sparse. Connect social insights, website analytics, SEO, and paid platforms to unlock real learning."
public/control-center/pages/insights.js:662:      body: measured.length ? bestEntry(postingWindows, "No timing signal yet") : "Posting window insights require timestamped post performance data."
public/control-center/pages/insights.js:725:      meta: "Website is present, but no sessions, landing-page, or conversion metrics are flowing into Insights yet.",
public/control-center/pages/insights.js:757:      prompt: `Review all available insights for ${projectName} and tell me the highest-impact improvement to make next across content, publishing, SEO, paid media, and website conversion.`
public/control-center/pages/insights.js:790:    <div class="insights-platform-grid">
public/control-center/pages/insights.js:792:        <section class="insights-platform-card">
public/control-center/pages/insights.js:793:          <div class="insights-platform-head">
public/control-center/pages/insights.js:800:          <div class="insights-platform-metrics">
public/control-center/pages/insights.js:814:          <div class="insights-platform-note">${escapeHtml(item.recommendation)}</div>
public/control-center/pages/insights.js:827:    <div class="insights-ranked-list">
public/control-center/pages/insights.js:829:        <div class="insights-ranked-item">
public/control-center/pages/insights.js:830:          <div class="insights-ranked-head">
public/control-center/pages/insights.js:831:            <div class="insights-ranked-title">
public/control-center/pages/insights.js:832:              ${item.rank ? `<span class="insights-rank">${escapeHtml(String(item.rank))}</span>` : ""}
public/control-center/pages/insights.js:837:          <div class="insights-ranked-grid">
public/control-center/pages/insights.js:855:          <div class="insights-ranked-note">${escapeHtml(item.why)}</div>
public/control-center/pages/insights.js:868:    <div class="insights-list">
public/control-center/pages/insights.js:870:        <div class="insights-list-item">
public/control-center/pages/insights.js:871:          <div class="insights-list-head">
public/control-center/pages/insights.js:875:          <div class="insights-list-meta">${escapeHtml(item.weakMetrics || "No metric detail yet")}</div>
public/control-center/pages/insights.js:876:          <div class="insights-list-note">${escapeHtml(`Why likely weak: ${item.reason}`)}</div>
public/control-center/pages/insights.js:877:          <div class="insights-list-note">${escapeHtml(`Improve next: ${item.improve}`)}</div>
public/control-center/pages/insights.js:886:    <div class="insights-empty-state">
public/control-center/pages/insights.js:913:    <div class="insights-mini-list">
public/control-center/pages/insights.js:937:          <div class="insights-mini-item">
public/control-center/pages/insights.js:947:function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
public/control-center/pages/insights.js:948:  Array.from(document.querySelectorAll("[data-insights-open]")).forEach((button) => {
public/control-center/pages/insights.js:950:      navigateTo("ai-command");
public/control-center/pages/insights.js:954:  Array.from(document.querySelectorAll("[data-insights-route]")).forEach((button) => {
public/control-center/pages/insights.js:956:      const route = button.getAttribute("data-insights-route") || "";
public/control-center/pages/insights.js:961:          source_page: "insights",
public/control-center/pages/insights.js:966:            route: "insights",
public/control-center/pages/insights.js:971:              origin: "insights",
public/control-center/pages/insights.js:985:  Array.from(document.querySelectorAll("[data-insights-prompt]")).forEach((button) => {
public/control-center/pages/insights.js:987:      const index = Number(button.getAttribute("data-insights-prompt"));
public/control-center/pages/insights.js:998:          source_page: "insights",
public/control-center/pages/insights.js:999:          destination_page: "ai-command",
public/control-center/pages/insights.js:1003:            route: "insights",
public/control-center/pages/insights.js:1009:              origin: "insights",
public/control-center/pages/insights.js:1015:        setSharedHandoff(projectName, "ai-command", handoff);
public/control-center/pages/insights.js:1017:          console.warn("Failed to persist Insights handoff:", error.message);
public/control-center/pages/insights.js:1021:      navigateTo("ai-command");
public/control-center/pages/insights.js:1027:export const insightsRoute = {
public/control-center/pages/insights.js:1028:  id: "insights",
public/control-center/pages/insights.js:1032:    title: "Insights",
public/control-center/pages/insights.js:1036:    <section class="page is-active" data-page="insights">
public/control-center/pages/insights.js:1037:      <div id="insightsRoot"></div>
public/control-center/pages/insights.js:1048:    fetchProjectInsights,
public/control-center/pages/insights.js:1053:    const refreshState = getInsightsRefreshState(projectName);
public/control-center/pages/insights.js:1065:    const hasInsights = hasInsightPayload(insightRoot);
public/control-center/pages/insights.js:1068:      : hasInsights
public/control-center/pages/insights.js:1069:        ? "Refresh insights"
public/control-center/pages/insights.js:1070:        : "Retry insights";
public/control-center/pages/insights.js:1084:    const connectedInsights = platformCards.filter((item) => item.connected && item.hasData).slice(0, 3);
public/control-center/pages/insights.js:1127:    const root = $("insightsRoot");
public/control-center/pages/insights.js:1131:      <div class="insights-wrapper insights-workspace">
public/control-center/pages/insights.js:1134:            <h3>Insights Overview</h3>
public/control-center/pages/insights.js:1135:            <div class="insights-assistant-toolbar">
public/control-center/pages/insights.js:1136:              <button class="btn btn-secondary" type="button" id="insightsRefreshBtn" ${refreshState.loading ? "disabled" : ""}>${escapeHtml(refreshLabel)}</button>
public/control-center/pages/insights.js:1141:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1144:          <div class="insights-overview-grid">
public/control-center/pages/insights.js:1146:              <div class="insights-overview-item">
public/control-center/pages/insights.js:1149:                <span class="insights-kpi-meta">${escapeHtml(item.meta)}</span>
public/control-center/pages/insights.js:1153:          <div class="insights-section-copy">${escapeHtml(executive.summary)}</div>
public/control-center/pages/insights.js:1154:          <div class="insights-overview-grid">
public/control-center/pages/insights.js:1155:            <div class="insights-overview-item">
public/control-center/pages/insights.js:1158:              <span class="insights-kpi-meta">Content items with usable performance data.</span>
public/control-center/pages/insights.js:1160:            <div class="insights-overview-item">
public/control-center/pages/insights.js:1163:              <span class="insights-kpi-meta">Sources that can feed this workspace.</span>
public/control-center/pages/insights.js:1165:            <div class="insights-overview-item">
public/control-center/pages/insights.js:1168:              <span class="insights-kpi-meta">Search visibility signal status.</span>
public/control-center/pages/insights.js:1170:            <div class="insights-overview-item">
public/control-center/pages/insights.js:1173:              <span class="insights-kpi-meta">Paid acquisition signal status.</span>
public/control-center/pages/insights.js:1183:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1186:          <div class="insights-workspace-grid">
public/control-center/pages/insights.js:1188:              <h4 class="insights-subtitle">Strongest published content</h4>
public/control-center/pages/insights.js:1200:            <div class="insights-stack">
public/control-center/pages/insights.js:1202:                <h4 class="insights-subtitle">Best performing lanes</h4>
public/control-center/pages/insights.js:1204:                  connectedInsights.length
public/control-center/pages/insights.js:1205:                    ? renderPlatformCards(connectedInsights, currency, escapeHtml)
public/control-center/pages/insights.js:1215:                <h4 class="insights-subtitle">Emerging patterns</h4>
public/control-center/pages/insights.js:1216:                <div class="insights-learning-grid">
public/control-center/pages/insights.js:1218:                    <div class="insights-learning-card">
public/control-center/pages/insights.js:1234:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1237:          <div class="insights-workspace-grid">
public/control-center/pages/insights.js:1239:              <h4 class="insights-subtitle">Underperforming content</h4>
public/control-center/pages/insights.js:1251:            <div class="insights-stack">
public/control-center/pages/insights.js:1253:                <h4 class="insights-subtitle">At-risk channels</h4>
public/control-center/pages/insights.js:1260:              <div class="insights-compact-grid">
public/control-center/pages/insights.js:1262:                  <h4 class="insights-subtitle">Website conversion risk</h4>
public/control-center/pages/insights.js:1275:                  <h4 class="insights-subtitle">SEO / paid weak signals</h4>
public/control-center/pages/insights.js:1306:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1309:          <div class="insights-workspace-grid">
public/control-center/pages/insights.js:1311:              <h4 class="insights-subtitle">Prioritized recommendations</h4>
public/control-center/pages/insights.js:1312:              <div class="insights-list">
public/control-center/pages/insights.js:1314:                  <div class="insights-list-item">
public/control-center/pages/insights.js:1315:                    <div class="insights-list-head">
public/control-center/pages/insights.js:1319:                    <div class="insights-list-meta">${escapeHtml(item.meta)}</div>
public/control-center/pages/insights.js:1325:              <h4 class="insights-subtitle">Readiness notes</h4>
public/control-center/pages/insights.js:1326:              <div class="insights-learning-grid">
public/control-center/pages/insights.js:1330:                      <div class="insights-learning-card">
public/control-center/pages/insights.js:1336:                      <div class="insights-learning-card">
public/control-center/pages/insights.js:1345:          <div class="insights-assistant-toolbar" style="margin-top: 16px;">
public/control-center/pages/insights.js:1346:            <button class="btn btn-primary" type="button" data-insights-route="campaign-studio">Navigate: Open Campaign Studio</button>
public/control-center/pages/insights.js:1347:            <button class="btn btn-secondary" type="button" data-insights-route="content-studio">Navigate: Open Content Studio Workspace</button>
public/control-center/pages/insights.js:1348:            <button class="btn btn-secondary" type="button" data-insights-route="ads-manager">Navigate: Open Ads Manager</button>
public/control-center/pages/insights.js:1349:            <button class="btn btn-secondary" type="button" data-insights-route="publishing">Navigate: Open Publishing Workspace</button>
public/control-center/pages/insights.js:1358:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1361:          <div class="insights-workspace-grid">
public/control-center/pages/insights.js:1363:              <h4 class="insights-subtitle">Cross-platform comparison</h4>
public/control-center/pages/insights.js:1367:              <h4 class="insights-subtitle">Current trend snapshots</h4>
public/control-center/pages/insights.js:1368:              <div class="insights-domain-summary-grid">
public/control-center/pages/insights.js:1370:                  <div class="insights-domain-summary">
public/control-center/pages/insights.js:1371:                    <div class="insights-list-head">
public/control-center/pages/insights.js:1375:                    <div class="insights-domain-summary-metrics">
public/control-center/pages/insights.js:1383:                    <div class="insights-list-note">${escapeHtml(item.note)}</div>
public/control-center/pages/insights.js:1393:            <h3>Insights AI Assistant</h3>
public/control-center/pages/insights.js:1396:          <p class="insights-section-copy">
public/control-center/pages/insights.js:1399:          <div class="insights-assistant-toolbar">
public/control-center/pages/insights.js:1400:            <button class="btn ghost" type="button" data-insights-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/insights.js:1402:          <div class="insights-prompt-list">
public/control-center/pages/insights.js:1404:              <button class="quick-action-btn" type="button" data-insights-prompt="${index}">
public/control-center/pages/insights.js:1405:                <span class="home-action-title">${escapeHtml(item.label)}</span>
public/control-center/pages/insights.js:1406:                <span class="home-action-meta">${escapeHtml(item.prompt)}</span>
public/control-center/pages/insights.js:1414:    bindInsightsActions({
public/control-center/pages/insights.js:1423:    root.querySelector("#insightsRefreshBtn")?.addEventListener("click", () => {
public/control-center/pages/insights.js:1425:        const message = "Insights: No active project selected.";
public/control-center/pages/insights.js:1426:        setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1428:        insightsRoute.render({
public/control-center/pages/insights.js:1436:          fetchProjectInsights,
public/control-center/pages/insights.js:1442:      if (!fetchProjectInsights) {
public/control-center/pages/insights.js:1443:        const message = "Insights: Live refresh is unavailable in this context.";
public/control-center/pages/insights.js:1444:        setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1446:        insightsRoute.render({
public/control-center/pages/insights.js:1454:          fetchProjectInsights,
public/control-center/pages/insights.js:1460:      setInsightsRefreshState(projectName, { loading: true, error: "" });
public/control-center/pages/insights.js:1461:      insightsRoute.render({
public/control-center/pages/insights.js:1469:        fetchProjectInsights,
public/control-center/pages/insights.js:1473:      fetchProjectInsights(projectName)
public/control-center/pages/insights.js:1483:              insights: asObject(liveData)
public/control-center/pages/insights.js:1487:          setInsightsRefreshState(projectName, { loading: false, error: "" });
public/control-center/pages/insights.js:1488:          insightsRoute.render({
public/control-center/pages/insights.js:1496:            fetchProjectInsights,
public/control-center/pages/insights.js:1499:          showMessage?.("Insights refreshed.");
public/control-center/pages/insights.js:1502:          const message = `Insights: ${error?.message || "Failed to refresh insights."}`;
public/control-center/pages/insights.js:1503:          setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1504:          insightsRoute.render({
public/control-center/pages/insights.js:1512:            fetchProjectInsights,
public/control-center/pages/content-studio-workspace.js:15:import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
public/control-center/pages/content-studio-workspace.js:19:const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
public/control-center/pages/content-studio-workspace.js:20:const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
public/control-center/pages/content-studio-workspace.js:50:  "sent_to_publishing"
public/control-center/pages/content-studio-workspace.js:115:    bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
public/control-center/pages/content-studio-workspace.js:188:  if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
public/control-center/pages/content-studio-workspace.js:193:  if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
public/control-center/pages/content-studio-workspace.js:266:function readContentLibraryMap() {
public/control-center/pages/content-studio-workspace.js:269:    const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
public/control-center/pages/content-studio-workspace.js:276:function writeContentLibraryMap(map) {
public/control-center/pages/content-studio-workspace.js:279:    window.localStorage?.setItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
public/control-center/pages/content-studio-workspace.js:283:function loadLocalLibraryAssets(projectName) {
public/control-center/pages/content-studio-workspace.js:284:  const map = readContentLibraryMap();
public/control-center/pages/content-studio-workspace.js:288:function upsertLocalLibraryAsset(projectName, asset) {
public/control-center/pages/content-studio-workspace.js:289:  const map = readContentLibraryMap();
public/control-center/pages/content-studio-workspace.js:293:    id: asString(asset.id || `content-library-${Date.now()}`),
public/control-center/pages/content-studio-workspace.js:303:  writeContentLibraryMap(map);
public/control-center/pages/content-studio-workspace.js:322:  libraryAssetRef = null,
public/control-center/pages/content-studio-workspace.js:336:    library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
public/control-center/pages/content-studio-workspace.js:354:    libraryAssetRef: raw.library_asset_ref || null,
public/control-center/pages/content-studio-workspace.js:494:    destination: firstText(raw.destination, raw.publishing_destination),
public/control-center/pages/content-studio-workspace.js:512:    sent_to_publishing: 3,
public/control-center/pages/content-studio-workspace.js:665:      library_asset_ref: version.library_asset_ref || null,
public/control-center/pages/content-studio-workspace.js:668:    actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:730:    "Output target: product-visible, publishing-safe, and campaign-consistent creative."
public/control-center/pages/content-studio-workspace.js:740:    sourcePage: asString(handoff?.source_page || "workflows"),
public/control-center/pages/content-studio-workspace.js:760:    getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
public/control-center/pages/content-studio-workspace.js:761:    getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
public/control-center/pages/content-studio-workspace.js:762:    getSharedHandoff(projectName, "content-studio", operations)
public/control-center/pages/content-studio-workspace.js:820:    sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
public/control-center/pages/content-studio-workspace.js:828:      why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
public/control-center/pages/content-studio-workspace.js:846:  if (metrics.sentMedia + metrics.sentPublishing > 0) {
public/control-center/pages/content-studio-workspace.js:1076:          <div class="setup-kicker">Content Overview</div>
public/control-center/pages/content-studio-workspace.js:1087:        <div class="content-overview-item"><span>Sent to Publishing</span><strong>${escapeHtml(formatCount(metrics.sentPublishing))}</strong></div>
public/control-center/pages/content-studio-workspace.js:1097:    ["Publishing", selectedItem?.status === "sent_to_publishing" ? "Sent" : "Pending"],
public/control-center/pages/content-studio-workspace.js:1108:          <div class="setup-kicker">Smart Recommendation</div>
public/control-center/pages/content-studio-workspace.js:1127:            <div class="setup-kicker">Draft Queue</div>
public/control-center/pages/content-studio-workspace.js:1140:          <div class="setup-kicker">Draft Queue</div>
public/control-center/pages/content-studio-workspace.js:1168:          <div class="setup-kicker">Content Composer</div>
public/control-center/pages/content-studio-workspace.js:1177:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1178:            <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
public/control-center/pages/content-studio-workspace.js:1179:            <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
public/control-center/pages/content-studio-workspace.js:1182:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1183:            <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
public/control-center/pages/content-studio-workspace.js:1184:            <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
public/control-center/pages/content-studio-workspace.js:1187:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1188:            <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
public/control-center/pages/content-studio-workspace.js:1189:            <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
public/control-center/pages/content-studio-workspace.js:1192:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1193:            <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
public/control-center/pages/content-studio-workspace.js:1194:            <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
public/control-center/pages/content-studio-workspace.js:1197:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1198:            <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
public/control-center/pages/content-studio-workspace.js:1199:            <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
public/control-center/pages/content-studio-workspace.js:1202:          <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1203:            <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
public/control-center/pages/content-studio-workspace.js:1204:            <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
public/control-center/pages/content-studio-workspace.js:1209:        <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1210:          <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
public/control-center/pages/content-studio-workspace.js:1211:          <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
public/control-center/pages/content-studio-workspace.js:1215:        <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1216:          <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
public/control-center/pages/content-studio-workspace.js:1217:          <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
public/control-center/pages/content-studio-workspace.js:1221:        <div class="setup-field-group">
public/control-center/pages/content-studio-workspace.js:1222:          <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
public/control-center/pages/content-studio-workspace.js:1223:          <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
public/control-center/pages/content-studio-workspace.js:1233:        <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
public/control-center/pages/content-studio-workspace.js:1343:          <div class="setup-kicker">Content Preview</div>
public/control-center/pages/content-studio-workspace.js:1363:          <div class="setup-kicker">Draft / Versioning</div>
public/control-center/pages/content-studio-workspace.js:1405:        <button class="btn btn-secondary" type="button" data-content-version-action="save-library">Save to Library</button>
public/control-center/pages/content-studio-workspace.js:1417:          <div class="setup-kicker">Smart Writing Agents</div>
public/control-center/pages/content-studio-workspace.js:1447:            <div class="setup-kicker">Workflow / AI Handoff</div>
public/control-center/pages/content-studio-workspace.js:1452:        <div class="empty-box">Run AI Command or Workflows and route output to Content Studio to prefill the composer.</div>
public/control-center/pages/content-studio-workspace.js:1461:          <div class="setup-kicker">Workflow / AI Handoff</div>
public/control-center/pages/content-studio-workspace.js:1504:    source_page: "content-studio",
public/control-center/pages/content-studio-workspace.js:1505:    destination_page: "media-studio",
public/control-center/pages/content-studio-workspace.js:1513:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:1540:    actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:1544:function buildPublishingHandoff(projectName, session, selectedItem) {
public/control-center/pages/content-studio-workspace.js:1551:    source_page: "content-studio",
public/control-center/pages/content-studio-workspace.js:1552:    destination_page: "publishing",
public/control-center/pages/content-studio-workspace.js:1556:    destination_service_domain: "publishing",
public/control-center/pages/content-studio-workspace.js:1560:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:1587:    actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:1591:function findExistingLibraryAssetSave(session, projectName, signature) {
public/control-center/pages/content-studio-workspace.js:1592:  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(signature));
public/control-center/pages/content-studio-workspace.js:1595:    const asset = asObject(payload.library_asset);
public/control-center/pages/content-studio-workspace.js:1596:    return asString(item.destination_page) === "library" && asString(asset.source_signature) === asString(signature);
public/control-center/pages/content-studio-workspace.js:1601:function mapLibraryAssetType(mode) {
public/control-center/pages/content-studio-workspace.js:1610:async function saveToLibrary({ projectName, session, selectedItem, showMessage, rerender }) {
public/control-center/pages/content-studio-workspace.js:1613:    session.validation = { ...session.validation, version: "Select a version before saving to Library." };
public/control-center/pages/content-studio-workspace.js:1620:    session.validation = { ...session.validation, version: "Version needs prompt or content output before Library save." };
public/control-center/pages/content-studio-workspace.js:1633:  const existing = findExistingLibraryAssetSave(session, projectName, signature);
public/control-center/pages/content-studio-workspace.js:1635:    showMessage?.("Already saved to Library (local reference).");
public/control-center/pages/content-studio-workspace.js:1639:  const libraryAsset = {
public/control-center/pages/content-studio-workspace.js:1642:    source: "content-studio",
public/control-center/pages/content-studio-workspace.js:1648:    asset_type: mapLibraryAssetType(firstText(selected.mode, session.form.mode)),
public/control-center/pages/content-studio-workspace.js:1667:    source_page: "content-studio",
public/control-center/pages/content-studio-workspace.js:1668:    destination_page: "library",
public/control-center/pages/content-studio-workspace.js:1672:    destination_service_domain: "library",
public/control-center/pages/content-studio-workspace.js:1676:      route: "content-studio",
public/control-center/pages/content-studio-workspace.js:1680:      library_asset: libraryAsset,
public/control-center/pages/content-studio-workspace.js:1681:      project: libraryAsset.project,
public/control-center/pages/content-studio-workspace.js:1682:      campaign: libraryAsset.campaign,
public/control-center/pages/content-studio-workspace.js:1683:      asset_type: libraryAsset.asset_type,
public/control-center/pages/content-studio-workspace.js:1684:      content_type: libraryAsset.media_type
public/control-center/pages/content-studio-workspace.js:1687:    actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:1690:  setSharedHandoff(projectName || "__default__", "library", handoff);
public/control-center/pages/content-studio-workspace.js:1692:    setSharedHandoff("__default__", "library", handoff);
public/control-center/pages/content-studio-workspace.js:1700:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1701:        ...libraryAsset,
public/control-center/pages/content-studio-workspace.js:1702:        id: handoffId || libraryAsset.id,
public/control-center/pages/content-studio-workspace.js:1706:      selected.library_asset_ref = {
public/control-center/pages/content-studio-workspace.js:1712:      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
public/control-center/pages/content-studio-workspace.js:1714:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1715:        ...libraryAsset,
public/control-center/pages/content-studio-workspace.js:1716:        id: libraryAsset.id,
public/control-center/pages/content-studio-workspace.js:1719:      selected.library_asset_ref = {
public/control-center/pages/content-studio-workspace.js:1725:      showMessage?.("Library backend unavailable. Saved as local library handoff.");
public/control-center/pages/content-studio-workspace.js:1728:    upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1729:      ...libraryAsset,
public/control-center/pages/content-studio-workspace.js:1730:      id: libraryAsset.id,
public/control-center/pages/content-studio-workspace.js:1733:    selected.library_asset_ref = {
public/control-center/pages/content-studio-workspace.js:1739:    showMessage?.("Content draft saved to Library (local handoff).");
public/control-center/pages/content-studio-workspace.js:1774:          <div class="setup-kicker">Content Inputs</div>
public/control-center/pages/content-studio-workspace.js:1775:          <h3>Library dependency gate</h3>
public/control-center/pages/content-studio-workspace.js:1889:            route_target: "content-studio",
public/control-center/pages/content-studio-workspace.js:1890:            actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:1999:          route_target: "content-studio",
public/control-center/pages/content-studio-workspace.js:2000:          actor: "content-studio"
public/control-center/pages/content-studio-workspace.js:2042:      setSharedHandoff(projectName || "__default__", "ai-command", {
public/control-center/pages/content-studio-workspace.js:2043:        source_page: "content-studio",
public/control-center/pages/content-studio-workspace.js:2044:        destination_page: "ai-command",
public/control-center/pages/content-studio-workspace.js:2058:      navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2089:        navigateTo("media-studio");
public/control-center/pages/content-studio-workspace.js:2095:  const sendPublishingBtn = document.getElementById("contentSendPublishingBtn");
public/control-center/pages/content-studio-workspace.js:2096:  if (sendPublishingBtn) {
public/control-center/pages/content-studio-workspace.js:2097:    sendPublishingBtn.onclick = async () => {
public/control-center/pages/content-studio-workspace.js:2104:      const handoffPayload = buildPublishingHandoff(projectName, session, selectedItem);
public/control-center/pages/content-studio-workspace.js:2110:        failMessage: "Publishing handoff kept locally because backend save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2111:        successMessage: "Publishing handoff created.",
public/control-center/pages/content-studio-workspace.js:2112:        localMessage: "Publishing handoff created locally."
public/control-center/pages/content-studio-workspace.js:2117:          selectedVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/content-studio-workspace.js:2119:        session.form.status = "sent_to_publishing";
public/control-center/pages/content-studio-workspace.js:2120:        await persistContentRecord({ projectName, state, session, status: "sent_to_publishing", showMessage });
public/control-center/pages/content-studio-workspace.js:2121:        navigateTo("publishing");
public/control-center/pages/content-studio-workspace.js:2190:      if (action === "save-library") {
public/control-center/pages/content-studio-workspace.js:2191:        await saveToLibrary({ projectName, session, selectedItem: selected(), showMessage, rerender });
public/control-center/pages/content-studio-workspace.js:2223:        setSharedHandoff(projectName || "__default__", "ai-command", {
public/control-center/pages/content-studio-workspace.js:2224:          source_page: "content-studio",
public/control-center/pages/content-studio-workspace.js:2225:          destination_page: "ai-command",
public/control-center/pages/content-studio-workspace.js:2238:        navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2248:  id: "content-studio",
public/control-center/pages/content-studio-workspace.js:2253:    description: "Smart content production hub for draft generation, review, and routing to Media Studio and Publishing."
public/control-center/pages/content-studio-workspace.js:2256:    <section class="page is-active" data-page="content-studio">
public/control-center/pages/content-studio-workspace.js:2322:      // Library asset/provenance
public/control-center/pages/content-studio-workspace.js:2323:      if (item && item.library_asset_ref) {
public/control-center/pages/content-studio-workspace.js:2324:        sourceLines.push(`<div><strong>Library asset ref:</strong> ${escapeHtml(item.library_asset_ref.source_signature || "-")}</div>`);
public/control-center/pages/content-studio-workspace.js:2327:        sourceLines.push(`<div>No source context attached yet. Use AI Command or Library to attach source-backed content.</div>`);
public/control-center/pages/content-studio-workspace.js:2330:      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Source Context</div><h3>Source / Provenance</h3></div></div><div class="content-data-item">${sourceLines.join("")}</div></section>`;
public/control-center/pages/content-studio-workspace.js:2337:      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">SEO Checklist</div><h3>SEO Readiness Guidance</h3></div></div><ul class="content-seo-checklist content-readiness-list">
public/control-center/pages/content-studio-workspace.js:2346:      </ul><div class="content-hint content-readiness-hint">Review these before routing for publishing or governance.</div></section>`;
public/control-center/pages/content-studio-workspace.js:2349:    // --- Governance Risk / Approval Readiness Panel ---
public/control-center/pages/content-studio-workspace.js:2350:    function renderGovernancePanel() {
public/control-center/pages/content-studio-workspace.js:2351:      const ariaLabel = "Governance risk and approval readiness panel";
public/control-center/pages/content-studio-workspace.js:2352:      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Governance Risk</div><h3>Approval Readiness</h3></div></div><ul class="content-governance-checklist content-readiness-list">
public/control-center/pages/content-studio-workspace.js:2358:        <li>Route to Governance Review if needed</li>
public/control-center/pages/content-studio-workspace.js:2359:      </ul><div class="content-hint content-readiness-hint">Prepare Governance Review before publishing or campaign use.</div></section>`;
public/control-center/pages/content-studio-workspace.js:2372:        ${renderGovernancePanel()}
public/control-center/pages/integrations/cards.js:2:  Integrations OS Cards
public/control-center/pages/integrations/cards.js:28:export function renderIntegrationStatusBadge(status) {
public/control-center/pages/integrations/cards.js:48:export function renderIntegrationStatusCard(record = {}) {
public/control-center/pages/integrations/cards.js:71:        ${renderIntegrationStatusBadge(item.status)}
public/control-center/pages/integrations/cards.js:100:        <strong>No integrations found</strong>
public/control-center/pages/integrations/cards.js:101:        <p>Connect platforms to unlock intelligence, sync, publishing, and reporting.</p>
public/control-center/pages/integrations/cards.js:108:      ${items.map(renderIntegrationStatusCard).join("")}
public/control-center/pages/integrations/cards.js:116:  if (card.statusLabel === "Partial") return "needs_setup";
public/control-center/pages/integrations/cards.js:121:  if (statusKey === "needs_setup") return "Needs setup";
public/control-center/pages/integrations/cards.js:154:  if (statusKey === "needs_setup") {
public/control-center/pages/integrations/cards.js:155:    return { action: "connect", label: "Complete setup" };
public/control-center/pages/integrations/cards.js:168:function conciseSetupMethod(card = {}) {
public/control-center/pages/integrations/cards.js:180:function getSetupMethodLabel(card = {}) {
public/control-center/pages/integrations/cards.js:182:    return "Setup method: Backend support not configured";
public/control-center/pages/integrations/cards.js:186:    return "Setup method: OAuth recommended";
public/control-center/pages/integrations/cards.js:189:  return "Setup method: Manual fields";
public/control-center/pages/integrations/cards.js:214:  return "Access needed: Setup details in drawer";
public/control-center/pages/integrations/cards.js:224:  const setupMethodLabel = conciseSetupMethod(card);
public/control-center/pages/integrations/cards.js:245:              <span class="integration-control-meta-pill">Access: ${esc(requirementLabel || "Setup details in drawer")}</span>
public/control-center/pages/integrations/cards.js:246:              <span class="integration-control-meta-pill">Setup: ${esc(setupMethodLabel)}</span>
public/control-center/pages/integrations/cards.js:269:  const countLabel = `${group.connectedCount || 0} connected • ${group.setupCount || 0} needs setup • ${group.failedCount || 0} failed • ${group.missingCount || 0} missing`;
public/control-center/pages/integrations/cards.js:276:          <p class="home-section-copy" style="margin:6px 0 0;">${esc(group.description)}</p>
public/control-center/pages/integrations/cards.js:278:        <span class="card-badge ${group.failedCount || group.missingCount ? "warning" : group.setupCount ? "warning" : "success"}">${esc(countLabel)}</span>
public/control-center/pages/integrations/cards.js:309:    return "Complete setup";
public/control-center/pages/integrations/cards.js:390:  const compactHealth = shortenText(card.healthSummary, 120) || "Use the setup drawer for connection validation and actions.";
public/control-center/pages/integrations/cards.js:397:          <p class="home-section-copy" style="margin:6px 0 0;">Open the setup drawer to configure fields and run connector actions.</p>
public/control-center/pages/integrations/layout.js:2:  Integrations OS Layout Layer
public/control-center/pages/integrations/layout.js:37:          <p class="home-section-copy" style="margin:6px 0 0;">${esc(domain.description)}</p>
public/control-center/pages/integrations/layout.js:52:export function renderIntegrationSection(
public/control-center/pages/integrations/layout.js:99:          <p class="home-section-copy" style="margin:6px 0 0;">
public/control-center/pages/integrations/layout.js:130:            Partial setup, token issues, or server-reported errors need review.
public/control-center/pages/integrations/layout.js:144:              : `<div class="empty-box">No connected integrations in this group yet.</div>`
public/control-center/pages/integrations/layout.js:158:              : `<div class="empty-box">No integrations need attention in this group right now.</div>`
public/control-center/pages/integrations/layout.js:172:              : `<div class="empty-box">All integrations in this group already have a connection state.</div>`
public/control-center/pages/integrations/diagnostics.js:2:  Integrations OS Diagnostics
public/control-center/pages/integrations/builders.js:2:  Integrations OS Builders Layer
public/control-center/pages/integrations/builders.js:24:      label: "Social Insights",
public/control-center/pages/integrations/builders.js:127:      title: "Finish partially configured integrations",
public/control-center/pages/integrations/builders.js:152:      prompt: "Review all current integrations and tell me which platform or tool I should connect next to improve learning, attribution, and execution fastest."
public/control-center/pages/integrations/builders.js:155:      label: "Which integrations are critical before launch?",
public/control-center/pages/integrations/builders.js:156:      prompt: "Identify the critical missing integrations before launch and explain which ones block publishing, analytics, SEO, paid optimization, and conversion intelligence."
public/control-center/pages/integrations/builders.js:164:      prompt: "Review the current analytics, tracking, website, and paid integrations and tell me what is blocking full attribution across content, ads, and conversion tracking."
public/control-center/pages/integrations/builders.js:168:      prompt: "Review the integrations layer and tell me which tools and data sources are still needed before paid media optimization can be trusted."
public/control-center/pages/integrations/builders.js:183:    description: "Organic distribution surfaces that supply audience, content, and publishing signals.",
public/control-center/pages/integrations/builders.js:221:  if (card.statusLabel === "Partial") return "needs_setup";
public/control-center/pages/integrations/builders.js:226:  if (statusKey === "needs_setup") return "Needs setup";
public/control-center/pages/integrations/builders.js:260:  const totalIntegrations = list.length;
public/control-center/pages/integrations/builders.js:261:  const connectedIntegrations = list.filter((card) => getConnectorWorkspaceStatus(card) === "connected").length;
public/control-center/pages/integrations/builders.js:265:  const warningCount = requiredCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;
public/control-center/pages/integrations/builders.js:267:  let launchReadinessImpact = "Launch-ready from an integrations perspective.";
public/control-center/pages/integrations/builders.js:272:    launchReadinessImpact = `${warningCount} required connector${warningCount === 1 ? "" : "s"} still need setup before diagnostics can be trusted.`;
public/control-center/pages/integrations/builders.js:278:    totalIntegrations,
public/control-center/pages/integrations/builders.js:279:    connectedIntegrations,
public/control-center/pages/integrations/builders.js:306:    .filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup")
public/control-center/pages/integrations/builders.js:356:        setupCount: groupCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length
public/control-center/pages/integrations/builders.js:366:  if (/(pending|partial|warning|setup)/.test(text)) return "warning";
public/control-center/pages/integrations/builders.js:471:      description: "Audience and publishing platforms used for organic reach, social engagement, and content performance learning.",
public/control-center/pages/integrations/builders.js:565:    publishing_blocker: ["instagram", "facebook", "tiktok", "youtube", "linkedin"],
public/control-center/pages/integrations/builders.js:581:    publishing_blocker: "Publishing blocker",
public/control-center/pages/integrations/builders.js:596:    impactChips.push("Publishing");
public/control-center/pages/integrations/builders.js:718:    const integrations = Array.isArray(domain.integrations) ? domain.integrations : [];
public/control-center/pages/integrations/builders.js:720:    const cards = integrations.map((integration) =>
public/control-center/pages/integrations/render.js:2:  Integrations OS Render Layer
public/control-center/pages/integrations/render.js:34:      : `<p class="ai-smart-rec-healthy-copy">All connectors are active. No additional setup is required right now.</p>`;
public/control-center/pages/integrations/render.js:86:            Open setup drawer
public/control-center/pages/integrations/render.js:88:          <span class="ai-smart-rec-cta-note">Opens the ${esc(card.label)} setup drawer and focuses the first required field.</span>
public/control-center/pages/integrations/render.js:144:        No critical missing integrations are currently flagged.
public/control-center/pages/integrations/drawer.js:2:  Integrations OS Drawer
public/control-center/pages/integrations/drawer.js:29:        <label class="setup-label" for="integration-${esc(integrationId)}-${esc(field.key)}">${esc(field.label)}</label>
public/control-center/pages/integrations/drawer.js:30:        ${options.suggestion ? `<span class="integration-field-chip">Suggested from Setup</span>` : ""}
public/control-center/pages/integrations/drawer.js:34:        class="setup-input${invalidClass}"
public/control-center/pages/integrations/drawer.js:44:      <div class="setup-helper" data-integration-field-helper="${esc(integrationId)}:${esc(field.key)}"></div>
public/control-center/pages/integrations/drawer.js:104:    return { action: "connect", label: "Complete setup" };
public/control-center/pages/integrations/drawer.js:187:  const hasOAuthSetup = Boolean(card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth");
public/control-center/pages/integrations/drawer.js:188:  const setupMethod = card.backendSupported === false
public/control-center/pages/integrations/drawer.js:190:    : hasOAuthSetup
public/control-center/pages/integrations/drawer.js:331:              : "Access needed: Setup details below"
public/control-center/pages/integrations/drawer.js:333:          <span class="integration-requirement-pill">${esc(`Setup method: ${setupMethod}`)}</span>
public/control-center/pages/integrations/drawer.js:423:        aria-label="Close setup drawer"
public/control-center/pages/integrations/drawer.js:431:        aria-label="${esc(card.label)} setup"
public/control-center/pages/integrations/state.js:2:  Integrations OS State Layer
public/control-center/pages/integrations/state.js:10:const integrationSessions = new Map();
public/control-center/pages/integrations/state.js:21:export function ensureIntegrationSession(projectName) {
public/control-center/pages/integrations/state.js:24:  if (!integrationSessions.has(key)) {
public/control-center/pages/integrations/state.js:25:    integrationSessions.set(key, {
public/control-center/pages/integrations/state.js:39:  return integrationSessions.get(key);
public/control-center/pages/integrations/state.js:90:export function getIntegrationSessionsForDebug() {
public/control-center/pages/integrations/state.js:91:  return integrationSessions;
public/control-center/pages/integrations/utils.js:2:  Integrations OS Utilities
public/control-center/pages/integrations/utils.js:92:export function buildIntegrationSearchText(integration) {
public/control-center/pages/governance.js:1:// --- Governance Evidence Summary & Intake Patch ---
public/control-center/pages/governance.js:7:function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
public/control-center/pages/governance.js:20:    library: [],
public/control-center/pages/governance.js:23:  const sources = [selectedItem, projectData, governanceData];
public/control-center/pages/governance.js:38:      else if (/library/.test(key)) evidence.library.push(v);
public/control-center/pages/governance.js:62:  if (s.includes("library")) return "library";
public/control-center/pages/governance.js:77:function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
public/control-center/pages/governance.js:78:  const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
public/control-center/pages/governance.js:81:    <div class="governance-evidence-summary">
public/control-center/pages/governance.js:82:      <div class="governance-evidence-summary-header">Evidence Summary</div>
public/control-center/pages/governance.js:83:      <div class="governance-evidence-cards">
public/control-center/pages/governance.js:84:        <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:85:          <span class="governance-evidence-label">Source of Truth</span>
public/control-center/pages/governance.js:86:          <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
public/control-center/pages/governance.js:88:        <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:89:          <span class="governance-evidence-label">Legal</span>
public/control-center/pages/governance.js:90:          <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
public/control-center/pages/governance.js:92:        <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:93:          <span class="governance-evidence-label">Pricing</span>
public/control-center/pages/governance.js:94:          <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
public/control-center/pages/governance.js:96:        <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:97:          <span class="governance-evidence-label">Certificate/Proof</span>
public/control-center/pages/governance.js:98:          <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
public/control-center/pages/governance.js:100:        <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:101:          <span class="governance-evidence-label">Brand Asset</span>
public/control-center/pages/governance.js:102:          <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
public/control-center/pages/governance.js:104:        <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:105:          <span class="governance-evidence-label">Product Asset</span>
public/control-center/pages/governance.js:106:          <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
public/control-center/pages/governance.js:109:      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
public/control-center/pages/governance.js:110:      <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
public/control-center/pages/governance.js:115:function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
public/control-center/pages/governance.js:116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
public/control-center/pages/governance.js:119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
public/control-center/pages/governance.js:122:  if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
public/control-center/pages/governance.js:125:  if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
public/control-center/pages/governance.js:127:    <div class="governance-intake-panel">
public/control-center/pages/governance.js:128:      <div class="governance-intake-panel-header">Incoming Review Context</div>
public/control-center/pages/governance.js:129:      <div class="governance-intake-list">
public/control-center/pages/governance.js:131:          <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
public/control-center/pages/governance.js:132:        `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
public/control-center/pages/governance.js:140:  fetchProjectGovernance,
public/control-center/pages/governance.js:141:  updateProjectGovernancePolicy
public/control-center/pages/governance.js:144:const governanceSessions = new Map();
public/control-center/pages/governance.js:188:    return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
public/control-center/pages/governance.js:192:    return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
public/control-center/pages/governance.js:196:    return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
public/control-center/pages/governance.js:199:  return "Submit reviewed Governance decision? This records a backend reviewed decision and may update linked queues or review state. It does not publish or execute directly.";
public/control-center/pages/governance.js:202:function confirmGovernanceDecision(decision) {
public/control-center/pages/governance.js:209:  if (!governanceSessions.has(key)) {
public/control-center/pages/governance.js:210:    governanceSessions.set(key, {
public/control-center/pages/governance.js:219:  return governanceSessions.get(key);
public/control-center/pages/governance.js:222:function getSettingsDraftFromPolicy(summary) {
public/control-center/pages/governance.js:223:  return asObject(asObject(summary?.policy).settings_bridge?.form);
public/control-center/pages/governance.js:226:function mapSettingsToGovernancePolicy(settings = {}) {
public/control-center/pages/governance.js:227:  const approval = asObject(settings.approval);
public/control-center/pages/governance.js:228:  const publishing = asObject(settings.publishing);
public/control-center/pages/governance.js:229:  const safety = asObject(settings.safety);
public/control-center/pages/governance.js:230:  const ai = asObject(settings.ai);
public/control-center/pages/governance.js:231:  const operating = asObject(settings.operating);
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:246:      publishing: asString(settings.team?.publishAccess) || "Publisher",
public/control-center/pages/governance.js:250:    settings_bridge: {
public/control-center/pages/governance.js:251:      source: "settings-durable-record",
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:267:async function loadGovernance(projectName, session, rerender) {
public/control-center/pages/governance.js:275:    session.summary = await fetchProjectGovernance(projectName, {
public/control-center/pages/governance.js:280:    session.error = error.message || "Failed to load governance console.";
public/control-center/pages/governance.js:287:async function refreshGovernance(projectName, session, rerender, showError) {
public/control-center/pages/governance.js:289:  await loadGovernance(projectName, session, rerender);
public/control-center/pages/governance.js:297:    <div class="governance-metric">
public/control-center/pages/governance.js:313:      <div class="governance-card-list">
public/control-center/pages/governance.js:315:          <div class="governance-card">
public/control-center/pages/governance.js:316:            <div class="governance-card-head">
public/control-center/pages/governance.js:344:    <div class="governance-flag-list">
public/control-center/pages/governance.js:346:        <div class="governance-flag">
public/control-center/pages/governance.js:366:    <article class="governance-card">
public/control-center/pages/governance.js:367:      <div class="governance-card-head">
public/control-center/pages/governance.js:374:      <div class="governance-meta">
public/control-center/pages/governance.js:380:      <p class="governance-copy">${escapeHtml(item.summary || "Awaiting review and decision.")}</p>
public/control-center/pages/governance.js:382:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
public/control-center/pages/governance.js:383:      <div class="governance-actions">
public/control-center/pages/governance.js:384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Reviewed Approval</button>
public/control-center/pages/governance.js:385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
public/control-center/pages/governance.js:386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
public/control-center/pages/governance.js:387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
public/control-center/pages/governance.js:388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record High-Risk Override</button>
public/control-center/pages/governance.js:391:        <div class="governance-history">
public/control-center/pages/governance.js:393:            <div class="governance-history-item">
public/control-center/pages/governance.js:413:    <article class="governance-card">
public/control-center/pages/governance.js:414:      <div class="governance-card-head">
public/control-center/pages/governance.js:421:      <div class="governance-meta">
public/control-center/pages/governance.js:431:        <div class="governance-actions">
public/control-center/pages/governance.js:435:            data-governance-request-approval="true"
public/control-center/pages/governance.js:438:            data-title="${escapeHtml(item.title || "Governance review")}"
public/control-center/pages/governance.js:440:            data-summary="${escapeHtml(flags.map((flag) => flag.message).join(" | ") || "Governance review requested.")}"
public/control-center/pages/governance.js:456:    <div class="governance-timeline">
public/control-center/pages/governance.js:458:        <div class="governance-timeline-item">
public/control-center/pages/governance.js:459:          <div class="governance-timeline-dot"></div>
public/control-center/pages/governance.js:460:          <div class="governance-timeline-copy">
public/control-center/pages/governance.js:471:function renderPolicyControls(summary, settingsDraft, escapeHtml) {
public/control-center/pages/governance.js:477:    <div class="governance-policy-grid">
public/control-center/pages/governance.js:478:      <label class="settings-toggle" for="governance-approval-before-publish">
public/control-center/pages/governance.js:479:        <span class="settings-field-label">Require approval before publishing mutations</span>
public/control-center/pages/governance.js:480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
public/control-center/pages/governance.js:481:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:483:      <label class="settings-toggle" for="governance-claim-review">
public/control-center/pages/governance.js:484:        <span class="settings-field-label">Claim review required</span>
public/control-center/pages/governance.js:485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:486:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:488:      <label class="settings-toggle" for="governance-brand-safety">
public/control-center/pages/governance.js:489:        <span class="settings-field-label">Brand safety review required</span>
public/control-center/pages/governance.js:490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:491:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:493:      <label class="settings-toggle" for="governance-auto-escalate">
public/control-center/pages/governance.js:494:        <span class="settings-field-label">Auto-escalate critical risk</span>
public/control-center/pages/governance.js:495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
public/control-center/pages/governance.js:496:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:498:      <label class="settings-toggle" for="governance-admin-override">
public/control-center/pages/governance.js:499:        <span class="settings-field-label">Allow governed admin override</span>
public/control-center/pages/governance.js:500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
public/control-center/pages/governance.js:501:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:503:      <label class="settings-toggle" for="governance-freeze-publishing">
public/control-center/pages/governance.js:504:        <span class="settings-field-label">Freeze publishing mutations</span>
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:506:        <span class="settings-toggle-pill" aria-hidden="true"></span>
public/control-center/pages/governance.js:508:      <div class="settings-field-block">
public/control-center/pages/governance.js:509:        <label class="settings-field-label" for="governance-owner-content">Content owner</label>
public/control-center/pages/governance.js:510:        <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
public/control-center/pages/governance.js:512:      <div class="settings-field-block">
public/control-center/pages/governance.js:513:        <label class="settings-field-label" for="governance-owner-media">Media owner</label>
public/control-center/pages/governance.js:514:        <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
public/control-center/pages/governance.js:516:      <div class="settings-field-block">
public/control-center/pages/governance.js:517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
public/control-center/pages/governance.js:518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
public/control-center/pages/governance.js:588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
public/control-center/pages/governance.js:597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
public/control-center/pages/governance.js:620:function buildGovernancePrompts(projectName, selectedItem, focusLabel) {
public/control-center/pages/governance.js:622:  const itemLabel = asString(selectedItem?.queue_title || selectedItem?.title || "the selected governance item");
public/control-center/pages/governance.js:625:      label: "Summarize governance state",
public/control-center/pages/governance.js:626:      preview: "Explain the current approval pressure, risk level, and next governance priority.",
public/control-center/pages/governance.js:627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
public/control-center/pages/governance.js:631:      preview: "Explain the selected governance item and what decision path is safest.",
public/control-center/pages/governance.js:632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
public/control-center/pages/governance.js:635:      label: "Find governance gaps",
public/control-center/pages/governance.js:636:      preview: "Identify the highest-risk governance gaps and what rules or ownership need tightening.",
public/control-center/pages/governance.js:637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:655:    blockers.push("Publishing is currently frozen by governance policy.");
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
public/control-center/pages/governance.js:676:    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
public/control-center/pages/governance.js:698:function governanceRiskRank(value) {
public/control-center/pages/governance.js:710:    return governanceRiskRank(item.queue_risk) > governanceRiskRank(highest.queue_risk) ? item : highest;
public/control-center/pages/governance.js:718:function getGovernanceEscalationRoute(summary, risk) {
public/control-center/pages/governance.js:732:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:733:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:738:                <h3>Governance command center</h3>
public/control-center/pages/governance.js:739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
public/control-center/pages/governance.js:760:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:761:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:766:                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:767:                <p>Preparing the governance operating surface.</p>
public/control-center/pages/governance.js:779:            <div class="empty-box">Loading governance console...</div>
public/control-center/pages/governance.js:788:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:789:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:794:                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:795:                <p>Governance surface is available but the latest data could not be loaded.</p>
public/control-center/pages/governance.js:816:  const settingsDraft = getSettingsDraftFromPolicy(summary);
public/control-center/pages/governance.js:839:  const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/governance.js:843:  const settingsBridge = asObject(policy.settings_bridge);
public/control-center/pages/governance.js:851:    "Governance owner";
public/control-center/pages/governance.js:855:  const escalationRoute = getGovernanceEscalationRoute(summary, highestRiskValue || "high");
public/control-center/pages/governance.js:857:  const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");
public/control-center/pages/governance.js:860:    <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:861:      <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:862:        <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
public/control-center/pages/governance.js:863:          <div class="panel-header mhos-context-main governance-operating-header-main">
public/control-center/pages/governance.js:865:              <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
public/control-center/pages/governance.js:866:              <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
public/control-center/pages/governance.js:869:            <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
public/control-center/pages/governance.js:872:          <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
public/control-center/pages/governance.js:873:            <article class="mhos-executive-summary-item governance-summary-readiness">
public/control-center/pages/governance.js:878:            <article class="mhos-executive-summary-item governance-summary-approval">
public/control-center/pages/governance.js:883:            <article class="mhos-executive-summary-item governance-summary-escalation">
public/control-center/pages/governance.js:888:            <article class="mhos-executive-summary-item governance-summary-owner">
public/control-center/pages/governance.js:893:            <article class="mhos-executive-summary-item governance-summary-risk">
public/control-center/pages/governance.js:898:            <article class="mhos-executive-summary-item governance-summary-ai-boundary">
public/control-center/pages/governance.js:900:              <strong class="mhos-executive-metric-value governance-ai-boundary">Prepare / Review / Summarize Only</strong>
public/control-center/pages/governance.js:901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve or change policy. Human backend decision required.</small>
public/control-center/pages/governance.js:905:          <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:906:            <div class="governance-policy-block mhos-executive-panel">
public/control-center/pages/governance.js:907:              <h4>Next best governance action</h4>
public/control-center/pages/governance.js:908:              <p class="governance-copy mhos-executive-guidance">${escapeHtml(readiness.nextBestAction)}</p>
public/control-center/pages/governance.js:909:              <div class="governance-rule-list">
public/control-center/pages/governance.js:910:                <div class="governance-rule-item">
public/control-center/pages/governance.js:914:                <div class="governance-rule-item">
public/control-center/pages/governance.js:919:              <div class="governance-actions std-action-row">
public/control-center/pages/governance.js:920:                <button class="btn btn-secondary" type="button" data-governance-focus="all">View Full Queue</button>
public/control-center/pages/governance.js:921:                <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Open Approvals</button>
public/control-center/pages/governance.js:922:                <button class="btn btn-secondary" type="button" data-governance-open-ai>Ask AI for Guidance</button>
public/control-center/pages/governance.js:925:            <div class="governance-policy-block">
public/control-center/pages/governance.js:927:              <div class="governance-activity-list">
public/control-center/pages/governance.js:930:                    <div class="governance-activity-item">
public/control-center/pages/governance.js:935:                  : `<div class="empty-box">No active governance blockers detected.</div>`}
public/control-center/pages/governance.js:938:            <div class="governance-policy-block">
public/control-center/pages/governance.js:940:              <div class="governance-rule-list">
public/control-center/pages/governance.js:941:                <div class="governance-rule-item">
public/control-center/pages/governance.js:945:                <div class="governance-rule-item">
public/control-center/pages/governance.js:953:          <div class="governance-actions std-action-row mhos-executive-action-row">
public/control-center/pages/governance.js:954:            <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance Data</button>
public/control-center/pages/governance.js:955:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI Context</button>
public/control-center/pages/governance.js:956:            <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Focus Approvals</button>
public/control-center/pages/governance.js:960:        <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
public/control-center/pages/governance.js:964:              <h3>Governance signal inventory</h3>
public/control-center/pages/governance.js:968:          <div class="governance-overview-grid">
public/control-center/pages/governance.js:976:          <div class="governance-activity-list">
public/control-center/pages/governance.js:979:                <div class="governance-activity-item">
public/control-center/pages/governance.js:988:        <div class="governance-workspace-grid">
public/control-center/pages/governance.js:989:          <div class="governance-action-stack std-main-column mhos-clean-stack">
public/control-center/pages/governance.js:995:                  <p>Rules, owners, and Settings bridge state.</p>
public/control-center/pages/governance.js:998:              <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:999:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1001:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1003:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1010:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1012:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1014:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1021:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1023:                  ${renderPolicyControls(summary, settingsDraft, escapeHtml)}
public/control-center/pages/governance.js:1025:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1029:                    <strong>Settings bridge:</strong> ${escapeHtml(settingsBridge.source || "Not synced")} • approval mode ${escapeHtml(settingsBridge.approval_mode || "unknown")} • claim mode ${escapeHtml(settingsBridge.claim_safety_mode || "unknown")} • synced ${escapeHtml(settingsBridge.synced_at ? formatDateTime(settingsBridge.synced_at) : "not yet")}
public/control-center/pages/governance.js:1039:                  <h3>Pending approvals and governance decisions</h3>
public/control-center/pages/governance.js:1044:              <div class="governance-focus-tabs">
public/control-center/pages/governance.js:1053:                  <button class="governance-focus-tab${session.focus === value ? " is-active" : ""}" type="button" data-governance-focus="${escapeHtml(value)}">
public/control-center/pages/governance.js:1077:                            <button class="governance-select-link" type="button" data-governance-select="${escapeHtml(item.selected_key)}">
public/control-center/pages/governance.js:1088:                      : `<tr><td colspan="6"><div class="empty-box">No governance items are visible in this focus state.</div></td></tr>`}
public/control-center/pages/governance.js:1095:          <div class="governance-action-stack std-right-rail mhos-clean-stack">
public/control-center/pages/governance.js:1100:                <h3>${escapeHtml(selectedItem?.queue_title || "Select a governance item")}</h3>
public/control-center/pages/governance.js:1101:                  <p>${escapeHtml(selectedItem ? "Review risk, owner, evidence, and linked approval before decision." : "Choose a governance item from the queue to inspect it.")}</p>
public/control-center/pages/governance.js:1107:                  <div class="governance-selected-summary">
public/control-center/pages/governance.js:1111:                  <div class="simple-banner"><strong>Authority focus:</strong> ${escapeHtml(selectedItem.queue_owner || authorityOwner)} owns this ${escapeHtml(titleCase(selectedItem.queue_risk || "medium"))} ${escapeHtml(titleCase(selectedItem.queue_kind || "governance"))} review.</div>
public/control-center/pages/governance.js:1113:                  ${renderGovernanceEvidenceSummary({
public/control-center/pages/governance.js:1116:                    governanceData: session.summary,
public/control-center/pages/governance.js:1129:                        intakeContext.publishing = getSharedHandoff(projectName, "publishing", operations)?.payload?.summary;
public/control-center/pages/governance.js:1130:                        intakeContext.content = getSharedHandoff(projectName, "content-studio", operations)?.payload?.summary;
public/control-center/pages/governance.js:1131:                        intakeContext.media = getSharedHandoff(projectName, "media-studio", operations)?.payload?.summary;
public/control-center/pages/governance.js:1132:                        intakeContext.workflows = getSharedHandoff(projectName, "workflows", operations)?.payload?.summary;
public/control-center/pages/governance.js:1135:                        intakeContext.insights = getSharedHandoff(projectName, "insights", operations)?.payload?.summary;
public/control-center/pages/governance.js:1138:                    return renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext });
public/control-center/pages/governance.js:1140:                  <div class="governance-selected-grid">
public/control-center/pages/governance.js:1141:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1145:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1149:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1153:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1157:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1161:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1179:                        <div class="governance-activity-list">
public/control-center/pages/governance.js:1181:                            <div class="governance-activity-item">
public/control-center/pages/governance.js:1191:                : `<div class="empty-box">No governance item is selected.</div>`
public/control-center/pages/governance.js:1200:                <div class="panel-kicker">Governance actions</div>
public/control-center/pages/governance.js:1205:            <div class="governance-action-stack">
public/control-center/pages/governance.js:1206:              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed backend decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation, evidence review, and backend authority remains enforced.</div>
public/control-center/pages/governance.js:1207:              <div class="simple-banner"><strong>Safe execution path:</strong> Review selected context, verify evidence, add rationale, submit one reviewed Governance decision, then refresh and validate queue impact.</div>
public/control-center/pages/governance.js:1208:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
public/control-center/pages/governance.js:1209:              <div class="governance-actions std-action-row">
public/control-center/pages/governance.js:1210:                <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
public/control-center/pages/governance.js:1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Backend Governance Policy</button>
public/control-center/pages/governance.js:1212:                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings-Derived Rules</button>
public/control-center/pages/governance.js:1216:                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Reviewed Approval</button>
public/control-center/pages/governance.js:1217:                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
public/control-center/pages/governance.js:1218:                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
public/control-center/pages/governance.js:1219:                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
public/control-center/pages/governance.js:1220:                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record High-Risk Override</button>
public/control-center/pages/governance.js:1230:                        data-governance-request-approval="true"
public/control-center/pages/governance.js:1233:                        data-title="${escapeHtml(selectedItem.queue_title || "Governance review")}"
public/control-center/pages/governance.js:1235:                        data-summary="${escapeHtml(selectedItem.queue_summary || "Governance review requested.")}"
public/control-center/pages/governance.js:1243:              <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:1244:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1246:                  <div class="governance-activity-list">
public/control-center/pages/governance.js:1249:                        <div class="governance-activity-item">
public/control-center/pages/governance.js:1257:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1259:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1261:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1278:              <h3>Governance AI assistant</h3>
public/control-center/pages/governance.js:1282:          <div class="simple-banner"><strong>AI guidance scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
public/control-center/pages/governance.js:1283:          <div class="governance-ai-toolbar">
public/control-center/pages/governance.js:1284:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
public/control-center/pages/governance.js:1288:              <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
public/control-center/pages/governance.js:1289:                <span class="home-action-title">${escapeHtml(item.label)}</span>
public/control-center/pages/governance.js:1290:                <span class="home-action-meta">${escapeHtml(item.preview)}</span>
public/control-center/pages/governance.js:1300:function bindGovernance(context, projectName, session) {
public/control-center/pages/governance.js:1306:    bindGovernance(context, projectName, session);
public/control-center/pages/governance.js:1309:  Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
public/control-center/pages/governance.js:1312:      const decision = button.getAttribute("data-governance-decision") || "";
public/control-center/pages/governance.js:1313:      const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
public/control-center/pages/governance.js:1317:      if (!confirmGovernanceDecision(decision)) {
public/control-center/pages/governance.js:1325:          actor: "governance-console",
public/control-center/pages/governance.js:1329:        await refreshGovernance(projectName, session, rerender, context.showError);
public/control-center/pages/governance.js:1336:  Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
public/control-center/pages/governance.js:1338:      session.focus = button.getAttribute("data-governance-focus") || "all";
public/control-center/pages/governance.js:1343:  Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
public/control-center/pages/governance.js:1345:      session.selectedKey = button.getAttribute("data-governance-select") || "";
public/control-center/pages/governance.js:1350:  Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
public/control-center/pages/governance.js:1357:          title: `${button.getAttribute("data-title") || "Governance item"} approval`,
public/control-center/pages/governance.js:1358:          summary: button.getAttribute("data-summary") || "Governance review requested.",
public/control-center/pages/governance.js:1361:          requested_by: "governance-console",
public/control-center/pages/governance.js:1364:          source_page: "governance",
public/control-center/pages/governance.js:1365:          route_target: "governance"
public/control-center/pages/governance.js:1367:        context.showMessage("Approval request added to the governance queue.");
public/control-center/pages/governance.js:1368:        await refreshGovernance(projectName, session, rerender, context.showError);
public/control-center/pages/governance.js:1375:  Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
public/control-center/pages/governance.js:1377:      const action = button.getAttribute("data-governance-action");
public/control-center/pages/governance.js:1380:        await refreshGovernance(projectName, session, rerender, context.showError);
public/control-center/pages/governance.js:1386:        Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
public/control-center/pages/governance.js:1387:          policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
public/control-center/pages/governance.js:1391:        Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
public/control-center/pages/governance.js:1392:          approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
public/control-center/pages/governance.js:1395:        const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
public/control-center/pages/governance.js:1401:          await updateProjectGovernancePolicy(projectName, {
public/control-center/pages/governance.js:1402:            actor: "governance-console",
public/control-center/pages/governance.js:1406:          context.showMessage("Backend Governance policy saved.");
public/control-center/pages/governance.js:1407:          await refreshGovernance(projectName, session, rerender, context.showError);
public/control-center/pages/governance.js:1409:          context.showError(error.message || "Failed to save governance policy.");
public/control-center/pages/governance.js:1414:      if (action === "sync-settings") {
public/control-center/pages/governance.js:1415:        const settingsDraft = getSettingsDraftFromPolicy(session.summary);
public/control-center/pages/governance.js:1416:        if (!Object.keys(settingsDraft).length) {
public/control-center/pages/governance.js:1417:          context.showError("No durable Settings snapshot was found in the governance bridge for this project.");
public/control-center/pages/governance.js:1421:        const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
public/control-center/pages/governance.js:1427:          await updateProjectGovernancePolicy(projectName, {
public/control-center/pages/governance.js:1428:            actor: "governance-console",
public/control-center/pages/governance.js:1429:            ...mapSettingsToGovernancePolicy(settingsDraft)
public/control-center/pages/governance.js:1431:          context.showMessage("Settings-derived rules synced into durable Governance policy.");
public/control-center/pages/governance.js:1432:          await refreshGovernance(projectName, session, rerender, context.showError);
public/control-center/pages/governance.js:1434:          context.showError(error.message || "Failed to sync Settings into Governance.");
public/control-center/pages/governance.js:1440:  Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
public/control-center/pages/governance.js:1442:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1448:  const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/governance.js:1449:  Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
public/control-center/pages/governance.js:1451:      const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];
public/control-center/pages/governance.js:1454:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1455:      context.showMessage?.("Governance prompt added to AI Command.");
public/control-center/pages/governance.js:1460:export const governanceRoute = {
public/control-center/pages/governance.js:1461:  id: "governance",
public/control-center/pages/governance.js:1465:    title: "Governance",
public/control-center/pages/governance.js:1466:    description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."
public/control-center/pages/governance.js:1468:  template: `<section class="page is-active" data-page="governance"><div class="governance-shell"></div></section>`,
public/control-center/pages/governance.js:1479:      bindGovernance(context, projectName, session);
public/control-center/pages/governance.js:1483:      loadGovernance(projectName, session, rerender);
public/control-center/pages/integrations.js:17:} from "./integrations/builders.js";
public/control-center/pages/integrations.js:19:import { renderIntegrationDrawer } from "./integrations/drawer.js";
public/control-center/pages/integrations.js:24:} from "./integrations/cards.js";
public/control-center/pages/integrations.js:33:} from "./integrations/render.js";
public/control-center/pages/integrations.js:35:const integrationSessions = new Map();
public/control-center/pages/integrations.js:44:    integrations: [
public/control-center/pages/integrations.js:87:        whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
public/control-center/pages/integrations.js:139:    description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
public/control-center/pages/integrations.js:140:    integrations: [
public/control-center/pages/integrations.js:146:        purpose: "Page insights, post performance, engagement, and linked business intelligence.",
public/control-center/pages/integrations.js:147:        whyItMatters: "Facebook insights help the system understand what posts drive reach, clicks, and downstream action.",
public/control-center/pages/integrations.js:148:        enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
public/control-center/pages/integrations.js:149:        dataScope: ["Post insights", "Engagement", "Comments", "Publishing", "Ads linkage"],
public/control-center/pages/integrations.js:166:        enables: "Post insights, reel insights, engagement, comments, publishing, and business account analytics.",
public/control-center/pages/integrations.js:167:        dataScope: ["Posts", "Reels", "Engagement", "Comments", "Publishing"],
public/control-center/pages/integrations.js:184:        enables: "Video insights, engagement, comments, profile metrics, and future publishing support.",
public/control-center/pages/integrations.js:185:        dataScope: ["Video insights", "Engagement", "Comments", "Audience", "Publishing"],
public/control-center/pages/integrations.js:202:        enables: "Video insights, watch metrics, subscriber trends, comments, and publishing context.",
public/control-center/pages/integrations.js:203:        dataScope: ["Videos", "Views", "Watch time", "Engagement", "Publishing"],
public/control-center/pages/integrations.js:218:        purpose: "Future-ready business profile insight and publishing connection for LinkedIn surfaces.",
public/control-center/pages/integrations.js:220:        enables: "Post insights, audience signals, company page analytics, and publishing support.",
public/control-center/pages/integrations.js:221:        dataScope: ["Posts", "Audience", "Engagement", "Publishing"],
public/control-center/pages/integrations.js:236:    integrations: [
public/control-center/pages/integrations.js:347:    integrations: [
public/control-center/pages/integrations.js:375:        purpose: "Provider-specific email platform integration for campaigns and audience workflows.",
public/control-center/pages/integrations.js:429:    integrations: [
public/control-center/pages/integrations.js:488:    description: "Workspace, automation, webhook, and operations tools that keep workflows moving.",
public/control-center/pages/integrations.js:489:    integrations: [
public/control-center/pages/integrations.js:580:        purpose: "Internal system-to-system webhook integration for custom workflows and events.",
public/control-center/pages/integrations.js:633:function getAllIntegrations() {
public/control-center/pages/integrations.js:635:    domain.integrations.map((integration) => ({
public/control-center/pages/integrations.js:644:  return getAllIntegrations().find((item) => item.id === integrationId) || null;
public/control-center/pages/integrations.js:649:  if (!integrationSessions.has(key)) {
public/control-center/pages/integrations.js:650:    integrationSessions.set(key, {
public/control-center/pages/integrations.js:667:  return integrationSessions.get(key);
public/control-center/pages/integrations.js:694:function getIntegrationsScrollTarget() {
public/control-center/pages/integrations.js:699:  const page = document.querySelector('[data-page="integrations"]');
public/control-center/pages/integrations.js:714:function captureIntegrationsScrollState() {
public/control-center/pages/integrations.js:715:  const target = getIntegrationsScrollTarget();
public/control-center/pages/integrations.js:730:function restoreIntegrationsScrollState(scrollState) {
public/control-center/pages/integrations.js:734:  const target = getIntegrationsScrollTarget();
public/control-center/pages/integrations.js:754:  session.drawerOriginScrollState = captureIntegrationsScrollState();
public/control-center/pages/integrations.js:764:  session.restoreScrollState = session.drawerOriginScrollState || captureIntegrationsScrollState();
public/control-center/pages/integrations.js:787:    restoreIntegrationsScrollState(restoreState);
public/control-center/pages/integrations.js:838:function getProjectSetupOverview(state) {
public/control-center/pages/integrations.js:843:  const overview = getProjectSetupOverview(state);
public/control-center/pages/integrations.js:900:  if (card.backendSupported === false) return "Open setup";
public/control-center/pages/integrations.js:902:  if (card.statusLabel === "Partial") return "Complete setup";
public/control-center/pages/integrations.js:910:    return { action: "select", label: "Open setup" };
public/control-center/pages/integrations.js:970:  return asObject(asObject(state.data?.integrations).control_center);
public/control-center/pages/integrations.js:978:  return asObject(asObject(asObject(state.data?.integrations).sources).sources);
public/control-center/pages/integrations.js:997:    { key: "posts", pattern: /post|reel|video|comment|publishing|profile|channel/ },
public/control-center/pages/integrations.js:998:    { key: "insights", pattern: /insight|engagement|watch|audience|query|ctr|position|seo|analytics|performance/ },
public/control-center/pages/integrations.js:1014:      read: [...new Set(["posts", "insights", ...scopeKeys])],
public/control-center/pages/integrations.js:1015:      write: ["publishing", "audience updates"]
public/control-center/pages/integrations.js:1149:    return { label: "Open setup", action: "select" };
public/control-center/pages/integrations.js:1166:  if (statusKey === "needs_setup") {
public/control-center/pages/integrations.js:1167:    return { label: "Complete setup", action: "select" };
public/control-center/pages/integrations.js:1216:      showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1227:      showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1307:      showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1536:      navigateTo("ai-command");
public/control-center/pages/integrations.js:1549:      showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1556:export const integrationsRoute = {
public/control-center/pages/integrations.js:1557:  id: "integrations",
public/control-center/pages/integrations.js:1561:    title: "Integrations",
public/control-center/pages/integrations.js:1565:    <section class="page is-active" data-page="integrations">
public/control-center/pages/integrations.js:1566:      <div id="integrationsRoot"></div>
public/control-center/pages/integrations.js:1630:    const attentionTotal = allCards.filter((card) => ["needs_setup", "failed"].includes(getConnectorWorkspaceStatus(card))).length;
public/control-center/pages/integrations.js:1634:    const partialTotal = allCards.filter((card) => getConnectorWorkspaceStatus(card) === "needs_setup").length;
public/control-center/pages/integrations.js:1644:    const root = $("integrationsRoot");
public/control-center/pages/integrations.js:1648:      <div class="integrations-wrapper integration-system-panel">
public/control-center/pages/integrations.js:1652:              <div class="setup-kicker">Integration Control Tower</div>
public/control-center/pages/integrations.js:1654:              <p class="home-section-copy integration-system-purpose">Connect business platforms so MH-OS can sync performance, automate actions, and learn from live operating data.</p>
public/control-center/pages/integrations.js:1661:              <strong>${escapeHtml(String(overview.totalIntegrations))}</strong>
public/control-center/pages/integrations.js:1665:              <strong>${escapeHtml(String(overview.connectedIntegrations))}</strong>
public/control-center/pages/integrations.js:1703:                <button class="btn btn-primary" type="button" data-integration-select="${escapeHtml(aiRec.card.id)}">Open setup</button>
public/control-center/pages/integrations.js:1717:                  <div class="setup-kicker">Required Launch Connectors</div>
public/control-center/pages/integrations.js:1719:                  <p class="home-section-copy" style="margin:6px 0 0;">Filter by category or status, search providers, and open setup quickly.</p>
public/control-center/pages/integrations.js:1725:                  <span class="setup-label">Category</span>
public/control-center/pages/integrations.js:1732:                  <span class="setup-label">Status</span>
public/control-center/pages/integrations.js:1738:                    <option value="needs_setup" ${session.statusFilter === "needs_setup" ? "selected" : ""}>Partial</option>
public/control-center/pages/integrations.js:1742:                  <span class="setup-label">Search</span>
public/control-center/pages/integrations.js:1761:            ${selectedCard ? renderSelectedConnectorSummary(selectedCard) : `<div class="empty-box">Select a connector to open the setup drawer.</div>`}
public/control-center/pages/integrations.js:1767:                  <p class="home-section-copy" style="margin:6px 0 0;">Scan blockers, warnings, and required fixes before launch.</p>
public/control-center/pages/integrations.js:1795:                  <p class="home-section-copy" style="margin:6px 0 0;">Shows live integration events when available, otherwise derived connector checkpoints.</p>
public/control-center/pages/integrations.js:1808:              <p class="home-section-copy" style="margin:6px 0 0;">Review critical gaps, next moves, and coverage status to close launch risk.</p>
public/control-center/pages/setup.js:1:import { getMissingAssetLabels } from "../asset-library.js";
public/control-center/pages/setup.js:85:  social_channels: "Defines where campaign and publishing workflows should execute."
public/control-center/pages/setup.js:88:const SETUP_FIELD_INFO = {
public/control-center/pages/setup.js:90:  project_type: "Helps AI choose better defaults for workflows, campaigns, and recommendations.",
public/control-center/pages/setup.js:99:  social_channels: "Defines where campaigns and publishing workflows should prepare content."
public/control-center/pages/setup.js:143:function getAllSetupFieldNames() {
public/control-center/pages/setup.js:169:function getMissingFieldInsights(missingFields) {
public/control-center/pages/setup.js:173:    reason: FIELD_IMPORTANCE_REASON[field.name] || "Required to improve setup quality and downstream reliability.",
public/control-center/pages/setup.js:178:function getSetupDraftKey(projectName) {
public/control-center/pages/setup.js:179:  return `mh-control-center:setup-draft:${projectName || "default"}`;
public/control-center/pages/setup.js:182:function loadSetupDraft(projectName) {
public/control-center/pages/setup.js:186:    const raw = window.localStorage.getItem(getSetupDraftKey(projectName));
public/control-center/pages/setup.js:195:function saveSetupDraft(projectName, data) {
public/control-center/pages/setup.js:199:    window.localStorage.setItem(getSetupDraftKey(projectName), JSON.stringify(data));
public/control-center/pages/setup.js:206:function clearSetupDraft(projectName) {
public/control-center/pages/setup.js:210:    window.localStorage.removeItem(getSetupDraftKey(projectName));
public/control-center/pages/setup.js:217:function buildSetupValues(state) {
public/control-center/pages/setup.js:249:      overviewData.setup_payload?.social_channels ||
public/control-center/pages/setup.js:250:      overviewData.setup_payload?.channels ||
public/control-center/pages/setup.js:251:      overviewData.setup_payload?.social_links
public/control-center/pages/setup.js:308:function getSetupBrandStatus(values) {
public/control-center/pages/setup.js:316:function getSetupLocalizationStatus(values) {
public/control-center/pages/setup.js:324:function getSetupBusinessIdentityStatus(values) {
public/control-center/pages/setup.js:332:function getSetupContentTruthStatus(values) {
public/control-center/pages/setup.js:340:function getSetupChannelsStatus(values, missingConnectors) {
public/control-center/pages/setup.js:347:function getSetupAiGuidanceStatus(values) {
public/control-center/pages/setup.js:388:function getNextSetupActionText(missingFields, missingAssets, missingConnectors) {
public/control-center/pages/setup.js:390:    return `Complete ${missingFields.length} required setup field${missingFields.length === 1 ? "" : "s"}.`;
public/control-center/pages/setup.js:394:    return `Upload ${missingAssets.length} missing required asset${missingAssets.length === 1 ? "" : "s"} in Library.`;
public/control-center/pages/setup.js:401:  return "Save setup, then continue to Library or Integrations.";
public/control-center/pages/setup.js:426:  const infoText = SETUP_FIELD_INFO[name] || helper || "";
public/control-center/pages/setup.js:429:    <div class="setup-field-group${required && !filled ? " is-missing" : ""}" data-setup-field="${escapeHtml(name)}" data-required="${required ? "true" : "false"}">
public/control-center/pages/setup.js:430:      <div class="setup-field-head">
public/control-center/pages/setup.js:431:        <div class="setup-label-with-info">
public/control-center/pages/setup.js:432:          <label class="setup-label" for="setup-${escapeHtml(name)}">${escapeHtml(label)}</label>
public/control-center/pages/setup.js:434:        <span class="setup-field-state ${indicatorClass}" data-setup-indicator-for="${escapeHtml(name)}">${escapeHtml(indicatorText)}</span>
public/control-center/pages/setup.js:438:          ? `<textarea id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(asString(value))}</textarea>`
public/control-center/pages/setup.js:439:          : `<input id="setup-${escapeHtml(name)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(asString(value))}" placeholder="${escapeHtml(placeholder || "")}">`
public/control-center/pages/setup.js:441:      <div class="setup-helper">${escapeHtml(infoText)}</div>
public/control-center/pages/setup.js:479:function readSetupFormValues(form) {
public/control-center/pages/setup.js:490:function buildSetupPersistencePayload(values) {
public/control-center/pages/setup.js:518:function updateSetupFieldIndicators(form, values) {
public/control-center/pages/setup.js:519:  const groups = Array.from(form.querySelectorAll("[data-setup-field]"));
public/control-center/pages/setup.js:521:    const name = group.getAttribute("data-setup-field") || "";
public/control-center/pages/setup.js:524:    const indicator = group.querySelector("[data-setup-indicator-for]");
public/control-center/pages/setup.js:570:  const positioning = document.getElementById("setupAiPositioningText");
public/control-center/pages/setup.js:571:  if (positioning) positioning.textContent = compactListText([buildPositioningSuggestion(values)], "Generate positioning guidance from setup context.");
public/control-center/pages/setup.js:573:  const audience = document.getElementById("setupAiAudienceText");
public/control-center/pages/setup.js:576:  const tone = document.getElementById("setupAiToneText");
public/control-center/pages/setup.js:593:  const missingInsights = getMissingFieldInsights(missingFields);
public/control-center/pages/setup.js:595:  const allFields = getAllSetupFieldNames();
public/control-center/pages/setup.js:599:  const nextBestAction = getNextSetupActionText(missingFields, missingAssets, missingConnectors);
public/control-center/pages/setup.js:617:  const businessIdentityStatus = getSetupBusinessIdentityStatus(values);
public/control-center/pages/setup.js:618:  const brandStatus = getSetupBrandStatus(values);
public/control-center/pages/setup.js:619:  const localizationStatus = getSetupLocalizationStatus(values);
public/control-center/pages/setup.js:620:  const channelsStatus = getSetupChannelsStatus(values, missingConnectors);
public/control-center/pages/setup.js:621:  const contentTruthStatus = getSetupContentTruthStatus(values);
public/control-center/pages/setup.js:622:  const aiGuidanceStatus = getSetupAiGuidanceStatus(values);
public/control-center/pages/setup.js:624:  updateSetupFieldIndicators(form, values);
public/control-center/pages/setup.js:626:  const completionTextWide = document.getElementById("setupCompletionPercentValue");
public/control-center/pages/setup.js:629:  const topCompletionBadge = document.getElementById("setupTopCompletionBadge");
public/control-center/pages/setup.js:635:  const topReadinessBadge = document.getElementById("setupTopReadinessBadge");
public/control-center/pages/setup.js:641:  const requiredCompleteEl = document.getElementById("setupRequiredCompleted");
public/control-center/pages/setup.js:644:  const requiredTotalEl = document.getElementById("setupRequiredTotal");
public/control-center/pages/setup.js:647:  const completionBar = document.getElementById("setupCompletionBar");
public/control-center/pages/setup.js:660:  const missingCount = document.getElementById("setupMissingCount");
public/control-center/pages/setup.js:663:  const nextBestActionEl = document.getElementById("setupNextBestAction");
public/control-center/pages/setup.js:668:  const readinessMissingFieldsEl = document.getElementById("setupReadinessMissingFields");
public/control-center/pages/setup.js:673:  const readinessMissingAssetsEl = document.getElementById("setupReadinessMissingAssets");
public/control-center/pages/setup.js:678:  const readinessMissingConnectorsEl = document.getElementById("setupReadinessMissingConnectors");
public/control-center/pages/setup.js:683:  const dependencyGapCardEl = document.getElementById("setupDependencyGapCount");
public/control-center/pages/setup.js:689:    { id: "setupBusinessIdentityStatus", value: businessIdentityStatus },
public/control-center/pages/setup.js:690:    { id: "setupBrandStatus", value: brandStatus },
public/control-center/pages/setup.js:691:    { id: "setupLocalizationStatus", value: localizationStatus },
public/control-center/pages/setup.js:692:    { id: "setupChannelsStatus", value: channelsStatus },
public/control-center/pages/setup.js:693:    { id: "setupContentTruthStatus", value: contentTruthStatus },
public/control-center/pages/setup.js:694:    { id: "setupAiGuidanceStatus", value: aiGuidanceStatus }
public/control-center/pages/setup.js:705:  const readinessBadge = document.getElementById("setupReadinessBadge");
public/control-center/pages/setup.js:712:  const validationBadge = document.getElementById("setupValidationBadge");
public/control-center/pages/setup.js:718:  const missingActionList = document.getElementById("setupMissingActions");
public/control-center/pages/setup.js:720:    missingActionList.innerHTML = missingInsights.length
public/control-center/pages/setup.js:721:      ? `<div class="setup-smart-gap-list">${missingInsights.map((item) => `
public/control-center/pages/setup.js:722:          <article class="setup-smart-gap-item">
public/control-center/pages/setup.js:727:            <button class="btn btn-ghost" type="button" data-setup-jump-field="${escapeHtml(item.name)}" data-setup-jump-step="${escapeHtml(item.stepId)}">Open field</button>
public/control-center/pages/setup.js:733:  const blockerList = document.getElementById("setupSystemGaps");
public/control-center/pages/setup.js:746:  const completeNowBtn = document.getElementById("setupCompleteNowBtn");
public/control-center/pages/setup.js:764:    const badge = document.getElementById(`setupStepBadge-${step.id}`);
public/control-center/pages/setup.js:765:    const button = form.querySelector(`[data-setup-step="${step.id}"]`);
public/control-center/pages/setup.js:766:    const statusNote = form.querySelector(`[data-setup-step-note="${step.id}"]`);
public/control-center/pages/setup.js:782:      statusNote.className = `setup-smart-step-note tone-${status.tone}`;
public/control-center/pages/setup.js:791:  const recommendedTitle = document.getElementById("setupRecommendedStepTitle");
public/control-center/pages/setup.js:794:  const recommendedReason = document.getElementById("setupRecommendedStepReason");
public/control-center/pages/setup.js:797:  const recommendedBtn = document.getElementById("setupRecommendedStepBtn");
public/control-center/pages/setup.js:799:    recommendedBtn.setAttribute("data-setup-open-step", recommendedStep.id);
public/control-center/pages/setup.js:803:  const continueLibraryBtn = document.getElementById("setupContinueLibraryBtn");
public/control-center/pages/setup.js:804:  const continueIntegrationsBtn = document.getElementById("setupContinueIntegrationsBtn");
public/control-center/pages/setup.js:805:  const continueCampaignBtn = document.getElementById("setupContinueCampaignBtn");
public/control-center/pages/setup.js:810:  if (continueLibraryBtn) {
public/control-center/pages/setup.js:811:    continueLibraryBtn.disabled = false;
public/control-center/pages/setup.js:812:    continueLibraryBtn.textContent = hasMissing ? `Continue to Library (${warningText})` : "Continue to Library";
public/control-center/pages/setup.js:815:  if (continueIntegrationsBtn) {
public/control-center/pages/setup.js:816:    continueIntegrationsBtn.disabled = false;
public/control-center/pages/setup.js:817:    continueIntegrationsBtn.textContent = hasMissing ? `Continue to Integrations (${warningText})` : "Continue to Integrations";
public/control-center/pages/setup.js:825:  const stepCounter = document.getElementById("setupStepCounter");
public/control-center/pages/setup.js:834:function bindSetupActions({
public/control-center/pages/setup.js:842:  saveProjectSetup,
public/control-center/pages/setup.js:849:  const form = $("setupProjectForm");
public/control-center/pages/setup.js:852:  const stepButtons = Array.from(document.querySelectorAll("[data-setup-step]"));
public/control-center/pages/setup.js:853:  const stepActionButtons = Array.from(document.querySelectorAll("[data-setup-open-step]"));
public/control-center/pages/setup.js:854:  const stepPanels = Array.from(document.querySelectorAll("[data-setup-step-panel]"));
public/control-center/pages/setup.js:861:      const isActive = button.getAttribute("data-setup-step") === stepId;
public/control-center/pages/setup.js:867:      const isActive = panel.getAttribute("data-setup-step-panel") === stepId;
public/control-center/pages/setup.js:872:    const values = readSetupFormValues(form);
public/control-center/pages/setup.js:888:    button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);
public/control-center/pages/setup.js:893:      const stepId = button.getAttribute("data-setup-open-step") || STEP_DEFINITIONS[0].id;
public/control-center/pages/setup.js:895:      const panel = document.querySelector(`[data-setup-step-panel="${stepId}"]`);
public/control-center/pages/setup.js:900:  const prevBtn = $("setupPrevStepBtn");
public/control-center/pages/setup.js:908:  const nextBtn = $("setupNextStepBtn");
public/control-center/pages/setup.js:917:    const values = readSetupFormValues(form);
public/control-center/pages/setup.js:935:    const saved = saveSetupDraft(projectName, values);
public/control-center/pages/setup.js:949:        setupDraft: {
public/control-center/pages/setup.js:963:      saveSetupDraft(projectName, values);
public/control-center/pages/setup.js:972:  const keepSetupFieldFocused = (event) => {
public/control-center/pages/setup.js:973:    const field = event.target?.closest?.(".setup-input, .setup-textarea");
public/control-center/pages/setup.js:988:  const setupRoot = $("setupRoot") || form.closest(".setup-wizard-shell") || form;
public/control-center/pages/setup.js:990:  setupRoot.onclick = (event) => {
public/control-center/pages/setup.js:991:    const jumpBtn = event.target.closest("[data-setup-jump-field]");
public/control-center/pages/setup.js:996:    const fieldName = jumpBtn.getAttribute("data-setup-jump-field") || "";
public/control-center/pages/setup.js:997:    const stepId = jumpBtn.getAttribute("data-setup-jump-step") || getFieldStepId(fieldName);
public/control-center/pages/setup.js:1017:  const saveDraftBtn = $("setupSaveDraftBtn");
public/control-center/pages/setup.js:1024:  const saveBackendBtn = $("setupSaveBackendBtn");
public/control-center/pages/setup.js:1028:        showError?.("Select a project before saving Setup changes.");
public/control-center/pages/setup.js:1034:      const payload = buildSetupPersistencePayload(values);
public/control-center/pages/setup.js:1039:      showMessage?.(`Saving setup for ${draftKeyName}...`);
public/control-center/pages/setup.js:1042:        await saveProjectSetup?.(projectName, payload);
public/control-center/pages/setup.js:1043:        clearSetupDraft(projectName);
public/control-center/pages/setup.js:1051:        showMessage?.(`Setup saved for ${draftKeyName}.${renameWarning}`);
public/control-center/pages/setup.js:1054:        showError?.(error.message || `Failed to save Setup changes for ${draftKeyName}.`);
public/control-center/pages/setup.js:1066:  const resetBtn = $("setupResetDraftBtn");
public/control-center/pages/setup.js:1069:      clearSetupDraft(projectName);
public/control-center/pages/setup.js:1070:      navigateTo("setup");
public/control-center/pages/setup.js:1072:        showMessage(`Local setup draft cleared for ${draftKeyName}.`);
public/control-center/pages/setup.js:1077:  const aiPositioningBtn = $("setupAiPositioningBtn");
public/control-center/pages/setup.js:1090:  const aiAudienceBtn = $("setupAiAudienceBtn");
public/control-center/pages/setup.js:1103:  const aiToneBtn = $("setupAiToneBtn");
public/control-center/pages/setup.js:1116:  const aiFillBtn = $("setupAiFillMissingBtn");
public/control-center/pages/setup.js:1144:  const aiCommandBtn = $("setupAiCommandBtn");
public/control-center/pages/setup.js:1151:        input.value = `Suggest final setup completion for ${draftKeyName}. Missing fields: ${missingFields.length ? missingFields.join(", ") : "none"}. Include positioning, audience, and tone guidance.`;
public/control-center/pages/setup.js:1153:      navigateTo("ai-command");
public/control-center/pages/setup.js:1154:      showMessage?.("Setup context sent to AI Command.");
public/control-center/pages/setup.js:1158:  const validateNowBtn = $("setupValidateNowBtn");
public/control-center/pages/setup.js:1161:      const target = $("setupSaveBackendBtn");
public/control-center/pages/setup.js:1168:  const continueLibraryBtn = $("setupContinueLibraryBtn");
public/control-center/pages/setup.js:1169:  if (continueLibraryBtn) {
public/control-center/pages/setup.js:1170:    continueLibraryBtn.onclick = () => {
public/control-center/pages/setup.js:1171:      navigateTo("library");
public/control-center/pages/setup.js:1175:  const continueIntegrationsBtn = $("setupContinueIntegrationsBtn");
public/control-center/pages/setup.js:1176:  if (continueIntegrationsBtn) {
public/control-center/pages/setup.js:1177:    continueIntegrationsBtn.onclick = () => {
public/control-center/pages/setup.js:1178:      navigateTo("integrations");
public/control-center/pages/setup.js:1182:  const continueCampaignBtn = $("setupContinueCampaignBtn");
public/control-center/pages/setup.js:1185:      navigateTo("campaign-studio");
public/control-center/pages/setup.js:1189:  const reviewMissingBtn = $("setupReviewMissingBtn");
public/control-center/pages/setup.js:1195:        showMessage?.("No required setup gaps found.");
public/control-center/pages/setup.js:1205:      showMessage?.(`Reviewing missing setup items (${missing.length}).`);
public/control-center/pages/setup.js:1209:  const reviewReadinessBtn = $("setupReviewReadinessBtn");
public/control-center/pages/setup.js:1212:      navigateTo("home");
public/control-center/pages/setup.js:1216:  const smartActionBtn = $("setupSmartActionBtn");
public/control-center/pages/setup.js:1281:    <section class="card setup-business-template-panel">
public/control-center/pages/setup.js:1282:      <div class="setup-template-head">
public/control-center/pages/setup.js:1284:          <div class="setup-kicker">Business Template</div>
public/control-center/pages/setup.js:1285:          <h3 class="setup-v2-title">Project Operating Model</h3>
public/control-center/pages/setup.js:1286:          <p class="setup-v2-subtitle">Select the template that sets setup defaults, checklist scope, and launch priorities.</p>
public/control-center/pages/setup.js:1288:        <span class="setup-template-current">${escapeHtml(currentLabel)}</span>
public/control-center/pages/setup.js:1291:      <div class="setup-template-body">
public/control-center/pages/setup.js:1292:        <label class="setup-template-selector">
public/control-center/pages/setup.js:1294:          <select id="setupBusinessTemplateSelect">
public/control-center/pages/setup.js:1303:        <div class="setup-template-preview${requiredAssets.length ? "" : " is-empty"}">
public/control-center/pages/setup.js:1305:          <span class="${requiredAssets.length ? "" : "setup-template-empty"}">${escapeHtml(requirementsText)}</span>
public/control-center/pages/setup.js:1308:        <div class="setup-template-preview${starterChecklist.length ? "" : " is-empty"}">
public/control-center/pages/setup.js:1310:          <span class="${starterChecklist.length ? "" : "setup-template-empty"}">${escapeHtml(checklistText)}</span>
public/control-center/pages/setup.js:1314:      <div class="setup-template-actions">
public/control-center/pages/setup.js:1315:        <button id="setupApplyTemplateBtn" class="btn btn-secondary" type="button">
public/control-center/pages/setup.js:1318:        <span id="setupTemplateStatus" class="setup-template-status"></span>
public/control-center/pages/setup.js:1325:export const setupRoute = {
public/control-center/pages/setup.js:1326:  id: "setup",
public/control-center/pages/setup.js:1330:    title: "Smart Guided Setup",
public/control-center/pages/setup.js:1331:    description: "Build a complete, validated project source of truth before moving to assets, integrations, and launch execution."
public/control-center/pages/setup.js:1334:    <section class="page is-active" data-page="setup">
public/control-center/pages/setup.js:1335:      <div id="setupRoot"></div>
public/control-center/pages/setup.js:1346:    saveProjectSetup
public/control-center/pages/setup.js:1352:    const integrations = asObject(state.data.integrations);
public/control-center/pages/setup.js:1356:    const draft = loadSetupDraft(projectName);
public/control-center/pages/setup.js:1357:    const values = { ...buildSetupValues(state), ...(draft || {}) };
public/control-center/pages/setup.js:1362:    const missingConnectors = asArray(integrations.readiness?.missing);
public/control-center/pages/setup.js:1365:    const missingFieldInsights = getMissingFieldInsights(missingFields);
public/control-center/pages/setup.js:1368:    const businessIdentityStatus = getSetupBusinessIdentityStatus(values);
public/control-center/pages/setup.js:1369:    const brandStatus = getSetupBrandStatus(values);
public/control-center/pages/setup.js:1370:    const localizationStatus = getSetupLocalizationStatus(values);
public/control-center/pages/setup.js:1371:    const channelsStatus = getSetupChannelsStatus(values, missingConnectors);
public/control-center/pages/setup.js:1372:    const contentTruthStatus = getSetupContentTruthStatus(values);
public/control-center/pages/setup.js:1373:    const aiGuidanceStatus = getSetupAiGuidanceStatus(values);
public/control-center/pages/setup.js:1374:    const nextBestAction = getNextSetupActionText(missingFields, missingAssets, missingConnectors);
public/control-center/pages/setup.js:1375:    const failedCount = asArray(integrations.readiness?.failed).length;
public/control-center/pages/setup.js:1383:    const allFields = getAllSetupFieldNames();
public/control-center/pages/setup.js:1395:    const root = $("setupRoot");
public/control-center/pages/setup.js:1399:      <div class="setup-wizard-shell">
public/control-center/pages/setup.js:1400:        <section class="card setup-smart-overview">
public/control-center/pages/setup.js:1401:          <div class="setup-wizard-header-top">
public/control-center/pages/setup.js:1403:              <h3 class="setup-v2-title">Smart Guided Setup</h3>
public/control-center/pages/setup.js:1404:              <p class="setup-v2-subtitle">Setup configures your project foundation and hands off assets, connectors, and publishing to the right workspace.</p>
public/control-center/pages/setup.js:1405:              <p class="setup-header-project">Project: ${escapeHtml(asString(values.project_name) || projectName || "No project selected")}</p>
public/control-center/pages/setup.js:1406:              <div class="setup-operating-chips">
public/control-center/pages/setup.js:1407:                <span class="card-badge neutral" id="setupTopCompletionBadge">Fields configured: ${escapeHtml(String(completionPercent))}%</span>
public/control-center/pages/setup.js:1408:                <span class="card-badge ${getLaunchReadinessSummary({ missingFields, missingAssets, missingConnectors, criticalGaps }).tone}" id="setupTopReadinessBadge">${escapeHtml(getLaunchReadinessSummary({ missingFields, missingAssets, missingConnectors, criticalGaps }).label)}</span>
public/control-center/pages/setup.js:1411:            <div class="setup-v2-toolbar">
public/control-center/pages/setup.js:1412:              <button id="setupSaveBackendBtn" class="btn btn-primary" type="button">Save Setup</button>
public/control-center/pages/setup.js:1416:          <div class="setup-top-summary-row" aria-label="Configuration intelligence summary">
public/control-center/pages/setup.js:1417:            <article class="setup-top-summary-item">
public/control-center/pages/setup.js:1419:              <strong id="setupCompletionPercentValue" class="setup-wizard-progress-value">${escapeHtml(String(completionPercent))}%</strong>
public/control-center/pages/setup.js:1420:              <div class="setup-progress" aria-label="Setup completion">
public/control-center/pages/setup.js:1421:                <div class="setup-progress-track">
public/control-center/pages/setup.js:1422:                  <div id="setupCompletionBar" class="setup-progress-fill" style="width:${escapeHtml(String(completionPercent))}%"></div>
public/control-center/pages/setup.js:1426:            <article class="setup-top-summary-item">
public/control-center/pages/setup.js:1428:              <strong><span id="setupRequiredCompleted">${escapeHtml(String(requiredCompleted))}</span>/<span id="setupRequiredTotal">${escapeHtml(String(requiredNames.length))}</span></strong>
public/control-center/pages/setup.js:1429:              <span class="setup-helper"><span id="setupMissingCount">${escapeHtml(String(missingFields.length))}</span> missing</span>
public/control-center/pages/setup.js:1431:            <article class="setup-top-summary-item">
public/control-center/pages/setup.js:1433:              <strong id="setupDependencyGapCount">${escapeHtml(String(dependencyGapCount))}</strong>
public/control-center/pages/setup.js:1434:              <span class="setup-helper">Assets and connectors pending</span>
public/control-center/pages/setup.js:1436:            <article class="setup-top-summary-item">
public/control-center/pages/setup.js:1439:              <div class="setup-inline-status-row">
public/control-center/pages/setup.js:1440:                <span id="setupReadinessBadge" class="card-badge ${wizardStatus === "Ready" ? "success" : "warning"}">${escapeHtml(wizardStatus)}</span>
public/control-center/pages/setup.js:1441:                <span id="setupValidationBadge" class="card-badge ${escapeHtml(validationSummary.tone)}">${escapeHtml(validationSummary.label)}</span>
public/control-center/pages/setup.js:1443:              <span class="setup-helper">Updated ${escapeHtml(lastSavedAt)}</span>
public/control-center/pages/setup.js:1447:          <div class="setup-guidance-strip">
public/control-center/pages/setup.js:1449:            <p id="setupNextBestAction">${escapeHtml(nextBestAction)}</p>
public/control-center/pages/setup.js:1450:            <div class="setup-config-intel-metrics">
public/control-center/pages/setup.js:1451:              <span>Required missing: <strong id="setupReadinessMissingFields">${escapeHtml(String(missingFields.length))}</strong></span>
public/control-center/pages/setup.js:1452:              <span>Assets missing: <strong id="setupReadinessMissingAssets">${escapeHtml(String(missingAssets.length))}</strong> <span class=\"setup-handoff-label\">(manage in Library)</span></span>
public/control-center/pages/setup.js:1453:              <span>Connectors missing: <strong id="setupReadinessMissingConnectors">${escapeHtml(String(missingConnectors.length))}</strong> <span class=\"setup-handoff-label\">(manage in Integrations)</span></span>
public/control-center/pages/setup.js:1458:        <div class="setup-wizard-layout">
public/control-center/pages/setup.js:1459:          <aside class="setup-wizard-sidebar card setup-smart-steps-panel">
public/control-center/pages/setup.js:1460:            <h4>Guided Setup Steps</h4>
public/control-center/pages/setup.js:1461:            <p class="setup-helper">Select a step to load that section in the main form.</p>
public/control-center/pages/setup.js:1462:            <div class="setup-smart-recommended-inline">
public/control-center/pages/setup.js:1463:              <span class="setup-smart-recommended-label">Recommended</span>
public/control-center/pages/setup.js:1464:              <button id="setupRecommendedStepBtn" class="btn btn-ghost" type="button" data-setup-open-step="${escapeHtml(getRecommendedStep(values).id)}">
public/control-center/pages/setup.js:1465:                <span id="setupRecommendedStepTitle">${escapeHtml(getRecommendedStep(values).title)}</span>
public/control-center/pages/setup.js:1468:            <div class="setup-smart-step-list" role="tablist" aria-label="Setup wizard steps">
public/control-center/pages/setup.js:1472:                  <button class="setup-wizard-step ${index === 0 ? "is-active" : ""}" type="button" data-setup-step="${escapeHtml(step.id)}" role="tab" aria-current="${index === 0 ? "step" : "false"}">
public/control-center/pages/setup.js:1473:                    <span class="setup-wizard-step-meta">Step ${index + 1}</span>
public/control-center/pages/setup.js:1474:                    <span class="setup-wizard-step-title">${escapeHtml(step.title)}</span>
public/control-center/pages/setup.js:1475:                    <span class="setup-wizard-step-purpose">${escapeHtml(step.description)}</span>
public/control-center/pages/setup.js:1476:                    <span id="setupStepBadge-${escapeHtml(step.id)}" class="card-badge ${status.tone}">${escapeHtml(status.label)}</span>
public/control-center/pages/setup.js:1477:                    <span class="setup-smart-step-note tone-${escapeHtml(status.tone)}" data-setup-step-note="${escapeHtml(step.id)}">${status.tone === "danger" ? "Needs required data" : status.tone === "warning" ? "Partially complete" : ""}</span>
public/control-center/pages/setup.js:1484:          <section class="setup-wizard-form card setup-smart-form-panel">
public/control-center/pages/setup.js:1485:            <div class="setup-wizard-form-head">
public/control-center/pages/setup.js:1487:                <span class="data-label">Main Setup Form</span>
public/control-center/pages/setup.js:1488:                <strong id="setupStepCounter" class="setup-wizard-step-counter">1/${STEP_DEFINITIONS.length}</strong>
public/control-center/pages/setup.js:1490:              <div class="setup-wizard-nav-actions">
public/control-center/pages/setup.js:1491:                <button id="setupPrevStepBtn" class="btn btn-ghost" type="button">Previous</button>
public/control-center/pages/setup.js:1492:                <button id="setupNextStepBtn" class="btn btn-secondary" type="button">Next</button>
public/control-center/pages/setup.js:1496:            <form id="setupProjectForm" class="setup-v2-form">
public/control-center/pages/setup.js:1497:              <section class="setup-wizard-step-panel is-active" data-setup-step-panel="business-basics">
public/control-center/pages/setup.js:1499:                <div class="setup-form-grid setup-form-grid-2">
public/control-center/pages/setup.js:1507:              <section class="setup-wizard-step-panel" data-setup-step-panel="brand-identity" hidden>
public/control-center/pages/setup.js:1509:                <p class="home-section-copy">Core message and tone rules for consistent output.</p>
public/control-center/pages/setup.js:1510:                <div class="setup-form-grid">
public/control-center/pages/setup.js:1519:              <section class="setup-wizard-step-panel" data-setup-step-panel="market-language" hidden>
public/control-center/pages/setup.js:1521:                <p class="home-section-copy">Localization defaults used by planning and publishing.</p>
public/control-center/pages/setup.js:1522:                <div class="setup-form-grid setup-form-grid-3">
public/control-center/pages/setup.js:1529:              <section class="setup-wizard-step-panel" data-setup-step-panel="audience" hidden>
public/control-center/pages/setup.js:1531:                <p class="home-section-copy">Define audience profile and top pain points.</p>
public/control-center/pages/setup.js:1532:                <div class="setup-form-grid">
public/control-center/pages/setup.js:1539:              <section class="setup-wizard-step-panel" data-setup-step-panel="goals" hidden>
public/control-center/pages/setup.js:1541:                <p class="home-section-copy">Business outcomes this project should drive.</p>
public/control-center/pages/setup.js:1542:                <div class="setup-form-grid">
public/control-center/pages/setup.js:1548:              <section class="setup-wizard-step-panel" data-setup-step-panel="competitors" hidden>
public/control-center/pages/setup.js:1550:                <p class="home-section-copy">Benchmark competitors and your differentiator.</p>
public/control-center/pages/setup.js:1551:                <div class="setup-form-grid">
public/control-center/pages/setup.js:1557:              <section class="setup-wizard-step-panel" data-setup-step-panel="channels" hidden>
public/control-center/pages/setup.js:1559:                <p class="home-section-copy">Distribution channels and operator handoff notes.</p>
public/control-center/pages/setup.js:1560:                <div class="setup-form-grid">
public/control-center/pages/setup.js:1562:                  ${renderField({ name: "operator_notes", label: "Operator notes", value: values.operator_notes, helper: "Important setup notes for the next operator.", placeholder: "Any constraints, watchouts, or handoff notes", escapeHtml, multiline: true, rows: 4 })}
public/control-center/pages/setup.js:1569:        <div class="setup-wizard-side-panels">
public/control-center/pages/setup.js:1570:          <section class="card setup-wizard-missing-panel setup-smart-gaps-panel">
public/control-center/pages/setup.js:1573:              <button id="setupCompleteNowBtn" class="btn btn-secondary" type="button">Complete now</button>
public/control-center/pages/setup.js:1575:            <div id="setupMissingActions">
public/control-center/pages/setup.js:1576:              ${missingFieldInsights.length
public/control-center/pages/setup.js:1577:                ? `<div class="setup-smart-gap-list">${missingFieldInsights.map((item) => `
public/control-center/pages/setup.js:1578:                    <article class="setup-smart-gap-item">
public/control-center/pages/setup.js:1583:                      <button class="btn btn-ghost" type="button" data-setup-jump-field="${escapeHtml(item.name)}" data-setup-jump-step="${escapeHtml(item.stepId)}">Fix now</button>
public/control-center/pages/setup.js:1586:                : `<div class="empty-box">All required setup fields are complete.</div>`
public/control-center/pages/setup.js:1589:            <div class="setup-wizard-missing-divider"></div>
public/control-center/pages/setup.js:1591:            <div id="setupSystemGaps">
public/control-center/pages/setup.js:1604:          <section class="card setup-smart-validation-panel">
public/control-center/pages/setup.js:1607:              <button id="setupValidateNowBtn" class="btn btn-ghost" type="button">Validate now</button>
public/control-center/pages/setup.js:1609:            <div class="setup-smart-diagnostics-grid">
public/control-center/pages/setup.js:1610:              <article class="setup-smart-diagnostic-card">
public/control-center/pages/setup.js:1615:              <article class="setup-smart-diagnostic-card">
public/control-center/pages/setup.js:1620:              <article class="setup-smart-diagnostic-card">
public/control-center/pages/setup.js:1629:        <section class="card setup-smart-handoff-panel">
public/control-center/pages/setup.js:1632:            <button id="setupSmartActionBtn" class="btn btn-secondary" type="button">Run next best action</button>
public/control-center/pages/setup.js:1634:          <div class="setup-handoff-note">Brand evidence and product files belong in <strong>Library</strong> or <strong>Governance</strong>.</div>
public/control-center/pages/setup.js:1635:          <div class="setup-smart-handoff-actions setup-smart-handoff-actions-primary">
public/control-center/pages/setup.js:1636:            <button id="setupSaveBackendBtnBottom" class="btn btn-ghost" type="button">Save Setup</button>
public/control-center/pages/setup.js:1637:            <button id="setupContinueLibraryBtn" class="btn btn-secondary" type="button">Continue to Library</button>
public/control-center/pages/setup.js:1638:            <button id="setupContinueIntegrationsBtn" class="btn btn-secondary" type="button">Continue to Integrations</button>
public/control-center/pages/setup.js:1640:          <div class="setup-smart-handoff-actions setup-smart-handoff-actions-secondary">
public/control-center/pages/setup.js:1641:            <div class="setup-action-group">
public/control-center/pages/setup.js:1642:              <span class="setup-action-group-label">Continue</span>
public/control-center/pages/setup.js:1643:              <button id="setupContinueCampaignBtn" class="btn btn-secondary" type="button">Continue to Campaign Studio</button>
public/control-center/pages/setup.js:1645:            <div class="setup-action-group">
public/control-center/pages/setup.js:1646:              <span class="setup-action-group-label">AI and review</span>
public/control-center/pages/setup.js:1647:              <button id="setupAiCommandBtn" class="btn btn-ghost" type="button">Open AI Command with Setup Context</button>
public/control-center/pages/setup.js:1648:              <button id="setupReviewMissingBtn" class="btn btn-ghost" type="button">Review missing setup items</button>
public/control-center/pages/setup.js:1650:            <div class="setup-action-group">

## Shared context handoff functions
75:const handoffCache = new Map();
84:export function setSharedAiDrawerReturn(projectName, payload) {
89:export function getSharedAiDrawerReturn(projectName) {
99:export function setSharedLibrarySourceBridge(projectName, bridge) {
104:export function getSharedLibrarySourceBridge(projectName) {
114:export function setSharedAiSource(projectName, source) {
119:export function getSharedAiSource(projectName) {
146:  const handoffs = asArray(operations?.handoffs?.items);
147:  const available = handoffs.filter((item) => {
157:export function setSharedCampaignRecord(projectName, campaign) {
162:export function getSharedCampaignRecord(projectName, operations) {
175:export function setSharedAiDraft(projectName, draft) {
176:  if (!projectName || !draft) return;
177:  aiDraftCache.set(buildKey(projectName), draft);
180:export function getSharedAiDraft(projectName, operations) {
184:  const handoff =
189:  return asObject(handoff?.payload?.draft_context);
192:export function setSharedHandoff(projectName, destinationPage, handoff) {
193:  if (!projectName || !destinationPage || !handoff) return;
194:  handoffCache.set(buildKey(projectName, destinationPage), handoff);
197:export function getSharedHandoff(projectName, destinationPage, operations, sourcePage = "") {
198:  const cached = handoffCache.get(buildKey(projectName, destinationPage));

## Startup and page rendering references
public/control-center/app.js:293:        Enter the Control Center access key to unlock protected reads and writes.
public/control-center/app.js:814:  if (startupRuntimeState.manualUnlockActive && token === startupRuntimeState.manualUnlockToken) {
public/control-center/app.js:815:    recordLoadingTransition("show-blocked-manual-unlock", { token, reason });
public/control-center/app.js:819:  if (startupRuntimeState.manualUnlockActive && token !== startupRuntimeState.manualUnlockToken) {
public/control-center/app.js:820:    recordLoadingTransition("show-blocked-manual-unlock", { token, reason });
public/control-center/app.js:825:  const overlay = $("loadingOverlay");
public/control-center/app.js:871:  const overlay = $("loadingOverlay");
public/control-center/app.js:896:  const overlay = $("loadingOverlay");
public/control-center/app.js:907:const STARTUP_UNLOCK_TIMEOUT_MS = 8000;
public/control-center/app.js:908:const LOADING_WATCHDOG_TIMEOUT_MS = STARTUP_UNLOCK_TIMEOUT_MS;
public/control-center/app.js:918:const STARTUP_UNLOCK_STORAGE_KEY = "mh-control-center-startup-unlock";
public/control-center/app.js:956:  unlocked: false,
public/control-center/app.js:957:  unlockReason: "",
public/control-center/app.js:958:  unlockAt: "",
public/control-center/app.js:959:  unlockVisible: false,
public/control-center/app.js:964:  manualUnlockActive: false,
public/control-center/app.js:965:  manualUnlockToken: "",
public/control-center/app.js:968:  responseTextWatchdogUnlocked: false
public/control-center/app.js:974:  const overlay = $("loadingOverlay");
public/control-center/app.js:977:    ? Array.from(document.querySelectorAll("#loadingOverlay"))
public/control-center/app.js:1025:    unlocked: Boolean(startupRuntimeState.unlocked),
public/control-center/app.js:1026:    unlockReason: String(startupRuntimeState.unlockReason || ""),
public/control-center/app.js:1038:  const unlockBar = $("startupUnlockBar");
public/control-center/app.js:1039:  const unlockText = $("startupUnlockText");
public/control-center/app.js:1041:  const showUnlockBar = Boolean(startupRuntimeState.unlockVisible || startupRuntimeState.unlocked);
public/control-center/app.js:1084:  if (unlockBar) {
public/control-center/app.js:1085:    unlockBar.hidden = !showUnlockBar;
public/control-center/app.js:1086:    unlockBar.inert = !showUnlockBar;
public/control-center/app.js:1087:    unlockBar.setAttribute("aria-hidden", showUnlockBar ? "false" : "true");
public/control-center/app.js:1090:  if (unlockText) {
public/control-center/app.js:1091:    unlockText.textContent = startupRuntimeState.unlocked
public/control-center/app.js:1092:      ? "Startup is still syncing. The interface has been unlocked."
public/control-center/app.js:1093:      : "Startup is taking longer than expected. You can unlock the interface now.";
public/control-center/app.js:1104:    !startupRuntimeState.unlocked &&
public/control-center/app.js:1105:    !startupRuntimeState.unlockVisible
public/control-center/app.js:1121:    unlocked: Boolean(startupRuntimeState.unlocked),
public/control-center/app.js:1122:    unlockReason: String(startupRuntimeState.unlockReason || ""),
public/control-center/app.js:1123:    unlockAt: String(startupRuntimeState.unlockAt || ""),
public/control-center/app.js:1226:function updateStartupUnlockVisibility(visible) {
public/control-center/app.js:1228:  if (startupRuntimeState.unlockVisible === nextVisible) {
public/control-center/app.js:1232:  startupRuntimeState.unlockVisible = nextVisible;
public/control-center/app.js:1233:  recordRuntimeTrace(nextVisible ? "startup.unlock.available" : "startup.unlock.hidden", {
public/control-center/app.js:1311:  const overlay = $("loadingOverlay");
public/control-center/app.js:1424:function forceHideLoadingOverlay(reason = "access-key-recovery") {
public/control-center/app.js:1425:  recordStartupStep("forceHideLoadingOverlay.start", {
public/control-center/app.js:1431:  const overlay = $("loadingOverlay");
public/control-center/app.js:1433:    recordStartupStep("forceHideLoadingOverlay.done", {
public/control-center/app.js:1455:  recordStartupStep("forceHideLoadingOverlay.done", {
public/control-center/app.js:1461:function recordStartupUnlock(reason = "manual-unlock") {
public/control-center/app.js:1469:  startupRuntimeState.unlocked = true;
public/control-center/app.js:1470:  startupRuntimeState.unlockReason = reason;
public/control-center/app.js:1471:  startupRuntimeState.unlockAt = payload.at;
public/control-center/app.js:1472:  startupRuntimeState.unlockVisible = true;
public/control-center/app.js:1473:  safeStorageSet(STARTUP_UNLOCK_STORAGE_KEY, JSON.stringify(payload));
public/control-center/app.js:1474:  recordRuntimeTrace("startup.unlock", {
public/control-center/app.js:1480:function unlockStartupUi(reason = "manual-unlock") {
public/control-center/app.js:1481:  recordStartupStep("manualUnlock.start", {
public/control-center/app.js:1485:  startupRuntimeState.manualUnlockActive = reason === "manual-unlock";
public/control-center/app.js:1486:  startupRuntimeState.manualUnlockToken = activeProjectLoadToken;
public/control-center/app.js:1487:  if (reason === "manual-unlock") {
public/control-center/app.js:1488:    forceHideLoadingOverlay("manual-unlock");
public/control-center/app.js:1490:    forceHideLoadingOverlay(reason);
public/control-center/app.js:1495:  const overlay = $("loadingOverlay");
public/control-center/app.js:1508:  recordStartupUnlock(reason);
public/control-center/app.js:1509:  // Unlock should recover the interface quietly.
public/control-center/app.js:1510:  // Do not show a persistent error after the user manually unlocks the UI.
public/control-center/app.js:1511:  showMessage("Interface unlocked.");
public/control-center/app.js:1512:  recordStartupStep("manualUnlock.done", {
public/control-center/app.js:1520:  ["startupUnlockBtn", "startupTraceUnlockBtn"].forEach((id) => {
public/control-center/app.js:1528:      unlockStartupUi("manual-unlock");
public/control-center/app.js:1585:  forceHideLoadingOverlay("access-key-required-force");
public/control-center/app.js:1673:  updateStartupUnlockVisibility(false);
public/control-center/app.js:1708:      !startupRuntimeState.responseTextWatchdogUnlocked
public/control-center/app.js:1710:      startupRuntimeState.responseTextWatchdogUnlocked = true;
public/control-center/app.js:1711:      startupRuntimeState.manualUnlockActive = true;
public/control-center/app.js:1712:      startupRuntimeState.manualUnlockToken = activeProjectLoadToken;
public/control-center/app.js:1716:      recordStartupStep("loadProjectData.responseTextWatchdog.unlock", {
public/control-center/app.js:1721:      forceHideLoadingOverlay("response-text-watchdog");
public/control-center/app.js:1727:      const unlockMessage = "Project response is still being processed. Interface unlocked.";
public/control-center/app.js:1728:      setError(unlockMessage);
public/control-center/app.js:1729:      showError(unlockMessage);
public/control-center/app.js:1730:      showMessage(unlockMessage);
public/control-center/app.js:1734:    if (!startupRuntimeState.unlocked && startupAgeMs >= STARTUP_UNLOCK_TIMEOUT_MS) {
public/control-center/app.js:1735:      updateStartupUnlockVisibility(true);
public/control-center/app.js:1743:      unlockStartupUi("global-watchdog");
public/control-center/app.js:2712:  startupRuntimeState.unlocked = false;
public/control-center/app.js:2713:  startupRuntimeState.unlockReason = "";
public/control-center/app.js:2714:  startupRuntimeState.unlockAt = "";
public/control-center/app.js:2716:  startupRuntimeState.unlockVisible = false;
public/control-center/app.js:2717:  startupRuntimeState.manualUnlockActive = false;
public/control-center/app.js:2718:  startupRuntimeState.manualUnlockToken = "";
public/control-center/app.js:2719:  startupRuntimeState.responseTextWatchdogUnlocked = false;
public/control-center/app.js:2854:        forceHideLoadingOverlay("render-global-ui-error");
public/control-center/app.js:2882:        forceHideLoadingOverlay("safe-render-current-page-error");
public/control-center/app.js:2904:        recordStartupStep("loadProjectData.responseTextWatchdog.unlock", {
public/control-center/app.js:2909:        startupRuntimeState.manualUnlockActive = true;
public/control-center/app.js:2910:        startupRuntimeState.manualUnlockToken = loadToken;
public/control-center/app.js:2911:        startupRuntimeState.responseTextWatchdogUnlocked = true;
public/control-center/app.js:2915:        forceHideLoadingOverlay("response-text-watchdog");
public/control-center/app.js:2921:        const unlockMessage = "Project response is still being processed. Interface unlocked.";
public/control-center/app.js:2922:        setError(unlockMessage);
public/control-center/app.js:2923:        showError(unlockMessage);
public/control-center/app.js:2924:        showMessage(unlockMessage);
public/control-center/app.js:2940:        forceHideLoadingOverlay("parse-watchdog");
public/control-center/app.js:2960:      forceHideLoadingOverlay(`load-project-error-${String(error?.phase || "unknown")}`);
public/control-center/app.js:3425:  const loadingOverlay = $("loadingOverlay");
public/control-center/app.js:3432:    loadingOverlay &&
public/control-center/app.js:3433:    !loadingOverlay.hidden &&
public/control-center/app.js:3434:    loadingOverlay.getAttribute("aria-hidden") !== "true";
public/control-center/app.js:4161:    updateStartupUnlockVisibility(false);
public/control-center/router.js:180:  if (eyebrow) eyebrow.textContent = meta.eyebrow;
public/control-center/pages/ai-command.js:2010:		notes.push("Load project insights to unlock live intelligence guidance.");
public/control-center/pages/ai-command.js:2033:		summary: summaryParts.join(" ") || "Project is loaded. Complete integrations to unlock stronger AI guidance.",
public/control-center/pages/ai-command.js:2101:			: "SEO visibility not live — connect Search Console to unlock guidance.",
public/control-center/pages/ai-command.js:2109:			lowCtr ? `Improve title and SERP message for ${extractTopMessage(lowCtr)}.` : "Connect Search Console to unlock CTR analysis.",
public/control-center/pages/ai-command.js:2174:			"Prioritize integrations that unlock attribution and performance evidence over vanity metrics."
public/control-center/pages/insights.js:462:      ? "The Insight Engine is structurally ready, but live performance feeds are still sparse. Connect social insights, website analytics, SEO, and paid platforms to unlock real learning."
public/control-center/pages/insights.js:502:        ? "Map real API data into this card to unlock comparison and recommendations."
public/control-center/pages/content-studio-workspace.js:828:      why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
public/control-center/pages/integrations/cards.js:101:        <p>Connect platforms to unlock intelligence, sync, publishing, and reporting.</p>
public/control-center/pages/governance.js:729:function renderPage(projectName, session, escapeHtml) {
public/control-center/pages/governance.js:1305:    root.innerHTML = renderPage(projectName, session, context.escapeHtml);
public/control-center/pages/governance.js:1478:      root.innerHTML = renderPage(projectName, session, context.escapeHtml);
public/control-center/pages/integrations.js:87:        whyItMatters: "Shopify unlocks product catalogs, order flow, and conversion insights for commerce-first projects.",
public/control-center/pages/integrations.js:1698:                    <p><strong>Unlocks:</strong> ${escapeHtml(aiRec.card.enables)}</p>
public/control-center/pages/settings.js:384:        placeholder: "Reject anything with unsupported claims, brand mismatch, or missing route metadata. Two failed reviews escalate."
