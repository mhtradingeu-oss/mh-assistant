const axios = require('axios');
const { getAiModePrompt } = require('../provider-config');

function asString(value) {
  if (value == null) return '';
  return String(value).trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
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
      .filter(([, item]) => item != null && typeof item !== 'object')
      .slice(0, 4)
      .map(([key, item]) => `${key.replace(/[_-]+/g, ' ')}: ${humanizeValue(item)}`)
      .filter(Boolean)
      .join('; ') || fallback;
  }
  return fallback;
}

function compactList(values, limit = 5) {
  return asArray(values).map((item) => humanizeValue(item)).filter(Boolean).slice(0, limit);
}

function normalizeReadableList(values, limit = 12) {
  return asArray(values).map((item) => humanizeValue(item)).filter(Boolean).slice(0, limit);
}

function renderNumberedLines(items = []) {
  return asArray(items)
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n');
}

function buildContentPackText(contentPack = {}, nextActions = []) {
  const pack = contentPack && typeof contentPack === 'object' ? contentPack : {};
  const hooks = normalizeReadableList(pack.hooks, 12);
  const captions = normalizeReadableList(pack.captions, 8);
  const scripts = normalizeReadableList(pack.scripts || pack.reelScripts || pack.reel_scripts, 8);
  const emailCopy = normalizeReadableList(pack.emailCopy || pack.email_copy || pack.emails, 6);
  const landingPageSections = normalizeReadableList(pack.landingPageSections || pack.landing_page_sections, 8);
  const postIdeas = normalizeReadableList(pack.postIdeas || pack.post_ideas || pack.ideas, 8);
  const blocks = [];

  if (hooks.length) {
    blocks.push(renderNumberedLines(hooks));
  }
  if (captions.length) {
    blocks.push(['Captions:', renderNumberedLines(captions)].join('\n'));
  }
  if (scripts.length) {
    blocks.push(['Scripts:', renderNumberedLines(scripts)].join('\n'));
  }
  if (emailCopy.length) {
    blocks.push(['Email Copy:', renderNumberedLines(emailCopy)].join('\n'));
  }
  if (landingPageSections.length) {
    blocks.push(['Landing Page Sections:', renderNumberedLines(landingPageSections)].join('\n'));
  }
  if (postIdeas.length) {
    blocks.push(['Post Ideas:', renderNumberedLines(postIdeas)].join('\n'));
  }

  const suggestion = normalizeReadableList(nextActions, 1)[0];
  if (suggestion) {
    blocks.push(`Next step: ${suggestion}`);
  }

  return blocks.filter(Boolean).join('\n\n').trim();
}

function buildAdIdeasText(adIdeas = [], nextActions = []) {
  const ideas = asArray(adIdeas).map((item) => {
    if (typeof item === 'string') {
      return humanizeValue(item);
    }

    const record = item && typeof item === 'object' ? item : {};
    const hook = humanizeValue(record.hook || record.title || record.headline || record.angle);
    const primaryText = humanizeValue(record.primaryText || record.primary_text || record.copy || record.text || record.body);
    const headline = humanizeValue(record.headline || record.title);
    const cta = humanizeValue(record.cta || record.CTA || record.callToAction || record.call_to_action);
    const parts = [hook, primaryText, headline ? `Headline: ${headline}` : '', cta ? `CTA: ${cta}` : ''].filter(Boolean);
    return parts.join(' | ');
  }).filter(Boolean);

  const blocks = [];
  if (ideas.length) {
    blocks.push(renderNumberedLines(ideas));
  }
  const suggestion = normalizeReadableList(nextActions, 1)[0];
  if (suggestion) {
    blocks.push(`Next step: ${suggestion}`);
  }
  return blocks.filter(Boolean).join('\n\n').trim();
}

function buildStructuredContent(parsed = {}) {
  const outputType = asString(parsed.outputType || parsed.output_type);
  const nextActions = parsed.nextActions || parsed.next_actions || parsed.actions;

  if (outputType === 'content_pack') {
    return buildContentPackText(parsed.contentPack || parsed.content_pack || {}, nextActions);
  }

  if (outputType === 'ad_ideas') {
    return buildAdIdeasText(parsed.adIdeas || parsed.ad_ideas || [], nextActions);
  }

  return '';
}

function shouldPreferStructuredContent(parsed = {}, content = '', structuredContent = '') {
  if (!structuredContent) return false;

  const outputType = asString(parsed.outputType || parsed.output_type);
  if (!['content_pack', 'ad_ideas'].includes(outputType)) {
    return false;
  }

  if (!content) return true;

  const shortFlatContent = content.length < 140 && !content.includes('\n');
  const structuredHasDepth = structuredContent.length > content.length;
  return shortFlatContent && structuredHasDepth;
}

function normalizeRouteSuggestions(value) {
  return asArray(value)
    .map((item) => {
      if (typeof item === 'string') {
        return { label: item, route: '', reason: item };
      }
      if (!item || typeof item !== 'object') return null;
      return {
        label: humanizeValue(item.label || item.title || item.route),
        route: asString(item.route || item.destination || item.page),
        reason: humanizeValue(item.reason || item.summary || item.description)
      };
    })
    .filter((item) => item && (item.label || item.route || item.reason));
}

function parseJsonObject(text) {
  const clean = asString(text);
  if (!clean) return null;

  try {
    return JSON.parse(clean);
  } catch (_) {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function extractMessageContent(payload = {}) {
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item.text === 'string') return item.text;
        return '';
      })
      .join('\n')
      .trim();
  }

  return '';
}

function normalizeProviderOutput(rawText) {
  const parsed = parseJsonObject(rawText);

  if (parsed && typeof parsed === 'object') {
    const structuredContent = buildStructuredContent(parsed);
    let content = humanizeValue(parsed.content || parsed.message || parsed.output);
    if (shouldPreferStructuredContent(parsed, content, structuredContent)) {
      content = structuredContent;
    }
    if (!content) {
      content = humanizeValue(structuredContent || parsed.summary);
    }
    const summary = humanizeValue(parsed.summary || content);
    const analysis = humanizeValue(parsed.analysis || parsed.rationale || parsed.reasoning || parsed.context);
    const recommendations = compactList(
      parsed.recommendations || parsed.actions || parsed.next_actions || parsed.nextActions
    );

    return {
      title: humanizeValue(parsed.title),
      summary,
      content,
      analysis,
      recommendations,
      nextActions: compactList(parsed.nextActions || parsed.next_actions || parsed.actions, 8),
      findings: compactList(parsed.findings || parsed.keyFindings || parsed.key_findings, 8),
      routeSuggestions: normalizeRouteSuggestions(parsed.routeSuggestions || parsed.route_suggestions),
      outputType: asString(parsed.outputType || parsed.output_type),
      adIdeas: asArray(parsed.adIdeas || parsed.ad_ideas),
      campaignPackage: parsed.campaignPackage || parsed.campaign_package || null,
      contentPack: parsed.contentPack || parsed.content_pack || null,
      seoPlan: parsed.seoPlan || parsed.seo_plan || null,
      researchReport: parsed.researchReport || parsed.research_report || null,
      operationsPlan: parsed.operationsPlan || parsed.operations_plan || null,
      executiveBrief: parsed.executiveBrief || parsed.executive_brief || null,
      missingData: compactList(parsed.missingData || parsed.missing_data || parsed.blockers, 8),
      chat_answer: humanizeValue(parsed.chat_answer || parsed.chatAnswer || content),
      raw: parsed
    };
  }

  return {
    title: '',
    summary: '',
    content: asString(rawText),
    analysis: '',
    recommendations: [],
    nextActions: [],
    findings: [],
    routeSuggestions: [],
    outputType: '',
    adIdeas: [],
    campaignPackage: null,
    contentPack: null,
    seoPlan: null,
    researchReport: null,
    operationsPlan: null,
    executiveBrief: null,
    missingData: [],
    chat_answer: asString(rawText),
    raw: null
  };
}

function createOpenAiProvider(options = {}) {
  const logger = options.logger || console;

  return {
    id: 'openai',
    async execute(input = {}) {
      const config = input.config || {};
      const modePrompt = getAiModePrompt(input.modeId);
      const requestedOutputType = asString(input.outputType || modePrompt.outputType);
      const requestBody = {
        model: asString(config.model || 'gpt-4.1-mini'),
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: [
              'You are the AI Command marketing execution engine inside MH Assistant OS.',
              modePrompt.prompt,
              'Use the supplied project context, market, brand voice, readiness blockers, integrations, learning, and research notes.',
              'Be specific to the supplied project context and avoid generic placeholder text.',
              'Return actionable marketing output, not a process description, unless the command asks for operations.',
              'Always return STRICT JSON. Required keys: title, summary, content, analysis, recommendations, nextActions, routeSuggestions, outputType.',
              'recommendations and nextActions must be arrays of readable strings.',
              'routeSuggestions must be an array of objects with label, route, reason.',
              `Set outputType to "${requestedOutputType}" unless the command clearly requires a better supported output type.`,
              'For outputType "ad_ideas", include adIdeas as an array of 3 to 5 objects with hook, primaryText, headline, cta, audienceSegment, emotionalTrigger, platformFit, visualDirection.',
              'For outputType "campaign_package", include campaignPackage with concept, targetAudience, offer, products, channels, launchPhases, contentAngles, adAngles, requiredAssets, missingBlockers, nextActions, suggestedHandoffs.',
              'For outputType "content_pack", include contentPack with hooks, captions, scripts, emailCopy, landingPageSections, or postIdeas as relevant.',
              'For outputType "seo_plan", include seoPlan with keywords, searchIntent, blogTopics, landingPageSeo, metaTitle, metaDescription.',
              'For outputType "research_report", include researchReport with competitors, marketTrends, audienceInsights, positioningGaps, evidenceNeeds.',
              'For outputType "operations_plan", include operationsPlan with tasks, timeline, owners, handoffs, approvals, dependencies.',
              'For outputType "executive_brief", include executiveBrief with blockers, priorities, decision, nextBestAction.',
              'Do not return markdown outside JSON.'
            ].join(' ')
          },
          {
            role: 'user',
            content: JSON.stringify({
              command: input.command,
              mode_id: input.modeId,
              output_type: requestedOutputType,
              context_summary: input.contextSummary,
              research: input.research,
              mode: {
                label: modePrompt.label,
                purpose: modePrompt.purpose
              }
            })
          }
        ],
        response_format: { type: 'json_object' }
      };

      let response;
      try {
        response = await axios.post(
          `${asString(config.baseUrl)}/chat/completions`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${asString(config.apiKey)}`,
              'Content-Type': 'application/json'
            },
            timeout: Number(config.timeoutMs) || 30000
          }
        );
      } catch (error) {
        const providerCode = asString(error?.response?.data?.error?.code).toLowerCase();
        const providerMessage =
          providerCode === 'invalid_api_key'
            ? 'Invalid OpenAI API key configured on server'
            :
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'OpenAI request failed';
        const providerError = new Error(`OpenAI provider failed: ${providerMessage}`);
        providerError.code = 'OPENAI_PROVIDER_FAILED';
        providerError.statusCode = Number(error?.response?.status) || 502;
        providerError.provider = 'openai';
        providerError.details = {
          status: error?.response?.status,
          responseData: error?.response?.data || null
        };
        throw providerError;
      }

      const rawText = extractMessageContent(response.data);
      if (!rawText) {
        const emptyError = new Error('OpenAI returned an empty response body');
        emptyError.code = 'OPENAI_EMPTY_RESPONSE';
        emptyError.statusCode = 502;
        emptyError.provider = 'openai';
        throw emptyError;
      }

      const normalized = normalizeProviderOutput(rawText);
      if (!normalized.content) {
        const emptyContentError = new Error('OpenAI returned no usable content');
        emptyContentError.code = 'OPENAI_EMPTY_CONTENT';
        emptyContentError.statusCode = 502;
        emptyContentError.provider = 'openai';
        throw emptyContentError;
      }

      logger.info?.('ai_provider_response_ready', {
        route: 'ai-command',
        provider: 'openai',
        model: config.model,
        usage: response.data?.usage || null
      });

      return {
        provider: 'openai',
        model: asString(config.model),
        usage: response.data?.usage || null,
        title: normalized.title,
        summary: normalized.summary,
        content: normalized.content,
        chat_answer: normalized.chat_answer,
        analysis: normalized.analysis,
        recommendations: normalized.recommendations,
        nextActions: normalized.nextActions,
        findings: normalized.findings,
        routeSuggestions: normalized.routeSuggestions,
        outputType: normalized.outputType,
        adIdeas: normalized.adIdeas,
        campaignPackage: normalized.campaignPackage,
        contentPack: normalized.contentPack,
        seoPlan: normalized.seoPlan,
        researchReport: normalized.researchReport,
        operationsPlan: normalized.operationsPlan,
        executiveBrief: normalized.executiveBrief,
        missingData: normalized.missingData,
        raw: normalized.raw
      };
    }
  };
}

module.exports = {
  createOpenAiProvider
};
