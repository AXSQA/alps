'use strict';

const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/requests/:id/checklist — all checkbox + note state
router.get('/:id/checklist', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT stage_id, item_id, checked, note
       FROM checklist_state WHERE request_id = $1`,
      [id]
    );
    // Return as nested map: { business: { b1: { checked, note } } }
    const result = {};
    rows.forEach(r => {
      if (!result[r.stage_id]) result[r.stage_id] = {};
      result[r.stage_id][r.item_id] = { checked: r.checked, note: r.note };
    });
    res.json(result);
  } catch (err) { next(err); }
});

// PUT /api/requests/:id/checklist/:stageId/:itemId — upsert a single item
router.put('/:id/checklist/:stageId/:itemId', async (req, res, next) => {
  try {
    const { id, stageId, itemId } = req.params;
    const { checked, note } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO checklist_state (request_id, stage_id, item_id, checked, note, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (request_id, stage_id, item_id)
       DO UPDATE SET
         checked    = EXCLUDED.checked,
         note       = EXCLUDED.note,
         updated_at = now()
       RETURNING *`,
      [id, stageId, itemId, checked ?? false, note ?? '']
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
