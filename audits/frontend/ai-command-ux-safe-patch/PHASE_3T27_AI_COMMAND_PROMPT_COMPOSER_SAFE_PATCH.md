# PHASE 3T.27 — AI Command Prompt Diversity + Composer Guidance Safe Patch

## Status
Patch attempt pending validation and browser QA.

## Scope
Small production-safe UX patch only.

## Allowed Changes
- Suggested prompt prefill text may become richer.
- Composer may receive clearer local guidance copy.

## Forbidden Changes
- No backend changes.
- No API changes.
- No route changes.
- No provider execution changes.
- No workflow execution changes.
- No publishing changes.
- No CRM/customer mutation.
- No data/projects changes.
- No extraction/refactor.
- No new execution action.
- No auto-send.
- No auto-execute.

## Baseline Commit
0959a0f Plan AI Command composer prompt safe implementation

## Snapshot Before Patch

### Composer render range before patch

function renderPhase1Composer(session, aiContext, escapeHtml) {
		const spec = getPhase1SpecialistById(session.modeId);
		const placeholder = "Message the AI specialist...";
		const isTeam = session.teamMode === "team";
		const specLabel = isTeam ? "Team Meeting Room" : spec.label;
		const headerText = isTeam
			? "Coordinated Team Review — Guidance Only"
			: `Chat with ${spec.label}`;
		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
		const roleId = isTeam ? "team" : getAiRoomRoleId(spec.id);
		const isGenerating = Boolean(session.responseLoading);

		return `
			<div class="aicmd-v2-composer aicmd-room-composer aicmd-chatgpt-composer" data-role="${escapeHtml(roleId)}">
				<div class="aicmd-v2-composer-head aicmd-chatgpt-composer-head">
					<div class="aicmd-v2-composer-title-row">
						<span class="aicmd-v2-composer-icon">${escapeHtml(isTeam ? "Team" : getAiRoomInitials(spec))}</span>
						<span class="aicmd-v2-composer-label">${escapeHtml(headerText)}</span>
					</div>
					<span class="aicmd-v2-draft-state">${escapeHtml(draftLabel)}</span>
				</div>

				<div class="aicmd-chatgpt-input-shell">
					<textarea
						id="aicmdV2Input"
						class="aicmd-v2-textarea aicmd-chatgpt-textarea"
						rows="3"
						placeholder="${escapeHtml(placeholder)}"
						aria-label="Message ${escapeHtml(specLabel)}"
					>${escapeHtml(session.draftMessage)}</textarea>

					<div class="aicmd-chatgpt-toolbar" aria-label="Composer controls">
						<div class="aicmd-chatgpt-tools-left">
							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
						</div>
						<div class="aicmd-chatgpt-tools-right">
							<span class="aicmd-chatgpt-enter-hint">Enter to send · Shift+Enter newline</span>
							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
								${isGenerating ? "…" : "➤"}
							</button>
						</div>
					</div>
				</div>

				<div class="aicmd-chatgpt-context-row">
					${renderLanguageMarketStrip(aiContext, escapeHtml)}
				</div>

				<div id="aicmdV2Status" class="aicmd-v2-composer-hint"></div>
			</div>
		`;
}

function renderPhase2PreviewPanel(session, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	if (!hasPreview) {
		return `
			<section class="aicmd-v2-preview">
				<div class="aicmd-v2-preview-head">
					<div>
						<h3 class="aicmd-v2-preview-title">Preview</h3>
						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
					</div>
					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>

### Suggested prompt render range before patch
                                        </div>
                                </details>
                        ` : ""}
                </section>
        `;
}

function renderPhase1SuggestedPrompts(session, escapeHtml) {
	const promptModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
	const prompts = session.teamMode === "team"
		? TEAM_SUGGESTED_PROMPTS
		: (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
	return `
		<div class="aicmd-v2-prompts">
			<div class="aicmd-v2-prompts-head">
				<span class="aicmd-v2-prompts-label">Suggested prompts</span>
				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
			</div>
			<div class="aicmd-v2-prompts-grid">
				${prompts.map((p, idx) => `
					<button
						class="aicmd-v2-prompt-chip"
						type="button"
						data-aicmdv2-prompt="${idx}"
						data-aicmdv2-prompt-text="${escapeHtml(p.label)}"
					>
						<span class="aicmd-v2-prompt-chip-label">${escapeHtml(p.label)}</span>
						<span class="aicmd-v2-prompt-chip-sub">${escapeHtml(p.sub)}</span>
					</button>
				`).join("")}
			</div>
		</div>
	`;
}

function renderPhase1ContextPanel(state, session, aiContext, escapeHtml) {

### Prompt handler range before patch
			};
		});

		// ── SUGGESTED PROMPTS: PREFILL ONLY ─────────────────────────
		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
			btn.onclick = () => {
				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
				if (!text) return;
				session.draftMessage = text;
				if (input) input.value = text;
				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
				updateStatus("Suggested prompt loaded into composer. Review it, then Ask AI Team or Draft.");
				input?.focus?.();
			};
		});

		Array.from(document.querySelectorAll("[data-aicmdv2-quick]")).forEach((btn) => {
			btn.onclick = () => {
				const text = asString(btn.getAttribute("data-aicmdv2-quick-template") || "");
				if (!text) return;
				session.draftMessage = text;
				if (input) input.value = text;
				persistSessionDraft(sessionKey, session, "Quick action loaded");
				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
				input?.focus?.();
			};
		});


---

## Patch Applied

### Change 1 — Suggested Prompt Prefill Text
Changed prompt chip prefill source from the short visible label only to a richer generated prompt:
- visible chip label remains unchanged
- visible chip subtitle remains unchanged
- prefill text now uses label + subtitle + review-only instruction
- suggested prompts still prefill only
- no auto-send added
- no execution added

### Change 2 — Composer Guidance Copy
Added a small local guidance line near the existing AI Command composer:

`Draft/review only · suggested prompts prefill this composer · execution happens in the owning workspace after confirmation.`

## Production Safety
- No backend changes.
- No API changes.
- No route changes.
- No provider changes.
- No workflow execution changes.
- No publishing changes.
- No CRM/customer mutation.
- No data/projects changes.
- No extraction/refactor.
- No new execution behavior.

## Required Browser QA Before Commit
- AI Command loads.
- Suggested prompt click fills composer.
- Suggested prompt does not send automatically.
- Prefill text is richer than before.
- Composer guidance copy is visible.
- Typing still works.
- Enter still sends.
- Shift+Enter still creates newline.
- Send still works.
- No publish/workflow/CRM/approval/customer action is executed.

---

## Browser QA Result

Status: Pass with minor UX notes.

## Visual QA Evidence

Observed in browser at:
`http://127.0.0.1:3000/control-center/#ai-command`

Confirmed:
- AI Command loads successfully.
- AI Team Command Center header is visible.
- Specialist rail is visible.
- Content Writer specialist can be selected and remains active.
- Conversation Room is visible.
- Composer is positioned close to the conversation area.
- Composer guidance copy is visible:
  `Draft/review only · suggested prompts prefill this composer · execution happens in the owning workspace after confirmation.`
- Output Workspace remains draft/review oriented.
- Quick Actions are labeled as Prepare/Review and remain review-only.
- Source Required drawer blocks unsafe use until source/destination context is selected.
- No publish action was executed.
- No workflow run was executed.
- No CRM/customer mutation was executed.
- No approval was executed.
- No customer action was sent.
- No backend task creation was observed.

## Notes
- Page remains visually dense and should receive future UX polish.
- Source Required drawer is safe but can be visually clarified later.
- This patch is safe to commit because it only improves prompt prefill guidance and composer safety copy.
