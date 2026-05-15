'use strict';

const conversationStore = require('./conversations/store/conversation-store');
const ticketStore = require('./tickets/store/ticket-store');

function createCustomerOperationsRuntime() {
  return {
    conversations: {
      create: conversationStore.createConversation,
      get: conversationStore.getConversation,
      list: conversationStore.listConversations,
      update: conversationStore.updateConversation
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
          channels: false,
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
