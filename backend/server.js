// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3070;

app.use(cors());
app.use(express.json());

// In-memory event log (replace with DB or blockchain integration as needed)
let eventLog = [];

// GET /events - return all events
app.get('/events', (req, res) => {
  res.json(eventLog);
});

// POST /record-event - add a new event
app.post('/record-event', (req, res) => {
  const { location, eventType, dataHash } = req.body;
  if (!location || !eventType || !dataHash) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const event = {
    timestamp: new Date().toISOString(),
    location,
    eventType,
    dataHash
  };
  eventLog.push(event);
  res.status(201).json({ message: 'Event recorded.', event });
});

// Health check
app.get('/', (req, res) => {
  res.send('Sentinel-3 backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
