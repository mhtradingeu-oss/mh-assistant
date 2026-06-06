# AI-COMMAND-GDS-2D — Tool Drawer Options Hydration Audit

Generated: Sat Jun  6 23:16:26 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: c01297d

## Git Status
 M public/control-center/pages/ai-command/tool-dock.js
 M public/control-center/pages/library.js
 M public/control-center/styles/08-components-foundation.css
?? audits/frontend/global-design-system/ai-command-final-composition/tool-dock-source-ux/

## Drawer select / composer / validation signals
24:    const composer = document.querySelector("[data-aicmd-composer-input], textarea, input");
25:    if (composer && typeof composer.focus === "function") {
26:      composer.focus({ preventScroll: true });
114:  outputType = "",
127:    outputType,
141:  outputType = ""
153:    outputType
231:function validateDrawerSourceRequirement(drawer, projectName = "") {
253:  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
255:  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
264:    validateDrawerSourceRequirement(drawer, projectName);
315:        validateDrawerSourceRequirement(drawer, projectName);
320:  validateDrawerSourceRequirement(drawer, projectName);
335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
357:      sourceTypes: ["current_chat", "campaign_notes", "market_notes", "audience_notes", "product_data", "library_source", "manual_input"],
358:      outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
370:      sourceTypes: ["current_chat", "campaign_brief", "asset_requirements", "timeline_notes", "library_source", "manual_input"],
371:      outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
372:      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
384:      outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
396:      sourceTypes: ["current_chat", "product_data", "pricing_notes", "proof_points", "library_source", "manual_input"],
397:      outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
409:      sourceTypes: ["current_chat", "campaign_brief", "audience_notes", "content_inventory", "library_source", "manual_input"],
410:      outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
422:      sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
423:      outputTypes: ["next_best_action", "priority_list", "blocker_map", "action_sequence"],
437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
438:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "manual_input"],
439:      outputTypes: ["company_profile", "product_copy", "email", "blog_article", "landing_page", "contract_draft", "presentation_outline", "speech", "faq", "proposal", "social_post", "ad_copy"],
440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
450:      destinations: ["composer", "content-studio"],
451:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
452:      outputTypes: ["professional_rewrite", "shorter_rewrite", "simpler_rewrite", "persuasive_rewrite", "premium_rewrite", "platform_specific_rewrite"],
453:      template: "Rewrite the current text for {projectName}. Keep the meaning, improve clarity, structure, and tone. Offer variants such as professional, shorter, simpler, more persuasive, premium, or platform-specific. Do not publish anything."
463:      destinations: ["composer", "content-studio"],
464:      sourceTypes: ["composer_text", "selected_text", "current_chat"],
465:      outputTypes: ["translation", "localization", "market_adaptation", "cta_localization"],
466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
476:      destinations: ["composer", "content-studio"],
477:      sourceTypes: ["composer_text", "selected_text", "last_response", "current_chat"],
478:      outputTypes: ["clarity_improvement", "structure_improvement", "cta_improvement", "readability_improvement", "conversion_improvement"],
489:      destinations: ["preview", "content-studio", "compliance"],
490:      sourceTypes: ["composer_text", "selected_text", "content_draft", "current_chat"],
491:      outputTypes: ["grammar_check", "spelling_check", "tone_check", "readability_check", "cta_check", "claim_risk_check", "seo_check", "compliance_notes"],
492:      template: "Check this content for {projectName}. Review grammar, spelling, tone, readability, CTA strength, claim risk, missing proof, SEO weakness, and compliance notes. Return issues, severity, and suggested fixes."
499:      actionType: "source_required",
502:      destinations: ["library", "ai-command", "content-studio"],
503:      sourceTypes: ["current_chat", "library_folder", "brand_profile", "product_data", "legal_pricing_docs", "research_proof_docs", "source_of_truth_assets", "manual_input"],
504:      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
515:      destinations: ["content-studio", "insights", "library"],
516:      sourceTypes: ["topic", "market", "language", "audience", "current_chat", "library_folder"],
517:      outputTypes: ["seo_brief", "keyword_clusters", "search_intent_map", "blog_outline", "meta_pack", "faq_ideas", "internal_link_plan", "content_gap_notes"],
518:      template: "Prepare SEO support for {projectName}. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes."
528:      destinations: ["chat-preview", "content-studio", "publishing"],
529:      sourceTypes: ["existing_content", "composer_text", "content_draft", "current_chat", "library_folder"],
530:      outputTypes: ["blog_to_social", "profile_to_pitch", "product_to_ad_copy", "transcript_to_article", "notes_to_presentation", "long_text_to_email_sequence"],
539:      safetyLevel: "confirmation_required",
541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
542:      sourceTypes: ["current_draft", "preview", "current_chat"],
543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
557:      sourceTypes: ["current_chat", "campaign_brief", "brand_guidelines", "product_images", "reference_asset", "library_source", "manual_input"],
558:      outputTypes: ["visual_brief", "creative_direction", "format_brief", "asset_requirements"],
559:      template: "Prepare a visual brief for {projectName}. Include concept, format, composition, colors, typography, visual mood, required assets, and CTA."
569:      destinations: ["chat-preview", "media-studio", "library"],
570:      sourceTypes: ["current_chat", "brand_guidelines", "reference_asset", "campaign_mood", "library_source", "manual_input"],
571:      outputTypes: ["moodboard_direction", "style_notes", "reference_list", "brand_alignment_notes"],
582:      destinations: ["chat-preview", "media-studio", "library"],
583:      sourceTypes: ["current_chat", "visual_brief", "brand_guidelines", "product_data", "reference_asset", "manual_input"],
584:      outputTypes: ["image_prompt", "prompt_variants", "negative_prompt", "style_prompt"],
592:      actionType: "source_required",
595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
596:      sourceTypes: ["current_chat", "campaign_brief", "library_folder", "brand_assets", "product_images", "manual_input"],
597:      outputTypes: ["asset_checklist", "missing_assets", "asset_request_brief", "production_requirements"],
608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
609:      sourceTypes: ["current_chat", "content_draft", "visual_brief", "brand_guidelines", "reference_asset", "manual_input"],
610:      outputTypes: ["layout_plan", "section_hierarchy", "responsive_notes", "cta_placement"],
618:      actionType: "source_required",
621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
622:      sourceTypes: ["current_chat", "brand_guidelines", "visual_brief", "selected_asset", "library_source", "manual_input"],
623:      outputTypes: ["brand_check_report", "style_risks", "missing_assets", "improvement_actions"],
637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
638:      sourceTypes: ["current_chat", "campaign_brief", "content_draft", "product_data", "library_source", "manual_input"],
639:      outputTypes: ["reel_script", "short_video_script", "hook_variants", "overlay_copy"],
650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
651:      sourceTypes: ["current_chat", "script_draft", "visual_brief", "reference_asset", "product_images", "manual_input"],
652:      outputTypes: ["storyboard", "scene_plan", "caption_plan", "asset_requirements"],
663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
664:      sourceTypes: ["current_chat", "storyboard", "visual_brief", "product_data", "production_notes", "manual_input"],
665:      outputTypes: ["shot_list", "b_roll_list", "prop_list", "production_checklist"],
666:      template: "Create a shot list for {projectName}. Include product shots, lifestyle shots, closeups, transitions, and required props."
676:      destinations: ["chat-preview", "media-studio", "content-studio"],
677:      sourceTypes: ["current_chat", "script_draft", "campaign_brief", "brand_voice", "manual_input"],
678:      outputTypes: ["voiceover_script", "audio_direction", "pacing_notes", "tone_variants"],
679:      template: "Draft a voiceover script for {projectName}. Include tone, pacing, hook, proof points, and CTA."
689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
690:      sourceTypes: ["current_chat", "campaign_brief", "offer_data", "video_script", "manual_input"],
691:      outputTypes: ["video_cta_options", "soft_cta", "direct_cta", "urgency_cta", "brand_cta"],
705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
706:      sourceTypes: ["content_draft", "media_asset", "publishing_package", "approval_notes", "current_chat", "manual_input"],
707:      outputTypes: ["publishing_readiness_check", "missing_items", "channel_fit_review", "risk_notes"],
718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
719:      sourceTypes: ["content_draft", "media_asset", "campaign_brief", "channel_notes", "library_source", "manual_input"],
720:      outputTypes: ["channel_pack", "caption_pack", "format_notes", "approval_checklist"],
729:      safetyLevel: "confirmation_required",
731:      destinations: ["chat-preview", "publishing", "workflows"],
732:      sourceTypes: ["publishing_package", "campaign_timeline", "channel_notes", "approval_notes", "manual_input"],
733:      outputTypes: ["schedule_builder", "calendar_slot_options", "dependency_notes", "review_gates"],
744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
745:      sourceTypes: ["content_draft", "topic", "market", "channel_notes", "seo_brief", "manual_input"],
746:      outputTypes: ["hashtag_pack", "discoverability_tags", "platform_tag_groups", "market_tags"],
754:      actionType: "source_required",
755:      safetyLevel: "confirmation_required",
757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
758:      sourceTypes: ["final_copy", "media_asset", "approval_notes", "claim_review", "publishing_package", "manual_input"],
759:      outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],
760:      template: "Prepare an approval package for {projectName}. Include final copy summary, risk notes, assets checklist, and required confirmations."
773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
774:      sourceTypes: ["campaign_brief", "audience_notes", "offer_data", "proof_points", "library_source", "manual_input"],
775:      outputTypes: ["ad_angle", "angle_variants", "pain_benefit_map", "compliance_risks"],
786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
787:      sourceTypes: ["ad_angle", "campaign_brief", "landing_page_copy", "product_data", "manual_input"],
788:      outputTypes: ["ad_copy", "headline_variants", "primary_text_variants", "cta_variants"],
799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
801:      outputTypes: ["audience_map", "targeting_ideas", "exclusions", "funnel_stage_map"],
812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
813:      sourceTypes: ["creative_assets", "campaign_brief", "ad_copy", "performance_notes", "manual_input"],
814:      outputTypes: ["ab_test_plan", "creative_test_matrix", "hypotheses", "success_signals"],
822:      actionType: "source_required",
825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
826:      sourceTypes: ["ad_copy", "landing_page_copy", "offer_data", "proof_points", "library_source", "manual_input"],
827:      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
842:      sourceTypes: ["topic", "market", "language", "audience", "library_source", "manual_input"],
843:      outputTypes: ["seo_brief", "search_intent_map", "content_structure", "meta_ideas", "internal_links"],
851:      actionType: "source_required",
854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
855:      sourceTypes: ["insights_data", "analytics_summary", "performance_notes", "current_chat", "manual_input"],
856:      outputTypes: ["insights_summary", "optimization_actions", "missing_data_notes", "risk_notes"],
867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
868:      sourceTypes: ["topic", "market", "audience", "seo_brief", "library_source", "manual_input"],
869:      outputTypes: ["keyword_groups", "commercial_keywords", "informational_keywords", "branded_keywords", "local_keywords"],
877:      actionType: "source_required",
880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
881:      sourceTypes: ["analytics_summary", "performance_notes", "campaign_results", "content_inventory", "manual_input"],
882:      outputTypes: ["performance_review", "wins", "risks", "experiment_recommendations"],
893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
894:      sourceTypes: ["content_inventory", "seo_brief", "audience_notes", "competitor_notes", "library_source", "manual_input"],
895:      outputTypes: ["content_gap_report", "missing_topics", "missing_pages", "priority_actions"],
906:      actionType: "source_required",
909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
910:      sourceTypes: ["content_draft", "claim_list", "proof_doc", "product_data", "legal_doc", "manual_input"],
911:      outputTypes: ["claims_check", "risk_flags", "proof_requirements", "safe_wording_notes"],
922:      destinations: ["chat-preview", "governance", "content-studio"],
923:      sourceTypes: ["content_draft", "claims_check", "legal_doc", "proof_doc", "manual_input"],
924:      outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
932:      actionType: "source_required",
935:      destinations: ["chat-preview", "governance", "library", "workflows"],
936:      sourceTypes: ["content_draft", "claim_list", "product_data", "legal_doc", "research_proof_docs", "manual_input"],
937:      outputTypes: ["evidence_needed", "required_proof", "recommended_proof", "optional_proof"],
938:      template: "List the evidence needed before this content can be approved or published. Separate required, recommended, and optional proof."
945:      actionType: "source_required",
948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
949:      sourceTypes: ["workflow_draft", "privacy_policy", "tracking_plan", "data_use_notes", "manual_input"],
950:      outputTypes: ["gdpr_review", "consent_risks", "tracking_notes", "disclosure_requirements"],
958:      actionType: "source_required",
959:      safetyLevel: "confirmation_required",
961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
962:      sourceTypes: ["final_copy", "claims_check", "approval_context", "asset_checklist", "manual_input"],
963:      outputTypes: ["approval_notes", "risk_summary", "reviewer_requirements", "unresolved_issues"],
964:      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
978:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
979:      outputTypes: ["task_plan", "owner_map", "priority_list", "dependency_notes"],
988:      safetyLevel: "confirmation_required",
990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
991:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
992:      outputTypes: ["workflow_draft", "step_sequence", "trigger_notes", "review_gates", "execution_risks"],
1001:      safetyLevel: "confirmation_required",
1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
1005:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
1006:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
1017:      sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
1018:      outputTypes: ["timeline", "milestones", "blockers", "safe_sequence"],
1019:      template: "Create a timeline for {projectName}. Include milestones, blockers, dependencies, and safe sequencing."
1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
1030:      sourceTypes: ["current_chat", "readiness_gaps", "asset_requirements", "approval_notes", "manual_input"],
1031:      outputTypes: ["execution_checklist", "approval_checklist", "asset_checklist", "qa_steps"],
1032:      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
1043:      safetyLevel: "confirmation_required",
1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
1046:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
1047:      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
1056:      safetyLevel: "confirmation_required",
1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1059:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
1060:      outputTypes: ["ticket_draft", "issue_summary", "priority_note", "missing_information"],
1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1072:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
1073:      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
1085:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
1086:      outputTypes: ["thread_summary", "sentiment_review", "open_questions", "response_context"],
1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
1101:      sourceTypes: ["lead_context", "sales_notes", "product_data", "offer_data", "proof_points", "manual_input"],
1102:      outputTypes: ["sales_pitch", "value_proposition", "pain_solution_map", "cta_note"],
1111:      safetyLevel: "confirmation_required",
1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
1114:      sourceTypes: ["lead_context", "meeting_notes", "sales_notes", "offer_data", "manual_input"],
1115:      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
1127:      sourceTypes: ["lead_context", "sales_notes", "product_data", "proof_points", "objection_notes", "manual_input"],
1128:      outputTypes: ["objection_handling", "proof_needed", "safe_answers", "next_action"],
1137:      safetyLevel: "confirmation_required",
1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
1141:      outputTypes: ["lead_brief", "fit_summary", "opportunity_notes", "risk_notes", "outreach_recommendation"],
1208:          Choose the output, source, and destination before preparing a review-only composer prompt.
1214:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-output-select></select>
1219:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-source-select></select>
1220:            <div class="mhos-tool-drawer-selected-source" data-aicmd-tool-drawer-selected-source></div>
1226:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-destination-select></select>
1234:                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-language>
1235:                  <option value="">Auto / project language</option>
1243:                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-tone>
1244:                  <option value="">Auto / brand tone</option>
1283:          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
1292:          <button class="btn btn-primary" type="button" data-aicmd-tool-drawer-use>Use in Composer</button>
1318:        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
1333:            data-aicmd-tool-dock-sources="${safe(joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])))}"
1334:            data-aicmd-tool-dock-outputs="${safe(joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"])))}"
1444:  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto / infer from request");
1445:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1447:  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto / project language");
1448:  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto / brand tone");
1464:    `- Destination: ${destination}.`,
1465:    `- Language: ${language}.`,
1466:    `- Tone: ${tone}.`
1486:    "If required facts are missing, ask concise follow-up questions before writing the final version.",
1490:    "- If the selected language is auto, use the active project language when known.",
1491:    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
1492:    "- Do not mix languages inside the publishable content unless the user asks for bilingual output."
1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
1519:  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto");
1520:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Auto");
1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1522:  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto language");
1523:  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto tone");
1530:  summaryParts.push(destination);
1531:  summaryParts.push(language);
1532:  summaryParts.push(tone);
1552:function openToolDrawer({ drawer, btn, text, input, session, projectName, persistSessionDraft, sessionKey, updateStatus }) {
1568:    `Prepare ${btn.getAttribute("data-aicmd-tool-dock-label") || "this tool"} for the active project. Choose the output, source, destination, language, and tone before using it in the composer.`
1574:  const rawDestinations = btn.getAttribute("data-aicmd-tool-dock-destinations") || "";
1575:  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";
1578:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-output-select]"), rawOutputs, "Choose output type");
1579:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-source-select]"), rawSources, "Choose source / input");
1580:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-destination-select]"), rawDestinations, "Choose destination");
1585:      validateDrawerSourceRequirement(drawer, projectName);
1589:      validateDrawerSourceRequirement(drawer, projectName);
1594:  validateDrawerSourceRequirement(drawer, projectName);
1599:  updateStatus?.(`${btn.getAttribute("data-aicmd-tool-dock-label") || "Tool"} setup opened. Review requirements, then use in composer.`);
1612:  updateStatus
1615:  const actionType = tool.requiresSelectedSource && !tool.actionType ? "source_required" : (tool.actionType || tool.action || "guided");
1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
1625:    "data-aicmd-tool-dock-sources": joinMetaList(getToolMetaList(tool, "sourceTypes", ["current_chat"])),
1626:    "data-aicmd-tool-dock-outputs": joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"]))
1643:    updateStatus
1656:  updateStatus
1671:      const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
1683:        outputType: drawer?.querySelector?.("[data-aicmd-tool-drawer-output-select]")?.value || ""
1701:      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
1713:  const useBtn = root.querySelector("[data-aicmd-tool-drawer-use]");
1719:      if (!validateDrawerSourceRequirement(drawer, projectName)) {
1720:        updateStatus?.("This tool needs a source. Choose one from Library before continuing.");
1734:      session.composerText = text;
1741:      if (typeof updateStatus === "function") {
1742:        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
1768:          updateStatus
1780:      session.composerText = text;
1787:      if (typeof updateStatus === "function") {
1788:        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);
