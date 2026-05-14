'use strict';

async function renderVideo(request = {}) {
  return {
    success: false,
    engine: 'native-video-renderer',
    status: 'not_configured',
    output_type: 'video',
    message: 'Native video rendering engine is not connected yet.',
    required_next_step: 'Connect Wan, CogVideoX, LTX Video, Stable Video Diffusion, or another video renderer.',
    request_summary: {
      prompt: request.prompt || '',
      project: request.project || '',
      platform: request.platform || '',
      duration: request.duration || ''
    }
  };
}

function createVideoRenderingAdapter() {
  return {
    id: 'native-video-renderer',
    type: 'video',
    available: false,
    render: renderVideo
  };
}

module.exports = {
  createVideoRenderingAdapter
};
