'use strict';

const { createProviderExecutionRouter } = require('./provider-execution-router');

async function main() {
  const router = createProviderExecutionRouter();

  const openAiImageDryCheck = await router.execute({
    provider: 'openai',
    media_type: 'voice_chat',
    prompt: 'Start realtime voice session placeholder'
  });

  const nativeWorkerCheck = await router.execute({
    provider: 'native',
    media_type: 'video',
    project: 'hairoticmen',
    platform: 'instagram',
    prompt_hash: 'demo123'
  });

  const missingProviderCheck = await router.execute({
    provider: 'google',
    media_type: 'image',
    prompt: 'Test Nano Banana route'
  });

  console.log(JSON.stringify({
    registered_providers: router.listRegisteredProviders(),
    openai_voice_check: openAiImageDryCheck,
    native_worker_check: nativeWorkerCheck,
    missing_provider_check: missingProviderCheck
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
