'use strict';

function uniqueChain(chain) {
  return Array.from(new Set(chain.filter(Boolean)));
}

function baseChainByDomain(domain) {
  switch (domain) {
    case 'marketing':
      return ['strategist', 'writer', 'designer'];
    case 'dev':
      return ['strategist', 'developer', 'qa'];
    case 'media':
      return ['strategist', 'designer', 'video_lead', 'editor'];
    case 'ops':
    default:
      return ['strategist', 'ops_lead', 'risk_officer'];
  }
}

function selectSpecialists(intentProfile, context) {
  const domain = intentProfile && intentProfile.domain ? intentProfile.domain : 'ops';
  const intent = intentProfile && intentProfile.intent ? intentProfile.intent : 'task_execution';
  const text = String(intentProfile && intentProfile.text ? intentProfile.text : '').toLowerCase();

  const chain = baseChainByDomain(domain).slice();

  if (domain === 'media' && /voice|script/.test(text)) {
    chain.push('writer');
  }

  if (intent === 'analysis') {
    chain.push('analyst');
  }

  if (context && Array.isArray(context.preferred_specialists)) {
    chain.push(...context.preferred_specialists.map((value) => String(value || '').trim().toLowerCase()));
  }

  return uniqueChain(chain);
}

module.exports = {
  selectSpecialists
};
