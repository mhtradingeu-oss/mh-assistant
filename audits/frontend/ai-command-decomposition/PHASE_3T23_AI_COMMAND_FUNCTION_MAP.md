# PHASE 3T.23 — AI Command Function Map Snapshot

## Function declarations
619:function buildAutoPlanFromCommand(commandText, session) {
691:function detectSpecialistFromBridgePrompt(prompt) {
715:function asArray(value) {
719:function asObject(value) {
723:function asString(value) {
728:function humanizeValue(value, fallback = "") {
765:function applyTokenTemplate(template, context = {}) {
778:function normalizeAiComposerPrompt(value) {
822:function setAiComposerValue(session, input, value) {
834:function normalizeDisplayList(value, limit = 8) {
841:function toNumber(value, fallback = null) {
847:function nowIso() {
851:function isMissingIntelligenceError(error) {
858:function formatTime(value) {
864:function getWorkspaceLanguagePlan(aiContext = {}) {
890:function titleCase(value) {
896:function formatCompactNumber(value) {
905:function formatCurrency(value, currency = "USD") {
919:function getModeMeta(id) {
924:function extractTopMessage(item = {}) {
932:function ensureSession(projectName) {
983:function readLocalDraftMap() {
994:function writeLocalDraftMap(map) {
1001:function loadLocalDraft(projectName) {
1006:function saveLocalDraft(projectName, draftPayload) {
1018:function hydrateSessionDraft(projectName, session) {
1035:function persistSessionDraft(projectName, session, hint) {
1046:function readLocalOutputMap() {
1057:function writeLocalOutputMap(map) {
1064:function loadLocalOutput(projectName) {
1069:function saveLocalOutput(projectName, outputPayload) {
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1095:function readAiChatSessionsMap() {
1106:function writeAiChatSessionsMap(map) {
1113:function getAiChatSessions(projectName) {
1118:function saveAiChatSession(projectName, session, options = {}) {
1153:function loadAiChatSessionIntoState(projectName, session, sessionId) {
1175:function refreshAiChatSessions(projectName, session) {
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1220:function extractGeneratedResponseText(response = {}) {
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1277:function resolveAiResponseOutputRoute(session, response = {}) {
1359:function routeLabel(route) {
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1674:function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
1724:function formatOutputTypeLabel(outputType) {
1735:function buildPreviewText(output, specialistLabel) {
1759:function compactPreviewText(value, maxLength = 360) {
1766:function splitPreviewLines(value, limit = 6) {
1776:function normalizeUniqueDisplayList(items, limit = 6) {
1790:function buildStructuredPreviewBlocks(preview = {}) {
1835:function isProviderLikelyConfigured(aiContext) {
1850:function buildUnifiedAiContext(state, intelligence) {
1959:function scoreMode(text, modeId) {
1978:function classifyIntent(message, selectedModeId) {
1994:function routeSuggestion(label, route, reason) {
1998:function normalizeActionLabel(item) {
2006:function buildMissingDataNotes(aiContext, lane) {
2025:function buildExecutiveResponse(aiContext) {
2056:function buildContentResponse(aiContext) {
2091:function buildSeoResponse(aiContext) {
2127:function buildAdsResponse(aiContext) {
2162:function buildResearchResponse(aiContext) {
2194:function buildOperationsTaskBlock(aiContext, message) {
2211:function buildOperationsResponse(aiContext, message) {
2241:function buildResponseForMode(aiContext, classified, message) {
2332:function syncAiWorkflowBridge({ projectName, modeId, command, response }) {
2421:function firstAiInboundId(...values) {
2429:function firstAiInboundText(...values) {
2437:function firstAiInboundObject(...values) {
2441:function asAiInboundList(value) {
2452:function normalizeAiInboundSourcePage(value) {
2462:function normalizeAiInboundSpecialistId(value, fallback = "operations") {
2471:function normalizeAiInboundTeamMode(value) {
2476:function normalizeAiInboundRouteSuggestions(rawSuggestions, sourcePage, sourceLabel) {
2497:function normalizeAiInboundOutputPreview(rawPreview, normalized) {
2526:function getAiInboundDurableHandoffId(handoff) {
2537:function getAiInboundHandoffId(handoff) {
2557:function normalizeAiInboundHandoff(handoff, projectName) {
2637:function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
2790:function buildProjectedAgentCards(state) {
2816:function renderControlRoomHeader(aiContext, session, intelligenceStatus, escapeHtml) {
2885:function renderTeamSelector(session, escapeHtml) {
2911:function renderCommandComposer(session, aiContext, escapeHtml) {
2984:function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {
3018:function renderCleanResponse(response, escapeHtml, ownerId) {
3109:function renderMessageStream(messages, escapeHtml) {
3148:function renderResultsPanel(session, escapeHtml) {
3166:function renderRecentCommands(session, escapeHtml) {
3207:function renderArtifactsPanel(aiContext, session, escapeHtml) {
3275:function getLastUserMessage(session) {
3279:function getLastAssistantMessage(session) {
3283:function buildConversationWorkContext(session, fallbackPrompt = "") {
3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
3356:function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
3387:function buildCommandEnvelope(session, prompt) {
3395:function buildImpactChips(activeLabels) {
3403:function buildSmartRecommendation(aiContext) {
3456:function getPhase1SpecialistById(value) {
3484:function getAiRoomRoleId(value) {
3491:function getAiRoomInitials(specialist) {
3502:function getAiRoomFlowIndex(session) {
3514:function outputTabFromIntent(intent) {
3526:function outputTabFromPreview(preview) {
3534:function getOutputWorkspaceTab(session) {
3540:function getToolOutputTypeLabel(tool) {
3553:function getToolDestinationRoute(tool, session) {
3560:function getToolExecutionStatusLabel(tool) {
3566:function getToolSafeActionLabel(tool) {
3574:function summarizeToolPurpose(tool) {
3584:function renderAiRoomChainSegment(items, escapeHtml) {
3591:function renderAiRoomTeamChain(escapeHtml) {
3601:function renderPhase1Header(session, projectName, aiContext, bridgeStatus, escapeHtml) {
3667:function renderPhase1TeamRail(session, bridgeStatus, escapeHtml) {
3741:function renderPhase1Profile(session, escapeHtml) {
3781:function getAiSpecialistWorkingMessage(session = {}) {
3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
3832:function getCanonicalToolIntent(tool = {}) {
3842:function getCanonicalToolRoute(tool = {}, session) {
3849:function canonicalToolNeedsSelectedSource(tool = {}) {
3854:function normalizeCanonicalToolForPanel(tool = {}, session) {
3865:function getPhase35ToolSet(session) {
3874:function renderPhase35WorkspaceTabs(session, bridgeStatus, escapeHtml) {
3901:function renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml) {
3948:function renderLanguageMarketStrip(aiContext, escapeHtml) {
3959:function renderPhase35ReadinessStrip(aiContext, bridgeStatus, escapeHtml) {
3981:function renderPhase1Composer(session, aiContext, escapeHtml) {
4034:function renderPhase2PreviewPanel(session, escapeHtml) {
4133:function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
4243:function renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml) {
4263:function renderPhase2MediaStatusPanel(aiContext, escapeHtml) {
4290:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
4502:function renderPhase1SuggestedPrompts(session, escapeHtml) {
4530:function renderPhase1ContextPanel(state, session, aiContext, escapeHtml) {
4587:function renderPhase1SafetyPanel(escapeHtml) {
4616:function renderPhase4HistoryPanel(session, escapeHtml) {

## Const arrow/function definitions

## Major constants
33:const MODE_DEFS = [
114:const MODE_ID_ALIASES = {
139:const SPECIALIST_DEFS = [
286:const SPECIALIST_SUGGESTED_PROMPTS = {
356:const TEAM_SUGGESTED_PROMPTS = [
363:const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
365:const AI_ROOM_FLOW_STEPS = [
374:const AI_ROOM_OUTPUT_TABS = [
382:const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];
383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
385:const AI_ROOM_ROLE_INITIALS = {
399:const AI_ROOM_BACKEND_ROLE_ALIASES = {
405:const AI_ROOM_PLANNED_SPECIALISTS = [
426:const PHASE35_SPECIALIST_TOOLS = {
511:const QUICK_ACTIONS = [
518:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
521:const COMMAND_TYPES = [
532:const TARGET_TYPES = [
539:const IMPACT_CHIP_LABELS = [
548:const AGENT_CARDS = [
608:const AI_COMMAND_CHAT_SESSIONS_KEY = "mh_ai_command_chat_sessions_v1";
2344:const AI_INBOUND_SOURCE_LABELS = {
2366:const AI_INBOUND_SPECIALIST_BY_SOURCE = {
2388:const AI_INBOUND_SPECIALIST_ALIASES = {
2398:const AI_INBOUND_SOURCE_ALIASES = {

## Handler markers
26:        executeProjectAiChat,
27:        executeProjectAiGuidance
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1082:	if (typeof executeProjectAiGuidanceFn !== "function") {
2700:	executeProjectAiCommand,
2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
2713:		result = await executeProjectAiCommand(projectName, {
4680:			executeProjectAiCommand,
4744:		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
4850:		        newSessionBtn.onclick = () => {
4886:			settingsBtn.onclick = () => {
4896:			btn.onclick = () => {
4907:                        btn.onclick = () => {
4932:			btn.onclick = () => {
4943:			btn.onclick = () => {
4955:			btn.onclick = () => {
5004:			voiceBtn.onclick = () => {
5044:		        askBtn.onclick = async () => {
5097:		                        const result = await executeProjectAiChat(projectName, {
5224:                        prepareBtn.onclick = () => {
5245:                        draftTaskBtn.onclick = () => {
5268:                        draftWorkflowBtn.onclick = () => {
5292:                        handoffBtn.onclick = () => {
5313:			btn.onclick = () => {
5355:			saveBtn.onclick = () => {
5366:			clearBtn.onclick = () => {
5384:		        responseContinueBtn.onclick = () => {
5392:			responseCopyBtn.onclick = async () => {
5410:			responseUseBtn.onclick = () => {
5423:			responseSaveBtn.onclick = () => {
5438:		        responseConvertBtn.onclick = () => {
5469:			responseSendBtn.onclick = () => {
5504:			responseReadBtn.onclick = () => {
5520:			previewCopyBtn.onclick = async () => {
5544:			previewUseBtn.onclick = () => {
5563:			previewSendBtn.onclick = () => {
5599:			previewSaveBtn.onclick = () => {
5614:			previewReadBtn.onclick = () => {
5633:			previewClearBtn.onclick = () => {
