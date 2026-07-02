# PHASE 3AH.4 — Backend API Route Evidence

## Existing customer-operations runtime files
runtime/orchestrator-service/lib/customer-operations/README.md
runtime/orchestrator-service/lib/customer-operations/channels/README.md
runtime/orchestrator-service/lib/customer-operations/channels/channel-integration-mapper.js
runtime/orchestrator-service/lib/customer-operations/channels/register-integration-channel.js
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js
runtime/orchestrator-service/lib/customer-operations/contracts/README.md
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js
runtime/orchestrator-service/lib/customer-operations/conversations/README.md
runtime/orchestrator-service/lib/customer-operations/conversations/create-integration-session.js
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js
runtime/orchestrator-service/lib/customer-operations/readiness/customer-operations-readiness-snapshot.js
runtime/orchestrator-service/lib/customer-operations/registry/README.md
runtime/orchestrator-service/lib/customer-operations/sla/store/sla-policy-store.js
runtime/orchestrator-service/lib/customer-operations/tickets/README.md
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js
runtime/orchestrator-service/lib/customer-operations/unified-inbox/register-integration-inbox.js
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js

## Existing server routes that mention customer operations / inbox / tickets / conversations / messages / CRM
21921:app.post('/api/media/generate-voice-script', async (req, res) => {

## All server route markers near customer terms
61:  getUnsupportedProviderMessage
121:  createCustomerOperationsRuntime
122:} = require('./lib/customer-operations/customer-operations-runtime');
423:    message: 'Too many requests. Please retry shortly.'
788:function sanitizeErrorMessage(rawMessage, fallbackMessage) {
789:  const fallback = String(fallbackMessage || 'Request failed').trim() || 'Request failed';
790:  const value = String(rawMessage || '').replace(/[\r\n\t]+/g, ' ').trim();
816:  message = 'Request failed'
822:      message: sanitizeErrorMessage(message, 'Request failed')
831:    message: 'Invalid project slug'
895:    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'project')) {
899:    if (req.query && Object.prototype.hasOwnProperty.call(req.query, 'project')) {
920:    return sanitizeErrorMessage(payload, 'Request failed');
1019:    checks.project_registry_load.error = sanitizeErrorMessage(error.message, 'Failed to load project registry');
1419:    throw new Error(`Unsupported email artifact contract: ${artifactType}`);
1711:      if (!Object.prototype.hasOwnProperty.call(stats.fallback_causes, cause)) {
2386:Create a realistic, premium, cinematic, marketing-grade visual that supports the campaign objective while preserving the exact product identity.
2879:    throw new Error('Unsupported Meta placement');
2932:    throw new Error('Unsupported Meta placement');
3161:    throw new Error('Unsupported YouTube format');
3180:      : 'CTR-first via title-thumbnail fit, then watch-time support through structure.',
3189:    throw new Error('Unsupported YouTube format');
3246:          '10-20s: premium message',
3351:    throw new Error('Unsupported marketplace');
3496:  throw new Error('Unsupported marketplace');
3524:    throw new Error('Unsupported marketplace');
3673:  const supportProducts = launchReadyProducts.slice(3, 10);
3689:      support_products: supportProducts.map(p => ({
3698:      support_count: supportProducts.length,
4214:      connector_error: error.message || 'Connector payload unavailable'
5256:    console.warn(`[server] readJsonFile: non-fatal read/parse error for ${filePath}, returning fallback. Error: ${err.message}`);
5295:      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
5556:    payload.errors.tree = error.message;
5562:    payload.errors.registry = error.message;
5566:    const message = 'Project profile not found';
5567:    payload.errors.overview = message;
5568:    payload.errors.assets = message;
5569:    payload.errors.connectors = message;
5570:    payload.errors.readiness = message;
5571:    payload.errors.activity = message;
5572:    payload.errors.operations = message;
5589:      payload.errors[key] = error.message;
5620:function detectProject(message) {
5621:  const text = String(message || '').toLowerCase();
5782:function detectTaskType(message) {
5783:  const text = String(message || '').toLowerCase();
6007:function decideMode(message) {
6008:  const text = String(message || '').toLowerCase();
6048:  message,
6054:  const project = detectProject(message);
6055:  const taskType = detectTaskType(message);
6056:  const mode = decideMode(message);
6088:    message_received: message,
6116:    message
6414:    tone: projectData.tone || projectData.brand_voice || '',
6415:    brand_voice: projectData.brand_voice || '',
6721:      recommended_integrations: ['woocommerce', 'google', 'meta', 'tiktok', 'email_crm']
6753:      default_channels: ['website', 'facebook', 'instagram', 'google', 'crm'],
6759:      starter_checklist: ['add_property_data', 'upload_property_media', 'define_lead_flow', 'connect_crm', 'create_listing_campaign'],
6760:      recommended_integrations: ['website', 'crm', 'google', 'meta', 'email_crm']
6773:      recommended_integrations: ['website', 'google_business', 'meta', 'email_crm']
6798:      starter_checklist: ['define_services', 'add_case_studies', 'define_lead_offer', 'connect_crm', 'create_lead_campaign'],
6799:      recommended_integrations: ['website', 'linkedin', 'meta', 'google', 'crm']
6913:    tone: normalizeSetupTextValue(input.tone || input.brand_voice),
6933:    brand_voice: normalizeSetupTextValue(input.brand_voice),
6962:    throw new Error('Project rename is not supported by Setup persistence');
7892:    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
7893:      status: 'unsupported_provider'
7993:      last_error: normalizeTextValue(error.message || 'Integration validation failed'),
7994:      notes: normalizeTextValue(error.message || nextRecord.notes),
7995:      health_summary: normalizeTextValue(error.message || ''),
8005:        last_error: normalizeTextValue(error.message || 'Integration validation failed'),
8006:        health_summary: normalizeTextValue(error.message || '')
8013:    throw Object.assign(new Error(normalizeTextValue(error.message || 'Integration validation failed')), {
8065:    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
8066:      status: 'unsupported_provider'
8123:        throw new Error('Unsupported integration action');
8132:      nextRecord.last_error = normalizeTextValue(error.message || 'Provider action failed');
8133:      nextRecord.notes = normalizeTextValue(error.message || nextRecord.notes);
8134:      nextRecord.health_summary = normalizeTextValue(error.message || '');
8216:      description: 'Brand identity, voice, visual rules, and usage guidance.',
8360:      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
9255:      error: error.message || 'Failed to summarize project parity readiness'
9266:      error: error.message || 'Failed to summarize project parity readiness'
9277:      error: error.message || 'Failed to summarize storage parity readiness'
9288:      error: error.message || 'Failed to summarize storage parity readiness'
9294:  const message = req.body.message || '';
9295:  const result = buildTaskResult({ message });
9313:    res.json({ error: err.message });
9329:    res.json({ error: err.message });
9334:  const message = req.body.message || req.body.text || req.body.input || '';
9340:    message,
9366:      supported_execution_states: EXECUTION_BRIDGE_STATES
9392:        error: error.message,
9402:      message: error.message || 'Failed to execute publish package'
9424:      supported_execution_states: EXECUTION_BRIDGE_STATES
9449:        error: error.message,
9459:      message: error.message || 'Failed to execute email package'
9494:      supported_execution_states: EXECUTION_BRIDGE_STATES,
9509:        error: error.message,
9519:      message: error.message || 'Failed to generate media from prompt'
9546:      supported_execution_states: EXECUTION_BRIDGE_STATES,
9562:        error: error.message,
9572:      message: error.message || 'Failed to build ad execution package'
9591:      error: error.message
9636:      error: error.message
9722:      error: error.message
9806:      message: 'Failed to back up and clone product'
9921:      message: 'Failed to apply prepared copy to clone'
9938:    return res.json({ error: error.message || 'Project not found' });
9955:      message: 'Upload request rejected'
10025:      details: error.message
10186:    const message = error?.message || 'Failed to rename project';
10187:    const notFound = /not found/i.test(message);
10188:    const conflict = /already exists|already uses/i.test(message);
10193:      details: message
10286:    const message = error?.message || 'Failed to apply project template';
10287:    const notFound = /not found/i.test(message);
10292:      details: message
10348:    const message = error?.message || "Failed to create project";
10349:    const duplicate = /already exists/i.test(message);
10354:      details: message
10400:      error: error.message || 'Failed to build media manager startup payload'
10410:      error: error.message || 'Failed to build media manager startup payload'
10420:      error: error.message || 'Failed to build media manager payload'
10430:      error: error.message || 'Failed to build media manager payload'
10545:function sendAssetMutationError(res, error, fallbackMessage) {
10548:    error: error?.message || fallbackMessage,
10557:    error: fallbackMessage,
10558:    details: error?.message || String(error)
10766:      error: error.message || 'Failed to refresh project library'
10776:      error: error.message || 'Failed to save project setup'
10786:      error: error.message || 'Failed to save project setup'
10796:      error: error.message || 'Failed to build project operations payload'
10813:      error: error.message || 'Failed to build task center payload'
10827:      error: error.message || 'Failed to build queue center payload'
10841:      error: error.message || 'Failed to build job monitor payload'
10855:      error: error.message || 'Failed to build notification center payload'
10887:      error: error.message || 'Failed to load project team model'
10900:      error: error.message || 'Failed to update project team model'
10920:      error: error.message || 'Failed to list campaigns'
10934:      error: error.message || 'Failed to save campaign'
10948:      error: error.message || 'Failed to load campaign'
10985:      error: error.message || 'Failed to list content items'
10999:      error: error.message || 'Failed to save content item'
11013:      error: error.message || 'Failed to load content item'
11051:      error: error.message || 'Failed to list media jobs'
11065:      error: error.message || 'Failed to save media job'
11079:      error: error.message || 'Failed to load media job'
11115:      error: error.message || 'Failed to list workflow runs'
11132:      error: error.message || 'Failed to load workflow run'
11175:      error: error.message || 'Failed to record workflow run'
11216:        error: error.message || 'Failed to execute AI command'
11259:        error: error.message || 'Failed to execute AI chat'
11302:        error: error.message || 'Failed to execute AI guidance'
11330:      error: error.message || 'Failed to execute AI workflow'
11345:      error: error.message || 'Failed to list AI commands'
11359:      error: error.message || 'Failed to load AI command'
11375:      error: error.message || 'Failed to list AI artifacts'
11391:      error: error.message || 'Failed to list AI recommendations'
11407:      error: error.message || 'Failed to list AI memory'
11441:      error: error.message || 'Failed to list tasks'
11455:      error: error.message || 'Failed to create task'
11473:      error: error.message || 'Failed to load task'
11486:      error: error.message || 'Failed to load task'
11501:      error: error.message || 'Failed to list approvals'
11515:      error: error.message || 'Failed to create approval'
11536:      error: error.message || 'Failed to update approval'
11557:      error: error.message || 'Failed to load governance summary'
11571:      error: error.message || 'Failed to update governance policy'
11584:      error: error.message || 'Failed to load governance policy'
11606:      error: error.message || 'Failed to list notifications'
11622:      error: error.message || 'Failed to update notification'
11635:      error: error.message || 'Failed to update notification'
11653:      error: error.message || 'Failed to list handoffs'
11667:      error: error.message || 'Failed to create handoff'
11681:      error: error.message || 'Failed to consume handoff'
11703:      error: error.message || 'Failed to list events'
11716:      error: error.message || 'Failed to build project insights'
11726:      error: error.message || 'Failed to build project learning'
11757:      error: error.message || 'Failed to save project source'
11783:      error: error.message || 'Failed to save project source'
11794:      error: error.message || 'Failed to remove project source'
11805:      error: error.message || 'Failed to remove project source'
11815:      error: error.message || 'Failed to load integration control center'
11825:  if (status === 'unsupported_provider') {
11867:      error: error.message || 'Failed to save integration connection'
11889:      error: error.message || 'Failed to update integration'
11895:const customerOperationsRuntime =
11896:  createCustomerOperationsRuntime();
11915:      message: error.message
11930:      message: error.message
11937:function handleCustomerOperationsHealth(req, res) {
11940:      customerOperationsRuntime.health()
11944:      error: 'customer_operations_health_failed',
11945:      message: error.message
11950:function handleCustomerOperationsReadiness(req, res) {
11953:      customerOperationsRuntime.readiness.snapshot()
11957:      error: 'customer_operations_readiness_failed',
11958:      message: error.message
11963:function handleCustomerOperationsChannels(req, res) {
11967:        customerOperationsRuntime.channels.list()
11971:      error: 'customer_operations_channels_failed',
11972:      message: error.message
11977:function handleCustomerOperationsInbox(req, res) {
11980:      inbox:
11981:        customerOperationsRuntime.unifiedInbox.list()
11985:      error: 'customer_operations_inbox_failed',
11986:      message: error.message
11992:  '/media-manager/project/:project/customer-operations/health',
11993:  handleCustomerOperationsHealth
11997:  '/public/media-manager/project/:project/customer-operations/health',
11998:  handleCustomerOperationsHealth
12002:  '/media-manager/project/:project/customer-operations/readiness',
12003:  handleCustomerOperationsReadiness
12007:  '/public/media-manager/project/:project/customer-operations/readiness',
12008:  handleCustomerOperationsReadiness
12012:  '/media-manager/project/:project/customer-operations/channels',
12013:  handleCustomerOperationsChannels
12017:  '/public/media-manager/project/:project/customer-operations/channels',
12018:  handleCustomerOperationsChannels
12022:  '/media-manager/project/:project/customer-operations/inbox',
12023:  handleCustomerOperationsInbox
12027:  '/public/media-manager/project/:project/customer-operations/inbox',
12028:  handleCustomerOperationsInbox
12034:function handleCustomerOperationsConversations(req, res) {
12037:      conversations:
12038:        customerOperationsRuntime.conversations.list()
12042:      error: 'customer_operations_conversations_failed',
12043:      message: error.message
12048:function handleCustomerOperationsMessages(req, res) {
12051:      messages:
12052:        customerOperationsRuntime.messages.list()
12056:      error: 'customer_operations_messages_failed',
12057:      message: error.message
12062:function handleCustomerOperationsCustomers(req, res) {
12065:      customers:
12066:        customerOperationsRuntime.customers.list()
12070:      error: 'customer_operations_customers_failed',
12071:      message: error.message
12076:function handleCustomerOperationsSla(req, res) {
12079:      sla:
12080:        customerOperationsRuntime.sla.list()
12084:      error: 'customer_operations_sla_failed',
12085:      message: error.message
12090:function handleCustomerOperationsEscalations(req, res) {
12093:      escalations:
12094:        customerOperationsRuntime.escalation.list()
12098:      error: 'customer_operations_escalations_failed',
12099:      message: error.message
12105:  '/media-manager/project/:project/customer-operations/conversations',
12106:  handleCustomerOperationsConversations
12110:  '/public/media-manager/project/:project/customer-operations/conversations',
12111:  handleCustomerOperationsConversations
12115:  '/media-manager/project/:project/customer-operations/messages',
12116:  handleCustomerOperationsMessages
12120:  '/public/media-manager/project/:project/customer-operations/messages',
12121:  handleCustomerOperationsMessages
12125:  '/media-manager/project/:project/customer-operations/customers',
12126:  handleCustomerOperationsCustomers
12130:  '/public/media-manager/project/:project/customer-operations/customers',
12131:  handleCustomerOperationsCustomers
12135:  '/media-manager/project/:project/customer-operations/sla',
12136:  handleCustomerOperationsSla
12140:  '/public/media-manager/project/:project/customer-operations/sla',
12141:  handleCustomerOperationsSla
12145:  '/media-manager/project/:project/customer-operations/escalations',
12146:  handleCustomerOperationsEscalations
12150:  '/public/media-manager/project/:project/customer-operations/escalations',
12151:  handleCustomerOperationsEscalations
12184:      message: error.message
12280:      error: error.message || 'Failed to save publishing schedule',
12313:      error: error.message || 'Failed to save publishing schedule',
12342:      error: error.message || 'Failed to reschedule publishing item',
12371:      error: error.message || 'Failed to reschedule publishing item',
12393:      error: error.message || 'Failed to approve publishing item',
12415:      error: error.message || 'Failed to approve publishing item',
12447:      error: error.message || 'Failed to publish item',
12479:      error: error.message || 'Failed to publish item',
12511:      error: error.message || 'Failed to mark publishing item as failed',
12543:      error: error.message || 'Failed to mark publishing item as failed',
12852:    const hook = map.hook || `${productName} supports ${category} care with ${benefitText}.`;
12885:        'Avoid unsupported medical or misleading claims.'
13365:    record.error = sanitizeErrorMessage(payload.error, 'Execution bridge failed');
13451:        message: caption,
13560:        direction: String(reel.cta || branding.cta || 'Close with CTA and brand recall.').trim()
14029:function buildPublishingGovernanceError(message, details = {}) {
14030:  const error = new Error(message);
14053:  // We still guard defensively here in case of unexpected call paths.
14345:      brand_voice: project.brand_voice,
14356:      customer_problem: project.audience_problem,
14565:      error: error.message || 'Failed to build project insights'
14653:        message: 'No command text provided'
14694:          message: 'Missing product_id'
14711:          message: 'Missing product_id'
14728:          message: 'Missing product_id'
14747:          message: 'Missing original_id or clone_id'
15169:      item.visual_format = 'feed post / reel support';
15225:        'Add one high-authority source only if it supports trust and relevance'
15649:        message: 'Image generated successfully'
15656:      details: error.message
15754:        message: 'Featured image attached successfully'
15761:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
15894:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
16152:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
16216:            message: 'Email image generated successfully'
16223:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
16288:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
16508:          'reel/tiktok support'
17593:            visual_format: post.platform === 'instagram' ? 'feed post / reel support' : 'social post',
17766:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
17828:          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
18167:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
18214:        message: 'Asset already registered',
18272:        message: 'Reference already registered',
18356:      details: error.message
18393:      details: error.message
18415:      details: error.message
18437:      details: error.message
18460:      details: error.message
18487:      details: error.message
18508:      details: error.message
18529:      details: error.message
18550:      details: error.message
18582:      details: error.message
18602:      details: error.message
18622:      details: error.message
18648:      details: error.message
18669:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
18689:      details: error.message
18711:      details: error.message
18731:      details: error.message
18757:      details: error.message
18777:      details: error.message
18798:      details: error.message
18837:      details: error.message
18859:      details: error.message
18880:      details: error.message
18898:      details: error.message
18916:      details: error.message
18936:      details: error.message
18954:      details: error.message
18976:      details: error.message
18998:      details: error.message
19023:      details: error.message
19047:      details: error.message
19098:      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
19120:      details: error.message
19152:      details: error.message
19175:      details: error.message
19201:      details: error.message
19222:      details: error.message
19243:      details: error.message
19288:      details: error.message
19329:      details: error.message
19370:      details: error.message
19405:      details: error.message
19432:      details: error.message
19473:      details: error.message
19508:      details: error.message
19535:      details: error.message
19567:    return res.json({ error: 'Failed', details: e.message });
19597:    return res.json({ error: 'Failed bulk', details: e.message });
19619:    return res.json({ error: 'Failed review', details: e.message });
19652:      details: error.message
19674:      details: error.message
19701:      details: error.message
19723:      details: error.message
19744:      details: error.message
19766:      details: error.message
19787:      details: error.message
19798:    return res.json({ error: 'Failed to build launch plan', details: error.message });
19811:    return res.json({ error: 'Failed to review launch plan', details: error.message });
19822:    return res.json({ error: 'Failed to build launch wave', details: error.message });
19836:    return res.json({ error: 'Failed to review launch wave', details: error.message });
19854:      details: error.message
19874:      details: error.message
19891:      details: error.message
19910:      details: error.message
19935:      details: error.message
19953:      details: error.message
19970:      details: error.message
19988:      details: error.message
20006:      details: error.message
20023:      details: error.message
20042:      details: error.message
20061:      details: error.message
20081:      details: error.message
20099:      details: error.message
20117:      details: error.message
20128:      details: error.message
20146:      details: error.message
20174:      details: error.message
20186:      details: error.message
20204:      details: error.message
20222:      details: error.message
20241:      details: error.message
20259:    details: error.message
20279:      details: error.message
20297:      details: error.message
20315:      details: error.message
20326:      details: error.message
20344:      details: error.message
20362:      details: error.message
20381:      details: error.message
20399:      details: error.message
20417:      details: error.message
20434:      details: error.message
20452:      details: error.message
20470:      details: error.message
20487:      details: error.message
20505:      details: error.message
20523:      details: error.message
20541:      details: error.message
20559:      details: error.message
20578:      message: `Unsupported command: ${command}`
20584:      message: 'Failed to execute telegram command'
20627:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to publish clone product'
20716:      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to replace original product'
20763:      message: 'Failed to cleanup clone product'
20785:        message: 'Blog draft not found'
20793:        message: 'Blog draft has no body content'
20805:        message: 'WordPress environment variables are missing'
20830:        message: `WordPress publish failed with status ${response.status}`
20869:      message: 'Failed to publish blog draft'
20893:        message: 'No backup found for this product'
20937:      message: 'Failed to rollback product'
20959:  sanitizeErrorMessage,
21470:      message: error.message || 'Failed to schedule execution job'
21547:      message: error.message || 'Failed to retrieve scheduler queue'
21563:    // Phase 1: lock all due jobs atomically
21616:            error: intelligenceError.message || 'Intelligence loop update failed'
21629:        const errorMessage = sanitizeErrorMessage(err.message, 'Job execution failed');
21635:        job.last_error = errorMessage;
21644:          error: errorMessage,
21658:          last_error: errorMessage,
21677:      message: error.message || 'Failed to run scheduler worker'
21712:      if (!Object.prototype.hasOwnProperty.call(metrics, key)) {
21749:      message: error.message || 'Failed to record execution feedback'
21768:      message: error.message || 'Failed to build performance summary'
21796:      message: error.message || 'Failed to generate optimization recommendations'
21826:      message: error.message || 'Failed to improve media prompt'
21856:      message: error.message || 'Failed to run media brand check'
21886:      message: error.message || 'Failed to generate image'
21916:      message: error.message || 'Failed to generate video brief'
21921:app.post('/api/media/generate-voice-script', async (req, res) => {
21930:      output: { voice_script: result.voice_script },
21939:      voice_script: result.voice_script,
21946:      message: error.message || 'Failed to generate voice script'
21976:      message: error.message || 'Failed to generate campaign pack'
21995:      message: error.message || 'Failed to get smart suggestions'
22012:  const responseMessage = statusCode >= 500 && isProduction
22014:    : sanitizeErrorMessage(err?.message, 'Request failed');
22032:      message: responseMessage

## API helper evidence in frontend api.js
16:  constructor(message, diagnostics = {}) {
17:    super(String(message || "Project data requires a valid access key."));
35:  constructor(message, diagnostics = {}) {
36:    super(String(message || "Project response was received but could not be processed."));
129:function isMissingReadKeyErrorMessage(message) {
130:  return /missing\s+read\s+key/i.test(String(message || ""));
133:function isAccessKeyRelatedMessage(message) {
134:  const normalized = String(message || "").toLowerCase();
156:  const message = String(
157:    error?.message
159:      || error?.payload?.message
163:  if ((status === 401 || status === 403) && isAccessKeyRelatedMessage(message)) {
167:  return isAccessKeyRelatedMessage(message);
259:        message: String(details.message || ""),
355:        message: error?.message || "Response body read timed out"
404:            message: fallbackError?.message || "JSON fallback failed"
439:      message: error?.message || "Failed to read response body"
499:      message: parseFailure?.message || "Invalid JSON payload"
516:async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
550:    const message =
552:      payload?.message ||
553:      `${fallbackMessage} (${response.status})`;
555:    if (isMissingReadKeyErrorMessage(message)) {
556:      throw new AccessKeyError(message, diagnostics);
559:    const error = new Error(message);
577:    const message = String(payload.error || fallbackMessage);
579:    if (isMissingReadKeyErrorMessage(message)) {
580:      throw new AccessKeyError(message, diagnostics);
583:    const error = new Error(message);
647:        message: timeoutError.message
694:      message: error?.message || "Request failed"
705:async function getJson(path, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, requestOptions = {}) {
712:  return parseJson(response, fallbackMessage, {
723:async function sendRawJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
738:      const parseError = new Error(fallbackMessage || "Response was not valid JSON.");
752:    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
753:    const error = new Error(message);
763:async function sendJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
771:  return parseJson(response, fallbackMessage, {
781:async function sendForm(path, formData, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
796:  return parseJson(response, fallbackMessage, {
836:    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
837:    const lowerMessage = message.toLowerCase();
839:    if (response.status === 401 || response.status === 403 || /read key|access key|invalid.*key/.test(lowerMessage)) {
840:      throw new AccessKeyError(message, {
851:    throw new Error(message);
971:    message: isOptionalNotFound
973:      : String(error?.message || error || "Unknown error"),
1039:    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
1040:    throw new Error(message);
1057:    console.warn("Using fallback projects list:", error.message);
1150:          message: String(fallbackError?.message || "Failed to verify project fallback")
1155:    const message = requiredDiagnostics
1156:      .map((item) => `${item.section}: ${item.message}`)
1158:    const error = new Error(`Required project data failed: ${message}`);
1392:    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
1393:    throw new Error(message);
2186:    "/api/media/generate-voice-script",
2189:    "Failed to generate voice script"
