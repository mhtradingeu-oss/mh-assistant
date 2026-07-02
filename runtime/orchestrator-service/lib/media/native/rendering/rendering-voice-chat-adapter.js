'use strict';

async function renderVoiceChat(request = {}) {
  return {
    success: false,
    engine: 'native-voice-chat-renderer',
    status: 'not_configured',
    output_type: 'voice_chat',
    message: 'Native voice chat rendering engine is not connected yet.',
    required_next_step: 'Connect speech-to-text, reasoning, TTS, and realtime session runtime.',
    request_summary: {
      agent_role: request.agent_role || '',
      input_text: request.input_text || '',
      project: request.project || ''
    }
  };
}

function createVoiceChatRenderingAdapter() {
  return {
    id: 'native-voice-chat-renderer',
    type: 'voice_chat',
    available: false,
    render: renderVoiceChat
  };
}

module.exports = {
  createVoiceChatRenderingAdapter
};
