'use strict';

const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/requests/:id/stages — all stage progress for a request
router.get('/:id/stages', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT stage_id, status, completed, approved
       FROM stage_progress WHERE request_id = $1 ORDER BY stage_id`,
      [id]
    );
    const result = {};
    rows.forEach(r => { result[r.stage_id] = r; });
    res.json(result);
  } catch (err) { next(err); }
});

// PATCH /api/requests/:id/stages/:stageId — update status, completed, or approved
router.patch('/:id/stages/:stageId', async (req, res, next) => {
  try {
    const { id, stageId } = req.params;
    const { status, completed, approved } = req.body;
    const { rows } = await pool.query(
      `UPDATE stage_progress SET
         status     = COALESCE($1, status),
         completed  = COALESCE($2, completed),
         approved   = COALESCE($3, approved),
         updated_at = now()
       WHERE request_id = $4 AND stage_id = $5
       RETURNING *`,
      [status, completed, approved, id, stageId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Stage progress record not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
