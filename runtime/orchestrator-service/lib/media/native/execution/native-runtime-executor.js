'use strict';

const crypto = require('crypto');

const { enqueueMediaJob } = require('../media-job-queue');
const { writeMediaOutput } = require('../media-output-storage');
const { createNativeMediaIntelligence } = require('../intelligence/native-media-intelligence');

function hashPrompt(prompt = '') {
  return crypto
    .createHash('sha256')
    .update(String(prompt))
    .digest('hex')
    .slice(0, 16);
}

function createNativeRuntimeExecutor(options = {}) {
  const intelligence = createNativeMediaIntelligence();

  async function execute(input = {}) {
    const prepared = intelligence.prepare(input);

    if (!prepared.ready_for_runtime) {
      return {
        success: false,
        stage: 'validation',
        quality: prepared.quality,
        error: 'Media plan is not ready for runtime execution.'
      };
    }

    const queuedJob = enqueueMediaJob({
      type: prepared.brief.media_type,
      status: 'queued',
      provider: 'native',
      platform: prepared.brief.platform,
      product_name: prepared.brief.product_name,
      prompt_hash: hashPrompt(prepared.prompt),
      prompt: prepared.prompt,
      quality_score: prepared.quality.score,
      created_at: new Date().toISOString()
    });

    const fakeOutput = {
      result_type: prepared.brief.media_type,
      generated_at: new Date().toISOString(),
      prompt: prepared.prompt,
      brief: prepared.brief,
      quality: prepared.quality
    };

    const outputBuffer = Buffer.from(
      JSON.stringify(fakeOutput, null, 2),
      'utf8'
    );

    const stored = writeMediaOutput({
      baseDir: options.baseDir || process.cwd(),
      project: input.project || 'default',
      jobId: queuedJob.id,
      filename: `${prepared.brief.media_type}-output.json`,
      buffer: outputBuffer
    });

    return {
      success: true,
      stage: 'completed',
      media_job: queuedJob,
      output: {
        storage: stored,
        preview: fakeOutput
      },
      executed_at: new Date().toISOString()
    };
  }

  return {
    execute
  };
}

module.exports = {
  createNativeRuntimeExecutor
};
