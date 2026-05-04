'use strict';

const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/stage-definitions — all checklist items grouped by stage
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT stage_id, item_id, label, required
       FROM stage_definitions ORDER BY stage_id, sort_order ASC`
    );
    // Return grouped: { business: [...], product: [...], tech: [...] }
    const result = {};
    rows.forEach(r => {
      if (!result[r.stage_id]) result[r.stage_id] = { label: capitalise(r.stage_id), items: [] };
      result[r.stage_id].items.push({ id: r.item_id, label: r.label, required: r.required });
    });
    res.json(result);
  } catch (err) { next(err); }
});

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;
