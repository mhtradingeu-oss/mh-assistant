// Verification script: checks canonical.sources equals legacy flat projection for a project
// Usage: node scripts/verify-source-of-truth-migration.js --project hairoticmen

const fs = require('fs');
const path = require('path');

function getProjectPaths(project) {
  const base = path.join(__dirname, '../data/projects', project);
  return {
    canonical: path.join(base, 'source-of-truth-registry.json'),
    legacy: path.join(base, 'sources-registry.json')
  };
}

function main() {
  const argv = process.argv.slice(2);
  const project = argv.includes('--project') ? argv[argv.indexOf('--project') + 1] : null;
  if (!project) {
    console.error('Usage: node scripts/verify-source-of-truth-migration.js --project <name>');
    process.exit(1);
  }
  const paths = getProjectPaths(project);
  if (!fs.existsSync(paths.canonical) || !fs.existsSync(paths.legacy)) {
    console.error('Canonical or legacy registry not found.');
    process.exit(1);
  }
  const canonicalRaw = JSON.parse(fs.readFileSync(paths.canonical, 'utf8'));
  const legacyRaw = JSON.parse(fs.readFileSync(paths.legacy, 'utf8'));
  const canonicalSources = extractSourceRegistryEntries(canonicalRaw);
  const legacySources = extractSourceRegistryEntries(legacyRaw);
  const canonStr = JSON.stringify(canonicalSources);
  const legacyStr = JSON.stringify(legacySources);
  if (canonStr === legacyStr) {
    console.log('PASS: canonical.sources and legacy registry are equal.');
    process.exit(0);
  } else {
    console.error('FAIL: canonical.sources and legacy registry differ.');
    process.exit(2);
  }
}

function extractSourceRegistryEntries(value) {
  if (!value || typeof value !== 'object') return {};
  if (value.sources && typeof value.sources === 'object' && !Array.isArray(value.sources)) {
    return value.sources;
  }
  // Defensive: skip wrapper keys if present
  const omitKeys = new Set(['updated_at', 'statuses', 'required_sources', 'sources']);
  return Object.fromEntries(
    Object.entries(value).filter(([k]) => !omitKeys.has(k))
  );
}

if (require.main === module) {
  main();
}
