'use strict';

const { createJobLifecycleManager } = require('./job-lifecycle-manager');

async function main() {
  const lifecycle = createJobLifecycleManager();

  const queued = lifecycle.queueJob({
    job_id: 'demo_job_1',
    media_type: 'video',
    worker_id: 'gpu-worker-1',
    model_id: 'wan-video'
  });

  lifecycle.markDispatched('demo_job_1');
  lifecycle.markRendering('demo_job_1', 45);

  lifecycle.markCompleted('demo_job_1', [
    {
      type: 'video',
      path: '/outputs/demo-video.mp4'
    }
  ]);

  console.log(JSON.stringify({
    queued,
    final: lifecycle.getJob('demo_job_1'),
    jobs: lifecycle.listJobs()
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
