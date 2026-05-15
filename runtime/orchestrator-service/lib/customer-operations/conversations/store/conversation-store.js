'use strict';

const {
  createConversationContract
} = require('../../contracts/conversation-contract');

const conversations = new Map();

function createConversation(input = {}) {
  const conversation = createConversationContract(input);

  if (!conversation.conversation_id) {
    throw new Error('conversation_id is required');
  }

  conversations.set(conversation.conversation_id, conversation);

  return conversation;
}

function getConversation(conversationId) {
  return conversations.get(String(conversationId || '')) || null;
}

function listConversations() {
  return Array.from(conversations.values());
}

function updateConversation(conversationId, updates = {}) {
  const current = getConversation(conversationId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  conversations.set(current.conversation_id, updated);

  return updated;
}

module.exports = {
  createConversation,
  getConversation,
  listConversations,
  updateConversation
};
