#!/usr/bin/env node
'use strict';

process.env.MH_DISABLE_READ_TELEMETRY = process.env.MH_DISABLE_READ_TELEMETRY || '1';

const {
  __stability: {
    reviewCampaignFinalization
  }
} = require('../runtime/orchestrator-service/server');

const project = String(process.env.MH_PROJECT || process.argv[2] || 'hairoticmen').trim().toLowerCase();
const campaign = String(process.env.MH_CAMPAIGN || process.argv[3] || 'beard_launch').trim();

const result = reviewCampaignFinalization(project, campaign);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

if (!result.ready || result.media_jobs_count < 1 || result.publish_packages_count < 1 || !result.has_email_package) {
  process.exitCode = 1;
}
