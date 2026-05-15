# Customer Operations Integration Bridge Deep Scan

## Date
Fri May 15 01:31:29 PM UTC 2026

## Goal
Understand existing Customer Operations, Integrations, AI Team, frontend pages, and avoid duplication before building.

## Git Status
 M public/control-center/pages/ai-command.js
 M public/control-center/styles/12-pages.css
?? audits/customer-operations/CUSTOMER_OPERATIONS_INTEGRATION_BRIDGE_DEEP_SCAN.md
?? audits/frontend/ai-command/AI_TEAM_PHASE_4A_FINAL_INTEGRATION_POLISH.md

## Customer Operations Runtime
runtime/orchestrator-service/lib/customer-operations/channels/README.md
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/README.md
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js
runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js
runtime/orchestrator-service/lib/customer-operations/conversations/README.md
runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js
runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js
runtime/orchestrator-service/lib/customer-operations/README.md
runtime/orchestrator-service/lib/customer-operations/registry/README.md
runtime/orchestrator-service/lib/customer-operations/sla/store/sla-policy-store.js
runtime/orchestrator-service/lib/customer-operations/tickets/README.md
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js

## Integrations Runtime
runtime/orchestrator-service/lib/integrations/adapter-manager.js
runtime/orchestrator-service/lib/integrations/audit-log.js
runtime/orchestrator-service/lib/integrations/health-manager.js
runtime/orchestrator-service/lib/integrations/http-client.js
runtime/orchestrator-service/lib/integrations/insights-contract.js
runtime/orchestrator-service/lib/integrations/provider-registry.js
runtime/orchestrator-service/lib/integrations/providers/ebay.js
runtime/orchestrator-service/lib/integrations/providers/google.js
runtime/orchestrator-service/lib/integrations/providers/meta.js
runtime/orchestrator-service/lib/integrations/providers/ops.js
runtime/orchestrator-service/lib/integrations/providers/shopify.js
runtime/orchestrator-service/lib/integrations/providers/tiktok.js
runtime/orchestrator-service/lib/integrations/providers/unsupported.js
runtime/orchestrator-service/lib/integrations/providers/website.js
runtime/orchestrator-service/lib/integrations/providers/woocommerce.js
runtime/orchestrator-service/lib/integrations/provider-utils.js
runtime/orchestrator-service/lib/integrations/storage.js
runtime/orchestrator-service/lib/integrations/sync-history.js
runtime/orchestrator-service/lib/integrations/token-manager.js

## AI Runtime
runtime/orchestrator-service/lib/ai/provider-config.js
runtime/orchestrator-service/lib/ai/provider-registry.js
runtime/orchestrator-service/lib/ai/providers/openai.js
runtime/orchestrator-service/lib/ops/ai-orchestrator.js
runtime/orchestrator-service/lib/ops/backbone.js

## Media Runtime
runtime/orchestrator-service/lib/media/native/capabilities/local-rendering-capabilities.js
runtime/orchestrator-service/lib/media/native/capabilities/README.md
runtime/orchestrator-service/lib/media/native/execution/native-runtime-controller.js
runtime/orchestrator-service/lib/media/native/execution/native-runtime-demo.js
runtime/orchestrator-service/lib/media/native/execution/native-runtime-executor.js
runtime/orchestrator-service/lib/media/native/execution/README.md
runtime/orchestrator-service/lib/media/native/intelligence/media-knowledge-loader.js
runtime/orchestrator-service/lib/media/native/intelligence/media-learning-memory.js
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js
runtime/orchestrator-service/lib/media/native/intelligence/media-quality-scorer.js
runtime/orchestrator-service/lib/media/native/intelligence/native-media-intelligence.js
runtime/orchestrator-service/lib/media/native/knowledge/brand-video-style-guide.json
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json
runtime/orchestrator-service/lib/media/native/knowledge/platform-video-rules.json
runtime/orchestrator-service/lib/media/native/knowledge/product-visual-rules.json
runtime/orchestrator-service/lib/media/native/knowledge/video-shot-patterns.json
runtime/orchestrator-service/lib/media/native/knowledge/voice-tone-profiles.json
runtime/orchestrator-service/lib/media/native/knowledge/winning-hooks-library.json
runtime/orchestrator-service/lib/media/native/lifecycle/job-lifecycle-manager.js
runtime/orchestrator-service/lib/media/native/lifecycle/job-state-store.js
runtime/orchestrator-service/lib/media/native/lifecycle/lifecycle-demo.js
runtime/orchestrator-service/lib/media/native/lifecycle/README.md
runtime/orchestrator-service/lib/media/native/media-job-queue.js
runtime/orchestrator-service/lib/media/native/media-output-storage.js
runtime/orchestrator-service/lib/media/native/models/default-models.js
runtime/orchestrator-service/lib/media/native/models/model-registry-store.js
runtime/orchestrator-service/lib/media/native/models/model-selection-engine.js
runtime/orchestrator-service/lib/media/native/models/README.md
runtime/orchestrator-service/lib/media/native/native-audio-runtime.js
runtime/orchestrator-service/lib/media/native/native-engine-registry.js
runtime/orchestrator-service/lib/media/native/native-image-runtime.js
runtime/orchestrator-service/lib/media/native/native-video-runtime.js
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js
runtime/orchestrator-service/lib/media/native/orchestrator/job-dispatch-orchestrator.js
runtime/orchestrator-service/lib/media/native/orchestrator/orchestrator-demo.js
runtime/orchestrator-service/lib/media/native/orchestrator/README.md
runtime/orchestrator-service/lib/media/native/protocol/README.md
runtime/orchestrator-service/lib/media/native/protocol/worker-auth-contract.js
runtime/orchestrator-service/lib/media/native/protocol/worker-heartbeat-contract.js
runtime/orchestrator-service/lib/media/native/protocol/worker-job-contract.js
runtime/orchestrator-service/lib/media/native/protocol/worker-progress-contract.js
runtime/orchestrator-service/lib/media/native/protocol/worker-result-contract.js
runtime/orchestrator-service/lib/media/native/provider-bridge.js
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js
runtime/orchestrator-service/lib/media/native/providers/adapters/provider-adapter-demo.js
runtime/orchestrator-service/lib/media/native/providers/adapters/provider-adapter-registry.js
runtime/orchestrator-service/lib/media/native/providers/adapters/README.md
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js
runtime/orchestrator-service/lib/media/native/providers/provider-readiness.js
runtime/orchestrator-service/lib/media/native/providers/README.md
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js
runtime/orchestrator-service/lib/media/native/providers/router/README.md
runtime/orchestrator-service/lib/media/native/README.md
runtime/orchestrator-service/lib/media/native/registry/README.md
runtime/orchestrator-service/lib/media/native/registry/worker-heartbeat-manager.js
runtime/orchestrator-service/lib/media/native/registry/worker-registry-store.js
runtime/orchestrator-service/lib/media/native/registry/worker-selection-engine.js
runtime/orchestrator-service/lib/media/native/rendering/README.md
runtime/orchestrator-service/lib/media/native/rendering/rendering-audio-adapter.js
runtime/orchestrator-service/lib/media/native/rendering/rendering-engine-registry.js
runtime/orchestrator-service/lib/media/native/rendering/rendering-image-adapter.js
runtime/orchestrator-service/lib/media/native/rendering/rendering-video-adapter.js
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js
runtime/orchestrator-service/lib/media/native/workers/external-gpu-worker-adapter.js
runtime/orchestrator-service/lib/media/native/workers/README.md
runtime/orchestrator-service/lib/media/provider-layer.js

## Frontend Pages
public/control-center/pages/ads-manager.js
public/control-center/pages/ai-command.js
public/control-center/pages/campaign-studio.js
public/control-center/pages/content-studio-workspace.js
public/control-center/pages/governance.js
public/control-center/pages/home.js
public/control-center/pages/home/render-sections.js
public/control-center/pages/insights.js
public/control-center/pages/integrations/builders.js
public/control-center/pages/integrations/cards.js
public/control-center/pages/integrations/diagnostics.js
public/control-center/pages/integrations/drawer.js
public/control-center/pages/integrations.js
public/control-center/pages/integrations/layout.js
public/control-center/pages/integrations/render.js
public/control-center/pages/integrations/state.js
public/control-center/pages/integrations/utils.js
public/control-center/pages/library/action-panel.js
public/control-center/pages/library/ai-panel.js
public/control-center/pages/library/catalog-readiness.js
public/control-center/pages/library/command-router.js
public/control-center/pages/library.js
public/control-center/pages/library/listener-lifecycle.js
public/control-center/pages/library/projection-adapter.js
public/control-center/pages/library/session-store.js
public/control-center/pages/media-studio-workspace.js
public/control-center/pages/operations-centers.js
public/control-center/pages/publishing.js
public/control-center/pages/publishing/publishing-payloads.js
public/control-center/pages/research.js
public/control-center/pages/settings.js
public/control-center/pages/setup.js
public/control-center/pages/workflows.js
public/control-center/styles/00-tokens.css
public/control-center/styles/01-reset.css
public/control-center/styles/02-layer-system.css
public/control-center/styles/03-app-shell.css
public/control-center/styles/04-command-layer.css
public/control-center/styles/05-ai-layer.css
public/control-center/styles/07-sidebar.css
public/control-center/styles/08-components-foundation.css
public/control-center/styles/09-operations-centers.css
public/control-center/styles/10-topbar-canonical.css
public/control-center/styles/12-pages.css
public/control-center/styles/13-home-executive.css
public/control-center/styles/14-page-standard.css
public/control-center/styles/15-clean-operating-layer.css
public/control-center/styles/integrations/cards.css
public/control-center/styles/integrations/drawer.css
public/control-center/styles/integrations/forms.css
public/control-center/styles/integrations/grid.css
public/control-center/styles/integrations/layout.css
public/control-center/styles/integrations/responsive.css

## High Signal References
runtime/orchestrator-service/lib/insights/learning-engine.js:317:      reason: 'Without traffic and conversion data, the system can only optimize for engagement, not revenue or leads.'
runtime/orchestrator-service/lib/insights/ingestion-service.js:4:const { readJsonFile } = require('../integrations/storage');
runtime/orchestrator-service/lib/insights/ingestion-service.js:150:  const snapshotsDir = path.join(projectPaths.integrationsDir, 'snapshots');
runtime/orchestrator-service/lib/insights/ingestion-service.js:162:  return asArray(readJsonFile(path.join(projectPaths.integrationsDir, 'sync-history.json'), []));
runtime/orchestrator-service/lib/insights/ingestion-service.js:166:  return asObject(readJsonFile(path.join(projectPaths.integrationsDir, 'control-center.json'), {
runtime/orchestrator-service/lib/insights/ingestion-service.js:202:    return `${platformLabel} is already producing conversion signal. Reuse the strongest message pattern and push that learning into future campaigns.`;
runtime/orchestrator-service/lib/insights/ingestion-service.js:538:    return 'The website already shows page-level traffic and conversion signal. Use the strongest landing pages as the model for future campaigns.';
runtime/orchestrator-service/lib/insights/ingestion-service.js:745:  const campaigns = [];
runtime/orchestrator-service/lib/insights/ingestion-service.js:754:    asArray(raw.campaigns).forEach(item => {
runtime/orchestrator-service/lib/insights/ingestion-service.js:755:      campaigns.push({
runtime/orchestrator-service/lib/insights/ingestion-service.js:758:        campaign_name: asString(item.campaign_name || item.name || item.campaign_id || provider),
runtime/orchestrator-service/lib/insights/ingestion-service.js:772:  const totalSpend = sumNumbers(campaigns.map(item => item.spend));
runtime/orchestrator-service/lib/insights/ingestion-service.js:773:  const totalClicks = sumNumbers(campaigns.map(item => item.clicks));
runtime/orchestrator-service/lib/insights/ingestion-service.js:774:  const totalImpressions = sumNumbers(campaigns.map(item => item.impressions));
runtime/orchestrator-service/lib/insights/ingestion-service.js:775:  const totalConversions = sumNumbers(campaigns.map(item => item.conversions));
runtime/orchestrator-service/lib/insights/ingestion-service.js:776:  const totalRevenue = sumNumbers(campaigns.map(item => item.revenue));
runtime/orchestrator-service/lib/insights/ingestion-service.js:779:    : averageNumbers(campaigns.map(item => item.ctr));
runtime/orchestrator-service/lib/insights/ingestion-service.js:782:    : averageNumbers(campaigns.map(item => item.cpc));
runtime/orchestrator-service/lib/insights/ingestion-service.js:785:    : averageNumbers(campaigns.map(item => item.cpa));
runtime/orchestrator-service/lib/insights/ingestion-service.js:788:    : averageNumbers(campaigns.map(item => item.roas));
runtime/orchestrator-service/lib/insights/ingestion-service.js:790:  const rankedCampaigns = campaigns
runtime/orchestrator-service/lib/insights/ingestion-service.js:836:        campaigns.length
runtime/orchestrator-service/lib/insights/ingestion-service.js:838:      recommendation: campaigns.length
runtime/orchestrator-service/lib/insights/ingestion-service.js:839:        ? 'Keep the best CTR and lowest-CPC campaigns as the benchmark, then refresh weak creative before scaling spend.'
runtime/orchestrator-service/lib/insights/ingestion-service.js:842:    campaigns: rankedCampaigns,
runtime/orchestrator-service/lib/insights/ingestion-service.js:843:    best_campaigns: rankedCampaigns.slice(0, 4),
runtime/orchestrator-service/lib/insights/ingestion-service.js:844:    weak_campaigns: rankedCampaigns.slice().reverse().slice(0, 4),
runtime/orchestrator-service/lib/insights/ingestion-service.js:846:      name: item.campaign_name,
runtime/orchestrator-service/lib/insights/ingestion-service.js:851:      name: item.campaign_name,
runtime/orchestrator-service/lib/insights/ingestion-service.js:955:      integrations: ['facebook', 'instagram', 'tiktok', 'youtube']
runtime/orchestrator-service/lib/insights/ingestion-service.js:959:      integrations: ['meta-ads', 'google-ads', 'tiktok-ads']
runtime/orchestrator-service/lib/insights/ingestion-service.js:963:      integrations: ['website', 'ga4', 'meta-pixel', 'tiktok-pixel', 'gtm']
runtime/orchestrator-service/lib/insights/ingestion-service.js:967:      integrations: ['search-console']
runtime/orchestrator-service/lib/insights/ingestion-service.js:971:      integrations: ['woocommerce', 'shopify', 'amazon', 'ebay']
runtime/orchestrator-service/lib/insights/ingestion-service.js:973:    email_crm: {
runtime/orchestrator-service/lib/insights/ingestion-service.js:974:      status: evaluate(['smtp', 'mailchimp', 'crm']),
runtime/orchestrator-service/lib/insights/ingestion-service.js:975:      integrations: ['smtp', 'mailchimp', 'crm']
runtime/orchestrator-service/lib/insights/ingestion-service.js:978:      status: evaluate(['google-drive', 'slack', 'telegram', 'notion', 'zapier', 'make', 'webhook']),
runtime/orchestrator-service/lib/insights/ingestion-service.js:979:      integrations: ['google-drive', 'slack', 'telegram', 'notion', 'zapier', 'make', 'webhook']
runtime/orchestrator-service/lib/ops/backbone.js:8:} = require('../integrations/storage');
runtime/orchestrator-service/lib/ops/backbone.js:30:  campaigns: 150,
runtime/orchestrator-service/lib/ops/backbone.js:47:  campaigns: {
runtime/orchestrator-service/lib/ops/backbone.js:68:    intents: ['inspect', 'task', 'workflow', 'campaign', 'content', 'media', 'approval', 'recommendation']
runtime/orchestrator-service/lib/ops/backbone.js:76:    route_targets: ['campaign-studio', 'content-studio', 'media-studio', 'publishing', 'ads-manager', 'task-center', 'governance']
runtime/orchestrator-service/lib/ops/backbone.js:79:    scopes: ['project', 'campaign', 'workflow', 'channel', 'audience', 'content'],
runtime/orchestrator-service/lib/ops/backbone.js:112:    routes: ['home', 'campaign-studio', 'workflows', 'research', 'insights'],
runtime/orchestrator-service/lib/ops/backbone.js:113:    service_domains: ['campaign', 'research'],
runtime/orchestrator-service/lib/ops/backbone.js:114:    actions: ['plan_campaign', 'route_work', 'approve_strategy', 'request_research']
runtime/orchestrator-service/lib/ops/backbone.js:131:    id: 'video_lead',
runtime/orchestrator-service/lib/ops/backbone.js:147:    routes: ['ads-manager', 'campaign-studio', 'workflows', 'insights'],
runtime/orchestrator-service/lib/ops/backbone.js:148:    service_domains: ['media', 'campaign'],
runtime/orchestrator-service/lib/ops/backbone.js:168:    routes: ['home', 'settings', 'integrations', 'governance', 'workflows'],
runtime/orchestrator-service/lib/ops/backbone.js:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
runtime/orchestrator-service/lib/ops/backbone.js:176:  'campaign-studio': ['strategist', 'ads_operator', 'admin'],
runtime/orchestrator-service/lib/ops/backbone.js:178:  'media-studio': ['designer', 'video_lead', 'compliance_reviewer', 'admin'],
runtime/orchestrator-service/lib/ops/backbone.js:184:  integrations: ['admin'],
runtime/orchestrator-service/lib/ops/backbone.js:186:  library: ['designer', 'video_lead', 'publisher', 'admin'],
runtime/orchestrator-service/lib/ops/backbone.js:191:  campaign: {
runtime/orchestrator-service/lib/ops/backbone.js:196:    route_target: 'campaign-studio',
runtime/orchestrator-service/lib/ops/backbone.js:197:    page_permissions: ['campaign-studio', 'workflows', 'insights']
runtime/orchestrator-service/lib/ops/backbone.js:203:    handoff_to: ['designer', 'video_lead', 'publisher', 'compliance_reviewer'],
runtime/orchestrator-service/lib/ops/backbone.js:242:  campaign: 'campaign',
runtime/orchestrator-service/lib/ops/backbone.js:391:        service_domains: ['campaign', 'content', 'media', 'publishing', 'research', 'governance']
runtime/orchestrator-service/lib/ops/backbone.js:418:    escalation_chain: ESCALATION_CHAINS,
runtime/orchestrator-service/lib/ops/backbone.js:440:    escalation_chain: {
runtime/orchestrator-service/lib/ops/backbone.js:441:      ...defaults.escalation_chain,
runtime/orchestrator-service/lib/ops/backbone.js:442:      ...asObject(current.escalation_chain),
runtime/orchestrator-service/lib/ops/backbone.js:443:      ...asObject(patch.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:512:  if (routeTarget === 'campaign-studio' || routeTarget === 'ads-manager') return 'campaign';
runtime/orchestrator-service/lib/ops/backbone.js:521:  return 'campaign';
runtime/orchestrator-service/lib/ops/backbone.js:532:      ownerRole = 'video_lead';
runtime/orchestrator-service/lib/ops/backbone.js:781:    campaignsPath: path.join(opsDir, 'campaigns.json'),
runtime/orchestrator-service/lib/ops/backbone.js:785:    aiCommandsPath: path.join(opsDir, 'ai-commands.json'),
runtime/orchestrator-service/lib/ops/backbone.js:813:      'campaigns',
runtime/orchestrator-service/lib/ops/backbone.js:830:  ensureJsonFile(paths.campaignsPath, []);
runtime/orchestrator-service/lib/ops/backbone.js:861:      content: 'Marketing lead',
runtime/orchestrator-service/lib/ops/backbone.js:862:      media: 'Creative lead',
runtime/orchestrator-service/lib/ops/backbone.js:863:      campaign: 'Operations lead',
runtime/orchestrator-service/lib/ops/backbone.js:902:      'campaigns',
runtime/orchestrator-service/lib/ops/backbone.js:974:  if (value.includes('campaign') || value.includes('content') || value.includes('media') || value.includes('task')) return 'entity';
runtime/orchestrator-service/lib/ops/backbone.js:1319:  if (normalizedType === 'campaign') {
runtime/orchestrator-service/lib/ops/backbone.js:1320:    return findById(readCollection(paths.campaignsPath), normalizedId);
runtime/orchestrator-service/lib/ops/backbone.js:1478:  const campaigns = readCollection(paths.campaignsPath);
runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
runtime/orchestrator-service/lib/ops/backbone.js:1574:  const escalationQueue = [
runtime/orchestrator-service/lib/ops/backbone.js:1575:    ...escalationApprovals,
runtime/orchestrator-service/lib/ops/backbone.js:1589:        campaign: roleDisplay(team, 'strategist'),
runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
runtime/orchestrator-service/lib/ops/backbone.js:1610:      escalation_queue: escalationQueue
runtime/orchestrator-service/lib/ops/backbone.js:1613:      campaigns: campaigns.length,
runtime/orchestrator-service/lib/ops/backbone.js:1635:      campaign_id: item.campaign_id,
runtime/orchestrator-service/lib/ops/backbone.js:1662:      campaign_id: job.campaign_id,
runtime/orchestrator-service/lib/ops/backbone.js:1675:  const items = readCollection(paths.campaignsPath);
runtime/orchestrator-service/lib/ops/backbone.js:1686:  const routing = inferPrimaryRole('campaign', input, team);
runtime/orchestrator-service/lib/ops/backbone.js:1687:  const campaign = {
runtime/orchestrator-service/lib/ops/backbone.js:1688:    id: asString(current.id) || asString(input.id) || createId('campaign'),
runtime/orchestrator-service/lib/ops/backbone.js:1704:    service_domain: 'campaign',
runtime/orchestrator-service/lib/ops/backbone.js:1720:      current.id ? 'campaign_updated' : 'campaign_created',
runtime/orchestrator-service/lib/ops/backbone.js:1729:  writeCollection(paths.campaignsPath, upsertById(items, campaign), MAX_ITEMS.campaigns);
runtime/orchestrator-service/lib/ops/backbone.js:1732:    type: current.id ? 'campaign_updated' : 'campaign_created',
runtime/orchestrator-service/lib/ops/backbone.js:1733:    entity_type: 'campaign',
runtime/orchestrator-service/lib/ops/backbone.js:1734:    entity_id: campaign.id,
runtime/orchestrator-service/lib/ops/backbone.js:1735:    title: campaign.name,
runtime/orchestrator-service/lib/ops/backbone.js:1741:      status: campaign.status,
runtime/orchestrator-service/lib/ops/backbone.js:1742:      lifecycle_state: campaign.lifecycle_state
runtime/orchestrator-service/lib/ops/backbone.js:1746:  return campaign;
runtime/orchestrator-service/lib/ops/backbone.js:1751:  return listItems(readCollection(paths.campaignsPath), options);
runtime/orchestrator-service/lib/ops/backbone.js:1754:function getCampaign(projectName, campaignId) {
runtime/orchestrator-service/lib/ops/backbone.js:1756:  return findById(readCollection(paths.campaignsPath), campaignId);
runtime/orchestrator-service/lib/ops/backbone.js:1820:    campaign_id: asString(input.campaign_id || current.campaign_id),
runtime/orchestrator-service/lib/ops/backbone.js:1834:    linked_campaign: asString(input.linked_campaign || current.linked_campaign || input.campaign_id),
runtime/orchestrator-service/lib/ops/backbone.js:1876:      campaign_id: item.campaign_id,
runtime/orchestrator-service/lib/ops/backbone.js:1889:  const campaignId = asString(options.campaign_id);
runtime/orchestrator-service/lib/ops/backbone.js:1890:  const filtered = campaignId
runtime/orchestrator-service/lib/ops/backbone.js:1891:    ? items.filter((item) => asString(item.campaign_id) === campaignId)
runtime/orchestrator-service/lib/ops/backbone.js:1967:    campaign_id: asString(input.campaign_id || current.campaign_id),
runtime/orchestrator-service/lib/ops/backbone.js:2021:  const campaignId = asString(options.campaign_id);
runtime/orchestrator-service/lib/ops/backbone.js:2024:    if (campaignId && asString(item.campaign_id) !== campaignId) {
runtime/orchestrator-service/lib/ops/backbone.js:2164:    source: asString(input.source || current.source) || 'ai-command',
runtime/orchestrator-service/lib/ops/backbone.js:2584:  const escalationChain = normalizeStringList(input.escalation_chain || current.escalation_chain).length
runtime/orchestrator-service/lib/ops/backbone.js:2585:    ? normalizeStringList(input.escalation_chain || current.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:2615:    escalation_chain: escalationChain,
runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
runtime/orchestrator-service/lib/ops/backbone.js:2760:  const escalationChain = normalizeStringList(current.escalation_chain).length
runtime/orchestrator-service/lib/ops/backbone.js:2761:    ? normalizeStringList(current.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:2763:  const escalationTargetRole = normalizeRoleKey(
runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
runtime/orchestrator-service/lib/ops/backbone.js:2766:      escalationChain[0] ||
runtime/orchestrator-service/lib/ops/backbone.js:2777:    escalation_chain: escalationChain,
runtime/orchestrator-service/lib/ops/backbone.js:2791:        escalate_to: escalationTargetRole
runtime/orchestrator-service/lib/ops/backbone.js:2835:      escalate_to: escalationTargetRole
runtime/orchestrator-service/lib/ops/backbone.js:2899:      description: next.decision_note || 'Governance escalation requires follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:2900:      owner: roleDisplay(team, escalationTargetRole),
runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
runtime/orchestrator-service/lib/ops/backbone.js:2902:      assignee: roleDisplay(team, escalationTargetRole),
runtime/orchestrator-service/lib/ops/backbone.js:2903:      assignee_role: escalationTargetRole,
runtime/orchestrator-service/lib/ops/backbone.js:3375:  if (normalizedType === 'campaign') return 'campaign-studio';
runtime/orchestrator-service/lib/ops/backbone.js:3481:      route: 'integrations',
runtime/orchestrator-service/lib/ops/backbone.js:3697:        route_label: 'integrations'
runtime/orchestrator-service/lib/ops/backbone.js:3744:        route_label: 'integrations'
runtime/orchestrator-service/lib/ops/backbone.js:3752:        route_label: 'integrations'
runtime/orchestrator-service/lib/ops/backbone.js:3830:  const campaigns = readCollection(paths.campaignsPath);
runtime/orchestrator-service/lib/ops/backbone.js:3853:  const campaignLimit = Number(options.campaignLimit || 8) || 8;
runtime/orchestrator-service/lib/ops/backbone.js:3858:    ...campaigns,
runtime/orchestrator-service/lib/ops/backbone.js:3911:      escalation_chain: asObject(team.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:3932:      escalation_chain: asObject(team.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:3951:    campaigns: {
runtime/orchestrator-service/lib/ops/backbone.js:3952:      total: campaigns.length,
runtime/orchestrator-service/lib/ops/backbone.js:3953:      active_count: campaigns.filter((item) => asString(item.status) === 'active').length,
runtime/orchestrator-service/lib/ops/backbone.js:3954:      items: campaigns.slice(0, campaignLimit)
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:2:const { readJsonFile } = require('../integrations/storage');
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:15:} = require('../ai/provider-registry');
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:120:  campaign: 'campaign-studio',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:130:  campaign: 'campaign_package',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:139:  strategist: 'campaign',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:143:  video_lead: 'content',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:211:    : specialistId === 'video_lead'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:327:  if (intent === 'campaign') return 'campaign-studio';
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:361:      intent: 'campaign',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:362:      modeId: 'campaign',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:363:      actionType: 'campaign_generation',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:364:      outputType: 'campaign_package',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:365:      pattern: /\b(build|launch|create|generate|develop|plan)\b.{0,40}\b(campaign|market entry|growth plan)\b|\b(campaign plan|marketing campaign|launch campaign|build campaign|market entry|growth plan)\b/
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:420:  if (matches(/\b(approve|approval|review)\b/) && !['ads', 'content', 'campaign'].includes(intent)) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:440:function collectConnectedIntegrations(integrations = {}) {
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:441:  const root = asObject(integrations);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:483:  const integrations = asObject(connectors.control_center);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:498:    integrations,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:522:      connected_integrations: collectConnectedIntegrations({
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:523:        ...integrations,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:640:    concept: humanizeValue(record.concept || record.campaignConcept || record.campaign_concept || record.name),
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:705:  const campaignPackage = outputType === 'campaign_package'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:706:    ? normalizeCampaignPackage(providerOutput.campaignPackage || providerOutput.raw?.campaignPackage || providerOutput.raw?.campaign_package, context)
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:724:  const structuredNextActions = campaignPackage?.nextActions?.length ? campaignPackage.nextActions : [];
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:736:    ...(outputType === 'campaign_package'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:738:        normalizeRouteSuggestion('content-studio', 'Turn campaign angles into draft content.'),
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:779:      context.summary.connected_integrations.length
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:780:        ? `Connected integrations in context: ${context.summary.connected_integrations.join(', ')}.`
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:788:    campaignPackage,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:811:  const campaign = asString(inputs.campaign || context.summary.project_name || context.project);
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:818:      : workflowId === 'launch-new-campaign'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:819:        ? 'campaign-studio'
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:826:    summary: `${titleCase(workflowId)} prepared for ${campaign} with ${goal} as the primary target and ${audience} as the main audience.`,
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:872:          route: 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:875:          source: asString(input.source) || 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:905:          route: 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:981:            workflow_id: 'ai-command-orchestration',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:984:            source: 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1016:            source_page: 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1045:          source: input.source || 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1061:          route: 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1114:          source: input.source || 'ai-command',
runtime/orchestrator-service/lib/ops/ai-orchestrator.js:1123:          route: 'ai-command',
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js:21:      voice: Boolean(input.capabilities?.voice),
runtime/orchestrator-service/lib/customer-operations/channels/registry/channel-registry-store.js:27:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:40:    channel_id: 'voice',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:41:    provider: 'ivr',
runtime/orchestrator-service/lib/customer-operations/channels/registry/default-channels.js:44:      voice: true,
runtime/orchestrator-service/lib/customer-operations/channels/README.md:11:- voice/ivr
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:4:const ticketStore = require('./tickets/store/ticket-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:10:const slaPolicyStore = require('./sla/store/sla-policy-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:12:const escalationStore = require('./escalation/store/escalation-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:14:const unifiedInboxStore = require('./unified-inbox/store/unified-inbox-store');
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:47:    unifiedInbox: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:48:      create: unifiedInboxStore.createInboxEntry,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:49:      get: unifiedInboxStore.getInboxEntry,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:50:      list: unifiedInboxStore.listInboxEntries,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:51:      update: unifiedInboxStore.updateInboxEntry
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:54:    escalation: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:55:      create: escalationStore.createEscalation,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:56:      get: escalationStore.getEscalation,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:57:      list: escalationStore.listEscalations,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:58:      update: escalationStore.updateEscalation
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:61:    sla: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:62:      create: slaPolicyStore.createSlaPolicy,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:63:      get: slaPolicyStore.getSlaPolicy,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:64:      list: slaPolicyStore.listSlaPolicies,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:65:      update: slaPolicyStore.updateSlaPolicy
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:87:    tickets: {
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:88:      create: ticketStore.createTicket,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:89:      get: ticketStore.getTicket,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:90:      list: ticketStore.listTickets,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:91:      update: ticketStore.updateTicket
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:96:        runtime: 'mh-os-customer-operations',
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:100:          tickets: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:104:          sla: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:105:          escalation: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:106:          unified_inbox: true,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:107:          voice: false,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:108:          ivr: false,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:109:          outreach: false,
runtime/orchestrator-service/lib/customer-operations/customer-operations-runtime.js:110:          crm: false
runtime/orchestrator-service/lib/customer-operations/conversations/README.md:6:- inbox threads
runtime/orchestrator-service/lib/customer-operations/registry/README.md:6:- escalation ownership
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:5:    inbox_id: String(input.inbox_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:42:    sla: {
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:43:      policy_id: String(input.sla?.policy_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:44:      breached: Boolean(input.sla?.breached || false)
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:47:    escalation: {
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:48:      active: Boolean(input.escalation?.active || false),
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:49:      escalation_id: String(
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:50:        input.escalation?.escalation_id || ''
runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js:57:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:22:      type: String(input.segmentation?.type || 'lead'),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:29:    crm: {
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:30:      owner: String(input.crm?.owner || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:31:      stage: String(input.crm?.stage || 'new'),
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:32:      source: String(input.crm?.source || '')
runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js:43:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:19:    escalation: {
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:20:      level: Number(input.escalation?.level || 0),
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:21:      queue: String(input.escalation?.queue || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:22:      requires_human: Boolean(input.escalation?.requires_human || false)
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:25:    sla: {
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:26:      response_due_at: input.sla?.response_due_at || null,
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:27:      resolution_due_at: input.sla?.resolution_due_at || null
runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js:32:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:5:- ticket contracts
runtime/orchestrator-service/lib/customer-operations/contracts/README.md:9:- escalation contracts
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:28:    escalation: {
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:29:      enabled: Boolean(input.escalation?.enabled ?? true),
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:32:        input.escalation?.human_handoff_minutes || 120
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:35:      escalation_queue: String(
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:36:        input.escalation?.escalation_queue || 'customer-care'
runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js:53:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:5:    escalation_id: String(input.escalation_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:23:      escalation_queue: String(
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:24:        input.routing?.escalation_queue || 'default'
runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js:55:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js:39:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:5:    ticket_id: String(input.ticket_id || ''),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:16:    escalation: {
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:17:      level: Number(input.escalation?.level || 0),
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:18:      state: String(input.escalation?.state || 'none')
runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js:33:      source_runtime: 'mh-os-customer-operations'
runtime/orchestrator-service/lib/customer-operations/sla/store/sla-policy-store.js:5:} = require('../../contracts/sla-policy-contract');
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:5:} = require('../../contracts/ticket-contract');
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:7:const tickets = new Map();
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:10:  const ticket = createTicketContract(input);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:12:  if (!ticket.ticket_id) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:13:    throw new Error('ticket_id is required');
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:16:  tickets.set(ticket.ticket_id, ticket);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:18:  return ticket;
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:21:function getTicket(ticketId) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:22:  return tickets.get(String(ticketId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:26:  return Array.from(tickets.values());
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:29:function updateTicket(ticketId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:30:  const current = getTicket(ticketId);
runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js:45:  tickets.set(current.ticket_id, updated);
runtime/orchestrator-service/lib/customer-operations/tickets/README.md:6:- ticket creation
runtime/orchestrator-service/lib/customer-operations/tickets/README.md:7:- escalation
runtime/orchestrator-service/lib/customer-operations/README.md:6:- tickets
runtime/orchestrator-service/lib/customer-operations/README.md:7:- unified inbox
runtime/orchestrator-service/lib/customer-operations/README.md:9:- SLA / escalation
runtime/orchestrator-service/lib/customer-operations/README.md:11:- outreach
runtime/orchestrator-service/lib/customer-operations/README.md:12:- voice / IVR
runtime/orchestrator-service/lib/customer-operations/README.md:20:- Reuse governance/escalation systems.
runtime/orchestrator-service/lib/customer-operations/README.md:22:- No direct production integrations before contracts stabilize.
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:5:} = require('../../contracts/unified-inbox-contract');
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:7:const inboxEntries = new Map();
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:12:  if (!entry.inbox_id) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:13:    throw new Error('inbox_id is required');
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:16:  inboxEntries.set(entry.inbox_id, entry);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:21:function getInboxEntry(inboxId) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:22:  return inboxEntries.get(String(inboxId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:26:  return Array.from(inboxEntries.values());
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:29:function updateInboxEntry(inboxId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:30:  const current = getInboxEntry(inboxId);
runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js:45:  inboxEntries.set(current.inbox_id, updated);
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:5:} = require('../../contracts/escalation-contract');
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:7:const escalations = new Map();
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:10:  const escalation = createEscalationContract(input);
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:12:  if (!escalation.escalation_id) {
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:13:    throw new Error('escalation_id is required');
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:16:  escalations.set(escalation.escalation_id, escalation);
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:18:  return escalation;
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:21:function getEscalation(escalationId) {
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:22:  return escalations.get(String(escalationId || '')) || null;
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:26:  return Array.from(escalations.values());
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:29:function updateEscalation(escalationId, updates = {}) {
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:30:  const current = getEscalation(escalationId);
runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js:45:  escalations.set(current.escalation_id, updated);
runtime/orchestrator-service/lib/integrations/sync-history.js:10:  const dir = path.join(projectPaths.integrationsDir, 'snapshots');
runtime/orchestrator-service/lib/integrations/sync-history.js:16:  return path.join(projectPaths.integrationsDir, 'sync-history.json');
runtime/orchestrator-service/lib/integrations/adapter-manager.js:1:const { getProviderAdapter } = require('./provider-registry');
runtime/orchestrator-service/lib/integrations/providers/google.js:149:    url: `https://googleads.googleapis.com/v18/customers/${customerId.replace(/-/g, '')}`,
runtime/orchestrator-service/lib/integrations/providers/google.js:477:    readScopes: ['ads', 'campaigns', 'insights'],
runtime/orchestrator-service/lib/integrations/providers/ops.js:8:    url: 'https://slack.com/api/auth.test',
runtime/orchestrator-service/lib/integrations/providers/ops.js:13:  const error = buildResponseError('slack', response, 'Slack auth test failed');
runtime/orchestrator-service/lib/integrations/providers/ops.js:27:      provider: 'slack',
runtime/orchestrator-service/lib/integrations/providers/ops.js:281:    permissionScope: 'Mailchimp audience and campaign access',
runtime/orchestrator-service/lib/integrations/providers/ops.js:295:    if (ctx.integrationId === 'slack') return connectSlack(ctx);
runtime/orchestrator-service/lib/integrations/providers/ops.js:311:  integrationIds: ['slack', 'telegram', 'notion', 'webhook', 'zapier-make', 'custom-analytics', 'linkedin', 'mailchimp'],
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:145:    readScopes: ['ads', 'campaigns', 'insights'],
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:162:      dimensions: ['campaign_id', 'campaign_name'],
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:179:      campaigns: asArray(data?.data?.list).map((item) => ({
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:180:        campaign_id: item.dimensions?.campaign_id || '',
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:181:        campaign_name: item.dimensions?.campaign_name || '',
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:189:    notes: 'Synced TikTok Ads campaign performance.',
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:191:      campaigns: asArray(data?.data?.list).length
runtime/orchestrator-service/lib/integrations/providers/tiktok.js:194:    readScopes: ['ads', 'campaigns', 'insights']
runtime/orchestrator-service/lib/integrations/providers/meta.js:246:    readScopes: ['ads', 'campaigns', 'insights'],
runtime/orchestrator-service/lib/integrations/providers/meta.js:261:    fields: 'campaign_name,spend,impressions,clicks,cpc,ctr',
runtime/orchestrator-service/lib/integrations/providers/meta.js:275:      campaigns: asArray(insights.data).map((item) => ({
runtime/orchestrator-service/lib/integrations/providers/meta.js:276:        campaign_name: item.campaign_name || '',
runtime/orchestrator-service/lib/integrations/providers/meta.js:284:    notes: 'Synced Meta Ads campaign metrics.',
runtime/orchestrator-service/lib/integrations/providers/meta.js:286:      campaigns: asArray(insights.data).length
runtime/orchestrator-service/lib/integrations/providers/meta.js:289:    readScopes: ['ads', 'campaigns', 'insights']
runtime/orchestrator-service/lib/integrations/audit-log.js:5:  return path.join(projectPaths.integrationsDir, 'audit-log.json');
runtime/orchestrator-service/lib/integrations/insights-contract.js:22:  if (/ads|campaign/.test(scopeText)) return 'ads';
runtime/orchestrator-service/lib/integrations/insights-contract.js:26:  if (/email|audience|contact|crm/.test(scopeText)) return 'crm_email';
runtime/orchestrator-service/lib/integrations/insights-contract.js:45:    ad_entities: asArray(payload.campaigns),
runtime/orchestrator-service/lib/integrations/provider-registry.js:12:const UNSUPPORTED_INTEGRATION_IDS = ['amazon', 'smtp', 'mailer', 'crm'];
runtime/orchestrator-service/lib/execution/smart-suggestions.js:30:      next_campaign_idea: topProduct
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:62:      const campaignPackage = resolveCampaignPackageForAds(project, payload);
runtime/orchestrator-service/lib/execution/execution-job-bridge.js:63:      const adPackage = buildAdExecutionPackage(campaignPackage, payload);
runtime/orchestrator-service/lib/execution/recommendation-runtime.js:39:          `Reuse hook "${hook.key}" across adjacent campaigns (avg score ${hook.avg_score}).`
runtime/orchestrator-service/lib/ai/providers/openai.js:241:      campaignPackage: parsed.campaignPackage || parsed.campaign_package || null,
runtime/orchestrator-service/lib/ai/providers/openai.js:264:    campaignPackage: null,
runtime/orchestrator-service/lib/ai/providers/openai.js:294:              'Use the supplied project context, market, brand voice, readiness blockers, integrations, learning, and research notes.',
runtime/orchestrator-service/lib/ai/providers/openai.js:302:              'For outputType "campaign_package", include campaignPackage with concept, targetAudience, offer, products, channels, launchPhases, contentAngles, adAngles, requiredAssets, missingBlockers, nextActions, suggestedHandoffs.',
runtime/orchestrator-service/lib/ai/providers/openai.js:382:        route: 'ai-command',
runtime/orchestrator-service/lib/ai/providers/openai.js:403:        campaignPackage: normalized.campaignPackage,
runtime/orchestrator-service/lib/ai/provider-config.js:33:  campaign: {
runtime/orchestrator-service/lib/ai/provider-config.js:35:    purpose: 'campaign concepts, launch plans, channel mix, audience segments, and offer strategy',
runtime/orchestrator-service/lib/ai/provider-config.js:36:    outputType: 'campaign_package',
runtime/orchestrator-service/lib/ai/provider-config.js:39:      'Build campaign concepts, launch plans, channel mix, audience segments, offer strategy, launch phases, assets, blockers, and handoffs.',
runtime/orchestrator-service/lib/ai/provider-config.js:40:      'When the command asks to build, launch, or plan a campaign, return a complete campaign package.'
runtime/orchestrator-service/lib/ai/provider-config.js:98:    campaign_strategist: 'campaign',
runtime/orchestrator-service/lib/media/provider-layer.js:82:  const voiceProvider = firstText(env.MEDIA_VOICE_PROVIDER, 'openai').toLowerCase();
runtime/orchestrator-service/lib/media/provider-layer.js:100:    voiceProvider: {
runtime/orchestrator-service/lib/media/provider-layer.js:101:      id: voiceProvider,
runtime/orchestrator-service/lib/media/provider-layer.js:102:      configured: voiceProvider === 'elevenlabs' ? Boolean(elevenLabsApiKey) : openAiConfigured
runtime/orchestrator-service/lib/media/provider-layer.js:346:    if (!availability.voiceProvider.configured) {
runtime/orchestrator-service/lib/media/provider-layer.js:351:      systemPrompt: 'You are a voice director. Return only a voiceover script with scene timing markers.',
runtime/orchestrator-service/lib/media/provider-layer.js:355:        `Format: ${firstText(payload.format, 'short-form video voiceover')}`,
runtime/orchestrator-service/lib/media/provider-layer.js:360:        'Generate a usable voice script with hook, timed beats, and close CTA.'
runtime/orchestrator-service/lib/media/provider-layer.js:373:      voice_script: asString(result.text)
runtime/orchestrator-service/lib/media/provider-layer.js:391:      systemPrompt: 'You generate campaign media packs. Return valid JSON only.',
runtime/orchestrator-service/lib/media/provider-layer.js:393:        'Return JSON with keys: image_prompt, video_brief, voice_script, channel_notes, publishing_notes.',
runtime/orchestrator-service/lib/media/provider-layer.js:394:        `Objective: ${firstText(payload.objective, 'Create a complete campaign media pack')}`,
runtime/orchestrator-service/lib/media/provider-layer.js:416:      campaign_pack: {
runtime/orchestrator-service/lib/media/provider-layer.js:419:        voice_script: asString(parsed.voice_script),
runtime/orchestrator-service/lib/media/native/capabilities/local-rendering-capabilities.js:42:      voice_chat: hasPython && hasFfmpeg
runtime/orchestrator-service/lib/media/native/models/default-models.js:20:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/models/default-models.js:21:      category: 'realtime-voice',
runtime/orchestrator-service/lib/media/native/models/default-models.js:81:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:3:  "purpose": "Defines voice and audio direction for generated voiceovers and audio assets.",
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:4:  "voice_style": {
runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json:7:    "delivery": "natural commercial voice, not robotic, not exaggerated",
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:79:      media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/adapters/openai-provider-adapter.js:81:      message: 'Realtime voice execution adapter is registered but not implemented yet.'
runtime/orchestrator-service/lib/media/native/providers/adapters/README.md:7:- OpenAI realtime voice placeholder
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:10:    media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:11:    prompt: 'Start realtime voice session placeholder'
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router-demo.js:30:    openai_voice_check: openAiImageDryCheck,
runtime/orchestrator-service/lib/media/native/providers/router/provider-execution-router.js:31:      if (mediaType === 'voice_chat') {
runtime/orchestrator-service/lib/media/native/providers/router/README.md:7:- openai/voice_chat -> OpenAI realtime placeholder
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:140:    media_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:141:    category: 'realtime-voice',
runtime/orchestrator-service/lib/media/native/providers/provider-model-catalog.js:146:    notes: 'OpenAI realtime voice provider target. Exact model/version depends on API availability.'
runtime/orchestrator-service/lib/media/native/execution/native-runtime-demo.js:18:    brand_voice: 'premium, clean, trustworthy',
runtime/orchestrator-service/lib/media/native/execution/README.md:16:- realtime voice
runtime/orchestrator-service/lib/media/native/rendering/rendering-engine-registry.js:6:const { createVoiceChatRenderingAdapter } = require('./rendering-voice-chat-adapter');
runtime/orchestrator-service/lib/media/native/rendering/rendering-engine-registry.js:13:    voice_chat: createVoiceChatRenderingAdapter(options)
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:6:    engine: 'native-voice-chat-renderer',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:8:    output_type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:9:    message: 'Native voice chat rendering engine is not connected yet.',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:21:    id: 'native-voice-chat-renderer',
runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js:22:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/rendering/rendering-audio-adapter.js:13:      voice_script: request.voice_script || '',
runtime/orchestrator-service/lib/media/native/native-engine-registry.js:6:const { createNativeVoiceChatRuntime } = require('./native-voice-chat-runtime');
runtime/orchestrator-service/lib/media/native/native-engine-registry.js:13:    voiceChat: createNativeVoiceChatRuntime(options)
runtime/orchestrator-service/lib/media/native/intelligence/native-media-intelligence.js:19:        brand_voice_audio: knowledge.brandVoiceAudioGuide?.version || 'unknown'
runtime/orchestrator-service/lib/media/native/intelligence/media-knowledge-loader.js:20:    brandVoiceAudioGuide: readJsonSafe('brand-voice-audio-guide.json'),
runtime/orchestrator-service/lib/media/native/intelligence/media-knowledge-loader.js:24:    voiceToneProfiles: readJsonSafe('voice-tone-profiles.json', { profiles: {} }),
runtime/orchestrator-service/lib/media/native/intelligence/media-quality-scorer.js:13:  const prompt = asText(plan.prompt || plan.video_brief || plan.voice_script || plan.description);
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:39:  const campaignGoal = asText(input.goal || input.intent, 'premium product promotion');
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:41:  const brandVoice = asText(input.brand_voice || input.tone, 'premium, clear, trustworthy');
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:43:  const shotPattern = pickShotPattern(knowledge, campaignGoal);
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:44:  const hook = pickHook(knowledge, campaignGoal);
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:58:    campaign_goal: campaignGoal,
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:60:    brand_voice: brandVoice,
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:72:    audio_direction: knowledge.brandVoiceAudioGuide?.voice_style || {},
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:88:    `Goal: ${brief.campaign_goal}`,
runtime/orchestrator-service/lib/media/native/intelligence/media-prompt-intelligence.js:90:    `Brand voice: ${brief.brand_voice}`,
runtime/orchestrator-service/lib/media/native/native-audio-runtime.js:8:    prompt: String(payload.prompt || payload.voice_script || ''),
runtime/orchestrator-service/lib/media/native/native-audio-runtime.js:9:    voice_script: String(payload.voice_script || ''),
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:5:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:14:      runtime: 'native-voice-chat-runtime'
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:21:    id: 'native-voice-chat',
runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js:22:    type: 'voice_chat',
runtime/orchestrator-service/lib/media/native/provider-bridge.js:11:    if (type === 'audio' || type === 'voice') return nativeRegistry.audio;
runtime/orchestrator-service/lib/media/native/provider-bridge.js:12:    if (type === 'voice_chat') return nativeRegistry.voiceChat;
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:25:  'campaign-execution': {
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:26:    legacy: 'campaign-execution',
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:27:    canonical: 'campaign-execution'
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:29:  'campaign-finalization': {
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:30:    legacy: 'campaign-finalization',
runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js:31:    canonical: 'campaign-finalization'
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:61:      campaign_execution_read_canonical_first: parseBooleanFlag(
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:65:      campaign_finalization_read_canonical_first: parseBooleanFlag(
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:114:      'campaign-execution': 'campaign_execution_read_canonical_first',
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:115:      'campaign-finalization': 'campaign_finalization_read_canonical_first',
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:261:      'campaign-execution',
runtime/orchestrator-service/lib/data/unified-data-path-resolver.js:262:      'campaign-finalization',
public/control-center/asset-library.js:27:    description: "Brand identity, voice, visual rules, and usage guidance.",
public/control-center/asset-library.js:43:    description: "Structured product data for planning, content, and campaign packaging.",
public/control-center/asset-library.js:61:      what_to_upload: "Price lists, offer sheets, bundles, campaign discounts, coupons, and margin guardrails.",
public/control-center/asset-library.js:117:    purpose: "campaign_social",
public/control-center/asset-library.js:121:    target_folder: "campaigns",
public/control-center/asset-library.js:131:    asset_type: "campaign_assets",
public/control-center/asset-library.js:133:    purpose: "campaign_social",
public/control-center/asset-library.js:137:    target_folder: "campaigns",
public/control-center/asset-library.js:138:    aliases: ["campaign_asset", "creative_assets", "ad_assets"],
public/control-center/asset-library.js:142:      why_it_matters: "Campaign Studio and Publishing need a reusable package for each campaign or wave.",
public/control-center/asset-library.js:216:  "campaign_social",
public/control-center/runtime/lifecycle/README.md:192:2. Major pages (library.js, integrations.js, workflows.js, publishing.js, etc.)
public/control-center/runtime/authority/route-role-fallback.js:7:  "video_lead",
public/control-center/runtime/authority/route-role-fallback.js:17:  "ai-command": ACTIVE_ROUTE_ROLES,
public/control-center/runtime/authority/route-role-fallback.js:18:  "campaign-studio": ["strategist", "ads_operator", "admin"],
public/control-center/runtime/authority/route-role-fallback.js:20:  "media-studio": ["designer", "video_lead", "compliance_reviewer", "admin"],
public/control-center/runtime/authority/route-role-fallback.js:31:  integrations: ["admin"],
public/control-center/runtime/authority/route-role-fallback.js:33:  library: ["designer", "video_lead", "publisher", "admin"],
public/control-center/shared-context.js:1:const campaignCache = new Map();
public/control-center/shared-context.js:34:export function setSharedCampaignRecord(projectName, campaign) {
public/control-center/shared-context.js:35:  if (!projectName || !campaign) return;
public/control-center/shared-context.js:36:  campaignCache.set(buildKey(projectName), campaign);
public/control-center/shared-context.js:40:  const cached = campaignCache.get(buildKey(projectName));
public/control-center/shared-context.js:43:  const campaigns = asArray(operations?.campaigns?.items);
public/control-center/shared-context.js:45:    campaigns.find((item) => item?.active !== false) ||
public/control-center/shared-context.js:46:    campaigns[0] ||
public/control-center/shared-context.js:62:    getLatestHandoffFromOperations(operations, "workflows", "ai-command") ||
public/control-center/shared-context.js:63:    getLatestHandoffFromOperations(operations, "ai-command", "workflows") ||
public/control-center/styles/08-components-foundation.css:30:  transform: translateY(-1px);
public/control-center/styles/08-components-foundation.css:687:  transform: translateX(-100%);
public/control-center/styles/08-components-foundation.css:788:    transform: translateX(100%);
public/control-center/styles/12-pages.css:345:    transform: translateY(2px);
public/control-center/styles/12-pages.css:350:    transform: translateY(0);
public/control-center/styles/12-pages.css:1612:  transform: translateX(20px);
public/control-center/styles/12-pages.css:1779:  transform: translateY(-1px);
public/control-center/styles/12-pages.css:2056:  transform: translateX(18px);
public/control-center/styles/12-pages.css:2130:  transform: translateY(-1px);
public/control-center/styles/12-pages.css:3618:[data-page="ai-command"] {
public/control-center/styles/12-pages.css:3624:[data-page="ai-command"] .aicmd-v2-shell {
public/control-center/styles/12-pages.css:3633:[data-page="ai-command"] .aicmd-v2-header {
public/control-center/styles/12-pages.css:3641:[data-page="ai-command"] .aicmd-v2-header-meta,
public/control-center/styles/12-pages.css:3642:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:3649:[data-page="ai-command"] .aicmd-v2-header-meta {
public/control-center/styles/12-pages.css:3654:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:3658:[data-page="ai-command"] .aicmd-v2-meta-chip {
public/control-center/styles/12-pages.css:3669:[data-page="ai-command"] .aicmd-v2-meta-chip.is-project {
public/control-center/styles/12-pages.css:3673:[data-page="ai-command"] .aicmd-v2-meta-chip span,
public/control-center/styles/12-pages.css:3674:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:3679:[data-page="ai-command"] .aicmd-v2-meta-chip span {
public/control-center/styles/12-pages.css:3685:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:3692:[data-page="ai-command"] .aicmd-v2-body {
public/control-center/styles/12-pages.css:3698:[data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:3705:[data-page="ai-command"] .aicmd-v2-mode-toggle {
public/control-center/styles/12-pages.css:3713:[data-page="ai-command"] .aicmd-v2-toggle-btn {
public/control-center/styles/12-pages.css:3721:[data-page="ai-command"] .aicmd-v2-toggle-btn.is-active {
public/control-center/styles/12-pages.css:3726:[data-page="ai-command"] .aicmd-v2-team-mission {
public/control-center/styles/12-pages.css:3733:[data-page="ai-command"] .aicmd-v2-team-mission-label,
public/control-center/styles/12-pages.css:3734:[data-page="ai-command"] .aicmd-v2-team-mission-text {
public/control-center/styles/12-pages.css:3738:[data-page="ai-command"] .aicmd-v2-team-mission-label {
public/control-center/styles/12-pages.css:3742:[data-page="ai-command"] .aicmd-v2-rail-head {
public/control-center/styles/12-pages.css:3752:[data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:3756:[data-page="ai-command"] .aicmd-v2-spec-btn {
public/control-center/styles/12-pages.css:3764:[data-page="ai-command"] .aicmd-v2-spec-btn:hover {
public/control-center/styles/12-pages.css:3769:[data-page="ai-command"] .aicmd-v2-spec-btn.is-active {
public/control-center/styles/12-pages.css:3777:[data-page="ai-command"] .aicmd-v2-spec-icon {
public/control-center/styles/12-pages.css:3786:[data-page="ai-command"] .aicmd-v2-spec-name {
public/control-center/styles/12-pages.css:3790:[data-page="ai-command"] .aicmd-v2-spec-summary {
public/control-center/styles/12-pages.css:3794:[data-page="ai-command"] .aicmd-v2-main {
public/control-center/styles/12-pages.css:3801:[data-page="ai-command"] .aicmd-v2-composer,
public/control-center/styles/12-pages.css:3802:[data-page="ai-command"] .aicmd-v2-profile,
public/control-center/styles/12-pages.css:3803:[data-page="ai-command"] .aicmd-v2-tools,
public/control-center/styles/12-pages.css:3804:[data-page="ai-command"] .aicmd-v2-chat,
public/control-center/styles/12-pages.css:3805:[data-page="ai-command"] .aicmd-v2-preview,
public/control-center/styles/12-pages.css:3806:[data-page="ai-command"] .aicmd-v2-context,

---

## Post AI Team Phase 4 Checkpoint Update

AI Team Phase 4 / 4A / 4B was completed, committed, and pushed before this Customer Operations bridge is committed.

Saved AI Team checkpoint:
- 5c8a100 Add AI Team phase 4 saved checkpoint
- c1b368b Rebuild AI Team workspace UX and stabilize page references

Current bridge scope:
- Keep Customer Operations runtime separate from AI Team UI.
- Do not duplicate Unified Inbox inside AI Team.
- Use AI Team only as a projection, guidance, draft, and routing surface.
- Use channel integration mapping as a safe bridge between existing Integrations providers and Customer Operations channel readiness.
- No backend execution behavior is changed by this audit alone.
- No new files should be created before checking existing runtime/channel registry paths.
