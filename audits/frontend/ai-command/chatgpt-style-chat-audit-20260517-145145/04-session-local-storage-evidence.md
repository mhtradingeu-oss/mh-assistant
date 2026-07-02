# Session / Local Storage Evidence

480:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
481:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
569:const aiSessions = new Map();
893:	if (!aiSessions.has(key)) {
894:		aiSessions.set(key, {
935:	return aiSessions.get(key);
938:function readLocalDraftMap() {
941:		const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_DRAFTS_KEY) || "{}";
952:		window.localStorage?.setItem(AI_COMMAND_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
958:	return asObject(readLocalDraftMap()[key]);
963:	const map = readLocalDraftMap();
1001:function readLocalOutputMap() {
1004:		const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_OUTPUTS_KEY) || "{}";
1015:		window.localStorage?.setItem(AI_COMMAND_LOCAL_OUTPUTS_KEY, JSON.stringify(map || {}));
1021:	return asObject(readLocalOutputMap()[key]);
1024:function saveLocalOutput(projectName, outputPayload) {
1026:	const map = readLocalOutputMap();
2418:		saveLocalOutput(projectName, {
3267:				<button id="aicmdV2NewSessionBtn" class="aicmd-v2-btn-secondary" type="button">New Session</button>
4180:		const sessionKey = projectName || "__default__";
4181:		const session = ensureSession(sessionKey);
4182:		hydrateSessionDraft(sessionKey, session);
4185:		const savedOutput = asObject(loadLocalOutput(sessionKey));
4207:			persistSessionDraft(sessionKey, session, "Specialist context loaded from workspace");
4216:		applyDurableAiHandoff(sessionKey, operations, session, consumeProjectHandoff, showMessage);
4284:			persistSessionDraft(sessionKey, session, "Draft saved locally");
4303:				saveLocalOutput(sessionKey, {
4309:				persistSessionDraft(sessionKey, session, "New session started");
4331:				persistSessionDraft(sessionKey, session, `Output view: ${titleCase(nextTab)}`);
4346:				persistSessionDraft(sessionKey, session, `${spec.label} selected`);
4356:				persistSessionDraft(sessionKey, session, mode === "team" ? "Full Team mode activated" : "Solo Specialist mode activated");
4368:				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
4380:				persistSessionDraft(sessionKey, session, "Quick action loaded");
4391:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
4427:						persistSessionDraft(sessionKey, session, "Voice input captured");
4536:					saveLocalOutput(sessionKey, {
4659:				persistSessionDraft(sessionKey, session, "Draft saved locally");
4674:				persistSessionDraft(sessionKey, session, "Draft cleared");
4715:				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
4724:				const saved = saveLocalOutput(sessionKey, {
4754:				saveLocalOutput(sessionKey, {
4855:				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
4901:				const saved = saveLocalOutput(sessionKey, {
