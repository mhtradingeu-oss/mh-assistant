'use strict';

async function createVoiceChatSession(payload = {}) {
  return {
    type: 'voice_chat',
    status: 'draft',
    provider: 'native',
    agent_role: String(payload.agent_role || 'assistant'),
    input_text: String(payload.input_text || ''),
    output_text: '',
    output_audio: null,
    metadata: {
      created_at: new Date().toISOString(),
      runtime: 'native-voice-chat-runtime'
    }
  };
}

function createNativeVoiceChatRuntime() {
  return {
    id: 'native-voice-chat',
    type: 'voice_chat',
    available: false,
    createSession: createVoiceChatSession
  };
}

module.exports = {
  createNativeVoiceChatRuntime
};
