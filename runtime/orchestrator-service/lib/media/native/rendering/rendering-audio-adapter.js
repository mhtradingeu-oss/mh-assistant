'use strict';

async function renderAudio(request = {}) {
  return {
    success: false,
    engine: 'native-audio-renderer',
    status: 'not_configured',
    output_type: 'audio',
    message: 'Native audio rendering engine is not connected yet.',
    required_next_step: 'Connect XTTS, Coqui, Piper, OpenVoice, or another audio/TTS renderer.',
    request_summary: {
      prompt: request.prompt || '',
      voice_script: request.voice_script || '',
      project: request.project || '',
      language: request.language || ''
    }
  };
}

function createAudioRenderingAdapter() {
  return {
    id: 'native-audio-renderer',
    type: 'audio',
    available: false,
    render: renderAudio
  };
}

module.exports = {
  createAudioRenderingAdapter
};
