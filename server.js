'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const requestsRouter         = require('./routes/requests');
const ticketsRouter          = require('./routes/tickets');
const checklistRouter        = require('./routes/checklist');
const stagesRouter           = require('./routes/stages');
const stageDefinitionsRouter = require('./routes/stageDefinitions');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));   // serves index.html at /

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/requests',          requestsRouter);
app.use('/api/tickets',           ticketsRouter);
app.use('/api/stage-definitions', stageDefinitionsRouter);

// Nested routes — checklist and stages live under /api/requests/:id
app.use('/api/requests',          checklistRouter);
app.use('/api/requests',          stagesRouter);

// ── Global error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ReadyOps API running at http://localhost:${PORT}`);
});
