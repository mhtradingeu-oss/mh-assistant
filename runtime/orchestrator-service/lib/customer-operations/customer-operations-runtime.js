'use strict';

const conversationStore = require('./conversations/store/conversation-store');
const ticketStore = require('./tickets/store/ticket-store');

const messageStore = require('./conversations/messages/message-store');

const customerProfileStore = require('./customers/store/customer-profile-store');


const {
  registerDefaultChannels
} = require('./channels/registry/default-channels');

const {
  listChannels
} = require('./channels/registry/channel-registry-store');


function createCustomerOperationsRuntime() {
  registerDefaultChannels();


  return {
    conversations: {
      create: conversationStore.createConversation,
      get: conversationStore.getConversation,
      list: conversationStore.listConversations,
      update: conversationStore.updateConversation
    },




    customers: {
      create: customerProfileStore.createCustomerProfile,
      get: customerProfileStore.getCustomerProfile,
      list: customerProfileStore.listCustomerProfiles,
      update: customerProfileStore.updateCustomerProfile
    },

    messages: {
      create: messageStore.createMessage,
      get: messageStore.getMessage,
      list: messageStore.listMessages,
      listByConversation:
        messageStore.listConversationMessages
    },

    channels: {
      list: listChannels
    },

    tickets: {
      create: ticketStore.createTicket,
      get: ticketStore.getTicket,
      list: ticketStore.listTickets,
      update: ticketStore.updateTicket
    },

    health() {
      return {
        runtime: 'mh-os-customer-operations',
        status: 'ready',
        capabilities: {
          conversations: true,
          tickets: true,
          channels: true,
          messages: true,
          customers: true,
          voice: false,
          ivr: false,
          outreach: false,
          crm: false
        }
      };
    }
  };
}

module.exports = {
  createCustomerOperationsRuntime
};
