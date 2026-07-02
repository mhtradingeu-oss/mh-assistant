// Migration script: canonical-first source-of-truth registry migration
// Dry-run by default. Use --write to apply changes.
// Usage: node scripts/migrate-source-of-truth-registry.js --project hairoticmen [--write]

const fs = require('fs');
const path = require('path');

function getProjectPaths(project) {
  const base = path.join(__dirname, '../data/projects', project);
  return {
    canonical: path.join(base, 'source-of-truth-registry.json'),
    legacy: path.join(base, 'sources-registry.json')
  };
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

function main() {
  const argv = process.argv.slice(2);
  const project = argv.includes('--project') ? argv[argv.indexOf('--project') + 1] : null;
  const doWrite = argv.includes('--write');
  if (!project) {
    console.error('Usage: node scripts/migrate-source-of-truth-registry.js --project <name> [--write]');
    process.exit(1);
  }
  const paths = getProjectPaths(project);
  if (!fs.existsSync(paths.canonical)) {
    console.error('Canonical registry not found:', paths.canonical);
    process.exit(1);
  }
  const canonicalRaw = JSON.parse(fs.readFileSync(paths.canonical, 'utf8'));
  const canonicalSources = extractSourceRegistryEntries(canonicalRaw);
  let legacyRaw = {};
  if (fs.existsSync(paths.legacy)) {
    legacyRaw = JSON.parse(fs.readFileSync(paths.legacy, 'utf8'));
  }
  const legacySources = extractSourceRegistryEntries(legacyRaw);
  // Check for non-empty value/status/source conflicts (ignore updated_at/verified_at)
  for (const [k, v] of Object.entries(legacySources)) {
    if (canonicalSources[k]) {
      const legacyCore = {
        value: v.value,
        status: v.status,
        source: v.source
      };
      const canonCore = {
        value: canonicalSources[k].value,
        status: canonicalSources[k].status,
        source: canonicalSources[k].source
      };
      // Only block if core fields differ and legacy is non-empty
      const legacyHasMeaning = [v.value, v.status, v.source].some(Boolean);
      if (legacyHasMeaning && JSON.stringify(legacyCore) !== JSON.stringify(canonCore)) {
        console.error(`Conflict for key '${k}': legacy and canonical differ in value/status/source and legacy is non-empty.`);
        process.exit(1);
      }
    }
  }
  // Regenerate legacy from canonical
  if (doWrite) {
    fs.writeFileSync(paths.legacy, JSON.stringify(canonicalSources, null, 2) + '\n');
    console.log('Legacy registry updated from canonical.');
  } else {
    console.log('[Dry-run] Would update legacy registry from canonical:');
    console.log(JSON.stringify(canonicalSources, null, 2));
  }
}

if (require.main === module) {
  main();
}
