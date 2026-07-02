# AI Team Phase 4.2 — Real Action Map Audit

## Purpose
Terminal-only audit to confirm every visible AI Team button/tool has a clear action target before final UX polish.

## Current desired UX model
- Composer is the main input.
- Chat shows the conversation and may provide follow-up actions.
- Preview shows structured draft output.
- Tools prepare draft/preview/handoff only.
- Route Draft navigates or prepares routing; it does not publish or execute.
- Browser Voice is browser dictation/readback, not full realtime voice chat.
- Attachments are not live unless connected to Library/Media input.

## Files inspected
- public/control-center/pages/ai-command.js


## Ask Specialist handler

### Around line 3010
```js
3005: 						<strong>${escapeHtml(action.label)}</strong>
3006: 					</button>
3007: 				`).join("")}
3008: 			</div>
3009: 			<div class="aicmd-v2-action-row">
3010: 				<button id="aicmdV2AskBtn" class="aicmd-v2-btn-primary" type="button">
3011: 					Ask Specialist
3012: 				</button>
3013: 				<button id="aicmdV2PrepareBtn" class="aicmd-v2-btn-secondary" type="button">
3014: 					Preview
3015: 				</button>
```

### Around line 3631
```js
3626: 			};
3627: 
3628: 			input.onkeydown = (event) => {
3629: 				if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
3630: 					event.preventDefault();
3631: 					$("aicmdV2AskBtn")?.click?.();
3632: 				}
3633: 			};
3634: 		}
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
```

### Around line 3676
```js
3671: 				}
3672: 			};
3673: 		}
3674: 
3675: 		// ── ASK SPECIALIST (Phase 3 response bridge) ────────────────
3676: 		const askBtn = $("aicmdV2AskBtn");
3677: 		if (askBtn) {
3678: 			askBtn.onclick = async () => {
3679: 				const value = asString(input?.value || session.draftMessage || "").trim();
3680: 				if (!value) {
3681: 					updateStatus("Please write your request in the composer first.");
```

### Around line 3678
```js
3673: 		}
3674: 
3675: 		// ── ASK SPECIALIST (Phase 3 response bridge) ────────────────
3676: 		const askBtn = $("aicmdV2AskBtn");
3677: 		if (askBtn) {
3678: 			askBtn.onclick = async () => {
3679: 				const value = asString(input?.value || session.draftMessage || "").trim();
3680: 				if (!value) {
3681: 					updateStatus("Please write your request in the composer first.");
3682: 					input?.focus?.();
3683: 					return;
```

### Around line 3804
```js
3799: 
3800: 		// ── DRAFT TASK (secondary action) ────────────────────────────
3801: 		// Phase 1: prefills a task-framed version of the prompt. No backend execution.
3802: 		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
3803: 		if (draftTaskBtn) {
3804: 			draftTaskBtn.onclick = () => {
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
```

## Preview Draft handler

### Around line 3013
```js
3008: 			</div>
3009: 			<div class="aicmd-v2-action-row">
3010: 				<button id="aicmdV2AskBtn" class="aicmd-v2-btn-primary" type="button">
3011: 					Ask Specialist
3012: 				</button>
3013: 				<button id="aicmdV2PrepareBtn" class="aicmd-v2-btn-secondary" type="button">
3014: 					Preview
3015: 				</button>
3016: 				<button id="aicmdV2DraftTaskBtn" class="aicmd-v2-btn-secondary" type="button">
3017: 					Task
3018: 				</button>
```

### Around line 3212
```js
3207: 			`}
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
```

### Around line 3790
```js
3785: 			};
3786: 		}
3787: 
3788: 		// ── PREPARE GUIDANCE (primary action) ───────────────────────
3789: 		// Phase 1: stages draft locally, does NOT execute backend AI command.
3790: 		const prepareBtn = $("aicmdV2PrepareBtn");
3791: 		if (prepareBtn) {
3792: 			prepareBtn.onclick = () => {
3793: 				const preview = setPreviewFromIntent("guidance", "", { switchTab: "preview" });
3794: 				if (!preview) return;
3795: 				const specLabel = session.teamMode === "team" ? "Team" : getPhase1SpecialistById(session.modeId).label;
```

## Task Draft handler

### Around line 3016
```js
3011: 					Ask Specialist
3012: 				</button>
3013: 				<button id="aicmdV2PrepareBtn" class="aicmd-v2-btn-secondary" type="button">
3014: 					Preview
3015: 				</button>
3016: 				<button id="aicmdV2DraftTaskBtn" class="aicmd-v2-btn-secondary" type="button">
3017: 					Task
3018: 				</button>
3019: 				<button id="aicmdV2DraftWorkflowBtn" class="aicmd-v2-btn-secondary" type="button">
3020: 					Workflow
3021: 				</button>
```

### Around line 3802
```js
3797: 			};
3798: 		}
3799: 
3800: 		// ── DRAFT TASK (secondary action) ────────────────────────────
3801: 		// Phase 1: prefills a task-framed version of the prompt. No backend execution.
3802: 		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
3803: 		if (draftTaskBtn) {
3804: 			draftTaskBtn.onclick = () => {
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
```

### Around line 3803
```js
3798: 		}
3799: 
3800: 		// ── DRAFT TASK (secondary action) ────────────────────────────
3801: 		// Phase 1: prefills a task-framed version of the prompt. No backend execution.
3802: 		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
3803: 		if (draftTaskBtn) {
3804: 			draftTaskBtn.onclick = () => {
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
```

### Around line 3804
```js
3799: 
3800: 		// ── DRAFT TASK (secondary action) ────────────────────────────
3801: 		// Phase 1: prefills a task-framed version of the prompt. No backend execution.
3802: 		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
3803: 		if (draftTaskBtn) {
3804: 			draftTaskBtn.onclick = () => {
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
```

### Around line 3807
```js
3802: 		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
3803: 		if (draftTaskBtn) {
3804: 			draftTaskBtn.onclick = () => {
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
3810: 				if (input) input.value = taskPrompt;
3811: 				setAiComposerValue(session, input, taskPrompt);
3812: 				setPreviewFromIntent("task", taskPrompt, { switchTab: "preview" });
```

### Around line 3810
```js
3805: 				const value = asString(input?.value || session.draftMessage || "").trim();
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
3810: 				if (input) input.value = taskPrompt;
3811: 				setAiComposerValue(session, input, taskPrompt);
3812: 				setPreviewFromIntent("task", taskPrompt, { switchTab: "preview" });
3813: 				updateStatus("Task draft preview prepared locally. Review before creating durable tasks.");
3814: 				showMessage?.("Task draft preview prepared.");
3815: 			};
```

### Around line 3811
```js
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
3810: 				if (input) input.value = taskPrompt;
3811: 				setAiComposerValue(session, input, taskPrompt);
3812: 				setPreviewFromIntent("task", taskPrompt, { switchTab: "preview" });
3813: 				updateStatus("Task draft preview prepared locally. Review before creating durable tasks.");
3814: 				showMessage?.("Task draft preview prepared.");
3815: 			};
3816: 		}
```

### Around line 3812
```js
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
3810: 				if (input) input.value = taskPrompt;
3811: 				setAiComposerValue(session, input, taskPrompt);
3812: 				setPreviewFromIntent("task", taskPrompt, { switchTab: "preview" });
3813: 				updateStatus("Task draft preview prepared locally. Review before creating durable tasks.");
3814: 				showMessage?.("Task draft preview prepared.");
3815: 			};
3816: 		}
3817: 
```

## Workflow Draft handler

### Around line 3019
```js
3014: 					Preview
3015: 				</button>
3016: 				<button id="aicmdV2DraftTaskBtn" class="aicmd-v2-btn-secondary" type="button">
3017: 					Task
3018: 				</button>
3019: 				<button id="aicmdV2DraftWorkflowBtn" class="aicmd-v2-btn-secondary" type="button">
3020: 					Workflow
3021: 				</button>
3022: 				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
3023: 					Handoff
3024: 				</button>
```

### Around line 3819
```js
3814: 				showMessage?.("Task draft preview prepared.");
3815: 			};
3816: 		}
3817: 
3818: 		// ── DRAFT WORKFLOW (secondary action) ────────────────────────
3819: 		const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
3820: 		if (draftWorkflowBtn) {
3821: 			draftWorkflowBtn.onclick = () => {
3822: 				const value = asString(input?.value || session.draftMessage || "").trim();
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
```

### Around line 3820
```js
3815: 			};
3816: 		}
3817: 
3818: 		// ── DRAFT WORKFLOW (secondary action) ────────────────────────
3819: 		const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
3820: 		if (draftWorkflowBtn) {
3821: 			draftWorkflowBtn.onclick = () => {
3822: 				const value = asString(input?.value || session.draftMessage || "").trim();
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
```

### Around line 3821
```js
3816: 		}
3817: 
3818: 		// ── DRAFT WORKFLOW (secondary action) ────────────────────────
3819: 		const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
3820: 		if (draftWorkflowBtn) {
3821: 			draftWorkflowBtn.onclick = () => {
3822: 				const value = asString(input?.value || session.draftMessage || "").trim();
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
```

### Around line 3824
```js
3819: 		const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
3820: 		if (draftWorkflowBtn) {
3821: 			draftWorkflowBtn.onclick = () => {
3822: 				const value = asString(input?.value || session.draftMessage || "").trim();
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
3827: 				if (input) input.value = workflowPrompt;
3828: 				setAiComposerValue(session, input, workflowPrompt);
3829: 				setPreviewFromIntent("workflow", workflowPrompt, { switchTab: "preview" });
```

### Around line 3827
```js
3822: 				const value = asString(input?.value || session.draftMessage || "").trim();
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
3827: 				if (input) input.value = workflowPrompt;
3828: 				setAiComposerValue(session, input, workflowPrompt);
3829: 				setPreviewFromIntent("workflow", workflowPrompt, { switchTab: "preview" });
3830: 				updateStatus("Workflow draft preview prepared locally. No workflow run started.");
3831: 				showMessage?.("Workflow draft preview prepared.");
3832: 			};
```

### Around line 3828
```js
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
3827: 				if (input) input.value = workflowPrompt;
3828: 				setAiComposerValue(session, input, workflowPrompt);
3829: 				setPreviewFromIntent("workflow", workflowPrompt, { switchTab: "preview" });
3830: 				updateStatus("Workflow draft preview prepared locally. No workflow run started.");
3831: 				showMessage?.("Workflow draft preview prepared.");
3832: 			};
3833: 		}
```

### Around line 3829
```js
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
3827: 				if (input) input.value = workflowPrompt;
3828: 				setAiComposerValue(session, input, workflowPrompt);
3829: 				setPreviewFromIntent("workflow", workflowPrompt, { switchTab: "preview" });
3830: 				updateStatus("Workflow draft preview prepared locally. No workflow run started.");
3831: 				showMessage?.("Workflow draft preview prepared.");
3832: 			};
3833: 		}
3834: 
```

## Handoff Draft handler

### Around line 3022
```js
3017: 					Task
3018: 				</button>
3019: 				<button id="aicmdV2DraftWorkflowBtn" class="aicmd-v2-btn-secondary" type="button">
3020: 					Workflow
3021: 				</button>
3022: 				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
3023: 					Handoff
3024: 				</button>
3025: 				<button id="aicmdV2VoiceBtn" class="aicmd-v2-btn-secondary" type="button">
3026: 					Browser Voice
3027: 				</button>
```

### Around line 3837
```js
3832: 			};
3833: 		}
3834: 
3835: 		// ── PREPARE HANDOFF (secondary action) ───────────────────────
3836: 		// Phase 1: frames a handoff prompt in the composer. No backend write.
3837: 		const handoffBtn = $("aicmdV2HandoffBtn");
3838: 		if (handoffBtn) {
3839: 			handoffBtn.onclick = () => {
3840: 				const value = asString(input?.value || session.draftMessage || "").trim();
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
```

### Around line 3839
```js
3834: 
3835: 		// ── PREPARE HANDOFF (secondary action) ───────────────────────
3836: 		// Phase 1: frames a handoff prompt in the composer. No backend write.
3837: 		const handoffBtn = $("aicmdV2HandoffBtn");
3838: 		if (handoffBtn) {
3839: 			handoffBtn.onclick = () => {
3840: 				const value = asString(input?.value || session.draftMessage || "").trim();
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
```

### Around line 3842
```js
3837: 		const handoffBtn = $("aicmdV2HandoffBtn");
3838: 		if (handoffBtn) {
3839: 			handoffBtn.onclick = () => {
3840: 				const value = asString(input?.value || session.draftMessage || "").trim();
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
3845: 				if (input) input.value = handoffPrompt;
3846: 				setAiComposerValue(session, input, handoffPrompt);
3847: 				setPreviewFromIntent("handoff", handoffPrompt, { switchTab: "preview" });
```

### Around line 3845
```js
3840: 				const value = asString(input?.value || session.draftMessage || "").trim();
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
3845: 				if (input) input.value = handoffPrompt;
3846: 				setAiComposerValue(session, input, handoffPrompt);
3847: 				setPreviewFromIntent("handoff", handoffPrompt, { switchTab: "preview" });
3848: 				updateStatus("Handoff preview prepared locally. Review destination before sending.");
3849: 				showMessage?.("Handoff preview prepared.");
3850: 			};
```

### Around line 3846
```js
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
3845: 				if (input) input.value = handoffPrompt;
3846: 				setAiComposerValue(session, input, handoffPrompt);
3847: 				setPreviewFromIntent("handoff", handoffPrompt, { switchTab: "preview" });
3848: 				updateStatus("Handoff preview prepared locally. Review destination before sending.");
3849: 				showMessage?.("Handoff preview prepared.");
3850: 			};
3851: 		}
```

### Around line 3847
```js
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
3845: 				if (input) input.value = handoffPrompt;
3846: 				setAiComposerValue(session, input, handoffPrompt);
3847: 				setPreviewFromIntent("handoff", handoffPrompt, { switchTab: "preview" });
3848: 				updateStatus("Handoff preview prepared locally. Review destination before sending.");
3849: 				showMessage?.("Handoff preview prepared.");
3850: 			};
3851: 		}
3852: 
```

## Browser Voice handler

### Around line 3025
```js
3020: 					Workflow
3021: 				</button>
3022: 				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
3023: 					Handoff
3024: 				</button>
3025: 				<button id="aicmdV2VoiceBtn" class="aicmd-v2-btn-secondary" type="button">
3026: 					Browser Voice
3027: 				</button>
3028: 				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
3029: 					Save
3030: 				</button>
```

### Around line 3026
```js
3021: 				</button>
3022: 				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
3023: 					Handoff
3024: 				</button>
3025: 				<button id="aicmdV2VoiceBtn" class="aicmd-v2-btn-secondary" type="button">
3026: 					Browser Voice
3027: 				</button>
3028: 				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
3029: 					Save
3030: 				</button>
3031: 				<button id="aicmdV2ClearBtn" class="aicmd-v2-btn-ghost" type="button">
```

### Around line 3150
```js
3145: 				<li><span>Image prompt generation</span><strong class="${providerConfigured ? "is-available" : "is-planned"}">${escapeHtml(providerConfigured ? "Provider configured" : "Needs provider connection")}</strong></li>
3146: 				<li><span>Video brief / script draft</span><strong class="is-draft-ready">Draft-ready — no generation executed</strong></li>
3147: 				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
3148: 				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
3149: 				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
3150: 				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
3151: 				<li><span>Team chat execution bridge</span><strong class="is-planned">Planned — requires backend bridge</strong></li>
3152: 				<li><span>Realtime voice chat</span><strong class="is-planned">Future — needs provider + bridge</strong></li>
3153: 			</ul>
3154: 		</section>
3155: 	`;
```

### Around line 3636
```js
3631: 					$("aicmdV2AskBtn")?.click?.();
3632: 				}
3633: 			};
3634: 		}
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
```

### Around line 3638
```js
3633: 			};
3634: 		}
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
```

### Around line 3639
```js
3634: 		}
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
```

### Around line 3640
```js
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
```

### Around line 3642
```js
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
3646: 				}
3647: 
```

### Around line 3649
```js
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
3646: 				}
3647: 
3648: 				try {
3649: 					const recognition = new SpeechRecognitionCtor();
3650: 					recognition.lang = "ar";
3651: 					recognition.interimResults = false;
3652: 					recognition.maxAlternatives = 1;
3653: 					recognition.onresult = (event) => {
3654: 						const transcript = asString(event?.results?.[0]?.[0]?.transcript || "").trim();
```

## Save handler

### Around line 3028
```js
3023: 					Handoff
3024: 				</button>
3025: 				<button id="aicmdV2VoiceBtn" class="aicmd-v2-btn-secondary" type="button">
3026: 					Browser Voice
3027: 				</button>
3028: 				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
3029: 					Save
3030: 				</button>
3031: 				<button id="aicmdV2ClearBtn" class="aicmd-v2-btn-ghost" type="button">
3032: 					Clear
3033: 				</button>
```

### Around line 3895
```js
3890: 				showMessage?.(`${tool.label} prepared as local preview.`);
3891: 			};
3892: 		});
3893: 
3894: 		// ── SAVE DRAFT ───────────────────────────────────────────────
3895: 		const saveBtn = $("aicmdV2SaveBtn");
3896: 		if (saveBtn) {
3897: 			saveBtn.onclick = () => {
3898: 				session.draftMessage = asString(input?.value || session.draftMessage || "");
3899: 				persistSessionDraft(sessionKey, session, "Draft saved locally");
3900: 				updateStatus("Composer draft saved locally.");
```

### Around line 3897
```js
3892: 		});
3893: 
3894: 		// ── SAVE DRAFT ───────────────────────────────────────────────
3895: 		const saveBtn = $("aicmdV2SaveBtn");
3896: 		if (saveBtn) {
3897: 			saveBtn.onclick = () => {
3898: 				session.draftMessage = asString(input?.value || session.draftMessage || "");
3899: 				persistSessionDraft(sessionKey, session, "Draft saved locally");
3900: 				updateStatus("Composer draft saved locally.");
3901: 				showMessage?.("Composer draft saved locally.");
3902: 			};
```

## Clear handler

### Around line 3031
```js
3026: 					Browser Voice
3027: 				</button>
3028: 				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
3029: 					Save
3030: 				</button>
3031: 				<button id="aicmdV2ClearBtn" class="aicmd-v2-btn-ghost" type="button">
3032: 					Clear
3033: 				</button>
3034: 			</div>
3035: 			<div id="aicmdV2Status" class="aicmd-v2-composer-hint"></div>
3036: 		</div>
```

### Around line 3906
```js
3901: 				showMessage?.("Composer draft saved locally.");
3902: 			};
3903: 		}
3904: 
3905: 		// ── CLEAR ────────────────────────────────────────────────────
3906: 		const clearBtn = $("aicmdV2ClearBtn");
3907: 		if (clearBtn) {
3908: 			clearBtn.onclick = () => {
3909: 				session.draftMessage = "";
3910: 				if (input) input.value = "";
3911: 				persistSessionDraft(sessionKey, session, "Draft cleared");
```

### Around line 3908
```js
3903: 		}
3904: 
3905: 		// ── CLEAR ────────────────────────────────────────────────────
3906: 		const clearBtn = $("aicmdV2ClearBtn");
3907: 		if (clearBtn) {
3908: 			clearBtn.onclick = () => {
3909: 				session.draftMessage = "";
3910: 				if (input) input.value = "";
3911: 				persistSessionDraft(sessionKey, session, "Draft cleared");
3912: 				updateStatus("Composer draft cleared.");
3913: 				showMessage?.("Composer draft cleared.");
```

## Tool click handlers

### Around line 2354
```js
2349: 					${QUICK_ACTIONS.map((action) => `
2350: 						<button
2351: 							class="ctrl-prompt-btn"
2352: 							type="button"
2353: 							data-ctrl-quick="${escapeHtml(action.action)}"
2354: 							data-ctrl-quick-template="${escapeHtml(action.template.replace("{project}", projectLabel))}"
2355: 						>
2356: 							<span class="ctrl-prompt-icon">${action.icon}</span>
2357: 							<span>
2358: 								<span class="ctrl-prompt-label">${escapeHtml(action.label)}</span>
2359: 								<span class="ctrl-prompt-sub">${escapeHtml(action.sub)}</span>
```

### Around line 2925
```js
2920: 						: `${titleCase(tool.intent || "guidance")} preview`;
2921: 					return `
2922: 						<button
2923: 							type="button"
2924: 							class="aicmd-v2-tool-btn"
2925: 							data-aicmdv2-tool="${escapeHtml(tool.id)}"
2926: 						>
2927: 							<span class="aicmd-v2-tool-label">${escapeHtml(tool.label)}</span>
2928: 							<span class="aicmd-v2-tool-meta">${escapeHtml(actionLabel)}</span>
2929: 						</button>
2930: 					`;
```

### Around line 3002
```js
2997: 				${QUICK_ACTIONS.map((action, index) => `
2998: 					<button
2999: 						class="aicmd-v2-quick-btn"
3000: 						type="button"
3001: 						data-aicmdv2-quick="${index}"
3002: 						data-aicmdv2-quick-template="${escapeHtml(action.template.replace("{project}", projectLabel))}"
3003: 					>
3004: 						<span>${action.icon}</span>
3005: 						<strong>${escapeHtml(action.label)}</strong>
3006: 					</button>
3007: 				`).join("")}
```

### Around line 3611
```js
3606: 			};
3607: 		});
3608: 
3609: 		Array.from(document.querySelectorAll("[data-aicmdv2-quick]")).forEach((btn) => {
3610: 			btn.onclick = () => {
3611: 				const text = asString(btn.getAttribute("data-aicmdv2-quick-template") || "");
3612: 				if (!text) return;
3613: 				session.draftMessage = text;
3614: 				if (input) input.value = text;
3615: 				persistSessionDraft(sessionKey, session, "Quick action loaded");
3616: 				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
```

### Around line 3853
```js
3848: 				updateStatus("Handoff preview prepared locally. Review destination before sending.");
3849: 				showMessage?.("Handoff preview prepared.");
3850: 			};
3851: 		}
3852: 
3853: 		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
3854: 		toolButtons.forEach((btn) => {
3855: 			btn.onclick = () => {
3856: 				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
3857: 				if (!toolId) return;
3858: 
```

### Around line 3856
```js
3851: 		}
3852: 
3853: 		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
3854: 		toolButtons.forEach((btn) => {
3855: 			btn.onclick = () => {
3856: 				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
3857: 				if (!toolId) return;
3858: 
3859: 				const tool = getPhase35ToolSet(session).find((entry) => entry.id === toolId);
3860: 				if (!tool) return;
3861: 
```

### Around line 3869
```js
3864: 					showMessage?.(`Opening ${routeLabel(destination)}.`);
3865: 					navigateTo(destination);
3866: 					return;
3867: 				}
3868: 
3869: 				const preparedPrompt = applyTokenTemplate(tool.template, {
3870: 					projectName,
3871: 					specialistLabel: session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label,
3872: 					campaign: aiContext.campaign
3873: 				});
3874: 
```

## Suggested prompt handlers

### Around line 3236
```js
3231: 			<div class="aicmd-v2-prompts-grid">
3232: 				${prompts.map((p, idx) => `
3233: 					<button
3234: 						class="aicmd-v2-prompt-chip"
3235: 						type="button"
3236: 						data-aicmdv2-prompt="${idx}"
3237: 						data-aicmdv2-prompt-text="${escapeHtml(p.label)}"
3238: 					>
3239: 						<span class="aicmd-v2-prompt-chip-label">${escapeHtml(p.label)}</span>
3240: 						<span class="aicmd-v2-prompt-chip-sub">${escapeHtml(p.sub)}</span>
3241: 					</button>
```

### Around line 3237
```js
3232: 				${prompts.map((p, idx) => `
3233: 					<button
3234: 						class="aicmd-v2-prompt-chip"
3235: 						type="button"
3236: 						data-aicmdv2-prompt="${idx}"
3237: 						data-aicmdv2-prompt-text="${escapeHtml(p.label)}"
3238: 					>
3239: 						<span class="aicmd-v2-prompt-chip-label">${escapeHtml(p.label)}</span>
3240: 						<span class="aicmd-v2-prompt-chip-sub">${escapeHtml(p.sub)}</span>
3241: 					</button>
3242: 				`).join("")}
```

### Around line 3597
```js
3592: 				aiCommandRoute.render(context);
3593: 			};
3594: 		});
3595: 
3596: 		// ── SUGGESTED PROMPTS: PREFILL ONLY ─────────────────────────
3597: 		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
3598: 			btn.onclick = () => {
3599: 				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
3600: 				if (!text) return;
3601: 				session.draftMessage = text;
3602: 				if (input) input.value = text;
```

### Around line 3599
```js
3594: 		});
3595: 
3596: 		// ── SUGGESTED PROMPTS: PREFILL ONLY ─────────────────────────
3597: 		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
3598: 			btn.onclick = () => {
3599: 				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
3600: 				if (!text) return;
3601: 				session.draftMessage = text;
3602: 				if (input) input.value = text;
3603: 				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
3604: 				updateStatus("Suggested prompt loaded into composer. Review it, then use Prepare Guidance.");
```

## Response copy/use/preview/route/read

### Around line 3210
```js
3205: 			` : `
3206: 				<div class="aicmd-v2-chat-empty">${escapeHtml(emptyBody)}</div>
3207: 			`}
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
```

### Around line 3211
```js
3206: 				<div class="aicmd-v2-chat-empty">${escapeHtml(emptyBody)}</div>
3207: 			`}
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
```

### Around line 3212
```js
3207: 			`}
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
```

### Around line 3213
```js
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
3218: 	`;
```

### Around line 3215
```js
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
3218: 	`;
3219: }
3220: 
```

### Around line 3920
```js
3915: 		}
3916: 
3917: 		// ── RESPONSE ACTIONS (Phase 3 safe actions) ──────────────────
3918: 		const latestResponse = asArray(session.responseHistory)[0] || null;
3919: 
3920: 		const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
3921: 		if (responseCopyBtn) {
3922: 			responseCopyBtn.onclick = async () => {
3923: 				if (!latestResponse?.responseText) return;
3924: 				try {
3925: 					if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
```

### Around line 3921
```js
3916: 
3917: 		// ── RESPONSE ACTIONS (Phase 3 safe actions) ──────────────────
3918: 		const latestResponse = asArray(session.responseHistory)[0] || null;
3919: 
3920: 		const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
3921: 		if (responseCopyBtn) {
3922: 			responseCopyBtn.onclick = async () => {
3923: 				if (!latestResponse?.responseText) return;
3924: 				try {
3925: 					if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
3926: 						await navigator.clipboard.writeText(latestResponse.responseText);
```

### Around line 3922
```js
3917: 		// ── RESPONSE ACTIONS (Phase 3 safe actions) ──────────────────
3918: 		const latestResponse = asArray(session.responseHistory)[0] || null;
3919: 
3920: 		const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
3921: 		if (responseCopyBtn) {
3922: 			responseCopyBtn.onclick = async () => {
3923: 				if (!latestResponse?.responseText) return;
3924: 				try {
3925: 					if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
3926: 						await navigator.clipboard.writeText(latestResponse.responseText);
3927: 						updateStatus("Response copied to clipboard.");
```

### Around line 3936
```js
3931: 					updateStatus("Copy failed. Clipboard access may be blocked.");
3932: 				}
3933: 			};
3934: 		}
3935: 
3936: 		const responseUseBtn = $("aicmdV3ResponseUseBtn");
3937: 		if (responseUseBtn) {
3938: 			responseUseBtn.onclick = () => {
3939: 				if (!latestResponse?.responseText) return;
3940: 				setAiComposerValue(session, input, latestResponse.responseText);
3941: 				if (input) {
```

### Around line 3937
```js
3932: 				}
3933: 			};
3934: 		}
3935: 
3936: 		const responseUseBtn = $("aicmdV3ResponseUseBtn");
3937: 		if (responseUseBtn) {
3938: 			responseUseBtn.onclick = () => {
3939: 				if (!latestResponse?.responseText) return;
3940: 				setAiComposerValue(session, input, latestResponse.responseText);
3941: 				if (input) {
3942: 					input.value = latestResponse.responseText;
```

### Around line 3938
```js
3933: 			};
3934: 		}
3935: 
3936: 		const responseUseBtn = $("aicmdV3ResponseUseBtn");
3937: 		if (responseUseBtn) {
3938: 			responseUseBtn.onclick = () => {
3939: 				if (!latestResponse?.responseText) return;
3940: 				setAiComposerValue(session, input, latestResponse.responseText);
3941: 				if (input) {
3942: 					input.value = latestResponse.responseText;
3943: 					input.focus();
```

### Around line 3965
```js
3960: 				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
3961: 				showMessage?.("Response saved locally.");
3962: 			};
3963: 		}
3964: 
3965: 		const responseConvertBtn = $("aicmdV3ResponseConvertBtn");
3966: 		if (responseConvertBtn) {
3967: 			responseConvertBtn.onclick = () => {
3968: 				if (!latestResponse) return;
3969: 				const preview = buildPhase2OutputPreview({
3970: 					intent: "guidance",
```

### Around line 3966
```js
3961: 				showMessage?.("Response saved locally.");
3962: 			};
3963: 		}
3964: 
3965: 		const responseConvertBtn = $("aicmdV3ResponseConvertBtn");
3966: 		if (responseConvertBtn) {
3967: 			responseConvertBtn.onclick = () => {
3968: 				if (!latestResponse) return;
3969: 				const preview = buildPhase2OutputPreview({
3970: 					intent: "guidance",
3971: 					session,
```

### Around line 3967
```js
3962: 			};
3963: 		}
3964: 
3965: 		const responseConvertBtn = $("aicmdV3ResponseConvertBtn");
3966: 		if (responseConvertBtn) {
3967: 			responseConvertBtn.onclick = () => {
3968: 				if (!latestResponse) return;
3969: 				const preview = buildPhase2OutputPreview({
3970: 					intent: "guidance",
3971: 					session,
3972: 					prompt: latestResponse.prompt,
```

### Around line 3996
```js
3991: 				aiCommandRoute.render(context);
3992: 				showMessage?.("Generated response converted to preview.");
3993: 			};
3994: 		}
3995: 
3996: 		const responseSendBtn = $("aicmdV3ResponseSendBtn");
3997: 		if (responseSendBtn) {
3998: 			responseSendBtn.onclick = () => {
3999: 				if (!latestResponse) return;
4000: 				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4001: 				const draftContext = {
```

### Around line 3997
```js
3992: 				showMessage?.("Generated response converted to preview.");
3993: 			};
3994: 		}
3995: 
3996: 		const responseSendBtn = $("aicmdV3ResponseSendBtn");
3997: 		if (responseSendBtn) {
3998: 			responseSendBtn.onclick = () => {
3999: 				if (!latestResponse) return;
4000: 				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4001: 				const draftContext = {
4002: 					projectName: projectName || "",
```

### Around line 3998
```js
3993: 			};
3994: 		}
3995: 
3996: 		const responseSendBtn = $("aicmdV3ResponseSendBtn");
3997: 		if (responseSendBtn) {
3998: 			responseSendBtn.onclick = () => {
3999: 				if (!latestResponse) return;
4000: 				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4001: 				const draftContext = {
4002: 					projectName: projectName || "",
4003: 					modeId: latestResponse.specialistId || session.modeId,
```

### Around line 4030
```js
4025: 				showMessage?.("Response context prepared. Review before saving or executing.");
4026: 				navigateTo(destination);
4027: 			};
4028: 		}
4029: 
4030: 		const responseReadBtn = $("aicmdV3ResponseReadBtn");
4031: 		if (responseReadBtn) {
4032: 			responseReadBtn.onclick = () => {
4033: 				if (!latestResponse?.responseText) return;
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
```

### Around line 4031
```js
4026: 				navigateTo(destination);
4027: 			};
4028: 		}
4029: 
4030: 		const responseReadBtn = $("aicmdV3ResponseReadBtn");
4031: 		if (responseReadBtn) {
4032: 			responseReadBtn.onclick = () => {
4033: 				if (!latestResponse?.responseText) return;
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
```

### Around line 4032
```js
4027: 			};
4028: 		}
4029: 
4030: 		const responseReadBtn = $("aicmdV3ResponseReadBtn");
4031: 		if (responseReadBtn) {
4032: 			responseReadBtn.onclick = () => {
4033: 				if (!latestResponse?.responseText) return;
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
4037: 				}
```

## Preview copy/use/route/read

### Around line 3120
```js
3115: 					<p class="aicmd-v2-preview-safety">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
3116: 				</div>
3117: 			</div>
3118: 
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
```

### Around line 3121
```js
3116: 				</div>
3117: 			</div>
3118: 
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
3126: 			</div>
```

### Around line 3122
```js
3117: 			</div>
3118: 
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
3126: 			</div>
3127: 		</section>
```

### Around line 3124
```js
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
3126: 			</div>
3127: 		</section>
3128: 	`;
3129: }
```

### Around line 4046
```js
4041: 				updateStatus("Reading response locally in browser.");
4042: 			};
4043: 		}
4044: 
4045: 		// ── PREVIEW ACTIONS (Phase 2 safe actions) ───────────────────
4046: 		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
4047: 		if (previewCopyBtn) {
4048: 			previewCopyBtn.onclick = async () => {
4049: 				const output = asObject(session.outputPreview);
4050: 				if (!output.outputType) return;
4051: 				const specialistLabel = session.teamMode === "team"
```

### Around line 4047
```js
4042: 			};
4043: 		}
4044: 
4045: 		// ── PREVIEW ACTIONS (Phase 2 safe actions) ───────────────────
4046: 		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
4047: 		if (previewCopyBtn) {
4048: 			previewCopyBtn.onclick = async () => {
4049: 				const output = asObject(session.outputPreview);
4050: 				if (!output.outputType) return;
4051: 				const specialistLabel = session.teamMode === "team"
4052: 					? "Full Team"
```

### Around line 4048
```js
4043: 		}
4044: 
4045: 		// ── PREVIEW ACTIONS (Phase 2 safe actions) ───────────────────
4046: 		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
4047: 		if (previewCopyBtn) {
4048: 			previewCopyBtn.onclick = async () => {
4049: 				const output = asObject(session.outputPreview);
4050: 				if (!output.outputType) return;
4051: 				const specialistLabel = session.teamMode === "team"
4052: 					? "Full Team"
4053: 					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
```

### Around line 4070
```js
4065: 					updateStatus("Copy failed. Clipboard access may be blocked.");
4066: 				}
4067: 			};
4068: 		}
4069: 
4070: 		const previewUseBtn = $("aicmdV2PreviewUseBtn");
4071: 		if (previewUseBtn) {
4072: 			previewUseBtn.onclick = () => {
4073: 				const output = asObject(session.outputPreview);
4074: 				if (!output.outputType) return;
4075: 				const specialistLabel = session.teamMode === "team"
```

### Around line 4071
```js
4066: 				}
4067: 			};
4068: 		}
4069: 
4070: 		const previewUseBtn = $("aicmdV2PreviewUseBtn");
4071: 		if (previewUseBtn) {
4072: 			previewUseBtn.onclick = () => {
4073: 				const output = asObject(session.outputPreview);
4074: 				if (!output.outputType) return;
4075: 				const specialistLabel = session.teamMode === "team"
4076: 					? "Full Team"
```

### Around line 4072
```js
4067: 			};
4068: 		}
4069: 
4070: 		const previewUseBtn = $("aicmdV2PreviewUseBtn");
4071: 		if (previewUseBtn) {
4072: 			previewUseBtn.onclick = () => {
4073: 				const output = asObject(session.outputPreview);
4074: 				if (!output.outputType) return;
4075: 				const specialistLabel = session.teamMode === "team"
4076: 					? "Full Team"
4077: 					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
```

### Around line 4089
```js
4084: 				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
4085: 				updateStatus("Preview inserted into composer for refinement.");
4086: 			};
4087: 		}
4088: 
4089: 		const previewSendBtn = $("aicmdV2PreviewSendBtn");
4090: 		if (previewSendBtn) {
4091: 			previewSendBtn.onclick = () => {
4092: 				const output = asObject(session.outputPreview);
4093: 				const destination = asString(output.destinationRoute || "").trim();
4094: 				if (!destination) {
```

### Around line 4090
```js
4085: 				updateStatus("Preview inserted into composer for refinement.");
4086: 			};
4087: 		}
4088: 
4089: 		const previewSendBtn = $("aicmdV2PreviewSendBtn");
4090: 		if (previewSendBtn) {
4091: 			previewSendBtn.onclick = () => {
4092: 				const output = asObject(session.outputPreview);
4093: 				const destination = asString(output.destinationRoute || "").trim();
4094: 				if (!destination) {
4095: 					updateStatus("No destination route is available for this preview.");
```

### Around line 4091
```js
4086: 			};
4087: 		}
4088: 
4089: 		const previewSendBtn = $("aicmdV2PreviewSendBtn");
4090: 		if (previewSendBtn) {
4091: 			previewSendBtn.onclick = () => {
4092: 				const output = asObject(session.outputPreview);
4093: 				const destination = asString(output.destinationRoute || "").trim();
4094: 				if (!destination) {
4095: 					updateStatus("No destination route is available for this preview.");
4096: 					return;
```

### Around line 4140
```js
4135: 				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
4136: 				showMessage?.("Preview saved locally.");
4137: 			};
4138: 		}
4139: 
4140: 		const previewReadBtn = $("aicmdV2PreviewReadBtn");
4141: 		if (previewReadBtn) {
4142: 			previewReadBtn.onclick = () => {
4143: 				const output = asObject(session.outputPreview);
4144: 				if (!output.outputType) return;
4145: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
```

### Around line 4141
```js
4136: 				showMessage?.("Preview saved locally.");
4137: 			};
4138: 		}
4139: 
4140: 		const previewReadBtn = $("aicmdV2PreviewReadBtn");
4141: 		if (previewReadBtn) {
4142: 			previewReadBtn.onclick = () => {
4143: 				const output = asObject(session.outputPreview);
4144: 				if (!output.outputType) return;
4145: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4146: 					updateStatus("Read preview is not supported in this browser.");
```

### Around line 4142
```js
4137: 			};
4138: 		}
4139: 
4140: 		const previewReadBtn = $("aicmdV2PreviewReadBtn");
4141: 		if (previewReadBtn) {
4142: 			previewReadBtn.onclick = () => {
4143: 				const output = asObject(session.outputPreview);
4144: 				if (!output.outputType) return;
4145: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4146: 					updateStatus("Read preview is not supported in this browser.");
4147: 					return;
```

## Composer assignment direct

### Around line 733
```js
728: }
729: 
730: 
731: function setAiComposerValue(session, input, value) {
732:   const cleanValue = normalizeAiComposerPrompt(value);
733:   session.draftMessage = cleanValue;
734:   if (input) {
735:     input.value = cleanValue;
736:     input.focus?.();
737:   }
738:   return cleanValue;
```

### Around line 921
```js
916: }
917: 
918: function hydrateSessionDraft(projectName, session) {
919: 	if (session.localDraftLoaded) return;
920: 	const localDraft = loadLocalDraft(projectName);
921: 	if (localDraft.prompt) session.draftMessage = asString(localDraft.prompt);
922: 	if (localDraft.modeId) session.modeId = asString(localDraft.modeId);
923: 	if (localDraft.commandType) session.commandType = asString(localDraft.commandType);
924: 	if (localDraft.targetType) session.targetType = asString(localDraft.targetType);
925: 	if (localDraft.targetValue) session.targetValue = asString(localDraft.targetValue);
926: 	if (localDraft.prompt || localDraft.updatedAt) {
```

### Around line 2029
```js
2024: 
2025: 	const payload = asObject(handoff?.payload);
2026: 	const draftContext = asObject(payload.draft_context);
2027: 	const prompt = asString(payload.prompt);
2028: 	if (draftContext.modeId) session.modeId = draftContext.modeId;
2029: 	if (prompt) session.draftMessage = prompt;
2030: 
2031: 	if (draftContext.projectName || prompt) {
2032: 		setSharedAiDraft(projectName, {
2033: 			projectName,
2034: 			modeId: draftContext.modeId || session.modeId,
```

### Around line 2133
```js
2128: 		source,
2129: 		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
2130: 		failed: asString(response.status).toLowerCase() === "failed"
2131: 	});
2132: 	session.history = session.history.slice(0, 14);
2133: 	session.draftMessage = "";
2134: 
2135: 	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
2136: 	await reloadProjectData?.(projectName);
2137: 	return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };
2138: }
```

### Around line 3516
```js
3511: 				updateStatus("Please write your request in the composer first.");
3512: 				input?.focus?.();
3513: 				return null;
3514: 			}
3515: 
3516: 			session.draftMessage = value;
3517: 			session.outputPreview = buildPhase2OutputPreview({
3518: 				intent,
3519: 				session,
3520: 				prompt: value,
3521: 				projectName
```

### Around line 3534
```js
3529: 		};
3530: 
3531: 		const newSessionBtn = $("aicmdV2NewSessionBtn");
3532: 		if (newSessionBtn) {
3533: 			newSessionBtn.onclick = () => {
3534: 				session.draftMessage = "";
3535: 				session.draftStatus = "New session started";
3536: 				session.outputPreview = null;
3537: 				session.responseHistory = [];
3538: 				session.responseError = "";
3539: 				session.responseLoading = false;
```

### Around line 3579
```js
3574: 				const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";
3575: 				session.modeId = specId;
3576: 				session.teamMode = "solo";
3577: 				const spec = getPhase1SpecialistById(specId);
3578: 				if (!session.draftMessage) {
3579: 					session.draftMessage = "";
3580: 				}
3581: 				persistSessionDraft(sessionKey, session, `${spec.label} selected`);
3582: 				aiCommandRoute.render(context);
3583: 			};
3584: 		});
```

### Around line 3601
```js
3596: 		// ── SUGGESTED PROMPTS: PREFILL ONLY ─────────────────────────
3597: 		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
3598: 			btn.onclick = () => {
3599: 				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
3600: 				if (!text) return;
3601: 				session.draftMessage = text;
3602: 				if (input) input.value = text;
3603: 				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
3604: 				updateStatus("Suggested prompt loaded into composer. Review it, then use Prepare Guidance.");
3605: 				input?.focus?.();
3606: 			};
```

### Around line 3613
```js
3608: 
3609: 		Array.from(document.querySelectorAll("[data-aicmdv2-quick]")).forEach((btn) => {
3610: 			btn.onclick = () => {
3611: 				const text = asString(btn.getAttribute("data-aicmdv2-quick-template") || "");
3612: 				if (!text) return;
3613: 				session.draftMessage = text;
3614: 				if (input) input.value = text;
3615: 				persistSessionDraft(sessionKey, session, "Quick action loaded");
3616: 				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
3617: 				input?.focus?.();
3618: 			};
```

### Around line 3624
```js
3619: 		});
3620: 
3621: 		// ── INPUT HANDLING ───────────────────────────────────────────
3622: 		if (input) {
3623: 			input.oninput = () => {
3624: 				session.draftMessage = input.value || "";
3625: 				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
3626: 			};
3627: 
3628: 			input.onkeydown = (event) => {
3629: 				if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
```

### Around line 3686
```js
3681: 					updateStatus("Please write your request in the composer first.");
3682: 					input?.focus?.();
3683: 					return;
3684: 				}
3685: 
3686: 				session.draftMessage = value;
3687: 				session.responseError = "";
3688: 
3689: 				if (!responseBridge.available) {
3690: 					session.responseLoading = false;
3691: 					session.responseError = responseBridge.reason;
```

### Around line 3898
```js
3893: 
3894: 		// ── SAVE DRAFT ───────────────────────────────────────────────
3895: 		const saveBtn = $("aicmdV2SaveBtn");
3896: 		if (saveBtn) {
3897: 			saveBtn.onclick = () => {
3898: 				session.draftMessage = asString(input?.value || session.draftMessage || "");
3899: 				persistSessionDraft(sessionKey, session, "Draft saved locally");
3900: 				updateStatus("Composer draft saved locally.");
3901: 				showMessage?.("Composer draft saved locally.");
3902: 			};
3903: 		}
```

### Around line 3909
```js
3904: 
3905: 		// ── CLEAR ────────────────────────────────────────────────────
3906: 		const clearBtn = $("aicmdV2ClearBtn");
3907: 		if (clearBtn) {
3908: 			clearBtn.onclick = () => {
3909: 				session.draftMessage = "";
3910: 				if (input) input.value = "";
3911: 				persistSessionDraft(sessionKey, session, "Draft cleared");
3912: 				updateStatus("Composer draft cleared.");
3913: 				showMessage?.("Composer draft cleared.");
3914: 			};
```

### Around line 4079
```js
4074: 				if (!output.outputType) return;
4075: 				const specialistLabel = session.teamMode === "team"
4076: 					? "Full Team"
4077: 					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
4078: 				const text = buildPreviewText(output, specialistLabel);
4079: 				session.draftMessage = text;
4080: 				if (input) {
4081: 					input.value = text;
4082: 					input.focus();
4083: 				}
4084: 				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
```

## Safe composer helper usage

### Around line 687
```js
682: 
683: 	return asString(template).replace(/\{(project|specialist|campaign)\}/g, (_, token) => tokenMap[token] || "");
684: }
685: 
686: 
687: function normalizeAiComposerPrompt(value) {
688:   let text = asString(value).trim();
689: 
690:   if (!text) return "";
691: 
692:   const commandPrefixes = [
```

### Around line 731
```js
726: 
727:   return text.replace(/\s+/g, " ").trim();
728: }
729: 
730: 
731: function setAiComposerValue(session, input, value) {
732:   const cleanValue = normalizeAiComposerPrompt(value);
733:   session.draftMessage = cleanValue;
734:   if (input) {
735:     input.value = cleanValue;
736:     input.focus?.();
```

### Around line 732
```js
727:   return text.replace(/\s+/g, " ").trim();
728: }
729: 
730: 
731: function setAiComposerValue(session, input, value) {
732:   const cleanValue = normalizeAiComposerPrompt(value);
733:   session.draftMessage = cleanValue;
734:   if (input) {
735:     input.value = cleanValue;
736:     input.focus?.();
737:   }
```

### Around line 3426
```js
3421: 		const globalInput = $("quickCommandInput");
3422: 		const bridgeValue = asString(globalInput?.value || "").trim();
3423: 		if (bridgeValue) {
3424: 			const detectedSpecialist = detectSpecialistFromBridgePrompt(bridgeValue);
3425: 			if (detectedSpecialist) session.modeId = detectedSpecialist;
3426: 			setAiComposerValue(session, input, bridgeValue);
3427: 			persistSessionDraft(sessionKey, session, "Specialist context loaded from workspace");
3428: 			if (globalInput) globalInput.value = "";
3429: 		}
3430: 		// ─────────────────────────────────────────────────────────────
3431: 
```

### Around line 3656
```js
3651: 					recognition.interimResults = false;
3652: 					recognition.maxAlternatives = 1;
3653: 					recognition.onresult = (event) => {
3654: 						const transcript = asString(event?.results?.[0]?.[0]?.transcript || "").trim();
3655: 						if (!transcript) return;
3656: 						setAiComposerValue(session, input, transcript);
3657: 						if (input) {
3658: 							input.value = transcript;
3659: 							input.focus();
3660: 						}
3661: 						persistSessionDraft(sessionKey, session, "Voice input captured");
```

### Around line 3811
```js
3806: 				const spec = getPhase1SpecialistById(session.modeId);
3807: 				const taskPrompt = value
3808: 					? `Draft a task plan for: ${value}`
3809: 					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
3810: 				if (input) input.value = taskPrompt;
3811: 				setAiComposerValue(session, input, taskPrompt);
3812: 				setPreviewFromIntent("task", taskPrompt, { switchTab: "preview" });
3813: 				updateStatus("Task draft preview prepared locally. Review before creating durable tasks.");
3814: 				showMessage?.("Task draft preview prepared.");
3815: 			};
3816: 		}
```

### Around line 3828
```js
3823: 				const spec = getPhase1SpecialistById(session.modeId);
3824: 				const workflowPrompt = value
3825: 					? `Draft a workflow sequence for: ${value}`
3826: 					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
3827: 				if (input) input.value = workflowPrompt;
3828: 				setAiComposerValue(session, input, workflowPrompt);
3829: 				setPreviewFromIntent("workflow", workflowPrompt, { switchTab: "preview" });
3830: 				updateStatus("Workflow draft preview prepared locally. No workflow run started.");
3831: 				showMessage?.("Workflow draft preview prepared.");
3832: 			};
3833: 		}
```

### Around line 3846
```js
3841: 				const spec = getPhase1SpecialistById(session.modeId);
3842: 				const handoffPrompt = value
3843: 					? `Prepare a handoff summary for: ${value}`
3844: 					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
3845: 				if (input) input.value = handoffPrompt;
3846: 				setAiComposerValue(session, input, handoffPrompt);
3847: 				setPreviewFromIntent("handoff", handoffPrompt, { switchTab: "preview" });
3848: 				updateStatus("Handoff preview prepared locally. Review destination before sending.");
3849: 				showMessage?.("Handoff preview prepared.");
3850: 			};
3851: 		}
```

### Around line 3875
```js
3870: 					projectName,
3871: 					specialistLabel: session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label,
3872: 					campaign: aiContext.campaign
3873: 				});
3874: 
3875: 				setAiComposerValue(session, input, preparedPrompt);
3876: 				if (input) {
3877: 					input.value = preparedPrompt;
3878: 				}
3879: 
3880: 				if (tool.intent === "task") {
```

### Around line 3940
```js
3935: 
3936: 		const responseUseBtn = $("aicmdV3ResponseUseBtn");
3937: 		if (responseUseBtn) {
3938: 			responseUseBtn.onclick = () => {
3939: 				if (!latestResponse?.responseText) return;
3940: 				setAiComposerValue(session, input, latestResponse.responseText);
3941: 				if (input) {
3942: 					input.value = latestResponse.responseText;
3943: 					input.focus();
3944: 				}
3945: 				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
```

## Route destination logic

### Around line 1057
```js
1052: 		.join("\n\n");
1053: 
1054: 	return [recommendationLine, findingLine, sectionLine].filter(Boolean).join("\n\n");
1055: }
1056: 
1057: function destinationRouteForSpecialist(specialistId, outputType) {
1058: 	const id = asString(specialistId || "operations");
1059: 	if (outputType === "workflow") return "workflows";
1060: 	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
1061: 	if (id === "writer") return "content-studio";
1062: 	if (id === "media") return "media-studio";
```

### Around line 1094
```js
1089: 
1090: function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1091: 	const cleanPrompt = asString(prompt).trim();
1092: 	const promptSnippet = cleanPrompt || `Project request for ${projectName || "current project"}`;
1093: 	const specialistId = asString(specialist?.id || "operations");
1094: 	const route = destinationRouteForSpecialist(specialistId, outputType);
1095: 
1096: 	const base = {
1097: 		specialistId,
1098: 		outputType,
1099: 		title: "Draft output",
```

### Around line 1671
```js
1666: 		resolvedModeId: top.modeId || selectedModeId || "operations",
1667: 		actionRouting
1668: 	};
1669: }
1670: 
1671: function routeSuggestion(label, route, reason) {
1672: 	return { label, route, reason };
1673: }
1674: 
1675: function normalizeActionLabel(item) {
1676: 	return titleCase(asString(item).replace(/^connector:/, "").replace(/^asset:/, ""));
```

### Around line 1724
```js
1719: 		].filter(Boolean),
1720: 		nextActions: [
1721: 			...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
1722: 			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
1723: 		],
1724: 		routeSuggestions: [
1725: 			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
1726: 			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
1727: 			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
1728: 		],
1729: 		missingData: buildMissingDataNotes(aiContext, "executive")
```

### Around line 1725
```js
1720: 		nextActions: [
1721: 			...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
1722: 			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
1723: 		],
1724: 		routeSuggestions: [
1725: 			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
1726: 			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
1727: 			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
1728: 		],
1729: 		missingData: buildMissingDataNotes(aiContext, "executive")
1730: 	};
```

### Around line 1726
```js
1721: 			...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
1722: 			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
1723: 		],
1724: 		routeSuggestions: [
1725: 			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
1726: 			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
1727: 			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
1728: 		],
1729: 		missingData: buildMissingDataNotes(aiContext, "executive")
1730: 	};
1731: }
```

### Around line 1727
```js
1722: 			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
1723: 		],
1724: 		routeSuggestions: [
1725: 			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
1726: 			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
1727: 			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
1728: 		],
1729: 		missingData: buildMissingDataNotes(aiContext, "executive")
1730: 	};
1731: }
1732: 
```

### Around line 1759
```js
1754: 		nextActions: [
1755: 			top ? `Create a follow-up asset using ${extractTopMessage(top)}'s pattern.` : "Load social insight data before expanding content queue.",
1756: 			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
1757: 			"Prepare next batch with performance-led hooks instead of generic posting volume."
1758: 		],
1759: 		routeSuggestions: [
1760: 			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
1761: 			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
1762: 			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
1763: 		],
1764: 		missingData: buildMissingDataNotes(aiContext, "content")
```

### Around line 1760
```js
1755: 			top ? `Create a follow-up asset using ${extractTopMessage(top)}'s pattern.` : "Load social insight data before expanding content queue.",
1756: 			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
1757: 			"Prepare next batch with performance-led hooks instead of generic posting volume."
1758: 		],
1759: 		routeSuggestions: [
1760: 			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
1761: 			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
1762: 			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
1763: 		],
1764: 		missingData: buildMissingDataNotes(aiContext, "content")
1765: 	};
```

### Around line 1761
```js
1756: 			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
1757: 			"Prepare next batch with performance-led hooks instead of generic posting volume."
1758: 		],
1759: 		routeSuggestions: [
1760: 			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
1761: 			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
1762: 			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
1763: 		],
1764: 		missingData: buildMissingDataNotes(aiContext, "content")
1765: 	};
1766: }
```

### Around line 1762
```js
1757: 			"Prepare next batch with performance-led hooks instead of generic posting volume."
1758: 		],
1759: 		routeSuggestions: [
1760: 			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
1761: 			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
1762: 			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
1763: 		],
1764: 		missingData: buildMissingDataNotes(aiContext, "content")
1765: 	};
1766: }
1767: 
```

### Around line 1795
```js
1790: 		nextActions: [
1791: 			topQuery ? `Expand content around ${extractTopMessage(topQuery)}.` : "Reconnect Search Console before making SEO roadmap decisions.",
1792: 			lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Audit page titles on highest-priority pages.",
1793: 			"Review top landing pages for stronger offer clarity and conversion flow."
1794: 		],
1795: 		routeSuggestions: [
1796: 			routeSuggestion("Insights", "insights", "Review search and website performance together."),
1797: 			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
1798: 			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
1799: 		],
1800: 		missingData: buildMissingDataNotes(aiContext, "seo")
```

### Around line 1796
```js
1791: 			topQuery ? `Expand content around ${extractTopMessage(topQuery)}.` : "Reconnect Search Console before making SEO roadmap decisions.",
1792: 			lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Audit page titles on highest-priority pages.",
1793: 			"Review top landing pages for stronger offer clarity and conversion flow."
1794: 		],
1795: 		routeSuggestions: [
1796: 			routeSuggestion("Insights", "insights", "Review search and website performance together."),
1797: 			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
1798: 			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
1799: 		],
1800: 		missingData: buildMissingDataNotes(aiContext, "seo")
1801: 	};
```

### Around line 1797
```js
1792: 			lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Audit page titles on highest-priority pages.",
1793: 			"Review top landing pages for stronger offer clarity and conversion flow."
1794: 		],
1795: 		routeSuggestions: [
1796: 			routeSuggestion("Insights", "insights", "Review search and website performance together."),
1797: 			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
1798: 			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
1799: 		],
1800: 		missingData: buildMissingDataNotes(aiContext, "seo")
1801: 	};
1802: }
```

### Around line 1798
```js
1793: 			"Review top landing pages for stronger offer clarity and conversion flow."
1794: 		],
1795: 		routeSuggestions: [
1796: 			routeSuggestion("Insights", "insights", "Review search and website performance together."),
1797: 			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
1798: 			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
1799: 		],
1800: 		missingData: buildMissingDataNotes(aiContext, "seo")
1801: 	};
1802: }
1803: 
```

### Around line 1830
```js
1825: 		nextActions: [
1826: 			bestCreative ? `Reuse the creative pattern behind ${extractTopMessage(bestCreative)}.` : "Sync paid data before scaling any creative.",
1827: 			weakCampaign ? `Rebuild hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping.",
1828: 			"Tie paid decisions to conversion and revenue signal — not just clicks."
1829: 		],
1830: 		routeSuggestions: [
1831: 			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
1832: 			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
1833: 			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
1834: 		],
1835: 		missingData: buildMissingDataNotes(aiContext, "ads")
```

### Around line 1831
```js
1826: 			bestCreative ? `Reuse the creative pattern behind ${extractTopMessage(bestCreative)}.` : "Sync paid data before scaling any creative.",
1827: 			weakCampaign ? `Rebuild hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping.",
1828: 			"Tie paid decisions to conversion and revenue signal — not just clicks."
1829: 		],
1830: 		routeSuggestions: [
1831: 			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
1832: 			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
1833: 			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
1834: 		],
1835: 		missingData: buildMissingDataNotes(aiContext, "ads")
1836: 	};
```

### Around line 1832
```js
1827: 			weakCampaign ? `Rebuild hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping.",
1828: 			"Tie paid decisions to conversion and revenue signal — not just clicks."
1829: 		],
1830: 		routeSuggestions: [
1831: 			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
1832: 			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
1833: 			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
1834: 		],
1835: 		missingData: buildMissingDataNotes(aiContext, "ads")
1836: 	};
1837: }
```

### Around line 1833
```js
1828: 			"Tie paid decisions to conversion and revenue signal — not just clicks."
1829: 		],
1830: 		routeSuggestions: [
1831: 			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
1832: 			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
1833: 			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
1834: 		],
1835: 		missingData: buildMissingDataNotes(aiContext, "ads")
1836: 	};
1837: }
1838: 
```

### Around line 1858
```js
1853: 		nextActions: [
1854: 			"Review Setup and tighten goals, audience, competitor, and market assumptions.",
1855: 			"Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
1856: 			"Use Insights to identify where the recommendation stack is still blind."
1857: 		],
1858: 		routeSuggestions: [
1859: 			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
1860: 			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
1861: 			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
1862: 		],
1863: 		missingData: [
```

### Around line 1859
```js
1854: 			"Review Setup and tighten goals, audience, competitor, and market assumptions.",
1855: 			"Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
1856: 			"Use Insights to identify where the recommendation stack is still blind."
1857: 		],
1858: 		routeSuggestions: [
1859: 			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
1860: 			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
1861: 			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
1862: 		],
1863: 		missingData: [
1864: 			...buildMissingDataNotes(aiContext, "seo"),
```

### Around line 1860
```js
1855: 			"Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
1856: 			"Use Insights to identify where the recommendation stack is still blind."
1857: 		],
1858: 		routeSuggestions: [
1859: 			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
1860: 			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
1861: 			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
1862: 		],
1863: 		missingData: [
1864: 			...buildMissingDataNotes(aiContext, "seo"),
1865: 			...buildMissingDataNotes(aiContext, "ads"),
```

### Around line 1861
```js
1856: 			"Use Insights to identify where the recommendation stack is still blind."
1857: 		],
1858: 		routeSuggestions: [
1859: 			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
1860: 			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
1861: 			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
1862: 		],
1863: 		missingData: [
1864: 			...buildMissingDataNotes(aiContext, "seo"),
1865: 			...buildMissingDataNotes(aiContext, "ads"),
1866: 			...buildMissingDataNotes(aiContext, "content")
```

### Around line 1891
```js
1886: }
1887: 
1888: function buildOperationsResponse(aiContext, message) {
1889: 	const query = asString(message).toLowerCase();
1890: 	const taskBlock = buildOperationsTaskBlock(aiContext, message);
1891: 	const routeSuggestions = [];
1892: 	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
```

### Around line 1892
```js
1887: 
1888: function buildOperationsResponse(aiContext, message) {
1889: 	const query = asString(message).toLowerCase();
1890: 	const taskBlock = buildOperationsTaskBlock(aiContext, message);
1891: 	const routeSuggestions = [];
1892: 	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
```

### Around line 1894
```js
1889: 	const query = asString(message).toLowerCase();
1890: 	const taskBlock = buildOperationsTaskBlock(aiContext, message);
1891: 	const routeSuggestions = [];
1892: 	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
1898: 	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
1899: 	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
```

### Around line 1895
```js
1890: 	const taskBlock = buildOperationsTaskBlock(aiContext, message);
1891: 	const routeSuggestions = [];
1892: 	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
1898: 	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
1899: 	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
1900: 	return {
```

### Around line 1897
```js
1892: 	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
1898: 	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
1899: 	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
1900: 	return {
1901: 		title: "Operations routing brief",
1902: 		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
```

### Around line 1898
```js
1893: 	if (/content|post/.test(query)) {
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
1898: 	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
1899: 	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
1900: 	return {
1901: 		title: "Operations routing brief",
1902: 		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
1903: 		findings: [
```

### Around line 1899
```js
1894: 		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
1895: 		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
1896: 	}
1897: 	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
1898: 	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
1899: 	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
1900: 	return {
1901: 		title: "Operations routing brief",
1902: 		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
1903: 		findings: [
1904: 			aiContext.criticalGaps.length ? `Unresolved critical gaps: ${aiContext.criticalGaps.slice(0, 3).map(normalizeActionLabel).join(", ")}.` : "No critical gap is blocking this operation.",
```

### Around line 1912
```js
1907: 		recommendations: [
1908: 			"Move into the correct workspace rather than managing the whole flow from chat.",
1909: 			aiContext.recommendations[0]?.action || "Use the current recommendation stack to choose the first high-impact step."
1910: 		].filter(Boolean),
1911: 		nextActions: taskBlock.steps,
1912: 		routeSuggestions,
1913: 		taskBlock,
1914: 		missingData: buildMissingDataNotes(aiContext, "content")
1915: 	};
1916: }
1917: 
```

### Around line 2015
```js
2010: 	setSharedAiDraft(projectName, {
2011: 		projectName: projectName || "",
2012: 		modeId: modeId || "",
2013: 		lastCommand: asString(command),
2014: 		lastResponseTitle: asString(response?.title),
2015: 		routeSuggestions: asArray(response?.routeSuggestions),
2016: 		updatedAt: nowIso()
2017: 	});
2018: }
2019: 
2020: function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
```

### Around line 2037
```js
2032: 		setSharedAiDraft(projectName, {
2033: 			projectName,
2034: 			modeId: draftContext.modeId || session.modeId,
2035: 			lastCommand: prompt || draftContext.lastCommand || "",
2036: 			lastResponseTitle: draftContext.lastResponseTitle || "",
2037: 			routeSuggestions: asArray(draftContext.routeSuggestions)
2038: 		});
2039: 	}
2040: 
2041: 	session.lastAppliedHandoffId = handoffId;
2042: 	consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
```

### Around line 2096
```js
2091: 			status: "failed",
2092: 			title: "Command failed",
2093: 			summary: failureReason,
2094: 			findings: [failureReason],
2095: 			nextActions: ["Check AI provider configuration and retry."],
2096: 			routeSuggestions: [],
2097: 			missingData: [],
2098: 			error: failureReason
2099: 		};
2100: 	}
2101: 
```

### Around line 2380
```js
2375: 	const title = humanizeValue(response.title, "");
2376: 	const summary = humanizeValue(response.summary, "");
2377: 	const findings = normalizeDisplayList(response.findings, 5);
2378: 	const recommendations = normalizeDisplayList(response.recommendations, 4);
2379: 	const nextActions = normalizeDisplayList(response.nextActions || response.next_actions, 4);
2380: 	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {
2381: 		const record = asObject(item);
2382: 		return {
2383: 			label: humanizeValue(record.label || record.title || record.route || item),
2384: 			route: asString(record.route || record.destination || record.page),
2385: 			reason: humanizeValue(record.reason || record.summary || item)
```

### Around line 2444
```js
2439: 						${normalizeDisplayList(taskBlock.steps, 6).map((step) => `<div class="ctrl-response-item"><span>${escapeHtml(step)}</span></div>`).join("")}
2440: 					</div>
2441: 				</div>
2442: 			` : ""}
2443: 
2444: 			${routeSuggestions.length ? `
2445: 				<div class="ctrl-response-section">
2446: 					<div class="ctrl-response-section-label">Open workspace</div>
2447: 					<div class="ctrl-route-row">
2448: 						${routeSuggestions.map((item, index) => `
2449: 							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
```

### Around line 2448
```js
2443: 
2444: 			${routeSuggestions.length ? `
2445: 				<div class="ctrl-response-section">
2446: 					<div class="ctrl-response-section-label">Open workspace</div>
2447: 					<div class="ctrl-route-row">
2448: 						${routeSuggestions.map((item, index) => `
2449: 							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
2450: 								${escapeHtml(item.label)} →
2451: 							</button>
2452: 						`).join("")}
2453: 					</div>
```

### Around line 3122
```js
3117: 			</div>
3118: 
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
3126: 			</div>
3127: 		</section>
```

### Around line 3213
```js
3208: 
3209: 			<div class="aicmd-v2-chat-actions">
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
3218: 	`;
```

### Around line 3253
```js
3248: function renderPhase1ContextPanel(state, session, aiContext, escapeHtml) {
3249: 	const projectName = aiContext.projectName;
3250: 	const readiness = aiContext.readinessScore;
3251: 	const languagePlan = getWorkspaceLanguagePlan(aiContext);
3252: 	const specialist = session.teamMode === "team" ? { label: "Full Team" } : getPhase1SpecialistById(session.modeId);
3253: 	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
3254: 	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
3255: 	const contextItems = [
3256: 		{ label: "Project", value: projectName || "Not selected", present: Boolean(projectName) },
3257: 		{ label: "Specialist", value: specialist.label || "Specialist", present: true },
3258: 		{ label: "Market", value: languagePlan.market, present: true },
```

### Around line 3750
```js
3745: 					});
3746: 					if (!responseText) {
3747: 						throw new Error("Guidance bridge returned no response text.");
3748: 					}
3749: 
3750: 					const routeSuggestion = asArray(response.routeSuggestions || result?.routeSuggestions)[0];
3751: 					const safetyLabel = asString(result?.safety_label || "guidance_only");
3752: 					session.responseHistory.unshift({
3753: 						id: `resp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
3754: 						prompt: value,
3755: 						specialistId: specialist.id || session.modeId,
```

### Around line 3765
```js
3760: 						responseRaw: {
3761: 							...response,
3762: 							safety_label: safetyLabel,
3763: 							provider: result?.provider
3764: 						},
3765: 						destinationRoute: asString(routeSuggestion?.route) || destinationRouteForSpecialist(session.modeId, "guidance")
3766: 					});
3767: 					session.responseHistory = session.responseHistory.slice(0, 12);
3768: 					session.responseLoading = false;
3769: 					session.responseError = "";
3770: 					saveLocalOutput(sessionKey, {
```

### Around line 4000
```js
3995: 
3996: 		const responseSendBtn = $("aicmdV3ResponseSendBtn");
3997: 		if (responseSendBtn) {
3998: 			responseSendBtn.onclick = () => {
3999: 				if (!latestResponse) return;
4000: 				const destination = asString(latestResponse.destinationRoute || destinationRouteForSpecialist(session.modeId, "guidance"));
4001: 				const draftContext = {
4002: 					projectName: projectName || "",
4003: 					modeId: latestResponse.specialistId || session.modeId,
4004: 					lastCommand: latestResponse.prompt || "",
4005: 					lastResponseTitle: latestResponse.responseTitle || "Generated specialist response",
```

### Around line 4006
```js
4001: 				const draftContext = {
4002: 					projectName: projectName || "",
4003: 					modeId: latestResponse.specialistId || session.modeId,
4004: 					lastCommand: latestResponse.prompt || "",
4005: 					lastResponseTitle: latestResponse.responseTitle || "Generated specialist response",
4006: 					routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Specialist response destination" }],
4007: 					phase3_response: latestResponse
4008: 				};
4009: 				setSharedAiDraft(projectName || "__default__", draftContext);
4010: 				setSharedHandoff(projectName || "__default__", destination, {
4011: 					id: `aicmd-response-${Date.now()}`,
```

### Around line 4112
```js
4107: 						draft_context: {
4108: 							projectName: projectName || "",
4109: 							modeId: output.specialistId || session.modeId,
4110: 							lastCommand: output.sourcePrompt || "",
4111: 							lastResponseTitle: output.title || "",
4112: 							routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Phase 2 preview destination" }],
4113: 							phase2_output_preview: output
4114: 						}
4115: 					}
4116: 				};
4117: 
```

## Attachment or upload references

### Around line 15
```js
10: 	setSharedAiDraft,
11: 	setSharedHandoff
12: } from "../shared-context.js";
13: import {
14: 	getCategoryReadinessList
15: } from "../asset-library.js";
16: import {
17: 	executeProjectAiGuidance
18: } from "../api.js";
19: //  AI TEAM DEFINITIONS
20: // ============================================================
```

### Around line 157
```js
152: 		label: "Media Director",
153: 		icon: "🎨",
154: 		summary: "Visual direction, creative briefs, format guidance, and brand consistency.",
155: 		placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",
156: 		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
157: 		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
158: 		destinations: ["Asset Library", "Content Studio", "AI Command"],
159: 		safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
160: 		status: "Ready"
161: 	},
162: 	{
```

### Around line 158
```js
153: 		icon: "🎨",
154: 		summary: "Visual direction, creative briefs, format guidance, and brand consistency.",
155: 		placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",
156: 		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
157: 		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
158: 		destinations: ["Asset Library", "Content Studio", "AI Command"],
159: 		safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
160: 		status: "Ready"
161: 	},
162: 	{
163: 		id: "video_lead",
```

### Around line 169
```js
164: 		label: "Video Lead",
165: 		icon: "🎬",
166: 		summary: "Short-form video scripts, motion direction, and reel strategy.",
167: 		placeholder: "Ask the Video Lead to write a reel script, map short-form strategy, or outline the next video concept…",
168: 		canHelp: ["Write video scripts", "Plan short-form strategy", "Define motion direction", "Map video asset requirements", "Prepare video briefs"],
169: 		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
170: 		destinations: ["Asset Library", "Content Studio", "Media Native"],
171: 		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
172: 		status: "Ready"
173: 	},
174: 	{
```

### Around line 170
```js
165: 		icon: "🎬",
166: 		summary: "Short-form video scripts, motion direction, and reel strategy.",
167: 		placeholder: "Ask the Video Lead to write a reel script, map short-form strategy, or outline the next video concept…",
168: 		canHelp: ["Write video scripts", "Plan short-form strategy", "Define motion direction", "Map video asset requirements", "Prepare video briefs"],
169: 		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
170: 		destinations: ["Asset Library", "Content Studio", "Media Native"],
171: 		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
172: 		status: "Ready"
173: 	},
174: 	{
175: 		id: "publisher",
```

### Around line 1642
```js
1637: 	const query = asString(text).toLowerCase();
1638: 	const keywordMap = {
1639: 		strategist: ["campaign", "launch campaign", "campaign plan", "marketing campaign", "market entry", "growth plan", "offer strategy", "launch plan"],
1640: 		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
1641: 		designer: ["design", "visual", "creative brief", "format", "brand", "layout", "image direction", "creative direction"],
1642: 		media: ["media", "image", "video", "photo", "asset", "library", "gallery", "footage", "visual assets"],
1643: 		ads: ["ad ideas", "ad copy", "facebook ads", "meta ads", "tiktok ads", "google ads", "cta", "paid", "targeting angle", "ad creative"],
1644: 		analyst: ["seo", "keyword", "keywords", "query", "search", "meta", "blog topic", "search intent", "ranking", "analytics", "performance", "traffic", "insights", "metrics"],
1645: 		researcher: ["research", "market trend", "market research", "audience research", "competitor", "positioning gap", "validate", "competitive"],
1646: 		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1647: 		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
```

## Voice chat references

### Around line 3026
```js
3021: 				</button>
3022: 				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
3023: 					Handoff
3024: 				</button>
3025: 				<button id="aicmdV2VoiceBtn" class="aicmd-v2-btn-secondary" type="button">
3026: 					Browser Voice
3027: 				</button>
3028: 				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
3029: 					Save
3030: 				</button>
3031: 				<button id="aicmdV2ClearBtn" class="aicmd-v2-btn-ghost" type="button">
```

### Around line 3124
```js
3119: 			<div class="aicmd-v2-preview-actions">
3120: 				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
3121: 				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
3122: 				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
3123: 				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
3124: 				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3125: 				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
3126: 			</div>
3127: 		</section>
3128: 	`;
3129: }
```

### Around line 3136
```js
3131: function renderPhase2MediaStatusPanel(aiContext, escapeHtml) {
3132: 	const providerConfigured = isProviderLikelyConfigured(aiContext);
3133: 	const providerStatus = providerConfigured
3134: 		? "Configured in integrations"
3135: 		: "Status not connected yet";
3136: 	const speechSynthAvailable = typeof speechSynthesis !== "undefined";
3137: 
3138: 	return `
3139: 		<section class="aicmd-v2-media-status">
3140: 			<div class="aicmd-v2-media-status-head">
3141: 				<h3 class="aicmd-v2-media-status-title">Media, Voice &amp; Chat Capability</h3>
```

### Around line 3150
```js
3145: 				<li><span>Image prompt generation</span><strong class="${providerConfigured ? "is-available" : "is-planned"}">${escapeHtml(providerConfigured ? "Provider configured" : "Needs provider connection")}</strong></li>
3146: 				<li><span>Video brief / script draft</span><strong class="is-draft-ready">Draft-ready — no generation executed</strong></li>
3147: 				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
3148: 				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
3149: 				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
3150: 				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
3151: 				<li><span>Team chat execution bridge</span><strong class="is-planned">Planned — requires backend bridge</strong></li>
3152: 				<li><span>Realtime voice chat</span><strong class="is-planned">Future — needs provider + bridge</strong></li>
3153: 			</ul>
3154: 		</section>
3155: 	`;
```

### Around line 3152
```js
3147: 				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
3148: 				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
3149: 				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
3150: 				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
3151: 				<li><span>Team chat execution bridge</span><strong class="is-planned">Planned — requires backend bridge</strong></li>
3152: 				<li><span>Realtime voice chat</span><strong class="is-planned">Future — needs provider + bridge</strong></li>
3153: 			</ul>
3154: 		</section>
3155: 	`;
3156: }
3157: 
```

### Around line 3215
```js
3210: 				<button id="aicmdV3ResponseCopyBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Copy</button>
3211: 				<button id="aicmdV3ResponseUseBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Use in Composer</button>
3212: 				<button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Send to Preview</button>
3213: 				<button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button" ${latest ? "" : "disabled"}>Route Draft</button>
3214: 				<button id="aicmdV3ResponseSaveBtn" class="aicmd-v2-btn-ghost" type="button" ${latest ? "" : "disabled"}>Save</button>
3215: 				<button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read response</button>
3216: 			</div>
3217: 		</section>
3218: 	`;
3219: }
3220: 
```

### Around line 3639
```js
3634: 		}
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
```

### Around line 3640
```js
3635: 
3636: 		const voiceBtn = $("aicmdV2VoiceBtn");
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
```

### Around line 3642
```js
3637: 		if (voiceBtn) {
3638: 			voiceBtn.onclick = () => {
3639: 				const SpeechRecognitionCtor = typeof window !== "undefined"
3640: 					? (window.SpeechRecognition || window.webkitSpeechRecognition)
3641: 					: null;
3642: 				if (!SpeechRecognitionCtor) {
3643: 					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
3646: 				}
3647: 
```

### Around line 3649
```js
3644: 					showMessage?.("Voice input readiness is staged for compatible browsers.");
3645: 					return;
3646: 				}
3647: 
3648: 				try {
3649: 					const recognition = new SpeechRecognitionCtor();
3650: 					recognition.lang = "ar";
3651: 					recognition.interimResults = false;
3652: 					recognition.maxAlternatives = 1;
3653: 					recognition.onresult = (event) => {
3654: 						const transcript = asString(event?.results?.[0]?.[0]?.transcript || "").trim();
```

### Around line 3665
```js
3660: 						}
3661: 						persistSessionDraft(sessionKey, session, "Voice input captured");
3662: 						updateStatus("Voice input captured in composer.");
3663: 					};
3664: 					recognition.onerror = () => {
3665: 						updateStatus("Voice input could not start. Microphone permission may be blocked.");
3666: 					};
3667: 					recognition.start();
3668: 					updateStatus("Listening for Arabic voice input.");
3669: 				} catch (_) {
3670: 					updateStatus("Voice input could not start in this browser.");
```

### Around line 4034
```js
4029: 
4030: 		const responseReadBtn = $("aicmdV3ResponseReadBtn");
4031: 		if (responseReadBtn) {
4032: 			responseReadBtn.onclick = () => {
4033: 				if (!latestResponse?.responseText) return;
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
4037: 				}
4038: 				const utterance = new SpeechSynthesisUtterance(latestResponse.responseText);
4039: 				speechSynthesis.cancel();
```

### Around line 4038
```js
4033: 				if (!latestResponse?.responseText) return;
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
4037: 				}
4038: 				const utterance = new SpeechSynthesisUtterance(latestResponse.responseText);
4039: 				speechSynthesis.cancel();
4040: 				speechSynthesis.speak(utterance);
4041: 				updateStatus("Reading response locally in browser.");
4042: 			};
4043: 		}
```

### Around line 4039
```js
4034: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
4037: 				}
4038: 				const utterance = new SpeechSynthesisUtterance(latestResponse.responseText);
4039: 				speechSynthesis.cancel();
4040: 				speechSynthesis.speak(utterance);
4041: 				updateStatus("Reading response locally in browser.");
4042: 			};
4043: 		}
4044: 
```

### Around line 4040
```js
4035: 					updateStatus("Read response is not supported in this browser.");
4036: 					return;
4037: 				}
4038: 				const utterance = new SpeechSynthesisUtterance(latestResponse.responseText);
4039: 				speechSynthesis.cancel();
4040: 				speechSynthesis.speak(utterance);
4041: 				updateStatus("Reading response locally in browser.");
4042: 			};
4043: 		}
4044: 
4045: 		// ── PREVIEW ACTIONS (Phase 2 safe actions) ───────────────────
```

### Around line 4145
```js
4140: 		const previewReadBtn = $("aicmdV2PreviewReadBtn");
4141: 		if (previewReadBtn) {
4142: 			previewReadBtn.onclick = () => {
4143: 				const output = asObject(session.outputPreview);
4144: 				if (!output.outputType) return;
4145: 				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4146: 					updateStatus("Read preview is not supported in this browser.");
4147: 					return;
4148: 				}
4149: 				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
4150: 					.filter(Boolean)
```

### Around line 4152
```js
4147: 					return;
4148: 				}
4149: 				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
4150: 					.filter(Boolean)
4151: 					.join(". ");
4152: 				const utterance = new SpeechSynthesisUtterance(previewText || "Draft preview ready.");
4153: 				speechSynthesis.cancel();
4154: 				speechSynthesis.speak(utterance);
4155: 				updateStatus("Reading preview locally in browser.");
4156: 			};
4157: 		}
```

### Around line 4153
```js
4148: 				}
4149: 				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
4150: 					.filter(Boolean)
4151: 					.join(". ");
4152: 				const utterance = new SpeechSynthesisUtterance(previewText || "Draft preview ready.");
4153: 				speechSynthesis.cancel();
4154: 				speechSynthesis.speak(utterance);
4155: 				updateStatus("Reading preview locally in browser.");
4156: 			};
4157: 		}
4158: 
```

### Around line 4154
```js
4149: 				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
4150: 					.filter(Boolean)
4151: 					.join(". ");
4152: 				const utterance = new SpeechSynthesisUtterance(previewText || "Draft preview ready.");
4153: 				speechSynthesis.cancel();
4154: 				speechSynthesis.speak(utterance);
4155: 				updateStatus("Reading preview locally in browser.");
4156: 			};
4157: 		}
4158: 
4159: 		const previewClearBtn = $("aicmdV2PreviewClearBtn");
```

## Required decision after this audit
Patch only what is proven by the action map:
1. Make Task / Workflow / Handoff use setAiComposerValue.
2. Rename unclear buttons.
3. If Chat has no input, add clear helper: "Use Composer above to ask follow-up" or add a small follow-up input connected to Ask Specialist.
4. Keep Browser Voice honest.
5. Keep attachments as "Library / asset input planned" unless real file pipeline exists.
6. Keep Route Draft safe and non-executing.

## No-go
Do not touch backend, server, api.js, app.js, router.js, data/projects, or Customer Operations runtime in this UI polish step.
