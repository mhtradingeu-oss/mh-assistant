const path = require('path');
const { readJsonFile } = require('../integrations/storage');
const { resolveProjectPath } = require('../security/project-isolation');
const {
  resolveAiProviderConfig,
  assertAiProviderConfig,
  createProviderConfigError,
  getAiModePrompt,
  normalizeAiModeId
} = require('../ai/provider-config');
const {
  getAiProvider,
  isAiProviderSupported,
  listAiProviders
} = require('../ai/provider-registry');
const { serializeErrorForLog } = require('../observability/logger');
const {
  createAiCommandRecord,
  createAiArtifact,
  createAiRecommendation,
  upsertAiMemory,
  createTask,
  recordWorkflowRun,
  createApproval,
  createHandoff
} = require('./backbone');

const PROJECTS_DIR = path.join(process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../../../..'), 'data', 'projects');

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function asString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function humanizeValue(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    const clean = value.trim();
    return clean === '[object Object]' ? fallback : clean;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => humanizeValue(item)).filter(Boolean).join('; ') || fallback;
  }
  if (typeof value === 'object') {
    const title = humanizeValue(value.title || value.label || value.name || value.headline || value.hook);
    const detail = humanizeValue(
      value.action ||
      value.summary ||
      value.description ||
      value.recommendation ||
      value.reason ||
      value.insight ||
      value.body ||
      value.text ||
      value.value
    );
    if (title && detail && title !== detail) return `${title}: ${detail}`;
    if (title || detail) return title || detail;

    return Object.entries(value)
      .filter(([key, item]) => {
        const normalizedKey = asString(key).toLowerCase();
        if (/credential|secret|token|key|payload|raw/.test(normalizedKey)) return false;
        return item != null && typeof item !== 'object';
      })
      .slice(0, 4)
      .map(([key, item]) => `${titleCase(key)}: ${humanizeValue(item)}`)
      .filter(Boolean)
      .join('; ') || fallback;
  }
  return fallback;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function compactList(values, limit = 4) {
  return asArray(values).map((item) => humanizeValue(item)).filter(Boolean).slice(0, limit);
}

function createAiCommandExecutionError(message, details = {}) {
  const error = new Error(asString(message) || 'AI command execution failed');
  error.code = asString(details.code) || 'AI_COMMAND_EXECUTION_FAILED';
  error.statusCode = Number(details.statusCode) || 500;
  error.details = details;
  return error;
}

function loadProjectSettings(projectName) {
  const resolvedProject = resolveProjectPath(PROJECTS_DIR, projectName, 'project.json');
  const projectPath = resolvedProject.targetPath;
  return asObject(readJsonFile(projectPath, {}));
}

function normalizeRouteSuggestion(route, reason) {
  const routeId = asString(route);
  return {
    route: routeId,
    label: titleCase(routeId),
    reason: asString(reason)
  };
}

const MODE_ROUTE_TARGETS = {
  executive: 'home',
  campaign: 'campaign-studio',
  content: 'content-studio',
  ads: 'ads-manager',
  seo: 'insights',
  research: 'research',
  operations: 'workflows'
};

const OUTPUT_TYPE_BY_MODE = {
  executive: 'executive_brief',
  campaign: 'campaign_package',
  content: 'content_pack',
  ads: 'ad_ideas',
  seo: 'seo_plan',
  research: 'research_report',
  operations: 'operations_plan'
};

const SPECIALIST_MODE_MAP = {
  strategist: 'campaign',
  writer: 'content',
  designer: 'content',
  media: 'content',
  video_lead: 'content',
  publisher: 'operations',
  ads: 'ads',
  analyst: 'seo',
  researcher: 'research',
  compliance_reviewer: 'operations',
  operations: 'operations',
  team: 'executive'
};

function inferConversationLanguage(input = {}) {
  // Detect from request text — the language the user is writing/chatting in
  const source = asString(input.request || input.prompt || input.command);
  if (!source) return 'user language';
  if (/[\u0600-\u06FF]/.test(source)) return 'Arabic';
  if (/[\u0400-\u04FF]/.test(source)) return 'Cyrillic language';
  if (/[\u4E00-\u9FFF]/.test(source)) return 'Chinese';
  return 'user language';
}

function inferOutputLanguage(input = {}) {
  // Publishing/content output language: explicit override > project/market/setup language > fallback
  const explicit = asString(
    input.outputLanguage ||
    input.output_language ||
    input.marketLanguage ||
    input.market_language
  );
  if (explicit) return explicit;
  const projectLang = asString(input.language || input.languagePreference || input.language_preference);
  if (projectLang) return projectLang;
  return 'user language';
}

// Backward-compatible alias — now resolves publishing/output language
function inferLanguagePreference(input = {}) {
  return inferOutputLanguage(input);
}

function resolveGuidanceModeId(input = {}) {
  const requestedMode = normalizeAiModeId(input.mode_id || input.modeId);
  if (requestedMode && OUTPUT_TYPE_BY_MODE[requestedMode]) {
    return requestedMode;
  }

  const specialistId = asString(input.specialistId || input.specialist_id).toLowerCase();
  const mapped = SPECIALIST_MODE_MAP[specialistId];
  return normalizeAiModeId(mapped || 'executive');
}

function buildGuidancePrompt(input = {}) {
  const request = asString(input.request || input.prompt || input.command);
  const specialistId = asString(input.specialistId || input.specialist_id || 'specialist').toLowerCase();
  const specialistName = asString(input.specialistName || input.specialist_name || specialistId || 'Specialist');
  const teamMode = asString(input.mode || input.teamMode || 'solo').toLowerCase() === 'team' ? 'team' : 'solo';
  const conversationLanguage = inferConversationLanguage(input);
  const outputLanguage = inferOutputLanguage(input);
  const market = asString(input.market || '');
  const languagesDiffer = outputLanguage !== 'user language' && outputLanguage !== conversationLanguage;
  const contextSummary = humanizeValue(input.contextSummary || input.context_summary || '');
  const safetyInstruction = asString(
    input.safetyInstruction ||
    input.safety_instruction ||
    'Guidance-only response. Do not execute operations. Do not claim execution happened.'
  );

  const specialistInstruction = specialistId === 'writer'
    ? 'As Content Writer, return actual copy now: hooks, captions, CTA lines, emails, scripts, and landing copy. Never answer with only a description of what the copy could be.'
    : specialistId === 'video_lead'
      ? 'As Video Lead, return actual script output now: hooks, script lines, storyboard beats, and shot-list style sequencing when requested.'
      : specialistId === 'strategist'
        ? 'As Strategist, return a practical priority plan with positioning, rationale, and ordered next moves.'
        : specialistId === 'compliance_reviewer'
          ? 'As Compliance Reviewer, return concrete risks, safer wording replacements, and approval notes.'
          : specialistId === 'operations'
            ? 'As Operations Lead, return draft checklist/task/workflow steps only; do not execute or claim execution.'
            : 'Produce concrete specialist chat output, not a high-level summary.';

  return [
    `Guidance-only live specialist chat response for MH Assistant OS.`,
    `Specialist ID: ${specialistId || 'specialist'}`,
    `Specialist name: ${specialistName}`,
    `Mode: ${teamMode}`,
    `Conversation language (language the user is writing in): ${conversationLanguage}`,
    `Output/publishing language (language for publishable content, copy, hooks, captions, scripts): ${outputLanguage}`,
    market ? `Market: ${market}` : '',
    `Safety instruction: ${safetyInstruction}`,
    'You are answering inside a live specialist chat.',
    'Answer the user directly as the selected specialist.',
    conversationLanguage !== 'user language'
      ? `Always respond to the user, explain, and interact in ${conversationLanguage}.`
      : 'Match the language the user writes in for all explanations and interaction.',
    languagesDiffer
      ? `Generate all publishable content (hooks, captions, scripts, emails, copy, headlines) in ${outputLanguage} because that is the project publishing language.`
      : 'Generate publishable content in the same language as your conversation.',
    languagesDiffer
      ? `When the output language differs from the conversation language, label the publishable section clearly, for example: "${outputLanguage} hooks for the ${market || outputLanguage} market:".`
      : '',
    'If the user explicitly requests a different output language, use that language for publishable content instead.',
    'If the user asks for N items, return exactly N items.',
    'Example rule: if the user asks for 3 hooks, return exactly 3 hooks.',
    'If the user asks for hooks, captions, scripts, emails, headlines, tasks, workflow steps, or checklists, produce the actual requested items.',
    'Do not summarize the task.',
    'Do not say "I can create" or "I would create".',
    'Create the requested output now.',
    'Do not describe what you would do.',
    'Do not answer with a generic summary.',
    'Give practical, ready-to-copy output.',
    'After delivering the requested output, add one short next-step suggestion.',
    'Provide practical guidance/content only.',
    specialistInstruction,
    'Do not claim task/workflow/handoff/approval/publish actions were executed.',
    'Do not claim task creation, workflow run, handoff creation, or approval creation happened.',
    'Do not claim approvals were granted.',
    'Do not claim operations were run.',
    'Output must be review-ready.',
    contextSummary ? `Context summary: ${contextSummary}` : '',
    '',
    'User request:',
    request
  ].filter(Boolean).join('\n');
}

function extractGuidanceProviderText(providerOutput = {}, response = {}) {
  const provider = asObject(providerOutput);
  const raw = asObject(provider.raw);

  const directCandidates = [
    provider.content,
    provider.summary,
    provider.text,
    provider.output,
    provider.message,
    raw.content,
    raw.text,
    raw.output,
    raw.message,
    response.content,
    response.summary,
    response.analysis,
    response.title
  ];

  for (const candidate of directCandidates) {
    const text = humanizeValue(candidate);
    if (text) return text;
  }

  return '';
}

function extractGuidanceChatAnswer(providerOutput = {}, response = {}) {
  const provider = asObject(providerOutput);
  const raw = asObject(provider.raw);

  const directCandidates = [
    provider.chat_answer,
    raw.chat_answer,
    provider.content,
    provider.text,
    provider.output,
    provider.message,
    provider.summary,
    raw.content,
    raw.text,
    raw.output,
    raw.message,
    raw.summary,
    response.content,
    response.summary,
    response.analysis,
    response.title
  ];

  for (const candidate of directCandidates) {
    const text = humanizeValue(candidate);
    if (text) return text;
  }

  return '';
}

function pickRouteForIntent(intent, modeId) {
  if (intent === 'ads') return 'ads-manager';
  if (intent === 'campaign') return 'campaign-studio';
  if (intent === 'content') return 'content-studio';
  if (intent === 'seo') return 'insights';
  if (intent === 'research') return 'research';
  if (intent === 'operations') return 'workflows';
  if (intent === 'executive') return 'home';
  if (intent === 'media') return 'media-studio';
  if (intent === 'approval') return 'governance';
  if (intent === 'workflow') return 'workflows';
  if (intent === 'task') return 'task-center';
  if (MODE_ROUTE_TARGETS[modeId]) return MODE_ROUTE_TARGETS[modeId];
  return 'insights';
}

function classifyIntent(command, selectedModeId) {
  const text = asString(command).toLowerCase();
  const selectedMode = normalizeAiModeId(selectedModeId);
  const matches = (pattern) => pattern.test(text);
  const rules = [
    {
      intent: 'executive',
      modeId: 'executive',
      actionType: 'recommendation',
      outputType: 'executive_brief',
      pattern: /\b(blockers?|priorit(?:y|ies|ize)|decision|decide|next best action|what should i do|status|readiness|risk)\b/
    },
    {
      intent: 'ads',
      modeId: 'ads',
      actionType: 'content_generation',
      outputType: 'ad_ideas',
      pattern: /\b(ad ideas?|ad copy|ads?|facebook ads?|meta ads?|tiktok ads?|google ads?|paid media|primary text|headline|hooks?|cta|creative angles?|targeting angles?)\b/
    },
    {
      intent: 'campaign',
      modeId: 'campaign',
      actionType: 'campaign_generation',
      outputType: 'campaign_package',
      pattern: /\b(build|launch|create|generate|develop|plan)\b.{0,40}\b(campaign|market entry|growth plan)\b|\b(campaign plan|marketing campaign|launch campaign|build campaign|market entry|growth plan)\b/
    },
    {
      intent: 'content',
      modeId: 'content',
      actionType: 'content_generation',
      outputType: 'content_pack',
      pattern: /\b(caption|post|reel script|script|email|landing page section|landing page copy|content pack|content ideas?|copy|blog intro|social post)\b/
    },
    {
      intent: 'seo',
      modeId: 'seo',
      actionType: 'recommendation',
      outputType: 'seo_plan',
      pattern: /\b(seo|keywords?|blog topics?|meta title|meta description|search intent|search|ranking|serp|landing page seo)\b/
    },
    {
      intent: 'research',
      modeId: 'research',
      actionType: 'recommendation',
      outputType: 'research_report',
      pattern: /\b(competitors?|trend|market research|audience research|positioning gaps?|research|market trends?)\b/
    },
    {
      intent: 'operations',
      modeId: 'operations',
      actionType: 'workflow',
      outputType: 'operations_plan',
      pattern: /\b(task plan|workflow|handoff|approval|approvals|timeline|execution plan|operator|owners?|assign|todo|follow up|route)\b/
    }
  ];

  let matchedRule = rules.find((rule) => matches(rule.pattern));
  if (!matchedRule && selectedMode && OUTPUT_TYPE_BY_MODE[selectedMode]) {
    matchedRule = {
      intent: selectedMode === 'operations' ? 'operations' : selectedMode,
      modeId: selectedMode,
      actionType: selectedMode === 'operations' ? 'workflow' : 'recommendation',
      outputType: OUTPUT_TYPE_BY_MODE[selectedMode]
    };
  }

  if (!matchedRule) {
    matchedRule = {
      intent: 'executive',
      modeId: selectedMode || 'executive',
      actionType: 'recommendation',
      outputType: OUTPUT_TYPE_BY_MODE[selectedMode] || 'executive_brief'
    };
  }

  let { intent, actionType } = matchedRule;
  let modeId = matchedRule.modeId;
  let outputType = matchedRule.outputType || OUTPUT_TYPE_BY_MODE[modeId] || 'executive_brief';

  if (matches(/\b(approve|approval|review)\b/) && !['ads', 'content', 'campaign'].includes(intent)) {
    intent = 'approval';
    actionType = 'approval';
    modeId = modeId || 'operations';
    outputType = 'operations_plan';
  } else if (matches(/\b(task|todo|follow up|assign)\b/) && intent === 'operations') {
    intent = 'task';
    actionType = 'task';
  }

  return {
    resolvedModeId: modeId,
    intent,
    actionType,
    outputType,
    routeTarget: pickRouteForIntent(intent, modeId),
    confidence: text ? 0.76 : 0.35
  };
}

function collectConnectedIntegrations(integrations = {}) {
  const root = asObject(integrations);
  const records = asObject(root.records || root.control_center?.records);
  const checks = asObject(root.readiness?.checks || root.checks);
  const legacySources = asObject(root.sources?.sources || root.sources);
  const names = new Set();

  Object.values(records).forEach((item) => {
    const record = asObject(item);
    const status = asString(record.status).toLowerCase();
    if (!['connected', 'healthy', 'ready', 'active'].includes(status)) return;
    names.add(humanizeValue(record.integration_id || record.source_key || record.provider_account?.name || record.name));
  });

  Object.entries(checks).forEach(([key, value]) => {
    if (value) names.add(titleCase(key));
  });

  Object.entries(legacySources).forEach(([key, value]) => {
    const record = asObject(value);
    const status = asString(record.status || record.value).toLowerCase();
    if (status && !['missing', 'error', 'disconnected', 'false'].includes(status)) {
      names.add(titleCase(key));
    }
  });

  return Array.from(names).map((item) => humanizeValue(item)).filter(Boolean).slice(0, 8);
}

function buildServerContext(projectName, deps = {}) {
  const dashboard = asObject(deps.buildDashboard(projectName));
  const insights = asObject(deps.buildInsights(projectName));
  const learning = asObject(deps.buildLearning(projectName));
  const operations = asObject(deps.buildOperations(projectName));
  const settings = loadProjectSettings(projectName);

  const readiness = asObject(dashboard.readiness);
  const readinessDashboard = asObject(readiness.dashboard);
  const overview = asObject(asObject(dashboard.overview).overview);
  const connectors = asObject(dashboard.connectors);
  const assets = asObject(dashboard.assets);
  const assetReadiness = asObject(assets.category_readiness);
  const assetCategories = asArray(assetReadiness.categories);
  const integrations = asObject(connectors.control_center);
  const research = {
    key_questions: compactList(learning.open_questions || learning.questions || insights.priority_questions, 5),
    missing_signals: compactList(readinessDashboard.missing || readiness.missing || insights.missing_signals, 5),
    recent_handoffs: asArray(operations.handoffs?.items).filter((item) => asString(item.destination_page) === 'research').slice(0, 3)
  };

  return {
    project: asString(projectName).toLowerCase(),
    generated_at: new Date().toISOString(),
    dashboard,
    insights,
    learning,
    operations,
    settings,
    integrations,
    research,
    summary: {
      project_name: asString(overview.project_name || settings.project_name || projectName),
      goal: asString(overview.primary_goal || settings.primary_goal),
      audience: asString(overview.target_audience || settings.target_audience),
      critical_gaps: compactList(readinessDashboard.priorities?.critical || readiness.priorities?.critical, 4),
      next_best_actions: compactList(asObject(dashboard.overview).next_best_actions || readinessDashboard.next_best_actions, 4),
      recommendations: compactList(learning.recommendations || insights.recommendations, 4),
      asset_categories: assetCategories.map((item) => ({
        asset_type: asString(item.asset_type),
        label: asString(item.label || item.display_label || item.asset_type),
        status: asString(item.status),
        approved_assets: asArray(item.approved_assets).slice(0, 5),
        uploaded_assets: asArray(item.uploaded_assets).slice(0, 5)
      })),
      approved_assets: assetCategories
        .filter((item) => asString(item.status) === 'Approved')
        .flatMap((item) => asArray(item.approved_assets).map((assetId) => `${asString(item.label || item.asset_type)}: ${assetId}`))
        .slice(0, 12),
      asset_blockers: assetCategories
        .filter((item) => item.blocker || ['Missing', 'Needs Review'].includes(asString(item.status)))
        .map((item) => `${asString(item.label || item.asset_type)}: ${asString(item.status)}`)
        .slice(0, 12),
      connected_integrations: collectConnectedIntegrations({
        ...integrations,
        readiness: connectors.readiness,
        sources: connectors.sources
      })
    }
  };
}

function normalizeReadableList(value, limit = 8) {
  return asArray(value).map((item) => humanizeValue(item)).filter(Boolean).slice(0, limit);
}

function normalizeProviderRouteSuggestions(value) {
  return asArray(value)
    .map((item) => {
      if (typeof item === 'string') return normalizeRouteSuggestion(item, item);
      const record = asObject(item);
      const route = asString(record.route || record.destination || record.page);
      const label = humanizeValue(record.label || record.title || route);
      const reason = humanizeValue(record.reason || record.summary || record.description);
      return route || label || reason ? {
        route,
        label: label || titleCase(route),
        reason
      } : null;
    })
    .filter(Boolean);
}

function uniqueRouteSuggestions(items = []) {
  const seen = new Set();
  return asArray(items).filter((item) => {
    const route = asString(item.route);
    const key = `${route}|${asString(item.label)}`;
    if (!route && !asString(item.label)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseNumberedIdeas(text) {
  const clean = asString(text);
  if (!clean) return [];
  return clean
    .split(/\n\s*(?:\d+[\).\s]|[-*]\s+)/)
    .map((item) => item.replace(/^\s*(?:\d+[\).\s]|[-*]\s+)/, '').trim())
    .filter((item) => item.length > 12)
    .slice(0, 5);
}

function normalizeAdIdeas(value, content = '') {
  const ideas = asArray(value).map((item) => {
    if (typeof item === 'string') {
      return {
        hook: item,
        primaryText: item,
        headline: '',
        cta: '',
        audienceSegment: '',
        emotionalTrigger: '',
        platformFit: '',
        visualDirection: ''
      };
    }

    const record = asObject(item);
    return {
      hook: humanizeValue(record.hook || record.title || record.angle || record.headline),
      primaryText: humanizeValue(record.primaryText || record.primary_text || record.copy || record.text || record.body || record.description),
      headline: humanizeValue(record.headline || record.title),
      cta: humanizeValue(record.cta || record.CTA || record.callToAction || record.call_to_action),
      audienceSegment: humanizeValue(record.audienceSegment || record.audience_segment || record.audience || record.segment),
      emotionalTrigger: humanizeValue(record.emotionalTrigger || record.emotional_trigger || record.trigger || record.motivation),
      platformFit: humanizeValue(record.platformFit || record.platform_fit || record.platform || record.channel),
      visualDirection: humanizeValue(record.visualDirection || record.visual_direction || record.visual || record.creative_direction)
    };
  }).filter((item) => item.hook || item.primaryText || item.headline);

  if (ideas.length) return ideas.slice(0, 5);

  return parseNumberedIdeas(content).map((item) => ({
    hook: item,
    primaryText: item,
    headline: '',
    cta: '',
    audienceSegment: '',
    emotionalTrigger: '',
    platformFit: '',
    visualDirection: ''
  }));
}

function normalizeCampaignPackage(value = {}, context = {}) {
  const record = asObject(value);
  const summary = asObject(context.summary);
  const products = normalizeReadableList(record.products || record.productFocus || record.product_focus, 8);
  const channels = normalizeReadableList(record.channels || record.channelMix || record.channel_mix, 8);
  const launchPhases = asArray(record.launchPhases || record.launch_phases || record.phases).map((item, index) => {
    const phase = asObject(item);
    return {
      name: humanizeValue(phase.name || phase.title || `Phase ${index + 1}`),
      goal: humanizeValue(phase.goal || phase.objective || phase.focus || phase.summary),
      actions: normalizeReadableList(phase.actions || phase.tasks || phase.steps, 8),
      channels: normalizeReadableList(phase.channels || phase.channel, 6)
    };
  }).filter((item) => item.name || item.goal || item.actions.length || item.channels.length);

  const nextActions = normalizeReadableList(record.nextActions || record.next_actions, 8);
  const suggestedHandoffs = normalizeReadableList(
    record.suggestedHandoffs ||
    record.suggested_handoffs ||
    ['content-studio', 'media-studio', 'publishing', 'ads-manager'],
    8
  );

  return {
    concept: humanizeValue(record.concept || record.campaignConcept || record.campaign_concept || record.name),
    targetAudience: humanizeValue(record.targetAudience || record.target_audience || record.audience) || summary.audience,
    offer: humanizeValue(record.offer || record.offerStrategy || record.offer_strategy),
    products,
    channels,
    launchPhases,
    contentAngles: normalizeReadableList(record.contentAngles || record.content_angles, 8),
    adAngles: normalizeReadableList(record.adAngles || record.ad_angles, 8),
    requiredAssets: normalizeReadableList(record.requiredAssets || record.required_assets || record.assets, 8),
    missingBlockers: normalizeReadableList(record.missingBlockers || record.missing_blockers || record.blockers, 8),
    nextActions,
    suggestedHandoffs
  };
}

function normalizeContentPack(value = {}) {
  const record = asObject(value);
  return {
    hooks: normalizeReadableList(record.hooks, 12),
    captions: normalizeReadableList(record.captions, 8),
    scripts: normalizeReadableList(record.scripts || record.reelScripts || record.reel_scripts, 6),
    postIdeas: normalizeReadableList(record.postIdeas || record.post_ideas || record.ideas, 8),
    emailCopy: normalizeReadableList(record.emailCopy || record.email_copy || record.emails, 5),
    landingPageSections: normalizeReadableList(record.landingPageSections || record.landing_page_sections, 6)
  };
}

function normalizeStructuredObject(value = {}) {
  const record = asObject(value);
  return Object.entries(record).reduce((acc, [key, item]) => {
    if (Array.isArray(item)) {
      acc[key] = normalizeReadableList(item, 12);
    } else if (item && typeof item === 'object') {
      acc[key] = normalizeStructuredObject(item);
    } else {
      acc[key] = humanizeValue(item);
    }
    return acc;
  }, {});
}

function buildResponseFromContext(command, context, classified, providerOutput = {}) {
  const summaryBits = [];
  if (context.summary.goal) summaryBits.push(`Goal: ${context.summary.goal}.`);
  if (context.summary.audience) summaryBits.push(`Audience: ${context.summary.audience}.`);
  if (context.summary.critical_gaps.length) {
    summaryBits.push(`Critical gaps: ${context.summary.critical_gaps.join('; ')}.`);
  }
  if (context.summary.asset_blockers?.length) {
    summaryBits.push(`Asset blockers: ${context.summary.asset_blockers.slice(0, 4).join('; ')}.`);
  }

  const baseRecommendations = context.summary.recommendations.length
    ? context.summary.recommendations
    : context.summary.next_best_actions;
  const providerRecommendations = normalizeReadableList(providerOutput.recommendations, 8);
  const recommendations = providerRecommendations.length
    ? providerRecommendations
    : baseRecommendations.slice(0, 3);
  const routeTarget = classified.routeTarget;
  const content = humanizeValue(providerOutput.content || providerOutput.summary);
  const outputType = asString(providerOutput.outputType) || classified.outputType || OUTPUT_TYPE_BY_MODE[classified.resolvedModeId] || 'executive_brief';
  const modePrompt = getAiModePrompt(classified.resolvedModeId);
  const analysis = humanizeValue(providerOutput.analysis) || summaryBits.join(' ');
  const adIdeas = outputType === 'ad_ideas' ? normalizeAdIdeas(providerOutput.adIdeas || providerOutput.raw?.adIdeas || providerOutput.raw?.ad_ideas, content) : [];
  const campaignPackage = outputType === 'campaign_package'
    ? normalizeCampaignPackage(providerOutput.campaignPackage || providerOutput.raw?.campaignPackage || providerOutput.raw?.campaign_package, context)
    : null;
  const contentPack = outputType === 'content_pack'
    ? normalizeContentPack(providerOutput.contentPack || providerOutput.raw?.contentPack || providerOutput.raw?.content_pack)
    : null;
  const seoPlan = outputType === 'seo_plan'
    ? normalizeStructuredObject(providerOutput.seoPlan || providerOutput.raw?.seoPlan || providerOutput.raw?.seo_plan)
    : null;
  const researchReport = outputType === 'research_report'
    ? normalizeStructuredObject(providerOutput.researchReport || providerOutput.raw?.researchReport || providerOutput.raw?.research_report)
    : null;
  const operationsPlan = outputType === 'operations_plan'
    ? normalizeStructuredObject(providerOutput.operationsPlan || providerOutput.raw?.operationsPlan || providerOutput.raw?.operations_plan)
    : null;
  const executiveBrief = outputType === 'executive_brief'
    ? normalizeStructuredObject(providerOutput.executiveBrief || providerOutput.raw?.executiveBrief || providerOutput.raw?.executive_brief)
    : null;
  const providerNextActions = normalizeReadableList(providerOutput.nextActions, 8);
  const structuredNextActions = campaignPackage?.nextActions?.length ? campaignPackage.nextActions : [];
  const nextActions = [
    ...(providerNextActions.length ? providerNextActions : structuredNextActions),
    ...(providerNextActions.length || structuredNextActions.length ? [] : context.summary.next_best_actions.slice(0, 2)),
    ...(providerNextActions.length || structuredNextActions.length || !context.summary.asset_blockers?.length
      ? []
      : [`Open Library and resolve ${context.summary.asset_blockers[0]}.`]),
    `Route the strongest outcome into ${titleCase(routeTarget)}.`
  ].filter(Boolean);
  const routeSuggestions = uniqueRouteSuggestions([
    ...normalizeProviderRouteSuggestions(providerOutput.routeSuggestions),
    normalizeRouteSuggestion(routeTarget, `${modePrompt.label} output is best actioned in ${titleCase(routeTarget)}.`),
    ...(outputType === 'campaign_package'
      ? [
        normalizeRouteSuggestion('content-studio', 'Turn campaign angles into draft content.'),
        normalizeRouteSuggestion('media-studio', 'Create or collect required visual assets.'),
        normalizeRouteSuggestion('publishing', 'Schedule approved launch content.'),
        normalizeRouteSuggestion('ads-manager', 'Prepare paid media activation.')
      ]
      : []),
    normalizeRouteSuggestion('workflows', 'Use Workflows when this needs structured repeatable execution.'),
    normalizeRouteSuggestion('task-center', 'Save a durable execution task if an operator follow-up is needed.')
  ]);
  const findings = normalizeReadableList(providerOutput.findings, 8);
  const missingData = [
    ...normalizeReadableList(providerOutput.missingData, 8),
    ...context.research.missing_signals
  ].filter(Boolean);
  const title = humanizeValue(providerOutput.title) ||
    `${modePrompt.label} ${titleCase(outputType)} for ${context.summary.project_name || context.project}`;
  const summary = humanizeValue(providerOutput.summary) ||
    content ||
    analysis ||
    `AI Command prepared a ${titleCase(outputType)} for "${command}".`;
  const taskBlock = ['workflow', 'task', 'approval'].includes(classified.actionType)
    ? {
      title: `${modePrompt.label} follow-through`,
      owner: classified.resolvedModeId === 'operations' ? 'Operations Planner' : 'mh-assistant',
      steps: [
        `Review the durable artifact created for "${command}".`,
        `Route or convert the output into ${titleCase(routeTarget)}.`,
        'Create approval only if execution changes publishing, spend, or sensitive settings.'
      ]
    }
    : null;

  return {
    status: 'completed',
    title,
    summary,
    content,
    analysis,
    findings: findings.length ? findings : [
      `Mode: ${modePrompt.label}.`,
      `Intent classified server-side as ${classified.intent}.`,
      context.summary.connected_integrations.length
        ? `Connected integrations in context: ${context.summary.connected_integrations.join(', ')}.`
        : 'Integration coverage is still limited, so recommendations should be validated before execution.'
    ],
    recommendations,
    nextActions,
    routeSuggestions,
    outputType,
    adIdeas,
    campaignPackage,
    contentPack,
    seoPlan,
    researchReport,
    operationsPlan,
    executiveBrief,
    provider: asString(providerOutput.provider),
    model: asString(providerOutput.model),
    usage: asObject(providerOutput.usage),
    missingData,
    recommendationObjects: recommendations.map((item, index) => ({
      title: index === 0 ? 'Primary recommendation' : `Recommendation ${index + 1}`,
      summary: humanizeValue(item),
      action: humanizeValue(item),
      domain: classified.resolvedModeId,
      route_target: routeTarget,
      priority: index === 0 ? 'high' : 'normal'
    })),
    taskBlock
  };
}

function buildWorkflowOutput(workflowId, inputs, context) {
  const campaign = asString(inputs.campaign || context.summary.project_name || context.project);
  const audience = asString(inputs.audience || context.summary.audience || 'target audience');
  const goal = asString(inputs.goal || context.summary.goal || 'project goal');
  const routeTarget = workflowId === 'generate-ad-strategy'
    ? 'ads-manager'
    : workflowId === 'build-content-plan'
      ? 'content-studio'
      : workflowId === 'launch-new-campaign'
        ? 'campaign-studio'
        : workflowId === 'competitor-research'
          ? 'research'
          : 'workflows';

  return {
    title: titleCase(workflowId),
    summary: `${titleCase(workflowId)} prepared for ${campaign} with ${goal} as the primary target and ${audience} as the main audience.`,
    findings: [
      `Workflow context was assembled server-side for ${context.project}.`,
      context.summary.critical_gaps[0] || 'No blocking critical gap was surfaced in the current context snapshot.',
      context.summary.recommendations[0] || 'No recommendation stack was available, so the workflow leaned on project settings and operations context.'
    ],
    recommendations: [
      context.summary.recommendations[0] || `Route this workflow output into ${titleCase(routeTarget)} for execution.`,
      `Keep the output durable so later pages can consume the same decision package.`,
      `Use tasks or approvals if human follow-through is required.`
    ],
    nextActions: [
      `Open ${titleCase(routeTarget)} to action the workflow output.`,
      'Create a structured task for the first operator-owned follow-up.',
      'Preserve the artifact for cross-page reuse.'
    ],
    routeSuggestions: [
      normalizeRouteSuggestion(routeTarget, 'Primary downstream page for this workflow output.'),
      normalizeRouteSuggestion('task-center', 'Convert the run into a durable task if manual execution is required.')
    ],
    routeTarget
  };
}

function buildLinkedEntities(items = []) {
  return asArray(items)
    .map((item) => item && item.entity_type && item.entity_id ? item : null)
    .filter(Boolean);
}

function createAiOrchestrationService(deps) {
  const logger = deps.logger || console;

  return {
    async executeCommand(projectName, input = {}) {
      const command = asString(input.command || input.message);
      if (!command) {
        throw new Error('Missing command');
      }

      let context = null;
      let classified = null;
      let providerConfig = null;

      try {
        logger.info('ai_command_received', {
          route: 'ai-command',
          action: 'execute',
          project: asString(projectName).toLowerCase(),
          source: asString(input.source) || 'ai-command',
          mode_id: asString(input.mode_id || input.modeId) || 'executive'
        });

        context = buildServerContext(projectName, deps);
        classified = classifyIntent(command, input.mode_id || input.modeId);
        providerConfig = resolveAiProviderConfig(process.env);

        if (!isAiProviderSupported(providerConfig.provider)) {
          throw createProviderConfigError(
            `Unsupported AI provider "${providerConfig.provider}". Supported providers: ${listAiProviders().join(', ')}`,
            {
              code: 'AI_PROVIDER_UNSUPPORTED',
              statusCode: 503,
              provider: providerConfig.provider
            }
          );
        }

        assertAiProviderConfig(providerConfig);
        const provider = getAiProvider(providerConfig.provider, { logger });
        if (!provider) {
          throw createProviderConfigError(`AI provider adapter is not registered for "${providerConfig.provider}"`, {
            code: 'AI_PROVIDER_ADAPTER_MISSING',
            statusCode: 503,
            provider: providerConfig.provider
          });
        }

        logger.info('ai_provider_call_started', {
          route: 'ai-command',
          provider: providerConfig.provider,
          model: providerConfig.model,
          project: asString(projectName).toLowerCase()
        });

        const providerOutput = await provider.execute({
          command,
          modeId: classified.resolvedModeId,
          outputType: classified.outputType,
          contextSummary: context.summary,
          research: context.research,
          config: providerConfig
        });
        const response = buildResponseFromContext(command, context, classified, providerOutput);
        const linkedEntities = [];

        const artifact = createAiArtifact(projectName, {
          type: 'ai_response',
          title: response.title,
          summary: response.summary,
          route_target: classified.routeTarget,
          source_type: 'ai_command',
          payload: {
            command,
            response,
            provider: {
              id: providerOutput.provider,
              model: providerOutput.model,
              usage: providerOutput.usage
            },
            context_summary: context.summary
          },
          actor: input.actor
        });

        const recommendationRecords = response.recommendationObjects.map((item) =>
          createAiRecommendation(projectName, {
            ...item,
            source_type: 'ai_command',
            source_id: artifact.id,
            actor: input.actor
          })
        );

        const memory = upsertAiMemory(projectName, {
          title: `AI memory • ${classified.intent}`,
          scope: classified.intent === 'workflow' ? 'workflow' : 'project',
          key: `${classified.intent}_${classified.resolvedModeId}`,
          summary: response.summary,
          value: {
            command,
            recommendations: response.recommendations,
            route_target: classified.routeTarget
          },
          source_type: 'ai_command',
          source_id: artifact.id,
          actor: input.actor
        });

        if (classified.actionType === 'task') {
          const task = createTask(projectName, {
            title: response.taskBlock.title,
            description: response.summary,
            route_target: 'task-center',
            source_type: 'ai_command',
            source_id: artifact.id,
            output: response,
            notes: response.nextActions,
            actor: input.actor
          });
          linkedEntities.push({ entity_type: 'task', entity_id: task.id, route: 'task-center', label: task.title });
        }

        if (classified.actionType === 'workflow') {
          const run = recordWorkflowRun(projectName, {
            workflow_id: 'ai-command-orchestration',
            workflow_type: 'ai_command',
            title: response.title,
            source: 'ai-command',
            status: 'completed',
            route_target: 'workflows',
            inputs: {
              command,
              mode_id: classified.resolvedModeId
            },
            output: response,
            intelligence_stamp: {
              source: 'server_ai_context',
              generated_at: context.generated_at
            },
            actor: input.actor
          });
          linkedEntities.push({ entity_type: 'workflow_run', entity_id: run.id, route: 'workflows', label: run.title });
        }

        if (classified.actionType === 'approval') {
          const approval = createApproval(projectName, {
            title: `${response.title} approval`,
            entity_type: 'ai_artifact',
            entity_id: artifact.id,
            summary: response.summary,
            risk_level: 'medium',
            actor: input.actor
          });
          linkedEntities.push({ entity_type: 'approval', entity_id: approval.id, route: 'governance', label: approval.title });
        }

        let handoff = null;
        if (classified.routeTarget) {
          handoff = createHandoff(projectName, {
            source_page: 'ai-command',
            destination_page: classified.routeTarget,
            linked_entity: {
              entity_type: 'ai_artifact',
              entity_id: artifact.id,
              route: classified.routeTarget,
              label: response.title
            },
            payload: {
              prompt: command,
              draft_context: {
                projectName: asString(projectName).toLowerCase(),
                modeId: classified.resolvedModeId,
                lastCommand: command,
                lastResponseTitle: response.title,
                routeSuggestions: response.routeSuggestions
              },
              output: response
            },
            actor: input.actor
          });
        }

        const commandRecord = createAiCommandRecord(projectName, {
          command,
          mode_id: classified.resolvedModeId,
          intent: classified.intent,
          action_type: classified.actionType,
          route_target: classified.routeTarget,
          source: input.source || 'ai-command',
          status: 'completed',
          context_summary: context.summary,
          classification: classified,
          response,
          linked_entities: buildLinkedEntities([
            ...linkedEntities,
            handoff ? { entity_type: 'handoff', entity_id: handoff.id, route: classified.routeTarget, label: response.title } : null
          ]),
          artifact_ids: [artifact.id],
          recommendation_ids: recommendationRecords.map((item) => item.id),
          memory_ids: [memory.id],
          actor: input.actor
        });

        logger.info('ai_command_response_returned', {
          route: 'ai-command',
          project: asString(projectName).toLowerCase(),
          command_id: commandRecord.id,
          provider: response.provider,
          model: response.model,
          recommendation_count: response.recommendations.length
        });

        return {
          status: 'completed',
          provider: {
            id: response.provider,
            model: response.model
          },
          command: commandRecord,
          context: {
            summary: context.summary,
            research: context.research,
            settings: {
              project_name: asString(context.settings.project_name),
              market: asString(context.settings.market)
            }
          },
          response,
          artifact,
          recommendations: recommendationRecords,
          memory,
          linked_entities: linkedEntities,
          handoff
        };
      } catch (error) {
        const failureMessage = asString(error.message) || 'AI command execution failed';
        const statusCode = Number(error.statusCode) || 500;
        const failureClassification = classified || classifyIntent(command, input.mode_id || input.modeId);
        const failedResponse = {
          status: 'failed',
          error: failureMessage,
          content: '',
          analysis: '',
          recommendations: [],
          findings: [],
          nextActions: [],
          routeSuggestions: [],
          missingData: [],
          outputType: failureClassification.outputType || OUTPUT_TYPE_BY_MODE[failureClassification.resolvedModeId] || 'executive_brief'
        };

        const failedCommand = createAiCommandRecord(projectName, {
          command,
          mode_id: failureClassification.resolvedModeId,
          intent: failureClassification.intent,
          action_type: failureClassification.actionType,
          route_target: failureClassification.routeTarget,
          source: input.source || 'ai-command',
          status: 'failed',
          context_summary: asObject(context?.summary),
          classification: failureClassification,
          response: failedResponse,
          actor: input.actor
        });

        logger.error('ai_command_error', {
          route: 'ai-command',
          action: 'execute',
          project: asString(projectName).toLowerCase(),
          provider: providerConfig?.provider || null,
          model: providerConfig?.model || null,
          command_id: failedCommand.id,
          error: serializeErrorForLog(error)
        });

        const structuredFailure = {
          status: 'failed',
          error: failureMessage,
          code: asString(error.code) || 'AI_COMMAND_EXECUTION_FAILED',
          provider: providerConfig?.provider || null,
          command: failedCommand,
          details: asObject(error.details)
        };

        const executionError = createAiCommandExecutionError(failureMessage, {
          code: structuredFailure.code,
          statusCode
        });
        executionError.payload = structuredFailure;
        throw executionError;
      }
    },

    async executeGuidance(projectName, input = {}) {
      const request = asString(input.request || input.prompt || input.command);
      if (!request) {
        throw new Error('Missing guidance request');
      }

      const specialistId = asString(input.specialistId || input.specialist_id || 'specialist').toLowerCase();
      const specialistName = asString(input.specialistName || input.specialist_name || specialistId || 'Specialist');
      const teamMode = asString(input.mode || input.teamMode || 'solo').toLowerCase() === 'team' ? 'team' : 'solo';
      const conversationLanguage = inferConversationLanguage(input);
      const outputLanguage = inferOutputLanguage(input);
      const language = outputLanguage; // backward-compat alias
      const market = asString(input.market || input.marketLanguage || '');
      const modeId = resolveGuidanceModeId(input);
      const guidanceCommand = buildGuidancePrompt(input);
      const classified = classifyIntent(request, modeId);

      let providerConfig = null;

      try {
        logger.info('ai_guidance_received', {
          route: 'ai-guidance',
          action: 'execute',
          project: asString(projectName).toLowerCase(),
          specialist_id: specialistId,
          mode: teamMode
        });

        const context = buildServerContext(projectName, deps);
        providerConfig = resolveAiProviderConfig(process.env);

        if (!isAiProviderSupported(providerConfig.provider)) {
          throw createProviderConfigError(
            `Unsupported AI provider "${providerConfig.provider}". Supported providers: ${listAiProviders().join(', ')}`,
            {
              code: 'AI_PROVIDER_UNSUPPORTED',
              statusCode: 503,
              provider: providerConfig.provider
            }
          );
        }

        assertAiProviderConfig(providerConfig);
        const provider = getAiProvider(providerConfig.provider, { logger });
        if (!provider) {
          throw createProviderConfigError(`AI provider adapter is not registered for "${providerConfig.provider}"`, {
            code: 'AI_PROVIDER_ADAPTER_MISSING',
            statusCode: 503,
            provider: providerConfig.provider
          });
        }

        logger.info('ai_guidance_provider_call_started', {
          route: 'ai-guidance',
          provider: providerConfig.provider,
          model: providerConfig.model,
          project: asString(projectName).toLowerCase()
        });

        const providerOutput = await provider.execute({
          command: guidanceCommand,
          modeId,
          outputType: classified.outputType,
          contextSummary: {
            ...asObject(context.summary),
            request_context: humanizeValue(input.contextSummary || input.context_summary || ''),
            specialist_id: specialistId,
            specialist_name: specialistName,
            language_preference: language,
            conversation_language: conversationLanguage,
            output_language: outputLanguage,
            market,
            guidance_only: true
          },
          research: context.research,
          config: providerConfig
        });

        const response = buildResponseFromContext(request, context, classified, providerOutput);
        const chatAnswer = extractGuidanceChatAnswer(providerOutput, response);
        const responseText = chatAnswer || extractGuidanceProviderText(providerOutput, response);
        const sections = [
          {
            title: 'Recommendations',
            items: normalizeReadableList(response.recommendations, 6)
          },
          {
            title: 'Key findings',
            items: normalizeReadableList(response.findings, 6)
          },
          {
            title: 'Next actions',
            items: normalizeReadableList(response.nextActions, 6)
          }
        ].filter((section) => section.items.length > 0);

        const guidancePayload = {
          status: 'completed',
          timestamp: new Date().toISOString(),
          specialist: {
            id: specialistId,
            name: specialistName,
            mode: teamMode,
            language,
            conversationLanguage,
            outputLanguage,
            market
          },
          safety_label: 'guidance_only_no_operational_side_effects',
          side_effects: {
            created_task: false,
            created_workflow: false,
            created_handoff: false,
            created_approval: false,
            published: false,
            persisted_memory: false,
            persisted_artifact: false,
            mutated_operations: false
          },
          provider: {
            id: asString(providerOutput.provider || providerConfig.provider),
            model: asString(providerOutput.model || providerConfig.model),
            usage: asObject(providerOutput.usage)
          },
          chat_answer: responseText,
          response_text: responseText,
          bullets: normalizeReadableList(response.recommendations.length ? response.recommendations : response.nextActions, 8),
          sections,
          response: {
            status: 'completed',
            chat_answer: responseText,
            title: response.title,
            summary: response.summary,
            content: response.content,
            analysis: response.analysis,
            findings: response.findings,
            recommendations: response.recommendations,
            nextActions: response.nextActions,
            outputType: response.outputType,
            routeSuggestions: response.routeSuggestions,
            missingData: response.missingData,
            taskBlock: {
              owner: specialistName,
              title: 'Guidance only',
              steps: [
                'Review guidance output in AI Command.',
                'Create task/workflow/handoff manually only if explicitly approved.'
              ]
            }
          }
        };

        logger.info('ai_guidance_response_returned', {
          route: 'ai-guidance',
          project: asString(projectName).toLowerCase(),
          provider: guidancePayload.provider.id,
          model: guidancePayload.provider.model,
          specialist_id: specialistId
        });

        return guidancePayload;
      } catch (error) {
        logger.error('ai_guidance_error', {
          route: 'ai-guidance',
          action: 'execute',
          project: asString(projectName).toLowerCase(),
          provider: providerConfig?.provider || null,
          model: providerConfig?.model || null,
          specialist_id: specialistId,
          error: serializeErrorForLog(error)
        });

        const failureMessage = asString(error.message) || 'AI guidance execution failed';
        const statusCode = Number(error.statusCode) || 500;
        const guidanceError = createAiCommandExecutionError(failureMessage, {
          code: asString(error.code) || 'AI_GUIDANCE_EXECUTION_FAILED',
          statusCode
        });
        guidanceError.payload = {
          status: 'failed',
          error: failureMessage,
          code: asString(error.code) || 'AI_GUIDANCE_EXECUTION_FAILED',
          timestamp: new Date().toISOString(),
          specialist: {
            id: specialistId,
            name: specialistName,
            mode: teamMode,
            language,
            conversationLanguage,
            outputLanguage,
            market
          },
          safety_label: 'guidance_only_no_operational_side_effects'
        };
        throw guidanceError;
      }
    },

    executeWorkflow(projectName, workflowId, input = {}) {
      const cleanWorkflowId = asString(workflowId);
      if (!cleanWorkflowId) {
        throw new Error('Missing workflow id');
      }

      const context = buildServerContext(projectName, deps);
      const inputs = asObject(input.inputs || input);
      const output = buildWorkflowOutput(cleanWorkflowId, inputs, context);

      const artifact = createAiArtifact(projectName, {
        type: 'workflow_output',
        title: output.title,
        summary: output.summary,
        route_target: output.routeTarget,
        source_type: 'workflow_run',
        payload: {
          workflow_id: cleanWorkflowId,
          inputs,
          output
        },
        actor: input.actor
      });

      const run = recordWorkflowRun(projectName, {
        workflow_id: cleanWorkflowId,
        workflow_type: cleanWorkflowId,
        title: output.title,
        source: input.source || 'server-ai-workflow',
        status: 'completed',
        route_target: output.routeTarget,
        inputs,
        output: {
          ...output,
          artifact_id: artifact.id
        },
        intelligence_stamp: {
          source: 'server_ai_context',
          generated_at: context.generated_at
        },
        actor: input.actor
      });

      const recommendations = output.recommendations.map((item, index) =>
        createAiRecommendation(projectName, {
          title: index === 0 ? `${output.title} primary route` : `${output.title} recommendation ${index + 1}`,
          summary: item,
          action: item,
          domain: cleanWorkflowId,
          route_target: output.routeTarget,
          source_type: 'workflow_run',
          source_id: run.id,
          priority: index === 0 ? 'high' : 'normal',
          actor: input.actor
        })
      );

      upsertAiMemory(projectName, {
        title: `Workflow memory • ${cleanWorkflowId}`,
        scope: 'workflow',
        key: cleanWorkflowId,
        summary: output.summary,
        value: {
          workflow_id: cleanWorkflowId,
          route_target: output.routeTarget,
          next_actions: output.nextActions
        },
        source_type: 'workflow_run',
        source_id: run.id,
        actor: input.actor
      });

      const handoff = createHandoff(projectName, {
        source_page: 'workflows',
        destination_page: output.routeTarget,
        linked_entity: {
          entity_type: 'workflow_run',
          entity_id: run.id,
          route: output.routeTarget,
          label: output.title
        },
        payload: {
          workflow_id: cleanWorkflowId,
          workflow_title: output.title,
          output: {
            ...output,
            artifact_id: artifact.id
          },
          inputs
        },
        actor: input.actor
      });

      return {
        run,
        artifact,
        recommendations,
        handoff,
        output: {
          ...output,
          artifact_id: artifact.id
        }
      };
    }
  };
}

module.exports = {
  createAiOrchestrationService,
  __private: {
    classifyIntent,
    buildResponseFromContext,
    collectConnectedIntegrations,
    humanizeValue,
    normalizeAdIdeas,
    normalizeCampaignPackage,
    normalizeContentPack,
    normalizeStructuredObject
  }
};
