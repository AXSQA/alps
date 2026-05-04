'use strict';

const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/requests/:id/tickets
router.get('/:id/tickets', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, op_id, title, assignee, status, sprint, est_completion
       FROM tickets WHERE request_id = $1 ORDER BY sort_order ASC`,
      [id]
    );
    // Extract sprint + est_completion from first ticket (shared across a request)
    const sprint        = rows[0]?.sprint        || '';
    const estCompletion = rows[0]?.est_completion || 'TBD';
    res.json({ sprint, estCompletion, tickets: rows });
  } catch (err) { next(err); }
});

module.exports = router;
