'use strict';

const router = require('express').Router();
const pool   = require('../db/pool');

// GET /api/requests — list all (dashboard)
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, owner, risk, dashboard_stage, dashboard_progress, created_at
       FROM requests ORDER BY created_at ASC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/requests/:id — single request with stage progress
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [reqRow, stageRows] = await Promise.all([
      pool.query('SELECT * FROM requests WHERE id = $1', [id]),
      pool.query(
        'SELECT stage_id, status, completed, approved FROM stage_progress WHERE request_id = $1 ORDER BY stage_id',
        [id]
      ),
    ]);
    if (!reqRow.rows.length) return res.status(404).json({ error: 'Request not found' });
    const request = reqRow.rows[0];
    request.stages = {};
    stageRows.rows.forEach(s => { request.stages[s.stage_id] = s; });
    res.json(request);
  } catch (err) { next(err); }
});

// POST /api/requests — create a new request
router.post('/', async (req, res, next) => {
  try {
    const { title, owner, business_goal = '', success_metrics = '', target_quarter = '' } = req.body;
    if (!title || !owner) return res.status(400).json({ error: 'title and owner are required' });

    const { rows } = await pool.query(
      `INSERT INTO requests (title, owner, business_goal, success_metrics, target_quarter)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, owner, business_goal, success_metrics, target_quarter]
    );
    const newId = rows[0].id;

    // Seed stage_progress rows — business unlocked, rest locked
    const stages = [
      { stage: 'business',  status: 'not-started' },
      { stage: 'product',   status: 'locked' },
      { stage: 'tech',      status: 'locked' },
      { stage: 'execution', status: 'locked' },
    ];
    await Promise.all(stages.map(s =>
      pool.query(
        `INSERT INTO stage_progress (request_id, stage_id, status) VALUES ($1, $2, $3)`,
        [newId, s.stage, s.status]
      )
    ));

    // Seed placeholder tickets for new requests
    const placeholderTickets = [
      { op_id: 'OP-001', title: 'Kick off project and align stakeholders',    assignee: '—', status: 'New', sort_order: 1 },
      { op_id: 'OP-002', title: 'Define technical approach and architecture',  assignee: '—', status: 'New', sort_order: 2 },
      { op_id: 'OP-003', title: 'Set up project repository and CI pipeline',   assignee: '—', status: 'New', sort_order: 3 },
      { op_id: 'OP-004', title: 'Draft initial implementation plan',           assignee: '—', status: 'New', sort_order: 4 },
      { op_id: 'OP-005', title: 'Identify risks and mitigation strategies',    assignee: '—', status: 'New', sort_order: 5 },
      { op_id: 'OP-006', title: 'Schedule design review with stakeholders',    assignee: '—', status: 'New', sort_order: 6 },
      { op_id: 'OP-007', title: 'First sprint planning and backlog grooming',  assignee: '—', status: 'New', sort_order: 7 },
      { op_id: 'OP-008', title: 'Begin development of core feature',           assignee: '—', status: 'New', sort_order: 8 },
    ];
    await Promise.all(placeholderTickets.map(t =>
      pool.query(
        `INSERT INTO tickets (request_id, op_id, title, assignee, status, sprint, est_completion, sort_order)
         VALUES ($1, $2, $3, $4, $5, 'Sprint 1 — Q3 2026', 'TBD', $6)`,
        [newId, t.op_id, t.title, t.assignee, t.status, t.sort_order]
      )
    ));

    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PATCH /api/requests/:id — update metadata
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, owner, business_goal, success_metrics, target_quarter, risk, dashboard_stage, dashboard_progress } = req.body;
    const { rows } = await pool.query(
      `UPDATE requests SET
         title               = COALESCE($1, title),
         owner               = COALESCE($2, owner),
         business_goal       = COALESCE($3, business_goal),
         success_metrics     = COALESCE($4, success_metrics),
         target_quarter      = COALESCE($5, target_quarter),
         risk                = COALESCE($6, risk),
         dashboard_stage     = COALESCE($7, dashboard_stage),
         dashboard_progress  = COALESCE($8, dashboard_progress)
       WHERE id = $9 RETURNING *`,
      [title, owner, business_goal, success_metrics, target_quarter, risk, dashboard_stage, dashboard_progress, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Request not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/requests/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM requests WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;
