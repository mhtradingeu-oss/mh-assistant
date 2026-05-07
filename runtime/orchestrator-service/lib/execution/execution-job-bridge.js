'use strict';

function createExecutionJobBridge(deps = {}) {
  const {
    resolvePublishPackageForExecution,
    buildSocialExecutionPayload,
    resolveEmailPackageForExecution,
    buildEmailReadyPayload,
    buildMediaGenerationMock,
    resolveCampaignPackageForAds,
    buildAdExecutionPackage
  } = deps;

  function executeJobBridge(job) {
    const project = job.project;
    const payload = job.package_payload && typeof job.package_payload === 'object'
      ? job.package_payload
      : {};

    if (job.type === 'publish') {
      const publishPackage = resolvePublishPackageForExecution(project, payload);
      const socialPayload = buildSocialExecutionPayload(publishPackage);
      return {
        execution_state: 'manual_publish_ready',
        channel: socialPayload.channel,
        caption: socialPayload.caption,
        media_path: socialPayload.media_path
      };
    }

    if (job.type === 'email') {
      const emailPackage = resolveEmailPackageForExecution(project, payload);
      const emailPayload = buildEmailReadyPayload(emailPackage);
      return {
        execution_state: 'pending_execution',
        subject: emailPayload.subject,
        ready_for_provider_send: true
      };
    }

    if (job.type === 'media') {
      const promptPack = payload.prompt_pack && typeof payload.prompt_pack === 'object'
        ? payload.prompt_pack
        : payload.publish_package?.assets?.[0]?.fallback_prompt_pack;

      if (!promptPack || typeof promptPack !== 'object' || Object.keys(promptPack).length === 0) {
        const err = new Error('Missing prompt_pack in package_payload');
        err.statusCode = 400;
        err.code = 'PROMPT_PACK_MISSING';
        throw err;
      }

      const generated = buildMediaGenerationMock(promptPack, payload);
      return {
        execution_state: 'ready_for_review',
        image_prompt: generated.image_prompt,
        scene_count: Array.isArray(generated.scene_breakdown) ? generated.scene_breakdown.length : 0
      };
    }

    if (job.type === 'ads') {
      const campaignPackage = resolveCampaignPackageForAds(project, payload);
      const adPackage = buildAdExecutionPackage(campaignPackage, payload);
      return {
        execution_state: 'ready_for_review',
        headline: adPackage.headline,
        audience: adPackage.audience
      };
    }

    const err = new Error(`Unknown job type: ${job.type}`);
    err.statusCode = 400;
    err.code = 'UNKNOWN_JOB_TYPE';
    throw err;
  }

  return {
    executeJobBridge
  };
}

module.exports = {
  createExecutionJobBridge
};
