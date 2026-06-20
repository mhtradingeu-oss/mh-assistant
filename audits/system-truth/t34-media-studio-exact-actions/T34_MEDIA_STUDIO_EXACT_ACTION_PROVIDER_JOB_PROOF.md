# T34 — Media Studio Exact Action + Provider Job Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/media-studio-workspace.js

## Purpose
T33 showed Media Studio has provider/job APIs, job signals, storage, and zero confirmation gates. T34 verifies exact action paths:
- which actions call provider/job APIs
- whether generation jobs are started directly
- whether save/handoff/approval actions are backend-owned
- whether confirmation/governance gates are missing
- whether local storage is draft-only
- whether file/object URL paths need safety review

## Exact Findings

| Area | First Line | Count |
|---|---:|---:|
| Imported provider/job APIs | 2 | 24 |
| bindMediaStudio block | 2710 | 2 |
| data media action handlers | 1942 | 34 |
| generate image call | n/a | 0 |
| generate video brief call | n/a | 0 |
| generate voice script call | n/a | 0 |
| generate campaign pack call | n/a | 0 |
| improve prompt call | 2948 | 1 |
| brand check call | 2977 | 1 |
| save media job call | 2697 | 1 |
| create approval call | 3136 | 1 |
| decide approval call | 3114 | 2 |
| create handoff call | 1094 | 2 |
| create task call | 3202 | 1 |
| confirmation gates | n/a | 0 |
| governance/approval route | 3 | 41 |
| publishing route/handoff | 32 | 36 |
| localStorage write/read | n/a | 0 |
| file/object URL signals | 1967 | 2 |
| error handling | 20 | 22 |


## Main Binding / Action Block

```js
 2710: function bindMediaStudio({
 2711:   projectName,
 2712:   backendProjectName,
 2713:   state,
 2714:   session,
 2715:   handoff,
 2716:   navigateTo,
 2717:   showMessage,
 2718:   showError,
 2719:   rerender
 2720: }) {
 2721:   const form = document.getElementById("mediaGeneratorForm");
 2722: 
 2723:   function selected() {
 2724:     return getSelectedItem(session);
 2725:   }
 2726: 
 2727:   function sync() {
 2728:     syncSessionForm(session, form);
 2729:   }
 2730: 
 2731:   function applyPrompt(value, message) {
 2732:     session.form.prompt = value;
 2733:     syncVersionFromForm(session);
 2734:     session.validation = {};
 2735:     session.draftMessage = message || "";
 2736:     rerender();
 2737:   }
 2738: 
 2739:   function generationApiForMode(mode) {
 2740:     if (mode === "video") return generateMediaVideoBrief;
 2741:     if (mode === "audio") return generateMediaVoiceScript;
 2742:     if (mode === "multi_format") return generateMediaCampaignPack;
 2743:     return generateMediaImage;
 2744:   }
 2745: 
 2746:   async function runGenerationAction() {
 2747:     sync();
 2748:     if (!validateGenerator(session, "save")) {
 2749:       rerender();
 2750:       return;
 2751:     }
 2752: 
 2753:     const promptUsed = clean(session.form.prompt);
 2754:     const selectedMode = session.form.mode || session.mode || "image";
 2755:     const activeRequestType = requestTypeForMode(selectedMode);
 2756:     session.form.status = "generating";
 2757:     session.validation = {};
 2758:     saveDraftToSession(projectName, state, session, "generating");
 2759:     rerender();
 2760: 
 2761:     const callApi = generationApiForMode(activeRequestType);
 2762: 
 2763:     try {
 2764:       const response = await callApi(buildGenerationRequestPayload(session));
 2765: 
 2766:       if (response && response.ok === false && response.status === "provider_not_configured") {
 2767:         session.form.status = "prompt_ready";
 2768:         appendVersion(session, {
 2769:           mode: selectedMode,
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
 2951:           return;
 2952:         }
 2953:         applyPrompt(result.improved_prompt || improvePrompt(session.form.prompt), "Prompt improved.");
 2954:       } catch (error) {
 2955:         if (isAccessKeyFailure(error)) {
 2956:           const authMessage = mediaAccessKeyMessage(error);
 2957:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2958:           applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
 2959:           return;
 2960:         }
 2961: 
 2962:         applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
 2963:       }
 2964:     };
 2965:   }
 2966: 
 2967:   const brandSafeBtn = document.getElementById("mediaBrandSafePromptBtn");
 2968:   if (brandSafeBtn) {
 2969:     brandSafeBtn.onclick = async () => {
 2970:       sync();
 2971:       if (!clean(session.form.prompt)) {
 2972:         session.validation = { ...session.validation, prompt: "Prompt is required." };
 2973:         rerender();
 2974:         return;
 2975:       }
 2976:       try {
 2977:         const result = await brandCheckMedia(buildGenerationRequestPayload(session));
 2978:         if (result && result.ok === false && result.status === "provider_not_configured") {
 2979:           applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
 2980:           return;
 2981:         }
 2982:         const safePrompt = result?.brand_check?.is_brand_safe ? session.form.prompt : makeBrandSafe(session.form.prompt);
 2983:         const message = result?.brand_check?.is_brand_safe
 2984:           ? "Prompt passed brand safety check."
 2985:           : "Prompt adjusted for brand safety.";
 2986:         applyPrompt(safePrompt, message);
 2987:       } catch (error) {
 2988:         if (isAccessKeyFailure(error)) {
 2989:           const authMessage = mediaAccessKeyMessage(error);
 2990:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2991:           applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
 2992:           return;
 2993:         }
 2994: 
 2995:         applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
 2996:       }
 2997:     };
 2998:   }
 2999: 
 3000:   const germanBtn = document.getElementById("mediaGermanPromptBtn");
 3001:   if (germanBtn) germanBtn.onclick = () => { sync(); applyPrompt(adaptGerman(session.form.prompt), "Prompt adapted for German usage."); };
 3002: 
 3003:   const imageToVideoBtn = document.getElementById("mediaImageToVideoBtn");
 3004:   if (imageToVideoBtn) imageToVideoBtn.onclick = () => { sync(); applyPrompt(convertImagePromptToVideoBrief(session.form.prompt), "Image prompt converted to video brief."); };
 3005: 
 3006:   const videoToVoiceBtn = document.getElementById("mediaVideoToVoiceBtn");
 3007:   if (videoToVoiceBtn) videoToVoiceBtn.onclick = () => { sync(); applyPrompt(convertVideoBriefToVoiceover(session.form.prompt), "Video brief converted to voiceover script."); };
 3008: 
 3009:   const allFormatsBtn = document.getElementById("mediaGenerateAllFormatsBtn");
 3010:   if (allFormatsBtn) allFormatsBtn.onclick = () => { sync(); applyPrompt(generateAllFormats(session, state), "All format briefs generated."); };
 3011: 
 3012:   const runGenerationBtn = document.getElementById("mediaRunGenerationBtn");
 3013:   if (runGenerationBtn) {
 3014:     runGenerationBtn.onclick = async () => {
 3015:       await runGenerationAction();
 3016:     };
 3017:   }
 3018: 
 3019:   const loadHandoffBtn = document.getElementById("mediaLoadHandoffBtn");
 3020:   if (loadHandoffBtn) {
 3021:     loadHandoffBtn.onclick = () => {
 3022:       const summary = extractHandoffSummary(handoff);
 3023:       session.form = {
 3024:         ...session.form,
 3025:         project: firstText(summary.project, session.form.project, projectName),
 3026:         campaign: firstText(summary.campaign, session.form.campaign),
 3027:         product: firstText(summary.product, session.form.product),
 3028:         channel: firstText(summary.channel, session.form.channel),
 3029:         objective: firstText(summary.objective, summary.brief, session.form.objective),
 3030:         prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
 3031:         title: firstText(summary.title, session.form.title)
 3032:       };
 3033:       session.loadedHandoffId = summary.id;
 3034:       session.isCreatingNew = true;
 3035:       session.selectedId = "";
 3036:       session.formSourceId = "";
 3037:       session.draftMessage = summary.sourcePage === "content-studio"
 3038:         ? "Content design brief loaded into generator."
 3039:         : "Media brief loaded into generator.";
 3040:       rerender();
 3041:     };
 3042:   }
 3043: 
 3044:   Array.from(document.querySelectorAll("[data-media-action]")).forEach((button) => {
 3045:     button.onclick = async () => {
 3046:       const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-id"));
 3047:       const action = button.getAttribute("data-media-action") || "";
 3048:       if (!item) return;
 3049:       session.selectedId = item.id;
 3050:       syncFormFromItem(session, item);
 3051: 
 3052:       if (action === "preview" || action === "edit-prompt") {
 3053:         document.getElementById(action === "preview" ? "mediaReviewPanel" : "mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 3054:         rerender();
 3055:         return;
 3056:       }
 3057: 
 3058:       if (action === "save-draft") {
 3059:         saveDraftToSession(projectName, state, session, "draft");
 3060:         showMessage?.("Media job saved as local draft.");
 3061:       }
 3062: 
 3063:       if (action === "regenerate") {
 3064:         session.form.prompt = improvePrompt(session.form.prompt);
 3065:         syncVersionFromForm(session);
 3066:         saveDraftToSession(projectName, state, session, "prompt_ready");
 3067:         showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
 3068:       }
 3069: 
 3070:       if (action === "approve") {
 3071:         session.form.status = "approved";
 3072:         const currentVersion = selectedVersionEntry(session);
 3073:         if (currentVersion) currentVersion.readiness_status = "approved";
 3074:         syncOutputsFromVersioning(session);
 3075:         saveDraftToSession(projectName, state, session, "approved");
 3076:         showMessage?.("Media job marked review-ready locally.");
 3077:       }
 3078: 
 3079:       if (action === "send-publishing") {
 3080:         session.form.status = "sent_to_publishing";
 3081:         const currentVersion = selectedVersionEntry(session);
 3082:         if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
 3083:         syncOutputsFromVersioning(session);
 3084:         saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3085:         sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
 3086:         return;
 3087:       }
 3088:       rerender();
 3089:     };
 3090:   });
 3091: 
 3092:   const approveBtn = document.getElementById("mediaApproveBtn");
 3093:   if (approveBtn) {
 3094:     approveBtn.onclick = async () => {
 3095:       sync();
 3096:       const item = selected();
 3097:       session.form.status = "approved";
 3098:       const currentVersion = selectedVersionEntry(session);
 3099:       if (currentVersion) {
 3100:         currentVersion.readiness_status = "approved";
 3101:         currentVersion.provider_status = currentVersion.provider_status || "generated";
 3102:       }
 3103:       syncOutputsFromVersioning(session);
 3104:       saveDraftToSession(projectName, state, session, "approved");
 3105: 
 3106:       if (backendProjectName && item && !item.localOnly) {
 3107:         const pendingApproval = session.approvals.find((approval) =>
 3108:           asString(approval.entity_type) === "media_job" &&
 3109:           asString(approval.entity_id) === asString(item.id) &&
 3110:           asString(approval.status) === "pending"
 3111:         );
 3112:         if (pendingApproval) {
 3113:           try {
 3114:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3115:               decision: "approved",
 3116:               note: session.form.reviewNotes || "Marked review-ready in Media Studio.",
 3117:               actor: "media-studio"
 3118:             });
 3119:           } catch (_) {}
 3120:         }
 3121:       }
 3122:       showMessage?.("Media review state recorded.");
 3123:       rerender();
 3124:     };
 3125:   }
 3126: 
 3127:   const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
 3128:   if (requestApprovalBtn) {
 3129:     requestApprovalBtn.onclick = async () => {
 3130:       sync();
 3131:       const item = selected() || saveDraftToSession(projectName, state, session, "needs_review");
 3132:       saveDraftToSession(projectName, state, session, "needs_review");
 3133: 
 3134:       if (backendProjectName && item && !item.localOnly) {
 3135:         try {
 3136:           await createProjectApproval(backendProjectName, {
 3137:             title: `Review ${item.title || session.form.title || "media job"}`,
 3138:             entity_type: "media_job",
 3139:             entity_id: item.id,
 3140:             summary: session.form.reviewNotes || "Review media output before publishing handoff.",
 3141:             reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
 3142:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3143:             requested_by: "media-studio",
 3144:             linked_entity: {
 3145:               entity_type: "media_job",
 3146:               entity_id: item.id,
 3147:               route: "media-studio",
 3148:               label: item.title || session.form.title || "Media job"
 3149:             },
 3150:             actor: "media-studio"
 3151:           });
 3152:           showMessage?.("Review request created.");
 3153:         } catch (_) {
 3154:           showMessage?.("Review request kept as local review state.");
 3155:         }
 3156:       } else {
 3157:         showMessage?.("Media draft moved to needs review locally.");
 3158:       }
 3159:       rerender();
 3160:     };
 3161:   }
 3162: 
 3163:   const rejectBtn = document.getElementById("mediaRejectBtn");
 3164:   if (rejectBtn) {
 3165:     rejectBtn.onclick = async () => {
 3166:       sync();
 3167:       const item = selected();
 3168:       session.form.status = "draft";
 3169:       const currentVersion = selectedVersionEntry(session);
 3170:       if (currentVersion) currentVersion.readiness_status = "draft";
 3171:       syncOutputsFromVersioning(session);
 3172:       saveDraftToSession(projectName, state, session, "draft");
 3173: 
 3174:       if (backendProjectName && item && !item.localOnly) {
 3175:         const pendingApproval = session.approvals.find((approval) =>
 3176:           asString(approval.entity_type) === "media_job" &&
 3177:           asString(approval.entity_id) === asString(item.id) &&
 3178:           asString(approval.status) === "pending"
 3179:         );
 3180:         if (pendingApproval) {
 3181:           try {
 3182:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3183:               decision: "rejected",
 3184:               note: session.form.reviewNotes || "Revision requested in Media Studio.",
 3185:               actor: "media-studio"
 3186:             });
 3187:           } catch (_) {}
 3188:         }
 3189:       }
 3190:       showMessage?.("Media job returned to draft for revision.");
 3191:       rerender();
 3192:     };
 3193:   }
 3194: 
 3195:   const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
 3196:   if (createTaskBtn) {
 3197:     createTaskBtn.onclick = async () => {
 3198:       sync();
 3199:       const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
 3200:       if (backendProjectName && item && !item.localOnly) {
 3201:         try {
 3202:           await createProjectTask(backendProjectName, {
 3203:             title: `Complete media job ${item.title || session.form.title || "media job"}`,
 3204:             description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
 3205:             owner_role: item.owner_role || ownerRoleForMode(item.mode),
 3206:             assignee_role: item.owner_role || ownerRoleForMode(item.mode),
 3207:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3208:             responsibility: item.mode === "video" ? "video_production" : "creative_production",
 3209:             handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
 3210:             source_page: "media-studio",
 3211:             route_target: "media-studio",
 3212:             linked_entity: {
 3213:               entity_type: "media_job",
 3214:               entity_id: item.id,
 3215:               route: "media-studio",
 3216:               label: item.title || session.form.title || "Media job"
 3217:             },
 3218:             actor: "media-studio"
 3219:           });
 3220:           showMessage?.("Task created and linked to the media job.");
 3221:         } catch (_) {
 3222:           showMessage?.("Task action kept locally because backend task save is unavailable.");
 3223:         }
 3224:       } else {
 3225:         showMessage?.("Create Task needs a backend media job; local draft is preserved.");
 3226:       }
 3227:       rerender();
 3228:     };
 3229:   }
 3230: 
 3231:   const sendAiBtn = document.getElementById("mediaSendAiCommandBtn");
 3232:   if (sendAiBtn) {
 3233:     sendAiBtn.onclick = () => {
 3234:       sync();
 3235:       const item = selected();
 3236:       const prompt = buildAiPrompt(projectName, session, item);
 3237:       const aiDraft = {
 3238:         projectName,
 3239:         modeId: "media",
 3240:         lastCommand: prompt,
 3241:         lastResponseTitle: item?.title || session.form.title || "Media Studio Review",
 3242:         routeSuggestions: []
 3243:       };
 3244:       setSharedAiDraft(projectName, aiDraft);
 3245:       setSharedHandoff(projectName, "ai-command", {
 3246:         source_page: "media-studio",
 3247:         destination_page: "ai-command",
 3248:         linked_entity: {
 3249:           entity_type: "media_job",
 3250:           entity_id: item?.id || session.formSourceId || ""
 3251:         },
 3252:         payload: {
 3253:           prompt,
 3254:           media_job_id: item?.id || session.formSourceId || "",
 3255:           title: item?.title || session.form.title || "",
 3256:           draft_context: aiDraft,
 3257:           media: buildMediaPayload(session, item?.status || "prompt_ready")
 3258:         },
 3259:         status: "available"
 3260:       });
 3261:       navigateTo("ai-command");
 3262:       showMessage?.("Media context sent to AI Command.");
 3263:     };
 3264:   }
 3265: 
 3266:   const sendPublishingBtn = document.getElementById("mediaSendToPublishingBtn");
 3267:   if (sendPublishingBtn) {
 3268:     sendPublishingBtn.onclick = () => {
 3269:       sync();
 3270:       session.form.status = "sent_to_publishing";
 3271:       const currentVersion = selectedVersionEntry(session);
 3272:       if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
 3273:       syncOutputsFromVersioning(session);
 3274:       saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3275:       sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
 3276:     };
 3277:   }
 3278: 
 3279:   const headerSaveLibraryBtn = document.getElementById("mediaHeaderSaveLibraryBtn");
 3280:   if (headerSaveLibraryBtn) {
 3281:     headerSaveLibraryBtn.onclick = async () => {
 3282:       sync();
 3283:       await saveVersionToLibrary({
 3284:         projectName,
 3285:         backendProjectName,
 3286:         state,
 3287:         session,
 3288:         selectedItem: selected(),
 3289:         showMessage,
 3290:         rerender
 3291:       });
 3292:       rerender();
 3293:     };
 3294:   }
 3295: 
 3296:   const versionNotes = document.getElementById("mediaVersionCompareNotes");
 3297:   if (versionNotes) {
 3298:     versionNotes.oninput = () => {
 3299:       ensureVersioning(session).compareNotes = versionNotes.value || "";
 3300:     };
 3301:   }
 3302: 
 3303:   Array.from(document.querySelectorAll("[data-media-version]")).forEach((button) => {
 3304:     button.onclick = () => {
 3305:       const key = button.getAttribute("data-media-version") || "v1";
 3306:       ensureVersioning(session).selectedVersionId = key;
 3307:       applySelectedVersionToForm(session);
 3308:       session.draftMessage = `${titleCase(key)} selected.`;
 3309:       rerender();
 3310:     };
 3311:   });
 3312: 
 3313:   Array.from(document.querySelectorAll("[data-media-version-action]")).forEach((button) => {
 3314:     button.onclick = async () => {
 3315:       sync();
 3316:       const action = button.getAttribute("data-media-version-action") || "";
 3317:       const currentVersion = selectedVersionEntry(session);
 3318:       if (!currentVersion) return;
 3319: 
 3320:       if (action === "compare-toggle") {
 3321:         const versioning = ensureVersioning(session);
 3322:         versioning.compareMode = !versioning.compareMode;
 3323:         rerender();
 3324:         return;
 3325:       }
 3326: 
 3327:       if (action === "approve") {
 3328:         session.form.status = "approved";
 3329:         currentVersion.readiness_status = "approved";
 3330:         currentVersion.provider_status = currentVersion.provider_status || "generated";
 3331:         saveDraftToSession(projectName, state, session, "approved");
 3332:         syncOutputsFromVersioning(session);
 3333:         showMessage?.("Selected version marked review-ready.");
 3334:       }
 3335:       if (action === "reject") {
 3336:         session.form.status = "draft";
 3337:         currentVersion.readiness_status = "draft";
 3338:         saveDraftToSession(projectName, state, session, "draft");
 3339:         syncOutputsFromVersioning(session);
 3340:         showMessage?.("Selected version rejected and returned to draft.");
 3341:       }
 3342:       if (action === "regenerate") {
 3343:         session.form.prompt = improvePrompt(currentVersion.prompt || session.form.prompt);
 3344:         session.form.status = "prompt_ready";
 3345:         appendVersion(session, {
 3346:           mode: currentVersion.mode || session.form.mode || session.mode || "image",
 3347:           prompt: session.form.prompt,
 3348:           outputPayload: {
 3349:             message: "Regenerated from selected version prompt.",
 3350:             source_version_id: currentVersion.id
 3351:           },
 3352:           providerStatus: "prompt_ready",
 3353:           readinessStatus: "prompt_ready",
 3354:           notes: "Regenerated from selected version.",
 3355:           provider: currentVersion.provider || "",
 3356:           model: currentVersion.model || ""
 3357:         });
 3358:         syncOutputsFromVersioning(session);
 3359:         saveDraftToSession(projectName, state, session, "prompt_ready");
 3360:         showMessage?.("Selected version regenerated as prompt-ready draft.");
 3361:       }
 3362:       if (action === "save-draft") {
 3363:         saveDraftToSession(projectName, state, session, "draft");
 3364:         showMessage?.("Selected version saved as draft.");
 3365:       }
 3366:       if (action === "send-publishing") {
 3367:         session.form.status = "sent_to_publishing";
 3368:         currentVersion.readiness_status = "sent_to_publishing";
 3369:         syncOutputsFromVersioning(session);
 3370:         saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3371:         await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
 3372:         return;
 3373:       }
 3374:       if (action === "save-library") {
 3375:         await saveVersionToLibrary({
 3376:           projectName,
 3377:           backendProjectName,
 3378:           state,
 3379:           session,
 3380:           selectedItem: selected(),
 3381:           showMessage,
 3382:           rerender
 3383:         });
 3384:       }
 3385:       rerender();
 3386:     };
 3387:   });
 3388: 
 3389:   Array.from(document.querySelectorAll("[data-media-specialist-use], [data-media-specialist-save], [data-media-specialist-ai]")).forEach((button) => {
 3390:     button.onclick = async () => {
 3391:       const id = button.getAttribute("data-media-specialist-use") || button.getAttribute("data-media-specialist-save") || button.getAttribute("data-media-specialist-ai") || "";
 3392:       const specialist = SPECIALISTS.find((item) => item.id === id);
 3393:       if (!specialist) return;
 3394:       session.form.prompt = [specialist.suggestedPrompt, session.form.prompt].filter(Boolean).join("\n\n");
 3395:       syncVersionFromForm(session);
 3396:       session.draftMessage = `${specialist.title} prompt added.`;
 3397:       if (button.hasAttribute("data-media-specialist-save")) {
 3398:         saveDraftToSession(projectName, state, session, "draft");
 3399:         showMessage?.(`${specialist.title} draft saved locally.`);
 3400:       }
 3401:       if (button.hasAttribute("data-media-specialist-ai")) {
 3402:         const prompt = buildAiPrompt(projectName, session, selected());
 3403:         const aiDraft = {
 3404:           projectName,
 3405:           modeId: "media",
 3406:           lastCommand: prompt,
 3407:           lastResponseTitle: `${specialist.title} Assist`,
 3408:           routeSuggestions: []
 3409:         };
 3410:         setSharedAiDraft(projectName, aiDraft);
 3411:         setSharedHandoff(projectName, "ai-command", {
 3412:           source_page: "media-studio",
 3413:           destination_page: "ai-command",
 3414:           linked_entity: {
 3415:             entity_type: "media_job",
 3416:             entity_id: session.formSourceId || ""
 3417:           },
 3418:           payload: {
 3419:             prompt,
 3420:             title: `${specialist.title} Assist`,
 3421:             draft_context: aiDraft,
 3422:             media: buildMediaPayload(session, session.form.status || "prompt_ready")
 3423:           },
 3424:           status: "available"
 3425:         });
 3426:         navigateTo("ai-command");
 3427:         showMessage?.(`${specialist.title} prompt opened in AI Command.`);
 3428:       }
 3429:       rerender();
 3430:     };
 3431:   });
 3432: }
 3433: 
 3434: async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
 3435:   const handoff = buildPublishingHandoff(projectName, session, selectedItem);
 3436:   const handoffScopes = new Set([asString(projectName)]);
 3437:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 3438:     handoffScopes.add("__default__");
 3439:   }
 3440:   handoffScopes.forEach((scope) => {
 3441:     setSharedHandoff(scope, "publishing", handoff);
 3442:   });
 3443: 
 3444:   if (backendProjectName && selectedItem && !selectedItem.localOnly) {
 3445:     try {
 3446:       await createProjectHandoff(backendProjectName, handoff);
 3447:       showMessage?.("Publishing package handoff prepared from Media Studio.");
 3448:     } catch (error) {
 3449:       showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
 3450:     }
 3451:   } else {
 3452:     showMessage?.("Publishing package handoff prepared locally.");
 3453:   }
 3454: 
 3455:   try {
 3456:     navigateTo("publishing");
 3457:   } catch (error) {
 3458:     showError?.(error.message || "Failed to open Publishing.");
 3459:   }
 3460: }
 3461: 
 3462: export const mediaStudioRoute = {
 3463:   id: "media-studio",
 3464:   disableStandardLayout: true,
 3465:   meta: {
 3466:     eyebrow: "Operations",
 3467:     title: "Media Studio",
 3468:     description: "Run saved image, video, voice, and campaign-pack jobs with prompts, review states, Library saves, and package routing."
 3469:   },
 3470:   template: `
 3471:     <section class="page is-active" data-page="media-studio">
 3472:       <div id="mediaStudioRoot"></div>
 3473:     </section>
 3474:   `,
 3475:   render({
 3476:     getState,
 3477:     $,
 3478:     escapeHtml,
 3479:     navigateTo,
 3480:     showMessage,
 3481:     showError
 3482:   }) {
 3483:     const state = getState();
 3484:     const projectName = getProjectName(state);
 3485:     const backendProjectName = getBackendProjectName(state);
 3486:     const root = $("mediaStudioRoot");
 3487:     if (!root) return;
 3488: 
 3489:     const session = ensureSession(projectName, state);
 3490:     const rerender = () => mediaStudioRoute.render({
 3491:       getState,
 3492:       $,
 3493:       escapeHtml,
 3494:       navigateTo,
 3495:       showMessage,
 3496:       showError
 3497:     });
 3498: 
 3499:     if (!session.loaded && !session.loading) {
 3500:       loadMediaWorkspace(projectName, backendProjectName, state, session, rerender);
 3501:     }
 3502: 
 3503:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeMediaItem(item, state, "Local draft"));
 3504:     if (!backendProjectName && localItems.length && !session.items.length) {
 3505:       session.items = localItems;
 3506:     }
 3507: 
 3508:     const selectedItem = getSelectedItem(session);
 3509:     if (selectedItem && selectedItem.id !== session.formSourceId && !session.isCreatingNew) {
 3510:       syncFormFromItem(session, selectedItem);
 3511:     }
 3512: 
 3513:     const handoff = getInboundHandoff(projectName, session);
 3514:     const metrics = getMetrics(session);
 3515:     const recommendation = buildRecommendation(metrics, handoff, selectedItem);
 3516: 
 3517: 
 3518:     // Onboarding / Next Action Guidance Panel
 3519:     function renderOnboardingPanel() {
 3520:       return `
 3521:         <section class="card media-card" id="mediaOnboardingPanel" aria-label="Media Studio Onboarding and Next Actions">
 3522:           <div class="card-head">
 3523:             <div>
 3524:               <div class="setup-kicker">Welcome to Media Studio</div>
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
```

## Focused Evidence Zones

### Imported provider/job APIs

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

### bindMediaStudio block

```js
 2620: 
 2621: function buildAiPrompt(projectName, session, selectedItem) {
 2622:   return [
 2623:     `Review this Media Studio job for ${projectName}.`,
 2624:     `Mode: ${titleCase(session.form.mode || selectedItem?.mode || "media")}`,
 2625:     `Project: ${session.form.project || selectedItem?.project || "not set"}`,
 2626:     `Campaign: ${session.form.campaign || selectedItem?.campaign || "not set"}`,
 2627:     `Product: ${session.form.product || selectedItem?.product || "not set"}`,
 2628:     `Channel: ${session.form.channel || selectedItem?.channel || "not set"}`,
 2629:     `Format: ${session.form.format || selectedItem?.format || "not set"}`,
 2630:     `Output purpose: ${session.form.outputPurpose || selectedItem?.outputPurpose || "not set"}`,
 2631:     `Prompt: ${session.form.prompt || selectedItem?.prompt || "not set"}`,
 2632:     `Review notes: ${session.form.reviewNotes || selectedItem?.reviewNotes || "none"}`
 2633:   ].join("\n");
 2634: }
 2635: 
 2636: function buildPublishingHandoff(projectName, session, selectedItem) {
 2637:   const source = selectedItem || normalizeMediaItem(buildMediaPayload(session, "publishing_ready"), { context: {} }, "Local draft");
 2638:   const version = selectedVersionEntry(session);
 2639:   const readiness = getVersionReadiness(version, session, source);
 2640:   return {
 2641:     source_page: "media-studio",
 2642:     destination_page: "publishing",
 2643:     source_role: source.owner_role || ownerRoleForMode(source.mode),
 2644:     destination_role: MEDIA_ROLE_DEFAULTS.handoffRole,
 2645:     source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 2646:     destination_service_domain: "publishing",
 2647:     linked_entity: {
 2648:       entity_type: "media_job",
 2649:       entity_id: source.id || session.formSourceId || "",
 2650:       route: "media-studio",
 2651:       label: source.title || session.form.title || "Media job"
 2652:     },
 2653:     payload: {
 2654:       project: source.project || session.form.project || projectName,
 2655:       campaign: source.campaign || session.form.campaign,
 2656:       channel: source.channel || session.form.channel,
 2657:       media_type: source.mode || session.form.mode,
 2658:       media_job_id: source.id || session.formSourceId || "",
 2659:       prompt: source.prompt || session.form.prompt,
 2660:       asset_reference: source.referenceAsset || session.form.referenceAsset,
 2661:       readiness_status: readiness.readinessStatus,
 2662:       version_id: version?.id || "",
 2663:       title: source.title || session.form.title || "Media handoff",
 2664:       selected_version: {
 2665:         version_id: version?.id || "",
 2666:         mode: version?.mode || source.mode || session.form.mode || "image",
 2667:         prompt: version?.prompt || source.prompt || session.form.prompt,
 2668:         output_payload: version?.output_payload || null,
 2669:         library_asset_reference: version?.library_asset_ref || null,
 2670:         readiness_status: readiness.readinessStatus,
 2671:         provider_status: firstText(version?.provider_status, "prompt_ready"),
 2672:         brand_checklist: readiness.checklist.map(([label, ready]) => ({ label, ready })),
 2673:         notes: firstText(version?.notes, session.form.reviewNotes, source.reviewNotes),
 2674:         timestamp: version?.timestamp || nowIso()
 2675:       },
 2676:       output: {
 2677:         title: source.title || session.form.title || "Media handoff",
 2678:         summary: source.brief || session.form.objective || version?.prompt || source.prompt || session.form.prompt,
 2679:         channel: source.channel || session.form.channel,
 2680:         product: source.product || session.form.product,
 2681:         content_item: version?.prompt || source.prompt || session.form.prompt
 2682:       }
 2683:     },
 2684:     status: "available",
 2685:     actor: "media-studio"
 2686:   };
 2687: }
 2688: 
 2689: async function persistMediaJob({ backendProjectName, projectName, state, session, status, showMessage }) {
 2690:   const localItem = saveDraftToSession(projectName, state, session, status);
 2691:   if (!backendProjectName) {
 2692:     showMessage?.("Media draft saved locally.");
 2693:     return localItem;
 2694:   }
 2695: 
 2696:   try {
 2697:     const result = await saveProjectMediaJob(backendProjectName, buildMediaPayload(session, status));
 2698:     const saved = normalizeMediaItem(result.media_job || result.item || buildMediaPayload(session, status), state);
 2699:     session.items = mergeQueueItems(session.items.filter((item) => item.id !== localItem.id), [saved]);
 2700:     session.selectedId = saved.id || localItem.id;
 2701:     session.formSourceId = session.selectedId;
 2702:     showMessage?.("Media job saved.");
 2703:     return saved;
 2704:   } catch (_) {
 2705:     showMessage?.("Backend media save unavailable; draft kept locally.");
 2706:     return localItem;
 2707:   }
 2708: }
 2709: 
 2710: function bindMediaStudio({
 2711:   projectName,
 2712:   backendProjectName,
 2713:   state,
 2714:   session,
 2715:   handoff,
 2716:   navigateTo,
 2717:   showMessage,
 2718:   showError,
 2719:   rerender
 2720: }) {
 2721:   const form = document.getElementById("mediaGeneratorForm");
 2722: 
 2723:   function selected() {
 2724:     return getSelectedItem(session);
 2725:   }
 2726: 
 2727:   function sync() {
 2728:     syncSessionForm(session, form);
 2729:   }
 2730: 
 2731:   function applyPrompt(value, message) {
 2732:     session.form.prompt = value;
 2733:     syncVersionFromForm(session);
 2734:     session.validation = {};
 2735:     session.draftMessage = message || "";
 2736:     rerender();
 2737:   }
 2738: 
 2739:   function generationApiForMode(mode) {
 2740:     if (mode === "video") return generateMediaVideoBrief;
 2741:     if (mode === "audio") return generateMediaVoiceScript;
 2742:     if (mode === "multi_format") return generateMediaCampaignPack;
 2743:     return generateMediaImage;
 2744:   }
 2745: 
 2746:   async function runGenerationAction() {
 2747:     sync();
 2748:     if (!validateGenerator(session, "save")) {
 2749:       rerender();
 2750:       return;
 2751:     }
 2752: 
 2753:     const promptUsed = clean(session.form.prompt);
 2754:     const selectedMode = session.form.mode || session.mode || "image";
 2755:     const activeRequestType = requestTypeForMode(selectedMode);
 2756:     session.form.status = "generating";
 2757:     session.validation = {};
 2758:     saveDraftToSession(projectName, state, session, "generating");
 2759:     rerender();
 2760: 
 2761:     const callApi = generationApiForMode(activeRequestType);
 2762: 
 2763:     try {
 2764:       const response = await callApi(buildGenerationRequestPayload(session));
 2765: 
 2766:       if (response && response.ok === false && response.status === "provider_not_configured") {
 2767:         session.form.status = "prompt_ready";
 2768:         appendVersion(session, {
 2769:           mode: selectedMode,
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
```

### data media action handlers

```js
 1852:         <div class="media-overview-item"><span>Ready assets</span><strong>${escapeHtml(formatCount(metrics.readyAssets))}</strong></div>
 1853:         <div class="media-overview-item"><span>Draft media jobs</span><strong>${escapeHtml(formatCount(metrics.draftJobs))}</strong></div>
 1854:         <div class="media-overview-item"><span>Needs review</span><strong>${escapeHtml(formatCount(metrics.needsReview))}</strong></div>
 1855:         <div class="media-overview-item"><span>Failed / blocked jobs</span><strong>${escapeHtml(formatCount(metrics.failed))}</strong></div>
 1856:         <div class="media-overview-item"><span>Publishing-ready handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
 1857:       </div>
 1858:     </section>
 1859:   `;
 1860: }
 1861: 
 1862: function renderRecommendation(recommendation, metrics, selectedItem, handoff, escapeHtml) {
 1863:   const chips = [
 1864:     ["Brand assets", metrics.total ? "In use" : "Needed"],
 1865:     ["Image generation", "Check API readiness"],
 1866:     ["Video", metrics.counts.generating ? "Active" : "Prompt-ready flow"],
 1867:     ["Voice", selectedItem?.mode === "voice" ? "Selected" : "Available"],
 1868:     ["Publishing", metrics.publishingReady ? "Ready" : "Prepare"],
 1869:     ["Campaign readiness", handoff ? "Workflow linked" : "Draft first"]
 1870:   ];
 1871: 
 1872:   return `
 1873:     <section class="card media-card" id="mediaRecommendation">
 1874:       <div class="card-head">
 1875:         <div>
 1876:           <div class="setup-kicker">Smart Recommendation</div>
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
```

### generate image call

```js
_No match found._
```

### generate video brief call

```js
_No match found._
```

### generate voice script call

```js
_No match found._
```

### generate campaign pack call

```js
_No match found._
```

### improve prompt call

```js
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
 2951:           return;
 2952:         }
 2953:         applyPrompt(result.improved_prompt || improvePrompt(session.form.prompt), "Prompt improved.");
 2954:       } catch (error) {
 2955:         if (isAccessKeyFailure(error)) {
 2956:           const authMessage = mediaAccessKeyMessage(error);
 2957:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2958:           applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
 2959:           return;
 2960:         }
 2961: 
 2962:         applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
 2963:       }
 2964:     };
 2965:   }
 2966: 
 2967:   const brandSafeBtn = document.getElementById("mediaBrandSafePromptBtn");
 2968:   if (brandSafeBtn) {
 2969:     brandSafeBtn.onclick = async () => {
 2970:       sync();
 2971:       if (!clean(session.form.prompt)) {
 2972:         session.validation = { ...session.validation, prompt: "Prompt is required." };
 2973:         rerender();
 2974:         return;
 2975:       }
 2976:       try {
 2977:         const result = await brandCheckMedia(buildGenerationRequestPayload(session));
 2978:         if (result && result.ok === false && result.status === "provider_not_configured") {
 2979:           applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
 2980:           return;
 2981:         }
 2982:         const safePrompt = result?.brand_check?.is_brand_safe ? session.form.prompt : makeBrandSafe(session.form.prompt);
 2983:         const message = result?.brand_check?.is_brand_safe
 2984:           ? "Prompt passed brand safety check."
 2985:           : "Prompt adjusted for brand safety.";
 2986:         applyPrompt(safePrompt, message);
 2987:       } catch (error) {
 2988:         if (isAccessKeyFailure(error)) {
 2989:           const authMessage = mediaAccessKeyMessage(error);
 2990:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2991:           applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
 2992:           return;
 2993:         }
 2994: 
 2995:         applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
 2996:       }
 2997:     };
 2998:   }
 2999: 
 3000:   const germanBtn = document.getElementById("mediaGermanPromptBtn");
 3001:   if (germanBtn) germanBtn.onclick = () => { sync(); applyPrompt(adaptGerman(session.form.prompt), "Prompt adapted for German usage."); };
 3002: 
 3003:   const imageToVideoBtn = document.getElementById("mediaImageToVideoBtn");
 3004:   if (imageToVideoBtn) imageToVideoBtn.onclick = () => { sync(); applyPrompt(convertImagePromptToVideoBrief(session.form.prompt), "Image prompt converted to video brief."); };
 3005: 
 3006:   const videoToVoiceBtn = document.getElementById("mediaVideoToVoiceBtn");
 3007:   if (videoToVoiceBtn) videoToVoiceBtn.onclick = () => { sync(); applyPrompt(convertVideoBriefToVoiceover(session.form.prompt), "Video brief converted to voiceover script."); };
 3008: 
 3009:   const allFormatsBtn = document.getElementById("mediaGenerateAllFormatsBtn");
 3010:   if (allFormatsBtn) allFormatsBtn.onclick = () => { sync(); applyPrompt(generateAllFormats(session, state), "All format briefs generated."); };
 3011: 
 3012:   const runGenerationBtn = document.getElementById("mediaRunGenerationBtn");
 3013:   if (runGenerationBtn) {
 3014:     runGenerationBtn.onclick = async () => {
 3015:       await runGenerationAction();
 3016:     };
 3017:   }
 3018: 
 3019:   const loadHandoffBtn = document.getElementById("mediaLoadHandoffBtn");
 3020:   if (loadHandoffBtn) {
 3021:     loadHandoffBtn.onclick = () => {
 3022:       const summary = extractHandoffSummary(handoff);
 3023:       session.form = {
 3024:         ...session.form,
 3025:         project: firstText(summary.project, session.form.project, projectName),
 3026:         campaign: firstText(summary.campaign, session.form.campaign),
 3027:         product: firstText(summary.product, session.form.product),
 3028:         channel: firstText(summary.channel, session.form.channel),
 3029:         objective: firstText(summary.objective, summary.brief, session.form.objective),
 3030:         prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
 3031:         title: firstText(summary.title, session.form.title)
 3032:       };
 3033:       session.loadedHandoffId = summary.id;
 3034:       session.isCreatingNew = true;
 3035:       session.selectedId = "";
 3036:       session.formSourceId = "";
 3037:       session.draftMessage = summary.sourcePage === "content-studio"
 3038:         ? "Content design brief loaded into generator."
```

### brand check call

```js
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
 2951:           return;
 2952:         }
 2953:         applyPrompt(result.improved_prompt || improvePrompt(session.form.prompt), "Prompt improved.");
 2954:       } catch (error) {
 2955:         if (isAccessKeyFailure(error)) {
 2956:           const authMessage = mediaAccessKeyMessage(error);
 2957:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2958:           applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
 2959:           return;
 2960:         }
 2961: 
 2962:         applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
 2963:       }
 2964:     };
 2965:   }
 2966: 
 2967:   const brandSafeBtn = document.getElementById("mediaBrandSafePromptBtn");
 2968:   if (brandSafeBtn) {
 2969:     brandSafeBtn.onclick = async () => {
 2970:       sync();
 2971:       if (!clean(session.form.prompt)) {
 2972:         session.validation = { ...session.validation, prompt: "Prompt is required." };
 2973:         rerender();
 2974:         return;
 2975:       }
 2976:       try {
 2977:         const result = await brandCheckMedia(buildGenerationRequestPayload(session));
 2978:         if (result && result.ok === false && result.status === "provider_not_configured") {
 2979:           applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
 2980:           return;
 2981:         }
 2982:         const safePrompt = result?.brand_check?.is_brand_safe ? session.form.prompt : makeBrandSafe(session.form.prompt);
 2983:         const message = result?.brand_check?.is_brand_safe
 2984:           ? "Prompt passed brand safety check."
 2985:           : "Prompt adjusted for brand safety.";
 2986:         applyPrompt(safePrompt, message);
 2987:       } catch (error) {
 2988:         if (isAccessKeyFailure(error)) {
 2989:           const authMessage = mediaAccessKeyMessage(error);
 2990:           showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
 2991:           applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
 2992:           return;
 2993:         }
 2994: 
 2995:         applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
 2996:       }
 2997:     };
 2998:   }
 2999: 
 3000:   const germanBtn = document.getElementById("mediaGermanPromptBtn");
 3001:   if (germanBtn) germanBtn.onclick = () => { sync(); applyPrompt(adaptGerman(session.form.prompt), "Prompt adapted for German usage."); };
 3002: 
 3003:   const imageToVideoBtn = document.getElementById("mediaImageToVideoBtn");
 3004:   if (imageToVideoBtn) imageToVideoBtn.onclick = () => { sync(); applyPrompt(convertImagePromptToVideoBrief(session.form.prompt), "Image prompt converted to video brief."); };
 3005: 
 3006:   const videoToVoiceBtn = document.getElementById("mediaVideoToVoiceBtn");
 3007:   if (videoToVoiceBtn) videoToVoiceBtn.onclick = () => { sync(); applyPrompt(convertVideoBriefToVoiceover(session.form.prompt), "Video brief converted to voiceover script."); };
 3008: 
 3009:   const allFormatsBtn = document.getElementById("mediaGenerateAllFormatsBtn");
 3010:   if (allFormatsBtn) allFormatsBtn.onclick = () => { sync(); applyPrompt(generateAllFormats(session, state), "All format briefs generated."); };
 3011: 
 3012:   const runGenerationBtn = document.getElementById("mediaRunGenerationBtn");
 3013:   if (runGenerationBtn) {
 3014:     runGenerationBtn.onclick = async () => {
 3015:       await runGenerationAction();
 3016:     };
 3017:   }
 3018: 
 3019:   const loadHandoffBtn = document.getElementById("mediaLoadHandoffBtn");
 3020:   if (loadHandoffBtn) {
 3021:     loadHandoffBtn.onclick = () => {
 3022:       const summary = extractHandoffSummary(handoff);
 3023:       session.form = {
 3024:         ...session.form,
 3025:         project: firstText(summary.project, session.form.project, projectName),
 3026:         campaign: firstText(summary.campaign, session.form.campaign),
 3027:         product: firstText(summary.product, session.form.product),
 3028:         channel: firstText(summary.channel, session.form.channel),
 3029:         objective: firstText(summary.objective, summary.brief, session.form.objective),
 3030:         prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
 3031:         title: firstText(summary.title, session.form.title)
 3032:       };
 3033:       session.loadedHandoffId = summary.id;
 3034:       session.isCreatingNew = true;
 3035:       session.selectedId = "";
 3036:       session.formSourceId = "";
 3037:       session.draftMessage = summary.sourcePage === "content-studio"
 3038:         ? "Content design brief loaded into generator."
 3039:         : "Media brief loaded into generator.";
 3040:       rerender();
 3041:     };
 3042:   }
 3043: 
 3044:   Array.from(document.querySelectorAll("[data-media-action]")).forEach((button) => {
 3045:     button.onclick = async () => {
 3046:       const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-id"));
 3047:       const action = button.getAttribute("data-media-action") || "";
 3048:       if (!item) return;
 3049:       session.selectedId = item.id;
 3050:       syncFormFromItem(session, item);
 3051: 
 3052:       if (action === "preview" || action === "edit-prompt") {
 3053:         document.getElementById(action === "preview" ? "mediaReviewPanel" : "mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 3054:         rerender();
 3055:         return;
 3056:       }
 3057: 
 3058:       if (action === "save-draft") {
 3059:         saveDraftToSession(projectName, state, session, "draft");
 3060:         showMessage?.("Media job saved as local draft.");
 3061:       }
 3062: 
 3063:       if (action === "regenerate") {
 3064:         session.form.prompt = improvePrompt(session.form.prompt);
 3065:         syncVersionFromForm(session);
 3066:         saveDraftToSession(projectName, state, session, "prompt_ready");
 3067:         showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
```

### save media job call

```js
 2607:       </div>
 2608:       <div class="media-api-grid">
 2609:         ${items.map(([label, connected]) => `
 2610:           <div class="media-api-item">
 2611:             <span>${escapeHtml(label)}</span>
 2612:             <strong>${escapeHtml(connected ? "Available" : "Not connected")}</strong>
 2613:           </div>
 2614:         `).join("")}
 2615:       </div>
 2616:       ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
 2617:     </section>
 2618:   `;
 2619: }
 2620: 
 2621: function buildAiPrompt(projectName, session, selectedItem) {
 2622:   return [
 2623:     `Review this Media Studio job for ${projectName}.`,
 2624:     `Mode: ${titleCase(session.form.mode || selectedItem?.mode || "media")}`,
 2625:     `Project: ${session.form.project || selectedItem?.project || "not set"}`,
 2626:     `Campaign: ${session.form.campaign || selectedItem?.campaign || "not set"}`,
 2627:     `Product: ${session.form.product || selectedItem?.product || "not set"}`,
 2628:     `Channel: ${session.form.channel || selectedItem?.channel || "not set"}`,
 2629:     `Format: ${session.form.format || selectedItem?.format || "not set"}`,
 2630:     `Output purpose: ${session.form.outputPurpose || selectedItem?.outputPurpose || "not set"}`,
 2631:     `Prompt: ${session.form.prompt || selectedItem?.prompt || "not set"}`,
 2632:     `Review notes: ${session.form.reviewNotes || selectedItem?.reviewNotes || "none"}`
 2633:   ].join("\n");
 2634: }
 2635: 
 2636: function buildPublishingHandoff(projectName, session, selectedItem) {
 2637:   const source = selectedItem || normalizeMediaItem(buildMediaPayload(session, "publishing_ready"), { context: {} }, "Local draft");
 2638:   const version = selectedVersionEntry(session);
 2639:   const readiness = getVersionReadiness(version, session, source);
 2640:   return {
 2641:     source_page: "media-studio",
 2642:     destination_page: "publishing",
 2643:     source_role: source.owner_role || ownerRoleForMode(source.mode),
 2644:     destination_role: MEDIA_ROLE_DEFAULTS.handoffRole,
 2645:     source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 2646:     destination_service_domain: "publishing",
 2647:     linked_entity: {
 2648:       entity_type: "media_job",
 2649:       entity_id: source.id || session.formSourceId || "",
 2650:       route: "media-studio",
 2651:       label: source.title || session.form.title || "Media job"
 2652:     },
 2653:     payload: {
 2654:       project: source.project || session.form.project || projectName,
 2655:       campaign: source.campaign || session.form.campaign,
 2656:       channel: source.channel || session.form.channel,
 2657:       media_type: source.mode || session.form.mode,
 2658:       media_job_id: source.id || session.formSourceId || "",
 2659:       prompt: source.prompt || session.form.prompt,
 2660:       asset_reference: source.referenceAsset || session.form.referenceAsset,
 2661:       readiness_status: readiness.readinessStatus,
 2662:       version_id: version?.id || "",
 2663:       title: source.title || session.form.title || "Media handoff",
 2664:       selected_version: {
 2665:         version_id: version?.id || "",
 2666:         mode: version?.mode || source.mode || session.form.mode || "image",
 2667:         prompt: version?.prompt || source.prompt || session.form.prompt,
 2668:         output_payload: version?.output_payload || null,
 2669:         library_asset_reference: version?.library_asset_ref || null,
 2670:         readiness_status: readiness.readinessStatus,
 2671:         provider_status: firstText(version?.provider_status, "prompt_ready"),
 2672:         brand_checklist: readiness.checklist.map(([label, ready]) => ({ label, ready })),
 2673:         notes: firstText(version?.notes, session.form.reviewNotes, source.reviewNotes),
 2674:         timestamp: version?.timestamp || nowIso()
 2675:       },
 2676:       output: {
 2677:         title: source.title || session.form.title || "Media handoff",
 2678:         summary: source.brief || session.form.objective || version?.prompt || source.prompt || session.form.prompt,
 2679:         channel: source.channel || session.form.channel,
 2680:         product: source.product || session.form.product,
 2681:         content_item: version?.prompt || source.prompt || session.form.prompt
 2682:       }
 2683:     },
 2684:     status: "available",
 2685:     actor: "media-studio"
 2686:   };
 2687: }
 2688: 
 2689: async function persistMediaJob({ backendProjectName, projectName, state, session, status, showMessage }) {
 2690:   const localItem = saveDraftToSession(projectName, state, session, status);
 2691:   if (!backendProjectName) {
 2692:     showMessage?.("Media draft saved locally.");
 2693:     return localItem;
 2694:   }
 2695: 
 2696:   try {
 2697:     const result = await saveProjectMediaJob(backendProjectName, buildMediaPayload(session, status));
 2698:     const saved = normalizeMediaItem(result.media_job || result.item || buildMediaPayload(session, status), state);
 2699:     session.items = mergeQueueItems(session.items.filter((item) => item.id !== localItem.id), [saved]);
 2700:     session.selectedId = saved.id || localItem.id;
 2701:     session.formSourceId = session.selectedId;
 2702:     showMessage?.("Media job saved.");
 2703:     return saved;
 2704:   } catch (_) {
 2705:     showMessage?.("Backend media save unavailable; draft kept locally.");
 2706:     return localItem;
 2707:   }
 2708: }
 2709: 
 2710: function bindMediaStudio({
 2711:   projectName,
 2712:   backendProjectName,
 2713:   state,
 2714:   session,
 2715:   handoff,
 2716:   navigateTo,
 2717:   showMessage,
 2718:   showError,
 2719:   rerender
 2720: }) {
 2721:   const form = document.getElementById("mediaGeneratorForm");
 2722: 
 2723:   function selected() {
 2724:     return getSelectedItem(session);
 2725:   }
 2726: 
 2727:   function sync() {
 2728:     syncSessionForm(session, form);
 2729:   }
 2730: 
 2731:   function applyPrompt(value, message) {
 2732:     session.form.prompt = value;
 2733:     syncVersionFromForm(session);
 2734:     session.validation = {};
 2735:     session.draftMessage = message || "";
 2736:     rerender();
 2737:   }
 2738: 
 2739:   function generationApiForMode(mode) {
 2740:     if (mode === "video") return generateMediaVideoBrief;
 2741:     if (mode === "audio") return generateMediaVoiceScript;
 2742:     if (mode === "multi_format") return generateMediaCampaignPack;
 2743:     return generateMediaImage;
 2744:   }
 2745: 
 2746:   async function runGenerationAction() {
 2747:     sync();
 2748:     if (!validateGenerator(session, "save")) {
 2749:       rerender();
 2750:       return;
 2751:     }
 2752: 
 2753:     const promptUsed = clean(session.form.prompt);
 2754:     const selectedMode = session.form.mode || session.mode || "image";
 2755:     const activeRequestType = requestTypeForMode(selectedMode);
 2756:     session.form.status = "generating";
 2757:     session.validation = {};
 2758:     saveDraftToSession(projectName, state, session, "generating");
 2759:     rerender();
 2760: 
 2761:     const callApi = generationApiForMode(activeRequestType);
 2762: 
 2763:     try {
 2764:       const response = await callApi(buildGenerationRequestPayload(session));
 2765: 
 2766:       if (response && response.ok === false && response.status === "provider_not_configured") {
 2767:         session.form.status = "prompt_ready";
 2768:         appendVersion(session, {
 2769:           mode: selectedMode,
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
```

### create approval call

```js
 3046:       const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-id"));
 3047:       const action = button.getAttribute("data-media-action") || "";
 3048:       if (!item) return;
 3049:       session.selectedId = item.id;
 3050:       syncFormFromItem(session, item);
 3051: 
 3052:       if (action === "preview" || action === "edit-prompt") {
 3053:         document.getElementById(action === "preview" ? "mediaReviewPanel" : "mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 3054:         rerender();
 3055:         return;
 3056:       }
 3057: 
 3058:       if (action === "save-draft") {
 3059:         saveDraftToSession(projectName, state, session, "draft");
 3060:         showMessage?.("Media job saved as local draft.");
 3061:       }
 3062: 
 3063:       if (action === "regenerate") {
 3064:         session.form.prompt = improvePrompt(session.form.prompt);
 3065:         syncVersionFromForm(session);
 3066:         saveDraftToSession(projectName, state, session, "prompt_ready");
 3067:         showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
 3068:       }
 3069: 
 3070:       if (action === "approve") {
 3071:         session.form.status = "approved";
 3072:         const currentVersion = selectedVersionEntry(session);
 3073:         if (currentVersion) currentVersion.readiness_status = "approved";
 3074:         syncOutputsFromVersioning(session);
 3075:         saveDraftToSession(projectName, state, session, "approved");
 3076:         showMessage?.("Media job marked review-ready locally.");
 3077:       }
 3078: 
 3079:       if (action === "send-publishing") {
 3080:         session.form.status = "sent_to_publishing";
 3081:         const currentVersion = selectedVersionEntry(session);
 3082:         if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
 3083:         syncOutputsFromVersioning(session);
 3084:         saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3085:         sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
 3086:         return;
 3087:       }
 3088:       rerender();
 3089:     };
 3090:   });
 3091: 
 3092:   const approveBtn = document.getElementById("mediaApproveBtn");
 3093:   if (approveBtn) {
 3094:     approveBtn.onclick = async () => {
 3095:       sync();
 3096:       const item = selected();
 3097:       session.form.status = "approved";
 3098:       const currentVersion = selectedVersionEntry(session);
 3099:       if (currentVersion) {
 3100:         currentVersion.readiness_status = "approved";
 3101:         currentVersion.provider_status = currentVersion.provider_status || "generated";
 3102:       }
 3103:       syncOutputsFromVersioning(session);
 3104:       saveDraftToSession(projectName, state, session, "approved");
 3105: 
 3106:       if (backendProjectName && item && !item.localOnly) {
 3107:         const pendingApproval = session.approvals.find((approval) =>
 3108:           asString(approval.entity_type) === "media_job" &&
 3109:           asString(approval.entity_id) === asString(item.id) &&
 3110:           asString(approval.status) === "pending"
 3111:         );
 3112:         if (pendingApproval) {
 3113:           try {
 3114:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3115:               decision: "approved",
 3116:               note: session.form.reviewNotes || "Marked review-ready in Media Studio.",
 3117:               actor: "media-studio"
 3118:             });
 3119:           } catch (_) {}
 3120:         }
 3121:       }
 3122:       showMessage?.("Media review state recorded.");
 3123:       rerender();
 3124:     };
 3125:   }
 3126: 
 3127:   const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
 3128:   if (requestApprovalBtn) {
 3129:     requestApprovalBtn.onclick = async () => {
 3130:       sync();
 3131:       const item = selected() || saveDraftToSession(projectName, state, session, "needs_review");
 3132:       saveDraftToSession(projectName, state, session, "needs_review");
 3133: 
 3134:       if (backendProjectName && item && !item.localOnly) {
 3135:         try {
 3136:           await createProjectApproval(backendProjectName, {
 3137:             title: `Review ${item.title || session.form.title || "media job"}`,
 3138:             entity_type: "media_job",
 3139:             entity_id: item.id,
 3140:             summary: session.form.reviewNotes || "Review media output before publishing handoff.",
 3141:             reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
 3142:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3143:             requested_by: "media-studio",
 3144:             linked_entity: {
 3145:               entity_type: "media_job",
 3146:               entity_id: item.id,
 3147:               route: "media-studio",
 3148:               label: item.title || session.form.title || "Media job"
 3149:             },
 3150:             actor: "media-studio"
 3151:           });
 3152:           showMessage?.("Review request created.");
 3153:         } catch (_) {
 3154:           showMessage?.("Review request kept as local review state.");
 3155:         }
 3156:       } else {
 3157:         showMessage?.("Media draft moved to needs review locally.");
 3158:       }
 3159:       rerender();
 3160:     };
 3161:   }
 3162: 
 3163:   const rejectBtn = document.getElementById("mediaRejectBtn");
 3164:   if (rejectBtn) {
 3165:     rejectBtn.onclick = async () => {
 3166:       sync();
 3167:       const item = selected();
 3168:       session.form.status = "draft";
 3169:       const currentVersion = selectedVersionEntry(session);
 3170:       if (currentVersion) currentVersion.readiness_status = "draft";
 3171:       syncOutputsFromVersioning(session);
 3172:       saveDraftToSession(projectName, state, session, "draft");
 3173: 
 3174:       if (backendProjectName && item && !item.localOnly) {
 3175:         const pendingApproval = session.approvals.find((approval) =>
 3176:           asString(approval.entity_type) === "media_job" &&
 3177:           asString(approval.entity_id) === asString(item.id) &&
 3178:           asString(approval.status) === "pending"
 3179:         );
 3180:         if (pendingApproval) {
 3181:           try {
 3182:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3183:               decision: "rejected",
 3184:               note: session.form.reviewNotes || "Revision requested in Media Studio.",
 3185:               actor: "media-studio"
 3186:             });
 3187:           } catch (_) {}
 3188:         }
 3189:       }
 3190:       showMessage?.("Media job returned to draft for revision.");
 3191:       rerender();
 3192:     };
 3193:   }
 3194: 
 3195:   const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
 3196:   if (createTaskBtn) {
 3197:     createTaskBtn.onclick = async () => {
 3198:       sync();
 3199:       const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
 3200:       if (backendProjectName && item && !item.localOnly) {
 3201:         try {
 3202:           await createProjectTask(backendProjectName, {
 3203:             title: `Complete media job ${item.title || session.form.title || "media job"}`,
 3204:             description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
 3205:             owner_role: item.owner_role || ownerRoleForMode(item.mode),
 3206:             assignee_role: item.owner_role || ownerRoleForMode(item.mode),
 3207:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3208:             responsibility: item.mode === "video" ? "video_production" : "creative_production",
 3209:             handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
 3210:             source_page: "media-studio",
 3211:             route_target: "media-studio",
 3212:             linked_entity: {
 3213:               entity_type: "media_job",
 3214:               entity_id: item.id,
 3215:               route: "media-studio",
 3216:               label: item.title || session.form.title || "Media job"
 3217:             },
 3218:             actor: "media-studio"
 3219:           });
 3220:           showMessage?.("Task created and linked to the media job.");
 3221:         } catch (_) {
 3222:           showMessage?.("Task action kept locally because backend task save is unavailable.");
 3223:         }
 3224:       } else {
 3225:         showMessage?.("Create Task needs a backend media job; local draft is preserved.");
 3226:       }
```

### decide approval call

```js
 3024:         ...session.form,
 3025:         project: firstText(summary.project, session.form.project, projectName),
 3026:         campaign: firstText(summary.campaign, session.form.campaign),
 3027:         product: firstText(summary.product, session.form.product),
 3028:         channel: firstText(summary.channel, session.form.channel),
 3029:         objective: firstText(summary.objective, summary.brief, session.form.objective),
 3030:         prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
 3031:         title: firstText(summary.title, session.form.title)
 3032:       };
 3033:       session.loadedHandoffId = summary.id;
 3034:       session.isCreatingNew = true;
 3035:       session.selectedId = "";
 3036:       session.formSourceId = "";
 3037:       session.draftMessage = summary.sourcePage === "content-studio"
 3038:         ? "Content design brief loaded into generator."
 3039:         : "Media brief loaded into generator.";
 3040:       rerender();
 3041:     };
 3042:   }
 3043: 
 3044:   Array.from(document.querySelectorAll("[data-media-action]")).forEach((button) => {
 3045:     button.onclick = async () => {
 3046:       const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-id"));
 3047:       const action = button.getAttribute("data-media-action") || "";
 3048:       if (!item) return;
 3049:       session.selectedId = item.id;
 3050:       syncFormFromItem(session, item);
 3051: 
 3052:       if (action === "preview" || action === "edit-prompt") {
 3053:         document.getElementById(action === "preview" ? "mediaReviewPanel" : "mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
 3054:         rerender();
 3055:         return;
 3056:       }
 3057: 
 3058:       if (action === "save-draft") {
 3059:         saveDraftToSession(projectName, state, session, "draft");
 3060:         showMessage?.("Media job saved as local draft.");
 3061:       }
 3062: 
 3063:       if (action === "regenerate") {
 3064:         session.form.prompt = improvePrompt(session.form.prompt);
 3065:         syncVersionFromForm(session);
 3066:         saveDraftToSession(projectName, state, session, "prompt_ready");
 3067:         showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
 3068:       }
 3069: 
 3070:       if (action === "approve") {
 3071:         session.form.status = "approved";
 3072:         const currentVersion = selectedVersionEntry(session);
 3073:         if (currentVersion) currentVersion.readiness_status = "approved";
 3074:         syncOutputsFromVersioning(session);
 3075:         saveDraftToSession(projectName, state, session, "approved");
 3076:         showMessage?.("Media job marked review-ready locally.");
 3077:       }
 3078: 
 3079:       if (action === "send-publishing") {
 3080:         session.form.status = "sent_to_publishing";
 3081:         const currentVersion = selectedVersionEntry(session);
 3082:         if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
 3083:         syncOutputsFromVersioning(session);
 3084:         saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3085:         sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
 3086:         return;
 3087:       }
 3088:       rerender();
 3089:     };
 3090:   });
 3091: 
 3092:   const approveBtn = document.getElementById("mediaApproveBtn");
 3093:   if (approveBtn) {
 3094:     approveBtn.onclick = async () => {
 3095:       sync();
 3096:       const item = selected();
 3097:       session.form.status = "approved";
 3098:       const currentVersion = selectedVersionEntry(session);
 3099:       if (currentVersion) {
 3100:         currentVersion.readiness_status = "approved";
 3101:         currentVersion.provider_status = currentVersion.provider_status || "generated";
 3102:       }
 3103:       syncOutputsFromVersioning(session);
 3104:       saveDraftToSession(projectName, state, session, "approved");
 3105: 
 3106:       if (backendProjectName && item && !item.localOnly) {
 3107:         const pendingApproval = session.approvals.find((approval) =>
 3108:           asString(approval.entity_type) === "media_job" &&
 3109:           asString(approval.entity_id) === asString(item.id) &&
 3110:           asString(approval.status) === "pending"
 3111:         );
 3112:         if (pendingApproval) {
 3113:           try {
 3114:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3115:               decision: "approved",
 3116:               note: session.form.reviewNotes || "Marked review-ready in Media Studio.",
 3117:               actor: "media-studio"
 3118:             });
 3119:           } catch (_) {}
 3120:         }
 3121:       }
 3122:       showMessage?.("Media review state recorded.");
 3123:       rerender();
 3124:     };
 3125:   }
 3126: 
 3127:   const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
 3128:   if (requestApprovalBtn) {
 3129:     requestApprovalBtn.onclick = async () => {
 3130:       sync();
 3131:       const item = selected() || saveDraftToSession(projectName, state, session, "needs_review");
 3132:       saveDraftToSession(projectName, state, session, "needs_review");
 3133: 
 3134:       if (backendProjectName && item && !item.localOnly) {
 3135:         try {
 3136:           await createProjectApproval(backendProjectName, {
 3137:             title: `Review ${item.title || session.form.title || "media job"}`,
 3138:             entity_type: "media_job",
 3139:             entity_id: item.id,
 3140:             summary: session.form.reviewNotes || "Review media output before publishing handoff.",
 3141:             reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
 3142:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3143:             requested_by: "media-studio",
 3144:             linked_entity: {
 3145:               entity_type: "media_job",
 3146:               entity_id: item.id,
 3147:               route: "media-studio",
 3148:               label: item.title || session.form.title || "Media job"
 3149:             },
 3150:             actor: "media-studio"
 3151:           });
 3152:           showMessage?.("Review request created.");
 3153:         } catch (_) {
 3154:           showMessage?.("Review request kept as local review state.");
 3155:         }
 3156:       } else {
 3157:         showMessage?.("Media draft moved to needs review locally.");
 3158:       }
 3159:       rerender();
 3160:     };
 3161:   }
 3162: 
 3163:   const rejectBtn = document.getElementById("mediaRejectBtn");
 3164:   if (rejectBtn) {
 3165:     rejectBtn.onclick = async () => {
 3166:       sync();
 3167:       const item = selected();
 3168:       session.form.status = "draft";
 3169:       const currentVersion = selectedVersionEntry(session);
 3170:       if (currentVersion) currentVersion.readiness_status = "draft";
 3171:       syncOutputsFromVersioning(session);
 3172:       saveDraftToSession(projectName, state, session, "draft");
 3173: 
 3174:       if (backendProjectName && item && !item.localOnly) {
 3175:         const pendingApproval = session.approvals.find((approval) =>
 3176:           asString(approval.entity_type) === "media_job" &&
 3177:           asString(approval.entity_id) === asString(item.id) &&
 3178:           asString(approval.status) === "pending"
 3179:         );
 3180:         if (pendingApproval) {
 3181:           try {
 3182:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3183:               decision: "rejected",
 3184:               note: session.form.reviewNotes || "Revision requested in Media Studio.",
 3185:               actor: "media-studio"
 3186:             });
 3187:           } catch (_) {}
 3188:         }
 3189:       }
 3190:       showMessage?.("Media job returned to draft for revision.");
 3191:       rerender();
 3192:     };
 3193:   }
 3194: 
 3195:   const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
 3196:   if (createTaskBtn) {
 3197:     createTaskBtn.onclick = async () => {
 3198:       sync();
 3199:       const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
 3200:       if (backendProjectName && item && !item.localOnly) {
 3201:         try {
 3202:           await createProjectTask(backendProjectName, {
 3203:             title: `Complete media job ${item.title || session.form.title || "media job"}`,
 3204:             description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
```

### create handoff call

```js
 1004: }
 1005: 
 1006: function findExistingLibrarySave(session, projectName, sourceSignature) {
 1007:   const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(sourceSignature));
 1008:   const backend = asArray(session.handoffs).find((entry) => {
 1009:     const payload = asObject(entry?.payload);
 1010:     const libraryAsset = asObject(payload.library_asset);
 1011:     const routeMatches = asString(entry?.destination_page) === "library" && asString(entry?.source_page) === "media-studio";
 1012:     return routeMatches && asString(libraryAsset.source_signature) === asString(sourceSignature);
 1013:   });
 1014:   return {
 1015:     local: local || null,
 1016:     backend: backend || null
 1017:   };
 1018: }
 1019: 
 1020: async function saveVersionToLibrary({
 1021:   projectName,
 1022:   backendProjectName,
 1023:   state,
 1024:   session,
 1025:   selectedItem,
 1026:   showMessage,
 1027:   rerender
 1028: }) {
 1029:   const version = selectedVersionEntry(session);
 1030:   if (!version) {
 1031:     session.validation = { ...session.validation, librarySave: "Select a version before saving to Library." };
 1032:     rerender();
 1033:     return;
 1034:   }
 1035: 
 1036:   const payload = asObject(version.output_payload);
 1037:   const hasPrompt = Boolean(clean(version.prompt || session.form.prompt));
 1038:   const hasPayload = Object.keys(payload).length > 0;
 1039:   if (!hasPrompt && !hasPayload) {
 1040:     session.validation = { ...session.validation, librarySave: "Version needs prompt or output payload before saving to Library." };
 1041:     rerender();
 1042:     return;
 1043:   }
 1044: 
 1045:   const libraryAsset = buildLibraryAssetPayload(projectName, session, selectedItem, version);
 1046:   const existing = findExistingLibrarySave(session, projectName, libraryAsset.source_signature);
 1047:   const allowBackendWrite = Boolean(backendProjectName);
 1048: 
 1049:   if (!allowBackendWrite && existing.local) {
 1050:     showMessage?.("Already saved to Library (local reference).");
 1051:     return;
 1052:   }
 1053: 
 1054:   const handoffPayload = {
 1055:     id: asString(existing.backend?.id || ""),
 1056:     source_page: "media-studio",
 1057:     destination_page: "library",
 1058:     source_role: selectedItem?.owner_role || ownerRoleForMode(session.form.mode || session.mode || "image"),
 1059:     destination_role: MEDIA_ROLE_DEFAULTS.reviewRole,
 1060:     source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 1061:     destination_service_domain: "library",
 1062:     linked_entity: {
 1063:       entity_type: "media_job",
 1064:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1065:       route: "media-studio",
 1066:       label: firstText(selectedItem?.title, session.form.title, "Media output")
 1067:     },
 1068:     payload: {
 1069:       project: libraryAsset.project,
 1070:       campaign: libraryAsset.campaign,
 1071:       media_type: libraryAsset.media_type,
 1072:       usage: libraryAsset.usage,
 1073:       library_asset: libraryAsset
 1074:     },
 1075:     status: "available",
 1076:     actor: "media-studio"
 1077:   };
 1078: 
 1079:   setSharedHandoff(projectName || "__default__", "library", handoffPayload);
 1080:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1081:     setSharedHandoff("__default__", "library", handoffPayload);
 1082:   }
 1083: 
 1084:   let reference = {
 1085:     handoff_id: asString(existing.backend?.id || existing.local?.handoff_id || ""),
 1086:     source_signature: libraryAsset.source_signature,
 1087:     local_only: true,
 1088:     saved_at: nowIso(),
 1089:     status: "saved_to_library"
 1090:   };
 1091: 
 1092:   if (allowBackendWrite) {
 1093:     try {
 1094:       const result = await createProjectHandoff(backendProjectName, handoffPayload);
 1095:       const savedHandoff = asObject(result?.handoff);
 1096:       const savedId = asString(savedHandoff.id || handoffPayload.id);
 1097:       upsertLocalLibraryAsset(projectName, {
 1098:         ...libraryAsset,
 1099:         id: savedId || libraryAsset.id,
 1100:         handoff_id: savedId,
 1101:         local_only: false,
 1102:         source: "media-studio"
 1103:       });
 1104:       reference = {
 1105:         handoff_id: savedId,
 1106:         source_signature: libraryAsset.source_signature,
 1107:         local_only: false,
 1108:         saved_at: nowIso(),
 1109:         status: "saved_to_library"
 1110:       };
 1111:       session.handoffs = [savedHandoff, ...asArray(session.handoffs).filter((item) => asString(item.id) !== savedId)];
 1112:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Selected version saved to Library.");
 1113:     } catch (_) {
 1114:       upsertLocalLibraryAsset(projectName, {
 1115:         ...libraryAsset,
 1116:         id: libraryAsset.id,
 1117:         local_only: true,
 1118:         source: "media-studio"
 1119:       });
 1120:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1121:     }
 1122:   } else {
 1123:     upsertLocalLibraryAsset(projectName, {
 1124:       ...libraryAsset,
 1125:       id: libraryAsset.id,
 1126:       local_only: true,
 1127:       source: "media-studio"
 1128:     });
 1129:     showMessage?.("Selected version saved to Library (local handoff).");
 1130:   }
 1131: 
 1132:   version.library_asset_ref = reference;
 1133:   version.provider_status = "saved_to_library";
 1134:   if (["draft", "prompt_ready"].includes(normalizeStatus(version.readiness_status || "draft", "draft"))) {
 1135:     version.readiness_status = "publishing_ready";
 1136:     session.form.status = "publishing_ready";
 1137:   }
 1138:   session.validation = { ...session.validation, librarySave: "" };
 1139:   syncOutputsFromVersioning(session);
 1140:   saveDraftToSession(projectName, state, session, normalizeStatus(session.form.status || version.readiness_status || "publishing_ready", "publishing_ready"));
 1141: }
 1142: 
 1143: function syncOutputsFromVersioning(session) {
 1144:   const versioning = ensureVersioning(session);
 1145:   session.generationOutputs = asArray(versioning.versions).map((version) => ({
 1146:     label: `${titleCase(version.id)} ${titleCase(version.mode)}`,
 1147:     summary: JSON.stringify({
 1148:       mode: version.mode,
 1149:       provider_status: version.provider_status,
 1150:       readiness_status: version.readiness_status,
 1151:       output_payload: version.output_payload
 1152:     }),
 1153:     provider: version.provider || "",
 1154:     model: version.model || "",
 1155:     payload: version.output_payload || null,
 1156:     created_at: version.timestamp || nowIso()
 1157:   }));
 1158: }
 1159: 
 1160: function saveDraftToSession(projectName, state, session, status = "prompt_ready") {
 1161:   syncOutputsFromVersioning(session);
 1162:   const saved = saveLocalDraft(projectName, buildMediaPayload(session, status));
 1163:   const item = normalizeMediaItem(saved, state, "Local draft");
 1164:   session.items = mergeQueueItems(session.items.filter((entry) => entry.id !== item.id), [item]);
 1165:   session.selectedId = item.id;
 1166:   session.formSourceId = item.id;
 1167:   session.isCreatingNew = false;
 1168:   session.draftMessage = "Media draft saved locally.";
 1169:   return item;
 1170: }
 1171: 
 1172: function getMetrics(session) {
 1173:   const counts = MEDIA_STATUSES.reduce((acc, status) => {
 1174:     acc[status] = session.items.filter((item) => item.status === status).length;
 1175:     return acc;
 1176:   }, {});
 1177:   return {
 1178:     total: session.items.length,
 1179:     readyAssets: counts.approved + counts.publishing_ready + counts.sent_to_publishing,
 1180:     draftJobs: counts.draft + counts.prompt_ready,
 1181:     needsReview: counts.needs_review,
 1182:     failed: counts.failed,
 1183:     publishingReady: counts.publishing_ready,
 1184:     counts
```

### create task call

```js
 3112:         if (pendingApproval) {
 3113:           try {
 3114:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3115:               decision: "approved",
 3116:               note: session.form.reviewNotes || "Marked review-ready in Media Studio.",
 3117:               actor: "media-studio"
 3118:             });
 3119:           } catch (_) {}
 3120:         }
 3121:       }
 3122:       showMessage?.("Media review state recorded.");
 3123:       rerender();
 3124:     };
 3125:   }
 3126: 
 3127:   const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
 3128:   if (requestApprovalBtn) {
 3129:     requestApprovalBtn.onclick = async () => {
 3130:       sync();
 3131:       const item = selected() || saveDraftToSession(projectName, state, session, "needs_review");
 3132:       saveDraftToSession(projectName, state, session, "needs_review");
 3133: 
 3134:       if (backendProjectName && item && !item.localOnly) {
 3135:         try {
 3136:           await createProjectApproval(backendProjectName, {
 3137:             title: `Review ${item.title || session.form.title || "media job"}`,
 3138:             entity_type: "media_job",
 3139:             entity_id: item.id,
 3140:             summary: session.form.reviewNotes || "Review media output before publishing handoff.",
 3141:             reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
 3142:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3143:             requested_by: "media-studio",
 3144:             linked_entity: {
 3145:               entity_type: "media_job",
 3146:               entity_id: item.id,
 3147:               route: "media-studio",
 3148:               label: item.title || session.form.title || "Media job"
 3149:             },
 3150:             actor: "media-studio"
 3151:           });
 3152:           showMessage?.("Review request created.");
 3153:         } catch (_) {
 3154:           showMessage?.("Review request kept as local review state.");
 3155:         }
 3156:       } else {
 3157:         showMessage?.("Media draft moved to needs review locally.");
 3158:       }
 3159:       rerender();
 3160:     };
 3161:   }
 3162: 
 3163:   const rejectBtn = document.getElementById("mediaRejectBtn");
 3164:   if (rejectBtn) {
 3165:     rejectBtn.onclick = async () => {
 3166:       sync();
 3167:       const item = selected();
 3168:       session.form.status = "draft";
 3169:       const currentVersion = selectedVersionEntry(session);
 3170:       if (currentVersion) currentVersion.readiness_status = "draft";
 3171:       syncOutputsFromVersioning(session);
 3172:       saveDraftToSession(projectName, state, session, "draft");
 3173: 
 3174:       if (backendProjectName && item && !item.localOnly) {
 3175:         const pendingApproval = session.approvals.find((approval) =>
 3176:           asString(approval.entity_type) === "media_job" &&
 3177:           asString(approval.entity_id) === asString(item.id) &&
 3178:           asString(approval.status) === "pending"
 3179:         );
 3180:         if (pendingApproval) {
 3181:           try {
 3182:             await decideProjectApproval(backendProjectName, pendingApproval.id, {
 3183:               decision: "rejected",
 3184:               note: session.form.reviewNotes || "Revision requested in Media Studio.",
 3185:               actor: "media-studio"
 3186:             });
 3187:           } catch (_) {}
 3188:         }
 3189:       }
 3190:       showMessage?.("Media job returned to draft for revision.");
 3191:       rerender();
 3192:     };
 3193:   }
 3194: 
 3195:   const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
 3196:   if (createTaskBtn) {
 3197:     createTaskBtn.onclick = async () => {
 3198:       sync();
 3199:       const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
 3200:       if (backendProjectName && item && !item.localOnly) {
 3201:         try {
 3202:           await createProjectTask(backendProjectName, {
 3203:             title: `Complete media job ${item.title || session.form.title || "media job"}`,
 3204:             description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
 3205:             owner_role: item.owner_role || ownerRoleForMode(item.mode),
 3206:             assignee_role: item.owner_role || ownerRoleForMode(item.mode),
 3207:             service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
 3208:             responsibility: item.mode === "video" ? "video_production" : "creative_production",
 3209:             handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
 3210:             source_page: "media-studio",
 3211:             route_target: "media-studio",
 3212:             linked_entity: {
 3213:               entity_type: "media_job",
 3214:               entity_id: item.id,
 3215:               route: "media-studio",
 3216:               label: item.title || session.form.title || "Media job"
 3217:             },
 3218:             actor: "media-studio"
 3219:           });
 3220:           showMessage?.("Task created and linked to the media job.");
 3221:         } catch (_) {
 3222:           showMessage?.("Task action kept locally because backend task save is unavailable.");
 3223:         }
 3224:       } else {
 3225:         showMessage?.("Create Task needs a backend media job; local draft is preserved.");
 3226:       }
 3227:       rerender();
 3228:     };
 3229:   }
 3230: 
 3231:   const sendAiBtn = document.getElementById("mediaSendAiCommandBtn");
 3232:   if (sendAiBtn) {
 3233:     sendAiBtn.onclick = () => {
 3234:       sync();
 3235:       const item = selected();
 3236:       const prompt = buildAiPrompt(projectName, session, item);
 3237:       const aiDraft = {
 3238:         projectName,
 3239:         modeId: "media",
 3240:         lastCommand: prompt,
 3241:         lastResponseTitle: item?.title || session.form.title || "Media Studio Review",
 3242:         routeSuggestions: []
 3243:       };
 3244:       setSharedAiDraft(projectName, aiDraft);
 3245:       setSharedHandoff(projectName, "ai-command", {
 3246:         source_page: "media-studio",
 3247:         destination_page: "ai-command",
 3248:         linked_entity: {
 3249:           entity_type: "media_job",
 3250:           entity_id: item?.id || session.formSourceId || ""
 3251:         },
 3252:         payload: {
 3253:           prompt,
 3254:           media_job_id: item?.id || session.formSourceId || "",
 3255:           title: item?.title || session.form.title || "",
 3256:           draft_context: aiDraft,
 3257:           media: buildMediaPayload(session, item?.status || "prompt_ready")
 3258:         },
 3259:         status: "available"
 3260:       });
 3261:       navigateTo("ai-command");
 3262:       showMessage?.("Media context sent to AI Command.");
 3263:     };
 3264:   }
 3265: 
 3266:   const sendPublishingBtn = document.getElementById("mediaSendToPublishingBtn");
 3267:   if (sendPublishingBtn) {
 3268:     sendPublishingBtn.onclick = () => {
 3269:       sync();
 3270:       session.form.status = "sent_to_publishing";
 3271:       const currentVersion = selectedVersionEntry(session);
 3272:       if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
 3273:       syncOutputsFromVersioning(session);
 3274:       saveDraftToSession(projectName, state, session, "sent_to_publishing");
 3275:       sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
 3276:     };
 3277:   }
 3278: 
 3279:   const headerSaveLibraryBtn = document.getElementById("mediaHeaderSaveLibraryBtn");
 3280:   if (headerSaveLibraryBtn) {
 3281:     headerSaveLibraryBtn.onclick = async () => {
 3282:       sync();
 3283:       await saveVersionToLibrary({
 3284:         projectName,
 3285:         backendProjectName,
 3286:         state,
 3287:         session,
 3288:         selectedItem: selected(),
 3289:         showMessage,
 3290:         rerender
 3291:       });
 3292:       rerender();
```

### confirmation gates

```js
_No match found._
```

### governance/approval route

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

### publishing route/handoff

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

### localStorage write/read

```js
_No match found._
```

### file/object URL signals

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

### error handling

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
```


## Verdict

| Area | Verdict |
|---|---|
| Provider generation/prep calls | Found: improveMediaPrompt, brandCheckMedia |
| Mutating backend calls | Found: saveProjectMediaJob, createProjectApproval, decideProjectApproval, createProjectHandoff, createProjectTask |
| Confirmation gates | Not found |
| Local storage writes | Not found |
| File input/upload signals | Found - focused file safety proof may be required |
| Object URL lifecycle | Not found |
| Governance route/handoff | Review needed |
| Publishing route/handoff | Found |

## Decision Guidance
- If provider generation APIs are user-triggered without confirmation, add a minimal confirmation gate before generation/provider-backed actions.
- If approval decisions are possible without confirmation, patch immediately.
- If handoff/task creation is review-only and backend-owned, confirmation may be optional unless it mutates durable workflow state.
- If localStorage is draft-only, no patch may be needed.
- If object URLs are created without revocation, patch preview lifecycle.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
