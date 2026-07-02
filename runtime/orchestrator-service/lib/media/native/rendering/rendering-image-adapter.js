'use strict';

async function renderImage(request = {}) {
  return {
    success: false,
    engine: 'native-image-renderer',
    status: 'not_configured',
    output_type: 'image',
    message: 'Native image rendering engine is not connected yet.',
    required_next_step: 'Connect FLUX, Stable Diffusion, ComfyUI, or another image renderer.',
    request_summary: {
      prompt: request.prompt || '',
      project: request.project || '',
      platform: request.platform || ''
    }
  };
}

function createImageRenderingAdapter() {
  return {
    id: 'native-image-renderer',
    type: 'image',
    available: false,
    render: renderImage
  };
}

module.exports = {
  createImageRenderingAdapter
};
