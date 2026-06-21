import fs from "fs";
import path from "path";

const root = process.cwd();
const pagesDir = path.join(root, "public/control-center/pages");
const appPath = path.join(root, "public/control-center/app.js");
const routerPath = path.join(root, "public/control-center/router.js");

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function normalizeRel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function importTargets(file, text) {
  const dir = path.dirname(file);
  const targets = [];
  const regex = /import\s+(?:[\s\S]*?)\s+from\s+["']([^"']+)["']/g;
  for (const match of text.matchAll(regex)) {
    const spec = match[1];
    if (!spec.startsWith(".")) continue;
    let resolved = path.resolve(dir, spec);
    if (!resolved.endsWith(".js")) resolved += ".js";
    targets.push(normalizeRel(resolved));
  }
  return targets;
}

const allJsFiles = [
  appPath,
  routerPath,
  ...walk(pagesDir)
].filter((file, index, arr) => arr.indexOf(file) === index);

const pageFiles = walk(pagesDir);
const allTexts = new Map(allJsFiles.map((file) => [normalizeRel(file), read(file)]));

const importGraph = {};
for (const file of allJsFiles) {
  const rel = normalizeRel(file);
  importGraph[rel] = importTargets(file, read(file));
}

const importedBy = {};
for (const [from, targets] of Object.entries(importGraph)) {
  for (const target of targets) {
    importedBy[target] ||= [];
    importedBy[target].push(from);
  }
}

const routerText = read(routerPath);
const appText = read(appPath);
const combinedText = [...allTexts.values()].join("\n");

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function routeIdFor(text) {
  const idMatch = text.match(/id:\s*["']([^"']+)["']/);
  return idMatch ? idMatch[1] : "";
}

function exportNames(text) {
  return [...text.matchAll(/export\s+const\s+([A-Za-z0-9_$]+)/g)].map((m) => m[1]);
}

const rows = pageFiles.map((file) => {
  const rel = normalizeRel(file);
  const text = read(file);
  const base = path.basename(file);
  const stem = base.replace(/\.js$/, "");
  const routeId = routeIdFor(text);
  const exports = exportNames(text);

  const imported = importedBy[rel] || [];
  const importedDirectlyByRouter = imported.includes("public/control-center/router.js");
  const importedDirectlyByApp = imported.includes("public/control-center/app.js");

  const stringRefs = countOccurrences(combinedText, routeId || stem);
  const pathRefs = countOccurrences(combinedText, rel);

  const status =
    importedDirectlyByRouter ? "active-routed" :
    importedDirectlyByApp ? "active-app-import" :
    imported.length ? "imported-module" :
    stringRefs > 1 ? "referenced-by-string-only" :
    "candidate-unused";

  return {
    file: rel,
    lines: text.split(/\r?\n/).length,
    size_bytes: Buffer.byteLength(text),
    exports,
    route_id: routeId,
    imported_by: imported,
    imported_by_count: imported.length,
    imported_directly_by_router: importedDirectlyByRouter,
    imported_directly_by_app: importedDirectlyByApp,
    route_or_stem_string_refs: stringRefs,
    path_string_refs: pathRefs,
    status
  };
}).sort((a, b) => {
  const order = {
    "active-routed": 0,
    "active-app-import": 1,
    "imported-module": 2,
    "referenced-by-string-only": 3,
    "candidate-unused": 4
  };
  return order[a.status] - order[b.status] || a.file.localeCompare(b.file);
});

const duplicateNameGroups = {};
for (const row of rows) {
  const normalized = row.file
    .replace(/^public\/control-center\/pages\//, "")
    .replace(/\/workspace\.js$/, "-workspace.js")
    .replace(/\.js$/, "");
  duplicateNameGroups[normalized] ||= [];
  duplicateNameGroups[normalized].push(row.file);
}

const possibleDuplicates = Object.entries(duplicateNameGroups)
  .filter(([, files]) => files.length > 1)
  .map(([key, files]) => ({ key, files }));

const candidateUnused = rows.filter((row) => row.status === "candidate-unused");
const stringOnly = rows.filter((row) => row.status === "referenced-by-string-only");

fs.mkdirSync(path.join(root, "audits/system-truth/t73-dead-duplicate-frontend-files"), { recursive: true });

const result = {
  status: "audit-only",
  total_page_files: rows.length,
  candidate_unused_count: candidateUnused.length,
  string_only_count: stringOnly.length,
  possible_duplicate_groups_count: possibleDuplicates.length,
  rows,
  possible_duplicate_groups: possibleDuplicates
};

fs.writeFileSync(
  path.join(root, "audits/system-truth/t73-dead-duplicate-frontend-files/t73-dead-duplicate-frontend-files.json"),
  JSON.stringify(result, null, 2)
);

function table(items) {
  if (!items.length) return "| File | Status | Imported By | Route ID | Exports |\n|---|---|---:|---|---|\n";
  return [
    "| File | Status | Imported By | Route ID | Exports |",
    "|---|---|---:|---|---|",
    ...items.map((row) =>
      `| \`${row.file}\` | ${row.status} | ${row.imported_by_count} | ${row.route_id || "-"} | ${row.exports.join(", ") || "-"} |`
    )
  ].join("\n");
}

const md = `# T73 — Dead / Duplicate Frontend Files Audit

## Status
Audit-only. No files deleted.

## Scope
Audit frontend page JS files under:

- \`public/control-center/pages\`

## Summary
- Total page JS files: ${rows.length}
- Candidate unused files: ${candidateUnused.length}
- String-only referenced files: ${stringOnly.length}
- Possible duplicate groups: ${possibleDuplicates.length}

## Active / Imported / Candidate Classification
${table(rows)}

## Candidate Unused Files
${candidateUnused.length ? candidateUnused.map((row) => `- \`${row.file}\``).join("\n") : "- none"}

## String-only Referenced Files
${stringOnly.length ? stringOnly.map((row) => `- \`${row.file}\``).join("\n") : "- none"}

## Possible Duplicate Groups
${possibleDuplicates.length ? possibleDuplicates.map((group) => `- ${group.key}: ${group.files.map((f) => `\`${f}\``).join(", ")}`).join("\n") : "- none"}

## Decision Rule
Do not delete from this audit alone.

A file can be removed only after:
1. It is not imported by router/app/other modules.
2. It is not required by dynamic import or runtime lookup.
3. No route id depends on it.
4. A targeted removal patch is reviewed.
5. Syntax checks pass.
6. Browser QA confirms the route still works.
`;

fs.writeFileSync(
  path.join(root, "audits/system-truth/t73-dead-duplicate-frontend-files/T73_DEAD_DUPLICATE_FRONTEND_FILES_AUDIT.md"),
  md
);

console.log("Generated audits/system-truth/t73-dead-duplicate-frontend-files/T73_DEAD_DUPLICATE_FRONTEND_FILES_AUDIT.md");
