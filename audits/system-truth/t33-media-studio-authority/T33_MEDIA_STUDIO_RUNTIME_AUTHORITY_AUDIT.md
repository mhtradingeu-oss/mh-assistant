# T33 — Media Studio Runtime Authority + Provider Job Safety Audit

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/media-studio-workspace.js

## Why This Page Is Next
T32 rebaseline ranked Media Studio Workspace as the highest remaining open frontend risk candidate.

T32 signals:
- Score: 604.1
- Priority: P0
- Lines: 3659
- API/write signals: 197
- Authority words: 447
- Confirmations: 0
- Storage: 4

## Purpose
Verify whether Media Studio:
- starts provider jobs directly
- uploads or prepares files safely
- calls backend/provider APIs
- needs confirmation before expensive/mutating generation/export actions
- routes governance/approval correctly
- uses escaped rendering for dynamic content
- needs runtime patch or only UX/product polish

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| HTML render / innerHTML | 3615 | 1 |
| Escape / safe rendering evidence | 98 | 256 |
| Provider/job/action wording | 2 | 968 |
| Backend/API calls | 21 | 17 |
| Job execution signals | 8 | 199 |
| Confirmation gates | n/a | 0 |
| Governance/approval signals | 3 | 191 |
| Dangerous external actions | 32 | 192 |
| Event handlers | 2860 | 27 |
| Storage signals | 190 | 4 |
| File/upload signals | 1967 | 2 |
| Navigation/handoff | 4 | 159 |
| Copy defect candidates | 17 | 17 |


## Evidence Zones

### HTML render / innerHTML

```js
 3525:               <h3>Creative Preparation, Review, and Routing Workspace</h3>
 3526:               <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
 3527:             </div>
 3528:           </div>
 3529:         </section>
 3530:       `;
 3531:     }
 3532: 
 3533:     // Source / Provenance Panel
 3534:     function renderSourceProvenancePanel() {
 3535:       const sourceState = getMediaSourceReadiness(session, selectedItem, handoff);
 3536:       const rows = [];
 3537:       if (selectedItem?.source) rows.push(["Source page", titleCase(selectedItem.source)]);
 3538:       if (selectedItem?.library_asset_ref?.handoff_id) rows.push(["Library asset", selectedItem.library_asset_ref.handoff_id]);
 3539:       if (selectedItem?.project) rows.push(["Project", selectedItem.project]);
 3540:       if (selectedItem?.campaign) rows.push(["Campaign", selectedItem.campaign]);
 3541:       if (session.form?.referenceAsset) rows.push(["Reference", session.form.referenceAsset]);
 3542:       if (!rows.length && handoff) rows.push(["Inbound handoff", titleCase(handoff.source_page || "Workflow")]);
 3543:       if (!rows.length) rows.push(["Source", "No trusted source attached yet"]);
 3544: 
 3545:       return `
 3546:         <section class="card media-card media-rail-card" id="mediaSourceProvenancePanel" aria-label="Source Context Panel">
 3547:           <div class="card-head media-compact-head">
 3548:             <div>
 3549:               <div class="setup-kicker">Source Context</div>
 3550:               <h3>Provenance</h3>
 3551:             </div>
 3552:             <span class="media-state-badge is-${escapeHtml(sourceState.state)}">${escapeHtml(sourceState.status)}</span>
 3553:           </div>
 3554:           <div class="media-compact-list media-provenance-list">
 3555:             ${rows.map(([label, value]) => `
 3556:               <div class="media-compact-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
 3557:             `).join("")}
 3558:           </div>
 3559:           <p class="media-rail-note">${escapeHtml(sourceState.detail)}</p>
 3560:         </section>
 3561:       `;
 3562:     }
 3563: 
 3564:     // Creative Readiness Checklist Panel
 3565:     function renderCreativeReadinessPanel() {
 3566:       const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
 3567:         .filter((item) => ["creative", "publishing"].includes(item.key));
 3568:       return `
 3569:         <section class="card media-card media-rail-card" id="mediaCreativeReadinessPanel" aria-label="Creative Readiness Checklist">
 3570:           <div class="card-head media-compact-head">
 3571:             <div>
 3572:               <div class="setup-kicker">Creative Readiness</div>
 3573:               <h3>Package inputs</h3>
 3574:             </div>
 3575:           </div>
 3576:           <div class="media-compact-list" role="list">
 3577:             ${readinessItems.map((item) => `
 3578:               <div class="media-compact-row is-${escapeHtml(item.state)}" role="listitem">
 3579:                 <span>${escapeHtml(item.label)}</span>
 3580:                 <strong>${escapeHtml(item.status)}</strong>
 3581:                 <small>${escapeHtml(item.detail)}</small>
 3582:               </div>
 3583:             `).join("")}
 3584:           </div>
 3585:         </section>
 3586:       `;
 3587:     }
 3588: 
 3589:     // Brand Compliance Checklist Panel
 3590:     function renderBrandCompliancePanel() {
 3591:       const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
 3592:         .filter((item) => ["brand", "governance"].includes(item.key));
 3593:       return `
 3594:         <section class="card media-card media-rail-card" id="mediaBrandCompliancePanel" aria-label="Brand Compliance Checklist">
 3595:           <div class="card-head media-compact-head">
 3596:             <div>
 3597:               <div class="setup-kicker">Brand Compliance</div>
 3598:               <h3>Brand and governance</h3>
 3599:             </div>
 3600:           </div>
 3601:           <div class="media-compact-list" role="list">
 3602:             ${readinessItems.map((item) => `
 3603:               <div class="media-compact-row is-${escapeHtml(item.state)}" role="listitem">
 3604:                 <span>${escapeHtml(item.label)}</span>
 3605:                 <strong>${escapeHtml(item.status)}</strong>
 3606:                 <small>${escapeHtml(item.detail)}</small>
 3607:               </div>
 3608:             `).join("")}
 3609:           </div>
 3610:           <div class="media-hint media-readiness-hint" aria-label="Governance review guidance">Prepare Governance Review if any risk or compliance concern exists.</div>
 3611:         </section>
 3612:       `;
 3613:     }
 3614: 
 3615:     root.innerHTML = `
 3616:       ${renderScopedStyles()}
 3617:       <div class="media-production-center">
 3618:         ${renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml })}
 3619:         ${renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml })}
 3620:         ${renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml })}
 3621:         ${session.error ? `<div class="simple-banner">${escapeHtml(session.error)}</div>` : ""}
 3622:         ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}
 3623:         <div class="media-production-grid">
 3624:           <div class="media-main-column">
 3625:             ${renderGenerator(session, state, backendProjectName, escapeHtml)}
 3626:             ${renderPromptBuilder(session, handoff, escapeHtml)}
 3627:             ${renderOutputPreviewPanel(session, selectedItem, escapeHtml)}
 3628:             ${renderQueue(session, escapeHtml)}
 3629:             ${renderReviewPanel(session, selectedItem, escapeHtml)}
 3630:             ${renderOutputReadinessPanel(session, selectedItem, escapeHtml)}
 3631:             ${renderVersioningPanel(session, escapeHtml)}
 3632:           </div>
 3633:           <aside class="media-side-column">
 3634:             ${renderWorkflowHandoff(handoff, session, escapeHtml)}
 3635:             ${renderSourceProvenancePanel()}
 3636:             ${renderCreativeReadinessPanel()}
 3637:             ${renderBrandCompliancePanel()}
 3638:             ${renderSpecialists(session, selectedItem, escapeHtml)}
 3639:             ${renderAssetGate(state, escapeHtml)}
 3640:             ${renderApiReadiness(session, backendProjectName, escapeHtml)}
 3641:           </aside>
 3642:         </div>
 3643:       </div>
 3644:     `;
 3645: 
 3646:     bindMediaStudio({
 3647:       projectName,
 3648:       backendProjectName,
 3649:       state,
 3650:       session,
 3651:       handoff,
 3652:       navigateTo,
 3653:       showMessage,
 3654:       showError,
 3655:       rerender
 3656:     });
 3657:   }
 3658: };
 3659: 
```

### Escape / safe rendering evidence

```js
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
   95:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   96: }
   97: 
   98: function asString(value) {
   99:   if (value == null) return "";
  100:   return String(value);
  101: }
  102: 
  103: function clean(value) {
  104:   return asString(value).trim();
  105: }
  106: 
  107: function titleCase(value) {
  108:   return asString(value)
  109:     .replace(/[_-]+/g, " ")
  110:     .replace(/\b\w/g, (match) => match.toUpperCase());
  111: }
  112: 
  113: function toKey(value) {
  114:   return clean(value).toLowerCase();
  115: }
  116: 
  117: function nowIso() {
  118:   return new Date().toISOString();
  119: }
  120: 
  121: function firstText(...values) {
  122:   for (const value of values) {
  123:     const text = clean(value);
  124:     if (text) return text;
  125:   }
  126:   return "";
  127: }
  128: 
  129: function formatDateTime(value) {
  130:   const date = new Date(value);
  131:   if (Number.isNaN(date.getTime())) return "Not recorded";
  132:   return new Intl.DateTimeFormat(undefined, {
  133:     month: "short",
  134:     day: "numeric",
  135:     hour: "numeric",
  136:     minute: "2-digit"
  137:   }).format(date);
  138: }
  139: 
  140: function formatCount(value) {
  141:   const parsed = Number(value);
  142:   if (!Number.isFinite(parsed)) return "0";
  143:   return String(Math.max(0, Math.round(parsed)));
  144: }
  145: 
  146: function projectKey(projectName) {
  147:   return toKey(projectName) || "__default__";
  148: }
  149: 
  150: function getProjectName(state) {
  151:   return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name, "Workspace");
  152: }
  153: 
  154: function getBackendProjectName(state) {
  155:   return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name);
  156: }
  157: 
  158: function getAssetData(state) {
  159:   return asObject(state.data.assets);
  160: }
  161: 
  162: function normalizeStatus(value, fallback = "draft") {
  163:   const normalized = toKey(value);
  164:   if (!normalized) return fallback;
  165:   if (["requested", "request", "queued", "draft"].includes(normalized)) return "draft";
  166:   if (["prompt_ready", "prompt ready", "ready"].includes(normalized)) return "prompt_ready";
  167:   if (["generating", "running", "processing", "in_progress"].includes(normalized)) return "generating";
  168:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  169:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  170:   if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
  171:   if (["sent_to_publishing", "sent to publishing", "sent"].includes(normalized)) return "sent_to_publishing";
  172:   if (["failed", "blocked", "error", "rejected"].includes(normalized)) return "failed";
  173:   return fallback;
  174: }
  175: 
  176: function statusTone(status) {
  177:   if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
  178:   if (status === "prompt_ready" || status === "generating" || status === "needs_review") return "warning";
  179:   if (status === "failed") return "danger";
  180:   return "neutral";
  181: }
  182: 
  183: function statusClass(status) {
  184:   return asString(status).replace(/[\s_]+/g, "-");
  185: }
  186: 
  187: function readDraftMap() {
  188:   if (typeof window === "undefined") return {};
```

### Provider/job/action wording

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
```

### Backend/API calls

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
   95:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   96: }
   97: 
   98: function asString(value) {
   99:   if (value == null) return "";
  100:   return String(value);
  101: }
  102: 
  103: function clean(value) {
  104:   return asString(value).trim();
  105: }
  106: 
  107: function titleCase(value) {
  108:   return asString(value)
  109:     .replace(/[_-]+/g, " ")
  110:     .replace(/\b\w/g, (match) => match.toUpperCase());
  111: }
```

### Job execution signals

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
   95:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   96: }
   97: 
   98: function asString(value) {
```

### Confirmation gates

```js
_No match found._
```

### Governance/approval signals

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
```

### Dangerous external actions

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
   95:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   96: }
   97: 
   98: function asString(value) {
   99:   if (value == null) return "";
  100:   return String(value);
  101: }
  102: 
  103: function clean(value) {
  104:   return asString(value).trim();
  105: }
  106: 
  107: function titleCase(value) {
  108:   return asString(value)
  109:     .replace(/[_-]+/g, " ")
  110:     .replace(/\b\w/g, (match) => match.toUpperCase());
  111: }
  112: 
  113: function toKey(value) {
  114:   return clean(value).toLowerCase();
  115: }
  116: 
  117: function nowIso() {
  118:   return new Date().toISOString();
  119: }
  120: 
  121: function firstText(...values) {
  122:   for (const value of values) {
```

### Event handlers

```js
 2770:           prompt: promptUsed,
 2771:           outputPayload: response,
 2772:           providerStatus: "provider_not_configured",
 2773:           readinessStatus: "prompt_ready",
 2774:           notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
 2775:           provider: response.provider || "",
 2776:           model: response.model || ""
 2777:         });
 2778:         syncOutputsFromVersioning(session);
 2779:         saveDraftToSession(projectName, state, session, "prompt_ready");
 2780:         session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
 2781:         rerender();
 2782:         return;
 2783:       }
 2784: 
 2785:       const outputEntry = buildOutputVersionFromGeneration(activeRequestType, response || {});
 2786:       appendVersion(session, {
 2787:         mode: selectedMode,
 2788:         prompt: promptUsed,
 2789:         outputPayload: outputEntry.payload,
 2790:         providerStatus: "generated",
 2791:         readinessStatus: "needs_review",
 2792:         notes: firstText(response?.message, "Generation response captured."),
 2793:         provider: response?.provider || "",
 2794:         model: response?.model || ""
 2795:       });
 2796:       syncOutputsFromVersioning(session);
 2797: 
 2798:       if (response?.improved_prompt) {
 2799:         session.form.prompt = response.improved_prompt;
 2800:       }
 2801:       if (response?.video_brief) {
 2802:         session.form.reviewNotes = [session.form.reviewNotes, response.video_brief].filter(Boolean).join("\n\n").trim();
 2803:       }
 2804:       if (response?.voice_script) {
 2805:         session.form.reviewNotes = [session.form.reviewNotes, response.voice_script].filter(Boolean).join("\n\n").trim();
 2806:       }
 2807:       if (response?.campaign_pack) {
 2808:         const packText = JSON.stringify(response.campaign_pack, null, 2);
 2809:         session.form.reviewNotes = [session.form.reviewNotes, packText].filter(Boolean).join("\n\n").trim();
 2810:       }
 2811: 
 2812:       session.form.status = "needs_review";
 2813:       await persistMediaJob({
 2814:         backendProjectName,
 2815:         projectName,
 2816:         state,
 2817:         session,
 2818:         status: "needs_review",
 2819:         showMessage
 2820:       });
 2821:       session.draftMessage = "Generation completed and queued for review.";
 2822:       rerender();
 2823:     } catch (error) {
 2824:       const isAuthError = isAccessKeyFailure(error);
 2825:       const authMessage = mediaAccessKeyMessage(error);
 2826:       session.form.status = "prompt_ready";
 2827:       appendVersion(session, {
 2828:         mode: selectedMode,
 2829:         prompt: promptUsed,
 2830:         outputPayload: {
 2831:           message: isAuthError
 2832:             ? authMessage
 2833:             : firstText(error?.payload?.message, error?.message, "Generation failed."),
 2834:           error_code: isAuthError
 2835:             ? "access_key_required"
 2836:             : firstText(error?.payload?.code, error?.code, "generation_error")
 2837:         },
 2838:         providerStatus: "generation_error",
 2839:         readinessStatus: "failed",
 2840:         notes: isAuthError
 2841:           ? authMessage
 2842:           : firstText(error?.payload?.message, error?.message, "Generation failed."),
 2843:         provider: "",
 2844:         model: ""
 2845:       });
 2846:       syncOutputsFromVersioning(session);
 2847:       saveDraftToSession(projectName, state, session, "prompt_ready");
 2848:       if (isAuthError) {
 2849:         showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2850:       }
 2851:       const payloadMessage = error?.payload?.message;
 2852:       session.draftMessage = isAuthError
 2853:         ? `${authMessage} Draft kept locally.`
 2854:         : payloadMessage || error?.message || "Generation failed. Draft kept locally.";
 2855:       rerender();
 2856:     }
 2857:   }
 2858: 
 2859:   if (form) {
 2860:     form.oninput = () => {
 2861:       sync();
 2862:       if (Object.keys(session.validation).length) {
 2863:         session.validation = {};
 2864:         rerender();
 2865:       }
 2866:     };
 2867:   }
 2868: 
 2869:   Array.from(document.querySelectorAll("[data-media-mode]")).forEach((button) => {
 2870:     button.onclick = () => {
 2871:       const mode = button.getAttribute("data-media-mode") || "image";
 2872:       resetForm(session, state, mode);
 2873:       rerender();
 2874:     };
 2875:   });
 2876: 
 2877:   Array.from(document.querySelectorAll("[data-media-select]")).forEach((button) => {
 2878:     button.onclick = () => {
 2879:       const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-select"));
 2880:       if (item) {
 2881:         session.selectedId = item.id;
 2882:         syncFormFromItem(session, item);
 2883:       }
 2884:       rerender();
 2885:     };
 2886:   });
 2887: 
 2888:   const startBtn = document.getElementById("mediaStartJobBtn");
 2889:   if (startBtn) {
 2890:     startBtn.onclick = () => {
 2891:       resetForm(session, state, session.mode || "image");
 2892:       document.getElementById("mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 2893:       showMessage?.("New media job draft opened.");
 2894:       rerender();
 2895:     };
 2896:   }
 2897: 
 2898:   const saveButtons = [document.getElementById("mediaSaveDraftBtn"), document.getElementById("mediaSaveBtn"), document.getElementById("mediaSavePromptBtn")].filter(Boolean);
 2899:   saveButtons.forEach((button) => {
 2900:     button.onclick = async () => {
 2901:       sync();
 2902:       if (!validateGenerator(session, "save")) {
 2903:         rerender();
 2904:         return;
 2905:       }
 2906:       await persistMediaJob({ backendProjectName, projectName, state, session, status: "prompt_ready", showMessage });
 2907:       rerender();
 2908:     };
 2909:   });
 2910: 
 2911:   const generateContextButtons = [document.getElementById("mediaGeneratePromptBtn"), document.getElementById("mediaPromptFromContextBtn")].filter(Boolean);
 2912:   generateContextButtons.forEach((button) => {
 2913:     button.onclick = () => {
 2914:       sync();
 2915:       applyPrompt(buildPromptFromContext(state, session), "Prompt generated from project context.");
 2916:     };
 2917:   });
 2918: 
 2919:   const fromHandoffBtn = document.getElementById("mediaPromptFromHandoffBtn");
 2920:   if (fromHandoffBtn) {
 2921:     fromHandoffBtn.onclick = () => {
 2922:       const summary = handoff ? extractHandoffSummary(handoff) : null;
 2923:       if (!summary) {
 2924:         session.draftMessage = "No workflow handoff is available.";
 2925:         rerender();
 2926:         return;
 2927:       }
 2928:       session.form.prompt = firstText(summary.prompt, summary.brief, session.form.prompt);
 2929:       session.form.campaign = firstText(summary.campaign, session.form.campaign);
 2930:       session.form.product = firstText(summary.product, session.form.product);
 2931:       session.form.channel = firstText(summary.channel, session.form.channel);
 2932:       session.form.objective = firstText(summary.objective, summary.brief, session.form.objective);
 2933:       session.draftMessage = "Prompt generated from workflow handoff.";
 2934:       rerender();
 2935:     };
 2936:   }
 2937: 
 2938:   const improveBtn = document.getElementById("mediaImprovePromptBtn");
 2939:   if (improveBtn) {
 2940:     improveBtn.onclick = async () => {
 2941:       sync();
 2942:       if (!clean(session.form.prompt)) {
 2943:         session.validation = { ...session.validation, prompt: "Prompt is required." };
 2944:         rerender();
 2945:         return;
 2946:       }
 2947:       try {
 2948:         const result = await improveMediaPrompt(buildGenerationRequestPayload(session));
 2949:         if (result && result.ok === false && result.status === "provider_not_configured") {
 2950:           applyPrompt(improvePrompt(session.form.prompt), result.message || "Prompt improved locally.");
```

### Storage signals

```js
  100:   return String(value);
  101: }
  102: 
  103: function clean(value) {
  104:   return asString(value).trim();
  105: }
  106: 
  107: function titleCase(value) {
  108:   return asString(value)
  109:     .replace(/[_-]+/g, " ")
  110:     .replace(/\b\w/g, (match) => match.toUpperCase());
  111: }
  112: 
  113: function toKey(value) {
  114:   return clean(value).toLowerCase();
  115: }
  116: 
  117: function nowIso() {
  118:   return new Date().toISOString();
  119: }
  120: 
  121: function firstText(...values) {
  122:   for (const value of values) {
  123:     const text = clean(value);
  124:     if (text) return text;
  125:   }
  126:   return "";
  127: }
  128: 
  129: function formatDateTime(value) {
  130:   const date = new Date(value);
  131:   if (Number.isNaN(date.getTime())) return "Not recorded";
  132:   return new Intl.DateTimeFormat(undefined, {
  133:     month: "short",
  134:     day: "numeric",
  135:     hour: "numeric",
  136:     minute: "2-digit"
  137:   }).format(date);
  138: }
  139: 
  140: function formatCount(value) {
  141:   const parsed = Number(value);
  142:   if (!Number.isFinite(parsed)) return "0";
  143:   return String(Math.max(0, Math.round(parsed)));
  144: }
  145: 
  146: function projectKey(projectName) {
  147:   return toKey(projectName) || "__default__";
  148: }
  149: 
  150: function getProjectName(state) {
  151:   return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name, "Workspace");
  152: }
  153: 
  154: function getBackendProjectName(state) {
  155:   return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name);
  156: }
  157: 
  158: function getAssetData(state) {
  159:   return asObject(state.data.assets);
  160: }
  161: 
  162: function normalizeStatus(value, fallback = "draft") {
  163:   const normalized = toKey(value);
  164:   if (!normalized) return fallback;
  165:   if (["requested", "request", "queued", "draft"].includes(normalized)) return "draft";
  166:   if (["prompt_ready", "prompt ready", "ready"].includes(normalized)) return "prompt_ready";
  167:   if (["generating", "running", "processing", "in_progress"].includes(normalized)) return "generating";
  168:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  169:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  170:   if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
  171:   if (["sent_to_publishing", "sent to publishing", "sent"].includes(normalized)) return "sent_to_publishing";
  172:   if (["failed", "blocked", "error", "rejected"].includes(normalized)) return "failed";
  173:   return fallback;
  174: }
  175: 
  176: function statusTone(status) {
  177:   if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
  178:   if (status === "prompt_ready" || status === "generating" || status === "needs_review") return "warning";
  179:   if (status === "failed") return "danger";
  180:   return "neutral";
  181: }
  182: 
  183: function statusClass(status) {
  184:   return asString(status).replace(/[\s_]+/g, "-");
  185: }
  186: 
  187: function readDraftMap() {
  188:   if (typeof window === "undefined") return {};
  189:   try {
  190:     const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LOCAL_DRAFTS_KEY) || "{}");
  191:     return parsed && typeof parsed === "object" ? parsed : {};
  192:   } catch (_) {
  193:     return {};
  194:   }
  195: }
  196: 
  197: function writeDraftMap(map) {
  198:   if (typeof window === "undefined") return;
  199:   try {
  200:     window.localStorage?.setItem(MEDIA_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  201:   } catch (_) {}
  202: }
  203: 
  204: function readLibraryAssetMap() {
  205:   if (typeof window === "undefined") return {};
  206:   try {
  207:     const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
  208:     return parsed && typeof parsed === "object" ? parsed : {};
  209:   } catch (_) {
  210:     return {};
  211:   }
  212: }
  213: 
  214: function writeLibraryAssetMap(map) {
  215:   if (typeof window === "undefined") return;
  216:   try {
  217:     window.localStorage?.setItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
  218:   } catch (_) {}
  219: }
  220: 
  221: function mediaAccessKeyMessage(error) {
  222:   const detail = firstText(error?.payload?.message, error?.message);
  223:   return detail ? `${MEDIA_ACCESS_KEY_GUIDANCE} (${detail})` : MEDIA_ACCESS_KEY_GUIDANCE;
  224: }
  225: 
  226: function loadLocalDrafts(projectName) {
  227:   return asArray(readDraftMap()[projectKey(projectName)]);
  228: }
  229: 
  230: function loadLocalLibraryAssets(projectName) {
  231:   return asArray(readLibraryAssetMap()[projectKey(projectName)]);
  232: }
  233: 
  234: function upsertLocalLibraryAsset(projectName, asset) {
  235:   const map = readLibraryAssetMap();
  236:   const key = projectKey(projectName);
  237:   const nextAsset = {
  238:     ...asObject(asset),
  239:     id: asString(asset.id || `media-library-${Date.now()}`),
  240:     source_signature: asString(asset.source_signature),
  241:     updated_at: nowIso()
  242:   };
  243:   const existing = asArray(map[key]).filter((item) => {
  244:     const sameId = asString(item.id) && asString(item.id) === nextAsset.id;
  245:     const sameSignature = nextAsset.source_signature && asString(item.source_signature) === nextAsset.source_signature;
  246:     return !(sameId || sameSignature);
  247:   });
  248:   map[key] = [nextAsset, ...existing].slice(0, 120);
  249:   writeLibraryAssetMap(map);
  250:   return nextAsset;
  251: }
  252: 
  253: function saveLocalDraft(projectName, draft) {
  254:   const map = readDraftMap();
  255:   const key = projectKey(projectName);
  256:   const existing = asArray(map[key]).filter((item) => asString(item.id) !== asString(draft.id));
  257:   const next = {
  258:     ...asObject(draft),
  259:     id: asString(draft.id || `local-media-${Date.now()}`),
  260:     localOnly: true,
  261:     source: "Local draft",
  262:     updated_at: nowIso()
  263:   };
  264:   map[key] = [next, ...existing].slice(0, 30);
  265:   writeDraftMap(map);
  266:   return next;
  267: }
  268: 
  269: function defaultForm(state, mode = "image") {
  270:   const context = asObject(state.context);
  271:   const overview = asObject(state.data.overview?.overview);
  272:   return {
  273:     mode,
  274:     project: firstText(context.currentProject, overview.project_name),
  275:     campaign: firstText(context.activeCampaign, overview.active_campaign),
  276:     product: firstText(overview.project_name, context.currentProject),
  277:     channel: "instagram",
  278:     format: mode === "video" ? "9:16 reel" : mode === "voice" ? "voiceover script" : "1:1 social image",
  279:     objective: firstText(overview.primary_goal, overview.goal, "Create publishing-ready media"),
  280:     brandStyle: firstText(overview.brand_voice, overview.tone, "Premium, clear, brand-safe"),
```

### File/upload signals

```js
 1877:           <h3>${escapeHtml(recommendation.action)}</h3>
 1878:           <p class="media-section-copy">${escapeHtml(recommendation.why)}</p>
 1879:         </div>
 1880:         <span class="card-badge ${statusTone(selectedItem?.status || "draft")}">${escapeHtml(selectedItem ? titleCase(selectedItem.status) : "Draft")}</span>
 1881:       </div>
 1882:       <div class="media-impact-row">
 1883:         ${chips.map(([label, value]) => `
 1884:           <span class="media-impact-chip">
 1885:             <strong>${escapeHtml(label)}</strong>
 1886:             <small>${escapeHtml(value)}</small>
 1887:           </span>
 1888:         `).join("")}
 1889:       </div>
 1890:       <div class="media-action-row">
 1891:         <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
 1892:         <button id="mediaSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
 1893:         <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
 1894:         <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
 1895:       </div>
 1896:     </section>
 1897:   `;
 1898: }
 1899: 
 1900: function renderField({ id, name, label, value, type = "text", options = [], multiline = false, rows = 4, helper = "", errorKey = name }, session, escapeHtml) {
 1901:   const input = options.length
 1902:     ? `
 1903:       <select id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input">
 1904:         ${options.map((option) => `
 1905:           <option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(titleCase(option))}</option>
 1906:         `).join("")}
 1907:       </select>
 1908:     `
 1909:     : multiline
 1910:       ? `<textarea id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}">${escapeHtml(value)}</textarea>`
 1911:       : `<input id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(value)}">`;
 1912: 
 1913:   return `
 1914:     <div class="setup-field-group">
 1915:       <div class="setup-field-head">
 1916:         <label class="setup-label" for="${escapeHtml(id)}">${escapeHtml(label)}</label>
 1917:       </div>
 1918:       ${input}
 1919:       ${helper ? `<div class="setup-helper">${escapeHtml(helper)}</div>` : ""}
 1920:       ${fieldError(session, errorKey, escapeHtml)}
 1921:     </div>
 1922:   `;
 1923: }
 1924: 
 1925: function renderGenerator(session, state, backendProjectName, escapeHtml) {
 1926:   const form = session.form;
 1927:   const mode = session.mode || form.mode || "image";
 1928:   const fallback = getGeneratorFallbackMessage(session, backendProjectName);
 1929:   const modeLabel = mode === "campaign-pack" ? "Campaign Pack" : titleCase(mode);
 1930:   return `
 1931:     <section class="card media-card" id="mediaGeneratorPanel">
 1932:       <div class="card-head">
 1933:         <div>
 1934:           <div class="setup-kicker">Media Generator</div>
 1935:           <h3>Brief -> Source -> Generate/Prepare -> Review -> Save to Library -> Handoff</h3>
 1936:           <p class="media-section-copy">Choose a media mode, prepare a prompt/job-ready draft, then render with a connected provider or continue safely with review and handoff.</p>
 1937:         </div>
 1938:         <span class="card-badge neutral">${escapeHtml(modeLabel)}</span>
 1939:       </div>
 1940:       <div class="media-mode-tabs" role="tablist" aria-label="Media generation mode">
 1941:         ${MEDIA_MODES.map((item) => `
 1942:           <button class="media-mode-tab${item === mode ? " is-active" : ""}" type="button" data-media-mode="${escapeHtml(item)}"${item === "image" || item === "video" ? ` data-new-media-job="${escapeHtml(item)}"` : ""}>${escapeHtml(item === "campaign-pack" ? "Campaign Pack" : titleCase(item))}</button>
 1943:         `).join("")}
 1944:       </div>
 1945:       ${fallback ? `<div class="simple-banner">${escapeHtml(fallback)}</div>` : ""}
 1946:           <div class="simple-banner media-block-gap">
 1947:             Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
 1948:           </div>
 1949:       <form id="mediaGeneratorForm" class="setup-form-grid media-generator-form" novalidate>
 1950:         <input type="hidden" name="mode" value="${escapeHtml(mode)}">
 1951:         <div class="setup-form-grid setup-form-grid-2">
 1952:           ${renderField({ id: "mediaProjectInput", name: "project", label: "Project", value: form.project }, session, escapeHtml)}
 1953:           ${renderField({ id: "mediaCampaignInput", name: "campaign", label: "Campaign", value: form.campaign }, session, escapeHtml)}
 1954:         </div>
 1955:         <div class="setup-form-grid setup-form-grid-2">
 1956:           ${renderField({ id: "mediaProductInput", name: "product", label: "Product", value: form.product }, session, escapeHtml)}
 1957:           ${renderField({ id: "mediaChannelInput", name: "channel", label: "Channel", value: form.channel, options: CHANNELS }, session, escapeHtml)}
 1958:         </div>
 1959:         <div class="setup-form-grid setup-form-grid-2">
 1960:           ${renderField({ id: "mediaFormatInput", name: "format", label: "Format", value: form.format, helper: "Examples: 1:1 product image, 9:16 reel, voiceover script, marketplace hero." }, session, escapeHtml)}
 1961:           ${renderField({ id: "mediaPurposeInput", name: "outputPurpose", label: "Output purpose", value: form.outputPurpose, options: OUTPUT_PURPOSES }, session, escapeHtml)}
 1962:         </div>
 1963:         ${renderField({ id: "mediaObjectiveInput", name: "objective", label: "Objective", value: form.objective, multiline: true, rows: 3 }, session, escapeHtml)}
 1964:         ${renderField({ id: "mediaBrandStyleInput", name: "brandStyle", label: "Brand style", value: form.brandStyle, multiline: true, rows: 3 }, session, escapeHtml)}
 1965:         ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
 1966:         <div class="setup-form-grid setup-form-grid-2">
 1967:           ${renderField({ id: "mediaReferenceInput", name: "referenceAsset", label: "Reference asset if available", value: form.referenceAsset, helper: "Use an asset id, filename, or source note already known to the project." }, session, escapeHtml)}
 1968:           ${renderField({ id: "mediaTitleInput", name: "title", label: "Job title", value: form.title, helper: "Optional operator-facing queue title." }, session, escapeHtml)}
 1969:         </div>
 1970:         ${renderField({ id: "mediaReviewNotesInput", name: "reviewNotes", label: "Review notes", value: form.reviewNotes, multiline: true, rows: 3, errorKey: "reviewNotes" }, session, escapeHtml)}
 1971:       </form>
 1972:       <div class="media-action-row">
 1973:         <button id="mediaGeneratePromptBtn" class="btn btn-secondary" type="button">Generate Prompt From Context</button>
 1974:         <button id="mediaRunGenerationBtn" class="btn btn-secondary" type="button">Generate Output</button>
 1975:         <button id="mediaSaveBtn" class="btn btn-primary" type="button">Save Draft</button>
 1976:       </div>
 1977:       ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
 1978:     </section>
 1979:   `;
 1980: }
 1981: 
 1982: function renderPromptBuilder(session, handoff, escapeHtml) {
 1983:   return `
 1984:     <section class="card media-card">
 1985:       <div class="card-head">
 1986:         <div>
 1987:           <div class="setup-kicker">Smart Prompt Intelligence</div>
 1988:           <h3>Prompt operations and format conversion</h3>
 1989:         </div>
 1990:         <span class="card-badge neutral">${escapeHtml(handoff ? "Handoff available" : "Context")}</span>
 1991:       </div>
 1992:       <div class="media-action-row">
 1993:         <button id="mediaPromptFromContextBtn" class="btn btn-secondary" type="button">Generate from project setup</button>
 1994:         <button id="mediaPromptFromHandoffBtn" class="btn btn-secondary" type="button">Generate from workflow handoff</button>
 1995:         <button id="mediaImprovePromptBtn" class="btn btn-secondary" type="button">Improve prompt</button>
 1996:         <button id="mediaBrandSafePromptBtn" class="btn btn-secondary" type="button">Make brand-safe</button>
 1997:         <button id="mediaGermanPromptBtn" class="btn btn-secondary" type="button">Adapt to German market</button>
 1998:         <button id="mediaImageToVideoBtn" class="btn btn-secondary" type="button">Convert image prompt to video brief</button>
 1999:         <button id="mediaVideoToVoiceBtn" class="btn btn-secondary" type="button">Convert video brief to voiceover</button>
 2000:         <button id="mediaGenerateAllFormatsBtn" class="btn btn-secondary" type="button">Generate all formats</button>
 2001:         <button id="mediaSavePromptBtn" class="btn btn-primary" type="button">Save prompt draft</button>
 2002:       </div>
 2003:     </section>
 2004:   `;
 2005: }
 2006: 
 2007: function renderWorkflowHandoff(handoff, session, escapeHtml) {
 2008:   if (!handoff) {
 2009:     return `
 2010:       <section class="card media-card">
 2011:         <div class="card-head">
 2012:           <div>
 2013:             <div class="setup-kicker">Inbound Media Brief</div>
 2014:             <h3>No inbound media brief available</h3>
 2015:           </div>
 2016:           <span class="card-badge neutral">Empty</span>
 2017:         </div>
 2018:         <div class="empty-box">Route content, workflow, or AI context into Media Studio to load a media brief here.</div>
 2019:       </section>
 2020:     `;
 2021:   }
 2022: 
 2023:   const summary = extractHandoffSummary(handoff);
 2024:   const loaded = summary.id && summary.id === session.loadedHandoffId;
 2025:   const isContentBrief = summary.sourcePage === "content-studio";
 2026:   const kicker = isContentBrief ? "Inbound Content Brief" : "Inbound Media Brief";
 2027:   const buttonLabel = isContentBrief ? "Load Content Design Brief" : "Load Media Brief";
 2028:   const fallbackCopy = isContentBrief
 2029:     ? "Content Studio output is ready to become a design brief."
 2030:     : "Handoff output is ready to become a media brief.";
 2031: 
 2032:   return `
 2033:     <section class="card media-card" id="mediaWorkflowHandoff">
 2034:       <div class="card-head">
 2035:         <div>
 2036:           <div class="setup-kicker">${escapeHtml(kicker)}</div>
 2037:           <h3>${escapeHtml(summary.title)}</h3>
 2038:           <p class="media-section-copy">${escapeHtml(summary.brief || summary.prompt || fallbackCopy)}</p>
 2039:         </div>
 2040:         <span class="card-badge ${loaded ? "success" : "neutral"}">${escapeHtml(loaded ? "Loaded" : "Available")}</span>
 2041:       </div>
 2042:       <div class="data-stack">
 2043:         <div class="data-row"><span>Source</span><strong>${escapeHtml(titleCase(summary.sourcePage))}</strong></div>
 2044:         <div class="data-row"><span>Campaign</span><strong>${escapeHtml(summary.campaign || "Not specified")}</strong></div>
 2045:         <div class="data-row"><span>Product</span><strong>${escapeHtml(summary.product || "Not specified")}</strong></div>
 2046:         <div class="data-row"><span>Channel</span><strong>${escapeHtml(summary.channel || "Not specified")}</strong></div>
 2047:         ${summary.contentType ? `<div class="data-row"><span>Content type</span><strong>${escapeHtml(titleCase(summary.contentType))}</strong></div>` : ""}
 2048:         ${summary.language ? `<div class="data-row"><span>Language</span><strong>${escapeHtml(summary.language)}</strong></div>` : ""}
 2049:         ${summary.tone ? `<div class="data-row"><span>Tone</span><strong>${escapeHtml(summary.tone)}</strong></div>` : ""}
 2050:       </div>
 2051:       <div class="media-action-row">
 2052:         <button id="mediaLoadHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(buttonLabel)}</button>
 2053:       </div>
 2054:     </section>
 2055:   `;
 2056: }
 2057: 
```

### Navigation/handoff

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
```

### Copy defect candidates

```js
    1: import {
    2:   brandCheckMedia,
    3:   createProjectApproval,
    4:   createProjectHandoff,
    5:   createProjectTask,
    6:   decideProjectApproval,
    7:   fetchProjectOperations,
    8:   generateMediaCampaignPack,
    9:   generateMediaImage,
   10:   generateMediaVideoBrief,
   11:   generateMediaVoiceScript,
   12:   improveMediaPrompt,
   13:   listProjectApprovals,
   14:   listProjectContentItems,
   15:   listProjectEvents,
   16:   listProjectHandoffs,
   17:   listProjectMediaJobs,
   18:   listProjectTasks,
   19:   saveProjectMediaJob,
   20:   isAccessKeyFailure
   21: } from "../api.js";
   22: import {
   23:   getAssetNextAction,
   24:   renderAssetDependencyRows
   25: } from "../asset-library.js";
   26: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   27: 
   28: const mediaStudioSessions = new Map();
   29: const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
   30: const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   31: const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
   32: const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
   33: const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
   34: const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
   35: const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
   36: const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
   37: const MEDIA_ROLE_DEFAULTS = {
   38:   serviceDomain: "media",
   39:   designRole: "designer",
   40:   videoRole: "video_lead",
   41:   reviewRole: "compliance_reviewer",
   42:   handoffRole: "publisher"
   43: };
   44: const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
   45: const SPECIALISTS = [
   46:   {
   47:     id: "visual-director",
   48:     title: "Visual Director",
   49:     purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
   50:     bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
   51:     suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
   52:   },
   53:   {
   54:     id: "video-strategist",
   55:     title: "Video Strategist",
   56:     purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
   57:     bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
   58:     suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
   59:   },
   60:   {
   61:     id: "voice-director",
   62:     title: "Voice Director",
   63:     purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
   64:     bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
   65:     suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
   66:   },
   67:   {
   68:     id: "brand-guardian",
   69:     title: "Brand Guardian",
   70:     purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
   71:     bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
   72:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
   73:   },
   74:   {
   75:     id: "prompt-engineer",
   76:     title: "Prompt Engineer",
   77:     purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
   78:     bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
   79:     suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
   80:   },
   81:   {
   82:     id: "publishing-assistant",
   83:     title: "Publishing Assistant",
   84:     purpose: "Finalize readiness signals and handoff payload quality before publishing.",
   85:     bestUse: "Right before preparing a Publishing package for downstream review.",
   86:     suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
   87:   }
   88: ];
   89: 
   90: function asArray(value) {
   91:   return Array.isArray(value) ? value : [];
   92: }
   93: 
   94: function asObject(value) {
   95:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
   96: }
   97: 
   98: function asString(value) {
   99:   if (value == null) return "";
  100:   return String(value);
  101: }
  102: 
  103: function clean(value) {
  104:   return asString(value).trim();
  105: }
  106: 
  107: function titleCase(value) {
```


## Preliminary Verdict

| Area | Verdict |
|---|---|
| Backend/API calls | Found or possible - focused proof required |
| Job/generation signals | Found - focused proof required |
| Confirmation gates | Not found |
| File/upload/media object signals | Found - focused proof required |
| Governance/approval signals | Found |
| Dangerous external action wording | Found - determine wording vs execution |
| Storage signals | Found - verify scope |

## Decision Guidance
- If Media Studio only prepares prompts/assets and routes jobs elsewhere, no runtime patch may be needed.
- If it starts generation/render/export/provider jobs, verify confirmation/governance gates.
- If it uses local/session storage for draft-only state, no patch may be needed.
- If storage persists sensitive provider/media data, focused patch may be required.
- If file/object URLs are created, verify revocation and safe preview handling.
- Do not patch from T33 alone.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
