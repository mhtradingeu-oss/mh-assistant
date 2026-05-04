#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_DIR = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');
const EXECUTION_PROJECTS_DIR = path.join(BASE_DIR, 'data', 'execution', 'projects');
const TARGET_DOMAINS = new Set([
  'email',
  'generated',
  'publishing',
  'campaign-execution',
  'campaign-finalization',
  'execution-results'
]);

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];

  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function toDualWriteIndex(entries) {
  const map = new Map();

  for (const entry of entries) {
    const domain = String(entry.domain || '').trim().toLowerCase();
    const identifier = String(entry.identifier || '').trim();
    if (!domain || !identifier) continue;

    const key = `${domain}::${identifier}`;
    const current = map.get(key);
    const nextTime = new Date(entry.timestamp || 0).getTime() || 0;
    const currentTime = current ? new Date(current.timestamp || 0).getTime() || 0 : 0;

    if (!current || nextTime >= currentTime) {
      map.set(key, entry);
    }
  }

  return map;
}

function classifyFallback(readEntry, dualWriteIndex) {
  if (!readEntry || readEntry.selected_root !== 'legacy' || !readEntry.legacy_fallback_hit) {
    return null;
  }

  if (readEntry.canonical_hit) {
    return 'policy_or_config_mismatch';
  }

  const domain = String(readEntry.domain || '').trim().toLowerCase();
  const identifier = String(readEntry.requested_identifier || '').trim();
  const requestedFile = String(readEntry.requested_file || '').trim();

  if (domain && identifier) {
    const dualWrite = dualWriteIndex.get(`${domain}::${identifier}`);
    if (dualWrite && Array.isArray(dualWrite.writes)) {
      const canonicalSuccess = dualWrite.writes.some((item) => item.root === 'canonical' && item.status === 'success');
      const canonicalFailed = dualWrite.writes.some((item) => item.root === 'canonical' && item.status === 'failed');
      const legacySuccess = dualWrite.writes.some((item) => item.root === 'legacy' && item.status === 'success');

      if (canonicalFailed && legacySuccess) return 'missing_canonical_write';
      if (canonicalSuccess) return 'structural_mismatch';
    }
  }

  if (!identifier || requestedFile.includes('*')) {
    return 'historical_artifact';
  }

  return 'parity_gap';
}

function createDomainStats() {
  return {
    read_events: 0,
    canonical_hit_count: 0,
    fallback_hit_count: 0,
    fallback_rate: 0,
    fallback_causes: {
      historical_artifact: 0,
      parity_gap: 0,
      structural_mismatch: 0,
      missing_canonical_write: 0,
      policy_or_config_mismatch: 0,
      unresolved_risk: 0
    }
  };
}

function summarizeProject(projectName) {
  const telemetryDir = path.join(EXECUTION_PROJECTS_DIR, projectName, 'telemetry');
  const readLogPath = path.join(telemetryDir, 'read-redirection-log.jsonl');
  const dualWriteLogPath = path.join(telemetryDir, 'dual-write-log.jsonl');

  const readEntries = readJsonLines(readLogPath);
  const dualWriteEntries = readJsonLines(dualWriteLogPath);
  const dualWriteIndex = toDualWriteIndex(dualWriteEntries);

  const byDomain = {};

  for (const entry of readEntries) {
    const domain = String(entry.domain || '').trim().toLowerCase();
    if (!TARGET_DOMAINS.has(domain)) continue;

    if (!byDomain[domain]) byDomain[domain] = createDomainStats();
    const stats = byDomain[domain];

    stats.read_events += 1;
    if (entry.selected_root === 'canonical') stats.canonical_hit_count += 1;

    if (entry.selected_root === 'legacy' && entry.legacy_fallback_hit) {
      stats.fallback_hit_count += 1;
      const cause = classifyFallback(entry, dualWriteIndex) || 'unresolved_risk';
      if (!Object.prototype.hasOwnProperty.call(stats.fallback_causes, cause)) {
        stats.fallback_causes.unresolved_risk += 1;
      } else {
        stats.fallback_causes[cause] += 1;
      }
    }
  }

  let totalReads = 0;
  let canonicalHits = 0;
  let fallbackHits = 0;
  let historicalFallbacks = 0;
  let structuralMismatches = 0;
  let activeMismatches = 0;

  for (const domain of Object.keys(byDomain)) {
    const stats = byDomain[domain];
    stats.fallback_rate = stats.read_events > 0
      ? Number((stats.fallback_hit_count / stats.read_events).toFixed(4))
      : 0;

    totalReads += stats.read_events;
    canonicalHits += stats.canonical_hit_count;
    fallbackHits += stats.fallback_hit_count;
    historicalFallbacks += stats.fallback_causes.historical_artifact;
    structuralMismatches += stats.fallback_causes.structural_mismatch;
    activeMismatches +=
      stats.fallback_causes.parity_gap +
      stats.fallback_causes.missing_canonical_write +
      stats.fallback_causes.policy_or_config_mismatch;
  }

  const canonicalHitRate = totalReads > 0 ? canonicalHits / totalReads : 0;
  const fallbackRate = totalReads > 0 ? fallbackHits / totalReads : 0;
  const historicalFallbackRate = fallbackHits > 0 ? historicalFallbacks / fallbackHits : 0;

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    totals: {
      read_events: totalReads,
      canonical_hit_count: canonicalHits,
      fallback_hit_count: fallbackHits,
      canonical_hit_rate: Number(canonicalHitRate.toFixed(4)),
      fallback_rate: Number(fallbackRate.toFixed(4)),
      fallback_historical_rate: Number(historicalFallbackRate.toFixed(4)),
      unresolved_structural_mismatches: structuralMismatches,
      active_write_read_mismatches: activeMismatches
    },
    by_domain: byDomain
  };
}

function listProjects() {
  if (!fs.existsSync(EXECUTION_PROJECTS_DIR)) return [];
  return fs
    .readdirSync(EXECUTION_PROJECTS_DIR)
    .filter((name) => fs.statSync(path.join(EXECUTION_PROJECTS_DIR, name)).isDirectory())
    .sort();
}

function main() {
  const projectArg = String(process.argv[2] || '').trim().toLowerCase();
  const projects = projectArg ? [projectArg] : listProjects();

  const summaries = projects.map((project) => summarizeProject(project));

  const aggregate = summaries.reduce(
    (acc, summary) => {
      acc.read_events += summary.totals.read_events;
      acc.canonical_hit_count += summary.totals.canonical_hit_count;
      acc.fallback_hit_count += summary.totals.fallback_hit_count;
      acc.unresolved_structural_mismatches += summary.totals.unresolved_structural_mismatches;
      acc.active_write_read_mismatches += summary.totals.active_write_read_mismatches;
      return acc;
    },
    {
      read_events: 0,
      canonical_hit_count: 0,
      fallback_hit_count: 0,
      unresolved_structural_mismatches: 0,
      active_write_read_mismatches: 0
    }
  );

  aggregate.canonical_hit_rate = aggregate.read_events > 0
    ? Number((aggregate.canonical_hit_count / aggregate.read_events).toFixed(4))
    : 0;
  aggregate.fallback_rate = aggregate.read_events > 0
    ? Number((aggregate.fallback_hit_count / aggregate.read_events).toFixed(4))
    : 0;

  const output = {
    generated_at: new Date().toISOString(),
    project_count: summaries.length,
    aggregate,
    projects: summaries
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
