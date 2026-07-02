'use strict';

const {
  createTicketContract
} = require('../../contracts/ticket-contract');

const tickets = new Map();

function createTicket(input = {}) {
  const ticket = createTicketContract(input);

  if (!ticket.ticket_id) {
    throw new Error('ticket_id is required');
  }

  tickets.set(ticket.ticket_id, ticket);

  return ticket;
}

function getTicket(ticketId) {
  return tickets.get(String(ticketId || '')) || null;
}

function listTickets() {
  return Array.from(tickets.values());
}

function updateTicket(ticketId, updates = {}) {
  const current = getTicket(ticketId);

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

  tickets.set(current.ticket_id, updated);

  return updated;
}

module.exports = {
  createTicket,
  getTicket,
  listTickets,
  updateTicket
};
