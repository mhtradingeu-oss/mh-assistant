const fs = require("fs");

const frontendFiles = [
  "public/control-center/api.js",
  "public/control-center/app.js"
];

const backendFile = "runtime/orchestrator-service/server.js";

const server = fs.readFileSync(backendFile, "utf8");

function getLine(src, index) {
  return src.slice(0, index).split(/\r?\n/).length;
}

function normalizeBackendPath(path) {
  return path
    .replace(/\?.*$/, "")
    .replace(/\/+$/, "")
    .replace(/:project/g, ":param")
    .replace(/:assetId/g, ":param")
    .replace(/:workflowId/g, ":param")
    .replace(/:approvalId/g, ":param")
    .replace(/:notificationId/g, ":param")
    .replace(/:handoffId/g, ":param")
    .replace(/:sourceType/g, ":param")
    .replace(/:integrationId/g, ":param")
    .replace(/:campaignId/g, ":param")
    .replace(/:contentItemId/g, ":param")
    .replace(/:mediaJobId/g, ":param")
    .replace(/:taskId/g, ":param")
    .replace(/:conversationId/g, ":param")
    .replace(/:customerId/g, ":param")
    .replace(/:jobId/g, ":param")
    .replace(/:runId/g, ":param")
    .replace(/:commandId/g, ":param")
    .replace(/:[A-Za-z0-9_]+/g, ":param");
}

function normalizeFrontendEndpoint(endpoint) {
  return endpoint
    .replace(/\?.*$/, "")
    .replace(/\$\{suffix\}/g, "")
    .replace(/\$\{[^}]*encodeURIComponent\([^}]+\)[^}]*\}/g, ":param")
    .replace(/\$\{[^}]+\}/g, ":param")
    .replace(/:project/g, ":param")
    .replace(/:assetId/g, ":param")
    .replace(/:workflowId/g, ":param")
    .replace(/:approvalId/g, ":param")
    .replace(/:notificationId/g, ":param")
    .replace(/:handoffId/g, ":param")
    .replace(/:sourceType/g, ":param")
    .replace(/:integrationId/g, ":param")
    .replace(/:campaignId/g, ":param")
    .replace(/:contentItemId/g, ":param")
    .replace(/:mediaJobId/g, ":param")
    .replace(/:taskId/g, ":param")
    .replace(/:conversationId/g, ":param")
    .replace(/:customerId/g, ":param")
    .replace(/:jobId/g, ":param")
    .replace(/:runId/g, ":param")
    .replace(/:commandId/g, ":param")
    .replace(/:[A-Za-z0-9_]+/g, ":param")
    .replace(/\/+$/, "");
}

function extractBackendRoutes() {
  const routes = [];

  const routeRe = /app\.(get|post|patch|put|delete)\((['"`])([^'"`]+)\2/g;
  let match;
  while ((match = routeRe.exec(server))) {
    routes.push({
      method: match[1].toUpperCase(),
      raw: match[3],
      normalized: normalizeBackendPath(match[3])
    });
  }

  return routes;
}

function extractFrontendEndpoints() {
  const rows = [];
  const literalRe = /(["'`])(\/(?:api|media-manager)[^"'`]+)\1/g;

  for (const file of frontendFiles) {
    const src = fs.readFileSync(file, "utf8");
    let match;
    while ((match = literalRe.exec(src))) {
      const endpoint = match[2];
      rows.push({
        file,
        line: getLine(src, match.index),
        endpoint,
        normalized: normalizeFrontendEndpoint(endpoint)
      });
    }
  }

  return rows;
}

const backendRoutes = extractBackendRoutes();
const frontendEndpoints = extractFrontendEndpoints();

function matchBackend(frontend) {
  const exact = backendRoutes.find((route) => route.normalized === frontend.normalized);
  if (exact) {
    return {
      status: "MATCH_NORMALIZED_EXACT",
      route: exact
    };
  }

  const noSuffix = frontend.normalized.replace(/\$\{suffix\}/g, "");
  const withoutQuerySuffix = noSuffix.replace(/\?.*$/, "");

  const near = backendRoutes.find((route) => route.normalized === withoutQuerySuffix);
  if (near) {
    return {
      status: "MATCH_NORMALIZED_WITH_QUERY_SUFFIX_REMOVED",
      route: near
    };
  }

  const likelyDisplayOnly =
    frontend.endpoint.includes(" (${section})") ||
    frontend.endpoint.includes(":project");

  if (likelyDisplayOnly) {
    return {
      status: "DISPLAY_OR_ERROR_METADATA_ONLY",
      route: null
    };
  }

  return {
    status: "NO_BACKEND_MATCH_FOUND",
    route: null
  };
}

const results = frontendEndpoints.map((entry) => {
  const match = matchBackend(entry);

  return {
    ...entry,
    status: match.status,
    backendMatch: match.route ? `${match.route.method} ${match.route.raw}` : null,
    backendNormalized: match.route ? match.route.normalized : null
  };
});

for (const row of results) {
  console.log(JSON.stringify(row));
}

const summary = results.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1;
  return acc;
}, {});

console.error("SUMMARY " + JSON.stringify(summary, null, 2));
