'use strict';

function asText(value) {
  return String(value == null ? '' : value).trim();
}

function includesAny(text, terms) {
  const normalized = text.toLowerCase();
  return terms.some(term => normalized.includes(String(term).toLowerCase()));
}

function scoreNativeMediaPlan(plan = {}) {
  const prompt = asText(plan.prompt || plan.video_brief || plan.voice_script || plan.description);
  const mediaType = asText(plan.media_type || plan.type);
  const platform = asText(plan.platform);
  const productName = asText(plan.product_name || plan.product);
  const hook = asText(plan.hook);
  const sceneBeats = Array.isArray(plan.scene_beats) ? plan.scene_beats : [];
  const avoidText = asText(plan.avoid || plan.compliance_avoid);

  const checks = [
    {
      id: 'has_media_type',
      passed: Boolean(mediaType),
      weight: 10,
      reason: 'Media type is required.'
    },
    {
      id: 'has_platform',
      passed: Boolean(platform),
      weight: 10,
      reason: 'Platform context improves output fit.'
    },
    {
      id: 'has_product',
      passed: Boolean(productName) || includesAny(prompt, ['product', 'brand']),
      weight: 15,
      reason: 'Product identity must be present.'
    },
    {
      id: 'has_hook',
      passed: Boolean(hook) || includesAny(prompt, ['hook', 'first 2 seconds', 'attention']),
      weight: 15,
      reason: 'A strong opening hook is required.'
    },
    {
      id: 'has_scene_structure',
      passed: sceneBeats.length >= 3 || includesAny(prompt, ['scene', 'beat', 'shot']),
      weight: 15,
      reason: 'Video/audio output needs scene or beat structure.'
    },
    {
      id: 'has_cta',
      passed: includesAny(prompt, ['cta', 'call to action', 'discover', 'shop', 'learn more', 'jetzt']),
      weight: 10,
      reason: 'A publishing-ready asset needs a CTA.'
    },
    {
      id: 'has_brand_safety',
      passed: includesAny(prompt + ' ' + avoidText, ['avoid', 'compliance', 'medical claims', 'brand-safe']),
      weight: 15,
      reason: 'Brand safety constraints are required.'
    },
    {
      id: 'has_format',
      passed: includesAny(prompt, ['9:16', '1:1', '16:9', 'format']),
      weight: 10,
      reason: 'Output format should be explicit.'
    }
  ];

  const score = checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0);
  const failed = checks.filter(check => !check.passed);

  return {
    score,
    status: score >= 85 ? 'ready' : score >= 65 ? 'needs_review' : 'weak',
    checks,
    failed_checks: failed,
    recommendations: failed.map(item => item.reason),
    scored_at: new Date().toISOString()
  };
}

module.exports = {
  scoreNativeMediaPlan
};
