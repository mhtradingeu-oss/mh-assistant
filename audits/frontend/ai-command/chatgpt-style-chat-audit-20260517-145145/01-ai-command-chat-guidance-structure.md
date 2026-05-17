# AI Command Chat / Guidance Structure

17:	executeProjectAiGuidance
929:			responseHistory: [],
932:			responseHistoryLoaded: false
938:function readLocalDraftMap() {
958:	return asObject(readLocalDraftMap()[key]);
963:	const map = readLocalDraftMap();
1024:function saveLocalOutput(projectName, outputPayload) {
1036:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1037:	if (typeof executeProjectAiGuidanceFn !== "function") {
1050:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
2418:		saveLocalOutput(projectName, {
2420:			responses: session.responseHistory,
2507:	session.messages.push({
2516:	session.messages.push({
2866:function renderMessageStream(messages, escapeHtml) {
2910:				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
2913:				${renderMessageStream(session.messages, escapeHtml)}
2969:	const artifacts = session.messages
3033:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
3037:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
3162:	if (asArray(session.responseHistory).length) return 2;
3267:				<button id="aicmdV2NewSessionBtn" class="aicmd-v2-btn-secondary" type="button">New Session</button>
3583:				<button id="aicmdV2VoiceBtn" class="aicmd-room-mini-btn" type="button" title="Use browser speech recognition when available.">Voice</button>
3588:				<button id="aicmdV2AskBtn" class="aicmd-v2-btn-primary" type="button">
3699:				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
3804:				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(hasPreview && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read Aloud</button>
3820:	const recentAt = asArray(session.responseHistory)[0]?.generatedAt || preview.generatedAt || "";
3839:	const speechSynthAvailable = typeof speechSynthesis !== "undefined";
3861:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
3863:        const latest = asArray(session.responseHistory)[0] || null;
3864:        const responses = asArray(session.responseHistory).slice(0, 4);
3976:                                                                                <button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read</button>
4109:	const responses = asArray(session.responseHistory);
4193:		if (!session.responseHistoryLoaded) {
4194:			session.responseHistory = asArray(savedOutput.responses).slice(0, 12);
4195:			session.responseHistoryLoaded = true;
4222:		const responseBridge = getAiResponseBridgeStatus(executeProjectAiGuidance);
4245:						${renderPhase3SpecialistConversation(session, responseBridge, escapeHtml)}
4298:					session.responseHistory = [];
4303:				saveLocalOutput(sessionKey, {
4397:					$("aicmdV2AskBtn")?.click?.();
4402:		const voiceBtn = $("aicmdV2VoiceBtn");
4442:		const askBtn = $("aicmdV2AskBtn");
4482:					const result = await executeProjectAiGuidance(projectName, {
4518:					session.responseHistory.unshift({
4533:					session.responseHistory = session.responseHistory.slice(0, 12);
4536:					saveLocalOutput(sessionKey, {
4538:						responses: session.responseHistory,
4681:		const latestResponse = asArray(session.responseHistory)[0] || null;
4724:				const saved = saveLocalOutput(sessionKey, {
4726:					responses: session.responseHistory,
4754:				saveLocalOutput(sessionKey, {
4756:					responses: session.responseHistory,
4805:				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4810:				speechSynthesis.cancel();
4811:				speechSynthesis.speak(utterance);
4901:				const saved = saveLocalOutput(sessionKey, {
4916:				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
4924:				speechSynthesis.cancel();
4925:				speechSynthesis.speak(utterance);
