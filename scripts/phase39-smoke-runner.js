#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

if (process.env.ALLOW_MUTATING_TESTS !== '1') {
  console.error('Refusing to run mutating phase39 smoke runner. Set ALLOW_MUTATING_TESTS=1 to seed project data and execute smoke commands.');
  process.exit(1);
}

const { UnifiedDataPathResolver } = require('../runtime/orchestrator-service/lib/data/unified-data-path-resolver');
const { ExecutionArtifactWriterAdapter } = require('../runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter');

const BASE = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');
const PROJECT = String(process.argv[2] || 'phase39smoke').trim().toLowerCase();
const HOST = process.env.PHASE39_HOST || 'http://127.0.0.1:3300';
const resolver = new UnifiedDataPathResolver({ logger: console });
const writer = new ExecutionArtifactWriterAdapter({ resolver, logger: console });

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, data) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function ensurePrereqs() {
  writeJson(path.join(BASE, 'data/projects', PROJECT, 'project.json'), {
    project_id: PROJECT,
    project_name: PROJECT,
    status: 'active',
    created_at: new Date().toISOString()
  });

  writeJson(path.join(BASE, 'data/brand-assets', PROJECT, 'product-intelligence', 'products.json'), [
    {
      product_slug: 'p1',
      product_name: 'P1 Product',
      category: 'test',
      marketing_intelligence: {},
      creative_map: {},
      prompt_pack: {
        branding: {
          hook: 'h',
          visual_prompt: 'v',
          cta: 'c'
        }
      },
      channel_pack: {
        instagram: {
          caption: 'cap'
        },
        email: {
          subject: 's',
          headline: 'h',
          body: 'b',
          cta: 'c'
        }
      }
    }
  ]);

  writeJson(path.join(BASE, 'data/brand-assets', PROJECT, 'german-launch', 'waves', 'wave39.json'), {
    wave_name: 'wave39',
    products: [
      {
        product_slug: 'p1',
        product_name: 'P1 Product',
        channel_pack: {
          instagram: {
            caption: 'cap'
          },
          email: {
            subject: 's',
            headline: 'h',
            body: 'b',
            cta: 'c'
          }
        }
      }
    ]
  });

  const outputPath = path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'outputs', 'render_seed.png');
  ensureDir(path.dirname(outputPath));
  if (!fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, 'seed', 'utf8');
  }

  writeJson(path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'renders', 'render_seed.json'), {
    render_id: 'render_seed',
    project: PROJECT,
    status: 'completed',
    result: {
      output_path: outputPath
    }
  });
}

function writeDualSeedArtifacts() {
  writer.writeJson({
    project: PROJECT,
    domain: 'generated',
    artifactType: 'generation_job_record',
    identifier: 'gen_phase39_seed',
    legacyPath: path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'jobs', 'gen_phase39_seed_blog_visual.json'),
    data: {
      job_id: 'gen_phase39_seed',
      project: PROJECT,
      asset_type: 'blog_visual',
      goal: 'phase39 smoke goal',
      generated_at: new Date().toISOString(),
      status: 'ready_for_generation'
    }
  });

  writer.writeJson({
    project: PROJECT,
    domain: 'generated',
    artifactType: 'render_request_record',
    identifier: 'render_phase39_seed',
    legacyPath: path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'renders', 'render_phase39_seed.json'),
    data: {
      render_id: 'render_phase39_seed',
      project: PROJECT,
      status: 'completed',
      output_path: path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'outputs', 'render_seed.png'),
      result: {
        output_path: path.join(BASE, 'data/brand-assets', PROJECT, 'generated', 'outputs', 'render_seed.png')
      }
    }
  });

  writer.writeJson({
    project: PROJECT,
    domain: 'email',
    artifactType: 'email_prepare_package',
    identifier: `${PROJECT}-email-prepare-seed`,
    legacyPath: path.join(BASE, 'data/brand-assets', PROJECT, 'email-prepare-package.json'),
    data: {
      project: PROJECT,
      generated_at: new Date().toISOString(),
      status: 'ready',
      email_asset: {
        subject: 'seed subject',
        headline: 'seed headline',
        body: 'seed body',
        cta: 'seed cta'
      }
    }
  });
}

async function postCommand(text) {
  const response = await fetch(`${HOST}/telegram-command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  let body = {};
  try {
    body = await response.json();
  } catch (error) {
    body = { error: `non-json-response status=${response.status}` };
  }

  return {
    text,
    ok: response.ok && !body.error,
    status: response.status,
    body
  };
}

function parseReadRedirectionLog() {
  const logPath = path.join(BASE, 'data/execution/projects', PROJECT, 'telemetry', 'read-redirection-log.jsonl');
  if (!fs.existsSync(logPath)) {
    return {};
  }

  const byDomain = {};
  const lines = fs.readFileSync(logPath, 'utf8').split('\n').map((x) => x.trim()).filter(Boolean);
  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    const domain = String(entry.domain || '').trim().toLowerCase();
    if (!domain) continue;

    if (!byDomain[domain]) {
      byDomain[domain] = {
        canonical_selected: 0,
        legacy_selected: 0,
        fallback_hits: 0,
        entries: 0
      };
    }

    byDomain[domain].entries += 1;
    if (entry.selected_root === 'canonical') byDomain[domain].canonical_selected += 1;
    if (entry.selected_root === 'legacy') byDomain[domain].legacy_selected += 1;
    if (entry.legacy_fallback_hit && entry.selected_root === 'legacy') byDomain[domain].fallback_hits += 1;
  }

  return byDomain;
}

function readReadinessSummary() {
  const raw = execSync(`node ${path.join(BASE, 'scripts/phase375-readiness-report.js')} ${PROJECT}`, {
    encoding: 'utf8'
  });
  return JSON.parse(raw);
}

async function main() {
  ensurePrereqs();
  writeDualSeedArtifacts();

  const commands = [];

  async function run(text) {
    const res = await postCommand(text);
    commands.push(res);
    return res;
  }

  await run(`/build_campaign_execution_package ${PROJECT} camp39 p1`);
  await run(`/review_campaign_execution_package ${PROJECT} camp39`);
  await run(`/build_campaign_media_job ${PROJECT} camp39 instagram`);
  await run(`/build_campaign_publish_package ${PROJECT} camp39 instagram`);
  await run(`/prepare_campaign_email ${PROJECT} camp39`);
  await run(`/review_campaign_finalization ${PROJECT} camp39`);

  await run(`/review_generation_job ${PROJECT}`);
  await run(`/review_render_request ${PROJECT}`);
  await run(`/review_email_prepare_package ${PROJECT}`);

  await run(`/build_channel_connector_payload ${PROJECT} wave39 instagram`);
  const schedule = await run(`/schedule_launch_job ${PROJECT} wave39 instagram 2026-04-20T10:00:00Z`);
  const jobs = await run(`/review_scheduled_jobs ${PROJECT}`);

  let jobId = '';
  if (jobs.ok && Array.isArray(jobs.body.result) && jobs.body.result.length > 0) {
    jobId = String(jobs.body.result[0].job_id || '').trim();
  }
  if (!jobId && schedule.ok) {
    jobId = String(schedule.body?.result?.job_id || '').trim();
  }

  if (jobId) {
    await run(`/execute_scheduled_job ${PROJECT} ${jobId}`);
    await run(`/review_execution_result ${PROJECT} ${jobId}`);
  }

  await run(`/list_execution_results ${PROJECT}`);

  const readiness = readReadinessSummary();
  const redirection = parseReadRedirectionLog();

  const output = {
    project: PROJECT,
    host: HOST,
    command_results: commands.map((c) => ({
      text: c.text,
      ok: c.ok,
      status: c.status,
      error: c.ok ? null : (c.body && c.body.error) || 'unknown_error'
    })),
    readiness,
    read_redirection_summary: redirection
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
