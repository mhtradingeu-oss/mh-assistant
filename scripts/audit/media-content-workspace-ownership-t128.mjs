import fs from "fs";
import path from "path";

const root = process.cwd();

const targets = [
  "public/control-center/pages/media-studio-workspace.js",
  "public/control-center/pages/content-studio-workspace.js"
];

const searchFiles = [
  "public/control-center/pages/media-studio.js",
  "public/control-center/pages/content-studio.js",
  "public/control-center/app.js",
  "public/control-center/router.js",
  "public/control-center/index.html"
];

function read(file) {
  const full = path.join(root, file);
  return fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "";
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function findReferences(targetFile) {
  const base = path.basename(targetFile);
  const stem = base.replace(/\.js$/, "");
  const refs = [];

  const allFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full);
      else if (item.isFile() && /\.(js|html|css)$/.test(item.name)) allFiles.push(full);
    }
  }

  walk(path.join(root, "public/control-center"));

  for (const full of allFiles) {
    const rel = path.relative(root, full).replaceAll(path.sep, "/");
    const text = fs.readFileSync(full, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (
        line.includes(base) ||
        line.includes(stem) ||
        line.includes(`./${base}`) ||
        line.includes(`./${stem}.js`) ||
        line.includes(`./${stem}`)
      ) {
        refs.push({ file: rel, line: index + 1, text: line.trim() });
      }
    });
  }

  return refs;
}

function collectSignals(file) {
  const text = read(file);
  const lines = text.split(/\r?\n/);
  const patterns = {
    imports: /^import\s/gim,
    exports: /^export\s/gim,
    backend_calls: /fetchProject|createProject|saveProject|updateProject|deleteProject|api\.|Project[A-Z]/gi,
    mutations: /create|update|delete|archive|save|submit|approve|reject|publish|queue|schedule|send|sync|import|execute|run|trigger|start|stop|retry|complete|resolve/gi,
    handoffs: /handoff|setSharedHandoff|getSharedHandoff|createProjectHandoff|setSharedAiDraft/gi,
    confirmations: /confirm\(/gi,
    ai: /AI|ai-command|assistant|prompt|generate|agent|automation/gi,
    rendering: /innerHTML|insertAdjacentHTML|outerHTML|render/gi,
    event_binding: /addEventListener|onclick|onchange|oninput|onsubmit|keydown|click/gi,
    disabled: /disabled|read-only|readonly|future|preview|not configured|guard|blocked|requires approval/gi
  };

  const counts = {};
  Object.entries(patterns).forEach(([key, regex]) => {
    counts[key] = (text.match(regex) || []).length;
  });

  const important = lines
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter((item) =>
      /fetchProject|createProject|saveProject|updateProject|deleteProject|setSharedHandoff|createProjectHandoff|confirm\(|onclick|addEventListener|export|import|publish|send|approve|sync|import|execute|run/i.test(item.text)
    )
    .slice(0, 260);

  return { lines: lines.length, counts, important };
}

const outDir = path.join(root, "audits/system-truth/t128-media-content-workspace-ownership");
fs.mkdirSync(outDir, { recursive: true });

const report = targets.map((file) => ({
  file,
  exists: exists(file),
  references: findReferences(file),
  signals: collectSignals(file)
}));

fs.writeFileSync(
  path.join(outDir, "media-content-workspace-ownership-findings.json"),
  JSON.stringify(report, null, 2)
);

function renderRefs(refs) {
  if (!refs.length) return "- none";
  return refs.map((ref) => `- \`${ref.file}:L${ref.line}\` — \`${ref.text.replaceAll("`", "\\`")}\``).join("\n");
}

function renderImportant(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- L${item.line}: \`${item.text.replaceAll("`", "\\`")}\``).join("\n");
}

const sections = report.map((item) => `## ${item.file}

### Exists
- ${item.exists ? "yes" : "no"}

### Signal Counts
${Object.entries(item.signals.counts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

### References
${renderRefs(item.references)}

### Important Lines
${renderImportant(item.signals.important)}
`).join("\n");

const md = `# T128 — Media/Content Workspace Ownership Audit

## Status
Audit-only. No production files changed.

## Purpose
T127 showed two top open runtime-risk files:

1. \`media-studio-workspace.js\`
2. \`content-studio-workspace.js\`

These must not be patched blindly because the parent surfaces were already reviewed earlier. This audit determines whether these workspace files are:

- active runtime surfaces,
- helper modules owned by Media Studio / Content Studio,
- duplicate/legacy files,
- unused/dead files,
- or separate authority surfaces requiring their own exact-action review.

## Files Reviewed
- \`public/control-center/pages/media-studio-workspace.js\`
- \`public/control-center/pages/content-studio-workspace.js\`

${sections}

## Decision Rule
- If a workspace is actively imported by a closed parent page and contains authority actions not covered in the parent review, run exact-action audit for that workspace.
- If it is helper-only and all mutation-like text is local/render-only, document and close.
- If it is unused/dead, remove only after a dedicated dead-code audit.
- If it duplicates already-closed logic, classify duplication risk before any refactor.
- Do not redesign either workspace in this pass.

## Next Step
Use this ownership audit to decide T129.
`;

fs.writeFileSync(
  path.join(outDir, "T128_MEDIA_CONTENT_WORKSPACE_OWNERSHIP_AUDIT.md"),
  md
);

console.log("Generated T128 media/content workspace ownership audit");
for (const item of report) {
  console.log(`${item.file}: exists=${item.exists} refs=${item.references.length} backend=${item.signals.counts.backend_calls} handoffs=${item.signals.counts.handoffs} confirmations=${item.signals.counts.confirmations}`);
}
