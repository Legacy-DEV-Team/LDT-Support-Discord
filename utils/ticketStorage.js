const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, 'ticket-data.json');

// Last inn eksisterende tickets fra fil
function loadTickets() {
  try {
    if (!fs.existsSync(storagePath)) {
      fs.writeFileSync(storagePath, '{}');
    }

    const raw = fs.readFileSync(storagePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Could not load tickets:', err);
    return {};
  }
}

// Lagre ticket mapping: threadId -> creatorId
function setTicketCreator(threadId, userId) {
  const data = loadTickets();
  data[threadId] = userId;
  fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
}

// Sjekk om en bruker er oppretter av en gitt ticket
function isCreator(threadId, userId) {
  const data = loadTickets();
  return data[threadId] === userId;
}

module.exports = {
  loadTickets,
  setTicketCreator,
  isCreator
};
