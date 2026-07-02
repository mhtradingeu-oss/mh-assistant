'use strict';

function normalizeText(input) {
  if (typeof input === 'string') {
    return input.trim();
  }

  if (!input || typeof input !== 'object') {
    return '';
  }

  const candidateFields = [
    input.message,
    input.prompt,
    input.task,
    input.goal,
    input.description,
    input.instruction,
    input.instructions,
    input.request,
    input.query
  ];

  const merged = candidateFields
    .filter((value) => typeof value === 'string' && value.trim())
    .join(' ')
    .trim();

  if (merged) {
    return merged;
  }

  try {
    return JSON.stringify(input);
  } catch (_) {
    return '';
  }
}

function detectDomain(text) {
  const lower = String(text || '').toLowerCase();

  if (/campaign|ad\s|ads\b|funnel|copy|seo|brand|cta|audience|conversion/.test(lower)) {
    return 'marketing';
  }

  if (/code|api|bug|backend|frontend|refactor|deploy|ci|test|debug|node|javascript/.test(lower)) {
    return 'dev';
  }

  if (/runbook|incident|uptime|latency|monitor|sre|ops|rotation|on-?call|governance/.test(lower)) {
    return 'ops';
  }

  if (/video|image|thumbnail|voice|script|edit|render|storyboard|media/.test(lower)) {
    return 'media';
  }

  return 'ops';
}

function detectIntent(text, domain) {
  const lower = String(text || '').toLowerCase();

  if (/plan|strategy|roadmap|blueprint/.test(lower)) {
    return 'strategic_planning';
  }

  if (/review|audit|analy[sz]e|assessment/.test(lower)) {
    return 'analysis';
  }

  if (domain === 'media' && /video|storyboard|script|shot list/.test(lower)) {
    return 'media_generation';
  }

  if (domain === 'marketing' && /campaign|launch|promotion/.test(lower)) {
    return 'campaign_execution';
  }

  if (domain === 'dev' && /build|implement|fix|feature/.test(lower)) {
    return 'implementation';
  }

  if (domain === 'ops' && /incident|rollback|restore|hotfix/.test(lower)) {
    return 'operations_response';
  }

  return 'task_execution';
}

function detectRiskLevel(text, context) {
  const lower = String(text || '').toLowerCase();
  const contextRisk = String(context && context.risk_level ? context.risk_level : '').toLowerCase();

  if (contextRisk === 'high' || contextRisk === 'medium' || contextRisk === 'low') {
    return contextRisk;
  }

  if (/delete|drop\s+table|production|live\s+data|payment|credential|token|legal|compliance|customer\s+data/.test(lower)) {
    return 'high';
  }

  if (/deploy|migration|schema|permission|security|publish|billing/.test(lower)) {
    return 'medium';
  }

  return 'low';
}

function parseIntent(input, context) {
  const text = normalizeText(input);
  const domain = detectDomain(text);
  const intent = detectIntent(text, domain);
  const riskLevel = detectRiskLevel(text, context || {});

  return {
    intent,
    domain,
    risk_level: riskLevel,
    text
  };
}

module.exports = {
  parseIntent,
  normalizeText
};
