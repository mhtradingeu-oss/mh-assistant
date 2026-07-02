'use strict';

function createExecutionJobBridge(deps = {}) {
  const {
    resolvePublishPackageForExecution,
    buildSocialExecutionPayload,
    resolveEmailPackageForExecution,
    buildEmailReadyPayload,
    buildMediaGenerationMock,
    resolveCampaignPackageForAds,
    buildAdExecutionPackage,
    executePublishPackage,
    executeEmailPackage,
    executeMediaGeneration,
    executeAdExecutionPackage
  } = deps;

  async function executeJobBridge(job) {
    const project = job.project;
    const payload = job.package_payload && typeof job.package_payload === 'object'
      ? job.package_payload
      : {};

    if (job.type === 'publish') {
      const publishPackage = resolvePublishPackageForExecution(project, payload);
      const socialPayload = buildSocialExecutionPayload(publishPackage);
      const runtimeResult = typeof executePublishPackage === 'function'
        ? await executePublishPackage({
          project,
          payload,
          publishPackage,
          socialPayload,
          job
        })
        : null;

      return {
        execution_state: runtimeResult?.execution_state || 'executed',
        execution_backend: runtimeResult?.execution_backend || 'canonical_publish_runtime',
        executed_at: runtimeResult?.executed_at || new Date().toISOString(),
        channel: socialPayload.channel,
        caption: socialPayload.caption,
        media_path: socialPayload.media_path,
        runtime_result: runtimeResult || null
      };
    }

    if (job.type === 'email') {
      const emailPackage = resolveEmailPackageForExecution(project, payload);
      const emailPayload = buildEmailReadyPayload(emailPackage);
      const runtimeResult = typeof executeEmailPackage === 'function'
        ? await executeEmailPackage({
          project,
          payload,
          emailPackage,
          emailPayload,
          job
        })
        : null;

      return {
        execution_state: runtimeResult?.execution_state || 'executed',
        execution_backend: runtimeResult?.execution_backend || 'canonical_email_runtime',
        executed_at: runtimeResult?.executed_at || new Date().toISOString(),
        subject: emailPayload.subject,
        html_body: emailPayload.html_body,
        text_body: emailPayload.text_body,
        ready_for_provider_send: true,
        runtime_result: runtimeResult || null
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

      const runtimeResult = typeof executeMediaGeneration === 'function'
        ? await executeMediaGeneration({
          project,
          payload,
          promptPack,
          job
        })
        : null;

      if (runtimeResult) {
        return {
          execution_state: runtimeResult.execution_state || (runtimeResult.success === false ? 'failed' : 'executed'),
          execution_backend: runtimeResult.execution_backend || 'native_media_runtime',
          executed_at: runtimeResult.executed_at || new Date().toISOString(),
          image_prompt: runtimeResult.image_prompt || '',
          scene_count: Number(runtimeResult.scene_count || 0),
          runtime_result: runtimeResult
        };
      }

      const generated = buildMediaGenerationMock(promptPack, payload);
      return {
        execution_state: 'failed',
        execution_backend: 'fallback_media_mock',
        executed_at: new Date().toISOString(),
        image_prompt: generated.image_prompt,
        scene_count: Array.isArray(generated.scene_breakdown) ? generated.scene_breakdown.length : 0,
        runtime_result: null
      };
    }

    if (job.type === 'ads') {
      const campaignPackage = resolveCampaignPackageForAds(project, payload);
      const adPackage = buildAdExecutionPackage(campaignPackage, payload);
      const runtimeResult = typeof executeAdExecutionPackage === 'function'
        ? await executeAdExecutionPackage({
          project,
          payload,
          campaignPackage,
          adPackage,
          job
        })
        : null;

      return {
        execution_state: runtimeResult?.execution_state || 'executed',
        execution_backend: runtimeResult?.execution_backend || 'canonical_ad_runtime',
        executed_at: runtimeResult?.executed_at || new Date().toISOString(),
        ad_copy: runtimeResult?.ad_copy || adPackage.ad_copy,
        headline: runtimeResult?.headline || adPackage.headline,
        cta: runtimeResult?.cta || adPackage.cta,
        audience: runtimeResult?.audience || adPackage.audience,
        budget_suggestion: runtimeResult?.budget_suggestion || adPackage.budget_suggestion,
        runtime_result: runtimeResult || null
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
