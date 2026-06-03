# PHASE 3AH.4 — Frontend Projection Evidence

## Existing frontend customer-related pages/routes
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:215:function setDrawerSourceWarning(drawer, message = "") {
public/control-center/pages/ai-command/tool-dock.js:218:  const hasMessage = Boolean(message);
public/control-center/pages/ai-command/tool-dock.js:219:  warning.hidden = !hasMessage;
public/control-center/pages/ai-command/tool-dock.js:220:  warning.textContent = message;
public/control-center/pages/ai-command/tool-dock.js:331:    id: "translate",
public/control-center/pages/ai-command/tool-dock.js:333:    label: "Translate",
public/control-center/pages/ai-command/tool-dock.js:335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:384:      outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
public/control-center/pages/ai-command/tool-dock.js:385:      template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
public/control-center/pages/ai-command/tool-dock.js:456:      id: "translate",
public/control-center/pages/ai-command/tool-dock.js:458:      label: "Translate",
public/control-center/pages/ai-command/tool-dock.js:465:      outputTypes: ["translation", "localization", "market_adaptation", "cta_localization"],
public/control-center/pages/ai-command/tool-dock.js:466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
public/control-center/pages/ai-command/tool-dock.js:518:      template: "Prepare SEO support for {projectName}. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes."
public/control-center/pages/ai-command/tool-dock.js:640:      template: "Write a short-form reel script for {projectName}. Include hook, scene sequence, voiceover, text overlays, CTA, and shot notes."
public/control-center/pages/ai-command/tool-dock.js:669:      id: "voiceover",
public/control-center/pages/ai-command/tool-dock.js:671:      label: "Voiceover",
public/control-center/pages/ai-command/tool-dock.js:677:      sourceTypes: ["current_chat", "script_draft", "campaign_brief", "brand_voice", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:678:      outputTypes: ["voiceover_script", "audio_direction", "pacing_notes", "tone_variants"],
public/control-center/pages/ai-command/tool-dock.js:679:      template: "Draft a voiceover script for {projectName}. Include tone, pacing, hook, proof points, and CTA."
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:827:      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
public/control-center/pages/ai-command/tool-dock.js:828:      template: "Review ad-to-landing-page message match for {projectName}. Identify gaps, stronger claims, CTA improvements, and trust signals."
public/control-center/pages/ai-command/tool-dock.js:912:      template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
public/control-center/pages/ai-command/tool-dock.js:925:      template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
public/control-center/pages/ai-command/tool-dock.js:1036:  customer_ops: [
public/control-center/pages/ai-command/tool-dock.js:1038:      id: "reply-draft",
public/control-center/pages/ai-command/tool-dock.js:1040:      label: "Reply",
public/control-center/pages/ai-command/tool-dock.js:1046:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1047:      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
public/control-center/pages/ai-command/tool-dock.js:1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
public/control-center/pages/ai-command/tool-dock.js:1051:      id: "ticket",
public/control-center/pages/ai-command/tool-dock.js:1053:      label: "Draft Ticket",
public/control-center/pages/ai-command/tool-dock.js:1059:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1060:      outputTypes: ["ticket_draft", "issue_summary", "priority_note", "missing_information"],
public/control-center/pages/ai-command/tool-dock.js:1061:      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
public/control-center/pages/ai-command/tool-dock.js:1064:      id: "sla",
public/control-center/pages/ai-command/tool-dock.js:1066:      label: "SLA",
public/control-center/pages/ai-command/tool-dock.js:1072:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1073:      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
public/control-center/pages/ai-command/tool-dock.js:1074:      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1085:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1087:      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
public/control-center/pages/ai-command/tool-dock.js:1091:  sales_crm: [
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1103:      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1135:      badge: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1356:    crm: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1373:    .replace(/\bCrm\b/g, "CRM")
public/control-center/pages/ai-command/tool-dock.js:1491:    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
public/control-center/pages/ai-command/tool-dock.js:1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1508:    "- Do not make unsupported claims. Mark missing proof clearly."
public/control-center/pages/ai-command/tool-dock.js:1733:      session.draftMessage = text;
public/control-center/pages/ai-command/tool-dock.js:1779:      session.draftMessage = text;
public/control-center/pages/home/render-sections.js:98:          <p>${escapeHtml(agent.summary || agent.fallback || "Ready to support the project.")}</p>
public/control-center/pages/campaign-studio.js:180:  const message = asString(error?.message).toLowerCase();
public/control-center/pages/campaign-studio.js:181:  return message.includes("insights") || message.includes("learning") || message.includes("not found");
public/control-center/pages/campaign-studio.js:235:    audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
public/control-center/pages/campaign-studio.js:493:    console.warn("Failed to persist campaign route handoff:", error.message);
public/control-center/pages/campaign-studio.js:517:      console.warn("Failed to persist campaign draft:", error.message);
public/control-center/pages/campaign-studio.js:739:  const support = [];
public/control-center/pages/campaign-studio.js:755:          ? "Connected inside the current system, so this channel can support launch execution."
public/control-center/pages/campaign-studio.js:790:  support.push({
public/control-center/pages/campaign-studio.js:794:      ? "Use lifecycle support to reinforce the launch and recover warm traffic."
public/control-center/pages/campaign-studio.js:795:      : "Add email support once the channel is connected and lists are ready."
public/control-center/pages/campaign-studio.js:797:  support.push({
public/control-center/pages/campaign-studio.js:800:    rationale: seoOpportunities[0]?.body || "Use website and search support to capture campaign intent beyond social reach."
public/control-center/pages/campaign-studio.js:802:  support.push({
public/control-center/pages/campaign-studio.js:817:    support.push({
public/control-center/pages/campaign-studio.js:827:    support: uniqueBy(support, (item) => item.label).slice(0, 3)
public/control-center/pages/campaign-studio.js:951:      ? `${topOrganic ? `${topOrganic.label} first` : ""}${topOrganic && topPaid ? " • " : ""}${topPaid ? `${topPaid.label} as paid support` : ""}`
public/control-center/pages/campaign-studio.js:966:    ...channelMix.support.map((item) => item.label.toLowerCase())
public/control-center/pages/campaign-studio.js:978:    if (missingAssets.length) missingInputs.push("Supporting assets");
public/control-center/pages/campaign-studio.js:986:    const supportingAssetSuggestion = wave.index === 1
public/control-center/pages/campaign-studio.js:998:      supportingAssetSuggestion
public/control-center/pages/campaign-studio.js:1220:        insightsResult?.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
public/control-center/pages/campaign-studio.js:1221:        learningResult?.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
public/control-center/pages/campaign-studio.js:1237:      session.intelligence.error = error?.message || "Failed to load campaign intelligence";
public/control-center/pages/campaign-studio.js:1247:  showMessage,
public/control-center/pages/campaign-studio.js:1293:        showMessage?.("Campaign draft saved to the shared operating backbone.");
public/control-center/pages/campaign-studio.js:1295:        showError?.(error.message || "Failed to save campaign plan.");
public/control-center/pages/campaign-studio.js:1313:        showMessage?.("Campaign plan saved as a durable shared record.");
public/control-center/pages/campaign-studio.js:1315:        showError?.(error.message || "Failed to structure the campaign plan.");
public/control-center/pages/campaign-studio.js:1360:        console.warn("Failed to persist campaign handoff:", error.message);
public/control-center/pages/campaign-studio.js:1363:      showMessage?.("Campaign context sent to AI Command.");
public/control-center/pages/campaign-studio.js:1408:      showMessage?.("Campaign package drafted in this session. Backend export wiring can be connected next.");
public/control-center/pages/campaign-studio.js:1443:      showMessage?.("Refreshing campaign intelligence.");
public/control-center/pages/campaign-studio.js:1467:    showMessage,
public/control-center/pages/campaign-studio.js:1488:      showMessage,
public/control-center/pages/campaign-studio.js:1536:    const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
public/control-center/pages/campaign-studio.js:1791:                        <span>Supporting assets</span>
public/control-center/pages/campaign-studio.js:1792:                        <strong>${escapeHtml(wave.supportingAssetSuggestion)}</strong>
public/control-center/pages/campaign-studio.js:1797:                        ? `<div class="campaign-wave-callout">Missing inputs: ${escapeHtml(wave.missingInputs.join(", "))}</div>`
public/control-center/pages/campaign-studio.js:1798:                        : `<div class="campaign-wave-callout is-ready">${escapeHtml(wave.roleHint)}</div>`
public/control-center/pages/campaign-studio.js:1877:                  <h4 class="insights-subtitle">Recommended support channels</h4>
public/control-center/pages/campaign-studio.js:1878:                  ${renderChannelRecommendationCards(channelMix.support, escapeHtml)}
public/control-center/pages/campaign-studio.js:1941:                  "SEO support is not currently blocked."
public/control-center/pages/campaign-studio.js:2013:      showMessage,
public/control-center/pages/media-studio-workspace.js:11:  generateMediaVoiceScript,
public/control-center/pages/media-studio-workspace.js:31:const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
public/control-center/pages/media-studio-workspace.js:56:    purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
public/control-center/pages/media-studio-workspace.js:61:    id: "voice-director",
public/control-center/pages/media-studio-workspace.js:62:    title: "Voice Director",
public/control-center/pages/media-studio-workspace.js:63:    purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
public/control-center/pages/media-studio-workspace.js:64:    bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
public/control-center/pages/media-studio-workspace.js:65:    suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
public/control-center/pages/media-studio-workspace.js:221:function mediaAccessKeyMessage(error) {
public/control-center/pages/media-studio-workspace.js:222:  const detail = firstText(error?.payload?.message, error?.message);
public/control-center/pages/media-studio-workspace.js:230:function loadLocalLibraryAssets(projectName) {
public/control-center/pages/media-studio-workspace.js:234:function upsertLocalLibraryAsset(projectName, asset) {
public/control-center/pages/media-studio-workspace.js:278:    format: mode === "video" ? "9:16 reel" : mode === "voice" ? "voiceover script" : "1:1 social image",
public/control-center/pages/media-studio-workspace.js:280:    brandStyle: firstText(overview.brand_voice, overview.tone, "Premium, clear, brand-safe"),
public/control-center/pages/media-studio-workspace.js:481:      draftMessage: "",
public/control-center/pages/media-studio-workspace.js:490:  if (mode === "voice") return "audio";
public/control-center/pages/media-studio-workspace.js:502:  const mode = requestType === "audio" ? "voice" : requestType === "multi_format" ? "campaign-pack" : requestType || "image";
public/control-center/pages/media-studio-workspace.js:753:  session.draftMessage = "";
public/control-center/pages/media-studio-workspace.js:784:  const message = session.validation[key];
public/control-center/pages/media-studio-workspace.js:785:  return message ? `<div class="media-inline-error">${escapeHtml(message)}</div>` : "";
public/control-center/pages/media-studio-workspace.js:795:    `Objective: ${form.objective || overview.primary_goal || "support campaign readiness"}.`,
public/control-center/pages/media-studio-workspace.js:796:    `Brand style: ${form.brandStyle || overview.brand_voice || "premium, clear, brand-safe"}.`,
public/control-center/pages/media-studio-workspace.js:797:    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
public/control-center/pages/media-studio-workspace.js:803:  return `${base}\n\nProduction constraints: accurate product identity, clean composition, strong focal hierarchy, channel-safe crop, no unsupported claims, no cluttered text, and enough negative space for publishing copy.`;
public/control-center/pages/media-studio-workspace.js:813:  return `${base}\n\nGerman adaptation: keep the visual brief international, adapt on-image or voiceover language to clear German, preserve brand tone, and avoid literal translations that sound unnatural.`;
public/control-center/pages/media-studio-workspace.js:821:function convertVideoBriefToVoiceover(prompt) {
public/control-center/pages/media-studio-workspace.js:823:  return `${base}\n\nConvert to voiceover script:\n- Opening hook line\n- Scene-by-scene narration\n- German-friendly pronunciation notes\n- Timing markers for each scene\n- CTA close with compliant brand tone`;
public/control-center/pages/media-studio-workspace.js:835:    "Voice format brief:",
public/control-center/pages/media-studio-workspace.js:836:    convertVideoBriefToVoiceover(contextPrompt),
public/control-center/pages/media-studio-workspace.js:839:    `${contextPrompt}\n\nCampaign pack outputs: image hero, video short, voiceover script, channel cutdowns, and publishing-ready metadata.`
public/control-center/pages/media-studio-workspace.js:863:    provider: mode === "video" ? "video provider pending" : mode === "voice" ? "voice provider pending" : "image provider pending",
public/control-center/pages/media-studio-workspace.js:922:    voice_script: response?.voice_script,
public/control-center/pages/media-studio-workspace.js:926:    message: response?.message
public/control-center/pages/media-studio-workspace.js:1007:  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(sourceSignature));
public/control-center/pages/media-studio-workspace.js:1026:  showMessage,
public/control-center/pages/media-studio-workspace.js:1050:    showMessage?.("Already saved to Library (local reference).");
public/control-center/pages/media-studio-workspace.js:1097:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1112:      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Selected version saved to Library.");
public/control-center/pages/media-studio-workspace.js:1114:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1120:      showMessage?.("Library backend unavailable. Saved as local library handoff.");
public/control-center/pages/media-studio-workspace.js:1123:    upsertLocalLibraryAsset(projectName, {
public/control-center/pages/media-studio-workspace.js:1129:    showMessage?.("Selected version saved to Library (local handoff).");
public/control-center/pages/media-studio-workspace.js:1168:  session.draftMessage = "Media draft saved locally.";
public/control-center/pages/media-studio-workspace.js:1239:  const voiceConnected = capabilityFromOperations(operations, ["voice_generation", "audio_generation", "voice_backend"]);
public/control-center/pages/media-studio-workspace.js:1247:    voice_generation_backend: voiceConnected,
public/control-center/pages/media-studio-workspace.js:1254:function getGeneratorFallbackMessage(session, backendProjectName) {
public/control-center/pages/media-studio-workspace.js:1259:  if (mode === "voice" && readiness.voice_generation_backend) return "";
public/control-center/pages/media-studio-workspace.js:1260:  if (mode === "campaign-pack" && readiness.image_generation_backend && readiness.video_generation_backend && readiness.voice_generation_backend) return "";
public/control-center/pages/media-studio-workspace.js:1591:  return `<span class="media-status-pill is-${escapeHtml(statusClass(status))}">${escapeHtml(displayMediaStatusLabel(status))}</span>`;
public/control-center/pages/media-studio-workspace.js:1594:function displayMediaStatusLabel(status) {
public/control-center/pages/media-studio-workspace.js:1612:    clean(payload.voice_script) ||
public/control-center/pages/media-studio-workspace.js:1615:    asObject(payload.campaign_pack).voice_script ||
public/control-center/pages/media-studio-workspace.js:1616:    clean(payload.message)
public/control-center/pages/media-studio-workspace.js:1713:        : "No obvious governance escalation signal in current prompt context."
public/control-center/pages/media-studio-workspace.js:1737:  const status = displayMediaStatusLabel(selectedVersionEntry(session)?.readiness_status || selectedItem?.status || form.status || "draft");
public/control-center/pages/media-studio-workspace.js:1748:          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
public/control-center/pages/media-studio-workspace.js:1805:      detail: hasOutput ? displayMediaStatusLabel(readiness.readinessStatus) : "Needs output"
public/control-center/pages/media-studio-workspace.js:1867:    ["Voice", selectedItem?.mode === "voice" ? "Selected" : "Available"],
public/control-center/pages/media-studio-workspace.js:1928:  const fallback = getGeneratorFallbackMessage(session, backendProjectName);
public/control-center/pages/media-studio-workspace.js:1947:            Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
public/control-center/pages/media-studio-workspace.js:1960:          ${renderField({ id: "mediaFormatInput", name: "format", label: "Format", value: form.format, helper: "Examples: 1:1 product image, 9:16 reel, voiceover script, marketplace hero." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1977:      ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
public/control-center/pages/media-studio-workspace.js:1999:        <button id="mediaVideoToVoiceBtn" class="btn btn-secondary" type="button">Convert video brief to voiceover</button>
public/control-center/pages/media-studio-workspace.js:2122:    clean(payload.voice_script) ||
public/control-center/pages/media-studio-workspace.js:2125:    asObject(payload.campaign_pack).voice_script ||
public/control-center/pages/media-studio-workspace.js:2126:    clean(payload.message)
public/control-center/pages/media-studio-workspace.js:2171:        <span class="card-badge ${statusTone(activeStatus)}">${escapeHtml(displayMediaStatusLabel(activeStatus))}</span>
public/control-center/pages/media-studio-workspace.js:2191:            <strong>${escapeHtml(displayMediaStatusLabel(status))}</strong>
public/control-center/pages/media-studio-workspace.js:2238:    normalizeMediaUrl(asObject(root.voice).audio_url),
public/control-center/pages/media-studio-workspace.js:2280:  const voiceScript = asString(payload.voice_script);
public/control-center/pages/media-studio-workspace.js:2306:      const lines = parseStructuredList(videoBrief || asString(payload.message));
public/control-center/pages/media-studio-workspace.js:2313:  if (mode === "voice") {
public/control-center/pages/media-studio-workspace.js:2327:          <div class="media-check-item"><span>Voice tone</span><strong>${escapeHtml(tone)}</strong></div>
public/control-center/pages/media-studio-workspace.js:2332:        <div class="media-prompt-box media-block-gap">${escapeHtml(voiceScript || asString(payload.message) || "No voice script or audio output is available yet. Voice mode prepares voiceover scripts/audio outputs only; it does not run IVR, phone calls, or call-center workflows.")}</div>
public/control-center/pages/media-studio-workspace.js:2342:        <div class="media-check-item"><span>Voice script</span><strong>${escapeHtml(firstText(campaignPack.voice_script, "Missing"))}</strong></div>
public/control-center/pages/media-studio-workspace.js:2355:          <p class="media-section-copy">${escapeHtml(firstText(payload.message, `Detected output type: ${mediaPreview.detectedType}.`))}</p>
public/control-center/pages/media-studio-workspace.js:2489:        <span class="card-badge ${statusTone(normalizeStatus(version?.readiness_status || selectedItem?.status || "draft", "draft"))}">${escapeHtml(displayMediaStatusLabel(version?.readiness_status || selectedItem?.status || "draft"))}</span>
public/control-center/pages/media-studio-workspace.js:2517:  if (mode.includes("voice") || mode.includes("audio")) return "voice-director";
public/control-center/pages/media-studio-workspace.js:2555:          <p class="card-label">AI Agent Support</p>
public/control-center/pages/media-studio-workspace.js:2595:    ["voice generation backend", readiness.voice_generation_backend],
public/control-center/pages/media-studio-workspace.js:2616:      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
public/control-center/pages/media-studio-workspace.js:2689:async function persistMediaJob({ backendProjectName, projectName, state, session, status, showMessage }) {
public/control-center/pages/media-studio-workspace.js:2692:    showMessage?.("Media draft saved locally.");
public/control-center/pages/media-studio-workspace.js:2702:    showMessage?.("Media job saved.");
public/control-center/pages/media-studio-workspace.js:2705:    showMessage?.("Backend media save unavailable; draft kept locally.");
public/control-center/pages/media-studio-workspace.js:2717:  showMessage,
public/control-center/pages/media-studio-workspace.js:2731:  function applyPrompt(value, message) {
public/control-center/pages/media-studio-workspace.js:2735:    session.draftMessage = message || "";
public/control-center/pages/media-studio-workspace.js:2741:    if (mode === "audio") return generateMediaVoiceScript;
public/control-center/pages/media-studio-workspace.js:2761:    const callApi = generationApiForMode(activeRequestType);
public/control-center/pages/media-studio-workspace.js:2764:      const response = await callApi(buildGenerationRequestPayload(session));
public/control-center/pages/media-studio-workspace.js:2774:          notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
public/control-center/pages/media-studio-workspace.js:2780:        session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:2792:        notes: firstText(response?.message, "Generation response captured."),
public/control-center/pages/media-studio-workspace.js:2804:      if (response?.voice_script) {
public/control-center/pages/media-studio-workspace.js:2805:        session.form.reviewNotes = [session.form.reviewNotes, response.voice_script].filter(Boolean).join("\n\n").trim();
public/control-center/pages/media-studio-workspace.js:2819:        showMessage
public/control-center/pages/media-studio-workspace.js:2821:      session.draftMessage = "Generation completed and queued for review.";
public/control-center/pages/media-studio-workspace.js:2825:      const authMessage = mediaAccessKeyMessage(error);
public/control-center/pages/media-studio-workspace.js:2831:          message: isAuthError
public/control-center/pages/media-studio-workspace.js:2832:            ? authMessage
public/control-center/pages/media-studio-workspace.js:2833:            : firstText(error?.payload?.message, error?.message, "Generation failed."),
public/control-center/pages/media-studio-workspace.js:2841:          ? authMessage
public/control-center/pages/media-studio-workspace.js:2842:          : firstText(error?.payload?.message, error?.message, "Generation failed."),
public/control-center/pages/media-studio-workspace.js:2851:      const payloadMessage = error?.payload?.message;
public/control-center/pages/media-studio-workspace.js:2852:      session.draftMessage = isAuthError
public/control-center/pages/media-studio-workspace.js:2853:        ? `${authMessage} Draft kept locally.`
public/control-center/pages/media-studio-workspace.js:2854:        : payloadMessage || error?.message || "Generation failed. Draft kept locally.";
public/control-center/pages/media-studio-workspace.js:2893:      showMessage?.("New media job draft opened.");
public/control-center/pages/media-studio-workspace.js:2906:      await persistMediaJob({ backendProjectName, projectName, state, session, status: "prompt_ready", showMessage });
public/control-center/pages/media-studio-workspace.js:2924:        session.draftMessage = "No workflow handoff is available.";
public/control-center/pages/media-studio-workspace.js:2933:      session.draftMessage = "Prompt generated from workflow handoff.";
public/control-center/pages/media-studio-workspace.js:2950:          applyPrompt(improvePrompt(session.form.prompt), result.message || "Prompt improved locally.");
public/control-center/pages/media-studio-workspace.js:2956:          const authMessage = mediaAccessKeyMessage(error);
public/control-center/pages/media-studio-workspace.js:2958:          applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
public/control-center/pages/media-studio-workspace.js:2962:        applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
public/control-center/pages/media-studio-workspace.js:2979:          applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
public/control-center/pages/media-studio-workspace.js:2983:        const message = result?.brand_check?.is_brand_safe
public/control-center/pages/media-studio-workspace.js:2986:        applyPrompt(safePrompt, message);
public/control-center/pages/media-studio-workspace.js:2989:          const authMessage = mediaAccessKeyMessage(error);
public/control-center/pages/media-studio-workspace.js:2991:          applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
public/control-center/pages/media-studio-workspace.js:2995:        applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
public/control-center/pages/media-studio-workspace.js:3006:  const videoToVoiceBtn = document.getElementById("mediaVideoToVoiceBtn");
public/control-center/pages/media-studio-workspace.js:3007:  if (videoToVoiceBtn) videoToVoiceBtn.onclick = () => { sync(); applyPrompt(convertVideoBriefToVoiceover(session.form.prompt), "Video brief converted to voiceover script."); };
public/control-center/pages/media-studio-workspace.js:3037:      session.draftMessage = summary.sourcePage === "content-studio"
public/control-center/pages/media-studio-workspace.js:3060:        showMessage?.("Media job saved as local draft.");
public/control-center/pages/media-studio-workspace.js:3067:        showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
public/control-center/pages/media-studio-workspace.js:3076:        showMessage?.("Media job marked review-ready locally.");
public/control-center/pages/media-studio-workspace.js:3085:        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3122:      showMessage?.("Media review state recorded.");
public/control-center/pages/media-studio-workspace.js:3152:          showMessage?.("Review request created.");
public/control-center/pages/media-studio-workspace.js:3154:          showMessage?.("Review request kept as local review state.");
public/control-center/pages/media-studio-workspace.js:3157:        showMessage?.("Media draft moved to needs review locally.");
public/control-center/pages/media-studio-workspace.js:3190:      showMessage?.("Media job returned to draft for revision.");
public/control-center/pages/media-studio-workspace.js:3220:          showMessage?.("Task created and linked to the media job.");
public/control-center/pages/media-studio-workspace.js:3222:          showMessage?.("Task action kept locally because backend task save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3225:        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
public/control-center/pages/media-studio-workspace.js:3262:      showMessage?.("Media context sent to AI Command.");
public/control-center/pages/media-studio-workspace.js:3275:      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3289:        showMessage,
public/control-center/pages/media-studio-workspace.js:3308:      session.draftMessage = `${titleCase(key)} selected.`;
public/control-center/pages/media-studio-workspace.js:3333:        showMessage?.("Selected version marked review-ready.");
public/control-center/pages/media-studio-workspace.js:3340:        showMessage?.("Selected version rejected and returned to draft.");
public/control-center/pages/media-studio-workspace.js:3349:            message: "Regenerated from selected version prompt.",
public/control-center/pages/media-studio-workspace.js:3360:        showMessage?.("Selected version regenerated as prompt-ready draft.");
public/control-center/pages/media-studio-workspace.js:3364:        showMessage?.("Selected version saved as draft.");
public/control-center/pages/media-studio-workspace.js:3371:        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3381:          showMessage,
public/control-center/pages/media-studio-workspace.js:3396:      session.draftMessage = `${specialist.title} prompt added.`;
public/control-center/pages/media-studio-workspace.js:3399:        showMessage?.(`${specialist.title} draft saved locally.`);
public/control-center/pages/media-studio-workspace.js:3427:        showMessage?.(`${specialist.title} prompt opened in AI Command.`);
public/control-center/pages/media-studio-workspace.js:3434:async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
public/control-center/pages/media-studio-workspace.js:3447:      showMessage?.("Publishing package handoff prepared from Media Studio.");
public/control-center/pages/media-studio-workspace.js:3449:      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3452:    showMessage?.("Publishing package handoff prepared locally.");
public/control-center/pages/media-studio-workspace.js:3458:    showError?.(error.message || "Failed to open Publishing.");
public/control-center/pages/media-studio-workspace.js:3468:    description: "Run saved image, video, voice, and campaign-pack jobs with prompts, review states, Library saves, and package routing."
public/control-center/pages/media-studio-workspace.js:3480:    showMessage,
public/control-center/pages/media-studio-workspace.js:3495:      showMessage,
public/control-center/pages/media-studio-workspace.js:3653:      showMessage,
public/control-center/pages/operations-centers.js:78:      context.showMessage?.(`Opened ${label}.`);
public/control-center/pages/operations-centers.js:122:      context.showMessage?.("Opened AI Command.");
public/control-center/pages/operations-centers.js:133:      context.showMessage?.("Operations prompt added to AI Command.");
public/control-center/pages/operations-centers.js:168:function buildOpsAssistantPrompts(pageKey, projectName, selectedItem, focusLabel) {
public/control-center/pages/operations-centers.js:170:  const itemLabel = asString(selectedItem?.title || selectedItem?.name || selectedItem?.message || "the selected item");
public/control-center/pages/operations-centers.js:217:        prompt: `Analyze Queue Center for ${projectLabel} with focus on ${focusLabel}. Identify throughput blockers, queue bottlenecks, and the next operational adjustments.`
public/control-center/pages/operations-centers.js:256:      prompt: `Summarize the current operational notification signal for ${projectLabel} with focus on ${focusLabel}. Highlight approvals, provider health, publishing events, and urgent follow-up.`
public/control-center/pages/operations-centers.js:351:      label: "Inbox",
public/control-center/pages/operations-centers.js:454:          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically from this handoff.</p>
public/control-center/pages/operations-centers.js:543:          description: "Supporting cross-center health and risk signal.",
public/control-center/pages/operations-centers.js:544:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:573:            ${session.errorMessage ? `<div class="error-state" aria-live="assertive">${escapeHtml(session.errorMessage)}</div>` : ""}
public/control-center/pages/operations-centers.js:700:    errorMessage: ""
public/control-center/pages/operations-centers.js:737:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:749:          session.errorMessage = `Task Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:751:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:754:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:771:      context.showMessage?.("Task summary copied.");
public/control-center/pages/operations-centers.js:800:      context.showMessage?.("Incoming handoff summary copied.");
public/control-center/pages/operations-centers.js:854:  const showErrorState = Boolean(session.errorMessage);
public/control-center/pages/operations-centers.js:862:            <span>${escapeHtml(session.errorMessage)}</span>
public/control-center/pages/operations-centers.js:914:          description: "Supporting cross-center runtime and queue pressure context.",
public/control-center/pages/operations-centers.js:915:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:944:              <div class="error-state ops-queue-state" aria-live="assertive"><strong>Queue Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1048:    errorMessage: ""
public/control-center/pages/operations-centers.js:1078:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1090:          session.errorMessage = `Queue Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1092:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:1095:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1144:  const showErrorState = Boolean(session.errorMessage);
public/control-center/pages/operations-centers.js:1152:            <span>${escapeHtml(session.errorMessage)}</span>
public/control-center/pages/operations-centers.js:1204:          description: "Supporting cross-center runtime and execution health context.",
public/control-center/pages/operations-centers.js:1205:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:1234:              <div class="error-state ops-job-state" aria-live="assertive"><strong>Job Monitor error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1343:    errorMessage: ""
public/control-center/pages/operations-centers.js:1371:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1383:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1385:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:1388:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1427:      message: "Provider readiness check is currently failing.",
public/control-center/pages/operations-centers.js:1444:    errorMessage: ""
public/control-center/pages/operations-centers.js:1448:  const inboxItems = asArray(notificationCenter.notification_items).map((item) => ({
public/control-center/pages/operations-centers.js:1451:    message: asString(item.message || item.body || item.summary),
public/control-center/pages/operations-centers.js:1455:    item_type: "inbox"
public/control-center/pages/operations-centers.js:1475:  const inboxList = inboxItems.map((item, index) => ({
public/control-center/pages/operations-centers.js:1477:    _opsKey: getOpsItemKey(item, index, "inbox")
public/control-center/pages/operations-centers.js:1480:  let listItems = session.focus === "inbox" ? inboxList : baseAlerts;
public/control-center/pages/operations-centers.js:1485:  listItems = filterBySearch(listItems, session.search, ["title", "message", "source"]);
public/control-center/pages/operations-centers.js:1502:  const showErrorState = Boolean(session.errorMessage);
public/control-center/pages/operations-centers.js:1510:            <span>${escapeHtml(session.errorMessage)}</span>
public/control-center/pages/operations-centers.js:1524:              <span>${escapeHtml(item.message || "-")}</span>
public/control-center/pages/operations-centers.js:1542:            <p class="std-context-description">Review operational alerts, unread inbox state, approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:1545:              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
public/control-center/pages/operations-centers.js:1559:          description: "Supporting cross-center runtime and urgency signal context.",
public/control-center/pages/operations-centers.js:1560:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:1568:                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history and read-state review" : "Operational alert review")}</h3>
public/control-center/pages/operations-centers.js:1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history. Mark Read updates read-state only where a backend notification id exists." : "Review route-aware alerts, then inspect the selected signal before routing or follow-up.")}</p>
public/control-center/pages/operations-centers.js:1579:              { value: "inbox", label: "Inbox", count: formatCount(inboxList.length) }
public/control-center/pages/operations-centers.js:1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
public/control-center/pages/operations-centers.js:1590:              <div class="error-state ops-notification-state" aria-live="assertive"><strong>Notification Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1607:                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
public/control-center/pages/operations-centers.js:1614:                    <p>${escapeHtml(selectedItem.message || selectedItem.body || "No notification detail available.")}</p>
public/control-center/pages/operations-centers.js:1631:                  <p>Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
public/control-center/pages/operations-centers.js:1691:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1703:          session.errorMessage = `Notification Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1705:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:1708:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1737:        context.showMessage?.("Notification marked as read.");
public/control-center/pages/operations-centers.js:1739:        context.showError?.(error.message || "Failed to update notification.");
public/control-center/pages/operations-centers.js:1774:          context.showError?.(`Task Center: ${error?.message || "Failed to load live data."}`);
public/control-center/pages/operations-centers.js:1805:        errorMessage: ""
public/control-center/pages/operations-centers.js:1808:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1820:          session.errorMessage = `Queue Center: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1822:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:1853:        errorMessage: ""
public/control-center/pages/operations-centers.js:1856:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1868:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1870:          context.showError?.(session.errorMessage);
public/control-center/pages/operations-centers.js:1884:    description: "Review alerts, unread inbox state, approvals, provider health, publishing, claim risks, and workflow completion signals with Mark Read limited to notification read-state."
public/control-center/pages/operations-centers.js:1901:        errorMessage: ""
public/control-center/pages/operations-centers.js:1904:      session.errorMessage = "";
public/control-center/pages/operations-centers.js:1916:          session.errorMessage = `Notification Center: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1918:          context.showError?.(session.errorMessage);
public/control-center/pages/research.js:356:      positioning: firstNonEmpty(meta.positioning, meta.angle, meta.message, item.summary, "Positioning hypothesis pending"),
public/control-center/pages/research.js:686:      const errorMessage = [
public/control-center/pages/research.js:687:        insightsResult?.status === "rejected" ? insightsResult.reason?.message : "",
public/control-center/pages/research.js:688:        learningResult?.status === "rejected" ? learningResult.reason?.message : ""
public/control-center/pages/research.js:695:      session.intelligence.error = errorMessage;
public/control-center/pages/research.js:697:      if (errorMessage && !(insights || learning)) {
public/control-center/pages/research.js:698:        showError?.(errorMessage);
public/control-center/pages/research.js:703:      session.intelligence.error = error?.message || "Research intelligence failed to load.";
public/control-center/pages/research.js:747:      preview: "Translate audience and search intelligence into topics, hooks, formats, and calls to action.",
public/control-center/pages/research.js:852:  showMessage,
public/control-center/pages/research.js:872:        showMessage?.("Research intelligence is already refreshing.");
public/control-center/pages/research.js:886:      showMessage?.("Research intelligence refresh started.");
public/control-center/pages/research.js:935:          console.warn("Failed to persist research AI handoff:", error.message);
public/control-center/pages/research.js:939:        showMessage?.("Research prompt added to AI Command.");
public/control-center/pages/research.js:941:        showError?.(error?.message || "Failed to hand off the research prompt to AI Command.");
public/control-center/pages/research.js:983:        console.warn("Failed to persist research route handoff:", error.message);
public/control-center/pages/research.js:994:      showMessage?.(`Research context routed to ${action.label}.`);
public/control-center/pages/research.js:1008:      showMessage?.(`Opportunity routed to ${item.routeTarget.label}.`);
public/control-center/pages/research.js:1053:      showMessage?.("Research finding saved.");
public/control-center/pages/research.js:1073:      showMessage?.("Reusable intelligence block saved.");
public/control-center/pages/research.js:1096:      showMessage?.("Structured recommendation saved.");
public/control-center/pages/research.js:1120:    showMessage,
public/control-center/pages/research.js:1138:      showMessage,
public/control-center/pages/research.js:1529:                        "Once competitor, audience, SEO, or product signals arrive, the page will turn them into short-term and growth-oriented opportunities automatically.",
public/control-center/pages/research.js:1602:      showMessage,
public/control-center/pages/library/action-panel.js:7:  const status = escapePanelHtml(toPanelStatusLabel(selectedAsset?.status || "n/a"));
public/control-center/pages/library/action-panel.js:98:function toPanelStatusLabel(value = "") {
public/control-center/pages/library/session-store.js:42:  return Object.prototype.hasOwnProperty.call(DEFAULT_LIBRARY_SESSION, key);
public/control-center/pages/library/ai-panel.js:12:  const reviewStatus = escapePanelHtml(toPanelStatusLabel(assetStatus || "n/a"));
public/control-center/pages/library/ai-panel.js:108:function toPanelStatusLabel(value = "") {
public/control-center/pages/ai-command.js:98:                id: "customer_ops",
public/control-center/pages/ai-command.js:99:                label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:101:                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:126:	customer_operations: "customer_ops",
public/control-center/pages/ai-command.js:127:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:128:	support: "customer_ops",
public/control-center/pages/ai-command.js:129:	sales: "sales_crm",
public/control-center/pages/ai-command.js:130:	crm: "sales_crm",
public/control-center/pages/ai-command.js:131:	sales_crm: "sales_crm",
public/control-center/pages/ai-command.js:148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
public/control-center/pages/ai-command.js:159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
public/control-center/pages/ai-command.js:160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
public/control-center/pages/ai-command.js:161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
public/control-center/pages/ai-command.js:187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
public/control-center/pages/ai-command.js:226:		cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],
public/control-center/pages/ai-command.js:258:		id: "customer_ops",
public/control-center/pages/ai-command.js:259:		label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:260:		position: "Customer Experience Operations Lead",
public/control-center/pages/ai-command.js:262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
public/control-center/pages/ai-command.js:263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
public/control-center/pages/ai-command.js:264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
public/control-center/pages/ai-command.js:265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
public/control-center/pages/ai-command.js:266:		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
public/control-center/pages/ai-command.js:267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:273:		position: "Revenue and CRM Operations Lead",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:297:		{ label: "Suggest message variants", sub: "Test different angles and tones" }
public/control-center/pages/ai-command.js:341:	customer_ops: [
public/control-center/pages/ai-command.js:342:		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
public/control-center/pages/ai-command.js:343:		{ label: "Draft customer reply", sub: "Safe response for review" },
public/control-center/pages/ai-command.js:344:		{ label: "Check SLA risk", sub: "Flag urgency and escalation path" },
public/control-center/pages/ai-command.js:345:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
public/control-center/pages/ai-command.js:347:	sales_crm: [
public/control-center/pages/ai-command.js:349:		{ label: "Draft outreach", sub: "Personalized message for review" },
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
public/control-center/pages/ai-command.js:395:	customer_ops: "CO",
public/control-center/pages/ai-command.js:396:	sales_crm: "SC"
public/control-center/pages/ai-command.js:450:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:488:	customer_ops: [
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
public/control-center/pages/ai-command.js:493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
public/control-center/pages/ai-command.js:494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
public/control-center/pages/ai-command.js:495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:498:	sales_crm: [
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
public/control-center/pages/ai-command.js:501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:601:		purpose: "Translate intent into executable workflows and handoffs.",
public/control-center/pages/ai-command.js:638:		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:639:		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:648:	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
public/control-center/pages/ai-command.js:702:	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:703:	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:824:  session.draftMessage = cleanValue;
public/control-center/pages/ai-command.js:854:	const message = asString(error?.message).toLowerCase();
public/control-center/pages/ai-command.js:855:	return message.includes("insights") || message.includes("learning") || message.includes("not found");
public/control-center/pages/ai-command.js:876:	const conversationLanguage = asString(
public/control-center/pages/ai-command.js:877:		overview.conversation_language ||
public/control-center/pages/ai-command.js:884:		conversationLanguage,
public/control-center/pages/ai-command.js:924:function extractTopMessage(item = {}) {
public/control-center/pages/ai-command.js:941:			draftMessage: "",
public/control-center/pages/ai-command.js:946:			validationMessage: "",
public/control-center/pages/ai-command.js:952:			messages: [],
public/control-center/pages/ai-command.js:1022:		session.draftMessage = asString(localDraft.prompt);
public/control-center/pages/ai-command.js:1023:		session.composerText = session.draftMessage;
public/control-center/pages/ai-command.js:1037:		prompt: session.draftMessage,
public/control-center/pages/ai-command.js:1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
public/control-center/pages/ai-command.js:1120:        const messages = asArray(session.messages);
public/control-center/pages/ai-command.js:1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
public/control-center/pages/ai-command.js:1128:        const firstUser = messages.find((message) => asString(message.role) === "user");
public/control-center/pages/ai-command.js:1136:                messages: messages.slice(-40),
public/control-center/pages/ai-command.js:1159:        session.messages = asArray(record.messages).slice(-40);
public/control-center/pages/ai-command.js:1164:        session.draftMessage = "";
public/control-center/pages/ai-command.js:1192:			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
public/control-center/pages/ai-command.js:1201:		`User conversation language: ${safeLanguage}`,
public/control-center/pages/ai-command.js:1204:                "Reply to the user in the same language as the latest user request.",
public/control-center/pages/ai-command.js:1205:                "If the user writes Arabic, reply in Arabic. If the user writes English, reply in English. If the user writes German, reply in German.",
public/control-center/pages/ai-command.js:1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
public/control-center/pages/ai-command.js:1304:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
public/control-center/pages/ai-command.js:1305:        const looksMediaLike = /\b(media|visual|creative|image|images|video|reel|storyboard|shot list|asset|assets|design|production|creative direction|voiceover)\b/.test(text);
public/control-center/pages/ai-command.js:1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
public/control-center/pages/ai-command.js:1574:	if (specialistId === "customer_ops") {
public/control-center/pages/ai-command.js:1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
public/control-center/pages/ai-command.js:1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
public/control-center/pages/ai-command.js:1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
public/control-center/pages/ai-command.js:1580:			replyDraft: [
public/control-center/pages/ai-command.js:1581:				"Thank the customer, acknowledge the issue, and confirm the next reviewed support step.",
public/control-center/pages/ai-command.js:1584:			ticketDraft: [
public/control-center/pages/ai-command.js:1585:				"Issue summary: customer concern or request captured for review.",
public/control-center/pages/ai-command.js:1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
public/control-center/pages/ai-command.js:1587:				"Owner: support, sales, or operations to be confirmed before creation."
public/control-center/pages/ai-command.js:1590:				"Unified Inbox is not duplicated here; this is a draft and routing preview only.",
public/control-center/pages/ai-command.js:1591:				"SLA and escalation decisions require confirmation in the owning operations surface."
public/control-center/pages/ai-command.js:1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
public/control-center/pages/ai-command.js:1595:				"Summarize the customer thread",
public/control-center/pages/ai-command.js:1596:				"Draft a safe customer reply",
public/control-center/pages/ai-command.js:1597:				"Create ticket draft fields for review",
public/control-center/pages/ai-command.js:1598:				"Confirm escalation or routing before action"
public/control-center/pages/ai-command.js:1601:			safetyLabel: "No reply sent, ticket created, SLA changed, or escalation triggered."
public/control-center/pages/ai-command.js:1605:	if (specialistId === "sales_crm") {
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
public/control-center/pages/ai-command.js:1627:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1704:			"Writer, Media Director, and Video Lead turn strategy into message, asset, and production drafts",
public/control-center/pages/ai-command.js:1706:			"Customer Ops and Sales / CRM join when the request touches inbox, tickets, leads, outreach, or CRM"
public/control-center/pages/ai-command.js:1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
public/control-center/pages/ai-command.js:1711:			"Media / Video: prepare creative direction, asset needs, script, storyboard, or voiceover draft",
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1970:		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
public/control-center/pages/ai-command.js:1971:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:1978:function classifyIntent(message, selectedModeId) {
public/control-center/pages/ai-command.js:1981:		score: scoreMode(message, mode.id) + (mode.id === selectedModeId ? 0.75 : 0)
public/control-center/pages/ai-command.js:1985:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2064:			? `${extractTopMessage(top)} is the strongest measured content item right now${top.platform ? ` on ${titleCase(top.platform)}` : ""}.`
public/control-center/pages/ai-command.js:2067:			top ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} signal.` : "No top post measured yet.",
public/control-center/pages/ai-command.js:2068:			weak ? `Weakest item: ${extractTopMessage(weak)}.` : "No weak content list yet.",
public/control-center/pages/ai-command.js:2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
public/control-center/pages/ai-command.js:2074:			weak ? `Rewrite ${extractTopMessage(weak)} with a stronger hook and better platform fit.` : null,
public/control-center/pages/ai-command.js:2078:			top ? `Create a follow-up asset using ${extractTopMessage(top)}'s pattern.` : "Load social insight data before expanding content queue.",
public/control-center/pages/ai-command.js:2079:			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
public/control-center/pages/ai-command.js:2103:			topQuery ? `Top query: ${extractTopMessage(topQuery)} with ${formatCompactNumber(topQuery.clicks)} clicks.` : "No top query data yet.",
public/control-center/pages/ai-command.js:2104:			lowCtr ? `CTR opportunity: ${extractTopMessage(lowCtr)} has visibility but weak click-through.` : "No low-CTR list yet.",
public/control-center/pages/ai-command.js:2105:			weakPage ? `Weak landing page: ${extractTopMessage(weakPage)}.` : "No weak page signal yet.",
public/control-center/pages/ai-command.js:2109:			lowCtr ? `Improve title and SERP message for ${extractTopMessage(lowCtr)}.` : "Connect Search Console to unlock CTR analysis.",
public/control-center/pages/ai-command.js:2110:			weakPage ? `Tighten intent match and CTA on ${extractTopMessage(weakPage)}.` : "Review page titles and meta descriptions on priority pages.",
public/control-center/pages/ai-command.js:2114:			topQuery ? `Expand content around ${extractTopMessage(topQuery)}.` : "Reconnect Search Console before making SEO roadmap decisions.",
public/control-center/pages/ai-command.js:2115:			lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Audit page titles on highest-priority pages.",
public/control-center/pages/ai-command.js:2138:			bestCampaign ? `Best campaign: ${extractTopMessage(bestCampaign)}.` : "No winning campaign measured yet.",
public/control-center/pages/ai-command.js:2139:			weakCampaign ? `Weak campaign: ${extractTopMessage(weakCampaign)}.` : "No weak campaign list yet.",
public/control-center/pages/ai-command.js:2140:			bestCreative ? `Best creative: ${extractTopMessage(bestCreative)}.` : "No creative breakdown yet.",
public/control-center/pages/ai-command.js:2144:			bestCampaign ? `Scale ${extractTopMessage(bestCampaign)} only after validating strong CTR and ROAS.` : "Connect paid platforms before making scale decisions.",
public/control-center/pages/ai-command.js:2145:			weakCampaign ? `Pause or refresh ${extractTopMessage(weakCampaign)} if weak pattern continues.` : null,
public/control-center/pages/ai-command.js:2149:			bestCreative ? `Reuse the creative pattern behind ${extractTopMessage(bestCreative)}.` : "Sync paid data before scaling any creative.",
public/control-center/pages/ai-command.js:2150:			weakCampaign ? `Rebuild hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping.",
public/control-center/pages/ai-command.js:2194:function buildOperationsTaskBlock(aiContext, message) {
public/control-center/pages/ai-command.js:2195:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2211:function buildOperationsResponse(aiContext, message) {
public/control-center/pages/ai-command.js:2212:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2213:	const taskBlock = buildOperationsTaskBlock(aiContext, message);
public/control-center/pages/ai-command.js:2241:function buildResponseForMode(aiContext, classified, message) {
public/control-center/pages/ai-command.js:2254:			return buildOperationsResponse(aiContext, message);
public/control-center/pages/ai-command.js:2258:				? buildOperationsResponse(aiContext, message)
public/control-center/pages/ai-command.js:2303:					insightsResult.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
public/control-center/pages/ai-command.js:2304:					learningResult.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
public/control-center/pages/ai-command.js:2317:				session.intelligence = { ...session.intelligence, project: projectName, status: "error", error: error.message || "Failed to load live intelligence", loadingPromise: null };
public/control-center/pages/ai-command.js:2392:	"customer-ops": "customer_ops",
public/control-center/pages/ai-command.js:2393:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:2394:	"sales-crm": "sales_crm",
public/control-center/pages/ai-command.js:2395:	sales_crm: "sales_crm"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2585:		payload.message,
public/control-center/pages/ai-command.js:2588:		draftContext.message,
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2637:function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
public/control-center/pages/ai-command.js:2643:	session.draftMessage = normalized.prompt;
public/control-center/pages/ai-command.js:2687:			console.warn("Failed to consume AI handoff:", error.message);
public/control-center/pages/ai-command.js:2690:	showMessage?.(`Inbound handoff loaded from ${normalized.sourceLabel}.`);
public/control-center/pages/ai-command.js:2732:		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
public/control-center/pages/ai-command.js:2750:	session.messages.push({
public/control-center/pages/ai-command.js:2759:	session.messages.push({
public/control-center/pages/ai-command.js:2778:	session.draftMessage = "";
public/control-center/pages/ai-command.js:2809:      purpose: asString(member.purpose || member.description || fallback.purpose || "Support the current operating context."),
public/control-center/pages/ai-command.js:2818:	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
public/control-center/pages/ai-command.js:2855:					<strong>${escapeHtml(readinessLabel)}</strong>
public/control-center/pages/ai-command.js:2939:				>${escapeHtml(session.draftMessage)}</textarea>
public/control-center/pages/ai-command.js:3106://  RENDER: MESSAGE STREAM
public/control-center/pages/ai-command.js:3109:function renderMessageStream(messages, escapeHtml) {
public/control-center/pages/ai-command.js:3110:	if (!messages.length) {
public/control-center/pages/ai-command.js:3114:				<div class="ctrl-empty-title">Start the conversation</div>
public/control-center/pages/ai-command.js:3120:	return messages.map((message) => {
public/control-center/pages/ai-command.js:3121:		const mode = getModeMeta(message.modeId);
public/control-center/pages/ai-command.js:3122:		if (message.role === "user") {
public/control-center/pages/ai-command.js:3126:						<div class="ctrl-msg-user-text">${escapeHtml(message.content)}</div>
public/control-center/pages/ai-command.js:3127:						<div class="ctrl-msg-meta">${escapeHtml(formatTime(message.createdAt))}</div>
public/control-center/pages/ai-command.js:3136:					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
public/control-center/pages/ai-command.js:3137:					${renderCleanResponse(asObject(message.response), escapeHtml, message.id)}
public/control-center/pages/ai-command.js:3152:				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Conversation &amp; results</h3>
public/control-center/pages/ai-command.js:3153:				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
public/control-center/pages/ai-command.js:3156:				${renderMessageStream(session.messages, escapeHtml)}
public/control-center/pages/ai-command.js:3179:							const statusLabel = entry.failed ? "Failed" : "Done";
public/control-center/pages/ai-command.js:3189:										<span class="card-badge ${statusClass}" style="font-size:10px;padding:2px 7px;">${statusLabel}</span>
public/control-center/pages/ai-command.js:3212:	const artifacts = session.messages
public/control-center/pages/ai-command.js:3275:function getLastUserMessage(session) {
public/control-center/pages/ai-command.js:3276:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
public/control-center/pages/ai-command.js:3279:function getLastAssistantMessage(session) {
public/control-center/pages/ai-command.js:3280:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
public/control-center/pages/ai-command.js:3283:function buildConversationWorkContext(session, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3284:        const messages = asArray(session.messages).slice(-12);
public/control-center/pages/ai-command.js:3285:        const latestUser = getLastUserMessage(session);
public/control-center/pages/ai-command.js:3286:        const latestAssistant = getLastAssistantMessage(session);
public/control-center/pages/ai-command.js:3292:        const conversationLines = messages
public/control-center/pages/ai-command.js:3293:                .map((message) => {
public/control-center/pages/ai-command.js:3294:                        const role = asString(message.role || "");
public/control-center/pages/ai-command.js:3297:                                : asString(message.specialistLabel || specialist.label || "Specialist");
public/control-center/pages/ai-command.js:3298:                        const content = asString(message.content || message.text || message.responseText || "").trim();
public/control-center/pages/ai-command.js:3307:                session.draftMessage ||
public/control-center/pages/ai-command.js:3320:                conversationLines.length ? `Conversation context:\n${conversationLines.join("\n")}` : ""
public/control-center/pages/ai-command.js:3326:                conversationText: conversationLines.join("\n"),
public/control-center/pages/ai-command.js:3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3336:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3347:                `Convert this AI Team conversation into a ${typeLabel}.`,
public/control-center/pages/ai-command.js:3349:                "Use the conversation context, not only the composer text.",
public/control-center/pages/ai-command.js:3356:function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
public/control-center/pages/ai-command.js:3357:        const workPrompt = buildConversationWorkPrompt(session, intent, fallbackPrompt);
public/control-center/pages/ai-command.js:3365:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3367:        preview.conversationContext = context.conversationText;
public/control-center/pages/ai-command.js:3369:        // Keep raw conversation context available internally, but do not show it as the main output.
public/control-center/pages/ai-command.js:3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
public/control-center/pages/ai-command.js:3510:	if (asString(session.draftMessage).trim()) return 0;
public/control-center/pages/ai-command.js:3560:function getToolExecutionStatusLabel(tool) {
public/control-center/pages/ai-command.js:3595:			<span class="aicmd-room-chain-branch-label">Customer / revenue branch</span>
public/control-center/pages/ai-command.js:3606:	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "Pending";
public/control-center/pages/ai-command.js:3650:					<strong>${escapeHtml(readinessLabel)}</strong>
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3781:function getAiSpecialistWorkingMessage(session = {}) {
public/control-center/pages/ai-command.js:3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
public/control-center/pages/ai-command.js:3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
public/control-center/pages/ai-command.js:3818:				<span class="aicmd-room-kicker">Conversation Room</span>
public/control-center/pages/ai-command.js:3838:	if (/task|ticket|checklist|owner_map|priority/.test(haystack)) return "task";
public/control-center/pages/ai-command.js:3921:					const status = getToolExecutionStatusLabel(tool);
public/control-center/pages/ai-command.js:3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
public/control-center/pages/ai-command.js:3963:		{ label: "Voice input", value: "Coming", className: "is-planned" },
public/control-center/pages/ai-command.js:3983:		const placeholder = "Message the AI specialist...";
public/control-center/pages/ai-command.js:3989:		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
public/control-center/pages/ai-command.js:4009:						aria-label="Message ${escapeHtml(specLabel)}"
public/control-center/pages/ai-command.js:4010:					>${escapeHtml(session.draftMessage)}</textarea>
public/control-center/pages/ai-command.js:4014:							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
public/control-center/pages/ai-command.js:4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
public/control-center/pages/ai-command.js:4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
public/control-center/pages/ai-command.js:4195:					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
public/control-center/pages/ai-command.js:4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4274:				<h3 class="aicmd-v2-media-status-title">Media, Voice &amp; Chat Capability</h3>
public/control-center/pages/ai-command.js:4281:				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
public/control-center/pages/ai-command.js:4282:				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
public/control-center/pages/ai-command.js:4283:				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
public/control-center/pages/ai-command.js:4285:				<li><span>Realtime voice chat</span><strong class="is-planned">Future — needs provider + bridge</strong></li>
public/control-center/pages/ai-command.js:4291:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:4299:        const allMessages = asArray(session.messages);
public/control-center/pages/ai-command.js:4300:        const selectedMessages = allMessages.filter((message) => {
public/control-center/pages/ai-command.js:4301:                const role = asString(message.role || "");
public/control-center/pages/ai-command.js:4302:                const messageRoleId = getAiRoomRoleId(message.specialistId || message.modeId || "");
public/control-center/pages/ai-command.js:4304:                        return isTeam ? message.teamMode === "team" || messageRoleId === "team" : messageRoleId === selectedRoleId;
public/control-center/pages/ai-command.js:4307:                        return isTeam ? messageRoleId === "team" : messageRoleId === selectedRoleId;
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4329:                ? `Start a focused conversation with ${selectedLabel}.`
public/control-center/pages/ai-command.js:4354:        const renderMessage = (message) => {
public/control-center/pages/ai-command.js:4355:                const role = asString(message.role || "");
public/control-center/pages/ai-command.js:4357:                const label = isUser ? "You" : asString(message.specialistLabel || selectedLabel || "Specialist");
public/control-center/pages/ai-command.js:4358:                const createdAt = asString(message.createdAt || "");
public/control-center/pages/ai-command.js:4359:                const content = asString(message.content || message.text || message.responseText || "");
public/control-center/pages/ai-command.js:4361:                        <div class="aicmd-room-chat-message ${isUser ? "is-user" : "is-assistant"}">
public/control-center/pages/ai-command.js:4363:                                        <div class="aicmd-room-chat-message-meta">
public/control-center/pages/ai-command.js:4373:        const fallbackSelectedResponses = !selectedMessages.length && selectedResponses.length
public/control-center/pages/ai-command.js:4392:        const conversationMessages = selectedMessages.length ? selectedMessages : fallbackSelectedResponses;
public/control-center/pages/ai-command.js:4398:                                        <h3 class="aicmd-v2-chat-title">Conversation</h3>
public/control-center/pages/ai-command.js:4430:                                        <span>Latest selected reply</span>
public/control-center/pages/ai-command.js:4432:                                        <small>${escapeHtml(latestSelected ? formatTime(latestSelected.generatedAt) : "No reply yet")}</small>
public/control-center/pages/ai-command.js:4440:                                                                <strong>${escapeHtml(getAiSpecialistWorkingMessage(session))}</strong>
public/control-center/pages/ai-command.js:4447:                        ${conversationMessages.length ? `
public/control-center/pages/ai-command.js:4449:                                        ${conversationMessages.map(renderMessage).join("")}
public/control-center/pages/ai-command.js:4453:                                        <strong>No conversation with ${escapeHtml(selectedLabel)} yet</strong>
public/control-center/pages/ai-command.js:4537:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
public/control-center/pages/ai-command.js:4542:		{ label: "Conversation language", value: languagePlan.conversationLanguage, present: true },
public/control-center/pages/ai-command.js:4552:	const scopedContextItems = session.teamMode === "solo" && session.modeId === "customer_ops"
public/control-center/pages/ai-command.js:4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
public/control-center/pages/ai-command.js:4555:			{ label: "Tickets", value: "Draft / monitored in Operations", present: true, scoped: true },
public/control-center/pages/ai-command.js:4556:			{ label: "SLA", value: "Safe review only", present: true, scoped: true },
public/control-center/pages/ai-command.js:4557:			{ label: "Escalations", value: "Requires confirmation", present: false, scoped: true },
public/control-center/pages/ai-command.js:4560:		: session.teamMode === "solo" && session.modeId === "sales_crm"
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4679:			showMessage,
public/control-center/pages/ai-command.js:4696:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
public/control-center/pages/ai-command.js:4697:                   session.messages = asArray(savedOutput.messages).slice(-40);
public/control-center/pages/ai-command.js:4730:			session.draftMessage = normalizeAiComposerPrompt(bridgeValue);
public/control-center/pages/ai-command.js:4740:		applyDurableAiHandoff(sessionKey, operations, session, consumeProjectHandoff, showMessage);
public/control-center/pages/ai-command.js:4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
public/control-center/pages/ai-command.js:4768:												${renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4769:												<div class="aicmd-room-specialist-conversation">
public/control-center/pages/ai-command.js:4770:													${renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4794:			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
public/control-center/pages/ai-command.js:4801:			session.draftMessage = value;
public/control-center/pages/ai-command.js:4802:			session.composerText = session.draftMessage;
public/control-center/pages/ai-command.js:4818:			persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:4837:		                        messages: session.messages,
public/control-center/pages/ai-command.js:4844:		                showMessage?.("AI chat session loaded.");
public/control-center/pages/ai-command.js:4854:		                session.draftMessage = "";
public/control-center/pages/ai-command.js:4862:		                session.messages = [];
public/control-center/pages/ai-command.js:4873:		                        messages: [],
public/control-center/pages/ai-command.js:4880:		                showMessage?.("New AI session started. Previous chat saved to Recent chats.");
public/control-center/pages/ai-command.js:4888:				showMessage?.("Opening Settings.");
public/control-center/pages/ai-command.js:4911:                                const existingDraft = asString(session.draftMessage).trim();
public/control-center/pages/ai-command.js:4921:                                        session.draftMessage = `Act as the ${spec?.label || titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;
public/control-center/pages/ai-command.js:4922:                                } else if (!session.draftMessage) {
public/control-center/pages/ai-command.js:4923:                                        session.draftMessage = "";
public/control-center/pages/ai-command.js:4947:				session.draftMessage = text;
public/control-center/pages/ai-command.js:4959:				session.draftMessage = text;
public/control-center/pages/ai-command.js:4982:				session.draftMessage = input.value || "";
public/control-center/pages/ai-command.js:4983:				session.composerText = session.draftMessage;
public/control-center/pages/ai-command.js:4984:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
public/control-center/pages/ai-command.js:5003:		const voiceBtn = $("aicmdV2VoiceBtn");
public/control-center/pages/ai-command.js:5004:		if (voiceBtn) {
public/control-center/pages/ai-command.js:5005:			voiceBtn.onclick = () => {
public/control-center/pages/ai-command.js:5010:					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
public/control-center/pages/ai-command.js:5011:					showMessage?.("Voice input readiness is staged for compatible browsers.");
public/control-center/pages/ai-command.js:5028:						persistSessionDraft(sessionKey, session, "Voice input captured");
public/control-center/pages/ai-command.js:5029:						updateStatus("Voice input captured in composer.");
public/control-center/pages/ai-command.js:5032:						updateStatus("Voice input could not start. Microphone permission may be blocked.");
public/control-center/pages/ai-command.js:5035:					updateStatus("Listening for Arabic voice input.");
public/control-center/pages/ai-command.js:5037:					updateStatus("Voice input could not start in this browser.");
public/control-center/pages/ai-command.js:5046:		                const value = asString(input?.value || session.draftMessage || "").trim();
public/control-center/pages/ai-command.js:5048:		                        updateStatus("Please write your message in the composer first.");
public/control-center/pages/ai-command.js:5060:		                        showMessage?.("AI chat route is not connected yet.");
public/control-center/pages/ai-command.js:5068:		                const userChatMessage = {
public/control-center/pages/ai-command.js:5080:		                session.messages.push(userChatMessage);
public/control-center/pages/ai-command.js:5081:		                session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5082:		                session.draftMessage = "";
public/control-center/pages/ai-command.js:5088:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5104:		                                message: value,
public/control-center/pages/ai-command.js:5105:		                                messages: session.messages.slice(-12),
public/control-center/pages/ai-command.js:5106:		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command.js:5134:		                        const assistantChatMessage = {
public/control-center/pages/ai-command.js:5155:		                        session.messages.push(assistantChatMessage);
public/control-center/pages/ai-command.js:5156:		                        session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5162:                                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5172:		                                generatedAt: assistantChatMessage.createdAt,
public/control-center/pages/ai-command.js:5173:		                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5192:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
public/control-center/pages/ai-command.js:5202:		                        showMessage?.("Specialist reply generated.");
public/control-center/pages/ai-command.js:5205:		                        session.responseError = asString(error?.message || "Failed to generate specialist chat reply.");
public/control-center/pages/ai-command.js:5209:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
public/control-center/pages/ai-command.js:5226:                                const fallback = asString(input?.value || session.draftMessage || "").trim();
public/control-center/pages/ai-command.js:5227:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
public/control-center/pages/ai-command.js:5236:                                updateStatus("Guidance preview prepared from conversation context.");
public/control-center/pages/ai-command.js:5237:                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
public/control-center/pages/ai-command.js:5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5247:                                const value = asString(input?.value || session.draftMessage || "").trim();
public/control-center/pages/ai-command.js:5252:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5270:                                const value = asString(input?.value || session.draftMessage || "").trim();
public/control-center/pages/ai-command.js:5275:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
public/control-center/pages/ai-command.js:5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
public/control-center/pages/ai-command.js:5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5294:                                const value = asString(input?.value || session.draftMessage || "").trim();
public/control-center/pages/ai-command.js:5299:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
public/control-center/pages/ai-command.js:5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
public/control-center/pages/ai-command.js:5308:                                showMessage?.("Handoff preview prepared from conversation.");
public/control-center/pages/ai-command.js:5357:				session.draftMessage = asString(input?.value || session.draftMessage || "");
public/control-center/pages/ai-command.js:5358:				persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:5359:				updateStatus("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5360:				showMessage?.("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5368:				session.draftMessage = "";
public/control-center/pages/ai-command.js:5376:				showMessage?.("Composer draft cleared.");
public/control-center/pages/ai-command.js:5399:						showMessage?.("Response copied.");
public/control-center/pages/ai-command.js:5432:				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5433:				showMessage?.("Response saved locally.");
public/control-center/pages/ai-command.js:5440:		                const fallback = latestResponse?.prompt || asString(input?.value || session.draftMessage || "");
public/control-center/pages/ai-command.js:5441:		                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5456:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5462:		                updateStatus("Conversation converted into a draft preview.");
public/control-center/pages/ai-command.js:5463:		                showMessage?.("Draft preview ready from conversation.");
public/control-center/pages/ai-command.js:5498:				showMessage?.("Response draft context prepared. Review in the owning workspace before saving or executing there.");
public/control-center/pages/ai-command.js:5508:					updateStatus("Read is not supported in this browser.");
public/control-center/pages/ai-command.js:5514:				updateStatus("Reading response locally in browser.");
public/control-center/pages/ai-command.js:5533:						showMessage?.("Preview copied.");
public/control-center/pages/ai-command.js:5552:				session.draftMessage = text;
public/control-center/pages/ai-command.js:5593:				showMessage?.("Draft context prepared for routing. Review before saving or executing.");
public/control-center/pages/ai-command.js:5608:				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5609:				showMessage?.("Preview saved locally.");
public/control-center/pages/ai-command.js:5619:					updateStatus("Read preview is not supported in this browser.");
public/control-center/pages/ai-command.js:5628:				updateStatus("Reading preview locally in browser.");
public/control-center/pages/ai-command.js:5637:				showMessage?.("Preview cleared.");
public/control-center/pages/library.js:146:    why: "Research and proof documents support claims, trust signals, and strategy decisions.",
public/control-center/pages/library.js:518:            const message = error instanceof AccessKeyError
public/control-center/pages/library.js:520:              : `Could not open file: ${error.message || "Unknown error."}`;
public/control-center/pages/library.js:521:            alert(message);
public/control-center/pages/library.js:636:function toStatusLabel(status = "") {
public/control-center/pages/library.js:770:  if (mediaType === "voice") return "voice_script";
public/control-center/pages/library.js:772:  if (asset.voice_script) return "voice_script";
public/control-center/pages/library.js:786:  const briefText = asString(payload.video_brief || payload.voice_script || payload.message || asset.notes);
public/control-center/pages/library.js:793:    voice_script: payload.voice_script
public/control-center/pages/library.js:1025:      || (selectedSource === "generated-media" && asset.kind === "managed_media" && ["generated_media", "prompt_asset", "video_brief", "voice_script", "campaign_pack"].includes(asset.asset_type))
public/control-center/pages/library.js:1041:    if (sortBy === "status") return toStatusLabel(left.status).localeCompare(toStatusLabel(right.status));
public/control-center/pages/library.js:1295:    const message = error instanceof AccessKeyError
public/control-center/pages/library.js:1297:      : `Preview unavailable: ${error.message || "Could not load this file."}`;
public/control-center/pages/library.js:1299:    previewNode.innerHTML = `<div class="library-preview-fallback">${escapeHtml(message)}</div>`;
public/control-center/pages/library.js:1302:      showError?.(message);
public/control-center/pages/library.js:1343:    showError?.(`Could not load asset preview: ${error.message || "Unknown error."}`);
public/control-center/pages/library.js:1498:  showMessage,
public/control-center/pages/library.js:1503:  _libraryFeedback = showMessage;
public/control-center/pages/library.js:1518:      showMessage,
public/control-center/pages/library.js:1639:      const statusLabel = item.status === "present" ? "Present" : item.status === "missing" ? "Missing" : "Needs Review";
public/control-center/pages/library.js:1646:            <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
public/control-center/pages/library.js:1693:        showMessage,
public/control-center/pages/library.js:1724:        showMessage,
public/control-center/pages/library.js:1760:        showMessage,
public/control-center/pages/library.js:1791:        showMessage,
public/control-center/pages/library.js:1803:        const statusLabel = toStatusLabel(asset.status);
public/control-center/pages/library.js:1820:              <span class="card-badge ${tone}">${escapeHtml(statusLabel)}</span>
public/control-center/pages/library.js:1897:          <span class="card-badge ${escapeHtml(toStatusTone(selectedAsset.status))}">${escapeHtml(toStatusLabel(selectedAsset.status))}</span>
public/control-center/pages/library.js:1913:            <div class="data-row"><span>Review Status</span><strong>${escapeHtml(toStatusLabel(selectedAsset.status))}</strong></div>
public/control-center/pages/library.js:1956:        showMessage?.("Source added to drawer.");
public/control-center/pages/library.js:1987:              <span>${escapeHtml(`${toStatusLabel(asset.status)} • ${formatDate(asset.uploaded_at)}`)}</span>
public/control-center/pages/library.js:2045:        showMessage?.(`Showing ${mappedFolder.label} assets. Upload category set to ${getLibraryUploadTypeLabel(uploadType)}.`);
public/control-center/pages/library.js:2057:          showMessage,
public/control-center/pages/library.js:2063:        showMessage?.(`Upload category set to ${getLibraryUploadTypeLabel(uploadType)}. Matching workspace filter is not available yet.`);
public/control-center/pages/library.js:2085:          showMessage,
public/control-center/pages/library.js:2095:      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
public/control-center/pages/library.js:2113:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2125:        showMessage,
public/control-center/pages/library.js:2148:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2160:        showMessage,
public/control-center/pages/library.js:2177:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2189:        showMessage,
public/control-center/pages/library.js:2208:      if (_fbCard?.name) showMessage?.(`Selected ${_fbCard.name}. Review status and available actions.`);
public/control-center/pages/library.js:2223:      if (selected?.name) showMessage?.(`Selected ${selected.name}. Review status and available actions.`);
public/control-center/pages/library.js:2300:        const message = error instanceof AccessKeyError
public/control-center/pages/library.js:2302:          : `Could not open file: ${error.message || "Unknown error."}`;
public/control-center/pages/library.js:2303:        showError?.(message);
public/control-center/pages/library.js:2329:        showMessage?.(`${asset.name} ${asset.source_of_truth ? "removed from" : "set as"} source of truth.`);
public/control-center/pages/library.js:2331:        const message = error instanceof AccessKeyError
public/control-center/pages/library.js:2333:          : (error.message || "Failed to update source of truth.");
public/control-center/pages/library.js:2334:        showError?.(message);
public/control-center/pages/library.js:2368:        showMessage?.(`Asset status updated to ${toStatusLabel(status)}.`);
public/control-center/pages/library.js:2370:        const message = error instanceof AccessKeyError
public/control-center/pages/library.js:2372:          : (error.message || "Failed to update asset status.");
public/control-center/pages/library.js:2373:        showError?.(message);
public/control-center/pages/library.js:2405:        showMessage?.("Asset archived.");
public/control-center/pages/library.js:2407:        showError?.(error.message || "Failed to archive asset.");
public/control-center/pages/library.js:2446:        showMessage?.("Asset renamed.");
public/control-center/pages/library.js:2448:        showError?.(error.message || "Failed to rename asset.");
public/control-center/pages/library.js:2482:        showMessage?.("Asset deleted (soft delete).");
public/control-center/pages/library.js:2484:        showError?.(error.message || "Failed to delete asset.");
public/control-center/pages/library.js:2518:      showMessage?.(`Upload category set to ${uploadType}.`);
public/control-center/pages/library.js:2600:      const message = files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected: ${names}${suffix}` : "No files selected";
public/control-center/pages/library.js:2602:      if (info) info.textContent = message;
public/control-center/pages/library.js:2637:        showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
public/control-center/pages/library.js:2678:          showMessage?.(`${files.length} file${files.length === 1 ? "" : "s"} selected for upload.`);
public/control-center/pages/library.js:2721:        showError?.(error.message || "Invalid upload category.");
public/control-center/pages/library.js:2741:        showMessage,
public/control-center/pages/library.js:2761:              error: error.message || "Upload failed",
public/control-center/pages/library.js:2782:          showMessage?.(`Uploaded ${uploaded.length} file${uploaded.length === 1 ? "" : "s"}.`);
public/control-center/pages/library.js:2810:        showMessage?.("Library backend scan refreshed.");
public/control-center/pages/library.js:2812:        showError?.(error.message || "Failed to refresh library scan.");
public/control-center/pages/library.js:2825:      showMessage?.("Classification request prepared. Review AI suggestions before applying changes.");
public/control-center/pages/library.js:2835:      showMessage?.("Missing asset review prepared. The system will focus on required categories that still need attention.");
public/control-center/pages/library.js:2850:      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
public/control-center/pages/library.js:2864:      showMessage?.("Document extraction prompt prepared. Review extracted claims before use.");
public/control-center/pages/library.js:2872:        showMessage?.("Select an asset first to prepare AI context.");
public/control-center/pages/library.js:2878:      showMessage?.(`AI context prepared for ${selectedAsset.name}. Open AI Command to review recommendations.`);
public/control-center/pages/library.js:2902:    showMessage,
public/control-center/pages/library.js:3159:      showMessage,
public/control-center/pages/home.js:164:          "Ready to support this project."
public/control-center/pages/home.js:351:  const escalationSummary = pendingApprovals.length
public/control-center/pages/home.js:353:    : "No escalations";
public/control-center/pages/home.js:456:          statusLabel: campaignReadinessTone === "success" ? "Healthy" : totalBlockers ? "Attention" : "Unknown",
public/control-center/pages/home.js:458:          escalationLabel: failedExecutions.length ? `Escalations: ${formatCount(failedExecutions.length)}` : "None",
public/control-center/pages/home.js:461:          escalations: formatCount(failedExecutions.length),
public/control-center/pages/home.js:462:          summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
public/control-center/pages/home.js:499:      escalationSummary
public/control-center/pages/home.js:656:  render({ getState, $, escapeHtml, navigateTo, showMessage }) {
public/control-center/pages/home.js:713:            <span class="mhos-next-action-escalation">${escapeHtml(dashboard.nextBestAction.escalationSummary)}</span>
public/control-center/pages/home.js:922:              <span class="home-prompt-meta">AI prepares a risk summary for launch and escalation.</span>
public/control-center/pages/home.js:971:              <!-- Escalation Lane -->
public/control-center/pages/home.js:972:              <div class="mhos-escalation-lane">
public/control-center/pages/home.js:974:                  // Projection-only escalation lane
public/control-center/pages/home.js:975:                  const escalationItems = (dashboard.advanced?.pendingApprovals > 0 ? [{
public/control-center/pages/home.js:979:                    message: `${dashboard.advanced.pendingApprovals} approval${dashboard.advanced.pendingApprovals === 1 ? "" : "s"} required`,
public/control-center/pages/home.js:986:                      message: msg,
public/control-center/pages/home.js:990:                  return escalationItems.length ? escalationItems.map(item => `
public/control-center/pages/home.js:991:                    <div class="mhos-escalation-item mhos-escalation-severity--${escapeHtml(item.severity)}" data-escalation-id="${escapeHtml(item.id)}">
public/control-center/pages/home.js:992:                      <span class="mhos-escalation-severity">${escapeHtml(item.severity)}</span>
public/control-center/pages/home.js:993:                      <span class="mhos-escalation-message">${escapeHtml(item.message)}</span>
public/control-center/pages/home.js:995:                  `).join("") : `<div class="mhos-escalation-item mhos-escalation-severity--neutral"><span class="mhos-escalation-message">No escalations</span></div>`;
public/control-center/pages/home.js:1003:        <!-- 7. CUSTOMER OPERATIONS PULSE & COMMUNICATION READINESS (Independent Card, sibling to AI Guidance) -->
public/control-center/pages/home.js:1004:        <section class="card home-customer-ops-panel">
public/control-center/pages/home.js:1007:              <p class="card-label">Customer Operations Pulse</p>
public/control-center/pages/home.js:1008:              <h3>Customer Operations Readiness</h3>
public/control-center/pages/home.js:1009:              <span class="section-helper">Status and handoff only. No live CRM/IVR claims.</span>
public/control-center/pages/home.js:1012:          <div class="home-customer-ops-body">
public/control-center/pages/home.js:1013:            <span class="home-customer-ops-badge">${dashboard.health?.customerOpsStatus || "Planned/Partial"}</span>
public/control-center/pages/home.js:1035:    const openRoute = (route, message = "") => {
public/control-center/pages/home.js:1037:      if (message) showMessage?.(message);
public/control-center/pages/home.js:1043:      showMessage?.("Prompt prepared in AI Command.");
public/control-center/pages/home.js:1063:      showMessage?.(`${roleName} context prepared in AI Command.`);
public/control-center/pages/insights.js:685:    systemLessons.push("Start ingesting post-level Facebook, Instagram, TikTok, and YouTube insight data so winning patterns can be reused automatically.");
public/control-center/pages/insights.js:947:function bindInsightsActions({ $, navigateTo, showMessage, prompts, projectName, createProjectHandoff }) {
public/control-center/pages/insights.js:981:      showMessage?.(`Opened ${button.textContent?.trim() || "next workspace"}.`);
public/control-center/pages/insights.js:1017:          console.warn("Failed to persist Insights handoff:", error.message);
public/control-center/pages/insights.js:1022:      showMessage?.("Insight prompt added to AI Command.");
public/control-center/pages/insights.js:1046:    showMessage,
public/control-center/pages/insights.js:1417:      showMessage,
public/control-center/pages/insights.js:1425:        const message = "Insights: No active project selected.";
public/control-center/pages/insights.js:1426:        setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1427:        showError?.(message);
public/control-center/pages/insights.js:1434:          showMessage,
public/control-center/pages/insights.js:1443:        const message = "Insights: Live refresh is unavailable in this context.";
public/control-center/pages/insights.js:1444:        setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1445:        showError?.(message);
public/control-center/pages/insights.js:1452:          showMessage,
public/control-center/pages/insights.js:1467:        showMessage,
public/control-center/pages/insights.js:1494:            showMessage,
public/control-center/pages/insights.js:1499:          showMessage?.("Insights refreshed.");
public/control-center/pages/insights.js:1502:          const message = `Insights: ${error?.message || "Failed to refresh insights."}`;
public/control-center/pages/insights.js:1503:          setInsightsRefreshState(projectName, { loading: false, error: message });
public/control-center/pages/insights.js:1510:            showMessage,
public/control-center/pages/insights.js:1515:          showError?.(message);
public/control-center/pages/content-studio-workspace.js:65:    purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
public/control-center/pages/content-studio-workspace.js:102:    suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
public/control-center/pages/content-studio-workspace.js:221:    tone: firstText(overview.brand_voice, "Premium, direct, clear"),
public/control-center/pages/content-studio-workspace.js:283:function loadLocalLibraryAssets(projectName) {
public/control-center/pages/content-studio-workspace.js:288:function upsertLocalLibraryAsset(projectName, asset) {
public/control-center/pages/content-studio-workspace.js:548:      draftMessage: "",
public/control-center/pages/content-studio-workspace.js:598:  session.draftMessage = "";
public/control-center/pages/content-studio-workspace.js:626:  const message = session.validation[key];
public/control-center/pages/content-studio-workspace.js:627:  return message ? `<div class="content-inline-error">${escapeHtml(message)}</div>` : "";
public/control-center/pages/content-studio-workspace.js:684:async function persistContentRecord({ projectName, state, session, status, showMessage }) {
public/control-center/pages/content-studio-workspace.js:689:    showMessage?.("Content draft saved locally.");
public/control-center/pages/content-studio-workspace.js:702:    showMessage?.("Content draft saved.");
public/control-center/pages/content-studio-workspace.js:705:    showMessage?.("Backend content save unavailable; local draft kept.");
public/control-center/pages/content-studio-workspace.js:729:    `Core message: ${firstText(content, "No content body yet.")}`,
public/control-center/pages/content-studio-workspace.js:1230:        <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
public/control-center/pages/content-studio-workspace.js:1238:      ${session.draftMessage ? `<div class="simple-banner" style="margin-top:12px;">${escapeHtml(session.draftMessage)}</div>` : ""}
public/control-center/pages/content-studio-workspace.js:1255:  const cta = lines.find((line) => /cta|call to action/i.test(line)) || lines[lines.length - 1] || "CTA: missing";
public/control-center/pages/content-studio-workspace.js:1592:  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(signature));
public/control-center/pages/content-studio-workspace.js:1610:async function saveToLibrary({ projectName, session, selectedItem, showMessage, rerender }) {
public/control-center/pages/content-studio-workspace.js:1635:    showMessage?.("Already saved to Library (local reference).");
public/control-center/pages/content-studio-workspace.js:1700:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1712:      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
public/control-center/pages/content-studio-workspace.js:1714:      upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1725:      showMessage?.("Library backend unavailable. Saved as local library handoff.");
public/control-center/pages/content-studio-workspace.js:1728:    upsertLocalLibraryAsset(projectName, {
public/control-center/pages/content-studio-workspace.js:1739:    showMessage?.("Content draft saved to Library (local handoff).");
public/control-center/pages/content-studio-workspace.js:1745:async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
public/control-center/pages/content-studio-workspace.js:1754:      showMessage?.(successMessage);
public/control-center/pages/content-studio-workspace.js:1757:      showMessage?.(failMessage);
public/control-center/pages/content-studio-workspace.js:1762:  showMessage?.(localMessage);
public/control-center/pages/content-studio-workspace.js:1791:  showMessage,
public/control-center/pages/content-studio-workspace.js:1838:        session.draftMessage = "No inbound handoff is available.";
public/control-center/pages/content-studio-workspace.js:1867:      session.draftMessage = "Handoff loaded into composer.";
public/control-center/pages/content-studio-workspace.js:1883:      session.draftMessage = "Draft is prompt-ready.";
public/control-center/pages/content-studio-workspace.js:1888:            message: buildAiPrompt(projectName, session, selected()),
public/control-center/pages/content-studio-workspace.js:1912:            session.draftMessage = "Draft generated and queued for review.";
public/control-center/pages/content-studio-workspace.js:1925:            session.draftMessage = "No generated output returned. Draft kept as prompt-ready.";
public/control-center/pages/content-studio-workspace.js:1939:          session.draftMessage = "Generation backend unavailable. Prompt-ready state only.";
public/control-center/pages/content-studio-workspace.js:1953:        session.draftMessage = "No backend project selected. Draft is prompt-ready.";
public/control-center/pages/content-studio-workspace.js:1956:      await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
public/control-center/pages/content-studio-workspace.js:1970:      session.form.brief = `${clean(session.form.brief)}\n\nImprove for clarity: stronger opening hook, tighter value message, cleaner CTA, and channel-safe length.`;
public/control-center/pages/content-studio-workspace.js:1972:      session.draftMessage = "Brief improved for stronger draft quality.";
public/control-center/pages/content-studio-workspace.js:1977:  const translateBtn = document.getElementById("contentTranslateBtn");
public/control-center/pages/content-studio-workspace.js:1978:  if (translateBtn) {
public/control-center/pages/content-studio-workspace.js:1979:    translateBtn.onclick = async () => {
public/control-center/pages/content-studio-workspace.js:1989:        session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: Local mode only. Translate/adapt target language = ${language}.`;
public/control-center/pages/content-studio-workspace.js:1991:        session.draftMessage = "Translate/adapt prepared in local mode.";
public/control-center/pages/content-studio-workspace.js:1998:          message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
public/control-center/pages/content-studio-workspace.js:2004:        session.draftMessage = `Translate/adapt request sent for ${language}.`;
public/control-center/pages/content-studio-workspace.js:2008:        session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
public/control-center/pages/content-studio-workspace.js:2023:      await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
public/control-center/pages/content-studio-workspace.js:2059:      showMessage?.("Content context sent to AI Command.");
public/control-center/pages/content-studio-workspace.js:2077:        showMessage,
public/control-center/pages/content-studio-workspace.js:2078:        failMessage: "Design brief kept locally because backend handoff save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2079:        successMessage: "Design brief sent to Media Studio.",
public/control-center/pages/content-studio-workspace.js:2080:        localMessage: "Design brief prepared for Media Studio locally."
public/control-center/pages/content-studio-workspace.js:2088:        await persistContentRecord({ projectName, state, session, status: "sent_to_media", showMessage });
public/control-center/pages/content-studio-workspace.js:2109:        showMessage,
public/control-center/pages/content-studio-workspace.js:2110:        failMessage: "Publishing handoff kept locally because backend save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2111:        successMessage: "Publishing handoff created.",
public/control-center/pages/content-studio-workspace.js:2112:        localMessage: "Publishing handoff created locally."
public/control-center/pages/content-studio-workspace.js:2120:        await persistContentRecord({ projectName, state, session, status: "sent_to_publishing", showMessage });
public/control-center/pages/content-studio-workspace.js:2131:      session.draftMessage = `${titleCase(ensureVersioning(session).selectedVersionId)} selected.`;
public/control-center/pages/content-studio-workspace.js:2154:        session.draftMessage = "Selected version approved.";
public/control-center/pages/content-studio-workspace.js:2155:        await persistContentRecord({ projectName, state, session, status: "approved", showMessage });
public/control-center/pages/content-studio-workspace.js:2162:        session.draftMessage = "Selected version returned to draft.";
public/control-center/pages/content-studio-workspace.js:2163:        await persistContentRecord({ projectName, state, session, status: "draft", showMessage });
public/control-center/pages/content-studio-workspace.js:2181:        session.draftMessage = "New prompt-ready version created.";
public/control-center/pages/content-studio-workspace.js:2182:        await persistContentRecord({ projectName, state, session, status: "prompt_ready", showMessage });
public/control-center/pages/content-studio-workspace.js:2186:        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
public/control-center/pages/content-studio-workspace.js:2187:        session.draftMessage = "Version saved as draft.";
public/control-center/pages/content-studio-workspace.js:2191:        await saveToLibrary({ projectName, session, selectedItem: selected(), showMessage, rerender });
public/control-center/pages/content-studio-workspace.js:2192:        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
public/control-center/pages/content-studio-workspace.js:2207:      session.draftMessage = `${agent.title} prompt added.`;
public/control-center/pages/content-studio-workspace.js:2210:        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || "draft", "draft"), showMessage });
public/control-center/pages/content-studio-workspace.js:2239:        showMessage?.(`${agent.title} prompt sent to AI Command.`);
public/control-center/pages/content-studio-workspace.js:2265:    showMessage,
public/control-center/pages/content-studio-workspace.js:2279:      showMessage,
public/control-center/pages/content-studio-workspace.js:2398:      showMessage,
public/control-center/pages/integrations/cards.js:13:  formatStatusLabel
public/control-center/pages/integrations/cards.js:30:  const label = formatStatusLabel(normalized);
public/control-center/pages/integrations/cards.js:114:  if (card.statusLabel === "Connected") return "connected";
public/control-center/pages/integrations/cards.js:115:  if (["Error", "Token expired"].includes(card.statusLabel)) return "failed";
public/control-center/pages/integrations/cards.js:116:  if (card.statusLabel === "Partial") return "needs_setup";
public/control-center/pages/integrations/cards.js:120:function getConnectorWorkspaceStatusLabel(statusKey) {
public/control-center/pages/integrations/cards.js:127:function getConnectorStatusLabel(card = {}, statusKey = "") {
public/control-center/pages/integrations/cards.js:128:  if (card.statusLabel === "Connected") return "Connected";
public/control-center/pages/integrations/cards.js:129:  if (card.statusLabel === "Partial") return "Partial";
public/control-center/pages/integrations/cards.js:130:  if (card.statusLabel === "Token expired") return "Token expired";
public/control-center/pages/integrations/cards.js:131:  if (card.statusLabel === "Error") return "Error";
public/control-center/pages/integrations/cards.js:132:  if (card.statusLabel === "Not Connected") return "Not Connected";
public/control-center/pages/integrations/cards.js:133:  return getConnectorWorkspaceStatusLabel(statusKey);
public/control-center/pages/integrations/cards.js:139:  if (card.backendSupported === false) {
public/control-center/pages/integrations/cards.js:150:      label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration"
public/control-center/pages/integrations/cards.js:169:  if (card.backendSupported === false) {
public/control-center/pages/integrations/cards.js:173:  if (card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth") {
public/control-center/pages/integrations/cards.js:181:  if (card.backendSupported === false) {
public/control-center/pages/integrations/cards.js:182:    return "Setup method: Backend support not configured";
public/control-center/pages/integrations/cards.js:185:  if (card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth") {
public/control-center/pages/integrations/cards.js:193:  if (card.backendSupported === false) {
public/control-center/pages/integrations/cards.js:194:    return "Backend support: Not configured";
public/control-center/pages/integrations/cards.js:219:  const statusLabel = getConnectorStatusLabel(card, statusKey);
public/control-center/pages/integrations/cards.js:229:  const showSyncAction = card.backendSupported !== false && statusKey === "connected";
public/control-center/pages/integrations/cards.js:230:  const showDetailsAction = !(card.backendSupported === false && recommendedAction.action === "select");
public/control-center/pages/integrations/cards.js:240:              <span class="card-badge ${esc(card.statusTone)}">${esc(statusLabel)}</span>
public/control-center/pages/integrations/cards.js:256:        ${card.backendSupported === false
public/control-center/pages/integrations/cards.js:300:  if (card.backendSupported === false) {
public/control-center/pages/integrations/cards.js:304:  if (card.statusLabel === "Connected") {
public/control-center/pages/integrations/cards.js:308:  if (card.statusLabel === "Partial") {
public/control-center/pages/integrations/cards.js:312:  if (card.statusLabel === "Token expired") {
public/control-center/pages/integrations/cards.js:316:  if (card.statusLabel === "Error") {
public/control-center/pages/integrations/cards.js:327:    card.backendSupported === false
public/control-center/pages/integrations/cards.js:329:      : card.statusLabel === "Connected"
public/control-center/pages/integrations/cards.js:331:      : ["Partial", "Token expired", "Error"].includes(card.statusLabel)
public/control-center/pages/integrations/cards.js:356:            card.statusLabel === "Partial" ||
public/control-center/pages/integrations/cards.js:357:            card.statusLabel === "Token expired" ||
public/control-center/pages/integrations/cards.js:358:            card.statusLabel === "Error"
public/control-center/pages/integrations/cards.js:360:              : card.statusLabel
public/control-center/pages/integrations/cards.js:371:          ${card.backendSupported === false ? "disabled" : ""}
public/control-center/pages/integrations/cards.js:399:        <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
public/control-center/pages/integrations/layout.js:27:  const attentionCount = cards.filter((card) => ["Error", "Token expired"].includes(card.statusLabel)).length;
public/control-center/pages/integrations/layout.js:28:  const blockedCount = cards.filter((card) => card.statusLabel === "Not Connected").length;
public/control-center/pages/integrations/layout.js:83:    (card) => card.statusLabel === "Connected"
public/control-center/pages/integrations/layout.js:87:    ["Partial", "Token expired", "Error"].includes(card.statusLabel)
public/control-center/pages/integrations/layout.js:91:    (card) => card.statusLabel === "Not Connected"
public/control-center/pages/integrations/builders.js:13:    connected: list.filter((card) => card.statusLabel === "Connected").length,
public/control-center/pages/integrations/builders.js:14:    notConnected: list.filter((card) => card.statusLabel === "Not Connected").length,
public/control-center/pages/integrations/builders.js:16:      ["Partial", "Token expired", "Error"].includes(card.statusLabel)
public/control-center/pages/integrations/builders.js:44:      label: "Email / CRM",
public/control-center/pages/integrations/builders.js:45:      ids: ["smtp", "mailer", "mailchimp", "crm"]
public/control-center/pages/integrations/builders.js:49:      ids: ["google-drive", "slack", "telegram", "notion", "zapier-make", "webhook"]
public/control-center/pages/integrations/builders.js:59:    const connected = cards.filter((card) => card.statusLabel === "Connected").length;
public/control-center/pages/integrations/builders.js:61:      ["Partial", "Token expired", "Error"].includes(card.statusLabel)
public/control-center/pages/integrations/builders.js:83:      card.backendSupported &&
public/control-center/pages/integrations/builders.js:85:      card.statusLabel !== "Connected"
public/control-center/pages/integrations/builders.js:90:      meta: `${card.domainTitle} • ${card.statusLabel} • ${card.whyItMatters}`
public/control-center/pages/integrations/builders.js:99:  const actionableCards = cards.filter((card) => card.backendSupported);
public/control-center/pages/integrations/builders.js:101:    (card) => card.critical && card.statusLabel !== "Connected"
public/control-center/pages/integrations/builders.js:104:    ["Token expired", "Error"].includes(card.statusLabel)
public/control-center/pages/integrations/builders.js:106:  const partial = actionableCards.filter((card) => card.statusLabel === "Partial");
public/control-center/pages/integrations/builders.js:192:    label: "Communication / CRM",
public/control-center/pages/integrations/builders.js:193:    description: "Email, CRM, and operational messaging connectors that keep lifecycle and team coordination intact.",
public/control-center/pages/integrations/builders.js:194:    connectorIds: ["smtp", "mailer", "mailchimp", "crm", "telegram", "slack", "notion", "zapier-make", "google-drive", "webhook"]
public/control-center/pages/integrations/builders.js:219:  if (card.statusLabel === "Connected") return "connected";
public/control-center/pages/integrations/builders.js:220:  if (["Error", "Token expired"].includes(card.statusLabel)) return "failed";
public/control-center/pages/integrations/builders.js:221:  if (card.statusLabel === "Partial") return "needs_setup";
public/control-center/pages/integrations/builders.js:225:export function getConnectorWorkspaceStatusLabel(statusKey = "") {
public/control-center/pages/integrations/builders.js:388:      title: String(item.title || item.summary || item.message || item.event || item.type || "Integration event"),
public/control-center/pages/integrations/builders.js:439:      if (["Error", "Token expired"].includes(card.statusLabel)) {
public/control-center/pages/integrations/builders.js:465:      description: "Commerce and marketplace connections that support products, orders, revenue signals, and conversion-aware sales intelligence.",
public/control-center/pages/integrations/builders.js:481:      id: "email-crm",
public/control-center/pages/integrations/builders.js:482:      title: "Email & CRM",
public/control-center/pages/integrations/builders.js:483:      description: "Lifecycle messaging, customer records, audience segmentation, and relationship data required for retention and lifecycle operations.",
public/control-center/pages/integrations/builders.js:484:      domains: [byId.get("email-crm")].filter(Boolean)
public/control-center/pages/integrations/builders.js:510:  const actionableCards = allCards.filter((card) => card.backendSupported);
public/control-center/pages/integrations/builders.js:514:    criticalCards.every((card) => card.statusLabel === "Connected");
public/control-center/pages/integrations/builders.js:519:    (card) => card.critical && ["Error", "Token expired"].includes(card.statusLabel)
public/control-center/pages/integrations/builders.js:523:    targetCard = actionableCards.find((card) => card.id === "website" && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:527:    targetCard = actionableCards.find((card) => card.id === "woocommerce" && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:531:    targetCard = actionableCards.find((card) => card.id === "ga4" && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:535:    targetCard = actionableCards.find((card) => card.id === "search-console" && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:539:    targetCard = actionableCards.find((card) => ["instagram", "facebook"].includes(card.id) && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:543:    targetCard = actionableCards.find((card) => card.id === "meta-pixel" && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:547:    targetCard = actionableCards.find((card) => ["smtp", "mailer", "mailchimp"].includes(card.id) && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:551:    targetCard = actionableCards.find((card) => card.critical && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:555:    const nextOptional = actionableCards.find((card) => !card.critical && card.statusLabel !== "Connected") || null;
public/control-center/pages/integrations/builders.js:732:    const connectedCount = cards.filter((card) => card.statusLabel === "Connected").length;
public/control-center/pages/integrations/builders.js:733:    const partialCount = cards.filter((card) => card.statusLabel === "Partial").length;
public/control-center/pages/integrations/builders.js:735:      ["Not Connected", "Error", "Token expired"].includes(card.statusLabel)
public/control-center/pages/integrations/builders.js:752:  const unsupportedIntegrationIds = options.unsupportedIntegrationIds instanceof Set ? options.unsupportedIntegrationIds : new Set();
public/control-center/pages/integrations/builders.js:753:  const normalizeStatusLabel = typeof options.normalizeStatusLabel === "function" ? options.normalizeStatusLabel : (value) => value || "Not Connected";
public/control-center/pages/integrations/builders.js:768:  const backendSupported = integration.backendSupported !== false && !unsupportedIntegrationIds.has(integration.id);
public/control-center/pages/integrations/builders.js:769:  const statusLabel = backendSupported
public/control-center/pages/integrations/builders.js:770:    ? normalizeStatusLabel(record.status_label || record.status)
public/control-center/pages/integrations/builders.js:784:    backendSupported,
public/control-center/pages/integrations/builders.js:787:    statusLabel,
public/control-center/pages/integrations/builders.js:788:    statusKey: statusLabel.toLowerCase().replace(/\s+/g, "_"),
public/control-center/pages/integrations/builders.js:790:      statusLabel === "Connected" ? "success" :
public/control-center/pages/integrations/builders.js:791:      statusLabel === "Unavailable" ? "danger" :
public/control-center/pages/integrations/builders.js:792:      statusLabel === "Partial" ? "warning" :
public/control-center/pages/integrations/builders.js:793:      statusLabel === "Token expired" ? "warning" :
public/control-center/pages/integrations/builders.js:794:      statusLabel === "Error" ? "danger" :
public/control-center/pages/integrations/builders.js:802:    missingRequired: backendSupported ? missingRequired : [],
public/control-center/pages/integrations/builders.js:806:    healthSummary: getHealthSummary(statusLabel, record, integration),
public/control-center/pages/integrations/builders.js:807:    notes: !backendSupported
public/control-center/pages/integrations/builders.js:808:      ? (asString(integration.unavailableReason) || "Backend provider support is not configured yet.")
public/control-center/pages/integrations/builders.js:809:      : asString(record.notes) || (integration.critical && statusLabel !== "Connected"
public/control-center/pages/integrations/render.js:74:          <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
public/control-center/pages/integrations/drawer.js:43:      ${options.invalid ? `<div class="integration-field-error">${esc(options.invalidMessage || "Complete this field before continuing.")}</div>` : ""}
public/control-center/pages/integrations/drawer.js:52:  const stepTwoComplete = Boolean(card.lastTest) || card.statusLabel === "Connected";
public/control-center/pages/integrations/drawer.js:53:  const stepThreeComplete = card.statusLabel === "Connected";
public/control-center/pages/integrations/drawer.js:95:  if (card.backendSupported === false) {
public/control-center/pages/integrations/drawer.js:99:  if (card.statusLabel === "Connected") {
public/control-center/pages/integrations/drawer.js:103:  if (card.statusLabel === "Partial") {
public/control-center/pages/integrations/drawer.js:107:  if (card.statusLabel === "Token expired") {
public/control-center/pages/integrations/drawer.js:111:  if (card.statusLabel === "Error") {
public/control-center/pages/integrations/drawer.js:123:  if (card.oauthSupported || card.authMode === "oauth") {
public/control-center/pages/integrations/drawer.js:131:  if (card.backendSupported === false) {
public/control-center/pages/integrations/drawer.js:132:    return `<div class="integration-side-note">${esc(card.unavailableReason || "Backend provider support is not configured yet.")}</div>`;
public/control-center/pages/integrations/drawer.js:143:        ${card.statusLabel === "Connected" ? `<button class="quick-action-btn" type="button" data-integration-action="sync" data-integration-id="${esc(card.id)}">Run backend sync</button>` : ""}
public/control-center/pages/integrations/drawer.js:145:      ${quickConnectLabel && card.statusLabel !== "Connected" ? `<div class="integration-quick-connect-note">OAuth recommended. Manual fields available as fallback.</div>` : ""}
public/control-center/pages/integrations/drawer.js:187:  const hasOAuthSetup = Boolean(card.quickConnectLabel || card.oauthSupported || card.authMode === "oauth");
public/control-center/pages/integrations/drawer.js:188:  const setupMethod = card.backendSupported === false
public/control-center/pages/integrations/drawer.js:189:    ? "Backend support not configured"
public/control-center/pages/integrations/drawer.js:211:          invalidMessage: session.validationMessage,
public/control-center/pages/integrations/drawer.js:278:          <span class="card-badge ${esc(card.statusTone)}">${esc(card.statusLabel)}</span>
public/control-center/pages/integrations/drawer.js:388:            <div class="data-row"><span>Status</span><strong>${esc(card.statusLabel)}</strong></div>
public/control-center/pages/integrations/state.js:35:      validationMessage: ""
public/control-center/pages/integrations/state.js:53:  session.validationMessage = "";
public/control-center/pages/integrations/state.js:56:export function setIntegrationValidation(session, integrationId, fieldKey, message) {
public/control-center/pages/integrations/state.js:59:  session.validationMessage = message || "";
public/control-center/pages/integrations/state.js:70:  session.validationMessage = "";
public/control-center/pages/integrations/utils.js:71:export function formatStatusLabel(status) {
public/control-center/pages/governance.js:110:      <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
public/control-center/pages/governance.js:184:function getDecisionConfirmationMessage(decision) {
public/control-center/pages/governance.js:204:  return window.confirm(getDecisionConfirmationMessage(decision));
public/control-center/pages/governance.js:280:    session.error = error.message || "Failed to load governance console.";
public/control-center/pages/governance.js:308:  const escalationChain = asObject(reviewModel.escalation_chain);
public/control-center/pages/governance.js:312:      <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
public/control-center/pages/governance.js:327:        ${Object.entries(escalationChain).map(([risk, roles]) => `
public/control-center/pages/governance.js:330:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
public/control-center/pages/governance.js:348:          <strong>${escapeHtml(flag.message || flag.label || "Flagged")}</strong>
public/control-center/pages/governance.js:382:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
public/control-center/pages/governance.js:440:            data-summary="${escapeHtml(flags.map((flag) => flag.message).join(" | ") || "Governance review requested.")}"
public/control-center/pages/governance.js:560:      queue_summary: asArray(item.claim_flags).map((flag) => flag.message).join(" | ") || "No claim issues detected.",
public/control-center/pages/governance.js:577:      queue_summary: asArray(item.brand_safety_flags).map((flag) => flag.message).join(" | ") || "No brand issues detected.",
public/control-center/pages/governance.js:594:      queue_summary: asArray(item.publish_guardrails).map((flag) => flag.message).join(" | ") || "No publish blockers detected.",
public/control-center/pages/governance.js:604:  const escalations = asArray(sections.escalation_queue).map((item) => ({
public/control-center/pages/governance.js:606:    queue_kind: "escalation",
public/control-center/pages/governance.js:607:    selected_key: `escalation:${asString(item.entity_id || item.id || item.title)}`,
public/control-center/pages/governance.js:608:    queue_title: item.title || "Escalation item",
public/control-center/pages/governance.js:617:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
public/control-center/pages/governance.js:620:function buildGovernancePrompts(projectName, selectedItem, focusLabel) {
public/control-center/pages/governance.js:637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
public/control-center/pages/governance.js:649:  const escalations = asArray(sections.escalation_queue).length;
public/control-center/pages/governance.js:663:  if (escalations > 0) {
public/control-center/pages/governance.js:664:    blockers.push(`${escalations} escalation${escalations === 1 ? " is" : "s are"} open for higher-level review.`);
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:693:    escalations
public/control-center/pages/governance.js:718:function getGovernanceEscalationRoute(summary, risk) {
public/control-center/pages/governance.js:719:  const escalationChain = asObject(summary?.review_model?.escalation_chain);
public/control-center/pages/governance.js:722:    escalationChain[normalizedRisk] ||
public/control-center/pages/governance.js:723:    escalationChain.high ||
public/control-center/pages/governance.js:724:    escalationChain.critical
public/control-center/pages/governance.js:726:  return roles.length ? roles.map(titleCase).join(" -> ") : "No escalation path";
public/control-center/pages/governance.js:824:    escalations: queueItems.filter((item) => item.queue_kind === "escalation").length
public/control-center/pages/governance.js:833:      escalations: "escalation"
public/control-center/pages/governance.js:855:  const escalationRoute = getGovernanceEscalationRoute(summary, highestRiskValue || "high");
public/control-center/pages/governance.js:867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
public/control-center/pages/governance.js:883:            <article class="mhos-executive-summary-item governance-summary-escalation">
public/control-center/pages/governance.js:884:              <span class="mhos-executive-metric-label">Escalation State</span>
public/control-center/pages/governance.js:885:              <strong class="mhos-executive-metric-value">${escapeHtml(readiness.escalations ? `${readiness.escalations} active` : "Clear")}</strong>
public/control-center/pages/governance.js:886:              <small class="mhos-executive-metric-note">${escapeHtml(escalationRoute)}</small>
public/control-center/pages/governance.js:946:                  <strong>Escalation route</strong>
public/control-center/pages/governance.js:947:                  <span>${escapeHtml(escalationRoute)}</span>
public/control-center/pages/governance.js:960:        <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
public/control-center/pages/governance.js:963:              <div class="panel-kicker">Supporting signals</div>
public/control-center/pages/governance.js:974:            ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
public/control-center/pages/governance.js:1051:                  ["escalations", "Escalations", focusCounts.escalations]
public/control-center/pages/governance.js:1208:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
public/control-center/pages/governance.js:1258:                  <h4>Escalation chain</h4>
public/control-center/pages/governance.js:1260:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
public/control-center/pages/governance.js:1263:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
public/control-center/pages/governance.js:1314:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
public/control-center/pages/governance.js:1315:      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
public/control-center/pages/governance.js:1328:        context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
public/control-center/pages/governance.js:1331:        context.showError(error.message || "Failed to update approval.");
public/control-center/pages/governance.js:1367:        context.showMessage("Approval request added to the governance queue.");
public/control-center/pages/governance.js:1370:        context.showError(error.message || "Failed to request approval.");
public/control-center/pages/governance.js:1406:          context.showMessage("Backend Governance policy saved.");
public/control-center/pages/governance.js:1409:          context.showError(error.message || "Failed to save governance policy.");
public/control-center/pages/governance.js:1421:        const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
public/control-center/pages/governance.js:1431:          context.showMessage("Settings-derived rules synced into durable Governance policy.");
public/control-center/pages/governance.js:1434:          context.showError(error.message || "Failed to sync Settings into Governance.");
public/control-center/pages/governance.js:1455:      context.showMessage?.("Governance prompt added to AI Command.");
public/control-center/pages/governance.js:1466:    description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."
public/control-center/pages/integrations.js:37:const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
public/control-center/pages/integrations.js:88:        enables: "Product sync, order sync, customer sync, and sales reporting.",
public/control-center/pages/integrations.js:89:        dataScope: ["Products", "Orders", "Customers", "Sales"],
public/control-center/pages/integrations.js:101:        backendSupported: false,
public/control-center/pages/integrations.js:102:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:148:        enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
public/control-center/pages/integrations.js:184:        enables: "Video insights, engagement, comments, profile metrics, and future publishing support.",
public/control-center/pages/integrations.js:220:        enables: "Post insights, audience signals, company page analytics, and publishing support.",
public/control-center/pages/integrations.js:262:        enables: "Tag management, event instrumentation, pixel deployment, and attribution support.",
public/control-center/pages/integrations.js:277:        purpose: "Meta tracking layer for conversions, events, and paid attribution support.",
public/control-center/pages/integrations.js:296:        enables: "Events, conversion tracking, attribution, and paid optimization support.",
public/control-center/pages/integrations.js:344:    id: "email-crm",
public/control-center/pages/integrations.js:345:    title: "Email & CRM",
public/control-center/pages/integrations.js:346:    description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",
public/control-center/pages/integrations.js:351:        backendSupported: false,
public/control-center/pages/integrations.js:352:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:356:        whyItMatters: "Email is critical for lifecycle recovery, conversion support, and owned audience communication.",
public/control-center/pages/integrations.js:357:        enables: "Campaign sending, lifecycle messages, and email workflow execution.",
public/control-center/pages/integrations.js:363:          { key: "senderEmail", label: "Sender email", placeholder: "support@brand.com", required: true },
public/control-center/pages/integrations.js:371:        backendSupported: false,
public/control-center/pages/integrations.js:372:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:405:        id: "crm",
public/control-center/pages/integrations.js:407:        backendSupported: false,
public/control-center/pages/integrations.js:408:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:409:        label: "CRM Integration",
public/control-center/pages/integrations.js:411:        purpose: "Customer record sync for lead, customer, and lifecycle intelligence.",
public/control-center/pages/integrations.js:412:        whyItMatters: "CRM data helps the system connect campaigns to pipeline, customers, and repeat purchase behavior.",
public/control-center/pages/integrations.js:413:        enables: "Contact sync, customer sync, lead intelligence, and lifecycle learning.",
public/control-center/pages/integrations.js:414:        dataScope: ["Contacts", "Customers", "Leads", "Lifecycle state"],
public/control-center/pages/integrations.js:415:        permissionScope: "CRM account ID + API token",
public/control-center/pages/integrations.js:418:          { key: "workspaceId", label: "Workspace / account ID", placeholder: "CRM workspace ID", required: true },
public/control-center/pages/integrations.js:419:          { key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },
public/control-center/pages/integrations.js:457:        permissionScope: "Customer ID + OAuth token",
public/control-center/pages/integrations.js:459:        primaryField: "customerId",
public/control-center/pages/integrations.js:461:          { key: "customerId", label: "Customer ID", placeholder: "123-456-7890", required: true },
public/control-center/pages/integrations.js:508:        id: "slack",
public/control-center/pages/integrations.js:510:        label: "Slack",
public/control-center/pages/integrations.js:513:        whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",
public/control-center/pages/integrations.js:519:          { key: "workspaceId", label: "Workspace ID", placeholder: "Slack workspace ID", required: true },
public/control-center/pages/integrations.js:664:      validationMessage: ""
public/control-center/pages/integrations.js:768:  session.validationMessage = "";
public/control-center/pages/integrations.js:806:function setIntegrationValidation(session, integrationId, fieldKey, message) {
public/control-center/pages/integrations.js:809:  session.validationMessage = message || "";
public/control-center/pages/integrations.js:818:  session.validationMessage = "";
public/control-center/pages/integrations.js:900:  if (card.backendSupported === false) return "Open setup";
public/control-center/pages/integrations.js:901:  if (card.statusLabel === "Connected") return "Manage";
public/control-center/pages/integrations.js:902:  if (card.statusLabel === "Partial") return "Complete setup";
public/control-center/pages/integrations.js:903:  if (card.statusLabel === "Token expired") return "Reconnect integration";
public/control-center/pages/integrations.js:904:  if (card.statusLabel === "Error") return "Repair integration connection";
public/control-center/pages/integrations.js:909:  if (card.backendSupported === false) {
public/control-center/pages/integrations.js:912:  if (card.statusLabel === "Connected") {
public/control-center/pages/integrations.js:915:  if (["Token expired", "Error"].includes(card.statusLabel)) {
public/control-center/pages/integrations.js:1001:    { key: "orders", pattern: /order|sale|revenue|product|listing|merchant|customer|contact|lead/ }
public/control-center/pages/integrations.js:1040:  if (integration.domainId === "email-crm") {
public/control-center/pages/integrations.js:1108:function normalizeStatusLabel(statusLabel, fallback = "Not Connected") {
public/control-center/pages/integrations.js:1109:  const normalized = asString(statusLabel).trim().toLowerCase();
public/control-center/pages/integrations.js:1121:function getHealthSummary(statusLabel, record, integration) {
public/control-center/pages/integrations.js:1122:  if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1123:    return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
public/control-center/pages/integrations.js:1130:  if (statusLabel === "Connected") {
public/control-center/pages/integrations.js:1133:  if (statusLabel === "Partial") {
public/control-center/pages/integrations.js:1136:  if (statusLabel === "Token expired") {
public/control-center/pages/integrations.js:1139:  if (statusLabel === "Error") {
public/control-center/pages/integrations.js:1148:  if (card.backendSupported === false) {
public/control-center/pages/integrations.js:1161:      label: card.statusLabel === "Error" ? "Repair integration connection" : "Reconnect integration",
public/control-center/pages/integrations.js:1198:  showMessage,
public/control-center/pages/integrations.js:1216:      showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1227:      showMessage?.(`Setup drawer opened for ${integration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1272:    if (session.validationIntegrationId === integrationId && session.validationFieldKey === fieldKey && session.validationMessage) {
public/control-center/pages/integrations.js:1273:      helper.textContent = session.validationMessage;
public/control-center/pages/integrations.js:1307:      showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1325:            unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
public/control-center/pages/integrations.js:1326:            normalizeStatusLabel,
public/control-center/pages/integrations.js:1343:      showMessage?.(`Diagnostics reviewed: ${diagnostics.blockers.length} blockers, ${diagnostics.warnings.length} warnings.`);
public/control-center/pages/integrations.js:1411:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1412:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1440:      showMessage?.(reconnect ? `${integration.label} integration reconnected.` : `${integration.label} connected.`);
public/control-center/pages/integrations.js:1444:      showError?.(error.message || `Failed to connect ${integration.label}.`);
public/control-center/pages/integrations.js:1451:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1452:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1466:      showMessage?.(`${integration.label} disconnected.`);
public/control-center/pages/integrations.js:1470:      showError?.(error.message || `Failed to disconnect ${integration.label}.`);
public/control-center/pages/integrations.js:1477:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1478:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1487:        showMessage?.(`${integration.label} test completed.`);
public/control-center/pages/integrations.js:1492:        showMessage?.(`${integration.label} backend sync started.`);
public/control-center/pages/integrations.js:1497:        showMessage?.(`${integration.label} historical import started.`);
public/control-center/pages/integrations.js:1503:      showError?.(error.message || `Failed to ${type} ${integration.label}.`);
public/control-center/pages/integrations.js:1537:      showMessage?.("Diagnostics prompt added to AI Command.");
public/control-center/pages/integrations.js:1549:      showMessage?.(`Setup drawer closed for ${closedIntegration?.label || "connector"}.`);
public/control-center/pages/integrations.js:1575:    showMessage,
public/control-center/pages/integrations.js:1598:          unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
public/control-center/pages/integrations.js:1599:          normalizeStatusLabel,
public/control-center/pages/integrations.js:1836:      showMessage,
public/control-center/pages/integrations.js:1853:        showMessage,
public/control-center/pages/setup.js:30:    fields: ["brand_name", "brand_promise", "brand_voice", "offer_positioning", "visual_identity"]
public/control-center/pages/setup.js:82:  audience_primary: "Improves message relevance and audience-specific tactics.",
public/control-center/pages/setup.js:84:  competitors: "Supports differentiation and benchmark-aware recommendations.",
public/control-center/pages/setup.js:96:  audience_primary: "Defines the main customer group the system should optimize messages for.",
public/control-center/pages/setup.js:231:    brand_voice: overviewData.brand_voice || "",
public/control-center/pages/setup.js:241:    audience_problem: overviewData.audience_problem || overviewData.customer_problem || "",
public/control-center/pages/setup.js:309:  const fields = ["brand_name", "brand_promise", "brand_voice", "offer_positioning"];
public/control-center/pages/setup.js:348:  const fields = ["primary_goal", "audience_primary", "brand_voice", "operator_notes"];
public/control-center/pages/setup.js:499:    brand_voice: values.brand_voice,
public/control-center/pages/setup.js:539:  const audience = asString(values.audience_primary).trim() || "a focused customer segment";
public/control-center/pages/setup.js:553:  if (asString(values.brand_voice).trim()) {
public/control-center/pages/setup.js:554:    return asString(values.brand_voice).trim();
public/control-center/pages/setup.js:837:  showMessage,
public/control-center/pages/setup.js:933:  const saveLocal = (message) => {
public/control-center/pages/setup.js:936:    if (typeof showMessage === "function") {
public/control-center/pages/setup.js:937:      showMessage(saved ? message : "Local draft storage is not available in this browser.");
public/control-center/pages/setup.js:1020:      saveLocal(`Draft saved locally for ${draftKeyName}.`);
public/control-center/pages/setup.js:1035:      const previousLabel = saveBackendBtn.textContent;
public/control-center/pages/setup.js:1039:      showMessage?.(`Saving setup for ${draftKeyName}...`);
public/control-center/pages/setup.js:1048:            ? " Project name remains local-only until project rename support exists."
public/control-center/pages/setup.js:1051:        showMessage?.(`Setup saved for ${draftKeyName}.${renameWarning}`);
public/control-center/pages/setup.js:1054:        showError?.(error.message || `Failed to save Setup changes for ${draftKeyName}.`);
public/control-center/pages/setup.js:1058:          if (saveBackendBtn && saveBackendBtn.textContent !== previousLabel) {
public/control-center/pages/setup.js:1059:            saveBackendBtn.textContent = previousLabel;
public/control-center/pages/setup.js:1071:      if (typeof showMessage === "function") {
public/control-center/pages/setup.js:1072:        showMessage(`Local setup draft cleared for ${draftKeyName}.`);
public/control-center/pages/setup.js:1086:      showMessage?.("AI draft applied to Offer positioning.");
public/control-center/pages/setup.js:1099:      showMessage?.("AI draft applied to Primary audience.");
public/control-center/pages/setup.js:1107:      const field = form.querySelector('[name="brand_voice"]');
public/control-center/pages/setup.js:1112:      showMessage?.("AI draft applied to Brand voice.");
public/control-center/pages/setup.js:1131:      setIfEmpty("brand_voice", buildToneSuggestion(values));
public/control-center/pages/setup.js:1154:      showMessage?.("Setup context sent to AI Command.");
public/control-center/pages/setup.js:1195:        showMessage?.("No required setup gaps found.");
public/control-center/pages/setup.js:1205:      showMessage?.(`Reviewing missing setup items (${missing.length}).`);
public/control-center/pages/setup.js:1232:        showMessage?.(`Focus moved to ${first.label}.`);
public/control-center/pages/setup.js:1343:    showMessage,
public/control-center/pages/setup.js:1509:                <p class="home-section-copy">Core message and tone rules for consistent output.</p>
public/control-center/pages/setup.js:1513:                  ${renderField({ name: "brand_voice", label: "Brand voice", value: values.brand_voice, helper: "Tone rules for AI and content teams.", placeholder: "Confident, clear, practical", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1533:                  ${renderField({ name: "audience_primary", label: "Primary audience", value: values.audience_primary, helper: "Main customer segment.", placeholder: "Who are we targeting?", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1544:                  ${renderField({ name: "secondary_goal", label: "Secondary goal", value: values.secondary_goal, helper: "Supporting objective.", placeholder: "Optional secondary outcome", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1553:                  ${renderField({ name: "differentiation", label: "Differentiation", value: values.differentiation, helper: "How this brand stands out.", placeholder: "Why customers choose us", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1679:      showMessage,
public/control-center/pages/setup.js:1724:          showMessage?.("Business template applied.");
public/control-center/pages/setup.js:1728:            templateStatus.textContent = error?.message || "Failed to apply template.";
public/control-center/pages/setup.js:1731:          showError?.(error?.message || "Failed to apply template.");
public/control-center/pages/publishing.js:127:let publishingRenderCallback = null;
public/control-center/pages/publishing.js:132:    publishingRenderCallback = render;
public/control-center/pages/publishing.js:142:    if (typeof publishingRenderCallback === "function") {
public/control-center/pages/publishing.js:143:      publishingRenderCallback();
public/control-center/pages/publishing.js:149:  publishingRenderCallback = render;
public/control-center/pages/publishing.js:372:      draftMessage: "",
public/control-center/pages/publishing.js:546:  session.draftMessage = "";
public/control-center/pages/publishing.js:626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
public/control-center/pages/publishing.js:630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
public/control-center/pages/publishing.js:631:  session.validation.contentItem = message;
public/control-center/pages/publishing.js:632:  showMessage?.(message);
public/control-center/pages/publishing.js:636:function confirmPublishingBackendAction(message) {
public/control-center/pages/publishing.js:638:  return window.confirm(message);
public/control-center/pages/publishing.js:642:  const message = session.validation[key];
public/control-center/pages/publishing.js:643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
public/control-center/pages/publishing.js:1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
public/control-center/pages/publishing.js:1262:      ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
public/control-center/pages/publishing.js:1441:async function runAndRefresh(action, { projectName, reloadProjectData, showMessage, showError, successMessage }) {
public/control-center/pages/publishing.js:1445:    showMessage?.(successMessage);
public/control-center/pages/publishing.js:1448:    showError?.(error.message || "Publishing action failed.");
public/control-center/pages/publishing.js:1457:  showMessage,
public/control-center/pages/publishing.js:1485:  function saveDraftLocally(message = "Publishing draft saved locally.") {
public/control-center/pages/publishing.js:1490:    session.draftMessage = message;
public/control-center/pages/publishing.js:1491:    showMessage?.(message);
public/control-center/pages/publishing.js:1496:    const local = saveDraftLocally("Publishing draft saved locally.");
public/control-center/pages/publishing.js:1503:          showMessage,
public/control-center/pages/publishing.js:1505:          successMessage: "Publishing draft saved."
public/control-center/pages/publishing.js:1548:      showMessage?.("New publishing draft opened.");
public/control-center/pages/publishing.js:1584:      if (!current?.localOnly && guardPublishingAssetBlockers(session, assetBlockers, showMessage, "scheduling or rescheduling")) {
public/control-center/pages/publishing.js:1593:        session.draftMessage = "Local publishing draft scheduled in this browser.";
public/control-center/pages/publishing.js:1594:        showMessage?.(session.draftMessage);
public/control-center/pages/publishing.js:1616:        showMessage,
public/control-center/pages/publishing.js:1618:        successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
public/control-center/pages/publishing.js:1625:        saveDraftLocally("Backend schedule unavailable; draft kept locally.");
public/control-center/pages/publishing.js:1661:        session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
public/control-center/pages/publishing.js:1662:        showMessage?.(session.draftMessage);
public/control-center/pages/publishing.js:1668:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
public/control-center/pages/publishing.js:1682:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Manual publishing completion recorded." }
public/control-center/pages/publishing.js:1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1700:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
public/control-center/pages/publishing.js:1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1734:        showMessage?.("Local publishing draft approved.");
public/control-center/pages/publishing.js:1749:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
public/control-center/pages/publishing.js:1766:        showMessage?.("Local publishing draft marked failed.");
public/control-center/pages/publishing.js:1779:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
public/control-center/pages/publishing.js:1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
public/control-center/pages/publishing.js:1845:      showMessage?.("Publishing context sent to AI Command.");
public/control-center/pages/publishing.js:1878:      showMessage?.(publishingAutomationState.result);
public/control-center/pages/publishing.js:1887:      showMessage?.("Auto Mode stopped.");
public/control-center/pages/publishing.js:1895:      showMessage?.("Approval gate accepted.");
public/control-center/pages/publishing.js:1903:      showMessage?.("Gated step skipped.");
public/control-center/pages/publishing.js:1927:    showMessage,
public/control-center/pages/publishing.js:2009:      showMessage,
public/control-center/pages/publishing.js:2023:        showMessage,
public/control-center/pages/workflows.js:321:      validationMessage: "",
public/control-center/pages/workflows.js:347:    session.validationMessage = asString(session.validationMessage);
public/control-center/pages/workflows.js:772:            .map((entry) => `${entry.level || "info"}: ${entry.message || ""}`)
public/control-center/pages/workflows.js:780:function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
public/control-center/pages/workflows.js:812:      <div id="wfexecValidation" class="wfexec-validation${validationMessage ? " is-visible" : ""}">${escapeHtml(validationMessage || "")}</div>
public/control-center/pages/workflows.js:820:      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
public/control-center/pages/workflows.js:920:          ${renderBuilderSection(session, workflow, inputs, session.validationMessage, session.draftStatus, escapeHtml)}
public/control-center/pages/workflows.js:931:function applyDurableWorkflowHandoff({ projectName, session, operations, consumeProjectHandoff, showMessage }) {
public/control-center/pages/workflows.js:964:    console.warn("Failed to consume workflow handoff:", error.message);
public/control-center/pages/workflows.js:966:  showMessage?.("Workflow context restored from shared handoff.");
public/control-center/pages/workflows.js:1016:            ? (insightsResult.reason?.message || learningResult.reason?.message || "Failed to load workflow intelligence")
public/control-center/pages/workflows.js:1026:          error: error.message || "Failed to load workflow intelligence",
public/control-center/pages/workflows.js:1069:  showMessage,
public/control-center/pages/workflows.js:1100:      console.warn("Failed to persist workflow-to-ai handoff:", error.message);
public/control-center/pages/workflows.js:1105:  showMessage?.(allowPersistent ? "Workflow context sent to AI Command." : "Workflow context sent locally to AI Command.");
public/control-center/pages/workflows.js:1122:    const message = asString(detail.message);
public/control-center/pages/workflows.js:1133:      showMessage,
public/control-center/pages/workflows.js:1178:        prompt: firstNonEmpty(message, buildWorkflowPrompt(workflow, session.inputsByWorkflow[workflow.id], contextModel)),
public/control-center/pages/workflows.js:1194:      showMessage?.(`${workflow.title} created from AI context.`);
public/control-center/pages/workflows.js:1197:      showError?.(error.message || "Workflow review package preparation failed.");
public/control-center/pages/workflows.js:1210:  showMessage,
public/control-center/pages/workflows.js:1239:  function setValidation(message) {
public/control-center/pages/workflows.js:1240:    session.validationMessage = message || "";
public/control-center/pages/workflows.js:1243:    box.textContent = session.validationMessage;
public/control-center/pages/workflows.js:1244:    box.classList.toggle("is-visible", Boolean(session.validationMessage));
public/control-center/pages/workflows.js:1257:      if (session.validationMessage) setValidation("");
public/control-center/pages/workflows.js:1266:      session.validationMessage = "";
public/control-center/pages/workflows.js:1275:      showMessage?.("Workflow draft saved.");
public/control-center/pages/workflows.js:1286:      session.validationMessage = "";
public/control-center/pages/workflows.js:1287:      showMessage?.("Workflow draft cleared.");
public/control-center/pages/workflows.js:1314:        showMessage?.("No AI state found. Local workflow seed created safely.");
public/control-center/pages/workflows.js:1328:      showMessage?.("AI Command state loaded into workflow inputs.");
public/control-center/pages/workflows.js:1337:    `Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
public/control-center/pages/workflows.js:1346:    const validationMessage = validateWorkflowInputs(activeWorkflow, activeInputs);
public/control-center/pages/workflows.js:1347:    if (validationMessage) {
public/control-center/pages/workflows.js:1348:      setValidation(validationMessage);
public/control-center/pages/workflows.js:1425:      showMessage?.(`${activeWorkflow.title} completed.`);
public/control-center/pages/workflows.js:1430:        summary: error.message || "Workflow review package preparation failed.",
public/control-center/pages/workflows.js:1435:      showError?.(error.message || "Workflow review package preparation failed.");
public/control-center/pages/workflows.js:1461:      showMessage?.("Recommended workflow saved as draft.");
public/control-center/pages/workflows.js:1480:        showMessage,
public/control-center/pages/workflows.js:1495:      showMessage?.("Workflow draft saved.");
public/control-center/pages/workflows.js:1513:        showMessage,
public/control-center/pages/workflows.js:1530:        showMessage,
public/control-center/pages/workflows.js:1570:      showMessage?.("Task handoff prepared for review in Task Center.");
public/control-center/pages/workflows.js:1671:      showMessage?.(workflowAutomationState.result);
public/control-center/pages/workflows.js:1704:      showMessage?.(workflowAutomationState.result);
public/control-center/pages/workflows.js:1724:      showMessage?.("Workflow Guided Preparation Mode started.");
public/control-center/pages/workflows.js:1732:      showMessage?.("Guided Preparation Mode paused.");
public/control-center/pages/workflows.js:1740:      showMessage?.("Guided Preparation Mode resumed.");
public/control-center/pages/workflows.js:1748:      showMessage?.("Guided Preparation Mode stopped.");
public/control-center/pages/workflows.js:1756:      showMessage?.("Automation gate accepted. This is not a Governance approval.");
public/control-center/pages/workflows.js:1764:      showMessage?.("Guided Preparation Mode skipped one automation step. This does not bypass Governance policy.");
public/control-center/pages/workflows.js:1787:    showMessage
public/control-center/pages/workflows.js:2240:        showMessage?.("Workflow prepared.");
public/control-center/pages/settings.js:100:    description: "Manages variants, spend tests, and escalation into Ads Manager."
public/control-center/pages/settings.js:117:    service: "System control & escalation ownership",
public/control-center/pages/settings.js:349:    description: "Make ownership, escalation, and revision rules explicit so content moves quickly without losing control.",
public/control-center/pages/settings.js:384:        placeholder: "Reject anything with unsupported claims, brand mismatch, or missing route metadata. Two failed reviews escalate."
public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
public/control-center/pages/settings.js:388:        label: "Escalation notes",
public/control-center/pages/settings.js:561:        options: ["In-app only", "In-app + email", "In-app + Slack", "In-app + escalation queue"]
public/control-center/pages/settings.js:942:      revisionRules: "Reject unsupported claims, brand drift, weak hooks, or missing metadata. Two revisions escalate to the owner.",
public/control-center/pages/settings.js:943:      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
public/control-center/pages/settings.js:1050:      prohibitedOutputs: "No fake testimonials, fake claims, altered packaging, counterfeit logos, or unsupported medical positioning.",
public/control-center/pages/settings.js:1116:    session.error = error.message || "Failed to load durable settings.";
public/control-center/pages/settings.js:1202:    risks.push("No default publishing channels are selected, so campaign output cannot route automatically.");
public/control-center/pages/settings.js:1222:    risks.push("Claim safety is weakened, so unsupported product or compliance claims may slip into drafts.");
public/control-center/pages/settings.js:1900:          context.showMessage(`Settings saved for ${session.projectName} and synced into the durable system backbone.`);
public/control-center/pages/settings.js:1902:          context.showError(error.message || "Failed to save durable settings.");
public/control-center/pages/settings.js:1912:        context.showMessage("Default settings restored for this project. Review and save when ready.");
public/control-center/pages/settings.js:1921:        context.showMessage(`${titleCase(sectionId)} settings reset to defaults.`);
public/control-center/pages/settings.js:1928:        context.showMessage(`Focused ${titleCase(sectionId)} settings.`);
public/control-center/pages/settings.js:1946:          context.showMessage("Critical settings look complete. You can save this configuration whenever you’re ready.");
public/control-center/pages/settings.js:1972:      context.showMessage("Settings prompt added to AI Command.");
public/control-center/pages/ads-manager.js:8:    supportSources: ["website", "ecommerce", "analytics"],
public/control-center/pages/ads-manager.js:15:    supportSources: ["analytics", "ecommerce", "youtube"],
public/control-center/pages/ads-manager.js:22:    supportSources: ["website", "analytics"],
public/control-center/pages/ads-manager.js:29:    supportSources: ["analytics", "ecommerce"],
public/control-center/pages/ads-manager.js:132:    const supportConnected = platform.supportSources.filter((key) => Boolean(checks[key] || asObject(sources[key]).value));
public/control-center/pages/ads-manager.js:140:      status = supportConnected.length >= 2 ? "Operational" : "Partial";
public/control-center/pages/ads-manager.js:141:    } else if (supportConnected.length) {
public/control-center/pages/ads-manager.js:147:      ...platform.supportSources.filter((key) => !checks[key] && !asObject(sources[key]).value)
public/control-center/pages/ads-manager.js:160:      connectionValue: getSourceValue(sources, [...platform.primarySources, ...platform.supportSources]) || "No platform connection saved",
public/control-center/pages/ads-manager.js:161:      readinessScore: Math.round(((primaryConnected.length * 2) + supportConnected.length) / ((platform.primarySources.length * 2) + platform.supportSources.length) * 100),
public/control-center/pages/ads-manager.js:241:  showMessage,
public/control-center/pages/ads-manager.js:271:      showMessage?.("Paid media prompt added to AI Command.");
public/control-center/pages/ads-manager.js:305:    showMessage
public/control-center/pages/ads-manager.js:605:      showMessage,
public/control-center/pages/ads-manager.js:612:        showMessage
public/control-center/app.js:322:function setAccessKeyStatus(message, type) {
public/control-center/app.js:325:  status.textContent = message;
public/control-center/app.js:421:    if (requestResult.message) {
public/control-center/app.js:422:      lines.push(`probe message: ${requestResult.message}`);
public/control-center/app.js:445:        message: "No key available from input/runtime/localStorage"
public/control-center/app.js:463:      message: response.ok ? "ok" : "not-ok"
public/control-center/app.js:478:        message: error?.message || "request failed"
public/control-center/app.js:495:  showMessage(`Loaded project: ${projectToLoad}`);
public/control-center/app.js:541:        setAccessKeyStatus(error?.message || "Key saved, but project load failed.", "error");
public/control-center/app.js:594:            setAccessKeyStatus(error?.message || "Valid key, but project load failed.", "error");
public/control-center/app.js:743:let messageTimer = null;
public/control-center/app.js:745:function showMessage(message) {
public/control-center/app.js:746:  const box = $("globalMessage");
public/control-center/app.js:749:  box.textContent = message || "";
public/control-center/app.js:750:  box.style.display = message ? "block" : "none";
public/control-center/app.js:752:  if (message) {
public/control-center/app.js:753:    autoHideMessage();
public/control-center/app.js:762:function showError(message) {
public/control-center/app.js:766:  if (message && isFatalErrorPanelVisible()) {
public/control-center/app.js:772:  box.textContent = message || "";
public/control-center/app.js:773:  box.style.display = message ? "block" : "none";
public/control-center/app.js:777:  showMessage("");
public/control-center/app.js:781:function autoHideMessage(delay = 2500) {
public/control-center/app.js:782:  if (messageTimer) {
public/control-center/app.js:783:    clearTimeout(messageTimer);
public/control-center/app.js:786:  messageTimer = setTimeout(() => {
public/control-center/app.js:787:    showMessage("");
public/control-center/app.js:887:  startupRuntimeState.hideLoadingCalled = true;
public/control-center/app.js:937:  lastErrorMessage: "",
public/control-center/app.js:953:  hideLoadingCalled: false,
public/control-center/app.js:962:  lastApiMessage: "",
public/control-center/app.js:1008:    detail: String(details.detail || details.message || ""),
public/control-center/app.js:1023:    hideLoadingCalled: Boolean(startupRuntimeState.hideLoadingCalled),
public/control-center/app.js:1056:      `hideLoadingCalled: ${payload.hideLoadingCalled ? "true" : "false"}`,
public/control-center/app.js:1118:    hideLoadingCalled: Boolean(startupRuntimeState.hideLoadingCalled),
public/control-center/app.js:1125:    lastApiMessage: String(startupRuntimeState.lastApiMessage || ""),
public/control-center/app.js:1343:  const message = String(error?.message || error || "Unknown startup error").trim();
public/control-center/app.js:1348:    message,
public/control-center/app.js:1355:    message,
public/control-center/app.js:1362:  startupDiagnostics.lastErrorMessage = message;
public/control-center/app.js:1371:    detail: `${String(source || "startup")}: ${message}`,
public/control-center/app.js:1384:      message
public/control-center/app.js:1394:  if (startupDiagnostics.lastErrorSource || startupDiagnostics.lastErrorMessage) {
public/control-center/app.js:1397:      `${startupDiagnostics.lastErrorMessage || "unknown"}`
public/control-center/app.js:1511:  showMessage("Interface unlocked.");
public/control-center/app.js:1533:function isMissingReadKeyMessage(message) {
public/control-center/app.js:1534:  return /missing\s+read\s+key/i.test(String(message || ""));
public/control-center/app.js:1543:  const message = String(error?.message || "");
public/control-center/app.js:1550:    isMissingReadKeyMessage(message) ||
public/control-center/app.js:1551:    isMissingReadKeyMessage(payloadError)
public/control-center/app.js:1575:  const message = "Project data requires a valid access key.";
public/control-center/app.js:1580:    detail: String(error?.message || "missing read key")
public/control-center/app.js:1587:  setError(message);
public/control-center/app.js:1588:  showError(message);
public/control-center/app.js:1589:  showMessage(message);
public/control-center/app.js:1590:  setAccessKeyStatus(message, "error");
public/control-center/app.js:1594:  showFatalErrorPanel(message, renderStartupDiagnosticsText("access-key-required"));
public/control-center/app.js:1629:function showFatalErrorPanel(message, details = "") {
public/control-center/app.js:1632:    showError(message);
public/control-center/app.js:1640:    text.textContent = message || "Control Center failed to start.";
public/control-center/app.js:1656:    detail: `${String(source || "startup")}: ${String(err.message || "unknown error")}`
public/control-center/app.js:1662:  setError(err.message || "Control Center initialization failed");
public/control-center/app.js:1663:  showError(err.message || "Control Center initialization failed");
public/control-center/app.js:1727:      const unlockMessage = "Project response is still being processed. Interface unlocked.";
public/control-center/app.js:1728:      setError(unlockMessage);
public/control-center/app.js:1729:      showError(unlockMessage);
public/control-center/app.js:1730:      showMessage(unlockMessage);
public/control-center/app.js:1759:    startupRuntimeState.lastApiMessage = String(detail.message || "");
public/control-center/app.js:1764:        detail.message,
public/control-center/app.js:1778:    const message = event?.message || "Unhandled browser error";
public/control-center/app.js:1779:    const err = event?.error instanceof Error ? event.error : new Error(message);
public/control-center/app.js:2077:      showMessage,
public/control-center/app.js:2124:        showMessage,
public/control-center/app.js:2137:    showMessage,
public/control-center/app.js:2153:    setError(renderError.message || "Failed to render project page");
public/control-center/app.js:2154:    showError(renderError.message || "Failed to render project page");
public/control-center/app.js:2180:function withTimeout(promise, timeoutMs, message = "Operation timed out.") {
public/control-center/app.js:2185:      const error = new Error(message);
public/control-center/app.js:2353:      detail: `${nextError.phase}: ${nextError.message}`,
public/control-center/app.js:2498:        message: String(fallbackError?.message || "Failed to verify project fallback")
public/control-center/app.js:2526:  showMessage("Project details are still syncing.");
public/control-center/app.js:2632:            detail: String(entry?.message || entry?.section || "Optional warning")
public/control-center/app.js:2637:        const failure = new Error(String(entry?.message || "Optional endpoint failed"));
public/control-center/app.js:2652:    console.warn("Optional project data failed:", optionalError?.message || optionalError);
public/control-center/app.js:2656:      detail: String(optionalError?.message || optionalError || "Optional payload error")
public/control-center/app.js:2699:    showMessage(`Project ${safeProjectName} is already loading.`);
public/control-center/app.js:2709:  startupRuntimeState.hideLoadingCalled = false;
public/control-center/app.js:2855:        const renderMessage = renderGlobalError?.message || "Failed to render global UI.";
public/control-center/app.js:2856:        setError(renderMessage);
public/control-center/app.js:2857:        showError(renderMessage);
public/control-center/app.js:2858:        showFatalErrorPanel(renderMessage, renderStartupDiagnosticsText("renderGlobalUi"));
public/control-center/app.js:2861:          detail: String(renderMessage)
public/control-center/app.js:2883:        const renderMessage = pageRenderError?.message || "Failed to render current page.";
public/control-center/app.js:2884:        setError(renderMessage);
public/control-center/app.js:2885:        showError(renderMessage);
public/control-center/app.js:2886:        showFatalErrorPanel(renderMessage, renderStartupDiagnosticsText("safeRenderCurrentPage"));
public/control-center/app.js:2889:          detail: String(renderMessage)
public/control-center/app.js:2898:      showMessage(`Loaded project: ${loadedProjectName}`);
public/control-center/app.js:2906:          detail: String(error?.message || "response-text-watchdog")
public/control-center/app.js:2921:        const unlockMessage = "Project response is still being processed. Interface unlocked.";
public/control-center/app.js:2922:        setError(unlockMessage);
public/control-center/app.js:2923:        showError(unlockMessage);
public/control-center/app.js:2924:        showMessage(unlockMessage);
public/control-center/app.js:2937:          detail: String(error?.message || "parse-watchdog")
public/control-center/app.js:2944:        showMessage(warning);
public/control-center/app.js:2969:      setError(error.message || "Failed to load project data");
public/control-center/app.js:2970:      showError(error.message || "Failed to load project data");
public/control-center/app.js:2972:        error.message || "Failed to load project data",
public/control-center/app.js:2979:        detail: String(error.message || "Failed to load project data")
public/control-center/app.js:3073:        showMessage("Search handler is not available.");
public/control-center/app.js:3095:        showMessage("AI Command opened.");
public/control-center/app.js:3144:      showError(error?.message || "Action failed.");
public/control-center/app.js:3180:  // Back/Forward support — hashchange fires when the user navigates browser history
public/control-center/app.js:3209:      showMessage(`Test project ignored. Loading ${projectName}.`);
public/control-center/app.js:3549:    showMessage(`Opened ${matches[0].label}.`);
public/control-center/app.js:3554:  showMessage(`Matches: ${top.map((item) => item.label).join(" • ")}. Press Enter again to open ${top[0].label}.`);
public/control-center/app.js:3602:      message: value,
public/control-center/app.js:3770:      showMessage("AI suggestion loaded.");
public/control-center/app.js:3896:        <button class="executive-new-option" type="button" data-new-route="content-studio" data-new-prompt="Create a blog post workflow for the current project. Ask for topic, audience, language, SEO goal, and call to action.">
public/control-center/app.js:3905:          <span>Creative assets, AI visuals, videos, voice concepts.</span>
public/control-center/app.js:3953:    const setProjectStatus = (message, tone = "info") => {
public/control-center/app.js:3955:      projectStatus.textContent = message || "";
public/control-center/app.js:3995:        showMessage(`Project ${projectName} created.`);
public/control-center/app.js:3999:        setProjectStatus(error?.message || "Failed to create project.", "error");
public/control-center/app.js:4025:        showMessage("Started guided workflow.");
public/control-center/app.js:4151:      showMessage("Project list is still syncing. Continuing with default project.");
public/control-center/router.js:68:      console.warn("Route change subscriber failed:", error?.message || error);
public/control-center/router.js:157:  return getFallbackRouteAccess(route, DEFAULT_ROLE, { useDefaultRoleMessage: true });
public/control-center/index.html:34:    <div id="globalMessage" class="global-message" role="status" aria-live="polite"></div>
public/control-center/index.html:270:      function showFatalStartupError(message, details) {
public/control-center/index.html:279:          text.textContent = message || "The app failed to initialize.";
public/control-center/index.html:293:          globalError.textContent = message || "The app failed to initialize.";
public/control-center/index.html:342:        var message = reason && reason.message
public/control-center/index.html:343:          ? reason.message
public/control-center/index.html:346:        showFatalStartupError("Control Center startup promise failed.", message);

## AI Command customer support boundary references
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:321:    customer_ops: [
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:322:      "Specialist role: Customer Experience Operations Lead.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:327:      "Specialist role: Sales and CRM Lead.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:328:      "Focus on leads, follow-up drafts, CRM notes, offers, pipeline thinking, and relationship management.",
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:329:      "Do not update CRM, send outreach, or schedule follow-ups from chat; prepare drafts and next-step guidance only."
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:404:    '- Do not claim that publishing, approval, deletion, sync, CRM update, customer reply, workflow run, export, task creation, handoff creation, or backend action happened.',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1462:            sent_customer_reply: false,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1463:            mutated_crm: false,
public/control-center/pages/ai-command.js:98:                id: "customer_ops",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:126:	customer_operations: "customer_ops",
public/control-center/pages/ai-command.js:127:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:128:	support: "customer_ops",
public/control-center/pages/ai-command.js:129:	sales: "sales_crm",
public/control-center/pages/ai-command.js:130:	crm: "sales_crm",
public/control-center/pages/ai-command.js:131:	sales_crm: "sales_crm",
public/control-center/pages/ai-command.js:258:		id: "customer_ops",
public/control-center/pages/ai-command.js:260:		position: "Customer Experience Operations Lead",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:273:		position: "Revenue and CRM Operations Lead",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:341:	customer_ops: [
public/control-center/pages/ai-command.js:343:		{ label: "Draft customer reply", sub: "Safe response for review" },
public/control-center/pages/ai-command.js:347:	sales_crm: [
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
public/control-center/pages/ai-command.js:395:	customer_ops: "CO",
public/control-center/pages/ai-command.js:396:	sales_crm: "SC"
public/control-center/pages/ai-command.js:488:	customer_ops: [
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:498:	sales_crm: [
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:638:		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:639:		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:702:	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:703:	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:1192:			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1574:	if (specialistId === "customer_ops") {
public/control-center/pages/ai-command.js:1596:				"Draft a safe customer reply",
public/control-center/pages/ai-command.js:1605:	if (specialistId === "sales_crm") {
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
public/control-center/pages/ai-command.js:1627:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1706:			"Customer Ops and Sales / CRM join when the request touches inbox, tickets, leads, outreach, or CRM"
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1970:		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
public/control-center/pages/ai-command.js:1971:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:2392:	"customer-ops": "customer_ops",
public/control-center/pages/ai-command.js:2393:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:2394:	"sales-crm": "sales_crm",
public/control-center/pages/ai-command.js:2395:	sales_crm: "sales_crm"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4552:	const scopedContextItems = session.teamMode === "solo" && session.modeId === "customer_ops"
public/control-center/pages/ai-command.js:4560:		: session.teamMode === "solo" && session.modeId === "sales_crm"
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command/tool-dock.js:1036:  customer_ops: [
public/control-center/pages/ai-command/tool-dock.js:1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
public/control-center/pages/ai-command/tool-dock.js:1091:  sales_crm: [
public/control-center/pages/ai-command/tool-dock.js:1135:      badge: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1356:    crm: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1373:    .replace(/\bCrm\b/g, "CRM")
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
