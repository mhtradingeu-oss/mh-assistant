import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = process.argv[2];
if (!outDir) throw new Error("Missing output dir");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function walk(dir, list = []) {
  if (!fs.existsSync(path.join(root, dir))) return list;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, list);
    else list.push(p);
  }
  return list;
}

function normalizeRoute(route) {
  return String(route || "")
    .trim()
    .replace(/`/g, "")
    .replace(/\$\{[^}]+\}/g, ":param")
    .replace(/encodeURIComponent\([^)]+\)/g, ":param")
    .replace(/:project\b/g, ":param")
    .replace(/:projectName\b/g, ":param")
    .replace(/:assetId\b/g, ":param")
    .replace(/:workflowId\b/g, ":param")
    .replace(/:commandId\b/g, ":param")
    .replace(/:taskId\b/g, ":param")
    .replace(/:approvalId\b/g, ":param")
    .replace(/:notificationId\b/g, ":param")
    .replace(/:sourceType\b/g, ":param")
    .replace(/:integrationId\b/g, ":param")
    .replace(/:jobId\b/g, ":param")
    .replace(/:campaignId\b/g, ":param")
    .replace(/:contentItemId\b/g, ":param")
    .replace(/:mediaJobId\b/g, ":param")
    .replace(/:handoffId\b/g, ":param")
    .replace(/:conversationId\b/g, ":param")
    .replace(/:customerId\b/g, ":param")
    .replace(/:filename\b/g, ":param")
    .replace(/:type\b/g, ":param")
    .replace(/\/+/g, "/")
    .replace(/\?.*$/, "")
    .replace(/\/$/, "") || "/";
}

function methodFromCallPrefix(prefix) {
  const m = String(prefix || "").match(/\.(get|post|put|patch|delete)\s*\(/i);
  return m ? m[1].toUpperCase() : "UNKNOWN";
}

function extractBackendRoutes() {
  const text = read("runtime/orchestrator-service/server.js");
  const routes = [];
  const re = /(app|router)\.(get|post|put|patch|delete)\s*\(\s*(['"`])([^'"`]+)\3/g;
  let match;
  while ((match = re.exec(text))) {
    const method = match[2].toUpperCase();
    const route = match[4];
    routes.push({
      method,
      route,
      normalized: normalizeRoute(route),
      publicAlias: route.startsWith("/public/"),
      line: text.slice(0, match.index).split("\n").length
    });
  }
  return routes;
}

function extractFrontendEndpoints() {
  const files = walk("public/control-center").filter((f) => f.endsWith(".js") || f.endsWith(".html"));
  const endpoints = [];
  const endpointRe = /(['"`])((?:\/api\/|\/public\/|\/media-manager\/|\/media\/upload|\/ai\/execute)[^'"`]+)\1/g;
  const templateRe = /`([^`]*(?:\/api\/|\/public\/|\/media-manager\/|\/media\/upload|\/ai\/execute)[^`]*)`/g;
  for (const file of files) {
    const text = read(file);
    let m;
    while ((m = endpointRe.exec(text))) {
      const raw = m[2];
      endpoints.push({
        file,
        line: text.slice(0, m.index).split("\n").length,
        raw,
        normalized: normalizeRoute(raw),
        publicAlias: raw.startsWith("/public/")
      });
    }
    while ((m = templateRe.exec(text))) {
      const raw = m[1];
      endpoints.push({
        file,
        line: text.slice(0, m.index).split("\n").length,
        raw,
        normalized: normalizeRoute(raw),
        publicAlias: raw.startsWith("/public/")
      });
    }
  }
  const seen = new Set();
  return endpoints.filter((e) => {
    const key = `${e.file}:${e.line}:${e.raw}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function routeMatchesEndpoint(routeNorm, endpointNorm) {
  if (routeNorm === endpointNorm) return true;

  const r = routeNorm.split("/").filter(Boolean);
  const e = endpointNorm.split("/").filter(Boolean);
  if (r.length !== e.length) return false;

  return r.every((part, index) => {
    return part === e[index] || part === ":param" || e[index] === ":param";
  });
}

function classifyEndpoint(endpoint, backendRoutes) {
  const exact = backendRoutes.filter((r) => r.normalized === endpoint.normalized);
  if (exact.length) return { status: "MATCH_EXACT", matches: exact };

  const fuzzy = backendRoutes.filter((r) => routeMatchesEndpoint(r.normalized, endpoint.normalized));
  if (fuzzy.length) return { status: "MATCH_PARAM", matches: fuzzy };

  const publicAlternative = endpoint.normalized.startsWith("/public/")
    ? backendRoutes.filter((r) => routeMatchesEndpoint(r.normalized, endpoint.normalized.replace(/^\/public/, "")))
    : backendRoutes.filter((r) => routeMatchesEndpoint(r.normalized, `/public${endpoint.normalized}`));

  if (publicAlternative.length) return { status: "MATCH_ALIAS_ALTERNATIVE", matches: publicAlternative };

  if (
    endpoint.normalized.startsWith("/api/governance/") ||
    endpoint.normalized.startsWith("/api/ai-control/") ||
    endpoint.normalized === "/ai/execute"
  ) {
    return { status: "CHECK_LEGACY_OR_DEV_ONLY", matches: [] };
  }

  return { status: "NO_BACKEND_MATCH_FOUND", matches: [] };
}

const backendRoutes = extractBackendRoutes();
const frontendEndpoints = extractFrontendEndpoints();

const classified = frontendEndpoints.map((endpoint) => ({
  ...endpoint,
  classification: classifyEndpoint(endpoint, backendRoutes)
}));

const summary = {
  backendRouteCount: backendRoutes.length,
  frontendEndpointReferenceCount: frontendEndpoints.length,
  frontendUniqueNormalizedCount: new Set(frontendEndpoints.map((e) => e.normalized)).size,
  byStatus: {}
};

for (const item of classified) {
  const status = item.classification.status;
  summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
}

function writeTxt(name, lines) {
  fs.writeFileSync(path.join(outDir, name), lines.join("\n") + "\n");
}

writeJson("01_backend_routes_exact.json", backendRoutes);
writeJson("02_frontend_endpoints_exact.json", frontendEndpoints);
writeJson("03_route_match_classified.json", classified);
writeJson("04_route_match_summary.json", summary);

writeTxt(
  "05_possible_missing_or_legacy_endpoints.txt",
  classified
    .filter((x) => ["NO_BACKEND_MATCH_FOUND", "CHECK_LEGACY_OR_DEV_ONLY"].includes(x.classification.status))
    .map((x) => `${x.classification.status} :: ${x.raw} :: ${x.file}:${x.line}`)
);

writeTxt(
  "06_public_alias_frontend_usage.txt",
  classified
    .filter((x) => x.publicAlias)
    .map((x) => `${x.raw} :: ${x.file}:${x.line} :: ${x.classification.status}`)
);

writeTxt(
  "07_alias_alternative_matches.txt",
  classified
    .filter((x) => x.classification.status === "MATCH_ALIAS_ALTERNATIVE")
    .map((x) => `${x.raw} :: ${x.file}:${x.line} :: matches ${x.classification.matches.map((m) => `${m.method} ${m.route}`).join(" | ")}`)
);

writeTxt(
  "08_backend_public_write_aliases.txt",
  backendRoutes
    .filter((r) => r.publicAlias && ["POST", "PUT", "PATCH", "DELETE"].includes(r.method))
    .map((r) => `${r.method} ${r.route} :: line ${r.line}`)
);

console.log(JSON.stringify(summary, null, 2));
