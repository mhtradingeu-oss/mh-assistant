#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");

const root = process.cwd();
const now = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(root, `control-center-cleanup-audit-${now}.json`);

const requiredFinalFiles = [
  "public/control-center/index.html",
  "public/control-center/app.js",
  "public/control-center/api.js",
  "public/control-center/router.js",
  "public/control-center/state.js",
  "public/control-center/styles.css",
  "public/control-center/ui/page-standard.js",
  "scripts/verify-project-loading-stability.js",
  "scripts/verify-control-center-browser-load-safety.js",
  "scripts/verify-control-center-ui.js",
  "scripts/verify-page-ux-quality.js"
];

const legacyPatterns = [
  /\.swp$/,
  /\.bak/i,
  /bak-/i,
  /backup/i,
  /old/i,
  /legacy/i,
  /copy/i,
  /duplicate/i
];

const suspiciousProjectPatterns = [
  /corestabilitysmoke/i,
  /smoke/i,
  /dummy/i,
  /sample/i,
  /test-project/i
];

const scanDirs = [
  "public/control-center",
  "public/media-manager",
  "data/projects",
  "data/brand-assets",
  "data/execution/projects",
  "scripts"
];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function walk(dirRel) {
  const abs = path.join(root, dirRel);
  if (!fs.existsSync(abs)) return [];
  const out = [];

  function visit(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = path.relative(root, full);
      if (entry.isDirectory()) {
        visit(full);
      } else {
        out.push(rel);
      }
    }
  }

  visit(abs);
  return out;
}

function read(rel) {
  try {
    return fs.readFileSync(path.join(root, rel), "utf8");
  } catch (_) {
    return "";
  }
}

function getHttp(pathname) {
  return new Promise((resolve) => {
    const req = http.request({
      host: "127.0.0.1",
      port: 3000,
      path: pathname,
      method: "GET",
      timeout: 8000
    }, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk.toString());
      res.on("end", () => {
        resolve({
          path: pathname,
          status: res.statusCode,
          headers: res.headers,
          body_sample: body.slice(0, 300)
        });
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error("timeout"));
    });

    req.on("error", (error) => {
      resolve({
        path: pathname,
        error: error.message
      });
    });

    req.end();
  });
}

(async () => {
  const allFiles = scanDirs.flatMap(walk);

  const missingRequired = requiredFinalFiles.filter((file) => !exists(file));

  const legacyFiles = allFiles.filter((file) =>
    legacyPatterns.some((pattern) => pattern.test(file))
  );

  const suspiciousFiles = allFiles.filter((file) =>
    suspiciousProjectPatterns.some((pattern) => pattern.test(file))
  );

  const publicControlFiles = walk("public/control-center");
  const oldControlBackups = publicControlFiles.filter((file) =>
    legacyPatterns.some((pattern) => pattern.test(file))
  );

  const index = read("public/control-center/index.html");
  const app = read("public/control-center/app.js");
  const api = read("public/control-center/api.js");
  const styles = read("public/control-center/styles.css");

  const contentChecks = [
    {
      code: "index_references_app_module",
      pass: /type=["']module["'][^>]+app\.js/.test(index),
      message: "index.html references app.js as module."
    },
    {
      code: "index_has_fatal_panel",
      pass: /fatal/i.test(index) && /loadingOverlay/.test(index),
      message: "index.html has loading and fatal fallback containers."
    },
    {
      code: "app_has_watchdog",
      pass: /watchdog/i.test(app) && /hideLoading/.test(app),
      message: "app.js has loading watchdog and hideLoading."
    },
    {
      code: "app_avoids_hardcoded_hairoticmen",
      pass: !/["']hairoticmen["']/.test(app),
      message: "app.js avoids direct hardcoded project slug."
    },
    {
      code: "api_has_abort_controller",
      pass: /AbortController/.test(api) && /timeout/i.test(api),
      message: "api.js has timeout/AbortController handling."
    },
    {
      code: "styles_overlay_hidden_by_default",
      pass: /loading-overlay/.test(styles) && /is-visible/.test(styles),
      message: "styles.css defines loading overlay visibility states."
    }
  ];

  const endpoints = await Promise.all([
    getHttp("/control-center/?v=audit"),
    getHttp("/control-center/app.js"),
    getHttp("/control-center/api.js"),
    getHttp("/health"),
    getHttp("/media-manager/")
  ]);

  const report = {
    timestamp: new Date().toISOString(),
    branch_hint: "Run git branch --show-current separately.",
    required_final_files: {
      passed: missingRequired.length === 0,
      missing: missingRequired
    },
    content_checks: {
      passed: contentChecks.every((item) => item.pass),
      checks: contentChecks
    },
    legacy_candidates: {
      count: legacyFiles.length,
      files: legacyFiles
    },
    suspicious_project_candidates: {
      count: suspiciousFiles.length,
      files: suspiciousFiles
    },
    old_control_center_backups: {
      count: oldControlBackups.length,
      files: oldControlBackups
    },
    endpoint_checks: endpoints,
    recommendations: [
      "Do not delete files yet. Archive legacy candidates first.",
      "Keep /control-center/ as the final frontend.",
      "Treat /media-manager/ as legacy unless explicitly needed.",
      "Archive smoke project data instead of deleting if it is not needed in production.",
      "After archive, run all verify scripts again."
    ]
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify({
    passed:
      report.required_final_files.passed &&
      report.content_checks.passed &&
      endpoints.every((item) => item.status && item.status < 500),
    report_path: reportPath,
    summary: {
      missing_required: missingRequired.length,
      legacy_candidates: legacyFiles.length,
      suspicious_project_candidates: suspiciousFiles.length,
      old_control_center_backups: oldControlBackups.length
    }
  }, null, 2));
})();
