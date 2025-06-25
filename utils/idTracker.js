const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ticketCounter.json');

function getNextTicketId() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ lastId: 0 }, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  const nextId = data.lastId + 1;

  fs.writeFileSync(filePath, JSON.stringify({ lastId: nextId }, null, 2));

  return nextId;
}

module.exports = { getNextTicketId };
