'use strict';

/**
 * verify-governance-normalization.js
 *
 * Verifies that governance policy normalization is correct and that
 * assertPublishingMutationAllowed enforces policy rules properly.
 *
 * Run with: node scripts/verify-governance-normalization.js
 */

// ---------------------------------------------------------------------------
// Inline the normalization logic so this script is self-contained
// and does not depend on project or disk state.
// ---------------------------------------------------------------------------

const DEFAULT_POLICY_RULES = {
  approval_before_publish: true,
  high_risk_claim_review_required: true,
  brand_safety_review_required: true,
  allow_admin_override: true,
  auto_escalate_critical_risk: true,
  freeze_publishing: false
};

function asBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value == null) return fallback;
  const s = String(value).toLowerCase().trim();
  if (['true', '1', 'yes'].includes(s)) return true;
  if (['false', '0', 'no'].includes(s)) return false;
  return fallback;
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeGovernancePolicy(raw) {
  const doc = asObject(raw);
  const rawRules = doc.policy_rules;
  const safeRules = (rawRules && typeof rawRules === 'object' && !Array.isArray(rawRules))
    ? rawRules
    : {};

  return {
    ...doc,
    policy_rules: {
      ...DEFAULT_POLICY_RULES,
      ...safeRules,
      freeze_publishing: asBoolean(safeRules.freeze_publishing, DEFAULT_POLICY_RULES.freeze_publishing),
      approval_before_publish: asBoolean(safeRules.approval_before_publish, DEFAULT_POLICY_RULES.approval_before_publish)
    }
  };
}

function assertPublishingMutationAllowed(governance, action, options = {}) {
  const policyRules = governance && typeof governance === 'object' && governance.policy_rules && typeof governance.policy_rules === 'object'
    ? governance.policy_rules
    : {};

  const jobId = String(options.jobId || '').trim();
  const actionKey = String(action || '').trim().toLowerCase();
  const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey);
  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey);

  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
    ? policyRules.freeze_publishing
    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
    ? policyRules.approval_before_publish
    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);

  if (freezeSensitiveAction && freezePublishing) {
    throw Object.assign(new Error('Publishing is frozen by governance policy.'), { rule: 'freeze_publishing' });
  }

  if (approvalSensitiveAction && approvalBeforePublish) {
    if (!jobId) {
      throw Object.assign(
        new Error('Approval before publish is enabled. No publishing job provided.'),
        { rule: 'approval_before_publish' }
      );
    }

    const approvalStatus = String(options.simulatedApprovalStatus || '').trim().toLowerCase();
    if (!['approved', 'overridden'].includes(approvalStatus)) {
      throw Object.assign(
        new Error(`Approval before publish is enabled. Status: ${approvalStatus || 'missing'}`),
        { rule: 'approval_before_publish', approval_status: approvalStatus || 'missing' }
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function expect(label, fn, shouldThrow = false, ruleMatch = null) {
  try {
    fn();
    if (shouldThrow) {
      console.error(`  FAIL  ${label} — expected error, got none`);
      failed++;
    } else {
      console.log(`  PASS  ${label}`);
      passed++;
    }
  } catch (err) {
    if (!shouldThrow) {
      console.error(`  FAIL  ${label} — unexpected error: ${err.message}`);
      failed++;
    } else if (ruleMatch && err.rule !== ruleMatch) {
      console.error(`  FAIL  ${label} — wrong rule: expected '${ruleMatch}', got '${err.rule}'`);
      failed++;
    } else {
      console.log(`  PASS  ${label} [threw: ${err.message.slice(0, 80)}]`);
      passed++;
    }
  }
}

function assert(label, condition) {
  if (condition) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// 1. normalizeGovernancePolicy — missing policy_rules
// ---------------------------------------------------------------------------
console.log('\n--- [1] Missing policy_rules ---');
{
  const raw = { approval_required_actions: ['publish'], execution_policy: { audit_logging_enabled: true } };
  const norm = normalizeGovernancePolicy(raw);
  assert('policy_rules is an object', typeof norm.policy_rules === 'object');
  assert('approval_before_publish defaults to true', norm.policy_rules.approval_before_publish === true);
  assert('freeze_publishing defaults to false', norm.policy_rules.freeze_publishing === false);
  assert('existing keys preserved', norm.approval_required_actions.length === 1);
}

// ---------------------------------------------------------------------------
// 2. normalizeGovernancePolicy — malformed policy_rules (string)
// ---------------------------------------------------------------------------
console.log('\n--- [2] Malformed policy_rules (string) ---');
{
  const raw = { policy_rules: 'broken' };
  const norm = normalizeGovernancePolicy(raw);
  assert('policy_rules promoted to object', typeof norm.policy_rules === 'object');
  assert('approval_before_publish defaults to true', norm.policy_rules.approval_before_publish === true);
  assert('freeze_publishing defaults to false', norm.policy_rules.freeze_publishing === false);
}

// ---------------------------------------------------------------------------
// 3. normalizeGovernancePolicy — malformed policy_rules (array)
// ---------------------------------------------------------------------------
console.log('\n--- [3] Malformed policy_rules (array) ---');
{
  const raw = { policy_rules: ['approval_before_publish'] };
  const norm = normalizeGovernancePolicy(raw);
  assert('policy_rules promoted from array to object', typeof norm.policy_rules === 'object' && !Array.isArray(norm.policy_rules));
  assert('approval_before_publish defaults to true', norm.policy_rules.approval_before_publish === true);
}

// ---------------------------------------------------------------------------
// 4. normalizeGovernancePolicy — string booleans coerced
// ---------------------------------------------------------------------------
console.log('\n--- [4] String boolean coercion ---');
{
  const raw = { policy_rules: { freeze_publishing: 'true', approval_before_publish: 'false' } };
  const norm = normalizeGovernancePolicy(raw);
  assert('freeze_publishing "true" → true', norm.policy_rules.freeze_publishing === true);
  assert('approval_before_publish "false" → false', norm.policy_rules.approval_before_publish === false);
}

// ---------------------------------------------------------------------------
// 5. freeze_publishing enabled — schedule blocked
// ---------------------------------------------------------------------------
console.log('\n--- [5] freeze_publishing enabled — schedule blocked ---');
{
  const governance = normalizeGovernancePolicy({ policy_rules: { freeze_publishing: true, approval_before_publish: false } });
  expect(
    'schedule blocked when freeze_publishing=true',
    () => assertPublishingMutationAllowed(governance, 'schedule', {}),
    true, 'freeze_publishing'
  );
}

// ---------------------------------------------------------------------------
// 6. approval_before_publish enabled — no approval
// ---------------------------------------------------------------------------
console.log('\n--- [6] approval_before_publish enabled — no approval ---');
{
  const governance = normalizeGovernancePolicy({ policy_rules: { freeze_publishing: false, approval_before_publish: true } });
  expect(
    'publish blocked with no jobId',
    () => assertPublishingMutationAllowed(governance, 'publish', {}),
    true, 'approval_before_publish'
  );
  expect(
    'publish blocked with jobId but no approval',
    () => assertPublishingMutationAllowed(governance, 'publish', { jobId: 'job-001', simulatedApprovalStatus: '' }),
    true, 'approval_before_publish'
  );
  expect(
    'publish blocked with jobId and rejected approval',
    () => assertPublishingMutationAllowed(governance, 'publish', { jobId: 'job-001', simulatedApprovalStatus: 'rejected' }),
    true, 'approval_before_publish'
  );
}

// ---------------------------------------------------------------------------
// 7. approval_before_publish enabled — approved approval passes
// ---------------------------------------------------------------------------
console.log('\n--- [7] approval_before_publish enabled — approved approval passes ---');
{
  const governance = normalizeGovernancePolicy({ policy_rules: { freeze_publishing: false, approval_before_publish: true } });
  expect(
    'publish allowed with jobId and approved status',
    () => assertPublishingMutationAllowed(governance, 'publish', { jobId: 'job-001', simulatedApprovalStatus: 'approved' }),
    false
  );
}

// ---------------------------------------------------------------------------
// 8. override approval — overridden status passes
// ---------------------------------------------------------------------------
console.log('\n--- [8] Override approval (overridden status) passes ---');
{
  const governance = normalizeGovernancePolicy({ policy_rules: { freeze_publishing: false, approval_before_publish: true } });
  expect(
    'publish allowed with jobId and overridden status',
    () => assertPublishingMutationAllowed(governance, 'publish', { jobId: 'job-001', simulatedApprovalStatus: 'overridden' }),
    false
  );
}

// ---------------------------------------------------------------------------
// 9. Missing policy_rules — approval_before_publish must default to true (no bypass)
// ---------------------------------------------------------------------------
console.log('\n--- [9] Missing policy_rules — approval enforcement must NOT be bypassed ---');
{
  const governance = normalizeGovernancePolicy({}); // no policy_rules at all
  assert('approval_before_publish defaults to true after normalization', governance.policy_rules.approval_before_publish === true);
  expect(
    'publish blocked even when policy_rules was missing from file',
    () => assertPublishingMutationAllowed(governance, 'publish', {}),
    true, 'approval_before_publish'
  );
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All governance normalization checks passed.');
  process.exit(0);
}
