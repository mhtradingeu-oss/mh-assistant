'use strict';

/**
 * verify-ai-marketing-engine.js
 *
 * Verifies AI Command marketing routing and response shaping without calling
 * an external AI provider or writing project data.
 *
 * Run with: node scripts/verify-ai-marketing-engine.js
 */

const {
  __private: {
    classifyIntent,
    buildResponseFromContext
  }
} = require('../runtime/orchestrator-service/lib/ops/ai-orchestrator');

let passed = 0;
let failed = 0;

function assert(label, condition, details = '') {
  if (condition) {
    console.log(`  PASS  ${label}`);
    passed += 1;
  } else {
    console.error(`  FAIL  ${label}${details ? ` - ${details}` : ''}`);
    failed += 1;
  }
}

function containsObjectLeak(value) {
  return JSON.stringify(value).includes('[object Object]');
}

function createContext() {
  return {
    project: 'hairoticmen',
    generated_at: new Date().toISOString(),
    summary: {
      project_name: 'HAIROTICMEN',
      goal: 'Launch premium men grooming products in Germany.',
      audience: 'Men in Germany who want confident beard and hair grooming routines.',
      critical_gaps: ['brand guideline', 'product proof assets'],
      next_best_actions: ['Lock campaign offer', 'Prepare launch assets'],
      recommendations: [
        { title: 'Proof-led creative', action: 'Use before and after grooming proof in German-market creative.' }
      ],
      connected_integrations: ['Website', 'Meta Ads']
    },
    research: {
      missing_signals: ['Competitor pricing proof']
    }
  };
}

function build(command, providerOutput, selectedMode = 'executive') {
  const classified = classifyIntent(command, selectedMode);
  const response = buildResponseFromContext(command, createContext(), classified, {
    provider: 'verification',
    model: 'local-contract',
    ...providerOutput
  });
  return { classified, response };
}

console.log('\n--- [A] Ad ideas route and output ---');
{
  const command = 'Give me 3 ad ideas for beard oil in Germany';
  const { classified, response } = build(command, {
    outputType: 'ad_ideas',
    title: 'Beard Oil ad ideas',
    summary: 'Three German-market ad ideas for HAIROTICMEN Beard Oil.',
    content: 'Three ad ideas for HAIROTICMEN Beard Oil in Germany.',
    analysis: 'These ideas emphasize confidence, softness, and routine upgrade.',
    recommendations: ['Prioritize Meta and TikTok variants.'],
    nextActions: ['Draft the strongest variant in Content Studio.'],
    adIdeas: [
      {
        hook: 'Dein Bart wirkt trocken?',
        primaryText: 'HAIROTICMEN Beard Oil macht die Routine leichter und den Bart gepflegter.',
        headline: 'Bartpflege ohne Kompromisse',
        cta: 'Jetzt testen',
        audienceSegment: 'Men 25-45 in Germany',
        emotionalTrigger: 'Confidence',
        platformFit: 'Meta',
        visualDirection: 'Close-up beard routine'
      },
      {
        hook: 'Weicher Bart, staerkerer Auftritt',
        primaryText: 'Ein paar Tropfen Beard Oil bringen Pflege in deinen Morgen.',
        headline: 'Upgrade deine Bartpflege',
        cta: 'Shop Beard Oil',
        audienceSegment: 'Style-conscious buyers',
        emotionalTrigger: 'Self-respect',
        platformFit: 'TikTok',
        visualDirection: 'Before and after texture'
      },
      {
        hook: 'Barbershop-Gefuehl zuhause',
        primaryText: 'Premium Pflege fuer Maenner, die ihren Look bewusst tragen.',
        headline: 'Premium Beard Oil',
        cta: 'Mehr erfahren',
        audienceSegment: 'Warm grooming prospects',
        emotionalTrigger: 'Professional polish',
        platformFit: 'Google/Meta',
        visualDirection: 'Bathroom shelf product shot'
      }
    ]
  });

  assert('classified as ads', classified.intent === 'ads' && classified.resolvedModeId === 'ads');
  assert('outputType is ad_ideas', response.outputType === 'ad_ideas');
  assert('contains at least 3 ad ideas', response.adIdeas.length >= 3);
  assert('not inspect-only', classified.intent !== 'inspect' && response.routeSuggestions.some((item) => item.route === 'ads-manager'));
  assert('no object string leaks', !containsObjectLeak(response));
}

console.log('\n--- [B] Campaign package route and output ---');
{
  const command = 'Build a launch campaign for HAIROTICMEN in Germany focused on Beard Kit, Beard Oil, and Hair Wax';
  const { classified, response } = build(command, {
    outputType: 'campaign_package',
    title: 'HAIROTICMEN launch campaign',
    summary: 'A German launch package for Beard Kit, Beard Oil, and Hair Wax.',
    content: 'Launch HAIROTICMEN with a grooming routine offer and three-phase rollout.',
    analysis: 'The package uses routine-building and premium grooming confidence as the core angle.',
    recommendations: ['Lead with Beard Kit as the bundle anchor.'],
    campaignPackage: {
      concept: 'Premium Routine Launch',
      targetAudience: 'Men in Germany building a better beard and hair routine.',
      offer: 'Starter bundle with Beard Kit, Beard Oil, and Hair Wax.',
      products: ['Beard Kit', 'Beard Oil', 'Hair Wax'],
      channels: ['Instagram', 'TikTok', 'Email', 'Meta Ads'],
      launchPhases: [
        { name: 'Tease', goal: 'Create grooming routine curiosity.', actions: ['Publish hooks', 'Collect waitlist'], channels: ['Instagram', 'TikTok'] },
        { name: 'Launch', goal: 'Drive first purchases.', actions: ['Run ads', 'Send launch email'], channels: ['Meta Ads', 'Email'] },
        { name: 'Retarget', goal: 'Convert warm visitors.', actions: ['Refresh proof ads', 'Push offer reminder'], channels: ['Meta Ads'] }
      ],
      contentAngles: ['Dry beard fix', 'Routine upgrade', 'Barbershop confidence'],
      adAngles: ['Before and after', 'Bundle value', 'German premium grooming'],
      requiredAssets: ['Product photos', 'Routine video', 'Offer banner'],
      missingBlockers: ['Product proof assets', 'Final bundle price'],
      nextActions: ['Lock offer', 'Create content briefs'],
      suggestedHandoffs: ['content-studio', 'media-studio', 'publishing', 'ads-manager']
    }
  });

  assert('classified as campaign', classified.intent === 'campaign' && classified.resolvedModeId === 'campaign');
  assert('outputType is campaign_package', response.outputType === 'campaign_package');
  assert('includes phases', response.campaignPackage.launchPhases.length >= 3);
  assert('includes channels', response.campaignPackage.channels.length >= 3);
  assert('includes products', response.campaignPackage.products.includes('Beard Oil'));
  assert('includes offer, assets, next actions', Boolean(response.campaignPackage.offer) && response.campaignPackage.requiredAssets.length && response.campaignPackage.nextActions.length);
}

console.log('\n--- [C] Instagram hooks route and output ---');
{
  const command = 'Generate 5 Instagram hooks for Beard Oil';
  const { classified, response } = build(command, {
    outputType: 'content_pack',
    title: 'Instagram hooks for Beard Oil',
    summary: 'Five hook options for HAIROTICMEN Beard Oil.',
    content: 'Five hooks for Instagram creative.',
    analysis: 'Hooks focus on dryness, confidence, and daily grooming.',
    contentPack: {
      hooks: [
        'Dein Bart fuehlt sich trocken an?',
        '3 Tropfen, ein gepflegterer Look.',
        'Bartpflege, die nicht nach Aufwand aussieht.',
        'Vom strohig zum gepflegt.',
        'Dein Morgenritual braucht ein Upgrade.'
      ]
    }
  }, 'content');

  assert('routes to content or ads', ['content', 'ads'].includes(classified.intent));
  assert('outputType is content_pack or ad_ideas', ['content_pack', 'ad_ideas'].includes(response.outputType));
  assert('includes hooks', containsObjectLeak(response) === false && JSON.stringify(response).toLowerCase().includes('hook'));
}

console.log('\n--- [D] Executive blockers route and output ---');
{
  const command = 'What are the top blockers for launching this campaign?';
  const { classified, response } = build(command, {
    outputType: 'executive_brief',
    title: 'Launch blocker brief',
    summary: 'The biggest launch blockers are offer lock, proof assets, and final approvals.',
    content: 'Resolve offer, proof, and approval blockers before execution.',
    analysis: 'These blockers affect paid, publishing, and conversion readiness.',
    recommendations: ['Close product proof and offer documentation first.'],
    executiveBrief: {
      blockers: ['Missing product proof assets', 'Bundle offer not locked', 'Approval path incomplete'],
      priorities: ['Offer', 'Assets', 'Approvals'],
      decision: 'Do not launch paid spend until offer and proof assets are ready.',
      nextBestAction: 'Lock the Beard Kit offer and request product visuals.'
    }
  });

  assert('classified as executive', classified.intent === 'executive' && classified.resolvedModeId === 'executive');
  assert('outputType is executive_brief', response.outputType === 'executive_brief');
  assert('includes blockers', JSON.stringify(response.executiveBrief).toLowerCase().includes('blocker'));
  assert('includes priorities', JSON.stringify(response.executiveBrief).toLowerCase().includes('priorit'));
}

console.log(`\nResult: ${passed} passed, ${failed} failed`);
if (failed) {
  process.exit(1);
}
