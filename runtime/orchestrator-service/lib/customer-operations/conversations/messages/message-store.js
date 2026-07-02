'use strict';

const {
  createMessageContract
} = require('../../contracts/message-contract');

const messages = new Map();

function createMessage(input = {}) {
  const message = createMessageContract(input);

  if (!message.message_id) {
    throw new Error('message_id is required');
  }

  messages.set(message.message_id, message);

  return message;
}

function getMessage(messageId) {
  return messages.get(String(messageId || '')) || null;
}

function listMessages() {
  return Array.from(messages.values());
}

function listConversationMessages(conversationId) {
  const id = String(conversationId || '');

  return listMessages().filter(
    (message) => message.conversation_id === id
  );
}

module.exports = {
  createMessage,
  getMessage,
  listMessages,
  listConversationMessages
};
