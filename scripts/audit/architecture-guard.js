const fs = require('fs');
const path = require('path');

const FILE = 'runtime/orchestrator-service/server.js';

const forbiddenPatterns = [
  'score_sum',
  'ctr_sum',
  'conversion_rate_sum',
  'revenue_sum',
  'roas_sum',
  'performance_score',
  'calculateEntityPerformance',
  'buildPerformanceSummary',
  'buildRiskAlerts',
  'decideMode',
  'collectExecutionSignals',
  'decideApproval'
];

function scan(file) {
  const code = fs.readFileSync(file, 'utf8');

  const violations = forbiddenPatterns.filter(p =>
    code.includes(p)
  );

  if (violations.length > 0) {
    console.error('❌ ARCHITECTURE VIOLATION DETECTED:\n');
    violations.forEach(v => console.error(' - ' + v));
    process.exit(1);
  }

  console.log('🟢 Architecture Clean: Orchestrator is pure router');
}

scan(FILE);
