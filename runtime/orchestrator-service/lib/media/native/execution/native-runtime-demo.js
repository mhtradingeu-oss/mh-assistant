'use strict';

const path = require('path');

const { createNativeRuntimeController } = require('./native-runtime-controller');

async function main() {
  const controller = createNativeRuntimeController({
    baseDir: path.resolve(__dirname, '../../../../..')
  });

  const result = await controller.executeMediaRequest({
    media_type: 'video',
    platform: 'instagram',
    product_name: 'BEARD OIL 50ML',
    goal: 'premium grooming reel',
    audience: 'German premium grooming audience',
    brand_voice: 'premium, clean, trustworthy',
    project: 'hairoticmen'
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
