'use strict';

const conversationStore = require('./conversations/store/conversation-store');
const ticketStore = require('./tickets/store/ticket-store');
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
